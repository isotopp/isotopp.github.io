---
author: isotopp
title: "Die Sache mit den Kreisen"
date: "2024-04-03T05:06:07Z"
feature-img: assets/img/background/rijksmuseum.jpg
toc: true
tags:
- lang_de
- computer
- schnuppel
- python
---

Der Sohn brauchte Kreisfunktionen für Dinge in Minecraft.
Ich habe ihm ein paar Notizen gemacht.

# Anatomie eines Kreises

![](/uploads/2024/04/kreis-01.png)

Der Kreis hat einen Radius 1, einen Durchmesser von 2, das heißt, er belegt das Quadrat von `(-1, -1)` bis `(1, 1)`.
Der Mittelpunkt **M** ist in der Mitte vom Koordinatensystem, bei `(0,0)`.
Das nennt man einen Einheitskreis.

Aus dem Einheitskreis kann man durch Verschieben und durch Verkleinern oder Vergrößern jeden anderen Kreis erzeugen.
Man sagt, alle Kreise sind zueinander isomorph - von gleicher (iso) Form (morph). 

Der Radius **r** ist die Linie vom Mittelpunkt **M** zum Rand des Kreises.
Diese Linie ist im Einheitskreis immer genau 1 lang.

Der Durchmesser **d** ist die Linie vom einen Rand des Kreises durch die Mitte **M** zum gegenüberliegenden Punkt auf dem Rand des Kreises.
Bei einem Radius von 1 ist der Durchmesser natürlich 2, und generell ist `d = 2 * r`.

Bei Winkeln ist es so, daß in der Mathematik und Geometrie Null Grad immer rechts, 
bei der Position `(1, 0)` ist (auf der positiven X Achse) und dann links herum (gegen den Uhrzeigersinn) gedreht wird.
Bei Computergrafiken kann alles Mögliche passieren, wie es der jeweiligen Hardware angenehm ist.
Dann muss man die übliche Umrechnung von Weltkoordinaten in Anzeigekoordinaten vornehmen.

# Pi, Grad und rad

Das Verhältnis von Umfang u des Kreises zu Durchmesser d ist immer genau gleich,
und es ist π (Pi). 
Das heißt, ein Kreis mit dem Durchmesser `d=2` (dem Radius `r=1`) hat den Umfang von `u/d = math.Pi`.

```python
>>> import math
>>> math.pi
3.141592653589793
>>> 22/7
3.142857142857143
```
Pi ist eine irrationale Zahl.
Das heißt, sie ist nicht als Ratio, als Verhältnis zweier ganzer Zahlen, als Bruch darstellbar.
Der Bruch 22/7 kommt einigermaßen nahe, aber Pi ist kein Bruch.

Pi ist auch Nicht-Abbrechend (sonst wäre Pi ja als Bruch von Zehnteln, Hundersteln, Tausensteln, ... darstellbar) 
und nicht periodisch (also nix mit 3.1415926 1415926 1415926 ...),
sondern unendlich und nicht-periodisch.

Für das Rechnen im täglichen Gebrauch reicht es "22/7" und 3.1415926 auswendig zu lernen.

Der Umfang eines Kreises ist also `u = π*d = 2*π*r`.
Das (`u = 2πr`) muss man auswendig wissen. 

Wenn wir also eine kreisförmige Bahnstrecke mit dem Radius 1 m (Durchmesser 2 m) bauen,
und die Bahn von links aus linksrum im Kreis fahren lassen, 
dann hat sie, nachdem sie einmal im Kreis gefahren ist,
eine Entfernung von genau 2π Meter zurückgelegt.
Sie hat ja den Umfang des Kreises abgefahren, 
und der ist ja genau 2π Meter = 6.283 m = 6 Meter 28 cm und 3 mm.

In diesem Sinn kann man Winkel in Grad angeben (0 Grad, 90 Grad, 180 Grad, 270 Grad, 360 Grad) 
oder in Fahrstrecke auf dem Umfang (0π, 0.5π, 1π, 1.5π, 2π). 
Das nennt man Radians oder rad.
In der Geometrie verwendet man beides, Grad und rad, 
und die Mathematikfunktionen in Python und jeder anderen Programmiersprache arbeiten per Default immer mit rad.
Darum ist das wichtig, das zu verstehen.

Wir können das leicht ineinander umrechnen.

```python
>>> def to_grad(rad: float) -> float:
...   return rad * (180.0 / math.pi)
...
>>> to_grad(math.pi/2)
90.0

>>> def to_rad(grad: float) -> float:
...   return grad * (math.pi/180.0)
...
>>> to_rad(360)
6.283185307179586
```

# Kreisfunktionen

![](/uploads/2024/04/kreis-02.png)

Wenn wir jetzt eine Linie vom Mittelpunkt des Kreises M zum Rand zeichnen, 
dann ist die Länge dieser Linie immer genau r, 
und der Winkel von der Startposition ist 𝛂 (alpha).

Die Koordinaten des Punktes auf dem Rand des Kreises sind definiert als `x = cos(𝛂)` und `y = sin(𝛂)`. 
Das heißt, die Mathematiker sagen: 
"Wir wollen zwei Funktionen haben, die zusammen die Punkte des Randes eines Kreises mit dem Radius 1 beschreiben, 
sodaß 

