import { DragManager } from './event/DragManager';
import { DragDropController } from './event/DragDropController';
import * as PIXI from 'pixi.js';
import { Insets } from './layout-options/Insets';
import { LayoutOptions } from './layout-options';
import { MeasureMode, IMeasurable } from './IMeasurable';
import { Stage } from './Stage';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import { EventBroker } from './event';

/**
 * A widget is a user interface control that renders content inside its prescribed
 * rectangle on the screen.
 *
 * @namespace PUXI
 * @class
 * @extends PIXI.utils.EventEmitter
 * @implements PUXI.IMeasurable
 */
export abstract class Widget extends PIXI.utils.EventEmitter implements IMeasurable
{
    insetContainer: PIXI.Container;
    contentContainer: PIXI.Container;
    widgetChildren: Widget[];
    stage: Stage;

    initialized: boolean;
    protected dragInitialized: boolean;
    protected dropInitialized: boolean;
    protected isDragging: boolean;

    private draggable: boolean;
    private droppable: boolean;

    dirty: boolean;
    _oldWidth: number;
    _oldHeight: number;
    pixelPerfect: boolean;

    parent: Widget;
    _parentWidth: number;
    _parentHeight: number;

    public layoutMeasure: Insets;
    public layoutOptions: LayoutOptions;

    protected tint: number;
    protected blendMode: PIXI.BLEND_MODES;
    protected background: PIXI.Container;

    protected _measuredWidth: number;
    protected _measuredHeight: number;

    private _eventBroker: EventBroker;

    private _paddingLeft: number;
    private _paddingTop: number;
    private _paddingRight: number;
    private _paddingBottom: number;
    private _width: number;
    private _height: number;
    private _elevation: number;
    private _dropShadow: PIXI.filters.DropShadowFilter;

    constructor()
    {
        super();

        this.insetContainer = new PIXI.Container();
        this.contentContainer = this.insetContainer.addChild(new PIXI.Container());
        this.widgetChildren = [];
        this.stage = null;
        this.layoutMeasure = new Insets();

        this.initialized = false;
        this.dragInitialized = false;
        this.dropInitialized = false;

        this.dirty = true;
        this._oldWidth = -1;
        this._oldHeight = -1;
        this.pixelPerfect = true;

        this._paddingLeft = 0;
        this._paddingTop = 0;
        this._paddingRight = 0;
        this._paddingBottom = 0;
        this._elevation = 0;

        this.tint = 0;
        this.blendMode = PIXI.BLEND_MODES.NORMAL;

        this.draggable = false;
        this.droppable = false;
    }

    /**
     * Update method (override from other UIObjects)
     *
     * @private
     */
    abstract update ();

    get measuredWidth(): number
    {
        return this._measuredWidth;
    }

    get measuredHeight(): number
    {
        return this._measuredHeight;
    }

    getMeasuredWidth(): number
    {
        return this._measuredWidth;
    }

    getMeasuredHeight(): number
    {
        return this._measuredHeight;
    }

    onMeasure(width: number, height: number, widthMode: MeasureMode, heightMode: MeasureMode): void
    {
        const naturalWidth = this.contentContainer.width + this.paddingHorizontal;
        const naturalHeight = this.contentContainer.height + this.paddingVertical;

        switch (widthMode)
        {
            case MeasureMode.EXACTLY:
                this._measuredWidth = width;
                break;
            case MeasureMode.UNBOUNDED:
                this._measuredWidth = naturalWidth;
                break;
            case MeasureMode.AT_MOST:
                this._measuredWidth = Math.min(width, naturalWidth);
                break;
        }

        switch (heightMode)
        {
            case MeasureMode.EXACTLY:
                this._measuredHeight = height;
                break;
            case MeasureMode.UNBOUNDED:
                this._measuredHeight = naturalHeight;
                break;
            case MeasureMode.AT_MOST:
                this._measuredHeight = Math.min(height, naturalHeight);
                break;
        }
    }

    measure(width: number, height: number, widthMode: MeasureMode, heightMode: MeasureMode): void
    {
        this.onMeasure(width, height, widthMode, heightMode);
    }

    /**
     * This method should set the frame in which rendering will occur and lay out
     * child widgets in that frame.
     *
     * @param l
     * @param t
     * @param r
     * @param b
     * @param dirty
     * @protected
     */
    layout(l: number, t: number = l, r: number = l, b: number = t, dirty = true): void
    {
        this.layoutMeasure.left = l;
        this.layoutMeasure.top = t;
        this.layoutMeasure.right = r;
        this.layoutMeasure.bottom = b;

        this._width = r - l;
        this._height = b - t;

        if (this.background)
        {
            this.background.x = 0;
            this.background.y = 0;
            this.background.width = r - l;
            this.background.height = b - t;
        }

        // Update parallel PIXI node too!
        this.insetContainer.x = l;
        this.insetContainer.y = t;
        this.contentContainer.x = this._paddingLeft;
        this.contentContainer.y = this._paddingTop;
        // this.container.width = r - l;
        // this.container.height = b - t;
    }

