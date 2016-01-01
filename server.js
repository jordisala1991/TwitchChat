exphbs = require('express-handlebars');
factory = require('irc-factory');
api = new factory.Api();
express = require('express');
compression = require('compression');
serveStatic = require('serve-static');
http = require('http');
app = express();
server = http.createServer(app);
io = require('socket.io').listen(server);
configurations = require('./server_modules/configurations');
request = require('request');
fs = require('fs');

request('https://api.twitch.tv/kraken/chat/emoticon_images').pipe(fs.createWriteStream('public/emoticons.json'));

var client = api.createClient(configurations.botName, configurations.connectionOptions),
    socket_handler = require('./server_modules/socket_handler').create(),
    express_handler = require('./server_modules/express_handler').create();

irc_handler = require('./server_modules/irc_handler').create();

// api.hookEvent(configurations.botName, '*', function(message) {
//     console.log(message);
// });

api.hookEvent(configurations.botName, 'registered', function(message) {
    client.irc.raw('CAP REQ :twitch.tv/membership');
    client.irc.raw('CAP REQ :twitch.tv/commands');
    client.irc.raw('CAP REQ :twitch.tv/tags');
    client.irc.join(configurations.channelName);
});
api.hookEvent(configurations.botName, 'names', function(message) {
    irc_handler.handleNamesList(message);
});
api.hookEvent(configurations.botName, 'join', function(message) {
    irc_handler.handleJoin(message);
});
api.hookEvent(configurations.botName, 'part', function(message) {
    irc_handler.handlePart(message);
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


io.sockets.on('connection', function(socket) {
    socket_handler.connection(socket);
});


express_handler.configure();
app.get('/', function(request, response) {
    express_handler.homeAction(request, response);
});


server.listen(process.env.PORT || 5000);
