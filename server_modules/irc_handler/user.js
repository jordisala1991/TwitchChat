var User = function(name) {
    this.userName = name;
    this.userColor;
    this.userModes = [];
    this.emoteSets = ['general'];
}

User.prototype.addUserMode = function(mode) {
    if (!this.userModes.contains(mode)) this.userModes.push(mode);
}

User.prototype.setEmoteSets = function(emoteSets) {
    this.emoteSets = emoteSets.replace('[', '').replace(']', '').split(',');
    this.emoteSets.push('general');
}

module.exports.create = function(name) {
    return new User(name);
}