import * as PIXI from 'pixi.js';
import { Widget } from '../Widget';
import { EventManager } from './EventManager';

/**
 * `ClickManager` handles hover and click events. It registers listeners
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
    onHover: (event: PIXI.InteractionEvent, over: boolean) => void;
    onPress: (event: PIXI.InteractionEvent, isPressed: boolean) => void;
    onClick: (event: PIXI.InteractionMouseEvents) => void;
    onMove: (event: PIXI.InteractionEvent) => void;

    protected _rightMouseButton: boolean;
    protected _includeHover: boolean;
    protected _doubleClick: boolean;

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

        this._includeHover = typeof includeHover === 'undefined' ? true : includeHover;
        this.rightMouseButton = typeof rightMouseButton === 'undefined' ? false : rightMouseButton;
        this._doubleClick = typeof doubleClick === 'undefined' ? false : doubleClick;

        target.interactive = true;

        this.time = 0;
        this.startEvent();

        this.onHover = (): void => null;
        this.onPress = (): void => null;
        this.onClick = (): void => null;
        this.onMove = (): void => null;
    }

    /**
     * Whether right mice are used for clicks rather than left mice.
     * @member boolean
     */
    get rightMouseButton(): boolean
    {
        return this._rightMouseButton;
    }
    set rightMouseButton(val: boolean)
    {
        this._rightMouseButton = val;

        this.evMouseDown = this._rightMouseButton ? 'rightdown' : 'mousedown';
        this.evMouseUp = this._rightMouseButton ? 'rightup' : 'mouseup';
        this.evMouseUpOutside = this._rightMouseButton ? 'rightupoutside' : 'mouseupoutside';
    }

    /**
     * @param {boolean}[includeHover]
     * @param {boolean}[rightMouseButton]
     * @param {boolean}[doubleClick]
     * @override
     */
    startEvent = (
        includeHover = this._includeHover,
        rightMouseButton = this._rightMouseButton,
        doubleClick = this._doubleClick,
    ): void =>
    {
        if (this.isEnabled)
        {
            return;
        }

        this._includeHover = includeHover;
        this.rightMouseButton = rightMouseButton;
        this._doubleClick = doubleClick;

        const { target } = this;

        target.insetContainer.on(this.evMouseDown, this.onMouseDownImpl);

        if (!this._rightMouseButton)
        {
            target.insetContainer.on('touchstart', this.onMouseDownImpl);
        }

        if (this._includeHover)
        {
            target.insetContainer.on('mouseover', this.onMouseOverImpl);
            target.insetContainer.on('mouseout', this.onMouseOutImpl);
        }

        this.isEnabled = true;
    };

    /**
     * @override
     */
    stopEvent = (): void =>
    {
        if (!this.isEnabled)
        {
            return;
        }

        const { target } = this;

        if (this.bound)
        {
            target.insetContainer.removeListener(this.evMouseUp, this.onMouseUpImpl);
            target.insetContainer.removeListener(this.evMouseUpOutside, this.onMouseUpOutsideImpl);

            if (!this._rightMouseButton)
            {
                target.insetContainer.removeListener('touchend', this.onMouseUpImpl);
                target.insetContainer.removeListener('touchendoutside', this.onMouseUpOutsideImpl);
            }

            this.bound = false;
        }

        target.insetContainer.removeListener(this.evMouseDown, this.onMouseDownImpl);

        if (!this._rightMouseButton)
        {
            target.insetContainer.removeListener('touchstart', this.onMouseDownImpl);
        }

        if (this._includeHover)
        {
            target.insetContainer.removeListener('mouseover', this.onMouseOverImpl);
            target.insetContainer.removeListener('mouseout', this.onMouseOutImpl);
            target.insetContainer.removeListener('mousemove', this.onMouseMoveImpl);
            target.insetContainer.removeListener('touchmove', this.onMouseMoveImpl);
        }

        this.isEnabled = false;
    };

    protected onMouseDownImpl = (event: PIXI.interaction.InteractionEvent): void =>
    {
        const {
            target: obj,
            evMouseUp,
            onMouseUpImpl: _onMouseUp,
            evMouseUpOutside,
            onMouseUpOutsideImpl: _onMouseUpOutside,
            _rightMouseButton: right,
        } = this;

        this.mouse.copyFrom(event.data.global);
        this.id = event.data.identifier;
        this.onPress.call(this.target, event, true);

        if (!this.bound)
        {
            obj.insetContainer.on(evMouseUp, _onMouseUp);
            obj.insetContainer.on(evMouseUpOutside, _onMouseUpOutside);

            if (!right)
            {
                obj.insetContainer.on('touchend', _onMouseUp);
                obj.insetContainer.on('touchendoutside', _onMouseUpOutside);
            }

            this.bound = true;
        }

        if (this._doubleClick)
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
            obj.insetContainer.removeListener(evMouseUp, _onMouseUp);
            obj.insetContainer.removeListener(evMouseUpOutside, _onMouseUpOutside);

            if (!this._rightMouseButton)
            {
                obj.insetContainer.removeListener('touchend', _onMouseUp);
                obj.insetContainer.removeListener('touchendoutside', _onMouseUpOutside);
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

        if (!this._doubleClick)
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
            this.target.insetContainer.on('mousemove', this.onMouseMoveImpl);
            this.target.insetContainer.on('touchmove', this.onMouseMoveImpl);

            this.onHover.call(this.target, event, true);
        }
    };

    protected onMouseOutImpl = (event): void =>
    {
        if (this.ishover)
        {
            this.ishover = false;
            this.target.insetContainer.removeListener('mousemove', this.onMouseMoveImpl);
            this.target.insetContainer.removeListener('touchmove', this.onMouseMoveImpl);

            this.onHover.call(this.target, event, false);
        }
    };

    protected onMouseMoveImpl = (event): void =>
    {
        this.onMove.call(this.target, event);
    };
}
