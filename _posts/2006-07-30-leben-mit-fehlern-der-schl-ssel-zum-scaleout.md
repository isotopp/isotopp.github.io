---
layout: post
published: true
title: Leben mit Fehlern - der Schlüssel zum Scaleout
author-id: isotopp
date: 2006-07-30 07:17:12 UTC
tags:
- architektur
- mysql
- performance
- lang_de
feature-img: assets/img/background/mysql.jpg
---
![](/uploads/scale.jpg)

Scaling Patterns

In 2004 habe ich auf dem Linuxtag einen kleinen Vortrag zum Thema 
[Skalierbarkeit](http://kris.koehntopp.de/artikel/linuxtag/) gehalten. Schon
damals war
[die Message](http://kris.koehntopp.de/artikel/linuxtag/img4.html) an
verschiedenen Stellen im Vortrag "Jedes Readproblem ist ein Caching-Problem,
jedes Schreibproblem ist ein Verteilungs- und Batchproblem":

Zum Skalieren muß man seine Anwendung in Teilanwendungen unterteilen und die
Daten replizieren. Die Replikation muß asynchron erfolgen, ohne Two Phase
Commit (2PC), sonst gewinnt man wenig bis nichts. Schreibzugriffe müssen
verzögert und gebatched werden, damit sie effizienter abgewickelt werden
können. Um weitere Flaschenhälse zu vermeiden, muß man die Datenhaltung in
die Teilanwendungen dezentralisieren und eine zentrale Datenbank vermeiden.

Das läuft natürlich allem zuwieder, was man von seinem Datenbankprofessor an
der Uni gelernt hat: Es ist unsicher, man arbeitet mit falschen oder
veralteten Daten und man weiß nicht immer, ob alles auch so geklappt hat,
wie man sich das vorstellt.

Es hat aber einen wichtigen Vorteil: Es funktioniert. Und es skaliert.


### Services

Bei 
[Amazon](http://www.acmqueue.com/modules.php?name=Content&pa=showpage&pid=403) klingt das so: 

> One way that we've made this much easier for ourselves here at Amazon is
> that internally we are a services-oriented architecture, and I don't mean
> that in terms of the buzzword of the last five years. We've been this long
> before that word became public. What I mean by that is that within Amazon,
> all small pieces of business functionality are run as a separate service.
> 
> For example, this availability of a particular item is a service that is a
> piece of software running somewhere that encapsulates data, that manages
> that data. And when, for example, we hit the gateway page of Amazon, it
> will go out to somewhere between 100 and 150 different services to
> construct this page for you.
>
>  That means that we've localized the notion of
> availability and consistency towards each service because each service is
> responsible for its data encapsulation. And then, depending on what kind
> of service it is and what kind of consistency guarantees they require, you
> use different technologies. But it must be absolutely clear I think to
> everyone that we're not using two phase commit to update distributed
> resources all over the world.

Nicht anders viel anders web.de: Das, was der Anwender sieht, wenn er sich
an web.de connected, sieht mehr oder weniger aus wie eine große Anwendung.
Intern besteht seit einigen Jahren es aus ca. 150 verschiedenen Diensten,
die untereinander durch eine Middleware-Layer miteinander kommunizieren. Das
führt zum Teil zu ziemlich skurrilen (nach traditionellen OSS-Maßstäben)
Konstruktionen.

Der Eingangsmailer von web.de war zum Beispiel einmal irgendwann ein Exim3.
Er ist es schon lange nicht mehr, denn irgendjemand hat ihn mit Mico, einem
Corba-Layer, verheiratet. Der Mailer besteht also effektiv nicht mehr aus
einer Maschine. Stattdessen hängt über das Netz nach hinten raus ein Sack
voll Middleware mit drin.

Wenn jetzt eine Mail eingeht, dann muß der Mailer eine ganze Menge Dinge
erfragen: 

- Er muß einen Userservice fragen, ob der Kunde existiert
  und ob es ein zahlender Kunde ist.
- Er muß den Quotaservice/Benutzerprofilservice fragen, ob der Kunde noch
  Mail empfangen kann, und welche Präferenzen für den Mailempfang gesetzt
  sind.
- Er muß den Virenfilterservice fragen, ob die Nachricht
  gefahrlos empfangen kann.
- Er muß den IP Blacklisten-Service fragen, ob Mail von dieser IP angenommen
  werden kann.
- Er muß den Spamfilter-Service fragen, ob die Mail verdächtig ist.
- Er muß die Storage-Layer fragen, welche Storage Locations für die Mail in Frage kommen.

### Diamantenmuster

Alle diese Dinge sind **nicht** Bestandteil des Mailers. Der Mailer baut
stattdessen Netzwerkverbindungen zu Middleware-Diensten auf, die diese Dinge
unabhängig vom Mailer verwalten, und die dem Mailer und anderen
Frontend-Diensten diese Informationen liefern können. Die Middleware-Dienste
existieren außerdem nicht nur in einer Instanz, sondern der Mailer spricht
tatsächlich einen Loadbalancer an, der die Anfrage dann an eine bestimmte
Instanz dieses Dienstes weiter leitet.

Es entsteht also eine Art Diamanten-Architektur: Mail geht auf ein
Loadbalancer-Päärchen und wird von diesem auf gut drei Dutzend Instanzen des
Mailers verteilt. Alle diese Mailer gehen mit ihren Middleware-Anfragen auf
ein Loadbalancer-Päärchen, und werden von diesen auf einen Haufen
Middleware-Instanzen verteilt. Die Middlewares gehen auf einen
Connectionpool und werden von diesem auf einige Datenbank-Kopien verteilt.

Dieses Muster (Auffächern, Konzentrieren, Auffächern, Konzentrieren, ...)
erlaubt es, auf jeder Ebene der Architektur Ausfälle hinzunehmen ohne daß
dies die Funktionalität des Gesamtsystems beeinträchtigt. Es erlaubt auch,
Lastprobleme auf Operatingebene abzufangen ohne damit höhere IT-Funktionen
oder gar die Entwicklung zu behelligen: Bei Überlast auf einer Ebene kann
das Operating dort einfach ein paar Server nachwerfen (lassen) und gut ist.
"Wir sind Papst? Diana ist gegen die Tunnelwand gebollert? Kein Problem.
Mach mal ein paar Blades für das Newsportal klar."

### Komplexität

Wenn man seine Anwendung auf diese Weise verteilt baut, dann muß man mit ein
paar unangenehmen Fakten leben:

Zum Beispiel mit ungenauen oder veralteten Daten. 

Wenn ich asynchron repliziere und kein 2PC verwende, dann kann es zum
Beispiel sein, daß der Quotaservice mir zu kleine oder zu große Zahlen
zurück liefert, weil dieser Benutzer gerade irgendwo anders eine Mail
empfängt oder Mails gelöscht hat, diese Änderung aber ohne Locking und 2PC
im Quotaservice noch nicht vermerkt und die Zahlen im Quotaservice nicht als
"Im Update befindlich" gesperrt worden sind.

Das ist eine gute Sache: Wir können jedes asynchrone System durch Einfügen
von Waits zu einem synchronen System umbauen. Wir machen ein System durch
2PC also genauer, aber viel langsamer.

Müssen wir das tun? Das hängt von den Anforderungen ab. Ist es wirklich
notwendig, daß ein User immer unter seiner Quota bleibt? Die Antwort ist
nein. Für den Dienst web.de als Ganzes ist es lediglich notwendig, daß alle
User im Mittel unter ihrer Quota bleiben, damit das Storage Management bei
seinen Planungen auch genug Platz bereit stellen kann. Es reicht also
vollkommen aus, wenn der Quotadienst "ungefähr" die richtige Antwort gibt.

Diese Anforderung ist aber viel weicher als die harte Anforderung, denn sie
erlaubt es uns, von einem 2PC synchronen Update auf asnychrone Replikation
für diese Daten umzusteigen. Wir sparen Waits, und somit Locks, und somit
gewinnen wir Skalierbarkeit.

Ein anderes unangenehmes Faktum, mit dem wir leben müssen, ist
Asynchronizität auch bei den Calls. Der Mailer soll eine Mail annehmen. Dazu
muß er eine Reihe von Diensten, sechs bis zehn Stück, über das Netz
befragen. Würde er das in Sequenz tun, könnte jede Anfrage die Informationen
der vorhergehenden Stufe mit nutzen. Aber wir würden Round Trip Times,
Timeouts und andere Wartezeiten aufeinander türmen und bekämen Zustellzeiten
für eine einzelne Mail, die unakzeptabel hoch wären. Aus der Sicht des
Mailers sieht das so aus: Anfragen, Warten, Antwort lesen. Anfragen, Warten,
Antwort lesen, ...

Hauen wir stattdessen die Anfragen an parallel asynchron raus, kann die
ganze Middleware parallel losrödeln und ihre Antworten so schnell als
möglich an den Mailer zurück schießen. Der Anfrageprozeß sieht aus der Sicht
des Mailers jetzt so aus: Anfragen, Anfragen, ..., Warten, Antwort lesen,
Antwort lesen, ... Das ist schneller, und zwar um so schneller, je mehr
Dienste befragt werden müssen.

Es bringt auch ein paar Probleme mit sich: Zwischen einigen Anfragen
bestehen Abhängigkeiten. Zum Beispiel würde der Storageservice eine andere
Location für die Mail zurückliefern, je nachdem ob der Empfänger ein
zahlender User ist oder nicht und ob die Mail als Spam erkannt wurde oder
nicht. Man kann solche Abhängigkeiten synchronisieren - die Anfrage an die
Storage Layer müßte warten bis die Fragen nach dem Userstatus und der
Spamizität der Mail geklärt sind.

Aber - wir erinnern uns - Waits sind ja böse, also könnte man auch eine
andere Lösung in Betracht ziehen: Statt *die* Antwort zurück zu liefern
bauen wir die Storage Layer so um, daß sie *alle* Antworten zurückliefert
und wählen dann im Mailer die Antwort aus, die in Frage kommt, sobald die
anderen Fragen geklärt sind. Dann schreiben wir die Mail an diese Stelle und
comitten unsere Entscheidung an den Storageservice zurück - Coolness:
[Spekulative Execution](http://en.wikipedia.org/wiki/Speculative_execution).

Wir haben jetzt nicht nur 100% Buzzword-Compliance erreicht ("Our webmail
application is implemented as a distributed service oriented architecture
that leverages replicated data, asynchronous remote procedure calls and
speculative execution techniques to achieve resilency and scalability at
every level of its architecture." "Bingo!"), sondern wir haben tatsächlich
ein System, mit dem wir in Lastregionen vorstoßen können, die man auf eine
andere Weise nicht erreichen könnte.

Was ist der Preis? Komplexität. Exim ist auch ohne Mico im Bauch ein fetter
Mailer, und da Corba rein zu löten verdoppelt die Codebasis schätzungsweise
mal eben so in der Größe. Wenn man jetzt noch asynchrone Calls verwenden
will, anstatt das Corba Standardinterface, dann läuft man außerdem in
ziemlich wenig getesteten Code und in eine Reihe von sehr aufregenden Bugs
hinein.

Wenn man außerdem mit ungenauen oder veralteten Daten arbeiten muß, dann muß
außerdem eine Reihe von Fehlerbedingungen behandeln, die man sonst nicht
hätte und die unter Umständen schwer zu erkennen sind. Man stelle sich ein
System vor, daß aus ca. 150 Diensten besteht und in dem kein 2PC verwendet
wird. Ein Benutzer will jetzt von Freemail-Kunde auf zahlender Kunde
upgraden. Das ist eine Transaktion, aber da sie ohne 2PC nicht als solche
abgewickelt werden kann, kann es also sein, daß ein Kunde in einem Subsystem
schon ein Zahlkunde ist, in einem anderen aber noch nicht. Fragt man in so
einem Moment die verschiedenen Subsysteme an, bekommt man inkonsistenten und
widersprüchliche Antworten.

Jedes Subsystem, jedes Stück Code, muß diesen Zustand erkennen und geeignet
behandeln (Etwa: Warten, und dann ganz von vorne alle Fragen noch mal
stellen). Die dabei entstehenden Widersprüche können unter Umständen nicht
automatisch aufgelöst werden, und so muß jeder Dienst ein Abstellgleis
haben, in dem er fehlgeschlagene Aktionen abstellt, und sie entweder nach
einiger Zeit noch mal probiert oder - nach einer angemessenen Anzahl von
Fehlversuchen - einem Menschen zum manuellen Debugging vorlegt.

Will man diese Komplexität? Nein, nicht wenn man nicht muß. Das Problem ist:
Ab einer bestimmten Größe muß man, denn dies ist die einzige bewiesene
Wachstumsstrategie, die wir kennen, bei der wir bisher nicht an eine obere
Grenze gestoßen sind.

### Lockern von Anforderungen - Leben mit Fehlern

Der Schlüssel zum Wachstum liegt im Lockern der Anforderungen an eine
bestimmte Funktionalität der Anwendung: Indem wir bei den Anforderungen
asynchron arbeiten und veraltete oder ungebaue Daten zulassen, können wir
bei der Implementierung plötzlich sehr viel mehr Abkürzungen nehmen. Wir
haben eine Reihe von Grenzfällen ausgeschlossen, und den Vertrag mit den
Dienstnehmern von "garantiert" auf "so gut als möglich" gelockert. Dadurch
haben wir die harten Grenzfälle in unserer Architektur aus dem Dienst heraus
im Stack nach oben verschoben, und die Implementierung des Dienstes kann
sich auf die Optimierung der häufigen Fälle konzentieren, statt auf die
Abwicklung der schwierigen Fälle.

Aber wie wird das Development mit dieser Komplexität fertig? Nun, unsere
Entwickler bekommen Hilfe von einer anderen Seite. Weil wir kleine, autonome
Dienste mit eigener Datenhaltung bauen, bekommen wir kleine, unabhängig
voneinander entwickelbare Dienste mit einer überschaubaren Codebasis, einer
klar definierten API und gegenüber ihren Dienstnehmern und Dienstbringern
klar definierten Service Level Agreements und Invarianten.

Das erlaubt es dem Entwicklungsteam, ihren Dienst unabhängig von den anderen
Diensten zu entwickeln. Der Vertrag, den sie dabei eingehen, ist klar
definiert und von der tatsächlichen Implementierung vollkommen unabhängig.
Auch der Releasezyklus des Dienstes ist, solange der Vertrag nicht
inkompatibel geändert wird, von den Zyklen anderer Dienste nicht abhängig
(und mit versionierten Interfaces können wir das noch weiter entkoppeln).
Bei Amazon liest sich das so:

> A service is not just a software component in that sense, a distributed
> software component. It is also the model we use for software development
> in terms of team structure. 
> 
> So how the process goes is that you have a particular business problem or
> a technology problem that you want to solve. You build a small team. You
> give them this problem. And at Amazon, they're allowed to solve that
> problem in any way they see fit, as long as it is through this hardened
> API. They can pick the tools they want. They can do any design methodology
> they want as long as they deliver the actual functionality that they've
> been tasked with....
> 
> I think Pat Halens(sp?) uses the metaphor of using a town as an example.
> So in a big town, you have zoning requirements. You have some general laws
> about the roads and things like that, but the way that you build your
> house and the way that you operate your house is all up to you.
>
> So this is a bit the way that Amazon functions, also. We have some
> requirements: that services has to be monitorable, that they have to be
> tractable in all sorts of different ways. But in essence, operation is all
> up to the service owners themselves. This allows for a large-let's say
> controlled chaos-which actually works very well because everybody's
> responsible for their own services.

Service Oriented Architectures sind nur eine Ausprägung von "gelockerten
Anforderungen". Indem wir die Anforderungen an die Dienstabstraktion
lockern, lassen wir den Dienstimplementatoren mehr Optionen bei der
Architektur, und damit mehr Raum zu Wachsen. Das ist, wenn man es akzeptiert
und lebt, eine gute Sache.

Es läuft den Ideen der traditionellen Entwicklung und Informatiklehre aber
stark zuwieder. Bei
[Joel Spolsky](http://en.wikipedia.org/wiki/Joel_Spolsky) zum Beispiel
kommen solcherart gelockerte Anforderungen unter dem Namen
[Leaky Abstractions](http://www.joelonsoftware.com/articles/LeakyAbstractions.html)
daher. Joel kommt in seinem Essay aber zu dem Schluß "Leaky Abstractions are
dragging us down" - er sieht das Durchscheinen der Implementierung bei einem
Service als Bug. Für den Architekten einer Service Oriented Architecture
sind sie aber eher der Schlüssel zum Erfolg.

### Andere Anwendungen desselben Patterns

Dabei muß man aber nicht auf der Ebene der Architektur verbleiben. Wir
können dasselbe Pattern ("Lockern der Anforderungen, ohne die API zu
verändern") auch auf viel niedrigerer Ebene anwenden. MySQL tut dies intern
mit großem Erfolg: Dieselbe SQL-Query kann bis zu einem gewissen Grad
entweder auf einer traditionellen
[ACID](http://en.wikipedia.org/wiki/ACID) implementierenden Engine wie
InnoDB abgewickelt werden, oder man kann die Betriebsparameter von InnoDB so
relaxen, daß es nicht mehr ACID erfüllt, oder man kann eine andere Storage
Engine wie MyISAM oder Memory verwenden, die dieselbe Query unter Umständen
viel schneller abwickeln können, jedoch viel laxer mit dem Speicher umgehen.

Traditionelles ACID ist sicher - wenn das "COMMIT" zurück kommt, garantiert
die Datenbank, daß die Daten auf einem persistenten Speicher stehen,
konsistent und vollständig sind. Wenn man das benötigt, kann man es von
MySQL bekommen. In vielen Fällen - tatsächlich in den weitaus meisten Fällen -
benötigt man es nicht, und die damit einher gehenden Waits (Commit wartet
auf die Platte, und bei einer Plattenzugriffszeit von 8ms bekommt man so
nicht mehr als 100-200 Commits pro Sekunde pro Platte von seinem System)
ziehen die Performance runter.

MySQL erlaubt es, durch Konfigurationsänderungen für die ganze Datenbank
oder durch Ändern der Storage Engine für einzelne Tabellentypen diese
Anforderungen zu lockern, und so die Waits auf die Platte einzusparen, wo
dies erlaubt ist. Dadurch kann eine bis zu zehn mal höhere Rate an
Statements pro Sekunde erreicht werden - ohne daß sich die Art des Aufrufes
durch die Anwendung ändert. Die API, die die Anwendung gegenüber der
Datenbank verwendet, bleibt also invariant, die Änderung kann durch einen
DBA auf Operatingebene vorgenommen werden ohne daß die Entwicklung die
Anwendung anpassen muß.

### Links

Mehr zum Thema:

- [SOA](http://en.wikipedia.org/wiki/Service-oriented_architecture) in Wikipedia
- [ACM Queuecast](http://www.acmqueue.com/modules.php?name=Content&pa=showpage&pid=403)
mit Werner Vogels, CTO Amazon
- [Database War Stories](http://radar.oreilly.com/archives/2006/04/web_20_and_databases_part_1_se.html),
O'Reilly Radar, Series of 8 articles
