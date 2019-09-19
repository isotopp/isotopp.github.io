---
layout: post
published: true
title: Bundestrojaner, Sina-Boxen und Mailüberwachung
author-id: isotopp
date: 2007-03-11 11:51:22 UTC
tags:
- security
- überwachung
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Der Artikel <a href="http://blog.koehntopp.de/archives/1600-Der-Bundestrojaner-durchdekliniert.html">Der Bundestrojaner durchdekliniert</a> hat, wenn man nach den Trackbacks und den Kommentaren geht, einiges Echo hervorgerufen.

Einige der derzeit kursierenden Kommentare und Theorien zum Bundestrojaner sind aber Unsinn und ich bin in der Position, das vielleicht ein wenig gerade zu ziehen. So heißt es erstmals bei <a href="http://www.heise.de/tp/r4/artikel/24/24766/1.html">Telepolis: Heimliche Online-Durchsuchungen sind möglich</a>: <blockquote>Denn der Staat hat bereits eine vollständige Infrastruktur für Man-In-The-Middle-Angriffe auf jegliche elektronische Telekommunikation: die [extern] SINA-Boxen bzw. IMS (Interception Management Systems). 

Diese Geräte muss ein jeder größerer Provider in seinem Netz installiert haben, dazu verpflichtet ihn die TKÜV. Denn über diese Geräte ist die [extern] Möglichkeit des Abhörens jeglicher Telekommunikation implementiert. SINA-Boxen ließen sich ohne großen Aufwand zu weiteren Zwecken umbauen.</blockquote> Dies wird in <a href="http://www.gulli.com/news/schweizer-bundestrojaner-2007-03-07/">Mitarbeiter von Antiviren-Software werden zur Mitarbeit gedrängt</a> aufgegriffen: <blockquote>Mitarbeiter des Magazins von Telepolis halten den Einsatz von Trojanern für möglich und jeglichen Schutz dagegen für schwierig. Deren Ansicht nach könnte der Staat den Vertreib ihrer Durchleuchtungssoftware mit vergleichsweise wenig Aufwand realisieren. Von statten gehen soll dies unter unter Mithilfe der Modifikation der SINA-Boxen. (Sichere Inter-Netzwerk Architektur) Zu dessen Einbau ist jeder größere Internetanbieter verpflichtet. Durch das Verfremden eines beliebigen Downloads kann der staatliche Angriffscode auf dem heimischen Rechner implantiert werden.</blockquote> Das ist vollkommen falsch.


<div class="serendipity_imageComment_right" style="width: 110px"><div class="serendipity_imageComment_img"><a class='serendipity_image_link' href='http://www.bsi.de/fachthem/sina/sysbesch/sysbesch.htm'><!-- s9ymdb:4253 --><img width='110' height='70'  src="/uploads/sina-schema.serendipityThumb.gif" alt="" /></a></div><div class="serendipity_imageComment_txt">Sina-Box: Funktionen und Aufbau</div></div> Was Sina ist und kann, kann man beim BSI nachlesen: <a href="http://www.bsi.de/fachthem/sina/sysbesch/sysbesch.htm">Projekt Sina Systembeschreibung</a>. Die Abkürzung SINA steht dafür für Sichere Inter-Netzwerk-Architektur. Es handelt sich um ein System von Kryptoboxen, mit denen ein zentral gesteuertes, plattenloses VPN aus zertifizierten Komponenten aufgebaut werden kann und dann weiter um die dazu passenden Managementsysteme und jetzt neu auch plattenlose Arbeitsplatzsysteme zur Verarbeitung von Daten mit hoher Geheimhaltungsstufe und die dazu passende Server-Architektur mit gehärteter Virtualisierungssoftware und Datenimportfunktionen.

SINA ist für eine Reihe von Szenarien entwickelt worden, in denen Daten mit hoher Geheimhaltungsstufe in feindlichen Umgebungen bearbeitet werden müssen. Dazu gehören zum Beispiel auch die Dienststellen und Botschaften des auswärtigen Amtes.

Sina hat keine Funktionen, die Daten in unsicheren Netzen abfangen, verändern oder manipulieren können. Sina hat stattdessen genau die entgegengesetzte Funktion, nämlich solche Angriffe zu verhindern und unmöglich zu machen.

Welche Rolle hat also die SIN-Architektur im Rahmen der Abhörverpflichtung von Mailanbietern?

Vor der Neuregelung der TKÜV ist Überwachung bei verschiedenen Mailanbietern uneinheitlich durchgeführt worden. Das betraf einerseits die Durchführung der Überwachung hinsichtlich der Art der überwachten Aktivitäten, andererseits die Art der Übermittlung der Überwachungsergebnisse an die berechtigte Stelle.

So war komplett undefiniert, welche Events etwa bei der Überwachung einer IMAP-Mailbox geloggt werden müssen und es war durchaus denkbar, daß ein überwachungsverpflichteter Mailanbeiter etwa den Eingang von Nachrichten durch manuelles Einkopieren mittels der APPEND-Methode komplett übersah, weil er nur den normalen Zustellprozeß geloggt hat. Andererseits erfolgte die Übermittlung von Überwachungsergebnissen an berechtigte Stellen zum Teil ungesichert (durch Zustellung über das offene Internet an "unverfänglich" benannte Mailaccounts von berechtigten Stellen bei Webmailhostern)  oder auf sehr langsamen Wegen (Postzustellung von gebrannten optischen Medien an die berechtigte Stelle).

