module.exports = function(message) {
    var options = getOptions(message);

    io.sockets.json.emit('message', {
        'message': encode(message.message),
        'emotes': options['emotes'],
        'color': isAction(message) ? options['color'] : undefined,
        'channel': message.target,
        'user': {
            'display_name': options['display-name'] || capitalize(message.username),
            'user_name': message.username,
            'color': options['color'],
            'modes': getModes(message, options)
        }
    });
}

var getOptions = function(message) {
    var message_splitted = message.raw.substring(1).split(' ');
    var raw_options = message_splitted[0].split(';'),
        options = {};

    for (var i = 0; i < raw_options.length; i++) {
        var keyValue = raw_options[i].split('=');
        options[keyValue[0]] = keyValue[1];
    }
    return options;
}

var getModes = function(message, options) {
    var modes = [];

    if (options['user-type']) modes.push(options['user-type']);
    if (options['subscriber'] === '1') modes.push('subscriber');
    if (options['turbo'] === '1') modes.push('turbo');
    if (message.target.substring(1) === message.username) modes.push('broadcaster');

    return modes;
}

var isAction = function(message) {
    return message.raw.indexOf(':\u0001ACTION ') !== -1;
}

var encode = function(text) {
    var regexp = new RegExp('<', 'g'),
        regexp2 = new RegExp('>', 'g');

    return text.replace(regexp, '&lt;').replace(regexp2, '&gt;');
}

var capitalize = function(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}
