
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <malloc.h>

#include <getopt.h>

#include <mysql/mysql.h>

MYSQL mysql;

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
      case '?':
	printf("%s --options\n\n", argv[0]);
	printf("Options:\n");
	printf("--user=<username>\tLog in to MySQL server using this username (default: root).\n");
	printf("--password=<pass>\tLog in to MySQL server using this password (default: none).\n");
	printf("--host=<ip>\tLog in to MySQL server at this ip (default: 127.0.0.1).\n");
	printf("--port=<port>\tLog in to MySQL server on this port (default: 3306).\n");
	printf("--mode={slave-lag,slave-io-running,slave-sql-running,connections}\n");
	printf("\t\tslave-lag:         Check 'Seconds behind master'\n");
	printf("\t\tslave-io-running:  Check for 'Slave io running: Yes'\n");
	printf("\t\tslave-sql-running: Check for 'Slave sql running: Yes'\n");
	printf("\t\tconnections:       Check for 'Threads connected'\n");
	printf("--threshold-warn=<num>\tSet exit status to warning at this number (Default: 30).\n");
	printf("--threshold-err=<num>\tSet exit status to error at this number (Default: 60).\n");
	printf("\n");
	printf("--help:\tThis text.\n");
	printf("--debug:\tEnable debug output.\n");
	printf("\n");
	printf("Usage example:\n");
	printf("\t%s --user=root --password=g33k --host=192.168.0.1 --port=3340 --mode=slave-lag --threshold-warn=300 --threshold-err=600\n");
	printf("\tCheck that the slave is not lagging more than 300/600 seconds.\n");
	
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
  exit(0);
}
