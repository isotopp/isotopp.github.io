---
layout: post
title:  'MySQL: Page compression revisited'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2021-09-14 16:03:47 +0200
tags:
- lang_en
- mysql
- mysqldev
---
Like I said, I never had much reason to use table compression, and only recently looked into the topic.
MySQL Page Compression looks a lot easier at the database end of things, but relies on hole punching support in the file system.
Let's have a look at what that means.

# Files, Inodes and Arrays of Blocks

The original Unix filesystem saw the disk as a sea of blocks, which were represented in a free map as an array of bits.
Files have numbers, which are an index into an array of so-called inode structures.
Inodes store the files metadata and contain an array of block numbers, which make up the actual file.
The array is folded multiple times, to optimize for the more common case of small files:
The first few block numbers were stored in the inode, followed by a pointer to a block containing file block numbers, then a pointer to a block containing pointers to blocks of file block numbers and so on.

![](/uploads/2021/09/filestructure.png)

*The block list inside an array is folded multiple times, to optimize for the more common case of small files.*

These structures make up the so-called lower filesystem, which deals with organizing blocks into numbered files efficiently.
On top of that resides the upper filesystem, which is concerned with managing names of files, and organizing them into directories.
In our instance the upper filesystem is of no interest, so we are ignoring it completely:
To us files are sequences of blocks, organized in inodes.

While the folded block array of the original file system served us for many decades, more modern file systems try to shrink these block lists by storing extents.
An extent is a pair (start, length) that describes a  contiguous sequence of blocks.
On a mostly empty disk, most files can probably be arranged in such runs of contiguous blocks, so this is a more efficient way to store things.
Also, free lists can in many cases be stored more efficiently as extents.

The XFS filesystem is getting a lot of mileage of such extents, and one major a difference between the Linux ext3 and ext4 is the use of extents instead of block lists and bitmaps in many places.

# Sparse Files

Unix always allowed you to seek past the end of a file and write data.
The following example program creates a file named `testfile` by opening a new file of length 0, seeking to the position 20 GB and writing an integer at that position.
The resulting file is 20 GB in length, but only occupies a minuscule amount of disk space.
This is called a *sparse file*, a file with holes in it.

Reading a sparse file, the non-existent blocks are returned as blocks filled with zeroes.
On writing, space is allocated for the previously unallocated blocks in the sparse file, but probably not in sequence.
So on hard disks, a seek occurs that would probably not have occurred, had the file actually been written properly.

```c
kris@server:~$ cat sparseme.c

#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

/* 20 GB */
#define FAR_OUT ((long) 20*1024*1024*1024)

int main(void) {
        int something = 0;
        FILE *fp = 0;

        /* trunate to 0, or create, position 0 */
        fp = fopen("testfile", "w"); 
        if (!fp) {
                fprintf(stderr, "Cannot open 'testfile', I die.");
                exit(1);
        }
        /* move to far out position */
        fseek(fp, FAR_OUT, SEEK_SET);
        /* write something */
        fwrite(&something, sizeof(something), 1, fp);
        fclose(fp);

        exit(0);
}
```

When looking at this on the disk we can see that in fact only 4 KB of disk space (one block on a modern disk) has been allocated.

```console
kris@server:~$ cc -o sparseme sparseme.c
kris@server:~$ ./sparseme
kris@server:~$ ls -lsh testfile
4.0K -rw-rw-r-- 1 kris kris 21G Sep 14 16:37 testfile
kris@server:~$ xfs_bmap -v testfile
testfile:
 EXT: FILE-OFFSET           BLOCK-RANGE          AG AG-OFFSET               TOTAL
   0: [0..41943039]:        hole                                         41943040
   1: [41943040..41943047]: 104705904..104705911  3 (10334064..10334071)        8
```

We compile the C-program with `cc -o sparseme sparseme.c`, then run it as `./sparseme`.
We look at the resulting `testfile` with `ls -lsh testfile`. The size of the file is shown as 21G, but the allocation (in the leftmost column, we asked for that with the `-s` flag) is only 4K.

Using the XFS maintenance program `xfs_bmap` in verbose mode, we get to see the block map (bmap) of the file, as an extent listing. The program operates with sectors of 512 bytes, the unit that was common for many hard disk before we moved to 4K sectors. We see a large hole from offset 0 to 41943039 (times 512 bytes for sector size, this is 20 GB). Then there are 8 sectors (one 4K disk drive hardware block) mapped to 8 contiguous blocks (actually one hardware block) at 104705904 from the start of the partition.

