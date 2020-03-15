import { WidgetGroup } from './WidgetGroup';
import * as PIXI from 'pixi.js';

/**
 * An interactive container.
 *
 * @class
 * @extends PIXI.UI.UIBase
 * @memberof PIXI.UI
 */
export class InteractiveGroup extends WidgetGroup
{
    private hitArea: PIXI.Rectangle;

    constructor()
    {
        super();
        this.hitArea = new PIXI.Rectangle();
        this.insetContainer.hitArea = this.hitArea;
    }

    update(): void
    {
        // TODO:
    }

    layout(l: number, t: number, r: number, b: number, dirty: boolean): void
    {
        super.layout(l, t, r, b, dirty);

        this.hitArea.width = this.width;
        this.hitArea.height = this.height;
    }
}

