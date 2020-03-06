import { UIBase } from './UIBase';

/**
 * An UI text object
 *
 * @class
 * @extends PIXI.UI.UIBase
 * @memberof PIXI.UI
 * @param Text {String} Text content
 * @param TextStyle {PIXI.TextStyle} Style used for the Text
 */
export class Text extends UIBase
{
    private _text: PIXI.Text;

    constructor(text: string, textStyle: PIXI.TextStyle)
    {
        const textDisplay = new PIXI.Text(text, textStyle);

        super(textDisplay.width, textDisplay.height);
        this._text = textDisplay;
        this.container.addChild(this._text);
    }

    baseupdate(): void
    {
        // force original text width unless using anchors
        if (this._anchorLeft === null || this._anchorRight === null)
        {
            this.setting.width = this._text.width;
            this.setting.widthPct = null;
        }
        else
        {
            this._text.width = this._width;
        }

        // force original text height unless using anchors
        if (this._anchorTop === null || this._anchorBottom === null)
        {
            this.setting.height = this._text.height;
            this.setting.heightPct = null;
        }
        else
        {
            this._text.width = this._width;
        }

        super.baseupdate();
    }

    update()
    {
        // set tint
        if (this.tint !== null)
        {
            this._text.tint = this.tint;
        }

        // set blendmode
        if (this.blendMode !== null)
        {
            this._text.blendMode = this.blendMode;
        }
    }

    get value(): string
    {
        return this._text.text;
    }
    set value(val: string)
    {
        this._text.text = val;
        this.updatesettings(true);
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
