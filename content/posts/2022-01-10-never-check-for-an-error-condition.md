---
author: isotopp
date: "2022-01-10T07:11:35Z"
feature-img: assets/img/background/schloss.jpg
published: true
tags:
- politik
- security
- lang_en
title: "Never check for an error condition you don't know how to handle"
---

This is the english version of an [older text in German]({{< relref "2009-08-21-was-bedeutet-eigentlich-never-check-for-an-error-condition-you-don-t-know-how-to-handle.md" >}})

Computer scientists are weird.
In their science there are a few rules that sound wrong when you hear them first, but make a lot of sense if you think about them.
Some of them are making sense even outside of computer science.

One of those rules is

# Never check for an error condition you don't know how to handle.

When you encounter this the first time that sounds very questionable.
There are known error conditions in my program that I know they can happen, and I should not check for them?

If you read that left to right, that's exactly what it means.
Let's have a look at an example and try to understand what goes on.
Here is a very simple case: I could try to allocate memory from the operating system and that can fails.

```c
char *p = NULL;
if ((p = malloc(someSize)) == NULL) {
    what_now();
}
```

That is a very typical situation.
For example, why does the library function `malloc()` not check itself for `p == NULL`  and handles this case?
Because it does not, I have to do that every time and must not forget that in a single case.

Indeed, most programs have a function `safe_malloc()`, which wraps `malloc()` and more or less looks like the example above.
The point being that each program has their own implementation of ` what_now()`, because the desired behavior is specific to the application and cannot be provided by the library.

One could argue that `malloc()` should internally call a `what_now()`, and each library user would have to provide an implementation for that.
But that would proscribe a certain mode of usage for `malloc()`.
The solution that `malloc()` does not do the check, but only signals the error, is the most flexible solution -- and hence suitable for a library function, because it leaves the choice to the user.
It provides mechanism, but not policy.

**Side thought:** That's one of the main differences between a library and a framework.
Libraries provide mechanism, but do not enforce a policy.
They do not proscribe a default way of working with problems.
Frameworks are opinionated, and have been designed with a specific way of working in mind, and provide policies that are considered default solutions in the context of the framework.

**Side side thought:** Kernel, libraries and frameworks are all infrastructure, and as all infrastructure they are being judged by how they fail.
In this case: What solutions exist to bypass the policy in a framework, if the policy does not fit.
"How can I have queries in [RoR](https://en.wikipedia.org/wiki/Ruby_on_Rails) that bypass [Active Record](https://en.wikipedia.org/wiki/Active_record_pattern)" is one example.
How free of policy is this library?
Is it just a mechanism or is there an obvious or hidden intention, a policy?

A library ideally supplies just a mechanism, but that makes it mandatory for the developer to think about a policy for error handling and how to implement it.
That's a relatively obvious point, but one that in my experience is not taught sufficiently.
If it wasn't, we'd have less bad code in many projects.
And I do not want to limit myself to the tons of toxic PHP-MYSQL that fire queries at a database without checking for errors at all.

The point is rather that a missing policy for error handling requires that you provide one in the application (or at least some minimal standards in the application).
Some programming environments have a name for such an informal construct:
A convention, a contract between library developer and application developer that is informal and not enforced by the mechanisms of the language.
The convention is also often unspoken, or not made explicit enough in the documentation of the library.
And hence taught insufficiently, and then implemented insufficiently.

But you can take the sentence 

# Never check for an error condition you don't know how to handle.

and read it backwards.
What exactly does it mean to handle an error condition?
Specifically, if the error happens, what are our options and what is the desired failure mode?
What is supposed to happen?

Going back to the `malloc()` above:
When that happens, the operating system can't or won't give us more memory.
We don't know why, so we have to assume the worst.
That is: memory is full, nobody gets any memory any more.
In fact, there could be another program that permanently allocates more memory.
So even if we gave memory back to the operating system, we wouldn't get it back when trying to reserve it.

So handling this error means that we already have all memory required to recover from the situation before the error happens.
That's a really complicated situation, and too complicated for most application developers when we force them to think about it.
At the point in time when this happens they are usually busy with completing the non-failing, actually function path of the application before they are ready to turn to failure modes and their code paths.

