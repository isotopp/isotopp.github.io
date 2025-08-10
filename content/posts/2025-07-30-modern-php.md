---
author: isotopp
date: "2025-07-30T03:04:05Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
- php
- lang_en
title: Modern PHP (7.x)
---

I have not been doing PHP in a long time, and so I am writing this here as a memo to self,
in order to remind me what features are "new" in PHP, with "new" meaning 7.0 and newer.

# Features

| PHP version | Category    | Feature                                                         |
|-------------|-------------|-----------------------------------------------------------------|
| 7.0         | Typing      | declare(strict_types=1) directive                               |
| 7.0         | Typing      | Scalar type declarations                                        |
| 7.0         | Typing      | Return type declarations                                        |
| 7.0         | Operators   | Null coalescing operator (??)                                   |
| 7.0         | Classes     | Anonymous classes                                               |
| 7.0         | Errors      | Throwable and Error hierarchy                                   |
| 7.1         | Typing      | Iterable pseudo-type                                            |  
| 7.1         | Typing      | Nullable types (?type)                                          |
| 7.1         | Typing      | Void return type                                                |
| 7.1         | Classes     | Class constant visibility                                       |
| 7.1         | Errors      | Multi-catch exceptions                                          |
| 7.2         | Classes     | Proper key conversion for casts between object and array        | 
| 7.2         | Errors      | Counting uncountable things is now forbidden                    | 
| 7.2         | Typing      | Object type hint                                                |
| 7.2         | Security    | Cryptography update                                             |
| 7.2         | Syntax      | Trailing commas in `list()`                                     |
| 7.3         | Syntax      | Trailing commas in function calls                               |
| 7.3         | Syntax      | Flexible Heredoc/Nowdoc Syntax                                  |
| 7.3         | Functions   | is_countable()                                                  |
| 7.4         | Typing      | Typed properties                                                |
| 7.4         | Syntax      | Arrow functions (fn())                                          |
| 7.4         | Syntax      | Spread Operator in Array Expression                             | 
| 7.4         | Typing      | Limited Return Type Covariance and Argument Type Contravariance |
| 7.4         | Syntax      | Numeric Literal Separator `_`                                   | 
| 7.4         | Syntax      | Null Coalescing Assignment Operator                             | 
| 7.4         | Classes     | Weak Refs                                                       | 
| 7.4         | Performance | Preloading (Opcache)                                            |
| 7.4         | Syntax      | Lots of Deprecations                                            |  


# 7.0 (2015)

## Strict Types,  Scalar Type Declarations and Return Type Declarations 

```php
#! /opt/homebrew/bin/php
<?php
  declare(strict_typing=1);
  
  function add(int $a, int $b): int {
    return $a + $b;
  }
echo add("30", 3), "\n";
$ php probe.php
PHP Fatal error:  Uncaught TypeError: add(): Argument #1 ($a) must be of type int, string given, called in /Users/kris/probe.php on line 10 and defined in /Users/kris/probe.php:5
```

## ?? - Null Coalescing Operator

A shorthand for `isset()` and offering a default value.

```php
$username = $_GET['user'] ?? 'guest';
// previously
// $username = isset($_GET['user']) ? $_GET['user'] : 'guest';
```

## Anonymous Classes

```php
$logger = new class {
  public function log(string $msg) {
    echo "[LOG] {$msg}\n";
};

$logger>log("Hi!");
```

Useful for throwaway classes, often used in tests.

## Throwable and Error hierarchy, unifying Exceptions and Errors

Adds an Interface `Throwable`, allows you to catch Errors, not just Exceptions.

```php
try {
  throw new Error("Argh!");
} catch (Throwable $e) {
  echo "Caucht {$e->getMessage()}\n";
}
```

# 7.1 (2016)

## Iterable Pseudo-Type

