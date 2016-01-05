module.exports = function(message, client) {
    io.sockets.in(client).json.emit('message', {
        'message': message.message
    });
}
