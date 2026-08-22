---
author: isotopp
date: "2026-08-22T03:04:05Z"
feature-img: assets/img/background/schloss.jpg
title: "Reading the ski SSH certificate issuer"
toc: true
tags:
  - lang_en
  - python
  - ssh
  - security
  - erklaerbaer
---

`ski` is a small SSH certificate issuer. A user logs in to it, completes a
password-and-TOTP exchange, and receives a new Ed25519 keypair plus a signed
OpenSSH user certificate in their forwarded `ssh-agent`.

The code does not implement its own crypto or mechanism.
It uses existing facilities of the OpenSSH protocol stack,
and the proven `AsyncSSH` python library.

We will look at the code in detail in a few critical places:
load a CA safely, authenticate an identity, 
turn its groups into principals, sign a new key, then inject the
result into the agent. 

[The previous article]({{< relref
"2026-08-22-server-key-injection-demonstrator" >}}) demonstrates
how to operate the thing and what that looks like. 
This one is a code tour.

## CA

`ski ca init` enters through `initialize_ca()` in
[`src/ski/ca_commands.py`](https://github.com/isotopp/server-key-injection/blob/main/src/ski/ca_commands.py).
It delegates file creation to `CAFileWriter`, then records the public key,
fingerprint, and active state in SQLite.

The key generation itself is plain
AsyncSSH:

```python {linenos=table,hl_lines=[3,"12-16"],linenostart=207}
def _generate(self) -> GeneratedCAMaterial:
    try:
        key = self._key_generator()
        if key.get_algorithm() != "ssh-ed25519":
            raise CAFileError("CA algorithm is unsupported")
        private_bytes = key.export_private_key()
        public_bytes = key.export_public_key()
    except CAFileError:
        raise
    except Exception as exc:
        raise CAFileError("CA key generation failed") from exc
    return GeneratedCAMaterial(
        private_key=key,
        private_bytes=private_bytes,
        public_bytes=public_bytes,
        fingerprint=key.get_fingerprint(),
    )
```

`CAFileWriter.install()` writes private, public, and KRL files via temporary
files and atomic renames. At startup, `load_validated_active_ca()` in
[`src/ski/ca.py`](https://github.com/isotopp/server-key-injection/blob/main/src/ski/ca.py)
checks ownership and modes, imports both key files, checks that they match,
then checks them against the active CA database record. Only then does the
runtime receive a `ValidatedActiveCA` containing an AsyncSSH private-key
object capable of signing.

That last point matters: most of the issuer sees a validated object, not a
path to a magic key file.

## SSH authentication

AsyncSSH provides the SSH server framework. `IssuerServer.start()` creates an
AsyncSSH listener with `agent_forwarding=True`; `_IssuerSSHServer` implements
the server-side authentication callbacks. It offers exactly one
keyboard-interactive exchange with a password and a TOTP prompt.

After receiving the answers, `validate_kbdint_response()` does the meaningful
work:

```python {linenos=table,hl_lines=[3,7,"16-18"],linenostart=140}
try:
    canonical_username = self._identity_store.lookup_identity(username)
    password_ok = self._identity_store.verify_password(
        canonical_username,
        responses[0],
    )
    totp_ok = self._identity_store.verify_totp(
        canonical_username,
        responses[1],
        now=int(self._clock()),
    )
    if not password_ok or not totp_ok:
        if self._connection is not None:
            self._connection.abort()
        return False
    self._authenticated_identity = self._identity_store.get_group_snapshot(
        canonical_username,
    )
    return True
```

The server canonicalizes the username from the SSH banner and input by
looking it up in the identity store.
It then verifies both the password and TOTP factor.
The group set assigned to the user is captured as a group snapshot.
This becomes the input to issuance, that is, the creation key and cert.

We do, in theory, support pluggable identification backends,
and provide only one demo backend using an SQLite database.
How that works is discussed below, the important functions being called
are available in `identities.py:368`, `verify_password()` and
`identities.py:402`, `verify_totp()`.
We are using `pyotp` for this job:

```python {linenos=table,hl_lines=[6,10],linenostart=402}
    def verify_totp(self, username: str, code: str, *, now: int | None = None) -> bool:
        try:
            record = self.get_user(username)
            if not record.enabled or not isinstance(code, str):
                return False
            totp = pyotp.TOTP(record.totp_secret)
            if self._totp_verifier is not None:
                return bool(self._totp_verifier(totp, code, now=now))
            for_time = None if now is None else datetime.fromtimestamp(now, tz=UTC)
            return bool(totp.verify(code, valid_window=1, for_time=for_time))
        except (IdentityStoreError, ValueError, TypeError):
            return False
```

In order to succeed, we do need a session with agent-forwarding to be able to inject the generated cert.
That is why the session implementation, `_IssuerSession._run_request()` in
[`src/ski/server.py`](https://github.com/isotopp/server-key-injection/blob/main/src/ski/server.py),
also rejects the request if AsyncSSH reports no forwarded agent path.
No point in running an issuance with no delivery channel.

## Identity abstraction

The SSH server depends on this deliberately small protocol, not on SQLite:

```python {linenos=table,hl_lines=[1,"2-4"],linenostart=123}
class IssuerIdentityProvider(
    IdentityAuthenticator,
    CanonicalIdentityLookup,
    GroupSnapshotProvider,
    Protocol,
):
    """Combined narrow read-only capability required by the SSH issuer."""
```

The three parent protocols are the contract: canonical lookup, verification of
the two existing factors, and a current group snapshot. It is a good boundary
for a production adapter backed by LDAP, Active Directory, Keycloak, Okta, or
another organisation-specific identity service and contains no write-operations.

The current demonstrator does not use any of that so it can be self-contained.
`ServiceRuntime.start()` constructs `SqliteIdentityStore` directly.
Its `get_group_snapshot()` reads the local record, rejects disabled users,
and returns the username plus groups. The `ski user` and `ski group` 
commands exist to administer that demo backend. 
They should not be part of a production issuer: identity and group management
belongs in the upstream identity system, and the issuer should be read-only
with respect to it.

## Principal construction

The certificate receives a structured identity record.

`build_principals()` in
[`src/ski/policy.py`](https://github.com/isotopp/server-key-injection/blob/main/src/ski/policy.py)
accepts only canonical values and produces a compact, predictable principal
set:

```python {linenos=table,hl_lines=[3,"4-5"],linenostart=47}
def build_principals(username: object, groups: Sequence[object]) -> tuple[str, ...]:
    """Build the canonical user and group principals for one identity."""
    canonical_username = validate_username(username)
    canonical_groups = tuple(validate_group_name(group) for group in groups)
    principals = (canonical_username, *(f"group:{group}" for group in canonical_groups))
    return validate_principals(principals)
```

For `kris` in `prod`, this produces `("kris", "group:prod")`. The first
principal can support self-login policy; subsequent `group:` principals let a
target host make local group-based authorization decisions. The grammar and
duplicate checks prevent principals from becoming an accidental free-form
authorization language.

## Signing

`OrdinaryCertificateFactory.issue()` in
[`src/ski/credentials.py`](https://github.com/isotopp/server-key-injection/blob/main/src/ski/credentials.py)
is the centre of the issuer. It allocates a random 64-bit serial, sets the
fixed 25-hour validity window, creates a fresh user key, and invokes the CA
private key:

```python {linenos=table,hl_lines=[5,"9-12","17-31"],linenostart=88}
serial = self._serial_allocator()
if not isinstance(serial, int) or not 0 <= serial < 2**64:
    raise StateError("certificate serial is malformed")
valid_after = int(self._clock())
valid_before = valid_after + ORDINARY_CERTIFICATE_LIFETIME
comment = (
    f"ski:{identity.username}:{self._active_ca.record.fingerprint}:{serial}"
)
private_key = asyncssh.generate_private_key(
    "ssh-ed25519",
    comment=comment,
)
flags = {
    flag: extension in self._extensions
    for extension, flag in ORDINARY_EXTENSION_FLAGS.items()
}
certificate = self._active_ca.private_key.generate_user_certificate(
    private_key,
    identity.username,
    serial=serial,
    principals=principals,
    valid_after=valid_after,
    valid_before=valid_before,
    permit_x11_forwarding=flags["permit_x11_forwarding"],
    permit_agent_forwarding=flags["permit_agent_forwarding"],
    permit_port_forwarding=flags["permit_port_forwarding"],
    permit_pty=flags["permit_pty"],
    permit_user_rc=flags["permit_user_rc"],
    touch_required=True,
    comment=comment,
)
```

Again, we make use of AsyncSSH library functions for certficiate handling: `generate_user_certificate()
` does the OpenSSH certificate signing.
Its first argument is the new user key, it contains both the private and public bytes;
AsyncSSH uses only the public half.
The remaining arguments become the certificate's claims and restrictions.
The configured extensions are converted into explicit OpenSSH permit flags instead of being copied as arbitrary text.

`OrdinaryIssuanceService.commit()` persists only safe issuance evidence:
serial, identity, public-key fingerprint, principals, validity period, and
request ID. 

It does not persist the ephemeral private key.

## Injection

Signing has produced Python objects; it has not yet delivered anything to the
user. `OrdinaryAgentInjector.handle()` connects to the agent forwarded by the
current AsyncSSH server connection, removes only an earlier credential it can
recognize as its own, and then loads the new pair:

```python {linenos=table,hl_lines=[2,"7-10","14-18","22-26"],linenostart=190}
async with self._agent_factory(connection, self._active_ca) as agent:
    owned = await agent.owned_keys(identity)
    removed_owned = False
    credential: OrdinaryIdentity | None = None
    try:
        for _ in range(5):
            credential = self._issuance.prepare(identity)
            lifetime = max(
                1,
                credential.valid_before - int(self._clock()),
            )
            if owned and not removed_owned:
                await agent.remove_keys(owned)
                removed_owned = True
            await agent.add_credential(credential, lifetime=lifetime)
            try:
                record = self._issuance.commit(
                    credential,
                    request_id=request_id,
                )
            except DuplicateCertificateSerialError:
                cleanup = await agent.remove_credential(credential)
                if not cleanup.complete:
                    raise StateError("credential cleanup failed")
                continue
            return OrdinaryInjectionResult(
                credential=credential,
                record=record,
                groups=identity.groups,
            )
```

The adapter behind `agent` uses `asyncssh.connect_agent(connection)`. AsyncSSH
opens the forwarded-agent connection and speaks the OpenSSH agent protocol;
the application code works with keys and certificates instead of framing
agent-protocol messages itself.

The ordering is worth noticing. The new credential is first added with a
lifetime no later than certificate expiry, then durable issuance evidence is
committed. A duplicate serial triggers targeted agent cleanup and a retry;
other failures also attempt cleanup. That is the small but important piece
which prevents an in-memory credential from silently surviving a failed
issuance transaction.

The whole issuer is therefore ordinary Python around a few AsyncSSH boundary
calls: generate a private key, sign a user certificate, operate the forwarded
agent. The surrounding code establishes what those calls are allowed to mean.
