---
author: isotopp
date: "2025-07-30T06:07:08Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
- php
- lang_en
title: Modern PHP (8.x)
aliases:
  - /2025/07/30/modern-php-2.md.html
---

I have not been doing PHP in a long time, and so I am writing this here as a memo to self,
in order to remind me what features are "new" in PHP, with "new" meaning 7.0 and newer.

Here is the 8.x edition.

# Features

| PHP version | Category    | Feature                                             |
|-------------|-------------|-----------------------------------------------------|
| 8.0         | Syntax      | Named arguments                                     |
| 8.0         | Classes     | Attributes (annotations)                            |
| 8.0         | Syntax      | Constructor property promotion                      |
| 8.0         | Typing      | Union types                                         |
| 8.0         | Syntax      | Nullsafe operator (?->)                             |
| 8.0         | Errors      | throw as expression                                 |
| 8.0         | Performance | JIT compiler                                        |
| 8.0         | Syntax      | Match expression                                    |
| 8.1         | Typing      | Intersection types (A&B)                            |
| 8.1         | Syntax      | Array unpacking with string keys                    |
| 8.1         | Classes     | Enums                                               |
| 8.1         | Classes     | Readonly properties                                 |
| 8.1         | Syntax      | First-class callable syntax (obj::method(...))      |
| 8.1         | Typing      | never return type                                   |
| 8.1         | Concurrency | Fibers (coroutines)                                 |
| 8.2         | Typing      | Constants in Traits                                 |
| 8.2         | Typing      | true/false/null standalone types                    |
| 8.2         | Functions   | Random extension (Randomizer API)                   |
| 8.2         | Security    | #[SensitiveParameter] attribute                     |
| 8.2         | Typing      | Readonly classes                                    |
| 8.2         | Typing      | Disjunctive Normal Form types (DNF)                 |
| 8.3         | Classes     | Typed class constants                               |
| 8.3         | Typing      | Explicit callables                                  |
| 8.3         | Syntax      | #[Override] attribute                               |
| 8.3         | Functions   | json_validate()                                     |
| 8.4         | Typing      | Autovivification support                            |
| 8.4         | Classes     | Property hooks (__get/__set override without magic) |
| 8.4         | Syntax      | Asymmetric visibility (get/set modifiers)           |
| 8.4         | Functions   | array_find(), array_first(), array_last()           |
| 8.5         | Syntax      | Closures and callables in constant expressions      |
| 8.5         | Syntax      | Pipe operator \|>                                   |
| 8.5         | CLI/Debug   | Fatal error backtraces                              |
| 8.5         | Attributes  | #[NoDiscard]                                        |



# 8.0 (2020)

## Named arguments

```php
#! /opt/homebrew/bin/php
<?php
declare(strict_types=1);

function greet($name, $title = 'Mr', $punctuation = '!') {
    echo "Hello, {$title} {$name}{$punctuation}\n";
}

greet(name: "Kris", punctuation: "!!");
$ php probe.php
Hello, Mr Kris!!
```

## Attributes (annotations)

Instead of docstrings, you can now use Attributes, a structured way to add metadata to classes,
functions, methods, and properties.
Attributes are first-class language constructs, so they are parsed by PHP.
They can be accessed through the Reflection API,
making them more reliable and easier to work with than parsing comment blocks.

```php
<?php

#[Attribute]
class Route {
    public function __construct(
        public string $path,
        public array $methods = ['GET']
    ) {}
}

#[Route('/home', methods: ['GET', 'POST'])]
class HomeController {
    public function index() {
        return 'Hello from HomeController';
    }
}

// Using reflection to read attributes:
$reflectionClass = new ReflectionClass(HomeController::class);
foreach ($reflectionClass->getAttributes(Route::class) as $attribute) {
    $routeInstance = $attribute->newInstance();
    echo "Path: {$routeInstance->path}\n";
    echo "Methods: " . implode(', ', $routeInstance->methods) . "\n";
}
```

- Define a class usable as an Attribute using `#[Attribute]`.
- Use the attribute (with parameters) on another class (use `#[Route]` on `HomeController`)
- Use Reflection to extract Attributes (`->getAttributes()` does all the work for us) 

## Constructor property promotion

```php
#! /opt/homebrew/bin/php
<?php
declare(strict_types=1);

class User {
    public function __construct(
        public string $name,
        private int $age,
    ) {}
}

$u = new User("Kris", 57);
print_r($u);
$ php probe.php
User Object
(
    [name] => Kris
    [age:User:private] => 57
)
```

This saves writing a lot of boilerplate assignments of the `$this->name = $name` kind.

## Union types

```php
#! /opt/homebrew/bin/php
<?php
declare(strict_types=1);

function giveInt(?string $future_int): int {
  return (int) $future_int;
}

echo giveInt("30"), "\n";
echo giveInt(null), "\n";
$ php probe.php
30
0
```

This is using `?string` as a shorthand for `string|null`.

## Nullsafe operator (?->)

```php
$ cat probe.php
#! /opt/homebrew/bin/php
<?php
declare(strict_types=1);

class Profile {
  function __construct (public string $name) {}
}

class User {
  function __construct (public ?Profile $profile) {}
}

$profile = new Profile("Kris");
$user = new User($profile);

$user2 = new User(null);

echo "{$user?->profile?->name}\n";
echo "{$user2?->profile?->name}\n";

echo "{$user->profile->name}\n";
echo "{$user2->profile->name}\n";
$ php probe.php
Kris

Kris
PHP Warning:  Attempt to read property "name" on null in /Users/kris/probe.php on line 22

Warning: Attempt to read property "name" on null in /Users/kris/probe.php on line 22
```

Strangely, this is by default only a warning and not a full-blown exception.

## throw as expression

