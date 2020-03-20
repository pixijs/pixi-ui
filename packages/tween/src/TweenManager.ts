import { Tween } from './Tween';
import { Ease } from './Ease';
import { Erp } from './Interpolator';
import { Ticker } from 'pixi.js';

// TODO: Prevent update loop from starting if there are no queued tweens.

export let nextTweenKey = 0;

/**
 * @memberof PUXI.tween
 * @class
 */
export class TweenManager
{
    protected tweenMap: Map<number, Tween<any>>;

    private isRunning: boolean;

    constructor(autoStart = true)
    {
        this.tweenMap = new Map<number, Tween<any>>();

        if (autoStart)
        {
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
    tween<T>(
        startValue: T,
        endValue: T,
        duration: DOMHighResTimeStamp,
        erp: Erp<T>,
        ease?: Ease,
    ): Tween<T>
    {
        const tweenCxt = (Tween.pool.pop() || new Tween()) as Tween<T>;

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
    queue(context: Tween<any>): TweenManager
    {
        context.key = nextTweenKey++;

        this.tweenMap.set(context.key, context);
        context.on('complete', this.onTweenComplete);

        return this;
    }

    /**
     * Starts the update loop.
     */
    start(): void
    {
        if (this.isRunning)
        {
            return;
        }

        Ticker.shared.add(this.onUpdate);
        this.isRunning = true;
    }

    /**
     * Stops the update loop. This will prevent tweens from getting updated.
     */
    stop(): void
    {
        if (!this.isRunning)
        {
            return;
        }

        Ticker.shared.remove(this.onUpdate);
        this.isRunning = false;
    }

    onUpdate = (): void =>
    {
        for (const [, cxt] of this.tweenMap)
        {
            cxt.update();
        }
    };

    protected onTweenComplete = (cxt: Tween<any>): void =>
    {
        this.tweenMap.delete(cxt.key);

        cxt.destroy();
    };
}
