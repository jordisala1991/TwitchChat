require('newrelic');
irc = require('irc');
express = require('express');
http = require('http');
app = express();
server = http.createServer(app);
io = require('socket.io').listen(server);
require('./server_modules/general_functions');
configurations = require('./server_modules/configurations');

var client = new irc.Client(configurations.serverAddress, configurations.botName, configurations.connectionOptions), 
    irc_handler = require('./server_modules/irc_handler').create(),
    socket_handler = require('./server_modules/socket_handler').create(),
    express_handler = require('./server_modules/express_handler').create();

app.configure(function() {
    express_handler.configure();
});
app.get('/', function(request, response){
    express_handler.homeAction(request, response);
});

client.send('TWITCHCLIENT');
client.addListener('+mode', function(channel, by, argument, message, raw) {
    irc_handler.addModeratorMessage(raw.args[2]);
});
client.addListener('pm', function(from, text, message) {
    irc_handler.privateMessage(from, text, message);
});
client.addListener('message' + configurations.channelName, function(from, text, message) {
    irc_handler.channelMessage(from, text, message);
});
client.addListener('error', function(message) {
    irc_handler.errorMessage(message);
});

io.set('log level', 1);
io.sockets.on('connection', function(socket) {
    socket_handler.connection(socket);
});

server.listen(process.env.PORT || 5000);