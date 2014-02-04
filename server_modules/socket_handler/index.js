var SocketHandler = function() {
    this.clientFactory = require('./client.js');
    this.clients = []
}

SocketHandler.prototype.connection = function(socket) {
    var userName,
        self = this;

    socket.on('login', function(data) {
        userName = data.username;

        if (self.clients[data.username] === undefined) {
            var client = self.clientFactory.create(data.username, data.oauth);
            self.clients[data.username] = client;
        }
        else self.clients[data.username].connect();
    });

    socket.on('message_to_send', function(message) {
        if (self.clients[userName] !== undefined) {
            self.clients[userName].sendChannelMessage(message);
        }
    });

    socket.on('disconnect', function() {
        if (self.clients[userName] !== undefined) {
            self.clients[userName].disconnect();
            if (self.clients[userName].numberOfConnections == 0) {
                delete self.clients[userName];
            }
        }
    });
}

module.exports.create = function() {
    return new SocketHandler();
}