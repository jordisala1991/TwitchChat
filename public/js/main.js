$(document).ready(function() {
    var socket = io.connect(socketUrl);
    var messageCount = 1;

    function scrolledToBottom(box) {
        return (box[0].scrollHeight - box.scrollTop() - 15) <= box.outerHeight();
    }

    function scrollDown(box) {
        box.scrollTop(box[0].scrollHeight);
    }

    function deleteFirstMessage(box) {
        --messageCount;
        box.find('.chat-line').first().remove();
    }

    // TODO: improve link detection
    // function linkify(inputText) {
    //     var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //     replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    //     replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //     replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    //     replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //     return replacedText;
    // }

    function addMessage(message) {
        var messageDate = moment().format('HH:mm'),
            chatBox = $('.chat-lines'), 
            shouldScroll = scrolledToBottom(chatBox),
            chatLine;

        chatLine = '<div class="chat-line ' + message.messageColor + '">[' + messageDate + '] <strong style=\'color: ' + message.user.userColor + '\'>&lt;' + message.user.userName + '&gt;</strong> ' + message.message + '</div>';
        chatBox.append(chatLine);
        ++messageCount;

        if (messageCount > 150) deleteFirstMessage(chatBox);
        if (shouldScroll) scrollDown(chatBox);
    }

    function sendMessage(message) {
        if (message != '') {
            socket.emit('message_to_send', message);
        }
        $('.chat-input').val('');
    }

    socket.on('message', function(message) {
        addMessage(message);
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

            Twitch.api({method: 'user'}, function(error, user) {
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
