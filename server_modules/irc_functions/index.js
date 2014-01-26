require('../general_functions');

var IrcFunctions = function() {
    this.twitchFunctions = require('../twitch_functions').create();
    this.users = [];
}


IrcFunctions.prototype.getUserColor = function(user) {
    var color;
    
    if (this.users[user] !== undefined) color = this.users[user].userColor;
    else color = this.twitchFunctions.getDefaultUserColor(user);

    return color;
}

IrcFunctions.prototype.getMessageColor = function(user, message) {
    var color;

    if (/bob/i.test(message)) color = 'green';
    else if (user == 'gmanbot') color = 'blue';
    else color = 'white';

    return color;
}

IrcFunctions.prototype.channelMessage = function(from, text, message) {
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

IrcFunctions.prototype.privateMessage = function(from, text, message) {
    if (from == 'jtv') {
        var parts = text.split(' ');
        if (parts[0] == 'USERCOLOR') {
            this.users[parts[1]] = {
                userColor: parts[2],
            };
        }
    }
}

IrcFunctions.prototype.errorMessage = function(message) {
    console.error('ERROR: %s: %s', message.command, message.args.join(' '));
}

module.exports.create = function() {
    return new IrcFunctions();
}