We can do the same thing using a `dd` command without writing a C-program:

```console
kris@server:~$ rm testfile testfile2
kris@server:~$ dd if=/dev/zero of=testfile2 bs=1 count=1 seek=21474836480
1+0 records in
1+0 records out
1 byte copied, 0.000227159 s, 4.4 kB/s
kris@server:~$ ls -lsh testfile2
4.0K -rw-rw-r-- 1 kris kris 21G Sep 14 16:47 testfile2
kris@server:~$ xfs_bmap -v testfile2
testfile2:
 EXT: FILE-OFFSET           BLOCK-RANGE          AG AG-OFFSET               TOTAL
   0: [0..41943039]:        hole                                         41943040
   1: [41943040..41943047]: 104705904..104705911  3 (10334064..10334071)        8
```

Our `of=testfile2` generates the outfile, and we write one byte (`bs=1`) one time (`count=1`) after seeking to position 20G (`seek=...`).
Using `ls -lsh` and the `xfs_bmap` output, we can confirm that this is indeed a file with a hole.

Sparse files are hard to handle:
When you copy them, the non-existent blocks are read as blocks full of 0-bytes, and written.
The target file will therefore actually allocate all the space the source file only claims to be large.

This is a problem with `core` files in many Unix system, because they are being dumped as sparse files, mapping the actual process address space to file offsets, and leaving unallocated space in the address space at least in part as holes in the file.
Until you naively copy that file, that is.

The GNU `cp` program has a `--sparse` option that tries to handle this, and `rsync` also has special options that make it sparse file aware.

# Hole Punching

