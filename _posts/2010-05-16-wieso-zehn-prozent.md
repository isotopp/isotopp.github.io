---
layout: post
published: true
title: Wieso zehn Prozent?
author-id: isotopp
date: 2010-05-16 08:11:32 UTC
tags:
- admin
- management
- monitoring
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
In [Sicherheitsmetrik](http://erichsieht.wordpress.com/2010/05/15/sicherheitsmetrik/)
heißt es als Antwort auf meinen Artikel
[DENIC erklärt sich]({% link _posts/2010-05-14-denic-erkl-rt-sich.md %}):

> Wir IT-Akademiker forschen gerne an Fragen herum, die einen vagen
> Relitätsbezug haben, die man aber in der Praxis pragmatisch handhabt. Nach
> ein paar Jahren haben wir die Lösungen der Pragmatiker formal dokumentiert
> und wissenschaftlich nachgewiesen, was die Kollegen immer schon wussten,
> nämlich dass das so tatsächlich funktioniert…. Die zehn Prozent sind
> formal betrachtet völlig willkürlich gewählt, tatsächlich aber wohl ein
> Erfahrungswert, der sich aus informellen Beobachtungen typischer Vorgänge
> ergibt. So etwas würde ein Wissenschaftler nie zulassen.

Die zehn Prozent sind natürlich nicht willkürlich gewählt, sondern
sorgfältig ermessen.

Dem Ganzen liegt eine andere Anekdote zugrunde, die die Denkweise eines
Sysadmins verdeutlicht - am Ende geht es darum, Risiken für Menschen
intuitiv handhabbar zu präsentieren (anstatt sie mit einem Regelwerk zu
überschütten).

### Persönliche Betroffenheit führt zu persönlicher Verantwortung

web.de war eine geldreiche Arbeitsumgebung. Mit 150 Mio Euro auf der Bank
und ohne Schulden agiert eine Firma in Projekten nicht kostengetrieben,
sondern erlösgetrieben. 

Es ist eine Umgebung, in der man Großes bewirken kann, aber es ist auch eine
Umgebung, in der manche Projekteigentümer und Projektleiter nachlässig
werden. Das ist so, denn in so einer Umgebungs sind Kosten alleine eben kein
ausreichender Motivator, um bestehende Probleme anzugehen statt neue
Projekte zu beginnen - die Firma lebt von Velocity, also der Geschwindigkeit
der Innovation anstatt von Effizienz, denn Gewinn wird mit dem Wachstum des
Marktes gemacht statt der Konkurrenz Anteile abzunehmen ([Cynefin
Marktreife](http://en.wikipedia.org/wiki/Cynefin) in den Quadranten Complex
und Complicated).

So kommt es, daß in solchen Umgebungen manchmal Systeme im Einsatz sind, die
die für den Betrieb notwendige Stabilität nicht von sich aus mitbringen,
sondern bei der die Stabilität durch permanente Arbeit des Operatings
erzeugt wird.

Will sagen, man hat Software mit Memory Leaks oder Race Conditions oder
anderen schwer zu findenden Fehlern, die mit einer gewissen
Eintrittswahrscheinlichkeit versehen sind. Der Betrieb erkennt die mit
Sicherheit _irgendwann_ eintretende Fehlersituation vorher und behebt das
Problem durch, äh, vorbeugende Wartung. Also durch das Herausnehmen einer
Komponente aus dem Loadbalancer und einen Neustart des betreffenden Systems
mit anschließender Reintegration oder vergleichbare Maßnahmen.

Die zur Fehlersuche und Behebung notwendigen Stunden Entwicklerzeit will
niemand gutwillig bereitstellen, da es andere laufende Projekte verzögern
würde, also Velocity kosten würde. Und eine tatsächliche Aufwandsschätzung
ist bei Heisenbugs sowieso immer schwierig, da der Aufwand in der Regel in
Instrumentation und Warten besteht, solange der Fehler nicht mit
vernünftigem Aufwand im Labor provoizierbar ist. Man kann also nicht sagen
'Es wird circa 4 Stunden dauern, diesen Bug zu fixen', weil man ihn
überhaupt erst mal beobachten muß.

Wenn nun Kosten im Operating kein Instrument sind mit denen man seine
Projektleitung zur Bereitstellung von Ressourcen motivieren kann, dann ist
die erprobte Strategie der Managementmotivation im Operating eine, die ich
gerne mit "Teile die Schmerzen" beschrieben möchte.

Zum Beispiel setzt man den Projekteigentümer auf dieselbe Alerting-Methode
wie den Sysadmin, der am Ende Sonntag nachts um 4 Uhr wegen eines Alarms die
vorbeugende Wartung durchführen muß. Die Begründung ist, daß der
Projekteigentümer bei einem System dieser Wichtigkeitsstufe ja über Ausfälle
informiert sein muß. Er muß schließlich bereit stehen, um als Entscheider
die notwendigen Anweisungen zu geben wenn etwas schiefgeht - so etwas
wichtiges kann man ja auf keinem Fall einem einfachen Operator überlassen.

Wenn wir nun also einen jungen Projektverantwortlichen haben, bei dem das
Handy Sonntag nachts um vier die Frau und das 6 Monate alte Kind weckt, dann
ist diese Person nach einigen Wochen unmittelbaren Alerting-Erlebens sehr
viel zugänglicher, wenn auf auf einem Montagsmeeting der Vorschlag gemacht
wird, endlich einmal eine Hand voll Entwicklerstunden in die Verbesserung
der Stabilität dieses vergleichsweise wackeligen Systems zu stecken. Das
Interesse ergibt sich hier dann nicht aus den Projektkosten, sondern aus
persönlicher Betroffenheit.

### Wieviel Risiko ist vertretbar?

Das ist derselbe Mechanismus, der auch unter den Admins selbst am Werk ist.
Sie machen Bereitschaft und sie bekommen Alarmmeldungen, Tag und Nacht.
Admins haben ein natürliches Interesse an den Schranken von Alarmen, denn es
sind diese Einstellungen der Sensitivität des Überwachungssystemen, nach
denen sich die Qualität ihres Nachtschlafs und das Klima in ihren Familien
bemißt. Admins wollen nicht von unnötigen Alarmen gestört werden, sie wollen
also keine false positives.

Noch schlimmer sind aber false negatives, also Alarme die hätten gesendet
werden sollen, aber nicht gesendet wurden. Denn diese kosten nicht nur den
Bonus, sondern auch auf Wochen hinaus das Familien- und Arbeitsklima. In
einem funktionierenden Admin-Team - jedem funktionierenden Admin-Team -  mit
einem gut eingestellten Monitoring kann man also darauf vertrauen, daß
gerade eben so viele Alarme zu viel gesendet werden, daß die Meldungen des
Alarmierungssystems noch vertrauenswürdig sind.

Die Schwellwerte im System ergeben sich empirisch unter dieser Strategie:
Überwachungssysteme werden erschaffen und messen Daten, generieren darauf
basierend Alarme - in der Regel viel zu viele Alarme.

Ein gutes Admin-Team wird die meisten dieser Alarme ignorieren. Es wird
außerdem regelmäßig die ignorierten und beiseite geschobenen Alarme
auswerten, um daraufhin das Monitoring anzupassen, damit die Schwellwerte
realistischer werden. Die neuen Schwellwerte werden immer noch zu sensibel
sein, aber näher an realistischen Werten. Das Verfahren wird in der Regel
nicht formalisiert durchgeführt 
([Capability Maturity](http://en.wikipedia.org/wiki/Capability_Maturity_Model#Levels_of_the_Capability_Maturity_Model)
Rating 1 für den Prozeß: 'individual heroics'), ist aber im Verhalten
wahrscheinlich einem inversen TCP Slow Start ähnlich (Man kann das natürlich
modellieren, aber mir sind keine formalen Papiere zum Thema
'Tuningalgorithmen für Monitoringsysteme' bekannt).

### Risiken menschengerecht erlebbar machen - Shared Spaces statt Regelsysteme

Das Verhalten, das dem ganzen Zugrunde liegt, ist natürlich 
[Risikokompensation](http://de.wikipedia.org/wiki/Risikokompensation) und die ist in Grenzen 
[modellierbar](http://www.sciencedirect.com/science?_ob=ArticleURL&_udi=B6VN8-4TK2PPX-1&_user=10&_coverDate=01%2F31%2F2009&_rdoc=1&_fmt=high&_orig=search&_sort=d&_docanchor=&view=c&_acct=C000050221&_version=1&_urlVersion=0&_userid=10&md5=0328819c455478dbdeed463b371a7f5e).

Menschen versuchen, ihr Verhalten so zu optimieren, daß sie ein System
möglichst voll 'ausfahren', seine Ressourcen also ausnutzen. Das heißt im
Verkehr zum Beispiel, daß sie ein Auto schneller fahren oder enger
überholen, wenn das Auto sich sicherer anfühlt oder eine bessere Lenkung
oder Bremsen bekommt. Der lenkende Mensch wird dabei versuchen, das gefühlte
Risiko stabil zu halten, indem er höhere Wagnisse eingeht.

Man kann das umgekehrt nutzen, um mehr Sicherheit zu erzeugen, indem man
Menschen Risiken spüren läßt und Systeme baut, die sich linear und stetig
verhalten, also um Risiken für Menschen gut vorhersagbar und erlebbar
machen. Im Verkehr nennt man dieses Konzept
[Shared Space](http://de.wikipedia.org/wiki/Shared_Space#Risikobewertung)
und man kann es auch in der IT anwenden.

Shared Space funktioniert eben nicht, indem man einfach die Verkehrszeichen
in einem Ort alle abmontiert und alle Bürgersteige planiert. Es gibt eine
Reihe von Vorraussetzungen, die alle zusammen erfüllt sein müssen, damit man
ein System hat, indem Menschen Risiken wahrnehmen und erkennen können und in
denen sie aktiv agieren, um diese zu vermeiden.

#### Visibility (und Predictability)

Eine ist zum Beispiel, daß man es mit einem System zutun hat, das linear
(oder logarithmisch) und stetig ist, bei dem also dem großen Knall eine
Reihe von kleineren, mit zunehmendem Risiko schlimmer werdenden Warnsignalen
auftreten - Menschen machen diese Annahme implizit, auch dann, wenn sie es
mit Systemen zu tun haben, die weder linear noch stetig sind. Baut man ein
System, bei dem Totalversagen nicht vorher von harmlosen Warnsignalen
angekündigt wird, oder bei dem das Versagensrisiko in einer Weise ansteigt
die von Menschen nicht intuitiv modellierbar ist, dann hat man ein System
das massenweise Leute umbringt. Die Gefahrensituation muß also für den
Menschen im Vorfeld erkennbar und vorhersehrbar sein - aktive und passive
**Visibility**, sehen und gesehen werden, muß gegeben sein.

In einem Shared Space-Verkehrsgebiet bedeutet das zum Beispiel, daß man
einige Kreuzungen umbauen muß, damit sie einsehbar werden oder andere
Gebiete so umbauen muß, daß die entzerrt werden, voneinander abhängige
Gefahrenquellen also entkoppelt werden und so auftreten, daß sie als
aufeinanderfolgende separate Ereignisse abgehandelt werden, statt die
Verkehrsteilnehmer mit zu vielen um Aufmerksamkeit konkurrierenden
Situationen gleichzeitig zu überfordern.

In einer Produktionsumgebung in der IT bedeutet dies, daß man Systeme bauen
muß, die 'sanft' versagen und rechtzeitig vorher erkennbare Warnsignale
generieren. Und daß man ein Monitoring haben muß, das ist der Lage ist,
solche Warnungen zu visualisieren. Am Besten auch eines, das allgemein
wahrgenommen wird - also Monitore mit Displays an wichtigen Stellen im
Betrieb.

#### Education

Eine andere Vorraussetzung ist, daß die Menschen in der Lage sein müssen,
die Gefahrensituationen erkennen und bewerten zu können. Shared Spaces
funktionieren also nur in einem Umfeld, in dem es eine passende
**Ausbildung** gibt.

Im Verkehr bedeutet das, daß Verkehrserziehung, Fahrausbildung und Awareness
auf dem richtigen Niveau sein müssen, damit den Verkehrsteilnehmern das
erwartete Verhalten, Handlungsmöglichkeiten und typisches Verhaltensfehler
bekannt sind, so daß sie mit vergleichbaren Erwartungen und gut trainierten
Sicherheitsreflexen in den Verkehr gehen.

In einer Produktionsumgebung bedeutet das, daß den verantwortlichen
Mitarbeitern die Systeme, die sie fahren sollen, bekannt sind, sodaß sie ein
Modell des Systems im Kopf haben, das den betrieblichen Realitäten
entspricht, daß ihnen Diagnose- und Eingriffsmöglichkeiten bekannt sind und
daß sie Zugriff auf Eskalationsmöglichkeiten in der Systementwicklung haben,
wenn ein Fehler die Möglichkeiten des Operatings übersteigt.

#### Empowerment

Und die dritte Vorraussetzung ist, daß die Menschen in einem System die
Möglichkeit haben, Verantwortung zu übernehmen und ad-hoc vor Ort Regeln
aufzustellen oder Situationen verbindlich zu klären - das ist
**Ermächtigung**.

Im Verkehr bedeutet das, daß man Zeichen entfernt, die Entscheidungen des
Autofahrers überstimmen. Ampeln und Vorfahrtszeichen kommen weg, denn sie
bestimmen über den Kopf des Fahrzeugführers hinweg 'Du mußt halten' oder 'Du
kannst fahren'. Stattdessen ist der Fahrzeugführer jetzt verantwortlich,
sein Fahrzeug berührungsfrei durch den Verkehr zu bewegen und er muß jede
Halte- und Fahrentscheidung selbst und in letzter Verantwortung treffen. Das
kann er, denn er hat die notwendige Visibility - er wird gesehen und kann
sehen. Und er hat die notwendige Ausbildung.

In einer Produktionsumgebung in der IT sieht es genau so aus - statt dem
Admins und Entwicklern einen Kubikmeter ITIL V3 Handbuch an den Kopf zu
werfen und zu sagen: "Implementiert das!" gibt man ihnen die Verantwortung
für den Betrieb und sagt: "Haltet das am Laufen! Was braucht Ihr dazu?".
Mitarbeiter mit der passenden Ausbildung und der passenden Visibility sind
dazu in der Lage, das zu regeln, wenn man sie entsprechend ermächtigt.

Die natürliche Risikoanpassung wird dann dazu führen, daß sie selbst die für
den Betrieb notwendigen Regeln und Absprachen ad-hoc treffen.
