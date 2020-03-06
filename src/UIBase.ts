import { UISettings } from './UISettings';
import { DragEvent } from './Interaction/DragEvent';
import { DragDropController } from './Interaction/DragDropController';
import * as PIXI from 'pixi.js';

/**
 * Base class of all UIObjects
 *
 * @class
 * @extends PIXI.UI.UIBase
 * @param width {Number} Width of the UIObject
 * @param height {Number} Height of the UIObject
 */
export abstract class UIBase extends PIXI.utils.EventEmitter
{
    container: PIXI.Container;
    setting: UISettings;
    children: UIBase[];
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
    parent: UIBase;
    _parentWidth: number;
    _parentHeight: number;

    constructor(width: number, height: number)
    {
        super();

        this.container = new PIXI.Container();
        this.setting = new UISettings();
        this.children = [];
        this.stage = null;

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

        this._dragPosition = null; // used for overriding positions if tweens is playing
    }

    /**
     * Renders the object using the WebGL renderer
     *
     * @private
     */
    private updatesettings(updateChildren: boolean, updateParent?: boolean): void
    {
        if (!this.initialized)
        {
            if (this.parent !== null && this.parent.stage !== null && this.parent.initialized)
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
    updateParent()
    {
        if (this.parent !== null)
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
    baseupdate()
    {
    // return if parent size didnt change
        if (this.parent !== null)
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
                    { this.container.position.x = this._left; }
                    else if (this._right !== null)
                    { this.container.position.x = parentWidth - this._right; }
                }
                else if (useHorizontalAnchor)
                {
                    if (this._anchorLeft !== null && this._anchorRight === null)
                    { this.container.position.x = this._anchorLeft; }
                    else if (this._anchorLeft === null && this._anchorRight !== null)
                    { this.container.position.x = parentWidth - this._width - this._anchorRight; }
                    else if (this._anchorLeft !== null && this._anchorRight !== null)
                    {
                        this.container.position.x = this._anchorLeft;
                        this._width = parentWidth - this._anchorLeft - this._anchorRight;
                    }
                    this.container.position.x += pivotXOffset;
                }
                else
                {
                    this.container.position.x = 0;
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
                    { this.container.position.y = this._top; }
                    else if (this._bottom !== null)
                    { this.container.position.y = parentHeight - this._bottom; }
                }
                else if (useVerticalAnchor)
                {
                    if (this._anchorTop !== null && this._anchorBottom === null)
                    { this.container.position.y = this._anchorTop; }
                    else if (this._anchorTop === null && this._anchorBottom !== null)
                    { this.container.position.y = parentHeight - this._height - this._anchorBottom; }
                    else if (this._anchorTop !== null && this._anchorBottom !== null)
                    {
                        this.container.position.y = this._anchorTop;
                        this._height = parentHeight - this._anchorTop - this._anchorBottom;
                    }
                    this.container.position.y += pivotYOffset;
                }
                else
                {
                    this.container.position.y = 0;
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
                { this.container.position.x = parentWidth * 0.5 - this._width * 0.5; }
                else if (this.horizontalAlign == 'right')
                { this.container.position.x = parentWidth - this._width; }
                else
                { this.container.position.x = 0; }
                this.container.position.x += pivotXOffset;
            }
            if (this.verticalAlign !== null)
            {
                if (this.verticalAlign == 'middle')
                { this.container.position.y = parentHeight * 0.5 - this._height * 0.5; }
                else if (this.verticalAlign == 'bottom')
                { this.container.position.y = parentHeight - this._height; }
                else
                { this.container.position.y = 0; }
                this.container.position.y += pivotYOffset;
            }

            // Unrestricted dragging
            if (this.dragging && !this.setting.dragRestricted)
            {
                this.container.position.x = this._dragPosition.x;
                this.container.position.y = this._dragPosition.y;
            }

            // scale
            if (this.setting.scaleX !== null) this.container.scale.x = this.setting.scaleX;
            if (this.setting.scaleY !== null) this.container.scale.y = this.setting.scaleY;

            // pivot
            if (this.setting.pivotX !== null) this.container.pivot.x = pivotXOffset;
            if (this.setting.pivotY !== null) this.container.pivot.y = pivotYOffset;

            if (this.setting.alpha !== null) this.container.alpha = this.setting.alpha;
            if (this.setting.rotation !== null) this.container.rotation = this.setting.rotation;

            // make pixel perfect
            if (this.pixelPerfect)
            {
                this._width = Math.round(this._width);
                this._height = Math.round(this._height);
                this.container.position.x = Math.round(this.container.position.x);
                this.container.position.y = Math.round(this.container.position.y);
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
        for (let i = 0; i < this.children.length; i++)
        {
            this.children[i].updatesettings(true);
        }
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
            this.container.addChild(UIObject.container);
            this.children.push(UIObject);
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
            const index = this.children.indexOf(UIObject);

            if (index !== -1)
            {
                const oldUIParent = UIObject.parent;
                const oldParent = UIObject.container.parent;

                UIObject.container.parent.removeChild(UIObject.container);
                this.children.splice(index, 1);
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
                        self.container.interactive = true;
                        const item = DragDropController.getItem(self);

                        if (item)
                        {
                            const container = self.parent === self.stage ? self.stage : self.parent.container;

                            container.toLocal(self.container.position, self.container.parent, self);
                            if (container != self.container)
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
            this.container.removeListener('mouseup', this.onDrop);
            this.container.removeListener('touchend', this.onDrop);
        }
    }

    initDroppable(): void
    {
        if (!this.dropInitialized)
        {
            this.dropInitialized = true;
            const container = this.container;
            const self = this;

            this.container.interactive = true;
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
        return this.setting.width;
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
        return this.setting.height;
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

    actual_minWidth(): number
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
        this.container.alpha = val;
    }

    get rotation(): number
    {
        return this.setting.rotation;
    }
    set rotation(val: number)
    {
        this.setting.rotation = val;
        this.container.rotation = val;
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
        this.container.scale.x = val;
    }

    get scaleY(): number
    {
        return this.setting.scaleY;
    }
    set scaleY(val: number)
    {
        this.setting.scaleY = val;
        this.container.scale.y = val;
    }

    get scale(): number
    {
        return this.setting.scaleX;
    }
    set scale(val: number)
    {
        this.setting.scaleX = val;
        this.setting.scaleY = val;
        this.container.scale.x = val;
        this.container.scale.y = val;
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
        return this.container.renderable;
    }
    set renderable(val: boolean)
    {
        this.container.renderable = val;
    }

    get visible(): boolean
    {
        return this.container.visible;
    }
    set visible(val: boolean)
    {
        this.container.visible = val;
    }

    get cacheAsBitmap(): boolean
    {
        return this.container.cacheAsBitmap;
    }
    set cacheAsBitmap(val: boolean)
    {
        this.container.cacheAsBitmap = val;
    }

    get onClick(): any
    {
        return this.container.click;
    }
    set onClick(val: any)
    {
        this.container.click = val;
    }

    get interactive(): boolean
    {
        return this.container.interactive;
    }
    set interactive(val: boolean)
    {
        this.container.interactive = val;
    }

    get interactiveChildren(): boolean
    {
        return this.container.interactiveChildren;
    }
    set interactiveChildren(val: boolean)
    {
        this.container.interactiveChildren = val;
    }

    get parentLayer(): any
    {
        return this.container.parentLayer;
    }
    set parentLayer(val: any)
    {
        this.container.parentLayer = val;
    }
}
