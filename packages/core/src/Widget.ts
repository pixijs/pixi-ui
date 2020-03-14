import { UISettings } from './UISettings';
import { DragEvent } from './Interaction/DragEvent';
import { DragDropController } from './Interaction/DragDropController';
import * as PIXI from 'pixi.js';
import { Insets } from './layout-options/Insets';
import { LayoutOptions } from './layout-options';
import { MeasureMode, IMeasurable } from './IMeasurable';

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
    setting: UISettings;
    widgetChildren: Widget[];
    stage: any;

    initialized: boolean;
    dragInitialized: boolean;
    dropInitialized: boolean;
    dragging: boolean;
    dirty: boolean;
    _oldWidth: number;
    _oldHeight: number;
    pixelPerfect: boolean;

    _width: number;
    _height: number;
    _minWidth: number;
    _minHeight: number;
    _maxWidth: number;
    _maxHeight: number;
    _anchorLeft: number;
    _anchorRight: number;
    _anchorTop: number;
    _anchorBottom: number;
    _left: number;
    _right: number;
    _top: number;
    _bottom: number;

    _dragPosition: any;
    parent: Widget;
    _parentWidth: number;
    _parentHeight: number;

    protected _measuredWidth: number;
    protected _measuredHeight: number;
    public layoutMeasure: Insets;
    public layoutOptions: LayoutOptions;

    private background: PIXI.Container;
    private _paddingLeft: number;
    private _paddingTop: number;
    private _paddingRight: number;
    private _paddingBottom: number;

    constructor(width: number, height: number)
    {
        super();

        this.insetContainer = new PIXI.Container();
        this.contentContainer = this.insetContainer.addChild(new PIXI.Container());
        this.setting = new UISettings();
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

        if (width && isNaN(width) && width.indexOf('%') != -1)
        {
            this.setting.widthPct = parseFloat(width.replace('%', '')) * 0.01;
        }
        else
        {
            this.setting.widthPct = null;
        }

        if (height && isNaN(height) && height.indexOf('%') != -1)
        { this.setting.heightPct = parseFloat(height.replace('%', '')) * 0.01; }
        else
        {
            this.setting.heightPct = null;
        }

        this.setting.width = width || 0;
        this.setting.height = height || 0;

        // actual values
        this._width = 0;
        this._height = 0;
        this._minWidth = null;
        this._minHeight = null;
        this._maxWidth = null;
        this._maxHeight = null;
        this._anchorLeft = null;
        this._anchorRight = null;
        this._anchorTop = null;
        this._anchorBottom = null;
        this._left = null;
        this._right = null;
        this._top = null;
        this._bottom = null;

        this._paddingLeft = 0;
        this._paddingTop = 0;
        this._paddingRight = 0;
        this._paddingBottom = 0;

        this._dragPosition = null; // used for overriding positions if tweens is playing
    }

    /**
     * Renders the object using the WebGL renderer
     *
     * @private
     */
    protected updatesettings(updateChildren: boolean, updateParent?: boolean): void
    {
        if (!this.initialized)
        {
            if (this.parent && this.parent.stage && this.parent.initialized)
            {
                this.initialize();
            }
            else
            {
                return;
            }
        }

        if (updateParent)
        {
            this.updateParent();
        }

        this.baseupdate();
        this.update();

        if (updateChildren)
        {
            this.updateChildren();
        }
    }

    /**
     * Update method (override from other UIObjects)
     *
     * @private
     */
    abstract update ();

    /**
     * Updates the parent
     *
     * @private
     */
    updateParent(): void
    {
        if (this.parent)
        {
            if (this.parent.updatesettings)
            {
                this.parent.updatesettings(false, true);
            }
        }
    }

    /**
     * Updates the UIObject with all base settings
     *
     * @private
     */
    protected baseupdate(): void
    {
    // return if parent size didnt change
        if (this.parent)
        {
            let parentHeight; let
                parentWidth;

            // transform convertion (% etc)
            this.dirty = true;
            this._width = this.actual_width;
            this._height = this.actual_height;
            this._minWidth = this.actual_minWidth;
            this._minHeight = this.actual_minHeight;
            this._maxWidth = this.actual_maxWidth;
            this._maxHeight = this.actual_maxHeight;
            this._anchorLeft = this.actual_anchorLeft;
            this._anchorRight = this.actual_anchorRight;
            this._anchorTop = this.actual_anchorTop;
            this._anchorBottom = this.actual_anchorBottom;
            this._left = this.actual_left;
            this._right = this.actual_right;
            this._top = this.actual_top;
            this._bottom = this.actual_bottom;
            this._parentWidth = parentWidth = this.parent._width;
            this._parentHeight = parentHeight = this.parent._height;
            this.dirty = false;

            let pivotXOffset = this.pivotX * this._width;
            let pivotYOffset = this.pivotY * this._height;

            if (this.pixelPerfect)
            {
                pivotXOffset = Math.round(pivotXOffset);
                pivotYOffset = Math.round(pivotYOffset);
            }

            if (this.horizontalAlign === null)
            {
            // get anchors (use left right if conflict)
                if (this._anchorLeft !== null && this._anchorRight === null && this._right !== null)
                { this._anchorRight = this._right; }
                else if (this._anchorLeft === null && this._anchorRight !== null && this._left !== null)
                { this._anchorLeft = this._left; }
                else if (this._anchorLeft === null && this._anchorRight === null && this._left !== null && this._right !== null)
                {
                    this._anchorLeft = this._left;
                    this._anchorRight = this._right;
                }

                const useHorizontalAnchor = this._anchorLeft !== null || this._anchorRight !== null;
                const useLeftRight = !useHorizontalAnchor && (this._left !== null || this._right !== null);

                if (useLeftRight)
                {
                    if (this._left !== null)
                    { this.contentContainer.position.x = this._left; }
                    else if (this._right !== null)
                    { this.contentContainer.position.x = parentWidth - this._right; }
                }
                else if (useHorizontalAnchor)
                {
                    if (this._anchorLeft !== null && this._anchorRight === null)
                    { this.contentContainer.position.x = this._anchorLeft; }
                    else if (this._anchorLeft === null && this._anchorRight !== null)
                    { this.contentContainer.position.x = parentWidth - this._width - this._anchorRight; }
                    else if (this._anchorLeft !== null && this._anchorRight !== null)
                    {
                        this.contentContainer.position.x = this._anchorLeft;
                        this._width = parentWidth - this._anchorLeft - this._anchorRight;
                    }
                    this.contentContainer.position.x += pivotXOffset;
                }
                else
                {
                    this.contentContainer.position.x = 0;
                }
            }

            if (this.verticalAlign === null)
            {
            // get anchors (use top bottom if conflict)
                if (this._anchorTop !== null && this._anchorBottom === null && this._bottom !== null)
                { this._anchorBottom = this._bottom; }
                if (this._anchorTop === null && this._anchorBottom !== null && this._top !== null)
                { this._anchorTop = this._top; }

                const useVerticalAnchor = this._anchorTop !== null || this._anchorBottom !== null;
                const useTopBottom = !useVerticalAnchor && (this._top !== null || this._bottom !== null);

                if (useTopBottom)
                {
                    if (this._top !== null)
                    { this.contentContainer.position.y = this._top; }
                    else if (this._bottom !== null)
                    { this.contentContainer.position.y = parentHeight - this._bottom; }
                }
                else if (useVerticalAnchor)
                {
                    if (this._anchorTop !== null && this._anchorBottom === null)
                    { this.contentContainer.position.y = this._anchorTop; }
                    else if (this._anchorTop === null && this._anchorBottom !== null)
                    { this.contentContainer.position.y = parentHeight - this._height - this._anchorBottom; }
                    else if (this._anchorTop !== null && this._anchorBottom !== null)
                    {
                        this.contentContainer.position.y = this._anchorTop;
                        this._height = parentHeight - this._anchorTop - this._anchorBottom;
                    }
                    this.contentContainer.position.y += pivotYOffset;
                }
                else
                {
                    this.contentContainer.position.y = 0;
                }
            }

            // min/max sizes
            if (this._maxWidth !== null && this._width > this._maxWidth) this._width = this._maxWidth;
            if (this._width < this._minWidth) this._width = this._minWidth;

            if (this._maxHeight !== null && this._height > this._maxHeight) this._height = this._maxHeight;
            if (this._height < this._minHeight) this._height = this._minHeight;

            // pure vertical/horizontal align
            if (this.horizontalAlign !== null)
            {
                if (this.horizontalAlign == 'center')
                {
                    this.contentContainer.position.x = parentWidth * 0.5 - this._width * 0.5;
                }
                else if (this.horizontalAlign == 'right')
                {
                    this.contentContainer.position.x = parentWidth - this._width;
                }
                else
                {
                    this.contentContainer.position.x = 0;
                }

                this.contentContainer.position.x += pivotXOffset;
            }
            if (this.verticalAlign !== null)
            {
                if (this.verticalAlign == 'middle')
                {
                    this.contentContainer.position.y = parentHeight * 0.5 - this._height * 0.5;
                }
                else if (this.verticalAlign == 'bottom')
                {
                    this.contentContainer.position.y = parentHeight - this._height;
                }
                else
                {
                    this.contentContainer.position.y = 0;
                }

                this.contentContainer.position.y += pivotYOffset;
            }

            // Unrestricted dragging
            if (this.dragging && !this.setting.dragRestricted)
            {
                this.contentContainer.position.x = this._dragPosition.x;
                this.contentContainer.position.y = this._dragPosition.y;
            }

            // scale
            if (this.setting.scaleX !== null) this.contentContainer.scale.x = this.setting.scaleX;
            if (this.setting.scaleY !== null) this.contentContainer.scale.y = this.setting.scaleY;

            // pivot
            if (this.setting.pivotX !== null) this.contentContainer.pivot.x = pivotXOffset;
            if (this.setting.pivotY !== null) this.contentContainer.pivot.y = pivotYOffset;

            if (this.setting.alpha !== null) this.contentContainer.alpha = this.setting.alpha;
            if (this.setting.rotation !== null) this.contentContainer.rotation = this.setting.rotation;

            // make pixel perfect
            if (this.pixelPerfect)
            {
                this._width = Math.round(this._width);
                this._height = Math.round(this._height);
                this.contentContainer.position.x = Math.round(this.contentContainer.position.x);
                this.contentContainer.position.y = Math.round(this.contentContainer.position.y);
            }
        }
    }

    /**
     * Updates all UI Children
     *
     * @private
     */
    updateChildren(): void
    {
        for (let i = 0; i < this.widgetChildren.length; i++)
        {
            this.widgetChildren[i].updatesettings(true);
        }
    }

    getBackground(): PIXI.Container
    {
        return this.background;
    }

    setBackground(bg: PIXI.Container): Widget
    {
        if (!this.background)
        {
            this.insetContainer.removeChild(this.background);
        }

        this.background = bg;

        if (bg)
        {
            this.insetContainer.addChildAt(bg, 0);
        }

        return this;
    }

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

        for (let i = 0; i < this.widgetChildren.length; i++)
        {
            const child = this.widgetChildren[i];
            const childOptions = child.layoutOptions || LayoutOptions.DEFAULT;

            const maxWidth = (childOptions.width === LayoutOptions.FILL_PARENT || childOptions.width === LayoutOptions.WRAP_CONTENT)
                ? this.measuredWidth : 0;
            const maxHeight = (childOptions.height === LayoutOptions.FILL_PARENT || childOptions.height === LayoutOptions.WRAP_CONTENT)
                ? this.measuredHeight : 0;

            child.measure(
                maxWidth,
                maxHeight,
                maxWidth ? MeasureMode.AT_MOST : MeasureMode.UNBOUNDED,
                maxHeight ? MeasureMode.AT_MOST : MeasureMode.UNBOUNDED,
            );
        }
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

    get paddingHorizontal(): number
    {
        return this._paddingLeft + this._paddingRight;
    }

    get paddingVertical(): number
    {
        return this._paddingTop + this._paddingBottom;
    }

    get interactive(): boolean
    {
        return this.insetContainer.interactive;
    }
    set interactive(val: boolean)
    {
        this.insetContainer.interactive = true;
        this.contentContainer.interactive = true;
    }

    setPadding(l: number, t: number, r: number, b: number): Widget
    {
        this._paddingLeft = l;
        this._paddingTop = t;
        this._paddingRight = r;
        this._paddingBottom = b;
        this.dirty = true;

        return this;
    }

    addChild(UIObject): any
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
            this.updatesettings(true, true);
        }

        return UIObject;
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

                UIObject.container.parent.removeChild(UIObject.insetContainer);
                this.widgetChildren.splice(index, 1);
                UIObject.parent = null;

                // oldParent._recursivePostUpdateTransform();
                setTimeout(function ()
                { // hack but cant get the transforms to update propertly otherwice?
                    if (oldUIParent.updatesettings)
                    { oldUIParent.updatesettings(true, true); }
                }, 0);
            }
        }
    }

    /**
     * Initializes the object when its added to an UIStage
     *
     * @private
     */
    initialize(): void
    {
        this.initialized = true;
        this.stage = this.parent.stage;
        if (this.draggable)
        {
            this.initDraggable();
        }

        if (this.droppable)
        {
            this.initDroppable();
        }
    }

    clearDraggable(): void
    {
        if (this.dragInitialized)
        {
            this.dragInitialized = false;
            this.drag.stopEvent();
        }
    }

    initDraggable(): void
    {
        if (!this.dragInitialized)
        {
            this.dragInitialized = true;
            const containerStart = new PIXI.Point();
            const stageOffset = new PIXI.Point();
            const self = this;

            this._dragPosition = new PIXI.Point();
            this.drag = new DragEvent(this);
            this.drag.onDragStart = function (e)
            {
                const added = DragDropController.add(this, e);

                if (!this.dragging && added)
                {
                    this.dragging = true;
                    this.container.interactive = false;
                    containerStart.copy(this.container.position);
                    if (this.dragContainer)
                    {
                        const c = this.dragContainer.container ? this.dragContainer.container : this.dragContainer;

                        if (c)
                        {
                        // _this.container._recursivePostUpdateTransform();
                            stageOffset.set(c.worldTransform.tx - this.parent.container.worldTransform.tx, c.worldTransform.ty - this.parent.container.worldTransform.ty);
                            c.addChild(this.container);
                        }
                    }
                    else
                    {
                        stageOffset.set(0);
                    }
                    this.emit('draggablestart', e);
                }
            };

            this.drag.onDragMove = function (e, offset)
            {
                if (this.dragging)
                {
                    this._dragPosition.set(containerStart.x + offset.x - stageOffset.x, containerStart.y + offset.y - stageOffset.y);
                    this.x = this._dragPosition.x;
                    this.y = this._dragPosition.y;
                    this.emit('draggablemove', e);
                }
            };

            this.drag.onDragEnd = function (e)
            {
                if (this.dragging)
                {
                    this.dragging = false;
                    // Return to container after 0ms if not picked up by a droppable
                    setTimeout(function ()
                    {
                        self.contentContainer.interactive = true;
                        const item = DragDropController.getItem(self);

                        if (item)
                        {
                            const container = self.parent === self.stage ? self.stage : self.parent.contentContainer;

                            container.toLocal(self.contentContainer.position, self.contentContainer.parent, self);
                            if (container != self.contentContainer)
                            {
                                self.parent.addChild(self);
                            }
                        }
                        self.emit('draggableend', e);
                    }, 0);
                }
            };
        }
    }

    clearDroppable(): void
    {
        if (this.dropInitialized)
        {
            this.dropInitialized = false;
            this.contentContainer.removeListener('mouseup', this.onDrop);
            this.contentContainer.removeListener('touchend', this.onDrop);
        }
    }

    initDroppable(): void
    {
        if (!this.dropInitialized)
        {
            this.dropInitialized = true;
            const container = this.contentContainer;
            const self = this;

            this.contentContainer.interactive = true;
            this.onDrop = function (event)
            {
                const item = DragDropController.getEventItem(event, self.dropGroup);

                if (item && item.dragging)
                {
                    item.dragging = false;
                    item.container.interactive = true;
                    const parent = self.droppableReparent !== null ? self.droppableReparent : self;

                    parent.container.toLocal(item.container.position, item.container.parent, item);
                    if (parent.container != item.container.parent)
                    { parent.addChild(item); }
                }
            };

            container.on('mouseup', this.onDrop);
            container.on('touchend', this.onDrop);
        }
    }

    get x(): number
    {
        return this.setting.left;
    }
    set x(val: number)
    {
        this.left = val;
    }

    get y(): number
    {
        return this.setting.top;
    }
    set y(val: number)
    {
        this.top = val;
    }

    get width(): number
    {
        return this._width;
    }
    set width(val: number)
    {
        if (isNaN(val) && val.indexOf('%') !== -1)
        { this.setting.widthPct = parseFloat(val.replace('%', '')) * 0.01; }
        else
        { this.setting.widthPct = null; }

        this.setting.width = val;
        this.updatesettings(true);
    }

    get actual_width(): number
    {
        if (this.dirty)
        {
            if (this.setting.widthPct !== null)
            {
                this._width = this.parent._width * this.setting.widthPct;
            }
            else
            {
                this._width = this.setting.width;
            }
        }

        return this._width;
    }

    get height(): number
    {
        return this._height;
    }
    set height(val: number)
    {
        if (isNaN(val) && val.indexOf('%') !== -1)
        { this.setting.heightPct = parseFloat(val.replace('%', '')) * 0.01; }
        else
        { this.setting.heightPct = null; }

        this.setting.height = val;
        this.updatesettings(true);
    }

    get actual_height(): number
    {
        if (this.dirty)
        {
            if (this.setting.heightPct !== null)
            {
                this._height = this.parent._height * this.setting.heightPct;
            }
            else
            {
                this._height = this.setting.height;
            }
        }

        return this._height;
    }

    get minWidth(): number
    {
        return this.setting.minWidth;
    }
    set minWidth(val: number)
    {
        if (isNaN(val) && val.indexOf('%') !== -1)
        { this.setting.minWidthPct = parseFloat(val.replace('%', '')) * 0.01; }
        else
        { this.setting.minWidthPct = null; }

        this.setting.minWidth = val;
        this.updatesettings(true);
    }

    get actual_minWidth(): number
    {
        if (this.dirty)
        {
            if (this.setting.minWidthPct !== null)
            {
                this._minWidth = this.parent._width * this.setting.minWidthPct;
            }
            else
            {
                this._minWidth = this.setting.minWidth;
            }
        }

        return this._minWidth;
    }

    get minHeight(): number
    {
        return this.setting.minHeight;
    }
    set minHeight(val: number)
    {
        if (isNaN(val) && val.indexOf('%') !== -1)
        { this.setting.minHeightPct = parseFloat(val.replace('%', '')) * 0.01; }
        else
        { this.setting.minHeightPct = null; }

        this.setting.minHeight = val;
        this.updatesettings(true);
    }

    get actual_minHeight(): number
    {
        if (this.dirty)
        {
            if (this.setting.minHeightPct !== null)
            {
                this._minHeight = this.parent._height * this.setting.minHeightPct;
            }
            else
            {
                this._minHeight = this.setting.minHeight;
            }
        }

        return this._minHeight;
    }

    get maxWidth(): number
    {
        return this.setting.maxWidth;
    }
    set maxWidth(val: number)
    {
        if (isNaN(val) && val.indexOf('%') !== -1)
        { this.setting.maxWidthPct = parseFloat(val.replace('%', '')) * 0.01; }
        else
        { this.setting.maxWidthPct = null; }

        this.setting.maxWidth = val;
        this.updatesettings(true);
    }

    get actual_maxWidth(): number
    {
        if (this.dirty)
        {
            if (this.setting.maxWidthPct !== null)
            {
                this._maxWidth = this.parent._width * this.setting.maxWidthPct;
            }
            else
            {
                this._maxWidth = this.setting.maxWidth;
            }
        }

        return this._maxWidth;
    }

    get maxHeight(): number
    {
        return this.setting.maxHeight;
    }
    set maxHeight(val: number)
    {
        if (isNaN(val) && val.indexOf('%') !== -1)
        { this.setting.maxHeightPct = parseFloat(val.replace('%', '')) * 0.01; }
        else
        { this.setting.maxHeightPct = null; }

        this.setting.maxHeight = val;
        this.updatesettings(true);
    }

    get actual_maxHeight(): number
    {
        if (this.dirty)
        {
            if (this.setting.maxHeightPct !== null)
            {
                this._maxHeight = this.parent._height * this.setting.maxHeightPct;
            }
            else
            {
                this._maxHeight = this.setting.maxHeight;
            }
        }

        return this._maxHeight;
    }

    get anchorLeft(): number
    {
        return this.setting.anchorLeft;
    }
    set anchorLeft(val: number)
    {
        if (isNaN(val) && val.indexOf('%') !== -1)
        { this.setting.anchorLeftPct = parseFloat(val.replace('%', '')) * 0.01; }
        else
        { this.setting.anchorLeftPct = null; }

        this.setting.anchorLeft = val;
        this.updatesettings(true);
    }

    get actual_anchorLeft(): number
    {
        if (this.dirty)
        {
            if (this.setting.anchorLeftPct !== null)
            {
                this._anchorLeft = this.parent._width * this.setting.anchorLeftPct;
            }
            else
            {
                this._anchorLeft = this.setting.anchorLeft;
            }
        }

        return this._anchorLeft;
    }

    get anchorRight(): number
    {
        return this.setting.anchorRight;
    }
    set anchorRight(val: number)
    {
        if (isNaN(val) && val.indexOf('%') !== -1)
        { this.setting.anchorRightPct = parseFloat(val.replace('%', '')) * 0.01; }
        else
        { this.setting.anchorRightPct = null; }

        this.setting.anchorRight = val;
        this.updatesettings(true);
    }

    get actual_anchorRight(): number
    {
        if (this.dirty)
        {
            if (this.setting.anchorRightPct !== null)
            {
                this._anchorRight = this.parent._width * this.setting.anchorRightPct;
            }
            else
            {
                this._anchorRight = this.setting.anchorRight;
            }
        }

        return this._anchorRight;
    }

    get anchorTop(): number
    {
        return this.setting.anchorTop;
    }
    set anchorTop(val: number)
    {
        if (isNaN(val) && val.indexOf('%') !== -1)
        { this.setting.anchorTopPct = parseFloat(val.replace('%', '')) * 0.01; }
        else
        { this.setting.anchorTopPct = null; }

        this.setting.anchorTop = val;
        this.updatesettings(true);
    }

    get actual_anchorTop(): number
    {
        if (this.dirty)
        {
            if (this.setting.anchorTopPct !== null)
            {
                this._anchorTop = this.parent._height * this.setting.anchorTopPct;
            }
            else
            {
                this._anchorTop = this.setting.anchorTop;
            }
        }

        return this._anchorTop;
    }

    get anchorBottom(): number
    {
        return this.setting.anchorBottom;
    }
    set anchorBottom(val: number)
    {
        if (isNaN(val) && val.indexOf('%') !== -1)
        { this.setting.anchorBottomPct = parseFloat(val.replace('%', '')) * 0.01; }
        else
        { this.setting.anchorBottomPct = null; }

        this.setting.anchorBottom = val;
        this.updatesettings(true);
    }

    get actual_anchorBottom(): number
    {
        if (this.dirty)
        {
            if (this.setting.anchorBottomPct !== null)
            {
                this._anchorBottom = this.parent._height * this.setting.anchorBottomPct;
            }
            else
            {
                this._anchorBottom = this.setting.anchorBottom;
            }
        }

        return this._anchorBottom;
    }

    get left(): number
    {
        return this.setting.left;
    }
    set left(val: number)
    {
        if (isNaN(val) && val.indexOf('%') !== -1)
        { this.setting.leftPct = parseFloat(val.replace('%', '')) * 0.01; }
        else
        { this.setting.leftPct = null; }

        this.setting.left = val;
        this.updatesettings(true);
    }

    get actual_left(): number
    {
        if (this.dirty)
        {
            if (this.setting.leftPct !== null)
            {
                this._left = this.parent._width * this.setting.leftPct;
            }
            else
            {
                this._left = this.setting.left;
            }
        }

        return this._left;
    }

    get right(): number
    {
        return this.setting.right;
    }
    set right(val: number)
    {
        if (isNaN(val) && val.indexOf('%') !== -1)
        { this.setting.rightPct = parseFloat(val.replace('%', '')) * 0.01; }
        else
        { this.setting.rightPct = null; }

        this.setting.right = val;
        this.updatesettings(true);
    }

    get actual_right(): number
    {
        if (this.dirty)
        {
            if (this.setting.rightPct !== null)
            {
                this._right = this.parent._width * this.setting.rightPct;
            }
            else
            {
                this._right = this.setting.right;
            }
        }

        return this._right;
    }

    get top(): number
    {
        return this.setting.top;
    }
    set top(val: number)
    {
        if (isNaN(val) && val.indexOf('%') !== -1)
        { this.setting.topPct = parseFloat(val.replace('%', '')) * 0.01; }
        else
        { this.setting.topPct = null; }

        this.setting.top = val;
        this.updatesettings(true);
    }

    get actual_top(): number
    {
        if (this.dirty)
        {
            if (this.setting.topPct !== null)
            {
                this._top = this.parent._height * this.setting.topPct;
            }
            else
            {
                this._top = this.setting.top;
            }
        }

        return this._top;
    }

    get bottom(): number
    {
        return this.setting.bottom;
    }
    set bottom(val: number)
    {
        if (isNaN(val) && val.indexOf('%') !== -1)
        { this.setting.bottomPct = parseFloat(val.replace('%', '')) * 0.01; }
        else
        { this.setting.bottomPct = null; }

        this.setting.bottom = val;
        this.updatesettings(true);
    }

    get actual_bottom()
    {
        if (this.dirty)
        {
            if (this.setting.bottomPct !== null)
            {
                this._bottom = this.parent._height * this.setting.bottomPct;
            }
            else
            {
                this._bottom = this.setting.bottom;
            }
        }

        return this._bottom;
    }

    get verticalAlign(): number
    {
        return this.setting.verticalAlign;
    }
    set verticalAlign(val: number)
    {
        this.setting.verticalAlign = val;
        this.baseupdate();
    }

    get valign(): number
    {
        return this.setting.verticalAlign;
    }
    set valign(val: number)
    {
        this.setting.verticalAlign = val;
        this.baseupdate();
    }

    get horizontalAlign(): boolean
    {
        return this.setting.horizontalAlign;
    }
    set horizontalAlign(val: boolean)
    {
        this.setting.horizontalAlign = val;
        this.baseupdate();
    }

    get align(): boolean
    {
        return this.setting.horizontalAlign;
    }
    set align(val: boolean)
    {
        this.setting.horizontalAlign = val;
        this.baseupdate();
    }

    get tint(): number
    {
        return this.setting.tint;
    }
    set tint(val: number)
    {
        this.setting.tint = val;
        this.update();
    }

    get alpha(): number
    {
        return this.setting.alpha;
    }
    set alpha(val: number)
    {
        this.setting.alpha = val;
        this.contentContainer.alpha = val;
    }

    get rotation(): number
    {
        return this.setting.rotation;
    }
    set rotation(val: number)
    {
        this.setting.rotation = val;
        this.contentContainer.rotation = val;
    }

    get blendMode(): number
    {
        return this.setting.blendMode;
    }
    set blendMode(val: number)
    {
        this.setting.blendMode = val;
        this.update();
    }

    get pivotX(): number
    {
        return this.setting.pivotX;
    }
    set pivotX(val: number)
    {
        this.setting.pivotX = val;
        this.baseupdate();
        this.update();
    }

    get pivotY(): number
    {
        return this.setting.pivotY;
    }
    set pivotY(val: number)
    {
        this.setting.pivotY = val;
        this.baseupdate();
        this.update();
    }

    set pivot(val: number)
    {
        this.setting.pivotX = val;
        this.setting.pivotY = val;
        this.baseupdate();
        this.update();
    }

    get scaleX(): number
    {
        return this.setting.scaleX;
    }
    set scaleX(val: number)
    {
        this.setting.scaleX = val;
        this.contentContainer.scale.x = val;
    }

    get scaleY(): number
    {
        return this.setting.scaleY;
    }
    set scaleY(val: number)
    {
        this.setting.scaleY = val;
        this.contentContainer.scale.y = val;
    }

    get scale(): number
    {
        return this.setting.scaleX;
    }
    set scale(val: number)
    {
        this.setting.scaleX = val;
        this.setting.scaleY = val;
        this.contentContainer.scale.x = val;
        this.contentContainer.scale.y = val;
    }

    get draggable(): boolean
    {
        return this.setting.draggable;
    }
    set draggable(val: boolean)
    {
        this.setting.draggable = val;
        if (this.initialized)
        {
            if (val)
            { this.initDraggable(); }
            else
            { this.clearDraggable(); }
        }
    }

    get dragRestricted(): boolean
    {
        return this.setting.dragRestricted;
    }
    set dragRestricted(val: boolean)
    {
        this.setting.dragRestricted = val;
    }

    get dragRestrictAxis(): any
    {
        return this.setting.dragRestrictAxis;
    }
    set dragRestrictAxis(val: any)
    {
        this.setting.dragRestrictAxis = val;
    }

    get dragThreshold(): number
    {
        return this.setting.dragThreshold;
    }
    set dragThreshold(val: number)
    {
        this.setting.dragThreshold = val;
    }

    get dragGroup(): number
    {
        return this.setting.dragGroup;
    }
    set dragGroup(val: number)
    {
        this.setting.dragGroup = val;
    }

    get dragContainer(): number
    {
        return this.setting.dragContainer;
    }
    set dragContainer(val: number)
    {
        this.setting.dragContainer = val;
    }

    get droppable(): boolean
    {
        return this.setting.droppable;
    }
    set droppable(val: boolean)
    {
        this.setting.droppable = true;
        if (this.initialized)
        {
            if (val)
            { this.initDroppable(); }
            else
            { this.clearDroppable(); }
        }
    }

    get droppableReparent(): boolean
    {
        return this.setting.droppableReparent;
    }
    set droppableReparent(val: boolean)
    {
        this.setting.droppableReparent = val;
    }

    get dropGroup(): any
    {
        return this.setting.dropGroup;
    }
    set dropGroup(val: any)
    {
        this.setting.dropGroup = val;
    }

    get renderable(): boolean
    {
        return this.contentContainer.renderable;
    }
    set renderable(val: boolean)
    {
        this.contentContainer.renderable = val;
    }

    get visible(): boolean
    {
        return this.contentContainer.visible;
    }
    set visible(val: boolean)
    {
        this.contentContainer.visible = val;
    }

    get cacheAsBitmap(): boolean
    {
        return this.contentContainer.cacheAsBitmap;
    }
    set cacheAsBitmap(val: boolean)
    {
        this.contentContainer.cacheAsBitmap = val;
    }

    get onClick(): any
    {
        return this.contentContainer.click;
    }
    set onClick(val: any)
    {
        this.contentContainer.click = val;
    }

    get interactiveChildren(): boolean
    {
        return this.contentContainer.interactiveChildren;
    }
    set interactiveChildren(val: boolean)
    {
        this.contentContainer.interactiveChildren = val;
    }

    get parentLayer(): any
    {
        return this.contentContainer.parentLayer;
    }
    set parentLayer(val: any)
    {
        this.contentContainer.parentLayer = val;
    }
}
