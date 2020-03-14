import { Widget } from './Widget';
import * as PIXI from 'pixi.js';

/**
 * An UI Container object
 *
 * @class
 * @extends PIXI.UI.UIBase
 * @memberof PIXI.UI
 * @param width {Number} Width of the Container
 * @param height {Number} Height of the Container
 */
export class Container extends Widget
{
    constructor(width: number, height: number)
    {
        super(width, height);
        this.contentContainer.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
    }

    update()
    {
        // if (this.container.interactive) {
        this.contentContainer.hitArea.width = this._width;
        this.contentContainer.hitArea.height = this._height;
        // }
    }
}

