/**************************************************************************
*
* Programm stats.c
*
* Uebersicht ueber Login-Zeiten auf allen Ports ueber alle User:
*
* Written in 1989 by Kristian Koehntopp
* This code is hereby placed into the public domain.
*
**************************************************************************/

/**************************************************************************
* Includes
**************************************************************************/

#include <sys/types.h>
#include <stdio.h>
#include <string.h>
#include <time.h>
#include <utmp.h>

extern void printf();
extern void exit();
extern void qsort();
extern void fprintf();
extern int getopt();
extern char *getlogin();
extern int fread();
extern void fclose();
extern long time();

/**************************************************************************
* Defines
**************************************************************************/

/* MAXLINE - Anzahl der Port-IDs incl. aller Console-Terminals,
die auftreten koennen. Anzahl kann grosszuegig geschaetzt
werden.
*/
#define MAXLINE 50
/* MAXUSER - Anzahl der Login-IDs die auftreten koennen, auch schaetzen.
*/
#define MAXUSER 500

/**************************************************************************
* Datentypen
**************************************************************************/

/* Line-Struktur, Hilfsstruktur fuer die Ausgabe
*/

struct line {
    char line[4];               /* Line-ID */
    time_t time;                /* Zeit per Line */
};

/* Port-Struktur, enthaelt aufgelaufene Summe und noch offene Teilsumme
fuer eine Leitung.
*/

struct port {
    time_t ltg;                 /* bisherige Summe */
    time_t tim;                 /* noch offenstehende Leitung */
};

/* User-Struktur, enthaelt Usernamen, Summe fuer jeden Port und eine
Gesamtsumme.
*/

struct user {
    char name[8];               /* login Name */
    struct port line[MAXLINE];  /* Summen ueber alle Leitungen */
    long gesamt;                /* Gesamtsumme */
};

/**************************************************************************
* Globale Variablen
**************************************************************************/

struct user u[MAXUSER];         /* Liste aller User */
long maxuser = 0;               /* Pointer auf Obergrenze array */
char l[MAXLINE][4];             /* Liste aller Lines */
long maxline = 0;               /* Pointer auf Obergrenze array */
struct utmp mytmp;              /* fread-Buffer */

/**************************************************************************
* void inituser(void)
*
* Initialisieren des User-Arrays u[MAXUSER]
**************************************************************************/

void inituser()
{
    long i, j;


    for (i = 0; i < MAXUSER; i++) {
        u[i].name[0] = '\0';
        for (j = 0; j < MAXLINE; j++) {
            u[i].line[j].ltg = 0;
            u[i].line[j].tim = 0;
        }
        u[i].gesamt = 0;
    }
}


/**************************************************************************
* long getline(char *)
*
* Liefert Nummer des Eintrages im Lines-Verzeichnis zu einer Line-Id zu-
* rueck. Wenn die Line noch nicht bekannt war, wird ein neuer Eintrag
* alloziert und maxline incrementiert. Wird dabei MAXLINE ueberschritten,
* bricht das Programm ab (exit(1)).
**************************************************************************/

long getline(line)
char *line;

{
    long aline;
    long i;

    for (i = 0; i < maxline; i++) {
        if (strncmp(line, l[i], 4) == 0)
            return (i);
    }
    strncpy(l[maxline], line, 4);
    if ((++maxline) > MAXLINE) {
        printf("*** SHOW: Zu viele Line-ID's (%ld).\n", maxline);
        exit(1);
    }
    return (maxline - 1);
}


/**************************************************************************
* struct user *finduser(char [])
*
* Liefert den Zeiger auf den passenden Eintrag in der Userliste zum
* Namen username zurueck. Wenn der Eintrag in der Userliste u[MAXUSER]
* noch nicht existiert, wird ein neuer Eintrag alloziert und maxuser
* incrementiert. Wird dabei MAXUSER ueberschritten, bricht das Programm
* ab (exit(2)).
**************************************************************************/

struct user *finduser(username)
char username[];
{
    long i;

    for (i = 0; i < maxuser; i++) {
        if (strncmp(username, u[i].name, 8) == 0)
            return (&u[i]);
    }
    strncpy(u[maxuser].name, username, 8);
    if ((++maxuser) > MAXUSER) {
        printf("*** SHOW: Zuviele User-ID's (%ld)\n", maxuser);
        exit(2);
    }

    return (&u[maxuser - 1]);
}

/**************************************************************************
* void deadbuchen(struct utmp *)
* void initbuchen(struct utmp *)
*
* Zwei Hilfsfunktionen, Beschreibung siehe verbuchen()
**************************************************************************/

void deadbuchen(mytmp)
struct utmp *mytmp;
{
    long i, aline, atime;

