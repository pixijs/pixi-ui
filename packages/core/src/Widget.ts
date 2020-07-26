import { DragManager } from './event/DragManager';
import { DragDropController } from './event/DragDropController';
import * as PIXI from 'pixi.js';
import { Insets } from './layout-options/Insets';
import { LayoutOptions, FastLayoutOptions } from './layout-options';
import { MeasureMode, IMeasurable } from './IMeasurable';
import { Stage } from './Stage';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import { EventBroker } from './event';
import { Style } from './Style';
import { Menu } from './Menu';
import { PopupMenu } from './PopupMenu';

const PADDING_PROPERTIES = ['paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom'];

const PADDING_AXIS_PROPERTIES = ['paddingHorizontal', 'paddingVertical'];

export const TEXT_STYLE_PROPERTIES = [
    'fontFamily',
    'fontSize',
    'fontWeight',
    'letterSpacing',
];

/**
 * A widget is a user interface control that renders content inside its prescribed
 * rectangle on the screen.
 *
 * @memberof PUXI
 * @class
 * @extends PIXI.utils.EventEmitter
 * @implements PUXI.IMeasurable
 */
export class Widget extends PIXI.utils.EventEmitter implements IMeasurable
{
    /**
     * The minimum delay between two clicks to not consider them as a double-click.
     */
    public static CLICK_DELAY = 300;

    public readonly insetContainer: PIXI.Container;
    public readonly contentContainer: PIXI.Container;
    public readonly widgetChildren: Widget[];
    public readonly stage: Stage;

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
    private _dropShadow: DropShadowFilter;
    private _layoutDirty: boolean;

    private singleClickTimeout: NodeJS.Timeout;
    private style: Style;
    private styleID: number;
    private contextMenu: Menu;
    private contextPopup: PopupMenu;

    constructor()
    {
        super();

        /**
         * This container owns the background + content of this widget.
         * @member {PIXI.Container}
         * @readonly
         */
        this.insetContainer = new PIXI.Container();

        /**
         * This container holds the content of this widget. Subclasses should add
         * renderable display-objects to this container.
         * @member {PIXI.Container}
         * @readonly
         */
        this.contentContainer = this.insetContainer.addChild(new PIXI.Container());

        /**
         * Children of this widget. Use `WidgetGroup` to position children.
         * @member {PUXI.Widget[]}
         * @readonly
         */
        this.widgetChildren = [];

        /**
         * Stage whose scene graph holds this widget. Once set, this cannot be changed.
         * @member {PUXI.Stage}
         * @readonly
         */
        this.stage = null;

        /**
         * Layout insets of this widget. In normal state, the widget should be in this
         * rectangle inside the parent reference frame.
         * @member {PUXI.Insets}
         * @readonly
         */
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

        this.singleClickTimeout = null;
        this.style = null;
        this.styleID = -1;

        // Use a separate callback function to allow this.on* methods to be reassigned.
        this.insetContainer.on('pointerdown', (e: PIXI.InteractionEvent) => { this.onPointerPress(e); });
        this.insetContainer.on('pointermove', (e: PIXI.InteractionEvent) => { this.onPointerMove(e); });
        this.insetContainer.on('pointerup', (e: PIXI.InteractionEvent) => { this.onPointerRelease(e); });
        this.insetContainer.on('pointerover', (e: PIXI.InteractionEvent) => { this.onPointerEnter(e); });
        this.insetContainer.on('pointerout', (e: PIXI.InteractionEvent) => { this.onPointerExit(e); });
        this.insetContainer.on('rightclick', (e: PIXI.InteractionEvent) => { this.onRightClick(e); });
    }

    /**
     * Update method that is to be overriden. This is called before a `render()`
     * pass on widgets that are dirty.
     *
     * @private
     */
    update(): any
    {
        if (this._layoutDirty)
        {
            console.log('here');
            setTimeout(() =>
            {
                if (this._layoutDirty)
                {
                    this.stage.measureAndLayout();
                }
            }, 0);
        }

        if (this.style && this.styleID !== this.style.dirtyID)
        {
            this.onStyleChange(this.style);
            this.styleID = this.style.dirtyID;
        }
    }

