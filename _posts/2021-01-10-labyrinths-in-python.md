---
layout: post
title:  'Labyrinths (in Python)'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2021-01-10 12:54:35 +0100
tags:
- lang_en
- python
---

My son wants labyrinths. Ok, let's make them like it's the first semester.


![](/uploads/2021/01/backtracking2.png)

We need a `class Labyrinth` that holds the dimensions of our maze, and the actual maze, in `grid` - a List of Lists of integers. That's not exactly a two-dimensional array (it can have a ragged right edge), but it will do for us.

## A basic container for labyrinths

```python
class Labyrinth:
    """Store a labyrinth as a List of Lists of Integers.

    Passages exist in the 4 cardinal directions, N, E, S, and W. We store them
    as bit flags (N=1, E=2, S=4, W=8). When set, a passage exists from the current
    cell into the direction indicated by the bitflag.
    """

    # Grid size
    width: int
    height: int
    grid: List[List[int]]
```

The integer Zero will indicate an unused cell. We then use bits to store passages to the four cardinal directions: 1 for a passage to the North, 2 for a passage to the East, 4 for a passage to the South, and 8 for a passage to the West.

When making a passage, we will need to tear down the wall in the current cell, and we will need to tear down the wall in the new cell, making a backwards passage. One could say that our maze is an undirected graph, and making passages connects the vertices forward and backward.

We will need to work with positions, and we define a type for that: A position is a `Pos`, a two-tuple of integers.

We will also need to work with the cardinal directions, and make a type for that: A direction is a `Direction`, a string. We will also make use of a number of things from `random`.

```python
from typing import List, Dict, Tuple, Optional, NewType
from random import shuffle, randrange, choice, randint

Pos = NewType("Pos", Tuple[int, int])
Direction = NewType("Direction", str)
```

Using this, we can define a few useful things that we will be using a lot. Our bits to encode passages, for example:

```python
    _directions: Dict[Direction, int] = {
        Direction("N"): 1,
        Direction("E"): 2,
        Direction("S"): 4,
        Direction("W"): 8,
    }
```


Also, the back-connections, because we want an undirected graph of passages:

```python
    opposite: Dict[Direction, Direction] = {
        Direction("N"): Direction("S"),
        Direction("S"): Direction("N"),
        Direction("W"): Direction("E"),
        Direction("E"): Direction("W"),
    }
```

And we need to be able to translate a `Direction` into a change in coordinates, in order to be able to step:

```python
    dx: Dict[Direction, int] = {
        Direction("N"): 0,
        Direction("S"): 0,
        Direction("E"): 1,
        Direction("W"): -1,
    }
    dy: Dict[Direction, int] = {
        Direction("N"): -1,
        Direction("S"): 1,
        Direction("E"): 0,
        Direction("W"): 0,
    }
```

We can now initialize our class:

```python
   def __init__(self, width: int = 10, height: int = 10) -> None:
        """ Construct a labyrinth with no passages in the given dimensions """
        self.width = width
        self.height = height
        self.grid = [[]] * self.height
        for y in range(0, self.height):
            self.grid[y] = [0] * self.width

        return
```

## Some basic Python wiring

We will probably suck and need to be able to dump a labyrinth object, so let's build a `__repr__()` for it. If you have an instance and print it, Python will try to invoke `__str__()` for a human readable representation of the object. If that does not exist (or we `print(repr(l))`), Python will try `__repr__()` instead. This is supposed to produce a debug representation of a thing.

So let's make one:

```python
    def __repr__(self) -> str:
        """ Dump the current labyrinths passages as raw integer values """
        s = ""

        for y in range(0, self.height):
            s += f"{y=}: "
            for x in range(0, self.width):
                s += f"{self.grid[y][x]:04b} "
            s += "\n"

        return s

```

Our `Labyrinth` is mostly a container for these integers representing cells, with a bit of sugar on top. Let's make the cells directly accessible:

```python
    def __getitem__(self, item: Pos) -> int:
        """ Return the passages at position item: Pos from the labyrinth """
        if not self.position_valid(item):
            raise ValueError(f"Invalid Position: {item=}")

        r = self.grid[item[1]][item[0]]
        return r

    def __setitem__(self, key: Pos, value: int) -> None:
        """ Set the passages at position key: Pos to value: int """
        if not self.position_valid(key):
            raise ValueError(f"Invalid Position: {key=}")

        if not (0<=value<=15):
            raise ValueError(f"Invalid cell value: {value=}")

        self.grid[key[1]][key[0]] = value
        return
```

