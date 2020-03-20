import { ILayoutManager } from './ILayoutManager';
import { WidgetGroup } from '../WidgetGroup';
import { Widget } from '../Widget';
import { LayoutOptions, ALIGN } from '../layout-options';
import { BorderLayoutOptions } from '../layout-options/BorderLayoutOptions';
import { MeasureMode } from '../IMeasurable';

const {
    REGION_LEFT,
    REGION_TOP,
    REGION_RIGHT,
    REGION_BOTTOM,
    REGION_CENTER,
} = BorderLayoutOptions;

const {
    FILL_PARENT,
} = LayoutOptions;

const {
    EXACTLY,
    AT_MOST,
} = MeasureMode;

/**
 * `PUXI.BorderLayout` is used in conjunction with `PUXI.BorderLayoutOptions`.
 *
 * This layout guarantees that the "center" region will always be in the center of
 * the widget-group.
 *
 * WARNING: This layout may have some bugs in edge cases that haven't been reported.
 *
 * @memberof PUXI
 * @class
 * @implements PUXI.ILayoutManager
 */
export class BorderLayout implements ILayoutManager
{
    protected host: WidgetGroup;

    protected leftWidgets: Widget[];
    protected topWidgets: Widget[];
    protected rightWidgets: Widget[];
    protected bottomWidgets: Widget[];
    protected centerWidgets: Widget[];

    protected measuredLeftWidth: number;
    protected measuredRightWidth: number;
    protected measuredCenterWidth: number;
    protected measuredWidth: number;

    protected measuredTopHeight: number;
    protected measuredBottomHeight: number;
    protected measuredCenterHeight: number;
    protected measuredHeight: number;

    constructor()
    {
        this.leftWidgets = [];
        this.topWidgets = [];
        this.rightWidgets = [];
        this.bottomWidgets = [];
        this.centerWidgets = [];
    }

    onAttach(host: WidgetGroup): void
    {
        this.host = host;
    }

    onDetach(): void
    {
        this.host = null;
        this.clearMeasureCache();
        this.clearRegions();
    }

    onLayout(): void
    {
        this.layoutChildren(
            this.leftWidgets,
            0,
            this.measuredTopHeight,
            this.measuredLeftWidth,
            this.measuredCenterHeight);
        this.layoutChildren(this.topWidgets, 0, 0, this.measuredWidth, this.measuredTopHeight);
        this.layoutChildren(
            this.rightWidgets,
            this.measuredWidth - this.measuredRightWidth,
            this.measuredTopHeight,
            this.measuredRightWidth,
            this.measuredCenterHeight,
        );
        this.layoutChildren(
            this.bottomWidgets,
            0,
            this.measuredTopHeight + this.measuredCenterHeight,
            this.measuredWidth,
            this.measuredBottomHeight,
        );
        this.layoutChildren(
            this.centerWidgets,
            this.measuredLeftWidth,
            this.measuredTopHeight,
            this.measuredCenterWidth,
            this.measuredCenterHeight,
        );
    }

    layoutChildren(
        widgets: Widget[],
        regionX: number,
        regionY: number,
        regionWidth: number,
        regionHeight: number,
    ): void
    {
        for (let i = 0, j = widgets.length; i < j; i++)
        {
            const widget = widgets[i];

            let x = 0;
            let y = 0;

            switch ((widget.layoutOptions as BorderLayoutOptions)?.horizontalAlign)
            {
                case ALIGN.CENTER: x = (regionWidth - widget.getMeasuredWidth()) / 2; break;
                case ALIGN.RIGHT: x = regionWidth - widget.getMeasuredWidth(); break;
                default: x = 0; break;
            }

            switch ((widget.layoutOptions as BorderLayoutOptions)?.verticalAlign)
            {
                case ALIGN.CENTER: y = (regionHeight - widget.getMeasuredHeight()) / 2; break;
                case ALIGN.BOTTOM: y = regionHeight - widget.getMeasuredHeight(); break;
                default: y = 0; break;
            }

            x += regionX;
            y += regionY;

            widget.layout(x, y, x + widget.getMeasuredWidth(), y + widget.getMeasuredHeight(), true);
        }
    }

