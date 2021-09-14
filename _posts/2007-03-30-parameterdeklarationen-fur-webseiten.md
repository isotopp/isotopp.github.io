---
layout: post
published: true
title: 'Parameterdeklarationen für Webseiten'
author-id: isotopp
date: '2007-03-30 11:47:38 UTC'
tags:
- php
- security
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---

Es ist mal wieder Zeit, sehr alte Hüte rauszukramen. Heute habe ich mir dienstlich eine Datenbank angesehen, die von PHP aus angesprochen wird. Das PHP, das dort verwendet wird, ist sehr loses PHP, also ohne die Verwendung eines großartiges Frameworks geschrieben. Entsprechend bin ich quasi sofort über SQL-Injections und XSS gefallen.

Denn schon nach kurzem Suchen findet man Code wie den folgenden: 

```php
$theValue = $_REQUEST['theValue'];
...
if ($theValue != "") {
  $where .= " where theColumn = '$theValue'";
}
```

Eigentlich hat der betrachtete Code eine `cleanup()`-Funktion, die für jeden Wert aufgerufen werden soll, und die nicht nur den Typ des Wertes deklariert, sondern auch das notwendige Escapen der Werte "in place" vornimmt.

Das ist aber in mehrfacher Hinsicht unschön.

Wenn man Code wie 

```php
$_REQUEST['theValue'] = cleanup($_REQUEST['theValue'], 'text')
```

schreibt, und vergisst diesen Cleanup-Aufruf einzufügen, dann haben wir keinen bemerkbaren Fehler: Der Folgecode, der auf `$_REQUEST['theValue']` zugreift, bekommt Werte zu sehen und bleibt nicht mit einer Fehlermeldung "Keine Inputreinigung vorgenommen!" stehen.

Außerdem sind die angewendeten Typprüfungen nicht flexibel genug und gehen nicht weit genug. 'text' erzeugt im betrachteten Code gerade mal ein `mysql_real_escape_string()`, aber wendet keine weitergehenden Prüfungen auf den Eingabewert ein. Außerdem werden Eingabewerte, die für die Seite gar nicht da sein dürfen, trotzdem akzeptiert und dann vielleicht ignoriert – vielleicht aber auch nicht.

(Das folgende Codebeispiel zum Runterladen: [input_validation.php.txt](/uploads/input_validation.php.txt" title="input_validation.php.txt" target="_blank))

Kurz gesagt: Was ich möchte ist eigentlich eine Typdeklaration für eine PHP-Seite, die die Eingabeparameter mit Namen und Typprüfungen deklariert.

```php
$cleaners = array(
  "county" => array( "check" => "text_regex", "pattern" => "[a-zA-Z0-9]+" ),
  "year"   => array( "check" => "int_minmax", "min" => 1834, "max" => 1864),
  "quarter" => array( "check" => "int_enum", "values" => array(1, 2, 3, 4) )
);
```

Ich will dann eine Eingabeprüfung, die ein Input-Array durchgeht und die Cleaners der Reihe nach anwendet. Das Resultat ist eine optionale Liste von Fehlern und ein gesäubertes Input-Array `$_CLEAN`, das vom `$_REQUEST`-Array verschieden ist.

```php
// simulated input
$_REQUEST = array(
  "county" => "someword",
  "year" => 1900,
  "quarter" => 3,
  "bogus" => "value"
);

// collect error messages
$_ERROR = array();

// clean it up
$_CLEAN = clean($_REQUEST, $cleaners, $_ERROR);

// the cleaned input
echo "cleaned input\n";
var_dump($_CLEAN);

// the error messages
echo "collected errors\n";
var_dump($_ERROR);
```

Fehlt der `clean()`-Aufruf am Anfang einer Seite, ist `$_CLEAN` leer und späterer Code, der `$_CLEAN` referenziert, kann nicht funktionieren – der Fehler wird sofort bemerkt.

`$_CLEAN` kann nur Werte enthalten, deren Namen als Keys in `$cleaners` deklariert sind – undeklarierte Eingabewerte existieren nicht mehr in unserem Programm. `$_CLEAN` kann außerdem nur Werte enthalten, für die die in `$cleaners[$k]['check']` deklarierten Checkerfunktionen existieren – Deklarationsfehler bei Checkerfunktionen führen zu Programmabbruch und werden so sofort bemerkt. Schließlich kann `$_CLEAN` nur Werte enthalten, für die die angegebenen Checkerfunktionen erfolgreich waren.

Eine Checkerfunktion hat den Namen `check_...` und gibt ein Paar (Wert, Fehlermeldung) zurück. Wenn der Wert `NULL` ist, ist eine Fehlermeldung vorhanden und kann eingesammelt werden – der Checker ist fehlgeschlagen. In allen anderen Fällen ist der Checker erfolgreich.

Diese Bedingungen sind schnell runtergeschrieben und sehen in Code dann so aus:

```php
function clean($R, $cleaners, &$E = "") {
  // collected results in $C, collect errors in $E (which is optional)
  $C = array();

  // scan the request variables
  foreach ($R as $k => $v) {
    // Check for bogus values.
    if (! array_key_exists($k, $cleaners)) {
      if (DEBUG) echo "*** WARNING: Skipped bogus value $k => $v\n";
      continue;
    }
    // If we make it to here, the value should be imported.

    // generic cleanup
    $v = get_magic_quotes_gpc() ? stripslashes($v) : $v;
    $v = function_exists("mysql_real_escape_string") ?
               mysql_real_escape_string($v) : 
               mysql_escape_string($v);
    // The value can be imported only, if the specified cleaner exists.
    $checkfun = "check_" . $cleaners[$k]['check'];
    if (function_exists($checkfun)) {
      // $c will then be the sanitized value
      list($c, $e) = $checkfun($k, $v, $cleaners[$k]);
    } else {
      die("*** ERROR: $k => $v fails ".
        "because specified checkfun $checkfun does not exist.\n");
    }
    
    // The value can be imported only, if the specified cleaner succeeded.
    if (isset($c)) {
      if (DEBUG) echo "Import $k's value of $v as $c\n"; 
      $C[$k] = $c;
      if (isset($e)) $E[$k] = $e; // collect error anyway
    } else {
      if (DEBUG) echo "*** WARNING: Not importing $k, ".
        "because $v failed $checkfun().\n";
      $E[$k] = $e; // collect error
    }
  }
  
  return $C;
}
```

