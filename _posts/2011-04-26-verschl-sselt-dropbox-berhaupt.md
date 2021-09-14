---
layout: post
published: true
title: Verschlüsselt Dropbox überhaupt?
author-id: isotopp
date: 2011-04-26 17:32:36 UTC
tags:
- cloud
- dropbox
- internet
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Dropbox ist in den letzten Tagen und Wochen ein wenig seltsam in die
Schlagzeilen geraten.

Da ist einmal der Artikel von Derek Newton: 
[Dropbox Authentication: Insecure by design](http://dereknewton.com/2011/04/dropbox-authentication-static-host-ids/): 
>  After some testing (modification of data within the config table, etc) it
> became clear that the Dropbox client uses only the host_id to
> authenticate. Here’s the problem: the config.db file is completely
> portable and is *not* tied to the system in any way. This means that if
> you gain access to a person’s config.db file (or just the host_id), you
> gain complete access to the person’s Dropbox until such time that the
> person removes the host from the list of linked devices via the Dropbox
> web interface.


Dann ist da die Änderung der TOS, die vorher ein wenig irreführend
formuliert waren: Vorher konnte man die TOS so lesen, daß die
Dropbox-Dateien auf den Dropbox-Servern verschlüsselt gespeichert werden und
Dropbox selber keine Kopien dieser Schüssel hatte. Das ist natürlich nicht
der Fall: Für den Betreiber ist das alles Klartext, wenn er denn nur will.

[Und er will](http://blog.dropbox.com/?p=735): 
>  We may disclose to parties outside Dropbox files stored in your Dropbox
> and information about you that we collect when we have a good faith belief
> that disclosure is reasonably necessary to (a) comply with a law,
> regulation or compulsory legal request; (b) protect the safety of any
> person from death or serious bodily injury; (c) prevent fraud or abuse of
> Dropbox or its users; or (d) to protect Dropbox’s property rights. If we
> provide your Dropbox files to a law enforcement agency as set forth above,
> we will remove Dropbox’s encryption from the files before providing them
> to law enforcement. However, Dropbox will not be able to decrypt any files
> that you encrypted prior to storing them on Dropbox.


Und schließlich nun: 
[Dropbox Tries To Kill Off Open Source Project With DMCA Takedown](http://www.techdirt.com/articles/20110425/15541514030/dropbox-tries-to-kill-off-open-source-project-with-dmca-takedown.shtml). 
Diese Geschichte ist recht interessant, denn sie beleuchtet eine
Inkonsistenz in den Behauptungen von Dropbox - und hat mit der
Verschüsselung aus dem vorhergehenden Fall zu tun.

Dropbox speichert Dateien. Die meisten Leute haben Dateien, die auch andere
Leute haben. Das ist schon deswegen so, weil ein guter Teil von Dropbox sich
ja um Kollaboration, also das Teilen von Dateien miteinander dreht. Das
können Unterlagen einer Wohnungseigentümergemeinschaft betreffend eine
Dachsanierung sein, oder halt ein paar MP3-Dateien.

Wenn man nun also eine Datei auf Dropbox hoch lädt, dann berechnet der
Client eine Prüfsumme und lädt erst einmal diese hoch.

![](/uploads/sascha_lobo_singt.png)

Abkürzung beim Datei-Upload, wenn die Datei schon bei einem anderen
Dropbox-Kunden liegt.

Existiert eine Datei mit dieser Prüfsumme, dem passenden Datum und Namen
schon auf den Servern von Dropbox, dann muß Dropbox die Datei selber gar
nicht mehr bekommen, denn Dropbox hat ja bereits passende Daten. Es genügt
also serverseitig, die Datei auf dem Dropbox-Server für diesen Kunden
sichtbar zu machen. Das ist schnell, spart Bandbreite und für Dropbox spart
es Speicherplatz. Genau genommen macht es Dropbox wahrscheinlich überhaupt
erst rentabel, denn andernfalls würde viel zu viel Plattenplatz verbraucht
werden.

Die Werkzeuge von Drittanbietern, gegen die Dropbox dort vorgeht, tun nun
folgendes: Sie 'wissen' Prüfsummen und senden diese Prüfsummen an die
Dropbox-Server, ohne daß der Anwender diese Dateien auf seiner lokalen
Platte hat - der Client behauptet also, die Daten zu haben und zeigt eine
Prüfsumme vor, hat die Daten in Wahrheit aber gar nicht.

Dropbox macht diese Dateien dann für den Benutzer dieses Tools sichtbar,
wenn Dropbox diese Datei überhaupt in irgendeinem Useraccount hat. Man kann
also eine Datei-Prüfsumme etwa eines MP3-Verzeichnisses twittern, und jeder
kann mit diesem Tool und der Prüfsumme, die er über Twitter erhalten hat,
dann diese MP3s in seine Dropbox importieren und sie sich dann runterladen.
Klar, daß Dropbox das doof findet.

Das wäre technisch relativ leicht korrigierbar: Dropbox kennt ja die Datei,
und ihre Länge. Dropbox kann also den Client nach einem Sample der Daten
oder einer zweiten Prüfsumme über ein Sample der Daten fragen, und dabei das
Sample aus der ganzen Datei über einen variablen, zufällig bestimmten
Bereich legen. Wenn ich also behaupte, das Album "Sascha Lobo singt" zu
haben und die Prüfsumme dafür vorzeige, dann gibt Dropbox mir die Dateien
erst, wenn ich die Prüfsumme über die Bytes von Offset 4826267 bis
4826267+4096  dieser Datei berechnet habe. Wenn Du das machst, wird
stattdessen die Prüfsumme über einen anderen Bereich verlangt. Auf diese
Weise kann Dropbox leicht prüfen, ob der Client wirklich im Besitz der Daten
ist, die er behauptet zu haben.

Nun sollte einmal das Denken einsetzen. Ich erzeuge also eine Datei mit den
Inhalt "Hallo, Welt!".

Wenn **ich** diese Datei mit meinem Key verschlüssele, dann sieht die Datei so aus: 
```console
KK:~ kris$ openssl enc -e -k g33k -aes-128-cbc -base64 -in /dev/stdin
Hello, World!
U2FsdGVkX19isizbD981L7EOV+1Ou8O4xhBMQqDo3nw=
```


Wenn **Du** das machst, dann ist der Inhalt der Datei offensichtlich anders: 
```console
KK:~ kris$ openssl enc -e -k s3cr3t -aes-128-cbc -base64 -in /dev/stdin
Hello, World!
U2FsdGVkX18Fqrwp51fq8Y23MBas01+z4gJBdFs+vWE=
```

Beide Dateien haben offensichtlich unterschiedliche Prüfsummen, wenn man
verschlüsselten Content betrachtet. Die Prüfsumme muß also über den
unverschlüsselten Content berechnet werden, damit das vergleichbar wird. Für
den Client ist das leicht, da die Daten ja auf meiner und Deiner Platte für
den Client unverschlüsselt vorliegen.

Danach stellt mir Dropbox die Datei auf dem Server zur Verfügung, wenn ich
die passende Prüfsumme vorzeigen kann. Ich kann die Datein dann runterladen,
mit meinem Schlüssel verschlüsselt. Das heißt, die Daten, die angeblich
verschlüsselt auf dem Dropbox Server liegen, können mit meinem und mit
Deinem Schlüssel verschlüsselt runtergeladen werden. Dropbox speichert die
Daten physikalisch auch nur einmal, um Speicherplatz zu sparen, denn sonst
hätten sie tausende Kopien von "Sascha Lobo singt" auf dem Server liegen,
die alle Platz wegnehmen. Naja, ok, Dutzende.

Wahrscheinlicher ist also, daß Dropbox die Daten auf ihren Servern gar nicht
verschlüsselt, oder alle Daten mit einem einzigen globalen "Dropbox"-Key
verschlüsselt oder etwas ähnlich simples. Für die Kommunikation wird dann
eine Transportverschlüsselung über den Content gebraten, also für mich mein
Key und für Dich Dein Key.

Dropbox hat also die Wahl zwischen Dateideduplikation und effizienten
Uploads auf der einen Seite und Datensicherheit durch Verschlüsselung auf
der anderen Seite. Klar, wo businessmodelltechnisch die Präferenzen liegen.
