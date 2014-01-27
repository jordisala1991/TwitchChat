var SocketHandler = function() {

}

SocketHandler.prototype.connection = function(socket) {
    var user_client;

    socket.on('login', function(data) {
        options = {
            userName: data.username,
            realName: data.username,
            password: 'oauth:' + data.oauth,
            port: configurations.connectionOptions.port,
            debug: configurations.connectionOptions.debug,
            channels: [ configurations.channelName ],
        }

        user_client = new irc.Client(configurations.serverAddress, data.username, options);
    });

    socket.on('message_to_send', function(data) {
        if (user_client !== undefined) {
            user_client.say(configurations.channelName, data);         
        }
    })
}

module.exports.create = function() {
    return new SocketHandler();
}