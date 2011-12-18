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

  function init() {
    initUsers()
    initMoodUpdateListener()
  }

  function initUsers() {
    $.get('/config', function(config) {
      _.each(config.users, function(user) {
        $('.users').append(ich.userRow(user))
        var nick = user.nick
        var currentMood = getCurrentMoodForUser(nick)
        if (!_.isEmpty(currentMood)) {
          updateMoodForUser({nick: nick, index: currentMood.index, message: currentMood.message})
        } else {
          updateMoodForUser({nick: nick, index: defaultMoodIndex, message: defaultMoodMessage})
        }
      })
    })
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

