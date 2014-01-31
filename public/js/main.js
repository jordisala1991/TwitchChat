var socket = io.connect(socketUrl);
var messageCount = 1;
var emoticons;

Array.prototype.contains = function(object) {
    var index = this.length;
    while (index--) {
        if (this[index] === object) return true;
    }
    return false;
}

Twitch.init({clientId: '1uzx8xlados5eqn7sb0pexoyuzkc1g9'}, function(error, status) {
    if (error) console.log(error);

    Twitch.api({method: 'chat/' + channelName.substring(1) + '/emoticons'}, function(error, data) {
        if (error) console.log(error);
        emoticons = $.map(data.emoticons, processEmoticon);
    });

    if (status.authenticated) {
        var token = Twitch.getToken();

        Twitch.api({method: 'user'}, function(error, user) {
            if (error) console.log(error);
            socket.emit('login', {'username': user.name, 'oauth': token});
        });
    }
    else {
        $('.twitch-connect').show();
        $('.twitch-connect').click(function() {
            Twitch.login({ scope: ['user_read', 'chat_login'] });
        });
    }
});

function getMessageColor(userName, textMessage) {
    var color = 'black';
    if (/bob/i.test(textMessage)) color = 'green';
    if (userName == 'gmanbot') color = 'blue';
    else if (userName == 'twitchnotify') color = 'red';
    return color;
}

function processEmoticon(rawEmoticon) {
    var template = 
        '<span class="emoticon" style="' +
            'background-image: url({BACKGROUND_IMAGE}); ' +
            'height: {HEIGHT}px; ' +
            'width: {WIDTH}px;' +
            'margin: {MARGIN_TOP}px 0px;">' +
        '</span>';

    template = template.replace("{BACKGROUND_IMAGE}", rawEmoticon.url);
    template = template.replace("{HEIGHT}", rawEmoticon.height);
    template = template.replace("{WIDTH}", rawEmoticon.width);
    template = template.replace("{MARGIN_TOP}", (18-rawEmoticon.height)/2);

    rawEmoticon.html = template
    return rawEmoticon;
}

function scrolledToBottom(box) {
    return (box[0].scrollHeight - box.scrollTop() - 15) <= box.outerHeight();
}

function scrollDown(box) {
    box.scrollTop(box[0].scrollHeight);
}

function deleteFirstMessage(box) {
    --messageCount;
    box.find('.chat-line').first().remove();
}

function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2;

    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    return replacedText;
}

function getUserModesIcons(userModes) {
    var icons = '';
    for (var index = 0; index < userModes.length; index++) {
        icons += '<span class="icon ' + userModes[index] + '"></span>';
    };
    return icons;
}

function replaceEmoticons(textMessage, is_subscriber) {
    for (var index = emoticons.length - 1; index >= 0; index--) {
        if (emoticons[index].subscriber_only) {
            if (is_subscriber) textMessage = textMessage.replace(new RegExp(emoticons[index].regex, 'g'), emoticons[index].html);
        }
        else textMessage = textMessage.replace(new RegExp(emoticons[index].regex, 'g'), emoticons[index].html);
    };
    return textMessage;
}

function getChatLine(message) {
    var textMessage = replaceEmoticons(linkify(message.message), message.user.userModes.contains('subscriber'));
        template = 
        '<div class="chat-line {MESSAGE_COLOR}">' +
            '<span>[{DATE}]</span>' +
            '{USER_MODE_ICONS}' +
            '<span class="user-name" style="color: {USER_COLOR}">&lt;{USER_NAME}&gt;</span>' +
            '<span>{MESSAGE}</span>' +
        '</div>';

    template = template.replace("{MESSAGE_COLOR}", getMessageColor(message.user.userName, textMessage));
    template = template.replace("{DATE}", moment().format('HH:mm'));
    template = template.replace("{USER_COLOR}", message.user.userColor);
    template = template.replace("{USER_NAME}", message.user.userName);
    template = template.replace("{MESSAGE}", textMessage);
    template = template.replace("{USER_MODE_ICONS}", getUserModesIcons(message.user.userModes));

    return template;
}

function addMessage(message) {
    var chatBox = $('.chat-lines'), 
        shouldScroll = scrolledToBottom(chatBox),
        chatLine = getChatLine(message);

    chatBox.append(chatLine);
    ++messageCount;

    if (messageCount > 150) deleteFirstMessage(chatBox);
    if (shouldScroll) scrollDown(chatBox);
}

function sendMessage(message) {
    if (message != '') {
        socket.emit('message_to_send', message);
    }
    $('.chat-input').val('');
}

$(document).ready(function() {
    $('.chat-input').keypress(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            sendMessage($('.chat-input').val());
        }
    });

    $('.send-chat-message').click(function() {
        sendMessage($('.chat-input').val());
    });

    socket.on('message', function(message) {
        addMessage(message);
    });
});