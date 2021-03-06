var Templating = function() {

}

Templating.prototype.userTemplating = function(message) {
    var template =
        '<span class="time">{DATE}</span>' +
        '{USER_BADGES_ICONS}' +
        '<span class="user-name" data-sender="{SENDER}" style="color: {USER_COLOR}">{USER_NAME}:</span>';

    if (message.user === undefined) return '';

    template = template.replace('{USER_COLOR}', message.user.color);
    template = template.replace('{USER_NAME}', message.user.display_name);
    template = template.replace('{DATE}', message.time);
    template = template.replace('{USER_BADGES_ICONS}', message.user.badges);
    template = template.replace('{SENDER}', message.user.user_name);

    return template;
}

Templating.prototype.messageTemplating = function(message) {
    var template =
        '<div class="chat-line">' +
            this.userTemplating(message) +
            '<span class="message" style="color: {MESSAGE_COLOR}">{MESSAGE}</span>' +
        '</div>';

    template = template.replace('{MESSAGE}', message.processed_message);
    template = template.replace('{MESSAGE_COLOR}', message.color);

    return template;
}

Templating.prototype.emoticonTemplating = function(id, name) {
    var template =
        '<span class="tooltip" data-tooltip-name="{NAME}">' +
            '<img class="emoticon" src="//static-cdn.jtvnw.net/emoticons/v1/{ID}/1.0" srcset="//static-cdn.jtvnw.net/emoticons/v1/{ID}/2.0 2x" alt="{NAME}" />' +
        '</span>';

    template = template.replace(new RegExp('{ID}', 'g'), id);
    template = template.replace(new RegExp('{NAME}', 'g'), name);

    return template;
}

Templating.prototype.subscriberTemplating = function(url) {
    var template = '<span class="badge" style="background-image: url({BACKGROUND_IMAGE});"></span>';

    return template.replace('{BACKGROUND_IMAGE}', url);
}

Templating.prototype.badgeTemplating = function(badge) {
    var template = '<span class="badge {BADGE}"></span>';

    return template.replace('{BADGE}', badge);
}
