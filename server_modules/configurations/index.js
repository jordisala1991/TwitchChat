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
        password: 'oauth:7epca7k56hdlint8u8a5yjkebv1lpx'
    },
    environment: require('./conf')()
};

module.exports = configurations;
