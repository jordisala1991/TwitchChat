hbs = require('express-hbs');
factory = require('irc-factory');
api = new factory.Api();
express = require('express');
http = require('http');
app = express();
server = http.createServer(app);
io = require('socket.io').listen(server);
require('./server_modules/general_functions');
configurations = require('./server_modules/configurations');
request = require('request');
fs = require('fs');

request('https://api.twitch.tv/kraken/chat/emoticons').pipe(fs.createWriteStream('public/emoticons.json'));

var client = api.createClient(configurations.botName, configurations.connectionOptions),
    socket_handler = require('./server_modules/socket_handler').create(),
    express_handler = require('./server_modules/express_handler').create();

irc_handler = require('./server_modules/irc_handler').create();


api.hookEvent(configurations.botName, 'registered', function(message) {
    client.irc.raw('TWITCHCLIENT');
    client.irc.join(configurations.channelName);
});
api.hookEvent(configurations.botName, 'privmsg', function(message) {
    irc_handler.handleMessage(message);
});
api.hookEvent(configurations.botName, 'mode_change', function(message) {
    irc_handler.userModeChanged(message);
});
api.hookEvent(configurations.botName, 'action', function(message) {
    irc_handler.handleAction(message);
});


io.set('log level', 1);
io.sockets.on('connection', function(socket) {
    socket_handler.connection(socket);
});


app.configure(function() {
    express_handler.configure();
});
app.get('/', function(request, response) {
    express_handler.homeAction(request, response);
});


server.listen(process.env.PORT || 5000);