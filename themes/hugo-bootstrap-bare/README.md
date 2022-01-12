# hugo-bootstrap-bare

A minimal bootstrap v4 theme for Hugo.

This theme was designed to run using only `hugo` and `yarn`. Javascript and SCSS are compiled using hugo's pipeline feature.


## Installation

Generally you'll want to include this theme as a git submodule in your project.
From your project root directory you can clone this theme into your themes/ directory:

```
git clone -b bootstrap5 --single-branch git@gitlab.com:pixlsus/hugo-bootstrap-bare.git themes/hugo-bootstrap-bare
```

(`-b bootstrap5` clones that specific branch and `--single-branch` only gets that branch and doesn't fetch all the others as well.)

Set it as the theme in your `config.{toml|yaml}`.


## Fetching assests

To fetch the assests:

```
cd assets
yarn install
```

## Site Search

`lunr.js` in the bundle to provide search functionality. In the `/content` folder you need to add a search page:

```
---
title: 'Search'
layout: 'search'
menu: 'main'
---
```

The important bit is `layout: 'search'`, which calls the search template.
