Array.prototype.contains = function(object) {
    var index = this.length;
    while (index--) {
        if (this[index] === object) return true;
    }
    return false;
}

String.prototype.startsWith = function(str) {
    return this.lastIndexOf(str, 0) === 0;
}