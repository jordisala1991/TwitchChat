var botName = 'nodejsbot',
    channelName = '#guardsmanbob';

var configurations = {
    channelName: channelName,
    botName: botName,
    connectionOptions: {
        nick: botName,
        user: botName,
        realname: botName,
        server: 'irc.twitch.tv',
        port: 6667,
        secure: false,
        password: 'oauth:nx1fxw6x1pmaer98e8x21pygxm4dnao'
    },
    environment: require('./conf')()
};

module.exports = configurations;