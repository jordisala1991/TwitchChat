function processEmoticon(rawEmoticon) {
    var template = 
        '<span class="emoticon" style="' +
            'background-image: url({BACKGROUND_IMAGE}); ' +
            'height: {HEIGHT}px; ' +
            'width: {WIDTH}px;' +
            'margin: {MARGIN_TOP}px 0px;">' +
        '</span>';

    template = template.replace("{BACKGROUND_IMAGE}", rawEmoticon.url);
    template = template.replace("{HEIGHT}", rawEmoticon.height);
    template = template.replace("{WIDTH}", rawEmoticon.width);
    template = template.replace("{MARGIN_TOP}", (18-rawEmoticon.height)/2);

    rawEmoticon.html = template
    return rawEmoticon;
}

String.prototype.linkify = function() {
    var replacedText,
        replacePattern1,
        replacePattern2;

    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

    replacedText = this.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
    return replacedText;
}

Array.prototype.contains = function(object) {
    var index = this.length;
    while (index--) {
        if (this[index] === object) return true;
    }
    return false;
}