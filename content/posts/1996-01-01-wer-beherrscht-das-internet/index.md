---
author: isotopp
date: "1996-03-01T09:00:00Z"
feature-img: assets/img/background/rijksmuseum.jpg
title: "Wer beherrscht das Internet?"
tags:
- lang_de
- publication
- internet
aliases:
  - /1996/01/01/wer-beherrscht-das-internet.md.html
---

**aus "Die Netzrevolution - auf dem Weg in die Weltgesellschaft", Rost (Hrsg.), 1996, Frankfurt/ Main: Eichborn-Verlag, 230 Seiten**

# Wer beherrscht das Internet?

*"Es gibt keine zentrale Koordination des Internet, die einzelnen
Teilnehmern oder Teilnehmerorganisationen Weisungen erteilen kann 
oder bei der man sich über Fehlverhalten anderer beschweren 
kann." So oder so ähnlich liest man es wahrscheinlich in jeder 
Einführung in die Besonderheiten des Internet an irgendeiner 
Stelle. Gibt es wirklich niemanden, der das Internet beherrscht? Ist 
das Internet eine totale Anarchie?*

*Die Antwort lautet "Nein". Die Begründung für das "Nein" 
ist ziemlich lang.*

## Betrachtungsebenen

Das Internet ist kein homogenes Netz. Stattdessen handelt es sich um 
ein Sammelsurium von anderen Netzwerken, auf denen Internet-Pakete 
verschickt werden. Diese einzelnen Trägernetze, auf denen das 
Internet aufsetzt, können natürlich stark unterschiedliche 
technische und administrative Bedingungen aufweisen. Und 
selbstverständlich können einzelne Teilnetze im Internet 
sehr wohl eine zentrale Koordination haben. Ein Beispiel macht das 
sehr gut deutlich: 

Ich sitze daheim an meiner Next-Workstation, die über ein 
lokales Ethernet und einen ISDN-Router Verbindung zum deutschen EuNet 
hat. Wenn ich von Zuhause aus auf den WWW-Server 
`http://www.pz-oekosys.uni-kiel.de` zugreife, dauert es nur wenige 
Sekunden und die Startseite des Projektzentrums 
Ökosystemforschung wird auf meinem Bildschirm aufgebaut. Aber 
welcher Aufwand an technischer und administrativer Kooperation war 
dazu notwendig?

Nun, die erste Station für meine Internet-Datenpakete ist mein 
lokales Ethernet, das die verschiedenen Computer in meinem Haushalt 
miteinander verbindet. Selbstverständlich ist dies mein Netz und 
ich bestimme, welche Rechner dort angeschlossen werden und was auf 
diesen Netz gemacht wird. Meine IP-Pakete für das Projektzentrum 
werden dann von einem kleinen PC mit einer Ethernet- und einer 
ISDN-Steckkarte über Leitungen der Telekom zum Kieler Point of 
Presence des EuNet weitergeleitet. Die Telekom kann durch den Preis 
und die Verfügbarkeit dieser Leitungen die Dauer meiner 
Präsenz im Internet ziemlich regulieren. Auf den Inhalt der 
übertragenen Daten hat sie nach deutschem Recht zum Glück 
keinen Einfluß.

Meine Datenpakete, die inzwischen beim EuNet-POP Kiel angekommen 
sind, werden nun über verschiedene Standleitungen innerhalb des 
EuNet, die auch alle bei der Telekom gemietet worden sind, bis zu 
einem Übergangspunkt ins deutsche Wissenschaftsnetz weitergegeben. 
Das Wissenschaftsnetz ist ein Datennetz, das vom "Verein zur 
Förderung eines deutschen Forschungsnetzes e.V." (DFN-Verein) 
ins Leben gerufen worden ist und das praktisch alle 
größeren deutschen Forschungseinrichtungen verbindet. Zwar 
basiert es auf dem Datex-P Dienst der Telekom, aber es wird 
hauptsächlich verwendet, um Internet-Daten zu verschicken. Der 
DFN-Verein unterhält dazu eine ganze Reihe von Übergangspunkten 
aus dem Wissenschaftsnetz in andere Teilnetze des Internet. 

Teilnahme und Nutzung des Wissenschaftsnetzes werden vom DFN-Verein 
reglementiert: Kommerzieller Datentransfer auf dem Wissenschaftsnetz 
ist nicht gestattet. Transitverkehr ist ebenso untersagt, dabei 
versteht der DFN unter Transit den Transport von Daten aus einem 
Drittnetz durch das Wissenschaftsnetz in ein anderes Drittnetz. Das 
Wissenschaftsnetz soll nicht als Trägernetz für andere 
Netzwerke mißbraucht werden.

