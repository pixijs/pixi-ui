import * as PIXI from 'pixi.js';

export class DragEvent
{
    private bound: boolean;
    private start: PIXI.Point;
    private offset: PIXI.Point;
    private mouse: PIXI.Point;

    movementX: number;
    movementY: number;

    cancel: boolean;
    dragging: boolean;

    id: number;
    obj: any;

    constructor(obj: any)
    {
        this.bound = false;
        this.start = new PIXI.Point();
        this.offset = new PIXI.Point();
        this.mouse = new PIXI.Point();
        this.movementX = 0;
        this.movementY = 0;
        this.cancel = false;
        this.dragging = false;
        this.id = 0;

        this.obj = obj;
        this.obj.interactive = true;

        this.startEvent();
    }

    _onDragStart = (e): void =>
    {
        const {
            obj,
            start,
            _onDragMove,
            _onDragEnd,
        } = this;

        this.id = e.data.identifier;
        this.onPress.call(obj, e, true);

        if (!this.bound)
        {
            start.copyFrom(e.data.global);

            obj.stage.on('mousemove', _onDragMove);
            obj.stage.on('touchmove', _onDragMove);
            obj.stage.on('mouseup', _onDragEnd);
            obj.stage.on('mouseupoutside', _onDragEnd);
            obj.stage.on('touchend', _onDragEnd);
            obj.stage.on('touchendoutside', _onDragEnd);
            obj.stage.on('touchcancel', _onDragEnd);

            this.bound = true;
        }

        e.data.originalEvent.preventDefault();
    };

    _onDragMove = (e): void =>
    {
        if (e.data.identifier !== this.id)
        {
            return;
        }

        const {
            mouse,
            offset,
            start,
            obj,
        } = this;

        mouse.copyFrom(e.data.global);
        offset.set(mouse.x - start.x, mouse.y - start.y);

        if (!this.dragging)
        {
            this.movementX = Math.abs(offset.x);
            this.movementY = Math.abs(offset.y);

            if ((this.movementX === 0 && this.movementY === 0)
                    || Math.max(this.movementX, this.movementY) < obj.dragThreshold)
            {
                return; // thresshold
            }

            if (obj.dragRestrictAxis !== null)
            {
                this.cancel = false;

                if (obj.dragRestrictAxis === 'x' && this.movementY > this.movementX)
                {
                    this.cancel = true;
                }
                else if (obj.dragRestrictAxis === 'y' && this.movementY <= this.movementX)
                {
                    this.cancel = true;
                }

                if (this.cancel)
                {
                    this._onDragEnd(e);

                    return;
                }
            }

            this.onDragStart.call(obj, e);
            this.dragging = true;
        }

        this.onDragMove.call(obj, e, offset);
    };

    _onDragEnd = (e): void =>
    {
        if (e.data.identifier !== this.id)
        {
            return;
        }

        const {
            obj,
            _onDragMove,
            _onDragEnd,
        } = this;

        if (this.bound)
        {
            obj.stage.removeListener('mousemove', _onDragMove);
            obj.stage.removeListener('touchmove', _onDragMove);
            obj.stage.removeListener('mouseup', _onDragEnd);
            obj.stage.removeListener('mouseupoutside', _onDragEnd);
            obj.stage.removeListener('touchend', _onDragEnd);
            obj.stage.removeListener('touchendoutside', _onDragEnd);
            obj.stage.removeListener('touchcancel', _onDragEnd);

            this.dragging = false;
            this.bound = false;

            this.onDragEnd.call(obj, e);
            this.onPress.call(obj, e, false);
        }
    };

    stopEvent(): void
    {
        const {
            obj,
            _onDragStart,
            _onDragMove,
            _onDragEnd,
        } = this;

        if (this.bound)
        {
            obj.stage.removeListener('mousemove', _onDragMove);
            obj.stage.removeListener('touchmove', _onDragMove);
            obj.stage.removeListener('mouseup', _onDragEnd);
            obj.stage.removeListener('mouseupoutside', _onDragEnd);
            obj.stage.removeListener('touchend', _onDragEnd);
            obj.stage.removeListener('touchendoutside', _onDragEnd);

            this.bound = false;
        }

        obj.contentContainer.removeListener('mousedown', _onDragStart);
        obj.contentContainer.removeListener('touchstart', _onDragStart);
    }

    startEvent(): void
    {
        const { obj, _onDragStart } = this;

        obj.contentContainer.on('mousedown', _onDragStart);
        obj.contentContainer.on('touchstart', _onDragStart);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onPress(e, isPressed: boolean): void
    {
        // Default onPress
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onDragStart(e): void
    {
        // Default onDragStart
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onDragMove(e, offset: PIXI.Point): void
    {
        // Default onDragMove
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onDragEnd(e): void
    {
        // Default onDragEnd
    }
}
