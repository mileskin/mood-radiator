var database = require('./../lib/database')
describe('database', function() {
  beforeEach(function() {
    database.init('moodradiator-test')
  })

  afterEach(function() {
    database.dropAll()
  })

  it('allows persisting users', function() {
    var UserModel = database.model('User')
    var user = new UserModel({nick: 'Wolfy'})
    user.save()
  })
})
