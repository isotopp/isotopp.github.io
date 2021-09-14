---
layout: post
title:  'Optimistic locking'
author-id: isotopp
feature-img: assets/img/background/mysql.jpg
date: 2020-06-04 09:00:01 +0200
tags:
- lang_en
- mysql faq
- mysql
- erklaerbaer
- reddit
---
A [question](https://www.reddit.com/r/mysql/comments/gwc0ry/concurrent_queries_with_mysql/) from Reddit's /r/mysql:

> Hey, I was planning to make a dashboard, where Users are subjected to make edits on their profiles every now and then, and I expect a high volume of requests to the database.
>
>Having worked previously with MySQL for another Dashboard, I encountered errors for:
>
> - Maximum user connections - when I connected to the database only while query was to be executed
>
> -  Lock wait timeout exceeded; try restarting transaction - when I connected to the database whenever a user logged into the dashboard, and ended the connection when he ended the session.
>
> Both the approaches resulted in different errors, that too when I had a small user base, but they were active at the same time. Since, for the New Dashboard, I expect way more oscillating traffic, depending upon events, is there any way I can optimize my process of queries so that I can prevent the errors.

I am having trouble understanding what was being tried. The host language was not stated, but that choice could influence system behavior because of the way the host language connects to the database.

Assuming a 2-tier system where the web frontend contains the host language directly or indirectly (any of Perl, PHP, Python, Ruby as module or FCGI process), we will see as many connections to the database as there are web server processes or FCGI workers. Each connection spawns a thread in the database, and that will, when idle consume some 500 KB or so of memory in the database server. Obviously, the `max_connections` value must be higher or equal to the maximum number of workers.

There is no way for this to stall "when I connected to the database only while query was to be executed". By default, each worker has one database connection and query execution is synchronous, the worker is stalled while the database is working on the query. This could be different, if a language such as Java or Javascript (node.js?) is being used, and a connection pool has been configured. In this case, if queries stall, the connection pool may be undersized.

The "Lock wait timeout exceeded" means an InnoDB row lock has been held for a transaction duration longer than 50 seconds. This seems to be either a deadlock (two transactions trying to change an overlapping set of rows) that is not properly detected, or it is an attempt to hold a lock over a human user interface transactions - always an error.

For the latter problem often an optimistic locking approach is successful. That is: No locking when generating the data entry screen for the UI. When the data entry screen is comitted, start the transaction and guard it with a version number or the full data set.

Let's look at this in a concrete fashion, using Python and a Flask app, using the ideas of Miguel Grinberg's [The Flask Mega-Tutorial](https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-iii-web-forms) as a foundation.

We want to edit some dummy table without timing out. The table is defined like so:

```sql
CREATE TABLE `editme` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `city` varchar(200) DEFAULT NULL,
  UNIQUE KEY `id` (`id`)
)
INSERT INTO `editme` VALUES (1,'Name 1','City 1');
INSERT INTO `editme` VALUES (2,'Name 2','City 2');
INSERT INTO `editme` VALUES (3,'Name 3','City 3');
INSERT INTO `editme` VALUES (4,'Name 4','City 4');
```

It has an integer field `id`, which is the primary key, and two data fields, `name`, and `city`. We do not care what that means, it is just an example. We provide some sample data.

The web form shows these values, and as hidden fields, also preserves the pre-edit values. So we get the `id` field to identify rows, and then hidden fields `oldname` and `oldcity`, and the matching visible edit fields `name` and `city`.

```html{% raw %}
{% extends "base.html" %}
{% block content %}
	{% for row in table %}
	<tr>
		<form action="" method="post" novalidate>
		{{ form.csrf_token }}
		{{ form.id(value=row.id) }}
		{{ form.oldname(value=row.name) }}
		{{ form.oldcity(value=row.city) }}
		<td>{{ form.name(value=row.name, size=40) }}</td>
		<td>{{ form.city(value=row.city, siz=40) }}</td>
		<td>{{ form.submit() }}</td>
		</form>
	</tr>
	{% endfor %}
{% endblock %}
{% endraw %}```

![](/uploads/2020/06/optimistic-locking-1.png)

Flask and WTForms demand a Form Class to handle this. We name it `EditForm` and define our hidden and visible fields:

```python
#! /usr/bin/env python

from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, HiddenField
from wtforms.validators import DataRequired


class EditForm(FlaskForm):
    id = HiddenField("id", validators=[DataRequired()])
    oldname = HiddenField("oldname", validators=[DataRequired()])
    oldcity = HiddenField("oldcity", validators=[DataRequired()])
    name = StringField("name", validators=[DataRequired()])
    city = StringField("city", validators=[DataRequired()])
    submit = SubmitField("Save")
```

Finally we can put all the cabling into our routes:

```python
#! /usr/bin/env python

from flask import render_template, flash
from app import app
from app.forms import EditForm
from app.data import FormUpdater  # this is where the optimistic locking happens


@app.route("/", methods=["GET", "POST"])
@app.route("/index", methods=["GET", "POST"])
def index():
    f = FormUpdater()
    table = f.fetch()   # load table into memory
    form = EditForm()   # show an edit form
    if form.validate_on_submit():   # if the form has been submitted back,
        modified = f.update(form)   # save the data, remember the number of changed rows
        table = f.fetch()           # reload the data for checking
        flash(f"Updated {modified} rows.")
    else:
        flash("No data received.")
    # show the form
    return render_template("index.html", title="Home", table=table, form=form)
```

We register only one action, for the routes `/` and `/index`. This route loads the data from the database, by creating a `FormUpdater` and calling `fetch()` on it.

In case this form has been edited and the `Save` button pressed, we end up in the if-branch for `validate_on_submit()`. Here we call `update()` on the `FormUpdater`, and the re-fetch the data to make sure we show the updates. We also remember the number of modified rows in `modified`.

In any case, we show the table as a form.

Now, the `FormUpdater`:

```python
#! /usr/bin/env python

import MySQLdb
import MySQLdb.cursors


class FormUpdater:
    def __init__(self):
        self.connect()

    def connect(self):
        self.db = MySQLdb.connect(host="localhost", user="root", db="kris")

    def fetch(self):
        cur = MySQLdb.cursors.DictCursor(self.db)
        query = "select id, name, city from editme"
        cur.execute(query)
        return cur.fetchall()

    def update(self, form):
        query = "update editme set name = %s, city = %s where id = %s and name = %s and city = %s"
        data = (
            form.name.data,
            form.city.data,
            form.id.data,
            form.oldname.data,
            form.oldcity.data,
        )
        cur = self.db.cursor()
        cur.execute(query, data)
        modified = cur.rowcount
        self.db.commit()

        return modified
```

The `fetch()` method simply runs `select id, name, city from editme` and returns all rows. In order to make our life easier, we are using a `DictCursor`, so we get named columns.

The `update()` method generates a query that sets the new values for `name` and `city`, identifying the row by `id`. The where-clasuse of the update statement contains the additional condition `AND name = %s AND city = %s`, where we put the old name and old city into the placeholders.

So when we generate the form, we do not lock the record, and we put the old name and old city into the form itself in hidden fields. When we accept the form, we check if the name and city are unchanged by comparing them against the old name and old city as they have been submitted back.

In case they have been changed, the update fails and the user edits are lost. Otherwise the update statement goes through. We report back the number of rows changes, 0 or 1.

More intelligence could be put into the function: In case we do not modify any row, we could reload the row and check if the oldname still matches - if yes, we could accept any user edit on the name field, as there is no collision. Then we could do the same with the city.

More intelligence could be put into the editor: In case we have any collision, we could flash and highlight the collision and allow the user to resubmit their change, resolving the conflict.
