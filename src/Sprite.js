var UIBase = require('./UIBase');

/**
 * An UI sprite object
 *
 * @class
 * @extends PIXI.UI.UIBase
 * @memberof PIXI.UI
 * @param Texture {PIXI.Texture} The texture for the sprite
 */
function Sprite(t) {
    this.sprite = new PIXI.Sprite(t);
    UIBase.call(this, this.sprite.width, this.sprite.height);
    this.container.addChild(this.sprite);
}

Sprite.prototype = Object.create(UIBase.prototype);
Sprite.prototype.constructor = Sprite;
module.exports = Sprite;

/**
 * Updates the text
 *
 * @private
 */
Sprite.prototype.update = function () {
    if (this.tint !== null)
        this.sprite.tint = this.tint;

    if (this.blendMode !== null)
        this.sprite.blendMode = this.blendMode;

    this.sprite.width = this.width;
    this.sprite.height = this.height;
};

