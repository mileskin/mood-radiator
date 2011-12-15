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
        var userRow = $('<tr class="user" id="' + user.nick + '"><td class="pic" style="background: url(\'/img/' + user.nick + '.jpg\') no-repeat;"></td><td class="nickContainer moodIndicator"><span class="nick">' + user.nick + '</span></td><td class="moodMessage moodIndicator"/></tr>')
        $('.users').append(userRow)
        updateMoodForUser({nick: user.nick, index: defaultMoodIndex, message: defaultMoodMessage})
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
  }
})(jQuery)

