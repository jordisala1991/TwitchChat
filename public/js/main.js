$(document).ready(function() {
    var socket = io.connect('http://twitch-chat.herokuapp.com');

    function addMessage(message) {
        var chatLine = '<div>[' + message.date + '] <strong style=\'color: ' + message.color + '\'>&lt;' + message.name + '&gt;</strong> ' + message.message;

        $('.content').append(chatLine);
    }

    socket.on('message', function(data) {
        addMessage(data);
    });
});