Some filesystems allow you to punch holes into files, using the [`fallocate(2)`](https://lwn.net/Articles/415889/) system call.
This system call can be used to assign blocks to a file, making sure it is not a sparse file, without actually having to write all those bytes and a few other things.
Using the filesystem dependent `FALLOC_FL_PUNCH_HOLE` flag, extents in the file can be marked as 'unused' and be given back to the filesystem.

Let's look what our tables from the [previous article]({% link _posts/2021-09-09-mysql-two-kinds-of-compression.md %}) look like on disk, using `xfs_bmap`.

The uncompressed table looks like this:

```console
kris@server:~/sandboxes/msb_8_0_25/data/kris$ xfs_bmap -v keks.ibd
keks.ibd:
 EXT: FILE-OFFSET       BLOCK-RANGE          AG AG-OFFSET             TOTAL
   0: [0..63]:          104752464..104752527  3 (10380624..10380687)     64
   1: [64..159]:        104753560..104753655  3 (10381720..10381815)     96
   2: [160..223]:       104744928..104744991  3 (10373088..10373151)     64
  ...
  18: [327680..450559]: 126091200..126214079  4 (262080..384959)     122880
  19: [450560..516095]: 126404568..126470103  4 (575448..640983)      65536
  ```

We get 20 extents, some of which are smaller than 100 sectors, but some of which are larger than 100k sectors of contiguous space.

Now the page compressed file:

```console
kris@server:~/sandboxes/msb_8_0_25/data/kris$ xfs_bmap -v keks2.ibd
keks2.ibd:
 EXT: FILE-OFFSET       BLOCK-RANGE          AG AG-OFFSET            TOTAL
   0: [0..31]:          104756944..104756975  3 (10385104..10385135)    32
   1: [32..63]:         104757000..104757031  3 (10385160..10385191)    32
   2: [64..71]:         104709000..104709007  3 (10337160..10337167)     8
   3: [72..95]:         hole                                            24
   4: [96..103]:        104709032..104709039  3 (10337192..10337199)     8
   5: [104..127]:       hole                                            24
30886: [494440..494463]: hole                                            24
30887: [494464..494471]: 127160928..127160935  4 (1331808..1331815)       8
30888: [494472..494495]: hole                                            24
30889: [494496..516095]: 127160960..127182559  4 (1331840..1353439)   21600
```

We get more than 30k extents here, all of them 8 sectors (4K) of data and 24 sectors (12K) of hole in my very compressible test data.
This is messy.

Trying to delete these things demonstrates the cost of this:

```console
kris@server:~$ cp ~/sandboxes/msb_8_0_25/data/kris/keks.ibd .
kris@server:~$ cp --sparse=always ~/sandboxes/msb_8_0_25/data/kris/keks2.ibd .
kris@server:~$ time rm keks.ibd

real    0m0.020s
user    0m0.000s
sys     0m0.020s
kris@server:~$ time rm keks2.ibd

real    0m0.123s
user    0m0.000s
sys     0m0.109s
```

With longer files, we get more holes, more overhead and even longer times.

# File Size over Time

While running `insert into keks2 select * from keks`, I was monitoring the size of the new table at the file system level.
This looks funny, because we can see the file's allocation growing over time, but there are downward spikes in allocation every few seconds.

```console
kris@server:~/sandboxes/msb_8_0_25$ while :
> do
> ls -lsh data/kris/keks2*
> sleep 1
> done
197M -rw-r----- 1 kris kris 524M Sep 14 19:09 data/kris/keks2.ibd
200M -rw-r----- 1 kris kris 532M Sep 14 19:09 data/kris/keks2.ibd
203M -rw-r----- 1 kris kris 540M Sep 14 19:09 data/kris/keks2.ibd
205M -rw-r----- 1 kris kris 548M Sep 14 19:09 data/kris/keks2.ibd
208M -rw-r----- 1 kris kris 556M Sep 14 19:09 data/kris/keks2.ibd
212M -rw-r----- 1 kris kris 564M Sep 14 19:09 data/kris/keks2.ibd
207M -rw-r----- 1 kris kris 564M Sep 14 19:09 data/kris/keks2.ibd  <---
209M -rw-r----- 1 kris kris 572M Sep 14 19:09 data/kris/keks2.ibd
212M -rw-r----- 1 kris kris 580M Sep 14 19:09 data/kris/keks2.ibd
216M -rw-r----- 1 kris kris 588M Sep 14 19:09 data/kris/keks2.ibd
215M -rw-r----- 1 kris kris 588M Sep 14 19:09 data/kris/keks2.ibd  <---
218M -rw-r----- 1 kris kris 592M Sep 14 19:09 data/kris/keks2.ibd
212M -rw-r----- 1 kris kris 592M Sep 14 19:09 data/kris/keks2.ibd  <---
219M -rw-r----- 1 kris kris 604M Sep 14 19:09 data/kris/keks2.ibd
223M -rw-r----- 1 kris kris 612M Sep 14 19:09 data/kris/keks2.ibd
226M -rw-r----- 1 kris kris 620M Sep 14 19:09 data/kris/keks2.ibd
225M -rw-r----- 1 kris kris 624M Sep 14 19:09 data/kris/keks2.ibd  <---
228M -rw-r----- 1 kris kris 632M Sep 14 19:09 data/kris/keks2.ibd
227M -rw-r----- 1 kris kris 636M Sep 14 19:09 data/kris/keks2.ibd
225M -rw-r----- 1 kris kris 640M Sep 14 19:09 data/kris/keks2.ibd  <---
233M -rw-r----- 1 kris kris 652M Sep 14 19:09 data/kris/keks2.ibd
232M -rw-r----- 1 kris kris 656M Sep 14 19:09 data/kris/keks2.ibd
```

The size of these downward spikes (several megabytes in some instances) is impressive.

# Implications for MySQL

Page Compression was introduced to MySQL in 2015, and Mark Callaghan has been experimenting from early on.
He has a series of blog articles on this:

- [Wanted Wanted: a file system on which InnoDB transparent page compression works](http://smalldatum.blogspot.com/2015/10/wanted-file-system-on-which-innodb.html)

and earlier

- [First day with InnoDB transparent page compression](http://smalldatum.blogspot.com/2015/08/first-day-with-innodb-transparent-page.html)
- [Second day with InnoDB transparent page compression](http://smalldatum.blogspot.com/2015/09/second-day-with-innodb-transparent-page.html)
- [Third day with InnoDB transparent page compression](http://smalldatum.blogspot.com/2015/09/third-day-with-innodb-transparent-page.html)

and being Mark, he also has a series of bugs open on this.
The links are in the articles.

The "Wanted" article from the list above contains a number of very recent, very relevant comments by Marko Mäkelä, and a link to [LWN: Hole-punching races against page-cache filling](https://lwn.net/Articles/864363), from July 29, 2021.
This bug is still open in all production Linux kernels.

This seems to make using Page Compression a risky and expensive thing. Mark's estimate in private communication was approximately "a thing such as RocksDB which never overwrites data has an inherent advantage  over anything that does in-place updates when it comes to compression" (my summary of his words), and I think he's correct.

Seems I accidentally did a few things right when I never even tried to use compressed tables in InnoDB.

# Thanks

Thanks, Mark, for you very useful and insightful comments, and for nudging me to go deeper on this.
And thanks for necro'ing Marks articles with your comments, Marko!
