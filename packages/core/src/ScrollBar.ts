import { Slider, ISliderOptions } from './Slider';
import { Tween } from './Tween';
import { Sprite } from './Sprite';
import { ScrollWidget } from './ScrollWidget';

interface IScrollBarOptions extends ISliderOptions
{
    track?: Sprite;
    handle?: Sprite;
    scrollingContainer: ScrollWidget;
    orientation: number;
    autohide?: boolean;
}

/**
 * @memberof PUXI
 * @interface IScrollBarOptions
 * @property {PUXI.Sprite} track
 * @property {PUXI.Sprite} handle
 */

/**
 * An UI scrollbar to control a ScrollingContainer
 *
 * @class
 * @extends PUXI.Slider
 * @memberof PUXI
 * @param options {Object} ScrollBar settings
 * @param options.track {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)}  Any type of UIOBject, will be used for the scrollbar track
 * @param options.handle {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as scrollbar handle
 * @param options.scrollingContainer {PIXI.UI.ScrollingContainer} The container to control
 * @param [options.vertical=false] {boolean} Direction of the scrollbar
 * @param [options.autohide=false] {boolean} Hides the scrollbar when not needed
 */
export class ScrollBar extends Slider
{
    scrollingContainer: ScrollWidget;
    autohide: boolean;
    _hidden: boolean;

    constructor(options: IScrollBarOptions)
    {
        super({
            track: options.track,
            handle: options.handle,
            fill: null,
            orientation: options.orientation,
        });

        this.scrollingContainer = options.scrollingContainer;
        this.autohide = options.autohide;
        this._hidden = false;
    }

    initialize(): void
    {
        super.initialize();
        this.decimals = 3; // up decimals to trigger ValueChanging more often

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.onValueChanging = (val): void =>
        {
            const sizeAmt = this.scrollingContainer.height / this.scrollingContainer.innerContainer.height || 0.001;

            if (sizeAmt < 1)
            {
                this.scrollingContainer.forcePctPosition(this.vertical ? 'y' : 'x', this._amt);
            }
        };
    }

    alignToContainer(): void
    {
        let newPos;
        let size;
        const xY = this.vertical ? 'y' : 'x';
        const widthHeight = this.vertical ? 'height' : 'width';
        const topLeft = this.vertical ? 'top' : 'left';
        const _posAmt = !this.scrollingContainer.innerContainer[widthHeight]
            ? 0
            : -(this.scrollingContainer.innerContainer[xY] / this.scrollingContainer.innerContainer[widthHeight]);
        const sizeAmt = !this.scrollingContainer.innerContainer[widthHeight]
            ? 1
            : this.scrollingContainer[`_${widthHeight}`] / this.scrollingContainer.innerContainer[widthHeight];

        // update amt
        const diff = this.scrollingContainer.innerContainer[widthHeight] - this.scrollingContainer[`_${widthHeight}`];

        this._amt = !this.scrollingContainer[`_${widthHeight}`] || !diff
            ? 0
            : -(this.scrollingContainer.innerContainer[xY] / diff);

        if (sizeAmt >= 1)
        {
            size = this[`_${widthHeight}`];
            this.handle[topLeft] = size * 0.5;
            this.toggleHidden(true);
        }
        else
        {
            size = this[`_${widthHeight}`] * sizeAmt;
            if (this._amt > 1)
            {
                size -= (this[`_${widthHeight}`] - size) * (this._amt - 1);
            }
            else if (this._amt < 0)
            {
                size -= (this[`_${widthHeight}`] - size) * -this._amt;
            }

            if (this._amt < 0)
            {
                newPos = size * 0.5;
            }
            else if (this._amt > 1)
            {
                newPos = this[`_${widthHeight}`] - (size * 0.5);
            }
            else
            {
                newPos = (_posAmt * this.scrollingContainer[`_${widthHeight}`]) + (size * 0.5);
            }

            this.handle[topLeft] = newPos;
            this.toggleHidden(false);
        }
        this.handle[widthHeight] = size;
    }

    toggleHidden(hidden: boolean): void
    {
        if (this.autohide)
        {
            if (hidden && !this._hidden)
            {
                Tween.to(this, 0.2, { alpha: 0 });
                this._hidden = true;
            }
            else if (!hidden && this._hidden)
            {
                Tween.to(this, 0.2, { alpha: 1 });
                this._hidden = false;
            }
        }
    }
}

