var TwitchChat = function() {
    this.socket = io.connect(location.href);
    this.templating = new Templating();
    this.chatHandler = new ChatHandler($('.chat-lines'), $('.chat-input'));
    this.emoticonHandler = new EmoticonHandler();
    this.userName = '';
}

TwitchChat.prototype.getChatLine = function(message) {
    message.processed_message = this.emoticonHandler.replaceEmoticons(message).linkify();
    message.time = moment(message.time).format('HH:mm');
    if (message.user) {
        message.user.badges = this.emoticonHandler.getUserBadges(message.user);
    }

    return this.templating.messageTemplating(message);
}

TwitchChat.prototype.addMessage = function(message) {
    var chat_line = this.getChatLine(message);

    this.chatHandler.addChatLine(chat_line);
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
