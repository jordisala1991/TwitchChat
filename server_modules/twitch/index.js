var Twitch = function() {
    this.chatColors = [
        '#FF0000', '#0000FF', '#00FF00', '#B22222', 
        '#FF7F50', '#9ACD32', '#FF4500', '#2E8B57',
        '#DAA520', '#D2691E', '#5F9EA0', '#1E90FF',
        '#FF69B4', '#8A2BE2', '#00FF7F'
    ];
}

Twitch.prototype.getDefaultUserColor = function(userName) {
    var n = userName.charCodeAt(0) + userName.charCodeAt(userName.length - 1);
    return this.chatColors[n % this.chatColors.length];
}

module.exports.create = function() {
    return new Twitch();
}