Über das Wissenschaftsnetz gelangen meine Datenpakete 
schließlich in das lokale Ethernet der Universität Kiel 
und letztendlich zum WWW-Server des Projektzentrums 
Ökosystemforschung. Dieses lokale Netzwerk der Universität 
wird durch das Rechenzentrum der Universität beziehungsweise 
durch die einzelnen Institute selbst betrieben. Auch diese Parteien 
stellen möglicherweise noch gewisse Ansprüche an die Art 
der Nutzung.

Wie man sehen kann, sind sogar an einem einfachen Datentransfer 
zwischen zwei Netzteilnehmern innerhalb derselben Stadt eine Vielzahl 
von Parteien beteiligt. Alle diese Leute haben unter Umständen 
sehr unterschiedliche Vorstellungen davon, was das Netz ist und wie 
es genutzt werden sollte.

Man kann versuchen, das Problem zu vereinfachen, indem man die an 
einer solchen Datenübertragung beteiligten Gruppen ein wenig 
klassifiziert:

Als erstes wäre dort derjenige zu nennen, der die Kabel für 
die Kommunikation bereitstellt. Abgesehen von lokalen Netzen, die 
Grundstücksgrenzen nicht überschreiten dürfen, ist 
dies in Deutschland aufgrund des Telekommunikationsmonopols immer die 
Telekom. Sie diktiert die durch Verfügbarkeit und Preise von 
Diensten die Rahmenbedingungen, mit denen sich alle, die 
kommunizieren möchten, abfinden müssen.

Zweite beteiligte Gruppe sind die Internet-Provider. Ein Provider ist 
jemand, der Kabel von der lokalen Telekommunikationsgesellschaft 
erwirbt und darauf den Dienst "Verschicken von IP-Paketen" anbietet. 
Neben dem schon genannten DFN-Verein, der seine Dienste 
hauptsächlich im akademischen Bereich anbietet, und dem 
deutschen EuNet gibt es in Deutschland als "klassische Provider" noch 
den Karlsruher Anbieter XLink und die Hamburger MAZ. Daneben haben 
sich in den letzten Jahren noch andere Firmen etabliert, die 
ebenfalls Zugang zum Internet anbieten, aber eigentlich andere 
Produkte verkaufen möchten: Da ist einmal die Telekom, die mit 
Telekom Online Internetzugang verkauft, aber eigentlich BTX anbieten 
möchte. Dann gibt es IBMs Advantis, das eigentlich helfen soll, 
IBMs OS/2 Warp zu verkaufen. Compuserve, denen es viel lieber 
wäre, wenn ihre Kunden das eigene Compuserve Network nutzen 
würden. Und - in Europa noch ohne Internet-Zugang - Microsoft, 
bei denen Internet-Zugang ein Abfallprodukt ihres hauseigenen 
Microsoft Network ist.

Einige dieser Provider nehmen ziemlich starken Einfluß darauf, 
was ihre Kunden mit dem Internet machen können und dürfen. 
Manchmal ist die Einflussnahme technisch bedingt, zum Beispiel ist 
der Internet-Zugang der Telekom nicht transparent: Bei 
TELNET-Verbindungen werden Steuerzeichen nicht übertragen und 
damit ist der TELNET-Dienst praktisch wertlos. Bei anderen ist die 
Einflussnahme inhaltlicher Art. So hatte zum Beispiel zu der Zeit, 
als dieser Artikel geschrieben wurde, die Universität Frankfurt 
vorübergehend die WWW-Seiten eines Studenten gesperrt, der 
Informationen über Kurden im Netz zur Verfügung stellt. Ein 
anderes Beispiel ist die Firma Microsoft, die Anbietern von 
Konkurrenzprodukten den Zugang zu Microsoft Network zu verwehren 
versucht.

Solange Informationen im Internet zur Verfügung gestellt werden 
und es eine ausreichend große Anzahl von Internet-Anbietern 
gibt, sind solche Beschränkungen kein Problem. Der betroffene 
Kunde begibt sich dann einfach zu einem anderen Anbieter und wird 
dort glücklich. Da das Internet ein offenes Netz aus Netzen ist, 
macht weder für den Anbieter noch für den Benutzer einen 
Unterschied, wo man angeschlossen ist. So hat sich zum Beispiel schon 
kurz nach der Sperrung der Seiten des oben erwähnten Studenten 
an der Uni Frankfurt ein private betriebener Internet-Zugang in Jena 
bereit erklärt, die betreffenden Seiten im Netz bereitzuhalten. 
Damit ist das Internet bei einer gesunden Anbieterstruktur effektiv 
resistent gegen jede Form der inhaltlichen Kontrolle. 

