irc = require('irc');
express = require('express');
http = require('http');
app = express();
server = http.createServer(app);
io = require('socket.io').listen(server);
configurations = require('./server_modules/configurations');
io.set('log level', 1);


app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'twig');
    app.set('twig options', { 
        strict_variables: false
    });
    app.use(express.static(__dirname + '/public'));
});
app.get('/', function(request, response){
    response.render('index', {
        'socketUrl': configurations.environment.baseUrl
    });
});


var client = new irc.Client(configurations.serverAddress, configurations.botName, configurations.connectionOptions), 
    irc_handler = require('./server_modules/irc_handler').create(),
    socket_handler = require('./server_modules/socket_handler').create();

client.send('TWITCHCLIENT');
client.addListener('+mode', function(channel, by, argument, message, raw) {
    irc_handler.addModerator(raw.args[2]);
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

io.sockets.on('connection', function(socket) {
    socket_handler.connection(socket);
});


server.listen(process.env.PORT || 5000);