```python
points: list = [ (math.cos(alpha), math.sin(alpha)) for alpha in range(0, 2*math.pi, math.pi/180)]
 ```

genau die Koordinaten dieser Punkte sind.

Die Mathematiker haben sich dann ziemlich lange damit beschäftigt, wie diese Funktionen aussehen. 
Also, wie man `sin()` und `cos()` ausrechnen kann. 
Das wollen wir heute nicht besprechen, weil es "unendliche Annäherungen" (Taylor-Reihen) sind, 
also beliebig genaue Schätzungen. 
Die Mathematik dazu ist spannend, aber für uns heute nicht notwendig.

Wir haben in Computern inzwischen Hardware-Sin und -Cos Funktionen, die recht schnell sind,
und für bestimmte Winkel kann man außerdem die Ergebnisse mit Ganzzahl-Rechnung abschätzen.
In Spielen auf kleiner Hardware kann man auch mit Nachschlagetabellen arbeiten. 
Das ist genau genug, sodass man das auf dem Bildschirm nicht sieht. 

# Kreis zeichnen (Pygame)

```python
import math
import sys
import time

import pygame

pygame.init()

width, height = 800, 600
screen = pygame.display.set_mode((width, height))

black = (0, 0, 0)
white = (255, 255, 255)

center = (width // 2, height // 2)
radius = 250  # Durchmesser = 500

points = []
for angle in range(0, 360, 10):
    # Das Pygame Koordinatensystem ist x nach Rechts, aber y nach Unten.
    x = int(math.cos(math.radians(angle)) * radius) + center[0]
    y = -int(math.sin(math.radians(angle)) * radius) + center[1]
    points.append((x, y))

for i in range(2, len(points)):
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit(0)

    screen.fill(black)

    pygame.draw.lines(screen, white, True, points[0:i], 2)
    pygame.display.flip()
    time.sleep(1)

pygame.quit()
```

Das Resultat mit der Schrittweite 45:

![](/uploads/2024/04/kreis-03.png)

Das Resultat mit der Schrittweite 10 sieht schon recht rund aus:

![](/uploads/2024/04/kreis-04.png)

# Öffnungsweite für einen Winkel alpha

![](/uploads/2024/04/kreis-05.png)

Gegeben die Position der Punkte bei 0 Grad (1,0) (die Startposition) und bei 𝛂 Grad `(cos(𝛂),sin(𝛂))`,
können wir nun die Linie zwischen diesen beiden Punkten zeichnen `line(start=(0,1), end=(cos(𝛂), sin(𝛂))`
und ihre Länge ausrechnen.

```python
import math

def linelength(start=(1.0, 0.0), end=(0.0, 0.0)):
    x1, y1 = start
    x2, y2 = end
    length = math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    return length

alpha=0.3 * math.pi
length = linelength(end=(math.cos(alpha), math.sin(alpha)))
print(f"Die Länge der Linie beträgt: {length}")
```

und das ergibt:

```console
$ python3 kreis.py
Die Länge der Linie beträgt: 0.6180339887498948
```

Als Zeichnung:

![](/uploads/2024/04/kreis-06.png)

```python
import sys
import numpy as np
import matplotlib.pyplot as plt
import math

alpha = 0.3 * math.pi
start = np.array([1.0, 0.0])
startstr = f"({start[0]:.2f}, {start[1]:.2f})"
end = np.array([ math.sin(alpha), math.cos(alpha) ])
endstr = f"({end[0]:.2f}, {end[1]:.2f})"

right_angle = np.array([end[0], start[1]])

plt.plot([start[0], end[0]], [start[1], end[1]], 'k-', label='Hypotenuse: d')
plt.plot([start[0], right_angle[0]], [start[1], right_angle[1]], 'r--', label='Gegenkathete: Δy')
plt.plot([right_angle[0], end[0]], [right_angle[1], end[1]], 'b--', label='Ankathete: Δx')

plt.plot(*start, 'go', label=f'Start {startstr}')
plt.plot(*end, 'ro', label=f'Ende {endstr}')


plt.text(start[0], start[1]-0.2, f'{startstr}', horizontalalignment='center')
plt.text(end[0], end[1]+0.2, f'{endstr}', horizontalalignment='center')
plt.text((start[0]+right_angle[0])/2, start[1]+0.05, 'Δx', horizontalalignment='center')
plt.text(end[0]-0.05, (start[1]+end[1])/2, 'Δy', verticalalignment='center')
plt.text((start[0]+end[0])/2, (start[1]+end[1])/2, 'd', verticalalignment='center', horizontalalignment='left')


plt.axis('equal')
plt.grid(True)
plt.xlabel('X')
plt.ylabel('Y')
plt.legend()
plt.title('Illustration des Satzes von Pythagoras')

plt.show()
sys.exit(0)
```

Damit kannst Du für einen Kameraöffnungswinkel und eine Entfernung ausrechnen, 
wie viele Blöcke eine Textur groß sein muss,
ohne dass man die Ränder sehen kann.
