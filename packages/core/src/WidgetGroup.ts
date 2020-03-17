import { Widget } from './Widget';
import { ILayoutManager } from './layout-manager/ILayoutManager';
import { MeasureMode } from './IMeasurable';
import { FastLayout } from './layout-manager/FastLayout';

/**
 * A widget group is a layout owner that can position its children according
 * to the layout given to it.
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.Widget
 * @example
 * ```
 * const group = new PUXI.InteractiveGroup();
 *
 * group.useLayout(new PUXI.AnchorLayout());
 *
 * group.addChild(new PUXI.Button({ text: "Hey" })
 *  .setLayoutOptions(
 *      new PUXI.AnchorLayoutOptions(
 *             100,
 *             300,
 *             .4,
 *             500,
 *             PUXI.ALIGN.CENTER
 *      )
 *  )
 * )
 * ```
 */
export abstract class WidgetGroup extends Widget
{
    public layoutMgr: ILayoutManager;// lazily initialized (via useLayout(), useDefaultLayout())

    /**
     * Will set the given layout-manager to be used for positioning child widgets.
     *
     * @param {PUXI.ILayoutManager} layoutMgr
     */
    useLayout(layoutMgr: ILayoutManager): void
    {
        if (this.layoutMgr)
        {
            this.layoutMgr.onDetach();
        }

        this.layoutMgr = layoutMgr;

        if (layoutMgr)
        {
            this.layoutMgr.onAttach(this);
        }
    }

    /**
     * Sets the widget-recommended layout manager. By default (if not overriden by widget
     * group class), this is a fast-layout.
     */
    useDefaultLayout(): void
    {
        this.useLayout(new FastLayout());
    }

    measure(width: number, height: number, widthMode: MeasureMode, heightMode: MeasureMode): void
    {
        super.measure(width, height, widthMode, heightMode);

        if (this.widgetChildren.length === 0)
        {
            return;
        }
        if (!this.layoutMgr)
        {
            this.useDefaultLayout();
        }

        this.layoutMgr.onMeasure(width, height, widthMode, heightMode);

        this._measuredWidth = Math.max(this.measuredWidth, this.layoutMgr.getMeasuredWidth());
        this._measuredHeight = Math.max(this.measuredHeight, this.layoutMgr.getMeasuredHeight());
    }

    layout(l: number, t: number, r: number, b: number, dirty = true): void
    {
        super.layout(l, t, r, b, dirty);

        if (this.widgetChildren.length === 0)
        {
            return;
        }
        if (!this.layoutMgr)
        {
            this.useDefaultLayout();
        }

        this.layoutMgr.onLayout();// layoutMgr is attached to this
    }
}