Natürlich macht so etwas auch Probleme, jedenfalls aus der Sicht 
einer Person, die das Internet nicht gewohnt ist: So ist es zum 
Beispiel nicht möglich, gegen die Anbieter 
nationalsozialistischer Propaganda auf ausländischen 
Serverrechnern vorzugehen oder auch nur zu verhindern, daß 
solche Seiten in Deutschland abrufbar sind. Erfahrene 
Internet-Benutzer haben mit solchen Dingen weniger Probleme: Sie 
wissen, daß ein Verbot solcher Seiten sowieso nur die Symptome 
bekämpfen würde, aber am eigentlichen Problem, der 
Überzeugung der Anbieter, nichts ändern würde. Entscheidend 
ist nicht, daß man solche Seiten unterdrücken kann, 
sondern daß man die Freiheit hat, Gegenmeinungen im gleichen 
Forum an gleicher Stelle zu präsentieren.

## Die Dritte Macht

Neben den beiden bereits benannten Parteien gibt es noch eine dritte, 
große Kraft, die das Internet bestimmt. Im Vergleich zu den 
bereits benannten Gruppen ist sie relativ unauffällig und bleibt 
dem normalen Benutzer in der Regel verborgen: Es sind die Gremien, in 
denen die technischen Grundlagen des Netzes genormt und beschlossen 
werden. Hier hat das Internet eine im Vergleich zu anderen 
Normungsgremien einmalige Struktur. 

Grundlage der technischen Verfahren im Internet sind die Internet 
Standards. Diese Standards sind besondere Papiere in einer Reihe von 
Dokumenten, in denen die technischen Hintergründe des Internet 
diskutiert werden: die Requests for Comments (RFC). Ursprünglich 
war die Entwicklung des Internet vollständig informal: Im Rahmen 
einer akademischen Diskussion unter gleichen wurden Papiere 
veröffentlicht, in denen Ideen diskutiert wurden oder Notizen 
von Treffen verbreitet wurden. Diese Papiere bekamen zum Zwecke der 
Archivierung fortlaufende Nummern. Da RFCs Dokumente zum Zwecke der 
Archivierung sind, wird ein bestimmter RFC nach seiner 
Veröffentlichung niemals mehr verändert. Eine neue Version 
bekommt also eine neue Nummer und verweist auf seinen Vorgänger 
als veraltetes Dokument.

Im Laufe der Entwicklung wurden einige dieser RFCs, die 
Übertragungsverfahren oder andere technische Details beschrieben, 
immer wieder überarbeitet und weiter und weiter ausgefeilt. Da 
diese Dokumente praktisch die seit Jahren gängige 
Verfahrensweise im Internet beschrieben, hat man diese Dokumente zu 
offiziellen Standards im Internet erklärt.

Das heutige Verfahren der Verabschiedung neuer Standards im Internet 
ist nicht mehr ganz so frei von Formalien, aber der Geist des 
ursprünglichen Vorgehens ist weitgehend erhalten geblieben. Ein 
zukünftiger Internetstandard beginnt sein Leben meistens als 
ein Request for Comment. Im Prinzip kann er von jedermann auf der 
Welt eingereicht werden, aber in der Praxis wird er meistens von 
einer Arbeitsgruppe der Internet Engineering Task Force (IETF) 
erarbeitet. Wenn ein solches Papier eingereicht wird, entscheidet die 
Internet Engineering Steering Group, ob das Thema es wert ist, 
dafür den Standardisierungsprozeß in Gang zu setzen und ob 
ausreichend Bedarf nach einer Regelung besteht. Wenn dies der Fall 
ist, beginnt der neue Internet Standard sein Leben als "proposed 
standard", als Standardisierungsvorschlag.

Der Vorschlag kann nach Ablauf einer gewissen Wartezeit auf der 
Leiter der Internet Standardhierarchie weiter vorrücken, wenn 
mindestens zwei unabhängige Implementationen des Standards 
existieren, die in der Lage sind, zusammenzuarbeiten. Dies stellt 
sicher, daß erstens Interesse innerhalb der Gemeinschaft der 
Entwickler vorhanden ist und daß zweitens der Standard 
detailliert genug ist, um ihn als Basis für eine Entwicklung zu 
nehmen. Die bei der Arbeit mit dem Standard gewonnen Erfahrungen 
fließen in der Regel in dieser Phase in eine Überarbeitung des 
Papieres ein. Das Resultat wird ein neues Papier sein, das zum "draft 
standard" (Standardentwurf) wird. Nach einer weiteren Wartezeit kann 
dieser Entwurf dann endlich zu einem vollwertigen Internet Standard 
erklärt werden.