I can now make me a `l= Labyrinth` and then `p = Pos((10, 10))` and `print(l[p])` to print a single element at position `(10, 10)`. Python will invoke the `__getitem__()` with this Pos tuple and return me the element. Likeweise I can assign to `l`: `l[p] = 10`, and that will invoke `__setitem__()` with the proper parameters.

## Some important predicates

The predicate `position_valid()` is still missing, and we will need similar things for Directions, too.

Let's make them:

```python
    def position_valid(self, p: Pos) -> bool:
        """ Predicate, true if the p: Pos is valid for this labyrinth """
        return 0 <= p[0] < self.width and 0 <= p[1] < self.height

    def direction_valid(self, d: Direction) -> bool:
        """ Predicate, true if Direction d is valid """
        return d in self.directions()
```

We also build a getter, `directions()` that returns the directions from the `_directions` bit encoder array above, and the same thing randomized under the name of  `random_directions()`. We grab the list and apply Pythons `shuffle()`.

```python
    def directions(self) -> List[Direction]:
        return list(self._directions.keys())

    def random_directions(self) -> List[Direction]:
        """Return all cardinal directions in random order. """
        d = self.directions()
        shuffle(d)

        return d
```

## Stepping into the Labyrinth

We now can make a `step(pos, direction)`, which takes one Pos, and makes a step into the given Direction.

```python
    def step(self, p: Pos, d: Direction) -> Pos:
        """Starting at Pos p, walk one step into Direction d, return a new position.
           The new position is guaranteed to be valid."""
        if not self.direction_valid(d):
            raise ValueError(f"Invalid Direction {d=}")

        if not self.position_valid(p):
            raise ValueError(f"Invalid Position {p=}")

        np = Pos((p[0] + self.dx[d], p[1] + self.dy[d]))
        if not self.position_valid(np):
            raise ValueError(
                f"Invalid Position {np=}: Step from {p=} into {d=} leaves the grid."
            )

        return np
```

The new position is guaranteed to be valid. We will raise `ValueError` for all invalid things - wrong parameters, and wrong results. Some of them may arguably be `IndexErrrors` instead, but I actually have little need for this distinction here, and it will only make the code more complicated later on.

## Tear down a wall

Now I can build me a function that makes a passage from a given Pos, into a given Direction:

```python
    def make_passage(self, p: Pos, d: Direction) -> None:
        """At Pos p into Direction d, make a passage and back. """
        if not self.direction_valid(d):
            raise ValueError(f"Invalid Direction {d=}")

        if not self.position_valid(p):
            raise ValueError(f"Invalid Position {p=}")

        np = self.step(p, d)
        self[p] |= self._directions[d]
        self[np] |= self._directions[self.opposite[d]]

        return
```

It may also be useful to have this as a predicate `can_make_passage()`, which returns true if I can make a passage that is not there, yet.

```python
    def can_make_passage(self, p: Pos, d: Direction) -> bool:
        """Predicate, true if valid passage that is not there, yet."""
        if not self.direction_valid(d):
            raise ValueError(f"Invalid Direction: {d=}")

        if not self.position_valid(p):
            raise ValueError(f"Invalid Position: {p=}")

        try:
            np = self.step(p, d)
        except ValueError as e:
            # We stepped off the grid.
            return False

        # Success, if the world would change by removing this wall.
        pre_elem = self[p]
        post_elem = pre_elem | self._directions[d]
        return pre_elem != post_elem
```

This raises exceptions for invalid input values. It will return `False` for passages that would lead off grid, and also returns `False` is this is not a new, but already existing passage.

## Recursive digging

Now we can pretty easily and concisely write down a tunnel digging algorithm that will build us a fully connected labyrinth, a random minimal spanning tree for the grid.

At this point it is a subclass of Labyrinth, but it really should be a strategy of Labyrinth instead. Python on my system has a default recursion nesting limit of 1000, so the longest path can be 1000 steps until we overflow the stack. This is good for a 31x31 grid at best, and we would need to change `sys.setrecursionlimit(new_value)` for more.

