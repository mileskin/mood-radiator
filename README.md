Team Radar
=

Shows the current
mood of each team member on one radiator web page. Especially with multi-site
teams this aims to bring the whole team mentally a little bit closer
despite the geographical distance (which _always_ sucks) between sites.

Mood update contains user's nick, mood index and mood message. Nick must
be one of the nicks listed in `config.yaml`. It's used for identifying
the correct user row. Mood index is a number from 1 to 5 (1 == worst, 5
== best). It used for showing a background color mapped to the given
index. Given mood message is shown on the user's row.

WebSockets are used for pushing mood changes in real-time to all (browser) clients.

Requires a modern browser. Tested using latest Firefox, Chrome and Safari.

Enjoy, don't forget to [follow me on twitter](http://twitter.com/mileskin)!

Status
-

It works! My current team uses already. You should too. I
would love to hear your feedback.

Usage
-

Run

    node team-radar.js

open

    http://localhost:8085/

Posting a mood change: use IRC bot (see below) or create your own client (pull requests very welcome). With curl:

    curl http://localhost:8085/mood/jill/2/having%20a%20bad%20hair%20day

Installation
-

You will need [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/). Also some node modules:

    npm install socket.io
    npm install express
    npm install yaml

I installed these in my home folder under `node_modules`. Node.js finds
them easily there.

For configuring your team members you only need to:

* modify `config.yaml` (using IRC nicks in case you want to use IRC bot as the client)
* add pics to `static/img/` of team members using naming convention `some-nick.jpg`

Additionally you might want to adjust user row height in `static/css/app.css`:

    .user {
      height: 180px;
    }

App reboot not needed afterwards, just refresh the page.


Clients for posting mood updates
-

Mood updates can be posted simply by issuing an HTTP GET (e.g. `curl http://localhost:8085/mood/jill/2/having%20a%20bad%20hair%20day`), so it should be easy to add new clients. Currently there is a [Supybot](http://sourceforge.net/projects/supybot/) (IRC bot) plugin in `clients/irc/supybot` called `TeamRadar`. Please refer to supybot documentation for installation instructions ([Supybook](http://supybook.fealdia.org/devel/), [writing supybot plugins](http://web.archive.org/web/20080103010543/http://supybot.com/documentation/help/tutorial/plugin-author-tutorial/tutorial-all-pages)). With the bot you can post mood updates using IRC (this is how we use it in my team) e.g. like this:

    @mood 5 yay finally got the bloody thing working zOMG!!11 \o/

Development
-

Running all tests (server must be started):

    http://localhost:8085/?test=true

[Scss](http://sass-lang.com/) is used for writing css, so `app.scss`
should be modified instead of `app.css`. Scss generates css on
modification when you start the following command in background:

    sass --watch app.scss:app.css

TODO
-

* shrink font on long update messages
* handle errors
* 'updated at' timestamp for each user row
* simple web page for posting mood updates

