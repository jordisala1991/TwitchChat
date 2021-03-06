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

String.prototype.replaceBetween = function(start, end, what) {
    return this.substring(0, start) + what + this.substring(end + 1);
};
