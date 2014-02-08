var TwitchChat = function() {
    this.socket = io.connect(socketUrl);
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

TwitchChat.prototype.getUserModesIcons = function(user) {
    var icons = '';
    for (var index = 0; index < user.userModes.length; index++) {
        icons += '<span class="icon ' + user.userModes[index] + '"></span>';
    };
    return icons;
}

TwitchChat.prototype.getChatLine = function(textMessage, user, messageType) {
    var message = textMessage.linkify(),
        processedMessage = this.emoticonHandler.replaceEmoticons(message, user),
        templateData = {
            userName: user.userName,
            userColor: user.userColor,
            messageColor: this.getMessageColor(user, processedMessage),
            messageDate: moment().format('HH:mm'),
            textMessage: processedMessage,
            userModeIcons: this.getUserModesIcons(user)        
        };

    if (messageType == 'message') return this.templating.messageTemplating(templateData);
    else return this.templating.actionTemplating(templateData);
}

TwitchChat.prototype.addMessage = function(message, messageType) {
    var chatLine = this.getChatLine(message.message, message.user, messageType);
    
    this.chatHandler.addChatLine(chatLine);
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