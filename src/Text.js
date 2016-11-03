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
    this.text = new PIXI.Text(text, PIXITextStyle);
    UIBase.call(this, this.text.width, this.text.height);
    this.container.addChild(this.text);
}

Text.prototype = Object.create(UIBase.prototype);
Text.prototype.constructor = Text;
module.exports = Text;

/**
 * Updates the text
 *
 * @private
 */
Text.prototype.update = function () {
    if (this.tint !== null)
        text.tint = this.tint;
};