Dieses Vorgehen stellt die Arbeitsweise vieler anderer 
Normungsgremien auf den Kopf: Statt eine neue Norm zu spezifizieren 
und nach der Festlegung der Norm anhand der vorhandenen Texte zu 
arbeiten, dokumentiert ein Internet Standard meistens nur schon 
jahrelang gebräuchliche, existierende Praxis. Das hat nicht nur 
zur Folge, daß es relativ wenige "tote" Standards gibt, sondern 
auch, daß Internet Standards in der Regel wesentlich leichter 
zu lesen und zu verstehen sind als andere Normen.

Gleichzeitig ist dieses Standardisierungsverfahren auch wesentlich 
offener als andere. Zum einen sind RFCs im Internet frei 
verfügbar. Sie können bis auf die Transferkosten kostenlos 
abgerufen werden und unterliegen keinen 
Weitergabebeschränkungen. Zum anderen kann der Anstoß zur 
Ingangsetzung des Normungsverfahrens von einer beliebigen Institution 
oder sogar Einzelperson kommen. 

Sogar die oben erwähnte IETF ist keine formale Organisation, 
sondern zum größten Teil ein Verband Arbeitsgruppen. Diese 
Arbeitsgruppen existieren die meiste Zeit in Form von Mailinglisten, 
die im Zugang nicht beschränkt sind und auf denen jede 
interessierte Person mitdiskutieren kann. Gelegentlich kommt es zu 
IETF Meetings, auf denen sich dann die beteiligten Personen und 
Arbeitsgruppen treffen und wo man persönlich miteinander 
diskutieren kann. Es gibt keine formale IETF-Mitgliedschaft, sondern 
man wird durch Mitarbeit in einer IETF Arbeitsgruppe IETF-Mitglied.

Computerprotokolle verwenden meistens einen Satz von magischen 
Nummern und Namen, die in irgendeiner Art und Weise die korrekte 
Funktion des Netzes gewährleisten. Solche Nummern sind zum 
Beispiel die Empfänger- und Absenderadressen von Datenpaketen, 
ohne die keine einzige Nachricht ihr Ziel finden würde. Von 
gleicher Bedeutung sind die Namen von Rechnern und Teilnetzwerken, 
die ebenfalls eindeutig sein müssen. Damit das Netz 
funktioniert, müssen solche Namen und Nummern eindeutig vergeben 
werden. Das Internet hat zu diesem Zweck die Internet Assigned 
Numbers Authority (IANA), eine zentrale Registratur, die über 
alle Zahlen und Namen wacht, die dieser Einschränkung der 
Eindeutigkeit unterliegen. Wer am Netz teilnehmen möchte, 
muß sich eine solche Netznummer und einen Namen zuteilen lassen.

Die IANA gibt im keine einzelnen Namen oder Nummern heraus und 
arbeitet auch nicht mit Einzelpersonen oder -institutionen zusammen. 
Stattdessen existiert normalerweise ein nationales Network 
Information Center (NIC), das einen Block von Internetadressen 
zugeteilt bekommt und dem die Verwaltung des nationalen Namensraumes 
unterliegt. In Deutschland ist dies etwa das DE-NIC, das Namen 
vergeben kann, die auf ".de" enden und das Internet-Nummern für 
deutsche Internet-Teilnehmer vergibt. Aber selbst mit dem DE-NIC wird 
man als deutscher Netzteilnehmer nicht persönlich reden, sondern 
über seinen Internet-Provider, der die Beschaffung von Nummern 
und Namen in der Regel übernimmt.

Die Vergabe von Namen ist für die NICs in letztere Zeit zu einem 
echten Problem geworden. Mit dem explosionsartigen Wachstum des 
Internet drängen immer mehr Firmen in das Netz und 
selbstverständlich ist für eine Firma eine Adresse wie 
http://www.firma.namedesproviders.land vollkommen unakzeptabel. Das 
bedeutet, daß beim zuständigen NIC hunderte, wenn nicht 
tausende von Anträgen auf Namen wie "firma.de" oder gar 
"produkt.de" eingehen. Einige dieser Namen sind von vorneherein als 
kurzfristige Werbegags gedacht und es ist bei der Vergabe des Namens 
schon das Verfallsdatum absehbar. Für ein NIC ist das eine 
schwierige Situation: Auf der einen Seite darf das NIC bei der 
Vergabe von Namen nicht zu restriktiv sein, denn es sitzt auf einer 
Monopolressource, auf der anderen Seite ist das NIC für die 
Struktur und Ordnung des ihm zugeteilten Abschnittes des Namensraumes 
verantwortlich und hat eine "Verschmutzung" des Namensraumes zu 
vermeiden und nebenbei noch Konflikte zwischen zwei Bewerbern um 
denselben Namen zu schlichten.

