---
layout: post
published: true
title: Static vs. dynamic typing
author-id: isotopp
date: 2004-05-02 10:50:02 UTC
tags:
- computer
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
Irgendwann Ende der 80er fiel mir ein Zortech C++ Compiler in die Hand. Den mochte ich, weil er anders als das cfront auf dem AIX ein nativer Compiler war. Ich habe also das VP/ix in meinem SCO Xenix hochgefahren, ein MS-DOS rein installiert und ein wenig mit der Sprache rumexperimentiert.

Ich habe zu dieser Zeit bei einem Erwachsenenbildungswerk Programmierkurse gegeben und eine der fortgeschrittenen Standardaufgaben, mit denen ich meine Schüler gequält habe, waren dynamische Strings ("Schreiben Sie eine lgets()-Funktion, die beliebig lange Strings aus einer Datei lesen kann") und dynamische Arrays ("Schreiben Sie einen Satz Funktionen, mit denen Sie ein Array variabler Größe verwalten können"). 

Natürlich habe ich diese Experimente auch in C++ versucht, und mich in kürzester Zeit angewidert abgewandt. C++ hat sich für diese Aufgabe nämlich als haarsträubend unbrauchbar herausgestellt. Ich fragte mich: Wozu eine objektorientierte Programmiersprache, wenn in ihr nicht einmal ordentliche Container schreiben kann? (Ich weiß, daß es inzwischen Templates gibt, aber ihr wisst, daß die auch nicht Teil der Lösung, sondern Teil des Problems sind)

Aber ich war sowieso schon von der Uni her versaut, wo wir im Rahmen der Vorlesung "Objektorientierte Programmierung" mit Smalltalk und CLOS rumgemacht haben - von dort hatte ich recht konkrete Vorstellungen davon, was ich von einer objektorientierten Sprache erwarte, wenn es darum geht, dem Programmierer Arbeit abzunehmen.
Kurz danach geriet ich an eine Nextstation und Objective-C und war für die Type Nazis für immer verloren:
Dynamisch getypte Sprachen [rocken einfach mehr]({% link _posts/2003-10-24-objc-oder-warum-dcop-so-kompliziert-ist.md %}), denn sie nehmen einem Arbeit ab, anstatt welche zu generieren.

Natürlich habe ich das gerne auch im Netz verargumentiert, und bin von der Static Typing Fraktion mehr als einmal getoastet worden, denn ohne starke Typprüfung durch den Compiler geht angeblich die Welt unter. Angeblich, denn bei mir tat sie es nie. 

