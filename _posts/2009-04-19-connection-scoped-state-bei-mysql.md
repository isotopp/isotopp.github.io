---
layout: post
published: true
title: Connection Scoped State bei MySQL
author-id: isotopp
date: 2009-04-19 11:14:27 UTC
tags:
- faq
- mysql
- php
- phpmyadmin
- lang_de
feature-img: assets/img/background/mysql.jpg
---
Aus einer Diskussion in der deutschsprachigen MySQL Gruppe im USENET. Dort ging es um die Frage, warum phpMyAdmin ein eingeschränktes Werkzeug ist und bei vielen Helfern im Netz unbeliebt. Meine Antwort lautete so:

phpMyAdmin unterliegt wie auch viele grafische Werkzeuge für MySQL (darunter auch jene, die von MySQL selbst bereitgestellt werden) einigen besonderen Einschränkungen. Diese sind prinzipbedingt und daher auch nicht leicht zu beheben.

Aber von vorne:

In MySQL ist es so, daß die Connection einen besonderen Kontext oder Scope darstellt. Mindestens die folgenden Dinge sind mit dem Scope der Connection definiert: 

- Transaktionen. Ein Disconnect entspricht einen ROLLBACK.
- Transaktionen können mit SELECT ... FOR UPDATE oder LOCK TABLES auch Locks erzeugen. Diese sind bei einem Disconnect wieder weg.
- Die mit LAST_INSERT_ID() abrufbare zuletzt von auto_increment vergebene ID wird in der Connection gespeichert. Sie ist nach einem Disconnect nicht mehr verfügbar.
- Mit CREATE TEMPORARY TABLE erzeugte Tabellen. Sie werden bei Disconnect gelöscht.
- Prepared Statements und der vorgeparste Code von Stored Code (CREATE PROCEDURE und CREATE FUNCTION) werden pro Connection verwaltet, auch wenn das technisch eine falsche Lösung ist.
- @-Variablen. `SET @bla = 10` oder `SELECT @bla := count(*) FROM keks;` definieren jeweils eine Connectionvariable mit dem Namen `@bla`, die beim Disconnect verloren ist.
- SESSION-Parameter. `SET SESSION mysiam_sort_buffer_size = 1024*1024*64` oder `SET @@session.myisam_sort_buffer_size = 1024*1024*64` sind nach einen Disconnect verloren. Dies gilt auch für die häufig gesetzten Character Sets (`SET NAMES` ist nur ein Kürzel für drei bestimmte `SET SESSION ...`).
- Replikationsspezifische SET-Kommandos wie `SET TIMESTAMP` oder `SET LAST_INSERT_ID` können das Verhalten von Funktionen wie `SELECT NOW()` oder `SELECT LAST_INSERT_ID()` beeinflussen.

Wir nennen so etwas Zustand im Scope der Connection oder Connection Scoped State (CSS, mal wieder).

Ein Client, der also unkontrolliert disconnected oder bei dem ein Disconnect nicht korrekt gemeldet wird, ist defekt in dem Sinne, daß die o.a. Funktionalität nicht wie erwartet verfügbar ist.

Das gilt für viele grafische Clients - viele von denen machen nach dem Absenden der Query und dem Lesen des Resultsets einen Disconnect und verbinden sich für die folgende Query neu, darunter auch der MySQL Query Browser.

Das gilt auch für einige veraltete Versionen von Connectoren. Eine Zeit lang dachte das MySQL Connector/J-Team zum Beispiel, es sei eine gute Idee, Auto-Reconnect bei Verlust der Connection aus welchem Grund auch immer zu machen. Korrekt ist stattdessen, eine Java Exception dafür zu schmeissen, damit die Anwendung auch eine Chance hat, den Verlust des Session-Zustandes mitzubekommen. Denn wenn einem der Session-Verlust mitten in einer Transaktion passiert, und der Connector dann einfach wieder verbindet statt die Exception zu werfen, kann man ein paar echt schwer zu findende Heisenbugs bauen.

Und das gilt prinzipbedingt auch für jeden Webclient wie phpMyAdmin einer ist. Es ist nun mal so, daß etwa Apache einen Haufen Worker Slaves hat und daß ein eingehender http-Request einen zufälligen Worker Slave zugeteilt wird. Es wäre also selbst mit `mysql_pconnect()` nicht möglich einen phpMyAdmin zu schreiben, der CSS korrekt behandelt.

## Kann Dein Client CSS?

Definiere in einer Query eine Sessionvariable: `SET @bla = 'Ich bin korrekt';`

In einer zweiten Query frage den Wert der Variaben ab: `SELECT @bla;`

Wenn Dein Client mit 'Ich bin korrekt' antwortet, kann er CSS verwalten. Ansonsten ist er unbrauchbar und gehört auf den Müll - wer will schon einen Datenbankclient, mit dem man nicht mal eine Transaktion korrekt verwalten kann?