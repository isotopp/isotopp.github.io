---
author: isotopp
title: "50 years in filesystems: A detour on vnodes"
date: 2023-05-15T01:02:03Z
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
- lang_en
- unix
- filesystems
---

This is part 4 of a series.
1. "[1974]({{< ref "/content/posts/2023-05-05-50-years-in-filesystems-1974.md" >}})" on the traditional Unix Filesystem.
2. "[1984]({{< ref "/content/posts/2023-05-06-50-years-in-filesystems-1984.md" >}})" on the BSD Fast File System.
3. "[1994]({{< ref "/content/posts/2023-05-12-50-years-in-filesystems-1994.md" >}})" on SGI XFS.

Progress is sometimes hard to see, especially when you have been part of it or otherwise lived through it.
Often, it is easier to see by comparing modern educational material and the problems discussed with older material.
Or look for the research papers and sources that fueled the change. So this is what we do.

# How to have multiple filesystems

Steve Kleiman wrote 
"[Vnodes: An Architecture for Multiple File System Types in Sun UNIX](https://www.semanticscholar.org/paper/Vnodes%3A-An-Architecture-for-Multiple-File-System-in-Kleiman/e0d14c74f23ef9b21c2fc37b5197fbfe348a7fcf)" 
in 1986.

This is a short paper, with little text, because most of it is listing of data structures and diagrams of C language `struct`'s pointing at each other.
Kleiman wanted to have multiple file systems in Unix, but wanted the file systems to be able to share interfaces and internal memory, if at all possible.
Specifically, he wanted a design that provided

- one common interface with multiple implementations,
- supporting BSD FFS, but also NFS and RFS, two remote filesystems, and Non-Unix filesystems, specifically MS-DOS,
- with the operations being defined by the interface being atomic.

And the implementations should be able to handle memory and structures dynamically, without performance impact,
reentrant and multicore capable, and somewhat object-oriented.

# Two abstractions

He looked at the various operations, and decided to provide two major abstractions: 
The filesystem (`vfs`, virtual filesystem) and the inode (`vnode`, virtual inode), representing a filesystem and a file.

In true C++ style (but expressed in C), we get a virtual function table for each type, representing the class:

- For the `vfs` type, this is a `struct vfsops`, 
  a collection of function pointers with operations such as `mount`, `unmount`, `sync` and `vget`.
  Later in the paper, prototypes and functionality of these functions are explained.
- For the `vnode` type, likewise, we get `struct vnodeops`.
  The functions here are `open`, `rdwr` and `close`, of course, but also `create`, `unlink`, and `rename`.
  Some functions are specific to a filetype such as `readlink`, `mkdir`, `readdir` and `rmdir`.

Actual mounts are being tracked in `vfs` objects, which point to the operations applicable to this particular subtree with their `struct vfsops *`.

Similarly, open files are being tracked in `vnode` instances, which again, among other things, have a `struct *vnodeops` pointer.
`vnodes` are part of their `vfs`, so they also have `struct *vfs` to their filesystem instance.

Both, the `vfs` and the `vnode` need to provide a way for the implementation to store implementation specific data ("subclass private fields").
So both structures end with `caddr_t ...data` pointers.
That is, the private data is not part of the virtual structure, but located elsewhere and pointed to.


## Vnodes in action

![](/uploads/2023/05/vfs-vnode-structures.png)
*One full page in the paper is dedicated to showing the various structures pointing at each other.
What looks confusing at first glance is actually pretty straightforward and elegant, once you trace it out.*

Kleiman sets out to explain how things work using the `lookuppn()` function, which replaces the older `namei()` function from traditional Unix.
Analogous to `namei()`, the function consumes a path name, and returns a `struct vnode *` to the vnode represented by that pathname.

Pathname traversal starts at the root vnode or the current directory vnode for the current process, 
depending on the first character of a pathname being `/` or not.

The function then takes the next pathname component, iteratively, and calls the `lookup` function for the current vnode.
This function takes a pathname component, and a current `vnode` assuming it is a directory.
It then returns the `vnode` representing that component.

