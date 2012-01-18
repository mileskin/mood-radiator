(function(teamRadar, $) {
  teamRadar.domain = {
    User: User
  }

  function User(customFields) {
    this.defaultMoodMessage = 'business as usual'
    this.defaultMoodIndex = 4
    this.timestampFormat = 'DD.MM.YYYY HH:mm:ss'

    if (_.isEmpty(customFields) || _.isEmpty(customFields.nick)) {
      throw 'nick must be specified in custom fields'
    }

    this.fields = $.extend({
      moodIndex: this.defaultMoodIndex,
      moodMessage: this.defaultMoodMessage,
    }, customFields)

    this.nick = function() { return this.fields.nick }
    this.gravatarUsername = function() { return this.fields.gravatarUsername }
    this.moodIndex = function() { return this.fields.moodIndex }
    this.moodMessage = function() { return this.fields.moodMessage }
    this.updatedAt = function(timestamp) { return this.fieldValue('updatedAt', timestamp) }
    this.picUrl = function(url) { return this.fieldValue('picUrl', url) }

    this.fieldValue = function(field, value) {
      if (value) {
        this.fields[field] = value
        return this
      } else {
        return this.fields[field]
      }
    }

    this.save = function() {
      this.updatedAt(moment().format(this.timestampFormat))
      localStorage.setItem(this.userId(), JSON.stringify(this.fields))
      return this
    }

    this.fetch = function() {
      this.fields = $.extend(this.fields, $.parseJSON(localStorage.getItem(this.userId())))
      return this
    }

    this.userId = function() {
      return 'teamRadar:user:' + this.nick()
    }
  }
})(jQuery.teamRadar, jQuery)

