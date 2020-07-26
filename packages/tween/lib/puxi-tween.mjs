/*!
 * @puxi/tween - v1.0.1
 * Compiled Sun, 26 Jul 2020 02:14:25 UTC
 *
 * @puxi/tween is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
// mjs
import { utils, Ticker, Point } from 'pixi.js';

/**
 * Holds the information needed to perform a tweening operation. It is used internally
 * by `PUXI.tween.TweenManager`.
 *
 * @memberof PUXI.tween
 * @class
 * @template T
 */
class Tween extends utils.EventEmitter {
    constructor(// eslint-disable-line max-params
    manager, key, startValue, endValue, erp, ease, observedValue, startTime, endTime, repeat = 1, flip = true) {
        super();
        /**
         * The tween-manager whose update loop handles this tween.
         * @member {PUXI.TweenManager}
         */
        this.manager = manager;
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
         * Linear interpolator on tween property.
         * @member {Erp}
         */
        this.erp = erp;
        /**
         * Easing function
         * @member {Ease}
         */
        this.ease = ease;
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
         * @member {DOMHighResTimeStamp}
         * @readonly
         */
        this.endTime = endTime;
        this._repeat = repeat;
        this._flip = flip;
        this._next = null;
        this._target = null;
        this._observedProperty = null;
        this.autoCreated = false;
    }
    /**
     * Updates the observed value.
     *
     * @param {DOMHighResTimeStamp} t - current time
     */
    update(t = performance.now()) {
        t = (t - this.startTime) / (this.endTime - this.startTime);
        t = Math.min(Math.max(t, 0), 1);
        if (this.ease) {
            t = this.ease(t);
        }
        // Update observed value
        this.observedValue = this.erp(this.startValue, this.endValue, Math.min(Math.max(t, 0), 1), this.observedValue);
        // Emit update event
        this.emit('update', this.observedValue, this.key);
        // Update target object (if any)
        if (this._target) {
            this._target[this._observedProperty] = this.observedValue;
        }
        // If cycle completed...
        if (t >= 1) {
            --this._repeat;
            this.emit('cycle', this);
            // Repeat tween if required
            if (this._repeat > 0) {
                if (this._flip) {
                    const { startValue: s, endValue: e } = this;
                    this.endValue = s;
                    this.startValue = e;
                }
                const duration = this.endTime - this.startTime;
                this.startTime += duration;
                this.endTime += duration;
                return;
            }
            // Initiate chained tween
            if (this._next) {
                this.manager.queue(this._next);
            }
            this.reset();
            // Cleanup after completion
            this.emit('complete', this);
            this.removeAllListeners();
        }
    }
    /**
     * Configures this tween to update the observed-property on a tween target object
     * each animation frame.
     * @template T
     * @param {PUXI.TweenTarget<T>} target - object on which property is being tweened
     * @param {string} observedProperty - name of property on target
     */
    target(target, observedProperty) {
        this._target = target;
        this._observedProperty = observedProperty;
        return this;
    }
    /**
     * Repeats this tween `repeat` no. of times again. If the tween is still running,
     * then this is no. of times it will again (not added to the previous repeat
     * count).
     *
     * Each time the tween is repeated, a `cycle` event is fired.
     *
     * By default, the repeat count of any tween is 1.
     *
     * @param {number} repeat - the repeat count
     * @param {boolean}[flip=true] - whether to switch start/end values each cycle
     * @returns {Tween<T>} - this tween, useful for method chaining
     */
    repeat(repeat, flip = true) {
        this._repeat = repeat;
        this._flip = flip;
        return this;
    }
    /**
     * Chains a tween that will run after this one finishes.
     *
     * @template W
     * @param {W} startValue
     * @param {W} endValue
     * @param {DOMHighResTimeStamp} duration
     * @param {PUXI.Erp<W>} erp
     * @param {PUXI.Ease}[ease]
     */
    chain(startValue, endValue, duration, erp, ease) {
        const next = (Tween.pool.pop() || new Tween());
        next.manager = this.manager;
        next.key = 0;
        next.startValue = startValue;
        next.endValue = endValue;
        next.startTime = this.endTime;
        next.endTime = next.startTime + duration;
        next.erp = erp;
        next.ease = ease;
        this._next = next;
        return next;
    }
    /**
     * Clears the tween's extra properties.
     */
    reset() {
        this.ease = null;
        this._repeat = 0;
        this._next = null;
        this._target = null;
        this._observedProperty = null;
    }
    /**
     * Called when a tween is complete and no references to it are held. This
     * will pool it (if auto-created).
     *
     * Custom tweens should override this.
     */
    destroy() {
        this.reset();
        if (this.autoCreated) {
            Tween.pool.push(this);
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
 * Fired whenever the tween has "repeated" once.
 * @event cycle
 * @param {Tween} cxt
 */
/**
 * Fired when tween has finished. References to this tween should be removed.
 * @event complete
 * @param {Tween} cxt
 */
/**
 * Used for pooling.
 * @member {Array<TweenContext>}
 * @static
 */
Tween.pool = [];

// TODO: Prevent update loop from starting if there are no queued tweens.
let nextTweenKey = 0;
/**
 * @memberof PUXI.tween
 * @class
 */
class TweenManager {
    constructor(autoStart = true) {
        this.onUpdate = () => {
            for (const [, cxt] of this.tweenMap) {
                cxt.update();
            }
        };
        this.onTweenComplete = (cxt) => {
            this.tweenMap.delete(cxt.key);
            cxt.destroy();
        };
        this.tweenMap = new Map();
        if (autoStart) {
            this.start();
        }
    }
    /**
     * Initiates a tween from `startValue` to `endValue` for the given duration
     * using an interpolator.
     *
     * @template {T}
     * @param {T} startValue - value of tween property at start
     * @param {T} endValue - value of tween property at finish
     * @param {DOMHighResTimeStamp | number} duration - duration of tween in milliseconds
     * @param {PUXI.Erp<T>} erp - interpolator on tween property
     * @param {PUXI.Ease}[ease] - easing function
     */
    tween(startValue, endValue, duration, erp, ease) {
        const tweenCxt = (Tween.pool.pop() || new Tween());
        tweenCxt.autoCreated = true;
        tweenCxt.reset();
        tweenCxt.manager = this;
        tweenCxt.key = nextTweenKey++;
        tweenCxt.startValue = startValue;
        tweenCxt.endValue = endValue;
        tweenCxt.erp = erp;
        tweenCxt.ease = ease;
        tweenCxt.startTime = performance.now();
        tweenCxt.endTime = tweenCxt.startTime + duration;
        this.tweenMap.set(tweenCxt.key, tweenCxt);
        tweenCxt.on('complete', this.onTweenComplete);
        return tweenCxt;
    }
    /**
     * Queues the tween context so that it is updated every frame.
     *
     * @param {PUXI.Tween} context
     * @returns {PUXI.TweenManager} this manager, useful for method chaining
     */
    queue(context) {
        context.key = nextTweenKey++;
        this.tweenMap.set(context.key, context);
        context.on('complete', this.onTweenComplete);
        return this;
    }
    /**
     * Starts the update loop.
     */
    start() {
        if (this.isRunning) {
            return;
        }
        Ticker.shared.add(this.onUpdate);
        this.isRunning = true;
    }
    /**
     * Stops the update loop. This will prevent tweens from getting updated.
     */
    stop() {
        if (!this.isRunning) {
            return;
        }
        Ticker.shared.remove(this.onUpdate);
        this.isRunning = false;
    }
}

/**
 * @memberof PUXI
 * @typedef {Function} Ease
 * @param {number} t - interpolation parameter (b/w 0 and 1) that increases linearly
 * @returns {numeber} - output interpolation parameter (b/w 0 and 1)
 */
/**
 * Quadratic ease-in
 *
 * @memberof PUXI
 * @type Ease
 * @param {number} t
 * @returns {number}
 */
const EaseIn = (t) => t * t;
/**
 * Quadratic ease-out
 *
 * @memberof PUXI
 * @type Ease
 * @param {number} t
 * @returns {number}
 */
const EaseOut = (t) => (1 - t) * (1 - t);
/**
 * Quadratic ease-in & ease-out mixed!
 *
 * @memberof PUXI
 * @type Ease
 * @param {number} t
 * @returns {number}
 */
const EaseBoth = (t) => ((t <= 0.5)
    ? 2 * t * t
    : ((2 * ((t - 0.5) * (1.5 - t))) + 0.5));

/**
 * Defines a (linear) interpolator on a type `T`.
 *
 * @memberof PUXI
 * @typedef {Function} Erp
 * @template T
 * @param {T} startValue
 * @param {T} endValue
 * @param {number} t - interpolation parameter between 0 and 1
 * @param {T}[observedValue]
 */
/**
 * Interpolation function for number properties like alpha, rotation, component
 * position/scale/skew, elevation, etc.
 *
 * @memberof PUXI
 * @extends PUXI.Erp<number>
 * @param {number} startValue
 * @param {number} endValue
 * @param {number} t
 */
const NumberErp = (startValue, endValue, t) => ((1 - t) * startValue) + (t * endValue);
/**
 * Interpolation function for 2D vector properties like position, scale, skew, etc.
 *
 * @memberof PUXI
 * @extends PUXI.Erp<PIXI.Point>
 * @param {PIXI.Point} startValue
 * @param {PIXI.Point} endValue
 * @param {number} t
 * @param {PIXI.Point} observedValue
 */
const PointErp = (startValue, endValue, t, observedValue) => {
    if (!observedValue) {
        observedValue = new Point();
    }
    observedValue.x = ((1 - t) * startValue.x) + (t * endValue.x);
    observedValue.y = ((1 - t) * startValue.y) + (t * endValue.y);
    return observedValue;
};

export { EaseBoth, EaseIn, EaseOut, NumberErp, PointErp, Tween, TweenManager, nextTweenKey };
//# sourceMappingURL=puxi-tween.mjs.map
