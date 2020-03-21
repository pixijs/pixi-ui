import { ALIGN } from './Align';
import { LayoutOptions } from './LayoutOptions';

interface IAnchorLayoutParams
{
    anchorLeft?: number;
    anchorTop?: number;
    anchorRight?: number;
    anchorBottom?: number;
    horizontalAlign?: ALIGN;
    verticalAlign?: ALIGN;
}

/**
 * @memberof PUXI
 * @interface IAnchorLayoutParams
 * @property {number} anchorLeft - distance from parent's left inset to child's left edge
 * @property {number} anchorTop - distance from parent's top inset to child's top edge
 * @property {number} anchorRight - distance from parent's right inset to child's right edge
 * @property {number} anchorBottom - distance from parent's bottom insets to child's bottom edge
 * @property {PUXI.ALIGN} horizontalAlign - horizontal alignment of child in anchor region
 * @property {PUXI.ALIGN} verticalAlign - vertical alignment of child in anchor region
 */

/**
 * Anchors the edge of a widget to defined offsets from the parent's insets.
 *
 * The following example will render a widget at (10px, 15%) with a width extending
 * to the parent's center and a height extending till 40px above the parent's bottom
 * inset.
 * ```js
 * new PUXI.AnchoredLayoutOptions({
 *      anchorLeft: 10,
 *      anchorTop: .15,
 *      anchorRight: .5,
 *      anchorBottom: 40
 * });
 * ```
 *
 * You can specify how the widget should be aligned in the anchor region using the
 * `horizontalAlign` and `verticalAlign` properties.
 *
 * The width & height of widgets must be `WRAP_CONTENT` or `FILL_PARENT`. Using the latter
 * would make the child fill the anchor region.
 *
 * @memberof PUXI
 * @extends PUXI.LayoutOptions
 * @class
 */
export class AnchorLayoutOptions extends LayoutOptions
{
    public anchorLeft: number;
    public anchorTop: number;
    public anchorRight: number;
    public anchorBottom: number;

    public horizontalAlign: ALIGN;
    public verticalAlign: ALIGN;

    constructor(options: IAnchorLayoutParams)
    {
        super(LayoutOptions.WRAP_CONTENT, LayoutOptions.WRAP_CONTENT);

        this.anchorLeft = options.anchorLeft || 0;
        this.anchorTop = options.anchorTop || 0;
        this.anchorBottom = options.anchorBottom || 0;
        this.anchorRight = options.anchorRight || 0;

        this.horizontalAlign = options.horizontalAlign || ALIGN.LEFT;
        this.verticalAlign = options.verticalAlign || ALIGN.CENTER;
    }
}
