import * as PIXI from 'pixi.js';
import { Widget } from './Widget';

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
export class TilingSprite extends Widget
{
    protected sprite: PIXI.extras.TilingSprite;

    constructor(t, width: number, height: number)
    {
        const sprite = new PIXI.extras.TilingSprite(t);

        super(width || sprite.width, height || sprite.height);

        this.sprite = sprite;
        this.contentContainer.addChild(this.sprite);
    }

    /**
     * Updates the text
     *
     * @private
     */
    update(): void
    {
        if (this.tint !== null)
        { this.sprite.tint = this.tint; }

        if (this.blendMode !== null)
        { this.sprite.blendMode = this.blendMode; }

        this.sprite.width = this._width;
        this.sprite.height = this._height;
    }

    get tilePosition(): any
    {
        return this.sprite.tilePosition;
    }
    set tilingPosition(val: any)
    {
        this.sprite.tilePosition = val;
    }

    get tileScale(): number
    {
        return this.sprite.tileScale;
    }
    set tileScale(val: number)
    {
        this.sprite.tileScale = val;
    }
}