    setLayoutOptions(lopt: LayoutOptions): Widget
    {
        this.layoutOptions = lopt;

        return this;
    }

    /**
     * The event broker for this widget that holds all the event managers. This can
     * be used to start/stop clicks, drags, scrolls and configure how those events
     * are handled/interpreted.
     * @member PUXI.EventBroker
     */
    get eventBroker(): EventBroker
    {
        if (!this._eventBroker)
        {
            this._eventBroker = new EventBroker(this);
        }

        return this._eventBroker;
    }

    get paddingLeft(): number
    {
        return this._paddingLeft;
    }
    set paddingLeft(val: number)
    {
        this._paddingLeft = val;
        this.dirty = true;
    }

    get paddingTop(): number
    {
        return this._paddingTop;
    }
    set paddingTop(val: number)
    {
        this._paddingTop = val;
        this.dirty = true;
    }

    get paddingRight(): number
    {
        return this._paddingRight;
    }
    set paddingRight(val: number)
    {
        this._paddingRight = val;
        this.dirty = true;
    }

    get paddingBottom(): number
    {
        return this._paddingBottom;
    }
    set paddingBottom(val: number)
    {
        this._paddingBottom = val;
        this.dirty = true;
    }

    /**
     * Sum of left & right padding.
     * @member {number}
     */
    get paddingHorizontal(): number
    {
        return this._paddingLeft + this._paddingRight;
    }

    /**
     * Sum of top & bottom padding.
     * @member {number}
     */
    get paddingVertical(): number
    {
        return this._paddingTop + this._paddingBottom;
    }

    /**
     * Whether this widget is interactive in the PixiJS scene graph.
     * @member {boolean}
     */
    get interactive(): boolean
    {
        return this.insetContainer.interactive;
    }
    set interactive(val: boolean)
    {
        this.insetContainer.interactive = true;
        this.contentContainer.interactive = true;
    }

    /**
     * Layout width of this widget.
     * @member {number}
     */
    get width(): number
    {
        return this._width;
    }

    /**
     * Layout height of this widget.
     * @member {number}
     */
    get height(): number
    {
        return this._height;
    }

    /**
     * Alpha of this widget & its contents.
     * @member {number}
     */
    get alpha(): number
    {
        return this.insetContainer.alpha;
    }
    set alpha(val: number)
    {
        this.insetContainer.alpha = val;
    }

    /**
     * Sets the padding values.
     *
     * To set all paddings to one value:
     * ```
     * widget.setPadding(8);
     * ```
     *
     * To set horizontal & vertical padding separately:
     * ```
     * widget.setPadding(4, 12);
     * ```
     *
     * @param {number}[l=0] - left padding
     * @param {number}[t=l] - top padding (default is equal to left padding)
     * @param {number}[r=l] - right padding (default is equal to right padding)
     * @param {number}[b=t] - bottom padding (default is equal to top padding)
     */
    setPadding(l: number, t: number = l, r: number = l, b: number = t): Widget
    {
        this._paddingLeft = l;
        this._paddingTop = t;
        this._paddingRight = r;
        this._paddingBottom = b;
        this.dirty = true;

        return this;
    }

    /**
     * @returns {PIXI.Container} - the background display-object
     */
    getBackground(): PIXI.Container
    {
        return this.background;
    }

    /**
     * The background of a widget is a `PIXI.DisplayObject` that is rendered before
     * all of its children.
     *
     * @param {PIXI.Container | number | string} bg - the background display-object or
     *     a color that will be used to generate a `PIXI.Graphics` as the background.
     */
    setBackground(bg: PIXI.Container | number | string): Widget
    {
        if (!this.background)
        {
            this.insetContainer.removeChild(this.background);
        }

        if (typeof bg === 'string')
        {
            bg = PIXI.utils.string2hex(bg);
        }
        if (typeof bg === 'number')
        {
            bg = new PIXI.Graphics()
                .beginFill(bg)
                .drawRect(0, 0, 1, 1)
                .endFill();
        }

        this.background = bg;

        if (bg)
        {
            this.insetContainer.addChildAt(bg, 0);
        }

        return this;
    }

    /**
     * @returns {number} the alpha on the background display-object.
     */
    getBackgroundAlpha(): number
    {
        return this.background ? this.background.alpha : 1;
    }

    /**
     * This can be used to set the alpha on the _background_ of this widget. This
     * does not affect the widget's contents nor individual components of the
     * background display-object.
     *
     * @param {number} val - background alpha
     */
    setBackgroundAlpha(val: number): Widget
    {
        if (!this.background)
        {
            this.setBackground(0xffffff);
        }

        this.background.alpha = val;

        return this;
    }

    /**
     * @return {number} the elevation set on this widget
     */
    getElevation(): number
    {
        return this._elevation;
    }

