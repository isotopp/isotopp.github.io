---
author: isotopp
title: "Modernizing the blog publishing workflow"
date: "2026-03-25T03:04:05Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
  - lang_en
  - blog
  - hugo
  - devops
---

I have been cleaning up the publishing workflow for this blog.

The old setup still worked, but it was clearly from an earlier GitHub Actions era: one single deploy job, `peaceiris/actions-hugo@v2` to install Hugo, and `peaceiris/actions-gh-pages@v3` to push the generated site.
That got the job done, but it also meant that the workflow was tied to third-party actions, hidden runtime assumptions and a deployment model that GitHub Pages itself no longer prefers.

# Switching to the GitHub Pages workflow

The workflow now uses the native GitHub Pages action chain instead:

- `actions/checkout@v6`
- `actions/setup-node@v6`
- `actions/configure-pages@v5`
- `actions/upload-pages-artifact@v3`
- `actions/deploy-pages@v4`

Hugo and Dart Sass are installed directly, with pinned versions, instead of being delegated to `peaceiris/actions-hugo`.
That makes the workflow more explicit: the CI configuration now says exactly which versions of Hugo, Sass and Node are expected, and how they arrive on the runner.

This also changes the shape of the pipeline.
The old workflow had one job that did checkout, tool setup, build and deploy in sequence.
The new one splits this into a `build` job and a `deploy` job.
On pull requests, the site is built but not deployed.
On `main`, the built `public/` directory is uploaded as a Pages artifact and then deployed by the official Pages action.

That is a better fit for how GitHub Pages wants to work in 2026.
It also means permissions are narrower and more obvious: `contents: read`, `pages: write`, `id-token: write`.
I also moved Hugo image caching into `:cacheDir`, and then cached that directory in Actions, so repeated builds have a place to keep expensive generated artefacts.

# Leaving `peaceiris` behind

The move away from `peaceiris` is not cosmetic.

Both `peaceiris/actions-hugo@v2` and `peaceiris/actions-gh-pages@v3` still declare `runs.using: node16` in their action metadata.
That is an old runtime, and relying on old embedded Node runtimes in third-party actions is exactly the sort of thing that comes back to bite you later.

By switching to the official Pages actions and adding an explicit `actions/setup-node@v6`, the workflow now controls its Node runtime directly.
The current workflow pins `NODE_VERSION: 24.14.0`.
Even though this blog vendors its frontend dependencies and does not do an `npm install` during CI, having Node be explicit and current is still the right thing to do.

In other words: the Node problem is gone not because Node disappeared, but because it stopped being implicit.

# The shallow checkout matters more than the rest

The first modernization pass still kept `fetch-depth: 0` on checkout.
That was inherited from older Hugo advice: fetch the entire history so features such as `.GitInfo` and `.Lastmod` can inspect it.

For this site, that turned out not to be necessary.
The workflow was pulling the entire repository history, including submodules, to build a static site that only needs the current tree.

The old checkout logs are fairly rude about this.
One of the runs fetched `654719` objects and transferred roughly `999 MiB` before even getting to the actual build.
That is a lot of work for a site whose Hugo build itself takes about a dozen seconds.

Changing checkout from `fetch-depth: 0` to `fetch-depth: 1` removed that waste immediately.

# Timing comparison

These are the three relevant workflow runs from today:

| Workflow state                                 | Commit                            | Total runtime |
|------------------------------------------------|-----------------------------------|---------------|
| Legacy `peaceiris` workflow                    | `Fix links`                       | `3m20s`       |
| Official Pages workflow, full history checkout | `modernize github pages workflow` | `3m29s`       |
| Official Pages workflow, shallow checkout      | `speed up pages checkout`         | `1m29s`       |

And this is where the time went:

| Step                | Legacy workflow | New workflow, `fetch-depth: 0` | New workflow, `fetch-depth: 1` |
|---------------------|----------------:|-------------------------------:|-------------------------------:|
| Checkout            |         `2m38s` |                        `2m19s` |                          `11s` |
| Build site          |           `11s` |                          `12s` |                          `12s` |
| Publish/deploy work |           `18s` |                          `36s` |                          `37s` |
| End-to-end runtime  |         `3m20s` |                        `3m29s` |                        `1m29s` |

So the conclusion is very simple:

- switching to the official GitHub Pages workflow makes the pipeline cleaner and more future-proof,
- switching away from `peaceiris` removes the stale Node 16 dependency,
- but the actual speed win comes almost entirely from shallow checkout.

Checkout time dropped from roughly two and a half minutes to eleven seconds.
End-to-end runtime was cut by a bit more than half.
The Hugo build itself did not meaningfully change; the repository fetch was the bottleneck all along.
