import { UISettings } from './UISettings';
import { DragEvent } from './Interaction/DragEvent';
import { DragDropController } from './Interaction/DragDropController';
import * as PIXI from 'pixi.js';
import { Insets } from './layout-options/Insets';
import { LayoutOptions } from './layout-options';
import { MeasureMode, IMeasurable } from './IMeasurable';
import { Stage } from './Stage';

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
    dragInitialized: boolean;
    dropInitialized: boolean;
    dragging: boolean;
    dirty: boolean;
    _oldWidth: number;
    _oldHeight: number;
    pixelPerfect: boolean;

    _dragPosition: any;
    parent: Widget;
    _parentWidth: number;
    _parentHeight: number;

    private tint: number;
    private blendMode: PIXI.BLEND_MODES;

    protected _measuredWidth: number;
    protected _measuredHeight: number;
    public layoutMeasure: Insets;
    public layoutOptions: LayoutOptions;

    private background: PIXI.Container;
    private _paddingLeft: number;
    private _paddingTop: number;
    private _paddingRight: number;
    private _paddingBottom: number;
    private _width: number;
    private _height: number;

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

        this.tint = 0;
        this.blendMode = PIXI.BLEND_MODES.NORMAL;

        this._dragPosition = null; // used for overriding positions if tweens is playing
    }

    /**
     * Update method (override from other UIObjects)
     *
     * @private
     */
    abstract update ();

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

    get width(): number
    {
        return this._width;
    }

    get height(): number
    {
        return this._height;
    }

    get alpha(): number
    {
        return this.insetContainer.alpha;
    }
    set alpha(val: number)
    {
        this.insetContainer.alpha = val;
    }
}
