var IrcHandler = function() {
    this.twitch = require('../twitch').create();
    this.userFactory = require('./user.js');
    this.users = [];
    
    var Entities = require('html-entities').XmlEntities;
    this.entities = new Entities();
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

IrcHandler.prototype.channelMessage = function(userName, textMessage) {
    var user = this.getUser(userName),
        textMessage = this.entities.encode(textMessage),
        message = { user: user, message: textMessage };

    io.sockets.emit('message', message);
}

IrcHandler.prototype.privateMessage = function(textMessage) {
    var jtvCommands = ['USERCOLOR', 'SPECIALUSER', 'EMOTESET', 'CLEARCHAT'],
        textSplitted = textMessage.split(' ');

    if (textSplitted.length == 3) {
        var command = textSplitted[0],
            userName = textSplitted[1],
            value = textSplitted[2];

        if (jtvCommands.contains(command)) {
            var user = this.getUser(userName);

            if (command == jtvCommands[0]) user.userColor = value;
            else if (command == jtvCommands[1]) user.addUserMode(value);
            else if (command == jtvCommands[2]) user.setEmoteSets(value);
        }
    }
    else if (textSplitted.length == 2) {
        var command = textSplitted[0],
            userName = textSplitted[1];

        if (command == jtvCommands[3]) {
            io.sockets.emit('clear_chat', userName);
        }
    }
}

IrcHandler.prototype.handleMessage = function(message) {
    if (message.target == configurations.channelName) {
        this.channelMessage(message.username, message.message);
    } else {
        var rawSplitted = message.raw.split(':'),
            commandSplitted = rawSplitted[0].split(' ');
        if (commandSplitted[0] = 'jtv') this.privateMessage(rawSplitted[2]);
    }
}

IrcHandler.prototype.actionMessage = function(userName, textMessage) {
    var user = this.getUser(userName),
        textMessage = this.entities.encode(textMessage),
        message = { user: user, message: textMessage };

    io.sockets.emit('action', message);
}

IrcHandler.prototype.handleAction = function(message) {
    this.actionMessage(message.username, message.message);
}

module.exports.create = function() {
    return new IrcHandler();
}