---
author: isotopp
date: "2025-03-06T04:05:06Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
  - lang_de
  - energy
  - erklaerbaer
title: "Discords Börsengang"
---

Heise berichtet:
[Discord strebt offenbar Börsengang noch 2025 an](https://www.heise.de/news/Bericht-Discord-strebt-offenbar-Boersengang-noch-2025-an-10306706.html)
>  Die Verantwortlichen hinter der Chatplattform erwägen laut einem Medienbericht, 
> ihr Unternehmen an die Börse zu bringen und führen erste Gespräche. 

Aus meinem Mastodon-Thread:

Das ist schade, Discord war eine gute Chatplatform.
Mit dem Börsengang wird es natürlich zwingend, das Unternehmen auf Kosten der User-Experience auf Profit zu trimmen.
Erfahrungsgemäß wird eine Plattform damit binnen drei Jahren unbrauchbar.
Wir haben also Stand heute noch in etwa vier Jahre an Discord gut, bevor wir eine Alternative brauchen.

Eine Menge Leute lästern über Discord, aber das ist meist entweder Mangel an Erfahrung oder sinnfreier OSS-Fundamentalismus.

Discord ist von allen Lösungen für synchrone Kommunikation, die ich regelmäßig nutze, die einzig richtig Gute.

Sie ist praktisch im Handumdrehen einzurichten, hat sinnvolle Defaults, 
und kann Communities mit 3 Benutzern genau so abbilden wie solche mit 30k Users.

Sie kann Umgebungen für Streaming und Audiochat genau so realisieren wie solche, 
die lang laufende Text-Unterhaltungen realisieren – 
und zwar lineare wie auch solche, die stark strukturiert in Threads oder FAQ/Support-Cases aufgebaut sind.

Discord beherrscht Markdown-Text mit Syntax-Highlighting 
kann Bilder und Emojis einbetten,
und der Chat kann auch als Filesharing/Dateitransport-Dienst verwendet werden.

Der Dienst ist auch nicht föderiert, und der Client einigermaßen kontrolliert.
Das heisst, man hat 95 % des Spam-Problems nicht, das zum Beispiel Google Hangouts vor 10 Jahren
durch Förderation mit XMPP Instanzen hatte, die speziell zum Versenden von Spam gebaut wurden.
Google konnte das Probem  am Ende nur durch die Abriegelung von Hangouts lösen.
Außerdem gibt so genau eine offizielle Timeline, und es gibt keinen Lag durch Nachrichten-Ausbreitung zwischen Servern.

Und während es nicht-offizielle Discord Clients oder Patches für die originale Electron-App gibt,
sind die alle inoffiziell, können also den Dienstleister nicht daran hindern,
den Featureset zentral weiterzuentwickeln.
Bei Systemen ohne bindebd offiziellen Client gibt es oft Gejammer von Menschen,
deren Client das neue Feature noch nicht kann, oder nie können wird,
und die deswegen unbedingt wollen, dass wir alle das Feature dann nicht haben.

Und das alles hosted, für einen Spottpreis (nämlich erst mal frei, oder halt für 120 Euro/Jahr, wenn man Nitro kauft).

Es wird schade sein, das alles an ungebremste Monetarisierung zu verlieren.

---

Ich halte die Abwesenheit von Föderation und E2E-Encryption für einen Vorteil.

Beides sind Features, die den Server und den Client notlos kompliziert machen,
und die für eine schlechte und verwirrende UX sorgen.
Die meisten Leute wollen halt nicht den antifaschistischen Widerstand abhörsicher in ihrem Chat organisieren,
oder ein Frauenhaus und eine Abtreibungsberatung organisieren, 
sondern einen öffentlichen Guild-Server für ihre Gilde haben oder über ihre 3D-Drucker chatten.
Und das tut um mindestens drei Größenordnungen weniger weh, 
wenn man sich Föderation und E2EE schenkt, 
um sich auf Client-Features zu konzentrieren–und weil der DIenst dann einfach und immer tut.

Mit Föderation hat man, wie oben schon angedeutet,

- unterschiedliche Server-Versionsstände und entsprechend nicht einheitlich funktionierende Features.
- Propagation-Delay, und damit einen Chat, der nicht mehr kontrollierbare Lags hat.
  Es entsteht eoine nicht-einheitliche Sicht auf die Timeline.
  Da kann man gegenan arbeiten, indem man pro Channel deförderiert 
  (es gibt einen führenden Server pro Channel, und alle Clients müssen da hinschreiben, 
  und da gibt es die authoritative Timeline für den Channel).
- dedizierte Serverimplementierungen, deren einziger Zweck es ist, nicht existende Client-Profile im Server zu simulieren 
  und Marketing-Nachrichten in echte Server mit echten Usern einzuspielen (also Spam).

Und sobald man E2EE macht, hat man

- pro Client verschlüsselte Nachrichten mit bekanntem Inhalt (also ein known Plaintext Problem).
- ein Key-Distribution-Problem außerordentlichen Ausmaßes, das man absolut nicht braucht.
- das man durch Föderation und Lag noch verschärfen kann.
- ein unlesbares Backlog für neu hereinkommende Clients.
- ein Problem bei Identitäten ("Isotopp") mit mehreren Clients (Desktop, Mobile, Tablet),
  das Du in der Key Distribution Infrastruktur abbilden musst,
  einschließlich Gerätewechsel ("neues Handy") und Backlog-Synchronisation.
- desynchroniserte Clients, die technisch Mitglied im Kanal sind, aber nicht teilnehmen können ("Keysplit")
- keine zentrale, indizierte Suche und kein Archiv.

und das alles notlos, weil für mehr als 99 % aller Anwendungsfälle E2EE ein Antifeature ist.
Der Dienst würde profitieren, wenn er das Feature nicht hätte, 
da die Inhalte im virtuellen Server im Grunde öffentlich sind (jedenfalls nicht geheim),
und man nun arbeiten muß, um die oben angedeuteten Eigenschaften bereit zu stellen.

Ein Dienst, den man sich anschauen sollte, ist das [hier reviewte Revolt](https://itsfoss.com/revolt/).
Dem fehlen noch eine Reihe von Features für Parity, aber es scheint ein sehr guter Ansatz zu sein.
