var twitchChat = new TwitchChat($('.chat-lines'));

Twitch.init({clientId: '1uzx8xlados5eqn7sb0pexoyuzkc1g9'}, function(error, status) {
    if (error) console.log(error);

    Twitch.api({method: 'chat/' + channelName.substring(1) + '/emoticons'}, function(error, data) {
        if (error) console.log(error);

        $.map(data.emoticons, function(rawEmoticon) {
            twitchChat.addEmoticon(rawEmoticon);
        });
    });

    if (status.authenticated) {
        var token = Twitch.getToken();

        Twitch.api({method: 'user'}, function(error, user) {
            if (error) console.log(error);
            twitchChat.sendCredentials(user.name, token);
        });
    }
    else {
        $('.twitch-connect').show();
        $('.twitch-connect').click(function() {
            Twitch.login({ scope: ['user_read', 'chat_login'] });
        });
    }
});

$(document).ready(function() {
    $('.chat-input').keypress(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            twitchChat.sendMessage($('.chat-input').val());
            $('.chat-input').val('');
        }
    });

    $('.send-chat-message').click(function() {
        twitchChat.sendMessage($('.chat-input').val());
        $('.chat-input').val('');
    });

    twitchChat.socket.on('message', function(message) {
        twitchChat.addMessage(message);
    });
});