---
layout: post
published: true
title: "Sperrungen im Internet - Eine systematische Aufarbeitung der Zensurdiskussion"
author-id: isotopp
date: 1997-05-14 16:15:56 UTC
tags:
- lang_de
- politik
- jugendschutz
feature-img: assets/img/background/rijksmuseum.jpg
---
## Zusammenfassung

Wie alle anderen Medien wird auch das Internet zur Verbreitung von beispielsweise rechtsradikalen oder kinderpornographischen Informationen mißbraucht. Dies hat in letzter Zeit den Ruf nach einem staatlichen Eingriff laut werden lassen, um zentrale Sperrungen bestimmter Inhalte zu erreichen.  

Die Autoren halten einen solchen Schritt fuer nicht angemessen. Zum einen haben bisher alle technischen Ansätze zur Realisierung versagt. Strukturelle überlegungen lassen vermuten, daß dies auch in Zukunft der Fall sein wird. Auf der anderen Seite haben Sperren stets Auswirkungen auch auf Bereiche, deren Sperrung nicht beabsichtigt ist. Diese Nebenwirkungen sind um so schwerwiegender, je wirksamer die Sperren sein sollen.

Dezentrale Lösungsansaetze können dem Nutzer die Möglichkeit geben, im eigenen Bereich selbstverantwortlich Inhalte zu filtern. Bewertungen von Inhalten durch nichtstaatliche Organisationen können dazu führen, daß der Bewertungsmechanismus zur Durchsetzung fragwürdiger Interessen mißbraucht wird. Um diesem Risiko entgegenzuwirken, ist es unverzichtbar, daß nicht nur die Bewertungsmaßstäbe, sondern auch die Bewertungen selbst vollständig offengelegt werden.

Jede Art von staatlicher Regulierung treibt die Kosten in die Höhe. Es ist abzusehen, daß der Versuch, Inhalte im Internet zu bewerten, sehr personalintensiv sein wird. Bereits heute sind die Kommunikationskosten am Standort Deutschland wesentlich höher als bei konkurrierenden Nationen wie den USA. Regulierungen können daher zu einem Standortnachteil führen.

## Was soll mit einer Sperrung erreicht werden?

Bevor man über technische Maßnahmen zur Sperrung von Inhalten im Internet und die Chancen ihrer Realisierung reden kann, muß man sich darüber klar werden, welche Ziele man mit einer solchen Sperrung erreichen möchte.

Mögliche Ziele sind:

