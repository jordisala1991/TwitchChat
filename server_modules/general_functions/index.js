Array.prototype.contains = function(object) {
    var index = this.length;
    while (index--) {
        if (this[index] === object) return true;
    }
    return false;
}