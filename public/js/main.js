$(document).ready(function() {
    var socket = io.connect(socketUrl);

    function addMessage(message) {
        var className = 'chat_line';
        if (message.containsBob) {
            className += ' bob';
        }
        var chatLine = '<div class="' + className + '">[' + message.date + '] <strong style=\'color: ' + message.color + '\'>&lt;' + message.name + '&gt;</strong> ' + message.message;

        $('.content').append(chatLine);
    }

    socket.on('message', function(data) {
        console.log(data);
        addMessage(data);
    });

    socket.emit('login', {'username': 'jordism91', 'oauth': 'ojliwyrhb9zapkizg6lxg3hajiy7st'});

    $('.send-chat-message').click(function() {
        socket.emit('message_to_send', $('.chat-input').val());
    });

    Twitch.init({clientId: '1uzx8xlados5eqn7sb0pexoyuzkc1g9'}, function(error, status) {
        if (error) console.log(error);

        if (status.authenticated) {
            var token = Twitch.getToken();

            var test = Twitch.api({method: 'user'}, function(error, user) {
                if (error) console.log(error);
                socket.emit('login', {'username': user.name, 'oauth': token});
            });
        }
        else {
            $('.twitch-connect').show();
            $('.twitch-connect').click(function() {
                Twitch.login({
                    scope: ['user_read', 'chat_login']
                });
            });
        }

    });
});