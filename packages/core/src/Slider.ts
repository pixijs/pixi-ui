import { Widget } from './Widget';
import { DragManager } from './event/DragManager';
import { Tween } from './Tween';
import { Ease } from './Ease/Ease';
import { Helpers } from './Helpers';
import { Sprite } from './Sprite';
import * as PIXI from 'pixi.js';
import { MeasureMode } from './IMeasurable';

export interface ISliderOptions
{
    track?: PIXI.Container | Widget;
    handle?: PIXI.Container | Widget;
    fill?: Sprite;
    orientation?: number;
    value?: number;
    minValue?: number;
    maxValue?: number;
    decimals?: number;
    onValueChange?: () => void;
    onValueChanging?: () => void;
}

/**
 * @memberof PUXI
 * @interface ISliderOptions
 * @property {PIXI.Container}[track]
 * @property {PIXI.Container}[handle]
 */

/**
 * These options are used to configure a `PUXI.Slider`.
 *
 * @memberof PUXI
 * @interface ISliderOptions
 * @property {PIXI.Container}[track]
 * @property {PIXI.Container}[fill]
 * @property {boolean}[vertical]
 * @property {number}[value]
 * @property {number}[minValue]
 * @property {number}[maxValue]
 * @property {number}[decimals]
 * @property {Function}[onValueChange]
 * @property {Function}[onValueChanging]
 */

/**
 * A slider is a form of input to set a variable to a value in a continuous
 * range. It cannot have its own children.
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.Widget
 */
export class Slider extends Widget
{
    protected _disabled: boolean;

    track: Widget;
    handle: Widget;
    fill: Sprite;

    public readonly orientation: number;

    protected percentValue: number;
    protected _minValue: number;
    protected _maxValue: number;

    private _localCursor: PIXI.Point;

    decimals: number;
    vertical: boolean;

    _lastChange: number;
    _lastChanging: number;

    onValueChange: (n: number) => void;
    onValueChanging: (n: number) => void;

    /**
     * @param options {Object} Slider settings
     * @param options.track {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)}  Any type of UIOBject, will be used for the slider track
     * @param options.handle {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as slider handle
     * @param [options.fill=null] {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used for slider fill
     * @param [options.vertical=false] {boolean} Direction of the slider
     * @param [options.value=0] {number} value of the slider
     * @param [options.minValue=0] {number} minimum value
     * @param [options.maxValue=100] {number} max value
     * @param [options.decimals=0] {boolean} the decimal precision (use negative to round tens and hundreds)
     * @param [options.onValueChange=null] {callback} Callback when the value has changed
     * @param [options.onValueChanging=null] {callback} Callback while the value is changing
     */
    constructor(options: ISliderOptions)
    {
        super();

        /**
         * The value expressed as a percentage from min. to max. This will always
         * be between 0 and 1.
         *
         * The actual value is: `this.minValue + this.percentValue * (this.maxValue - this.minValue`).
         *
         * @member {number}
         */
        this.percentValue = 0;
        this._disabled = false;

        this.fill = options.fill || null;
        this.percentValue = this._minValue;
        this._minValue = options.minValue || 0;
        this._maxValue = options.maxValue || 100;
        this.decimals = options.decimals || 0;
        this.orientation = options.orientation || Slider.HORIZONTAL;
        this.onValueChange = options.onValueChange || null;
        this.onValueChanging = options.onValueChanging || null;
        this.value = options.value || 50;

        // set options
        this.track = Widget.fromContent(options.track
            || (this.orientation === Slider.HORIZONTAL
                ? Slider.DEFAULT_HORIZONTAL_TRACK.clone()
                : Slider.DEFAULT_VERTICAL_TRACK.clone()));
        this.handle = Widget.fromContent(options.handle || Slider.DEFAULT_HANDLE.clone());

        this.addChild(this.track, this.handle);// initialize(), update() usage

        this._localCursor = new PIXI.Point();
        this.handle.contentContainer.buttonMode = true;
    }

