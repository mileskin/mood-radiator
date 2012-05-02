var express = require('express')
var app = express.createServer()
var io = require('socket.io').listen(app)
var database = require('./lib/database')
var _ = require('underscore')

app.use(express.static(__dirname + '/static'))
app.use(express.bodyParser())
app.listen(8085)

database.init('moodradiator')

if (process.argv.indexOf('--mode=test') >= 0) {
  require('./test/express-test-helper').addEndpointsTo(app)
}

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html')
})

app.get('/config', function(req, res) {
  var UserModel = database.model('User')
  UserModel.find({}).exec(function(err, databaseUsers) {
    var users = {}
    databaseUsers.forEach(function(user) {
      users[user.nick] = {
        nick: user.nick,
        gravatarUsername: user.gravatarUsername
      }
      var latestMoodUpdate = _.max(user.moodUpdates, function(moodUpdate) {
        return moodUpdate.updated
      })
      if (latestMoodUpdate) {
        users[user.nick]['moodIndex'] = latestMoodUpdate.moodIndex
        users[user.nick]['moodMessage'] = latestMoodUpdate.moodMessage
      }
    })
    res.send({ users : users })
  })
})

app.post('/moodUpdate', function(req, res) {
  var UserModel = database.model('User')
  UserModel.findOne({ nick: req.body.nick }).run(function(err, user) {
    if (!user) {
      console.warn('User ' + req.body.nick + ' not found. Cannot update mood.')
      res.send(404)
      return
    }
    var moodUpdate = createMoodUpdate(req)
    user.moodUpdates.push(moodUpdate)
    user.save(errorHandler)
    moodUpdate.save(errorHandler)
    io.sockets.emit('moodUpdate', {
      nick: user.nick,
      moodIndex: moodUpdate.moodIndex,
      moodMessage: moodUpdate.moodMessage })
    res.send('ok')
  })
})

app.post('/users', function(req, res) {
  var UserModel = database.model('User')
  var user = new UserModel(
    { nick: req.body.nick, gravatarUsername: req.body.gravatarUsername }
  )
  user.save(errorHandler)
  res.send('ok')
  io.sockets.emit('syncUsers', {})
})

var createMoodUpdate = function(req) {
  var MoodUpdateModel = database.model('MoodUpdate')
  var moodUpdate = new MoodUpdateModel({
    moodIndex: req.body.moodIndex,
    moodMessage: req.body.moodMessage
  })
  return moodUpdate
}

var errorHandler = function(error) {
  if (error) { console.log(error) }
}
