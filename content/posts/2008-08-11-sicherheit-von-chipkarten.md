---
author-id: isotopp
date: "2008-08-11T14:48:26Z"
feature-img: assets/img/background/schloss.jpg
published: true
tags:
- identity
- security
- lang_de
title: Sicherheit von Chipkarten
---

![](/uploads/chipkarte.jpg)

*Image: [Dwizzy](https://flickr.com/photos/dwizzy/412531283/) on Flickr*

Zwei Artikel im Folge im Blog von Bruce Schneier, und beide haben mit Karten und Sicherheit zu tun. 
In 
[Hacking MiFare Transport Cards](http://www.schneier.com/blog/archives/2008/08/hacking_mifare.html) 
kommentiert Schneier die Gruppe der Radboud University Nijmegen, die die Sicherheitssysteme der MiFare Classic Karte von NXP überwunden hat.
NXP hat versucht, gegen die Veröffentlichung der Papers zu klagen, die diese Fehler der MiFare beschreiben, hat aber den Prozess verloren. 
Der Richter urteilte: 

> Damage to NXP is not the result of the publication of the article but of the production and sale of a chip that appears to have shortcomings.

In einem zweiten Artikel 
[UK Electronic Passport Cloned](http://www.schneier.com/blog/archives/2008/08/uk_electronic_p.html) 
geht es um den Pass mit Chip, der in England ausgegeben werden soll, ähnlich dem biometrischen Pass und Personalausweis in Deutschland.
Die Times hat sich von einem Sicherheitsspezialisten zwei Pässe clonen und die darin enthaltenen Bilder ersetzen lassen.

Man fragt sich natürlich, was die Hersteller solcher Geräte die ganze Zeit tun, wenn sich ihre Karten und Chips so schnell knacken lassen und so hilflos gegen Angriffe sind.
Der Fehler ist aber nur zum Teil bei den Herstellern zu suchen, es handelt sich vielmehr um ein tiefer liegendes Problem, und zwar um ein Verständnisproblem bei den Leuten, die sich für solche Systeme entscheiden.

Eine Chipkarte ist ein Single Chip Computer, der Sicherheit gewährleisten soll.
Dazu hat dieser Single Chip Computer eine CPU, ein wenig Speicher und ein wenig Kryptologik an Bord. 
All das wird in eine Plastikkarte eingebettet.

Der Chip hat keine eigene Stromversorgung, er hat keine Peripheriegeräte wie Display oder Tastatur, sondern im günstigsten Fall 2-6 Kontakte nach draußen, im ungünstigsten Fall eine Drahtschlinge als Antenne zur Stromversorgung und zum Senden und Empfangen von Daten.
Diesen Chip in seiner Plastikverpackung gibt man dann dem Angreifer in die Hand und lässt diesen mit dem Gerät einige Tage, Wochen oder Monate lang allein.

Angriffe auf solche Chips gibt es viele. 
Einige 
[Leute](http://www.flylogic.net/blog/?p=26)
legen solche Chips zum Beispiel routinemäßig aus ihrer Plastik- oder Chipverpackung frei und durchleuchten sie dann mit einem Raster-Elektronenmikroskop oder anderen Untersuchungsmethoden. 
Aus dem Layout der Leiterbahnen kann man 
[Fehler im Chipdesign](http://www.flylogic.net/blog/?p=25)
oder Hintertüren erkennen oder Angriffsmethoden ableiten.

Man kann sich auch 
[auf die Stromversorgung des Chips](http://www.rfidguardian.org/index.php/Differential_Power_Analysis)
klemmen und so auf geheime Daten rückschließen, die eigentlich nicht extrahierbar auf dem Chip gespeichert sind.
Je nachdem wie die Daten auf dem Chip gespeichert sind und verarbeitet werden kann man aus dem Stromverbrauch des Chips auf Nullen oder Einsen in einem Bitmuster schließen, daß etwa einen geheimen Schlüssel darstellt, der den Chip nie verlassen sollte.

Andere Angriffe bestehen darin, daß man den Chip auf so einer Karte mit unsauberer oder unzureichender Betriebsspannung versorgt, und zwar gerade so, daß der Chip funktioniert, aber nicht zuverlässig.
Es kommt bei Rechnungen zu Bitkippern oder anderen seltsamen Ungereimtheiten, weil zur Verfügung stehende Leistung böswillig so manipuliert oder moduliert wird, daß man eigentlich unlogische Ergebnisse bekommt.
Einige Chips versuchen sich gegen solche Angriffe zu schützen, etwa indem sie dieselbe Berechnung dreimal ausführen und dann die Ergebnisse vergleichen. 
Bei korrekter Funktion des Chips kommt natürlich immer dasselbe raus, kommt es jedoch wegen Unterversorgung des Chips zu zufälligen Bitkippern, sind die Ergebnisse nicht identisch (und der Chip schaltet sich ab).

Bei allen Chipkarten - mit oder ohne Kontakte - kommt dazu, daß sie keine vertrauenswürdige Peripherie haben, also nicht wissen, ob sie mit einem legitimen Terminal oder einem Angreifer reden, ebenso wie anders herum das Terminal nicht wissen kann, ob es mit einer legitimen Karte oder einem Angreifer redet.
Karte und Terminal müssen sich also gegenseitig authentisieren und legitimieren.
Bei drahtlos kommunizierenden Karten kommt noch dazu, daß Dritte die Kommunikation zwischen Karte und Lesegerät unter Umständen mithören und daraus gewonnene Information für Angriffe ausnutzen können.

Chipkarten sollen nun außerdem noch in großer Stückzahl hergestellt werden.
Das bedeutet, sie sind wahrscheinlich ab Werk identisch und werden später erst personalisiert (Angreifer können möglicherweise also über unpersonalisierte Blanko-Exemplare verfügen und diese dann später so personalisieren, daß sie Duplikate existierender Karten sind).
Und das bedeutet auch, die Karten müssen sehr preisgünstig hergestellt werden: 
Da der Anzahl-Multiplikator in die Millionen gehen kann, zählt jeder Cent-Bruchteil Ersparnis.

Kurz: Wenn man ein Angreifermodell für eine Sicherheitsanalyse konstruieren sollte, das für den Verteidiger möglichst pessimal ist, dann kommt etwas heraus, das einer kontaktlosen Chipkarte und ihrem typischen Benutzungsumfeld sehr, sehr ähnlich ist.

Für Fahrkarten mag das vielleicht ausreichend sein, für Zugangskontrolle eher nicht.
Für Ausweise?
Öh.
Da wäre man schon sehr <strike>dämlich</strike> von einer Industrielobby gekauft, wenn man sich als Staat für so etwas entschiede.
Ich erwarte jedenfalls aufgrund der Verteidigungssituation in diesem Szenario nicht, daß irgendeiner dieser Chip für nennenswerte Zeit einem Angriff standhält.
Nein, auch nicht die in meinem Pass und Perso.

**Update:** 
Natürlich gibt es gegen jeden Einzelnen dieser bekannten Angriffe Gegenmaßnahmen - Metallschichten auf dem Chip, Mehrfachberechnungen zur Erkennung versorgungsbedingter Fehlfunktionen, Codegestaltung so, daß immer gleich viel Power verbraucht wird, Kryptoprotokolle zwischen Terminal und Karte.
Alle diese Dinge machen jedoch die Karte stromhungriger, langsamer und vor allen Dingen teurer und stehen einer Massenproduktion damit entgegen.
Viele der Fehler entwerten außerdem nicht eine Karte, sondern das System - das mit vielen Millionen Karten im missionskritischen Einsatz ein sehr empfindlicher Totalverlust ist, wenn die Sicherheit des Systems und nicht die einer Karte versagen sollte.

Darum ja auch die etwas hysterische Reaktion von NXP.
