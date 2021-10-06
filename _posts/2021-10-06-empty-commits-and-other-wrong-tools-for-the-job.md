---
layout: post
title:  'Empty commits and other wrong tools for the job'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2021-10-06 09:46:10 +0200
tags:
- lang_en
- devops
- development
---

[This]( https://twitter.com/akrey/status/1445656529877680129) is how you can make an empty commit:

```console
$ git commit --allow-empty -m "Kick it"
```

This has the disadvantage of also generating a commit message.
[Another way]( https://twitter.com/akrey/status/1445656529877680129) to achieve this seems to be

```console
$ git commit --amend --no-edit && git push -f
```

but that will make people hate you in other ways.

So lets stop and ask:
Why would you want to make an empty commit?

Most people want this because they attached a server-side action to a commit, a CI/CD activity.

# This is wrong

This is wrong in the same way [writing Shell Scripts]({% link _posts/2021-01-05-using-python-to-bash.md %}) is wrong:
It kind of works, but now you have another, worse problem and still no solution to the original problem.

You need to stop and question your life choices, and most importantly, wake up the engineer in you.

## But I need to debug my CI/CD pipeline

Kick it off using the tooling provided to you.
Your environment has an API that is specifically built to enable you to do that.
Use it.

In Gitlab:
[Triggering pipelines through the API ](https://docs.gitlab.com/ee/ci/triggers/)

In GitHub:
[Running a workflow using the REST API](https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow#running-a-workflow-using-the-rest-api)

This not only works reliably, you can get proper error messages.
On top of that, you just did *not* pee into your commit history.

## But I need to redeploy, because I need a Terraform run after I just lost an instance

This is fractally broken, there is breakage in your breakage.

The proper solution is a reconciliation loop of the kind Kubernetes has: Measure the existing state and compare it to the desired state. Then execute the actions necessary to transform the measured state into the desired state, in a loop. 

So if you are not on K8s, you need to move to K8s or re-invent K8s for your environment, badly.
Yes, Terraform, Harness and friends have it all wrong.

Erecting infrastructure quickly and portably across backends surely is nice, but assumes a properly functioning declarative environment.
That is an environment where you describe the desired state of the infrastructure and the platform takes care of maintaining that desired state for you.

Most platforms do not work that way.
Some fake it, badly.
For example, nobody uses AWS autoscalers to autoscale, but they surely are useful to protect your instance count.

## The problem inside this problem

And since we are talking about CI/CD pipelines:
Don't YAML them. Don't JSON them. Don't XML them.

All of these things surely are nice to describe static objects that have static properties.
You can successfully use any of them to express the desired state of a thing in a declarative way.

If you see anything that looks like "foreach", "when", "unless" or similar, it's procedural.
These are control structures.
They are part of programming languages.
Which any of these three are decidedly not.

Programming in any of these three is wrong use of tooling, and you should not do it.

- YAML, JSON and XML are for declarative things.
- Python, Go and Rust are for procedural things.
- Bash is for interactive use only.

Use the proper tooling for the job.
Be an engineer.

Otherwise, you'll just get your old bash rsync deployment scripts back, in a harder to debug packaging, and wrapped in conditionals and loops in YAML "syntax".

That is not what progress looks like.
At all.
Shoddy engineering begets pager calls, outages and suffering.


