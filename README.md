Team Radar
=

Experimental app that can be used for showing the current
mood of each team member on one radiator web page. Especially with multi-site
teams this aims to bring the whole team mentally a little bit closer
despite the geographical distance (which _always_ sucks) between sites.

WebSockets are used for pushing mood changes in real-time to all (browser) clients.

Status
-

Not usable at all yet. Stay tuned.

Usage
-

Run

    node app.js

open

    http://localhost:8085/

Posting a mood change: `curl http://localhost:8085/mood/john/2/having%20a%20bad%20hair%20day`

Installation
-

Requires

* node.js
* socket.io
* express.js

I installed these in my home folder under `node_modules`. Node.js finds
them easily there.

TODO
-

* Out-of-the-box ready-steady IRC bot coming up soon. Currently mood can
  be posted
using e.g. `curl`. Additional clients can be added easily, you just need
to do HTTP GET.

