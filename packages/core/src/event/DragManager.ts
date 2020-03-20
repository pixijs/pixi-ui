import * as PIXI from 'pixi.js';
import { EventManager } from './EventManager';
import { Widget } from '../Widget';

/**
 * `DragManager` handles drag & drop events. It registers listeners for `mousedown`,
 * `touchstart` on the target and `mousemove`, `touchmove`, `mouseup`, `mouseupoutside`,
 * `touchend`, `touchendoutside` on the stage.
 *
 * By default, `draggable` widgets will internally handle drag-n-drop and reassigning
 * the callbacks on their `DragManager` will break their behaviour. You can prevent
 * this by using `eventBroker.dnd` directly without setting `widget.draggable` to
 * `true` (or using `widget.makeDraggable()`).
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.EventManager
 */
export class DragManager extends EventManager
{
    protected isBound: boolean;
    protected isDragging: boolean;
    protected id: number;
    protected dragStart: PIXI.Point;
    protected dragOffset: PIXI.Point;
    protected lastCursor: PIXI.Point;
    protected movementX: number;
    protected movementY: number;
    protected cancel: boolean;

    public onPress: (e: PIXI.interaction.InteractionEvent, isPressed: boolean) => void;
    public onDragStart: (e: PIXI.interaction.InteractionEvent) => void;
    public onDragMove: (e: PIXI.interaction.InteractionEvent, dragOffset: PIXI.Point) => void;
    public onDragEnd: (e: PIXI.interaction.InteractionEvent) => void;

    constructor(target: Widget)
    {
        super(target);

        this.isBound = false;
        this.isDragging = false;
        this.id = 0;
        this.dragStart = new PIXI.Point();
        this.dragOffset = new PIXI.Point();
        this.lastCursor = new PIXI.Point();
        this.movementX = 0;
        this.movementY = 0;
        this.cancel = false;

        this.target.interactive = true;

        this.onPress = (): void => null;
        this.onDragStart = (): void => null;
        this.onDragMove = (): void => null;
        this.onDragEnd = (): void => null;

        this.startEvent();
    }

    startEvent(): void
    {
        if (this.isEnabled)
        {
            return;
        }

        const { target } = this;

        target.insetContainer.on('mousedown', this.onDragStartImpl);
        target.insetContainer.on('touchstart', this.onDragStartImpl);

        this.isEnabled = true;
    }

    stopEvent(): void
    {
        if (!this.isEnabled)
        {
            return;
        }

        const { target } = this;

        if (this.isBound)
        {
            target.stage.removeListener('mousemove', this.onDragMoveImpl);
            target.stage.removeListener('touchmove', this.onDragMoveImpl);
            target.stage.removeListener('mouseup', this.onDragEndImpl);
            target.stage.removeListener('mouseupoutside', this.onDragEndImpl);
            target.stage.removeListener('touchend', this.onDragEndImpl);
            target.stage.removeListener('touchendoutside', this.onDragEndImpl);

            this.isBound = false;
        }

        target.insetContainer.removeListener('mousedown', this.onDragStartImpl);
        target.insetContainer.removeListener('touchstart', this.onDragStartImpl);

        this.isEnabled = false;
    }

    protected onDragStartImpl = (e: PIXI.interaction.InteractionEvent): void =>
    {
        const { target } = this;

        this.id = e.data.identifier;
        this.onPress(e, true);

        if (!this.isBound)
        {
            this.dragStart.copyFrom(e.data.global);

            target.stage.on('mousemove', this.onDragMoveImpl);
            target.stage.on('touchmove', this.onDragMoveImpl);
            target.stage.on('mouseup', this.onDragEndImpl);
            target.stage.on('mouseupoutside', this.onDragEndImpl);
            target.stage.on('touchend', this.onDragEndImpl);
            target.stage.on('touchendoutside', this.onDragEndImpl);
            target.stage.on('touchcancel', this.onDragEndImpl);

            this.isBound = true;
        }

        e.data.originalEvent.preventDefault();
    };

    private onDragMoveImpl = (e: PIXI.interaction.InteractionEvent): void =>
    {
        if (e.data.identifier !== this.id)
        {
            return;
        }

        const {
            lastCursor,
            dragOffset,
            dragStart,
            target,
        } = this;

        this.lastCursor.copyFrom(e.data.global);
        this.dragOffset.set(lastCursor.x - dragStart.x, lastCursor.y - dragStart.y);

        if (!this.isDragging)
        {
            this.movementX = Math.abs(dragOffset.x);
            this.movementY = Math.abs(dragOffset.y);

            if ((this.movementX === 0 && this.movementY === 0)
                    || Math.max(this.movementX, this.movementY) < target.dragThreshold)
            {
                return; // threshold
            }

            if (target.dragRestrictAxis !== null)
            {
                this.cancel = false;

                if (target.dragRestrictAxis === 'x' && this.movementY > this.movementX)
                {
                    this.cancel = true;
                }
                else if (target.dragRestrictAxis === 'y' && this.movementY <= this.movementX)
                {
                    this.cancel = true;
                }

                if (this.cancel)
                {
                    this.onDragEndImpl(e);

                    return;
                }
            }

            this.onDragStart(e);
            this.isDragging = true;
        }

        this.onDragMove(e, dragOffset);
    };

    private onDragEndImpl = (e: PIXI.interaction.InteractionEvent): void =>
    {
        if (e.data.identifier !== this.id)
        {
            return;
        }

        const { target } = this;

        if (this.isBound)
        {
            target.stage.removeListener('mousemove', this.onDragMoveImpl);
            target.stage.removeListener('touchmove', this.onDragMoveImpl);
            target.stage.removeListener('mouseup', this.onDragEndImpl);
            target.stage.removeListener('mouseupoutside', this.onDragEndImpl);
            target.stage.removeListener('touchend', this.onDragEndImpl);
            target.stage.removeListener('touchendoutside', this.onDragEndImpl);
            target.stage.removeListener('touchcancel', this.onDragEndImpl);

            this.isDragging = false;
            this.isBound = false;

            this.onDragEnd(e);
            this.onPress(e, false);
        }
    };
}
