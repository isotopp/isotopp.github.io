---
author: isotopp
title: "Service Mesh"
date: "2018-11-28T20:57:34Z"
feature-img: assets/img/background/rijksmuseum.jpg
published: false
tags:
- pluspora_import
- lang_de
- cloud
- erklaerbaer
---

Wenn man was mit Infrastructure As Code macht, also Openstack, AWS, GCS, oder auch Kubernetes, dann hat man meistens eine ganze Flotte von willkürlichen IPs mit komischen Ports, auf denen je eine Instanz desselben Dienstes läuft.
Das heißt, man braucht einen Load-Balancer, der einem die Requests annimmt und auf die ganzen Endpoints verteilt.

Das ist eine Idee, die man mal einen Moment festhalten sollte, während man einen Blick auf Altbekanntes wirft:

# SDN in Openstack

Denn Openstack zum Beispiel treibt auf den unteren Ebenen des Netzwerks eine Menge Aufwand, um ein Underlay und ein Overlay-Netz zu bauen.
Und einem Tenant (also einem Openstack-Kunden, mit Benutzern im Kunden) dann die Gelegenheit zu geben, in seinem Tenant eine komplette IP-Infrastruktur aufzubauen, mit virtuellen Bridges, Routern, Subnetzen, Firewalls und Load Balancern.
Das tut der Kunde, weil er IP basierend Access Control (also Firewalls) aufbauen will, die den Zugang zu den Diensten regeln.

Dienste, die sowieso nicht zugänglich sind, weil sie eigentlich nur durch den Load-Balancer erreicht werden können, und deren IP-Nummern auch egal sind, weil sie nur den LB interessieren.

Ich weise da deshalb so darauf hin, weil Software Defined Networking zwar eine atemberaubend geile Sache ist.
Man kann damit endlich alle Netzwerk-Zuckerbäckereien bauen kann, die man schon immer haben wollte, ohne jemals ein Kabel oder ein Chassis in die Hand zu nehmen.
Aber SDN ist auch etwas, das genau gar nicht skaliert und für das man keine Operations machen kann.

Also, ein SDN hat einen Haufen State.
Es weiß, welche Komponenten des Overlays von welchem Tenant wo physikalisch terminiert werden ("welche VM wo liegt und welche virtuellen Komponenten des Overlays vor der VM liegen").
Und es weiß, was ein virtueller Router, eine virtuelle Firewall oder ein virtuelles NAT mit einem Paket machen müssen, das da durch geht und simuliert das dann, bevor das Paket ausgeliefert wird.

State ist aber ein Problem: 
Jedes Mal, wenn eine VM hoch geht oder terminiert wird.
Schlimmer noch, jedes Mal, wenn eine aktive Netzwerkkomponente oder gar ein ganzes Netz erzeugt oder terminiert wird.
Immer dann ändert sich die Topologie des Netzes und damit der State, der dem ganzen SDN und allen Komponenten bekannt sein muß.
Auch die simulierten Aktionen des Overlays ändern sich, und müssen neu berechnet werden.
Und ein Haufen verteilter Komponenten müssen aktualisiert werden.

Wenn also der Cluster größer wird, also mehr Underlay bekommt, dann wird der Kreis der Geräte größer, denen der State bekannt sein muß.
Damit geht die Convergence Time nach oben, also die Zeit, die es braucht, bis eine Änderung allen Geräten im Overlay und Underlay bekannt ist.

Und zugleich sind vermutlich auch mehr Tenants da, die mehr machen müssen.
Damit geht dann auch die Change Rate nach oben.
Also die Anzahl der Änderungen im Cluster, die eine neue Konvergenz des Clusters erforderlich machen können.

Und irgendwann brennt dann alles nieder.
Dann sind alle Overlays down, und alle Kunden sind sehr traurig.

Dazu kommt dann natürlich noch, das so Hersteller von SDN Software gelegentlich neue Versionen von ihrem Kram releasen, die man dann einspielen muß.

Der Hersteller eines SDN ist natürlich sehr verantwortungsvoll und kennt sich mit den Tücken von Operations Teams aus:
neue Versionen sind immer kompatibel zu vorhergehenden Versionen und man kann von einer alten Version auf eine neue Version so upgraden, daß auch ein Rollback auf die alte Version jederzeit möglich ist.
Und zwar ohne dass die persistierten Strukturen, die das Overlay beschreiben, verloren gehen oder ungültig werden.
Dadurch sind Updates eine sichere Sache und risikolos ohne Downtime möglich. 

Außerdem ist die Erde eine Scheibe.

# Stattdessen Service Mesh

Weil das so ist, wie es ist, haben sich einige Leute überlegt:
wieso überhaupt ein Overlay?
Am Ende sind doch IP-Nummern egal, und die Discovery der Endpunkte ist komplett nur ein Problem für den Load-Balancer. 

Warum packt man nicht einfach alle Tenants in ein flaches IP-Netz, nimmt den Kunden die Möglichkeit weg, IP-Nummern und Netzwerktopologien zu bauen und zwingt sie dazu, Services sicher im "offenen Netz" zu betreiben?

Tatsächlich ist das eine berechtigte Frage und eine Antwort ist:

"Weil man dann immer noch einen technisch einheitlichen und zuverlässigen Weg braucht, um Verbindungen und Partner zu identifizieren, und nur zulässige Verbindungen zu erlauben.
Am Besten auf eine Weise, daß Entwickler das nicht willkürlich falsch machen können".

Im Kubernetes-Umfeld ist so etwas ein Sidecar-Proxy.

Ein Sidecar ist ein Prozeß, der mit dem eigentlichen Payload-Prozeß zusammen gestartet wird, und der im selben Pod läuft wie die Payload.
Das heißt, die Dinger können einander sehen und befummeln, verwenden dieselben Netzwerkinterfaces und IP-Tables Regeln und teilen auch sonst alle Ressourcen - mit Ausnahme des Dateisystem-Images.

