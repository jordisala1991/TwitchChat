var SocketHandler = function() {

}

SocketHandler.prototype.connection = function(socket) {
    var username,
        oauth,
        user_client;

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

        user_client = api.createClient(username, options);
        api.hookEvent(username, 'registered', function(message) {
            user_client.irc.join(configurations.channelName);
        });
    });

    socket.on('message_to_send', function(data) {
        if (user_client !== undefined) {
            console.log(user_client);
            //user_client.irc.privmsg(configurations.channelName, data);         
        }
    });
}

module.exports.create = function() {
    return new SocketHandler();
}