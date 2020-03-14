import { LayoutOptions } from './LayoutOptions';
import * as PIXI from 'pixi.js';

/**
 * `PUXI.FastLayoutOptions` is an extension to `PUXI.LayoutOptions` that also
 * defines the x & y coordinates. It is accepted by the stage and `PUXI.FastLayout`.
 *
 * If x or y is between -1 and 1, then that dimension will be interpreted as a
 * percentage of the parent's width or height.
 *
 * @namespace PUXI
 * @extends PUXI.LayoutOptions
 * @class
 */
export class FastLayoutOptions extends LayoutOptions
{
    static DEFAULT_ANCHOR = new PIXI.Point(0, 0);
    static CENTER_ANCHOR = new PIXI.Point(0.5, 0.5);// fragile, shouldn't be modified

    x: number;
    y: number;
    anchor: PIXI.Point;

    constructor(width: number, height: number, x = 0, y = 0, anchor?: PIXI.Point)
    {
        super(width, height);

        /**
         * X-coordinate of the widget in its parent's reference frame. If it is
         * absolutely less than 1, then it will be interpreted as a percent of
         * the parent's width.
         * @member {number}
         */
        this.x = x;

        /**
         * Y-coordinate of the widget in its parent's reference frame. If it is
         * absolutely less than 1, then it will be interpreted as a percent of
         * the parent's height.
         * @member {number}
         */
        this.y = y;

        /**
         * The anchor is a normalized point telling where the (x,y) position of the
         * widget lies inside of it. By default, it is (0, 0), which means that the
         * top-left corner of the widget will be at (x,y); however, setting it to
         * (.5,.5) will make the _center of the widget_ be at (x,y) in the parent's
         * reference frame.
         * @member {PIXI.Point}
         * @default PUXI.FastLayoutOptions.DEFAULT_ANCHOR
         */
        this.anchor = anchor || FastLayoutOptions.DEFAULT_ANCHOR.clone();
    }
}
