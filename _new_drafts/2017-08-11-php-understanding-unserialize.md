---
layout: post
status: publish
published: true
title: 'PHP: Understanding unserialize()'
author: isotopp
author_login: kris
author_email: kristian.koehntopp@gmail.com
wordpress_id: 2407
wordpress_url: http://blog.koehntopp.info/?p=2407
date: '2017-08-11 13:50:20 +0200'
date_gmt: '2017-08-11 11:50:20 +0200'
categories:
- Hackerterrorcybercyber
- Erklärbär
- PHP
tags: []
---
<p>The history of serialize() and unserialize() in PHP begins with Boris Erdmann and me, and we have to go 20 years back in time. This is the day of the prerelease versions of PHP 3, [some time in 1998](http://marc.info/?l=php-general&amp;m=90222513233060&amp;w=2). Boris and I were working on Code for a management system for employee education for German Telekom. The front side is a web shop that sells classes and courses, the back end is a complex structure that manages attendance, keeps track of a line manager approval hierarchy and provides alternative dates for overfull classes. In order to manage authentication, shopping carts and other internal state, we needed something that allowed us to go from a stateless system to a stateful thing, securely. The result was [PHPLIB](https://github.com/bevhost/phplib), and especially the code in [session.inc](https://github.com/bevhost/phplib/blob/master/inc/session.inc#L272-L318). That code contained a function serialize(), which created a stringified representation of a PHP variable and appended it to a string. There was no unserialize() necessary, because serialize() generated PHP code. eval() would unserialize().<!--more--> **One of the problems** we had to solve was that PHP3 was slow. So if we were to write out a serialized representation of variables, we would have to write a parser for that, and that parser better be fast, because it would be executed at the beginning of each and every page load. We already had such a parser, and it was the fastest parser available, PHP itself. So we decided to write a function that takes a variable, recurses through that variable and generated PHP code to recreate the variable if that code would be executed. For scalars, [that is trivial](https://github.com/bevhost/phplib/blob/master/inc/session.inc#L313). For an array, [that is possible with a simple recursion over each element](https://github.com/bevhost/phplib/blob/master/inc/session.inc#L313). For objects, things are complicated. Firstly, in PHP3, an object does not have the slightest clue what it's classname is. Secondly, an object might have instance variables that we do not want to be part of the stringified representation of the object, for example file and image file handles or other resources. We solved both problems by requiring serializable objects to have metadata instance variables, "classname" and "persistent\_slots". For unserialize, we simply executed that code inside an eval(). From PHP 4 onward, Sascha Schumann wrote a C implementation of session management that became a standard part of PHP, which was largely based on our ideas. Unlike us, he made PHP store session data in the filesystem, inheriting our idea of probabilistic session expiration. He also converted the data format from PHP Code to the current representation. **Another problem that needed adressing was code uniformity:** If you load a serialized object written by another web page of your application, that object has a class. And the code for that class needs to be loaded before you can load and re-instantiate that object. Basically, you saved an instance $a of DemoClass, and if you load that instance again, running unserialize() on it, PHP needs to know what a DemoClass is and how to make one, using "$a = new DemoClass()", before it can fill in the values of all instance variables. So the includes of your app better be the same on all pages, or you invent the [Autoloader](http://php.net/manual/en/function.autoload.php). The Autoloader originally was a simple callback function that would be invoked every time you want to make an instance of an unknown class. The function would get the name of the missing class as a parameter, and would then be responsible to produce a class definition for that class.</p>
<p>    function \_\_autoload($missing) { echo "Class $missing is missing."; include("$missing.class.php"); } $a = new DoesNotExist(); } {% endhighlight %} This is your classic suicide autoloader: Whenever an undefined class is being encountered, \_\_autoload() is being called with that classname. It would then try to include a file with that name (and all dots and slashes that you manage to falsify into that name) and hope that this would contain code that defined a class with a matching name. Real autoloaders should not look like this (but often they are close enough to this code to contain exploitable security problems). Today the autoload mechanism of PHP is more complicated. It has a [default autoloader](http://php.net/manual/en/function.spl-autoload.php), [a mechanism to manage a stack of autoloaders](http://php.net/manual/en/function.spl-autoload-register.php), and a bunch of [other](http://php.net/manual/en/function.spl-autoload-extensions.php) [things](http://php.net/manual/en/function.include.php)&nbsp;such as file extensions and include path names to influence all that. It is also quite good, [even if more sophisticated serializers exist](https://github.com/Sereal/Sereal/blob/master/README.pod). **So what is the state of unserialize() in PHP these days, and why?** &nbsp; [caption id="attachment\_2408" align="aligncenter" width="604"][![](http://blog.koehntopp.info/wp-content/uploads/2017/08/Screen-Shot-2017-08-11-at-13.44.00.png)](https://twitter.com/nikita_ppv/status/895571304325062656) [That was controversial](https://twitter.com/nikita_ppv/status/895571304325062656)[/caption] It links to this: [caption id="attachment\_2409" align="aligncenter" width="640"][![](http://blog.koehntopp.info/wp-content/uploads/2017/08/do-not-unserialize-foreign-code-640x379.png)](http://php.net/unserialize) [Really Good Advice™](http://php.net/unserialize)[/caption] People object: [caption id="attachment\_2410" align="aligncenter" width="605"][![](http://blog.koehntopp.info/wp-content/uploads/2017/08/how-does-this-solve-anything.png)](https://twitter.com/buherator/status/895933031529275392) [People object](https://twitter.com/buherator/status/895933031529275392)[/caption] but given the little tour above, you should be able to understand how unserialize() cannot really be made safe for import of foreign data. You can unserialize() stuff your code has written, after having verified that the data you read still is the data you have written, using salted hash\_hmac()s on said data. That's going to be reasonably safe. You can't, ever, use unserialize() as a data interchange format with other application or an end user. unserialize() is not an exposable API. Never was. Other functions and formats for this exist. Use those. &nbsp; Here is some code to try: </p>
<p>         #! /usr/local/bin/php <?php function show_serialize1() {<br />
          $a = 1;<br />
          $str = serialize($a);<br />
          file_put_contents("demo", $str);<br />
        }</p>
