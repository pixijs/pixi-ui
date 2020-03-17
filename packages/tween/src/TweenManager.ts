import { TweenContext } from './TweenContext';
import { Erp } from './Interpolator';
import { Ticker } from 'pixi.js';

let nextKey = 0;

/**
 * @memberof PUXI.tween
 * @class
 */
export class TweenManager
{
    tweenMap: Map<number, TweenContext<any>>;

    private isRunning: boolean;

    constructor(autoStart = true)
    {
        this.tweenMap = new Map<number, TweenContext<any>>();

        if (autoStart)
        {
            this.start();
        }
    }

    addTween<T>(
        startValue: T,
        endValue: T,
        erp: Erp<T>,
        startTime: DOMHighResTimeStamp,
        endTime: DOMHighResTimeStamp,
    ): TweenContext<T>
    {
        const tweenCxt = (TweenContext.pool.pop() || new TweenContext()) as TweenContext<T>;

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

    start(): void
    {
        if (this.isRunning)
        {
            return;
        }

        Ticker.shared.add(this.onUpdate);
        this.isRunning = true;
    }

    stop(): void
    {
        if (!this.isRunning)
        {
            return;
        }

        Ticker.shared.remove(this.onUpdate);
        this.isRunning = false;
    }

    onUpdate(): void
    {
        for (const [, cxt] of this.tweenMap)
        {
            cxt.update();
        }
    }

    protected onTweenComplete(cxt: TweenContext<any>): void
    {
        this.tweenMap.delete(cxt.key);
        TweenContext.pool.push(cxt);
    }
}
