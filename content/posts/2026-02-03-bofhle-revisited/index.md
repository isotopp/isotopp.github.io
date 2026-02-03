---
author: isotopp
title: "BOFHLE revisited"
date: "2026-02-03T05:06:07Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
  - lang_en
  - computer
  - gaming
  - python
---

After the
[BOFHLE]({{< relref "2026-01-14-bofhle" >}})
article I wondered if the game can always be solved with the limit of 6 guesses.

So I wrote some [Python code](https://github.com/isotopp/bofhle) to solve the game.
We are using the same 
[`score_word()`](https://github.com/isotopp/bofhle/blob/main/src/bofhle/bofhle.py#L56-L64)
function as before, and then implement the guessing strategy we laid out in the previous article.

This is
[`suggest_top()`](https://github.com/isotopp/bofhle/blob/main/src/bofhle/bofhle.py#L67-L68)
in the codebase.

# Example session

Let's choose `pkill` as the secret to guess.
Initializing a new session:
``` 
kk:bofhle kris$ uv run bofhle --reset
New session started.
guess  result
Candidates remaining: 338
Next guesses:
 569 paste
 569 tapes
 553 strip
 546 parec
 543 oscap
 541 ports
 540 plser
 536 pargs
 535 split
 533 lsipc
```
The output is the list of valid candidate solutions, scored.
Since this is a new game, all 338 solutions are in play, and `paste` is the best guess.

So we guess `paste` and comparing to `pkill` we get `gbbbb` (`p` matches, and the letters `aste` are unused).
The codes are `g` for green (letter is used and in this position),
`y` for yellow (letter is used but in a different position), and `b` for black (letter is not used).

We tell the code that:

``` 
kk:bofhle kris$ uv run bofhle --guess paste --result gbbbb
guess  result
paste  🟩⬛⬛⬛⬛
Candidates remaining: 14
Next guesses:
  38 pidof
  38 pinky
  38 pkmon
  37 pkcon
  35 pkgrm
  34 pbind
  34 pkill
  34 pydoc
  32 pdiff
  32 proxy
```
The code is keeping state in a small sqlite database in $HOME:
``` 
kk:bofhle kris$ ls -l ~/.bofhle.db
-rw-r--r--  1 kris  staff  12288 Feb  3 17:59 /Users/kris/.bofhle.db
```
The database is used to keep track of the game state, previous guesses and results.

We can see the code has filtered the list of candidate solutions based on the previous guess and result.
The next best guess is `pidof`, which has the highest score, but `pkill` is also in the list.

This is the `--strategy most-likely`, the default strategy.

## Coverage strategy

There is a second strategy, `--strategy coverage`, that can best be used for a second guess.
It will try all remaining candidate words and will tell us, assuming that word is `bbbbb`,
how many valid solutions will be left.

```
kk:bofhle kris$ uv run bofhle --strategy coverage
guess  result
paste  🟩⬛⬛⬛⬛
Candidates remaining: 14
Next guesses (min remaining if bbbbb):
   0 pbind
   0 pdiff
   0 pidof
   0 pinky
   0 pkcon
   0 pkgmk
   0 pkgrm
   0 pkill
   0 pkmon
   0 plgrp
```
So any of `pbind` and friends will close the game, if they would come back `bbbbb` (`pkill` for example won't,
it's the secret solution, after all).

## Second guess

Let's go with `--strategy most-likely`'s recommendation of `pidof` as a guess:

``` 
kk:bofhle kris$ uv run bofhle --guess pidof --result gybbb
guess  result
paste  🟩⬛⬛⬛⬛
pidof  🟩🟨⬛⬛⬛
Candidates remaining: 2
Next guesses:
   8 pkill
   7 ppriv
```

Now the next (third) guess of `pkill` will close the game.

# Playing all possible games (`most-likely`)

There are 338 possible solutions,
and we can play the game 338 times with the `most-likely` strategy and record the success paths:

``` 
kk:bofhle kris$ uv run bofhle --test
secret=acpid guesses=3 path=paste idmap acpid
secret=alias guesses=3 path=paste fsadm alias
secret=amidi guesses=3 path=paste rmail amidi
...
secret=zmore guesses=3 path=paste xmore zmore
secret=zpool guesses=3 path=paste gzcmp zpool

Summary
Games: 338
Best: 1 guesses
Worst: 6 guesses
Histogram (guesses -> games):
  1 -> 1
  2 -> 74
  3 -> 190
  4 -> 63
  5 -> 8
  6 -> 2
```
So one game (`paste`) ends with one guess, 74 games require two guesses, 190 games require three guesses,
63 games require four guesses, 8 games require five guesses, and 2 games require six guesses.

The 8 games with five guesses are
```
kk:bofhle kris$ grep =5 bofhle.log
secret=ckuid guesses=5 path=paste minfo blkid ckgid ckuid
secret=ggrep guesses=5 path=paste fgrep zgrep egrep ggrep
secret=nstat guesses=5 path=paste ctags jstat kstat nstat
secret=vwebp guesses=5 path=paste fgrep cwebp dwebp vwebp
secret=xkill guesses=5 path=paste minfo blkid gkill xkill
secret=xzcat guesses=5 path=paste lzcat bzcat gzcat xzcat
secret=xzcmp guesses=5 path=paste gzcmp bzcmp lzcmp xzcmp
secret=zdiff guesses=5 path=paste minfo bdiff gdiff zdiff
```

The two games with 6 guesses are
``` 
kk:bofhle kris$ grep =6 bofhle.log
secret=rgrep guesses=6 path=paste fgrep zgrep egrep ggrep rgrep
secret=ustat guesses=6 path=paste ctags jstat kstat nstat ustat
```
and all games are strategically solvable in six guesses or less with the `most-likely` strategy.

The full results of all playable games are recorded in
[`bofhle.log`](https://github.com/isotopp/bofhle/blob/main/bofhle.log).
