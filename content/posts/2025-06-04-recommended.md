---
author: isotopp
date: "2025-06-04T04:05:06Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: false
tags:
  - lang_en
  - ai
  - advertising
title: "Recommended"
---

[France forces TikTok to ban #SkinnyTok but harmful content still persists](https://www.europesays.com/uk/156725/).

> Under pressure from the French government, TikTok has banned the hashtag #SkinnyTok,
> a controversial trend linked to the glorification of extreme thinness and unhealthy weight-loss advice. 

Tiktok bans many words and tags.
People notice and work around it.

Babbel: [How Censorship Is Creating A New TikTok Language](https://www.babbel.com/en/magazine/tiktok-language)

> From here, people will always find ways to use language that allows them to get around auto-censorship.
> Whether anyone will be saying “cornucopia” or “nip nops” a decade from now is anyone’s guess,
> though it’s probably unlikely.
> Still, certain terms could stand the test of time if they fill a specific need.
> If social media companies keep cracking down, however, the terminology will continue to evolve.
> No matter what the barrier to communication put in place is,
> language (and the people who use it) will find a way through.

In face, language matters even less.

LLMs encode the meanings of terms as vectors along many semantic dimensions in a semantic space ("latent space").
A concept, then, is a position in that space with a certain diameter — a kind of fuzziness or vagueness.

When I type something into ChatGPT or a recommender system, the input is broken down into tokens,
and these tokens are mapped to such vectors.

“I want pizza” becomes:

```python
["I", "want", "pizza", "."]
```

The tokens are then internally mapped to embeddings, vectors that encode meaning. 
So this happens:

```python
“cat” → [0.24, -1.12, 0.58, …]  
“dog” → [0.22, -1.09, 0.60, …]
```

That is, a list of numbers (often normalized between -1 and 1).
But usually there are far more dimensions than shown here — an embedding typically has thousands of dimensions.

The latent space — the semantic space, what things mean — is self-organizing.
That happens during training.
We don’t know what each dimension in the space represents,
but to the LLM it's how it stores things, their meaning and their relation.

The encoding has some kind of meaning.
We can check that:
When we look at the vectors for "man" and "woman"
and for "king" and "queen",
we can substract "man" from "woman" and "king" from "queen"
and compare the difference vectors.
They are almost, but not quite the same –
because the difference between these words to us is almost, but not quite the same, in meaning.

LLMs use these embeddings and their internal model to “compute the next output token.”

Recommender systems use such embeddings to compare vectors
and find things that are similar to the thing we already have.

So a recommender learns everything that’s relevant to a user,
and a modern recommender represents the user through a collection of vectors:

"This user is interested in travel, digital policy, databases, bikes."

These concepts may have other concepts nearby concepts in latent space.
To the model this means they are conceptually related. 

At the same time, the recommender classifies content in the same space,
and can find content that lies close to one of the user’s sub-interests — or content that’s new, but still compatible.

A modern recommender separates a user’s various interests into distinct areas
and can decide what the user is interested in right now —
meaning,
which of the various user interests is currently active.
Then, this time, it might only serve database content, and next time only bike content.

A modern recommender will also deliberately serve content that almost — but not quite —
matches the user’s interests, to test how wide the bubble is around the center of that interest vector.
So a bike session might also include urbanism, city development, and other nearby topics.
The recommender will watch carefully to see what kind of response that triggers —
refining its recommendations based on that feedback.

A modern recommender will also know where the available content clusters are,
and prioritize content that is both relevant to the user and performs well or has current production capacity.
In other words, where user interest and available content overlap well.

And a modern recommender will reevaluate every twenty minutes
(“Pomodoro”, or “method shift” in educational theory) and attempt to shift the theme —
to test whether another known interest can be reactivated.
If that works, the recommender may manage to keep the user active for a longer time,
exposing them to more ads.

That’s how TikTok works.

You can ban a hashtag on TikTok (`#skinnytok`).

But as long as related concepts are marketable and socially accepted — or even demanded — that won’t prevent anything.

As soon as you browse categories like “model,” “weight loss”, “fitness”, "thigh gap", "visible collarbone",
or “slim,” TikTok will slowly and systematically pull you into the same region,
and the end result will be the same.

The actual language, the meaning,
is encoded in the tokens of the latent space of the model, not in the words that are used
(or prohibited).

And the content density in the models coordinate system will gently push things into certain clusters.
If you feed the system with the right interests, you will always drift – relatively quickly even –
into the same neighborhood and then learn their current slang to get there with a single word.

No matter what the word actually is.

A similar example, using GenAI instead of a recommender:

> Draw a superheroine, an Amazon warrior that can fly and deflect bullets,
> running over a battlefield in the first world war."

These 21 words do not say "Wonder Woman", they do not even go near comics, DC, or similar things.

Yet they draw a thousand-dimensional hyberbubble in latent space, the totality of knowledge known to ChatGPT,
and the end result leaves just one choice – produce this blatant copyright violation.

![](/uploads/2025/06/recommender-01.png)

I can trigger content with intent, not even going near the keywords that would be associated with it.

This is how jailbreaks work in LLMs, and that is also how you jailbreak Tiktok bans.
