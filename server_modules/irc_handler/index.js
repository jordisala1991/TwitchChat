var IrcHandler = function() {
    this.twitch = require('../twitch').create();
    this.userFactory = require('./user.js');
    this.users = [];
}

IrcHandler.prototype.getUser = function(userName) {
    var user;
    
    if (this.users[userName] !== undefined) user = this.users[userName];
    else {
        user = this.userFactory.create(userName);
        user.userColor = this.twitch.getDefaultUserColor(userName);
        if (this.twitch.isTheBroadcaster(userName)) user.addUserMode('broadcaster');
        this.users[userName] = user;
    }
    return user;
}

IrcHandler.prototype.userModeChanged = function(message) {
    var modeSplitted = message.mode.split(' ');
    if (modeSplitted[0] == '+o') {
        var user = this.getUser(modeSplitted[1]);
        if (!user.userModes.contains('broadcaster')) user.addUserMode('mod');
    }
}

IrcHandler.prototype.encodeMessage = function(textMessage) {
    var encodedMessage = textMessage;

    encodedMessage = encodedMessage.replace('<', '&lt;');
    encodedMessage = encodedMessage.replace('>', '&gt;');
    return encodedMessage;
}

IrcHandler.prototype.channelMessage = function(userName, textMessage, receiver) {
    var user = this.getUser(userName),
        textMessage = this.encodeMessage(textMessage),
        message = { user: user, message: textMessage };

    if (receiver === undefined) io.sockets.json.emit('message', message);
    else io.sockets.in(receiver).json.emit('message', message);
}

IrcHandler.prototype.privateMessage = function(textMessage, receiver) {
    var jtvCommands = ['USERCOLOR', 'SPECIALUSER', 'EMOTESET', 'CLEARCHAT', 'HISTORYEND'],
        textSplitted = textMessage.split(' ');

    switch(textSplitted[0]) {
        case jtvCommands[0]:
            var user = this.getUser(textSplitted[1]);
            user.userColor = textSplitted[2];
            break;
        case jtvCommands[1]:
            var user = this.getUser(textSplitted[1]);
            user.addUserMode(textSplitted[2]);
            break;
        case jtvCommands[2]:
            var user = this.getUser(textSplitted[1])
            user.setEmoteSets(textSplitted[2]);
            break;
        case jtvCommands[3]:
            if (textSplitted.length > 1) io.sockets.emit('clear_chat', textSplitted[1]);
            else {
                io.sockets.emit('clear_all_chat');
                this.channelMessage('twitchnotify', 'Chat was cleared by a moderator', receiver);
            }
            break;
        case jtvCommands[4]:
            break;
        default:
            textMessage = textMessage.replace('http', 'http://www.twitch.tv/' + configurations.channelName.substring(1) + '/subscribe');
            this.channelMessage('twitchnotify', textMessage, receiver);
    }
}

IrcHandler.prototype.handleMessage = function(message, receiver) {
    if (message.target == configurations.channelName) {
        this.channelMessage(message.username, message.message, receiver);
    } else {
        var rawSplitted = message.raw.split(':'),
            commandSplitted = rawSplitted[0].split(' ');
        if (commandSplitted[0] = 'jtv') this.privateMessage(rawSplitted[2], receiver);
    }
}

IrcHandler.prototype.actionMessage = function(userName, textMessage) {
    var user = this.getUser(userName),
        textMessage = this.encodeMessage(textMessage),
        message = { user: user, message: textMessage };

    io.sockets.json.emit('action', message);
}

IrcHandler.prototype.handleAction = function(message) {
    this.actionMessage(message.username, message.message);
}

module.exports.create = function() {
    return new IrcHandler();
}