import { MeasureMode } from '../IMeasurable';
import { ILayoutManager } from './ILayoutManager';
import { LayoutOptions, FastLayoutOptions } from '../layout-options';
import { WidgetGroup } from '../WidgetGroup';

/**
 * `PUXI.FastLayout` is used in conjunction with `PUXI.FastLayoutOptions`. It is the
 * default layout for most widget groups.
 *
 * @namespace PUXI
 * @extends PUXI.ILayoutManager
 * @class
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

    onMeasure(maxWidth: number, maxHeight: number, widthMode: MeasureMode, heightMode: MeasureMode): void
    {
        this._measuredWidth = maxWidth;
        this._measuredHeight = maxHeight;

        const children = this.host.widgetChildren;

        // Measure children
        for (let i = 0, j = children.length; i < j; i++)
        {
            const widget = children[i];
            const lopt = (widget.layoutOptions || LayoutOptions.DEFAULT) as FastLayoutOptions;

            const widthMeasureMode = this.getChildMeasureMode(lopt.width, widthMode);
            const heightMeasureMode = this.getChildMeasureMode(lopt.height, heightMode);
            const loptWidth = (Math.abs(lopt.width) < 1) ? lopt.width * maxWidth : lopt.width;
            const loptHeight = (Math.abs(lopt.height) < 1) ? lopt.height * maxHeight : lopt.height;

            widget.measure(
                widthMeasureMode === MeasureMode.EXACTLY ? loptWidth : maxWidth,
                heightMeasureMode === MeasureMode.EXACTLY ? loptHeight : maxHeight,
                widthMeasureMode,
                heightMeasureMode);
        }

        if (widthMode === MeasureMode.UNBOUNDED || widthMode === MeasureMode.AT_MOST)
        {
            this._measuredWidth = 0;

            for (let i = 0, j = children.length; i < j; i++)
            {
                const widget = children[i];
                const childWidth = widget.getMeasuredWidth();
                const lopt = (widget.layoutOptions || LayoutOptions.DEFAULT) as FastLayoutOptions;
                const x = lopt.x ? lopt.x : 0;

                // If lopt.x is %, then (1 - lopt.x)% of parent width should be as large
                // as child's width.
                const minr = childWidth + (Math.abs(x) < 1 ? childWidth / (1 - x) : x);

                this._measuredWidth = Math.max(this._measuredWidth, minr);
            }

            if (widthMode === MeasureMode.AT_MOST)
            {
                this._measuredWidth = Math.min(maxWidth, this._measuredWidth);
            }
        }
        if (heightMode === MeasureMode.UNBOUNDED || heightMode === MeasureMode.AT_MOST)
        {
            this._measuredHeight = 0;

            for (let i = 0, j = children.length; i < j; i++)
            {
                const widget = children[i];
                const childHeight = widget.getMeasuredHeight();
                const lopt = (widget.layoutOptions || LayoutOptions.DEFAULT) as FastLayoutOptions;
                const y = lopt.y ? lopt.y : 0;

                const minb = childHeight + (Math.abs(y) < 1 ? childHeight / (1 - y) : y);

                this._measuredHeight = Math.max(this._measuredHeight, minb);
            }

            if (heightMode === MeasureMode.AT_MOST)
            {
                this._measuredHeight = Math.min(maxHeight, this._measuredHeight);
            }
        }
    }

    private getChildMeasureMode(dimen: number, parentMeasureMode: MeasureMode): MeasureMode
    {
        if (parentMeasureMode === MeasureMode.UNBOUNDED)
        {
            return MeasureMode.UNBOUNDED;
        }
        if (dimen === LayoutOptions.FILL_PARENT || dimen === LayoutOptions.WRAP_CONTENT)
        {
            return MeasureMode.AT_MOST;
        }

        return MeasureMode.EXACTLY;
    }

    onLayout(): void
    {
        const parent = this.host;
        const { width, height, widgetChildren: children } = parent;

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

    getMeasuredWidth(): number
    {
        return this._measuredWidth;
    }

    getMeasuredHeight(): number
    {
        return this._measuredHeight;
    }
}
