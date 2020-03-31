import { Widget } from './Widget';
import * as PIXI from 'pixi.js';
import { MeasureMode } from './IMeasurable';
import { LayoutOptions, FastLayoutOptions } from './layout-options';
import { FocusController, Controller, CheckBoxGroupController } from './ctl';

/**
 * The stage is the root node in the PUXI scene graph. It does not provide a
 * sophisticated layout model; however, it will accept constraints defined by
 * `PUXI.FastLayoutOptions` or `PUXI.LayoutOptions` in its children.
 *
 * The stage is not a `PUXI.Widget` and its dimensions are always fixed.
 *
 * @memberof PUXI
 * @class
 * @extends PIXI.Container
 */
export class Stage extends PIXI.Container
{
    __width: number;
    __height: number;
    minWidth: number;
    minHeight: number;
    initialized: boolean;
    widgetChildren: Widget[];

    stage: any;

    private _checkBoxGroupCtl: CheckBoxGroupController;
    private _focusCtl: FocusController;

    protected background: PIXI.Container;

    /**
     * @param {number} width - width of the stage
     * @param {number} height - height of the stage
     */
    constructor(width: number, height: number)
    {
        super();

        this.__width = width;
        this.__height = height;
        this.minWidth = 0;
        this.minHeight = 0;

        this.widgetChildren = [];
        this.interactive = true;
        this.stage = this;
        this.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
        this.initialized = true;
        this.resize(width, height);

        this._checkBoxGroupCtl = new Stage.CHECK_BOX_GROUP_CONTROLLER(this);
        this._focusCtl = new Stage.FOCUS_CONTROLLER(this);
    }

    public measureAndLayout(): void
    {
        if (this.background)
        {
            this.background.width = this.width;
            this.background.height = this.height;
        }

        for (let i = 0, j = this.widgetChildren.length; i < j; i++)
        {
            const widget = this.widgetChildren[i];
            const lopt = (widget.layoutOptions || LayoutOptions.DEFAULT) as FastLayoutOptions;

            const widthMeasureMode = lopt.width < LayoutOptions.MAX_DIMEN
                ? MeasureMode.EXACTLY
                : MeasureMode.AT_MOST;
            const heightMeasureMode = lopt.height < LayoutOptions.MAX_DIMEN
                ? MeasureMode.EXACTLY
                : MeasureMode.AT_MOST;
            const loptWidth = (Math.abs(lopt.width) < 1) ? lopt.width * this.width : lopt.width;
            const loptHeight = (Math.abs(lopt.height) < 1) ? lopt.height * this.height : lopt.height;

            widget.measure(
                widthMeasureMode === MeasureMode.EXACTLY ? loptWidth : this.width,
                heightMeasureMode === MeasureMode.EXACTLY ? loptHeight : this.height,
                widthMeasureMode,
                heightMeasureMode);

            let x = lopt.x ? lopt.x : 0;
            let y = lopt.y ? lopt.y : 0;

            if (Math.abs(x) < 1)
            {
                x *= this.width;
            }
            if (Math.abs(y) < 1)
            {
                y *= this.height;
            }

            const anchor = lopt.anchor || FastLayoutOptions.DEFAULT_ANCHOR;
            const l = x - (anchor.x * widget.getMeasuredWidth());
            const t = y - (anchor.y * widget.getMeasuredHeight());

            widget.layout(l, t,
                l + widget.getMeasuredWidth(),
                t + widget.getMeasuredHeight(),
                true);
        }
    }

    getBackground(): PIXI.Container
    {
        return this.background;
    }

    setBackground(bg: PIXI.Container): void
    {
        if (this.background)
        {
            super.removeChild(this.background);
        }

        this.background = bg;

        if (bg)
        {
            super.addChildAt(bg, 0);

            this.background.width = this.width;
            this.background.height = this.height;
        }
    }

    private update(widgets: Widget[]): void
    {
        this.emit('preupdate', this);

        for (let i = 0, j = widgets.length; i < j; i++)
        {
            const widget = widgets[i];

            widget.stage = this;

            if (!widget.initialized)
            {
                widget.initialize();
            }

            this.update(widget.widgetChildren);
            widget.update();
        }

        this.emit('postupdate', this);
    }

    render(renderer: PIXI.Renderer): void
    {
        this.update(this.widgetChildren);
        super.render(renderer);
    }

    addChild(UIObject: Widget): void
    {
        const argumentLenght = arguments.length;

        if (argumentLenght > 1)
        {
            for (let i = 0; i < argumentLenght; i++)
            {
                this.addChild(arguments[i]);
            }
        }
        else
        {
            if (UIObject.parent)
            {
                UIObject.parent.removeChild(UIObject);
            }

            UIObject.parent = this;
            this.widgetChildren.push(UIObject);
            super.addChild(UIObject.insetContainer);
            // UIObject.updatesettings(true);
        }

        this.measureAndLayout();
    }

    removeChild(UIObject: Widget): void
    {
        const argumentLenght = arguments.length;

        if (argumentLenght > 1)
        {
            for (let i = 0; i < argumentLenght; i++)
            {
                this.removeChild(arguments[i]);
            }
        }
        else
        {
            super.removeChild(UIObject.insetContainer);

            const index = this.widgetChildren.indexOf(UIObject);

            if (index !== -1)
            {
                this.children.splice(index, 1);
                UIObject.parent = null;
            }
        }

        this.measureAndLayout();
    }

    resize(width?: number, height?: number): void
    {
        this.width = width;
        this.height = height;

        if (this.hitArea)
        {
            (this.hitArea as PIXI.Rectangle).width = this.__width;
            (this.hitArea as PIXI.Rectangle).height = this.__height;
        }

        this.measureAndLayout();
    }

    get width(): number
    {
        return this.__width;
    }
    set width(val: number)
    {
        if (!isNaN(val))
        {
            this.__width = val;
            this.resize();
        }
    }

    get height(): number
    {
        return this.__height;
    }
    set height(val: number)
    {
        if (!isNaN(val))
        {
            this.__height = val;
            this.resize();
        }
    }

    /**
     * The check box group controller for check boxes in this stage.
     *
     * @member {PUXI.CheckBoxGroupController}
     */
    get checkBoxGroupController(): CheckBoxGroupController
    {
        return this._checkBoxGroupCtl;
    }

    /**
     * The focus controller for widgets in this stage. You can use this to bring a
     * widget into focus.
     *
     * @member {PUXI.FocusController}
     */
    get focusController(): FocusController
    {
        return this._focusCtl;
    }

    /**
     * Use this to override which class is used for the check box group controller. It
     * should extend from `PUXI.CheckBoxGroupController`.
     *
     * @static
     */
    static CHECK_BOX_GROUP_CONTROLLER: typeof CheckBoxGroupController = CheckBoxGroupController;

    /**
     * Use this to override which class is used for the focus controller. It should
     * extend from `PUXI.FocusController`.
     *
     * @static
     */
    static FOCUS_CONTROLLER: typeof FocusController = FocusController;
}
