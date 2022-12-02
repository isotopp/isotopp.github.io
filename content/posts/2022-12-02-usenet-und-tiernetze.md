---
author: isotopp
title: "USENET und Tiernetze"
date: 2022-11-28 06:07:08Z
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- lang_de
- usenet
- kiel
---

Vor ziemlich genau 30 Jahren gab es in Deutschland die 
[Anfangsgründe des Internet]({{< ref "/content/posts/2012-02-23-opa-erz-hlt-vom-krieg.md" >}}),
aber es gab auch Netze, die auf anderer, viel älterer Technologie betrieben wurden -- die Mailboxnetze.
Das sind dezentrale Netze, bei denen denen lokale Rechner mit Modems ausgestattet wurden, bei denen man anrufen und dann Nachrichten a la Mastodon online lesen konnte. 
Oder man hatte Software daheim, die bei der Mailbox anrief, die Nachrichten heruntergeladen hat.
Dann konnte man offline lesen, Antworten schreiben und ein zweites Mal anrufen.
Die Antworten wurden dann gesammelt eingeworfen, und zugestellt.

# Warum Tiernetz?

Die Softwarepakete, die das erlaubt haben, hießen in Deutschland

- Fidonetz (nach einem Hund), 
- Mausnetz und 
- Zerberus (noch ein Hund)

Daher wurden diese Netze wurden gesammelt als "Tiernetze" bezeichnet.
Außerdem gab es noch das auf Unix basierende UUCP mit USENET (Linux war um diese Zeit herum gerade erst geboren).

Die Mailbox-Software der Tiernetze basierte meistens auf MS-DOS und war nicht Mehrbenutzerfähig.
Die Netze hatten außerdem oft starke Größenbeschränkungen für Nachrichten.
Dagegen konnte USENET im Prinzip Nachrichten ohne Größenhindernisse auf Mehrbenutzersystemen im Hintergrund befördern.

Die Tiernetze hatten oft auch eine interne Struktur, die es notwendig machte, die dezentralen Systeme zentral in der Vernetzung zu steuern.
Das war nötig, um doppelt zugestellte Nachrichten und Kreisroutings zu vermeiden.
Maus und Fido waren auf eine starke Netzwerkkoordination angewiesen, USENET nicht.
Und bei Zerberus habe ich damals so lange auf //padeluun und seine Entwickler eingeschlagen, bis sie das Licht gesehen haben und elementare Fehler anderer Tiernetze vermieden haben, sodaß die Software wesentlich robuster war.

# Föderationsdramen vor 30 Jahren

