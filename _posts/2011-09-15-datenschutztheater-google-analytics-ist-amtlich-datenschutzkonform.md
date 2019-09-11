---
layout: post
published: true
title: 'Datenschutztheater: Google Analytics ist amtlich datenschutzkonform '
author-id: isotopp
date: 2011-09-15 10:28:55 UTC
tags:
- datenschutz
- google
- spackeria
- terror
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
[Heise Newsticker](http://www.heise.de/newsticker/meldung/Google-Analytics-ist-amtlich-datenschutzkonform-1343698.html)
titelt "Google Analytics ist amtlich datenschutzkonform": 

> Der Streit um datenschutzrechtliche Bedenken zu Googles Web-Analysedienst
> Analytics scheint beendet zu sein. Nach Angaben des Hamburgischen
> Datenschutzbeauftragten Johannes Caspar, der für Google zuständig
> zeichnet, ist für deutsche Webseitenbetreiber ein "beanstandungsfreier
> Betrieb von Google Analytics ab sofort möglich".

In diesem Fall war es der hamburgische Datenschutzbeauftragte Johannes
Caspar, der sich im September 2009 über Google Analytics echauffierte.

Google Analytics ist ein Trackingdienst, der in etwa genau dasselbe macht
wie ein 
[IVW Zählpixel]({* link _posts/2011-08-10-ivw-jetzt-datenschutzkonform-updated.md %}),
die auch von hamburg.de eingesetzt werden - hamburg.de hatte die Web-Präsenz
von Caspar gehosted (Wir erinnern uns: Caspar mußte seine Web-Präsenz erst
einmal offline nehmen, als das herauskam).

Caspars Kritik an Google Analytics zog sich unter anderem daran hoch, daß
die Verarbeitung der Daten durch Google außerhalb von Deutschland oder
Europa erfolgte. Wie schon in dem Artikel über die 
[IVW Zählpixel]({% link _posts/2011-08-10-ivw-jetzt-datenschutzkonform-updated.md %})
erwähnt, versteifen sich die Datenschützer außerdem auf die IP-Adresse als
personenbezogenes Datum (der Artikel und 
[C is for Cookie]({% link _posts/2011-02-05-c-is-for-cookie.md %})
erklären wieso das einerseits Unsinn und andererseits Datenschutztheater
ist).

Nach 2 Jahren härtester Verhandlungen ist das Ergebnis wie folgt: Google
Analytics ist auch in Deutschland legal.

Caspars Erfolge:

1. Das Google-Analytics Opt-Out, das vorher schon für alle wichtigen Browser
   verfügbar war, ist nun auch für Randgruppenbrowser zu haben.
1. Das letzte Byte der IP-Adresse kann (und muß für Anbieter mit
   Geschäftssitz in Hamburg!) maskiert werden. Naturgemäß wird die IP-Adresse
   vollständig zu Google übertragen (Datenpakete müssen schließlich irgendwo
   ankommen), aber Google hat auf Drängen von Caspar zugesagt, diese
   Adreßverkürzung auf Servern durchzuführen, die sich physikalisch in Europa
   befinden
   ([witzlos!?!](http://www.wiwo.de/politik-weltwirtschaft/google-server-in-europa-vor-us-regierung-nicht-sicher-476338/)).
1. Damit dem deutschen Recht genüge getan wird, müssen alle Anwender von
   Google Analytics einen 11-seitigen Vertrag zur Auftragsdatenverarbeitung mit
   Google Deutschland schließen.

Außerdem müssen Anwender, die Google Analytics auf ihrer Site einsetzen, in
ihren Datenschutzerklärungen darauf hinweisen.

Soweit der Theaterdonner des Datenschutztheaters.

Was ändert sich praktisch nach 2 Jahren härtester Verhandlungen?

- Ein Haufen Papier wird in die ABC-Straße in Hamburg geschickt werden.
- Anwender von GA müssen ihre bisherigen Google Analytics Statistiken
  löschen lassen, weil sie ja böse und illegal sind (nicht, daß man da
  personenbezogene Daten raus extrahieren könnte, das ist alles ja
  aggregiert - aber die sind ja ohne Vertrag und unter Verwendung
  naturbelassener verstrahlter Voll-IPs generiert worden). 
- Eine Zeile JS wird in den GA-Aufruf eingefügt, um die IP-Adreßmaskierung
  anzufordern.

Damit sendet das böse Google Analytics endlich nicht mehr meine IP-Adresse
direkt zu amerikanischen Servern, sondern Bedarfsträger müssen auf die
europäischen Google-Server zugreifen, um an die Daten zu kommen. Und Google
muß auf andere, wirksamere und stabilere Identifikationsmerkmale als
IP-Adressen zurückgreifen, um Browser zu identifizieren (Google
Login-Cookie,
[UTMA](http://helpful.knobs-dials.com/index.php/Utma,_utmb,_utmz_cookies)
oder User-Agent).

Zur Perspektive: Unterdessen ist es 
[weiterhin vollkommen Datenschutz-konform](http://de.wikipedia.org/wiki/SWIFT-Abkommen), 
daß die amerikanische Regierung meine innerdeutschen Überweisungen von in
Europa betriebenen Bankrechnern abschnorchelt.

Danke, Johannes Caspar, für diesen wesentlichen Beitrag zur Rettung der
Welt.
