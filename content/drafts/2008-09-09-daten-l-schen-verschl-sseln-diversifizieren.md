---
author-id: isotopp
date: "2008-09-09T13:32:24Z"
draft: true
feature-img: assets/img/background/rijksmuseum.jpg
published: true
tags:
- datenschutz
- identity
- security
- lang_de
title: Daten - löschen, verschlüsseln, diversifizieren
---
<a href="http://www.heise.de/newsticker/Gestohlene-PwC-Datensaetze-fuer-Missbrauch-von-Click-Buy-benutzt-Update--/meldung/115621">Gestohlene Datensätze von PwC mißbraucht</a> titelt Heise. Das Problem dahinter ist sehr weit verbreitet und in Firmen schwer zu bekämpfen: <blockquote>Die große Zahl der Daten kam offenbar zustande, weil PwC die Bewerberdaten aus vergangenen Jahren auch bei längst abgeschlossenen Verfahren aufbewahrt hatte.</blockquote> Ich weiß aus eigener Erfahrung, daß es unsagbar schwer ist in Firmen Datenlöschungsprozesse aufzusetzen. Dabei spielt es nur eine untergeordnete Rolle, ob eine solche Löschung gesetzlich gefordert ist, beschlossen wurde oder sinnvoll ist.

Derjenige Mitarbeiter, der am Ende die Sache ausführen soll neigt sehr oft dazu, die Daten nicht zu löschen, sondern aus dem System zu nehmen und irgendwo hin zu kopieren. "Irgendwo" ist dabei auch oft ein Ort, der schlechter verschlüsselt und geschützt ist als der vorhergehende Speicherort - ein Band, ein Stick oder eine Diskette, die danach in der Schublade des betreffenden Mitarbeiters liegt - kann ja sein, daß die Daten doch noch mal gebraucht werden - und die dann typischerweise mit dem Schreibtisch irgendwann einmal mit verkauft werden. Oder vorher rausgenommen werden und dem Sohnemann aus der Firma mitgebracht werden - "Hier, der Stick war über."

Aus irgendeinem Grund sind Firmen Strukturen die das Vergessen sehr schwierig machen. Es braucht schon eine ganze Menge individueller Energie in einer solchen Institution, damit eine solche Löschaktion auch tatsächlich dazu führt, daß Daten gelöscht sind.


Die Story auf dem Heise Newsticker hat noch einen weiteren Aspekt: <blockquote>Um auf Konten bei den genannten Zahlungsdienstleister zuzugreifen probierten die Kriminellen laut WISO einfach E-Mail-Adressen und Passwörter durch. Ein Schutzmechanismus gegen Brute-Force- und ähnliche automatisierte Angriffe etwa bei Moneybookers wurde dabei umgangen. Nach Meinung von Wiso gingen die Angreifer davon aus, dass viele Internet-Nutzer für verschiedene Dienste dieselbe Kombination aus E-Mail-Adresse und Passwort benutzen.</blockquote> Das ist ein sehr gängiges Problem. Jedesmal wenn zum Beispiel eine Phishing-Welle über eBay hinweg gerollt ist war danach ein hohes Aufkommen von gestohlenen web.de und GMX-Accounts in diversen Viren festzustellen. Viren wie die Sober-Reihe hatten seinerzeit im Schnitt um die 800 bis 1200 gestohlene Username/Passwort-Kombinationen im Bauch, um die Authentisierungsmechanismen der Mail-Engines aller großen deutschen Provider zu umgehen.

Die Mailadressen zu den Accounts findet man, indem man sich mit einem abgephischten eBay-Usernamen und Paßwort bei ebay einloggt und die Mailadresse ausliest. Mit dieser Adresse und dem eBay-Paßwort versucht der Bot sich dann bei dem betreffenden Freemailer einzuloggen. Oft genug gelingt das - der Bot meldet das Paar dann als validiert an seinen Herrn, der die Daten für die nächste Virenwelle mißbrauchen kann. Der Geschädigte ist so nicht nur seinen ebay-Account, sondern auch seine Mail los, denn der Account ist dann natürlich verbrannt und unzugänglich.
