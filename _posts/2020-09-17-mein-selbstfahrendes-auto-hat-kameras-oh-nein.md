---
layout: post
title:  'Mein selbstfahrendes Auto hat Kameras, oh nein!'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-09-17 19:10:36 +0200
tags:
- lang_de
- datenschutz
- tesla
---
Bei der ARD ist man empört! [Teslas Kameras: ARD rückt Datenschutzbedenken ins Licht](https://www.heise.de/news/Teslas-Kameras-ARD-rueckt-Datenschutzbedenken-ins-Licht-4904167.html). Will sagen, jemand hat älteren Personen gesteckt, daß ein selbstfahrendes Auto wenig überraschend Kameras braucht, um bei seiner bestimmungsgemäße Verwendung weniger ältere Personen überzumöllern.

So weit so wenig überraschend.

Bei einem Tesla sind es 9, bei anderen Automobilen anderer Hersteller noch mehr, und Radar, und Lidar und weitere Sensorsysteme. Problematisch sind nur Kameras, weil Menschen als visuelle Wesen zum Bild eine emotional andere Beziehung haben als zu anderen Daten, die objektiv nicht weniger kritisch sind. Aber Bilder, das ist Hexenwerk, das die Seele stiehlt, das muß man dringend streng kontrollieren.

Okay, auch nicht überraschend.

Die Bilder, die dabei anfallen, wertet das Vision System des Tesla live aus, und schmeißt den Großteil davon so schnell als möglich weg. Dazu braucht man Tesla nicht fragen, das kann man sich leicht überlegen. 

Oder man spickt, was [andere sich überlegt haben](https://cambuy.de/magazin/speicherverbrauch-ueberwachungskamera/) - hier geht es um Überwachungskameras, nicht um [Netflix](https://help.netflix.com/de/node/306) und so ist die Qualität nicht dieselbe. Aber darum geht es auch nicht primär. In der Beispielrechnung kommt man mit 2 MBit/s, 8 Stunden und 7 Tage Vorhaltezeit auf 50 GB pro Woche.

Netflix HD braucht 5 MBit/s, und das sind 17 GB in 8 Stunden, 51 GB rund um die Uhr und 120 GB bzw 360 GB in der Woche bei 8 oder 24h am Tag.

Pro Kamera.

Von denen wir 9 Stück im Auto haben.

Okay, das Auto speichert also bestimmte ausgewählte Sequenzen, und manche Autos laden dann kleine Teile davon hoch, wenn es dazu aufgefordert wird.

Gewiss wird es nicht (2 MBit/s * 9 Kameras / 8 Bit/Byte) = 2.25 MB/s, also 8 GB pro Stunde, 64 GB pro Tag mitspeichern und lange vorhalten und noch viel weniger wird es versuchen, diesen Kram in einem deutschen Mobilfunknetz irgendwohin automatisch hochzuladen. Schon gar nicht flottenweit.

Nun gut.

Überraschend ist dabei die kurze Denkreichweite. Erstens geht es nicht um Tesla, und nicht einmal um Autos, sondern um jedes einzelbe autonome System mit Sensorik, das wir bauen oder bauen werden.

Und es geht auch nicht primär darum, ob die Daten gespeichert oder hochgeladen werden, sondern was das autonome System lokal entscheidet. Aber schauen wir mal in den Artikel:

> Tesla will Telematik- und Videodaten zur Verbesserung seiner autonomen Fahrsysteme erfassen, aber mit den Daten auch Marketing betreiben.

Tesla wird insbesondere auch für die Funktion seiner Steuerungsalgorithmen zur Rechenschaft gezogen und muß dann in der Lage sein, einem Kläger, diversen Versicherungen, der Zulassungsstelle und seinen eigenen Ingenieuren darzulegen, was objektiv passiert ist. Also, was die Sensorik des Fahrzeugs aufgezeichnet hat, welche Entscheidungen der Fahrzeugführer und das Bordsystem getroffen hat und wie die Dinge dann abgelaufen sind.

Um so mehr, wenn wir autonome Systeme haben, die rechtlich der Fahrzeugführer sind und bei denen der Hersteller des Steuerungssystems dann haftend ist statt des Menschen an Bord, der dann nur noch Passagier ist.

Auch okay und langweilig. Das Ding wird nicht nur Augen brauchen, um zu sehen, sondern auch eine Art Gedächnis, um sich revisionsfest für sich und seinen Hersteller daran zu erinnern, was es gesehen hat und welche Entscheidungen es getroffen hat, denn das Gerät und sein Hersteller werden für diese Dinge zur Rechenschaft gezogen werden.

Kommen wir nun zu den interessanten Fragen:

> Das permanente anlasslose Aufzeichnen verstößt grundsätzlich in Deutschland gegen den Datenschutz. 

Das Auto verarbeitet die Daten, die es mit seinen Sensoren wahrnimmt, laufend, so wie ein Mensch der wach ist und die Augen offen hat. Das soll es und das muß es. Wenn es fährt, aber auch, wenn es geparkt ist und im "Sentinel-Mode" sich selbst und das Eigentum seines Besitzers überwacht und beschützt.

Dabei kann das Fahrzeug andere Objekte und Personen im ruhenden und bewegten Verkehr identifizieren und klassifizieren, bestimmt ihre relative Position und Geschwindigkeit, wertet ihr Verhalten aus und plant dann seine eigenen Aktionen in Verbindung mit den Zielvorgaben, die es erhalten hat.

Nehmen wir an, das Gerät nimmt dabei einen Verkehrsverstoß in seiner Umwelt wahr.

- Zum Beispiel ist es in einer 30 km/h Zone geparkt und jemand brettert dort mit einem Fahrzeug mit 120 km/h durch. Die Kameras hat Beweismaterial, das Kennzeichen sowie die Gechwindigkeit und der Vektor dieses Fahrzeuges ist erfaßt. Soll das Auto die Szene hochladen und automatisch eine Anzeige erstatten? Hättest Du das getan, [wenn Du ein photographisches Gedächnis hättest und Abzüge davon machen könntest](https://www.youtube.com/watch?v=6a1I63FpzpA)?
- Dieselbe Szene wie vorher, aber das Fahrzeug fährt nur 42 km/h statt 120 km/h. Wenn das Urteil hier anders ausfällt, als im ersten Fall, warum? Und ab welcher Geschwindigkeit soll die automatische Anzeige ausgelöst werden?
- Das Auto wird manuell gesteuert und regelwidrig in einer 30 km/h Zone auf 120 km/h beschleunigt. Was soll das Auto tun? Ab welcher Geschwindigkeit?

- Jetzt fahren wir autonom, und vor uns kommt es zu einem Unfall auf einer Kreuzung. Die Sensoren des Fahrzeugen haben das Geschehen mit Kameras, Lidar und Radar genauestens erfaßt und vermessen und können den Unfallhergang genau rekonstruieren. Was ist mit den Daten des autonomen Fahrzeuges zu tun?

- Der Fahrer des Fahrzeuges parkt sein Fahrzeug manuell regelwidrig in einem absoluten Halteverbot. Das Fahrzeug erkennt dies, und warnt den Fahrer. Der Fahrer ignoriert die Meldung und steigt aus. Was soll das Fahrzeug tun?
- Der Fahrer des Fahrzeuges parkt sein Fahrzeug manuell regelwidrig in einem absoluten Halteverbot. Das Fahrzeug erkennt dies, und warnt den Fahrer. Der Fahrer *drückt die Meldung bewußt weg* und steigt aus. Was soll das Fahrzeug tun?
- Das Auto wird regelkonform geparkt und stellt zwei Fahrzeuge vor sich ein menschlich gesteuertes Fahrzeug fest, das regelwidrig geparkt und verlassen wird.

Man beachte, daß bei allen diesen Vorfällen die Daten live erfaßt werden und im Auto zunächst nicht dauerhaft gespeichert werden müssen, sondern nur gepuffert. Das Auto kann entscheiden, die Daten permanent zu speichern, den Vorfall zu melden oder Daten und Meldung zusammen hochzuladen.

> Allerdings entschied der Bundesgerichtshof im Mai 2018 in einem Revisionsverfahren, dass solche Aufnahmen bei Unfall-Prozessen als Beweismittel genutzt werden dürfen.

Das autonome Fahrzeug hat die Sensoren, um das Geschehen um sich zu erfassen. Es hat die Logik und Regeln, um Regelverstöße von anderen autonomen und menschlich gesteuerten Fahrzeugen zu erfassen, die Fahrzeuge an ihren Kennzeichen zu identifizieren. Es kann entscheiden, die erfaßten Sensordaten bei Regelübertretungen *anlaßbezogen* zu speichern und zu melden. Die Beweise können dann entnommen oder hochgeladen werden.

> Über die Verwertbarkeit auch von unzulässig oder rechtswidrig erhobenen Beweisen müsse durch eine Interessen- und Güterabwägung aufgrund der Umstände des Einzelfalles entschieden werden, urteilte der BGH damals.

Die Daten sind jedenfalls da. Die Einzelfallentscheidungen können dann getroffen werden. Wie sollen die Regeln zur Speicherung und zur Meldung ausfallen? Welche Verstöße und Situationen soll das autonome Gerät zum Anlaß nehmen, die erfaßten Daten anlaßbezogen zu speichern und was soll es wem wann melden?

Ich frage das auch als Radfahrer, der in Deutschland gerne mal mit deutlich weniger als 1.5 Meter Abstand überholt worden ist, und gegenüber dem menschliche Autofahrer ihr Fahrzeug auch mehr als einmal als Waffe verwendet haben, um mich zu nötigen und zu gefährden.
