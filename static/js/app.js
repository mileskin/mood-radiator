var moodStyles = {
  1: 'aboutToDie',
  2: 'quiteBad',
  3: 'okish',
  4: 'quiteHappy',
  5: 'freakinEcstatic'
}

var defaultMoodMessage = 'business as usual'
var defaultMoodStyle = moodStyles[4]

$(document).ready(function() {
  $.get('/config', function(config) {
    _.each(config.users, function(user) {
      var userRow = $('<tr id="' + user.id + '"><td class="pic" style="background: url(\'/img/' + user.id + '.jpg\') no-repeat;"></td><td class="mood">' + defaultMoodMessage + '</td></tr>').addClass(defaultMoodStyle)
      $('.users').append(userRow)
    })
  })

  function updateMoodForUser(mood) {
    var moodElem = $('.users #' + mood.user + ' .mood')
    _.each(moodStyles, function(styleClass) {
      moodElem.removeClass(styleClass)
    })
    moodElem
      .text(mood.message)
      .addClass(moodStyles[mood.index])
  }

  var socket = io.connect(window.location.href)
  socket.on('mood', updateMoodForUser)
})

