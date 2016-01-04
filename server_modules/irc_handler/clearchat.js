module.exports = function(message) {
    if (isTimeout(message)) {
        io.sockets.json.emit('clear_chat', message.params[1]);
    } else {
        io.sockets.json.emit('clear_all_chat');
        io.sockets.json.emit('message', {
            'message': 'Chat was cleared by a moderator'
        });
    }
}

var isTimeout = function(message) {
    return message.params.length == 2;
}
