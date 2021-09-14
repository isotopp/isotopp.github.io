---
layout: post
published: true
title: "'Principal'?"
author-id: isotopp
date: 2009-11-09 19:24:12 UTC
tags:
- identity
- irc
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
![](/uploads/principal.png)

*Links: Benutzer in der realen Welt. Rechts: Eine Unix UID, die diesen Benutzer im System repräsentiert.*

Ich bin ich. Aber in einem Computersystem kann ich nicht sein, denn dort existieren nur Bits und Bytes. Daher werde ich dort durch einen Identifier repräsentiert. Diesen Identifier nennt man meinen [Principal](http://en.wikipedia.org/wiki/Security_principal).

Wenn ich mich in einem System einlogge, dann gebe ich einen Usernamen an - ich behaupte, jemand zu sein. Diese Phase des Logins nennt man _Identifikation_, und zur Identifikation gebe ich entweder meinen Principal direkt ein, oder etwas, das vom System eindeutig auf den Principal abgebildet wird.

Danach muß ich die behauptete Identität beweisen. Das nennt man _Authentisierung_ und kann durch ein geheimes Wissen geschehen (ein Paßwort), durch Besitz (ein Token oder eine Chipkarte) oder durch Sein (Biometrische Daten), oder eine Kombination davon (Mehrfaktor-Authentisierung, etwa ein RSA-Token mit PIN und minütlich wechselndem Code, also Paßwort + Besitz).

Das System ordnet meiner bewiesenen Identität dann Rechte zu. Das nennt man _Autorisierung_.

Es kann auch verbrauchte Ressourcen mitloggen und abrechnen, das wäre _Accounting_ (Mit AAA bezeichnet man oft den Dreiklang Authentication, Authorization and Accounting, etwa im Zusammenhang mit dem [RADIUS](http://en.wikipedia.org/wiki/RADIUS)-Protokoll).

Oder es kann Aktivitäten eines Benutzers auf eine Weise mitloggen, die nicht vermeidbar und nicht fälschbar ist, dann haben wir _Auditing_.

Allen diesen Dingen gemeinsam ist die Tatsache, daß was immer wir machen, einem Benutzer zugeordnet werden muß, also einem Subjekt der realen Welt. Das heißt, wir müssen dieses Benutzersubjekt in unserem System modellieren. Das ist der Principal.

Ein System ist dabei ein Scope, in dem dieser Principal eindeutig ist.

## Unix: UID als Principal

![](/uploads/spo-security.png)

*Zugriff auf eine Datei: UID 10100 will Datei /home/kris/.irssi/config (gehört ebenfalls UID 10100) öffnen.*

In Unix ist das System etwa eine einzelne Maschine, und der Principal ist dann eine User ID (UID). Diese wird benutzt, um überall in Unix einen Benutzer zu repräsentieren: An Dateien klebt eine UID dran, und an Prozessen. Wenn ein Prozeß (Subject) einen Systemcall (Verb) auf eine Datei (Object) anwenden will, dann prüft Unix für die Kombination von Subjekt und Object, welche Access Control List definiert ist (rwx?) und ob die Aktion erlaubt ist. Wenn ein Prozeß eine Datei erzeugen will, wird die ACL des Verzeichnisses geprüft, in dem die Datei erzeugt werden soll, und die neue Datei erbt die UID des Prozesses als Eigentümer-UID.

In Unix meldet man sich mit einem Usernamen an. Macht man das auf einer Konsole und nicht an einem X11, dann druckt das Programm 'getty' den Prompt 'login:' und nimmt den Usernamen entgegen. Es startet dann das Programm 'login', welches den Prompt 'Password:' druckt und das Paßwort abfragt. Eine Aufgabe von 'login' ist es, die Authentisierung durchzuführen, also das Paßwort zu prüfen. Eine andere ist es, den Usernamen in den Principal, die UID, zu übersetzen. 'login' selbst läuft dabei im Vorderteil noch privilegiert als root, und im Hinterteil degradiert unter der UID des Benutzers. Die letzte Aufgabe von 'login' ist es dann, die Shell zu starten.

## NIS: Scope ohne Management

Unix-Systeme kann man vernetzen, und dabei kann man das Problem haben, daß sich die Definition von Scope verändert. Setzt man zum Beispiel NIS (Yellow Pages) ein, dann hat man eine Gruppe von Unix-Systemen, die vom selben NIS-Master bedient werden. Innerhalb dieser Gruppe von Systemen muß die Abbildung von Usernamen auf Principals gleich sein, denn NIS hat keinen Mechanismus, der NIS-Principals von Unix-Principals trennen würde. Daher kann die Einführung von NIS auf einem Haufen zuvor uneinheitlich administrierter Unix-Systeme schmerzhaft sein, weil man unter Umständen UIDs umnummerieren und Dateien umownern muß, bis alles stimmt.

NFS, das Network File System, ist dabei ein schönes Beispiel für Probleme mit dem Scope: Ohne NIS kann man NFS kaum einsetzen. Denn was NFS transportiert, sind UIDs. Wenn diese UIDs aber nicht vereinheitlicht sind, dann bedeutet die UID 100 auf meinem System etwa etwas ganz anderes als auf dem System da hinten.

Wenn das System da hinten zum Beispiel die lokale Fachhochschule wäre, wir die Firewalls noch nicht erfunden haben, und jemand an der FH  einen NFS Export mit `/home *(rw)` konfiguriert hat, dann exportiert die FH die /home-Festplatte eines Rechners beschreibbar an die gesamte Welt.

Wenn ich diese Platte an meinem Rechner mit `mount -t nfs einrechner.der.fh.de:/home /mnt` bei mir mountete, dann würde ich unter `/mnt` jetzt die Home-Verzeichnisse der FH sehen und irgendwelche numerischen UIDs als Eigentümer der verschiedenen Home-Verzeichnisse sehen. Sagen wir, es gibt ein Verzeichnis `/mnt/test1`, das der UID 4711 gehört. Jetzt kann ich bei mir lokal den User mit der UID 4711 erzeugen, ihm ein Paßwort zuweisen und mich auf meinem Rechner als User mit der UID 4711 einloggen. Wenn ich dann cd `/mnt/test1` mache, kann ich dieses Verzeichnis auf dem Rechner der FH beschreiben, also etwa eine `/mnt/test1/.rlogin`-Datei anlegen, die mir das Login von meiner Kiste auf dem Rechner der FH erlaubt ohne daß ein Paßwort abgefragt wird.

Ein Schutz existiert hier nicht: Der Rechner der FH akzeptiert meine UID 4711 als seine eigene UID 4711, obwohl beide aus unterschiedlichen administrativen Domains stammen, also komplett unterschiedlich gescoped sind. Das ist ausnutzbar, um beliebige Accounts auf dem entfernten Rechner zu übernehmen. Ein NFS-Export muß also immer auf Systeme innerhalb des Scopes der gemeinsam verwalteten UIDs limitiert sein.

Ein ähnlicher Angriff erzeugt Dateisysteme auf transportablen Medien - Disketten oder mobile Festplatten. Wenn diese auf dem importierenden System akzeptiert werden und nicht besonders behandelt werden, dann kann man sich zum Beispiel leicht eine Shell auf einer Diskette mitbringen, die der UID 0 gehört und SUID ist - sobald man die Shell also aufruft, wird man privilegiert.

Das NIS+ System von Sun unterscheidet hier zwischen NIS+ Principals und Unix-Principals, und kann diese aufeinander abbilden. Das ist für jemanden, der von NIS her kommt oder dem das Konzept eines Security Principals nicht geläufig ist, zunächst einmal verwirrend, aber es macht die Administration später einfacher.

## LDAP: Übersetzung von Loginnamen in Principals (LDAP dn)

![](/uploads/ldap-phase1.png)

*LDAP Phase 1: Anonymous Bind zur Übersetzung von Login-Namen in einen LDAP dn.*

Auch LDAP verwendet Principals, die von Unix-UIDs verschieden sind - man meldet sich an einem LDAP-System entweder mit einem Benutzernamen oder direkt mit dem Principal, dem LDAP Distinguished Name, an. Da LDAP dn's sehr lang sein können wird man in der Regel einen Benutzernamen (den Common Name oder den Unix-Loginnamen) verwenden. LDAP macht dann zunächst einmal einen Anonymous Bind (es meldet sich beim LDAP Server als eine Art Gast-User an) und einen Lookup vom Login-Namen auf den dn des Benutzers - dies ist quasi die Identification-Phase des Logins wie oben erwähnt.

![](/uploads/ldap-phase2.png)

*LDAP Phase 2: Mit dem DN und dem Paßwort meldet sich LDAP nym beim Server an. Gelingt das, stimmt das Paßwort. Der Server muß das Paßwort nicht herausgeben.*

Nach einem Disconnect macht LDAP dann mit dem erhaltenen dn und dem Kennwort des Benutzers einen nymous Bind. Wenn der gelingt, weiß der Client, daß das für diesen dn angegebene Paßwort stimmt und der User ist auch authentisiert - der LDAP Server muß dazu das Paßwort nicht herausgeben: Wenn der nyme Bind gelingt, weiß der Client, daß das Paßwort stimmt. LDAP könnte nun mit dieser Verbindung die Rechte herunterladen, die dieser Identität zugeordnet sind, oder diese irgendwie anders ableiten - oft reicht nach dem nymous Bind auch ein einfaches Disconnect ohne eine einzige LDAP-Query.

## IRC: Principals done right (and wrong)

Auch IRC hat Principals. In der Freenode-Geschmacksrichtung von Irc sind das die Nicknames, mit denen man sich beim Netz anmeldet. In irssi wäre das eine Definition wie 

```console
chatnets = {
  freenode = {
      type = "IRC";
      nick = "Isotopp";
      autosendcmd = "/^msg nickserv identify s3cr3t; wait 2000";  
   };
};
```

Die Authentisierung des Nicknames `Isotopp` erfolgt hier, indem als User Isotopp eine MSG `identify` an den User `nickserv` gesendet wird, die das Authentisierungspaßwort enthält. `nickserv` prüft das, und ordnet dann über den Irc-Server dem User weitere Rechte zu.

In der Ircnet-Geschmacksrichtung von Irc funktioniert das anders. Ircnet ist archaischer und verwendet als Principal die IP-Nummer des Benutzers, unter der Annahme, daß diese Zuordnung a) irgendwie statisch und b) eindeutig ist. Eine Authentisierung findet nicht statt, sondern Ircnet vertraut dem unterliegenden Transport. Da TCP verwendet wird, weitgehend zu Recht. Ircnet ordnet IP-Nummern dann in der Autorisierung Rechte zu - zum Beispiel wird der gesamte Block von T-Online Adressen im Ircnet besonders behandelt.

Das ist so, weil es aus diesem Adreßbereich Vandalismus gegeben hat, und da die Zuordnung von realen Personen zu Principals unter anderem wegen der T-Online 24h Zwangstrennung nicht fest ist, wenn man IP-Adressen statt Nicknamen mit Paßworten verwendet, muß man hier eine Art Gruppenhaftung einführen - wegen einiger Vandalen  haben alle T-Onliner in Ircnet eine Sonderbehandlung - oder mit anderen Worten, die Zuordnung von realen Benutzern zu IP-Nummern ist nicht statisch und IP-Nummern sind keine richtigen Principals, werden aber von Ircnet dennoch so verwendet.

Ircnet will auch die Anzahl der Nicknames limitieren, die ein einzelner User verwenden darf. Da IP-Nummern als Principals verwendet werden, limitiert man also die Anzahl der Verbindungen, die von einer einzelnen IP-Nummer ins Ircnet aufgebaut werden dürfen. Das ist lästig, wenn man einen Host betreibt, auf dem mehrere User eingeloggt sind, die alle IRC im Ircnet machen wollen: Ircnet verweigert einem dann irgendwann die Anmeldung mit "Too many host connections (global)". Oder mit anderen Worten, die Zuordnung von realen Benutzern zu IP-Nummern ist auch nicht eindeutig, und IP-Nummern sind keine richtigen Principals, werden aber von Ircnet dennoch so verwendet.

Ein Weg, das zu fixen, ist eine Mail an die Ircnet-Operators mit der Bitte, eine Sonderbehandlung für den vermeintlichen Principal - die eigene IP-Nummer - einzutragen. Das ist auf mehrere Weisen lästig. Einmal muß man das alle paar Jahre wieder machen, wenn man den Server umzieht und die IP-Nummer des Servers sich ändert. Zum anderem muß die Eintragung unter Umständen auf mehr als einem Irc-Server erfolgen - denn während Ircnet zwar global über alle Server die Verbindungen zählt, erfolgt die Freischaltung auf jedem Server einzeln (und  mit unterschiedlichen Limits). Das ist recht schwer zu debuggen und man muß bei jedem Serverbetreiber einzeln quengeln.

Eine andere Art das zu fixen ist, zu akzeptieren, daß Ircnet als Principal eine IP-Nummer verwendet, auch wenn IP-Nummern keine Principals sind. Man ordnet also jedem Unix-User eine eigene IP-Nummer zu. Die UID 100 verwendet als abgehende IP-Nummer 2a01:238:40ab:cd00::100, die UID 101 dann die 2a01:238:40ab:cd00::101 und so weiter. Ircnet zählt, blockiert und tracked dann jeden User via die IP-Nummer getrennt und man spart sich auf beiden Seiten Verwaltungsaufwand.

In irssi schreibt man das also als 

```console
chatnet = {
  ircnet = {
      type = "IRC";
      nick = "Isotopp";
      username = "Isotopp";
      host = "2a01:238:40ab:cd00::2774";
  };
};
```

Dabei legt der Parameter `host` fest, an welche abgehende Adresse sich der Client bindet, mit welcher IP-Nummer er also für Ircnet sichtbar wird, hier wird der UID `10100 (kris)` also die IP-Nummer `…::2774` (dezimal 10100) zugeordnet. Ircnet akzeptiert das und erlaubt nun allen Unix-Benutzern den Connect vom lokalen System aus, weil jeder Benutzer von einem anderen Host kommt und daher nur gegen sein eigenes Limit zählt. Für die Ircnet-Operators ist das auch bequem - wenn ein User zickt, können sie seine IP-Nummer identifizieren und getrennt von allen anderen Benutzern von derselben physikalischen Maschine blocken.

Nur sicherheitstechnisch ist es immer noch nicht korrekt, denn IP-Nummern sind nun einmal keine Principals. Das Freenode-Modell zeigt, wie es korrekt funktioniert.