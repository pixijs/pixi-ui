import { ILayoutManager } from './ILayoutManager';
import { WidgetGroup } from '../WidgetGroup';
import { MeasureMode } from '../IMeasurable';
import { LayoutOptions } from '../layout-options';

type Gravity = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';

export class LinearLayout implements ILayoutManager
{
    private host: WidgetGroup;
    private orientation: 'vertical' | 'horizontal';
    private gravity: Gravity;
    private measuredWidth: number;
    private measuredHeight: number;

    constructor(orientation: 'vertical' | 'horizontal' = 'vertical', gravity: Gravity = 'center')
    {
        this.orientation = orientation;
        this.gravity = gravity;
    }

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
        let position = 0;
        const children = this.host.widgetChildren;
        const breadth = this.orientation === 'vertical'
            ? this.measuredWidth
            : this.measuredHeight;

        for (let i = 0, j = children.length; i < j; i++)
        {
            const widget = children[i];

            // along axis
            const u = this.orientation === 'vertical'
                ? widget.getMeasuredWidth()
                : widget.getMeasuredHeight();
            const v = this.orientation === 'vertical'
                ? widget.getMeasuredHeight()
                : widget.getMeasuredWidth();

            let p = 0;

            if (u < breadth)
            {
                switch (this.gravity)
                {
                    case 'center':
                    case 'middle':
                        p = (breadth - u) / 2;
                        break;
                    case 'right':
                    case 'bottom':
                        p = breadth - u;
                        break;
                }
            }

            if (this.orientation === 'vertical')
            {
                widget.layout(p, position, p + u, position + v);
            }
            else
            {
                widget.layout(position, p, position + v, p + u);
            }

            position += v;
        }
    }

    onMeasure(widthLimit: number, heightLimit: number, widthMode: MeasureMode, heightMode: MeasureMode): void
    {
        const children = this.host.widgetChildren;
        const baseWidthMode = widthMode === MeasureMode.EXACTLY ? MeasureMode.AT_MOST : widthMode;
        const baseHeightMode = heightMode === MeasureMode.EXACTLY ? MeasureMode.AT_MOST : heightMode;

        let length = 0;
        let breadth = 0;

        for (let i = 0, j = children.length; i < j; i++)
        {
            const widget = children[i];
            const lopt = (widget.layoutOptions || LayoutOptions.DEFAULT);

            const widgetWidthLimit = lopt.isWidthPredefined ? lopt.width : widthLimit;
            const widgetHeightLimit = lopt.isHeightPredefined ? lopt.height : heightLimit;
            const widgetWidthMode = lopt.isWidthPredefined ? MeasureMode.EXACTLY : baseWidthMode;
            const widgetHeightMode = lopt.isHeightPredefined ? MeasureMode.EXACTLY : baseHeightMode;

            widget.measure(widgetWidthLimit, widgetHeightLimit, widgetWidthMode, widgetHeightMode);

            if (this.orientation === 'vertical')
            {
                breadth = Math.max(breadth, widget.getMeasuredWidth());
                length += widget.getMeasuredHeight();
            }
            else
            {
                breadth = Math.max(breadth, widget.getMeasuredHeight());
                length += widget.getMeasuredWidth();
            }
        }

        if (this.orientation === 'vertical')
        {
            this.measuredWidth = breadth;
            this.measuredHeight = length;
        }
        else
        {
            this.measuredWidth = length;
            this.measuredHeight = breadth;
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
}
