import { ClickEvent } from './Interaction/ClickEvent';
import { FocusableWidget, IInputBaseOptions } from './FocusableWidget';
import { Text } from './Text';
import * as PIXI from 'pixi.js';
import { LayoutOptions, FastLayoutOptions } from './layout-options';

interface IButtonOptions extends IInputBaseOptions
{
    background?: PIXI.Container;
    text?: Text | string;
    tabIndex?: number;
    tabGroup?: any;
    width?: number;
    height?: number;
}

/**
 * An UI button object
 *
 * @class
 * @extends PUXI.InputBase
 * @memberof PUXI
 * @param [options.background}] {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as background for Button
 * @param [options.text=null] {PIXI.UI.Text} optional text
 * @param [options.tabIndex=0] {Number} input tab index
 * @param [options.tabGroup=0] {Number|String} input tab group
 * @param [options.width=options.background.width] {Number|String} width
 * @param [options.height=options.background.height] {Number|String} height
 */
export class Button extends FocusableWidget
{
    isHover: boolean;

    protected textWidget: Text;

    click: () => void;
    initialize: () => void;

    constructor(options: IButtonOptions)
    {
        super(options);

        this.isHover = false;

        if (typeof options.text === 'string')
        {
            options.text = new Text(options.text, new PIXI.TextStyle());
        }

        this.textWidget = options.text.setLayoutOptions(
            new FastLayoutOptions(
                LayoutOptions.WRAP_CONTENT,
                LayoutOptions.WRAP_CONTENT,
                0.5, 0.5,
                FastLayoutOptions.CENTER_ANCHOR,
            ),
        ) as Text;

        if (this.textWidget)
        {
            this.addChild(this.textWidget);
        }

        this.contentContainer.buttonMode = true;
    }

    private setupClick(): void
    {
        const clickEvent = new ClickEvent(this);

        clickEvent.onHover = (e, over): void =>
        {
            this.isHover = over;
            this.emit('hover', over);
        };

        clickEvent.onPress = (e, isPressed: boolean): void =>
        {
            if (isPressed)
            {
                this.focus();
                e.data.originalEvent.preventDefault();
            }

            this.emit('press', isPressed);
        };

        clickEvent.onClick = (e): void =>
        {
            this.click();
        };

        this.click = (): void =>
        {
            this.emit('click');
        };

        this.focus = (): void =>
        {
            if (!this._focused)
            {
                FocusableWidget.prototype.focus.call(this);
                // document.addEventListener("keydown", keyDownEvent, false);
            }
        };

        this.blur = (): void =>
        {
            if (this._focused)
            {
                FocusableWidget.prototype.blur.call(this);
                // document.removeEventListener("keydown", keyDownEvent);
            }
        };

        this.initialize = (): void =>
        {
            super.initialize();
            this.contentContainer.interactiveChildren = false;
            // lazy to make sure all children is initialized (trying to get the bedst hitArea possible)

            setTimeout(() =>
            {
                const bounds = this.contentContainer.getLocalBounds();

                this.contentContainer.hitArea = new PIXI.Rectangle(
                    bounds.x < 0 ? bounds.x : 0,
                    bounds.y < 0 ? bounds.y : 0,
                    Math.max(bounds.x + bounds.width + (bounds.x < 0 ? -bounds.x : 0), this._width),
                    Math.max(bounds.y + bounds.height + (bounds.y < 0 ? -bounds.y : 0), this._height),
                );
            }, 20);
        };
    }

    update(): void
    {
        // No update needed
    }

    get value(): string
    {
        if (this.textWidget)
        {
            return this.textWidget.text;
        }

        return '';
    }
    set value(val: string)
    {
        if (this.textWidget)
        {
            this.textWidget.text = val;
        }
    }

    get text(): any
    {
        return this.textWidget;
    }
    set text(val: any)
    {
        this.value = val;
    }
}

/*
 * Features:
 * Button, radio button (checkgroups)
 *
 * Methods:
 * blur()
 * focus()
 *
 * Properties:
 * checked: get/set Button checked
 * value: get/set Button value
 *
 * Events:
 * "hover"          param: [bool]isHover (hover/leave)
 * "press"          param: [bool]isPressed (pointerdown/pointerup)
 * "click"
 * "blur"
 * "focus"
 * "focusChanged"   param: [bool]isFocussed
 *
 */
