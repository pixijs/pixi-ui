var UIBase = require('./UIBase');

/**
 * An UI text object
 *
 * @class
 * @extends PIXI.UI.UIBase
 * @memberof PIXI.UI
 * @param Text {String} Text content
 * @param TextStyle {PIXI.TextStyle} Style used for the Text
 */
function Text(text, PIXITextStyle) {
    this._text = new PIXI.Text(text, PIXITextStyle);
    UIBase.call(this, this._text.width, this._text.height);
    this.container.addChild(this._text);

    this.baseupdate = function () {
        //force original text width unless using anchors
        if (this._anchorLeft === null || this._anchorRight === null) {
            this.setting.width = this._text.width;
            this.setting.widthPct = null;
        }
        else {
            this._text.width = this._width;
        }

        //force original text height unless using anchors
        if (this._anchorTop === null || this._anchorBottom === null) {
            this.setting.height = this._text.height;
            this.setting.heightPct = null;
        }
        else {
            this._text.width = this._width;
        }


        UIBase.prototype.baseupdate.call(this);
    };

    this.update = function () {
        //set tint
        if (this.tint !== null)
            this._text.tint = this.tint;

        //set blendmode
        if (this.blendMode !== null)
            this._text.blendMode = this.blendMode;
    };
}

Text.prototype = Object.create(UIBase.prototype);
Text.prototype.constructor = Text;
module.exports = Text;


Object.defineProperties(Text.prototype, {
    value: {
        get: function () {
            return this._text.text;
        },
        set: function (val) {
            this._text.text = val;
            this.updatesettings(true);
        }
    },
    text: {
        get: function () {
            return this.value;
        },
        set: function (val) {
            this.value = val;
        }
    }
});