    for (i = 0; i < maxuser; i++)       /* Fuer alle User */
        for (aline = 0; aline < MAXLINE; aline++)       /* und alle Lines */
            if (u[i].line[aline].tim != 0) {    /* Steht noch was offen? */
                /* Differenz bestimmen: atime = login-logout */
                atime = mytmp->ut_time - u[i].line[aline].tim;

                /* atime auf Konten buchen */
                u[i].line[aline].ltg += atime;
                u[i].gesamt += atime;

                /* und login-Zeit loeschen */
                u[i].line[aline].tim = 0;
            }
}

void initbuchen(mytmp)
struct utmp *mytmp;
{
    long i, aline, atime;

    aline = getline(mytmp->ut_id);      /* Auf welcher Line? */

    /* Teste alle User: War er auf dieser Line eingeloggt ? */
    for (i = 0; i < maxuser; i++)
        if (u[i].line[aline].tim != 0) {        /* true, wenn ja */
            /* Wieder wie oben ... */
            atime = mytmp->ut_time - u[i].line[aline].tim;
            u[i].line[aline].ltg += atime;
            u[i].gesamt += atime;

            u[i].line[aline].tim = 0;
        }
}


/**************************************************************************
* void verbuche(struct utmp *)
*
* Bucht die Online-Zeiten aus einem utmp-Eintrag auf die passenden User-
* Konten. wtmp/utmp enthaelt nur Startzeiten von Prozessen. Ein User ist
* ab ut_type=USER_PROCESS eingeloggt und wird bei ut_type=OLD_TIME (durch
* shutdown) oder bei ut_type=INIT_PROCESS (durch Logout) ausgeloggt. Die
* Differenz wird bestimmt und auf dem entsprechenden Line-Konto und auf
* dem Gesamtkonto addiert.
**************************************************************************/

void verbuche(mytmp)
struct utmp *mytmp;
{
    struct user *thisuser;
    time_t atime;
    long aline;
    long i;

    switch (mytmp->ut_type) {
    case USER_PROCESS:         /* Ein neues login... */
        thisuser = finduser(mytmp->ut_user);    /* Wer kommt da? */
        aline = getline(mytmp->ut_id);  /* Auf welchem Port? */
        thisuser->line[aline].tim = mytmp->ut_time;     /* Zeit merken */
        break;

    case OLD_TIME:             /* Logoff durch shutdown */
        deadbuchen(mytmp);
        break;

    case INIT_PROCESS:         /* Logoff durch ausloggen */
        initbuchen(mytmp);
        break;
    default:                   /* Alles andere: NOP! */
        break;
    }
}


/**************************************************************************
* void cvttime(struct user *, long *, long *, long *)
*
* Zeitumwandlung
**************************************************************************/

void cvttime(u, h, m, s)
long *u;
long *h, *m, *s;
{
    struct tm *tmp;

    tmp = gmtime(u);
    *h = (tmp->tm_yday) * 24 + (tmp->tm_hour);
    *m = tmp->tm_min;
    *s = tmp->tm_sec;
}


/**************************************************************************
* int uncmp(struct user *, struct user *)
*
* Vergleicht Namen im User-Array.
**************************************************************************/

int uncmp(u1, u2)
struct user *u1, *u2;
{
    return (strncmp(u1->name, u2->name, 8));
}


/**************************************************************************
* int utcmp(struct user *, struct user *)
*
* Vergleicht zwei Zeiten im User-Array
**************************************************************************/

int utcmp(u1, u2)
struct user *u1, *u2;
{
    return ((u2->gesamt) - (u1->gesamt));
}


/**************************************************************************
* int lncmp(struct line *, struct line *)
*
* Vergleicht Namen im Hilfs-Line-Array.
**************************************************************************/

int lncmp(l1, l2)
struct line *l1, *l2;
{
    return (strncmp(l1->line, l2->line, 4));
}


/**************************************************************************
* int ltcmp(struct line *, struct line *)
*
* Vergleicht zwei Zeiten im Hilfs-Line-Array
**************************************************************************/

int ltcmp(l1, l2)
struct line *l1, *l2;
{
    return ((l2->time) - (l1->time));
}


/**************************************************************************
* int printsub(struct line *, int)
*
* Druckt Subtotals.
**************************************************************************/

int printsub(h, foo)
struct line *h;
int foo;
{
    long hours, mins, secs;

    if (h->time != 0) {
        cvttime(&(h->time), &hours, &mins, &secs);

        if (foo != 0)
            printf(" ");

        printf("%-4.4s % 3ld:%02ld.%02ld\n", h->line, hours, mins, secs);

        return (1);
    }

    return (foo);
}


/**************************************************************************
* void printhead(int)
*
* Druckt passende Ueberschrift.
**************************************************************************/

