# Hugo port + theme

This branch is for the Hugo port of isotopp.github.io.

The existing site posts have been migrated to the Hugo datamodel.
They can now be found under `content/posts/`.

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

In the project root run `hugo` to build into the `public` directory, or run `hugo server` to run a local copy (and serve it with autorefresh on changes of source files).
