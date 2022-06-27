---
author: isotopp
date: "2022-06-27T04:48:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
published: true
title: "Jetbrains Remote Development"
tags:
- lang_en
- development
---

I am on a Mac or on a Windows machine, and always I have to develop for a Linux target.
On Windows, this is easy, because most Jetbrains environment already support working inside WSL2, so simply choosing this is a no-brainer.

On MacOS, I can create a "Docker Container" do develop in, but it is kind of a joke.
That is, because MacOS cannot run Linux cgroups and namespaces natively, so you actually get a lightweight VM with Linux running, and then a container inside that.
You might as well run Linux in VMware and start the Jetbrains thing inside that.
It will hurt probably less than trying to edit inside a docker filesystem.

And sometimes you do not just need a Linux box, but an actual development environment that runs on one specific server that you have ssh access to.
Remote editing is "easy" in vscode, but there is no "my file tree is on that machine" mode in Jetbrains stuff.

Or is there?

# Enter the Gateway

Turns out, there is something better.
The Jetbrains Gateways runs their editor, headless, on the remote machine, and that editor edits.
The client is the GUI, and that runs natively on your development machine, using the native GUI and key bindings.
GUI and remote editor communicate, the same way "Code with me" communicates.

So

- Install "Jetbrains Gateway"
- Set up ssh connectivity in it.
- Start a new project, watch it download and install the development environment remotely.
- Enter the project and edit away.

![](/uploads/2022/06/jetbrains-gateway1.png)

*Yup, it's beta.*

# Does it even work?

Well, yes.
I can hit the "Terminal" tab, and get an actual shell on the remote box.
I can run and build stuff as if I would be running the GUI locally on the remote box.
The native binaries are what I have on the remote box.

Well, no.
It's beta.
Sometimes it gets stuck, and sometimes the keys are "glue-ey", that is, latency can be felt.

Usually it helps to disconnect or kill the local client and then reconnect to the remote session.
Sometimes that needs to be done more than once.

Well, yes.
Facinatingly, the remote session stays if you kill the local client, and on reconnect will be still there, blinking cursor and everything, just where you left it.

All in all, I think this is going to change the way it work. At least when the remaining problems are fixed.

![](/uploads/2022/06/jetbrains-gateway2.png)

*Connecting to the Blog.*

*Disclaimer:* I am a paying customer of Jetbrains, and have the private user all-in subscription, paid for myself.
