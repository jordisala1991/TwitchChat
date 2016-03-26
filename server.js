factory = require('irc-factory');
api = new factory.Api();
express = require('express');
compression = require('compression');
serveStatic = require('serve-static');
http = require('http');
app = express();
server = http.createServer(app);
io = require('socket.io').listen(server);

Client = require('./server_modules/socket_handler/client.js');
IrcHandler = require('./server_modules/irc_handler');
SocketHandler = require('./server_modules/socket_handler');

irc_handler = new IrcHandler();
client = new Client(process.env.BOT_USER, process.env.BOT_PASS);
socket_handler = new SocketHandler(process.env.BOT_USER, process.env.CHANNEL_NAME, process.env.CLIENT_ID);

io.on('connection', function(socket) {
    socket_handler.connection(socket);
});

app.use(compression());
app.use(serveStatic(__dirname + '/public', { maxAge: 86400000 }));
server.listen(process.env.PORT || 5000);
