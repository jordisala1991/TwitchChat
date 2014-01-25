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

        $('.twitch-connect').click(function() {
            Twitch.login({
                scope: ['user_read', 'chat_login']
            });
        })

        if (!status.authenticated) {
            $('.twitch-connect').show()
        }
        else {
            var token = Twitch.getToken();

            Twitch.api({method: 'user'}, function(error, user) {
                console.log(user);
            });

            console.log(Twitch);
        }
    });
});