void printhead(optv)
int optv;
{

    if (optv) {
        printf("%- 8s % 9s % 4s % 9s\n",
               "Name", "Total", "Line", "Subtotal");
    } else {
        printf("% 8s % 9s\n", "Name", "Total");
    }
}


/**************************************************************************
* void printentry(struct user *, int, int, int)
*
* Druckt eine Zeile.
**************************************************************************/

void printentry(u, optn, optt, optv)
struct user *u;
int optn, optt, optv;
{
    struct line h[MAXLINE];
    struct tm *tmp;
    long hours, mins, secs;
    long i;
    int foo;

    cvttime(&(u->gesamt), &hours, &mins, &secs);
    printf("%-8.8s % 3ld:%02ld.%02ld ", u->name, hours, mins, secs);

    if (optv == 0)
        printf("\n");
    else {
        for (i = 0; i < maxline; i++) {
            h[i].time = u->line[i].ltg;
            strncpy(h[i].line, l[i], 4);
        }

        if (optn)
            qsort((char *) h, maxline, sizeof(struct line), lncmp);

        if (optt)
            qsort((char *) h, maxline, sizeof(struct line), ltcmp);

        foo = 0;
        for (i = 0; i < maxline; i++)
            foo = printsub(&h[i], foo);

    }
}


/**************************************************************************
* void abrechnen(int, int, int, int, int, int, int, char*)
*
* Listet jetzt alles schoen sauber auf...
**************************************************************************/

void abrechnen(opta, optn, optq, optt, optu, optv, uname)
int opta, optn, optq, optt, optu, optv;
char *uname;
{
    struct user *thisuser;
    long i;

    if (optn)
        qsort((char *) u, maxuser, sizeof(struct user), uncmp);

    if (optt)
        qsort((char *) u, maxuser, sizeof(struct user), utcmp);

    if (opta) {
        if (optq == 0)
            printhead(optv);

        for (i = 0; i < maxuser; i++)
            printentry(&u[i], optn, optt, optv);
    }

    if (optu) {
        if (optq == 0)
            printhead(optv);

        thisuser = finduser(uname);
        printentry(thisuser, optn, optt, optv);
    }
}


/**************************************************************************
* void help(int, char **)
*
* Hilfstexte
**************************************************************************/

void help(argc, argv)
int argc;
char *argv[];
{
    fprintf(stderr, "%s -- system login statistics\n", argv[0]);
    fprintf(stderr, "usage: %s {-u user|-a} {-n|-t} {-v} {-q}\n\n",
            argv[0]);
    fprintf(stderr,
            " -u user stats user 'user' (default: login name/line)\n");
    fprintf(stderr, " -a stats all users\n\n");
    fprintf(stderr, " -n sorted by name (default: none)\n");
    fprintf(stderr, " -t sorted by time\n\n");
    fprintf(stderr, " -v verbose listing\n");
    fprintf(stderr, " -q no headline (quiet mode)\n\n");
}

void main(argc, argv)
int argc;
char *argv[];
{
    extern int optind;
    extern char *optarg;

    int c;
    FILE *ufile;
    int anz;
    long aline, atime, i;

    char uname[8];
    int opta = 0, optn = 0, optq = 0, optt = 0, optu = 0, optv = 0;
    int err = 0;

    if (argc == 2)
        if ((strcmp(argv[1], "-?") == 0) || (strcmp(argv[1], "-h") == 0)) {
            help(argc, argv);
            exit(1);
        }


    while ((c = getopt(argc, argv, "anqtu:v")) != EOF) {
        switch (c) {
        case 'q':              /* Quiet mode? */
            optq++;
            break;

        case 'u':              /* Statistik fuer user? */
            if (opta)
                err++;
            else {
                strncpy(uname, optarg, 8);
                optu++;
            }
            break;

        case 'a':              /* Statistik fuer alle user */
            if (optu)
                err++;
            else
                opta++;
            break;

        case 'n':              /* Sort by name */
            if (optt)
                err++;
            else
                optn++;
            break;

        case 't':              /* Sort by time */
            if (optn)
                err++;
            else
                optt++;
            break;

        case 'v':              /* Verbose mode */
            optv++;
            break;
        }
    }


    if (err) {
        help(argc, argv);
        exit(1);
    }


    if ((opta == 0) && (optu == 0)) {
        optu++;
        strncpy(uname, getlogin(), 8);
    }

    inituser();
    ufile = fopen(WTMP_FILE, "r");
    do {
        anz = fread(&mytmp, sizeof(mytmp), 1, ufile);
        if (anz != 0) {
            verbuche(&mytmp);
        }
    } while (anz != 0);
    fclose(ufile);

    mytmp.ut_time = time((long *) 0);
    deadbuchen(&mytmp);
    abrechnen(opta, optn, optq, optt, optu, optv, uname);
}
