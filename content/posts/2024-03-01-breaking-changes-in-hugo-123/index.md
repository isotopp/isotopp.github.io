---
author: isotopp
title: "Breaking Changes in Hugo 123"
date: "2024-03-01T05:06:07Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
- lang_en
- hugo
aliases:
  - /2024/03/01/breaking-changes-in-hugo-123.html
---

I had my GitHub pipeline for this blog running with `latest`.
Recently, that broke.

Checking on the reasons for that, I found that I ran into two breaking changes:

- Incomplete date specifications are now an error.
- Slightly more typesafe date handling from front matter.
- Hugo switches the page reference model to logical paths, breaking `ref` and `relref` shortcodes with `REF_NOT_FOUND`.

This is easily fixed with two mass commits.

# Incomplete date specifications are now an error

In my front matter, I have code such as this:

```yaml {hl_lines="3"}
author: isotopp
title: "Breaking Changes in Hugo 123"
date: "2024-03-01T05:06:07Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
- lang_en
- hugo
```

There were quite a number of instances where the date code in question was incomplete, missing seconds.
Previous versions of Hugo accepted this, Hugo 0.123 rejects it correctly.
I had to scan through the entire repo, and add `:00` seconds to fix this.

# Hugo switches the page reference model to logical paths

The definition of a logical path is [here](https://gohugo.io/getting-started/glossary/#logical-path).
A longer explainer is [here](https://gohugo.io/methods/page/path/).

It basically is the page or resource identifier, without extension and language identifier,
converting to lower-case, and replacing spaces with hyphens.
This can have surprising results with page bundles 
(directories that are seen as pages, containing an `index.md` and images).

In my particular case, the easiest fix was to move from
```console
ref "/content/posts/2024-03-01-2024-03-01-breaking-changes-in-hugo-123.md"
```
to
```console
relref "2024-03-01-breaking-changes-in-hugo-123.md"
```
which is less ambiguous and easier to type.
