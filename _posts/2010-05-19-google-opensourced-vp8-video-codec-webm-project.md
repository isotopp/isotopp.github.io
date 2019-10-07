---
layout: post
published: true
title: 'Google opensourced VP8 Video-Codec: WebM Project'
author-id: isotopp
date: 2010-05-19 19:20:58 UTC
tags:
- google
- media
- politik
- vp8
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
[VP8](http://en.wikipedia.org/wiki/VP8) ist ein Videocodec, der von On2
entwickelt wurde. Google hatte die Firma am 17. Februar 2010 für $133 Mio
gekauft. Unter dem Namen The WebM Project 
([Site](http://www.webmproject.org/), 
[Blog](http://webmproject.blogspot.com/)) wird der Codec jetzt unter einer 
[BSD-artigen License](http://www.webmproject.org/license/) als Open Source zur Verfügung gestellt 
([Tweet](http://twitter.com/googleio/status/14303430405)). Die Lizenz hat
dabei als netten Twist eine Selbstzerstörung bei Patentangriffen eingebaut:

> These licenses are revocable only if the licensee files a patent
> infringement lawsuit against the VP8 code that Google released.

WebM ist sehr eng definiert: Es ist ein Matroska-Container mit einem
VP8-Video und Ogg Vorbis Sound - dadurch wird der Bau von WebM-Abspielern
sehr einfach. Die Lizenz erlaubt jedoch die Verwendung von VP8 auch in
größerem Rahmen, also etwa in normalen MKV-Dateien, in denen VP8-Video mit
MP3-Sound kombiniert wird, nur ist es dann halt kein WebM.

Derzeit gibt es noch keine Grafikkarten mit Hardware-Support für VP8, aber
Google arbeitet daran. Android wird VP8 und WebM ab 'Gingerbread'
unterstützen (und dann sicher auch mit passender Hardware, um die Batterie
zu schonen).


Eine ältere Version eines On2-Codecs, VP3, wurde 2002 von On2 an die
Xiph.org Foundation gespendet und unter einer BSD-License als Open Source
verfügbar gemacht. Daraus hat sich das Ogg Theora-Projekt entwickelt.

Durch das verfügbar-machen von VP8 eröffnet sich die Chance für HTML5 Video
aus der H.264 Patentklemme heraus zu kommen, wenn der Codec weit genug
unterstützt wird. Die Unterstützung von Chrome ist ja quasi von Haus aus
sicher,

[Youtube kann auch schon VP8](http://googlesystem.blogspot.com/2010/05/how-to-play-webm-video-on-youtube.html).
Das Mozilla-Projekt unterstützt WebM bereits in den Firefox Nightly Builds,
ebenso Opera und sogar
[Microsoft](http://windowsteamblog.com/windows/b/bloggingwindows/archive/2010/05/19/another-follow-up-on-html5-video-in-ie9.aspx)
ab MSIE 9. Bleibt die Frage wie Safari (Apple) reagiert: Jobs war gegenüber
[Ogg Theora](http://www.netzpolitik.org/2010/will-steve-jobs-theora-angreifen/)
ja eher kritisch eingestellt und dem H.264-Lager recht sicher zuzurechnen.

H.264 ist kritisch zu sehen, weil 
[MPEG LA](http://yro.slashdot.org/story/10/05/02/1114235/The-MPEG-LAs-Lock-On-Culture),
die MPEG Licensing Authority, Anteile an Umsätzen haben will, die mit H.264
codierten Videos gemacht werden - selbst sogenannte Profikameras kommen nur
mit einer Consumer H.264 Encoder-Lizenz. MPEG LA behauptet auch, daß es
generell unmöglich ist, einen legalen Video-Codec zu produzieren ohne
Patente von MPEG LA zu lizensieren. Mit Google und Googles Anwälten hinter
VP8 wird das sicher eine interessante Auseinandersetzung.

In einem größeren Zusammenhang ist auch der Aufkauf von 
[Global IP Solutions](http://gipscorp.com/) durch Google zu sehen. 

[GIPS wirbt](http://gipscorp.com/products/overview.php) für sich als "The
world's most widely deployed technology for processing real-time voice and
video over IP", zumal die WebM-FAQ zum Thema PVRs und Set-Top Boxen ein
'stay tuned' empfiehlt. Was ein Laden wie Google mit Bandbreite,
Videocodecs, Youtube und GIPS sowie Cellphone-Tech alles anstellen kann
bleibt der Fantasie der Anleger überlassen.
