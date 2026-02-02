Fix Hugo post bundles by copying missing image references, deduplicating tags,
and flattening year/month image paths.

Dry run:

```sh
uv run fixup --root content/posts --content content
```

Apply changes:

```sh
uv run fixup --apply --root content/posts --content content
```
