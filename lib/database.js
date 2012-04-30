var mongoose = require('mongoose')
require('./schema') // Introduces the schema to Mongoose
var conn

exports.model = function(name) {
  return conn.model(name)
}

exports.init = function(databaseName) {
  conn = mongoose.createConnection('mongodb://localhost/' + databaseName)
}

exports.dropAll = function() {
  conn.model('User').find({}).remove()
}
