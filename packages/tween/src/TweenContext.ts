import { Erp } from './Interpolator';
import * as PIXI from 'pixi.js';

/**
 * Holds the information needed to perform a tweening operation. It is used internally
 * by `PUXI.tween.TweenManager`.
 *
 * @memberof PUXI.tween
 * @class
 * @template T
 */
export class TweenContext<T> extends PIXI.utils.EventEmitter
{
    startValue: T;
    endValue: T;
    erp: Erp<T>;

    startTime: DOMHighResTimeStamp;
    endTime: DOMHighResTimeStamp;

    key: number;
    observedValue: T;

    constructor(
        key?: number,
        startValue?: T,
        endValue?: T,
        erp?: Erp<T>,
        observedValue?: T,
        startTime?: DOMHighResTimeStamp,
        endTime?: DOMHighResTimeStamp)
    {
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
    update(t: DOMHighResTimeStamp = performance.now()): void
    {
        t = (t - this.startTime) / (this.endTime - this.startTime);

        this.erp(
            this.startValue,
            this.endValue,
            Math.min(Math.max(t, 0), 1),
            this.observedValue,
        );

        this.emit('update', this.observedValue, this.key);

        if (t >= 1)
        {
            this.emit('complete', this);
            this.removeAllListeners();
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
    static pool: Array<TweenContext<any>> = [];
}