    initialize(): void
    {
        super.initialize();

        let startValue = 0;
        let trackSize;

        const triggerValueChange = (): void =>
        {
            this.emit('change', this.value);

            if (this._lastChange != this.value)
            {
                this._lastChange = this.value;

                if (typeof this.onValueChange === 'function')
                {
                    this.onValueChange(this.value);
                }
            }
        };

        const triggerValueChanging = (): void =>
        {
            this.emit('changing', this.value);

            if (this._lastChanging != this.value)
            {
                this._lastChanging = this.value;

                if (typeof this.onValueChanging === 'function')
                {
                    this.onValueChanging(this.value);
                }
            }
        };

        const updatePositionToMouse = (mousePosition, soft): void =>
        {
            this.percentValue = this.getValueAtPhysicalPosition(mousePosition);
            this.layoutHandle();
            triggerValueChanging();
        };

        // Handles dragging
        const handleDrag: DragManager = this.handle.eventBroker.dnd as DragManager;

        handleDrag.onPress = (event: PIXI.interaction.InteractionEvent): void =>
        {
            event.stopPropagation();
        };

        handleDrag.onDragStart = (): void =>
        {
            startValue = this.percentValue;
            trackSize = this.orientation === Slider.HORIZONTAL
                ? this.track.width
                : this.track.height;
        };

        handleDrag.onDragMove = (event, offset: PIXI.Point): void =>
        {
            this.percentValue = Math.max(0, Math.min(
                1,
                startValue + ((this.orientation === Slider.HORIZONTAL ? offset.x : offset.y) / trackSize
                )));

            triggerValueChanging();
            this.layoutHandle();
        };

        handleDrag.onDragEnd = (): void =>
        {
            triggerValueChange();
            this.layoutHandle();
        };

        // Bar pressing/dragging
        const trackDrag: DragManager = this.track.eventBroker.dnd as DragManager;

        trackDrag.onPress = (event, isPressed): void =>
        {
            if (isPressed)
            {
                updatePositionToMouse(event.data.global, true);
            }

            event.stopPropagation();
        };

        trackDrag.onDragMove = (event: PIXI.interaction.InteractionEvent): void =>
        {
            updatePositionToMouse(event.data.global, false);
        };

        trackDrag.onDragEnd = (): void =>
        {
            triggerValueChange();
        };

        this.layoutHandle();
    }

    get value(): number
    {
        return Helpers.Round(Helpers.Lerp(this._minValue, this._maxValue, this.percentValue), this.decimals);
    }
    set value(val: number)
    {
        if (val === this.value)
        {
            return;
        }
        if (isNaN(val))
        {
            throw new Error('Cannot use NaN as a value');
        }

        this.percentValue = (Math.max(this._minValue, Math.min(this._maxValue, val)) - this._minValue) / (this._maxValue - this._minValue);

        if (typeof this.onValueChange === 'function')
        {
            this.onValueChange(this.value);
        }
        if (typeof this.onValueChanging === 'function')
        {
            this.onValueChanging(this.value);
        }

        if (this.handle && this.initialized)
        {
            this.layoutHandle();
        }
    }

    get minValue(): number
    {
        return this._minValue;
    }
    set minValue(val: number)
    {
        this._minValue = val;
        this.update();
    }

    get maxValue(): number
    {
        return this._maxValue;
    }
    set maxValue(val: number)
    {
        this._maxValue = val;
        this.update();
    }

    get disabled(): boolean
    {
        return this._disabled;
    }
    set disabled(val: boolean)
    {
        if (val !== this._disabled)
        {
            this._disabled = val;
            this.handle.contentContainer.buttonMode = !val;
            this.handle.contentContainer.interactive = !val;
            this.track.contentContainer.interactive = !val;
        }
    }

    /**
     * @protected
     * @returns the amount of the freedom that handle has in physical units, i.e. pixels. This
     *      is the width of the track minus the handle's size.
     */
    protected getPhysicalRange(): number
    {
        return this.orientation === Slider.HORIZONTAL
            ? this.contentWidth - this.handle.getMeasuredWidth()
            : this.contentHeight - this.handle.getMeasuredHeight();
    }

    /**
     * @protected
     * @param {PIXI.Point} cursor
     * @returns the value of the slider if the handle's center were (globally)
     *      positioned at the given point.
     */
    protected getValueAtPhysicalPosition(cursor: PIXI.Point): number
    {
        // Transform position
        const localCursor = this.contentContainer.toLocal(cursor, null, this._localCursor, true);

        let offset: number;
        let range: number;

        if (this.orientation === Slider.HORIZONTAL)
        {
            const handleWidth = this.handle.getMeasuredWidth();

            offset = localCursor.x - this.paddingLeft - (handleWidth / 4);
            range = this.contentWidth - handleWidth;
        }
        else
        {
            const handleHeight = this.handle.getMeasuredHeight();

            offset = localCursor.y - this.paddingTop - (handleHeight / 4);
            range = this.contentHeight - handleHeight;
        }

        return offset / range;
    }

