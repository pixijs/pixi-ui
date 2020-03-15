import * as PIXI from 'pixi.js';
import { Widget } from '../Widget';
import { EventManager } from './EventManager';

/**
 * `ClickManager` handles hover, click, and drag & drop events. It registers listeners
 * for `mousedown`, `mouseup`, `mousemove`, `mouseout`, `mouseover`, `touchstart`,
 * `touchend`, `touchendoutside`, `touchmove`, `rightup`, `rightdown`, `rightupoutside`
 * events.
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.EventManager
 */
export class ClickManager extends EventManager
{
    onHover: (event: PIXI.interaction.InteractionEvent, over: boolean) => void;
    onPress: (event: PIXI.interaction.InteractionEvent, isPressed: boolean) => void;
    onClick: (event: PIXI.interaction.InteractionMouseEvents) => void;
    onMove: (event: PIXI.interaction.InteractionEvent) => void;

    protected rightMouseButton: boolean;
    protected includeHover: boolean;
    protected doubleClick: boolean;

    private bound: boolean;
    private id: number;
    private ishover: boolean;
    protected target: Widget;

    private movementX: number;
    private movementY: number;
    mouse: PIXI.Point;
    offset: PIXI.Point;

    private evMouseDown: string;
    private evMouseUp: string;
    private evMouseUpOutside: string;

    time: number;

    /**
     * @param {PUXI.Widget | PUXI.Button} target
     * @param {boolean}[includeHover=false] - enable hover (`mouseover`, `mouseout`) listeners
     * @param {boolean}[rightMouseButton=false] - use right mouse clicks
     * @param {boolean}[doubleClick=false] - fire double clicks
     */
    constructor(target: Widget, includeHover?: boolean, rightMouseButton?, doubleClick?: boolean)
    {
        super(target);

        this.bound = false;
        this.id = 0;
        this.ishover = false;
        this.mouse = new PIXI.Point();
        this.offset = new PIXI.Point();
        this.movementX = 0;
        this.movementY = 0;

        this.includeHover = typeof includeHover === 'undefined' ? true : includeHover;
        this.rightMouseButton = typeof rightMouseButton === 'undefined' ? false : rightMouseButton;
        this.doubleClick = typeof doubleClick === 'undefined' ? false : doubleClick;

        this.evMouseDown = this.rightMouseButton ? 'rightdown' : 'mousedown';
        this.evMouseUp = this.rightMouseButton ? 'rightup' : 'mouseup';
        this.evMouseUpOutside = this.rightMouseButton ? 'rightupoutside' : 'mouseupoutside';

        target.interactive = true;

        this.time = 0;
        this.startEvent();

        this.onHover = (): void => null;
        this.onPress = (): void => null;
        this.onClick = (): void => null;
        this.onMove = (): void => null;
    }

    /**
     * @override
     */
    startEvent = (): void =>
    {
        const { target } = this;

        target.contentContainer.on(this.evMouseDown, this.onMouseDownImpl);

        if (!this.rightMouseButton)
        {
            target.contentContainer.on('touchstart', this.onMouseDownImpl);
        }

        if (this.includeHover)
        {
            target.contentContainer.on('mouseover', this.onMouseOverImpl);
            target.contentContainer.on('mouseout', this.onMouseOutImpl);
        }
    };

    /**
     * @override
     */
    stopEvent = (): void =>
    {
        const { target } = this;

        if (this.bound)
        {
            target.contentContainer.removeListener(this.evMouseUp, this.onMouseUpImpl);
            target.contentContainer.removeListener(this.evMouseUpOutside, this.onMouseUpOutsideImpl);

            if (!this.rightMouseButton)
            {
                target.contentContainer.removeListener('touchend', this.onMouseUpImpl);
                target.contentContainer.removeListener('touchendoutside', this.onMouseUpOutsideImpl);
            }

            this.bound = false;
        }

        target.contentContainer.removeListener(this.evMouseDown, this.onMouseDownImpl);

        if (!this.rightMouseButton)
        {
            target.contentContainer.removeListener('touchstart', this.onMouseDownImpl);
        }

        if (this.includeHover)
        {
            target.contentContainer.removeListener('mouseover', this.onMouseOverImpl);
            target.contentContainer.removeListener('mouseout', this.onMouseOutImpl);
            target.contentContainer.removeListener('mousemove', this.onMouseMoveImpl);
            target.contentContainer.removeListener('touchmove', this.onMouseMoveImpl);
        }
    };

