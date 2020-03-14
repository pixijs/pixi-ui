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
    private spriteDisplay: PIXI.Sprite;

    constructor(texture: PIXI.Texture)
    {
        super();

        this.spriteDisplay = new PIXI.Sprite(texture);
        this.contentContainer.addChild(this.spriteDisplay);
    }

    update(): void
    {
        if (this.tint !== null)
        {
            this.spriteDisplay.tint = this.tint;
        }

        if (this.blendMode !== null)
        {
            this.spriteDisplay.blendMode = this.blendMode;
        }
    }

    static fromImage(imageUrl): Sprite
    {
        return new Sprite(new PIXI.Texture(new PIXI.BaseTexture(imageUrl)));
    }
}

