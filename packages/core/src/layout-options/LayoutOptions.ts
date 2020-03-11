/**
 * This are the base constraints that you can apply on a `PUXI.Widget` under any
 * layout manager. It specifies the dimensions of a widget, while the position
 * of the widget is left to the parent to decide. If a dimension (width or height)
 * is set to a value between -1 and 1, then it is interpreted as a percentage
 * of the parent's dimension.
 *
 * The following example will render a widget at 50% of the parent's width and 10px height:
 *
 * ```js
 * const widget = new PUXI.Widget();
 * const parent = new PUXI.Widget();
 *
 * widget.layoutOptions = new PUXI.LayoutOptions(
 *      .5,
 *      10
 * );
 * parent.addChild(widget);
 * ```
 *
 * @namespace PUXI
 * @class
 */
export class LayoutOptions
{
    public static FILL_PARENT = 0xfffffff1;
    public static WRAP_CONTENT = 0xfffffff2;

    public static DEFAULT = new LayoutOptions();

    public width: number;
    public height: number;
    public markers: any;

    private _marginLeft: number;
    private _marginTop: number;
    private _marginRight: number;
    private _marginBottom: number;

    /**
     * @param {number}[width = LayoutOptions.WRAP_CONTENT]
     * @param {number}[height = LayoutOptions.WRAP_CONTENT]
     */
    constructor(width = LayoutOptions.WRAP_CONTENT, height = LayoutOptions.WRAP_CONTENT)
    {
        /**
         * Preferred width of the widget in pixels. If its value is between -1 and 1, it
         * is interpreted as a percentage of the parent's width.
         * @member {number}
         * @default {PUXI.LayoutOptions.WRAP_CONTENT}
         */
        this.width = width;

        /**
         * Preferred height of the widget in pixels. If its value is between -1 and 1, it
         * is interpreted as a percentage of the parent's height.
         * @member {number}
         * @default {PUXI.LayoutOptions.WRAP_CONTENT}
         */
        this.height = height;

        this.markers = {};
    }

    /**
     * The left margin in pixels of the widget.
     * @member {number}
     * @default 0
     */
    get marginLeft(): number
    {
        return this._marginLeft || 0;
    }
    set marginLeft(val: number)
    {
        this._marginLeft = val;
    }

    /**
     * This top margin in pixels of the widget.
     * @member {number}
     * @default 0
     */
    get marginTop(): number
    {
        return this._marginTop || 0;
    }
    set marginTop(val: number)
    {
        this._marginTop = val;
    }

    /**
     * The right margin in pixels of the widget.
     * @member {number}
     * @default 0
     */
    get marginRight(): number
    {
        return this._marginRight || 0;
    }
    set marginRight(val: number)
    {
        this._marginRight = val;
    }

    /**
     * The bottom margin in pixels of the widget.
     * @member {number}
     * @default 0
     */
    get marginBottom(): number
    {
        return this._marginBottom || 0;
    }
    set marginBottom(val: number)
    {
        this._marginBottom = val;
    }

    setMargin(left: number, top: number, right: number, bottom: number): void
    {
        this._marginLeft = left;
        this._marginTop = top;
        this._marginRight = right;
        this._marginBottom = bottom;
    }
}
