module.exports = function(message) {
    io.sockets.json.emit('message', {
        'message': message.message
    });
}