**Side thought:** This is another main reason for bad code:
We force developers to think about failing code paths at the wrong point in time.
They really want to write programs that work well.
But we shouldn't bother them with failure handling right when they are busy with completing the money earning part of the code.

If we bother devs at the wrong moment in time, we get error handling like this at best:

```c
char *p = NULL;
if ((p = malloc(someSize)) == NULL) {
    exit(ENOMEM); // out of memory error
}
```

Well, at least they checked for an error.
Maybe there are even some ` atexit(3)` handlers stacked that will try to clean up, but did you ever see any of those?

If you see code like this, it is screaming at you "Yes, yes, I know, but I am really busy now with other things. Go away!".

Another common problem is that we need to check for the error at the lowest level, but need more context at the higher levels of our code to handle it properly.
Sometimes there is not even a contract on how errors are being bubbled up to the next layer without losing information.
The interiors of the MySQL codebase used to be a prime example of that.
You could find code that mapped error codes similar to

```c
int errcode = doSomeThing();
switch(errcode) {
  case 1:
  case 2:
  case 3:
    return E_THIS;
    break;
  case 4:
    return E_THAT;
    break;
}
```

This is taking detailed internal error codes and flattens them into larger categories, losing detail.
Sometimes a higher level handler has more context, but no longer sufficient detail to decide what exactly went wrong at the lower layers.

The rule

# Never check for an error condition you don't know how to handle.

means we need to discuss things.

- **Diagnosis:** Capture the error. Formulate a test which at some point in the code checks that we have a problem and distinctively signals which error that is.
- **Policy:** Determine the desired behavior for handling the error, that is, have a policy that explains how to handle the error.
- **Context:** Decide where in the stack the error can be handled best, or if we need to escalate. When we escalate, make sure an escalation is expected at the higher layer and check for their policy. They need to have one. Also make sure the escalation does not lose detail.

# This is useful outside of computer science. 

The original trigger to write this article in 2009 was a discussion about a 911-button (110-Taste) in a web browser.
"If you see something, say something": If you find web pages that contain things that may be relevant for law enforcement, have a way to call for help.

That's a very german and very 2009 idea, but suppose you want that: Coding that is easy, right? A button in a browser that raises an alarm somewhere should be very few lines of code in an extension.

The real problem - and that is not a code problem - is the `what_now()`.
What is supposed to happen with that alarm signal.
That's a process question, that is **WHO needs to talk WHEN with WHOM about WHAT?**
What information needs to be sent when the button is pressed and what reaction is then expected?

Do we build a central emergency call center?
Do we transport location and identity information together with the call, if that is necessary?
If so, how?

What other information is necessary to provide context?
The current URL?
The persistent state of the browser, with all bookmarks, the history and so on?
The volatile state of the browser, eg with all active spywat, but also all legit variables?
The whole state of the computer, processlist, memory and program information, installed software and so on?

How is that call then handled and classified?

What are standard reactions to verified and classfied emergency escalations?
Can the emergency call center take over the computer and extract further information and do a full forensic analysis?
Can they write and change the state of the machine to help?
Or can they just call back, and request a read-only screen sharing session to talk the user through the emergency?

What taxonomy of emergencies do we build, and what are the required steps to verify a case?

Do we plan for proactive intervention, when we register a spike in incidents of a certain type (ie a computer virus outbreak)?
Do we have a problem management and change managent on top of our incident management that would want to and be able to prevent a large scale situation in the field?
In the case of an outbreak, for example, by forcing patches on all machines?

How do we build the technical and legal framework for this?
How do we build the organisation for this?
How to we enforce the technical changes required to be able to do this?
Do we make the installation of some software mandatory to be able to be on the Internet?
How do we protect this infrastructure against abuse?

The check was easy -- an emergency call button in a browser.  

The work is in the handling, which can be "somewhat involved".
But these are details that are gracefully elided in the discussion when politicians demand such a button.
That's providing quite simplicistic discussions:
Why do we not have such a button in every browser already?

Can't be that hard, right?
