var TwitchChat = function() {
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
