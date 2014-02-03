var SocketHandler = function() {
    this.clients = []
}

SocketHandler.prototype.connection = function(socket) {
    var userName,
        that = this;

    socket.on('login', function(data) {
        userName = data.username;

        if (that.clients[data.username] === undefined) {
            var options = {
                nick: data.username,
                user: data.username,
                realname: data.username,
                server: configurations.connectionOptions.server,
                port: configurations.connectionOptions.port,
                secure: configurations.connectionOptions.secure,
                password: data.oauth
            };

            var user_client = api.createClient(data.username, options);
            
            that.clients[data.username] = user_client;
            api.hookEvent(data.username, 'registered', function(message) {
                user_client.irc.join(configurations.channelName);
            });
        }
        else {
            var user_client = that.clients[data.username];
            if (user_client.irc.isConnected() === false) {
                user_client.irc.reconnect();
            }
        }
    });

    socket.on('message_to_send', function(data) {
        if (that.clients[userName] !== undefined) {
            that.clients[userName].irc.privmsg(configurations.channelName, data);         
        }
    });

    socket.on('disconnect', function() {
        if (that.clients[userName] !== undefined) {
            that.clients[userName].irc.disconnect('quitting');
        }
    });
}

module.exports.create = function() {
    return new SocketHandler();
}