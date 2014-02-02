var SocketHandler = function() {
    this.clients = new Object();
}

SocketHandler.prototype.connection = function(socket) {
    var username,
        oauth,
        that = this;

    socket.on('login', function(data) {
        username = data.username;
        oauth = data.oauth;

        var options = {
            nick: username,
            user: username,
            realname: username,
            server: configurations.connectionOptions.server,
            port: configurations.connectionOptions.port,
            secure: configurations.connectionOptions.secure,
            password: oauth
        };

        var user_client = api.createClient(username, options);
        api.hookEvent(username, 'registered', function(message) {
            user_client.irc.join(configurations.channelName);
        });

        that.clients[username] = user_client;
    });

    socket.on('message_to_send', function(data) {
        if (username in that.clients) {
            that.clients[username].privmsg(configurations.channelName, data);         
        }
    });

    socket.on('disconnect', function() {
        if (username in that.clients) {
            delete that.clients[username];
        }
    });
}

module.exports.create = function() {
    return new SocketHandler();
}