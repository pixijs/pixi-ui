import { Widget } from './Widget';
import * as PIXI from 'pixi.js';

/**
 * An UI sprite object
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.Widget
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

export type ImageWidget = Sprite;
export const ImageWidget = Sprite;
