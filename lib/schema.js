var mongoose = require('mongoose')
var Schema = mongoose.Schema

var User = new Schema({
  nick: { type: String, unique: true, required: true },
  gravatarUsername: String
})

mongoose.model('User', User)
