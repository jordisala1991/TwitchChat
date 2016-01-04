var IrcHandler = function() {
}

IrcHandler.prototype.channelMessage = function(userName, textMessage, receiver) {
    var user = this.getUser(userName),
        textMessage = this.encodeMessage(textMessage),
        message = { user: user, message: textMessage };

    if (receiver === undefined) io.sockets.json.emit('message', message);
    else io.sockets.in(receiver).json.emit('message', message);
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

module.exports.create = function() {
    return new IrcHandler();
}
