---
author: isotopp
title: "Dein Kind will Minecraft spielen"
date: 2021-12-20T13:32:00+01:00
feature-§img: assets/img/background/rijksmuseum.jpg
tags:
- lang_de
- gaming
- microsoft
- minecraft
---

Nachdem mich jetzt das dritte Paar computer-affiner Eltern mal gefragt hat, was man denn braucht, sobald der Nachwuchs sich "Minecraft" wünscht, hier der Aufschrieb zum Thema.

Minecraft ist ursprünglich von der schwedischen Firma Mojang in Java entwickelt worden.
Der Eigner, Markus "Notch" Persson, hat das Spiel und die Firma Mitte 2014 auf Twitter zum Verkauf angeboten, und Microsoft hat die Firma gekauft.

[![](/uploads/2021/12/minecraft6.jpg)](https://twitter.com/notch/status/478766808841732096)
*Spiel zu verkaufen - Minecraft ist auf Twitter angeboten worden. Jeder mit dem notwendigen Kleingeld -- 2.5 Milliarden USD -- konnte zuschlagen.*

Techradar hat mehr zur [Geschichte von Minecraft](https://www.techradar.com/news/the-history-of-minecraft).

## Java und Bedrock-Edition

Eine der Aktivitäten von Microsoft war, das Spiel in C# neu zu schreiben. Dies ist die Bedrock-Edition, im Gegensatz zur Java-Edition des Originalspiels. 

Bedrock und Java sind nicht kompatibel, es gibt kein Crossplay, und die beiden Spiele werden nicht parallel entwickelt.
Es sind für alle praktischen Zwecke zwei verschiedene Spiele.

Man will unbedingt und ausschließlich die Java-Edition kaufen.
Die Bedrock-Edition ist steril:
Erweiterungen für den Client und den Server werden von Microsoft verkauft.
Als Entwickler muss man sich anmelden, Verträge unterschreiben und Gebühren managen.
Es gibt deswegen praktisch keine Mod-Scene, sondern nur abgepacktes Gameplay.

Niemand spielt Bedrock, und wenn Dein Kind von Minecraft redet, meint es die [Java-Edition](https://www.minecraft.net/en-us/store/minecraft-java-edition).

![](/uploads/2021/12/minecraft1.jpg)
*Die Maskottchen und default Skins: Steve und Alex.*

Die Java-Edition ist extrem lebendig, genau genommen ein unregulierter Dschungel.
Hier gibt es viele nette Leute, die spannende Dinge machen, und ein paar sehr dunkle Ecken.
Das ist aber im Grunde kein das Spiel verderbendes Problem, sondern eine gute Gelegenheit, gleich auch ein wenig Medienkompetenz und Grundlagen der Sicherheit zu vermitteln. 

## Was wird gespielt?

Minecraft ist ein Spiel, das für Kinder ab 8 interessant ist.
Es ist zunächst einmal eine Art virtuelles Lego im Anzug eines Survival- und Crafting-Spieles:
Die Spieler müssen in einer Welt aus Blöcken erkunden, Ressourcen sammeln, aus den Ressourcen Dinge bauen und dabei die Nacht überleben.
Das ist nicht unbedingt einfach, denn in der Nacht kommen verschiedene Monster, gegen die man nur bestehen kann, wenn man tagsüber einen Unterschlupf gebaut und Ausrüstung gewonnen hat.

![](/uploads/2021/12/minecraft2.jpg)
*Die Overworld, die normale Welt, hat verschiedene Klimazonen ("Biome"), in denen unterschiedliche Ressourcen zu finden sind.*

Das Spiel hat eine marginale Story, im Laufe derer die Spieler weitere "Welten" entdecken und durch Portale betreten können:
der Nether und the End.
Das ist jedoch im Grunde alles nebensächlich, weil es in der ersten Iteration darum geht, mit Freunden zusammen aus Klötzen Dinge zu bauen.

## Hardware-Anforderungen

Wegen der Zielgruppe hat das Spiel (mindestens bis Version 1.14.4) praktisch keine Mindestanforderungen an die Hardware.
Wortwörtlich jeder abgelegte Kartoffelcomputer kann Minecraft irgendwie ausführen -- Probleme entstehen vermutlich erst, wenn eine IDE (siehe unten) oder ein Videoschnitt-System oder Streaming-Support dazu kommen. 
Wie dem auch sei:
Das schließt ein 2009er MacBook Pro, einen Raspi 4 und circa jede Intel-Büchse der letzten 10 Jahre ein.
Weil es Java ist, funktioniert das alles mit demselben Spiel.

Wegen der Modding-Community (dazu unten mehr) gibt es praktisch auch keine Höchstanforderungen an die Hardware:
Wenn man Raytracing Renderer installiert hat, reizt das Spiel auch eine [Nvidia RTX 3090](https://www.youtube.com/watch?v=AdTxrggo8e8) voll aus.

[![](/uploads/2021/12/minecraft3.jpg)](/uploads/2021/12/minecraft3.jpg)
*Minecraft Standard und mit einem Raytracing Render Mod auf einer Nvidia RTX. Was ein paar hingeworfene Kissen ausmachen...*

Minecraft ist eine Client-Server-Anwendung. Ein oder mehr Spieler verbinden ihre Clients mit dem Minecraft-Server und bespielen dann zusammen diese Welt.
Spielt man "offline", startet der Launcher im Hintergrund einen lokalen Server auf dem Laptop, und verbindet den Client im Einzelspielermodus mit dem Server.

Im Onlinebetrieb verbindet man sich mit einem zentralen Server, der von irgendjemandem betrieben wird, und spielt dann dort mit anderen.
Das sind im Zweifel echt viele Spieler -- auf einem öffentlichen Server irgendwelche Personen irgendwelchen Alters.
Auf einem privaten Server ist es so, wie immer es die Zugangs-Policy des Servers definiert.

## Kein Minecraft ohne Discord, kein Login ohne 2FA

Öffentliche Server gibt es viele, die verschiedenen Serverlisten zeigen um eine halbe Million Serverinstallationen an.
Die meisten sind relativ kleine Communities mit beschränktem Zugang, einige sind sehr grosse öffentliche Installationen.
Besonders hervorstechend ist [Hypixel](https://de.wikipedia.org/wiki/Hypixel), einer der am besten gewarteten und entwickelten öffentlichen Server.

Zu jedem öffentlichen Server gehört dieser Tage auch immer ein Discord (früher war das Teamspeak).
Der Hypixel Discord ist zum Beispiel [hier](https://discord.com/invite/hypixel).

Discord ist ein Hoster für Text-, Sprach-, Video-Chat und Game-Streaming.
"Ein Discord" ist ein geschlossener (zunächst kostenloser) virtueller Chatserver mit verschiedenen Kanälen für Text- und AV-Chat. 

Mit einem einzelnen Discord-Login kann man Zugang zu einer Reihe von Communities unterschiedlicher Größe bekommen. 
Es ist also sinnvoll, mit dem Java-Minecraft-Account auch noch gleich einen (kostenlosen) Discord-Account zu erstellen.

Dabei ist es extrem sinnvoll, diesen Zugang (wie auch den Microsoft-Zugang) mit 2-Faktor-Authentisierung abzusichern und das Kind gleich von Anfang an zu 2FA zu erziehen.
Warum ist das so?
[Dazu hier ein kleines Erlebnis]({{< relref "/2021-11-30-discord-nitro-spam-and-2fa.md" >}}).

## Was wird eigentlich gespielt?

Nach einer Weile Spiel wird das Kind weitere Wünsche und Fragen haben, weil das Spiel selbst nicht der primäre Inhalt von Minecraft ist.

Minecraft ist ein kollaboratives Multiplayer-Spiel, das von den Spielern selbst verändert wird, indem diese Mods (Client-Erweiterungen) und Plugins (Server-Erweiterungen) erstellen.
Das heißt, sehr bald kommen die folgenden Fragen und Probleme:

- Es gibt Streit, weil verschiedene Spielstile und Wünsche sich gegenseitig ausschließen, und weil mitunter Arschlöcher dabei sind. Ein Repertoire von Verhaltensweisen zur Konfliktlösung muss eingeübt werden.
- Es gibt den Wunsch nach einem eigenen Server, der bezahlt und irgendwo installiert werden muss. Der Wunsch nach Taschengeld muss mit konkreten monatlichen Kosten vereinbar gemacht werden.
- Es gibt den Wunsch, den Client zu modden. Dazu sind besondere Tools auf dem lokalen Rechner notwendig, da weder Client noch Server nativ eine Moddingschnittstelle haben.
- Es gibt den Wunsch, besondere Spielmomente mit anderen zu Teilen. Die Frage nach Youtube und Twitch (konsumierend und erstellend) kommt auf, und es braucht Regeln (was, ab wann, Stimme, Gesicht zeigen, Namen nennen, und andere Verhaltensregeln).
- Es gibt den Wunsch, eigene Mods oder Plugins zu programmieren. Der Wunsch nach Java lernen, einer IDE und Hilfe von den Eltern kommt auf.

Der Reihe nach...

## Streit um Minecraft

Minecraft kann man kooperativ (PvE, wir gegen die Monster) oder kompetetiv (PvP, Spieler gegeneinander) spielen.
Auch bei kooperativem Spiel kann es Probleme geben:
Wir hatten bisher
- Vandalismus (Spieler zerstören die Bauten anderer Spieler auf einem Sandkasten-Bauserver),
- Spieler fühlen sich ausgeschlossen oder zu wenig beachtet ("Niemand hört mir zu oder lässt mich aussprechen"),
- destruktive Verhaltensweisen und emotionale Erpressung ("Wenn Du nicht x für mich machst, spiele ich nicht mehr mit Dir"),
- und inkompatible Spielziele.

Das ist alles kein Beinbruch und nicht unerwartet.
Es macht es aber notwendig, daß man sich mit der ganzen Runde zusammensetzt und miteinander redet.
Auch dazu ist der Discord sehr nützlich.

Minecraft Server können als PvE und PvP Server konfiguriert sein.
Mit Plugins sind auch Welten mit besonderen PvP-Varianten möglich, "Bedwars" ("Capture the Flag", hier ein Bett) und Variationen zum Thema "Among Us" sind sehr populär.
PvP muss also nicht zwingend First-Person-Shooter Spiel sein.

Weder im PvE noch im PvP fließt Blut. Es kommen Schwerter und Bogenwaffen vor, keine Gewehre. Die Grafik ist auch mit Render-Plugin immer blockig-pixelig, und es sind keine Details erkennbar.

Bisher hatten die meisten bei uns erlebten Probleme ihren Kontext eher im PvE-Umfeld als im PvP Umfeld.

## Ein eigener Server

Es gibt irgendwo auf der Minecraft-Site einen vom Client getrennten Server zum Herunterladen.
Dieser Server ist langsam und buggy.
Niemand verwendet ihn, außer als Grundlage für etwas Richtiges.

Stattdessen durchläuft man den Installationsprozeß von [Bukkit oder Spigot](https://getbukkit.org/).
Dies setzt eine Maschine mit ausreichend Kernen und Speicher sowie einem installierten headless OpenJDK voraus.

Bukkit
: ist ein minimal veränderter Vanilla-Server und eher eine Demo für den Reverse Engineering und Patching Prozess.

Spigot
: ist ein auf Performance optimierter und weiter aufgehackter Bukkit, und eher die Version die man installieren will.

PaperMC
: ist ein weiterer Zweig, basierend auf Spigot, und noch klarer auf Performance optimiert. PaperMC unterstützt jedoch anders als Spigot nur die beiden neusten Versionen von Minecraft aktiv. Wer älteres Minecraft verwenden will oder muß wird mit PaperMC nicht glücklich. 

Der Installationsprozeß ist dabei ein wahres Wunderwerk an Installationsautomation:
Er lädt den originalen Minecraft-Server herunter, ein obfuscated JAR.
Dies wird dann dekompiliert und mit einer Symboltabelle deobfuscated.
Dadurch entsteht ein reproduzierbarer lesbarer Sourcetree, der dann gepatcht wird.
Der resultierende Sourcetree wird dann compiliert, zusammengepackt und ein neues Server-JAR entsteht.
Dies ist dann die Grundlage für den eigenen Serverprozeß. 

Der ganze komplizierte Prozess klingt komplett haarsträubend, ist ein aber vollautomatischer Vorgang, der ausgesprochen reibungsfrei abläuft.
Der gepatchte Serverprozeß ist gegenüber dem Originalserver deutlich ärmer an Fehlern, um Größenordnungen schneller und hat eine dokumentierte und stabile API für Server-Erweiterungen (Plugins).

Zum Server gehören auch noch eine `eula.txt`

```console
~minecraft/bukkit $ cat eula.txt
#By changing the setting below to TRUE you are indicating your agreement to our EULA (https://account.mojang.com/documents/minecraft_eula).
#Mon Aug 19 17:04:21 CEST 2019
eula=true
```
 und eine etwa längliche `server.properties`-Datei, die die eigentliche [Konfiguration](https://www.spigotmc.org/wiki/spigot-configuration-server-properties/) des Basis-Servers darstellt.

![](/uploads/2021/12/minecraft4.jpg)
*Dem Serverprozeß wird reichlich Speicher gegeben, aber trotz der großen Anzahl von Plugins liegt die effektive Prozeßgröße bei circa 3 GB (aber es laufen 84 Java-Threads).*

Der Serverprozeß ist ursprünglich recht klein, aber wenn man den Server mit Plugins vollstopft nach oben offen.
Andererseits liegt ein Strato VPS mit 8 Kernen und 32 GB Speicher bei monatlich kündbaren 17 Euro und ist reichlich überprovisioniert für die Aufgabe.
Irgendwo zwischen dieser Größe und einem Raspi 4 findet man sicherlich was Passendes.

Wer den Server nicht selbst installieren will, nimmt sich einen Servermanager -- es gibt viele mit zweifelhaftem Code und bunten Panels, und es gibt [`minectl`](https://github.com/dirien/minectl). Ich nehme einfach ein Shellscript:

```bash
~minecraft/bukkit  $ cat starter.sh
#! /bin/bash --

TIME=30
DIR=/home/minecraft/bukkit
SERVER=$(basename $DIR)

cd $DIR
while :
do
        java -Xmx8192M -Xms3072M -Xss1m -jar $DIR/server.jar nogui
        echo "$SERVER: Java stopped or crashed. Waiting $TIME seconds..."
        sleep $TIME
done
```

## Clients managen

Wie auch der Server ist der Minecraft-Client eigentlich nicht erweiterbar.
Der Minecraft Launcher erlaubt immerhin die Verwaltung mehrerer Versionen, legt einen aber auf ein bestimmtes JDK fest (je nach Version auf ein anderes).

Bastelt man intensiver am Client rum, hat man aber schnell das Problem, bestimmte (andere) JDK-Versionen verwenden zu müssen, den Client mit einer Mod-API modifizieren zu müssen oder unterschiedliche Mod-Konfigurationen für verschiedenen Gruppen und Aufgaben zu haben.
Das Werkzeug der Wahl für die Client-Verwaltung ist [MultiMC](https://multimc.org/#Download).

Es erlaubt es, das Spiel mit einem anderen, moderneren JDK auszuführen und unterschiedliche Spieler-Accounts zu verwalten.
Es automatisiert auch analog zum Server-Build, den Client automatisiert zu dekompilieren und zu patchen, um ihm eine stabile Mod-API zu verpassen.
Populär sind Forge und Fabric, die direkt von MultiMC integriert werden.
Danach kann man den Client dann mit Mods voll laden.

![](/uploads/2021/12/minecraft5.jpg)
*MultiMC mit einer Instanz von Minecraft 1.14.4 und installiertem Fabric. Zu neue Minecraft-Versionen werden von der Mod-Community noch nicht voll unterstützt, zu alte nicht mehr. Die 1.14-Serie hat im Moment gute Kompatibilität.*

Mit den Mods und Plugins sollte man unbedingt mit dem Kind Vereinbarungen treffen.
Je nach Lebenserfahrung und Verständnis von Werten kann das Kind hier leicht ein Opfer von Scam, Abzocke und Phishing werden.
Auf der anderen Seiten kann man mit dem Kind, sobald es fragt oder sich die Gelegenheit bietet, über Merkmale von vertrauenswürdigen und seltsamen Webseiten reden und am Beispiel erklären, was eine Seite komisch aussehen lässt.

Auch wenn man dem Kind zuhört, bieten die Geschichten von anderen und wie es ihnen ergangen ist, viele Haken und Themen, an denen man erklärend ansetzen kann, oder die man zum Anlass nehmen kann, gemeinsam nachzusehen und darüber zu sprechen, wie ehrliche und unehrliche Angebote aussehen.
Einige alternative Clients bieten Anti-Cheat-Möglichkeiten durch Totalüberwachung des Clients an.
Auch hier kann man einhaken, Regeln setzen und erklären, warum zum Beispiel dauernd laufende Hintergrundprozesse, Gerätetreiber, die Tastendrücke überwachen und andere Kontrollmaßnahmen ein No-Go sind.

## "Content" konsumieren und produzieren

Der ganze Teil der Community, der sich mit Plugins und Mods beschäftigt, dokumentiert und bildet aus.
Das geschieht in der Regel nicht nur geschrieben im Wiki, sondern auch mit Tutorials auf Youtube, Twitch und GitHub.
Sobald das Kind hier aktiv wird, wird man wieder Accounts machen müssen (2FA!).
Und ja, das heißt vermutlich auch GitHub.

Wir haben die Vereinbarung, daß wir die Accounts machen, und daß wir allen Content zu sehen bekommen, bevor er veröffentlicht wird.
Es ist okay, Bildschirme zu zeigen und zu sprechen.
Gesichter und reale Namen und Adressen sind tabu: Es werden nur Avatare gezeigt und nur Handles benutzt.

Die Vereinbarung, Plugins und Mods vor der Installation zu sehen zu bekommen hat sich nicht bewährt:
Es ist also damit zu rechnen, daß der Server oder der Client verloren gehen.
Eine Recovery-Strategie, etwa "der Server kann mit Ansible neu gemacht werden" und "es läuft nachts um 3 ein automatisches Backup" für den Server ist erfolgversprechender.
Auch für den Client ("verwende Time Machine", "Hier ist ein Acronis") ist das notwendig.

Wegen [COPPA](https://en.wikipedia.org/wiki/Children%27s_Online_Privacy_Protection_Act) läuft man Gefahr, Accounts bei US-Anbietern zu verlieren, wenn man nicht über das Geburtsjahr lügt -- das Kind muss über 13 Jahre alt sein, um legal einen Account haben zu können.
Anbieter, die Kinder unter 13 nicht komplett ablehnen, schränken die Accounts oft funktional bis zur Nutzlosigkeit ein.
Mit einem regulären Account, ein wenig partnerschaftlicher Aufsicht, und einer Lüge bei der Altersangabe fährt man in der Regel weitaus besser als mit verdummten Accounts.

Falls das Kind selbst Content produziert ist das Risiko den Account zu verlieren oder gesperrt zu bekommen noch höher.
Daher sollte man den privaten Account und den publizierenden Account des Kindes strikt trennen, sodaß bei einer Sperrung nicht die Kontakte, private Mail und alle Kommunikationsmöglichkeiten mit weg sind.
Über Chrome Browser [User Profiles](https://www.techsolutions.support.com/how-to/how-to-create-and-switch-profiles-in-chrome-12564) kann man das schnell und bequem umschalten, und das Kind lernt gleich noch OpSec und sich selbst geschickt zu publizieren.

[It's complicated](https://www.amazon.de/Its-Complicated-Social-Lives-Networked-ebook/dp/B00HUYT8TS), und danah boyd ist immer lesenswert.

## Selber programmieren

Minecraft ist eine Einstiegsdroge für die Programmierung.
Das Potenzial für die Selbstmotivation ist enorm, und der Support in der Community gewaltig.

Für JetBrains IntelliJ existieren ganz ausgezeichnete Plugins für Server-Plugins und Client-Mods: [Minecraft Development](https://plugins.jetbrains.com/plugin/8327-minecraft-development) unterstützt Bukkit, Spigot und PaperMC sowie einen Haufen weiterer populärer Servervarianten.

IntelliJ selbst ist stabil (Eclipse meiner Erfahrung nach nicht) und hat einen sehr überschaubaren Ressourcenverbrauch: ~2 GB maximale Prozeßgröße, realer Verbrauch oszilliert von 512 MB bis 1024 MB.

# Fazit

- Maschine zum Spielen bereitstellen. Ein abgelegtes Mac oder Windows-Notebook tun sicher, die kommende Java-IDE wird die Maschine eher an die Grenzen bringen als das Spiel.
- [Minecraft Java Edition](https://www.minecraft.net/en-us/store/minecraft-java-edition) kaufen.
  - Oder den Gamepass holen -- Minecraft ist seit kurzem in der Java und in der Bedrock Edition Teil vom Gamepass.
  - Den dazu notwendigen Microsoft-Account mit 2FA sichern.
  - Einen Screenshot vom 2FA QR-Code offline (USB-Stick?) archivieren.
- [Discord](https://discord.com/) Account machen.
  - 2FA aktivieren.
  - Den QR-Code sichern. 
  - Discord installieren.
- Java installieren. 
  - Man will OpenJDK, nicht Oracle, und man will vermutlich JDK 11, 16 oder 17 (das hängt später ein wenig von den Mods ab). 
- [MultiMC](https://multimc.org/#Download) installieren.
  - Es kann sein, daß gleich nach dem Download beim ersten Run ein Upgrade angeboten wird. Annehmen.
  - Sicherstellen, daß das gewünschte JDK gefunden wird. Dadurch wird nicht das steinalte Default-Download-JDK verwendet.
  - Minecraft (Microsoft Account eintragen) eintragen.
  - Spiel-Instanz erzeugen.
  - Forge *oder* Fabric installieren.
  - Danach erst die Mods zufügen.
- Server mit externen Spielern nicht daheim betreiben:
  - VPS oder ähnlich besorgen.
  - Installation ansibilisieren.
  - Backup einrichten und Restore testen.
  - Server Buildprozess durchlaufen lassen, resultierendes Binary ansibilisieren.
  - Server in Betrieb nehmen, Zugang kontrollieren.
- Zusammen mit dem Server auch gleich eine virtuelle Discord-Serverinstanz für die Spieler einrichten.
  - Selbst Owner vom Dicord bleiben: Kind so weit entrechten, daß es den Server noch moderieren kann, aber nicht kaputt machen.
  - Das Kind wird vermutlich bald selbst eine 2. Discord-Instanz ohne Eltern einrichten.
