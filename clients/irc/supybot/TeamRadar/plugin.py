from supybot.commands import *
import supybot.callbacks as callbacks
import urllib
import urllib2

TEAM_RADAR_BASE_URL = "http://localhost:8085"

class TeamRadar(callbacks.Plugin):

    def mood(self, irc, msg, args, mood_index, mood_message):
        """<mood index (number) from 1 to 5> <mood message>

        Lets you express your current mood using a number (from 1=bad to 5=perfect)
        and a message explaining the reason for your sudden mood change :-P
        """
        mood_update_url = "%s/mood/%s/%s/%s" % \
            (TEAM_RADAR_BASE_URL, msg.nick, mood_index, urllib.quote(mood_message))
        urllib2.urlopen(mood_update_url)
        irc.reply("updated team radar at %s" % (TEAM_RADAR_BASE_URL))
    mood = wrap(mood, [('int', 'mood from 1 to 5'), 'text'])

Class = TeamRadar

