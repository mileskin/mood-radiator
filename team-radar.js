var express = require('express')
var app = express.createServer()
var io = require('socket.io').listen(app)
var database = require('./lib/database')
var userFactory = require('./lib/user-factory')

app.use(express.static(__dirname + '/static'))
app.use(express.bodyParser())
app.listen(8085)

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html')
})

app.get('/config', function(req, res) {
  database.loadConfig(function(configJSON) {
    res.send(configJSON)
  })
})

app.post('/moodUpdate', function(req, res) {
  io.sockets.emit('moodUpdate', {
    nick: req.body.nick,
    moodIndex: req.body.moodIndex,
    moodMessage: req.body.moodMessage})
  res.send('ok')
})

app.post('/users', function(req, res) {
  var user = userFactory.createUser(req.body.nick, req.body.gravatarUsername)
  database.addUser(user, function() {
    res.send('ok')
  })
})