## Teilnehmer: Auch mächtig?

In der obigen Aufzählung von "Mächtigen" im Internet fehlt 
eine Gruppe: Die Netzteilnehmer. Welchen Einfluß haben sie auf 
die Entwicklung des Internet oder die Gestaltung von Netzlandschaften?

Nun, zum einen steht es ihnen jederzeit frei, die Lager zu wechseln 
und etwa Informationsanbieter zu werden oder aktiv an der Gestaltung 
von Standard im Internet teilzunehmen. Aber welchen Einfluß 
haben Anwender in ihrer Rolle als Anwender? Nun, aktiv werden kann 
ein Anwender nur als Abrufer von Information und als solcher ist er 
bei der Nutzung fast aller Internet-Dienste gegenüber den 
anderen Nutzern fast unsichtbar. Er bestimmt sicherlich, welche 
Informationsangebote durch hohe Nutzerzahlen populär werden, 
aber das ist nur eine sehr indirekte Art der Einflußnahme.

Ein einziger Dienst des Internet fällt hier aus der Rolle, weil 
in ihm die Nutzer den entscheidenden Einfluß haben und das sind 
die USENET News. Die USENET News sind ein Diskussionsforum, in dem 
sich jeder Nutzer zu Wort melden und seine eigenen Beiträge 
einbringen kann. Die Verwaltung dieser Diskussionsforen findet 
vollständig durch die Nutzer statt.

Da ist einmal der Prozeß der Einrichtung neuer 
Diskussionsgruppen: Technisch ist es sehr leicht, neue 
Diskussionsgruppen einzurichten oder wieder zu entfernen. Damit eine 
solche Gruppe jedoch weit verbreitet wird und vom Netz angenommen 
wird, ist es notwendig, vorher einen Konsenz über die Namen und 
die Zweckbestimmung solcher Gruppen zu erzielen. Also hat die 
Netzgemeinschaft im Laufe ihrer Entwicklung ein Dokument erarbeitet, 
das einen formalen Weg zur Einrichtung solcher Gruppen vorsieht. Eine 
neue Gruppe muß formal vorgeschlagen werden und dabei muß 
außer dem Namen auch eine kurze Erläuterung zum Zweck der 
Gruppe gegeben werden. Außerdem muß klar werden, wie sich 
diese Gruppe von anderen Gruppen thematisch unterscheidet. Dieser 
formale Vorschlag wird dann einige Zeit in den News diskutiert und 
unter Umständen einige Male verändert, bevor es zu einer 
Abstimmung kommt.

Die "Abstimmung" ist an und für sich keine, da am Ende ja nichts 
beschlossen werden kann: Jeder Betreiber eines Netzknotens kann immer 
noch für sich und alleine entscheiden, ob er eine bestimmte 
Gruppe auf seinem eigenen Rechner führen möchte. Es handelt 
also mehr um eine Meinungsumfrage als um eine Abstimmung. Aber wenn 
das Ergebnis einer solchen Abstimmung nach den Regeln positiv 
ausfällt, kann man einigermaßen sicher sein, daß die 
neue Gruppe von der überwiegenden Anzahl der Systeme akzeptiert 
und eingerichtet wird.

Obwohl in den USENET News wie im eigentlichen Internet also jede Form 
der Exekutive zur Durchsetzung von Beschlüssen der 
Netzgemeinschaft fehlt, gelingt es trotzdem, stabile Formen der 
Kooperation zu finden und diese Umzusetzen. Und obwohl niemand da 
war, um dem Netz am Anfang eine Satzung oder einen Staatsvertrag zu 
geben, haben sich formale Regeln für den Netzbetrieb entwickelt, 
die weitgehend akzeptiert und eingehalten werden.

Oft unterscheidet sich dieses Regelwerk stark von der jeweiligen 
lokalen Gesetzgebung, gerade im Bereich Urheberrecht oder 
Weiterverbreitung von "verboteten" Informationen ist man im Netz 
meistens wesentlich liberaler als in der Wirklichen Welt. Aber 
meistens ist das netzeigene Regelwerk inklusive seiner nicht formal 
notierten Traditionen sehr viel besser geeignet, mit Netzproblemen 
fertig zu werden als das juristische Handwerkszeug der Wirklichen 
Welt.