<p>        function show_serialize2() {<br />
          $a = array("fnorp", "glorp", "dorp");<br />
          $str = serialize($a);<br />
          file_put_contents("demo", $str);<br />
        }</p>
<p>        function show_serialize3() {<br />
          class DemoClass {<br />
            private $priv = 'priv';<br />
            protected $prot = 'prot';<br />
            public $pub = 'pub';</p>
<p>            public function __construct() {<br />
              echo "Constructed.\n";<br />
            }</p>
<p>            public function __sleep() {<br />
              echo "To be serialized\n";<br />
              return array('priv', 'prot', 'pub');<br />
            }</p>
<p>            public function __wakeup() {<br />
              echo "Just unserialized.\n";<br />
            }<br />
          }</p>
<p>          $a = new DemoClass();<br />
          $str = serialize($a);<br />
          file_put_contents("demo", $str);<br />
        }</p>
<p>        function show_serialize4() {<br />
          $a = array(1);<br />
          $a[] = &$a[0];</p>
<p>          $b = &$a[0];</p>
<p>          $a[1] = 2;<br />
          echo "References inside an array work:\n";<br />
          print_r($a);</p>
<p>          echo "References across unserialize:\n";<br />
          $b = unserialize(serialize($a));</p>
<p>          echo "b is unserialized a:";<br />
          print_r($b);</p>
<p>          echo "Does the ref still work?\n";<br />
          $b[1] = 3;<br />
          print_r($b);</p>
<p>        }</p>
<p>        function show_unserialize1() {<br />
          $str = file_get_contents("demo");<br />
          $x = unserialize($str);</p>
<p>          print_r($x);<br />
        }</p>
