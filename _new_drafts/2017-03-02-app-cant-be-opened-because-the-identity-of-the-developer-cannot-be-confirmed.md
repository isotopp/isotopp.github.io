---
layout: post
status: publish
published: true
title: App can't be opened because the identity of the developer cannot be confirmed
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 909
wordpress_url: http://blog.koehntopp.info/?p=909
date: '2017-03-02 15:22:03 +0100'
date_gmt: '2017-03-02 14:22:03 +0100'
categories:
- Hackerterrorcybercyber
- Apple
tags: []
---
<p>[caption id="attachment\_910" align="alignleft" width="300"][![](http://blog.koehntopp.info/wp-content/uploads/2017/03/policy-300x252.png)](http://blog.koehntopp.info/wp-content/uploads/2017/03/policy.png) Policy Settings can prevent the execution of unsigned binaries.[/caption] MacOS can be set to prevent the execution of unsigned binaries. This is done by pushing a security policy to the system, which is then enforced by the&nbsp;SecAssessment subsystem. Of course, you can still install XCode and compile binaries locally, and even execute them. You can also code in interpreted languages such as the local Python, and call system functions from there, so the policy is only of very limited use in locking down the system.<!--more--> [caption id="attachment\_911" align="alignright" width="300"][![](http://blog.koehntopp.info/wp-content/uploads/2017/03/policy2-300x186.png)](http://blog.koehntopp.info/wp-content/uploads/2017/03/policy2.png) Adium download is unsigned[/caption] So while the security value of that policy guideline is extremely questionable, the annoyance factor is quite high.</p>
<p>## With Sudo<br />
 Turns out,&nbsp; **with sudo** you can simply disable the security policy engine. In a terminal, "man spctl" to read up on the spctl control program for the security policy engine. Then run "sudo spctl --master-disable" to turn it off.<br />
## Without Sudo<br />
 Turns out,&nbsp; **without sudo** it is even simpler. Checking a files signature is expensive, and checking the signature of a large application that contains very many files is even more expensive. Which is why MacOS is marking files as to-be-checked on download, &nbsp;and then checking the file once when executing them for the first time. Unmarking the file will prevent the Security Policy engine from engaging in the first place. So, downloading a binary to your Mac with a browser will set the "com.apple.quarantine" xattr to the file. You can "xattr Adium.app" to see the keys, and "xattr -p com.apple.quarantine Adium.app" to see the value of the quarantine key. Simply running "xattr -d com.apple.quarantine Adium.app" without any privilege will remove the Quarantine xattr and the check will never been done. Or you are downloading the file using wget, curl or the requests library in the local system python. None of these will ever set that xattr in the first place.</p>
