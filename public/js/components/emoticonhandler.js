var EmoticonHandler = function() {
    this.emoticons = [];
    this.badges = [];
    this.templating = new Templating();
    this.initializeEmoticons();
}

EmoticonHandler.prototype.replaceEmoticonSet = function(set, textMessage) {
    var emoticonsSet = this.emoticons[set];

    if (emoticonsSet !== undefined) {
        for (var index = 0; index < emoticonsSet.length; index++) {
            var emoticon = emoticonsSet[index],
                regExp = new RegExp(emoticon.regex, 'g');

            if (emoticon.html !== undefined) textMessage = textMessage.replace(regExp, emoticon.html);
        };
    }
    return textMessage;
}

EmoticonHandler.prototype.replaceEmoticons = function(textMessage, user) {
    var sets = user.emoteSets;

    for (var index = 0; index < sets.length; index++) {
        textMessage = this.replaceEmoticonSet(sets[index], textMessage);
    };
    return textMessage;
}

EmoticonHandler.prototype.getUserBadges = function(user) {
    var icons = '';

    for (var index = 0; index < user.userModes.length; index++) {
        var mode = user.userModes[index];

        if (this.badges[mode] !== undefined) icons += this.badges[mode];
    };
    return icons;
}

EmoticonHandler.prototype.addToEmoticonSet = function(set, emoticon) {
    if (this.emoticons[set] == undefined) this.emoticons[set] = [];
    this.emoticons[set].push(emoticon);
}

EmoticonHandler.prototype.addToGeneralEmoticons = function(emoticon) {
    if (this.emoticons['general'] == undefined) this.emoticons['general'] = [];
    this.emoticons['general'].push(emoticon);
}

EmoticonHandler.prototype.buildEmoticon = function(rawEmoticon) {
    var emoticonHtml = this.templating.emoticonTemplating({
        emoticonId: rawEmoticon.id,
        emoticonHeight: 24,
        emoticonWidth: 24,
        emoticonMargins: -5
    });

    return {
        regex: rawEmoticon.code,
        html: emoticonHtml
    };
}

EmoticonHandler.prototype.setEmoticons = function(emoticons) {
    for (var index = 0; index < emoticons.length; index++) {
        var rawEmoticon = emoticons[index],
            emoticon = this.buildEmoticon(rawEmoticon),
            set = rawEmoticon.emoticon_set;

        if (set == null) this.addToGeneralEmoticons(emoticon);
        else this.addToEmoticonSet(set, emoticon);
    };
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
        url: '/emoticons.json',
        dataType: 'json'
    }).done(function(emoticons) {
        self.setEmoticons(emoticons.emoticons);
    });

    $.ajax({
        url: 'https://api.twitch.tv/kraken/chat/' + channelName.substring(1) + '/badges',
        dataType: 'jsonp'
    }).done(function(badges) {
        delete badges['_links'];
        self.setBadges(badges);
    });
}
