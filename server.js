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

var client = api.createClient(configurations.botName, configurations.connectionOptions),
    socket_handler = require('./server_modules/socket_handler').create(),
    express_handler = require('./server_modules/express_handler').create();

IrcHandlerV2 = require('./server_modules/irc_handler/v2.js');
irc_handler_v2 = new IrcHandlerV2();

api.hookEvent(configurations.botName, '*', function(message) {
    irc_handler_v2.handle(message);
});

api.hookEvent(configurations.botName, 'registered', function(message) {
    client.irc.raw('CAP REQ :twitch.tv/membership');
    client.irc.raw('CAP REQ :twitch.tv/commands');
    client.irc.raw('CAP REQ :twitch.tv/tags');
    client.irc.join(configurations.channelName);
});

io.sockets.on('connection', function(socket) {
    socket_handler.connection(socket);
});


express_handler.configure();
app.get('/', function(request, response) {
    express_handler.homeAction(request, response);
});


server.listen(process.env.PORT || 5000);
