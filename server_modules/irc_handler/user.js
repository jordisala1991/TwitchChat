var User = function(name) {
    this.userName = name;
    this.userColor;
    this.userModes = [];
}

User.prototype.addUserMode = function(mode) {
    this.userModes.push(mode);
}

module.exports.create = function(name) {
    return new User(name);
}