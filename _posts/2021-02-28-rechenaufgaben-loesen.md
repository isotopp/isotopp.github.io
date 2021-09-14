---
layout: post
title:  'Rechenaufgaben lösen'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2021-02-28 12:40:33 +0100
tags:
- lang_de
- python
- schulung
---


Das Kind möchte ein Programm zum Üben von Rechenaufgaben sehen. Nun gut. Hier ist eine Version in PyQt5.

![](/uploads/2021/02/aufgaben-01.png)

*Unsere Oberfläche soll so aussehen.*

Wir wollen ein kleines Fenster, in dem eine billig generierte Rechenaufgabe angezeigt wird. Der Schüler soll die Antwort eingeben und den Knopf "Antworten" drücken. Danach wird angesagt, ob die Antwort korrekt war, oder ob sie falsch war. Wenn sie falsch war, wird auch die korrekte Antwort angezeigt.

In der Statuszeile und in den Fortschrittbalken wird ein laufender Score mitgeführt. Nach 10 Aufgaben, oder wenn man "Quit" drückt, wird das Programm beendet.

## Das Userinterface gestalten

Wir brauchen Qt Designer, und erzeugen dort ein MainWindow.

![](/uploads/2021/02/aufgaben-02.png)

*MainWindow erzeugen.*

Mit einem Rechtsklick auf die Menubar und "Remove Menubar" können wir die nicht verwendete Menubar entfernen. Die kaum erkennbare Statusbar unten im Fenster lassen wir stehen.

Wir sehen rechts die im Programm vorhandene Bedienelemente-Hierarchie im Qt Designer. Das automatisch erzeugte "Centralwidget" ist leer, und hat einen Fehler (es ist mit einem roten Kuller markiert): Es hat noch kein Layout. Das Layout ordnet die im Centralwidget vorhandenen Unterelemente an.

![](/uploads/2021/02/aufgaben-03.png)

*Das Centralwidget ist mit einem roten Kuller als "ohne Layout" markiert.*

Wir ziehen einen QPushbutton in das Fenster, und drücken im gepunkteten Hintergrund die rechte Maustaste, wählen dann ein VerticalLayout aus.

![](/uploads/2021/02/aufgaben-04.png)

*Nachdem mindestens ein Bedienelement im Centralwidget vorhanden ist, kann man mit der rechten Maustaste im Layout-Submenü ganz unten ein Layout auswählen.*

Nach dem Zuweisen eines Layouts verschwindet der rote Kuller und die Elemente im Centralwidget ordnen sich an.

Wir setzen oberhalb des Buttons ein weiteres Element ein: Eine groupBox. Auch diese hat ein Layoutproblem: Wir setzen einen weiteren Button ein und wählen ebenso durch Rechtsklick ins Leere der Groupbox ein HorizontalLayout aus.

![](/uploads/2021/02/aufgaben-05.png)

*Wir haben oberhalb des ersten Buttons eine Groupbox positioniert, und sie passt sich automatisch an das Fenster an - das ist das VerticalLayout vom Centralwidget bei der Arbeit. Legen wir in die Groupbox einen weiteren QPushbutton, können wir der Groupbox ebenfalls ein Layout zuweisen. Hier wollen wir ein HorizontalLayout verwenden.*

Nachdem wir diese Grundstruktur haben, können wir die anderen fehlenden Elemente schnell nachziehen. Dabei ist wichtig, daß wir für jedes Element den passenden Namen festlegen, unter dem es später im Programm aufgerufen werden soll.

![](/uploads/2021/02/aufgaben-06.png)

*Jedes Element hat einen Namen - rechts kann man die Widgethierarchie sehen, und die Namen, die wir den Elementen zugewiesen haben.*

Nachdem wir Elemente korrekt benannt haben, müssen wir noch die Beschriftungen der Knöpfe und anderen Elemente anpassen. Dazu reicht es, den Knopf zu doppelklicken und den Text zu ersetzen.