    protected onMouseDownImpl = (event: PIXI.interaction.InteractionEvent): void =>
    {
        const {
            target: obj,
            evMouseUp,
            onMouseUpImpl: _onMouseUp,
            evMouseUpOutside,
            onMouseUpOutsideImpl: _onMouseUpOutside,
            rightMouseButton: right,
        } = this;

        this.mouse.copyFrom(event.data.global);
        this.id = event.data.identifier;
        this.onPress.call(this.target, event, true);

        if (!this.bound)
        {
            obj.contentContainer.on(evMouseUp, _onMouseUp);
            obj.contentContainer.on(evMouseUpOutside, _onMouseUpOutside);

            if (!right)
            {
                obj.contentContainer.on('touchend', _onMouseUp);
                obj.contentContainer.on('touchendoutside', _onMouseUpOutside);
            }

            this.bound = true;
        }

        if (this.doubleClick)
        {
            const now = performance.now();

            if (now - this.time < 210)
            {
                this.onClick.call(obj, event);
            }
            else
            {
                this.time = now;
            }
        }

        event.data.originalEvent.preventDefault();
    };

    protected onMouseUpCommonImpl = (event: PIXI.interaction.InteractionEvent): void =>
    {
        const {
            target: obj,
            evMouseUp,
            onMouseUpImpl: _onMouseUp,
            evMouseUpOutside,
            onMouseUpOutsideImpl: _onMouseUpOutside,
        } = this;

        if (event.data.identifier !== this.id)
        {
            return;
        }

        this.offset.set(event.data.global.x - this.mouse.x, event.data.global.y - this.mouse.y);

        if (this.bound)
        {
            obj.contentContainer.removeListener(evMouseUp, _onMouseUp);
            obj.contentContainer.removeListener(evMouseUpOutside, _onMouseUpOutside);

            if (!this.rightMouseButton)
            {
                obj.contentContainer.removeListener('touchend', _onMouseUp);
                obj.contentContainer.removeListener('touchendoutside', _onMouseUpOutside);
            }

            this.bound = false;
        }

        this.onPress.call(obj, event, false);
    };

    protected onMouseUpImpl = (event): void =>
    {
        if (event.data.identifier !== this.id)
        {
            return;
        }

        this.onMouseUpCommonImpl(event);

        // prevent clicks with scrolling/dragging objects
        if (this.target.dragThreshold)
        {
            this.movementX = Math.abs(this.offset.x);
            this.movementY = Math.abs(this.offset.y);

            if (Math.max(this.movementX, this.movementY) > this.target.dragThreshold)
            {
                return;
            }
        }

        if (!this.doubleClick)
        {
            this.onClick.call(this.target, event);
        }
    };

    protected onMouseUpOutsideImpl = (event): void =>
    {
        if (event.data.identifier !== this.id)
        {
            return;
        }

        this.onMouseUpCommonImpl(event);
    };

    protected onMouseOverImpl = (event): void =>
    {
        if (!this.ishover)
        {
            this.ishover = true;
            this.target.contentContainer.on('mousemove', this.onMouseMoveImpl);
            this.target.contentContainer.on('touchmove', this.onMouseMoveImpl);

            this.onHover.call(this.target, event, true);
        }
    };

    protected onMouseOutImpl = (event): void =>
    {
        if (this.ishover)
        {
            this.ishover = false;
            this.target.contentContainer.removeListener('mousemove', this.onMouseMoveImpl);
            this.target.contentContainer.removeListener('touchmove', this.onMouseMoveImpl);

            this.onHover.call(this.target, event, false);
        }
    };

    protected onMouseMoveImpl = (event): void =>
    {
        this.onMove.call(this.target, event);
    };
}
