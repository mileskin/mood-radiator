var fs = require('fs')
var configFile = 'config.json'

exports.loadConfig = function(configHandler) {
  fs.readFile(configFile, function(err, fileContents) {
    json = JSON.parse(fileContents.toString())
    configHandler(json)
  })
}

exports.addUser = function(user, afterStoreHandler) {
  exports.loadConfig(function(config) {
    config.users[user.nick] = user
    fs.writeFile(configFile, JSON.stringify(config, null, 2), databaseErrorHandler)
  })
  afterStoreHandler()
}

var databaseErrorHandler = function(error) {
  if (error) {
    console.log("Database error: " + error)
  }
}
