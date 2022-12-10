---
author: isotopp
title: "2FA für Mastodon"
date: 2022-12-10 06:07:08Z
feature-img: assets/img/background/schloss.jpg
tags:
- lang_de
- security
---

Multi-Factor Authentication (Identifikation mit mehreren Faktoren) oder 2FA (Two-Factor-Authentication) sind ein Weg, einen Account vor der Übernahme durch Dritte zu schützen.

Statt sich mit Usernamen und Passwort anzumelden ist zusätzlich noch eine wechselnde Pseudozufallszahl notwendig.
Diese wird von einem Seed-Wert generiert, der durch eine Buchstabenfolge oder einen QR-Code repräsentiert.

# Authenticator Anwendung installieren

Das Verfahren ist [standardisiert](https://www.rfc-editor.org/rfc/rfc6238) und wird von vielen Tools unterstützt.
Dazu gehören Google Authenticator, Bitwarden und viele andere Paßwortmanager.

Um mit MFA zu arbeiten, sollte man entweder einen Paßwortmanager installiert haben, der auch MFA verwalten kann, oder sich eine 2FA Anwendung installieren.
Populäre Paßwortmanager sind etwa Bitwarden, 1Password oder LastPass.
Populäre 2FA-Anwendungen sind Google Authenticator, der Authenticator von Microsoft, Twilio Authy oder Aegis.

Auch auf der Kommandozeile kann man 2FA Codes generieren, aber das ist eher für 
[komische Spielereien]({{< ref "/content/posts/2017-07-27-zero-factor-authentication.md" >}})
wichtig.
Auf jeden Fall implementiert auch `oath-toolkit` die üblichen Verfahren zur Generierung dieser Codes. 

# 2FA aktivieren in Mastodon

Um MFA zu aktivieren, klicke auf "Edit Profile" im Mastodon Webinterface, und wähle Account Settings -> Two Factor Auth.

![](/uploads/2022/12/2fa-01.png)
*Auf Edit Profile klicken, um in die Benutzerkonfiguration zu kommen.*

![](/uploads/2022/12/2fa-02.png)
*Im Menü in der Seitenleiste erst auf "Account Settings", und dann auf "Two-factor Auth" klicken.*

![](/uploads/2022/12/2fa-03.png)
*Es erscheint das 2FA Setup. Man kann gefahrlos durch den ganzen Prozess laufen, ohne die Konfiguration zu verändern. 
Erst, wenn man den ersten Sechs-Zahlen-Code erfolgreich eingegeben hat, wird 2FA für dieses Login aktiviert.*

Es kommt dieser Screen, eventuell nach nochmaliger Aufforderung, das Passwort einzugeben.

![](/uploads/2022/12/2fa-04.png)
*Der gezeigte QR-Code kann mit einer Authenticator-Anwendung gescannt werden.
Er enthält nichts anderes als die daneben angezeigte Seed-Folge.
Diese wiederum kann man auch direkt in Anwendungen wie Bitwarden kopieren.*

Klickt man auf Set Up, bekommt man einen QR-Code zum Scannen in der Google Authenticator App, oder den Seed-String als Text (etwa für Bitwarden).

Man sollte auf jeden Fall einen Screenshot vom QR-Code oder eine Kopie von Seed machen, und dies an einem sicheren Ort archivieren.
Ich habe einen USB-Stick für solche Dinge.
Damit kann man bei Verlust von Telefon oder Rechner dennoch an seine Accounts kommen, denn man kann den QR-Code so oft scannen wie man will, und auf so vielen Geräten scannen wie man will.
In der Regel ist es bei Problemen einfacher, die archivierten QR-Codes neu zu scannen, als durch den Account Recovery Workflow eines mit 2FA geschützten Accounts zu laufen.
Das ist dann auch einheitlich, Account Recovery ist je nach Anbieter unterschiedlich.

![](/uploads/2022/12/2fa-05.png)
*Der Seed-Code wird in diesem Beispiel in Bitwarden eingetragen.
Bitwarden wird mit dem Code und der aktuellen Zeit in die Lage versetzt, den jeweils geltenden Code zu erzeugen und anzuzeigen.*

Verwendet man eine Authenticator-App (oder hat einfach ein aktuelles iPhone), kann man auch einfach den QR-Code mit der App (oder der normalen iPhone Scanfunktion) scannen und ein Eintrag wird erzeugt.
Entweder in der Authenticator-App, wenn man diese verwendet, oder im Paßwortspeicher des iPhone, wenn man direkt mit dem Telefon scannt.

# Den generierten Code ausprobieren

Nachdem man den QR-Code mit einem Authenticator gescannt hat, oder man den Seed-String in den Paßwortmanager kopiert hat, wird einem dort eine Zahl angezeigt.
Sie hat 6 Stellen und wechselt alle 30 Sekunden.
Sie ist aber oft ein wenig länger gültig: Viele Implementierungen nehmen die vorhergehende und die nachfolgende Zahl auch noch an.

![](/uploads/2022/12/2fa-06.png)
*Nach dem Abspeichern des Seeds in Bitwarden wird eine laufend wechselnde Zahl angezeigt.
Diese kann man in das Testfeld "Two-factor code" übertragen und beweist so, daß das Setup korrekt ist.
Erst nach dem Klicken auf den großen "Enable"-Knopf wird 2FA aktiviert. Hier kann man also noch abbrechen.* 

Die Zahl basiert auf einem Pseudo-Zufallszahlengenerator:
Basierend auf dem Startwert (dem Seed-Wert von da oben) und der aktuellen Zeit wird ein Code generiert.
Der Code ist immer derselbe, vorausgesetzt man kennt den Seed und hat eine genau gehende Uhr.
Sowohl der Mastodon-Server als auch die Authenticator-Anwendung kennen diese Daten und generieren den Code, und zwar bei übereinstimmenden Werten denselben Code.

Zur Aktivierung muss man den aktuellen Zahlencode in das Feld unter dem QR-Code eintragen.
Dies beweist, daß man eine Authenticator-App hat und sie korrekt konfiguiert ist.
Erst dann wird 2FA wirklich aktiviert.

Dies ist der "Point of no Return" (stimmt nicht: Man kann 2FA auch wieder deaktivieren).

# Account Recovery Codes

Mastdon generiert dann noch einen Satz Account Recovery Codes.
Wenn man den QR-Code archiviert hat, braucht man die nie.
Stattdessen wäre es viel einfacher, den archivierten QR-Code neu einzuscannen.

Es kann aber nicht schaden, diese zu kopieren und auch zu archivieren.
Etwa in Bitwarden und auf dem o.a. USB-Stick mit dem QR-Code.
Oder auf einem Papierfetzen, den man unter die Schreibtisch-Schublade klebt.

![](/uploads/2022/12/2fa-07.png)
*Diese Recovery-Codes werden niemals gebraucht, wenn man stattdessen den Seed-Text oder den QR-Code archiviert.
Mit dem kann man sich jederzeit ein neues Authenticator-Gerät aufsetzen, indem man den Code neu scannt.
Dennoch kann es nützlich sein, auch die Recovery-Codes zu archivieren.*

# Wieso 2FA, wenn ich doch einzigartige Passworte verwende?

"Aber Kris, ich verwende doch sowieso auf jedem Account einzigartige Passworte.
Warum sollte ich mich mit 2FA rumnerven?"

Hier eine Geschichte aus dem echten Leben:
[Discord Nitro Spam and 2FA]({{< ref "/content/posts/2021-11-30-discord-nitro-spam-and-2fa.md" >}})

2FA erlaubt es in vielen Fällen, einen Account zu retten, auch wenn er ganz oder in Teilen durch einen Unfall übernommen wird.
2FA, OAuth2 und "scoped Tokens" retten Euren Arsch auch dann, wenn ihr schon gehackt oder gecybert worden seid.
Sie machen solche Unfälle oft reversibel.

# Cloud oder nicht cloud?

Es gibt 2FA Speicher, die 2FA Codes in der Cloud sichern und an die eigene Telefonnummer binden.

Google Authenticator und Aegis gehören nicht dazu, die Daten werden ausdrücklich lokal gespeichert und die Anwendung beansprucht keine Rechte, und funktioniert offline.
Code-Transfer erfolgt mit QR-Codes.

![](/uploads/2022/12/2fa-08.png)
*Twilio Authy fragt bei der Einrichtung nach einer Telefonnummer, sendet dieser dann eine Kennung zu und verbindet den Paßwortspeicher mit der Telefonnummer.
Auch bei Wechsel zwischen Android und iPhone (oder hier MacOS) beiben die 2FA Secrets erhalten.*

Twilio Authenticator und Microsoft Authenticator sichern Codes in der Cloud.

Bei Apples Systemspeicher für Passworte hängt es davon ab, ob man Passworte in der iCloud synchronisiert oder nicht.

# 2FA nicht nur für Mastodon

Viele Paßwortmanager haben die Option, Reports und Account-Audits zu generieren.
Oft wird eine Funktion angeboten, die alle möglichen, aber nicht genutzten 2FA-Möglichkeiten listet.
Diese Liste kann man durchgehen und systematisch für alle Accounts 2FA aktivieren.

![](/uploads/2022/12/2fa-09.png)
*Vaultwarden Webanwendung, Passwort-Reports.
Hier kann man auf "Inactive Two-stop Login" klicken und eine Liste von Logins bekommen, die man hat und die 2FA haben könnten, aber bei denen in Vaultwarden kein 2FA hinterlegt ist.
Die meisten Passwortmanager haben inzwischen solche Reports.*

# Zusammenfassung

Mit Zwei-Faktor-Authentisierung kann man ein Login zusätzlich absichern.
Dazu wird beim Login neben dem Passwort auch noch ein wechselnder Code abgefragt, der entweder von einer Authenticator Anwendung oder einem Passwortmanager generiert wird.

Das ist nützlich, weil so ein verloren gegangenes oder abgefischtes Passwort kein Weltuntergang mehr sind.
Im verlinkten Beispielartikel ist so etwa ein kompromittierter Discord-Account wieder gerettet worden.

Es ist gute Praxis, 2FA auf allen Logins zu aktivieren, bei denen dies angeboten wird.
Dies sichert das Login zusätzlich ab, und verhindert Weltuntergang bei Passwortlecks und Phishing.
