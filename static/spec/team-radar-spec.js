describe('team radar', function() {
  var User = $.teamRadar.domain.User

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
      specHelper.updateMood('bob', '5', 'yay')
      specHelper.async(function() {
        expect($('#bob .moodIndicator')).toHaveClass('freakinEcstatic')
        expect($('#bob .moodMessage')).toHaveText('yay')
      })
    })
  })

  describe('pic url resolver', function() {
    beforeEach(function() {
      specHelper.initContext({
        config: {
          users: {
            a: {
              nick: 'bob1',
              gravatarUsername: 'bob'
            }
          }
        },
        beforeViewInit: function() {
          registerFakeAjax({
            url: 'http://en.gravatar.com/bob.json',
            successData: {entry: [{hash: "abc123"}]}
          })
        }
      })
    })

    it('resolves gravatar pic url', function() {
      var expectedBackgroundUrl = 'http://www.gravatar.com/avatar/abc123?s=200'
      expect($('#bob1 .pic').attr('style')).toContain(expectedBackgroundUrl)
    })
  })

  describe('persistence', function() {
    var user = new User({
      nick: 'bob',
      moodIndex: 1,
      moodMessage: 'saved mood'
    })

    beforeEach(function() {
      specHelper.initContext({
        beforeViewInit: function() {
          user.save()
        }
      })
    })

    it('loads user when view is initialized', function() {
      expect($('#bob .moodIndicator')).toHaveClass('aboutToDie')
      expect($('#bob .moodMessage')).toHaveText('saved mood')
    })

    it('saves user on mood update', function() {
      specHelper.updateMood('bob', '5', 'new message')
      specHelper.async(function() {
        var savedUser = $.parseJSON(localStorage.getItem(user.userId()))
        expect(savedUser.moodIndex).toEqual('5')
        expect(savedUser.moodMessage).toEqual('new message')
      })
    })
  })

  describe('client for posting mood updates', function() {
    beforeEach(function() {
      specHelper.initContext()
    })

    it('lists all nicks', function() {
      expect($('.client .nicks option').length).toEqual(2)
    })

    it('parses mood index and message from text input', function() {
      specHelper.async(function() {
        useRealAjaxFor({url: '/moodUpdate', type: 'post'})
        specHelper.updateMoodWithClient('jill', '5 food was plenty')
      })
      specHelper.async(function() {
        expect($('#jill .moodIndicator')).toHaveClass('freakinEcstatic')
        expect($('#jill .moodMessage')).toHaveText('food was plenty')
      })
    })

    it('keeps current index if new index is not specified', function() {
      specHelper.async(function() {
        specHelper.updateMood('bob', '3', 'ok')
      })
      specHelper.async(function() {
        useRealAjaxFor({url: '/moodUpdate', type: 'post'})
        specHelper.updateMoodWithClient('bob', 'the same')
      })
      specHelper.async(function() {
        expect($('#bob .moodIndicator')).toHaveClass('okish')
        expect($('#bob .moodMessage')).toHaveText('the same')
      })
    })
  })

  describe('domain', function() {
    describe('User', function() {
      beforeEach(function() {
        localStorage.clear()
      })

      it('requires nick', function() {
        _.each([null, undefined, {}], function(emptyCustomFields) {
          expect(function() {
            new User(emptyCustomFields)
          }).toThrow('nick must be specified in custom fields')
        })
      })

      it('has default values', function() {
        var user = new User({nick: 'any'})
        expect(user.moodIndex()).toEqual(user.defaultMoodIndex)
        expect(user.moodMessage()).toEqual(user.defaultMoodMessage)
      })

      it('custom values override defaults', function() {
        var user = new User({
          nick: 'george',
          moodIndex: 2,
          moodMessage: 'custom message',
          gravatarUsername: 'bush'
        })
        expect(user.nick()).toEqual('george')
        expect(user.moodIndex()).toEqual(2)
        expect(user.moodMessage()).toEqual('custom message')
        expect(user.gravatarUsername()).toEqual('bush')
      })

      it('can be saved to local storage', function() {
        var user = new User({
          nick: 'jill',
          moodIndex: 2
        })
        expect(localStorage.getItem(user.userId())).toBeNull()
        user.save()
        var userJson = '{"moodIndex":2,"moodMessage":"business as usual","nick":"jill"}'
        expect(localStorage.getItem(user.userId())).toEqual(userJson)
      })

      it('fetch from local storage is merged on top of current field values', function() {
        var sameNick = 'bob'
        var user = new User({
          nick: sameNick,
          moodIndex: 1,
          moodMessage: 'first'
        })
        var savedFields = {
          nick: sameNick,
          moodMessage: 'second'
        }
        localStorage.setItem(user.userId(), JSON.stringify(savedFields))
        expect(user.fetch().nick()).toEqual(sameNick)
        expect(user.fetch().moodIndex()).toEqual(1)
        expect(user.fetch().moodMessage()).toEqual('second')
      })

      it('save and fetch can be chained', function() {
        var user = new User({
          nick: 'dog',
          moodIndex: 3
        })
        var expectedFields = {
          moodIndex: 3,
          moodMessage: user.defaultMoodMessage,
          nick : 'dog'
        }
        expect(user.fetch().save().fetch().save().fields).toEqual(expectedFields)
      })

      it('has pic url', function() {
        expect(new User({nick: 'any'}).picUrl('/pic').picUrl()).toEqual('/pic')
      })
    })
  })
})

