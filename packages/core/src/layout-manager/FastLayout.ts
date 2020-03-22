import { MeasureMode } from '../IMeasurable';
import { ILayoutManager } from './ILayoutManager';
import { LayoutOptions, FastLayoutOptions } from '../layout-options';
import { WidgetGroup } from '../WidgetGroup';

/**
 * `PUXI.FastLayout` is used in conjunction with `PUXI.FastLayoutOptions`. It is the
 * default layout for most widget groups.
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.ILayoutManager
 * @example
 * ```
 * parent.useLayout(new PUXI.FastLayout())
 * ```
 */
export class FastLayout implements ILayoutManager
{
    private host: WidgetGroup;
    private _measuredWidth: number;
    private _measuredHeight: number;

    onAttach(host: WidgetGroup): void
    {
        this.host = host;
    }

    onDetach(): void
    {
        this.host = null;
    }

    onLayout(): void
    {
        const parent = this.host;
        const { contentWidth: width, contentHeight: height, widgetChildren: children } = parent;

        for (let i = 0, j = children.length; i < j; i++)
        {
            const widget = children[i];
            const lopt = (widget.layoutOptions || LayoutOptions.DEFAULT) as FastLayoutOptions;

            let x = lopt.x ? lopt.x : 0;
            let y = lopt.y ? lopt.y : 0;

            if (Math.abs(x) < 1)
            {
                x *= width;
            }
            if (Math.abs(y) < 1)
            {
                y *= height;
            }

            const anchor = lopt.anchor || FastLayoutOptions.DEFAULT_ANCHOR;

            const l = x - (anchor.x * widget.getMeasuredWidth());
            const t = y - (anchor.y * widget.getMeasuredHeight());

            widget.layout(l, t,
                l + widget.getMeasuredWidth(),
                t + widget.getMeasuredHeight());
        }
    }

    onMeasure(maxWidth: number, maxHeight: number, widthMode: MeasureMode, heightMode: MeasureMode): void
    {
        // TODO: Passthrough optimization pass, if there is only one child with FILL_PARENT width or height
        // then don't measure twice.

        this._measuredWidth = maxWidth;
        this._measuredHeight = maxHeight;

        const children = this.host.widgetChildren;

        // Measure children
        for (let i = 0, j = children.length; i < j; i++)
        {
            const widget = children[i];
            const lopt = (widget.layoutOptions || LayoutOptions.DEFAULT) as FastLayoutOptions;

            const loptWidth = (Math.abs(lopt.width) < 1) ? lopt.width * maxWidth : lopt.width;
            const loptHeight = (Math.abs(lopt.height) < 1) ? lopt.height * maxHeight : lopt.height;
            const widthMeasureMode = this.getChildMeasureMode(lopt.width, widthMode);
            const heightMeasureMode = this.getChildMeasureMode(lopt.height, heightMode);

            widget.measure(loptWidth, loptHeight, widthMeasureMode, heightMeasureMode);
        }

        this._measuredWidth = this.measureWidthReach(maxWidth, widthMode);
        this._measuredHeight = this.measureHeightReach(maxHeight, heightMode);

        this.measureChildFillers();
    }

    private getChildMeasureMode(dimen: number, parentMeasureMode: MeasureMode): MeasureMode
    {
        if (dimen === LayoutOptions.WRAP_CONTENT)
        {
            // No MeasureMode.EXACTLY!
            return parentMeasureMode === MeasureMode.UNBOUNDED ? MeasureMode.UNBOUNDED : MeasureMode.AT_MOST;
        }

        return parentMeasureMode;
    }

    private measureWidthReach(parentWidthLimit: number, widthMode: MeasureMode): number
    {
        if (widthMode === MeasureMode.EXACTLY)
        {
            return parentWidthLimit;
        }

        const children = this.host.widgetChildren;
        let measuredWidth = 0;

        for (let i = 0, j = children.length; i < j; i++)
        {
            const widget = children[i];
            const childWidth = widget.getMeasuredWidth();
            const lopt = (widget.layoutOptions || LayoutOptions.DEFAULT) as FastLayoutOptions;
            const x = lopt.x ? lopt.x : 0;
            const anchor = lopt.anchor ? lopt.anchor : FastLayoutOptions.DEFAULT_ANCHOR;

            // If lopt.x is %, then (1 - lopt.x)% of parent width should be as large
            // as (1 - anchor.x)% child's width.
            const minr = (Math.abs(x) < 1 ? (1 - anchor.x) * childWidth / (1 - x) : x + childWidth);

            measuredWidth = Math.max(measuredWidth, minr);
        }

        if (widthMode === MeasureMode.AT_MOST)
        {
            measuredWidth = Math.min(parentWidthLimit, measuredWidth);
        }

        return measuredWidth;
    }

    private measureHeightReach(parentHeightLimit: number, heightMode: MeasureMode): number
    {
        if (heightMode === MeasureMode.EXACTLY)
        {
            return parentHeightLimit;
        }

        const children = this.host.widgetChildren;
        let measuredHeight = 0;

        for (let i = 0, j = children.length; i < j; i++)
        {
            const widget = children[i];
            const childHeight = widget.getMeasuredHeight();
            const lopt = (widget.layoutOptions || LayoutOptions.DEFAULT) as FastLayoutOptions;
            const y = lopt.y ? lopt.y : 0;
            const anchor = lopt.anchor ? lopt.anchor : FastLayoutOptions.DEFAULT_ANCHOR;

            const minb = (Math.abs(y) < 1 ? (1 - anchor.y) * childHeight / (1 - y) : y + childHeight);

            measuredHeight = Math.max(measuredHeight, minb);
        }

        if (heightMode === MeasureMode.AT_MOST)
        {
            measuredHeight = Math.min(parentHeightLimit, measuredHeight);
        }

        return measuredHeight;
    }

    private measureChildFillers(): void
    {
        const children = this.host.widgetChildren;

        for (let i = 0, j = children.length; i < j; i++)
        {
            const widget = children[i];
            const lopt = (widget.layoutOptions || LayoutOptions.DEFAULT) as FastLayoutOptions;
            let loptWidth = (Math.abs(lopt.width) < 1) ? lopt.width * this._measuredWidth : lopt.width;
            let loptHeight = (Math.abs(lopt.height) < 1) ? lopt.height * this._measuredHeight : lopt.height;

            if (loptWidth === LayoutOptions.WRAP_CONTENT)
            {
                loptWidth = widget.getMeasuredWidth();
            }
            if (loptHeight === LayoutOptions.WRAP_CONTENT)
            {
                loptHeight = widget.getMeasuredHeight();
            }

            if (lopt.width === LayoutOptions.FILL_PARENT || lopt.height === LayoutOptions.FILL_PARENT)
            {
                widget.measure(
                    lopt.width === LayoutOptions.FILL_PARENT ? this._measuredWidth : loptWidth,
                    lopt.height === LayoutOptions.FILL_PARENT ? this._measuredHeight : loptHeight,
                    MeasureMode.EXACTLY,
                    MeasureMode.EXACTLY,
                );
            }
        }
    }

    getMeasuredWidth(): number
    {
        return this._measuredWidth;
    }

    getMeasuredHeight(): number
    {
        return this._measuredHeight;
    }
}
