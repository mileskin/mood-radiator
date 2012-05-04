var mongoose = require('mongoose')
var Schema = mongoose.Schema

var User = new Schema({
  nick: { type: String, unique: true, required: true },
  gravatarUsername: String,
  moodUpdates: [ MoodUpdate ]
})

var MoodUpdate = new Schema({
  moodIndex: { type: Number, min: 1, max: 5, required: true },
  moodMessage: String,
  updated: { type: Date, default: Date.now, require: true }
})

mongoose.model('User', User)
mongoose.model('MoodUpdate', MoodUpdate)
