---
layout: post
status: publish
published: true
title: What is a Service Mesh? What is the purpose of Istio?
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 2360
wordpress_url: http://blog.koehntopp.info/?p=2360
date: '2017-08-07 15:17:57 +0200'
date_gmt: '2017-08-07 13:17:57 +0200'
categories:
- Containers and Kubernetes
tags: []
---
<p>[caption id="attachment\_2361" align="aligncenter" width="490"][![](http://blog.koehntopp.info/wp-content/uploads/2017/08/mesh.jpg)](http://philcalcado.com/2017/08/03/pattern_service_mesh.html) [Service Mesh](http://philcalcado.com/2017/08/03/pattern_service_mesh.html)[/caption] An article by&nbsp;[Phil Calçado](http://philcalcado.com/2017/08/03/pattern_service_mesh.html) explains the Container Pattern "Service Mesh" and why one would want that in a really nice way. Phil uses early networking as an example, and explains how common functionality needed in all applications was abstracted out of the application code and moved into the network stack, forming the TCP flow control layer we have in todays networking. A similar thing is happening with other functionality that all services that do a form of remote procedure call have to have, and we are moving this into a different layer. He then gives examples of the ongoing evolution of that layer, from Finagle and Proxygen through Synapse and Nerve, Prana, Eureka and Linkerd. Envoy and the resulting Istio project of CNCF are the current result of that development, but the topic is under research, still.</p>
