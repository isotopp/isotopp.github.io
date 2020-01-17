---
layout: post
title:  'Mailbox.org, Google, OAuth und Less Secure Applications'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-01-17 18:44:34 +0100
tags:
- lang_de
- google
- security
- authentication
- datenschutz
---
Heise schreibt in
[Mailbox.org: Google sperrt "unsichere" Dritte vom Kalender aus](https://www.heise.de/ix/meldung/Mailbox-org-Google-sperrt-unsichere-Dritte-von-Kalender-aus-4640540.html)
über Anwendungen von Dritten und den Zugriff auf Google Kalender, Google Mail und andere Dienste, die mit GSuite interagieren. Der Artikel wirft leider eine Reihe von Dingen durcheinander, was schade ist, weil er einen wichtigen Punkt machen will.

## OAuth2 vs. LSA

Im Artikel geht es um [OAuth2](https://en.wikipedia.org/wiki/OAuth). OAuth2 ist kein neues Verfahren. Es handelt sich um einen Standard, bei dem ein Dienstleister Drittanwendungen den Zugriff auf Dienste erlaubt, indem er der Drittanwendung relativ automatisch ein Logintoken zuteilt, das

1. zeitlich begrenzt ist
2. die Identifikation der Anwendung und
3. des Anwenders erlaubt und
4. einen Scope (einen Satz eingeschränkte Zugriffsrechte) hat.

Um also auf den Google Kalender oder in Zukunft bald auch IMAP zugreifen zu können, muß eine Drittanwendung ein Token vorzeigen. Das Token, das etwa Busycal auf dem Mac verwendet, ist von dem Token verschieden, mit dem ACal+ auf Android auf meinen Google Kalender zugreift. Theoretisch könnte Busycal auch Vollzugriff auf den Kalender haben, während das ACal+ Token einen Read-Only Scope hat.

Beide sind verschieden von meinem mit 2FA gesicherten Zugang zu meinem Google Account, der nicht nur Kalender und Mail enthält, sondern auch mein Wallet, meine gekauften Inhalte, mein Youtube, meinen Google Cloud Zugang und meine Google Ads. Wird durch eine Sicherheitslücke eines der Token publik, ist das kein Beinbruch (der Schaden ist auf den Scope begrenzt) und leicht zu korrigieren (die Zugriffsrechte sind wiederrufbar).

Google gibt einem eine Security-Übersicht für Deinen Account in [Google Account](https://myaccount.google.com/security). Auf der [Permissions](https://myaccount.google.com/permissions)-Seite kann man sehen, wer Zugriff hat und was die dürfen. Nach Anklicken sieht man auch, wann das war und man kann den Zugriff wiederrufen.

![](/uploads/2020/01/lsa-review-screen.png)

[Permissions](https://myaccount.google.com/permissions) Seite für OAuth2 Anwendungen in [Google Account](https://myaccount.google.com/security).

Das alles ist eine Feine Sache™ und ein großer Fortschritt. In der Vergangenheit hätte man sich bei einem CalDAV oder IMAP Server mit dem Usernamen und Paßwort eingeloggt, und hätte dadurch den gesamten Google Account mit allen Diensten, die da dran hängen, exponiert und gefährdet. In so einem Kontext ist insbesondere der Wiederruf und die Recovery nach einem Security-Problem so gut wie unmöglich.

Das weiß Google auch, und daher gab es bisher für Programme, die OAuth2 nicht beherrschen, eine Sonderlocke: "Application Specific Passwords for Less Secure Applications" (LSA).

![](/uploads/2020/01/lsa-appspecific-passwords.png)

"Application Specific Passwords for Less Secure Applications" (LSA) ist auch in Google Account zu finden und hoffentlich leer.

Mit LSA legt man ein Kennwort für seinen Loginnamen fest, das an eine Anwendung gebunden ist und gescoped ist, also im Zugriff beschränkt. Da Google dieses Paßwort generiert, ist es auch sicher vom Accountpaßwort verschieden.

Man kann sich also mit einem Legacy Client, der auch in 2020 noch kein OAuth2 kann, auf einem GMail IMAP oder CalDAV einloggen und riskiert dennoch nicht seinen ganzen Account. Gut so.

## OAuth2 Playground

Es gibt einen [OAuth2 Playground](https://developers.google.com/oauthplayground/) bei Google. Mit dem und der [Entwicklerdokumentation](https://developers.google.com/identity/protocols/OAuth2) kann man einmal herumspielen. Oder man verwendet deren [oauth2.py](https://github.com/google/gmail-oauth2-tools/wiki/OAuth2DotPyRunThrough). Für jeden Dienst gibt es eine Dokumentation, die die OAuth2 Scopes beschreibt, die existieren.

Hier ist die [Dokumentation für GMail Scopes](https://developers.google.com/gmail/api/auth/scopes). Sie ist wichtig, wir werden weiter unten noch darauf zurück kommen.

Wenn man den OAuth2 Playground einmal durchspielt passiert dies:

![](/uploads/2020/01/lsa-oauth2-playground-1.png)

Schritt 1: Wähle einen OAuth2 Scope aus, hier gmail.readonly. Auf der rechten Seite sieht man die entsprechenden REST Requests und Responses, sodaß ein Entwickler gleich sehen kann, wie so etwas auf dem Kabel aussieht. In der Praxis wird dieser Schritt vom Anwendungsentwickler ausgeführt und man sieht ihn nicht.

Er legt die Identität der Anwendung fest, so wie sie für den Endanwender nachher in Google Account erscheint.

Führt man diesen Schritt durch, gibt es einen typischen Google Autorisierungscreen: Anwendung Google Playground will Read Access auf unseren Gmail Account. Ist das okay so?

Sagt man ja, gibt es einen Alarm via Push Notification und eine Nachricht in Google Mail: Jemand hat neuen Zugriff auf unseren Account bekommen.

![](/uploads/2020/01/lsa-cellphone.png)

Terror auf meinem Handy: "Google OAuth2 Playground" darf jetzt auf mein GMail.

Das ist auch eine Gute Sache™, denn auf diese Weise ist sichergestellt, daß so ein Zugriff nicht leise und aus Versehen erfolgt.

![](/uploads/2020/01/lsa-oauth2-playground-2.png)

Mit dem Authorization Code aus Schritt 1 kann die Anwendung sich jetzt ein Zugriffstoken holen, das eine Stunden gilt. Der Grund ist, daß auf diese Weise die Anwendung auf jeden Fall spätestens eine Stunde nach dem Widerruf von Rechten ausgesperrt ist, auch wenn dieses spezifische Token nicht gesondert widerrufen wird.

![](/uploads/2020/01/lsa-oauth2-playground-3.png)

Und mit diesem Access Token kann die Anwendung dann endlich GMail API Funktionen aus dem Read Only Scope aufrufen, zum Beispiel Identity. Sie kann keine Non-GMail Aktionen ausführen und sie kann auch keine Nachrichten senden, Filter bearbeiten oder ähnliches. Das wäre ein anderer Scope.

## Scopes in GMail

Die Liste der [Gmail Scopes](https://developers.google.com/gmail/api/auth/scopes) in der Entwicklerdokumentation klassifiziert Scopes auf verschiedene Weisen, Recommended, Sensitive und Restricted. Die meisten Scopes sind Restricted.

Die Doku sagt weiter:

> Restricted—These scopes provide wide access to Google User Data and require you to go through a restricted scope verification process. For information on this requirement, see Google API Services: User Data Policy and Additional Requirements for Specific API Scopes. If you store restricted scope data on servers (or transmit), then you need to go through a security assessment.

Wenn man also eine Serveranwendung (Mailbox.org, Exchange, Open Exchange oder ähnliches) schreibt, und diese Restricted Scope Data runterlädt und speichert, dann wird ein Security Assessment notwendig.

## Den Heise Artikel noch einmal lesen

Jetzt lesen wir den [Heise Artikel](https://www.heise.de/ix/meldung/Mailbox-org-Google-sperrt-unsichere-Dritte-von-Kalender-aus-4640540.html) noch einmal.

Da heißt es:

> Google forciert den Einsatz von Oauth für seine Mail-, Kalender- und Drive- Dienste, sperrt dabei aber viele Dienstleister und ältere Software aus. Wer bisher beispielsweise Googles Kalender in einer nicht von Google entwickelten Anwendung oder Webseite ohne Oauth integriert, muss sich demnächst entweder umstellen oder darauf hoffen, dass sich sein Anbieter von Google-Partnern in den USA in einem kostspieligen und wenig transparenten Verfahren zertifizieren lässt.

Was heißt das? Der Artikel erklärt das nicht.

Google hat bereits am 30. Oktober letzten Jahres [LSA für Business Kunden](https://gsuiteupdates.googleblog.com/2019/07/limit-access-LSA.html) sanft eingeschränkt. Alle Accounts mit einer leeren LSA Liste haben "LSA erlauben" auf "Nein" gestellt bekommen, für andere Accounts, die LSA Einträge haben, sind andere Einschränkungen gemacht worden.

Ab Mitte diesen Jahres wird [LSA weiter eingeschränkt](https://gsuiteupdates.googleblog.com/2019/12/less-secure-apps-oauth-google-username-password-incorrect.html).

Das heißt, zum Zugriff auf Google Dienste wird LSA erschwert oder ganz abgeschaltet und OAuth2 verpflichtend. Soweit eine gute Sache.

Aber: Ein Mailserver hat bisher via LSA Vollzugriff auf einen GMail Account und einen Kalender bekommen, ohne sich dem für Restricted Scopes notwendigem Review zu unterziehen.

Dadurch, daß OAuth2 jetzt verpflichtend wird, werden Firmen wie Open Exchange und Mailbox.org also OAuth2 Reviews aufgezwungen, weil das LSA Schlupfloch nicht mehr existiert. Und das ist genau der Punkt, der beklagt wird, nur daß der Artikel das nicht erklärt.

> Mailbox.org-Betreiber Peer Heinlein kritisiert Googles Vorgehen, das ab 15. Januar die Zertifizierung von "Less Secure Apps" vorschreibt. Im Gespräch mit der iX erklärt Heinlein, es sei grundsätzlich nicht verkehrt, wenn unseriöse Anbieter vom Zugriff auf Google-Konten ausgeschlossen werden und Missbrauch minimiert wird.

Das ist irreführtend, weil es primär gar nicht um LSA geht, sondern um OAuth2, und spezifisch um die mit OAuth2 Restricted Scopes verknüpften Audit-Anforderungen. LSA abzuschalten ist eine gute Sache, und LSA zu verwenden, um den Anforderungen für OAuth2 Restricted Scope zu entgehen eine mittelfristig zum Scheitern verurteilte Strategie.

Die Frage, um die es eigentlich gehen muß ist:

Darf Google für den Zugriff auf ihre Plattform einen solchen Audit verlangen oder ist dies eine unzulässige Wettbewerbseinschränkung?

Im Lichte der Entscheidung [Banken vs. Sofortüberweisung](https://www.heise.de/newsticker/meldung/Sofortueberweisung-vs-Banken-Kartellamt-sieht-Wettbewerb-behindert-3255361.html) kann man annehmen, daß es nicht das Problem von Google ist, Anforderungen an die Anwendungen zu stellen, die ein Anwender für seinen Account zuläßt. Insbesondere wenn der Anwender eine Firma ist und der Account Teil eines GSuite Business Accounts ist.

Und das ist die eigentliche Frage, die geklärt werden muß.

OAuth2 ist eine gute Sache. Auch Mailbox.org und OX wissen das und haben das korrekt implementiert, sind dabei aber in die OAuth2 Restricted Scope Requirements für Serverbetreiber gelaufen.