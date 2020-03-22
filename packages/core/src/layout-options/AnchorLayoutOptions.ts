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
    width: number | string;
    height: number | string;
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
 * @property {number | string} width - requested width of widget (default is `WRAP_CONTENT`)
 * @property {number | string} height - requested height of widget (default is `WRAP_CONTENT`)
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
 * ### Intra-anchor region alignment
 *
 * You can specify how the widget should be aligned in the intra-anchor region using the
 * `horizontalAlign` and `verticalAlign` properties.
 *
 * ### Support for FILL_PARENT and percentage-of-parent dimensions
 *
 * Anchor layout does not support a width/height that is `LayoutOptions.FILL_PARENT`
 * or a percentage of the parent's width/height. Instead, you can define anchors that
 * result in the equivalent behaviour.
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
        super(options.width, options.height);

        this.anchorLeft = options.anchorLeft || 0;
        this.anchorTop = options.anchorTop || 0;
        this.anchorBottom = options.anchorBottom || 0;
        this.anchorRight = options.anchorRight || 0;

        this.horizontalAlign = options.horizontalAlign || ALIGN.LEFT;
        this.verticalAlign = options.verticalAlign || ALIGN.CENTER;
    }
}
