var express = require('express')
var app = express.createServer()
var io = require('socket.io').listen(app)
var database = require('./lib/database')

app.use(express.static(__dirname + '/static'))
app.use(express.bodyParser())
app.listen(8085)

database.init('moodradiator')

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html')
})

app.get('/config', function(req, res) {
  var UserModel = database.model('User')
  UserModel.find({}).exec(function(err, databaseUsers) {
    var users = {}
    databaseUsers.forEach(function(user) {
      users[user.nick] = user
    })

    res.send({users : users})
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
  var UserModel = database.model('User')
  var user = new UserModel(
    {nick: req.body.nick, gravatarUsername: req.body.gravatarUsername}
  )
  user.save(errorHandler)
  res.send('ok')
  io.sockets.emit('syncUsers', {})
})

var errorHandler = function(error) {
  if (error) { console.log(error) }
}
