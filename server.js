irc = require('irc');
express = require('express');
http = require('http');
app = express();
server = http.createServer(app);
io = require('socket.io').listen(server);
piler = require('piler');
configurations = require('./server_modules/configurations');
io.set('log level', 1);

var clientjs = piler.createJSManager();
var clientcss = piler.createCSSManager();

app.configure(function() {
    clientjs.bind(app);
    clientcss.bind(app);

    clientcss.addFile(__dirname + "/public/css/normalize.css");
    clientcss.addFile(__dirname + "/public/css/main.css");
    clientcss.addFile(__dirname + "/public/css/styles.css");

    clientjs.addFile(__dirname + "/public/js/plugins.js");
    clientjs.addFile(__dirname + "/public/js/main.js");

    app.set('views', __dirname + '/views');
    app.set('view engine', 'twig');
    app.set('twig options', { 
        strict_variables: false
    });
    app.use(express.static(__dirname + '/public'));
});

app.configure("development", function() {
    clientjs.liveUpdate(clientcss, io);
});

app.get('/', function(request, response){
    response.render('index', {
        'socketUrl': configurations.environment.baseUrl,
        'channelName': configurations.channelName,
        'js': clientjs.renderTags(),
        'css': clientcss.renderTags()
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