function Client(user_name, oauth) {
    this.user_name = user_name;
    this.oauth = oauth;
    this.connections = 1;
    this.connection = this.createIrcConnection();
}

Client.prototype.createIrcConnection = function() {
    var options = {
        nick: this.user_name,
        user: this.user_name,
        realname: this.user_name,
        server: configurations.server,
        port: configurations.port,
        password: this.oauth
    };

    var connection = api.createClient(this.user_name, options);

    api.hookEvent(this.user_name, 'registered', function(message) {
        connection.irc.raw('CAP REQ :twitch.tv/membership');
        connection.irc.raw('CAP REQ :twitch.tv/commands');
        connection.irc.raw('CAP REQ :twitch.tv/tags');
        connection.irc.join(configurations.channelName);
    });

    api.hookEvent(this.user_name, '*', function(message) {
        irc_handler.handle(message, this.event);
    });

    return connection;
}

Client.prototype.sendChannelMessage = function(message) {
    if (message.lastIndexOf('/me', 0) === 0) this.connection.irc.me(configurations.channelName, message.substring(4));
    else this.connection.irc.privmsg(configurations.channelName, message);
}

Client.prototype.connect = function() {
    ++this.connections;
    if (this.connection.irc.isConnected() === false) this.connection.irc.reconnect();
}

Client.prototype.disconnect = function() {
    --this.connections;
    if (this.connections == 0) {
        api.unhookEvent(this.user_name, '*');
        api.destroyClient(this.user_name);
    }
}

module.exports = Client;
