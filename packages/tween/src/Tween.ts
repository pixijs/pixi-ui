import { Ease } from './Ease';
import { Erp } from './Interpolator';
import * as PIXI from 'pixi.js';
import { TweenManager } from './TweenManager';

export interface TweenTarget<T>
{
    [key: string]: T;
}

/**
 * Holds the information needed to perform a tweening operation. It is used internally
 * by `PUXI.tween.TweenManager`.
 *
 * @memberof PUXI.tween
 * @class
 * @template T
 */
export class Tween<T> extends PIXI.utils.EventEmitter
{
    startValue: T;
    endValue: T;
    erp: Erp<T>;
    ease: Ease;

    startTime: DOMHighResTimeStamp;
    endTime: DOMHighResTimeStamp;

    manager: TweenManager;
    key: number;
    observedValue: T;

    autoCreated: boolean;

    protected _repeat: number;
    protected _flip: boolean;
    protected _next: Tween<any>;

    protected _target: TweenTarget<T>;
    protected _observedProperty: string;

    constructor( // eslint-disable-line max-params
        manager?: TweenManager,
        key?: number,
        startValue?: T,
        endValue?: T,
        erp?: Erp<T>,
        ease?: Ease,
        observedValue?: T,
        startTime?: DOMHighResTimeStamp,
        endTime?: DOMHighResTimeStamp,
        repeat = 1,
        flip = true)
    {
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
    update(t: DOMHighResTimeStamp = performance.now()): void
    {
        t = (t - this.startTime) / (this.endTime - this.startTime);
        t = Math.min(Math.max(t, 0), 1);

        if (this.ease)
        {
            t = this.ease(t);
        }

        // Update observed value
        this.observedValue = this.erp(
            this.startValue,
            this.endValue,
            Math.min(Math.max(t, 0), 1),
            this.observedValue,
        );

        // Emit update event
        this.emit('update', this.observedValue, this.key);

        // Update target object (if any)
        if (this._target)
        {
            this._target[this._observedProperty] = this.observedValue;
        }

        // If cycle completed...
        if (t >= 1)
        {
            --this._repeat;

            this.emit('cycle', this);

            // Repeat tween if required
            if (this._repeat > 0)
            {
                if (this._flip)
                {
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
            if (this._next)
            {
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
    target(target: TweenTarget<T>, observedProperty: string): Tween<T>
    {
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
    repeat(repeat: number, flip = true): Tween<T>
    {
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
    chain<W>(startValue: W, endValue: W, duration: DOMHighResTimeStamp, erp: Erp<W>, ease: Ease): Tween<W>
    {
        const next = (Tween.pool.pop() || new Tween<W>()) as Tween<W>;

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
    reset(): void
    {
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
    destroy(): void
    {
        this.reset();

        if (this.autoCreated)
        {
            Tween.pool.push(this);
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
    static pool: Array<Tween<any>> = [];
}
