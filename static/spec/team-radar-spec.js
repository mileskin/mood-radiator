describe('team radar', function() {
  describe('fresh initialization by configured users', function() {
    beforeEach(function() {
      specHelper.initContext()
    })

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
    beforeEach(function() {
      specHelper.initContext()
    })

    it('updates mood message for user', function() {
      specHelper.updateMood('/mood/bob/5/yay')
      specHelper.async(function() {
        expect($('#bob .moodIndicator')).toHaveClass('freakinEcstatic')
        expect($('#bob .moodMessage')).toHaveText('yay')
      })
    })
  })

  describe('persistence', function() {
    beforeEach(function() {
      specHelper.initContext({
        beforeViewInit: function() {
          localStorage.setItem('bob.index', "1")
          localStorage.setItem('bob.message', "saved mood")
        }
      })
    })

    it('loads user when view is initialized', function() {
      expect($('#bob .moodIndicator')).toHaveClass('aboutToDie')
      expect($('#bob .moodMessage')).toHaveText('saved mood')
    })

    it('saves user on mood update', function() {
      specHelper.updateMood('/mood/bob/5/new%20message')
      specHelper.async(function() {
        expect(localStorage.getItem('bob.index')).toEqual('5')
        expect(localStorage.getItem('bob.message')).toEqual('new message')
      })
    })
  })

  xdescribe('pic url resolver', function() {
    it('resolves gravatar url', function() {
      expect(1).toEqual(1)
    })
  })
})

