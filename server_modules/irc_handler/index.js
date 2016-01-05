function IrcHandler() {
    this.handlers = {
        'PRIVMSG': require('./privmsg.js'),
        'NOTICE': require('./notice.js'),
        'CLEARCHAT': require('./clearchat.js')
    }
}

IrcHandler.prototype.getCommand = function(message) {
    if (typeof message.raw === 'string' || message.raw instanceof String) {
        var message_splitted = message.raw.split(' '),
            command = message_splitted[1];

        if (message_splitted[0].indexOf('@') === 0) {
            command = message_splitted[2];
        } else if (message_splitted.length === 2) {
            command = message_splitted[0];
        }
        return command;
    }
}

IrcHandler.prototype.handle = function(message, client) {
    var command = this.getCommand(message);

    if (command in this.handlers) return this.handlers[command](message, client);
}

module.exports = IrcHandler;
