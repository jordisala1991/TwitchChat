var twitchChat = new TwitchChat();

function initializeTwitch(clientId) {
    Twitch.init({clientId: clientId}, function(error, status) {
        if (error) console.log(error);

        if (status.authenticated) {
            var token = Twitch.getToken();

            Twitch.api({method: 'user'}, function(error, user) {
                if (error) console.log(error);
                twitchChat.sendCredentials(user.name, token);
            });
            $('.chat-input').attr('placeholder', 'Chat about this Channel');
        }
        else {
            $('.chat-input').attr('placeholder', 'Sign up or log in to chat');
            $('.chat-input').attr('disabled', 'disabled');
            $('.twitch-connect').show();
            $('.twitch-connect').click(function() {
                twitchChat.chatHandler.trackEvent('Twitch Login', 'Button');
                Twitch.login({
                    scope: ['user_read', 'chat_login']
                });
            });
        }
    });
}

$(document).ready(function() {
    $('.chat-input').keypress(function(event) {
        if (event.which == 13) {
            twitchChat.sendMessage($('.chat-input').val(), 'Keyboard');
            event.preventDefault();
        }
    });

    $('.more-messages').click(function(event) {
        event.preventDefault();
        twitchChat.chatHandler.scrollDown();
    });

    $('.chat-lines').scroll(function(event) {
        event.preventDefault();

        if (twitchChat.chatHandler.isScrolledToBottom()) {
            $('.more-messages').hide();
        } else {
            $('.more-messages').show();
        }
    });

    $('.send-chat-message').click(function() {
        twitchChat.sendMessage($('.chat-input').val(), 'Button');
    });

    twitchChat.socket.on('init', function(message) {
        initializeTwitch(message.clientId);
        twitchChat.emoticonHandler.setSubscriberBadge(message.channelName);
    })

    twitchChat.socket.on('message', function(message) {
        twitchChat.addMessage(message);
    });

    twitchChat.socket.on('clear_chat', function(userName) {
        twitchChat.deleteMessages(userName);
    });

    twitchChat.socket.on('clear_all_chat', function() {
        twitchChat.deleteAllMessages();
    });
});
