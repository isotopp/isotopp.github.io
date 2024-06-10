---
author: isotopp
title: "Beyond rwx: Linux permissions"
date: "2024-05-31T05:06:07Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
- lang_en
- linux
- erklaerbaer
- filesystems
---

I wrote this article before, in 1996, in german:
[rwx–sonst nix?]({{< relref "/1996-03-01-rwx-sonst-nix.md" >}}),
and in 2005, in german:
[User und Gruppen, Prozesse und Dateien]({{< relref "/2005-11-01-user-und-gruppen-prozesse-und-dateien.md" >}}).
This is not a translation because some things changed. 

A file in Linux has three permissions, `rwx`,
which are applied to three categories, the owner, their group and everyone else.
To read a file you need `r` permission, to write it you need `w`, and to run it `x`.

That's it, right?

![](/uploads/2024/06/opening-files-01.jpg)

*A developer opening a file. (ChatGPT)*

# You do not open files

Most people say "I'm reading this file" or "I'm opening this file for writing" without thinking much about it.
But in fact, nobody in the history of Unix has ever opened or deleted a file.

"You" as a person are being represented in Linux as a user.
You have a username, which is translated on login into a UID, a number.
In the language of identity and access management, this number is "a principal,"
a token that represents your identity in the system for permission management.

This token is assigned to initially one single process that can perform actions on the system on your behalf.
The process can also create more processes with 
[fork and exec]({{< relref "/2020-12-28-fork-exec-wait-and-exit.md" >}}), which inherit the UID.

So, strictly speaking, you do not open files.

> A Linux process with your UID tries to open files on your behalf,
> and if it succeeds, gains access to a file descriptor (fd) that allows this process to perform actions on that file.

and

> Access control, the checking if a process is allowed to do things, happens only on file open.

File descriptors can also be passed along between processes.

> As long as that fd is kept open, the file exists,
> and any process having access to that fd can do the operations on that fd that it allows.

That has a lot of implications.

For example, it is possible to delete all names of a file, and still use it – as long as any process has a fd open,
the file exists (even when it has no name).
Disk space is not freed.
The file descriptor can be used to give the file a name again (in Linux, with `linkat(2)` and the `/proc` file system).

That is, for example,
while programs such as `logrotate` have to send a `SIGHUP` signal to syslog after rotating logfiles.
Syslog then closes and reopens all file descriptors, ensuring that the logs go into new, not deleted files.

That is also why programs such as `lsof` sometimes list files with no name, marked as `(DELETED)`.

# How do you get a file descriptor?

The answer used to be "with the `open(2)` syscall, of course."

But running `strace` on a modern Linux you will see that it is `openat(2)` now.
This call is a generalization of `open()`, and `open(3)` could be a library function that calls `openat(2)`,
but for compatibility and ABI stability, `open(2)` still exists in parallel.

> In old Unix, 40 years ago, the system manual had chapters.
> Chapter 1 was user commands,
> chapter 8 was sysadmin commands, 
> chapter 2 was syscalls (kernel functions),
> and chapter 3 was library functions.
> By looking at the chapter number to a manual page reference, 
> you could see if a thing was a native kernel call from chapter 2.
> A library function from chapter 3 would internally use a different kernel function to perform its action.
> 
> Kernel functions are wrapped in library functions for convenience,
> which are then wrapped in command line programs to make them available from the shell.

# What can a `fd` do?

The Linux manpage for the `openat(2)` syscall lists a number of flags for the syscall, all starting with `O_`.
Using these flags, a process declares what it intends to be able to do with the file.
On checking the intent against the permissions that a file has, 
the kernel decides to grant access.
This is done by handing out a file descriptor.
If access is not granted, an error is returned instead.

An error from insufficient permissions usually is an `EPERM` (error code 13),
but Linux has become complicated.
`EPERM` may also come from other subsystems (such as AppArmor or SELinux),
and there may be other error codes that ultimately have permissions as a root cause.

In any case, here is what a process can declare that it wants to do with a file:

In traditional Unix, there were three basic flags.

O_RDONLY
: The fd is to be used read-only.

O_WRONLY
: The fd is to be used write-only.

O_RDWR
: The fd is to be used for reading and writing.


O_PATH
: Since Linux 2.6.39, there is also `O_PATH`:
the fd is to be used for reference only.
Reading or writing will fail with `EBADF`, as will any operations that modify metadata such as `fchown(2)`.
But you can use it as a base to open other files with `openat(2)`, 
as a base to try to execute a file (if you have `x` on that file),
and for a few other operations documented in the `openat(2)` manual page.

