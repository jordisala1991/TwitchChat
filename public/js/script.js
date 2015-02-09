String.prototype.linkify = function() {
    var replacedText,
        replacePattern1,
        replacePattern2;

    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

    replacedText = this.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
    return replacedText;
}

Array.prototype.contains = function(object) {
    var index = this.length;
    while (index--) {
        if (this[index] === object) return true;
    }
    return false;
};var Templating = function() {

}

Templating.prototype.messageTemplating = function(data) {
    var messageTemplate = 
        '<div class="chat-line {MESSAGE_COLOR}" data-sender="{SENDER}">' +
            '<span>[{DATE}]</span>' +
            '{USER_BADGES_ICONS}' +
            '<span class="user-name" style="color: {USER_COLOR}">&lt;{USER_NAME}&gt;</span>' +
            '<span class="message">{MESSAGE}</span>' +
        '</div>';

    messageTemplate = messageTemplate.replace("{MESSAGE_COLOR}", data.messageColor);
    messageTemplate = messageTemplate.replace("{DATE}", data.messageDate);
    messageTemplate = messageTemplate.replace("{USER_COLOR}", data.userColor);
    messageTemplate = messageTemplate.replace("{USER_NAME}", data.userName);
    messageTemplate = messageTemplate.replace("{SENDER}", data.userName);
    messageTemplate = messageTemplate.replace("{MESSAGE}", data.textMessage);
    messageTemplate = messageTemplate.replace("{USER_BADGES_ICONS}", data.userBadges);

    return messageTemplate;
}

Templating.prototype.actionTemplating = function(data) {
    var messageTemplate = 
        '<div class="chat-line {MESSAGE_COLOR}" data-sender="{SENDER}">' +
            '<span>[{DATE}]</span>' +
            '{USER_BADGES_ICONS}' +
            '<span class="user-name" style="color: {USER_COLOR}">&bull; {USER_NAME}</span>' +
            '<span class="message">{MESSAGE}</span>' +
        '</div>';

    messageTemplate = messageTemplate.replace("{MESSAGE_COLOR}", data.messageColor);
    messageTemplate = messageTemplate.replace("{DATE}", data.messageDate);
    messageTemplate = messageTemplate.replace("{USER_COLOR}", data.userColor);
    messageTemplate = messageTemplate.replace("{USER_NAME}", data.userName);
    messageTemplate = messageTemplate.replace("{SENDER}", data.userName);
    messageTemplate = messageTemplate.replace("{MESSAGE}", data.textMessage);
    messageTemplate = messageTemplate.replace("{USER_BADGES_ICONS}", data.userBadges);

    return messageTemplate;
}

Templating.prototype.emoticonTemplating = function(data) {
    var emoticonTemplate =
        '<span class="emoticon" style="' +
            'background-image: url({BACKGROUND_IMAGE}); ' +
            'height: {HEIGHT}px; ' +
            'width: {WIDTH}px; ' +
            'margin: {MARGIN_TOP}px 0px;">' +
        '</span>';

    emoticonTemplate = emoticonTemplate.replace("{BACKGROUND_IMAGE}", data.emoticonUrl);
    emoticonTemplate = emoticonTemplate.replace("{HEIGHT}", data.emoticonHeight);
    emoticonTemplate = emoticonTemplate.replace("{WIDTH}", data.emoticonWidth);
    emoticonTemplate = emoticonTemplate.replace("{MARGIN_TOP}", data.emoticonMargins);

    return emoticonTemplate;
}

Templating.prototype.subscriberTemplating = function(imageUrl) {
    var badgeTemplate =
        '<span class="badge" style="' +
            'background-image: url({BACKGROUND_IMAGE});">' +
        '</span>';

    badgeTemplate = badgeTemplate.replace("{BACKGROUND_IMAGE}", imageUrl);

    return badgeTemplate;
}

