import { ClickManager } from './event/ClickManager';
import { FocusableWidget, IFocusableOptions } from './FocusableWidget';
import { TextWidget } from './TextWidget';
import * as PIXI from 'pixi.js';
import { LayoutOptions, FastLayoutOptions } from './layout-options';
import { Style } from './Style';

/**
 * @memberof PUXI
 * @interface
 * @extends PUXI.IFocusableOptions
 * @property {PUXI.TextWidget | string} text
 */
export interface IButtonOptions extends IFocusableOptions
{
    background?: PIXI.Container;
    text?: TextWidget | string;
    tabIndex?: number;
    tabGroup?: any;
}

/**
 * Button that can be clicked.
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.FocusableWidget
 */
export class Button extends FocusableWidget
{
    isHover: boolean;

    protected textWidget: TextWidget;

    click: () => void;
    /**
     * @param [options.background}] {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as background for Button
     * @param [options.text=null] {PIXI.UI.Text} optional text
     * @param [options.tabIndex=0] {Number} input tab index
     * @param [options.tabGroup=0] {Number|String} input tab group
     * @param [options.width=options.background.width] {Number|String} width
     * @param [options.height=options.background.height] {Number|String} height
     */
    constructor(options: IButtonOptions)
    {
        super(options);

        this.isHover = false;

        if (typeof options.text === 'string')
        {
            options.text = new TextWidget(options.text, new PIXI.TextStyle());
        }

        this.textWidget = options.text.setLayoutOptions(
            new FastLayoutOptions({
                width: LayoutOptions.WRAP_CONTENT,
                height: LayoutOptions.WRAP_CONTENT,
                x: 0.5,
                y: 0.5,
                anchor: FastLayoutOptions.CENTER_ANCHOR,
            }),
        ) as TextWidget;

        if (this.textWidget)
        {
            this.addChild(this.textWidget);
        }

        this.contentContainer.buttonMode = true;
    }

    onClick(e: PIXI.InteractionEvent): void
    {
        super.onClick(e);

        this.emit('click', e);
    }

    onDoubleClick(e: PIXI.InteractionEvent): void
    {
        super.onDoubleClick(e);

        this.emit('doubleclick', e);
    }

    update(): void
    {
        super.update();
        // No update needed
    }

    initialize(): void
    {
        super.initialize();

        this.insetContainer.interactiveChildren = false;
        // lazy to make sure all children is initialized (trying to get the bedst hitArea possible)
    }

    /**
     * Label for this button.
     * @member {string}
     */
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

    onStyleChange(style: Style): void
    {
        // eslint-disable-next-line
        // @ts-ignore
        this.textWidget.onStyleChange(style);
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