Jetzt müssen wir nur noch Checkfunktionen schreiben, die die eigentlichen Prüfungen ausführen. In unserem Fall wollen wir noch die folgenden Konventionen gelten lassen: 

- Jede `checkfun` hat einen Parameter `default`, der einen von `NULL` verschiedenen Default-Wert definieren kann. In diesem Fall schlägt der Check nie fehl, sondern returned den spezifizierten Default-Wert. Eine eventuell erzeugte Fehlermeldung wird dennoch eingesammelt, hat dann aber mehr den Character einer Warnung.
- Für jeden Parameter `p` einer checkfun wollen wir optional auch die Definition eines Fehlermeldungs-Parameters `p_err` zulassen, mit dem die Fehlermeldung überschrieben werden kann, den die checkfun generiert, wenn der Test für `p` fehlschlägt. Einige Beispiele werden das klarer machen.

Hier ist der `regexp`-Test: 

```php
function check_text_regex($k, $v, $par) {
  $pattern     = $par['pattern'];
  $pattern_err = "check_text_regex: ".
                 (array_key_exists('pattern_err', $par)?
                 $par['pattern_err']:
                 "$v did not match $pattern.");
  $default     = array_key_exists('default', $par)?$par['default']:NULL;

  if (DEBUG) echo "In check_text_regex: k=$k v=$v pattern= $pattern\n";
  
  if (preg_match("/^$pattern\$/", $v))
    return array($v, NULL);
  else
    return array($default, $pattern_err);
}
```

Der Test prüft, ob der Wert `$v` dem regulären Ausdruck `$par['pattern']` genügt. Wenn ja, wird `$v` ohne Fehlermeldung zurückgegeben. Wenn nein, wird `$par['default']` zusammen mit der Fehlermeldung `$par['pattern_err']` zurückgegeben.

Entsprechend der `minmax`-Test: 

```php
function check_int_minmax($k, $v, $par) {
  $min     = $par['min'];
  $min_err = "check_int_minmax: ". 
             (array_key_exists('min_err', $par)?
             $par['min_err']:"$v < $min.");
  $max = $par['max'];
  $max_err = "check_int_minmax: ". 
             (array_key_exists('max_err', $par)?
             $par['max_err']:"$v > $max.");
  $default = array_key_exists('default', $par)?$par['default']:NULL;
  
  if (DEBUG) echo "In check_int_minmax: k=$k v=$v min=$min max=$max\n";
  $v = intval($v);
  if ($v < $min)
    return array($default, $min_err);
  if ($v > $max)
    return array($default, $max_err);

  return array($v, NULL);
}
```

Dieser Test folgt demselben System: Wenn der Wert `$v` zwischen `$min` und `$max` liegt, wird er ohne Fehlermeldung zurückgegeben. Andernfalls wird $default und eine Fehlermeldung erzeugt. Die Fehlermeldungen können dabei als `$min_err` und `$max_err` spezifiziert werden, der `$default` ist `NULL`.

Und der `int_enum`-Test, um das Beispiel vollständig zu machen: 

```php
function check_int_enum($k, $v, $par) {
  $values      = $par['values'];
  $valuestring = join(",", $values);
  $values_err  = "check_int_enum: ".
                 (array_key_exists('values_err', $par)?
                 $par['values_err']:"$v not in $valuestring.");
  $default     = array_key_exists('default', $par)?$par['default']:NULL;
  
  if (DEBUG) echo "In check_int_enum: k=$k v=$v values=($valuestring)\n";
  $v = intval($v);
  
  if (array_search($v, $values) === false)
    return array($default, $values_err);

  return array($v, NULL);
  
}
```

Auch hier werden die Konventionen befolgt: `$default` und die Fehlermeldung `$values_err`, wenn der gegebene Wert `$v` nicht im `$values`-Array vorkommt, sonst `$v` und keine Fehlermeldung.

Mit diesem Code und ein wenig Suchen und Ersetzen sollte sich jede framework-freie PHP-Seite schnell auf eine harte Deklaration von Eingabeparametern umstellen lassen: 

- `$cleaners` definieren
- Alle Vorkommen von `$_REQUEST` durch `$_CLEAN` ersetzen
- globals `$_CLEAN` nachrüsten, weil `$_CLEAN` kein Superglobal ist
- Aufruf von `clean()` an passender Stelle einfügen, ggf. Fehlerbehandlung in `$_ERROR` vornehmen

Nein, auch das ist nicht 100% wasserdicht, dürfte aber das meiste Feld-, Wald- und Wiesen-PHP schon mal gründlich gegen die größten Dummheiten schützen.

Und das alles mit weniger als 60 Minuten Codieraufwand. Vielleicht sollte man eine Extension draus machen, und die so konfigurieren, daß sie die echten `$_REQUEST`, `$_GET`, `$_POST`, `$_FILES` und `$_COOKIE` verbirgt und durch zwangsweise von `clean()` generierte Arrays gleichen Namens ersetzt.PHP-Seiten ohne `$cleaners[]`-Array können dann gar keine Parameter mehr im Zugriff haben.
