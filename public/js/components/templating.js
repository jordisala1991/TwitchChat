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

Templating.prototype.emoticonTemplating = function(data) {
    var emoticonTemplate =
        '<span class="emoticon" style="' +
            'background-image: url({BACKGROUND_IMAGE}); ' +
            'height: {HEIGHT}px; ' +
            'width: {WIDTH}px; ' +
            'margin: {MARGIN_TOP}px 0px;">' +
        '</span>';

    emoticonTemplate = emoticonTemplate.replace("{BACKGROUND_IMAGE}", data.emoticonUrl);
    emoticonTemplate = emoticonTemplate.replace("{HEIGHT}", data.emoticonHeight);
    emoticonTemplate = emoticonTemplate.replace("{WIDTH}", data.emoticonWidth);
    emoticonTemplate = emoticonTemplate.replace("{MARGIN_TOP}", data.emoticonMargins);

    return emoticonTemplate;
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
