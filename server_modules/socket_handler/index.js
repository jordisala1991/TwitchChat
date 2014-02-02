var SocketHandler = function() {
}

SocketHandler.prototype.connection = function(socket) {
    var user_client,
        irc_identifier;

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

        var date = new Date();
        irc_identifier = data.username + '-' + date.getTime();
        user_client = api.createClient(irc_identifier, options);
        api.hookEvent(data.username, 'registered', function(message) {
            user_client.irc.join(configurations.channelName);
        });
    });

    socket.on('message_to_send', function(data) {
        if (user_client !== undefined) {
            user_client.irc.privmsg(configurations.channelName, data);         
        }
    });

    socket.on('disconnect', function() {
        api.destroyClient(irc_identifier);
    });
}

module.exports.create = function() {
    return new SocketHandler();
}