module.exports = function(message, client) {
    if (isTimeout(message)) {
        io.sockets.in(client).json.emit('clear_chat', message.params[1]);
    } else {
        io.sockets.in(client).json.emit('clear_all_chat');
        io.sockets.in(client).json.emit('message', {
            'message': 'Chat was cleared by a moderator'
        });
    }
}

var isTimeout = function(message) {
    return message.params.length == 2;
}
