describe('team radar', function() {
  var isContextInitialized = false

  beforeEach(function() {
    if (!isContextInitialized) {
      isContextInitialized = true
      initContext()
    }
  })

  function initContext() {
    localStorage.setItem('bob.index', "")
    localStorage.setItem('bob.message', "foo")
    localStorage.setItem('jill.index', "")
    localStorage.setItem('jill.message', "foo")
    var config = {
      users: {
        a: {nick: 'bob'},
        b: {nick: 'jill'}
      }
    }
    registerFakeAjax({url: '/config', successData: config})
    $.teamRadar.view.initMoodUpdateListener()
    $.teamRadar.view.initUserRows()
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

  describe('posting mood updates', function() {
    it('updates mood message for user', function() {
      waits(100)
      runs(function() {
        realAjax({url: '/mood/bob/5/yay'})
      })
      waits(100)
      runs(function() {
        expect($('#bob .moodMessage')).toHaveText('yay')
      })
    })
  })

  xdescribe('pic url resolver', function() {
    it('resolves gravatar url', function() {
      expect(1).toEqual(1)
    })
  })
})

