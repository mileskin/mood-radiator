var express = require('express')
var app = express.createServer()
var io = require('socket.io').listen(app)
var fs = require('fs')
var configFile = 'config.json'

app.use(express.static(__dirname + '/static'))
app.use(express.bodyParser())
app.listen(8085)

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html')
})

app.get('/config', function(req, res) {
  fs.readFile(configFile, function(err, fileContents) {
    res.send(JSON.parse(fileContents.toString()))
  })
})

app.post('/moodUpdate', function(req, res) {
  io.sockets.emit('moodUpdate', {
    nick: req.body.nick,
    moodIndex: req.body.moodIndex,
    moodMessage: req.body.moodMessage})
  res.send('ok')
})
