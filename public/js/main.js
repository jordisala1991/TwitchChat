$(document).ready(function() {
    var socket = io.connect('http://192.168.1.15:9999');

    function addMessage(message) {
        var chatLine = '<div>[' + message.date + '] <strong style=\'color: ' + message.color + '\'>&lt;' + message.name + '&gt;</strong> ' + message.message;

        $('.content').append(chatLine);
    }

    socket.on('message', function(data) {
        addMessage(data);
    });
});