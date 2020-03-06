import { UIBase } from './UIBase';
import { DragEvent } from './Interaction/DragEvent';
import { Tween } from './Tween';
import { Ease } from './Ease/Ease';
import { Helpers } from './Helpers';
import { Sprite } from './Sprite';
import * as PIXI from 'pixi.js';

interface ISliderOptions
{
    track?: Sprite;
    handle?: Sprite;
    fill?: Sprite;
    vertical?: boolean;
    value?: number;
    minValue?: number;
    maxValue?: number;
    decimals?: number;
    onValueChange?: () => void;
    onValueChanging?: () => void;
}

/**
* An UI Slider, the default width/height is 90%
*
* @class
* @extends UIBase
* @memberof PIXI.UI
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
export class Slider extends UIBase
{
    protected _amt: number;
    protected _disabled: boolean;

    track: Sprite;
    handle: Sprite;
    fill: Sprite;

    _minValue: number;
    _maxValue: number;
    decimals: number;
    vertical: boolean;

    _lastChange: number;
    _lastChanging: number;

    onValueChange: (number) => void;
    onValueChanging: (number) => void;

    constructor(options: ISliderOptions)
    {
        super(0, 0);

        this._amt = 0;
        this._disabled = false;

        // set options
        this.track = options.track;
        this.handle = options.handle;
        this.fill = options.fill || null;
        this._minValue = options.minValue || 0;
        this._maxValue = options.maxValue || 100;
        this.decimals = options.decimals || 0;
        this.vertical = options.vertical || false;
        this.onValueChange = options.onValueChange || null;
        this.onValueChanging = options.onValueChanging || null;
        this.value = options.value || 50;
        this.handle.pivot = 0.5;

        this.addChild(this.track);
        if (this.fill)
        {
            this.track.addChild(this.fill);
        }
        this.addChild(this.handle);
        this.handle.container.buttonMode = true;

        if (this.vertical)
        {
            this.height = '100%';
            this.width = this.track.width;
            this.track.height = '100%';
            this.handle.horizontalAlign = 'center';

            if (this.fill)
            {
                this.fill.horizontalAlign = 'center';
            }
        }
        else
        {
            this.width = '100%';
            this.height = this.track.height;
            this.track.width = '100%';
            this.handle.verticalAlign = 'middle';

            if (this.fill)
            {
                this.fill.verticalAlign = 'middle';
            }
        }
    }

    update(soft = 0): void
    {
        let handleSize; let
            val;

        if (this.vertical)
        {
            handleSize = this.handle._height || this.handle.container.height;
            val = ((this._height - handleSize) * this._amt) + (handleSize * 0.5);
            if (soft)
            {
                Tween.to(this.handle, 0.3, { top: val }, Ease.Power2.easeOut);
                if (this.fill) Tween.to(this.fill, 0.3, { height: val }, Ease.Power2.easeOut);
            }
            else
            {
                Tween.set(this.handle, { top: val });
                if (this.fill) Tween.set(this.fill, { height: val });
            }
        }
        else
        {
            handleSize = this.handle._width || this.handle.container.width;
            val = ((this._width - handleSize) * this._amt) + (handleSize * 0.5);
            if (soft)
            {
                Tween.to(this.handle, 0.3, { left: val }, Ease.Power2.easeOut);
                if (this.fill) Tween.to(this.fill, 0.3, { width: val }, Ease.Power2.easeOut);
            }
            else
            {
                Tween.set(this.handle, { left: val });
                if (this.fill) Tween.set(this.fill, { width: val });
            }
        }
    }

    initialize()
    {
        super.initialize();

        const localMousePosition = new PIXI.Point();
        let startValue = 0;
        let maxPosition;

        const triggerValueChange = () =>
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

        const triggerValueChanging = () =>
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
            this.track.container.toLocal(mousePosition, null, localMousePosition, true);

            const newPos = this.vertical ? localMousePosition.y - this.handle._height * 0.5 : localMousePosition.x - this.handle._width * 0.5;
            const maxPos = this.vertical ? this._height - this.handle._height : this._width - this.handle._width;

            this._amt = !maxPos ? 0 : Math.max(0, Math.min(1, newPos / maxPos));
            this.update(soft);
            triggerValueChanging();
        };

        // //Handle dragging
        const handleDrag = new DragEvent(this.handle);

        handleDrag.onPress = (event, isPressed: boolean): void =>
        {
            event.stopPropagation();
        };

        handleDrag.onDragStart = (event): void =>
        {
            startValue = this._amt;
            maxPosition = this.vertical ? this._height - this.handle._height : this._width - this.handle._width;
        };

        handleDrag.onDragMove = (event, offset: PIXI.Point): void =>
        {
            this._amt = !maxPosition ? 0 : Math.max(0, Math.min(1, startValue + ((this.vertical ? offset.y : offset.x) / maxPosition)));

            triggerValueChanging();
            this.update();
        };

        handleDrag.onDragEnd = function ()
        {
            triggerValueChange();
            this.update();
        };

        // Bar pressing/dragging
        const trackDrag = new DragEvent(this.track);

        trackDrag.onPress = (event, isPressed): void =>
        {
            if (isPressed)
            { updatePositionToMouse(event.data.global, true); }
            event.stopPropagation();
        };

        trackDrag.onDragMove = (event) =>
        {
            updatePositionToMouse(event.data.global, false);
        };

        trackDrag.onDragEnd = () =>
        {
            triggerValueChange();
        };
    }

    get value(): number
    {
        return Helpers.Round(Helpers.Lerp(this._minValue, this._maxValue, this._amt), this.decimals);
    }
    set value(val: number)
    {
        this._amt = (Math.max(this._minValue, Math.min(this._maxValue, val)) - this._minValue) / (this._maxValue - this._minValue);

        if (typeof this.onValueChange === 'function')
        {
            this.onValueChange(this.value);
        }
        if (typeof this.onValueChanging === 'function')
        {
            this.onValueChanging(this.value);
        }

        this.update();
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
            this.handle.container.buttonMode = !val;
            this.handle.container.interactive = !val;
            this.track.container.interactive = !val;
        }
    }
}