    /**
     * This can be used add a drop-shadow that will appear to raise this widget by
     * the given elevation against its parent.
     *
     * @param {number} val - elevation to use. 2px is good for most widgets.
     */
    setElevation(val: number): Widget
    {
        this._elevation = val;

        if (val === 0 && this._dropShadow)
        {
            const i = this.insetContainer.filters.indexOf(this._dropShadow);

            if (i > 0)
            {
                this.insetContainer.filters.splice(i, 1);
            }
        }
        else if (val > 0)
        {
            if (!this._dropShadow)
            {
                if (!this.insetContainer.filters)
                {
                    this.insetContainer.filters = [];
                }

                this._dropShadow = new DropShadowFilter({ distance: val });
                this.insetContainer.filters.push(this._dropShadow);
            }

            this._dropShadow.distance = val;
        }

        return this;
    }

    addChild(UIObject): Widget
    {
        const argumentsLength = arguments.length;

        if (argumentsLength > 1)
        {
            for (let i = 0; i < argumentsLength; i++)
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
            this.contentContainer.addChild(UIObject.insetContainer);
            this.widgetChildren.push(UIObject);
        }

        return this;
    }

    removeChild(UIObject): void
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
            const index = this.widgetChildren.indexOf(UIObject);

            if (index !== -1)
            {
                const oldUIParent = UIObject.parent;
                const oldParent = UIObject.container.parent;

                UIObject.insetContainer.parent.removeChild(UIObject.insetContainer);
                this.widgetChildren.splice(index, 1);
                UIObject.parent = null;

                // oldParent._recursivePostUpdateTransform();
            }
        }
    }

    /**
     * Makes this widget `draggable`.
     */
    makeDraggable(): Widget
    {
        this.draggable = true;

        if (this.initialized)
        {
            this.initDraggable();
        }

        return this;
    }

    /**
     * Makes this widget not `draggable`.
     */
    clearDraggable(): void
    {
        if (this.dragInitialized)
        {
            this.dragInitialized = false;
            (this.eventBroker.dnd as DragManager).stopEvent();
        }
    }

    /**
     * Widget initialization related to the stage. This method should always call
     * `super.initialize()`.
     *
     * This method expects `stage` to be set before calling it. This is handled
     * by the `Stage` itself.
     *
     * This will set `initialized` to true. If it was already set to true, it _should
     * do nothing_.
     *
     * @protected
     */
    initialize(): void
    {
        if (this.initialized)
        {
            return;
        }

        if (this.draggable)
        {
            this.initDraggable();
        }
        if (this.droppable)
        {
            this.initDroppable();
        }

        this.initialized = true;
    }

    private initDraggable(): void
    {
        if (this.dragInitialized)
        {
            return;
        }

        this.dragInitialized = true;

        const realPosition = new PIXI.Point();
        const dragPosition = new PIXI.Point();

        const dnd: DragManager = this.eventBroker.dnd as DragManager;
        const { insetContainer } = this;

        dnd.onDragStart = (e: PIXI.interaction.InteractionEvent): void =>
        {
            const added = DragDropController.add(this, e);

            if (!this.isDragging && added)
            {
                this.isDragging = true;
                insetContainer.interactive = false;
                realPosition.copyFrom(insetContainer.position);

                this.emit('draggablestart', e);
            }
        };

        dnd.onDragMove = (e: PIXI.interaction.InteractionEvent, offset: PIXI.Point): void =>
        {
            if (this.isDragging)
            {
                dragPosition.set(realPosition.x + offset.x, realPosition.y + offset.y);

                insetContainer.x = dragPosition.x;
                insetContainer.y = dragPosition.y;

                this.emit('draggablemove', e);
            }
        };

        dnd.onDragEnd = (e: PIXI.interaction.InteractionEvent): void =>
        {
            if (this.isDragging)
            {
                this.isDragging = false;
                DragDropController.getItem(this);

                // Return to container after 0ms if not picked up by a droppable
                setTimeout((): void =>
                {
                    this.insetContainer.interactive = true;
                    this.insetContainer.position.copyFrom(realPosition);

                    this.emit('draggableend', e);
                }, 0);
            }
        };
    }

    /**
     * Makes this widget `droppable`.
     */
    makeDroppable(): Widget
    {
        this.droppable = true;

        if (this.initialized)
        {
            this.initDroppable();
        }

        return this;
    }

    protected onDrop: (e: PIXI.interaction.InteractionEvent) => void;

    /**
     * Makes this widget not `droppable`.
     */
    clearDroppable(): void
    {
        if (this.dropInitialized)
        {
            this.dropInitialized = false;
            this.contentContainer.removeListener('mouseup', this.onDrop);
            this.contentContainer.removeListener('touchend', this.onDrop);
        }
    }

    private initDroppable(): void
    {
        if (!this.dropInitialized)
        {
            this.dropInitialized = true;
            const container = this.contentContainer;

            this.contentContainer.interactive = true;

            this.onDrop = (event): void =>
            {
                const item = DragDropController.getEventItem(event, this.dropGroup);

                if (item && item.isDragging)
                {
                    item.isDragging = false;
                    item.insetContainer.interactive = true;
                    const parent = this.droppableReparent !== null ? this.droppableReparent : self;

                    parent.container.toLocal(item.container.position, item.container.parent, item);
                    if (parent.container != item.container.parent)
                    { parent.addChild(item); }
                }
            };

            container.on('mouseup', this.onDrop);
            container.on('touchend', this.onDrop);
        }
    }
}