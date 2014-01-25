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
        addMessage(data);
    });

    Twitch.init({clientId: '1uzx8xlados5eqn7sb0pexoyuzkc1g9'}, function(error, status) {

        if (error) {
            console.log(error);
        }


        if (status.authenticaded) {
            var token = Twitch.getToken();
            var username = '';

            Twitch.api({method: 'user'}, function(error, user) {
                if (error) {
                    console.log(error);
                }

                username = user.name;
            });

            socket.emit('login', {'username': username, 'oauth': token});
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