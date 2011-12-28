(function($) {
  if (!$.teamRadar) {
    $.teamRadar = {
      init: init
    }
  }

  var moodStyles = {
    1: 'aboutToDie',
    2: 'quiteBad',
    3: 'okish',
    4: 'quiteHappy',
    5: 'freakinEcstatic'
  }

  var defaultMoodMessage = 'business as usual'
  var defaultMoodIndex = 4
  var defaultUserRowHeight = '200'

  function init() {
    initUsers()
    initMoodUpdateListener()
  }

  function initUsers() {
    $.get('/config', initUserRows)
  }

  function initUserRows(config) {
    _.each(config.users, function(user) {
      initUserRow(user, config.userRowHeight)
    })
  }

  function initUserRow(user, rowHeight) {
    resolvePicUrl(user, rowHeight, function(picUrl) {
      $.extend(user, {picUrl: picUrl})
      $('.users').append(ich.userRow(user))
      var nick = user.nick
      var currentMood = getCurrentMoodForUser(nick)
      if (!_.isEmpty(currentMood)) {
        updateMoodForUser({nick: nick, index: currentMood.index, message: currentMood.message})
      } else {
        updateMoodForUser({nick: nick, index: defaultMoodIndex, message: defaultMoodMessage})
      }
    })
  }

  function resolvePicUrl(user, rowHeight, callback) {
    if (user.gravatarUsername) {
      var gravatarRequest = $.ajax({
        url: 'http://en.gravatar.com/' + user.gravatarUsername + '.json',
        type: 'get',
        async: true,
        dataType: 'jsonp'
      })
      gravatarRequest.success(function(data) {
        var hash = data.entry[0].hash
        picUrl = 'http://www.gravatar.com/avatar/' + hash + '?s=' + rowHeight || defaultUserRowHeight
        callback(picUrl)
      })
    } else {
      picUrl = '/img/' + user.nick + '.jpg'
      callback(picUrl)
    }
  }

  function initMoodUpdateListener() {
    var socket = io.connect(window.location.href)
    socket.on('moodUpdate', updateMoodForUser)
  }

  function updateMoodForUser(data) {
    var userRow = $('.user#' + data.nick)
    _.each(moodStyles, function(styleClass) {
      userRow.find('.moodIndicator').removeClass(styleClass)
    })
    userRow.find('.moodIndicator').addClass(moodStyles[data.index])
    userRow.find('.moodMessage').text(data.message)
    saveCurrentMoodForUser(data)
  }

  function saveCurrentMoodForUser(user) {
    localStorage.setItem(user.nick + '.index', user.index)
    localStorage.setItem(user.nick + '.message', user.message)
  }

  function getCurrentMoodForUser(nick) {
    var index = localStorage.getItem(nick + '.index')
    if (index) {
      return {
        index: index,
        message: localStorage.getItem(nick + '.message')
      }
    } else {
      return {}
    }
  }
})(jQuery)

