---
layout: post
status: publish
published: true
title: Command line access to the Mac keychain
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: '2017-01-26 20:34:42 +0100'
tags:
- erklaerbaer
- macos
- apple
---
I am getting my payslips in electronic form, as an encrypted, password
protected PDF. It's not a super secret password, and the encryption is more
against accidentally opening the file than it is to keep the content of the
file actually secret. 

After shipping the PDF home, I am archiving it for tax purposes, but in
order to make the archival safe, I am storing the original file as well as
the decrypted cleartext version of it. To do that, I wrote a shell script,
which contained the password in a variable in clear.

Discussing that at work had a few people rejecting the storage of keys in a
script in clear as a matter of principle, and the suggestion was to use the
operating system key management service to hold this kind of data.

Here is how to interact with the key management of MacOS.

## Creating a generic password "payslip" in my login keychain

The command line utility to interact with the Keychain in MacOS is "security". 

```console
$ security add-generic-password -a $LOGNAME -s payslip -w keks 
``` 

This will create a generic password titled "payslip" in my default keychain,
in my account, and the password is "keks". If you run "Keychain Access.app"
and check out the content of the keychain, it looks like this: 

![](/uploads/2017/01/Bildschirmfoto-2017-01-26-um-20.13.38.png)

The generic password "payslip" has been created.

You can set the content of the "Name:" field differently, use the -l (label)
option to do that. You can also add content to the "Comments:" field with
the -j option.

## Access Control

If you want to see the password, you can always hit the "Show password:"
field. You will be prompted for your login keychains password (which may or
may not be the login password for your computer). By hitting "Always Allow"
you will also add "Keychain Access" as a program to access this information
without password. 

![](/uploads/2017/01/Bildschirmfoto-2017-01-26-um-20.20.16.png)

Trying to see the actual password triggers an authentication
dialog.

Switching from the "Attributes" tab to the "Access Control tab shows us
which programs can always access the password (without a Dialog). It looks
like this:

![](/uploads/2017/01/Bildschirmfoto-2017-01-26-um-20.21.51.png)

Creating the generic password with "security", the program gives itself free
access to the data.

You might see fewer (none) or more programs in this list:

- By default, "security", which created the password, adds itself to the access control list.
- If you do not want "security" adding itself to the list, set "-T" empty to prevent itself from adding: 
```console
$ security add-generic-password -T "" -a $LOGNAME -s payslip -w keks
``` 
- Had you hit "Always Allow" instead of "Allow" in the "Show password:"
  dialog, "Keychain Access" would have had itself added as well.

## Getting the password back

Here is how to get the password back: 

```console
$ security find-generic-password -w -a $LOGNAME -s payslip
```

If you did not allow "security" to include itself, you will see a permission
prompt on the desktop:

![](/uploads/2017/01/Bildschirmfoto-2017-01-26-um-20.28.30.png)

You will see this prompt if "security" created the generic password with -T
"", preventing it from adding itself to the access control list.

Both cases, searching for a password not present or the user hitting "Deny"
will have the command return with an empty password. The "password not
present" case will additionally write an error message to stderr, but
unfortunately not set an exit code properly.

```console
$ password=$( security find-generic-password -w -a $LOGNAME -s payslip ) $ echo $password keks
```

## Deleting a password<br />

Just for closure and cleanup: 

```console
$ security delete-generic-password -a $LOGNAME -s payslip
```
