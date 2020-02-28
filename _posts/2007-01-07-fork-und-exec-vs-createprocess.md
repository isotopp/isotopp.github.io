---
layout: post
published: true
title: fork und exec vs. CreateProcess
author-id: isotopp
date: 2007-01-07 09:06:13 UTC
tags:
- c
- linux
- schulung
- unix
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
**Disclaimer:** Meine Windows-Kenntnisse sind beschränkt, veraltet und ausschließlich theoretischer Natur. Im Zweifel erzählt dieser Artikel Unsinn nach Hörensagen.

Nach dem Artikel [form, exec, wait und exit]({% link _posts/2007-01-07-fork-exec-wait-und-exit.md %}) habe ich mir aber einmal meine Kopie von Jeffrey Richters [Windows - Programmierung für Experten (Advanced Windows)](http://www.amazon.de/Microsoft-Windows-Programmierung-fuer-Experten/dp/3860633899/) (1997) gegriffen und dort nachgeschlagen, wie man sich das mit den Prozessen und Programmen unter Windows vorstellt (oder jedenfalls vor 10 Jahren vorgestellt hat).

Windows hat zu diesem Zweck die Systemfunktion [CreateProcess](http://msdn.microsoft.com/library/default.asp?url=/library/en-us/dllproc/base/createprocess.asp)(10 Parameters). Die liest sich so:

> BOOL WINAPI CreateProcess(  LPCTSTR lpApplicationName,  LPTSTR lpCommandLine,  LPSECURITY_ATTRIBUTES lpProcessAttributes,  LPSECURITY_ATTRIBUTES lpThreadAttributes,  BOOL bInheritHandles,  DWORD dwCreationFlags,  LPVOID lpEnvironment,  LPCTSTR lpCurrentDirectory,  LPSTARTUPINFO lpStartupInfo,  LPPROCESS_INFORMATION lpProcessInformation);

Die Funktion erzeugt einen neuen Prozeß und lädt in diesen ein neues Programm. Dieses wird dann gestartet. lpApplicationName ist der Pfadname des auszuführenden Programmes. 

lpCommandLine ist die Kommandozeile (der argv) des neuen Programmes. Sie wird als String und nicht als Vektor von Strings übergeben. Das Parsen der Kommandozeile in Wort wird also durch das Betriebssystem übernommen und kann nicht durch den Aufrufer kontrolliert werden. In Unix muß man bei execve() einen Vektor von Strings übergeben, das Zerlegen der Kommandozeile in Worte muß also durch den Aufrufer, z.B. die Shell übernommen werden. Die anderen Funktionen der exec-Familie sind Bibliotheksfunktionen, die einem hier einen Teil der Arbeit abnehmen.

lpApplicationName und lpCommandLine interagieren: lpApplicationName darf NULL sein, dann wird das erste Wort von lpCommandLine nach der Zerlegung in Worte als lpApplicationName interpretiert. lpApplicationName darf ohne Endung angegeben werden, dann rät Windows die Extension bzw. probiert eine Liste von ausführbaren System-Extensions aus.

lpApplicationName darf auch ein unqualifizierter Pfadname sein. In diesem Fall wird das Absuchen eines System-Suchpfades wird durch diese Funktion von Windows übernommen. In Unix führt execve() genau das Binary aus, dessen Pfadnamen man angegeben hat. Will man einen Suchpfad absuchen, muß man execve() in einer Schleife so lange ausführen, bis es nicht mehr zurück kommt.

lpProcessAttributes ist kein einzelner Parameter, sondern ein Zeiger auf eine [SECURITY_ATTRIBUTES](http://msdn2.microsoft.com/en-us/library/aa379560.aspx)-Struktur, die man ausfüllen kann und die viele Parameter enthalten kann. Die Struktur enthält eine ACL für die Discretionary Access Control, bestimmt also im wesentlichen, wer diesen Prozeß anfassen und was mit ihm machen darf. In Unix gibt es kein vergleichbares Konzept für Prozesse: Ein Prozeß hat entweder die entsprechende Capability (etwa CAP_KILL oder CAP_SYS_PTRACE) oder nicht. 

lpThreadAttributes erzeugt ist der passende Parameter für den in dem Prozeß zwingend enthaltenen Thread. bInheritHandles definiert, ob vererbbare Handles auf Objekte von dem neu erzeugten Prozeß geerbt werden.

dwCreationFlags legt die Priorität des Prozesses und [weitere Flags](http://msdn2.microsoft.com/en-us/library/ms684863.aspx) für den neuen Prozeß fest. In Unix würde man all dies zwischen dem fork() und dem exec() mit einzelnen Calls machen, etwa mit Calls aus der setpriority()-Familie oder mit Aufrufen nach setpgrp().

lpEnvironment entspricht konzeptuell, aber nicht im Format dem envp von execve.

lpCurrentDirectory ist das aktuelle Verzeichnis des neuen Prozesses. In Unix würde man den identischen Effekt erreichen, indem man zwischen dem fork() und dem exec()-Systemaufruf ein chdir() (oder chroot()) aufruft.

lpStartupInfo ist ein Zeiger auf eine eine Struktur [STARTUPINFO](http://msdn2.microsoft.com/en-us/library/ms686331.aspx), die keine Entsprechung in Unix hat, weil hier Dinge angegeben werden, die mit den Fenstern einer Anwendung zu tun haben. Unix handhabt diese Dinge komplett vom Betriebssystemkern getrennt und daher finden wir in den Betriebssystem-Primitiven zu Prozessen keine Fensterinformationen. Genaugenommen ist lpStartupInfo entweder ein Zeiger auf eine STARTUPINFO oder STARTUPINFOEX-Struktur. Was es genau ist wird mit einem Flag in dwCreationFlags angegeben. Das ist nicht typsicher, und das ist bemerkenswert, weil Windows an anderer Stelle sehr viel Wert auf solche Dinge legt.

Der letzte Parameter von CreateProcess, lpProcessInformation, ist ein Referenzparameter auf eine [PROCESS_INFORMATION](http://msdn2.microsoft.com/en-us/library/ms684873.aspx)-Struktur, die von Windows überschrieben und ausgefüllt wird. Wir finden dort die Handles zu unserem Prozeß und dem darin enthaltenen Thread sowie eine ProcessId und eine ThreadId.

Will man das Äquivalent zu einem setuid()-Eignerwechsel in Unix in Windows durchführen, kommt dieses Konzept an seine Grenzen - so etwas ist trotz der Vielzahl der Parameter von CreateProcess() in Windows nicht vorgesehen. Man braucht eine neue Funktion, [CreateProcessAsUser](http://msdn2.microsoft.com/en-us/library/ms682429.aspx)(11 Parameter).

## Analyse

Hier wird der grundlegende Unterschied zwischen den Konzepten von Windows und Unix deutlich: Die Unix-API stammt von Mitte der 70er Jahre und hat sich in den vergangenen mehr als 30 Jahren nicht wesentlich verändert. 

Sie genügt heutigen Ansprüchen, weil sie alle Ansprüche nicht erfüllt - sie liefert stattdessen relativ atomare primitive Funktionen und trennt sogar auf den ersten, flüchtigen Blick zusammengehörende Dinge wie Erzeugen von Prozessen und Laden von Programmen. Dadurch muß ein Programmierer einer Anwendung entweder eine Bibliotheksfunktion verwenden, die fork() und exec() in etwas bequemeres einpackt (etwa system() oder popen()) oder all die Dinge selber machen, die Windows im Kernel für den Programmierer erledigt. fork() hat keine Parameter und execve() hat deren drei. 

Will man mehr, hat man die Gelegenheit, das Environment des neuen Prozesses nach dem fork() vor dem Start des neuen Programmes mit execve() von innen zu verändern.

Windows dagegen erzeugt eine alles-in-einem Funktion, die für den häufigen Anwendungsfall und alle denkbaren Varianten Extraparameter hat. Windows hat dabei die Sicht von außen auf den Kindprozeß. Dies führt zu nützlichen Dingen wie einer Thread- und Prozeß DACL, ist aber konzeptuell nicht gut erweiterbar. Dinge wie ein setuid()-Aufruf zwischen fork() und exec() sind mit CreateProcess() nicht abbildbar und machen weitere Funktionen erforderlich, die noch mehr Parameter haben.

Das Konzept von Unix ist auf den ersten Blick umständlich und wenig intuitiv. Es genügt von der Aufteilung her jedoch den Ansprüchen, die man als Datenbanker an eine Normalform hätte und ist daher flexibel und ohne Änderungen am Kern erweiterbar - unabhängige Konzepte sind als unabhängige Funktionen implementiert und Erweiterung erfolgt durch Einschieben weiterer Aufrufe zwischen fork() und exec(). Neben dem Vorteil der Erweiterbarkeit hat dies den Nachteil, daß mehr Systemaufrufe notwendig sind als bei Windows (Unix-Systemaufrufe müssen schnell sein, damit dieses Konzept aufgeht) und daß man unter Umständen ein Problem mit der Atomizität bekommen kann. 

Beispiel ist hier die Aufgabe: "Starte aus einem Debugger einen Programm in einem Kindprozeß und zwar so, daß der Kindprozeß ohne Racecondition auf der ersten Anweisung des Kindes stoppt und debugbar ist.". Das Problem war lange Zeit nicht lösbar, und wurde von Linux durch das PTRACE_TRACEME-Flag zu ptrace() gelöst, das neben einigen anderen Dingen bewirkt, daß ein Kindprozeß nach einem execve() erst mal mit einem SIGTRAP stehen, bleibt bevor er irgendwas selber macht. Bemerkenswert ist, daß die Erweiterung möglich war, ohne das bestehende 30 Jahre alte Konzept von fork, exec und wait verändern zu müssen.