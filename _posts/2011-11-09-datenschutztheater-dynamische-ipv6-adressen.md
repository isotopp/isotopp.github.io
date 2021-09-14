---
layout: post
published: true
title: 'Datenschutztheater: dynamische IPv6 Adressen'
author-id: isotopp
date: 2011-11-09 13:18:38 UTC
tags:
- datenschutz
- ipv6
- politik
- privacy
- spackeria
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---

Wir hatten das Thema schon einmal in 
[IP V6 verkehrt]({% link _posts/2011-06-05-ip-v6-verkehrt.md %}),
aber es ist noch nicht tot. Spezialexperten für den Datenschutz aus aller
Welt haben sich getroffen, und waren gemeinsam besorgt:

> Die Datenschutzkonferenz empfiehlt, die bisher bei Zugangsanbietern
> übliche dynamisch IP-Adressvergabe auch nach der Einführung von IPv6
> beizubehalten. "Internetzugangsanbieter und Betreiber von Gateways sollte
> die Nutzung dynamischer IP-Adressen als Standardeinstellung anbieten",
> heißt es in der am Freitag von Schaar 
> [veröffentlichten Entschließung](http://www.bfdi.bund.de/SharedDocs/Publikationen/Entschliessungssammlung/IntDSK/2011InternetIPv6.pdf?__blob=publicationFile)
> (PDF-Datei).

Lutz Donnerhacke hat das zum Anlaß genommen, IP V6 einmal unter
Datenschutzgesichtspunkten zu analysieren.

Sein [Artikel](http://www.iks-jena.de/ger/Blog/IPv6-und-der-Datenschutz)
kommt zu dem Fazit:

>Die aus der Not heraus geborene Idee, eine IP Adresse nur temporär einem
> Nutzer zuzuweisen, erwies sich als wirtschaftliche Goldgrube . Da für den
> Betrieb von Servern, also der eigenständigen Bereitstellung von Diensten,
> eine dauerhafte Erreichbarkeit des Servers notwendig ist, bot die
> Beibehaltung dynamischer IP-Adressen den Providern zusätzliche
> Einnahmequellen durch Hosting  realer und virtueller Server, E-Mail und
> vieles mehr. [...]
>
> Es gelang den Marketingabteilungen so erfolgreich, dynamische IPs als
> Vorteil, Schutz und Anonymität darzustellen, daß eine Abkehr von diesem
> Modell wenig wahrscheinlich ist.[...]
>
> Auch die Datenschützer haben sich vor den Karren der Lobbyisten spannen
> lassen. Sie glauben mit dynamischen IP-Adressen das Grundübel des Internet
> aus ihrer Sicht entschärfen zu können. Schließlich invalidiert ja ein
> ständiger Wechsel der IP-Nutzer Zuordnung die von verschiedenen
> Webdiensten ausgeführten Idenitifizerierungen – bis zum nächsten Login,
> Cookie, soziale Netze-Button, E-Mail-Abruf, Tweet oder Werbebanner.

Eines der Hauptprobleme beim Umgang mit IP V6 ist, es als IP V4 mit langen
Adressen anzusehen. Das ist nicht der Fall, wie Lutz an mehreren Beispielen
mit Datenschutzbezug illustriert: Mit IP V6 haben wir so viele Adressen zur
Verfügung, daß einem Kunden nicht nur mehrere Prefixe zugeteilt werden
können, sondern einzelne Adressen auch für Dinge wie
Authentisierungsmechanismen (CGA, Cryptographically Generated Adresses)
verwendet werden können. Er zeigt, wie mit Hilfsmitteln wie rotierenden
Prefixen unterbrechungsfreies Umnummerieren möglich ist (keine
Zwangstrennung mehr), und welche anderen neuen Anwendungen durch V6 erst
ermöglicht werden.

Dann schlägt er die Kehre und kehrt zu der Bemerkung oben zurück: »... bis
zum nächsten Login, Cookie, soziale Netze-Button, E-Mail-Abruf, Tweet oder
Werbebanner.« Lutz dazu: 

> Feste IP Adressen gestatten aber einen ganz anderen Ansatz zur
> Datensparsamkeit. [...
>
> Web 2.0 Techniken füllen eine Webseite mit Inhalten aus anderen Quellen ,
> insbesondere von anderen Servern. Was spricht also dagegen, die privaten
> Daten daheim, auf einem Rechner mit fester IP, beispielsweise dem
> DSL-Router mit angeflanschter USB-Platte, abzulegen und anzubieten? [...]
>
> Diese Vision setzt zwei Dinge voraus: Statische IPv6 Adressen nutzbar auf
> jedermanns Technik und den mündigen Menschen . Beides kann der Datenschutz
> leisten: Er hat den Bildungsauftrag, eigenverantwortlichen Umgang mit
> persönlichen Daten sicherzustellen und den Regulierungsauftrag, die
> betreffenden Hersteller und ISPs zur Entwicklung datensparsamer Konzepte
> anzuhalten. Er bekommt dafür die Chance, aktiv das techno-soziale Gefüge
> des Internets wieder zu demokratisieren.

(Den [vollständigen Artikel lesen](http://www.iks-jena.de/ger/Blog/IPv6-und-der-Datenschutz))
