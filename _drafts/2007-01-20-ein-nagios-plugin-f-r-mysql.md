---
layout: post
published: true
title: Ein Nagios-Plugin für MySQL
author-id: isotopp
date: 2007-01-20 04:00:00 UTC
tags:
- monitoring
- mysql
- lang_de
feature-img: assets/img/background/rijksmuseum.jpg
---
<u></u><u></u><!-- s9ymdb:3519 --><img width='110' height='57' style="float: right; border: 0px; padding-left: 5px; padding-right: 5px;" src="/uploads/mysql_logo.serendipityThumb.gif" alt="" /> Auf Sourceforge findet man <a href="http://nagiosplug.sourceforge.net/developer-guidelines.html">Plug-in development guidelines</a> für den Nagios Netzwerkmonitor. Demnach ist es trivial, Nagios-Plugins zu entwickeln: Der Check ist ein externes Programm, das den Returncode 0, 1 oder 2 zurück gibt und eine einzeilige Nachricht auf stdout druckt.

Tun wir das doch mal für MySQL: Wir wollen die Anzahl der Threads_connected überwachen und den Replikationsstatus: SQL-Thread und IO-Thread müssen laufen und der Slave-Lag darf nicht zu groß sein.

Wir schreiben das Plugin in C, damit wir zugleich mal lernen, die MYSQL Client-API in C zu verwenden - Shellscripte, die sich das abbrechen gibt es ja schon genug.

Der gesamte Quelltext aus diesem Beispiel kann hier runtergeladen werden: <a href="/uploads/check_mysql.c">check_mysql.c</a>

Unser Programm soll eine Reihe von Optionen verarbeiten. Wir lesen die Optionen mit GNU <a href="http://www.cs.duke.edu/courses/spring04/cps108/resources/getoptman.html">getopt_long</a>. Die Funktion braucht eine Optionsliste in einem struct options Array, in dem wir die Optionen deklarieren.

Wir wollen: --mode={slave-lag,slave-io-running,slave-sql-running,connections}, --threshold-warn=x, --threshold-err=x und die üblichen MySQL Connection-Options (--user, --password, --host und --port). In Code sieht das so aus:


{% highlight console %}
struct option long_options[] = {
        { "host", 1, 0, 'h' },
        { "user", 1, 0, 'u' },
        { "password", 1, 0, 'p' },
        { "port", 1, 0, 'P' },
        { "mode", 1, 0, 'm' },
        { "threshold-warn", 1, 0, 't'},
        { "threshold-err", 1, 0, 'T' },
        { "debug", 1, 0, 'd'},
        { "help", 1, 0, '?' },
        { NULL, 0,0,0 }
};

typedef enum {
  unspecified,
  slave_lag,
  slave_io_running,
  slave_sql_running,
  connections
} mode_t;

char *host     = "127.0.0.1";
char *user     = "root";
char *password = "";
int   port     = 3306;
mode_t mode    = unspecified;
int   threshold_warn= 30;
int   threshold_err = 60;
int   debug    = 0;
{% endhighlight %}


Die Optionen werden dann wie folgt eingelesen:


{% highlight console %}
void parse_args(int argc, char *argv[]) {
  int   c;
  int   optind = 0;
  char *myarg = NULL;

  while (1) {
    c = getopt_long(argc, argv, "h:u:p:P:m:t:T:d?", long_options, &optind);
    if (c == -1)
      break;

    if (optarg) {
      myarg = strdup(optarg);
      if (!myarg) {
        printf("CRIT: Out of memory in strdup!\n");
        exit(2);
      }
    }

    switch(c) {
      case '?': // Hilfstext
        exit(2);
      break;

      case 'h':
        host = myarg;
      break;

      case 'u':
        user = myarg;
      break;

      case 'p':
        password = myarg;
      break;

      case 'P':
        port = atoi(myarg);
        free(myarg);
      break;

      case 'm':
        if (strcmp(myarg, "slave-lag") == 0) {
          mode = slave_lag;
        } else if ( strcmp(myarg, "slave-io-running") == 0 ) {
          mode = slave_io_running;
        } else if ( strcmp(myarg, "slave-sql-running") == 0 ) {
          mode = slave_sql_running;
        } else if ( strcmp(myarg, "connections") == 0 ) {
          mode = connections;
        } else {
          mode = unspecified;
        }

        free(myarg);
      break;

      case 't':
        threshold_warn = atoi(myarg);
        free(myarg);
      break;

      case 'T':
        threshold_err = atoi(myarg);
        free(myarg);
      break;

      case 'd':
        debug = atoi(myarg);
        free(myarg);
      break;

      default:
        printf("CRIT: Unknown option: %c\n", c);
        exit(2);
      break;
    }
  }

  return;
}

