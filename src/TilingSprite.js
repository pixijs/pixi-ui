var UIBase = require('./UIBase');

/**
 * An UI sprite object
 *
 * @class
 * @extends PIXI.UI.UIBase
 * @memberof PIXI.UI
 * @param Texture {PIXI.Texture} The texture for the sprite
 */
function TilingSprite(t) {
    this.sprite = new PIXI.extras.TilingSprite(t);
    UIBase.call(this, this.sprite.width, this.sprite.height);
    this.container.addChild(this.sprite);
}

TilingSprite.prototype = Object.create(UIBase.prototype);
TilingSprite.prototype.constructor = TilingSprite;
module.exports = TilingSprite;

/**
 * Updates the text
 *
 * @private
 */
TilingSprite.prototype.update = function () {
    if (this.tint !== null)
        this.sprite.tint = this.tint;

    if (this.blendMode !== null)
        this.sprite.blendMode = this.blendMode;

    this.sprite.width = this._width;
    this.sprite.height = this._height;
};

