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

app.post('/users', function(req, res) {
  var username = req.body.nick
  var createNewUser = function() {
    var gravatarUsername = req.body.gravatarUsername
    var newUser = {}
    newUser['nick'] = username
    if (gravatarUsername) {
      newUser['gravatarUsername'] = gravatarUsername
    }
    return newUser
  }
  fs.readFile(configFile, function(err, fileContents) {
    var config = JSON.parse(fileContents.toString())
    config.users[username] = createNewUser()
    fs.writeFile(configFile, JSON.stringify(config, null, 2), function(error) {
      if (error) {
        console.log("writing to file failed")
      }
    })
  })
  res.send('ok')
})
