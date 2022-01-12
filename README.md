# Blog of Kristian Köhntopp

[blog.koehntopp.info](https://blog.koehntopp.info).
This is using github pages and Hugo to make a blog.
You can subscribe to the RSS in the blog or to changes
in the repo using github.

If you want something fixed, fork it and submit a PR.

If you do not like the format, clone it and process yourself.

# Now using Hugo

This blog started out as Github Pages, using the default workflow.
The default workflow uses Jekyll, though.
That is a static page generator written in Ruby.
It takes almost 120 seconds to transform the markdown version of the blog into HTML.

The new setup uses Hugo, based on [the workflow on the Hugo pages](https://gohugo.io/hosting-and-deployment/hosting-on-github/).
The theme has been ported and set up by [Pat David](https://github.com/patdavid/), since I do not know any Frontend.
Thanks, Pat and [pixls.us](https://pixls.us/).

# The following instructions are outdated.

The `hugo-bootstrap-bare` has been vendored instead of maintaining it as a submodule.

Original Setup instructions:

If this is being pulled fresh the `hugo-bootstrap-bare` theme needs to be pulled as a git submodule as well.

1. After cloning this repository (or switching to this branch).
1. Pull the `hugo-bootstrap-bare` submodule with:
  ```
  git submodule update --init --recursive
  ```
1. Fetch the assets in the theme:
  ```
  cd themes/hugo-bootstrap-bare/assets
  yarn install (or npm install)
  ```

## Build

In the project root run `hugo` to build into the `public` directory, or run `hugo server` to run a local copy (and serve it with autorefresh  on changes of source files).