    /**
     * @param {number} maxWidth
     * @param {number} maxHeight
     * @param {PUXI.MeasureMode} widthMode
     * @param {PUXI.MeasureMode} heightMode
     * @override
     */
    onMeasure(maxWidth: number, maxHeight: number, widthMode: MeasureMode, heightMode: MeasureMode): void
    {
        this.indexRegions();
        this.clearMeasureCache();

        // Children can be aligned inside region if smaller
        const childWidthMode = widthMode === MeasureMode.EXACTLY ? MeasureMode.AT_MOST : widthMode;
        const childHeightMode = heightMode === MeasureMode.EXACTLY ? MeasureMode.AT_MOST : widthMode;

        // Measure top, bottom, and center. The max. of each row's width will be our "reference".
        let [tw, th, , thmin] = this.measureChildren(// eslint-disable-line prefer-const
            this.topWidgets,
            maxWidth,
            maxHeight,
            childWidthMode, childHeightMode,
        );
        let [bw, bh,, bhmin] = this.measureChildren(// eslint-disable-line prefer-const
            this.bottomWidgets,
            maxWidth,
            maxHeight,
            childWidthMode, childHeightMode,
        );
        let [cw, ch, cwmin, chmin] = this.measureChildren(// eslint-disable-line prefer-const
            this.centerWidgets,
            maxWidth,
            maxHeight,
            childWidthMode,
            heightMode);

        // Measure left & right regions. Their heights will equal center's height.
        let [lw, , lwmin] = this.measureChildren(// eslint-disable-line prefer-const
            this.leftWidgets,
            maxWidth,
            ch,
            childWidthMode, MeasureMode.AT_MOST);
        let [rw, , rwmin] = this.measureChildren(// eslint-disable-line prefer-const
            this.rightWidgets,
            maxWidth,
            ch,
            childWidthMode, MeasureMode.AT_MOST);

        // Check if total width/height is greater than our limit. If so, then downscale
        // each row's height or each column's (in middle row) width.

        const middleRowWidth = lw + rw + cw;
        const netWidth = Math.max(tw, bw, middleRowWidth);
        const netHeight = th + bh + ch;

        // Resolve our limits.
        if (widthMode === MeasureMode.EXACTLY)
        {
            this.measuredWidth = maxWidth;
        }
        else if (widthMode === MeasureMode.AT_MOST)
        {
            this.measuredWidth = Math.min(netWidth, maxWidth);
        }
        else
        {
            this.measuredWidth = netWidth;
        }

        if (heightMode === MeasureMode.EXACTLY)
        {
            this.measuredHeight = maxHeight;
        }
        else if (heightMode === MeasureMode.AT_MOST)
        {
            this.measuredHeight = Math.min(netHeight, maxHeight);
        }
        else
        {
            this.measuredHeight = netHeight;
        }

        tw = this.measuredWidth;
        bw = this.measuredWidth;

        if (netHeight > this.measuredHeight)
        {
            const hmin = (thmin + chmin + bhmin);

            // Redistribute heights minus min-heights.
            if (hmin < this.measuredHeight)
            {
                const downscale = (this.measuredHeight - hmin) / (netHeight - hmin);

                th = thmin + ((th - thmin) * downscale);
                bh = bhmin + ((bh - bhmin) * downscale);
                ch = chmin + ((ch - chmin) * downscale);
            }
            // Redistribute full heights.
            else
            {
                const downscale = this.measuredHeight / netHeight;

                th *= downscale;
                bh *= downscale;
                ch *= downscale;
            }
        }

        if (netWidth > this.measuredWidth)
        {
            const wmin = lwmin + cwmin + rwmin;

            // Redistribute widths minus min. widths
            if (wmin < this.measuredWidth)
            {
                const downscale = (this.measuredWidth - wmin) / (netWidth - wmin);

                lw = lwmin + ((lw - lwmin) * downscale);
                cw = cwmin + ((cw - cwmin) * downscale);
                rw = rwmin + ((rw - rwmin) * downscale);
            }
            // Redistribute full widths
            else
            {
                const downscale = this.measuredWidth / netWidth;

                lw *= downscale;
                cw *= downscale;
                rw *= downscale;
            }
        }

        // Useful to know!
        this.measuredLeftWidth = lw;
        this.measuredRightWidth = rw;
        this.measuredCenterWidth = cw;
        this.measuredTopHeight = th;
        this.measuredBottomHeight = bh;
        this.measuredCenterHeight = ch;

        this.fitChildren(this.leftWidgets, this.measuredLeftWidth, this.measuredCenterHeight);
        this.fitChildren(this.topWidgets, this.measuredWidth, this.measuredTopHeight);
        this.fitChildren(this.rightWidgets, this.measuredRightWidth, this.measuredCenterHeight);
        this.fitChildren(this.bottomWidgets, this.measuredWidth, this.measuredBottomHeight);
        this.fitChildren(this.centerWidgets, this.measuredCenterWidth, this.measuredCenterHeight);
    }

