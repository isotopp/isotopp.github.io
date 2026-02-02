---
author: isotopp
date: "2024-09-28T04:05:06Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
- lang_de
- web
- hugo
title: "Details in Hugo"
aliases:
  - /2024/09/28/details-in-hugo.html
---

Ich habe ja seit circa 2000 kein Frontend mehr gemacht.

# `<details />`

Heute habe ich also gelernt, 
dass es ein [`<details>`](https://wiki.selfhtml.org/wiki/HTML/Elemente/details)-Element gibt.
Das ist ein Element, das zusammengeklappt gerendert wird, und das man Aufklappen kann, um den Inhalt zu enthüllen.

Der Teil von `<details>`, der zusammengeklappt sichtbar ist, heißt [`<summary>`](https://wiki.selfhtml.org/wiki/HTML/Elemente/summary).

Nach der Summary kann dann beliebig viel "flow-content" kommen, also ein oder mehr `<div>` zum Beispiel.

# Shortcodes

Ich will das nun in Hugo nutzen können, ohne daß ich HTML tippen muss.
Dazu kann ich in Hugo einen Shortcode `reveal` definieren, den ich dann als `{{</* reveal */>}}` aufrufen kann.
Ein vordefinierter Shortcode, der hier im Blog laufend verwendet wird, ist zum Beispiel `{{</* relref */>}}`.

Dazu lege ich `./layouts/shortcodes/reveal.html` mit folgendem Inhalt an:

```html
<details class="reveal">
	<summary class="reveal">{{ .Get "question" }}</summary>
	<div class="reveal">{{ .Inner | markdownify }}</div>
</details>
```

und verwende das in der Form

```html
{{</* reveal question="Was ist los?" */>}}
Nix.
{{</* /reveal */>}}
```

mit dem Ergebnis:

{{< reveal question="Was ist los?" >}}
Nix.
{{< /reveal >}}

Dazu kommt noch Styling:

```css
.reveal {
  margin-bottom: 1em;

  summary {
    cursor: pointer;
    color: #3d80bb;
    padding: 0.5em;
    background-color: #f5f5f5;
  }

  div {
    margin-top: 0.5em;
    padding: 0.5em;
    background-color: #fafafa;
  }

  summary:hover {
    background-color: #e0e0e0;
  }
}
```

Auf diese Weise lassen sich lange optionale Inhalte rendern ohne den Artikel zu unübersichtlich zu machen.
