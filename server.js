var irc = require('irc');
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
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
    response.render('index');
});

server.listen(9999);

var config = require('./server_modules/configurations');
var client = new irc.Client(config.serverAddress, config.botName, config.connectionOptions);
var irc_functions = require('./server_modules/irc_functions').create(io);

client.send('TWITCHCLIENT');
client.addListener('pm', irc_functions.privateMessage.bind(irc_functions));
client.addListener('message' + config.channelName, irc_functions.channelMessage.bind(irc_functions));
client.addListener('error', irc_functions.errorMessage.bind(irc_functions));