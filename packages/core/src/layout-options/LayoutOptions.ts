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
 * @memberof PUXI
 * @class
 */
export class LayoutOptions
{
    public static FILL_PARENT = 0xfffffff1;
    public static WRAP_CONTENT = 0xfffffff2;
    public static MAX_DIMEN = 0xfffffff0;

    public static DEFAULT = new LayoutOptions();

    public width: number;
    public height: number;
    public cache: any;

    private _marginLeft: number;
    private _marginTop: number;
    private _marginRight: number;
    private _marginBottom: number;

    /**
     * @param {number}[width = LayoutOptions.WRAP_CONTENT]
     * @param {number}[height = LayoutOptions.WRAP_CONTENT]
     */
    constructor(width: number | string = LayoutOptions.WRAP_CONTENT, height: number | string = LayoutOptions.WRAP_CONTENT)
    {
        this.setWidth(width);
        this.setHeight(height);

        /**
         * Used by the layout manager to cache calculations.
         * @member {object}
         */
        this.cache = {};
    }

    /**
     * Utility method to store width that converts strings to their number format.
     *
     * @param {number | string} val
     * @example
     * ```
     * lopt.setWidth('68.7%');// 68.7% of parent's width
     * lopt.setWidth('96px');// 96px
     * lopt.setWidth(34);// 34px
     * lopt.setWidth(.45);// 45% of parent's width
     * ```
     */
    setWidth(val: number | string): void
    {
        /**
         * Preferred height of the widget in pixels. If its value is between -1 and 1, it
         * is interpreted as a percentage of the parent's height.
         * @member {number}
         * @default {PUXI.LayoutOptions.WRAP_CONTENT}
         */
        this.width = LayoutOptions.parseDimen(val);
    }

    /**
     * Utility method to store height that converts strings to their number format.
     *
     * @param {number | string} val
     * @example
     * ```
     * lopt.setHeight('68.7%');// 68.7% of parent's height
     * lopt.setHeight('96px');// 96px
     * lopt.setHeight(34);// 34px
     * lopt.setHeight(.45);// 45% of parent's height
     * ```
     */
    setHeight(val: number | string): void
    {
        /**
         * Preferred width of the widget in pixels. If its value is between -1 and 1, it
         * is interpreted as a percentage of the parent's width.
         * @member {number}
         * @default {PUXI.LayoutOptions.WRAP_CONTENT}
         */
        this.height = LayoutOptions.parseDimen(val);
    }

    /**
     * @member {boolean} - whether the specified width is a constant
     *      (not a percentage, `WRAP_CONTENT`, or `FILL_PARENT`)
     */
    get isWidthPredefined(): boolean
    {
        return this.width > 1 && this.width <= LayoutOptions.MAX_DIMEN;
    }

    /**
     * @member {boolean} - whether the specified height is a constant
     *      (not a percentage, `WRAP_CONTENT`, or `FILL_PARENT`)
     */
    get isHeightPredefined(): boolean
    {
        return this.height > 1 && this.height <= LayoutOptions.MAX_DIMEN;
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

    /**
     * @param left
     * @param top
     * @param right
     * @param bottom
     */
    setMargin(left: number, top: number, right: number, bottom: number): void
    {
        this._marginLeft = left;
        this._marginTop = top;
        this._marginRight = right;
        this._marginBottom = bottom;
    }

    static parseDimen(val: number | string): number
    {
        if (typeof val === 'string')
        {
            if (val.endsWith('%'))
            {
                val = parseFloat(val.replace('%', '')) / 100;
            }
            else if (val.endsWith('px'))
            {
                val = parseFloat(val.replace('px', ''));
            }

            if (typeof val === 'string' || isNaN(val))
            {
                throw new Error('Width could not be parsed!');
            }
        }

        return val;
    }
}
