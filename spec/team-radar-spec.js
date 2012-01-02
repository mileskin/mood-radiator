describe('team radar', function() {
  var isContextInitialized = false

  beforeEach(function() {
    if (!isContextInitialized) {
      isContextInitialized = true
      initContext()
    }
  })

  function initContext() {
    var config = {
      users: {
        a: {nick: 'bob'},
        b: {nick: 'jill'}
      }
    }
    registerFakeAjax({url: '/config', successData: config})
    ich.addTemplate('userRow', loadTestData('.userRowFixture', 'team-radar-fixture.html'))
    $.teamRadar.initUserRows()
  }

  describe('initialization by configured users', function() {
    it('creates a row for each user', function() {
      expect($('.user').length).toEqual(2)
    })

    it('shows nick for each user', function() {
      expect($('#bob .nick')).toHaveText('bob')
      expect($('#jill .nick')).toHaveText('jill')
    })

    it('shows default mood message for each user', function() {
      expect($('#bob .moodMessage')).toHaveText('business as usual')
      expect($('#jill .moodMessage')).toHaveText('business as usual')
    })
  })

  xdescribe('pic url resolver', function() {
    it('resolves gravatar url', function() {
      expect(1).toEqual(1)
    })
  })
})

