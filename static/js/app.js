$(document).ready(function() {
  $.get('/config', function(config) {
    _.each(config.users, function(user) {
      var userRow = '<tr id="' + user.id + '"><td class="pic" style="background: url(\'/img/' + user.id + '.jpg\') no-repeat;"></td><td class="mood" style="background-color: lightGreen;"></td></tr>'
      $('.users').append(userRow)
    })
  })

  var socket = io.connect(window.location.href)
  socket.on('mood', function (mood) {
    $('.users #' + mood.user + ' .mood').text(mood.message)
  })
})

