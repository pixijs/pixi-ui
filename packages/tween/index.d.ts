import * as PIXI from 'pixi.js';

declare type Erp<T> = (start: T, end: T, t: number, into?: T) => T;

/**
 * Holds the information needed to perform a tweening operation. It is used internally
 * by `PUXI.tween.TweenManager`.
 *
 * @memberof PUXI.tween
 * @class
 * @template T
 */
declare class TweenContext<T> extends PIXI.utils.EventEmitter {
    startValue: T;
    endValue: T;
    erp: Erp<T>;
    startTime: DOMHighResTimeStamp;
    endTime: DOMHighResTimeStamp;
    key: number;
    observedValue: T;
    constructor(key?: number, startValue?: T, endValue?: T, erp?: Erp<T>, observedValue?: T, startTime?: DOMHighResTimeStamp, endTime?: DOMHighResTimeStamp);
    /**
     * Updates the observed value.
     *
     * @param {DOMHighResTimeStamp} t - current time
     */
    update(t?: DOMHighResTimeStamp): void;
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
    static pool: Array<TweenContext<any>>;
}

/**
 * @memberof PUXI.tween
 * @class
 */
export declare class TweenManager {
    tweenMap: Map<number, TweenContext<any>>;
    private isRunning;
    constructor(autoStart?: boolean);
    addTween<T>(startValue: T, endValue: T, erp: Erp<T>, startTime: DOMHighResTimeStamp, endTime: DOMHighResTimeStamp): TweenContext<T>;
    start(): void;
    stop(): void;
    onUpdate(): void;
    protected onTweenComplete(cxt: TweenContext<any>): void;
}

export { }