{% endhighlight %}


Der Formatkram wäre damit erledigt: Wir haben ein Programm, das die gewünschten Kommandozeilenoptionen einlesen kann und an die Arbeit gehen könnte.

Die Arbeit besteht bei uns darin, an ein MySQL zu connecten, eine Query auszuführen, das einzeilige Resultat zu lesen und eine bestimmte Spalte aus dem Resultat auszuschneiden, um diese als String zurück zu geben.

Die Funktion run_query() tut dies für uns:


{% highlight console %}
char *run_query(MYSQL *m, char *cmd, int col) {
  MYSQL_ROW  row;
  MYSQL_RES *res;

  if (debug)
    fprintf(stderr, "Field %d of query %s\n", col, cmd);

  if (mysql_real_query(m, cmd, strlen(cmd)) != 0) {
    printf("CRIT: Query %s failed: %s\n",
      cmd,
      mysql_error(m)
    );
    exit(2);
  }

  res = mysql_store_result(m);
  if (!res) {
    printf("CRIT: Query %s failed: %s\n",
      cmd,
      mysql_error(m)
    );
    exit(2);
  }

  if (row = mysql_fetch_row(res)) {
    unsigned int   num_fields = mysql_num_fields(res);
    unsigned long *len        = mysql_fetch_lengths(res);

    if (col < num_fields) {
      if (debug)
        fprintf(stderr, "Result column %d returns value \"%s\" (length %d)\n", col, row[col], len[col]);
      return len[col]?strndup(row[col], len[col]):0;
    } else {
      printf("CRIT: Query cmd does not return %d fields (it returns %d fields).\n",
        cmd,
        col,
        num_fields
      );
      exit(2);
    }
  }

  mysql_free_result(res);

  return NULL;
}

{% endhighlight %}


Die Funktion bekommt eine bestehende MySQL-Verbindung m als Parameter übergeben, zudem eine SQL-Query cmd und eine Spaltennummer, die aus dem einzeiligen Resultset der Query ausgesägt werden soll. Intern brauchen wir eine MYSQL_ROW row und einen Resultset MYSQL_RES res.

Die Query wird mit mysql_real_query() an den Server gesendet. Wenn dabei kein Fehler gemeldet wird, können wir den gesamten Resultset mit mysql_store_result() zum Client nach res kopieren. Der Server ist damit fertig.

Auf dem Client lesen wir nun mit mysql_fetch_row(res) eine Zeile aus dem Resultset. Diese Zeile hat mysql_num_fields(res) viele Spalten, deren Längen man mit mysql_fetch_length() bestimmen kann. Wenn unser gewünschtes Zielfeld im Datensatz enthalten ist (col < num_fields), dann duplizieren wir das und sind fertig (Nunja, gemogelt: Wir hätten noch mysql_free_result() aufrufen müssen, aber wir machen sowieso gleich exit()).

Ansonsten beklagen wir uns gar bitterlich und sind dann fertig.

Im Hauptprogramm müssen wir nun eine Connection öffnen und dann je nach Mode die passenden Sachen checken. Erstmal eine Connection bauen.


