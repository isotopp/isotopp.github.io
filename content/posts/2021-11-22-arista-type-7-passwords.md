---
author: isotopp
title: "Arista Type 7 Passwords"
date: 2021-11-21T17:29:00+01:00
feature-img: assets/img/background/schloss.jpg
tags:
- lang_en
- security
- hack
- networking
---

A friend of mine wanted to provision BGP passwords for their Arista switch configuration.

So a config stanza such as

```
router bgp 65001
   router-id 10.1.1.1
   neighbor mydevices peer-group
   neighbor mydevices password 7 8kjYaye5DsQh0epELyKNe0oZ3E3zp39X
```

requires generation of the Password (actually "supersecretpassword") in an encrypted form.

Arista switches can do this using CLI tools, apparently.
They seem to have an onboard Linux, which seems to provide limited tooling, but is good enough to run a 32-bit Python 3.7.
Arista provides modules to help with handling their configuration.
[Ryan Gelobter](https://medium.com/@what_if/encrypting-decrypting-arista-bgp-bmp-ospf-passwords-ff2072460942)
documented these in an article on Medium.

Unfortunately, these modules are not well portable.
They have been implemented in a CPython module for Python 3.7 on i386 (32bit) Linux.
They also have a lot of dependencies to other shared objects that are not easily available except in the switch environment.

So, if you wanted to provision switch configurations, 
you would need to run some code on the switch to generate the passwords the way Ryan Gelobter documents, 
or do the same in a virtual machine with a virtual switch running in it.

```console
switch1# bash python -c 'import DesCrypt;
print DesCrypt.encrypt("BMP1_passwd", "supersecretpassword")'
JieKbldfLyl9IzUBJZRvKIcc1w5wWogI
```

Looking at the `DesCrypt.py` is not particularly helpful:
The code in it does little more than

```python
import _DesCrypt

encryptedData = _DesCrypt.cbcEncrypt(key, data)
```

and `_DesCrypt` is actually `_Descrypt.cpython-37m-i386-linux-gnu.so`.
Well, at least it is only 10 KB in size, so how hard can it be?

Let's have a look:

# Ghidra

When we drop the module into Ghidra, we get to see a `PyInit__DesCrypt(void)` symbol.
The code in that function just calls out to `PyModuleCreate2(&PyModuleDef, 0x3f5)`.

Looking at the `PyModuleDef` requires [the documentation](https://docs.python.org/3/c-api/module.html) to properly understand what is going on.
We identify two functions, `cbcEncrypt` and `cbcDecrypt` by their [`PyMethodDef`](https://docs.python.org/3/c-api/structures.html#c.PyMethodDef) entries.
Two labels for entry points in a stripped binary identified.

![](/uploads/2021/11/arista-pymethoddef.png)

*The Python Method Definition Table for the _DesCrypt Module defines two functions, named `cbcEncrypt` and `cbcDecrypt`.*

Looking at the `cbcEncrypt` function shows us that it has a dependency on `cbc_crypt()`,
and that seems to be a function from `libc`, according to [the manpage](https://linux.die.net/man/3/cbc_crypt).
So it is ancient DES, in CBC mode that is being used.
We should be able to do this in pure Python without many additional dependencies then.

Using Ghidra more, we can decode `cbcEncrypt()` and the `getHashedKey()` function it calls.

`getHashedKey` generates the key the usual way, by xor-ing the incoming string with itself in an 8 bytes long ring buffer, but the starting value is not all zeroes, but some magic value (`238ad5f51ec9a8d5`)

Also, `cbcEncrypt` pads the data to an even 8 byte boundary as required by DES.
How much was padded needs to be embedded in the ciphertext.
There is a selection of standard methods for this, as offered for example by
[Crypto.Util.Padding.pad()](https://pycryptodome.readthedocs.io/en/latest/src/util/util.html#Crypto.Util.Padding.pad)
in pycryptodome ("pkcs7", "iso7816" and "x923").

`cbcEncrypt` uses none of these standard methods, and implements its own method:
the padding is encoded in the high nibble of a fixed magic int.

That magic int is always prepended, even if no padding was necessary:
We get `?ebb884c`, with `?` indicating the number of padbytes (`0` to `7`).

![](/uploads/2021/11/arista-gethashedkey.png)

*Ghidra Output of the getHashedKey() function, with a bit of annotation and typing added to get a better view.*

With this information, we should be able to recreate the function in our own C-code and check if it can recreate the examples Ryan Gelobter provided.

Of course, it does not.

# Debugging the original code

We need to debug, and in order to be able to do that we need to be able to load and isolate `getHashedKey()` first.
The original version, to check what the actual hashed key should look like, and compare the result to our own.

That should be easy: 
An example 
[from 2005]({{< ref "/content/posts/2005-10-08-dynamisch-geladener-code.md" >}})
(german language article) shows

- how to turn a function into a `libsomething.a`, 
- then into `libsomething.so`, and 
- then how to `dlopen()` and `dlsym()` that binary to call a single function in it.

That final piece of code will serve us well:
We want to load the _DesCrypt module and call `getHashedKey()` in an isolated context to see what a correct return value looks like.

# Dependencies

Turns out, loading `_DesCrypt...so` is not so easy, because of a dependency on `libtac.so.0`.

```console
$ ldd _DesCrypt.cpython-37m-i386-linux-gnu.so
        linux-gate.so.1 (0xf7f7c000)
        libtac.so.0 => not found
        libpython3.7m.so.1.0 => not found
        libstdc++.so.6 => /lib32/libstdc++.so.6 (0xf7d81000)
        libm.so.6 => /lib32/libm.so.6 (0xf7c7d000)
        libgcc_s.so.1 => /lib32/libgcc_s.so.1 (0xf7c5e000)
        libc.so.6 => /lib32/libc.so.6 (0xf7a73000)
        /lib/ld-linux.so.2 (0xf7f7e000)```
```

So we are missing two libraries:

- `libpython3.7m.so.1.0` and 
- `libtac.so.0`.

The Python bit is fixed by building a Python-3.7 in 32-bit:

```console
$ apt install gcc-multilib
$ wget https://www.python.org/ftp/python/3.7.5/Python-3.7.5.tgz
$ tar xzf Python-3.7.5.tgz
$ cd Python-3.7.5/
$ ./configure --build=i686-pc-linux-gnu CFLAGS=-m32 CXXFLAGS=-m32 LDFLAGS=-m32 --enable-shared
$ make -j6
```

A minor roadbump: We need to build for 32-bit, but on a 64-bit machine.
The compile-flag `-m32` does that, but it will fail due to some missing includes until we install `gcc-multilib` as shown above.
We can then download the old version of Python, and build it with the required flags for 32-bit support.

The `libtac.so.0` we could copy off the switch.
If we try, things escalate quickly .
That is, because that `.so` in turn loads even more libraries, most of which we don't have access to.
And if we had them, they might load even more dependencies.

Looking into Ghidra again, we know that the code we are interested in does not really depend on `libtac,so.0`.
`cbcEncrypt()` itself does, but only if something goes wrong and an exception is being raised,
but at this stage of our investigation we only want `getHashedKey()`.

Following the guide from 16 years ago, we can quickly write some code to `dlopen()` the library:

```C
...
typedef void (* func_t)(char const *, int, char *);

int main(void) {
    char *key = "mydevices_passwd";
    int   keylen = strlen(key);
    char  data[80] = "supersecretpassword";
 
    func_t f;
    char *error_msg;
    void *libhandle = NULL;
 
    printf("main start\n");
 
    libhandle = dlopen(LIBNAME, RTLD_LAZY);
    if (!libhandle) {
        fprintf(stderr, "dlopen(%s, RTLD_LAZY) failed: %s\n",
            LIBNAME,
            dlerror()
        );
        exit(2);
    }
 
    // find func
    error_msg = dlerror();
    f = dlsym(libhandle, "_Z12getHashedKeyPKciPc");
    error_msg = dlerror();
    if (error_msg) {
        fprintf(stderr, "dlsym(%p, \"getHashedKey\" failed: %s\n",
                libhandle,
                error_msg
        );
        exit(3);
    }
 
    printf("gethashedKey %p\n", f);
 
    f(key, keylen, data);
    dump("key", key, keylen);
    dump("data", data, 80);
    dlclose(libhandle);
 
    return 0;
}
```

# Killing Dependencies

That way we can inspect the output of the function (it overwrites the first 8 bytes of `data`) and get a reference key value to debug against.
Or could, if that would work.
It does not, because the `.so` we open still has listed `libtac.so.0` as `NEEDED` and we need to fix it.

There are many ways to edit ELF binaries, but most are badly maintained.
An easy way is a web service such as [elfy.io](https://elfy.io/).
We upload the library, click `Load information` -> `Loader directives` and edit the first dependency (`libtac.so.0`) (offset 0x270) to point to the second dependency (`libpython3.7m.so.1.0` (offset 0x283) instead.
Downloading the code again, we can rename it to `libtest.so` and load it with our test program from above, getting a reference key value.
So `mydevices_passwd` in a non-broken implementation yields the raw key value of `4A 0E 5D 1A 70 4F 1F 23` for DES.

Having that, debugging can continue.
It turns out: math is hard and Intel is a little-endian architecture:
The seed byte sequence `D5 A8 ... 8A 23` is of course the long `238A…A8D5`.
I am definitively not doing these things often enough anymore to not make this kind of mistake.

# Progress!

Having a working `getHashedKey()` we can now look at `cbcEncrypt()` and reverse that.

![](/uploads/2021/11/arista-cbcencrypt.png)

*The heart of `cbcEncrypt()` fetches two Python `bytearray`, `key` and `data` and works with them. The `key` is processed with `getHashedKey()`, then `cbc_crypt()` is set up and called. The result returned to Python using `Py_BuildValue`.*

The moment we try to build this in C, it proves frustrating again:
`cbc_crypt()` is no longer part of `libc`.
It is outdated, legacy, but unfortunately still in use. 
Not only by Arista, but also other companies and protocols.
Among them some ancient RPC protocols.
It has been removed from `libc` and moved to `libtirpc3`, it seems.
We need to install `libtirpc3`, `libtirpc-dev` and `libtirpc-common` to be able to build code that calls `cbc_crypt()`.
Even then we seem to be limited to static linking, because for some reason the shared objects do no longer export the symbol.

Some more short short hiccups:

- The padding value is a nibble, not a byte, and the long it is part of has to be little endian naturally.
- The padding needs itself to take the 4 bytes added by the padding itself into account.

In the end we get code that reproduces the expected result.

# In Python

If, and that is important, `des_parity()` is being called.
In Python that function is not available, and should not be necessary:
The legacy DES function in Python's module supposedly ignores DES parity bits automatically.

But the Python code produces a different result.
So what goes on here, and how do we get `des_parity()`?

Turns out, `des_parity()` is really weird code: 
Look at it [here](https://github.com/alisw/libtirpc/blob/master/src/des_soft.c#L33-L50).
It is supposed to make the 8 bytes of the DES code uneven parity by manipulating the low-value bits in the key.
But the actual code also effectively masks out the high order bit, so we do not get 56 bit of keyspace, but only 48 bit.
Yay, export crypto?

Anyway, this is the code Arista runs for their key obfuscation, so we need to duplicate it to produce correct data.

[Here](https://github.com/isotopp/arista_type_7/blob/main/pypoc.py) is a PoC in Python.

With the poc provided, it should be possible to

```python
from arista_descrypt import cbc_encrypt, cbc_decrypt

encrypted = cbc_encrypt(b'mydevices_passwd', b'supersecretpassword')
print(encrypted)
```

and that should be sufficient to build an Ansible module for Arista config provisioning.
The code uses `cryptography` or `pycryptodome` automatically, one of the two is installed.
It is not dependent on the legacy `cbc_crypt()` function that formerly was in `libc`.

# Generating passphrases

Encrypting and decrypting BGP passwords requires a passphrase. In EOS,
this passphrase is not static, but depends on the neighbor where the
BGP password is configured.

```
router bgp 65001
   router-id 10.1.1.1
   neighbor mydevices peer-group
   neighbor mydevices password 7 8kjYaye5DsQh0epELyKNe0oZ3E3zp39X
```

The passphrase is generated by taking the string after `neighbor` (in this
example `mydevices`), and appending the string `_passwd` to it. The string
can be the name of a peer group, an IPv4 address or an IPv6 address, and
has to be used as shown in the device configuration output. This is particularly
important for IPv6 addresses which have multiple forms of representation.
