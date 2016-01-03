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

String.prototype.replaceBetween = function(start, end, what) {
    return this.substring(0, start) + what + this.substring(end + 1);
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

Array.prototype.contains = function(object) {
    var index = this.length;
    while (index--) {
        if (this[index] === object) return true;
    }
    return false;
}
;var Templating = function() {

}

Templating.prototype.messageTemplating = function(data) {
    var messageTemplate =
        '<div class="chat-line {MESSAGE_COLOR}" data-sender="{SENDER}">' +
            '<span class="time">{DATE}</span>' +
            '{USER_BADGES_ICONS}' +
            '<span class="user-name" style="color: {USER_COLOR}">{USER_NAME}:</span>' +
            '<span class="message">{MESSAGE}</span>' +
        '</div>';

    messageTemplate = messageTemplate.replace("{MESSAGE_COLOR}", data.messageColor);
    messageTemplate = messageTemplate.replace("{DATE}", data.messageDate);
    messageTemplate = messageTemplate.replace("{USER_COLOR}", data.userColor);
    messageTemplate = messageTemplate.replace("{USER_NAME}", data.userName);
    messageTemplate = messageTemplate.replace("{SENDER}", data.sender);
    messageTemplate = messageTemplate.replace("{MESSAGE}", data.textMessage);
    messageTemplate = messageTemplate.replace("{USER_BADGES_ICONS}", data.userBadges);

    return messageTemplate;
}

Templating.prototype.actionTemplating = function(data) {
    var messageTemplate =
        '<div class="chat-line {MESSAGE_COLOR}" data-sender="{SENDER}">' +
            '<span class="time">{DATE}</span>' +
            '{USER_BADGES_ICONS}' +
            '<span class="user-name" style="color: {USER_COLOR}">&bull; {USER_NAME}</span>' +
            '<span class="message">{MESSAGE}</span>' +
        '</div>';

    messageTemplate = messageTemplate.replace("{MESSAGE_COLOR}", data.messageColor);
    messageTemplate = messageTemplate.replace("{DATE}", data.messageDate);
    messageTemplate = messageTemplate.replace("{USER_COLOR}", data.userColor);
    messageTemplate = messageTemplate.replace("{USER_NAME}", data.userName);
    messageTemplate = messageTemplate.replace("{SENDER}", data.sender);
    messageTemplate = messageTemplate.replace("{MESSAGE}", data.textMessage);
    messageTemplate = messageTemplate.replace("{USER_BADGES_ICONS}", data.userBadges);

    return messageTemplate;
}

Templating.prototype.emoticonTemplating = function(emoticon_id) {
    var emoticon_template =
        '<span class="emoticon" style="' +
            'background-image: url(//static-cdn.jtvnw.net/emoticons/v1/{ID}/1.0); ' +
            'height: 24px; ' +
            'width: 24px; ' +
            'margin: -5px 0px;">' +
        '</span>';

    return emoticon_template.replace("{ID}", emoticon_id);
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
}
;var EmoticonHandler = function() {
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
        textMessage = message.message,
        replaces = [];

    for (var index = 0; index < emotes.length; index++) {
        replaces = this.prepareReplaces(emotes[index], replaces);
    }

    replaces.sort(function(a, b) { return b[0] - a[0]; });

    for (var index = 0; index < replaces.length; index++) {
        var replace = replaces[index],
            template = this.templating.emoticonTemplating(replace[2]);

        textMessage = textMessage.replaceBetween(replace[0], replace[1], template);
    }
    return textMessage;
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
;var ChatHandler = function(chatBox, chatInput) {
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
    if (user.user_name == 'gmanbot') color = 'blue';
    else if (user.user_name == 'twitchnotify') color = 'red';
    return color;
}

TwitchChat.prototype.getChatLine = function(message, messageType) {
    var processed_message = this.emoticonHandler.replaceEmoticons(message),
        userBadges = this.emoticonHandler.getUserBadges(message.user),
        templateData = {
            userName: message.user.display_name,
            sender: message.user.user_name,
            userColor: message.user.color,
            messageColor: this.getMessageColor(message.user, processed_message),
            messageDate: moment().format('HH:mm'),
            textMessage: processed_message,
            userBadges: userBadges
        };

    if (messageType == 'message') return this.templating.messageTemplating(templateData);
    else return this.templating.actionTemplating(templateData);
}

TwitchChat.prototype.addMessage = function(message, messageType) {
    var chatLine = this.getChatLine(message, messageType);

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
}
;var twitchChat = new TwitchChat();

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
