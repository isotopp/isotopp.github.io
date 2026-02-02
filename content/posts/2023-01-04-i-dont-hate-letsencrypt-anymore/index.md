---
author: isotopp
title: "I don't hate Let's Encrypt anymore"
date: "2023-01-04T06:07:08Z"
feature-img: assets/img/background/schloss.jpg
tags:
  - lang_en
  - security
  - devops
aliases:
  - /2023/01/04/i-dont-hate-letsencrypt-anymore.html
---

So, Rachel is in a bad mood:
[Why I still have an old-school cert on my https site](https://rachelbythebay.com/w/2023/01/03/ssl/)
and I feel her.
Like her, for my own sites I have always been running Apache.
There was never much need to upgrade, the software was available, stable, and fast enough.

At some point in time, I needed TLS and started to use [Let's Encrypt](https://letsencrypt.org/).

That was messy: Running 
[dehydrated](https://github.com/dehydrated-io/dehydrated),
a bunch of haphazard shell scripts trying to get certificates authenticated and installed, through a wild chain of callbacks and sourced scripts all over the system,
driven by Cron, and with bad alerting.

None of that was necessary.

Turns out, starting with Apache 2.4.30 (19-Feb-2018), Apache supports 
[mod_md](https://httpd.apache.org/docs/trunk/mod/mod_md.html),
and that supports Let's Encrypt out of the box.
For good measure, I also enabled [mod_macro](https://httpd.apache.org/docs/current/mod/mod_macro.html).

This being an Ubuntu, I put this into my `/etc/apache2/sites-available/000-default.conf`:

```apacheconf
ServerName mybasedomain.koehntopp.de

MDomain mybasedomain.koehntopp.de contentdomain.koehntopp.de proxydomain.koehntopp.de
MDContactEmail user@example.com
MDCertificateAgreement accepted
MDPrivateKeys RSA 4096
```

There is no additional "SSLEngine" needed, except `SSLEngine on`.

I also add two macros that I use a lot to create virtual hosts to the same file.
One is for straight-up content domains:

```apacheconf
<Macro VHost $host>
    <VirtualHost *:80>
        ServerName $host
        ServerAdmin user@example.com

        DocumentRoot /var/www/$host
        <Directory /var/www/$host>
            Options Indexes FollowSymLinks
            AllowOverride None
            Require all granted
        </Directory>

        ErrorLog ${APACHE_LOG_DIR}/error-$host.log
        CustomLog ${APACHE_LOG_DIR}/access-$host.log combined

        RewriteEngine On
        RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]
    </VirtualHost>

    <VirtualHost *:443>
        ServerName $host
        ServerAdmin user@example.com

        ErrorLog ${APACHE_LOG_DIR}/error-$host.log
        CustomLog ${APACHE_LOG_DIR}/access-$host.log combined

        DocumentRoot /var/www/$host
        <Directory /var/www/$host>
            Options Indexes FollowSymLinks
            AllowOverride None
            Require all granted
        </Directory>

        SSLEngine on
    </VirtualHost>
</Macro>
```

The other is for Proxy Domains to dockerized stuff:

```apacheconf
<Macro ProxyVHost $host $toport>
    <VirtualHost *:80>
        ServerName $host
        ServerAdmin user@example.com

        DocumentRoot /var/www/$host
        <Directory /var/www/$host>
            Options Indexes FollowSymLinks
            AllowOverride None
            Require all granted
        </Directory>

        ErrorLog ${APACHE_LOG_DIR}/error-$host.log
        CustomLog ${APACHE_LOG_DIR}/access-$host.log combined

        RewriteEngine On
        RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]
    </VirtualHost>

    <VirtualHost *:443>
        ServerName $host
        ServerAdmin user@example.com

        ErrorLog ${APACHE_LOG_DIR}/error-$host.log
        CustomLog ${APACHE_LOG_DIR}/access-$host.log combined

        DocumentRoot /var/www/$host
        <Directory /var/www/$host>
            Options Indexes FollowSymLinks
            AllowOverride None
            Require all granted
        </Directory>

        SSLEngine on
        ProxyPreserveHost On
        ProxyPass "/" "http://127.0.0.1:$toport/" nocanon
        ProxyPassReverse "/" "http://127.0.0.1:$toport/"
        RequestHeader set X-Forwarded-Proto %{REQUEST_SCHEME}s
        RequestHeader set X-Forwarded-For %{REMOTE_ADDR}s
        RequestHeader set X-Real-IP %{REMOTE_ADDR}s
        AllowEncodedSlashes NoDecode
    </VirtualHost>
</Macro>
```

The actual host definition can then be rather short.
A content domain is simply

```console
# echo "Use Vhost contentdomain.koehntopp.de" > /etc/apache2/sites-available/contentdomain.koehntopp.de.conf
# a2ensite contentdomain.koehntopp.de
```

and I am done. Similarly, a proxy to some internal service:

```console
# echo "Use ProxyVHost proxydomain.koehntopp.de 3000" > /etc/apache2/sites-available/proxydomain.koehntopp.de.conf
# a2ensite proxydomain.koehntopp.de
```

where `3000` is the exposed port from docker. An `apachectl configtest` and an `apachectl graceful` later things are rolling.
A look at `/server-status` will tell you if things worked, and what the state of the `mod_md` deployment is.

If you added a new domain, that certificate will be available, but not yet loaded, so a second reload is necessary for deployment.

Find the actual cert files in `/etc/apache2/md/domains/mybasedomain.koehntopp.de`, as `pubcert.pem` and `privkey.pem`.

**Additional Note:**
You can use `mod_md` to get certificates for your Tailscale domains (Domains in the `*.ts.net` namespace).