If a directory is a mountpoint, it has `vfsmountedhere` set.
This is a `struct vfs *`. `lookuppn` follows the pointer, 
and can call the `root` function for that `vfs` to get the root `vnode` for that filesystem, replacing the current `vnode` being worked on.  

The inverse must also be possible:
When resolving a "`..`" component and the current `vnode` has a root flag set in its "flags" field,
we go from the current `vnode` to the `vfs` following the `vfsmountedhere` pointer.
Then we can use the `vnodecovered` field in that `vfs` to get the `vnode` of the superior filesystem.

In any case, upon successful completion, a `struct vnode*` representing the consumed pathname is returned.

## New system calls

In order to make things work,
and to make things work efficiently, a few new system calls had to be added to round out the interfaces.

It is here in Unix history that we get `statfs` and `fstatfs`, to get an interface to filesystems in userland.
We also gain `getdirentries` (plural) to get multiple directory entries at once (depending on the size of the buffer provided),
which makes directory reading faster a lot for remote filesystems.

# In Linux

Looking at the Linux kernel source, we can find the general structure of Kleiman's design,
even if the complexity and richness of the Linux kernel obscure most of it.
The Linux kernel has a wealth of file system types, and added also a lot of functionality that wasn't present in BSD 40 years ago.
So we find a lot more structures and system calls, 
implementing namespaces, quotas, attributes, read-only modes, directory name caches, and other things.

## The file

Still, if you squint, the original structure can still be found:
Linux splits the in-memory structures around files in two, the opened `file`, which is an inode with a current position associated,
and the `inode`, which is the whole file.

We find instances of file objects, `struct file`, defined
[here](https://github.com/torvalds/linux/blob/v6.3/include/linux/fs.h#L942C3-L981).
Among all the other things a file has, it has most notably a field `loff_t f_pos`, 
an offset (in bytes) from the start of the file,
the current position.

The file's class is defined via a virtual function table.
We find the pointer as `struct file_operations *f_op`, 
and the definition [here](https://github.com/torvalds/linux/blob/v6.3/include/linux/fs.h#L1754-L1798).
It shows all the things a file can do, most notable, `open`, `close`, `lseek` and then `read` and `write`.

The file also contains pointers to the inode, `struct inode *f_inode`.

## The inode

Operations on files without the need of an offset work on the file as a whole, 
defined as `struct inode *`.

Check the definition [here](https://github.com/torvalds/linux/blob/v6.3/include/linux/fs.h#L595-L705).
We see other definitions in here that have no equivalent in BSD from 40 years ago, such as ACLs and attributes.

We find the inode's class is defined via a virtual function table,
`struct inode_operations *i_op`,
and the definition [here](https://github.com/torvalds/linux/blob/v6.3/include/linux/fs.h#L1800-L1840).
Again, a lot of them deal with new features such as ACLs and extended attributes, 
but we also find those we expect such as `link`, `unlink`, `rename` and so on.

The inode also contains a pointer to a filesystem, the `struct super_block *i_sb`.

## The superblock

A mountpoint is represented as an instance of `struct super_block`, 
defined [here](https://github.com/torvalds/linux/blob/v6.3/include/linux/fs.h#L1136-L1268).
Again, the class is a `struct super_operations *s_op`, defined
[here](https://github.com/torvalds/linux/blob/v6.3/include/linux/fs.h#L1886-L1918).

As an added complexity, there is no finite list of filesystems.
It is instead extensible through loadable modules, so we also have a `struct file_system_type`,
[here](https://github.com/torvalds/linux/blob/v6.3/include/linux/fs.h#L1886-L1918).
This is basically a class with only one class method as a factory for superblocks, `mount`.

# Summary

Unix changed.
It became a lot more runtime extensive, added a lot of new functionality and gained system calls.
Things became more structured.

But the original design and data structures conceived by Kleiman and Joy held up, and can still be found in current Linux, 40 years later.
We can point to concrete Linux code, which while looking completely different, is structurally mirroring the original design ideas.
