/*!
 * @puxi/tween - v1.0.0
 * Compiled Wed, 18 Mar 2020 16:23:13 UTC
 *
 * @puxi/tween is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var PIXI = require('pixi.js');

/**
 * Holds the information needed to perform a tweening operation. It is used internally
 * by `PUXI.tween.TweenManager`.
 *
 * @memberof PUXI.tween
 * @class
 * @template T
 */
class TweenContext extends PIXI.utils.EventEmitter {
    constructor(key, startValue, endValue, erp, observedValue, startTime, endTime) {
        super();
        /**
         * Unique id for this tweening operation
         * @member {string}
         */
        this.key = key;
        /**
         * Start value of interpolation
         * @member {T}
         */
        this.startValue = startValue;
        /**
         * End value of interpolation
         * @member {T}
         */
        this.endValue = endValue;
        /**
         * Interpolation function
         * @member {Erp}
         */
        this.erp = erp;
        /**
         * Object that is observed and the interpolated value to be stored in.
         * @member {T}
         */
        this.observedValue = observedValue;
        /**
         * @member {DOMHighResTimeStamp}
         * @readonly
         */
        this.startTime = startTime;
        /**
         * @member {DOMHighResTimeStamp
         * @readonly}
         */
        this.endTime = endTime;
    }
    /**
     * Updates the observed value.
     *
     * @param {DOMHighResTimeStamp} t - current time
     */
    update(t = performance.now()) {
        t = (t - this.startTime) / (this.endTime - this.startTime);
        this.erp(this.startValue, this.endValue, Math.min(Math.max(t, 0), 1), this.observedValue);
        this.emit('update', this.observedValue, this.key);
        if (t >= 1) {
            this.emit('complete', this);
            this.removeAllListeners();
        }
    }
}
/**
 * Fired whenever the observed value is updated.
 * @event update
 * @param {T} observedValue
 * @param {number} key
 */
/**
 * Fired when tween has finished. References to this tween should be removed.
 * @event complete
 * @param {TweenContext} cxt
 */
/**
 * Used for pooling.
 * @member {Array<TweenContext>}
 * @static
 */
TweenContext.pool = [];

let nextKey = 0;
/**
 * @memberof PUXI.tween
 * @class
 */
class TweenManager {
    constructor(autoStart = true) {
        this.tweenMap = new Map();
        if (autoStart) {
            this.start();
        }
    }
    addTween(startValue, endValue, erp, startTime, endTime) {
        const tweenCxt = (TweenContext.pool.pop() || new TweenContext());
        tweenCxt.key = nextKey++;
        tweenCxt.startValue = startValue;
        tweenCxt.endValue = endValue;
        tweenCxt.erp = erp;
        tweenCxt.startTime = startTime;
        tweenCxt.endTime = endTime;
        this.tweenMap.set(tweenCxt.key, tweenCxt);
        tweenCxt.on('complete', this.onTweenComplete);
        return tweenCxt;
    }
    start() {
        if (this.isRunning) {
            return;
        }
        PIXI.Ticker.shared.add(this.onUpdate);
        this.isRunning = true;
    }
    stop() {
        if (!this.isRunning) {
            return;
        }
        PIXI.Ticker.shared.remove(this.onUpdate);
        this.isRunning = false;
    }
    onUpdate() {
        for (const [, cxt] of this.tweenMap) {
            cxt.update();
        }
    }
    onTweenComplete(cxt) {
        this.tweenMap.delete(cxt.key);
        TweenContext.pool.push(cxt);
    }
}

exports.TweenManager = TweenManager;
//# sourceMappingURL=puxi-tween.cjs.map
