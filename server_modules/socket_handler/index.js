var SocketHandler = function() {
}

SocketHandler.prototype.connection = function(socket) {
    var user_client;
    
    socket.on('login', function(data) {
        username = data.username;

        var options = {
            nick: data.username,
            user: data.username,
            realname: data.username,
            server: configurations.connectionOptions.server,
            port: configurations.connectionOptions.port,
            secure: configurations.connectionOptions.secure,
            password: data.oauth
        };

        api.destroyClient(data.username);
        user_client = api.createClient(data.username, options);
        api.hookEvent(data.username, 'registered', function(message) {
            user_client.irc.join(configurations.channelName);

        });
    });

    socket.on('message_to_send', function(data) {
        if (user_client !== undefined) {
            user_client.irc.privmsg(configurations.channelName, data);         
        }
    });
}

module.exports.create = function() {
    return new SocketHandler();
}