import { Widget } from './Widget';
import { ILayoutManager } from './layout-manager/ILayoutManager';
import { MeasureMode } from './IMeasurable';

export abstract class WidgetGroup extends Widget
{
    public layoutMgr: ILayoutManager;

    useLayout(layoutMgr: ILayoutManager): void
    {
        if (this.layoutMgr)
        {
            this.layoutMgr.onDetach(this);
        }

        this.layoutMgr = layoutMgr;

        if (layoutMgr)
        {
            this.layoutMgr.onAttach(this);
        }
    }

    measure(width: number, height: number, widthMode: MeasureMode, heightMode: MeasureMode): void
    {
        super.measure(width, height, widthMode, heightMode);

        this.layoutMgr.onMeasure(width, height, widthMode, heightMode);

        this._measuredWidth = Math.max(this.measuredWidth, this.layoutMgr.getMeasuredWidth());
        this._measuredHeight = Math.max(this.measuredHeight, this.layoutMgr.getMeasuredHeight());
    }

    layout(l: number, t: number, r: number, b: number, dirty = true): void
    {
        super.layout(l, t, r, b, dirty);

        this.layoutMgr.onLayout(this);
    }
}
