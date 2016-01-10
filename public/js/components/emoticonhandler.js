var EmoticonHandler = function() {
    this.badges = [];
    this.templating = new Templating();
    this.initializeEmoticons();
}

EmoticonHandler.prototype.prepareReplaces = function(emote, replaces) {
    var splitted = emote.split(':'),
        id = parseInt(splitted[0]),
        positions = splitted[1].split(',');

    for (var index = 0; index < positions.length; index++) {
        var positions_splitted = positions[index].split('-'),
            start = parseInt(positions_splitted[0]),
            end = parseInt(positions_splitted[1]);

        replaces.push([start, end, id]);
    }
    return replaces;
}

EmoticonHandler.prototype.replaceEmoticons = function(message) {
    if (!message.emotes) return message.message;

    var emotes = message.emotes.split('/'),
        text = message.message,
        replaces = [];

    for (var index = 0; index < emotes.length; index++) {
        replaces = this.prepareReplaces(emotes[index], replaces);
    }

    replaces.sort(function(a, b) { return b[0] - a[0]; });

    for (var index = 0; index < replaces.length; index++) {
        var replace = replaces[index],
            template = this.templating.emoticonTemplating(replace[2]);

        text = text.replaceBetween(replace[0], replace[1], template);
    }
    return text;
}

EmoticonHandler.prototype.getUserBadges = function(user) {
    var icons = '';

    for (var index = 0; index < user.modes.length; index++) {
        var mode = user.modes[index];

        if (mode in this.badges) icons += this.badges[mode];
    };
    return icons;
}

EmoticonHandler.prototype.setBadges = function(badges) {
    var self = this;

    $.each(badges, function(mode, badge) {
        if (mode == 'subscriber' && badge !== null) self.badges[mode] = self.templating.subscriberTemplating(badge.image);
        else self.badges[mode] = self.templating.badgeTemplating(mode);
    });
}

EmoticonHandler.prototype.initializeEmoticons = function() {
    var self = this;

    $.ajax({
        url: 'https://api.twitch.tv/kraken/chat/' + channelName.substring(1) + '/badges',
        dataType: 'jsonp'
    }).done(function(badges) {
        delete badges['_links'];
        self.setBadges(badges);
    });
}
