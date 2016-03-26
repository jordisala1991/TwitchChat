module.exports = function(message, event) {
    if (isTimeout(message)) {
        io.sockets.in(event[0]).json.emit('clear_chat', message.params[1]);
    } else {
        io.sockets.in(event[0]).json.emit('clear_all_chat');
        io.sockets.in(event[0]).json.emit('message', {
            'message': 'Chat was cleared by a moderator'
        });
    }
}

var isTimeout = function(message) {
    return message.params.length == 2;
}
