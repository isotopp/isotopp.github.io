---
author: isotopp
date: "2008-11-17T09:36:07Z"
feature-img: assets/img/background/schloss.jpg
tags:
- kryptographie
- security
- lang_de
title: Wann soll ich verschlüsseln?
aliases:
  - /2008/11/17/wann-soll-ich-verschluesseln.html
---

Drüben bei 
[Securosis](http://securosis.com/2006/12/21/the-three-laws-of-data-encryption/)
gibt es schon seit einiger  Zeit einen feinen Artikel zum Thema "Wann soll ich Daten verschlüsseln?"
Die drei Regeln dort sind die sinnvollste Zusammenfassung zu diesem Thema, die ich seit langer Zeit gesehen habe.

1. Transportverschlüsselung ist nicht nur okay, sondern ein Muss. 
 Bei Transportverschlüsselung werden Daten verschlüsselt, die bewegt werden.
 Es existiert aber zu jedem Zeitpunkt eine Klartextkopie der Daten.
 Transportverschlüsselung hat man bei SMTP mit TLS, bei HTTPS und mit Einschränkung bezüglich der Klartextkopie auch bei Backups oder bei Laptops.
2. Um Trennung von Rollen zu erzwingen, wenn Access Control Lists das nicht erreichen können.
 Das heißt in der Regel, wenn man sich gegen die eigenen Administratoren schützen will, denn in allen anderen Fällen greifen ACLs ja. 
3. Wenn jemand es vorschreibt ("verordnete Verschlüsselung"), es also durch einen Vertrag oder eine Übereinkunft erzwungen wird.

Warum will man sonst nicht verschlüsseln?

Weil Verschlüsselung das Leben sonst nur härter macht, ohne einen Sicherheitsmehrwert zu bieten.
Insbesondere Speicherverschlüsselung ist mehr Teil des Problems als Teil der Lösung.
Speicherverschlüsselung ist jede persistente Verschlüsselung, bei der keine Klartextkopie der Daten verbleibt.
Typische Speicherverschlüsselung wäre also die Plattenverschlüsselung, wie sie mit LUKS erreicht wird, oder eine Verschlüsselung auf Dateiebene, wie sie in NTFS eingebaut ist.

Beide Systeme erlauben es immerhin schon, daß eine administrative Instanz einen Key Recovery Prozess aufsetzt, mit der diese administrative Instanz immer wieder an die Daten herankann, ohne daß eine Kooperation des Medienbesitzers notwendig ist.
Was hier so kompliziert klingt bedeutet nur, daß etwa mein Arbeitgeber meine Laptop-Festplatte oder meinen Mailstore auch dann entschlüsseln kann, wenn ich das dazu notwendige Passwort nicht nennen will oder kann.
Ohne einen solchen Key Recovery Prozess kann man als Firma alle verschlüsselten Daten ansonsten gleich als Totalverlust abschreiben, denn die Möglichkeit, daß ich mit dem geheimen Passwort für die Geschäftspläne für die nächsten 5 Jahre gegen einen Baum fahre oder zur Konkurrenz überlaufe besteht ja immer.

Aber auch außerhalb von Desaster Recovery Szenarien macht Speicherverschlüsselung eine Menge Ärger.

Das typische Szenario sind etwa Urlaubsvertretungen beim Empfang von speicherverschlüsselter Email.
Die Mails sind also verschlüsselt im Mailstore abgespeichert.
Wenn beim Zugriff auf die Mails der Zugriff nur durch eine bestimmte Software ("Outlook") möglich ist, ist Verschlüsselung nicht notwendig, weil das Rechtesystem der Software das regelt. 
Wenn der Zugriff durch mehr als eine Software möglich ist ("cd ~user/Maildir; cp * ..."), muss man der Urlaubsvertretung Zugriff auf einen Schlüssel geben, der ihr die Wahrnehmung der Rolle ("Zugriff auf die dienstlichen Mails") erlaubt, aber nicht die Wahrnehmung der Identität ("Zugriff auf die privaten Mails der vertretenen Person").
Und am Ende der Vertretung muss man den dienstlichen Schlüssel sicher wieder entziehen.

Andererseits ist die Schutzwirkung von Verschlüsselung gegen Zugriffe auf das aktive System eher schwach.
Der Schutz gegen "Hacker" ist jedenfalls bei allen diesen Systemen leicht zu unterlaufen: 
Aus Geschwindigkeitsgründen müssen alle diese Systeme mit symmetrischer Verschlüsselung arbeiten.
Dabei wird entweder ein Key pro Dateisystem ("Festplattenverschlüsselung") oder ein Key pro Datei ("Dateiverschlüsselung") verwendet.
Der entsprechende Key muss an irgendeiner Stelle im Speicher stehen, wenn das betreffende Dateisystem gemounted bzw die entsprechende Datei geöffnet ist.
Ein "Hacker", also ein Angreifer, der Systemrechte hat, kann diesen Key leicht im Speicher suchen und dann verwenden, um die Daten zu entschlüsseln oder gleich die entschlüsselten Blöcke aus dem Cache fischen (oder einen legitimierten Prozess so verändern, daß er die gewünschten Daten ausliest und entschlüsselt).

Die Zusammenfassung für Speicherverschlüsselung ist jedenfalls: 
Wenn man den Integritätsmechanismen des Systems vertrauen kann, dann reicht es aus, ACLs zu verwenden, solange man nicht gegen Admins verteidigen muss.
Das ist dann auch besser managebar.
Wenn man davon ausgeht, daß die Integritätsmechanismen des Systems kompromittiert sind, dann bietet Verschlüsselung keinen zusätzlichen Schutz.

Transportverschlüsselung und Verschlüsselung von "transportierten Medien" wie Backups und Laptops sind eine andere Sache und muss viel aggressiver angegangen werden.
Dabei darf man Key Recovery jedoch nicht aus dem Blick verlieren.
