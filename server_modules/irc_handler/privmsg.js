module.exports = function(raw_message) {
    var options = getOptions(raw_message),
        message = prepareMessage(raw_message, options);

    io.sockets.json.emit('message', message);
}

var getOptions = function(raw_message) {
    var message_splitted = raw_message.raw.substring(1).split(' ');
    var rawOptions = message_splitted[0].split(';'),
        options = {};

    for (var i = 0; i < rawOptions.length; i++) {
        var keyValue = rawOptions[i].split('=');
        options[keyValue[0]] = keyValue[1];
    }

    options['user_name'] = message_splitted[1].substring(1).split('!')[0];
    options['channel'] = message_splitted[3];

    return options;
}

var prepareMessage = function(raw_message, options) {
    var modes = [],
        display_name = options['display-name'];

    if (options['user-type']) modes.push(options['user-type']);
    if (options['subscriber'] === '1') modes.push('subscriber');
    if (options['turbo'] === '1') modes.push('turbo');
    if (options['channel'].substring(1) === options['user_name']) modes.push('broadcaster');
    if (display_name === '') display_name = capitalize(options['user_name']);

    return {
        'message': raw_message.message,
        'emotes': options['emotes'],
        'channel': options['channel'],
        'user': {
            'display_name': display_name,
            'user_name': options['user-name'],
            'color': options['color'],
            'modes': modes
        }
    }
}

var capitalize = function(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}
