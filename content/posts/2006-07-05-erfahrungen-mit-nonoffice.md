---
author: isotopp
date: "2006-07-05T14:35:20Z"
feature-img: assets/img/background/rijksmuseum.jpg
tags:
- mysql
- remote first
- work
- lang_de
title: Erfahrungen mit Nonoffice
---

Seit dem 1. November 2005 arbeite ich für MySQL Deutschland GmbH als Consultant. Damit mit bin ich Teil einer Firma mit 320 Mitarbeitern in 27 Ländern. 
[Ein Office habe ich noch nie gesehen](http://www.c0t0d0s0.org/archives/1738-Erfahrungen-mit-Homeoffice.html).
Einige der Kollegen, mit denen ich am engsten zusammenarbeite habe ich auch noch nie gesehen.
Die anderen sehe ich so alle paar Monate mal.
Die Zusammenarbeit ist gut und sehr intensiv.

Als ich von web.de zu MySQL gewechselt bin, war ich am Anfang sehr skeptisch und habe meine Interviewpartner gefragt, wie das denn wohl so ist, für eine "virtuelle" Firma zu arbeiten, in der die Kollegen so weit verstreut gesät sind. 
Auch in den Fällen, in denen ich neue Kollegen interviewed habe ist dies die Frage, die mir in der Regel zuerst gestellt wird.

Meine Antwort auf diese Frage ist inzwischen "Hast Du einmal in irgendeinem Open-Source-Projekt mitgearbeitet und Dich mit den Leuten dort abstimmen müssen?" 
Wenn die Antwort "ja" lautet (und damit man von MySQL interviewed wird, muss sie in der Regel "ja" lauten), kann ich antworten "Es ist genau wie da, nur daß Du Geld dafür bekommst."

In der Praxis sieht das so aus, daß MySQL über einen von mehreren Wegen einen Lead hereinbekommt, der vom Sales-Team entweder telefonisch oder vor Ort in einen Auftrag umgewandelt wird.
Sales geht dabei mit dem Presales-Support und einigen Fragebögen daher und produziert so ein Informationspaket, bei dem die Schedulerin und Consulting meist eine relativ gute Idee haben, was das Projekt ist und welche Fähigkeiten dabei gefordert sind. 
Zusammen finden wir die passenden Personen zur Abwicklung des Projektes und machen mit dem Kunden und dem Consultant einen Terminplan.
Der Consultant reist dann an, macht sein Ding und reist einen glücklichen Kunden hinterlassend wieder ab.

So die Theorie, und im Regelfall auch die Praxis.

MySQL als Firma besteht aus einer an mehreren Stellen konzentrierten Infrastruktur, die Sales, Presales, Scheduling, Consulting, Training, aber auch Support, Development, Maintenance und den die betriebswirtschaftlichen Dinge abwickelnden Geschäftsstellen Dienste anbietet.
Diese Dienste sind, wo immer es geht, web-basierend und so gestaltet, daß sie so Browser-unabhängig sind wie irgend möglich. 
Zu diesen Diensten gehören verschiedene Firmen-Wikis, einige Eventum-Taskmanager-Instanzen, der Teamkalender für Training und Consulting und viele andere Dinge. 
Auch Nicht-Webdienste, etwa Bitkeeper, Continous Build Services, ein Firmen-IRC-Server, Mail- und Newsdienste und eine verteilte Asterisk-Installation gehören dazu.

Am Ende ist dies keine Sache, die so verschieden wäre von etwa dem Setup, das KDE intern verwendet, plus die Sales- und BWL-Seite dazu.

Für mich als Consultant bedeutet dies, daß ich Zugriff auf meine Kollegen bei Consulting, Training und im Support habe, in dem ich Skype, Mail und IRC verwende.
Bei einer Firma, die so verteilt ist wie MySQL, ist zu jeder Tages- und Nachtzeit jemand zu sprechen, der mir helfen kann.
Wir kommunizieren dabei nicht nur dienstlich, sondern ich habe so wie beim normalen ircen auch einige gute Freunde gewonnen, von denen ich einen Teil noch nicht persönlich getroffen habe.
Die Zusammenarbeit ist noch intensiver beim Support-Team:
Arbeiten heißt für die ircen, und Tom Basil hat auf seine unvergleichliche Weise aus dem Team eine Art Familie gemacht, sodass "seine" Supporter (und einige Adoptivkinder aus anderen Abteilungen) quasi im Netz leben.

Meine Arbeit organisiere ich weitgehend selbst: 
Ich entscheide, wann ich arbeite, wie ich arbeite und was ich wie priorisiere.
MySQL folgt sehr strikt einem management-by-objectives Ansatz, sodass es letztendlich vollkommen egal ist, wie ich die Ziele erreiche, die ich mir mit meinem Team gesetzt habe. 

Wenn ich einen Home-Office-Tag habe, haue ich meistens morgens meine Mail weg.
Konkret bleibe ich auf dem Stand, was auf den Firmenmailinglisten so passiert, verfolge einige interessante Dinge im Bitkeeper und im Worklog, um bei der Weiterentwicklung des Servercodes auf Stand zu bleiben und beantworte die Mails, die Kunden reingeschickt haben, weil sie noch Fragen haben oder einfach nur so in Kontakt bleiben wollen.

Nach dem Mittag ist Papierkram angesagt: 
Expenses, Engagement Summaries, Knowledge Base Entries oder Whitepapers und die dazu notwendigen Experimente, oder den folgenden Einsatz vorbereiten. 
Dazu gehören auch die anstehenden Kundenanrufe, die ich inzwischen routinemäßig alle über SkypeOut abwickle.
Oder ich nehme mir den Nachmittag frei und erledige die Dinge am Abend, bei denen ich mich nicht mit Kunden synchronisieren muss.

Es kann auch sein, dass ich einen Remote Gig habe.
Dies ist in der Regel ein Einsatz bei einem Kunden in einer anderen Zeitzone, bei dem sich die Anreise wegen der Einsatzdauer nicht lohnt, oder wegen der Dringlichkeit nicht möglich ist.
In diesem Fall verschiebt sich mein Lebenszyklus ein wenig in Richtung der anderen Zeitzone, was mir natürlich ein wenig Freizeit zu ungewöhnlichen Zeiten beschert. 

Meistens hat der Kunde einen Sprung-Host in seiner DMZ, auf den ich per `ssh` draufklettern kann, und auf dem ich ihn dann bitte einen `screen` zu starten.
Nachdem ich mich mit `screen -x` an seine Session angeklemmt habe, bitte ich ihn, mich huckepack mit nach drinnen in sein Netz zu nehmen.
Über seinen Firmen-IRC-Server, über Skype oder über SkypeOut können wir nun reden, während wir uns eine Shell-Session im `screen` teilen und er sehen kann, was ich tippe.
Dies ist für die Teile der Arbeit, die synchron erledigt werden müssen, in den meisten Fällen genauso effektiv als wäre ich vor Ort.
Asynchrones Arbeiten geht im Grunde genau so, nur daß ich idR einen `ssh`-Login bekomme, mit dem ich zu meinen Zeiten alleine arbeiten kann.

Für die Dinge, die ich dabei auf eigenen Systemen ausprobieren muss, damit sie beim Kunden reibungslos klappen kann ich entweder auf meinem Laptop mit vmware Instanzen simulieren oder auf Rechnern in den firmeneigenen Labors in Cupertino oder Uppsala Rechenzeit reservieren.
Auch auf diese Rechner komme ich problemlos mit `ssh` oder `rdesktop` über das Firmen-VPN drauf.

Bei einem regulären Kundeneinsatz bin ich nicht alleine.
Ich bin vielleicht der einzige MySQL-Mitarbeiter vor Ort, aber hinter mir steht über GSM, openvpn, https-VPN oder ssh-Tunnel der Zugriff auf Support und meine Kollegen von Training und Consulting, die gerade nicht beim Kunden sind.

Auch die Katze arbeitet inzwischen bei MySQL - in ihrem Fall als Entwicklerin.
Ihre Arbeit ist damit noch näher am KDE-Modell als meine:
Bitkeeper, UnitTest-Harnesses und Continuos Build-Prozeduren auf einer ganzen Reihe von Plattformen der Buildfarm sind ihre Freunde.
Scrum im Irc und im Wiki sind ebenso Standard-Prozesse für Entwickler wie der Umgang mit einem Bugtracker.
Und wie in jedem regulären Irc in anderen Open-Source-Projekten entwickeln sich auch dort Freundschaften und persönliche Kontakte.

Entwickler fahren alle mindestens einmal im Jahr zur firmeninternen Developer Conference, die dieses Jahr in Sorrento in Italien stattfand.
Dort finden sich auch Abgesandte aller anderen Abteilungen, sodass dies eine ausgezeichnete Methode ist, um bisher virtuelle Freundschaften einmal mit Personen und Gesichtern zu verbinden. 
Weitere Gelegenheiten dieser Art sind die US-amerikanische und die europäische User Conference, MySQL Usergroup-Treffen, bei denen man neben Anwendern auch Kollegen aus demselben geografischen Gebiet treffen kann, und natürlich Abteilungsmeetings.
Wir in Consulting streben drei solcher Treffen im Jahr an, und für die anderen Abteilungen geschieht dies nach Bedarf...

Alles in allem kann ich nach 9 Monaten MySQL sagen, daß dies die fremdartigste Firma ist, in der ich je gearbeitet habe.
Keine "casual communication", keinen Flurfunk zu haben, ist manchmal etwas anstrengend und kostet sicherlich mehr Energie als in einer traditionellen Firma. 

Andererseits habe ich mich sofort zu Hause gefühlt: 
Während MySQL als Firma fremdartig ist, sind mir die Methoden der Zusammenarbeit vertraut, denn ich habe sie außerhalb der Firma in den Projekten, an denen ich mitgearbeitet habe, jahrelang gelebt. 

Neu ist im Grunde nur, daß das, was vorher mein Hobby war, jetzt mein Leben ist. 
Ein anstrengendes, spannendes und überaus aufregendes Leben.

Also liebe Kollegen, bekannter und unbekannterweise:
Wie ist es für Euch gewesen, als ihr hier angefangen habt?