Weiterhin kann man in den Widget-Eigenschaften bei einigen Elementen die Schriftgrößen anpassen. Ich habe `a`, `+`, `b` und `=` sowie den `Richtig oder falsch?`-Text von 8 auf 12 Punkt Schriftgröße angepasst.

Am Ende wird die Datei als "aufgaben.ui" abgespeichert. Ich habe sie direkt dem PyCharm Projekt hinzugefügt.

![](/uploads/2021/02/aufgaben-07.png)

*Die Qt Designer Ausgabe "aufgaben.ui" wird Bestandteil des PyCharm Projektes.*

## PyCharm Basisprojekt

Wir setzen ein Basisprogram mit Python 3.8 in PyCharm auf, und fügen die "aufgaben.ui" unserem Projekt hinzu. Unser Programm soll "aufgaben.py" heißen. Es wird PyQt5 verwenden, also schreiben wir das in unsere "requirements.txt". PyCharm installiert uns das dann in unser venv.

![](/uploads/2021/02/aufgaben-08.png)

*Wenn die Requirements korrekt installiert sind, funktioniert das Importieren der QtWidgets in der Python Console einwandfrei und ohne Fehler.*

Wir können die UI-Datei jetzt laden und ausführen, aber unser Programm wird dann noch nichts tun:

```python
from PyQt5 import QtWidgets, uic
import sys

class Ui(QtWidgets.QMainWindow):
    button_quit: QtWidgets.QPushButton

    group_aufgabe: QtWidgets.QGroupBox

    label_a: QtWidgets.QLabel
    label_b: QtWidgets.QLabel
    label_op: QtWidgets.QLabel
    button_loesen: QtWidgets.QPushButton
    feld_antwort: QtWidgets.QLineEdit

    label_richtig: QtWidgets.QLabel
    fortschritt_richtig: QtWidgets.QProgressBar
    fortschritt_total: QtWidgets.QProgressBar

    statusbar: QtWidgets.QStatusBar

    def load_ui(self) -> None:
        uic.loadUi("aufgaben.ui", self)

        self.button_quit = self.findChild(QtWidgets.QPushButton, "button_quit")

        self.group_aufgabe = self.findChild(QtWidgets.QGroupBox, "group_aufgabe")

        self.label_a = self.findChild(QtWidgets.QLabel, "label_a")
        self.label_b = self.findChild(QtWidgets.QLabel, "label_b")
        self.label_op = self.findChild(QtWidgets.QLabel, "label_op")
        self.button_loesen = self.findChild(QtWidgets.QPushButton, "button_loesen")

        self.label_richtig = self.findChild(QtWidgets.QLabel, "label_richtig")
        self.fortschritt_richtig = self.findChild(QtWidgets.QProgressBar, "fortschritt_richtig")
        self.fortschritt_total = self.findChild(QtWidgets.QProgressBar, "fortschritt_total")

        self.statusbar = self.findChild(QtWidgets.QStatusBar, "statusbar")

        self.feld_antwort = self.findChild(QtWidgets.QLineEdit, "feld_antwort")

    def __init__(self):
        super(Ui, self).__init__()

        self.load_ui()
        self.show()


app = QtWidgets.QApplication(sys.argv)
window = Ui()
app.exec()
```

Das Programm importiert `QtWidgets` und `uic` aus dem `PtQt5` Package. Es definiert eine Klasse `Ui` als Unterklasse von `QtWidgets.QMainWindow`. Wir definieren eine Methode `load_ui()`, die die `aufgaben.ui`-Datei lädt. Im Konstruktor initialisieren wir die Superklasse (das QMainWindow) und rufen dann `load_ui()` auf. Mit `.show()` werden die Bedienlemente dann auch sichtbar.

Das Hauptprogramm hat die typische Minimalform für eine Qt-Anwendung: Erzeuge ein `QApplication`-Objekt, erzeuge unser `QMainWindow` (eigentlich eine Instanz unserer von `QMainWindow` abgeleiteten Klasse `Ui`) und starte dann die Event-Loop mit `app.exec()`.

