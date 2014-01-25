irc = require('irc');
express = require('express');
http = require('http');
app = express();
server = http.createServer(app);
moment = require('moment');
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

server.listen(process.env.PORT || 5000);

var client = new irc.Client(configurations.serverAddress, configurations.botName, configurations.connectionOptions);
var irc_functions = require('./server_modules/irc_functions').create();

client.send('TWITCHCLIENT');
client.addListener('pm', irc_functions.privateMessage.bind(irc_functions));
client.addListener('message' + configurations.channelName, irc_functions.channelMessage.bind(irc_functions));
client.addListener('error', irc_functions.errorMessage.bind(irc_functions));