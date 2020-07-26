import { Widget, TEXT_STYLE_PROPERTIES } from './Widget';
import * as PIXI from 'pixi.js';
import { Style } from './Style';

/**
 * A static text widget. It cannot retain children.
 *
 * @memberof PUXI
 * @public
 */
export class TextWidget extends Widget
{
    private textDisplay: PIXI.Text;

    /**
     * @param {string} text - text content
     * @param {PIXI.TextStyle} textStyle - styled used for text
     */
    constructor(text: string, textStyle?: PIXI.TextStyle)
    {
        super();

        this.textDisplay = new PIXI.Text(text, textStyle);
        this.contentContainer.addChild(this.textDisplay);
    }

    update(): void
    {
        super.update();

        if (this.tint !== null)
        {
            this.textDisplay.tint = this.tint;
        }

        if (this.blendMode !== null)
        {
            this.textDisplay.blendMode = this.blendMode;
        }
    }

    /**
     * @deprecated
     */
    get value(): string
    {
        return this.textDisplay.text;
    }
    set value(val: string)
    {
        this.textDisplay.text = val;
    }

    get text(): string
    {
        return this.value;
    }
    set text(val: string)
    {
        this.value = val;
    }

    /**
     * Get the text style. You can set properties directly on the style.
     */
    getTextStyle(): PIXI.TextStyle
    {
        return this.textDisplay.style;
    }

    /**
     * Set the text style directly
     *
     * @param textStyle
     * @example
     * textWidget.setTextStyle({
     *     fontFamily: 'Roboto',
     *     fontSize: 14
     * })
     */
    setTextStyle(textStyle: PIXI.TextStyle): this
    {
        this.textDisplay.style = textStyle;

        return this;
    }

    protected onStyleChange(style: Style): void
    {
        super.onStyleChange(style);

        const styleData = style.getProperties(...TEXT_STYLE_PROPERTIES);
        const textStyle = this.textDisplay.style;

        TEXT_STYLE_PROPERTIES.forEach((propName: string) =>
        {
            if (styleData[propName] !== undefined)
            {
                textStyle[propName] = styleData[propName];
            }
        });
    }
}
