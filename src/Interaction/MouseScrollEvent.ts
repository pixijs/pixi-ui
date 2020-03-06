import * as PIXI from 'pixi.js';

export class MouseScrollEvent
{
    private bound: boolean;
    private delta: PIXI.Point;
    private preventDefault: boolean;

    private obj: any;

    constructor(obj: any, preventDefault: boolean)
    {
        this.bound = false;
        this.delta = new PIXI.Point();
        this.obj = obj;
        this.preventDefault = preventDefault;

        this.startEvent();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onMouseScrollImpl(e): void
    {
        const { obj, preventDefault, delta } = this;

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

        this.onMouseScroll.call(obj, event, delta);
    }

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

    stopEvent(): void
    {
        const { obj, onMouseScrollImpl, onHoverImpl, onMouseOutImpl } = this;

        if (this.bound)
        {
            document.removeEventListener('mousewheel', onMouseScrollImpl);
            document.removeEventListener('DOMMouseScroll', onMouseScrollImpl);

            this.bound = false;
        }

        obj.container.removeListener('mouseover', onHoverImpl);
        obj.container.removeListener('mouseout', onMouseOutImpl);
    }

    startEvent(): void
    {
        const { obj, onHoverImpl, onMouseOutImpl } = this;

        obj.container.on('mouseover', onHoverImpl);
        obj.container.on('mouseout', onMouseOutImpl);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onMouseScroll = function onMouseScroll(event, delta: PIXI.Point): void
    {
        // Default onMouseScroll.
    };
}
