module.exports = function(message, event) {
    io.sockets.in(event[0] + '-notice').json.emit('message', {
        'message': message.message
    });
}