{% highlight console %}
int main(int argc, char *argv[]) {

  parse_args(argc, argv);
  if (mode == unspecified) {
    printf("CRIT: No or wrong mode specified. Specify --mode={slave-lag,slave-io-running,slave-sql-running,connections}\n");
    exit(2);
  }

  if (debug)
    fprintf(stderr, "Connect to %s:%d with %s:%s for test %d with threshold_warn %d and threshold_err %d.\n",
      host,
      port,
      user,
      password,
      mode,
      threshold_warn,
      threshold_err
    );

  mysql_init(&mysql);

  if (!mysql_real_connect(&mysql, host, user, password, "mysql", port, NULL, 0)) {
    printf("CRIT: Cannot connect to database: Error: %s\n",
      mysql_error(&mysql));
    exit(2);
  }
  if (debug)
    printf("Connected...\n");

{% endhighlight %}


Jetzt können wir je nach mode unterschiedliche Dinge tun. Zum Beispiel den Slave Lag checken:


{% highlight console %}
  if (mode == slave_lag) {
    int   lag;
    char *p;

    p = run_query(&mysql, "show slave status", 32);
    if (p == NULL) {
      printf("CRIT: Slave lag NULL\n");
      exit(2);
    }

    lag = atoi(p);
    free(p);
    if (lag > threshold_err) {
      printf("CRIT: Slave lag %d sec exceeds threshold_err %d sec\n", lag, threshold_err);
      exit(2);
    }
    if (lag > threshold_warn) {
      printf("WARN: Slave lag %d sec exceeds threshold_warn %d sec\n", lag, threshold_warn);
      exit(1);
    }

    printf("OK: Slave lag %d is inside tolerance.\n", lag);
    exit(0);
  }

{% endhighlight %}


Oder Slave-IO und Slave-SQL testen:


{% highlight console %}
  if (mode == slave_io_running) {
    char *p;

    p = run_query(&mysql, "show slave status", 10);
    if (p == NULL) {
      printf("CRIT: Slave io not running\n");
      exit(2);
    }

    if (strcmp(p, "Yes") != 0) {
      printf("CRIT: Slave io not running: result is %s\n", p);
      exit(2);
    }

    printf("OK: Slave io is running.\n");
    exit(0);
  }

  if (mode == slave_sql_running) {
    char *p;

    p = run_query(&mysql, "show slave status", 11);
    if (p == NULL) {
      printf("CRIT: Slave sql not running\n");
      exit(2);
    }

    if (strcmp(p, "Yes") != 0) {
      printf("CRIT: Slave sql not running: result is %s\n", p);
      exit(2);
    }

    printf("OK: Slave sql is running.\n");
    exit(0);
  }

{% endhighlight %}


Oder eben die Anzahl der Threads_connected prüfen und ggf. anmeckern:


{% highlight console %}
  if (mode == connections) {
    char *p;
    int   conn = 0;

    p = run_query(&mysql, "show global status like 'Threads_connected'", 1);
    if (p == NULL) {
      printf("CRIT: No connection information available.\n");
      exit(2);
    }

    conn = atoi(p);
    free(p);

    if (conn > threshold_err) {
      printf("CRIT: Threads_connected %d exceeds threshold_err %d\n", conn, threshold_err);
      exit(2);
    }
    if (conn > threshold_warn) {
      printf("WARN: Threads_connected %d exceeds threshold_warn %d\n", conn, threshold_warn);
      exit(1);
    }

    printf("OK: Threads_connected %d\n", conn);
    exit(0);
  }

{% endhighlight %}


Compiled wird so:


{% highlight console %}
LIBS=-lmysqlclient
CFLAGS=-g

all:    check_mysql

check_mysql:    check_mysql.c
        cc $(CFLAGS) -o check_mysql check_mysql.c $(LIBS)

{% endhighlight %}


Und im Nagios kann man dann in /etc/nagios/checkcommands.cfg definieren:


{% highlight console %}
define command {
    command_name check_mysql_status
    command_line /usr/lib/nagios/plugins/custom/check_mysql --mode=$ARG1$  -h $HOSTALIAS$ -u monitor -p g33k  $ARG2$
}

{% endhighlight %}


Ein Service kann dann definiert werden als


{% highlight console %}
define service {
    name                template-mysql-slave-lag
    use                 template-standardhost
    register            0
    service_description MySQL slave-lag
    check_command       check_mysql_status!slave-lag!--threshold-warn=600 --threshold-err=900
    }

{% endhighlight %}

