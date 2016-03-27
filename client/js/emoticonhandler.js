var EmoticonHandler = function() {
    this.subscriberBadge = null;
    this.templating = new Templating();
}

EmoticonHandler.prototype.prepareReplaces = function(text, emote, replaces) {
    var splitted = emote.split(':'),
        id = parseInt(splitted[0]),
        positions = splitted[1].split(',');


    for (var index = 0; index < positions.length; index++) {
        var positions_splitted = positions[index].split('-'),
            start = parseInt(positions_splitted[0]),
            end = parseInt(positions_splitted[1]),
            name = text.substring(start, end + 1);

        replaces.push([start, end, id, name]);
    }
    return replaces;
}

EmoticonHandler.prototype.replaceEmoticons = function(message) {
    if (!message.emotes) return message.message;

    var emotes = message.emotes.split('/'),
        text = message.message,
        replaces = [];

    for (var index = 0; index < emotes.length; index++) {
        replaces = this.prepareReplaces(text, emotes[index], replaces);
    }

    replaces.sort(function(a, b) { return b[0] - a[0]; });

    for (var index = 0; index < replaces.length; index++) {
        var replace = replaces[index],
            template = this.templating.emoticonTemplating(replace[2], replace[3]);

        text = text.replaceBetween(replace[0], replace[1], template);
    }
    return text;
}

EmoticonHandler.prototype.getUserBadges = function(user) {
    var icons = '';

    for (var index = 0; index < user.modes.length; index++) {
        var mode = user.modes[index];

        if (mode === 'subscriber') icons += this.templating.subscriberTemplating(this.subscriberBadge);
        else icons += this.templating.badgeTemplating(mode);
    };
    return icons;
}

EmoticonHandler.prototype.setSubscriberBadge = function(channelName) {
    var that = this;

    $.ajax({
        url: 'https://api.twitch.tv/kraken/chat/' + channelName.substring(1) + '/badges',
        dataType: 'jsonp'
    }).done(function(badges) {
        if (badges.subscriber !== null) {
            that.subscriberBadge = badges.subscriber.image;
        }
    });
}
