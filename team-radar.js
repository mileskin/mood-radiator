var express = require('express')
var app = express.createServer()
var io = require('socket.io').listen(app)
var fs = require('fs')
var yaml = require('yaml')
var configFile = 'config.yaml'

app.use(express.static(__dirname + '/static'))
app.listen(8085)

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html')
})

app.get('/config', function(req, res) {
  fs.readFile(configFile, function(err, fileContents) {
    res.send(yaml.eval(fileContents.toString()))
  })
})

app.get('/mood/:nick/:index/:message', function(req, res) {
  io.sockets.emit('moodUpdate', {
    nick: req.params.nick,
    moodIndex: req.params.index,
    moodMessage: req.params.message})
  res.send('ok')
})

