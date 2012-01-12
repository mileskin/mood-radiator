var specHelper = (function() {
  return {
    initContext: initContext,
    updateMood: updateMood,
    updateMoodWithClient: updateMoodWithClient,
    async: async
  }

  function initContext(customOptions) {
    var defaultOptions = {
      config: {
        users: {
          a: {nick: 'bob'},
          b: {nick: 'jill'}
        }
      },
      beforeViewInit: function() {}
    }
    var options = $.extend(defaultOptions, customOptions)
    registerFakeAjax({url: '/config', successData: options.config})
    localStorage.clear()
    options.beforeViewInit()
    $.teamRadar.view.init()
  }

  function updateMoodWithClient(nick, message) {
    runs(function() {
      $('.client .nicks option').removeAttr('selected')
      $('.client .nicks option[name="' + nick + '"]').attr('selected', true)
      $('.client .moodUpdateInput').val(message)
      $('.client .sendMoodUpdate').click()
    })
  }

  function updateMood(nick, index, message) {
    waits(100)
    runs(function() {
      realAjax({
        type: 'post',
        url: 'moodUpdate',
        data: {
          nick: nick,
          moodIndex: index,
          moodMessage: message
        }
      })
    })
  }

  function async(callback) {
    waits(100)
    runs(callback)
  }
})()