Die Payload verbindet sich also an localhost, Port irgendwas, und der Sidecar-Proxy ist zuverlässig auf diesem Port und kümmert sich um die Verbindungen, oder andersherum, der Proxy nimmt eingehende Verbindungen an und leitet sie an die Payload weiter.

Dadurch kann der Proxy eine ganze Menge Dinge tun - er kann TLS erzwingen und Zertifikate oder JWT Token kontrollieren, er kann Verbindungsdaten sammeln (Timing Histogramme), er kann Retries kontrollieren, wenn ein Dienst nicht in einer bestimmten Zeit reagiert oder er kann Retries und Services komplett kurzschließen, wenn ein optionaler Dienst mal weg ist.

Ein solcher Proxy für das Kubernetes Umfeld ist Envoy, und das besondere an Envoy ist, daß seine Konfiguration nicht aus statischen Dateien kommt, sondern auch von einem clusterweit-zentralen Dienst dynamisch generiert werden kann.
Die Konfiguration kann dann ohne Proxy Neustart im Betrieb geändert werden.

Kubernetes verwendet das, um neue Endpunkte in den Load-Balancer zu integrieren, wenn sie verfügbar werden, um in Rollouts Traffic sanft von einer alten auf eine neue Version zu migrieren und um zentral clusterweit einheitlich Metriken über Dienstaufrufe und deren Zeitverhalten zu sammeln und zu loggen.
Das kann man verwenden, um Request-Kaskaden zu tracen und um Qualitätsüberwachung für seine Dienste zu haben.

[Ein paar Grundlagen über Envoy](https://jvns.ca/blog/2018/10/27/envoy-basics/).

Es stellt sich dann heraus, daß aus einer Reihe von Gründen das besser skaliert und schöner failed als ein SDN, und daß man außerdem eine Technologie verwendet, die von Entwicklern besser verstanden wird und einfacher zu debuggen ist als ein SDN.

Es skaliert besser, weil hier State pro Dienst und nicht pro Cluster gehalten werden könnte.
Und es failed schöner, weil man hier einzelne Envoys unabhängig voneinander verlieren kann, bzw. einzelne Dienste ohne gleich den ganzen Cluster zu droppen.
Verliert man die Control Plane, also den Dienst, der Envoy steuert, dann ist das loss-of-control, man kann die Envoy Config nicht mehr ändern.
Es ist nicht loss-of-service, das heißt, das Netz läuft eingefroren weiter - und die Control Plane kann (hoffentlich) rediscovery, d.h. eine neu gestartete Control Plane kann die existierenden Envoy-Nodes und deren Config ohne Betriebsunterbrechung einsammeln, konsolidieren und dann nahtlos den Betrieb aufnehmen.

Ich rede hier von Control Planes und eventuell später auch von Service Discovery und anderen Dingen. 
Hier ist noch einmal ein wenig Hintergrund dazu:

[An Introduction to Modern Network Load Balancing](https://blog.envoyproxy.io/introduction-to-modern-network-load-balancing-and-proxying-a57f6ff80236).

Der Artikel erklärt erst mal, was ein Load-Balancer ist, was L4 und L7 Load-Balancing tut und hebt dann insbesondere auf L7 LBs (Proxies) ab, und geht auf zentrale Steuerung mit dynamisch generiert Konfiguration ein.
Diese zentrale Steuerung mit dynamischer Config-Generierung ist eine Controlplane.
Generell finden wir in dem Artikel eine schöne Erklärung von Begriffen, und was sie bedeuten und warum man diese Konzepte abgedeckt haben will - Service Discovery ,Health Checking, Load-Balacing, Stickyness von Sessions, TLS Termination, Observability, Security and DoS Mitigation, und schließlich Config and Control Plane.

Wenn wir jedoch über Kubernetes reden, dann reden wir in der Regel über L7 Proxies, und wir finden nginx plus, haproxy, linkerd und Envoy.
Envoy wischt gerade mit dem Rest den Boden auf und der Grund dafür ist die Controlplane - für Envoy gibt es mehrere, und die, die alle haben wollen, ist Istio.

Istio macht aus einer Flotte von Payloads mit Envoy Sidecars ein Service Mesh.
Es generiert aus der State Database von Kubernetes eine Konfiguration für alle diese Envoys, so daß die Payloads auf die richtige Weise miteinander reden dürfen, das immer über TLS tun, mit anderen Dingen nicht reden können und einander finden und all die anderen schönen Dinge tun, die Envoy für jemanden tun kann, wenn man ihn den nur korrekt konfigurierte.

Der Artikel
[Service Mesh vs. Control Plane](https://blog.envoyproxy.io/service-mesh-data-plane-vs-control-plane-2774e720f7fc)
erklärt das in mehr Detail und Tiefe.

Und weil das alles so toll und aufregend ist, haben Google, das Kubernetes Projekt, die Cloud Native Computing Foundation (CNCF) und ein paar andere Leute gesagt
"Dann integrieren wir das alles eben",
und so kommt Kubernetes jetzt mit Istio und Envoy als Service Mesh und flache L3 Netze mit Sidecar L7 Loadbalancers werden der Default - mindestens in GKE, aber vermutlich sowieso bei jedem, der Kubernetes macht.

Eric Brewer schreibt darüber in aller Ausführlichkeit in
[Kubernetes users, get ready for the next chapter in microservices management](https://cloud.google.com/blog/products/application-development/kubernetes-users-get-ready-for-the-next-chapter-in-microservices-management)
Damit werden Istio und Envoy das SDN an Stelle des SDN in normalen K8s Installationen - nicht nur bei Google.