Die überarbeitete TKÜV definiert nun nicht nur recht genau, welche Events geloggt werden müssen und in welchem Format die Übermittlung erfolgen muß, sondern sie definiert auch, wie diese Events an die berechtigten Stellen übermittelt werden sollen. Das ist die Stelle, an der die SINA-Boxen ins Spiel kommen. Sie werden verwendet, um ein VPN aufzubauen, das zentral gemanaged wird und das eine sichere und authentisierte Kommunikation zwischen den Verpflichteten und den berechtigten Stellen ermöglicht. Die Sina-Box nimmt also keine Überwachungsaufgaben wahr - das kann sie konstruktionsbedingt gar nicht - sondern sie erlaubt "nur" die sichere Kommunikations der Überwachungsergebnisse zwischen den Verpflichteten und den Behörden. Das ist gegenüber dem Zustand vor der neuen TKÜV in der Tat eine deutliche Verbesserung!

Die konkrete Implementierung der Überwachung ist immer noch Aufgabe der verpflichteten Firma: Sie muß entweder ihr existierendes Mailsystem selbst so modifizieren, sodaß sie Überwachungsoutput erzeugt und sich dieses Gesamtsystem dann entsprechend zertifizieren lassen. Oder sie kann eine fertige, zertifizierte Überwachungslösung, etwa die Lösung von <a href="http://netuse.de">NetUSE</a>, kaufen und in ihr Netz integrieren.

Die Sina-Box wird dabei als fremd-administrierte Komponente im Regelfall auf eine Weise in das Netz des Dienstanbieters integriert, die lediglich eine Kommunikation vom Anbieter durch die Sina hindurch in Richtung der Behörde erlaubt. Alle Kommunikation in Gegenrichtung wird jedoch vollständig geblockt, sofern das Sicherheitskonzept des Dienstanbieters sein Geld wert ist, d.h. die SINA steht in einer abgeschotteten DMZ, deren Firewall alle Connectversuche aus der Sina-Zelle heraus ins Produktionsnetz ausnahmslos blockt.

Dies ist möglich, da auch mit der revidierten TKÜV alle Überwachungsanordnungen "out of band" auf traditionellen Wegen (per Post oder Fax) bei dem verpflichteten Anbieter eingehen, dort durch den lokalen G10-Beauftragten ggf geprüft werden und dann mehr oder weniger manuell ins TKÜV-Interface eingehackt werden.

Die Anzahl der Anordnungen hielt sich dabei zumindest bis vor zwei Jahren noch einigermaßen im Rahmen: In den mir bekannten Fällen lagen pro Million Kunden ca. 2 Überwachungsanordnungen vor. Das erscheint mir plausibel: Ich kann durchaus glauben, daß sich in einer Menge von je 500.000 Menschen (so viele Personen wie in Kiel und Karlsruhe zusammen leben) jeweils mindestens eine Person befindet, gegen die die Polizei ausreichend Verdachtsmomente wegen so schwerer Straftaten in der Hand hat, daß sie Genehmigung einer solche Maßnahme durch einen Untersuchungsrichter rechtfertigen. In der Tat finde ich diese Zahl sogar klein. Und die Art der Übermittlung der Ergebnisse einer solchen Überwachung durch das SINA-VPN erscheint mir angesichts der Art der übermittelten Daten sehr viel angemessener als die vorher verwendete Methode.

Das ist auch genau das, was ich von einem Rechtsstaat erwarten würde: Wenn wir so etwas schon tun müssen, dann bitte so wenig wie möglich, so kontrollierbar wie möglich und qualitativ so hochwertig wie möglich. Damit das vollkommen klar ist: Ich halte die neue TKÜV und das Sina-Zeugs gegenüber der Situation vorher für einen deutlichen Fortschritt!

Nur, wie gesagt, mit dem Bundestrojaner hat <i>das</i> alles nichts zu tun. Im Gegenteil: Was ich dann bei <a href="http://www.andreas.org/blog/?p=307">andreas.org</a> lese, läßt mich vermuten, daß es sich bei der ganzen Bundestrojaner-Idee um etwas technisch höchst riskantes und unausgegorenes handelt, das technisch nicht nur fragwürdig und schwer zu kontrollieren ist, sondern das qualitativ auch in die falsche Richtung geht.

Leute, so was hier ist ein sehr gefährliches Spiel, mit dem der Staat sich mehr vergibt als er jemals wieder durch diese Maßnahme reinholen kann: <blockquote>Um die Sache mal ein bißchen in den Kontext zu rücken, möchte ich von zwei Job-Angeboten berichten, die mich in den vergangenen Monaten erreicht haben. Zum einen hat das BSI angefragt, ob ich nicht eine Schulung zum Thema &#8220;wie schreibe ich einen buffer overflow exploit&#8221; für Vertreter diverser Behörden und Organisationen mit Sicherheitsaufgaben halten könne. Zum anderen bekam mich eine Anfrage, doch ein Angebot zur Entwicklung einer transparent bridge abzugeben, die einen Download eines ausführbaren Programms erkennt und dieses on-the-fly mit einem Trojaner versieht.</blockquote> Das hat mit Rechtsstaat nix zu tun, das ist der Versuch, Stasi-Methoden zu legalisieren.

Die Meldung auf andreas.org ist andererseits nicht so ungewöhnlich. Via <a href="http://blog.fefe.de/?ts=bd1cf9c9">fefe.de</a> dieser Anfang 2006 beobachtete Maildialog bei <a href="http://nibbler.de/tkuev">nibbler.de</a>: <blockquote>250-PIPELINING
250-XXXXXXXA
250 XXXB
starttls
500 unrecognized command
quit</blockquote> Solche Kommunikations-Manipulation on-the-fly findet offenbar schon statt! Wir alle - unsere Regierung eingeschlossen! - tun gut daran, Infrastruktur zu bauen, die so etwas verhindert, anstatt da bekannte Bruchstellen zu konstruieren und zu pflegen.