In unserer `Ui` Klasse definieren wir einen Haufen Slots für alle diejenigen  Bedienelemente der `.ui`-Datei, die wir direkt ansprechen wollen. In der `load_ui()`-Methode durchsuchen wir die `.ui`-Datei mit `.findChild()` nach diesen Elementen und merken sie uns in diesen Slots.

Wir können gleich noch den Quit-Button aktivieren: Aus

```python
        self.button_quit = self.findChild(QtWidgets.QPushButton, "button_quit")
```

wird

```python
        self.button_quit = self.findChild(QtWidgets.QPushButton, "button_quit")
        self.button_quit.clicked.connect(self.quit_pressed)
```

und wir fügen der `Ui`-Klasse eine Methode `quit_pressed()` hinzu:

```python
    def quit_pressed(self) -> None:
        msg: QtWidgets.QMessageBox = QtWidgets.QMessageBox()
        msg.setText("Auf Wiedersehen.")
        msg.setWindowTitle("Auf Wiedersehen.")
        msg.setStandardButtons(QtWidgets.QMessageBox.Ok)
        msg.setDefaultButton(QtWidgets.QMessageBox.Ok)
        msg.setIcon(QtWidgets.QMessageBox.Information)
        msg.exec()
        sys.exit(0)
```

Dies ist zugleich ein Beispiel für das Erzeugen von PyQt5-Elementen ohne QtDesigner: Wir hätten diesen Dialog auch mit dem Designer in eine `.ui`-Datei speichern können, um sie dann mit `uic` zu laden. Stattdessen erzeugen wir hier den Abschiedsdialog manuell und rufen ihn dann auf, bevor wir das Programm beenden.

Dieses Teilprogramm ist nun schon lauffähig und zeigt das funktionsfähige Programm mit User-Interface an. Es tut jedoch noch nichts.

## Aufgaben generieren

Um Rechenaufgaben zu erzeugen und dann feststellen zu können, ob jemand sie richtig ausgerechnet hat, brauchen wir eine Klasse `Aufgabe`.

```python
from random import randint, choice
from typing import List

class Aufgabe:
    op: str = ""
    a: int = 0
    b: int = 0

    loesung: int = 0

    allops: List[str]

    def ausdenken(self) -> None:
        self.op = choice(self.allops)
        self.a = randint(1, 10)
        self.b = randint(1, 10)
        if self.a < self.b:
            self.a, self.b = self.b, self.a

        if self.op == "+":
            self.loesung = self.a + self.b
        if self.op == "-":
            self.loesung = self.a - self.b

    def pruefen(self, loesung: int) -> bool:
        return self.loesung == loesung

    def __init__(self) -> None:
        self.allops = ["+", "-"]
        self.ausdenken()
```

Die Aufgabe hat die Variablen `a`, `b` und `op`, wobei `a` und `b` zwei Zahlen zwischen 1 und 10 sein sollen, und `op` entweder `+` oder `-` sein soll. Um die Subtraktion einfacher zu machen soll `a` die Größere der beiden Zahlen sein. In der Variablen `loesung` wollen wir uns die korrekte Lösung der Aufgabe merken.

Wir definieren uns einen Konstruktor, in dem wir auch die Liste der zugelassenen Operatoren in `allops` vorbelegen: Es ist eine Liste von Strings mit zwei Einträgen: Plus und Minus. Wir rufen von dort auch schon einmal die Methode `ausdenken()` auf, die sich eine neue Aufgabe ausdenkt.

In `ausdenken` bestimmen wir eine Operation (Plus oder Minus) durch zufällige Auswahl eines Elementes aus der Liste mit `choice()` und bestimmen zwei zufällige ganze Zahlen aus dem gewünschen Bereich mit `randint()`. Falls `a` die kleinere der beiden Zahlen ist, vertauschen wir sie.

Danach wird die Variable `loesung` korrekt belegt, in Abhängigkeit vom Operator `op`.