    /**
     * Re-positions the handle. This should be called after `_value` has been changed.
     */
    protected layoutHandle(): void
    {
        const handle = this.handle;

        const handleWidth = handle.getMeasuredWidth();
        const handleHeight = handle.getMeasuredHeight();
        let width = this.width - this.paddingHorizontal;
        let height = this.height - this.paddingVertical;

        let handleX: number;
        let handleY: number;

        if (this.orientation === Slider.HORIZONTAL)
        {
            width -= handleWidth;

            handleY = (height - handleHeight) / 2;
            handleX = (width * this.percentValue);
        }
        else
        {
            height -= handleHeight;

            handleX = (width - handleWidth) / 2;
            handleY = (height * this.percentValue);
        }

        handle.layout(handleX, handleY, handleX + handleWidth, handleY + handleHeight);
    }

    /**
     * Slider measures itself using the track's natural dimensions in its non-oriented
     * direction. The oriented direction will be the equal the range's size times
     * the track's resolution.
     *
     * @param width
     * @param height
     * @param widthMode
     * @param heightMode
     */
    onMeasure(width: number, height: number, widthMode: number, heightMode: number): void
    {
        const naturalWidth = ((this.orientation === Slider.HORIZONTAL)
            ? this._maxValue - this._minValue
            : Math.max(this.handle.contentContainer.width, this.track.contentContainer.width))
                + this.paddingHorizontal;
        const naturalHeight = ((this.orientation === Slider.VERTICAL)
            ? this._maxValue - this._minValue
            : Math.max(this.handle.contentContainer.height, this.track.contentContainer.height))
                + this.paddingVertical;

        switch (widthMode)
        {
            case MeasureMode.EXACTLY:
                this._measuredWidth = width;
                break;
            case MeasureMode.UNBOUNDED:
                this._measuredWidth = naturalWidth;
                break;
            case MeasureMode.AT_MOST:
                this._measuredWidth = Math.min(width, naturalWidth);
                break;
        }

        switch (heightMode)
        {
            case MeasureMode.EXACTLY:
                this._measuredHeight = height;
                break;
            case MeasureMode.UNBOUNDED:
                this._measuredHeight = naturalHeight;
                break;
            case MeasureMode.AT_MOST:
                this._measuredHeight = Math.min(height, naturalHeight);
                break;
        }
    }

    /**
     * `Slider` lays the track to fill all of its width and height. The handle is aligned
     * in the middle in the non-oriented direction.
     *
     * @param l
     * @param t
     * @param r
     * @param b
     * @param dirty
     * @override
     */
    onLayout(l: number, t: number, r: number, b: number, dirty: boolean): void
    {
        super.onLayout(l, t, r, b, dirty);
        const { handle, track } = this;

        track.layout(0, 0, this.width - this.paddingHorizontal, this.height - this.paddingVertical);

        // Layout doesn't scale the widget
        // TODO: Create a Track widget, this won't work for custom tracks that don't wanna
        // scale (and it looks ugly.)
        track.insetContainer.width = track.width;
        track.insetContainer.height = track.height;

        handle.measure(this.width, this.height, MeasureMode.AT_MOST, MeasureMode.AT_MOST);

        this.layoutHandle();
    }

    /**
     * The default track for horizontally oriented sliders.
     * @static
     */
    static DEFAULT_HORIZONTAL_TRACK: PIXI.Graphics = new PIXI.Graphics()
        .beginFill(0xffffff, 1)
        .drawRect(0, 0, 16, 16) // natural width & height = 16
        .endFill()
        .lineStyle(1, 0x000000, 0.7, 1, true) // draw line in middle
        .moveTo(1, 8)
        .lineTo(15, 8);

    /**
     * The default track for vertically oriented sliders.
     * @static
     */
    static DEFAULT_VERTICAL_TRACK: PIXI.Graphics = new PIXI.Graphics()
        .beginFill(0xffffff, 1)
        .drawRect(0, 0, 16, 16) // natural width & height = 16
        .endFill()
        .lineStyle(1, 0x000000, 0.7, 1, true) // draw line in middle
        .moveTo(8, 1)
        .lineTo(8, 15);

    /**
     * @static
     */
    static DEFAULT_HANDLE: PIXI.Graphics = new PIXI.Graphics()
        .beginFill(0x000000)
        .drawCircle(16, 16, 8)
        .endFill()
        .beginFill(0x000000, 0.5)
        .drawCircle(16, 16, 16)
        .endFill();
    /**
     * Horizontal orientation
     * @static
     */
    static HORIZONTAL = 0xff5;

    /**
     * Vertical orientation
     * @static
     */
    static VERTICAL = 0xffe;
}
