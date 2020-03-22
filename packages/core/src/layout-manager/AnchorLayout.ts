import { ILayoutManager } from './ILayoutManager';
import { Widget } from '../Widget';
import { AnchorLayoutOptions, ALIGN, LayoutOptions } from '../layout-options';
import { MeasureMode } from '../IMeasurable';
import { WidgetGroup } from '../WidgetGroup';

interface IAnchorCache {
    remeasure: boolean;
}

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

        const parentWidth = parent.contentWidth;
        const parentHeight = parent.contentHeight;

        for (let i = 0; i < widgetChildren.length; i++)
        {
            const child = widgetChildren[i];
            const layoutOptions = (child.layoutOptions || {}) as AnchorLayoutOptions;

            const childWidth = child.getMeasuredWidth();
            const childHeight = child.getMeasuredHeight();
            const anchorLeft = this.calculateAnchor(layoutOptions.anchorLeft || 0, parentWidth, false);
            const anchorTop = this.calculateAnchor(layoutOptions.anchorTop || 0, parentHeight, false);
            const anchorRight = this.calculateAnchor(layoutOptions.anchorRight || 0, parentWidth, true);
            const anchorBottom = this.calculateAnchor(layoutOptions.anchorBottom || 0, parentHeight, true);

            let x = anchorLeft;
            let y = anchorTop;

            switch (layoutOptions.horizontalAlign)
            {
                case ALIGN.MIDDLE:
                    x = (anchorRight + anchorLeft - childWidth) / 2;
                    break;
                case ALIGN.RIGHT:
                    x = anchorRight - childWidth;
                    break;
            }

            switch (layoutOptions.verticalAlign)
            {
                case ALIGN.MIDDLE:
                    y = (anchorBottom + anchorTop - childHeight) / 2;
                    break;
                case ALIGN.BOTTOM:
                    y = anchorBottom - childHeight;
                    break;
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

            if (lopt.width === LayoutOptions.FILL_PARENT)
            {
                throw new Error('AnchorLayout does not support width = FILL_PARENT. Use anchorLeft = 0 & anchorRight = 0');
            }
            if (lopt.height === LayoutOptions.FILL_PARENT)
            {
                throw new Error('AnchorLayout does not support height = FILL_PARENT. Use anchorTop = 0 & anchorBottom = 0');
            }

            const anchorLeft = this.calculateAnchor(lopt.anchorLeft || 0, widthLimit, false);
            const anchorTop = this.calculateAnchor(lopt.anchorTop || 0, heightLimit, false);
            const anchorRight = this.calculateAnchor(lopt.anchorRight || 0, widthLimit, true);
            const anchorBottom = this.calculateAnchor(lopt.anchorBottom || 0, heightLimit, true);

            // Does child have a pre-determined width or height?
            const widthConst = lopt.isWidthPredefined;
            const heightConst = lopt.isHeightPredefined;
            const widgetWidthLimit = widthConst ? lopt.width : anchorRight - anchorLeft;
            const widgetHeightLimit = heightConst ? lopt.height : anchorBottom - anchorTop;

            const widgetWidthMode = widthConst ? MeasureMode.EXACTLY : baseWidthMode;
            const widgetHeightMode = heightConst ? MeasureMode.EXACTLY : baseHeightMode;

            // Fillers need to be remeasured using EXACTLY.
            hasFillers = hasFillers || lopt.width === 0 || lopt.height === 0;

            widget.measure(widgetWidthLimit, widgetHeightLimit, widgetWidthMode, widgetHeightMode);

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

            if (lopt.width === 0 || lopt.height === 0)
            {
                const anchorLeft = this.calculateAnchor(lopt.anchorLeft || 0, this.measuredWidth, false);
                const anchorTop = this.calculateAnchor(lopt.anchorTop || 0, this.measuredHeight, false);
                const anchorRight = this.calculateAnchor(lopt.anchorRight || 0, this.measuredWidth, true);
                const anchorBottom = this.calculateAnchor(lopt.anchorBottom || 0, this.measuredHeight, true);

                widget.measure(
                    lopt.isWidthPredefined ? lopt.width : anchorRight - anchorLeft,
                    lopt.isHeightPredefined ? lopt.height : anchorBottom - anchorTop,
                    lopt.width === 0 || lopt.isWidthPredefined ? MeasureMode.EXACTLY : MeasureMode.AT_MOST,
                    lopt.height === 0 || lopt.isHeightPredefined ? MeasureMode.EXACTLY : MeasureMode.AT_MOST,
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
     * @param {boolean} limitSubtract - true for right/bottom anchors, false for left/top
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
     * @param {number} startAnchor - left or top anchor as given in layout options
     * @param {number} endAnchor - right or bottom anchor as given in layout options
     * @param {number} dimen - measured dimension of the widget (width or height)
     */
    protected calculateReach(startAnchor: number, endAnchor: number, dimen: number): number
    {
        if (Math.abs(startAnchor) < 1 && Math.abs(endAnchor) < 1)
        {
            return dimen / (1 - endAnchor - startAnchor);
        }
        else if (Math.abs(startAnchor) < 1)
        {
            return (endAnchor + dimen) / (1 - startAnchor);
        }
        else if (Math.abs(endAnchor) < 1)
        {
            return (startAnchor + dimen) / (1 - endAnchor);
        }

        return startAnchor + dimen + endAnchor;
    }
}
