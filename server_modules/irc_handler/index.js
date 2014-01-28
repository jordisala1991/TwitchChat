require('../general_functions');

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
        user.userColor = this.twitch.getDefaultUserColor(userName.capitalize());
        this.users[userName] = user;
    }

    return user;
}

IrcHandler.prototype.getMessageColor = function(user, message) {
    var color = 'white';
    if (/bob/i.test(message)) color = 'green';
    if (user == 'gmanbot') color = 'blue';

    return color;
}

IrcHandler.prototype.channelMessage = function(from, text, message) {
    var user = this.getUser(from);

    message = {
        user: user,
        message: text,
        messageColor: this.getMessageColor(from, text)
    }
    io.sockets.emit('message', message);
}

IrcHandler.prototype.privateMessage = function(from, text, message) {
    if (from == 'jtv') {
        var jtvCommands = ['USERCOLOR', 'SPECIALUSER'],
            textSplitted = text.split(' ');

        if (textSplitted.length == 3) {
            var command = textSplitted[0],
                userName = textSplitted[1],
                value = textSplitted[2];

            if (jtvCommands.contains(command)) {
                var user = this.getUser(userName);
                if (command == jtvCommands[0]) user.color = value;
                else user.addUserMode(value);
            }
        }

    }
}

IrcHandler.prototype.errorMessage = function(message) {
    console.error('ERROR: %s: %s', message.command, message.args.join(' '));
}

module.exports.create = function() {
    return new IrcHandler();
}