```php
#! /opt/homebrew/bin/php
<?php
declare(strict_types=1);

function requireEnv(string $key): string {
    return $_ENV[$key] ?? throw new RuntimeException("Missing env: $key");
}

// throws immediately if FOO is not set
$foo = requireEnv('FOO');
```

## JIT compiler

PHP 8.0 introduced a JIT (Just-In-Time) compiler in Opcache.
It can speed up CPU-bound code (e.g., numeric loops) but typically doesn’t affect IO-bound web apps much. 
Enable and tune via php.ini (`opcache.enable=1`, `opcache.jit=...`);
behavior is otherwise transparent to userland code.

## Match expression

Match is an expression (it returns a value) with strict comparisons (`===`), 
no fallthrough and no implicit type juggling.
Arms can have multiple comma-separated conditions and can execute expressions.
If nothing matches and there is no `default`, it throws an `UnhandledMatchError`.

```php
#! /opt/homebrew/bin/php
<?php
declare(strict_types=1);

$code = 200;
$message = match ($code) {
    200, 201 => 'OK',
    400 => 'Bad Request',
    404 => 'Not Found',
    500, 502, 503 => 'Server Error',
    default => 'Unknown',
};

echo $message, "\n";
// $ php probe.php
// OK
```

Strict matching (no type juggling):

```php
#! /opt/homebrew/bin/php
<?php
declare(strict_types=1);

$val = '2';
$result = match ($val) {
    2       => 'int two',
    '2'     => 'string two',
    default => 'other',
};

echo $result, "\n";
// $ php probe.php
// string two
```

You can also use it like a concise if/elseif chain with `match (true)`,
because each arm condition is compared strictly to `true`:

```php
#! /opt/homebrew/bin/php
<?php
declare(strict_types=1);

function grade(int $score): string {
    return match (true) {
        $score >= 90 => 'A',
        $score >= 75 => 'B',
        $score >= 60 => 'C',
        default      => 'F',
    };
}

echo grade(82), "\n";
// $ php probe.php
// B
```

If no arm matches and you omit `default`, PHP throws an `UnhandledMatchError`.

# 8.1 (2021)

## Intersection types (A&B)

```php
interface A { public function foo(): void; }
interface B { public function foo(): void; }

function needsAandB(A&B $x): void { $x->foo(); }
```

## Array unpacking with string keys

```php
$a = ['a' => 1];
$b = ['b' => 2];
$c = ['a' => 3];
$merged = ['x' => 0, ...$a, ...$b, ...$c]; // later entries overwrite earlier ones
```

## Enums

```php
enum Status: string { case Open = 'open'; case Closed = 'closed'; }

function isOpen(Status $s): bool { return $s === Status::Open; }
```

## Readonly properties

```php
class Point { public function __construct(public readonly int $x, public readonly int $y) {} }
$p = new Point(1,2);
// $p->x = 3; // Error
```

## First-class callable syntax (obj::method(...))

```php
class Greeter { public function hi(string $n): string { return "Hi, $n"; } }
$g = new Greeter();
$cb = $g->hi(...); // callable to instance method
echo $cb('Kris');
```

## never return type

```php
function fail(string $msg): never { throw new RuntimeException($msg); }
```

## Fibers (coroutines)

```php
$f = new Fiber(function(): void { Fiber::suspend('hello'); });
$val = $f->start(); // 'hello'
$f->resume();
```

# 8.2 (2022)

## Constants in Traits

```php
trait T { public const VERSION = 1; }
class C { use T; }
echo C::VERSION; // 1
```

## true/false/null standalone types

```php
function ok(): true { return true; }
function maybe(): null { return null; }
```

## Random extension (Randomizer API)

```php
$r = new \Random\Randomizer();
echo $r->getInt(1, 6), "\n"; // uniform int in [1,6]
```

## #[SensitiveParameter] attribute

```php
function login(#[SensitiveParameter] string $password): void {}
// Sensitive parameters are redacted from stack traces and error logs.
```

## Readonly classes

```php
readonly class Config { public function __construct(public string $dsn) {} }
```

## Disjunctive Normal Form types (DNF)

```php
function f((A&B)|(C&D) $x): void {}
```

# 8.3 (2023)

## Typed class constants

```php
class X { public const int LIMIT = 10; }
```

## Explicit callables

```php
function handler(int $x): void {}
$cb = Closure::fromCallable('handler');
```

## #[Override] attribute

```php
class Base { public function foo(): void {} }
class Child extends Base { #[Override] public function foo(): void {} }
```

## json_validate()

```php
if (json_validate('{"a":1}')) { /* valid */ }
```

# 8.4 (2024)

## Autovivification support

Arrays now autovivify on nested assignments in more cases (e.g., `$a['x']['y'][] = 1;` without prior checks).

## Property hooks (__get/__set override without magic)

Property access can define inline get/set hooks on a property without global magic methods.

```php
class User {
    public string $name {
        get => $this->name;
        set => $this->name = trim($value);
    }
}
```

## Asymmetric visibility (get/set modifiers)

```php
class Counter {
    public int $value { get; private set; }
}
```

## array_find(), array_first(), array_last()

```php
$xs = [1,2,3];
array_first($xs); // 1
array_last($xs);  // 3
array_find($xs, fn($v) => $v % 2 === 0); // 2
```

# 8.5 (2025)

## Closures and callables in constant expressions

Allows using closures/callables in const contexts
(e.g., as default values in attributes or constants where evaluated at compile time if possible).

## Pipe operator (|>)

```php
function trimToInt(string $s): int { return (int) trim($s); }

$result = " 42 " |> trimToInt($$);
```

## Fatal error backtraces

Fatal errors now include backtraces to aid debugging (CLI and logs).

## #[NoDiscard]

Marks a function/method return value as important; discarding it can trigger a warning.
