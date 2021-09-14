---
layout: post
published: true
title: Was bedeutet eigentlich "Never check for an error condition you don't know
  how to handle"
author-id: isotopp
date: 2009-08-21 17:11:35 UTC
tags:
- politik
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Der Informatiker ist ein seltsames Wesen. In seiner Wissenschaft gibt es zum Beispiel ein paar Regeln, die beim ersten Mal gehört sehr seltsam klingen, die aber beim längeren Nachdenken und mit ein bischen Erklärung dazu Weisheiten enthalten, die manchmal auch außerhalb der Informatik von einigem Belang sein können.

Eine dieser Regeln ist 

## Never check for an error condition you don't know how to handle.

Versteht man diese Regel zunächst einmal nur oberflächlich, klingt sie sehr fragwürdig - ich soll in meinem Programm bestimmte Fehlerbedingungen nicht prüfen, von denen ich genau weiß, daß sie eintreten könnten?

Wenn man den Satz vorwärts von links nach rechts durchdenkt, dann steht da genau das.

Nehmen wir uns einmal ein Beispiel und versuchen zu verstehen, was da passiert. 

Da ist zum Beispiel ein sehr einfacher Fall - ich könnte versuchen Speicher beim Betriebssystem zu reservieren und das kann fehlschlagen.

```c
char *p = NULL;
if ((p = malloc(someSize)) == NULL) {
    tja_was_dann();
}
```

Das ist so eine typische Situation - wieso zum Beispiel fragt die Bibliotheksfunktion `malloc()` nicht selbst auf `p == NULL` ab und fängt diesen Fall ab. Weil sie das nicht tut, muß ich das jedes einzelne Mal selber tun und darf das in keinem einzelnen Fall vergessen.

Tatsächlich haben die meisten Programme eine Funktion `safe_malloc()`, die ein Wrapper für `malloc()` ist und mehr oder weniger wie oben gezeigt aussieht. Der Punkt ist, daß jedes Programm seine eigene Implementierung von `tja_was_dann()` mitbringt, denn das genaue Verhalten der Anwendung ist anwendungsspezifisch und kann so nicht von der Bibliothek bereit gestellt werden.

Man könnte argumentieren, daß `malloc()` dann intern ein `tja_was_dann()` aufrufen sollte, für das ein jeder Verwender von `malloc()` eine Implementierung bereit stellen müßte. Aber das würde wiederum einen bestimmten Modus der Verwendung von `malloc()` vorschreiben. Die Lösung, daß `malloc()` den Test nicht macht, sondern den Fehler nur signalisiert, ist hier die flexibelste Lösung - und daher einer Bibliotheksfunktion am angemessensten, weil sie dem Anwender jede Wahl läßt. Sie stellt also  die notwendigen Mechanismen bereit, erzwingt aber keine bestimmte Policy.

**Nebengedanke:** Das ist einer der Hauptunterschiede zwischen einer Bibliothek und einem Framework. Eine Bibliothek stellt Mechanismen bereit, erzwingt aber keine bestimmte Policy, also eine bestimmte Default-Herangehensweise an Probleme. Frameworks dagegen sind mit einem bestimmten Modus im Kopf entwickelt worden und bringen eine Policy mit, die im Kontext des Frameworks als Standardlösung angesehen wird.

