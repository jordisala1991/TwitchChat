require('../general_functions');

var IrcFunctions = function() {
    this.twitchFunctions = require('../twitch_functions').create();
    this.users = [];
}

IrcFunctions.prototype.channelMessage = function(from, text, message) {
    var date = moment().format('HH:mm');
    var color;
    if (this.users[from] !== undefined) color = this.users[from].color;
    color = this.twitchFunctions.getDefaultUserColor(from);

    var message = {
        'date': date,
        'color': color,
        'name': from.capitalize(),
        'message': text
    }
    io.sockets.emit('message', message);
}

IrcFunctions.prototype.privateMessage = function(from, text, message) {
    if (from == 'jvt') {
        var parts = text.split(' ');
        if (parts[0] == 'USERCOLOR') {
            this.users[parts[1]] = {
                'color': parts[2],
            };
        }
    }
}

IrcFunctions.prototype.errorMessage = function(message) {
    console.error('ERROR: %s: %s', message.command, message.args.join(' '));
}

module.exports.create = function(io) {
    return new IrcFunctions(io);
}