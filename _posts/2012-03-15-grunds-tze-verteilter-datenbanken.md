---
layout: post
published: true
title: Grundsätze verteilter Datenbanken
author-id: isotopp
date: 2012-03-15 08:59:42 UTC
tags:
- cluster
- datenbanken
- distributed computing
- mysql
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Wonka> Die [Toppoint](http://www.toppoint.de'>http://www.toppoint.de)  z.B. 
wird vermutlich nie was haben, was in nennenswerte Last-Regionen kommt, aber
ich will - akademisches Interesse und so - schon wissen, wie man das da am
besten täte.  Was mich auch für die Toppoint interessiert: irgendeine Sorte
Redundant Array of Inexpensive Databases :)

Lalufu> MySQL mit Replication?  Alternativ mit DRBD?

Isotopp> Mit DRBD. Nicht mit Replikation.

Wonka> Lalufu: Hm, Master-Master-Replication geht ja nur mit Zweien.  Wenn
man nun mehr als das haben will, kann man zwar Ringe bauen, aber nur einfach
verkettete.

Isotopp> Wonka: Argh!  Master-Master geht nicht mit Replikation.  Nie.

Wonka> huh?

Isotopp> ```sql
-- Thread 1 schreibt auf Master 1:
  insert into t (id, d) values (NULL, 'eins');

-- Zeitgleich schreibt thread 2 auf master 2: 
  insert into t (id, d) values (NULL, 'zwei');
```
  
Isotopp> Was steht in der Datenbank master1, was steht in der Datenbank
master 2?  Wenn man mal annimmt, dass MySQL auto_increment_increment und
auto_increment_offset korrekt gesetzt sind?

Wonka> Isotopp: ok, Problem.  Trotzdem gibts reichlich HOWTOs dazu.

Isotopp> Wonka: Das ist noch kein Problem.  Du kriegst `(1, 'eins')` und `(2, 'zwei')`.
So weit funktioniert das.

kv_> Bei UPDATE sieht's anders aus.

Isotopp> Jetzt macht aber Thread 1 auf Master 1 ein UPDATE. Und zwar `update t set d = 'een' where id =1;`
Und Thread 2 macht auf Master 2 ein UPDATE, Und zwar `update t set d = 'one' where id  = 1;`
Was steht auf Master 1 und was steht auf Master 2?

Isotopp> Der Punkt ist, daß es keine global fuer die Domain des ganzen
Ringes gültige Serialisierung von Ereignissen gibt, es also keine globale
Festlegung der Reihenfolge von Ereignissen gibt.  Sondern jeder lokale
Knoten hat seine eigene Reihenfolge von Ereignissen.  Im Klartext heißt das,
daß auf Master 1 die Reihenfolge der Events een, one sein kann, auf Master 2
aber one, een oder umgekehrt.

Lalufu> Genaugenommen ist das Problem, daß Leute sowas gerne hätten, aber
MySQL das nicht liefern kann.

Isotopp> Lalufu: Nein, die Situation ist weitaus komplizierter.  Laß mich zu
Ende erklären.

