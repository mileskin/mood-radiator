exports.createUser = function(nick, gravatarUsername) {
  var user = {}
  user['nick'] = nick
  if (gravatarUsername) {
    user['gravatarUsername'] = gravatarUsername
  }
  return user
}