Normally, `Iterable` would be an Interface, and you'd declare the parameter type or return type of a function to be like that.
For historical reasons that wasn't possible, there is `array` for non-objects, and `Traverable` for Objects.
Both can be passed to `foreach`, and their elements can be `yield`'ed.

The keyword `Iterable` is reserved, as is the function name `is_iterable()`.

It can be used like a type in signatures, and unifies these two behaviors.
It is a shortcut for `array|Traversable`.

```php
function iterate_something(iterable $it) {
  foreach ($it as $element) {
    // ...
  }
}

function generate_something(): iterable {
  yield 1;
  yield 2;
  yield 3;
}
```

## Nullable Types, Void Type

Introduces the type prefix `?` as a prefix for the type `t` so that `?t` is short for `t|null`.
So you get

```php
function eight_ball(string $question): ?string { // null if we don't know the answer
   ...
   return null; // allowed
}
```

For return types, a subclass or implementation of an Interface can be stricter, 
that is, remove nullability from the return type.

For parameter types, a subclass or implementation of an Interface may be looser, 
that is, add nullability to a parameter type. 

A function with a nullable type still needs a parameter, there is no `null` default.
It is valid to provide a default value to a nullable parameter, and that default may be `null`.

We also get the `void` return type. In a function declared with `: void`, you may not return a value.
You must use `return;` without a value.
`null` is a value, so `return null;` is invalid for `void` functions.

```php
function no_result(): void {
  return 1; // invalid
}
```

## Short array deconstruction syntax, using keys in list ("to_dict")

You can construct arrays and dicts in PHP with the `array()` constructor, and since 5.4 also with `[ ]`.

```php
$a = array(1, 2, 3);  
  // also $a = [1, 2, 3]
$d = array("one" => 1, "two" => 2, "three" => 3); 
  // also $d = [ "one" => 1, "two" => 2, "three" => 3 ];
```

Deconstruction is possible with `list()`,
and newly added is the use of keys in `list` to convert an array to a dict.

```php
list($a, $b, $c) = $some_array;
list("a" => $a, "b" => $b, "c" => $c) = $some_array // to dict
```

This is now also possible using `[ ]` on the LHS of an assignment.

```php
[ $a, $b, $c ] = $some_array;
[ "a" => $a, "b" => $b, "c" => $c ] = $some_array // to_dict
```

Nested, mixed use of `list()` and `[ ]` is explicitly not allowed.
You can nest, but you must consistently use either one or the other syntax.

## Multiexception

```php
try {
   // Some code...
} catch (ExceptionType1 | ExceptionType2 $e)
```

instead of

```php
try {
   // Some code...
} catch (ExceptionType1 $e) {
   // Code to handle the exception
} catch (ExceptionType2 $e) {
   // Same code to handle the exception
```

## Class Constant Visibility Modifiers

```php
class Token {
  const PUBLIC_CONST = 0; // default is public
  
  private const PRIVATE_CONST = 0;
  protected const PRIVATE_CONST = 0;
  public const PRIVATE_CONST = 0;
}
```

`const` can now use visibility in classes. In Interfaces, they must be `public`.

## Other changes

The variable name `$this` is now reserved and can no longer be used as a parameter,
static variable, global variable, `catch` variable, or `foreach` counter.
It can also no longer be unset, reassigned directly, through `$$` (variable variables)
or through references, through `extract` or `parse_str()`.

Consequently, you can't use `$this` when you are not in an object context.

Negative string offsets now can be used everywhere consistently and will reference glyphs from the right.
The last glyph in a string is at offset `-1`.

# 7.2 (2017)

## Proper Key Conversion for Object/Array Casts

When converting between arrays and objects, keys now follow the same, consistent key-casting rules used by arrays:
- Only int and string keys are allowed.
- Numeric strings become ints ("42" -> 42).
- Floats are truncated to int (1.7 -> 1).
- Booleans become 1/0, null becomes the empty string "".

This mainly affects odd cases when you cast arrays to objects and back,
or when you create properties with unusual names and then cast to an array.

