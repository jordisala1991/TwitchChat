var TwitchChat = function(chatBox) {
    this.messageCount = 1;
    this.emoticons = [];
    this.chatBox = chatBox;
    this.maxChatMessages = 150;
    this.socket = io.connect(socketUrl);
    this.templating = new Templating();
}

TwitchChat.prototype.isScrolledToBottom = function() {
    return (this.chatBox[0].scrollHeight - this.chatBox.scrollTop() - 15) <= this.chatBox.outerHeight();
}

TwitchChat.prototype.scrollDown = function() {
    this.chatBox.scrollTop(this.chatBox[0].scrollHeight);
}

TwitchChat.prototype.deleteFirstMessage = function() {
    if (this.messageCount > this.maxChatMessages) {
        --this.messageCount;
        this.chatBox.find('.chat-line').first().remove();
    }
}

TwitchChat.prototype.replaceEmoticons = function(textMessage, user) {
    var isSubscriber = user.userModes.contains('subscriber');
    for (var index = this.emoticons.length - 1; index >= 0; index--) {
        if (this.emoticons[index].subscriber_only) {
            if (isSubscriber) textMessage = textMessage.replace(new RegExp(this.emoticons[index].regex, 'g'), this.emoticons[index].html);
        }
        else textMessage = textMessage.replace(new RegExp(this.emoticons[index].regex, 'g'), this.emoticons[index].html);
    };
    return textMessage;
}

TwitchChat.prototype.getMessageColor = function(user, textMessage) {
    var color = 'black';
    if (/bob/i.test(textMessage)) color = 'green';
    if (user.userName == 'gmanbot') color = 'blue';
    else if (user.userName == 'twitchnotify') color = 'red';
    return color;
}

TwitchChat.prototype.getUserModesIcons = function(user) {
    var icons = '';
    for (var index = 0; index < user.userModes.length; index++) {
        icons += '<span class="icon ' + user.userModes[index] + '"></span>';
    };
    return icons;
}

TwitchChat.prototype.getChatLine = function(textMessage, user) {
    var userModeIcons = this.getUserModesIcons(user),
        processedMessage = this.replaceEmoticons(textMessage.linkify(), user),
        messageDate = moment().format('HH:mm'),
        messageColor = this.getMessageColor(user, processedMessage);

    return this.templating.messageTemplating({
        messageColor: messageColor,
        messageDate: messageDate,
        userColor: user.userColor,
        userName: user.userName,
        textMessage: processedMessage,
        userModeIcons: userModeIcons
    });
}

TwitchChat.prototype.addMessage = function(message) {
    var chatLine = this.getChatLine(message.message, message.user),
        shouldScroll = this.isScrolledToBottom();

    this.chatBox.append(chatLine);
    ++this.messageCount;

    this.deleteFirstMessage();
    if (shouldScroll) {
        this.scrollDown();
    }
}

TwitchChat.prototype.addEmoticon = function(rawEmoticon) {
    var emoticonTemplate = this.templating.emoticonTemplating({
        emoticonUrl: rawEmoticon.url,
        emoticonHeight: rawEmoticon.height,
        emoticonWidth: rawEmoticon.width,
        emoticonMargins: (18 - rawEmoticon.height)/2
    });

    rawEmoticon.html = emoticonTemplate;
    this.emoticons.push(rawEmoticon);
}

TwitchChat.prototype.sendMessage = function(textMessage) {
    if (textMessage != '') {
        this.socket.emit('message_to_send', textMessage);
    }
}

TwitchChat.prototype.sendCredentials = function(userName, token) {
    var that = this;

    this.socket.emit('login', { 'username': userName, 'oauth': 'oauth:' + token });
    this.socket.on('reconnect', function() {
        that.socket.emit('login', { 'username': userName, 'oauth': 'oauth:' + token });
    });
}