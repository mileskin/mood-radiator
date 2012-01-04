var specHelper = (function() {
  return {
    initContext: initContext,
    updateMood: updateMood,
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

  function updateMood(url) {
    waits(100)
    runs(function() {
      realAjax({url: url})
    })
  }

  function async(callback) {
    waits(100)
    runs(callback)
  }
})()

