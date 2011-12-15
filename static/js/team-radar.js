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
        var userRow = $('<tr id="' + user.id + '"><td class="pic" style="background: url(\'/img/' + user.id + '.jpg\') no-repeat;"></td><td class="mood"></td></tr>')
        $('.users').append(userRow)
        updateMoodForUser({user: user.id, index: defaultMoodIndex, message: defaultMoodMessage})
      })
    })
  }

  function initMoodUpdateListener() {
    var socket = io.connect(window.location.href)
    socket.on('moodUpdate', updateMoodForUser)
  }

  function updateMoodForUser(data) {
    var moodElem = $('.users #' + data.user + ' .mood')
    _.each(moodStyles, function(styleClass) {
      moodElem.removeClass(styleClass)
    })
    moodElem
      .html('<span class="nick">' + data.user + '</span>' + data.message)
      .addClass(moodStyles[data.index])
  }
})(jQuery)

