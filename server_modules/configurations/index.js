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
        password: 'oauth:r8v4m5f9ikugupuyid1czaqiofgatvs'
    },
    environment: require('./conf')()
};

module.exports = configurations;