Wonka> [http://www.howtoforge.com/mysql_master_master_replication](http://www.howtoforge.com/mysql_master_master_replication):
> "This tutorial describes how to set up MySQL master-master replication.  We
> need to replicate MySQL servers to achieve high-availability (HA).  In my
> case I need two masters that are synchronized with each other so that if one
> of them drops down, other could take over and no data is lost.  Similarly
> when the first one goes up again, it will still be used as slave for the
> live one."

Wonka> Also haben die's nicht verstanden...

Isotopp> Richtig.  Genauer: Sie glauben, sie können gewinnen.  Aber das
Universum kann man nicht bescheißen.

Isotopp> Wonka: Du willst also eine solche Serialisierung erzwingen. In SQL
erzwingt man eine bestimmte Reihenfolge von Ereignissen, indem man für die
Domain, in der man arbeitet eine Sperre (englisch: lock) setzt.  Man braucht
also ein Locking, das in der ganzen Domain gilt.

Isotopp> Die Domain ist nun aber nicht mehr eine Kiste, dafür hat Dein SQL
Server ja Locks,sondern der Ring.  Und MySQL Replikation hat spezifisch kein
Locking Protokoll.  Es gibt solche Protokolle, 2PC, 3PC, Paxos, Raft und
noch ein paar mehr.  2PC ist das schnellste, in dem Sinne, daß es minimale
Umlaufanzahlen/Lockzeiten hat.  Paxos und Raft sind im Sinne der
Ausfallsicherheit/Recoverability das Sicherste.

Ohne ein solches Locking Protokoll kannst Du nirgendwo konkurrente Writes
sicher durchführen, weil Du eben keine für die Domain gültige Serialisierung
von Ereignissen erzwingen kannst.

Jedes Setup mit mehr als einem Writer ohne ein distributed locking protocol
ist also kaputt.

Lesen wir also die Anleitung zu mmm, MySQL Multi Master.  Steht drin:
schreiben nur in einem Knoten.  Also: ein Ring, kein Multi-Master - der Name
ist Betrug.

Gucken wir irgendwo sonst, total egal wo: ENTWEDER Synchronisation durch
Locking ODER nur ein Master ODER kaputt.

Das ist die Wahl. Die ganze Wahl. Es gibt keine weiteren Möglichkeiten.

kv_> Wonka: Und wenn man die Leute fragt, warum die Master-Master oder
circular replication aufsetzen, kommt immer die falsche Antwort:
"Ausfallsicherheit" oder "Lastverteilung".  Für Ausfallsicherheit nimmt man
ein Shared Storage und baut sich eine failover-Lösung auf OS-Ebene drüber -
also NetApp oder DRBD.  Und für Lastverteilung beim Lesen nimmt man one-way
Replication.  Schreibverteilung kann MySQL nicht.  Da fängt man dann an, auf
Anwendungsebene Sharding-Architekturen zu bauen.

Isotopp> Exakt.

Isotopp> Lalufu: So, jetzt zu MySQL und liefern.

Isotopp> Lalufu: MySQL liefert ein Produkt mit mehreren Knoten und 2PC.  Es
heißt MySQL Cluster.  Es verwendet nicht MYSQL Replikation um das zu tun.

Isotopp> Und zu HA: MySQL 5.1, 5.5 und 5.6 haben verschiedene Inkremente von
MySQL SemiSynchronous Replication (SSR).  Damit hat man EINEN Master, aber
Slaves, die das Commit auf dem Master VERZÖGERN (den Master also langsamer
machen), bis wenigstens ein Slave existiert, der denselben Stand hat wie der
Master.

Das kombiniert die Nachteile von 2PC (warten) mit den Nachteilen von
Replikation, die da sind:

In MySQL Replikation ist der Slave ja abhängig von der MySQL binlog
position, die verwaltet jeder Knoten aber selber.  Und das heißt, man kann
den Slave 3, der an Master 1 hängt, nicht einfach an Slave 2 hängen, von dem
wir wissen, daß er Dank SSR auf demselben Stand wie Master 1 ist.  Das ist
so, weil der Stand von Master 1 in binlog position (mname, mpos) ausgedrückt
wird, derselbe Stand auf slave 2 aber (s2name, s2pos) ausgedrückt wird.

Und es gibt keinen Übersetzungsmechanismus (man kann einen bauen, das tut
dann unterschiedlich weh, je nachdem wie korrekt man das im Falle eines
Desasters haben will.  Und wir reden über HA, man will es also korrekt
haben).

In MySQL 5.6 gibt es dann die Global Transaction ID (GTID) und einen
Übersetzungsmechanismus (transparent, automatisch) von GTID in lokale
Position.  Mit SSR und GTID zusammen kann man dann in 5.6 auch endlich
Replikation als HA Mechanismus verwenden und könnte einen Ring mit genau
einem aktiven Master als HA-System stabil verwenden.  Das heißt, man hat
immer noch Waits wegen der Synchronisation in SSR, aber keine Probleme mit
dem Failover mehr.

Wonka> MySQL Cluster ist aber nicht FOSS, oder?

Isotopp> Wonka: MYSQL Cluster war früher FOSS.  Was es jetzt ist, habe ich
nicht nachgesehen, weil mich Cluster aus anderen Gründen nicht interessiert.

Es ist strukturell nicht möglich, normale Anwendungen, die gegen vanilla
MySQL performen, gegen Cluster laufen zu lassen und Performance zu erwarten. 
Cluster-Software ist immer speziell gegen Cluster geschrieben.

Aktueller Cluster ist inzwischen VIEL BESSER darin als der Cluster, den ich
gekannt habe, aber es bleibt schwierig.

Du suchst einfache Lösungen fuer distributed databases.  So etwas existiert
nicht.  So etwas KANN nicht existieren ohne daß du an c drehst.

Du willst also mit Q (aus Star Trek: The Next Generation) reden, oder Dir
eine von Grace Hoppers Mikrosekunden um den Hals hängen.

Lalufu> Wuerden Sie diesem Mann Ihre Replikation anvertrauen?  

![](http://images5.fanpop.com/image/photos/25400000/Discord-dance-random-25482674-500-378.gif)
