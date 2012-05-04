var database = require('../lib/database')

exports.addEndpointsTo = function(app) {
  app.delete('/all', function(req, res) {
    database.dropAll()
    res.send('ok')
  })
}
