var channel = '#guardsmanbob';

configurations = {
    channelName: channel,
    connectionOptions: {
        userName: 'NodeJSBot',
        realName: 'NodeJSBot',
        password: 'oauth:r8v4m5f9ikugupuyid1czaqiofgatvs',
        port: 6667,
        debug: false,
        channels: [ channel ],
    },
    serverAddress: 'irc.twitch.tv',
    botName: 'NodeJSBot',
}

module.exports = configurations;