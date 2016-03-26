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

irc_handler = new IrcHandler();
client = new Client(configurations.botName, configurations.connectionOptions.password);
socket_handler = new SocketHandler();

io.on('connection', function(socket) {
    socket_handler.connection(socket);
});

app.use(compression());
app.use(serveStatic(__dirname + '/public', { maxAge: 86400000 }));
server.listen(process.env.PORT || 5000);
