Team Radar
=

Shows the current
mood of each team member on one radiator web page. Especially with multi-site
teams this aims to bring the whole team mentally a little bit closer
despite the geographical distance (which _always_ sucks) between sites.

Mood update contains user's nick, mood index and mood message. It's used for
identifying the correct user row. Mood index is a number from 1 to 5 (1 ==
worst, 5 == best). It is used for showing a background color mapped to the
given index. Given mood message is shown on the user's row.

WebSockets are used for pushing mood changes in real-time to all (browser)
clients.

Requires a modern browser. Tested using latest Firefox, Chrome and Safari.

Enjoy, don't forget to [follow me on twitter](http://twitter.com/mileskin)!

Status
-

It works! My current team uses already. You should too. I
would love to hear your feedback.

Installation
-

## MongoDB

Mood radiator uses [MongoDB](http://www.mongodb.org/) as the database. You need
to have it running on your localhost. At startup, Mood radiator automatically
creates a database named *moodradiator*.

Just installing MongoDB for your operating system should be enough. You should
not need to do any configuration.

## Node.js

You will also need [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/).
You can install the required Node modules like so:

    npm install socket.io
    npm install express
    npm install mongoose
    npm install jasmine-node

I installed these in my home folder under `node_modules`. Node.js finds
them easily there.

Usage
-

Run `node team-radar.js`.

For configuring your team members you only need to:

* modify *bin/add_users.sh* and run it (using IRC nicks in case you want to use IRC bot as the client)
* add pics to `static/img/` of team members using naming convention `some-nick.jpg`

Additionally you might want to adjust user row height in `static/css/app.css`:

    .user {
      height: 180px;
    }

### Registering or updating users

It is possible to
* Update existing users
* Register new users

#### Curl

`curl -d "nick=test&gravatarUsername=gee" http://localhost:8085/users`

#### Web UI

Open `http://localhost:8085/`, insert a nickname and optionally Gravatar
username and press the button.

### Radiator view

* open `http://localhost:8085/?radiator=true` (client is hidden)
* view the page full screen

### Posting mood updates

Mood updates can be posted simply by issuing an HTTP POST, so it should be
fairly easy to add new clients. Pull requests are very welcome!

#### IRC bot

There is a [Supybot](http://sourceforge.net/projects/supybot/) (IRC bot) plugin
in `clients/irc/supybot` called `TeamRadar`. Please refer to supybot
documentation for installation instructions
([Supybook](http://supybook.fealdia.org/devel/), [writing supybot
plugins](http://web.archive.org/web/20080103010543/http://supybot.com/documentation/help/tutorial/plugin-author-tutorial/tutorial-all-pages)).
With the bot you can post mood updates using IRC (this is how we use it in my
team) e.g. like this:

    @mood 5 yay finally got the bloody thing working zOMG!!1

#### Web UI

Open `http://localhost:8085/`, select nick and type [index and] message to the
text input field. Pattern: `index message`, e.g. `2 foo bar`. If you leave the
index out then only the message will be changed.

#### Curl

    curl -d "nick=jill&moodIndex=2&moodMessage=having%20a%20bad%20hair%20day" http://localhost:8085/moodUpdate

Development
-

[Scss](http://sass-lang.com/) is used for writing css, so `app.scss`
should be modified instead of `app.css`. Scss generates css on
modification when you start the following command in background:

    sass --watch app.scss:app.css

## Tests
Running the browser tests (server must be started):

    http://localhost:8085/?test=true

Running the back-end tests (assumes that you have installed Jasmine-node with
the global *-g* switch):

    jasmine-node spec
