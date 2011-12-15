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

  function updateMoodForUser(data) {
    var moodElem = $('.users #' + data.user + ' .mood')
    _.each(moodStyles, function(styleClass) {
      moodElem.removeClass(styleClass)
    })
    moodElem
      .text(data.message)
      .addClass(moodStyles[data.index])
  }

  var socket = io.connect(window.location.href)
  socket.on('moodUpdate', updateMoodForUser)
})

