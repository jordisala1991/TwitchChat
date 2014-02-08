var EmoticonHandler = function() {
    this.emoticons = [];
    this.templating = new Templating();
    this.initializeEmoticons();
}

EmoticonHandler.prototype.replaceEmoticonSet = function(set, textMessage) {
    var emoticonsSet = this.emoticons[set];

    if (emoticonsSet !== undefined) {
        for (var index = 0; index < emoticonsSet.length; index++) {
            var regExp = new RegExp(emoticonsSet[index].regex, 'g');
            textMessage = textMessage.replace(regExp, emoticonsSet[index].html);
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

EmoticonHandler.prototype.addToEmoticonSet = function(set, emoticon) {
    if (this.emoticons[set] == undefined) this.emoticons[set] = [];
    this.emoticons[set].push(emoticon);
}

EmoticonHandler.prototype.addToGeneralEmoticons = function(emoticon) {
    if (this.emoticons['general'] == undefined) this.emoticons['general'] = [];
    this.emoticons['general'].push(emoticon);
}

EmoticonHandler.prototype.buildEmoticonHtml = function(image) {
    var emoticonHtml = this.templating.emoticonTemplating({
        emoticonUrl: image.url,
        emoticonHeight: image.height,
        emoticonWidth: image.width,
        emoticonMargins: (18 - image.height)/2
    });

    return emoticonHtml;
}

EmoticonHandler.prototype.buildEmoticon = function(rawEmoticon, image) {
    var emoticon = {
        regex: rawEmoticon.regex,
        url: image.url,
        height: image.height,
        width: image.width,
        html: this.buildEmoticonHtml(image)
    };

    return emoticon;
}

EmoticonHandler.prototype.setEmoticons = function(emoticons) {
    for (var index = 0; index < emoticons.length; index++) {
        var rawEmoticon = emoticons[index];

        for (var indexj = 0; indexj < rawEmoticon.images.length; indexj++) {
            var emoticon = this.buildEmoticon(rawEmoticon, rawEmoticon.images[indexj]),
                set = rawEmoticon.images[indexj].emoticon_set;

            if (set == null) this.addToGeneralEmoticons(emoticon);
            else this.addToEmoticonSet(set, emoticon);
        };
    };
}

EmoticonHandler.prototype.initializeEmoticons = function() {
    var self = this;

    $.ajax({
        url: '/emoticons.json',
        dataType: 'json'
    }).done(function(emoticons) {
        self.setEmoticons(emoticons.emoticons);
    });
}