import { UIBase } from './UIBase';
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
export class Container extends UIBase
{
    constructor(width: number, height: number)
    {
        super(width, height);
        this.container.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
    }

    update()
    {
        // if (this.container.interactive) {
        this.container.hitArea.width = this._width;
        this.container.hitArea.height = this._height;
        // }
    }
}

