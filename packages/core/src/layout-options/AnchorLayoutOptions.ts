import { ALIGN } from './Align';
import { LayoutOptions } from './LayoutOptions';

/**
 * Anchored layout-options specify the left, top, right, and bottom offsets of a
 * widget in pixels. If an offset is between -1px and 1px, then it is interpreted
 * as a percentage of the parent's dimensions.
 *
 * The following example will render a widget at 80% of the parent's width and
 * 60px height.
 * ```js
 * const widget: PUXI.Widget = new Widget();
 * const anchorPane: PUXI.Widget = new Widget();
 *
 * widget.layoutOptions = new PUXI.AnchoredLayoutOptions(
 *      .10,
 *      .90,
 *      20,
 *      80
 * );
 *
 * // Prevent child from requesting natural bounds.
 * widget.layoutOptions.width = 0;
 * widget.layoutOptions.height = 0;
 * ```
 *
 * ### Intra-anchor region constraints
 *
 * If the offsets given provide a region larger than the widget's dimensions, then
 * the widget will be aligned accordingly. However, if the width or height of the
 * child is set to 0, then that child will be scaled to fit in the entire region
 * in that dimension.
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

    constructor(
        anchorLeft: number,
        anchorTop: number,
        anchorRight: number,
        anchorBottom: number,
        horizontalAlign = ALIGN.NONE,
        verticalAlign = ALIGN.NONE)
    {
        super(LayoutOptions.WRAP_CONTENT, LayoutOptions.WRAP_CONTENT);

        this.anchorLeft = anchorLeft;
        this.anchorTop = anchorTop;
        this.anchorBottom = anchorBottom;
        this.anchorRight = anchorRight;

        this.horizontalAlign = horizontalAlign;
        this.verticalAlign = verticalAlign;
    }
}
