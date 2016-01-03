var Templating = function() {

}

Templating.prototype.messageTemplating = function(data) {
    var messageTemplate =
        '<div class="chat-line {MESSAGE_COLOR}" data-sender="{SENDER}">' +
            '<span class="time">{DATE}</span>' +
            '{USER_BADGES_ICONS}' +
            '<span class="user-name" style="color: {USER_COLOR}">{USER_NAME}:</span>' +
            '<span class="message">{MESSAGE}</span>' +
        '</div>';

    messageTemplate = messageTemplate.replace("{MESSAGE_COLOR}", data.messageColor);
    messageTemplate = messageTemplate.replace("{DATE}", data.messageDate);
    messageTemplate = messageTemplate.replace("{USER_COLOR}", data.userColor);
    messageTemplate = messageTemplate.replace("{USER_NAME}", data.userName);
    messageTemplate = messageTemplate.replace("{SENDER}", data.sender);
    messageTemplate = messageTemplate.replace("{MESSAGE}", data.textMessage);
    messageTemplate = messageTemplate.replace("{USER_BADGES_ICONS}", data.userBadges);

    return messageTemplate;
}

Templating.prototype.actionTemplating = function(data) {
    var messageTemplate =
        '<div class="chat-line {MESSAGE_COLOR}" data-sender="{SENDER}">' +
            '<span class="time">{DATE}</span>' +
            '{USER_BADGES_ICONS}' +
            '<span class="user-name" style="color: {USER_COLOR}">&bull; {USER_NAME}</span>' +
            '<span class="message">{MESSAGE}</span>' +
        '</div>';

    messageTemplate = messageTemplate.replace("{MESSAGE_COLOR}", data.messageColor);
    messageTemplate = messageTemplate.replace("{DATE}", data.messageDate);
    messageTemplate = messageTemplate.replace("{USER_COLOR}", data.userColor);
    messageTemplate = messageTemplate.replace("{USER_NAME}", data.userName);
    messageTemplate = messageTemplate.replace("{SENDER}", data.sender);
    messageTemplate = messageTemplate.replace("{MESSAGE}", data.textMessage);
    messageTemplate = messageTemplate.replace("{USER_BADGES_ICONS}", data.userBadges);

    return messageTemplate;
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