<p>        function define_democlass($class = "none") {<br />
          echo "We want $class defined.\n";</p>
<p>          class DemoClass {<br />
            private $priv = 'fnorp';<br />
            protected $prot = 'glorp';<br />
            public $pub = 'dorp';</p>
<p>            public function __construct() {<br />
              echo "Constructed.\n";<br />
            }</p>
<p>            public function __sleep() {<br />
              echo "To be serialized\n";<br />
              return array('priv', 'prot', 'pub');<br />
            }</p>
<p>            public function __wakeup() {<br />
              echo "Just unserialized.\n";<br />
            }<br />
          }<br />
        }</p>
<p>        function show_unserialize2() {<br />
          spl_autoload_register('define_democlass');</p>
<p>          $str = file_get_contents("demo");<br />
          $x = unserialize($str);</p>
<p>          print_r($x);<br />
        }</p>
<p>        if (! isset($argv[1])) {<br />
          echo "Please start with 'ser' or 'unser'\n";<br />
          exit(1);<br />
        }</p>
<p>        switch($argv[1]) {<br />
          case "ser1":<br />
            show_serialize1();<br />
            break;</p>
<p>          case "ser2":<br />
            show_serialize2();<br />
            break;</p>
<p>          case "ser3":<br />
            show_serialize3();<br />
            break;</p>
<p>          case "ser4":<br />
            show_serialize4();<br />
            break;</p>
<p>          case "unser1":<br />
            show_unserialize1();<br />
            break;</p>
<p>          case "unser2":<br />
            show_unserialize2();<br />
            break;</p>
<p>          default:<br />
            echo "Wot?\n";<br />
            exit(1);<br />
        }</p>
<p>        {% endhighlight %}</p>
<p>        You can use this to see what serialized data looks like:</p>
<pre lang="bash"> $ ./probe.php ser1; cat demo; echo i:1; {% endhighlight %} More complicated stuff such as arrays: </p>
<p>             $ ./probe.php ser2; cat demo; echo a:3:{i:0;s:5:"fnorp";i:1;s:5:"glorp";i:2;s:4:"dorp";} {% endhighlight %} Also, references half-work, if they are internal: </p>
<p>                 $ ./probe.php ser4 References inside an array work: Array ( [0] =\> 2 [1] =\> 2 ) References across unserialize: b is unserialized a:Array ( [0] =\> 2 [1] =\> 2 ) Does the ref still work? Array ( [0] =\> 3 [1] =\> 3 ) {% endhighlight %} but serializing a reference $b that points to $a does not work: The value $b is referencing is saved, and the unserialized variable will have a value, but will not reference the previous value. There is no error or warning. Here is what we do to Objects: </p>
<p>                     $ ./probe.php ser3; cat demo; echo Constructed. To be serialized O:9:"DemoClass":3:{s:15:"DemoClasspriv";s:4:"priv";s:7:"\*prot";s:4:"prot";s:3:"pub";s:3:"pub";} {% endhighlight %} This shows how the contructor is being executed, how the \_\_sleep() callbacks is called and the content of the serialized file with the stringified DemoClass instance referencing the class name. If we load this without DemoClass being defined, we get </p>
<p>                         $ ./probe.php unser1 \_\_PHP\_Incomplete\_Class Object ( [\_\_PHP\_Incomplete\_Class\_Name] =\> DemoClass [priv:DemoClass:private] =\> priv [prot:protected] =\> prot [pub] =\> pub ) {% endhighlight %} We can load DemoClass using an autoloader we define. Then we get </p>
<p>                             $ ./probe.php unser2 We want DemoClass defined. Just unserialized. DemoClass Object ( [priv:DemoClass:private] =\> priv [prot:protected] =\> prot [pub] =\> pub ) {% endhighlight %} You can see the Autoloader being called, the \_\_wakeup function running (it didn't in the example before!) and then the properly re-instantiated object. Note that our new version of DemoClass, as defined by the autoloader, does define different default values for the instance variables so we can show that the values from the file are being loaded. </p>
