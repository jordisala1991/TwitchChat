var User = function(name) {
    this.userName = name;
    this.userColor;
    this.userModes = [];
}

User.prototype.addUserMode = function(mode) {
    if (!this.userModes.contains(mode)) this.userModes.push(mode);
}

module.exports.create = function(name) {
    return new User(name);
}