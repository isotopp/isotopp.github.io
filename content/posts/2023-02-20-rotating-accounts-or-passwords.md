---
author: isotopp
title: "Rotating Accounts or Passwords?"
date: 2023-02-20T12:13:14Z
feature-img: assets/img/background/schloss.jpg
tags:
- lang_en
- devops
- security
---

Some applications allow you to have multiple passwords.
For example, in [MySQL, since 8.0.14 you can dual passwords for an account](https://dev.mysql.com/doc/refman/8.0/en/password-management.html#dual-passwords).
Also, [Redis 6 allows you to have multiple passwords on an account ACL](https://redis.io/docs/management/security/acl/#create-and-edit-user-acls-with-the-acl-setuser-command).

# Personal Accounts and Machine Accounts.

When running services in a production system, the services sometimes have personal accounts (PAs) that allow humans to login and perform actions on the service.
Often, these accounts are very limited in number (in production), and privileged.

Also, you have clients connecting to the system.
These are called Non-Personal Accounts, Machine Accounts or Service Accounts (MA) in many environments.
Machine Accounts are not used by humans, but are a set of credentials used by a client applications to work with a service.

It is good practice to assign a different MA to each application using a service,  and to rotate credentials regularly and quickly for each MA.
In many environments doing this is even a compliance requirement.

# Different Usernames are helpful

Assigning different identities (different usernames) to different applications is useful in many ways:

- Access permissions are tied to identities, so different identities are a requirement to separate different sets of permissions. 
- Also, different identities allow you to attribute activity in the service to the identity, thus make monitoring, auditing and accounting possible.
  It is much easier to identify a misbehaving application, if all applications using your service have different user account names.

# Dynamically assigned credentials

Very often credentials are not stored at all in the client configuration, but are requested dynamically on-demand from another service, the Secrets Manager or Vault.
It is either part of a cloud control plane, and can leverage trust from the cloud infrastructure to know who is who and what to allow,
or it is an external service such as a Hashicorp Vault.

In any case, the application would not store Database or Redis username and passwords in configuration files any more,
but ask the secrets manager to provide these credentials at runtime, receive them, and then store them only in memory.
They would also be expired and re-requested in regular intervals, on a multiple-minutes to hour scale.

This allows the Secrets Manager to perform account operations, such as password or account rotation.

# Account Rotation or Password Rotation?

Rotating MA passwords is often a requirement, and most environments also require a comparatively high rotation frequency ("once per week", which qualifies as "high" in database timescales).

Some services, such as MySQL and Redis given as examples above, allow you to associate multiple password with a single account.
Many others do not, in them username ("identity") and password ("authentication") are a 2-tuple.

Rotating passwords, when taken literally, is hard with such services, because changing the password atomically in the server and all its clients is impossible.
There is always some overlap during which the service already has the new password (and implicitly invalidated the old password),
while the clients are still using the old password.
If you rotated the password with traditional methods, there would be a discrepancy between clients and servers in password knowledge, and thus failed logins.

One way around that is provisioning new MA accounts for an application, and then feeding the applications not only new passwords, but completely new credentials.
Thus, 

- an application `androidapp` would see the old user `androidapp_23ad63` with a generated password `BBLA32Tm9feoAGpN`,
- then account rotation would additionally create `androidapp_8760d3` with the password `cts6Me5c7T4q6Dq2` and the same authorizations in the service,
- then the account rotation would test that this newly creates account works as desired,
- then the account rotation would stop handing out the old credentials (`23ad63`) to clients, and start serving the new credentials (`8760d3`),
- then the account rotation would over the course of an hour observe the old account not being used anymore, and the new account picking up traffic,
  - then the account rotation would see the old `23ad63` account being silent for two hours, and eventually lock and deprovision it
  - or this does not work as expected, and `23ad63` stays active past the deadline, in which case we raise an alarm. 

## Why no observability?

Account rotation has some advantages over password rotation:
First: it works with any application, even those that have no support for multiple passwords.
Lack of multiple password support is stopping no-one from implementing rotation, it is just account and not password rotation you need to build.

Then:
Even in MySQL and Redis it was not immediately obvious to me how password rotation can be validated to function correctly.
That is, I have been unable to find a way to isolate instances of logins using the "non-primary" (or old) password, and somehow make sure that all logins in the last hour or so have been using the newly updated password.

> As an engineer running the application, I would want to make sure that the old password is unused before I ask the service to deprovision it.

But observability on this seems to be completely non-existent.
Which is weird, because any security engineer will tell you that a control is only valid, if you can verify it is working as intended.

With account rotation, usage of old accounts is immediately visible.
The system can check if the old account is still being used, and once it isn't anymore, it can deprovision it.
If the old account does not go silent within some timeout, we can alert on this, identity the team responsible for the application, and sit down to talk about credential caching.

Thus, I would rate the implementation of any password rotation feature that does not have good observability built in as incomplete.

## An authorization problem

Conversely, while account rotation has automatically good observability, it complicates authorisation.
Authorisation is the set of permissions ties to an identity, the `GRANT`s in SQL-lingo.

If you rotate accounts. you are essentially creating new accounts and drop old accounts on a schedule.
That means

- either store the authorization outside the system 
- or you can leverage a role system.

In the latter case, you would create a role `androidapp`, and assign it the authorizations, then make sure all `androidapp%` accounts are members of the role, inheriting the role authorizations with no individual per-account rules.

Most, but not all systems have a role-system for accounts similar to MySQL 8 roles, in which you assign authorizations to groups instead of individual accounts.
If you have it, implementing account rotation without complicating authorization is comparatively easy.

# Summary

- Having a secrets manager that hands out secrets to services and clients is useful, because it allows you to prevent materialization of secrets.
  - One of the primary features of clouds (private and public) would be that the control-plane of the cloud can attest identity of instances, and would allow you to solve authentication trivially.
    Sadly, Openstack and all Openstack derives private and public clouds seem to not implement that (and thus offer no IAM to services based on control-plane trust).
  - For those where the cloud control-plane does not offer IAM, Hashivault can help out a lot.
- Some applications have the ability to have multiple passwords per identity, to allow easier password rotation.
  - The value of that feature is greatly diminished by a lack of observability. Any control is only complete if it can be verified to work. 
    We need to be able to see if old deprecated passwords are unused in order to safely deprovision them.
- Even without multiple passwords, we can always leverage a secrets manager and some relatively simple external driver to rotate accounts instead.
  - This is complicated by the fact that many applications bind authorizations (access permissions) to identities (usernames).
  - We can use roles to work around that, and assign authorizations to these roles, then have the identity inherit from the role.
- Implementing either account rotation or password rotation still requires additional work: an external driver, safeguards, monitoring and alerting, plus an update of the documentation.
  In neither case you will be done by simply turning on a feature.