```php
#! /opt/homebrew/bin/php
<?php
$a = ["42" => 'x', 1.7 => 'y', true => 't', null => 'n'];
$o = (object)$a;           // properties named "42", "1", "1", ""
$b = (array)$o;            // keys are re-cast just like array keys

var_export($b);
/* Result: numeric string -> 42, float -> 1, true -> 1, null -> ""
array (
  42 => 'x',
  1 => 'y',   // overwrote true => 1
  '' => 'n',
)*/
```

## Counting Uncountable Things is now forbidden

Calling count() on something that is not an array and not Countable now raises a warning.
Guard your calls, or implement `Countable` on your classes.

```php
#! /opt/homebrew/bin/php
<?php
// Before 7.2 this often silently returned 1 or 0 in odd ways.
// With 7.2 you get a warning:
$x = 123;
var_dump(count($x));  // Warning: count(): Parameter must be an array or an object that implements Countable

$y = new ArrayObject([1,2,3]);
var_dump(count($y));  // 3 (Countable)
```

## Object typehint for parameters and return types

You can now require an object in signatures, without specifying a particular class or interface.

```php
#! /opt/homebrew/bin/php
<?php
declare(strict_types=1);

function touch_object(object $o): object {
    // do something with $o
    return $o;
}

class C {}

var_dump(touch_object(new C()));
```

## Cryptography updates

- allow Argon2 in `password_\*` functions.
- Sane TLS defaults
- Removal of abandoned `mcrypt` extension.
- Add `sodium` as a core extension.


## Trailing commas in `list()`

You can finally add a trailing comma in list() and array destructuring, which makes diffs cleaner.

```php
#! /opt/homebrew/bin/php
<?php
[$a, $b,] = [1, 2];
list($x, $y,) = [3, 4];
var_dump($a, $b, $x, $y);
```

# 7.3 (2018)

## Flexible heredoc/nowdoc indentation

Heredoc and nowdoc syntax became more flexible. 
You can indent the closing identifier and the content will be de‑indented accordingly,
making multi‑line strings easier to embed in indented code.

```php
#! /opt/homebrew/bin/php
<?php
declare(strict_types=1);

function emailBody(string $name): string {
    $indent = "    ";
    $body = <<<MAIL
        Hello $name,
        
        this is an indented heredoc.
        The indentation before the closing marker is ignored.
        
        Regards,
        Admin
        MAIL;
    return $body;
}

echo emailBody("Kris"), "\n";
```

## Trailing commas in function calls

You can add a trailing comma to function and method calls.
This helps with cleaner diffs when adding more arguments.

```php
#! /opt/homebrew/bin/php
<?php
function sum($a, $b, $c) { return $a + $b + $c; }

// Note the trailing comma after the last argument
var_dump(sum(
    1,
    2,
    3,
));
```

## JSON_THROW_ON_ERROR

`json_encode()` and `json_decode()` can now throw `JsonException` 
instead of returning false and setting `json_last_error()`.
\Use the `JSON_THROW_ON_ERROR` flag.

```php
#! /opt/homebrew/bin/php
<?php
declare(strict_types=1);

$broken = "{ invalid json }";
try {
    json_decode($broken, true, 512, JSON_THROW_ON_ERROR);
} catch (JsonException $e) {
    echo "Decoding failed: ", $e->getMessage(), "\n";
}

try {
    $data = ["a" => INF]; // not representable in JSON by default
    json_encode($data, JSON_THROW_ON_ERROR);
} catch (JsonException $e) {
    echo "Encoding failed: ", $e->getMessage(), "\n";
}
```

## is_countable()

A helper to check if a value is countable before calling `count()`.

```php
#! /opt/homebrew/bin/php
<?php
$x = 123;
$y = [1,2,3];

var_dump(is_countable($x)); // false
var_dump(is_countable($y)); // true

if (is_countable($x)) {
    echo count($x), "\n";
}
```