These basic flags can be "or"ed together with additional flags that modify the behavior of the file open operation.

The most important ones are `O_CREAT` ("make me a new file, if it does not exist when I try to open it"),
and `O_EXCL` ("fail if that file already exists, when I try to open it with `O_WRONLY|O_CREAT`,
to make sure it is actually a new file").

# Permission checks

"Authorization" schemes in computer systems take your principal (that UID)
and determine what you can do with it, by performing operations on other system objects.
This can be written as simple "three-word sentences" in subject-predicate-object form,
or [RDF triples](https://en.wikipedia.org/wiki/Semantic_triple):

- "Kris" "can read and write" "/home/kris/notes.txt"
- "Kris" "can read" "/etc/passwd"

For storage, we need to cut these triples along the subject axis or the object axis.
That is, we either store with each file which user can do things with the file,
or we store with each user what files that user can work on. 

Storing the data in the object yields a **permission system** as we have in Unix:
Each file contains a record (the inode and the access control list records)
that lists which users can do what with this file.

It is also possible to store this data with the user.
Storing authorizations with the user generates a **capability system**.

AppArmor is an example for a capability-based system to limit what file accesses and system calls a process
is allowed to do. 

![](/uploads/2024/06/opening-files-04.png)

*Slicing RDF triples with authorizations by object,
creating a permission system, or by subject, creating a capability system.*

Normal processes are subject to these access control checks:

- To be able to execute `open("./somefile.txt", O_RDONLY)` on a file, a process needs `r`-permission on that file.
- To be able to execute `open("./somefile.txt", O_WRONLY)` on a file, a process needs `w`-permission on that file.
- To be able to execute `open("./somefile.txt", O_RDWR)` on a file, a process needs both `r` and `w`-permission on that file.
- To be able to run a variant of the `exec(2)` syscall on a file, a process needs `x`-permission on that file.

# Where do we get permissions from?

Okay, what have we learned?

- Users, the people, are being represented in the system as principals, UIDs.
- These UIDs are being held by processes, which execute system calls.
- Certain system calls normally perform permission checks, and if they succeed, they do work for us.
- If the UID is associated with certain capabilities, these permission checks are bypassed, and they "always work"
  (They can still fail, but not for permission reasons).

Users without special capabilities are subject to permission checks.
Permissions are stored with the objects, the files being operated on.

So where exactly are permissions stored, and how can we see them?

```console
kris@server:~$ ls -l somefile.txt
-rw-rw-r--+ 1 kris kris 0 Jun  7 06:15 somefile.txt
kris@server:~$ ls -ln somefile.txt
-rw-rw-r--+ 1 1000 1000 0 Jun  7 06:15 somefile.txt

kris@server:~$ id
uid=1000(kris) gid=1000(kris) 
  groups=1000(kris),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),122(lpadmin),134(lxd),135(sambashare),143(docker)
```

The Linux command `ls -l` shows us a file, and some file metadata in a concise single line form.
The first block, `-rw-rw-r--+` shows us the file permissions, followed by the link count (the number of names the file has),
followed by the files owner (kris) and the files group (also kris).
Using the `-n` flag, we get the UID and GID numbers unresolved, instead of the names of the user and group.

The permission bits `rwx` are shown three times, with the letter if set, and with a `-` if not.
The first three permissions are the user permissions,
the next three are the group permissions, and the final three are the other permissions.

The `id` command shows us the UID and the GIDs of our process (one of the GIDs is a primary GID for that process).

### Standard Unix File Access Checks

In traditional Unix, the logic was as follows:

1. Do the file UID and the process UID match? If yes, use the user permissions.
   In our example, the UID 1000 on the file and the UID 1000 from `id` match, so this is what is being used.
2. Do the file GID and any of the GIDs from the process GID set match? If yes, use the group permissions.
   In our example, the file GID is 1000, and the process GID set is 1000, 4, 24, 27, 30, 46, 122, 134, 135 and 143.
   Any user being in any of these groups gets to use the second set of permission bits.
3. All other users get to use the other permissions.

![](/uploads/2024/06/opening-files-02.png)

***A different example:** A process wants to open a file. The UID does not match, the GID does match. Group permissions are granted.*

### Linux File Access Checks with ACLs

In modern Linux, this is still the case, **but** we get to define optional, additional permission sets.
If they are present, a trailing `+` is shown, as is in our example file.

We can read these additional permission with `getfacl` and set them with `setfacl`.
A "facl" is a *file access control list*.

We are reading the files facl with `getfacl`:
```console
kris@server:~$ getfacl ./somefile.txt
# file: somefile.txt
# owner: kris
# group: kris
user::rw-
user:sammy:r--
group::rw-
mask::rw-
other::r--
```
We get to see the standard three entries as `user`, `group` and `other`.
We also get to see a mask, which we have not mentioned yet, and which can be used to set maximum allowed permissions.
And we get to see a named entry, for a `user` named `sammy` which has only `r` permissions.

The ACL check is done as step 1b.
It is performed after the UID check, and before the GID check.

1b. For each named ACL entry:  

Is this a `user` ACL?
If so, does the UID in the ACL match the UID from the process?
If so, use the permission `rwx` triplet from this ACL entry.

Is this a `group` ACL?
If so, does the GID in the ACL match any GID from the processes HID set?
If so, use the permission `rwx` triplet from this ACL entry.

Because this is done as 1b, it happens before the GID check in step 2.

```console
sammy@server:/home/kris$ getfacl ./somefile.txt
# file: somefile.txt
# owner: kris
# group: kris
user::rw-
user:sammy:r--
group::rw-
mask::rw-
other::r--

sammy@server:/home/kris$ id
uid=1002(sammy) gid=1000(kris) groups=1000(kris)

sammy@server:/home/kris$ ls -l ./somefile.txt
-rw-rw-r--+ 1 kris kris 0 jun  7 06:33 ./somefile.txt

sammy@server:/home/kris$ > ./somefile.txt
-bash: ./somefile.txt: Permission denied
```

With the `getfacl` output we can see that a special named entry for `user:sammy` exists.
This entry grants only `r`.

Sammy is also member of the group `kris (1000)`, so the file GID and the process GID match (both are 1000, kris).
Because of this group membership, the group permissions `rw-` should be applied. 

But because the named entry for sammy is checked before the GID entry, and matches,
sammy is only granted `r--` permission on this file.
Trying to write to the file with `> ./somefile.txt` fails.

# Pathnames

In Unix, directories have permissions, too.

For files, having `r` means you can read the file, having `w` means you can write to the file,
and having `x` means you can execute the file.

For directories, the same bits exist, but mean subtly different things:

- `r` on a directory allows you to run `readdir` on the directory. You can see the filenames in the directory.
- `w` on a directory allows you to modify directory names in the directory. You can remove or add filenames in the directory.
- `x` on a directory means you can resolve names of files in this directory.

Wait, what? Let's have a more detailed look at that.

But first:
Permissions are being checked according to the pathname.

So if you write a pathname such as `./somefile.txt` (or `somefile.txt`, which is exactly the same), this is
- the permission check of the current directory, `.`
- the permission check of the file `somefile.txt` in that directory.

If you write `../../bin/ls`, this is

```console
kris@server:~$ pwd
/home/kris
kris@server:~$ ls -l ../../bin/ls
-rwxr-xr-x 1 root root 138216 Feb  8 04:46 ../../bin/ls
```

- the permission check for `..` (traversing `/home`)
- the permission check for `..` (traversing `/`)
- the permission check for `bin` (traversing `/bin`)
- the permission check for the file `ls`

> Or, in other words,
> a file's effective permission is the sequence of permissions along the path plus the permission on the file,
> individual permissions and file access control lists and all.

But if you write `/bin/ls`, this is

- the permission check for `/`,
- the permission check for `/bin`
- and the permission check for the file `ls`

and that is a subtly different set of permissions,
because it is a different path to the same file, but we check along the path.

Now, let's look at directory permissions in detail:

## Directory `r` permission (but no `x`)

Let's create a directory and a file in that directory:

```console
kris@server:~$ mkdir cookie
kris@server:~$ echo schokokeks >  cookie/choc
kris@server:~$ ls -ld cookie cookie/choc
drwxrwxr-x 2 kris kris  3 Jun  7 06:57 cookie
-rw-rw-r-- 1 kris kris 11 Jun  7 06:58 cookie/choc
```

Now let's remove the `x` permission from the directory.

```console
kris@server:~$ chmod a-x cookie/
```

I have no `x`, and that means I cannot get to any of these files:

```console
kris@server:~$ ls -ld cookie/
drw-rw-r-- 2 kris kris 3 Jun  7 06:57 cookie/
kris@server:~$ ls -l cookie/choc
ls: cannot access 'cookie/choc': Permission denied
kris@server:~$ cat cookie/choc
cat: cookie/choc: Permission denied
```

I still have `r`, so I can list the names. 
I would need access to the files to get more than the name, for example file length or permissions with `stat(2)`.

```console
kris@server:~$ echo cookie/*
cookie/choc

kris@server:~$ ls -l cookie/
ls: cannot access 'cookie/choc': Permission denied
total 0
-????????? ? ? ? ?            ? choc
```

Restoring `x` permission fixes things.

**Destructive Sysadmin Exercise:** Get yourself a throwaway virtual machine.
As root, run `chmod a-x /`.
*Do not do this with a production machine.*
Predict what will happen.
What actually happens?
Can you fix it?

## Directory `x` permission (but no `r`)

Let's recreate the setup and then remove the `r` permission, keeping `x`.

```console
kris@server:~$ mkdir cookie
kris@server:~$ echo "schokokeks" > cookie/choc
kris@server:~$ chmod 111 cookie

kris@server:~$ ls -ld cookie cookie/choc
d--x--x--x 2 kris kris  3 Jun  7 07:06 cookie
-rw-rw-r-- 1 kris kris 11 Jun  7 07:06 cookie/choc

kris@server:~$ cat cookie/choc
schokokeks
```

Kris can still access the files in the directory and their contents.
But:

```console
kris@server:~$ ls -l cookie
ls: cannot open directory 'cookie': Permission denied
```

While `ls -ld cookie cookie/choc` tries to directly list files with known names,
`ls -l` tries to open the directory for reading with `opendir`
and then discover the content (the file names) using `readdir`.
This fails.

Running `stat` system calls on files with known names traverses the directory
and requires `x` permission on the directory containing the files.
Running `opendir` and `readdir` calls to discover filenames requires `r` permission.
We have `x`, but not `r`, so one operation succeeds, the other does not.

## Directory `w` permission

Let's create a directory with `w` permission for the group:

```console
kris@server:~$ mkdir cookie
kris@server:~$ echo "schokokeks" > cookie/choc
kris@server:~$ chmod 730 cookie

kris@server:~$ ls -ld cookie
drwx-wx--- 2 kris kris 3 Jun  7 07:12 cookie
```

Now, as a different user, let's do things:

```console
sammy@server:/home/kris/cookie$ id
uid=1002(sammy) gid=1000(kris) groups=1000(kris)

sammy@server:~$ cd ~kris/cookie

sammy@server:/home/kris/cookie$ ls -l
ls: cannot open directory '.': Permission denied

sammy@server:/home/kris/cookie$ cat choc
schokokeks

sammy@server:/home/kris/cookie$ ls -l choc
-rw-rw-r-- 1 kris kris 11 jun  7 07:12 choc

sammy@server:/home/kris/cookie$ echo butter > butter_cookie
sammy@server:/home/kris/cookie$ ls -l butter_cookie
-rw-r--r-- 1 sammy kris 7 jun  7 07:15 butter_cookie

sammy@server:/home/kris/cookie$ rm choc
sammy@server:/home/kris/cookie$ 
```

Sammy, being member of the group kris, can enter the directory with `cd`.

Sammy has no `r` permission, so she cannot list the directory contents.

Sammy has `x` permission, so she can access files in the directory, if the file permission allows this.
She can also `stat(2)` files with known names to learn the files' metadata.

Having `w` permission, sammy can create filenames in this directory, here `butter_cookie`.
The new file has her UID and the parent directories GID (what?).

Having `w` permission, sammy can also remove filenames in this directory, here `choc`, which she does not own (what?).

# Deleting files

Let's address the second "What?" first: Nobody in Unix has ever deleted a file.

Unix garbage collects files automatically when the number of their names is zero (their link count is zero),
and the number of open file descriptors is zero.

You knew this: The syscall is called `unlink(2)` and not `delete`. 
`unlink` will remove one of potentially many names of a file.
Even the last one.

Giving `w`-permission allows people to create or remove filenames in a directory.
The file is never involved with this, hence permissions are not checked. 

That's bad.

Let's fix that.

I lied. There are not nine permission bits to a file, there are 12. It's not `rwxrwxrwx`, it's `sstrwxrwxrwx`.
The `sst` is rarely set, so it is not shown unless it is set.
When it is set, it is shown instead of the three `x`, in lower case if the `x` below is set, else in upper case.

![](/uploads/2024/06/opening-files-03.png)

*What are the `sst` bits and why don't we see them?*

The `t`-bit is called "sticky bit" because of an obscure function (for files) for a computer type that no longer exists.
You can interpret is as "this thing needs special treatment" in modern Unix.
If you set it on directories, it will prevent a user from deleting files they do not own.

```console
kris@server:~$ mkdir cookie
kris@server:~$ echo "schokokeks" > cookie/choc
kris@server:~$ chmod 1730 cookie

kris@server:~$ ls -ld cookie
drwx-wx--T 2 kris kris 3 Jun  7 07:25 cookie
```

We have set the permissions `1730` aka `--trwx-wx--T` on this directory.
The `T` is shown instead of the last `x` and it is uppercase because the `x` beneath it is not there.

And now

```console
sammy@server:~$ cd ~kris/cookie

sammy@server:/home/kris/cookie$ ls -l choc
-rw-rw-r-- 1 kris kris 11 jun  7 07:25 choc

sammy@server:/home/kris/cookie$ rm choc
rm: cannot remove 'choc': Operation not permitted
```

but

```console
sammy@server:/home/kris/cookie$ echo butter > butter_cookie

sammy@server:/home/kris/cookie$ ls -l butter_cookie
-rw-r--r-- 1 sammy kris 7 jun  7 07:28 butter_cookie

sammy@server:/home/kris/cookie$ rm butter_cookie
sammy@server:/home/kris/cookie$
```

So sammy can still create files, which she then owns, and which she can delete.

But sammy can no longer delete files that she does not own.

Remember to set `t` on a directory that is also writeable by other persons.

# Who owns new files?

When creating new files, the new file gets an owner UID, a file GID and a default ACL.

Let's try this:

```conosle
kris@server:~$ id
uid=1000(kris) gid=1000(kris) 
  groups=1000(kris),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),122(lpadmin),134(lxd),135(sambashare),143(docker)

kris@server:~$ mkdir cookie
kris@server:~$ echo "schokokeks" > cookie/choc

kris@server:~$ ls -l cookie/choc
-rw-rw-r-- 1 kris kris  11 Jun  7 07:31 cookie/choc
```

I can try to give the file to a different group.

```console
kris@server:~$ chgrp doesnotexist cookie/choc
chgrp: invalid group: ‘doesnotexist’

kris@server:~$ chgrp scanner cookie/choc
chgrp: changing group of 'cookie/choc': Operation not permitted

kris@server:~$ chgrp sambashare cookie/choc
kris@server:~$ ls -l cookie/choc
-rw-rw-r-- 1 kris sambashare 11 Jun  7 07:31 cookie/choc
```

I can't give the file to a group that does not exist.

I can't give the file to a group that I am not a member of.
That is, because that file will count against that groups' quota,
and I am not allowed to book this file on a foreign groups' quota.

I can give the file to any group that I am a member of.
That is how the GID set of a process matters.

```console
kris@server:~$ mkdir cookie
kris@server:~$ chgrp sambashare cookie

kris@server:~$ ls -ld cookie
drwxrwxr-x 2 kris sambashare 2 Jun  7 07:37 cookie

kris@server:~$ echo butter > cookie/butter_cookie
kris@server:~$ ls -l cookie
total 1
-rw-rw-r-- 1 kris sambashare 7 Jun  7 07:38 butter_cookie
```

When I create files in a directory, the file will inherit the group of the directory.
That makes it easier for a group of people working together in a group,
because shared group directories will now automatically behave properly.

- Normal users are being created with a group after them, and ideally with the name GID and UID.
  Effectively, they do no longer need to care about groups because they are the only members of their own group.
- Additional groups can be created for cooperation.
  A sysadmin adds members to these groups effectively.
- Directories that belong to a group will contain newly created files, which are created with a GID of that share group.
- That is what you want:
  If you put files into a share directory for a group, they should be UID you, GID the share group.

This happens, because the file system is mounted with the option `bsdgroups`.
For file systems that are mounted without this option, the primary GID of the user is chosen.
All file systems should always be mounted with `bsdgroups`.

If you need the opposite behavior for a single directory, `chmod g+s my_directory` on it.
For a filesystem without `bsdgroups`, this one directory will have `bsdgroups` semantics.
For a filesystem with `bsdgroups`, this one directory will have no `bsdgroups` semantics.