```python
class Backtracking(Labyrinth):
    """Build a labyrinth using a backtracking algorithm."""

    def carve(self, pos: Optional[Pos] = None, show: Any = None) -> None:
        """carve passages starting at Pos p using recursive backtracking.

        Carves passages into the labyrinth, starting at Pos p (Default: 0,0),
        using a recursive backtracking algorithm. Uses stack as deeply as the
        longest possible path will be.
        """
        # Set start position
        if not pos:
            pos = Pos((0, 0))

        # Probe in random order
        directions = self.random_directions()
        for d in directions:
            # try to step into this direction
            try:
                np = self.step(pos, d)
            except ValueError:
                # We stepped off the grid -> ignore this direction
                continue

            if show:
                show(self, red=pos, green=np)

            # if the position is clean, make a passage, and recurse
            if self[np] == 0:
                self.make_passage(pos, d)
                self.carve(np, show=show)
```

What we have here is a function `carve()` that will dig a tunnel, starting at `pos`. If no `pos` is given, we default to the origin `(0,0)`.

For the current position, we will check all possible directions in random order: can we step there? If so, we break down the walls and make a passage, then step there and recurse. 

We have provided the option to supply a callback function `show=` (for which we skimped on the typing, tsk, tsk!). If such a function is supplied, we call it with the old and the new position as parameters. We need to make sure to pass on the `show=` function, if there is one, when we recurse.


Here is a labyrinth generation in progress:

![](/uploads/2021/01/backtracking.png)

## Painting the labyrinth

Our Labyrinth Painter uses Pygame. It draws cells that are `size=` wide, and are framed with `line_width=` thick lines.

```python
import sys
from time import sleep
from typing import Optional

import pygame
from src.labyrinth import Labyrinth, Pos


WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (200, 50, 50)
GREEN = (50, 200, 50)
LIGHT_BLUE = (230, 230, 255)

class LabyrinthPainter:
    surface: pygame.surface.Surface

    size: int
    line_width: int

    def __init__(self, lab, size=100, line_width=5) -> None:
        self.size = size
        self.line_width = line_width

        self.show_init(lab)

        return

```

We start pygame, and make us a surface in a window:

```python
    def show_init(self, lab: Labyrinth) -> None:
        pygame.init()

        self.surface = pygame.display.set_mode(
            (
                self.size * lab.width + self.line_width,
                self.size * lab.height + self.line_width,
            )
        )
        self.surface.fill(WHITE)
        pygame.display.flip()

        return
```

We then implement a show function, which draws a bunch of squares in funny colors:

```python
    def show(
        self, lab: Labyrinth, red: Optional[Pos] = None, green: Optional[Pos] = None
    ):
        for y in range(0, lab.height):
            for x in range(0, lab.width):
                self.square(lab, Pos((x, y)), red, green)
```

A square needs to find out what color it should be in, and then needs to be drawn. For that we need corners: North-East, North-West, South-East, and South-West.

We do not really have many dependencies on Labyrinth: Element access, and we should really use direction names instead of raw bits for decoding here.

```python
    def square(
        self,
        lab: Labyrinth,
        pos: Pos,
        red: Optional[Pos] = None,
        green: Optional[Pos] = None,
    ) -> None:
        xpos, ypos = pos[0], pos[1]
        el = lab[pos]

        nw = (xpos * self.size, ypos * self.size)
        ne = ((xpos + 1) * self.size, ypos * self.size)
        sw = (xpos * self.size, (ypos + 1) * self.size)
        se = ((xpos + 1) * self.size, (ypos + 1) * self.size)

        color = LIGHT_BLUE
        if el == 0:
            color = BLACK
        if red and pos == red:
            color = RED
        if green and pos == green:
            color = GREEN
        pygame.draw.rect(self.surface, color, nw + (self.size, self.size))

        # North Border
        if not (el & 1):
            pygame.draw.line(self.surface, BLACK, nw, ne, width=self.line_width)

        # East Border
        if not (el & 2):
            pygame.draw.line(self.surface, BLACK, ne, se, width=self.line_width)

        # South Border
        if not (el & 4):
            pygame.draw.line(self.surface, BLACK, sw, se, width=self.line_width)

        # West Border
        if not (el & 8):
            pygame.draw.line(self.surface, BLACK, nw, sw, width=self.line_width)
```

Nothing of this will be visible until we call `flip()`. For debugging, we provide the `flip()` as part of two waiting functions:

```python
    @staticmethod
    def wait() -> None:
        # self.keywait()
        pygame.display.flip()
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    pygame.quit()
                    sys.exit()
        sleep(0.05)

    @staticmethod
    def keywait() -> None:
        pygame.display.flip()

        while True:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    pygame.quit()
                    sys.exit()
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_SPACE:
                        return
                    if event.key == pygame.K_ESCAPE:
                        pygame.quit()
                        sys.exit()
            sleep(0.05)
```

The first function checks the Pygame event queue for a `QUIT` event (close button on the window has been hit) or an `ESC` key press. If either of them happened, we exit the program. Otherwise we delay a bit (and should make this a settable parameter).

The second method busy waits on a space bar press (and also allows quitting) before it continues. It will allow us to step through the program and observe how everything works at our leisure.

A small driver that puts everything together:

```python
from random import randrange

from src.backtracking import Backtracking, Pos
from src.labyrinth_painter import LabyrinthPainter


def show_and_wait(lab: Backtracking, red: Pos, green: Pos):
    painter.show(lab, red, green)
    LabyrinthPainter.wait()


labyrinth = Backtracking(width=20, height=20)
painter = LabyrinthPainter(labyrinth, size=30, line_width=4)

start = Pos((10,10))
labyrinth.carve(start, show=show_and_wait)
while True:
    red = Pos((randrange(0, 20), randrange(0, 20)))
    green = Pos((randrange(0, 20), randrange(0, 20)))
    if red != green:
        break
painter.show(labyrinth, red=red, green=green)
LabyrinthPainter.keywait()
```

We make ourselves a `labyrinth` instance, and a `painter` instance. We define a starting position in the middle of the field, then start the carver with a callback. The callback will be activated by the `carve()` function with the old position `pos` as red and the new position `np` as green square. Untouched squares will show up in black, and carves squares will be shown in light blue.

In the end we display the final labyrinth, showing two random positions as start and end position. This will work because our labyrinth is an undirected minimal spanning tree of the grid, so any two positions are connected by exactly one path.

## Not recursing

We can rewrite the original `carve()` function to not use recursion. It will look almost the same:

```python
class DepthFirst(Labyrinth):
    """Build a labyrinth using a backtracking algorithm."""

    def carve(self, pos: Optional[Pos] = None, show: Any = None) -> None:
        """carve passages starting at Pos p using iteration and a stack."""
        # Set start position
        if not pos:
            pos = Pos((0, 0))

        # Stackframe:
        # (pos, directions): positions and the directions that still need checking.
        stack = [(pos, self.random_directions())]

        while stack:
            # print(f"{stack=}")
            pos, directions = stack.pop()

            while directions:
                # Consume one direction
                d = directions.pop()

                # Can we go there?
                try:
                    np = self.step(pos, d)
                except ValueError:
                    continue

                if show:
                    show(self, red=pos, green=np)

                # Is the new position np unused?
                if self[np] == 0:
                    # Remove wall
                    self.make_passage(pos, d)
                    # If we still have directions to check, push current position back
                    if directions:
                        stack.append((pos, directions))
                    # In any case, add the new position (and all directions)
                    stack.append((np, self.random_directions()))
                    break  # while directions: -> continue with np
```

Instead of recursing we here have a local stack `stack`. On this stack we put pairs of (pos, directions): For each position we remember the directions at this position that still need checking. We prime this with the starting position and the full list of all four cardinal directions, randomly shuffled.

We then pop us the current work item, and check if there are still directions we have not processed (there are, we just started). We consume one, and try to go there. If this is a legal position to be in, and the position is empty (0), we tear down that wall.

Now we push this position and the remaining directions sans the one we just checked back. Then we add the new position and all four directions properly shuffled on top of that. Finally we `break` out of the `while directions:` loop.

This will move us to the outer loop, where we pop the new position and start working on that one: A depth-first search.

Our `stack` list is not subject to `sys.recursionlimit` and so we can process larger grids. We still use the same amount of memory: we remember the same things. On a 100x100 grid, the theoretical longest possible path is 10000 steps long and that would be the biggest possible stack for that grid.

### See Also

- [Maze Generation: Recursive Backtracking](http://weblog.jamisbuck.org/2010/12/27/maze-generation-recursive-backtracking.html), Jamis Buck, 27-Dec-2010.
- [Basil & Fabian](http://blog.jamisbuck.org/), Jamis Buck, April 2014

- [Code in github](https://github.com/isotopp/labyrinths)