---
author: isotopp
title: "ChatGPT and Limits"
date: 2022-12-11T06:07:08Z
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- lang_en
- security
---

Like everybody else, I have been playing with ChatGPT from [OpenAI](https://openai.com/).
Specifically, I wanted to test how it could be used as a coding assistant, and what the limits are in terms of size and complexity.

# Code Generation

I have been using the
[Labyrinths]({{< relref "/2021-01-10-labyrinths-in-python.md" >}})
example as a base. My goal was to have ChatGPT write the 
[Labyrinth](https://github.com/isotopp/labyrinths/blob/master/src/labyrinth.py)
class for me.

I did so interactively.

**Kris:**
> Write an empty Python class named Labyrinth

**ChatGPT:**
```python
class Labyrinth:
    pass
```

**Kris:**
> Add code to this class to represent a grid as a list of lists of integers, and store the width and the height of the grid in two appropriately name variables.
> Write a constructor that accepts the width and height as keyword variables defaulting to 10.

**ChatGPT:**
```python
class Labyrinth:
    def __init__(self, width=10, height=10):
        self.width = width
        self.height = height
        self.grid = [[0 for x in range(width)] for y in range(height)]
```

**Kris:**
> Show the code with type markup that could be used by mypy. 

**ChatGPT:**
```python
from typing import List

class Labyrinth:
    def __init__(self, width: int = 10, height: int = 10) -> None:
        self.width: int = width
        self.height: int = height
        self.grid: List[List[int]] = [[0 for x in range(width)] for y in range(height)]
```

**Kris:**
> Add a method `__repr__` to the class returns a representation of the grid for debugging. 

**ChatGPT:**
```python
from typing import List

class Labyrinth:
    def __init__(self, width: int = 10, height: int = 10) -> None:
        self.width: int = width
        self.height: int = height
        self.grid: List[List[int]] = [[0 for x in range(width)] for y in range(height)]

    def __repr__(self) -> str:
        return '\n'.join([''.join([str(cell) for cell in row]) for row in self.grid])
```

**Kris:**
> Given a type
> ```python
> Pos = NewType("Pos", Tuple[int, int])
> ```
> add a `__getitem__` and `__setitem__` method to the class.
> The methods should allow us to use an instance of `Labyrinth` indexed by a `Pos`, and that should end up reading or writing the grid element addressed by the `Pos`.

**ChatGPT:**
```python
from typing import List, Tuple
from types import NewType

Pos = NewType("Pos", Tuple[int, int])

class Labyrinth:
    def __init__(self, width: int = 10, height: int = 10) -> None:
        self.width: int = width
        self.height: int = height
        self.grid: List[List[int]] = [[0 for x in range(width)] for y in range(height)]

    def __getitem__(self, pos: Pos) -> int:
        x, y = pos
        return self.grid[x][y]

    def __setitem__(self, pos: Pos, value: int) -> None:
        x, y = pos
        self.grid[x][y] = value

    def __repr__(self) -> str:
        return '\n'.join([''.join([str(cell) for cell in row]) for row in self.grid])
```

**Kris:**
> Add a predicate `position_valid` to the class that takes a `Pos` as a parameter.
> The predicate is `True` if the `Pos` is valid (each coordinate is positive, and smaller than height or width respectively).

**ChatGPT:**
```python
from typing import List, Tuple
from types import NewType

Pos = NewType("Pos", Tuple[int, int])

class Labyrinth:
    def __init__(self, width: int = 10, height: int = 10) -> None:
        self.width: int = width
        self.height: int = height
        self.grid: List[List[int]] = [[0 for x in range(width)] for y in range(height)]

    def position_valid(self, pos: Pos) -> bool:
        x, y = pos
        return (0 <= x < self.width) and (0 <= y < self.height)

    def __getitem__(self, pos: Pos) -> int:
        x, y = pos
        return self.grid[x][y]

    def __setitem__(self, pos: Pos, value: int) -> None:
        x, y = pos
        self.grid[x][y] = value

    def __repr__(self) -> str:
        return '\n'.join([''.join([str(cell) for cell in row]) for row in self.grid])
```

**Kris:**
> Make sure that all methods only accept valid `Pos` values where appropriate.

**ChatGPT:**
```python
from typing import List, Tuple
from types import NewType

Pos = NewType("Pos", Tuple[int, int])

class Labyrinth:
    def __init__(self, width: int = 10, height: int = 10) -> None:
        self.width: int = width
        self.height: int = height
        self.grid: List[List[int]] = [[0 for x in range(width)] for y in range(height)]

    def position_valid(self, pos: Pos) -> bool:
        x, y = pos
        return (0 <= x < self.width) and (0 <= y < self.height)

    def __getitem__(self, pos: Pos) -> int:
        if not self.position_valid(pos):
            raise IndexError("Invalid position")

        x, y = pos
        return self.grid[x][y]

    def __setitem__(self, pos: Pos, value: int) -> None:
        if not self.position_valid(pos):
            raise IndexError("Invalid position")

        x, y = pos
        self.grid[x][y] = value

    def __repr__(self) -> str:
        return '\n'.join([''.join([str(cell) for cell in row]) for row in self.grid])
```

I was then trying to add cardinal directions as a type, and a predicate to make sure a given `Direction d` is valid, but this is where I lost it.

According to the documentation, ChatGPT has a working memory of about "4000 Tokens" (3000 Words).
It seems as if the code above is about the limit of what it can keep in "mind" at any given point in time.

1000 Tokens cost around 2 ct with the Davinci model, so the above code is worth around 10 ct to 20 ct, or something, with all the iterations.

ChatGPT definitively allows a person with domain knowledge and a basic understanding of how algorithms work to write code in a language they do not understand.
The amount of context that can be held active is limited.

# Code Analysis

Conversely, if you paste the full source of the
[labyrinth.py](https://github.com/isotopp/labyrinths/blob/master/src/labyrinth.py)
file into ChatGPT and ask it what it does, this is the analysis:

> The code defines a `Labyrinth` class that represents a grid-based maze. 
> The maze is stored as a `List` of `Lists` of `int`s.
> Passages in the maze are represented by bit flags (i.e., binary numbers): N=1, E=2, S=4, and W=8.
> When a particular bit is set, it indicates that there is a passage from the current cell into the direction indicated by that bit.
>
> The `Labyrinth` class provides several methods for working with the maze, such as `carve()` for carving out passages in the maze, `position_valid()` for checking if a given position is valid within the bounds of the maze, `direction_valid()` for checking if a given direction is valid, and `random_directions()` for generating a list of random directions.
>
> Additionally, the `Labyrinth` class uses the `typing` module to specify the types of its attributes and parameters, which can make the code easier to read and understand.
> For example, the `width` attribute is defined as having type `int`, and the `carve()` method has a parameter named show with type `Any`, indicating that it can accept any type of value for that parameter.

That is a fair analysis, and as good as it gets from glancing at the source of a single module.

Now, I am adding 
[backtracking.py](https://github.com/isotopp/labyrinths/blob/master/src/backtracking.py)
to the mix, but sans comments, and ask it what happens.

**Kris:**
> If you supply the following class as a `carver` to the `Labyrinth` class, what does this code do?
>
> ```python
> from typing import Optional, Any
> from src.labyrinth import Labyrinth, Pos
> 
> 
> class Backtracking:
>     def carve(self, lab: Labyrinth, pos: Optional[Pos] = None, show: Any = None):
>         if not pos:
>             pos = Pos((0, 0))
> 
>         directions = lab.random_directions()
>         for d in directions:
>             try:
>                 np = lab.step(pos, d)
>             except ValueError:
>                 continue
> 
>             if show:
>                 show(lab, red=pos, green=np)
> 
>             if lab[np] == 0:
>                 lab.make_passage(pos, d)
>                 lab.carve(np, show=show)

**ChatGPT:**
> The `Backtracking` class defines a `carve()` method that uses a backtracking algorithm to generate a maze in a given `Labyrinth` object.
> The method takes a `lab` parameter which is an instance of the `Labyrinth` class, a `pos` parameter which specifies the current position in the maze, and an optional `show` parameter that can be used to display the maze as it is being generated.

And again, this is a correct analysis of the code, in the context of the larger `Labyrinth` class above.

# Continuing the code interview

**Kris:**
> Does Python have a recursion depth limit?

**ChatGPT:**
> Yes, Python has a default recursion depth limit.
> This means that when a function calls itself recursively, the number of times it can do so is limited.
> The default recursion depth limit in Python is typically around 1000 calls, but it can vary depending on the specific implementation and platform.
> If a function exceeds the recursion depth limit, a `RecursionError` will be raised.
> 
> It is possible to change the recursion depth limit in Python by using the `sys.setrecursionlimit()` function.
> For example, the following code sets the recursion depth limit to 2000:
>
> ```python
> import sys
>
> sys.setrecursionlimit(2000)
> ```

ChatGPT has knowledge of the fact that Python has a recursion depth limit, the default value and how to change it.

Let it apply this information to the example:

**Kris:**
> Given this information, what is the longest path the `Backtracking` class above can produce?

**ChatGPT:**
> The length of the longest path that the `Backtracking` class can produce is limited by the default recursion depth limit in Python.
> As mentioned previously, the default recursion depth limit is typically around 1000 calls, but it can vary depending on the specific implementation and platform.
>
> In the case of the `Backtracking` class, the `carve()` method calls itself recursively to generate the maze.
> Therefore, the longest path that the `Backtracking` class can produce is limited to the default recursion depth limit in Python.

That is correct.
The system correctly identified the fact the method calls itself, and how and why it does this.
It then deduces that this is subject to the above limitation, and what the consequence is.

> If the `carve()` method is called with a starting position that is more than 1000 steps away from the end of the maze, it will exceed the recursion depth limit and raise a `RecursionError`.

That is arguably correct, and in a real coding interview would be an invitation to do some hairsplitting, but in general it is not wrong.

# Summary

ChatGPT works very well, if you use it as a way to augment the facilities of a human, that guides it with a purpose and additional domain knowledge.
It seems to be limited in constructive tasks.
I was not able to get beyond the code generation barrier above.

The opposite direction, in which we have it analyze an existing piece of code and interrogate it about its properties works a lot better.

In a real coding interview, on the analytics side this is good enough to pass at least at the lower levels.
On the constructive side, it is more complicated.
