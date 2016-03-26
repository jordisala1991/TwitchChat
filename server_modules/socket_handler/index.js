function SocketHandler() {
    this.clients = []
}

SocketHandler.prototype.connection = function(socket) {
    var user_name,
        self = this;

    socket.join(configurations.botName);
    socket.join(configurations.botName + '-notice');

    socket.json.emit('init', {
        'channelName': configurations.channelName,
        'clientId': configurations.clientId
    });

    socket.on('login', function(data) {
        user_name = data.username;

        socket.leave(configurations.botName + '-notice');
        socket.join(user_name + '-notice');

        if (user_name in self.clients) {
            self.clients[user_name].connect();
        }
        else self.clients[user_name] = new Client(user_name, data.oauth);
    });

    socket.on('message_to_send', function(message) {
        if (user_name in self.clients) {
            self.clients[user_name].sendChannelMessage(message);
        }
    });

    socket.on('disconnect', function() {
        if (user_name in self.clients) {
            self.clients[user_name].disconnect();
            if (self.clients[user_name].connections == 0) {
                delete self.clients[user_name];
            }
        }
    });
}

module.exports = SocketHandler;