    /**
     * The measured width that is used by the parent's layout manager to place this
     * widget.
     * @member {number}
     */
    get measuredWidth(): number
    {
        return this._measuredWidth;
    }

    /**
     * The measured height that is used by the parent's layout manager to place this
     * widget.
     * @member {number}
     */
    get measuredHeight(): number
    {
        return this._measuredHeight;
    }

    /**
     * Alias for `Widget.measuredWidth`.
     *
     * @returns {number} the measured width
     */
    getMeasuredWidth(): number
    {
        return this._measuredWidth;
    }

    /**
     * Alias for `Widget.measuredHeight`.
     *
     * @returns {number} the measured height
     */
    getMeasuredHeight(): number
    {
        return this._measuredHeight;
    }

    /**
     * Override this method to measure the dimensions for your widget. By default, it
     * will use the natural width/height of this widget's content (`contentContainer`)
     * plus any padding.
     *
     * @param {number} width - width of region provided by parent
     * @param {number} height - height of region provided by parent
     * @param {PUXI.MeasureMode} widthMode - mode in which provided width is to be used
     * @param {PUXI.MeasureMode} heightMode - mode in which provided height is to be used
     */
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

    /**
     * This method calls `Widget.onMeasure` and should not be overriden. It does internal
     * bookkeeping.
     *
     * @param {number} width
     * @param {number} height
     * @param {PUXI.MeasureMode} widthMode
     * @param {PUXI.MeasureMode} heightMode
     */
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
    onLayout(l: number, t: number = l, r: number = l, b: number = t, dirty = true): void
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

        // Don't set width/height on inset, content because that would scale
        // the contents (we don't want that).

