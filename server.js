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

Client = require('./server_modules/socket_handler/client.js');
IrcHandler = require('./server_modules/irc_handler');
SocketHandler = require('./server_modules/socket_handler');
ExpressHandler = require('./server_modules/express_handler');

irc_handler = new IrcHandler();
client = new Client(configurations.botName, configurations.connectionOptions.password, configurations.channelName);
socket_handler = new SocketHandler();
express_handler = new ExpressHandler();

io.sockets.on('connection', function(socket) {
    socket_handler.connection(socket);
});

express_handler.configure();
app.get('/', function(request, response) {
    express_handler.homeAction(request, response);
});

server.listen(process.env.PORT || 5000);
