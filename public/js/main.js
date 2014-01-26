$(document).ready(function() {
    var socket = io.connect(socketUrl);

    function scrolledToBottom(box) {
        return (box[0].scrollHeight - box.scrollTop() - 15) <= box.outerHeight();
    }

    function scrollDown(box) {
        box.scrollTop(box[0].scrollHeight);
    }

    function addMessage(message) {
        var className = 'chat_line';
        if (message.containsBob) {
            className += ' bob';
        }
        var chatLine = '<div class="' + className + '">[' + message.date + '] <strong style=\'color: ' + message.color + '\'>&lt;' + message.name + '&gt;</strong> ' + message.message;
        var chatBox = $('.chat-lines');
        var shouldScroll = scrolledToBottom(chatBox);

        chatBox.append(chatLine);
        if (shouldScroll) scrollDown(chatBox);
    }

    function sendMessage(message) {
        if (message != '') {
            socket.emit('message_to_send', message);
        }
        $('.chat-input').val('');
    }

    socket.on('message', function(data) {
        addMessage(data);
    });

    $('.chat-input').keypress(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            sendMessage($('.chat-input').val());
        }
    });

    $('.send-chat-message').click(function() {
        sendMessage($('.chat-input').val());
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
                Twitch.login({ scope: ['user_read', 'chat_login'] });
            });
        }

    });
});
