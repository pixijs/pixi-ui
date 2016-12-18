var UIBase = require('./UIBase');

/**
 * An UI sprite object
 *
 * @class
 * @extends PIXI.UI.UIBase
 * @memberof PIXI.UI
 * @param Texture {PIXI.Texture} The texture for the sprite
 * @param [Width=Texture.width] {number} Width of tilingsprite
 * @param [Height=Texture.height] {number} Height of tiling sprite
 */
function TilingSprite(t, width, height) {
    this.sprite = new PIXI.extras.TilingSprite(t);
    UIBase.call(this, width || this.sprite.width, height || this.sprite.height);
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

Object.defineProperties(TilingSprite.prototype, {
    tilePosition: {
        get: function () {
            return this.sprite.tilePosition;
        },
        set: function (val) {
            this.sprite.tilePosition = val;
        }
    },
    tileScale: {
        get: function () {
            return this.sprite.tileScale;
        },
        set: function (val) {
            this.sprite.tileScale = val;
        }
    }
});