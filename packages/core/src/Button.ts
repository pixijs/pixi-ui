import { ClickEvent } from './Interaction/ClickEvent.js';
import { InputBase } from './InputBase';
import { Sprite } from './Sprite';
import * as PIXI from 'pixi.js';

interface IButtonOptions
{
    background?: Sprite;
    text?: string;
    tabIndex?: number;
    tabGroup?: any;
    width?: number;
    height?: number;
}

/**
 * An UI button object
 *
 * @class
 * @extends PIXI.UI.InputBase
 * @memberof PIXI.UI
 * @param [options.background}] {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as background for Button
 * @param [options.text=null] {PIXI.UI.Text} optional text
 * @param [options.tabIndex=0] {Number} input tab index
 * @param [options.tabGroup=0] {Number|String} input tab group
 * @param [options.width=options.background.width] {Number|String} width
 * @param [options.height=options.background.height] {Number|String} height
 */
export class Button extends InputBase
{
    background: Sprite;
    isHover: boolean;
    uiText: any;

    click: () => void;
    initialize: () => void;

    constructor(options: IButtonOptions)
    {
        super(
            options.width || (options.background ? options.background.width : 100),
            options.height || (options.background ? options.background.height : 100),
            options.tabIndex || 0,
            options.tabGroup || 0,
        );

        this.background = options.background;

        if (this.background)
        {
            this.background.width = '100%';
            this.background.height = '100%';
            this.background.pivot = 0.5;
            this.background.verticalAlign = 'middle';
            this.background.horizontalAlign = 'center';
            this.addChild(this.background);
        }

        this.isHover = false;
        this.uiText = options.text;

        if (this.uiText)
        {
            this.uiText.verticalAlign = 'middle';
            this.uiText.horizontalAlign = 'center';
            this.addChild(this.uiText);
        }

        this.container.buttonMode = true;
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
                InputBase.prototype.focus.call(this);
                // document.addEventListener("keydown", keyDownEvent, false);
            }
        };

        this.blur = (): void =>
        {
            if (this._focused)
            {
                InputBase.prototype.blur.call(this);
                // document.removeEventListener("keydown", keyDownEvent);
            }
        };

        this.initialize = (): void =>
        {
            super.initialize();
            this.container.interactiveChildren = false;
            // lazy to make sure all children is initialized (trying to get the bedst hitArea possible)

            setTimeout(() =>
            {
                const bounds = this.container.getLocalBounds();

                this.container.hitArea = new PIXI.Rectangle(
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
        if (this.uiText)
        {
            return this.uiText.text;
        }

        return '';
    }
    set value(val: string)
    {
        if (this.uiText)
        {
            this.uiText.text = val;
        }
    }

    get text(): any
    {
        return this.uiText;
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
