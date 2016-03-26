var botName = 'nodejsbot',
    channelName = '#jordism91',
    password = 'oauth:7epca7k56hdlint8u8a5yjkebv1lpx';

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
        password: password
    },
    environment: require('./conf')()
};

module.exports = configurations;