Föderation war schon damals ein Problem.
Im Sommer 1993 zum Beispiel gab es den Versuch einer Machtübernahme in der Fido-Koordination, von der Michael Keukert (Mausnetz) 
[hier](https://groups.google.com/g/de.comm.gateways/c/pl9RdufmS8U/m/qH8A0Del2joJ)
berichtet.
Frank Simon hat damals ein paar 
[interessante Worte](https://groups.google.com/g/de.comm.gateways/c/pl9RdufmS8U/m/7mq4Q0Te25YJ)
dazu gesagt.
Und hier die von Frank Simon publizierte 
[Stellungnahme der Gegenseite](https://groups.google.com/g/de.comm.gateways/c/pl9RdufmS8U/m/7mq4Q0Te25YJ).
Es tut unglaublich gut, diese Texte (ohne 500 Zeichen Beschränkung!) aus heutiger Sicht noch einmal zu lesen, und so viele Dinge wiederzufinden.

Was wir hier sehen, ist Fedidrama, 30 Jahre in der Vergangenheit -- 
es gibt Machtgerangel zwischen Instanzen, die autonom betrieben werden und bei denen die Betreiber unterschiedliche Vorstellungen haben, wie die Dinge zu organisieren sind.
Die Diskussion geht nur oberflächlich um andere Dinge als zum Beispiel gerade zwischen octodon.social und social.tchncs.de

# Store and Forward im /CL

Ein auf Zerberus basierendes abgetrenntes Netz, "Comlink" oder "/CL", wollte zum Beispiel die Ausbreitung der Nachrichten seiner Benutzer kontrollieren.
Es gab also Mailboxen, die neben anderen Zerberus-Gruppen auch die /CL-Gruppen aufliegen hatten und die diese /CL-Inhalte ihrer User untereinander über ein separates Overlay ausgetauscht haben. 
Das heißt, sie haben sich für die /CL-Inhalte also gegenseitig angerufen.
Und es gab eine /CL-Netzkoordination, die meinte, sie könnte die Ausbreitung der Inhalte der Schreiber in /CL kontrollieren.

Rechtlich war das nicht geregelt -- es möglicherweise Verträge zwischen dem /CL-Träger und einzelnen Systembetreibern,
aber sicher keine Verträge zwischen den Autoren der Artikel und dem /CL-Träger.
Und jeder Benutzer hat halt mit seinem Client die Beiträge aus dem /CL zum Lesen runter gesaugt.
So auch ich damals, und gleich ein paar Mal von verschiedenen Quellen.

Ich hatte jedoch keine /CL- oder Zerberus-Software am Laufen, sondern ein Gateway nach UUCP/USENET.
Weil ich die Daten mehrfach runter gesaugt und den Ursprung anonymisiert hatte, 
und weil ich sehr oft pro Tag angerufen habe,
hatte ich meist den schnellsten und den komplettesten Feed von Artikeln für /CL.
Den ich bereitwillig weiter gegeben habe.

Die /CL-Netzkoordination hatte mir damals gedroht, mich zu deföderieren, 
aber sie kannte ja meine Quelle nicht.
Und die war hoch redundant.
Außerdem hatte ich habe die entsprechenden Herkunftsdaten aus den Artikeln gelöscht, sodaß sie nicht an meinen Upstream herankamen.
Ich hatte die betreffenden Personen aufgefordert, mich zu verklagen. 
Das ist aber nie passiert.

Was passiert ist:
Einige /CL-Systeme haben sich meinen Feed geholt, weil er schnell und komplett war.
Am Ende meines Studiums habe ich damals den ganzen Gateway- und Mailboxbetrieb aus Gründen recht schnell einstellen müssen.
Der Dienst ist dann leider recht plötzlich und unangekündigt weggefallen.

Erstaunlicherweise ist das /CL dann für ein paar Tage ungeplant in einige Teilnetze zerfallen.
Offenbar war ich mit meinem Hobbygateway zum zentralen Punkt einer weitgehend undokumentierten Hub- und Spoke Struktur geworden,
die Teilnetzblasen ohne sekundäre Verbindung zusammengehalten hat.

# kiel.* und die Koordinationssimulation

Ich hatte die Gateway-Sammlung auf meinem lokalen Unix eigentlich gar nicht betrieben, um /CL zu machen.
Ich war damals in einem Kieler Internet- und Mailbox-Verein tätig, den es noch heute gibt: 
toppoint.de -- inzwischen mehr ein Makerspace.

Und nachdem das tpki-System aus meiner Wohnung in die Eichhofstraße ausgezogen war, habe ich mit meinen Systemen andere Dinge gemacht.
Eine dieser Sachen war die Entwicklung und der Betrieb von Gateway-Software in Mausnetz, Fidonetz und Zerberus.
Wir hatten damals auf USENET-Seite eine Reihe von Diskussionsgruppen (heute würde man Hashtags sagen) eingerichtet, 
die kiel.* als Präfix hatten, und die bereits zwischen zwei rivalisierenden USENET-Organisationen in Kiel ausgetauscht.

Mit den Gateways konnte ich auch mit der KI-Maus, und mit der lokalen Fidonode reden, und auch mit der KBBS von Holger Petersen.
Auf diese Weise hatten wir gemeinsame Kieler Diskussionsforen auf allen relevanten Technologien dieser Zeit.
In einigen dieser Netze war ich ein "Point" (eine Micronode mit nur einem User), in anderen eine volle Node mit einem eigenen Nodenamen und vollen Routing.

In jedem Fall hat meine Modem-Hardware (später ISDN) einige Dutzend Anrufe pro Tag gemacht, um diese Systeme zu vernetzen.
kiel.* war eine komplett anarchische Struktur:
Wer eine neue Diskussionsgruppe (einen neuen Hashtag) haben wollte, der hat den einfach eingerichtet.
Die meisten Leute haben das nicht getan, sondern erst mal rückgefragt, was die anderen so denken, und erst dann gemacht. 
Das hat auf der Größe recht gut skaliert.

Die Tiernetze hat das vor einige mentale Probleme gestellt, denn in Fido und Maus ist so etwas ohne Koordinator undenkbar gewesen.
Das war in der Diskussion recht schwierig, weil die nicht gefragt haben, was ist und wie man das lösen könne,
sondern gefragt haben, wer denn für kiel.* der Koordinator sei.

Und das dann erst einmal zu erklären war zu schwierig.
Also hat, wer immer die Frage gesehen hat, behauptet der kiel.* Koordinator zu sein, dann die Frage bekommen und die dann beantwortet.

Das hat über 15 Jahre oder mehr gut funktioniert.
Also für kiel.*.
Aber auch für die Tiernetz-Admins, die auf diese Weise die vertrauten Strukturen vorgefunden haben,
und mit ihnen arbeiten konnten, ohne daß ihr Weltbild infrage gestellt wurde.

# USENET ist Vergangenheit

Ein Problem bei der Föderation von USENET trat dann später in den deutschsprachigen Gruppen de.* zutage,
und am Ende ist USENET dann daran zugrunde gegangen:

Das Einrichten neuer Gruppen war aus nicht nachvollziehbaren Gründen im USENET ein Riesen-Aufriß mit Diskussion,
formalen RfV (Request for Vote), in dem um einen Proposal gerungen wurde und dann einem Voting-Prozeß mit Quorum und Mehrheiten.
Also, das Einrichten einer Gruppe hat nichts gekostet: 
Ein Verzeichnis anlegen und gut ist.

Aber eine Gruppe von Admins vom Kaliber "deutscher Wikipedia-Pedant" davon zu überzeugen, daß die Gruppe notwendig ist, das war teuer.
Die meisten Leute haben dann lieber einen Server von Hetzner geholt und ein Web-Board installiert und am Ende waren die Wikipedia-Typen alleine in ihrem Netz.
Heute gibt es USENET nicht mehr. Es ist tot, abgeritten zu den Ahnen.

Das andere Problem, daß sich bei USENET gezeigt hat, ist die Tatsache, daß es als föderiertes Netz keine Client-Software gab,
die neue, inkompatible Features entwickeln konnte.

Schon die Benutzung von Umlaufen in Headerzeilen und im Text war Drama.
Mein Nick, isotopp, kommt aus dieser Zeit, denn der Umlaut mußte als

```console
=?iso-8859-1?q?K=F6hntopp?=
```

codiert werden und wessen Client das nicht decodierte, der hat halt `Iso-unleserlich-topp` gesehen.
Ich hatte damals sogar noch ein Türschild, das mir jemand (Lutz Donnerhacke?) anläßlich eines Besuches geschenkt hatte.

Darauf stand

```console
Kristian K=F6hntopp
```

Noch schlimmer waren multimediale Inhalte in Nachrichten.
Dafür mußte der Newsreader-Client halt Mime verstehen und decodieren können und das konnten viele nicht.
Also gab es wieder Fedidrama, um die Benutzung von solchen Dingen.
Oder halt Webboards.
Das ist im Prinzip genau wie mit den XMPP-Clients.

Die nimmt heute auch keiner mehr, weil es keine zwei Clients bzw auch keine Server und Clients verschiedener Hersteller gibt,
die dieselben XEP implementieren (XEP sind XMPP Protokollerweiterungen).
Also machen wir jetzt alle Discord und auf der Arbeit Discord für Arme, also Slack.
Plus das Spamproblem: Google Jabber ("Google Talk") hatte anfangs mit anderen XMPP-Servern föderiert.

Aber dann stellte sich schnell heraus, daß viele dieser XMPP-Server weder echte XMPP-Server waren,
noch echte User hatten, sondern nur als Spam-Injektor-Instanzen in Google Talk dienten, um Google User zu phishen.

Also hat Google erst Gruppenchats deföderiert um seine User zu schützen und am Ende auch 1:1 Chats abgeschaltet.
Und XMPP macht halt keiner mehr. Tot.

Auslöser dieses Historien-Threads war übrigens das Drama von dem Reply-Guy
[hier](https://social.tchncs.de/@escamoteur/109324468871252592)
und die Totaleskalation danach, die dazu geführt hat, daß octodon.social social.tchncs.de deförderiert hat.

Ich habe Freunde auf beiden Servern, die jetzt nicht mehr miteinander reden können und die allesamt nach anderen Instanzen suchen.

Insofern alles wie damals.
