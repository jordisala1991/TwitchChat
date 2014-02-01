var Templating = function() {

}

Templating.prototype.messageTemplating = function(data) {
    var messageTemplate = 
        '<div class="chat-line {MESSAGE_COLOR}">' +
            '<span>[{DATE}]</span>' +
            '{USER_MODE_ICONS}' +
            '<span class="user-name" style="color: {USER_COLOR}">&lt;{USER_NAME}&gt;</span>' +
            '<span>{MESSAGE}</span>' +
        '</div>';

    messageTemplate = messageTemplate.replace("{MESSAGE_COLOR}", data.messageColor);
    messageTemplate = messageTemplate.replace("{DATE}", data.messageDate);
    messageTemplate = messageTemplate.replace("{USER_COLOR}", data.userColor);
    messageTemplate = messageTemplate.replace("{USER_NAME}", data.userName);
    messageTemplate = messageTemplate.replace("{MESSAGE}", data.textMessage);
    messageTemplate = messageTemplate.replace("{USER_MODE_ICONS}", data.userModeIcons);

    return messageTemplate;
}

Templating.prototype.emoticonTemplating = function(data) {
    var emoticonTemplate =
        '<span class="emoticon" style="' +
            'background-image: url({BACKGROUND_IMAGE}); ' +
            'height: {HEIGHT}px; ' +
            'width: {WIDTH}px;' +
            'margin: {MARGIN_TOP}px 0px;">' +
        '</span>';

    emoticonTemplate = emoticonTemplate.replace("{BACKGROUND_IMAGE}", data.emoticonUrl);
    emoticonTemplate = emoticonTemplate.replace("{HEIGHT}", data.emoticonHeight);
    emoticonTemplate = emoticonTemplate.replace("{WIDTH}", data.emoticonWidth);
    emoticonTemplate = emoticonTemplate.replace("{MARGIN_TOP}", data.emoticonMargins);

    return emoticonTemplate;
}