Das Prädikat `pruefen(loesung)` teilt uns mit, ob die vom Benutzer eingegebene Lösung korrekt ist.

## Den Spielstand mitführen

Der Benutzer kann nun Aufgaben bekommen und diese lösen. Wir können auch schon feststellen, ob diese Lösung korrekt ist. Wir brauchen aber noch Logik, die die Aufgaben zählt, die korrekten Aufgaben zählt und die uns sagt, ob wir fertig sind.

Wir brauchen `Score`:

```python
class Score:
    score: int = 0
    counter: int = 0
    target: int = 10

    def correct(self) -> None:
        self.counter += 1
        self.score += 1

    def incorrect(self) -> None:
        self.counter += 1

    def done(self) -> bool:
        return self.counter >= self.target

    def __init__(self):
        self.score = 0
        self.counter = 0
        self.target = 10
```

Die Klasse zählt in `score` die korrekten Lösungen mit, in `counter` werden alle gelösten Aufgaben mitgezählt und in `target` speichern wir, wie viele Aufgabenrunden das Spiel insgesamt dauert.

Die Methode `correct()` wird aufgerufen, wenn der Benutzer eine richtige Antwort eingegeben hat: Wir zählen dann `counter` und `score` gemeinsam hoch. Bei `incorrect()` wird dagegen nur der `counter` weiter gezählt. Das Prädikat `done()` sagt uns, ob das Spiel beendet werden kann, weil genug Aufgaben gelöst worden sind.

## Aufgaben und Score verkabeln

Wir verändern jetzt den Konstruktor unserer Hauptklasse `Ui`: Dort wollen wir auch einen Score und eine Aufgabe erzeugen. Und statt `show()` direkt aufzurufen haben wir jetzt eine Methode `alles_updaten()`, die die Texte der verschiedenen Bedienelemente verändert und dann erst `show()` aufruft.

```python
class Ui(QtWidgets.QMainWindow):
    aufgabe: Aufgabe
    score: Score

...

    def __init__(self):
        super(Ui, self).__init__()
        self.score = Score()
        self.aufgabe = Aufgabe()

        self.load_ui()
        self.alles_updaten()
```

Und `alles_updaten()` sieht nun so aus:

```python
    def set_aufgabe(self) -> None:
        self.label_a.setText(str(self.aufgabe.a))
        self.label_op.setText(str(self.aufgabe.op))
        self.label_b.setText(str(self.aufgabe.b))

        title = f"Aufgabe {self.score.counter+1}/{self.score.target}"
        self.group_aufgabe.setTitle(title)

        self.fortschritt_richtig.setValue(self.score.score)
        self.fortschritt_total.setValue(self.score.counter)

    def set_statusbar(self) -> None:
        status = f"Aufgabe {self.score.counter}/{self.score.target}, {self.score.score} richtig."
        self.statusbar.showMessage(status)

    def alles_updaten(self) -> None:
        self.set_statusbar()
        self.set_aufgabe()
        self.show()
```

Wir aktualisieren also das `statusbar` Element in `set_statusbar()` und die Aufgabenanzeige in der Groupbox in `set_aufgabe()`.

In `set_statusbar()` erzeugen wir den gewünschten Text durch Auslesen des Score und rufen dann `showMessage()` für die Statusbar auf.

In `set_aufgabe()` verändern wir die Labeltexte von `label_a`, `label_op` und `label_b` durch Aufruf ihrer `setText()`-Methoden. Wir aktualisieren den Titel der Groupbox durch den Aufruf von `setTitle()` in der Groupbox, und wir setzen die beiden Fortschrittsbalken so, daß sie die Werte aus dem Score korrekt übernehmen. Das macht die Methode `setValue` der ProgressBar.

Jetzt haben wir ein Programm, das nicht nur die UI lädt und anzeigt, sondern auch schon eine Aufgabe ausdenkt und korrekt anzeigt.

## Benutzereingabe und Reaktion

