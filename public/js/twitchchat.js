var TwitchChat = function() {
    this.socket = io.connect(baseUrl);
    this.templating = new Templating();
    this.chatHandler = new ChatHandler($('.chat-lines'));
    this.emoticonHandler = new EmoticonHandler();
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

TwitchChat.prototype.sendMessage = function(textMessage) {
    if (textMessage != '') this.socket.emit('message_to_send', textMessage);
}

TwitchChat.prototype.sendCredentials = function(userName, token) {
    this.socket.emit('login', { 'username': userName, 'oauth': 'oauth:' + token });
}