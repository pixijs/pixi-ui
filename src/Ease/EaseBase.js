function EaseBase() {
    this.getPosition = function (p) {
        return p;
    };
}

EaseBase.prototype.constructor = EaseBase;
module.exports = EaseBase;



