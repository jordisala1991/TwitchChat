require('../general_functions');

var IrcHandler = function() {
    this.twitch = require('../twitch').create();
    this.users = [];
}

IrcHandler.prototype.getUserColor = function(user) {
    var color;
    
    if (this.users[user] !== undefined) color = this.users[user].userColor;
    else color = this.twitch.getDefaultUserColor(user);

    return color;
}

IrcHandler.prototype.getMessageColor = function(user, message) {
    var color = 'white';
    if (/bob/i.test(message)) color = 'green';
    if (user == 'gmanbot') color = 'blue';

    return color;
}

IrcHandler.prototype.channelMessage = function(from, text, message) {
    var date, userColor, messageColor, user;

    userColor = this.getUserColor(from);
    messageColor = this.getMessageColor(from, text);
    user = from.capitalize();

    message = {
        user: user,
        message: text,
        userColor: userColor,
        messageColor: messageColor
    }
    io.sockets.emit('message', message);
}

IrcHandler.prototype.privateMessage = function(from, text, message) {
    if (from == 'jtv') {
        var parts = text.split(' ');
        if (parts[0] == 'USERCOLOR') {
            this.users[parts[1]] = {
                userColor: parts[2],
            };
        }
    }
}

IrcHandler.prototype.errorMessage = function(message) {
    console.error('ERROR: %s: %s', message.command, message.args.join(' '));
}

module.exports.create = function() {
    return new IrcHandler();
}