(function(teamRadar, $) {
  teamRadar.view = {
    init: init
  }

  var User = $.teamRadar.domain.User

  var moodStyles = {
    1: 'aboutToDie',
    2: 'quiteBad',
    3: 'okish',
    4: 'quiteHappy',
    5: 'freakinEcstatic'
  }

  var defaultUserRowHeight = '200'

  function init() {
    initMoodUpdateListener()
    initClient()
    initUserRows()
    $.get('/config', function(config) {
      _.each(config.users, function(configUser) {
        var user = new User(configUser).fetch()
        $('.client .nicks').append(ich.nickOption(user))
        initUserRow(user, config.userRowHeight)
      })
    })
  }

  function initClient() {
    $('.client .nicks').empty()
    $('.client .sendMoodUpdate').click(function(event) {
      event.preventDefault()
      var nick = $('.client .nicks option:selected').val()
      var currentIndex = new $.teamRadar.domain.User({nick: nick}).fetch().moodIndex()
      var mood = parseIndexAndMessageFrom($('.client .moodUpdateInput').val(), currentIndex)
      $.ajax({
        type: 'post',
        url: '/moodUpdate',
        async: false,
        data: {
          nick: nick,
          moodIndex: mood.index,
          moodMessage: mood.message
        }
      })
    })
  }

  function parseIndexAndMessageFrom(string, currentIndex) {
    var a = string.split(' ')
    if (Number(a[0])) {
      return {
        index: a[0],
        message: _.tail(a).join(' ')
      }
    } else {
      return {
        index: currentIndex,
        message: string
      }
    }
  }

  function initUserRows() {
    $('.users').empty()
  }

  function initUserRow(user, rowHeight) {
    resolvePicUrl(user, rowHeight, function(picUrl) {
      user.picUrl(picUrl)
      $('.users').append(ich.userRow(user))
      updateMood(user)
    })
  }

  function resolvePicUrl(user, rowHeight, callback) {
    if (user.gravatarUsername()) {
      var gravatarRequest = $.ajax({
        url: 'http://en.gravatar.com/' + user.gravatarUsername() + '.json',
        type: 'get',
        async: true,
        dataType: 'jsonp',
        success: function(data) {
          var hash = data.entry[0].hash
          var picUrl = 'http://www.gravatar.com/avatar/' + hash + '?s=' + (rowHeight || defaultUserRowHeight)
          callback(picUrl)
        }
      })
    } else {
      var picUrl = '/img/' + user.nick() + '.jpg'
      callback(picUrl)
    }
  }

  function initMoodUpdateListener() {
    var socket = io.connect(window.location.href)
    socket.on('moodUpdate', function(data) {
      updateMood(new User(data))
    })
  }

  function updateMood(user) {
    var userRow = $('.user#' + user.nick())
    _.each(moodStyles, function(styleClass) {
      userRow.find('.moodIndicator').removeClass(styleClass)
    })
    userRow.find('.moodIndicator').addClass(moodStyles[user.moodIndex()])
    userRow.find('.moodMessage').text(user.moodMessage())
    user.save()
    var throttledAnimation = _.throttle(animateMoodUpdate, 5000)
    throttledAnimation(userRow)
  }

  function animateMoodUpdate(userRow) {
    userRow.find('.moodMessage.initiated').addClass('recentlyUpdated')
    _.delay(function() {
      userRow.find('.moodMessage.initiated').addClass('undoRecentlyUpdated')
      _.delay(function() {
        userRow.find('.moodMessage.recentlyUpdated').removeClass('recentlyUpdated')
        userRow.find('.moodMessage.undoRecentlyUpdated').removeClass('undoRecentlyUpdated')
        userRow.find('.moodMessage').addClass('initiated')
      }, 2000)
    }, 3000)
  }
})(jQuery.teamRadar, jQuery)

