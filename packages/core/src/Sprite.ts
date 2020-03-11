import { Widget } from './Widget';
import * as PIXI from 'pixi.js';

/**
 * An UI sprite object
 *
 * @class
 * @extends PIXI.UI.UIBase
 * @memberof PIXI.UI
 * @param Texture {PIXI.Texture} The texture for the sprite
 */
export class Sprite extends Widget
{
    sprite: PIXI.Sprite;

    constructor(texture: PIXI.Texture)
    {
        const sprite = new PIXI.Sprite(texture);

        super(sprite.width, sprite.height);

        this.sprite = sprite;
        this.container.addChild(this.sprite);
    }

    update(): void
    {
        if (this.tint !== null)
        {
            this.sprite.tint = this.tint;
        }

        if (this.blendMode !== null)
        {
            this.sprite.blendMode = this.blendMode;
        }

        this.sprite.width = this._width;
        this.sprite.height = this._height;
    }

    static fromImage(imageUrl): Sprite
    {
        return new Sprite(new PIXI.Texture(new PIXI.BaseTexture(imageUrl)));
    }
}

