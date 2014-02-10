var SocketHandler = function() {
    this.clientFactory = require('./client.js');
    this.clients = []
}

SocketHandler.prototype.connection = function(socket) {
    var userName,
        self = this;

    socket.on('login', function(data) {
        userName = data.username;
        socket.join(userName);

        if (self.clients[userName] === undefined) {
            var client = self.clientFactory.create(userName, data.oauth);
            self.clients[userName] = client;
        }
        else self.clients[userName].connect();
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