Templating.prototype.badgeTemplating = function(badge) {
    var badgeTemplate =
        '<span class="badge {BADGE}"></span>';

    badgeTemplate = badgeTemplate.replace("{BADGE}", badge);

    return badgeTemplate;
};var EmoticonHandler = function() {
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

EmoticonHandler.prototype.buildEmoticon = function(rawEmoticon, image) {
    var emoticonHtml = this.templating.emoticonTemplating({
            emoticonUrl: image.url,
            emoticonHeight: image.height,
            emoticonWidth: image.width,
            emoticonMargins: (18 - image.height)/2
        }),    
        emoticon = {
            regex: rawEmoticon.regex,
            url: image.url,
            height: image.height,
            width: image.width,
            html: emoticonHtml
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
};var ChatHandler = function(chatBox, chatInput) {
    this.messageCount = 1;
    this.chatBox = chatBox;
    this.chatInput = chatInput;
    this.maxChatMessages = 150;
}

ChatHandler.prototype.isScrolledToBottom = function() {
    return (this.chatBox[0].scrollHeight - this.chatBox.scrollTop() - 15) <= this.chatBox.outerHeight();
}

ChatHandler.prototype.scrollDown = function() {
    this.chatBox.scrollTop(this.chatBox[0].scrollHeight);
}

ChatHandler.prototype.deleteFirstMessages = function() {
    while (this.messageCount > this.maxChatMessages) {
        --this.messageCount;
        this.chatBox.find('.chat-line').first().remove();
    }
}

ChatHandler.prototype.addChatLine = function(chatLine) {
    var shouldScroll = this.isScrolledToBottom();

    ++this.messageCount;
    this.chatBox.append(chatLine);
    if (shouldScroll) {
        this.deleteFirstMessages();
        this.scrollDown();
    }
}

ChatHandler.prototype.removeAllChatLines = function() {
    this.chatBox.find('div').remove();
}

ChatHandler.prototype.removeChatLinesFrom = function(userName) {
    var messagesToDelete = this.chatBox.find('div[data-sender="' + userName + '"]');

    messagesToDelete.each(function() {
        $(this).removeClass().addClass('chat-line').addClass('grey');
        $(this).find('span.message').text('<message deleted>');
    });
}

ChatHandler.prototype.clearChatInput = function() {
    this.chatInput.val('');
}

ChatHandler.prototype.trackEvent = function(category, action, label) {
    if (typeof ga !== 'undefined') {
        ga('send', 'event', category, action, label);        
    }
};var TwitchChat = function() {
    this.socket = io.connect(baseUrl);
    this.templating = new Templating();
    this.chatHandler = new ChatHandler($('.chat-lines'), $('.chat-input'));
    this.emoticonHandler = new EmoticonHandler();
    this.userName = '';
}

TwitchChat.prototype.getMessageColor = function(user, textMessage) {
    var color = 'black';
    if (/bob/i.test(textMessage)) color = 'green';
    if (user.userName == 'gmanbot') color = 'blue';
    else if (user.userName == 'twitchnotify') color = 'red';
    return color;
}

TwitchChat.prototype.getChatLine = function(textMessage, user, messageType) {
    var message = textMessage.linkify(),
        processedMessage = this.emoticonHandler.replaceEmoticons(message, user),
        userBadges = this.emoticonHandler.getUserBadges(user),
        templateData = {
            userName: user.userName,
            userColor: user.userColor,
            messageColor: this.getMessageColor(user, processedMessage),
            messageDate: moment().format('HH:mm'),
            textMessage: processedMessage,
            userBadges: userBadges
        };

    if (messageType == 'message') return this.templating.messageTemplating(templateData);
    else return this.templating.actionTemplating(templateData);
}

TwitchChat.prototype.addMessage = function(message, messageType) {
    var chatLine = this.getChatLine(message.message, message.user, messageType);
    
    this.chatHandler.addChatLine(chatLine);
}

TwitchChat.prototype.deleteAllMessages = function() {
    this.chatHandler.removeAllChatLines();
}

TwitchChat.prototype.deleteMessages = function(userName) {
    this.chatHandler.removeChatLinesFrom(userName);
}

TwitchChat.prototype.sendMessage = function(textMessage, eventAction) {
    if (textMessage != '') {
        this.socket.emit('message_to_send', textMessage);
        this.chatHandler.clearChatInput();
        this.chatHandler.trackEvent('Sending Messages', eventAction, this.userName);
    }
}

TwitchChat.prototype.sendCredentials = function(userName, token) {
    this.userName = userName;
    this.chatHandler.trackEvent('Twitch Login', 'Succesful Login', this.userName);
    this.socket.json.emit('login', { 'username': userName, 'oauth': 'oauth:' + token });
};var twitchChat = new TwitchChat();

Twitch.init({clientId: clientId}, function(error, status) {
    if (error) console.log(error);

    if (status.authenticated) {
        var token = Twitch.getToken();

        Twitch.api({method: 'user'}, function(error, user) {
            if (error) console.log(error);
            twitchChat.sendCredentials(user.name, token);
        });
        $('.chat-input').attr('placeholder', 'Chat about this Channel');
    }
    else {
        $('.chat-input').attr('placeholder', 'Sign up or log in to chat');
        $('.chat-input').attr('disabled', 'disabled');
        $('.twitch-connect').show();
        $('.twitch-connect').click(function() {
            twitchChat.chatHandler.trackEvent('Twitch Login', 'Button');
            Twitch.login({
                redirect_uri: baseUrl,
                popup: false,
                scope: ['user_read', 'chat_login']
            });
        });
    }
});

$(document).ready(function() {
    $('.chat-input').keypress(function(e) {
        if (e.which == 13) {
            twitchChat.sendMessage($('.chat-input').val(), 'Keyboard');
            e.preventDefault();
        }
    });

    $('.send-chat-message').click(function() {
        twitchChat.sendMessage($('.chat-input').val(), 'Button');
    });

    twitchChat.socket.on('message', function(message) {
        twitchChat.addMessage(message, 'message');
    });
    
    twitchChat.socket.on('action', function(message) {
        twitchChat.addMessage(message, 'action');
    });
    
    twitchChat.socket.on('clear_chat', function(userName) {
        twitchChat.deleteMessages(userName);
    });

    twitchChat.socket.on('clear_all_chat', function() {
        twitchChat.deleteAllMessages();
    });
});