**Nebennebengedanke:** Kernel, Bibliotheken und Frameworks sind Infrastruktur, und wie jede Infrastruktur werden sie auch zu einem guten Teil 
[daran gemessen, wie sie versagen]({% link _posts/2008-05-30-the-importance-of-fail.md %}). In diesem Fall also: Welche Möglichkeiten gibt es, bei einem Framework an der Policy vorbei zu programmieren, wenn die Policy mal nicht paßt ('Wie kann ich in 
[RoR](http://de.wikipedia.org/wiki/Ruby_on_Rails) Queries an 
[Active Record](http://de.wikipedia.org/wiki/Ruby_on_Rails#Konzept) vorbei schicken?') oder wie frei von Policy ist diese Bibliothek wirklich gestaltet - habe ich nur einen Mechanismus, oder ist er mit einer Intention, einer Policy belastet?

Von einer Bibliothek soll also nur ein Mechanismus bereitgestellt werden, und es ist zwingend notwendig, daß sich der Anwendungsentwickler Gedanken darüber macht, wie die Policy zur Fehlerbehandlung aussehen soll und wie sie implementiert werden soll. Das ist eigentlich ein relativ offensichtlicher Punkt, aber einer, der meiner Erfahrung nach beim Lehren von Programmiertechniken nicht ausreichend betont und eingeübt wird. Wäre dem nicht so, hätte wir weniger schlechten Code in vielen Projekten. Und ich will mich hier nicht auf die Tonnen von verseuchtem PHP-MySQL beschränken lassen, in denen Queries an eine Datenbank abgefeuert werden ohne jemals zu prüfen, ob überhaupt ein Resultat produziert wurde - oder in denen, falls dies nicht der Fall ist, vergessen wird, die Fehlermeldung der Datenbank abzuholen.

Der Punkt ist, daß das Fehlen einer Policy im Code meistens eine Policy in der Anwendung bedingt, oder jedenfalls Mindeststandards in der Anwendung. Einige Programmiersprachen haben einen Namen für so ein informales Konstrukt: Sie nennen es eine Konvention, also einen Vertrag zwischen Bibliotheksentwickler und Anwendungsentwickler, der informal ist und nicht durch die Mechanismen der Programmiersprache erzwungen wird. Diese Konvention ist typischerweise unausgesprochen und nicht Bestandteil der Bibliotheksdokumentation - und das ist der Grund, warum die Konvention unzureichend gelehrt und entsprechend unzureichend umgesetzt wird.

Aber man kann den Satz 

> Never check for an error condition you don't know how to handle.

auch anders herum lesen. Was genau bedeutet es denn, diese Error Conditions nun zu handlen? Also genauer: Wenn dieser Fehler eintritt, was sind die verbleibenden Handlungsoptionen und was ist der gewünschte Failure Mode, d.h. was soll passieren?

Nehmen wir wieder den o.a. `malloc()`-Code. Wenn der Fehler eintritt, dann kann oder will uns das Betriebssystem keinen Speicher mehr reservieren. Wir wissen nicht warum, müssen also die schlimmste Annahme treffen und die ist: der Speicher ist voll, niemand bekommt mehr Speicher. Genau genommen könnte ein Programm anderswo laufen, daß allen freien Speicher sofort verbraucht, wir können also auch keinen Speicher ans System zurück geben und dann wieder reservieren lassen.

Dieses Szenario setzt voraus, daß wir bereits weit vor dem Eintreten des Fehlers allen Speicher reserviert haben, der zur Handhabung des Fehlers notwendig ist. Das ist eine recht komplizierte Situation, und den meisten Anwendungsentwicklern in dem Moment zu kompliziert, in dem sie gezwungen sind darüber nachzudenken. Schließlich wollen sie erst mal den _nicht_ failenden, den funktionalen Path in ihrem Code fertig stellen, bevor sie sich mit failure modes und den Codepathes dort beschäftigen.

**Nebengedanke:** Das ist ein weiterer Hauptgrund für schlechten Code - wir zwingen Entwickler zum falschen Zeitpunkt dazu, sich mit failure modes und failenden Codepathes auseinander zu setzen. Entwickler sind wahrscheinlich bereit, sich auch mit failenden Codepathes zu beschäftigen, denn sie wollen ja ein gut funktionierendes Programm erstellen. Aber wir sollten sie nicht gerade dann mit failenden Pathes belästigen wenn sie im funktionalen Path des Codes am Arbeiten sind, dem Programm also gerade beibringen überhaupt mal was Sinnvolles zu tun.

Weil wir Entwickler also im falschen Moment mit Failures belästigen bekommen wir Code, bei dem Failure Handling im günstigsten Fall so aussieht: 

```c
char *p = NULL;
if ((p = malloc(someSize)) == NULL) {
    exit(ENOMEM); // out of memory error
}
```

Immerhin ist hier überhaupt auf das Auftreten eines Fehlers geprüft worden. Vielleicht sind auch noch ein paar `atexit(3)`-Handler gestacked worden, die beim Programmende aufräumen, aber das ist allgemein recht wenig üblich.

Bei dieser Art der Fehlerbehandlung kann man am Code förmlich sehen, wie der Anwendungsentwickler auf das Auftreten des Fehlers geprüft hat, sich aber über das Handling des Fehlers jetzt zu diesem Zeitpunkt genau gar keine Gedanken machen wollte.

Ein anderes übliches Problem ist, daß auf einer viel zu niedrigen Ebene auf den Fehler geprüft wird. Zudem besteht oftmals keine Übereinkunft in der Anwendung, wie Fehler von einer niederen Abstraktionsebene auf die nächsthöhere Ebene weitergereicht wird, ohne daß Information verloren geht. Die Innereien des Quelltextes von MySQL sind ein ausgezeichnetes Beispiel für solche Scherereien, zum Teil findet man Code wie

```c
int errcode = doSomeThing();
switch(errcode) {
  case 1:
  case 2:
  case 3:
    return E_DIES;
    break;
  case 4:
    return E_DAS;
    break;
}
```

Das heißt detaillierte interne Fehlercodes werden unter Informationsverlust plattgeklopft und ein Handler auf einer höheren Abtraktionsebene mit mehr Kontext hat gar keine Chance mehr festzustellen, was genau denn da unten nun schief gelaufen ist.

Die Regel 

> Never check for an error condition you don't know how to handle.

macht es also notwendig, bei jeder Fehlerprüfung drei Dinge zu klären: 

- **Diagnose:** Den Fehler feststellen. Formuliere einen Test, der an einer geeigneten Stelle prüft, ob ein Fehler vorliegt und der unterscheidbar signalisiert, welcher Fehler genau vorliegt.
- **Policy:** Lege fest, was beim Eintreten der Fehlerbedingung das korrekte, ergewünschte Verhalten ist, d.h. definiere eine Policy, die festlegt, wie mit dem Fehler umgegangen werden soll.
- **Kontext:** Entscheide, ob diese Fehlerbehandlung im Kontext der aktuellen Abstraktionsebene möglich ist, der Fehler also hier wie erwünscht behandelt werden kann, oder ob er eskaliert werden muß. Wenn er eskaliert werden muß, stelle sicher, daß er auf der übergeordneten Ebene erwartet wird - dort muß also auch Policy für die Eskalation zwingend existieren. Stelle auch sicher, daß er dort noch diagnostiziert werden kann - die Diagnose darf also bei der Eskalation keinem Informationsverlust unterliegen.

## Diese Überlegungen sind nun durchaus auch außerhalb der Informatik anwendbar. 

Der Auslöser für mich diesen Text zu schreiben war zum Beispiel der folgende Recht interessante Artikel von Hadmut:

[Die 110-Notruf-Taste im Webbrowser](http://www.danisch.de/blog/2009/08/21/die-110-notruf-taste-im-webbrowser/).

Die Überlegungen, die Hadmut da anstellt, sind alle gut und richtig, aber wenn man die Regel von oben anwendet, kommt man schnell zu dem Schluß, daß die Taste zur Signalisierung des Notrufes nicht wirklich ein Problem ist - das sind wahrscheinlich weniger als 5 Zeilen Javascript in Firefox.

Die Frage - und es ist erst mal eine Frage, kein Code-Problem - ist ja dann: Was soll dann passieren, wenn so eine Taste gedrückt wird. Es geht um Prozeß, d.h. immer um die Frage **WER soll WANN mit WEM WOZU WORÜBER reden?** Welche Informationen sollen beim Drücken der Taste also an wen übermittelt werden und welche Reaktion wird dann in welchem Zeitrahmen erwartet?

Bauen wir eine zentrale Internet-Notrufzentrale auf? Bekommt diese mit dem Notruf auch Location-Information übermittelt, wenn es notwendig ist? Wenn ja, wie?

Welche anderen Informationen werden übermittelt? Die aktuelle URL? Der persistente State des Browsers mit allen Bookmarks, der History und so weiter? Der volatile State des Browsers mit aller ggf. aktiven Spyware, aber auch allen internen legitimen Variablen? Der State des ganzen Rechners mit Prozeßliste, Speicher- und Programminformationen, installierten Programmen nach Registry usw?

Wie wird der Notruf dann ausgewertet und klassifiziert?

Was sind Standard-Reaktionen, wenn er Notruf verifiziert und klassifiziert ist? Kann die Notrufzentrale direkt auf den Rechner zugreifen und dort weitere Informationen auslesen, alles einmal durchforensiken? Kann sie schreiben und den Zustand des Rechners verändern? Oder kann sie nur per VoIP zurück rufen und in einer r/o Screensharing-Session den User durch den Notfall durchsprechen?

Welche Taxonomie von Notfällen bauen wir überhaupt auf und was sind notwendige Schritte zur Verifikation, und dann Standard-Reaktionen auf den Notfall, so er verifiziert ist?

Soll auch präventive Aktion möglich sein, etwa, wenn wir eine Häufung von Incidents einer bestimmten Art feststellen (einen Outbreak eines bestimmten Virus etwa) und das dem Incident-Managent übergeordnete Problem-Management eine größere Situation erkennt, die es flächig präventiv entschärfen möchte? Im Falle des Outbreaks etwa, indem es allen gefährdeten Rechnern präventiv einen Patch reinzwingt?

Wie ordnen wir das rechtlich und technisch ein? Wie hängen wir das organisatorisch auf? Wie erzwingen wir die technische Umsetzung des Rahmens (Pflichtinstallation der Software auf allen mit dem Internet verbundenen Zielsystemen)? Wie schützen wir diese Infrastruktur gegen Mißbrauch?

Wie man sieht kann der Check für einen Fehlerbedingung recht einfach sein - ein Notrufknopf.

Das Handling dann, das kann "etwas" komplizierter werden. Aber solche Details muten eine Frau von der Leyen und ein Herr Schäuble dem interessierten Wähler im Wahlkampf eher nicht zu, wenn sie in Interviews von einem Notrufknopf im Browser reden - bzw. auch die Bildzeitung redet über diese viel spannendere Seite des Problems eher nicht - und das kann sehr einlullend sein: Wieso haben wir so einen Knopf eigentlich nicht im Browser? So schwer kann das doch nicht sein?
