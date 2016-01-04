function IrcHandlerV2() {
    this.handlers = {
        'PRIVMSG': require('./privmsg.js'),
        'NOTICE': require('./notice.js'),
        'CLEARCHAT': require('./clearchat.js')
    }
}

IrcHandlerV2.prototype.getCommand = function(message) {
    if (typeof message.raw === 'string' || message.raw instanceof String) {
        var messageSplitted = message.raw.split(' '),
            command = messageSplitted[1];

        if (messageSplitted[0].indexOf('@') === 0) {
            command = messageSplitted[2];
        } else if (messageSplitted.length === 2) {
            command = messageSplitted[0];
        }
        return command;
    }
}

IrcHandlerV2.prototype.handle = function(message) {
    var command = this.getCommand(message);

    if (command in this.handlers) return this.handlers[command](message);
}

module.exports = IrcHandlerV2;
