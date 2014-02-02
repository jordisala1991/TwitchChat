var SocketHandler = function() {
}

SocketHandler.prototype.connection = function(socket) {
    var user_client;

    socket.on('login', function(data) {
        var options = {
            nick: data.username,
            user: data.username,
            realname: data.username,
            server: configurations.connectionOptions.server,
            port: configurations.connectionOptions.port,
            secure: configurations.connectionOptions.secure,
            password: data.oauth
        };

        user_client = api.createClient(data.username, options);
        console.log(user_client);
        api.hookEvent(data.username, 'registered', function(message) {
            console.log(user_client);
            user_client.irc.join(configurations.channelName);

        });
    });

    socket.on('message_to_send', function(data) {
        if (user_client !== undefined) {
            console.log(user_client);
            user_client.irc.privmsg(configurations.channelName, data);         
        }
    });

    socket.on('disconnect', function() {
        if (username !== undefined) {
            api.destroyClient(username);
        }
    });
}

module.exports.create = function() {
    return new SocketHandler();
}