Aber offenbar bin ich nicht der einzige, der diese Erfahrung gemacht hat. 
Bei [Jeff Morre's Classpath considered harmful](http://www.procata.com/blog/archives/2004/04/26/classpath-considered-harmful/) findet sich ein Link auf [Stephen Ferg's Java vs. Python comparison](http://www.ferg.org/projects/python_java_side-by-side.html), und die beschreibt ziemlich gut meine Erfahrungen mit C++ und später Java. 

Manche Beispiele sind echt lustig, jedenfalls wenn man diese Art Geek-Humor steht. Wie schreibt ein Java-Programmierer `$fp = fopen($argFilename, "r")`?

```java
import java.io.*;

BufferedReader myFile = new BufferedReader(new FileReader(argFilename));
```

Das baut einen 
[FileReader](http://java.sun.com/j2se/1.4.2/docs/api/java/io/FileReader.html) -Objekt (FileReader ist eine Unterklasse von 
[InputStreamReader](http://java.sun.com/j2se/1.4.2/docs/api/java/io/InputStreamReader.html), der Bytes mithilfe einer beliebigen Zeichensatzkonvertierung in Zeichen des gewünschten Zielzeichensatzes umwandelt, und FileReader setzt diese Umwandlung auf Null und setzt eine Standardpuffergröße ein. InputStreamReader ist wiederum eine Unterklasse von 
[Reader](http://java.sun.com/j2se/1.4.2/docs/api/java/io/Reader.html), eine abstrakte Klasse für Datenströme, was wiederum wie alles eine Unterklasse von 
[Object](http://java.sun.com/j2se/1.4.2/docs/api/java/lang/Object.html) ist.) und gibt dieses FileReader-Objekt einem BufferedReader mit. Den 
[BufferedReader](http://java.sun.com/j2se/1.4.2/docs/api/java/io/BufferedReader.html) kann man dann nach Zeilen fragen, wenn man will. Man hätte auch einen 
[LineNumberReader](http://java.sun.com/j2se/1.4.2/docs/api/java/io/LineNumberReader.html), eine Unterklasse von BufferedReader, nehmen können, hätte man neben dem Inhalt der Datei auch Zeilennummern wissen wollen. Ein LineNumberReader ist also ein BufferedReader plus einem int, das immer mal inkrementiert wird, wenn ein Newline vorbeikommt, plus eine 
[Setter](http://java.sun.com/j2se/1.4.2/docs/api/java/io/LineNumberReader.html#setLineNumber(int)) und eine 
[Getter](http://java.sun.com/j2se/1.4.2/docs/api/java/io/LineNumberReader.html#getLineNumber())-Methode für dieses int.

Oder, schöner noch: Wie schreibt ein Java-Programmierer "Tu eine Zahl in Array und hol sie wieder raus?"

```java
public Vector aList = new Vector;
public int aNumber = 5;
public int anotherNumber;

aList.addElement(new Integer(aNumber));
anotherNumber = ((Integer)aList.getElement(0)).intValue();
```

Wir bauen uns also ein int-Skalar aNumber, und eine Liste aList. Da in die Liste nur Objekte rein können, machen wir aus dem int-Skalar ein int-Objekt und tun das in die Liste. Da Java 
[statisch typt](http://www.ferg.org/projects/python_java_side-by-side.html#typing), ist in der Liste jetzt ein Object-Objekt und kein Integer-Objekt mehr. Wir fischen das Object-Objekt also mit getElement() aus der Liste, und typecasten das erst mal in was Brauchbares, ein Integer-Objekt. 
Nur dann dürfen wir das int-Skalar aus dem Integer-Objekt wieder herausholen. 

In Python und jeder anderen dynamisch getypten Sprache:

```python
aList = []
aNumber = 5

aList.append(aNumber)
anotherNumber = aList[0]
```

Was ich für sehr viel klarer und weniger fehleranfällig halte. 

[Bruce Eckel](http://mindview.net/WebLog/log-0025) auch. Die Fehler, die Code explodieren lassen, sind in der Regel keine Typfehler, sondern falsche Grenzbedingungen, falsche Logik oder falsches Design. Und denen kommt man nicht mit Typechecking bei, sondern halt nur mit Tests.

Bruce Eckel verweist in seinem Eintrag auf 
[Robert Martin](http://www.artima.com/weblogs/viewpost.jsp?thread=4639). Der schreibt 

> I thought an experiment was in order. So I tried writing some applications in Python, and then Ruby (well known dynamically typed languages). I was not entirely surprised when I found that type issues simply never arose. My unit tests kept my code on the straight and narrow. I simply didn't need the static type checking that I had depended upon for so many years.

Mein Reden seit 
[1870/71](http://kris.koehntopp.de/inkomploehntopp/01792.html) (letzter Abschnitt).

Guido hat sich 
[ebenfalls dazu geäußert](http://www.artima.com/intv/strongweak.html):
> All that attention to getting the types right doesn't necessarily mean you don't have other bugs in your program. A type is a narrow piece of information about your data. When you look at large programs that deal with a lot of strong typing, you see that many words are spent working around strong typing.
> 
> The container problem is one issue. It's difficult in a language without generics to write a container implementation that isn't limited to a particular type. And all the strong typing goes out the door the moment you say, "Well, we're just going to write a container of Objects, and you'll have to cast them back to whatever type they really are once you start using them." That means you have even more finger typing, because of all those casts. And you don't have the helpful support of the type system while you're inside your container implementation.
> 
> Python doesn't require you to write the cast, and its containers are completely generic. So it has the plus side of generic containers without the downside. It doesn't have the plus side that the C++ folks claim to get with their templates and other generics. But in practice that mechanism turns out to be very cumbersome. Even compiler writers have difficulty getting templates to work correctly and efficiently, and the programmers certainly seem to have a lot of trouble learning how to use it correctly. Templates are a whole new language that has enormous complexity.

John Ousterhout sieht das ganz ähnlich in 
[Scripting: Higher Level Programming for the 21st Century](http://home.pacbell.net/ouster/scripting.html), Abschnitt 6 ist der interessante Teil.
