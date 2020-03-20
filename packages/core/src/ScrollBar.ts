import { Slider, ISliderOptions } from './Slider';
import { Tween } from './Tween';
import { Sprite } from './Sprite';
import { ScrollWidget } from './ScrollWidget';
import * as PIXI from 'pixi.js';

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
            track: options.track || ScrollBar.DEFAULT_TRACK.clone(),
            handle: options.handle || ScrollBar.DEFAULT_HANDLE.clone(),
            fill: null,
            orientation: options.orientation,
            minValue: 0,
            maxValue: 1,
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
        this.on('changing', (): void =>
        {
            this.scrollingContainer.forcePctPosition(
                this.orientation === Slider.HORIZONTAL ? 'x' : 'y',
                this.percentValue);
        });

        this.on('change', (): void =>
        {
            this.scrollingContainer.setScrollPosition();
        });
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

    /**
     * @static
     */
    static DEFAULT_TRACK = new PIXI.Graphics()
        .beginFill(0xffffff)
        .drawRect(0, 0, 8, 8)
        .endFill();

    /**
     * @static
     */
    static DEFAULT_HANDLE: PIXI.Graphics = new PIXI.Graphics()
        .beginFill(0x000000)
        .drawCircle(8, 8, 4)
        .endFill()
        .beginFill(0x000000, 0.5)
        .drawCircle(8, 8, 8)
        .endFill();
}

