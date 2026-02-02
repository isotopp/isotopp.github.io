This package contains a CLI to migrate Hugo posts into leaf bundles and copy
referenced `/uploads` assets into the bundle directories.

Usage (dry run by default):

```sh
uv run migration --source content/posts --uploads static/uploads --dest content/posts-bundles
```

Apply changes:

```sh
uv run migration --apply --source content/posts --uploads static/uploads --dest content/posts-bundles
```

Move assets (removes them from `static/uploads`):

```sh
uv run migration --apply --move --source content/posts --uploads static/uploads --dest content/posts-bundles
```

The script preserves front matter, adds an `aliases` entry for the old
`/:year/:month/:day/:slug.html` URL (based on the current Hugo permalink
settings), rewrites `/uploads/...` references to bundle-relative paths, and
copies assets into each bundle directory.
