var express = require('express')
var app = express.createServer()
var io = require('socket.io').listen(app)

app.use(express.static(__dirname + '/static'))

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html')
})

app.get('/mood/:user/:index/:message', function (req, res) {
  console.log(req.params)
  io.sockets.emit('mood', {user: req.params.user, index: req.params.index, message: req.params.message})
  res.send('ok')
})

app.listen(8085)

