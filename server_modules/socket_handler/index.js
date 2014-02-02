var SocketHandler = function() {
    this.clients = [];
}

SocketHandler.prototype.connection = function(socket) {
    var username,
        that = this;

    socket.on('login', function(data) {
        username = data.username;

        var options = {
            nick: username,
            user: username,
            realname: username,
            server: configurations.connectionOptions.server,
            port: configurations.connectionOptions.port,
            secure: configurations.connectionOptions.secure,
            password: 'oauth:' + data.oauth
        };

        if (that.clients[username] == undefined) {
            var user_client = api.createClient(username, options);
            api.hookEvent(username, 'registered', function(message) {
                user_client.irc.join(configurations.channelName);
            });

            that.clients[username] = user_client;
        }
    });

    socket.on('message_to_send', function(data) {
        if (that.clients[username] !== undefined) {
            user_client.say(configurations.channelName, data);         
        }
    });

    socket.on('disconnect', function() {
        if (username !== undefined) {
            delete that.clients[username];
        }
    });
}

module.exports.create = function() {
    return new SocketHandler();
}