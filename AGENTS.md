# AGENTS

## What This Repo Is
- Static blog for https://blog.koehntopp.info built with the Hugo static site generator using the vendored `hugo-bootstrap-bare` theme (see `themes/hugo-bootstrap-bare`).
- Local dev is done with `hugo serve -D -E -F` (per maintainer instructions);
- Production builds to github pages are gone using the `.github/workflows/gh-pages.yml` workflow. The workflow consumes the `main` branch and produce output that is checked into `gh-pages` and then deployed.
- Content authors manually maintain `content/posts`, `content/assets`, and `static/uploads`; never touch these paths when making code/theme changes.
- `resources/` holds Hugo’s cached/compiled pipeline outputs—treat it as build artefacts.

## Layout & Templates
- Site-specific layout overrides live under `layouts/`. Key templates: `_default/baseof.html` wires partials, `single.html`/`taxonomy.html`/`rss.xml`, and `_default/search.html` for the Lunr UI.
- Partial overrides in `layouts/partials/` customize CSS compilation, metadata (`head-meta.html` adds RSS feeds + social tags), footer, navbar, and JavaScript loading (`javascript.html`).
- Markdown rendering tweaks rely on the theme’s `_default/_markup/render-heading.html|render-link.html|render-image.html`.
- Only shortcode currently defined is `layouts/shortcodes/reveal.html` (a `<details>`/`<summary>` accordion fed via `question=` and inner Markdown).

## Styling (Sass/CSS)
- Hugo’s asset pipeline compiles `assets/sass/main.scss` via `layouts/partials/css.html`. It injects Bootstrap’s SCSS include path (`themes/hugo-bootstrap-bare/assets/node_modules/bootstrap/scss`) and fingerprints the result; dev builds keep source maps, production minifies.
- `assets/sass/main.scss` overrides Bootstrap tokens (primary color, font stack) and imports `syntax.scss` (custom Chroma theme) plus `fonts.scss` (self-hosted Source Sans Pro pointing to `static/assets/fonts/...`).
- Keep Sass ASCII-only unless fonts require otherwise; additional partials belong in `assets/sass/` so Hugo picks them up automatically.

## JavaScript & Search
- Browser JS entrypoint is `assets/js/app.js`. Hugo treats it as a template (see `layouts/partials/javascript.html`), so it can use Go template expressions like `{{ "index.json" | absURL }}` when needed.
- Search is entirely client-side using Lunr: the JS fetches `/index.json`, debounces input, fuzzifies the query, and renders results into `#results`. Form markup is in `layouts/_default/search.html`.
- Search index source is `themes/hugo-bootstrap-bare/layouts/_default/index.json`, which iterates `Site.RegularPages` and emits title/tags/categories/content/href/date.
- Vendor scripts are pulled straight from the vendored `node_modules` directory via Hugo’s asset pipeline: Bootstrap (`/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js`), Lunr (`/node_modules/lunr/lunr.js`), and Mermaid (`/node_modules/mermaid/dist/mermaid.min.js`) are concatenated/fingerprinted before being served.

## JavaScript/Sass Dependencies
- Theme-level `themes/hugo-bootstrap-bare/assets/package.json` lists the npm deps: `bootstrap`, `lunr`, and `mermaid`; the repo already commits the corresponding `node_modules` and `yarn.lock`, so no package install step runs during build.
- When bumping dependencies you must manually run `yarn install` **inside** `themes/hugo-bootstrap-bare/assets` and commit the refreshed `node_modules` tree so Hugo’s `resources.Get` calls continue to work offline on CI.

## Static Assets
- `static/` is served verbatim; notable contents are `static/assets/img/*` hero/backdrop images, `static/assets/fonts` for Source Sans Pro, Bootstrap icons sprite (`bootstrap-icons.svg`), and `CNAME`.
- Anything new placed in `static/` bypasses the Hugo pipeline, so prefer `assets/` when you need fingerprinting or templating.

## Configuration Notes
- Global settings live in `config.yaml` (permalinks, menus, taxonomy, pagination, output formats). Home outputs include JSON specifically for search.
- Authors are enumerated under `params.author`. `head-meta.html` expects `feature-img`, `description`, and `author` front matter values for social meta tags.
- Goldmark configuration enables `unsafe: true`, so shortcodes/Markdown can emit raw HTML; be cautious when editing Markdown render hooks or adding user-generated content.

# JavaScript Dependency Status & Refresh Plan

(as of 2026-Feb-08, remind the user to run a check at least once a month, and then perform it when authorized)

Checked from `themes/hugo-bootstrap-bare/assets` with `npm outdated` (no network errors) and found no outdated packages.

| Package   | Current | Latest | Needs Update? |
|-----------|---------|--------|---------------|
| bootstrap | 5.3.3   | 5.3.3  | No            |
| lunr      | 2.3.9   | 2.3.9  | No            |
| mermaid   | 11.12.2 | 11.12.2| No            |

Because everything is current, no refresh is required right now. Should a new release appear, follow the plan below for each dependency that becomes outdated:

1. **Update version spec** in `themes/hugo-bootstrap-bare/assets/package.json` (e.g. bump `bootstrap` from 5.3.3 → 5.3.x or whatever the new tag is).
2. **Install dependencies** within `themes/hugo-bootstrap-bare/assets` using `yarn install --check-files` (preferred to keep `yarn.lock` in sync) or `npm install`.
3. **Verify vendored output**: ensure `themes/hugo-bootstrap-bare/assets/node_modules/...` reflects the new version (e.g. check `package.json` inside each module).
4. **Rebuild the Hugo asset pipeline** locally via `hugo serve -D -E -F` and watch the console for SASS/JS warnings caused by upstream changes.
5. **Smoke test search + bootstrap + mermaid components** in the running site (Lunr index fetch, navbar, modals, Mermaid diagrams, etc.).
6. **Commit** the updated `package.json`, `yarn.lock`, and the vendored `node_modules` subtree so GitHub Pages (which does not run npm install) continues to have the bundles available.

Document any breaking changes from upstream in `AGENTS.md` for the next maintainer.

## Quick Start for Future Agents
1. Run `hugo serve -D -E -F` at the repo root for live previews; rebuild with `hugo` before pushing if you want to sanity-check the static output locally.
2. Leave `content/posts`, `content/assets`, and `static/uploads` untouched—coordinate with the human editors if you need data changes there.
3. Adjust styling in `assets/sass/` (not the theme’s copy) and JS in `assets/js/`; Hugo automatically takes care of bundling via the overridden partials.
4. Template changes belong under `layouts/` so they override the theme cleanly; if you don’t find a partial there, check the theme directory before adding duplicates.
5. Keep Git submodules (the theme) intact; if you update them, ensure `themes/hugo-bootstrap-bare` stays in sync and that GitHub Pages builds still run with submodules enabled.
