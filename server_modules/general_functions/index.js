String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

Array.prototype.contains = function(object) {
    var index = this.length;
    while (index--) {
        if (this[index] === object) return true;
    }
    return false;
}