Wir müssen jetzt auf Benutzereingaben reagieren. Das passiert, sobald der Benutzer den Knopf "Antworten" betätigt. Wir brauchen also eine Methode `auswerten()` in `Ui` und müssen diese mit dem Knopf verbinden.

Wir wollen ausdrücklich nicht, daß beim Verlassen der Editbox etwas passiert - nur der Knopf soll Funktionen auslösen. Darum verkabeln wir `feld_antwort` nicht direkt (wir könnten [editingFinished()](https://doc.qt.io/qt-5/qlineedit.html) verkabeln, wenn wir das wollten).

Die Methode:

```python
    def auswerten(self) -> None:
        loesung: int
        text: str

        text = self.feld_antwort.text()
        if text is None or text == "":
            return

        try:
            loesung = int(text)
        except ValueError:
            return

        if self.aufgabe.pruefen(loesung):
            self.score.correct()
            ergebnis = f"Deine Lösung: {loesung}. Das war richtig."
        else:
            self.score.incorrect()
            ergebnis = f"Deine Lösung: {loesung}. Richtig wäre: {self.aufgabe.loesung}."

        self.label_richtig.setText(ergebnis)
        self.feld_antwort.setText("")
        self.alles_updaten()

        if self.score.done():
            self.quit_pressed()
        else:
            self.aufgabe.ausdenken()
            self.alles_updaten()
}

```

Wir lesen die Benutzeringabe aus dem Antwortfeld mit `text()` aus. Sie kann leer sein, dann ignorieren wir sie.

Danach versuchen wir diese Eingabe in eine ganze Zahl umzuwandeln. Wenn das nicht gelingt, ignorieren wir die Eingabe ebenfalls.

Schließlich rufen wir `pruefung()` in unserer Aufgabe-Klasse auf. Wenn die Antwort richtig war, erzeugen wir einen passenden Ausgabestring und zählen den Score als `correct()`. War sie falsch, erzeugen wir den anderen Ausgabestring und zählen den Score als `incorrect()`.

In jedem Fall setzen wir den Ausgabestring in das Label `label_richtig` und löschen das Eingabefeld. Danach aktualisieren wir das Userinterface durch Aufruf von `alles_updaten()`.

Falls der Benutzer ausreichend viele Aufgaben gelöst hat, beenden wir das Programm als wäre Quit gedrückt worden. Andernfalls denken wir uns eine neue Aufgabe aus und zeigen sie an.

Der Knopf "Antworten" muß nun ebenfalls verkabelt werden: In `load_ui()` passen wir die Zeile

```python
        self.button_loesen = self.findChild(QtWidgets.QPushButton, "button_loesen")
```

also zu 

```python
        self.button_loesen = self.findChild(QtWidgets.QPushButton, "button_loesen")
        self.button_loesen.clicked.connect(self.auswerten)
```

an.

## Fertig!

Schließlich können wir in `quit_pressed()` noch die Dialognachricht anpassen, um einen Endscore anzuzeigen:

```python
    def quit_pressed(self) -> None:
        msg: QtWidgets.QMessageBox = QtWidgets.QMessageBox()
        msg.setText(
            f"Von {self.score.counter} Aufgaben waren {self.score.score} richtig."
        )
        msg.setWindowTitle("Endergebnis")
        msg.setStandardButtons(QtWidgets.QMessageBox.Ok)
        msg.setDefaultButton(QtWidgets.QMessageBox.Ok)
        msg.setIcon(QtWidgets.QMessageBox.Information)
        msg.exec()
        sys.exit(0)
```

Nach dem Starten kann der Benutzer jetzt Aufgaben sehen, eine Lösung eingeben und den Knopf "Antworten" drücken. Das Programm wertet die Eingabe aus, zählt die Ergebnisse und bewegt die Fortschrittbalken. Nach 10 Eingaben gibt es ein Endergebnis aus und beendet sich.

Der vollständige Quelltext ist [auf Github zu finden](https://github.com/isotopp/pyqtaufgaben).
