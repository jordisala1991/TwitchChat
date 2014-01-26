var channel = '#guardsmanbob';

configurations = {
    channelName: channel,
    connectionOptions: {
        userName: 'NodeJSBot',
        realName: 'NodeJSBot',
        password: 'oauth:r8v4m5f9ikugupuyid1czaqiofgatvs',
        port: 6667,
        debug: true,
        channels: [ channel ],
    },
    serverAddress: 'irc.twitch.tv',
    botName: 'NodeJSBot',
    environment: require('./conf')()
}

module.exports = configurations;