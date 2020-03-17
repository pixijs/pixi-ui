import { Tween } from './Tween';
import * as PIXI from 'pixi.js';

/**
 * This ticker is an event-emitter that can be used for running periodic tasks
 * in the rendering loop. It emits the `update` event every animation frame.
 *
 * @memberof PUXI
 * @class
 * @extends PIXI.utils.EventEmitter
 */
export class Ticker extends PIXI.utils.EventEmitter
{
    private _disabled: boolean;
    private _now: number;

    DeltaTime: number;
    Time: number;
    Ms: number;

    constructor(autoStart: boolean)
    {
        super();

        this._disabled = true;
        this._now = 0;

        this.DeltaTime = 0;
        this.Time = performance.now();
        this.Ms = 0;

        if (autoStart)
        {
            this.disabled = false;
        }

        Ticker.shared = this;
    }

    get disabled(): boolean
    {
        return this._disabled;
    }
    set disabled(val: boolean)
    {
        if (!this._disabled)
        {
            this._disabled = true;
        }
        else
        {
            this._disabled = false;
            Ticker.shared = this;

            this.update(performance.now(), true);
        }
    }

    /**
     * Updates the text
     *
     * @private
     */
    update(time: number): void
    {
        Ticker.shared._now = time;
        Ticker.shared.Ms = Ticker.shared._now - Ticker.shared.Time;
        Ticker.shared.Time = Ticker.shared._now;
        Ticker.shared.DeltaTime = Ticker.shared.Ms * 0.001;
        Ticker.shared.emit('update', Ticker.shared.DeltaTime);
        Tween._update(Ticker.shared.DeltaTime);

        if (!Ticker.shared._disabled)
        {
            requestAnimationFrame(Ticker.shared.update);
        }
    }

    /**
     * The update event is fired periodically and it can be used to for a rendering
     * loop.
     * @event update
     * @param {DOMHighResTimeStamp} deltaTime - milliseconds since last update
     */

    static shared: Ticker;

    static on(event: any, fn: Function, context: any): void
    {
        Ticker.shared.on(event, fn, context);
    }

    static once(event: any, fn: Function, context: any): void
    {
        Ticker.shared.once(event, fn, context);
    }

    static removeListener(event: any, fn: Function): void
    {
        Ticker.shared.removeListener(event, fn);
    }
}

Ticker.shared = new Ticker(true);
