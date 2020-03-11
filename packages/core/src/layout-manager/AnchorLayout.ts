import { ILayoutManager } from './ILayoutManager';
import { Widget } from '../Widget';
import { AnchorLayoutOptions, ALIGN, LayoutOptions } from '../layout-options';
import { MeasureMode } from '../IMeasurable';
import { WidgetGroup } from '../WidgetGroup';

/**
 * `AnchorLayout` is used in conjunction with `AnchorLayoutOptions`.
 *
 * @namespace PUXI
 * @class
 * @example
 * ```
 * parent.useLayout(
 *    new PUXI.AnchorLayout()
 * );
 * ```
 */
export class AnchorLayout implements ILayoutManager
{
    private measuredWidth: number;
    private measuredHeight: number;

    private host: WidgetGroup;
    protected noPercents: boolean;

    constructor()
    {
        this.noPercents = false;
    }

    onAttach(host: WidgetGroup): void
    {
        this.host = host;
    }

    onDetach(): void
    {
        this.host = null;
    }

    private measureChild(child: Widget,
        maxParentWidth: number,
        maxParentHeight: number,
        widthMode: MeasureMode,
        heightMode: MeasureMode): void
    {
        const lopt = (child.layoutOptions || LayoutOptions.DEFAULT) as AnchorLayoutOptions;

        const anchorLeft = lopt.anchorLeft || 0;
        const anchorTop = lopt.anchorTop || 0;
        const anchorRight = lopt.anchorRight || 0;
        const anchorBottom = lopt.anchorBottom || 0;

        let maxWidgetWidth = 0;
        let maxWidgetHeight = 0;
        let widgetWidthMode: number;
        let widgetHeightMode: number;

        // Widget width measurement
        if (this.noPercents || (Math.abs(anchorLeft) > 1 && Math.abs(anchorRight) > 1))
        {
            maxWidgetWidth = Math.ceil(anchorRight) - Math.floor(anchorLeft);
            widgetWidthMode = MeasureMode.AT_MOST;
        }
        else if (Math.abs(anchorLeft) < 1 && Math.abs(anchorRight) < 1)
        {
            maxWidgetWidth = maxParentWidth * (anchorRight - anchorLeft);
            widgetWidthMode = (widthMode === MeasureMode.UNBOUNDED)
                ? MeasureMode.UNBOUNDED
                : MeasureMode.AT_MOST;
        }
        else if (Math.abs(anchorLeft) < 1)
        {
            maxWidgetWidth = anchorRight;
            widgetWidthMode = MeasureMode.AT_MOST;
        }
        else
        {
            maxWidgetWidth = (maxParentWidth * anchorRight) - anchorLeft;
            widgetWidthMode = (widthMode === MeasureMode.UNBOUNDED)
                ? MeasureMode.UNBOUNDED
                : MeasureMode.AT_MOST;
        }

        // Widget height measurement
        if (this.noPercents || (Math.abs(anchorTop) > 1 && Math.abs(anchorBottom) > 1))
        {
            maxWidgetHeight = Math.ceil(anchorBottom) - Math.floor(anchorTop);
            widgetHeightMode = MeasureMode.AT_MOST;
        }
        else if (Math.abs(anchorTop) < 1 && Math.abs(anchorBottom) < 1)
        {
            maxWidgetHeight = maxParentHeight * (anchorBottom - anchorTop);
            widgetHeightMode = (heightMode === MeasureMode.UNBOUNDED)
                ? MeasureMode.UNBOUNDED
                : MeasureMode.AT_MOST;
        }
        else if (Math.abs(anchorTop) < 1)
        {
            maxWidgetHeight = anchorBottom;
            widgetHeightMode = MeasureMode.AT_MOST;
        }
        else
        {
            maxWidgetHeight = (maxParentHeight * anchorBottom) - anchorTop;
            widgetHeightMode = (heightMode === MeasureMode.UNBOUNDED)
                ? MeasureMode.UNBOUNDED
                : MeasureMode.AT_MOST;
        }

        child.measure(
            maxWidgetWidth,
            maxWidgetHeight,
            widgetWidthMode,
            widgetHeightMode,
        );
    }

