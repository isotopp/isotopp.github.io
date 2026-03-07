---
author: isotopp
date: "2026-03-07T04:05:06Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
  - blog
  - hugo
  - erklaerbaer
  - lang_en
title: "Debug Hugo"
---

Sometimes you want to debug Hugo templates, and yearn for a PHP `var_dump()` like facility.

This is how to do it in Hugo:

- we define a partial `debug-context.html`, which we can call in templates, `{{ partial "debug-context.html" . }}`. The single dot in there is important, it is a parameter, the context.
- we define a shortcode `debug-context.html`, which we can put into a page markdown using `{{</* debug-context */>}}`.

This goes into `layouts/partial/debug-context.html`:

```html
{{- if not hugo.IsServer -}}
{{- return -}}
{{- end -}}

<!-- partial "debug-context.html" . -->
{{- $ctx := . -}}

<div style="margin:2rem 0;padding:1rem;border:1px solid #999;background:#f8f8f8;color:#111;">
	<h2 style="margin-top:0;">Template Debug</h2>

	<h3>Context Type</h3>
	<pre>{{ printf "%T" $ctx }}</pre>

	<h3>Context Dump</h3>
	<pre>{{ debug.Dump $ctx }}</pre>

	{{- with $ctx.Params }}
	<h3>.Params</h3>
	<pre>{{ debug.Dump . }}</pre>
	{{- end }}

	{{- with $ctx.Site }}
	<h3>.Site Type</h3>
	<pre>{{ printf "%T" . }}</pre>

	<h3>.Site.Params</h3>
	<pre>{{ debug.Dump .Params }}</pre>

	{{- with .Menus }}
	<h3>.Site.Menus</h3>
	<pre>{{ debug.Dump . }}</pre>
	{{- end }}

	{{- with .Data }}
	<h3>.Site.Data</h3>
	<pre>{{ debug.Dump . }}</pre>
	{{- end }}
	{{- end }}

	{{- with $ctx.Page }}
	<h3>.Page</h3>
	<pre>{{ debug.Dump . }}</pre>
	{{- end }}

	<h3>Common Fields</h3>
	<pre>
Title: {{ printf "%[1]v (%[1]T)" $ctx.Title }}
Kind: {{ printf "%[1]v (%[1]T)" $ctx.Kind }}
Type: {{ printf "%[1]v (%[1]T)" $ctx.Type }}
Section: {{ printf "%[1]v (%[1]T)" $ctx.Section }}
Layout: {{ printf "%[1]v (%[1]T)" $ctx.Layout }}
Permalink: {{ printf "%[1]v (%[1]T)" $ctx.Permalink }}
RelPermalink: {{ printf "%[1]v (%[1]T)" $ctx.RelPermalink }}
  </pre>
</div>
```

We also define a shortcode that calls the partial in `layouts/shortcodes/debug-context.html:

```html
{{- partial "debug-context.html" .Page -}}
```

And we can then put this into any of our pages:

```markdown
{{</* debug-context */>}}
```
