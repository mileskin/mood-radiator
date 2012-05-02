var specHelper = (function() {
  return {
    initContext: initContext,
    resetBackend: resetBackend,
    updateMood: updateMood,
    updateMoodWithClient: updateMoodWithClient,
    registerUserWithClick: registerUserWithClick,
    async: async
  }

  function initContext(customOptions) {
    var defaultOptions = {
      beforeViewInit: function() {}
    }
    var options = $.extend(defaultOptions, customOptions)
    useRealAjaxFor({url: '/config', type: 'get'})
    useRealAjaxFor({url: '/users', type: 'post'})
    localStorage.clear()
    options.beforeViewInit()
    $.teamRadar.view.init()
  }

  function resetBackend() {
    useRealAjaxFor({url: '/all', type: 'delete'})
    $.ajax({
      type: 'delete',
      url: '/all'
    })
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
    waits(200)
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

  function registerUserWithClick(nick, gravatarUsername) {
    waits(200)
    runs(function() {
      $('.client #nickInput').val(nick)
      $('.client #gravatarUsernameInput').val(gravatarUsername)
      $('.client .registerNewUser').click()
    })
    waits(200)
  }

  function async(callback) {
    waits(200)
    runs(callback)
  }
})()

