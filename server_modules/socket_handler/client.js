var Client = function(userName, oauth) {
    this.userName = userName;
    this.oauth = oauth;
    this.numberOfConnections = 1;
    this.connection = this.createIrcConnection();

}

Client.prototype.createIrcConnection = function() {
    var options = {
        nick: this.userName,
        user: this.userName,
        realname: this.userName,
        server: configurations.connectionOptions.server,
        port: configurations.connectionOptions.port,
        secure: configurations.connectionOptions.secure,
        password: this.oauth
    };

    var connection = api.createClient(this.userName, options);
    api.hookEvent(this.userName, 'registered', function() {
        connection.irc.join(configurations.channelName);
    }, true);

    return connection;
}

Client.prototype.sendChannelMessage = function(message) {
    if (message.startsWith('/me')) this.connection.irc.me(configurations.channelName, message.substring(4));
    else this.connection.irc.privmsg(configurations.channelName, message);
}

Client.prototype.connect = function() {
    ++this.numberOfConnections;
    if (this.connection.irc.isConnected() === false) {
        this.connection.irc.reconnect();

        var connection = this.connection;
        api.hookEvent(this.userName, 'registered', function() {
            connection.irc.join(configurations.channelName);
        }, true);
    }
}

Client.prototype.disconnect = function() {
    --this.numberOfConnections;
    if (this.numberOfConnections == 0) {
        api.destroyClient(this.userName);
    }
}

module.exports.create = function(userName, oauth) {
    return new Client(userName, oauth);
}