# 7.4 (2019)

## Typed properties

```php
#! /opt/homebrew/bin/php
<?php
declare(strict_types=1);

class Counter {
    public int $count = 0;      // typed property
    private ?string $name = null; // nullable type
}

$c = new Counter();
$c->count = 42;           // OK
$c->name = "demo";        // OK

try {
    // TypeError at runtime (assignment must match declared type)
    $c->count = "not an int";
} catch (TypeError $e) {
    echo $e->getMessage(), "\n";
}
```

## Arrow functions (fn())

Short syntax for anonymous functions.
Automatic access to closure values, and to outer values.

```php
#! /opt/homebrew/bin/php
<?php
declare(strict_types=1);

$factor = 2;
$nums = [1, 2, 3];
$doubled = array_map(fn(int $n): int => $n * $factor, $nums);
print_r($doubled);
// [2, 4, 6]
```

## Spread operator in array expressions

You can unpack arrays into other arrays using `...`.
In PHP 7.4 only arrays with numeric keys can be spread (string keys are supported from 8.1).

```php
#! /opt/homebrew/bin/php
<?php
declare(strict_types=1);

$a = [2, 3];
$b = [1, ...$a, 4];
print_r($b);
// [1, 2, 3, 4]
```

## Limited covariance and contravariance

Return types may be more specific (covariant),
parameter types may be more general (contravariant) in child (subclass) methods.

```php
#! /opt/homebrew/bin/php
<?php
declare(strict_types=1);

class Base {
    public function getIterator(): Traversable { return new ArrayIterator([]); }
    public function setIterator(Iterator $it): void {}
}

class Child extends Base {
    // Return type covariance: Traversable -> Iterator (more specific)
    public function getIterator(): Iterator { return new ArrayIterator([1,2]); }
    // Param type contravariance: Iterator -> Traversable (more general)
    public function setIterator(Traversable $it): void {}
}

$child = new Child();
var_dump(get_class($child->getIterator())); // ArrayIterator
```

## Numeric literal separator `_`

Use underscores in numeric literals for readability.

```php
#! /opt/homebrew/bin/php
<?php
declare(strict_types=1);

$oneMillion = 1_000_000;
$hex = 0xFF_FF;
$bin = 0b1010_1010;
var_dump($oneMillion, $hex, $bin);
```

## Null coalescing assignment operator (??=)

Shorthand to assign a default only if the variable is null or not set.

```php
#! /opt/homebrew/bin/php
<?php
declare(strict_types=1);

$options = [];
$options['timeout'] ??= 30; // sets to 30 because key is not set
$options['timeout'] ??= 10; // keeps 30, because already set and not null
var_dump($options);
```

## Weak references

Hold references to objects that do not prevent their garbage collection.

```php
#! /opt/homebrew/bin/php
<?php
declare(strict_types=1);

$o = new stdClass();
$wr = WeakReference::create($o);

var_dump($wr->get() !== null); // true
unset($o);                      // drop the strong reference
var_dump($wr->get() === null);  // true (target was collected)
```

## Preloading (Opcache)

Allows loading PHP files into Opcache on server startup
so classes/functions are available to all requests without requiring them each time.

- php.ini:

```
opcache.preload=/path/to/preload.php
opcache.preload_user=www-data
```

- preload.php:

```php
<?php
opcache_compile_file(__DIR__ . '/src/Autoload.php');
opcache_compile_file(__DIR__ . '/src/Domain/Model.php');
```

## Deprecations in 7.4 (selection)

- Curly brace array/string offset access: `$str{0}` and `$arr{0}` — use `$str[0]`, `$arr[0]`.
- Nested ternary without explicit parentheses emits a deprecation warning.
- Real type alias `real` is deprecated; use `float`.
- `implode()` parameter order confusion warnings (use implode(string $glue, array $pieces)).

See PHP 7.4 RFCs for the full list: https://wiki.php.net/rfc#php_74