    measureStretch(lowerAnchor: number,
        upperAnchor: number,
        childDimen: number): number
    {
        if (this.noPercents || (Math.abs(upperAnchor) > 1 && Math.abs(lowerAnchor) > 1))
        {
            return Math.max(lowerAnchor, upperAnchor);
        }
        else if (Math.abs(lowerAnchor) < 1 && Math.abs(upperAnchor) < 1)
        {
            return childDimen / (upperAnchor - lowerAnchor);
        }
        else if (Math.abs(lowerAnchor) < 1)
        {
            return upperAnchor;
        }

        return (childDimen + lowerAnchor) / upperAnchor;
    }

    measureChildren(maxParentWidth: number,
        maxParentHeight: number,
        widthMode: MeasureMode,
        heightMode: MeasureMode): void
    {
        const children = this.host.widgetChildren;

        for (let i = 0, j = children.length; i < j; i++)
        {
            this.measureChild(children[i], maxParentWidth, maxParentHeight, widthMode, heightMode);
        }
    }

    onMeasure(maxWidth: number, maxHeight: number, widthMode: MeasureMode, heightMode: MeasureMode): void
    {
        if (widthMode === MeasureMode.EXACTLY && heightMode === MeasureMode.EXACTLY)
        {
            this.measuredWidth = maxWidth;
            this.measuredHeight = maxHeight;
            this.measureChildren(this.measuredWidth, this.measuredHeight,
                MeasureMode.EXACTLY,
                MeasureMode.EXACTLY);
        }

        let maxX = 0;
        let maxY = 0;

        const children = this.host.widgetChildren;

        this.measureChildren(maxWidth, maxHeight, widthMode, heightMode);

        for (let i = 0, j = children.length; i < j; i++)
        {
            const child = children[i];
            const lopt = (child.layoutOptions || LayoutOptions.DEFAULT) as AnchorLayoutOptions;

            const anchorLeft = lopt.anchorLeft || 0;
            const anchorTop = lopt.anchorTop || 0;
            const anchorRight = lopt.anchorRight || 0;
            const anchorBottom = lopt.anchorBottom || 0;

            maxX = Math.max(maxX, this.measureStretch(anchorLeft, anchorRight, child.getMeasuredWidth()));
            maxY = Math.max(maxY, this.measureStretch(anchorTop, anchorBottom, child.getMeasuredHeight()));
        }

        if (widthMode === MeasureMode.EXACTLY)
        {
            this.measuredWidth = maxWidth;
        }
        else if (widthMode === MeasureMode.AT_MOST)
        {
            this.measuredWidth = Math.min(maxX, maxWidth);
        }
        else
        {
            this.measuredWidth = maxX;
        }

        if (heightMode === MeasureMode.EXACTLY)
        {
            this.measuredHeight = maxHeight;
        }
        else if (heightMode === MeasureMode.AT_MOST)
        {
            this.measuredHeight = Math.min(maxY, maxHeight);
        }
        else
        {
            this.measuredHeight = maxY;
        }

        this.measureChildren(this.measuredWidth, this.measuredHeight,
            MeasureMode.EXACTLY,
            MeasureMode.EXACTLY);
    }

    getMeasuredWidth(): number
    {
        return this.measuredWidth;
    }

    getMeasuredHeight(): number
    {
        return this.measuredHeight;
    }

    onLayout(parent: Widget): void
    {
        const { widgetChildren } = parent;

        for (let i = 0; i < widgetChildren.length; i++)
        {
            const child = widgetChildren[i];
            const layoutOptions = (child.layoutOptions || {}) as AnchorLayoutOptions;

            let childWidth = child.measuredWidth;
            let childHeight = child.measuredHeight;

            let anchorLeft = layoutOptions.anchorLeft || 0;
            let anchorTop = layoutOptions.anchorTop || 0;
            let anchorRight = layoutOptions.anchorRight || 0;
            let anchorBottom = layoutOptions.anchorBottom || 0;

            if (anchorLeft > -1 && anchorLeft <= 1)
            {
                anchorLeft *= parent.width;
            }
            if (anchorTop > -1 && anchorTop <= 1)
            {
                anchorTop *= parent.height;
            }
            if (anchorRight > -1 && anchorRight <= 1)
            {
                anchorRight *= parent.width;
            }
            if (anchorBottom > -1 && anchorBottom <= 1)
            {
                anchorBottom *= parent.height;
            }

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
}