- **Law Enforcement:** Man möchte verhindern, daß nach den Kriterien einer nationalen oder regionalen Rechtsordnung strafrechtlich relevantes Material für die Subjekte dieser Rechtsordnung erreichbar ist bzw. von ihnen veröffentlicht werden kann, und zwar auch dann, wenn der Ort der Veröffentlichung außerhalb des Durchsetzungsbereiches dieser Rechtsordnung liegt. Traumziel wäre es, das Begehen solcher Straftaten technisch unmöglich zu machen.
- **Indecency:** In den USA wurde mit dem *communication decency act* (*CDA*) in seinen verschiedenen Formulierungen und Gesetzesvorlagen versucht, eine noch weitergehende Regelung zu etablieren: Es sollte verboten werden, Material über Datennetze zugänglich zu machen, das *indecent* ist, d.h. nach den Grundsätzen der jeweils herrschenden Moraldefinition ungehörig, obszön oder in anderer Weise störend (zu Free Speech siehe z.B. [The Electronic Frontier Foundation](http://www.eff.org) EFF).
- **Jugendschutz:** Nur Minderjährigen (Kindern und Jugendlichen) soll der Zugang zu bestimmten Materialien verwehrt werden, während Volljährigen weiterhin die gesamten Inhalte des Internet zugänglich bleiben sollen.
- **Rating:** Für jeden Teilnehmer im Netz soll weiterhin frei definierbar sein, welches Material empfangen/nicht empfangen werden soll, aber es soll eine Bewertungsstruktur geschaffen werden, die es jedem Konsumenten in  eigener Verantwortung ermöglicht, seine Präferenzen anzugeben (kein Sex/viel Sex, keine Gewalt/Blood and Splatter, politisch links/politisch rechts, konform mit den Vorstellungen der katholischen Kirche/islamisch korrekt) und nur noch den Ausschnitt aus dem Internet wahrzunehmen, der diesen selbstgewählten Filter passieren kann.
- **Nichtregulation:** Jeder Netzteilnehmer soll freien Zugriff auf alle angebotene Information haben. Sogar die Existenz von Bewertungskriterien Dritter wird als schädlich angesehen und die Bildung einer Bewertungsinfrastruktur nicht gefördert bzw. sogar behindert.

## Welche Dienste werden betrachtet?

Unter der Bezeichnung *Inhalte im Internet* wird in der Regel eine ganze Reihe von Diensten subsumiert, die technisch vollkommen unterschiedlich realisiert werden und administrativ zu großen Teilen disjunkte Strukturen aufweisen. Allen Diensten ist lediglich gemeinsam, dass ihnen das Datenübertragungsprotokoll TCP/IP zugrunde liegt.  

Man muß mindestens die beiden folgenden Dienste unterscheiden:

**WWW, World Wide Web:** Das World Wide Web ist der graphisch ansprechendste Dienst des Internet. Es handelt sich um Server, die auf die Anfrage eines Benutzers Seiten beliebigen Inhaltes an das Darstellungsprogramm (*Browser*) auf seinem Rechner ausliefern. Der Zugriff auf diese Seiten erfolgt in der Regel mit Hilfe des HyperText Transport Protocol (*HTTP*). Dieses Protokoll erfordert keine Identifizierung oder Authentisierung des Abrufers und des Anbieters; die Daten werden im Klartext und nicht fälschungssicher übermittelt.

Eine optional einsetzbare Modifikation von HTTP übermittelt
Anfragen und Antworten mit Hilfe des Verschlüsselungsverfahrens *Secure Socket Layer* (*SSL*). Bei diesem Verfahren muß sich mindestens der Anbieter gegenüber dem Abrufer identifizieren. Weiterhin ist sichergestellt, daß die Verbindung nicht im Klartext abhörbar ist (Dritten wird nicht bekannt, welche Anfragen gestellt wurden oder welche Inhalte die ausgelieferten Seiten haben) und daß Inhalte nicht durch Dritte während der übertragung unerkannt verfälscht werden können.

Die abgerufenen Seiten bestehen aus Formatierungsanweisungen der *HyperText Markup Language* (*HTML*) und optional weiteren Bild-, Ton- oder Videodaten. Bei kleineren Servern liegen die abrufbaren Seiten häufig statisch als vorgefertigte und unverändert ausgelieferte Dateien auf der Festplatte vor.

Größere Server erzeugen die Seiten jedoch oftmals dynamisch in Abhängigkeit von der Identität des Abrufers, seiner Netzadresse, seiner bevorzugten Landessprache (im Browser konfigurierbar), dem vom Abrufer verwendeten Browsertyp, der Uhrzeit des Abrufs oder anderen Kriterien, die frei progammierbar sind. Es ist also nicht sichergestellt, daß zwei aufeinanderfolgende Abfragen derselben Seite identische Antworten ergeben.

Falls die Seiten aus einer Datenbank dynamisch erzeugt werden, kann sich der Datenbestand des Webservers durch die Updates der Datenbank ständig aendern. Dies ist zum Beispiel der Fall bei Katalogsystemen fuer Onlinehandel (Preis- und Produktupdates, Änderungen im Lagerbestand mit Auswirkungen auf die Lieferbarkeit usw.), bei Nachrichtenagenturen mit Anschluß an Presse- und Tickerdienste und bei Webverzeichnissen und Suchmaschinen, die einen Volltextindex für Seiten generieren und eine Recherche nach Inhalten erlauben.

Grundsätzlich ist der Datenbestand im Web als höchst dynamisch anzusehen: Neue Versionen von Seiten lassen sich zu sehr geringen Kosten erzeugen und in Verkehr bringen. Der elektronische Charakter des Mediums im Zusammenhang mit der zentralen Datenhaltung (es sind keine verteilten Kopien einer Seite auf Stand zu bringen) begünstigen weiterhin eine sehr hohe Auflagenfrequenz.


**USENET News:** Das USENET ist ein verteiltes System vom Diskussionsforen (*Newsgroups*). Es handelt sich um ein teilweise zusammenhängendes Netz von Servern, von denen jeder eine Auswahl von Artikeln zum Abruf bereithält. Die Artikel sind in der Regel in thematisch gegliederten Diskussionsforen in der Reihenfolge des Eingangs abgelegt. Leser können eine Verbindung zum netztopologisch am günstigsten gelegenen Server aufbauen und Artikel nach Diskussionsforen und Eingangsdatum selektiert abrufen.

Leser können grundsätzlich auf jeden gelesenen Artikel
antworten (*to follow up on an article*) oder unabhängig
eigene Artikel auf dem Server ablegen (*posten*, von engl. *to post a notice*). Der Server wird dann seine Nachbarserver darüber informieren, daß er einen neuen Artikel vorrätig hat, und den Artikel ggf. an seine Nachbarserver replizieren (*to feed an article to a neighboring system*).

Diese verbreiten den Artikel dann wieder an ihre Nachbarn usw. (*flood fill algorithm of USENET*). Nach einigen Stunden existieren Hunderttausende von Kopien dieses Artikels auf der gesamten Welt. Die Vernetzung der Server ist hochredundant; Unterbrechungen in Serverstrecken haben in der Regel keine oder nur lokal meßbare Auswirkungen auf Verfügbarkeit oder Transportgeschwindigkeit der Artikel.

Um Platz zu gewinnen, werden die jeweils ältesten Artikel nach einiger Zeit gelöscht. Die genaue Zeitspanne bis zur Löschung hängt von der  individuellen Konfiguration des Servers und seiner Platzsituation ab, liegt aber in der Regel nicht über 14 Tagen. Es existieren jedoch auch einige Newsarchive, die Diskussionen über mehrere Jahre hinweg abspeichern und diesen Datenbestand durch weitgehende Recherchemöglichkeiten erschliessen (z.B.  [DejaNews](http://www.dejanews.com/), [AltaVista](http://www.altavista.digital.com/) im Newsmodus).

Dadurch, daß jeder Leser auf beliebige Artikel direkt und ohne redaktionelle Bearbeitung antworten kann, entspinnen sich in der Regel unmoderierte, öffentliche Diskussionen zu allen möglichen Themen. Ein Großteil der Diskussionsforen wird global ausgetauscht. Daher ist die Zusammensetzung der Diskussionsrunden zufällig und international.

Die Kommunikation zwischen Leser und Server sowie die Kommunikation zwischen den Servern erfolgt in der Regel unverschlüsselt und ohne Identifizierung und Authentisierung der Leser oder der Autoren von Artikeln. Die Fälschung von Absenderadresse oder Herkunftspfad eines Artikels ist trivial und in einigen Diskussionsforen sogar üblich. Es existieren Konverter von E-Mail nach USENET News und Anonymous- sowie Pseudonymous-Server, die zum Teil mit kryptographisch starken Methoden die Identität des Absenders sowie seinen Aufenthaltsort im Netz zu verschleiern suchen. Einige Newsserver lassen Lese- und Schreibzugriff von jedermann und ohne Authentisierung zu (*open servers*); es ist Sache des Veröffentlichenden, seine Identität in einem Artikel offenzulegen oder nicht.

Die Entscheidung über die von einem Server angebotenen Diskussionsforen obliegt in der Regel jedem einzelnen Serverbetreiber. Teilweise existieren Kataloge von offiziellen Newsgroups, diese sind jedoch in der Regel weder vollständig noch für irgendwen verbindlich. Name oder überschrift einer Newsgroup haben nur den Charakter von Empfehlungen. Thematisch falsch eingeordnete Artikel (*off topic postings*) oder bewußt massenhaft in alle Newsgroups verbreitete Artikel (*spam*) machen einen festen Anteil aller Artikel aus.

Die Dienste **IRC** (**Internet Relay Chat**) und *E-Mail* (Private elektronische Post sowie halböffentliche Mailinglists als Diskussionsforen) wären ebenfalls zu betrachten, sollen hier aber im Interesse einer kompakten Darstellung nicht diskutiert werden, da sie weniger im Rampenlicht der öffentlichen Diskussion stehen. Die genannten Argumente gelten aber in ähnlicher Form auch dort. Es existieren weitere Dienste, die fuer die öffentliche Kommunikation in der Regel von geringerer Bedeutung sind (*telnet*) oder deren Diskussion keine neuen Aspekte zu Tage foerdern wuerde (*ftp*, siehe *http*).

## Wie koennen zu sperrende Inhalte identifiziert werden?

Um Inhalte zuverlässig sperren zu können, ist es notwendig, diese Inhalte in irgendeiner Form zu identifizieren. Diese Identifizierung kann von unterschiedlicher Auflösung sein.  

Auf der Basis von IP-Adressen kann ein einzelner Rechner identifiziert werden. Ein solcher Rechner erbringt jedoch in der Regel eine Vielzahl von Diensten für mehrere unterschiedliche Anbieter. Webserver von IP-Providern bringen unter einer IP-Adresse teilweise die Angebote von Tausenden Inhaltsanbietern ins Netz, Rechner von Kleinprovidern bieten teilweise alle Dienste des Providers unter einer IP-Nummer an. Eine Sperrung von IP-Nummern trifft also außer den zu sperrenden Inhalten meist auch eine große Menge von Inhalten und Diensten, deren Sperrung nicht beabsichtigt ist.

Mit entsprechendem Mehraufwand können dienstspezifische Kennzeichen von einzelnen Einheiten des Angebotes identifiziert werden. Im World Wide Web ist dies der Name einer Seite (ihr *Universal Resource Locator*, *URL*), in den USENET News erfolgt die Identifizierung über die Message-ID einer einzelnen Nachricht oder den Namen einer Newsgroup. Für neu entstehende Dienste müssen dienstspezifische Methoden zur Identifikation einzelner Einheiten neu gefunden werden.

Die zu bewertenden Datenmengen sind riesig: Die Suchmaschine [Altavista](http://www.altavista.digital.com/) hatte im Mai
1996 schon 30 Millionen Webseiten in ihrer Volltextdatenbank
gespeichert; im April 1997 betrug das Newsaufkommen mehr als 72
Gigabyte für etwa 5,4 Millionen Artikel (Statistik von Eunet
Deutschland GmbH aus [de.admin.lists](news:de.admin.lists) vom 01.05.97).

Es bleibt das Problem, zu sperrende Inhalte aus der Menge aller Inhalte zu isolieren. Hier gibt es nur zwei grundsätzlich verschiedene Systeme:

- Die automatische Bewertung von Inhalten auf der Basis formaler Merkmale wie etwa dem Vorhandensein bestimmter Schlüsselworte.
- Die manuelle Bewertung von Inhalten durch den Anbieter oder Dritte nach bestimmten Kriterienkatalogen (*rating*).

Verfahren zur automatischen Bewertung von Inhalten aufgrund von Schlüsselworten scheitern bei Komponenten, die keinen Text enthalten (Audiodateien, Bilder oder Animationen) schon im Ansatz.

Einige Online-Dienste (Prodigy, AOL) haben versucht, Diskussionen in dem IRC-Dienst ähnlichen Chaträumen aufgrund des Gebrauchs bestimmter Schlüsselworte bewerten zu lassen; die Ergebnisse waren wenig befriedigend. Einerseits waren normale Diskussionen über bestimmte Themen nicht mehr möglich:

Eine Sperrung des Wortes *suck* erschwerte den Meinungsaustausch zu Staubsaugern in einem Haushaltsforum, eine Sperrung des Wortes *breast* behinderte Diskussionen über Brustkrebs oder Kochrezepte (Hühnerbrust), und die Webseiten von Frau Cindy Tittle Moore (tittle@netcom.com) wurden durch das Programm Cybersitter wegen ihres Namens gesperrt.  

Andererseits veränderte die eigentliche Zielgruppe einfach ihr Vokabular, so daß die Sperrung auf diese Zielgruppe keine nennenswerte Auswirkung hatte. Auch andere automatisierbare Bewertungsmethoden vermögen nicht die Semantik der Inhalte zu erkennen. Wer solche formalen Sperrkriterien kennt, kann leicht die Darstellung seiner Informationen je nach Bedarf an diese Kriterien anpassen, ohne die inhaltliche Aussage zu verändern.

Das Kindersicherungsprogramm Cybersitter ist beispielsweise in der
Lage, als offensive eingestufte Worte aus Webseiten
herauszuschneiden. Durch geschickte Formulierung sind so Aussagen in ihr Gegenteil verkehrbar, wenn sie unter Cybersitter betrachtet werden (Nachricht von Bennett Haselton auf der Mailingliste 
[fight-censorship@vorlon.mit.edu](mailto:fight-censorship@vorlon.mit.edu), Message-ID: <01IAZF6R8I0I8XKGCV@ctrvax.Vanderbilt.Edu>).

Verfahren und Standards zur Bewertung von Inhalten durch den Anbieter oder Dritte liegen für den Bereich des World Wide Web bereits vor, das System [PICS](http://www.w3.org/pub/WWW/PICS/) (Platform for Internet Content Selection) ist dabei zur Zeit führend. PICS erlaubt die Installation frei definierbarer Bewertungsmaßstäbe mit einer beliebig feinen Auflösung. 

Bewertungen von URLs koennen von den Anbietern selbst oder durch Dritte erfolgen. Gängige Bewertungsmaßstäbe sind dabei etwa Gewalt, Sex oder unanständige Sprache, die Abstufungen reichen von digitalen 0-1-Skalen bis zu sehr fein abgestuften Systemen. Die Auswertung von PICS-Einstufungen kann entweder im Clientprogramm des Anwenders erfolgen (dies wird zur Zeit vom Microsoft Internet Explorer unterstützt) oder auf Routern auf dem Weg zum Empfänger (dies geschieht zur Zeit nicht).

Das Hauptproblem bei der manuellen Bewertung von Inhalten ist die große Menge der anfallenden neuen oder veränderten Seiten. Der Betreiber des Nachrichtenservers [www.msnbc.com](http://www.msnbc.com/) (Joint-Venture von NBC und Microsoft) hat die Bewertung seiner Beiträge auf der Basis des von Microsoft geförderten Bewertungsschemas RSACi für PICS eingestellt, da die Bewertung einzelner Beiträge zu aufwendig war und eine Pauschalbewertung des Servers nach den Regeln von PICS den Server fuer Minderjährige unzugänglich gemacht haette (Briefwechsel zwischen Irene Graham, Michael Sims, Stephen Balkam (RSAC Ratingaufsicht) und Danielle Bachelder (MSNBC Systembetrieb), zitiert in <3339dd1a.500215@mail.thehub.com.au> und <199703191314.IAA03203@arutam.inch.com> auf derselben
Mailingliste).

Hinzu kommt, dass die Webseite abhängig vom Kontext des Abrufes  unterschiedlich aussehen kann, so daß eine Bewertung nach dem PICS-System problematisch wäre. Gerade diejenigen Seiten, die die interaktive Komponente des Internet ausnutzen, könnten so wegen ihrer dynamischen Generierung aus der Bewertung herausfallen und würden damit in entsprechend konfigurierten Browsern und Suchmaschinen nicht mehr dargestellt.

Die Bewertung von Angeboten erfolgt im Rahmen von PICS derzeit durch private Organisationen. Die Möglichkeiten des Widerspruchs gegen eine bestimmte Einstufung sind dabei begrenzt. Insbesondere ist es für einen Bürger schwierig, ein korrektes Rating einzufordern, wenn die Ratingorganisation in einem fremden Land sitzt. Im Prinzip liegt hier dasselbe Problem vor, das sich zur Zeit bei der Strafverfolgung ausländischer illegaler Angebote stellt, nur daß die Ressourcen und Beweislasten nun andersherum verteilt sind:

Ein Anbieter muß nun bei falscher Einstufung beweisen, dass sein Angebot legal ist, und er muß dazu den schwierigen Weg der Durchsetzung von Ansprüchen im Ausland gehen. Im Vergleich zu einer Staatsanwaltschaft ist ein Anbieter von Webseiten dafür im Durchschnitt schlechter ausgebildet,  und ihm stehen weniger Ressourcen zur Verfügung.

Weiterhin orientieren sich die Ratingorganisationen an Werten und kulturellen Maßstäben ihrer Nation. Die übernahme ausländischer Bewertungen für deutsche Benutzer ist daher problematisch. Da jedoch keine deutsche Zugriffssoftware existiert, werden meist nur ausländische (speziell US-amerikanische) Ratingsysteme unterstützt.

Die meisten Ratingorganisationen dokumentieren ihre Ratings nicht oder nur sehr ungern. Zum Teil erfolgt noch nicht einmal eine Benachrichtigung des Bewerteten über die Bewertung seines Angebotes. Vollständige Verzeichnisse aller vergebenen Ratings werden meist mit der Begründung unter Verschluss gehalten, daß diese Verzeichnisse als Kataloge fuer Schmutz und Schund mißbraucht werden könnten. Bei den Programmen, die die Bewertungen von Webseiten Dritter nicht online beziehen, sondern als Datei auf der lokalen Festplatte installiert haben, ist diese Liste grundsätzlich verschlüsselt - und meistens auch veraltet. Auch gegenüber dem Benutzer solcher Software ist damit nicht offengelegt, welche Angebote ihm nicht mehr zugänglich sind.

Inzwischen existieren (illegal) entschlüsselte Versionen der Sperrlisten aller Hersteller von Programmen mit statischer, in Dateien gelieferter Sperrliste. Die Auswertung der Sperrungen hat bei allen Herstellern eine klare politische Agenda und persönliche Feindschaften dokumentiert.

Beispielsweise wurden vielfach Angebote von *womens organizations*, Informationsangebote über Abtreibung und Angebote schwuler und lesbischer Gruppen zensiert. Es ist weiterhin üblich, Webseiten in die Sperrlisten aufzunehmen, die den Hersteller des Sperrprogramms kritisieren, die Sperrliste offenlegen oder allgemein gegen Rating argumentieren. Beim Hersteller des Programms Cybersitter geht dies so weit, daß bei installiertem Cybersitter alle Seiten nicht mehr abrufbar sind, in denen die Namen von Kritikern seines Programms erwähnt werden.

## Mit welchen Mitteln kann eine Sperrung erreicht werden?

Sperrungen können auf unterschiedlichen Ebenen der Kommunikation ansetzen:  

Um erfolgreich zu kommunizieren, müssen beide Kommunikationspartner eine physikalische Verbindung zueinander aufbauen. Dies kann eine Standleitung, eine Telefonleitung, eine Richtfunkstrecke oder eine andere Kommunikationsform sein. Eine normalerweise nicht praktikable Möglichkeit der Sperrung besteht darin, diese physikalische Kommunikation zu verhindern, indem man etwa einen Telefonanschluss sperrt oder bestimmte Telefonnummern nicht erreichbar schaltet, Standleitungen unterbricht oder Störsender in Richtfunkstrecken einbringt. Das Opfer der Sperrung verliert damit in der Regel alle seine Kommunikationsmöglichkeiten.

Im Internet wird meist keine homogene physikalische Verbindung verwendet, sondern diese Verbindung wird aus Teilstücken unterschiedlicher Technologie zusammengestückelt. An den übergangspunkten zwischen den Teilstücken befindet sich ein Router, der IP-Pakete von einem Teilstück zum nächsten hinueberhievt.

Die Funktionalität des Routers wird dabei von den Adressen in den einzelnen IP-Paketen und seinen Routingtabellen gesteuert. In den Routingtabellen ist eingetragen, in welche Richtung der Router Pakete mit einer gegebenen Zieladresse weiterzuleiten hat. Die klassische Dienstleistung eines Providers besteht darin, einen übergang zwischen einer Wählverbindung (Privatkunden) oder einer regionalen Standleitung (Firmenkunden) und einer oder mehreren Standleitungen in das Ausland zu bieten. Dem Provider ist dabei nicht bekannt, welche Dienste der Kunde in Anspruch nimmt oder welche Daten abgerufen werden.

Sperrungen können hier über Eingriffe in die Routingtabellen von Routern vorgenommen werden. Es ist beispielsweise leicht möglich, alle Pakete an bestimmte Zieladressen am Router verwerfen zu lassen (eine Route zu *erden*). Mit diesem Verfahren werden ganze Rechner unerreichbar: Bei der durch den DFN-Verein praktizierten Sperrung des Rechners mit dem Namen [www.xs4all.com](http://www.xs4all.com/) waren auf diese Weise die Webseiten von mehr als 6000 Anbietern nicht mehr abrufbar, es konnte keine Mail auf der Maschine www.xs4all.com eingeliefert werden, und auch alle andere Kommunikation des DFN-Vereins mit dieser Maschine wurde unterbunden.

Die Auswahl eines Dienstes erfolgt im TCP/IP-Protokoll in der Regel durch die Angabe einer TCP-Portnummer. Mit Hilfe dieser Portnummer könnte eine selektivere Sperrung eines Dienstes erfolgen. Beispielsweise sind einige Router in der Lage, nach entsprechender Konfiguration TCP-Verkehr fuer den Port 80 (HTTP) zu einer Zieladresse zu sperren, Verkehr auf Port 25 (Mail) zu derselben Adresse aber zu gestatten.

Mit Hilfe eines Vermittlungsrechners (*proxy*) oder anderer Firewallsoftware, denen die im Netzmodell höher liegenden Ebenen zugänglich sind, kann eine selektive Sperrung auf der Ebene von Dienstelementen (einzelnen Seiten, einzelnen Nachrichten) erreicht werden. Die Firewallsoftware muß herbei jedoch fuer jeden Dienst (WWW, News, Mail, IRC etc.) angepaßt werden.

Solche Systeme sind in der Regel sehr aufwendig im Betrieb, da sie für die nutzenden Clients die volle Leistung aller durch den Client in Anspruch genommenen Dienste simulieren müssen. Mit steigender Zahl von Clients skalieren sich diese Systeme ausgesprochen schlecht. Trotzdem setzen einige totalitäre Staaten auf dieses System, um das Eindringen mißliebiger Inhalte in das Land zu erschweren: In China, Singapur und in den Golfstaaten läuft sämtliche Kommunikation mit dem Ausland durch staatlich betriebene Firewalls.

Sperrung von IP-Adressen und der Einsatz von Firewalls ist unter bestimmten Voraussetzungen kombinierbar, dadurch ist eine Entlastung der  Firewallmaschine möglich: Anstatt die Route zu einer zu sperrenden Maschine zu erden, läßt man alle Routen zur zu sperrenden Maschine auf einen Firewall zeigen, der dann die Dienste der zu sperrenden Maschine überwacht. 

Diese Lösung ist je nach Art der zu sperrenden und zu simulierenden Dienste sehr aufwendig zu konfigurieren und zu warten. Zum einen setzt sie einen zentralen übergangspunkt zwischen dem zu kontrollierenden deutschen Netz und dem Rest der Welt voraus. Zum anderen handelt es sich bei diesem Verfahren um einen klassischen *Man in the middle* Angriff. Dadurch versagt das Verfahren bei aller stark verschlüsselten Kommunikation, die  unempfindlich gegen solche Angriffe ist.

Grundsätzlich sind die Auswirkungen von Filtermechanismen auf die Systemleistung um so höher, je feiner die Granularität der Sperrungen ist und je größer die Liste der zu sperrenden Informationsquellen ist. Systeme wie PICS lassen sich nicht effizient an zentralen Stellen im Netz etablieren, sondern können nur dezentral funktionieren. Alle bisher diskutierten Verfahren der Sperrung setzen auf dritten Maschinen zwischen dem Anbieter der zu sperrenden Information und dem Abrufer an. Denkbar wäre auch eine Sperrung beim Anbieter der Information sowie eine Sperrung beim Abrufer. Dies setzt jedoch eine Kooperation des Anbieters bzw. Abrufers voraus.

Eine Sperrung beim Anbieter würde bedeuten, daß der Anbieter die zu sperrenden Inhalte entweder niemandem anbietet oder daß er sie nur bestimmten Personen nicht anbietet. Ein personenselektives Anbieten von Inhalten setzt selbst bei Kooperation des Anbieters voraus, daß der Anbieter den Abrufer einer Information zweifelsfrei identifizieren kann und daß ihm genaue und juristisch hieb- und stichfeste Entscheidungstabellen vorgelegt werden, die es ihm erlauben, automatisch zu entscheiden, wem er welche Inhalte ausliefern darf.

Ein Identifikationsmechanismus, der das Geforderte leistet, existiert derzeit nicht einmal im Ansatz und ist auch nicht in absehbarer Zeit realisierbar. Insbesondere kann nicht aus der IP-Adresse oder dem Rechnernamen eines Absenders auf seine Identität oder seinen physikalischen Aufenthalt geschlossen werden: Deutsche Kunden von amerikanischen Online-Diensten erscheinen im Netz als aus den Vereinigten Staaten kommend. Ähnliches gilt für Mitarbeiter multinationaler Konzerne.

Eine Sperrung beim Abrufer würde bedeuten, daß die angebotenen Inhalte nach bestimmten Bewertungskriterien ausgezeichnet sind (*rating*, z.B. nach PICS) und daß der Abrufer selbst seine Software so konfiguriert, daß Seiten mit bestimmten Ratings nicht mehr abgerufen werden können. Eine Kooperation des Anbieters wäre hier wünschenswert, ist aber nicht notwendig, da die Bewertungen auch von Servern Dritter geliefert werden können.

## Auf welche Weise koennen Sperrungen unterlaufen werden?

Für den Nutzer stellt sich eine Sperrung von Inhalten als Betriebsstörung dar. Er wird nach Wegen suchen, die ordnungsgemäße Funktion des Netzes wiederherzustellen, d.h. die Sperrung zu unterlaufen. Diese Motivation ist um so größer, je stärker sich der Benutzer durch die Sperrung behindert fühlt.

Bei einer Sperrung der physikalischen Kommunikation ist dies nur durch einen Wechsel des Mediums möglich: Wenn etwa ein Störsender in Betrieb genommen wird, wird man versuchen, auf das Telefonnetz auszuweichen und umgekehrt.

Bei einer Sperrung von bestimmten IP-Adressen stehen dem Benutzer mehrere Möglichkeiten offen, die Störung zu umgehen. Alle laufen darauf hinaus, den sperrenden Router vollständig zu umgehen (siehe auch [Ulf Moeller](http://www.fitug.de/ulf/zensur/), Internet-Zensur:
Routingsperren umgehen):

Der Benutzer wechselt den Internet-Anbieter, notfalls wird er Kunde bei einem ausländischen Provider. Er baut eine Telefonverbindung oder Standleitung zu diesem Provider auf und wickelt seine Kommunikation über diesen nichtsperrenden Provider ab. Der sperrende Router des lokalen Providers wird nicht mehr verwendet, die Sperre ist wirkungslos.

Diese Situation tritt automatisch ein, wenn der Nutzer Mitarbeiter eines (multinationalen) Konzerns mit einem eigenen Konzernverbundnetz ist, das an mehreren Stellen (im Ausland) mit dem Internet verbunden ist.

Der Benutzer wird Kunde bei einem zweiten, nichtsperrenden Internet-Anbieter, notfalls im Ausland. Er baut eine TCP/IP-Verbindung zu diesem Provider auf und läßt seine Anwendungen auf dem entfernten Rechner, ggf. im Ausland, ablaufen.

Es gibt inzwischen eine Reihe von Providern, die solche Angebote
routinemäßig anbieten. Die Palette reicht dabei von der
Bereitstellung einzelner Dienste (Postboxen fuer E-Mail (z.B. [pobox.com](http://www.pobox.com/)), Webservices (z.B. [geocities.com](http://www.geocities.com/)) usw.) bis zu kompletten Exil-Logins (z.B. [c2.org](http://www.c2.org), [acm.org](http://www.acm.org/), [xs4all.nl](http://www.xs4all.nl/)).

Der sperrende Router des lokalen Providers sieht keine Kommunikation mit einer gesperrten Adresse, sondern nur Kommunikation mit dem entfernten Provider. Die Zugriffe auf die gesperrten Adressen erfolgen von dort, also erst hinter dem sperrenden Router. Die Sperre durch den Router wird wirkungslos.

Der Benutzer wird Kunde bei einem zweiten, nichtsperrenden Internet-Anbieter, notfalls im Ausland. Er baut eine Mobile-IP-Verbindung zu diesem Provider auf, d.h. seine IP-Pakete werden in anderen IP-Paketen verpackt zum zweiten Internet-Anbieter geschickt, dort ausgepackt und eingespielt. Optional kann die Kommunikation zum zweiten Provider verschlüsselt erfolgen.

In Linux müssen dazu die folgenden beiden Kommandos gegeben
werden:

1. Aktivierung des Interface `tunl0` zum entfernten
Anbieter `myriad.ml.org`: `ifconfig tunl0 (your.ip.address) pointopoint
myriad.ml.org
2. Legen einer Route zu `www.xs4all.nl` über `tunl0` `route add www.xs4all.nl tunl0`

Für einen Beobachter erscheint der Nutzer als normaler Kunde des zweiten IP-Providers. Der sperrende Router des lokalen Providers sieht nur eine Verbindung zum entfernten zweiten Provider. Die Sperre ist wirkungslos. Mobile-IP ist ein Routineangebot fuer IP-Provider, die Geschäftskunden betreuen.

Der Anbieter der gesperrten Information kann Abrufer unterstützen, indem er ebenfalls versucht, die Sperre zu unterlaufen. Im Falle der Sperrung des Rechners `www.xs4all.nl` hat der gesperrte Anbieter die Internet-Adresse seines Rechners alle paar Minuten verändert. Sperrungen einer einzelnen Adresse wurden dadurch wirkungslos, statt dessen mußten ganze Teilnetze gesperrt werden (die Sperrung wurde noch unspezifischer, es wurden als Nebenwirkung noch mehr unbeteiligte Anbieter mitgesperrt).

Während die bisher diskutierten Möglichkeiten des Unterlaufens von Sperrungen unabhängig vom gesperrten Dienst waren, sind die folgenden Moeglichkeiten dienstspezifisch:

#### WWW<

Ähnlich der erwähnten Veränderung der IP-Nummer eines Serverrechners kann  auch die Adresse eines Angebotes auf einem Server automatisch verändert werden. Eine automatische Sperrung einzelner Angebote würde dadurch unterlaufen werden, und man müßte wieder den gesamten Rechner pauschal sperren. Dort greifen dann wieder die Methoden zum Unterlaufen einer Komplettsperrung.

Wenn zu einem Angebot eine Suchmaschine existiert, mit der alle Seiten eines Angebotes nach bestimmten Begriffen durchsucht werden können, ist eine einzelne Seite praktisch unter beliebig vielen Adressen zu bekommen (nämlich allen Begriffen, die den Text in der Suchmaschine finden). Eine Sperrung müßte hier zusätzlich den Zugriff auf die Suchmaschine verhindern.

Das Verfahren des indirekten Zugriffs, wie es unter Mobile-IP diskutiert wurde, läßt sich mit Veränderungen auch für WWW einsetzen: Mit Hilfe eines entfernten Webservers, der Zugriffe im Auftrag Dritter abwickelt (*Proxy-Server*), ist ein indirekter Abruf der Seite möglich. Da Proxy-Server mit Zwischenspeicher zur Beschleunigung von Zugriffen üblich sind, ist es in der Regel kein Problem, einen solchen dritten Server zu finden. Im Rahmen der Zensurdiskussion der letzten Monate sind mittlerweile im In- und Ausland auch schon Proxy-Server für solche Umgehungen explizit eingerichtet worden (etwa am MIT fuer chinesische Staatsbürger, die die Zensur im eigenen Land unterlaufen möchten).

Bei verschlüsselter Kommunikation (etwa mit dem in allen gängigen Browsern eingebauten SSL-Support) entsteht ein nicht mehr in Echtzeit einsehbarer und nicht einfach verfälschbarer Kanal zwischen Server und Client. Für Dritte ist nicht erkennbar, welche Seiten abgerufen werden und welche Informationen sie enthalten.

#### News

Artikel in den USENET News liegen in zahlreichen Kopien auf Tausenden von Servern überall auf der Welt vor. Löschungen (*Cancel*) werden von vielen dieser Server nicht mehr ausgeführt, nachdem es seit einigen Jahren immer wieder zu gefälschten Löschaufforderungen von Saboteuren kam. Die großen Archive fuer USENET News (DejaNews und AltaVista) führen grundsätzlich keine Löschungen aus. Über Archivanfragen ist es daher in der Regel möglich, auch auf ältere und lokal nicht mehr verfügbare Texte zuzugreifen. Dabei gilt wie bei Suchmaschinen für Webseiten (siehe oben): Artikel sind nicht nur unter einer festen Bezeichnung abrufbar, sondern werden auch zu beliebigen im Artikel enthaltenen Stichworten gefunden.

Im Rahmen einer Untersuchung der bayrischen Staatsanwaltschaft wurde der Betreiber Compuserve aufgefordert, einige Newsgroups grundsätzlich nicht mehr bereitzustellen, da bei ihnen davon auszugehen sei, dass diese in Deutschland strafrechtlich relevante Inhalte enthielten. Die Leser dieser Gruppen beziehen diese jetzt direkt von anderen, nicht gesperrten Newsservern. Ausserdem gehen die Autoren von Artikeln für solche schlecht verbreiteten Newsgroups immer mehr dazu über, ihre Artikel zusätzlich in andere, thematisch unpassende, aber besser verbreitete Gruppen zu setzen. 

So kam es zum Beispiel anläßlich der Sperrung des Servers `www.xs4all.nl` wegen des Angebotes der verbotenen Zeitschrift Radikal, Ausgabe 154 zweimal zu je einem Posting der Komplettausgabe der Radikal in den Diskussionsforen de.soc.zensur (Diskussion über Zensur und Inhaltskontrolle) und 
de.org.politik.spd (Forum des virtuellen Ortsverbandes der SPD).

Da die Neueinrichtung von Newsgroups technisch automatisiert werden kann, kommt es vielfach zur Neueinrichtung schlecht verbreiteter Gruppen unter neuem Namen oder zum Angebot bekannter Gruppen unter Aliasnamen. So wurde die Gruppe de.talk.sex (Diskussionsforum über Sexualität) an einer deutschen Universität mehrere Jahre lang unter dem Namen de.soc.verkehr geführt, nachdem dort entschieden worden war, keine Gruppen mehr anzubieten, deren Bezeichnung den Begriff sex enthält.


## Andere Effekte von Sperrungsversuchen

Jede Sperre kann unterlaufen werden, indem die gesperrte Information vielfach repliziert wird. Dann ist jedes Vorkommen dieser Information gesondert zu sperren. Dadurch werden die unangenehmen Nebenwirkungen der Sperrung vervielfacht, bis die Kosten fuer die Sperrung ihren Nutzen übersteigen. Im Falle der Sperrung von www.xs4all.nl wegen des Angebotes der verbotenen Radikal 154 existierten innerhalb kürzester Zeit über 40 Kopien der gesperrten Information. Die 6000 aus technischen Gründen mitgesperrten Anbieter wurden jedoch nicht repliziert. Bezüglich der angestrebten Wirkung wurde also eher das Gegenteil erreicht, während viele Anbieter durch die unbeabsichtigten Nebenwirkungen Verluste hinnehmen mußten.  

Mit Hilfe der USENET News ist diese Replikation tausendfach automatisiert und mit minimalem Aufwand vorzunehmen. Aus diesem Grunde kam es nach der Sperrung von xs4all auch zu einer Verbreitung der Webseiten der Radikal in den News (die Webseiten der anderen 6000 Kunden von xs4all wurden nicht in die News eingespielt).

Alle Kommunikation mit Hilfe des TCP/IP-Protokolls ist konstruktionsbedingt eine individuelle Ende-zu-Ende-Kommunikation zwischen zwei Partnern. Selbst bei Betrachtung des Dienstes ist nicht erkennbar, ob die abgerufenen Informationen privater Natur sind (es ist möglich und für viele Anwender auch notwendig, ihre persönliche Post per WWW zu lesen) oder ob es sich um öffentliche Information handelt. Derartige Information kann sogar gemischt auf einer Webseite auftreten. Es ist zweifelhaft, inwieweit eine Kontrolle solcher Verbindungen durch unspezifisches Abhören (ohne richterlichen Beschluß) gestattet ist, selbst wenn dieses Abhören durch einen Roboter geschieht, der auf Schlüsselworte oder Ratings reagiert.

Nicht nur vom Standpunkt der Kontrolle der Bewerter, sondern auch vom Standpunkt des technischen Netzbetriebes ist eine Offenlegung aller Sperrungen unbedingt notwendig. Wenn Sperrungen von Rechnern oder einzelnen Angeboten massenhaft umgesetzt werden, ist für den einzelnen Systembetreiber genau wie für den einzelnen Anwender nämlich nicht mehr entscheidbar, ob eine technische Störung vorliegt, die zu beheben ist, oder ob eine inhaltlich begründete Sperrung vorgenommen wurde. Damit wird einer zuverlässigen Fehleranalyse durch die Betreiber von Netzen oder einzelnen Maschinen jede Grundlage entzogen, da aus dem Vorliegen einer Störung keine sichere Verhaltensvorschrift zu ihrer Behebung abgeleitet werden kann. Andererseits können offengelegte Sperrlisten natuerlich leicht als Kataloge fuer sexuell explizite oder gewalttätige Angebote mißbraucht werden. Eine Sperrung wäre dann eine Art Qualitaetssiegel. Offengelegte Sperrungen sind mit entsprechend modifizierten Programmen außerdem automatisiert umgehbar.

## Modifikation des Internet

In dem heutigen Internet können Sperren nach den obigen Ausführungen also nicht oder nur mit unvertretbar hohen Kosten und Nebenwirkungen realisiert werden. Daraus ergibt sich die Frage, inwieweit das Internet modifiziert werden müßte, um effizientes Sperren von Inhalten zu erlauben. 

Prinzipiell bieten Firewallsysteme (die von Unternehmen eingesetzt werden, um ihr Netz gegen unbefugtes Eindringen aus dem Internet zu schützen) einen Ansatz, effektive Sperren aufzubauen. Durch die Philosophie, nur solchen Daten das Passieren der Barriere zu gestatten, denen es explizit gestattet wurde, erzwingt man das Einhalten von Richtlinien.

Ähnliche Richtlinien müßten fuer die Nutzung der Internet-Dienste durch die Benutzer aufgestellt und ihre Einhaltung erzwungen werden. Dies kann durch die Verwendung der Firewalltechnologie als Barriere zwischen den Anwendern und dem Internet oder durch die Verwendung proprietärer Protokolle erzwungen werden. Entscheidend ist, daß Teilnehmer im Netz ausschließlich identifizierbar agieren koennen, daß nur freigegebene Dienste, Protokolle und Datenformate verwendet werden, daß die Verwendung kryptographischer Verfahren verboten wird und daß sämtliche Aktivitäten protokolliert werden. Durch diese Massnahmen soll sichergestellt werden, daß der Benutzer einer Sperre nicht mehr ausweichen kann durch Wechsel der Identität, des Protokolls oder durch Verschleierung der Daten.

Unabhängig von der Frage, ob ein solches Verfahren mit einem demokratischen Rechtsstaat vereinbar wäre, gibt es auch wirtschaftliche und technische Gründe, die dagegen sprechen: Ein solches Netz wäre zentralistisch gesteuert und könnte nur unter großem Zeit- und Kostenaufwand an veränderte Anforderungen angepaßt werden. Sämtliche Online-Dienste haben dieses Modell auf Druck ihrer kommerziellen Benutzer aufgegeben. Der administrative Overhead einer solchen Lösung auf nationaler Ebene wäre gewaltig. Ausserdem wuerde jede Beschraenkung kryptographischer Verfahren eine Nutzung des Internet zur Übermittlung sensitiver Informationen beeinträchtigen.

Insgesamt könnte ein solches Modell katastrophale Standortnachteile mit sich bringen. Kommunikation ist eine Ressource, die in ihrer Bedeutung den Arbeitskräften oder der Verkehrsinfrastruktur in keiner Weise nachsteht. Auf der anderen Seite kann man, wie sich am Beispiel China zeigen läßt, selbst auf diese Art die Verbreitung unerwünschter Inhalte nur begrenzt unterbinden, denn für jede der oben genannten Massnahmen existieren wiederum Gegenmaßnahmen.

## Bewertung

Eine zentrale Sperre von Inhalten im Internet läßt sich technisch nicht paßgenau vornehmen, ließe sich von den Benutzern bei Bedarf umgehen und wäre mit hohen Kosten verbunden (siehe auch Heimo Ponnath: [Pornographie im Internet](http://bda.netuse.de/bda/jp/home/heimo.ponnath/articles/SiN.html)? Dichtung und Wahrheit, inside online 2/3 1996). Bedingt durch die globalen Datennetze zeigt sich hier der Paradigmenwechsel in den Aufgaben des Staates durch die Informationsgesellschaft, wie Alexander Rossnagel beschreibt (Alexander Rossnagel: Globale Datennetze: Ohnmacht des Staates - Selbstschutz der Buerger, ZRP 1997, Heft 1, 26-30). Die Ohnmachtserfahrung des Staates in der globalisierten Welt bedeutet jedoch nicht gleichzeitig eine Kapitulation vor den neuen Gefahren, sondern die modernen Informationstechnologien bergen vielfältige Möglichkeiten, daß der Bürger sich selbst schützen kann. Daraus erwächst die Verpflichtung für den Staat, Strukturen zu schaffen, die seine Bürger befähigen, ihre Interessen in der Welt der Netze selbstbestimmt zu schützen.  

Hier bietet also die dezentrale Kontrolle und Filterung durch den Benutzer einen Lösungsansatz. Dazu müssen jedoch die Bewertungen durch Dritte (etwa nach dem PICS-System) transparent und nachvollziehbar sein. Beispielhafte Filterkonfigurationen können von einer Vielzahl von Interessengruppen vorgeschlagen werden; der Benutzer muß jedoch die Möglichkeit haben, seine eigene Konfiguration individuell vorzunehmen oder anzupassen.

Ein universelles Rating wie PICS ist mit erhöhtem Zeitaufwand und zusätzlichen Kosten verbunden. Eine Reihe von Anbietern wird daher darauf verzichten. Den Ratingorganisationen kommt ein hohes Maß an Verantwortung zu, da jede Vorbewertung bereits zur Meinungsbildung der potentiellen Abrufer beiträgt und da absichtliche oder unabsichtliche Fehlbewertungen großen Schaden anrichten können. Geht es lediglich um die Gewährleistung eines Jugendschutzes im Internet, wäre es sehr viel billiger und unkritischer, wenn die Anbieter auf freiwilliger Basis ihre kindgerechten Materialien kennzeichneten und spezielle Kinderbrowser ähnlich dem TV-Kinderkanal nur solche Angebote darstellten (siehe [he Net Labelling Delusion: Protection or Oppression](http://www.thehub.com/~orene/liberty/label.html)).

Die Erfahrungen in den USA zeigen, daß Organisationen das Instrument der Bewertung von Inhalten für die Durchsetzung ihrer eigenen politischen Ziele unter dem Deckmantel des Jugendschutzes oder der Aufrechterhaltung der öffentlichen Moral mißbrauchen. Es ist zu verhindern, daß die Definition moralischer und gesellschaftlicher Werte in den Aufgabenbereich privater Organisationen übertragen wird. Durch eine Offenlegung der Bewertungsmaßstäbe und aller Bewertungen kann diese Gefahr des Mißbrauchs reduziert werden.

## Danksagung

Wir danken Hannes Federrath und Andreas Pfitzmann von der Technischen Universitaet Dresden für zahlreiche Anregungen und Diskussionen, die zur Entstehung dieses Textes beigetragen haben.  

### Die Autoren

<a href="mailto:kris@koehntopp.de">Kristian Köhntopp</a> ist Diplominformatiker und arbeitet als freiberuflicher Consultant fuer heterogene Datennetze und Rechnersicherheit.  

<a href="mailto:marit@koehntopp.de">Marit Köhntopp</a> ist Diplominformatikerin und arbeitet beim Landesbeauftragten für den Datenschutz Schleswig-Holstein als Referentin in den Bereichen "Neue Medien und Informationstechnologien" sowie "Technikfolgenabschätzung".

<a href="mailto:ms@netuse.de">Martin Seeger</a> ist Diplominformatiker und Geschäftsfuehrer der <a href="http://www.netuse.de">NetUSE ommunikationstechnologie GmbH</a>. Das Unternehmen beschäftigt sich mit der Internet-/Intranet-Technologie und der Sicherheit von Rechnern in Netzen.
