import * as PIXI from 'pixi.js';
import { EventManager } from './EventManager';
import { Widget } from '../Widget';

/**
 * Handles the `wheel` and `scroll` DOM events on widgets. It also registers
 * listeners for `mouseout` and `mouseover`.
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.EventManager
 */
export class ScrollManager extends EventManager
{
    private bound: boolean;
    private delta: PIXI.Point;
    private preventDefault: boolean;

    constructor(target: Widget, preventDefault = true)
    {
        super(target);

        this.bound = false;
        this.delta = new PIXI.Point();
        this.preventDefault = preventDefault;

        this.startEvent();
    }

    /**
     * @override
     */
    startEvent(): void
    {
        const { target, onHoverImpl, onMouseOutImpl } = this;

        target.contentContainer.on('mouseover', onHoverImpl);
        target.contentContainer.on('mouseout', onMouseOutImpl);
    }

    /**
     * @override
     */
    stopEvent(): void
    {
        const { target, onMouseScrollImpl, onHoverImpl, onMouseOutImpl } = this;

        if (this.bound)
        {
            document.removeEventListener('mousewheel', onMouseScrollImpl);
            document.removeEventListener('DOMMouseScroll', onMouseScrollImpl);

            this.bound = false;
        }

        target.contentContainer.removeListener('mouseover', onHoverImpl);
        target.contentContainer.removeListener('mouseout', onMouseOutImpl);
    }

    private onMouseScrollImpl = (e: WheelEvent): void =>
    {
        const { target, preventDefault, delta } = this;

        if (preventDefault)
        {
            event.preventDefault();
        }

        if (typeof e.deltaX !== 'undefined')
        {
            delta.set(e.deltaX, e.deltaY);
        }
        else // Firefox
        {
            delta.set(e.axis === 1 ? e.detail * 60 : 0,
                e.axis === 2 ? e.detail * 60 : 0);
        }

        this.onMouseScroll.call(target, event, delta);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onHoverImpl = (e): void =>
    {
        const { onMouseScrollImpl } = this;

        if (!this.bound)
        {
            document.addEventListener('mousewheel', onMouseScrollImpl, false);
            document.addEventListener('DOMMouseScroll', onMouseScrollImpl, false);

            this.bound = true;
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onMouseOutImpl = (e): void =>
    {
        const { onMouseScrollImpl } = this;

        if (this.bound)
        {
            document.removeEventListener('mousewheel', onMouseScrollImpl);
            document.removeEventListener('DOMMouseScroll', onMouseScrollImpl);

            this.bound = false;
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onMouseScroll = function onMouseScroll(event, delta: PIXI.Point): void
    {
        // Default onMouseScroll.
    };
}
