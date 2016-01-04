var Templating = function() {

}

Templating.prototype.userTemplating = function(message) {
    var template =
        '<span class="time">{DATE}</span>' +
        '{USER_BADGES_ICONS}' +
        '<span class="user-name" data-sender="{SENDER}" style="color: {USER_COLOR}">{USER_NAME}:</span>';

    if (message.user === undefined) return '';

    template = template.replace("{USER_COLOR}", message.user.color);
    template = template.replace("{USER_NAME}", message.user.display_name);
    template = template.replace("{DATE}", message.user.date);
    template = template.replace("{USER_BADGES_ICONS}", message.user.badges);
    template = template.replace("{SENDER}", message.user.user_name);

    return template;
}

Templating.prototype.messageTemplating = function(message) {
    var template =
        '<div class="chat-line">' +
            this.userTemplating(message) +
            '<span class="message" style="color: {MESSAGE_COLOR}">{MESSAGE}</span>' +
        '</div>';

    template = template.replace("{MESSAGE}", message.processed_message);
    template = template.replace("{MESSAGE_COLOR}", message.color);

    return template;
}

Templating.prototype.emoticonTemplating = function(emoticon_id) {
    var emoticon_template =
        '<span class="emoticon" style="' +
            'background-image: url(//static-cdn.jtvnw.net/emoticons/v1/{ID}/1.0); ' +
            'height: 24px; ' +
            'width: 24px; ' +
            'margin: -5px 0px;">' +
        '</span>';

    return emoticon_template.replace("{ID}", emoticon_id);
}

Templating.prototype.subscriberTemplating = function(imageUrl) {
    var badgeTemplate =
        '<span class="badge" style="' +
            'background-image: url({BACKGROUND_IMAGE});">' +
        '</span>';

    badgeTemplate = badgeTemplate.replace("{BACKGROUND_IMAGE}", imageUrl);

    return badgeTemplate;
}

Templating.prototype.badgeTemplating = function(badge) {
    var badgeTemplate =
        '<span class="badge {BADGE}"></span>';

    badgeTemplate = badgeTemplate.replace("{BADGE}", badge);

    return badgeTemplate;
}