        this._layoutDirty = false;
    }

    layout(l: number, t: number = l, r: number = l, b: number = t, dirty = true): void
    {
        this.onLayout(l, t, r, b, dirty);
    }

    /**
     * Use this to specify how you want to layout this widget w.r.t its parent.
     * The specific layout options class depends on which layout you are
     * using in the parent widget.
     *
     * @param {PUXI.LayoutOptions} lopt
     * @returns {Widget} this
     */
    setLayoutOptions(lopt: LayoutOptions): Widget
    {
        this.layoutOptions = lopt;

        return this;
    }

    /**
     * This is invoked when a style is applied on the widget. If you override it, you must pass through the superclass
     * implementation.
     *
     * @param style
     */
    protected onStyleChange(style: Style): void
    {
        const styleData = style.getProperties(
            'backgroundColor',
            'background',
            'elevation',
            'padding',
            'paddingHorizontal',
            'paddingVertical',
            'paddingLeft',
            'paddingTop',
            'paddingRight',
            'paddingBottom',
        );

        // Set background of widget
        if (styleData.background)
        {
            this.setBackground(styleData.background);
        }
        else if (typeof styleData.backgroundColor !== 'undefined')
        {
            this.setBackground(styleData.backgroundColor);
        }

        // Set elevation
        if (typeof styleData.elevation !== 'undefined')
        {
            this.setElevation(styleData.elevation);
        }

        // Set _paddingLeft, _paddingTop, _paddingRight, _paddingBottom
        PADDING_PROPERTIES.forEach((propName, i) =>
        {
            if (typeof styleData[propName] === 'number')
            {
                this[`_${propName}`] = styleData[propName];
            }
            else if (typeof styleData[PADDING_AXIS_PROPERTIES[i % 2]] === 'number')
            {
                this[`_${propName}`] = styleData[PADDING_AXIS_PROPERTIES[i % 2]];
            }
            else if (typeof styleData.padding === 'number')
            {
                this[`_${propName}`] = styleData.padding;
            }
        });

        this.dirty = true;
    }

    /**
     * Handles the pointer-entered event.
     *
     * If you override this method, you must call through to the superclass implementation.
     *
     * @param e - the triggering interaction event
     */
    onPointerEnter(e: PIXI.InteractionEvent): void
    {
        this.onHoverChange(e, true);
    }

    /**
     * Handles the pointer-exited event.
     *
     * If you override this method, you must call through to the superclass implementation.
     *
     * @param e
     */
    onPointerExit(e: PIXI.InteractionEvent): void
    {
        this.onHoverChange(e, false);
    }

    /**
     * Handles the pointer-down event. If you override this method, you must call through to the superclass
     * implementation.
     */
    onPointerPress(e: PIXI.InteractionEvent): void
    {
        return;
    }

    /**
     * Handles the pointer-move event. If you override this method, you must call through to the superclass
     * implementation.
     */
    onPointerMove(e: PIXI.InteractionEvent): void
    {
        return;
    }

    onPointerRelease(e: PIXI.InteractionEvent): void
    {
        if (!this.singleClickTimeout)
        {
            // Invoke onClick after ~300ms only if it isn't a double-click.
            this.singleClickTimeout = setTimeout(() =>
            {
                this.singleClickTimeout = null;
            }, Widget.CLICK_DELAY);

            this.onClick(e);
        }
        else
        {
            clearTimeout(this.singleClickTimeout);

            this.singleClickTimeout = null;

            // Invoke onDoubleClick after the onPointerPress handler.
            setTimeout(() => { this.onDoubleClick(e); }, 0);
        }

        return;
    }

    /**
     * Event handler for change in the hover state.
     *
     * @param e
     * @param hover
     */
    onHoverChange(e: PIXI.InteractionEvent, hover: boolean): void
    {
        return;
    }

    onClick(e: PIXI.InteractionEvent): void
    {
        return;
    }

    onDoubleClick(e: PIXI.InteractionEvent): void
    {
        return;
    }

    onRightClick(e: PIXI.InteractionEvent): void
    {
        console.log('RIGHT_CLICK');
        e.data.originalEvent.preventDefault();

        if (this.contextMenu)
        {
            if (!this.contextPopup)
            {
                //  this.contextPopup = new PopupMenu(this.contextMenu);
            }

            const location = e.data.getLocalPosition(this.stage);

            //  this.openPopupMenu(location.x, location.y);
        }

        return;
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

    /**
     * Padding on left side.
     * @member {number}
     */
    get paddingLeft(): number
    {
        return this._paddingLeft;
    }
    set paddingLeft(val: number)
    {
        this._paddingLeft = val;
        this.dirty = true;
    }

    /**
     * Padding on top side.
     * @member {number}
     */
    get paddingTop(): number
    {
        return this._paddingTop;
    }
    set paddingTop(val: number)
    {
        this._paddingTop = val;
        this.dirty = true;
    }

    /**
     * Padding on right side.
     * @member {number}
     */
    get paddingRight(): number
    {
        return this._paddingRight;
    }
    set paddingRight(val: number)
    {
        this._paddingRight = val;
        this.dirty = true;
    }

    /**
     * Padding on bottom side.
     * @member {number}
     */
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
     * @readonly
     */
    get paddingHorizontal(): number
    {
        return this._paddingLeft + this._paddingRight;
    }

    /**
     * Sum of top & bottom padding.
     * @member {number}
     * @readonly
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
     * @readonly
     */
    get width(): number
    {
        return this._width;
    }

    /**
     * Layout height of this widget.
     * @member {number}
     * @readonly
     */
    get height(): number
    {
        return this._height;
    }

    /**
     * Layout width of this widget's content, which is the width minus horizontal padding.
     * @member {number}
     * @readonly
     */
    get contentWidth(): number
    {
        return this._width - this.paddingHorizontal;
    }

    /**
     * Layout height of this widget's content, which is the height minus vertical padding.
     * @member {number}
     * @readonly
     */
    get contentHeight(): number
    {
        return this._height - this.paddingVertical;
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
        if (this.background)
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
            bg.width = this.width;
            bg.height = this.height;
            this.insetContainer.addChildAt(bg, 0);
        }

        if (bg && this._elevation && this._dropShadow)
        {
            if (!this.background.filters)
            {
                this.background.filters = [];
            }

            this.background.filters.push(this._dropShadow);
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
     * Set the context-menu to be shown on right-clicks.
     *
     * This feature is not released yet, i.e. does not work!
     *
     * @param menu
     * @alpha
     */
    setContextMenu(menu: Menu): void
    {
        this.contextMenu = menu;
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
            if (!this.background)
            {
                return this;
            }

            const i = this.background.filters.indexOf(this._dropShadow);

            if (i > 0)
            {
                this.background.filters.splice(i, 1);
            }
        }
        else if (val > 0)
        {
            if (!this._dropShadow)
            {
                if (this.background && !this.background.filters)
                {
                    this.background.filters = [];
                }

                this._dropShadow = new DropShadowFilter({ distance: val });

                if (this.background)
                {
                    this.background.filters.push(this._dropShadow);
                }
            }

            this._dropShadow.distance = val;
        }

        return this;
    }

    /**
     * Set the style applied on this widget. To unset a style, simply pass {@code null}.
     *
     * @param style
     */
    setStyle(style?: Style): this
    {
        this.style = style;
        this.styleID = -1;

        return this;
    }

    /**
     * Will trigger a full layout pass next animation frame.
     */
    requestLayout(): void
    {
        this._layoutDirty = true;
    }

    /**
     * Adds the widgets as children of this one.
     *
     * @param {PUXI.Widget[]} widgets
     * @returns {Widget} - this widget
     */
    addChild(...widgets: Widget[]): Widget
    {
        for (let i = 0; i < widgets.length; i++)
        {
            const widget = widgets[i];

            if (widget.parent)
            {
                widget.parent.removeChild(widget);
            }

            widget.parent = this;
            this.contentContainer.addChild(widget.insetContainer);
            this.widgetChildren.push(widget);
        }

        return this;
    }

    /**
     * Orphans the widgets that are children of this one.
     *
     * @param {PUXI.Widget[]} widgets
     * @returns {Widget} - this widget
     */
    removeChild(...widgets: Widget[]): Widget
    {
        for (let i = 0; i < widgets.length; i++)
        {
            const widget = widgets[i];
            const index = this.widgetChildren.indexOf(widget);

            if (index !== -1)
            {
                widget.insetContainer.parent.removeChild(widget.insetContainer);
                this.widgetChildren.splice(index, 1);
                widget.parent = null;
            }
        }

        return this;
    }

    private openPopupMenu(x: number, y: number): void
    {
        const stage = this.stage;
        const lopt = this.contextPopup.layoutOptions as FastLayoutOptions;

        lopt.x = x;
        lopt.y = y;

        this.stage.addChild(this.contextPopup);
    }

    private closePopupMenu(): void
    {
        this.stage.removeChild(this.contextPopup);
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

        dnd.onDragStart = (e: PIXI.InteractionEvent): void =>
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

        dnd.onDragMove = (e: PIXI.InteractionEvent, offset: PIXI.Point): void =>
        {
            if (this.isDragging)
            {
                dragPosition.set(realPosition.x + offset.x, realPosition.y + offset.y);

                insetContainer.x = dragPosition.x;
                insetContainer.y = dragPosition.y;

                this.emit('draggablemove', e);
            }
        };

        dnd.onDragEnd = (e: PIXI.InteractionEvent): void =>
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
                    if (parent.container != item.container.parent) { parent.addChild(item); }
                }
            };

            container.on('mouseup', this.onDrop);
            container.on('touchend', this.onDrop);
        }
    }

    /**
     * Creates a widget that holds the display-object as its content. If `content` is
     * a `PUXI.Widget`, then it will be returned.
     * @param {PIXI.Container | Widget} content
     * @static
     */
    static fromContent(content: PIXI.Container | Widget): Widget
    {
        if (content instanceof Widget)
        {
            return content;
        }

        const widget = new Widget();

        widget.contentContainer.addChild(content);

        return widget;
    }

    /**
     * Easy utility to resolve measured dimension.
     * @param {number} natural - your widget's natural dimension
     * @param {number} limit - width/height limit passed by parent
     * @param {PUXI.MeasureMode} mode - measurement mode passed by parent
     */
    static resolveMeasuredDimen(natural: number, limit: number, mode: MeasureMode): number
    {
        if (mode === MeasureMode.EXACTLY)
        {
            return limit;
        }
        else if (mode === MeasureMode.AT_MOST)
        {
            return Math.min(limit, natural);
        }

        return natural;
    }
}
