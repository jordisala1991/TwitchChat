var Client = function(userName, oauth) {
    this.userName = userName;
    this.oauth = oauth;
    this.numberOfConnections = 1;
    this.connection = this.createIrcConnection();
}

Client.prototype.createIrcConnection = function() {
    var self = this,
        options = {
            nick: this.userName,
            user: this.userName,
            realname: this.userName,
            server: configurations.connectionOptions.server,
            port: configurations.connectionOptions.port,
            secure: configurations.connectionOptions.secure,
            password: this.oauth
        };

    var connection = api.createClient(this.userName, options);
    api.hookEvent(this.userName, 'registered', function(message) {
        connection.irc.join(configurations.channelName);
    });
    api.hookEvent(this.userName, 'join', function(message) {
        if (message.username == self.userName) {
            irc_handler.channelMessage('twitchnotify', 'Connected to the channel, now you can send messages', self.userName);
        }
    });
    api.hookEvent(this.userName, 'privmsg', function(message) {
        if (message.target !== configurations.channelName) {
            irc_handler.handleMessage(message, self.userName);
        }
    });

    return connection;
}

Client.prototype.sendChannelMessage = function(message) {
    if (message.startsWith('/me')) this.connection.irc.me(configurations.channelName, message.substring(4));
    else this.connection.irc.privmsg(configurations.channelName, message);
}

Client.prototype.connect = function() {
    ++this.numberOfConnections;
    if (this.connection.irc.isConnected() === false) this.connection.irc.reconnect();
}

Client.prototype.disconnect = function() {
    --this.numberOfConnections;
    if (this.numberOfConnections == 0) {
        api.unhookEvent(this.userName, 'privmsg');
        api.unhookEvent(this.userName, 'join');
        api.unhookEvent(this.userName, 'registered');
        api.destroyClient(this.userName);
    }
}

module.exports.create = function(userName, oauth) {
    return new Client(userName, oauth);
}