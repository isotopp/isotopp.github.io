---
author: isotopp
title: "MySQL: Flag Codes from Country Codes"
date: "2025-09-05T05:06:07Z"
feature-img: assets/img/background/mysql.jpg
toc: true
tags:
- lang_en
- database
- mysql
aliases:
  - /2025/09/05/mysql-flag-codes-from-country-codes.md.html
---

[Regional Indicator Symbols](https://en.wikipedia.org/wiki/Regional_indicator_symbol) 
in Unicode are the codes starting at `U+1F1E6 ` to `U+1F1FF`.
If you combine two of them in a valid [ISO-3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) codes,
they produce the flag corresponding to that code. 

We want a function `flag_emoji()` that takes such a two-letter code and emits the appropriate Unicode codepoint:

```console
SELECT flag_emoji('GB') AS gb, flag_emoji('us') AS us, flag_emoji('de') AS de \G
gb: 🇬🇧
us: 🇺🇸
de: 🇩🇪
1 row in set (0.00 sec)
```

# MySQL

For that, we define a helper function `unichar()` that makes us a Unicode character from a codepoint (`INT`),
using the Unicode algorithm and `UNHEX()` plus `CONVERT()`.

```mysql
-- Make sure your session speaks utf8mb4
SET NAMES utf8mb4;

-- helper: convert a Unicode code point to a utf8mb4 string using raw bytes
DELIMITER //

DROP FUNCTION IF EXISTS unichar//
CREATE FUNCTION unichar(cp INT)
RETURNS VARCHAR(4) CHARSET utf8mb4
DETERMINISTIC
BEGIN
  DECLARE b1 INT; DECLARE b2 INT; DECLARE b3 INT; DECLARE b4 INT;

  IF cp <= 0x7F THEN
    SET b1 = cp;
    RETURN CONVERT(UNHEX(LPAD(HEX(b1),2,'0')) USING utf8mb4);

  ELSEIF cp <= 0x7FF THEN
    SET b1 = 0xC0 | (cp >> 6);
    SET b2 = 0x80 | (cp & 0x3F);
    RETURN CONVERT(CONCAT(
      UNHEX(LPAD(HEX(b1),2,'0')),
      UNHEX(LPAD(HEX(b2),2,'0'))
    ) USING utf8mb4);

  ELSEIF cp <= 0xFFFF THEN
    SET b1 = 0xE0 | (cp >> 12);
    SET b2 = 0x80 | ((cp >> 6) & 0x3F);
    SET b3 = 0x80 | (cp & 0x3F);
    RETURN CONVERT(CONCAT(
      UNHEX(LPAD(HEX(b1),2,'0')),
      UNHEX(LPAD(HEX(b2),2,'0')),
      UNHEX(LPAD(HEX(b3),2,'0'))
    ) USING utf8mb4);

  ELSE
    SET b1 = 0xF0 | (cp >> 18);
    SET b2 = 0x80 | ((cp >> 12) & 0x3F);
    SET b3 = 0x80 | ((cp >> 6) & 0x3F);
    SET b4 = 0x80 | (cp & 0x3F);
    RETURN CONVERT(CONCAT(
      UNHEX(LPAD(HEX(b1),2,'0')),
      UNHEX(LPAD(HEX(b2),2,'0')),
      UNHEX(LPAD(HEX(b3),2,'0')),
      UNHEX(LPAD(HEX(b4),2,'0'))
    ) USING utf8mb4);
  END IF;
END//
DELIMITER ;
```

We can now use that to produce regional indicators from normal ASCII:

```mysql
-- flag function, idempotent create
DELIMITER //
DROP FUNCTION IF EXISTS flag_emoji//
CREATE FUNCTION flag_emoji(cc VARCHAR(2))
RETURNS VARCHAR(8) CHARSET utf8mb4
DETERMINISTIC
BEGIN
  DECLARE base INT DEFAULT 127462; -- U+1F1E6 REGIONAL INDICATOR LETTER A
  IF cc IS NULL OR cc NOT REGEXP '^[A-Za-z]{2}$' THEN
    RETURN NULL;
  END IF;

  RETURN CONCAT(
    unichar(base + ASCII(UPPER(SUBSTRING(cc,1,1))) - ASCII('A')),
    unichar(base + ASCII(UPPER(SUBSTRING(cc,2,1))) - ASCII('A'))
  );
END//
DELIMITER ;
```

Test this code:

```mysql
-- test
SELECT flag_emoji('GB') AS gb, flag_emoji('us') AS us, flag_emoji('de') AS de\G
```

# Postgres

```postgresql
-- Requires database encoding UTF8
CREATE OR REPLACE FUNCTION flag_emoji(code text)
RETURNS text
LANGUAGE sql
IMMUTABLE
STRICT
PARALLEL SAFE
AS $$
  SELECT CASE
    WHEN code ~ '^[A-Za-z]{2}$' THEN
      -- U+1F1E6 (decimal 127462) is the Regional Indicator "A"
      chr(127462 + ascii(upper(substr(code, 1, 1))) - 65) ||
      chr(127462 + ascii(upper(substr(code, 2, 1))) - 65)
    ELSE NULL
  END;
$$;

-- Example
SELECT
  flag_emoji('GB') AS gb,
  flag_emoji('us') AS us,
  flag_emoji('de') AS de;
```

and test with

```postgresql
SELECT flag_emoji('GB') AS gb, flag_emoji('us') AS us, flag_emoji('de') AS de;
```

Postgres does not need the helper function to work around the `CONVERT()` issues that MySQL has.
