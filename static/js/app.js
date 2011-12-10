$(document).ready(function() {
  var socket = io.connect(window.location.href)
  socket.on('mood', function (data) {
    console.log(data)
    $('.main .users .bob').text(data.message)
  })
})

