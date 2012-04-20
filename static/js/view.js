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
    $.get('/config', function(config) {
      $('.clientContainer').empty()
      var isRadiatorMode = document.location.href.match(/\/\?radiator=true$/)
      if (!isRadiatorMode) {
        initClient(config)
      }
      initUserRows(config)
    })
  }

  function initClient(config) {
    $('.clientContainer').append(ich.clientForPostingMoodUpdates())
    _.each(config.users, function(configUser) {
      var user = new User(configUser).fetch()
      $('.client .nicks').append(ich.nickOption(user))
    })
    $('.client .sendMoodUpdate').click(function(event) {
      event.preventDefault()
      var nick = $('.client .nicks option:selected').val()
      var input = $('.client .moodUpdateInput').val()
      var currentIndex = new User({nick: nick}).fetch().moodIndex()
      var mood = parseIndexAndMessageFrom(input, currentIndex)
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

  function parseIndexAndMessageFrom(string, defaultIndex) {
    var a = string.split(' ')
    if (Number(a[0])) {
      return {
        index: a[0],
        message: _.tail(a).join(' ')
      }
    } else {
      return {
        index: defaultIndex,
        message: string
      }
    }
  }

  function initUserRows(config) {
    $('.users').empty()
    _.each(config.users, function(configUser) {
      initUserRow(new User(configUser).fetch().save(), config.userRowHeight)
    })
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
      updateMood(new User(data).save())
    })
  }

  function updateMood(user) {
    var userRow = $('.user#' + user.nick())
    _.each(moodStyles, function(styleClass) {
      userRow.find('.moodIndicator').removeClass(styleClass)
    })
    userRow.find('.moodIndicator').addClass(moodStyles[user.moodIndex()])
    userRow.find('.updatedAt').text(user.updatedAt())
    userRow.find('.moodMessage').text(user.moodMessage())
    userRow.find('.moodMessage').css('font-size', calculateFontSize(user.moodMessage())) 
    var throttledAnimation = _.throttle(animateMoodUpdate, 5000)
    throttledAnimation(userRow)
  }

  function calculateFontSize(moodMsg) {
    var maxAt = 30
    var overSize = moodMsg.length <= maxAt ? 0 : moodMsg.length - maxAt
    var factor = 0.4
    var fontSize = Math.max(25, 100 - factor * overSize)
    return fontSize + "%"
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

