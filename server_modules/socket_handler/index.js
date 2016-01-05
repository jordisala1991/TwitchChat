function SocketHandler() {
    this.clients = []
}

SocketHandler.prototype.connection = function(socket) {
    var user_name,
        self = this;

    socket.join(configurations.botName);

    socket.on('login', function(data) {
        user_name = data.username;
        if (self.clients[user_name] === undefined) {
            self.clients[user_name] = new Client(user_name, data.oauth);
        }
        else self.clients[user_name].connect();
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
