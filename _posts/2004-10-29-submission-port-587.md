---
layout: post
published: true
title: Submission (Port 587)
author-id: isotopp
date: 2004-10-29 07:41:13 UTC
tags:
- mail
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Mail wird über SMTP (Port 25) versendet, weiß man ja.

In [RFC 2476](http://www.ietf.org/rfc/rfc2476.txt) wird nun eine Abwandlung
von SMTP diskutiert, das Mail Submission Protocol. Submission ist im
wesentlichen SMTP auf Port 587 (submission), mit dem zusätzlichen
Requirement, daß irgendeine Art der Absender-Authentisierung stattfindet.
Mail Submission spezifiziert dabei ausdrücklich nicht, wie diese
Authentisierung stattfinden soll:

> 3.3. Authorized SubmissionNumerous methods have been used to ensure that
> only authorized users are able to submit messages. These methods include
> authenticated SMTP, IP address restrictions, secure IP, and prior POP
> authentication.

Submission wird von einigen Leuten als Werkzeug im Kampf gegen Spam
verkauft, aber dort ist es nur eingeschränkt wirksam - die erhofften
Vorteile basieren darauf, daß man nun Mail Transport (Port 25) und Mail
Submission (Port 587) trennen kann, und daß auf Port 587 zwingend
Authentication verlangt wird, also hoffentlich keine offenen Relays
existieren werden.

Für den Endanwender hat Submission auch Vorteile, die jedoch hauptsächlich
darauf basieren, daß es als Protokollvariante noch nicht sehr bekannt ist
und deswegen gerne übersehen wird.

Manche ISPs verwenden zum Beispiel transparente Proxies auf Port 25, um ihre
Kunden zu zwingen, den Mailverkehr über den Mailer des ISPs abzuwickeln.
Versucht mal als Kunde eines solchen ISP zum Beispiel einen SMTP Server bei
einem freien Webmailer zu erreichen, sieht man stattdessen das SMTP Banner
des ISP.

```console
$ telnet smtp.web.de 25
Trying 217.72.192.157...
Connected to smtp.web.de.
Escape character is '^]'.
220 smtp.onebb.com ESMTP Sendmail 8.12.11/8.12.11; Fri, 29 Oct 2004 15:40:30 +0800
quit
221 2.0.0 smtp.onebb.com closing connection
```

In diesem Fall kann es nützlich sein, statt Port 25 den Port 587 zum
Mailversand zu verwenden, in der Hoffnung, daß der ISP diesen Port noch
nicht mit seinem Proxy gedeckelt hat.

```console
$ telnet smtp.web.de 587
Trying 217.72.192.157...
Connected to smtp.web.de.
Escape character is '^]'.
220 smtp08.web.de ESMTP WEB.DE V4.101#44 Fri, 29 Oct 2004 09:40:55 +0200
quit
221 smtp08.web.de closing connection
Connection closed by foreign host.
```
