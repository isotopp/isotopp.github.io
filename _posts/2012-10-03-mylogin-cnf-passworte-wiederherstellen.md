---
layout: post
published: true
title: ".mylogin.cnf Passworte wiederherstellen"
author-id: isotopp
date: 2012-10-03 10:37:53 UTC
tags:
- mysql
- security
- lang_de
feature-img: assets/img/background/mysql.jpg
---

Wie Todd Farmer in
[Understanding mysql_config_editor’s security aspects](http://mysqlblog.fivefarmers.com/2012/08/16/understanding-mysql_config_editors-security-aspects/)
richtig beobachtet, speichert die neue .mylogin.cnf, die von [mysql_config_editor](http://dev.mysql.com/doc/refman/5.6/en/mysql-config-editor.html)
erzeugt wird, Paßworte nicht sicher ab.  Sie verschleiert sie nur.

Das Format der Datei ist wie folgt (am Beispiel von MySQL 5.6.7-RC):

- 4 Bytes Zero (Version Information)
- 20 Bytes Key Generation Matter
- Wiederholend:
  - 4 Bytes Länge
  - Länge Bytes Ciphertext. Die Verschlüsselung erfolgt mit 
    [AES Encrypt](//dev.mysql.com/doc/refman/5.5/en//encryption-functions.html#function_aes-encrypt),
    und diese Funktion ist selbst auch nicht sicher: Es handelt sich um einen aes-128-ecb mit einem NULL IV.

Der Schlüssel, der in AES 128 rein geht, muß BINARY(16) sein, aber die
Funktion nimmt Strings beliebiger Länge.  Sie erzeugt den tatsächlich
verwendeten Key, indem sie den mitgegebenen String zyklisch in einen
BINARY(16) Puffer rein XOR't, der mit Nullbytes initialisiert worden ist.

In Code:

```php
#! /usr/bin/php  -q
<?php
$fp = fopen(".mylogin.cnf", "r");
if (!$fp) {
  die("Cannot open .mylogin.cnf");
}

# read key
fseek($fp, 4);
$key = fread($fp, 20);

# generate real key
$rkey = "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0";
for ($i = 0; $i < strlen($key); $i++) {
 $rkey[$i % 16] = ( $rkey[$i % 16] ^ $key[$i] );
}

# for each line
while ($len = fread($fp, 4)) {
  # as integer
  $len = unpack("V", $len);
  $len = $len[1];

  # decrypt  
  $crypt = fread($fp, $len);
  $plain = openssl_decrypt($crypt, 'aes-128-ecb', $rkey, true);

  # print
  print $plain;
}
```

Die Datei selber ist dann ein simples Textfile, nicht unähnlich einer
.my.cnf:

```console
server:~ # ./p.php
[default]
user = root
password = s3cret
host = localhost
[localhost]
user = root
password = s3cret
host = 127.0.0.1
```

Teil des Problems ist die Tatsache, daß das MySQL Protokoll das
Klartextpaßwort auf dem Client in lesbar braucht, um ein Login zu
ermöglichen.  Wir haben Alternativen in
[diesem Artikel](http://mysqldump.azundris.com/archives/96-pam-modules-for-MySQL-What-is-wrong-with-these-people.html)
diskutiert.  SSL Client Certs würden auch helfen.
