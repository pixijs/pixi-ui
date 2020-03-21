import { ILayoutManager } from './ILayoutManager';
import { Widget } from '../Widget';
import { AnchorLayoutOptions, ALIGN, LayoutOptions } from '../layout-options';
import { MeasureMode } from '../IMeasurable';
import { WidgetGroup } from '../WidgetGroup';

/**
 * `AnchorLayout` is used in conjunction with `AnchorLayoutOptions`.
 *
 * @memberof PUXI
 * @class
 * @example
 * ```
 * parent.useLayout(new PUXI.AnchorLayout());
 * ```
 */
export class AnchorLayout implements ILayoutManager
{
    private measuredWidth: number;
    private measuredHeight: number;

    private host: WidgetGroup;

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
        const { widgetChildren } = parent;

        const parentWidth = parent.getMeasuredWidth();
        const parentHeight = parent.getMeasuredHeight();

        for (let i = 0; i < widgetChildren.length; i++)
        {
            const child = widgetChildren[i];
            const layoutOptions = (child.layoutOptions || {}) as AnchorLayoutOptions;

            let childWidth = child.getMeasuredWidth();
            let childHeight = child.getMeasuredHeight();

            const anchorLeft = this.calculateAnchor(layoutOptions.anchorLeft || 0, parentWidth, false);
            const anchorTop = this.calculateAnchor(layoutOptions.anchorTop || 0, parentHeight, false);
            const anchorRight = this.calculateAnchor(layoutOptions.anchorRight || 0, parentWidth, true);
            const anchorBottom = this.calculateAnchor(layoutOptions.anchorBottom || 0, parentHeight, true);
            let x = 0;
            let y = 0;

            if (childWidth !== 0)
            {
                switch (layoutOptions.horizontalAlign || ALIGN.NONE as ALIGN)
                {
                    case ALIGN.LEFT:
                        x = anchorLeft;
                        break;
                    case ALIGN.MIDDLE:
                        x = (anchorRight - anchorLeft - childWidth) / 2;
                        break;
                    case ALIGN.RIGHT:
                        x = anchorRight - childWidth;
                        break;
                }
            }
            else
            {
                x = anchorLeft;
                childWidth = anchorRight - anchorLeft;
            }

            if (childHeight !== 0)
            {
                switch (layoutOptions.verticalAlign || ALIGN.NONE as ALIGN)
                {
                    case ALIGN.TOP:
                        y = anchorTop;
                        break;
                    case ALIGN.MIDDLE:
                        y = (anchorBottom - anchorTop - childHeight) / 2;
                        break;
                    case ALIGN.RIGHT:
                        y = anchorBottom - childWidth;
                        break;
                }
            }
            else
            {
                y = anchorRight;
                childHeight = anchorBottom - anchorTop;
            }

            child.layout(x, y, x + childWidth, y + childHeight);
        }
    }

    onMeasure(widthLimit: number, heightLimit: number, widthMode: MeasureMode, heightMode: MeasureMode): void
    {
        const children = this.host.widgetChildren;

        let naturalWidth = 0;
        let naturalHeight = 0;

        const baseWidthMode = widthMode === MeasureMode.EXACTLY ? MeasureMode.AT_MOST : widthMode;
        const baseHeightMode = heightMode === MeasureMode.EXACTLY ? MeasureMode.AT_MOST : heightMode;

        let hasFillers = false;

        // First pass: measure children and find our natural width/height. If we have a upper
        // limit, then pass that on.
        for (let i = 0, j = children.length; i < j; i++)
        {
            const widget = children[i];
            const lopt = (widget.layoutOptions || LayoutOptions.DEFAULT) as AnchorLayoutOptions;

            const anchorLeft = this.calculateAnchor(lopt.anchorLeft || 0, widthLimit, false);
            const anchorTop = this.calculateAnchor(lopt.anchorTop || 0, heightLimit, false);
            const anchorRight = this.calculateAnchor(lopt.anchorRight || 0, widthLimit, true);
            const anchorBottom = this.calculateAnchor(lopt.anchorBottom || 0, heightLimit, true);

            // Does child have a pre-determined width or height?
            const widthFill = lopt.width === LayoutOptions.FILL_PARENT && widthMode === MeasureMode.EXACTLY;
            const heightFill = lopt.height === LayoutOptions.FILL_PARENT && heightMode === MeasureMode.EXACTLY;

            // Fillers need to be remeasured using EXACTLY.
            hasFillers = hasFillers || lopt.width === LayoutOptions.FILL_PARENT || lopt.height === LayoutOptions.FILL_PARENT;

            widget.measure(
                anchorRight - anchorLeft,
                anchorBottom - anchorTop,
                widthFill ? MeasureMode.EXACTLY : baseWidthMode,
                heightFill ? MeasureMode.EXACTLY : baseHeightMode);

            const horizontalReach = this.calculateReach(
                lopt.anchorLeft || 0, lopt.anchorRight || 0, widget.getMeasuredWidth());
            const verticalReach = this.calculateReach(
                lopt.anchorTop || 0, lopt.anchorBottom || 0, widget.getMeasuredHeight());

            naturalWidth = Math.max(naturalWidth, horizontalReach);
            naturalHeight = Math.max(naturalHeight, verticalReach);
        }

        this.measuredWidth = Widget.resolveMeasuredDimen(naturalWidth, widthLimit, widthMode);
        this.measuredHeight = Widget.resolveMeasuredDimen(naturalHeight, heightLimit, heightMode);

        if (!hasFillers)
        {
            return;
        }

        // Handle fillers.
        for (let i = 0, j = children.length; i < j; i++)
        {
            const widget = children[i];
            const lopt = (widget.layoutOptions || LayoutOptions.DEFAULT) as AnchorLayoutOptions;

            const anchorLeft = this.calculateAnchor(lopt.anchorLeft || 0, this.measuredWidth, false);
            const anchorTop = this.calculateAnchor(lopt.anchorTop || 0, this.measuredHeight, false);
            const anchorRight = this.calculateAnchor(lopt.anchorRight || 0, this.measuredWidth, true);
            const anchorBottom = this.calculateAnchor(lopt.anchorBottom || 0, this.measuredHeight, true);

            if (lopt.width === LayoutOptions.FILL_PARENT || lopt.height === LayoutOptions.FILL_PARENT)
            {
                widget.measure(
                    anchorRight - anchorLeft,
                    anchorBottom - anchorTop,
                    lopt.width === LayoutOptions.FILL_PARENT ? MeasureMode.EXACTLY : MeasureMode.AT_MOST,
                    lopt.height === LayoutOptions.FILL_PARENT ? MeasureMode.EXACTLY : MeasureMode.AT_MOST,
                );
            }
        }
    }

    getMeasuredWidth(): number
    {
        return this.measuredWidth;
    }

    getMeasuredHeight(): number
    {
        return this.measuredHeight;
    }

    /**
     * Calculates the actual value of the anchor, given the parent's dimension.
     *
     * @param {number} anchor - anchor as given in layout options
     * @param {number} limit - parent's dimension
     * @param {boolean} limitSubtract - true of right/bottom anchors, false for left/top
     */
    protected calculateAnchor(anchor: number, limit: number, limitSubtract: boolean): number
    {
        const offset = Math.abs(anchor) < 1 ? anchor * limit : anchor;

        return limitSubtract ? limit - offset : offset;
    }

    /**
     * Calculates the "reach" of a child widget, which is the minimum dimension of
     * the parent required to fully fit the child.
     *
     * @param {number} minAnchor - left or top anchor as given in layout options
     * @param {number} maxAnchor - right or bottom anchor as given in layout options
     * @param {number} dimen - measured dimension of the widget (width or height)
     */
    protected calculateReach(minAnchor: number, maxAnchor: number, dimen: number): number
    {
        if (Math.abs(minAnchor) > 1)
        {
            if (Math.abs(maxAnchor) > 1)
            {
                return maxAnchor;
            }

            // Resolved max-anchor minus min-anchor should atleast be dimen.
            return minAnchor + dimen / maxAnchor;
        }
        else if (Math.abs(maxAnchor) > 1)
        {
            // Having a constant max-anchor and % min-anchor actually creates an upper
            // limit for the layout. This isn't respected as we already are trying to
            // be as small as possible.
            return maxAnchor;
        }

        return dimen / (maxAnchor - minAnchor);
    }
}