    /**
     * This measures the list of widgets given the constraints. The max width and
     * height amongst the children is returned.
     *
     * @param {PUXI.Widget[]} list
     * @param {number} maxWidth
     * @param {number} maxHeight
     * @param {PUXI.MeasureMode} widthMode
     * @param {PUXI.MeasureMode} heightMode
     * @returns {number[]} - [width, height, widthFixedLowerBound, heightFixedLowerBound] -
     *    the max. width and height amongst children. Also, the minimum required width/height
     *    for the region (as defined in layout-options).
     */
    protected measureChildren(
        list: Widget[],
        maxWidth: number,
        maxHeight: number,
        widthMode: MeasureMode,
        heightMode: MeasureMode,
    ): number[]
    {
        let width = 0;
        let height = 0;
        let widthFixedLowerBound = 0;
        let heightFixedLowerBound = 0;

        for (let i = 0, j = list.length; i < j; i++)
        {
            const widget = list[i];
            const lopt = widget.layoutOptions || LayoutOptions.DEFAULT;

            let w = maxWidth;
            let h = maxHeight;
            let wmd = widthMode;
            let hmd = heightMode;

            if (lopt.width <= LayoutOptions.MAX_DIMEN)
            {
                w = lopt.width;
                wmd = EXACTLY;

                widthFixedLowerBound = Math.max(widthFixedLowerBound, w);
            }
            if (lopt.height <= LayoutOptions.MAX_DIMEN)
            {
                h = lopt.height;
                hmd = EXACTLY;

                heightFixedLowerBound = Math.max(heightFixedLowerBound, h);
            }

            widget.measure(w, h, wmd, hmd);

            width = Math.max(width, widget.getMeasuredWidth());
            height = Math.max(height, widget.getMeasuredHeight());
        }

        return [width, height, widthFixedLowerBound, heightFixedLowerBound];
    }

    /**
     * Ensures all widgets in the list measured their dimensions below the region
     * width & height. Widgets that are too large are remeasured in the those
     * limits (using `MeasureMode.AT_MOST`).
     *
     * This will handle widgets that have "FILL_PARENT" width or height.
     *
     * @param {PUXI.Widget[]} list
     * @param {number} measuredRegionWidth
     * @param {number} measuredRegionHeight
     */
    protected fitChildren(
        list: Widget[],
        measuredRegionWidth: number,
        measuredRegionHeight: number,
    ): void
    {
        for (let i = 0, j = list.length; i < j; i++)
        {
            const widget = list[i];

            if (widget.getMeasuredWidth() <= measuredRegionWidth
                && widget.getMeasuredHeight() <= measuredRegionHeight
                && widget.getMeasuredWidth() > 0
                && widget.getMeasuredHeight() > 0
                && widget.layoutOptions?.width !== FILL_PARENT
                && widget.layoutOptions?.height !== FILL_PARENT)
            {
                continue;
            }

            if (measuredRegionWidth > 0 && measuredRegionHeight > 0)
            {
                const wm = widget.layoutOptions?.width === FILL_PARENT ? EXACTLY : AT_MOST;
                const hm = widget.layoutOptions?.height === FILL_PARENT ? EXACTLY : AT_MOST;

                widget.measure(measuredRegionWidth, measuredRegionHeight, wm, hm);
            }
        }
    }

    /**
     * Indexes the list of left, top, right, bottom, and center widget lists.
     */
    protected indexRegions(): void
    {
        this.clearRegions();
        const { widgetChildren: children } = this.host;

        for (let i = 0, j = children.length; i < j; i++)
        {
            const widget = children[i];
            const lopt = (widget.layoutOptions || LayoutOptions.DEFAULT) as BorderLayoutOptions;

            const region = lopt.region || REGION_CENTER;

            switch (region)
            {
                case REGION_LEFT: this.leftWidgets.push(widget); break;
                case REGION_TOP: this.topWidgets.push(widget); break;
                case REGION_RIGHT: this.rightWidgets.push(widget); break;
                case REGION_BOTTOM: this.bottomWidgets.push(widget); break;
                default: this.centerWidgets.push(widget);
            }
        }
    }

    /**
     * Clears the left, top, right, bottom, and center widget lists.
     */
    protected clearRegions(): void
    {
        this.leftWidgets.length = 0;
        this.topWidgets.length = 0;
        this.rightWidgets.length = 0;
        this.bottomWidgets.length = 0;
    }

    /**
     * Zeros the measured dimensions.
     */
    protected clearMeasureCache(): void
    {
        this.measuredLeftWidth = 0;
        this.measuredRightWidth = 0;
        this.measuredCenterWidth = 0;
        this.measuredTopHeight = 0;
        this.measuredBottomHeight = 0;
        this.measuredCenterHeight = 0;
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
