import { LayoutOptions } from './LayoutOptions';
import { ALIGN } from './Align';

export interface IBorderLayoutParams
{
    width?: number;
    height?: number;
    region?: number;
    horizontalAlign?: ALIGN;
    verticalAlign?: ALIGN;
}

/**
 * @memberof PUXI
 * @interface IBorderLayoutParams
 * @property {number} width
 * @property {number} height
 * @property {number} region
 * @property {number} horizontalAlign
 * @property {number} verticalAlign
 */

/**
 * `PUXI.BorderLayoutOptions` defines a simple layout with five regions - the center and
 * four regions along each border. The top and bottom regions span the full width of
 * the parent widget-group. The left and right regions span the height of the layout
 * minus the top and bottom region heights.
 *
 * ```
 * ------------------------------------------------
 * |                 TOP REGION                   |
 * ------------------------------------------------
 * |        |                            |        |
 * |  LEFT  |          CENTER            | RIGHT  |
 * | REGION |          REGION            | REGION |
 * |        |                            |        |
 * ------------------------------------------------
 * |                BOTTOM REGION                 |
 * ------------------------------------------------
 * ```
 *
 * The height of the layout is measured as the sum of the heights of the top, center, and bottom
 * regions. Similarly, the width of the layout is measured as the width of the left, center, and
 * right regions.
 *
 * As of now, border layout doesn't support percent widths and heights.
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.LayoutOptions
 */
export class BorderLayoutOptions extends LayoutOptions
{
    /**
     * Positions a widget inside the left border of the layout.
     * @static
     * @member {number}
     */
    static REGION_LEFT = 0xeff1;

    /**
     * Positions a widget below the top border of the layout.
     * @static
     * @member {number}
     */
    static REGION_TOP = 0xeff2;

    /**
     * Positions a widget below the right border of the layout.
     * @static
     * @member {number}
     */
    static REGION_RIGHT = 0xeff3;

    /**
     * Positions a widget below the top border of the layout.
     * @static
     * @member {number}
     */
    static REGION_BOTTOM = 0xeff4;

    /**
     * Positions a widget in the center of the layout. The main content of the layout
     * should be in the center.
     * @static
     * @member {number}
     */
    static REGION_CENTER = 0xeff5;

    region: number;
    horizontalAlign: number;
    verticalAlign: number;

    constructor(options: IBorderLayoutParams)
    {
        super(options.width, options.height);

        /**
         * The border along which the widget is to be placed. This can be one of `POS_LEFT`,
         * `POS_TOP`, `POS_RIGHT`, `POS_BOTTOM`.
         * @member {number}
         * @default {PUXI.BorderLayoutOptions#REGION_CENTER}
         */
        this.region = options.region || BorderLayoutOptions.REGION_CENTER;

        /**
         * Alignment of the widget horizontally in its region.
         * @member {PUXI.ALIGN}
         * @default {PUXI.ALIGN.LEFT}
         */
        this.horizontalAlign = options.horizontalAlign || ALIGN.LEFT;

        /**
         * Alignment of the widget vertically in its region.
         * @member {PUXI.ALIGN}
         * @default {PUXI.ALIGN.TOP}
         */
        this.verticalAlign = options.verticalAlign || ALIGN.TOP;
    }
}
