var Tween = require('./Tween');

function Ticker(autoStart) {
    PIXI.utils.EventEmitter.call(this);
    this._disabled = true;
    this._now = 0;

    this.DeltaTime = 0;
    this.Time = performance.now();
    this.Ms = 0;
    if (autoStart) {
        this.disabled = false;
    }
    Ticker.shared = this;
}

Ticker.prototype = Object.create(PIXI.utils.EventEmitter.prototype);
Ticker.prototype.constructor = Ticker;

module.exports = Ticker;



Object.defineProperties(Ticker.prototype, {
    disabled: {
        get: function () {
            return this._disabled;
        },
        set: function (val) {
            if (!this._disabled) {
                this._disabled = true;
            }
            else {
                this._disabled = false;
                Ticker.shared = this;
                this.update(performance.now(), true);
            }
        }
    },
});



/**
 * Updates the text
 *
 * @private
 */
Ticker.prototype.update = function (time) {
    Ticker.shared._now = time;
    Ticker.shared.Ms = Ticker.shared._now - Ticker.shared.Time;
    Ticker.shared.Time = Ticker.shared._now;
    Ticker.shared.DeltaTime = Ticker.shared.Ms * 0.001;
    Ticker.shared.emit("update", Ticker.shared.DeltaTime);
    Tween._update(Ticker.shared.DeltaTime);
    if (!Ticker.shared._disabled)
        requestAnimationFrame(Ticker.shared.update);
};




Ticker.on = function (event, fn, context) {
    Ticker.prototype.on.apply(this.shared, arguments);
};

Ticker.once = function (event, fn, context) {
    Ticker.prototype.once.apply(this.shared, arguments);
};

Ticker.removeListener = function (event, fn) {
    Ticker.prototype.removeListener.apply(this.shared, arguments);
};


Ticker.shared = new Ticker(true);