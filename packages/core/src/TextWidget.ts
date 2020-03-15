import { Widget } from './Widget';
import * as PIXI from 'pixi.js';

/**
 * A static text widget. It cannot retain children.
 *
 * @class
 * @extends PUXI.Widget
 * @memberof PUXI
 */
export class TextWidget extends Widget
{
    private textDisplay: PIXI.Text;

    /**
     * @param {string} text - text content
     * @param {PIXI.TextStyle} textStyle - styled used for text
     */
    constructor(text: string, textStyle: PIXI.TextStyle)
    {
        super();

        this.textDisplay = new PIXI.Text(text, textStyle);
        this.contentContainer.addChild(this.textDisplay);
    }

    update(): void
    {
        if (this.tint !== null)
        {
            this.textDisplay.tint = this.tint;
        }

        if (this.blendMode !== null)
        {
            this.textDisplay.blendMode = this.blendMode;
        }
    }

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
}
