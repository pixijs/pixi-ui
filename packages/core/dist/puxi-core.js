/*!
 * @puxi/core - v1.0.1
 * Compiled Sun, 26 Jul 2020 02:14:25 UTC
 *
 * @puxi/core is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
this.PUXI = this.PUXI || {};
var _puxi_core = (function (exports, PIXI, filterDropShadow) {
    'use strict';

    const _items = [];
    const DragDropController = {
        add(item, event)
        {
            item._dragDropEventId = event.data.identifier;
            if (_items.indexOf(item) === -1)
            {
                _items.push(item);

                return true;
            }

            return false;
        },
        getItem(object)
        {
            let item = null; let
                index;

            for (let i = 0; i < _items.length; i++)
            {
                if (_items[i] === object)
                {
                    item = _items[i];
                    index = i;
                    break;
                }
            }

            if (item !== null)
            {
                _items.splice(index, 1);

                return item;
            }

            return false;
        },
        getEventItem(event, group)
        {
            let item = null; let index; const
                id = event.data.identifier;

            for (let i = 0; i < _items.length; i++)
            {
                if (_items[i]._dragDropEventId === id)
                {
                    if (group !== _items[i].dragGroup)
                    {
                        return false;
                    }
                    item = _items[i];
                    index = i;
                    break;
                }
            }

            if (item !== null)
            {
                _items.splice(index, 1);

                return item;
            }

            return false;
        },
    };

    /**
     * @memberof PUXI
     * @class
     */
    class Insets {
        constructor() {
            this.reset();
            this.dirtyId = 0;
        }
        reset() {
            this.left = -1;
            this.top = -1;
            this.right = -1;
            this.bottom = -1;
        }
    }

    /**
     * These are the modes in which an entity can measures its dimension. They are
     * relevant when a layout needs to know the optimal sizes of its children.
     *
     * @memberof PUXI
     * @enum
     * @property {number} UNBOUNDED - no upper limit on bounds. This should calculate the optimal dimensions for the entity.
     * @property {number} EXACTLY - the entity should set its dimension to the one passed to it.
     * @property {number} AT_MOST - the entity should find an optimal dimension below the one passed to it.
     */
    (function (MeasureMode) {
        MeasureMode[MeasureMode["UNBOUNDED"] = 0] = "UNBOUNDED";
        MeasureMode[MeasureMode["EXACTLY"] = 1] = "EXACTLY";
        MeasureMode[MeasureMode["AT_MOST"] = 2] = "AT_MOST";
    })(exports.MeasureMode || (exports.MeasureMode = {}));
    /**
     * Any renderable entity that can be used in a widget hierarchy must be
     * measurable.
     *
     * @memberof PUXI
     * @interface IMeasurable
     */
    /**
     * Measures its width & height based on the passed constraints.
     *
     * @memberof PUXI.IMeasurable#
     * @method onMeasure
     * @param {number} maxWidth
     * @param {number} maxHeight
     * @param {PUXI.MeasureMode} widthMode
     * @param {PUXI.MeasureMode} heightMode
     */
    /**
     * @memberof PUXI.IMeasurable#
     * @method getMeasuredWidth
     * @returns {number} - the measured width of the entity after a `onMeasure` call
     */
    /**
     * @memberof PUXI.IMeasurable#
     * @method getMeasuredHeight
     * @returns {number} - the measured height of the entity after a `onMeasure` call
     */

    /**
     * An event manager handles the states related to certain events and can augment
     * widget interaction. For example, the click manager will hide clicks when
     * the object is dragging.
     *
     * Event managers are lifecycle objects - they can start/stop. Their constructor
     * will always accept one argument - the widget. Other settings can be applied before
     * `startEvent`.
     *
     * Ideally, you should access event managers _after_ your widget has initialized. This is
     * because it may depend on the widget's stage being assigned.
     *
     * @memberof PUXI
     * @class
     * @abstract
     */
    class EventManager {
        /**
         * @param {Widget} target
         */
        constructor(target) {
            this.target = target;
            this.isEnabled = false; // use to track start/stopEvent
        }
        /**
         * @returns {Widget}
         */
        getTarget() {
            return this.target;
        }
    }

    /**
     * `ClickManager` handles hover and click events. It registers listeners
     * for `mousedown`, `mouseup`, `mousemove`, `mouseout`, `mouseover`, `touchstart`,
     * `touchend`, `touchendoutside`, `touchmove`, `rightup`, `rightdown`, `rightupoutside`
     * events.
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.EventManager
     */
    class ClickManager extends EventManager {
        /**
         * @param {PUXI.Widget | PUXI.Button} target
         * @param {boolean}[includeHover=false] - enable hover (`mouseover`, `mouseout`) listeners
         * @param {boolean}[rightMouseButton=false] - use right mouse clicks
         * @param {boolean}[doubleClick=false] - fire double clicks
         */
        constructor(target, includeHover, rightMouseButton, doubleClick) {
            super(target);
            /**
             * @param {boolean}[includeHover]
             * @param {boolean}[rightMouseButton]
             * @param {boolean}[doubleClick]
             * @override
             */
            this.startEvent = (includeHover = this._includeHover, rightMouseButton = this._rightMouseButton, doubleClick = this._doubleClick) => {
                if (this.isEnabled) {
                    return;
                }
                this._includeHover = includeHover;
                this.rightMouseButton = rightMouseButton;
                this._doubleClick = doubleClick;
                const { target } = this;
                target.insetContainer.on(this.evMouseDown, this.onMouseDownImpl);
                if (!this._rightMouseButton) {
                    target.insetContainer.on('touchstart', this.onMouseDownImpl);
                }
                if (this._includeHover) {
                    target.insetContainer.on('mouseover', this.onMouseOverImpl);
                    target.insetContainer.on('mouseout', this.onMouseOutImpl);
                }
                this.isEnabled = true;
            };
            /**
             * @override
             */
            this.stopEvent = () => {
                if (!this.isEnabled) {
                    return;
                }
                const { target } = this;
                if (this.bound) {
                    target.insetContainer.removeListener(this.evMouseUp, this.onMouseUpImpl);
                    target.insetContainer.removeListener(this.evMouseUpOutside, this.onMouseUpOutsideImpl);
                    if (!this._rightMouseButton) {
                        target.insetContainer.removeListener('touchend', this.onMouseUpImpl);
                        target.insetContainer.removeListener('touchendoutside', this.onMouseUpOutsideImpl);
                    }
                    this.bound = false;
                }
                target.insetContainer.removeListener(this.evMouseDown, this.onMouseDownImpl);
                if (!this._rightMouseButton) {
                    target.insetContainer.removeListener('touchstart', this.onMouseDownImpl);
                }
                if (this._includeHover) {
                    target.insetContainer.removeListener('mouseover', this.onMouseOverImpl);
                    target.insetContainer.removeListener('mouseout', this.onMouseOutImpl);
                    target.insetContainer.removeListener('mousemove', this.onMouseMoveImpl);
                    target.insetContainer.removeListener('touchmove', this.onMouseMoveImpl);
                }
                this.isEnabled = false;
            };
            this.onMouseDownImpl = (event) => {
                const { target: obj, evMouseUp, onMouseUpImpl: _onMouseUp, evMouseUpOutside, onMouseUpOutsideImpl: _onMouseUpOutside, _rightMouseButton: right, } = this;
                this.mouse.copyFrom(event.data.global);
                this.id = event.data.identifier;
                this.onPress.call(this.target, event, true);
                if (!this.bound) {
                    obj.insetContainer.on(evMouseUp, _onMouseUp);
                    obj.insetContainer.on(evMouseUpOutside, _onMouseUpOutside);
                    if (!right) {
                        obj.insetContainer.on('touchend', _onMouseUp);
                        obj.insetContainer.on('touchendoutside', _onMouseUpOutside);
                    }
                    this.bound = true;
                }
                if (this._doubleClick) {
                    const now = performance.now();
                    if (now - this.time < 210) {
                        this.onClick.call(obj, event);
                    }
                    else {
                        this.time = now;
                    }
                }
                event.data.originalEvent.preventDefault();
            };
            this.onMouseUpCommonImpl = (event) => {
                const { target: obj, evMouseUp, onMouseUpImpl: _onMouseUp, evMouseUpOutside, onMouseUpOutsideImpl: _onMouseUpOutside, } = this;
                if (event.data.identifier !== this.id) {
                    return;
                }
                this.offset.set(event.data.global.x - this.mouse.x, event.data.global.y - this.mouse.y);
                if (this.bound) {
                    obj.insetContainer.removeListener(evMouseUp, _onMouseUp);
                    obj.insetContainer.removeListener(evMouseUpOutside, _onMouseUpOutside);
                    if (!this._rightMouseButton) {
                        obj.insetContainer.removeListener('touchend', _onMouseUp);
                        obj.insetContainer.removeListener('touchendoutside', _onMouseUpOutside);
                    }
                    this.bound = false;
                }
                this.onPress.call(obj, event, false);
            };
            this.onMouseUpImpl = (event) => {
                if (event.data.identifier !== this.id) {
                    return;
                }
                this.onMouseUpCommonImpl(event);
                // prevent clicks with scrolling/dragging objects
                if (this.target.dragThreshold) {
                    this.movementX = Math.abs(this.offset.x);
                    this.movementY = Math.abs(this.offset.y);
                    if (Math.max(this.movementX, this.movementY) > this.target.dragThreshold) {
                        return;
                    }
                }
                if (!this._doubleClick) {
                    this.onClick.call(this.target, event);
                }
            };
            this.onMouseUpOutsideImpl = (event) => {
                if (event.data.identifier !== this.id) {
                    return;
                }
                this.onMouseUpCommonImpl(event);
            };
            this.onMouseOverImpl = (event) => {
                if (!this.ishover) {
                    this.ishover = true;
                    this.target.insetContainer.on('mousemove', this.onMouseMoveImpl);
                    this.target.insetContainer.on('touchmove', this.onMouseMoveImpl);
                    this.onHover.call(this.target, event, true);
                }
            };
            this.onMouseOutImpl = (event) => {
                if (this.ishover) {
                    this.ishover = false;
                    this.target.insetContainer.removeListener('mousemove', this.onMouseMoveImpl);
                    this.target.insetContainer.removeListener('touchmove', this.onMouseMoveImpl);
                    this.onHover.call(this.target, event, false);
                }
            };
            this.onMouseMoveImpl = (event) => {
                this.onMove.call(this.target, event);
            };
            this.bound = false;
            this.id = 0;
            this.ishover = false;
            this.mouse = new PIXI.Point();
            this.offset = new PIXI.Point();
            this.movementX = 0;
            this.movementY = 0;
            this._includeHover = typeof includeHover === 'undefined' ? true : includeHover;
            this.rightMouseButton = typeof rightMouseButton === 'undefined' ? false : rightMouseButton;
            this._doubleClick = typeof doubleClick === 'undefined' ? false : doubleClick;
            target.interactive = true;
            this.time = 0;
            this.startEvent();
            this.onHover = () => null;
            this.onPress = () => null;
            this.onClick = () => null;
            this.onMove = () => null;
        }
        /**
         * Whether right mice are used for clicks rather than left mice.
         * @member boolean
         */
        get rightMouseButton() {
            return this._rightMouseButton;
        }
        set rightMouseButton(val) {
            this._rightMouseButton = val;
            this.evMouseDown = this._rightMouseButton ? 'rightdown' : 'mousedown';
            this.evMouseUp = this._rightMouseButton ? 'rightup' : 'mouseup';
            this.evMouseUpOutside = this._rightMouseButton ? 'rightupoutside' : 'mouseupoutside';
        }
    }

    /**
     * `DragManager` handles drag & drop events. It registers listeners for `mousedown`,
     * `touchstart` on the target and `mousemove`, `touchmove`, `mouseup`, `mouseupoutside`,
     * `touchend`, `touchendoutside` on the stage.
     *
     * By default, `draggable` widgets will internally handle drag-n-drop and reassigning
     * the callbacks on their `DragManager` will break their behaviour. You can prevent
     * this by using `eventBroker.dnd` directly without setting `widget.draggable` to
     * `true` (or using `widget.makeDraggable()`).
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.EventManager
     */
    class DragManager extends EventManager {
        constructor(target) {
            super(target);
            this.onDragStartImpl = (e) => {
                const { target } = this;
                this.id = e.data.identifier;
                this.onPress(e, true);
                if (!this.isBound) {
                    this.dragStart.copyFrom(e.data.global);
                    target.stage.on('mousemove', this.onDragMoveImpl);
                    target.stage.on('touchmove', this.onDragMoveImpl);
                    target.stage.on('mouseup', this.onDragEndImpl);
                    target.stage.on('mouseupoutside', this.onDragEndImpl);
                    target.stage.on('touchend', this.onDragEndImpl);
                    target.stage.on('touchendoutside', this.onDragEndImpl);
                    target.stage.on('touchcancel', this.onDragEndImpl);
                    this.isBound = true;
                }
                e.data.originalEvent.preventDefault();
            };
            this.onDragMoveImpl = (e) => {
                if (e.data.identifier !== this.id) {
                    return;
                }
                const { lastCursor, dragOffset, dragStart, target, } = this;
                this.lastCursor.copyFrom(e.data.global);
                this.dragOffset.set(lastCursor.x - dragStart.x, lastCursor.y - dragStart.y);
                if (!this.isDragging) {
                    this.movementX = Math.abs(dragOffset.x);
                    this.movementY = Math.abs(dragOffset.y);
                    if ((this.movementX === 0 && this.movementY === 0)
                        || Math.max(this.movementX, this.movementY) < target.dragThreshold) {
                        return; // threshold
                    }
                    if (target.dragRestrictAxis !== null) {
                        this.cancel = false;
                        if (target.dragRestrictAxis === 'x' && this.movementY > this.movementX) {
                            this.cancel = true;
                        }
                        else if (target.dragRestrictAxis === 'y' && this.movementY <= this.movementX) {
                            this.cancel = true;
                        }
                        if (this.cancel) {
                            this.onDragEndImpl(e);
                            return;
                        }
                    }
                    this.onDragStart(e);
                    this.isDragging = true;
                }
                this.onDragMove(e, dragOffset);
            };
            this.onDragEndImpl = (e) => {
                if (e.data.identifier !== this.id) {
                    return;
                }
                const { target } = this;
                if (this.isBound) {
                    target.stage.removeListener('mousemove', this.onDragMoveImpl);
                    target.stage.removeListener('touchmove', this.onDragMoveImpl);
                    target.stage.removeListener('mouseup', this.onDragEndImpl);
                    target.stage.removeListener('mouseupoutside', this.onDragEndImpl);
                    target.stage.removeListener('touchend', this.onDragEndImpl);
                    target.stage.removeListener('touchendoutside', this.onDragEndImpl);
                    target.stage.removeListener('touchcancel', this.onDragEndImpl);
                    this.isDragging = false;
                    this.isBound = false;
                    this.onDragEnd(e);
                    this.onPress(e, false);
                }
            };
            this.isBound = false;
            this.isDragging = false;
            this.id = 0;
            this.dragStart = new PIXI.Point();
            this.dragOffset = new PIXI.Point();
            this.lastCursor = new PIXI.Point();
            this.movementX = 0;
            this.movementY = 0;
            this.cancel = false;
            this.target.interactive = true;
            this.onPress = () => null;
            this.onDragStart = () => null;
            this.onDragMove = () => null;
            this.onDragEnd = () => null;
            this.startEvent();
        }
        startEvent() {
            if (this.isEnabled) {
                return;
            }
            const { target } = this;
            target.insetContainer.on('mousedown', this.onDragStartImpl);
            target.insetContainer.on('touchstart', this.onDragStartImpl);
            this.isEnabled = true;
        }
        stopEvent() {
            if (!this.isEnabled) {
                return;
            }
            const { target } = this;
            if (this.isBound) {
                target.stage.removeListener('mousemove', this.onDragMoveImpl);
                target.stage.removeListener('touchmove', this.onDragMoveImpl);
                target.stage.removeListener('mouseup', this.onDragEndImpl);
                target.stage.removeListener('mouseupoutside', this.onDragEndImpl);
                target.stage.removeListener('touchend', this.onDragEndImpl);
                target.stage.removeListener('touchendoutside', this.onDragEndImpl);
                this.isBound = false;
            }
            target.insetContainer.removeListener('mousedown', this.onDragStartImpl);
            target.insetContainer.removeListener('touchstart', this.onDragStartImpl);
            this.isEnabled = false;
        }
    }

    /**
     * The event brokers allows you to access event managers without manually assigning
     * them to a widget. By default, the click (`PUXI.ClickManager`), dnd (`PUXI.DragManager`)
     * are defined. You can add event managers for all (new) widgets by adding an entry to
     * `EventBroker.MANAGER_MAP`.
     *
     * @memberof PUXI
     * @class
     */
    class EventBroker {
        constructor(target) {
            this.target = target;
            for (const mgr of Object.keys(EventBroker.MANAGER_MAP)) {
                Object.defineProperty(this, mgr, {
                    get() {
                        if (!this[`_${mgr}`]) {
                            this[`_${mgr}`] = new EventBroker.MANAGER_MAP[mgr](this.target);
                        }
                        return this[`_${mgr}`];
                    },
                });
            }
        }
    }
    EventBroker.MANAGER_MAP = {
        click: ClickManager,
        dnd: DragManager,
    };

    /**
     * Handles the `wheel` and `scroll` DOM events on widgets. It also registers
     * listeners for `mouseout` and `mouseover`.
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.EventManager
     */
    class ScrollManager extends EventManager {
        constructor(target, preventDefault = true) {
            super(target);
            this.onMouseScrollImpl = (e) => {
                const { target, preventDefault, delta } = this;
                if (preventDefault) {
                    event.preventDefault();
                }
                if (typeof e.deltaX !== 'undefined') {
                    delta.set(e.deltaX, e.deltaY);
                }
                else // Firefox
                 {
                    delta.set(e.axis === 1 ? e.detail * 60 : 0, e.axis === 2 ? e.detail * 60 : 0);
                }
                this.onMouseScroll.call(target, event, delta);
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            this.onHoverImpl = (e) => {
                const { onMouseScrollImpl } = this;
                if (!this.bound) {
                    document.addEventListener('mousewheel', onMouseScrollImpl, false);
                    document.addEventListener('DOMMouseScroll', onMouseScrollImpl, false);
                    this.bound = true;
                }
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            this.onMouseOutImpl = (e) => {
                const { onMouseScrollImpl } = this;
                if (this.bound) {
                    document.removeEventListener('mousewheel', onMouseScrollImpl);
                    document.removeEventListener('DOMMouseScroll', onMouseScrollImpl);
                    this.bound = false;
                }
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            this.onMouseScroll = function onMouseScroll(event, delta) {
                // Default onMouseScroll.
            };
            this.bound = false;
            this.delta = new PIXI.Point();
            this.preventDefault = preventDefault;
            this.startEvent();
        }
        /**
         * @override
         */
        startEvent() {
            const { target, onHoverImpl, onMouseOutImpl } = this;
            target.contentContainer.on('mouseover', onHoverImpl);
            target.contentContainer.on('mouseout', onMouseOutImpl);
        }
        /**
         * @override
         */
        stopEvent() {
            const { target, onMouseScrollImpl, onHoverImpl, onMouseOutImpl } = this;
            if (this.bound) {
                document.removeEventListener('mousewheel', onMouseScrollImpl);
                document.removeEventListener('DOMMouseScroll', onMouseScrollImpl);
                this.bound = false;
            }
            target.contentContainer.removeListener('mouseover', onHoverImpl);
            target.contentContainer.removeListener('mouseout', onMouseOutImpl);
        }
    }

    const PADDING_PROPERTIES = ['paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom'];
    const PADDING_AXIS_PROPERTIES = ['paddingHorizontal', 'paddingVertical'];
    const TEXT_STYLE_PROPERTIES = [
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
    class Widget extends PIXI.utils.EventEmitter {
        constructor() {
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
            this.insetContainer.on('pointerdown', (e) => { this.onPointerPress(e); });
            this.insetContainer.on('pointermove', (e) => { this.onPointerMove(e); });
            this.insetContainer.on('pointerup', (e) => { this.onPointerRelease(e); });
            this.insetContainer.on('pointerover', (e) => { this.onPointerEnter(e); });
            this.insetContainer.on('pointerout', (e) => { this.onPointerExit(e); });
            this.insetContainer.on('rightclick', (e) => { this.onRightClick(e); });
        }
        /**
         * Update method that is to be overriden. This is called before a `render()`
         * pass on widgets that are dirty.
         *
         * @private
         */
        update() {
            if (this._layoutDirty) {
                console.log('here');
                setTimeout(() => {
                    if (this._layoutDirty) {
                        this.stage.measureAndLayout();
                    }
                }, 0);
            }
            if (this.style && this.styleID !== this.style.dirtyID) {
                this.onStyleChange(this.style);
                this.styleID = this.style.dirtyID;
            }
        }
        /**
         * The measured width that is used by the parent's layout manager to place this
         * widget.
         * @member {number}
         */
        get measuredWidth() {
            return this._measuredWidth;
        }
        /**
         * The measured height that is used by the parent's layout manager to place this
         * widget.
         * @member {number}
         */
        get measuredHeight() {
            return this._measuredHeight;
        }
        /**
         * Alias for `Widget.measuredWidth`.
         *
         * @returns {number} the measured width
         */
        getMeasuredWidth() {
            return this._measuredWidth;
        }
        /**
         * Alias for `Widget.measuredHeight`.
         *
         * @returns {number} the measured height
         */
        getMeasuredHeight() {
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
        onMeasure(width, height, widthMode, heightMode) {
            const naturalWidth = this.contentContainer.width + this.paddingHorizontal;
            const naturalHeight = this.contentContainer.height + this.paddingVertical;
            switch (widthMode) {
                case exports.MeasureMode.EXACTLY:
                    this._measuredWidth = width;
                    break;
                case exports.MeasureMode.UNBOUNDED:
                    this._measuredWidth = naturalWidth;
                    break;
                case exports.MeasureMode.AT_MOST:
                    this._measuredWidth = Math.min(width, naturalWidth);
                    break;
            }
            switch (heightMode) {
                case exports.MeasureMode.EXACTLY:
                    this._measuredHeight = height;
                    break;
                case exports.MeasureMode.UNBOUNDED:
                    this._measuredHeight = naturalHeight;
                    break;
                case exports.MeasureMode.AT_MOST:
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
        measure(width, height, widthMode, heightMode) {
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
        onLayout(l, t = l, r = l, b = t, dirty = true) {
            this.layoutMeasure.left = l;
            this.layoutMeasure.top = t;
            this.layoutMeasure.right = r;
            this.layoutMeasure.bottom = b;
            this._width = r - l;
            this._height = b - t;
            if (this.background) {
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
        layout(l, t = l, r = l, b = t, dirty = true) {
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
        setLayoutOptions(lopt) {
            this.layoutOptions = lopt;
            return this;
        }
        /**
         * This is invoked when a style is applied on the widget. If you override it, you must pass through the superclass
         * implementation.
         *
         * @param style
         */
        onStyleChange(style) {
            const styleData = style.getProperties('backgroundColor', 'background', 'elevation', 'padding', 'paddingHorizontal', 'paddingVertical', 'paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom');
            // Set background of widget
            if (styleData.background) {
                this.setBackground(styleData.background);
            }
            else if (typeof styleData.backgroundColor !== 'undefined') {
                this.setBackground(styleData.backgroundColor);
            }
            // Set elevation
            if (typeof styleData.elevation !== 'undefined') {
                this.setElevation(styleData.elevation);
            }
            // Set _paddingLeft, _paddingTop, _paddingRight, _paddingBottom
            PADDING_PROPERTIES.forEach((propName, i) => {
                if (typeof styleData[propName] === 'number') {
                    this[`_${propName}`] = styleData[propName];
                }
                else if (typeof styleData[PADDING_AXIS_PROPERTIES[i % 2]] === 'number') {
                    this[`_${propName}`] = styleData[PADDING_AXIS_PROPERTIES[i % 2]];
                }
                else if (typeof styleData.padding === 'number') {
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
        onPointerEnter(e) {
            this.onHoverChange(e, true);
        }
        /**
         * Handles the pointer-exited event.
         *
         * If you override this method, you must call through to the superclass implementation.
         *
         * @param e
         */
        onPointerExit(e) {
            this.onHoverChange(e, false);
        }
        /**
         * Handles the pointer-down event. If you override this method, you must call through to the superclass
         * implementation.
         */
        onPointerPress(e) {
            return;
        }
        /**
         * Handles the pointer-move event. If you override this method, you must call through to the superclass
         * implementation.
         */
        onPointerMove(e) {
            return;
        }
        onPointerRelease(e) {
            if (!this.singleClickTimeout) {
                // Invoke onClick after ~300ms only if it isn't a double-click.
                this.singleClickTimeout = setTimeout(() => {
                    this.singleClickTimeout = null;
                }, Widget.CLICK_DELAY);
                this.onClick(e);
            }
            else {
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
        onHoverChange(e, hover) {
            return;
        }
        onClick(e) {
            return;
        }
        onDoubleClick(e) {
            return;
        }
        onRightClick(e) {
            console.log('RIGHT_CLICK');
            e.data.originalEvent.preventDefault();
            if (this.contextMenu) {
                if (!this.contextPopup) {
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
        get eventBroker() {
            if (!this._eventBroker) {
                this._eventBroker = new EventBroker(this);
            }
            return this._eventBroker;
        }
        /**
         * Padding on left side.
         * @member {number}
         */
        get paddingLeft() {
            return this._paddingLeft;
        }
        set paddingLeft(val) {
            this._paddingLeft = val;
            this.dirty = true;
        }
        /**
         * Padding on top side.
         * @member {number}
         */
        get paddingTop() {
            return this._paddingTop;
        }
        set paddingTop(val) {
            this._paddingTop = val;
            this.dirty = true;
        }
        /**
         * Padding on right side.
         * @member {number}
         */
        get paddingRight() {
            return this._paddingRight;
        }
        set paddingRight(val) {
            this._paddingRight = val;
            this.dirty = true;
        }
        /**
         * Padding on bottom side.
         * @member {number}
         */
        get paddingBottom() {
            return this._paddingBottom;
        }
        set paddingBottom(val) {
            this._paddingBottom = val;
            this.dirty = true;
        }
        /**
         * Sum of left & right padding.
         * @member {number}
         * @readonly
         */
        get paddingHorizontal() {
            return this._paddingLeft + this._paddingRight;
        }
        /**
         * Sum of top & bottom padding.
         * @member {number}
         * @readonly
         */
        get paddingVertical() {
            return this._paddingTop + this._paddingBottom;
        }
        /**
         * Whether this widget is interactive in the PixiJS scene graph.
         * @member {boolean}
         */
        get interactive() {
            return this.insetContainer.interactive;
        }
        set interactive(val) {
            this.insetContainer.interactive = true;
            this.contentContainer.interactive = true;
        }
        /**
         * Layout width of this widget.
         * @member {number}
         * @readonly
         */
        get width() {
            return this._width;
        }
        /**
         * Layout height of this widget.
         * @member {number}
         * @readonly
         */
        get height() {
            return this._height;
        }
        /**
         * Layout width of this widget's content, which is the width minus horizontal padding.
         * @member {number}
         * @readonly
         */
        get contentWidth() {
            return this._width - this.paddingHorizontal;
        }
        /**
         * Layout height of this widget's content, which is the height minus vertical padding.
         * @member {number}
         * @readonly
         */
        get contentHeight() {
            return this._height - this.paddingVertical;
        }
        /**
         * Alpha of this widget & its contents.
         * @member {number}
         */
        get alpha() {
            return this.insetContainer.alpha;
        }
        set alpha(val) {
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
        setPadding(l, t = l, r = l, b = t) {
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
        getBackground() {
            return this.background;
        }
        /**
         * The background of a widget is a `PIXI.DisplayObject` that is rendered before
         * all of its children.
         *
         * @param {PIXI.Container | number | string} bg - the background display-object or
         *     a color that will be used to generate a `PIXI.Graphics` as the background.
         */
        setBackground(bg) {
            if (this.background) {
                this.insetContainer.removeChild(this.background);
            }
            if (typeof bg === 'string') {
                bg = PIXI.utils.string2hex(bg);
            }
            if (typeof bg === 'number') {
                bg = new PIXI.Graphics()
                    .beginFill(bg)
                    .drawRect(0, 0, 1, 1)
                    .endFill();
            }
            this.background = bg;
            if (bg) {
                bg.width = this.width;
                bg.height = this.height;
                this.insetContainer.addChildAt(bg, 0);
            }
            if (bg && this._elevation && this._dropShadow) {
                if (!this.background.filters) {
                    this.background.filters = [];
                }
                this.background.filters.push(this._dropShadow);
            }
            return this;
        }
        /**
         * @returns {number} the alpha on the background display-object.
         */
        getBackgroundAlpha() {
            return this.background ? this.background.alpha : 1;
        }
        /**
         * This can be used to set the alpha on the _background_ of this widget. This
         * does not affect the widget's contents nor individual components of the
         * background display-object.
         *
         * @param {number} val - background alpha
         */
        setBackgroundAlpha(val) {
            if (!this.background) {
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
        setContextMenu(menu) {
            this.contextMenu = menu;
        }
        /**
         * @return {number} the elevation set on this widget
         */
        getElevation() {
            return this._elevation;
        }
        /**
         * This can be used add a drop-shadow that will appear to raise this widget by
         * the given elevation against its parent.
         *
         * @param {number} val - elevation to use. 2px is good for most widgets.
         */
        setElevation(val) {
            this._elevation = val;
            if (val === 0 && this._dropShadow) {
                if (!this.background) {
                    return this;
                }
                const i = this.background.filters.indexOf(this._dropShadow);
                if (i > 0) {
                    this.background.filters.splice(i, 1);
                }
            }
            else if (val > 0) {
                if (!this._dropShadow) {
                    if (this.background && !this.background.filters) {
                        this.background.filters = [];
                    }
                    this._dropShadow = new filterDropShadow.DropShadowFilter({ distance: val });
                    if (this.background) {
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
        setStyle(style) {
            this.style = style;
            this.styleID = -1;
            return this;
        }
        /**
         * Will trigger a full layout pass next animation frame.
         */
        requestLayout() {
            this._layoutDirty = true;
        }
        /**
         * Adds the widgets as children of this one.
         *
         * @param {PUXI.Widget[]} widgets
         * @returns {Widget} - this widget
         */
        addChild(...widgets) {
            for (let i = 0; i < widgets.length; i++) {
                const widget = widgets[i];
                if (widget.parent) {
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
        removeChild(...widgets) {
            for (let i = 0; i < widgets.length; i++) {
                const widget = widgets[i];
                const index = this.widgetChildren.indexOf(widget);
                if (index !== -1) {
                    widget.insetContainer.parent.removeChild(widget.insetContainer);
                    this.widgetChildren.splice(index, 1);
                    widget.parent = null;
                }
            }
            return this;
        }
        openPopupMenu(x, y) {
            const stage = this.stage;
            const lopt = this.contextPopup.layoutOptions;
            lopt.x = x;
            lopt.y = y;
            this.stage.addChild(this.contextPopup);
        }
        closePopupMenu() {
            this.stage.removeChild(this.contextPopup);
        }
        /**
         * Makes this widget `draggable`.
         */
        makeDraggable() {
            this.draggable = true;
            if (this.initialized) {
                this.initDraggable();
            }
            return this;
        }
        /**
         * Makes this widget not `draggable`.
         */
        clearDraggable() {
            if (this.dragInitialized) {
                this.dragInitialized = false;
                this.eventBroker.dnd.stopEvent();
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
        initialize() {
            if (this.initialized) {
                return;
            }
            if (this.draggable) {
                this.initDraggable();
            }
            if (this.droppable) {
                this.initDroppable();
            }
            this.initialized = true;
        }
        initDraggable() {
            if (this.dragInitialized) {
                return;
            }
            this.dragInitialized = true;
            const realPosition = new PIXI.Point();
            const dragPosition = new PIXI.Point();
            const dnd = this.eventBroker.dnd;
            const { insetContainer } = this;
            dnd.onDragStart = (e) => {
                const added = DragDropController.add(this, e);
                if (!this.isDragging && added) {
                    this.isDragging = true;
                    insetContainer.interactive = false;
                    realPosition.copyFrom(insetContainer.position);
                    this.emit('draggablestart', e);
                }
            };
            dnd.onDragMove = (e, offset) => {
                if (this.isDragging) {
                    dragPosition.set(realPosition.x + offset.x, realPosition.y + offset.y);
                    insetContainer.x = dragPosition.x;
                    insetContainer.y = dragPosition.y;
                    this.emit('draggablemove', e);
                }
            };
            dnd.onDragEnd = (e) => {
                if (this.isDragging) {
                    this.isDragging = false;
                    DragDropController.getItem(this);
                    // Return to container after 0ms if not picked up by a droppable
                    setTimeout(() => {
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
        makeDroppable() {
            this.droppable = true;
            if (this.initialized) {
                this.initDroppable();
            }
            return this;
        }
        /**
         * Makes this widget not `droppable`.
         */
        clearDroppable() {
            if (this.dropInitialized) {
                this.dropInitialized = false;
                this.contentContainer.removeListener('mouseup', this.onDrop);
                this.contentContainer.removeListener('touchend', this.onDrop);
            }
        }
        initDroppable() {
            if (!this.dropInitialized) {
                this.dropInitialized = true;
                const container = this.contentContainer;
                this.contentContainer.interactive = true;
                this.onDrop = (event) => {
                    const item = DragDropController.getEventItem(event, this.dropGroup);
                    if (item && item.isDragging) {
                        item.isDragging = false;
                        item.insetContainer.interactive = true;
                        const parent = this.droppableReparent !== null ? this.droppableReparent : self;
                        parent.container.toLocal(item.container.position, item.container.parent, item);
                        if (parent.container != item.container.parent) {
                            parent.addChild(item);
                        }
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
        static fromContent(content) {
            if (content instanceof Widget) {
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
        static resolveMeasuredDimen(natural, limit, mode) {
            if (mode === exports.MeasureMode.EXACTLY) {
                return limit;
            }
            else if (mode === exports.MeasureMode.AT_MOST) {
                return Math.min(limit, natural);
            }
            return natural;
        }
    }
    /**
     * The minimum delay between two clicks to not consider them as a double-click.
     */
    Widget.CLICK_DELAY = 300;

    /**
     * Alignments supported by layout managers in PuxiJS core.
     *
     * @memberof PUXI
     * @enum
     */
    (function (ALIGN) {
        ALIGN[ALIGN["LEFT"] = 0] = "LEFT";
        ALIGN[ALIGN["TOP"] = 0] = "TOP";
        ALIGN[ALIGN["MIDDLE"] = 4081] = "MIDDLE";
        ALIGN[ALIGN["CENTER"] = 4081] = "CENTER";
        ALIGN[ALIGN["RIGHT"] = 1048561] = "RIGHT";
        ALIGN[ALIGN["BOTTOM"] = 1048561] = "BOTTOM";
        ALIGN[ALIGN["NONE"] = 4294967295] = "NONE";
    })(exports.ALIGN || (exports.ALIGN = {}));

    /**
     * This are the base constraints that you can apply on a `PUXI.Widget` under any
     * layout manager. It specifies the dimensions of a widget, while the position
     * of the widget is left to the parent to decide. If a dimension (width or height)
     * is set to a value between -1 and 1, then it is interpreted as a percentage
     * of the parent's dimension.
     *
     * The following example will render a widget at 50% of the parent's width and 10px height:
     *
     * ```js
     * const widget = new PUXI.Widget();
     * const parent = new PUXI.Widget();
     *
     * widget.layoutOptions = new PUXI.LayoutOptions(
     *      .5,
     *      10
     * );
     * parent.addChild(widget);
     * ```
     *
     * @memberof PUXI
     * @class
     */
    class LayoutOptions {
        /**
         * @param {number}[width = LayoutOptions.WRAP_CONTENT]
         * @param {number}[height = LayoutOptions.WRAP_CONTENT]
         */
        constructor(width = LayoutOptions.WRAP_CONTENT, height = LayoutOptions.WRAP_CONTENT) {
            this.setWidth(width);
            this.setHeight(height);
            /**
             * Used by the layout manager to cache calculations.
             * @member {object}
             */
            this.cache = {};
        }
        /**
         * Utility method to store width that converts strings to their number format.
         *
         * @param {number | string} val
         * @example
         * ```
         * lopt.setWidth('68.7%');// 68.7% of parent's width
         * lopt.setWidth('96px');// 96px
         * lopt.setWidth(34);// 34px
         * lopt.setWidth(.45);// 45% of parent's width
         * ```
         */
        setWidth(val) {
            /**
             * Preferred height of the widget in pixels. If its value is between -1 and 1, it
             * is interpreted as a percentage of the parent's height.
             * @member {number}
             * @default {PUXI.LayoutOptions.WRAP_CONTENT}
             */
            this.width = LayoutOptions.parseDimen(val);
        }
        /**
         * Utility method to store height that converts strings to their number format.
         *
         * @param {number | string} val
         * @example
         * ```
         * lopt.setHeight('68.7%');// 68.7% of parent's height
         * lopt.setHeight('96px');// 96px
         * lopt.setHeight(34);// 34px
         * lopt.setHeight(.45);// 45% of parent's height
         * ```
         */
        setHeight(val) {
            /**
             * Preferred width of the widget in pixels. If its value is between -1 and 1, it
             * is interpreted as a percentage of the parent's width.
             * @member {number}
             * @default {PUXI.LayoutOptions.WRAP_CONTENT}
             */
            this.height = LayoutOptions.parseDimen(val);
        }
        /**
         * @member {boolean} - whether the specified width is a constant
         *      (not a percentage, `WRAP_CONTENT`, or `FILL_PARENT`)
         */
        get isWidthPredefined() {
            return this.width > 1 && this.width <= LayoutOptions.MAX_DIMEN;
        }
        /**
         * @member {boolean} - whether the specified height is a constant
         *      (not a percentage, `WRAP_CONTENT`, or `FILL_PARENT`)
         */
        get isHeightPredefined() {
            return this.height > 1 && this.height <= LayoutOptions.MAX_DIMEN;
        }
        /**
         * The left margin in pixels of the widget.
         * @member {number}
         * @default 0
         */
        get marginLeft() {
            return this._marginLeft || 0;
        }
        set marginLeft(val) {
            this._marginLeft = val;
        }
        /**
         * This top margin in pixels of the widget.
         * @member {number}
         * @default 0
         */
        get marginTop() {
            return this._marginTop || 0;
        }
        set marginTop(val) {
            this._marginTop = val;
        }
        /**
         * The right margin in pixels of the widget.
         * @member {number}
         * @default 0
         */
        get marginRight() {
            return this._marginRight || 0;
        }
        set marginRight(val) {
            this._marginRight = val;
        }
        /**
         * The bottom margin in pixels of the widget.
         * @member {number}
         * @default 0
         */
        get marginBottom() {
            return this._marginBottom || 0;
        }
        set marginBottom(val) {
            this._marginBottom = val;
        }
        /**
         * @param left
         * @param top
         * @param right
         * @param bottom
         */
        setMargin(left, top, right, bottom) {
            this._marginLeft = left;
            this._marginTop = top;
            this._marginRight = right;
            this._marginBottom = bottom;
        }
        static parseDimen(val) {
            if (typeof val === 'string') {
                if (val.endsWith('%')) {
                    val = parseFloat(val.replace('%', '')) / 100;
                }
                else if (val.endsWith('px')) {
                    val = parseFloat(val.replace('px', ''));
                }
                if (typeof val === 'string' || isNaN(val)) {
                    throw new Error('Width could not be parsed!');
                }
            }
            return val;
        }
    }
    LayoutOptions.FILL_PARENT = 0xfffffff1;
    LayoutOptions.WRAP_CONTENT = 0xfffffff2;
    LayoutOptions.MAX_DIMEN = 0xfffffff0;
    LayoutOptions.DEFAULT = new LayoutOptions();

    /**
     * @memberof PUXI
     * @interface IAnchorLayoutParams
     * @property {number} anchorLeft - distance from parent's left inset to child's left edge
     * @property {number} anchorTop - distance from parent's top inset to child's top edge
     * @property {number} anchorRight - distance from parent's right inset to child's right edge
     * @property {number} anchorBottom - distance from parent's bottom insets to child's bottom edge
     * @property {PUXI.ALIGN} horizontalAlign - horizontal alignment of child in anchor region
     * @property {PUXI.ALIGN} verticalAlign - vertical alignment of child in anchor region
     * @property {number | string} width - requested width of widget (default is `WRAP_CONTENT`)
     * @property {number | string} height - requested height of widget (default is `WRAP_CONTENT`)
     */
    /**
     * Anchors the edge of a widget to defined offsets from the parent's insets.
     *
     * The following example will render a widget at (10px, 15%) with a width extending
     * to the parent's center and a height extending till 40px above the parent's bottom
     * inset.
     * ```js
     * new PUXI.AnchoredLayoutOptions({
     *      anchorLeft: 10,
     *      anchorTop: .15,
     *      anchorRight: .5,
     *      anchorBottom: 40
     * });
     * ```
     *
     * ### Intra-anchor region alignment
     *
     * You can specify how the widget should be aligned in the intra-anchor region using the
     * `horizontalAlign` and `verticalAlign` properties.
     *
     * ### Support for FILL_PARENT and percentage-of-parent dimensions
     *
     * Anchor layout does not support a width/height that is `LayoutOptions.FILL_PARENT`
     * or a percentage of the parent's width/height. Instead, you can define anchors that
     * result in the equivalent behaviour.
     *
     * @memberof PUXI
     * @extends PUXI.LayoutOptions
     * @class
     */
    class AnchorLayoutOptions extends LayoutOptions {
        constructor(options) {
            super(options.width, options.height);
            this.anchorLeft = options.anchorLeft || 0;
            this.anchorTop = options.anchorTop || 0;
            this.anchorBottom = options.anchorBottom || 0;
            this.anchorRight = options.anchorRight || 0;
            this.horizontalAlign = options.horizontalAlign || exports.ALIGN.LEFT;
            this.verticalAlign = options.verticalAlign || exports.ALIGN.CENTER;
        }
    }

    /**
     * @memberof PUXI
     * @interface
     * @property {number} width
     * @property {number} height
     * @property {number} x
     * @property {number} y
     * @property {PIXI.Point} anchor
     */
    /**
     * `PUXI.FastLayoutOptions` is an extension to `PUXI.LayoutOptions` that also
     * defines the x & y coordinates. It is accepted by the stage and `PUXI.FastLayout`.
     *
     * If x or y is between -1 and 1, then that dimension will be interpreted as a
     * percentage of the parent's width or height.
     *
     * @memberof PUXI
     * @extends PUXI.LayoutOptions
     * @class
     */
    class FastLayoutOptions extends LayoutOptions {
        constructor(options) {
            super(options.width, options.height);
            /**
             * X-coordinate of the widget in its parent's reference frame. If it is
             * absolutely less than 1, then it will be interpreted as a percent of
             * the parent's width.
             * @member {number}
             * @default 0
             */
            this.x = options.x || 0;
            /**
             * Y-coordinate of the widget in its parent's reference frame. If it is
             * absolutely less than 1, then it will be interpreted as a percent of
             * the parent's height.
             * @member {number}
             * @default 0
             */
            this.y = options.y || 0;
            /**
             * The anchor is a normalized point telling where the (x,y) position of the
             * widget lies inside of it. By default, it is (0, 0), which means that the
             * top-left corner of the widget will be at (x,y); however, setting it to
             * (.5,.5) will make the _center of the widget_ be at (x,y) in the parent's
             * reference frame.
             * @member {PIXI.Point}
             * @default PUXI.FastLayoutOptions.DEFAULT_ANCHOR
             */
            this.anchor = options.anchor || FastLayoutOptions.DEFAULT_ANCHOR.clone();
        }
    }
    FastLayoutOptions.DEFAULT_ANCHOR = new PIXI.Point(0, 0);
    FastLayoutOptions.CENTER_ANCHOR = new PIXI.Point(0.5, 0.5); // fragile, shouldn't be modified

    /**
     * @memberof PUXI
     * @interface IBorderLayoutParams
     * @property {number} width
     * @property {number} height
     * @property {number} region
     * @property {number} horizontalAlign
     * @property {number} verticalAlign
     */
    /**
     * `PUXI.BorderLayoutOptions` defines a simple layout with five regions - the center and
     * four regions along each border. The top and bottom regions span the full width of
     * the parent widget-group. The left and right regions span the height of the layout
     * minus the top and bottom region heights.
     *
     * ```
     * ------------------------------------------------
     * |                 TOP REGION                   |
     * ------------------------------------------------
     * |        |                            |        |
     * |  LEFT  |          CENTER            | RIGHT  |
     * | REGION |          REGION            | REGION |
     * |        |                            |        |
     * ------------------------------------------------
     * |                BOTTOM REGION                 |
     * ------------------------------------------------
     * ```
     *
     * The height of the layout is measured as the sum of the heights of the top, center, and bottom
     * regions. Similarly, the width of the layout is measured as the width of the left, center, and
     * right regions.
     *
     * As of now, border layout doesn't support percent widths and heights.
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.LayoutOptions
     */
    class BorderLayoutOptions extends LayoutOptions {
        constructor(options) {
            super(options.width, options.height);
            /**
             * The border along which the widget is to be placed. This can be one of `POS_LEFT`,
             * `POS_TOP`, `POS_RIGHT`, `POS_BOTTOM`.
             * @member {number}
             * @default {PUXI.BorderLayoutOptions#REGION_CENTER}
             */
            this.region = options.region || BorderLayoutOptions.REGION_CENTER;
            /**
             * Alignment of the widget horizontally in its region.
             * @member {PUXI.ALIGN}
             * @default {PUXI.ALIGN.LEFT}
             */
            this.horizontalAlign = options.horizontalAlign || exports.ALIGN.LEFT;
            /**
             * Alignment of the widget vertically in its region.
             * @member {PUXI.ALIGN}
             * @default {PUXI.ALIGN.TOP}
             */
            this.verticalAlign = options.verticalAlign || exports.ALIGN.TOP;
        }
    }
    /**
     * Positions a widget inside the left border of the layout.
     * @static
     * @member {number}
     */
    BorderLayoutOptions.REGION_LEFT = 0xeff1;
    /**
     * Positions a widget below the top border of the layout.
     * @static
     * @member {number}
     */
    BorderLayoutOptions.REGION_TOP = 0xeff2;
    /**
     * Positions a widget below the right border of the layout.
     * @static
     * @member {number}
     */
    BorderLayoutOptions.REGION_RIGHT = 0xeff3;
    /**
     * Positions a widget below the top border of the layout.
     * @static
     * @member {number}
     */
    BorderLayoutOptions.REGION_BOTTOM = 0xeff4;
    /**
     * Positions a widget in the center of the layout. The main content of the layout
     * should be in the center.
     * @static
     * @member {number}
     */
    BorderLayoutOptions.REGION_CENTER = 0xeff5;

    /**
     * `PUXI.FastLayout` is used in conjunction with `PUXI.FastLayoutOptions`. It is the
     * default layout for most widget groups.
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.ILayoutManager
     * @example
     * ```
     * parent.useLayout(new PUXI.FastLayout())
     * ```
     */
    class FastLayout {
        onAttach(host) {
            this.host = host;
        }
        onDetach() {
            this.host = null;
        }
        onLayout() {
            const parent = this.host;
            const { contentWidth: width, contentHeight: height, widgetChildren: children } = parent;
            for (let i = 0, j = children.length; i < j; i++) {
                const widget = children[i];
                const lopt = (widget.layoutOptions || LayoutOptions.DEFAULT);
                let x = lopt.x ? lopt.x : 0;
                let y = lopt.y ? lopt.y : 0;
                if (Math.abs(x) < 1) {
                    x *= width;
                }
                if (Math.abs(y) < 1) {
                    y *= height;
                }
                const anchor = lopt.anchor || FastLayoutOptions.DEFAULT_ANCHOR;
                const l = x - (anchor.x * widget.getMeasuredWidth());
                const t = y - (anchor.y * widget.getMeasuredHeight());
                widget.layout(l, t, l + widget.getMeasuredWidth(), t + widget.getMeasuredHeight());
            }
        }
        onMeasure(maxWidth, maxHeight, widthMode, heightMode) {
            // TODO: Passthrough optimization pass, if there is only one child with FILL_PARENT width or height
            // then don't measure twice.
            this._measuredWidth = maxWidth;
            this._measuredHeight = maxHeight;
            const children = this.host.widgetChildren;
            // Measure children
            for (let i = 0, j = children.length; i < j; i++) {
                const widget = children[i];
                const lopt = (widget.layoutOptions || LayoutOptions.DEFAULT);
                const loptWidth = (Math.abs(lopt.width) < 1) ? lopt.width * maxWidth : lopt.width;
                const loptHeight = (Math.abs(lopt.height) < 1) ? lopt.height * maxHeight : lopt.height;
                const widthMeasureMode = this.getChildMeasureMode(lopt.width, widthMode);
                const heightMeasureMode = this.getChildMeasureMode(lopt.height, heightMode);
                widget.measure(loptWidth, loptHeight, widthMeasureMode, heightMeasureMode);
            }
            this._measuredWidth = this.measureWidthReach(maxWidth, widthMode);
            this._measuredHeight = this.measureHeightReach(maxHeight, heightMode);
            this.measureChildFillers();
        }
        getChildMeasureMode(dimen, parentMeasureMode) {
            if (dimen === LayoutOptions.WRAP_CONTENT) {
                // No MeasureMode.EXACTLY!
                return parentMeasureMode === exports.MeasureMode.UNBOUNDED ? exports.MeasureMode.UNBOUNDED : exports.MeasureMode.AT_MOST;
            }
            return parentMeasureMode;
        }
        measureWidthReach(parentWidthLimit, widthMode) {
            if (widthMode === exports.MeasureMode.EXACTLY) {
                return parentWidthLimit;
            }
            const children = this.host.widgetChildren;
            let measuredWidth = 0;
            for (let i = 0, j = children.length; i < j; i++) {
                const widget = children[i];
                const childWidth = widget.getMeasuredWidth();
                const lopt = (widget.layoutOptions || LayoutOptions.DEFAULT);
                const x = lopt.x ? lopt.x : 0;
                const anchor = lopt.anchor ? lopt.anchor : FastLayoutOptions.DEFAULT_ANCHOR;
                // If lopt.x is %, then (1 - lopt.x)% of parent width should be as large
                // as (1 - anchor.x)% child's width.
                const minr = (Math.abs(x) < 1 ? (1 - anchor.x) * childWidth / (1 - x) : x + childWidth);
                measuredWidth = Math.max(measuredWidth, minr);
            }
            if (widthMode === exports.MeasureMode.AT_MOST) {
                measuredWidth = Math.min(parentWidthLimit, measuredWidth);
            }
            return measuredWidth;
        }
        measureHeightReach(parentHeightLimit, heightMode) {
            if (heightMode === exports.MeasureMode.EXACTLY) {
                return parentHeightLimit;
            }
            const children = this.host.widgetChildren;
            let measuredHeight = 0;
            for (let i = 0, j = children.length; i < j; i++) {
                const widget = children[i];
                const childHeight = widget.getMeasuredHeight();
                const lopt = (widget.layoutOptions || LayoutOptions.DEFAULT);
                const y = lopt.y ? lopt.y : 0;
                const anchor = lopt.anchor ? lopt.anchor : FastLayoutOptions.DEFAULT_ANCHOR;
                const minb = (Math.abs(y) < 1 ? (1 - anchor.y) * childHeight / (1 - y) : y + childHeight);
                measuredHeight = Math.max(measuredHeight, minb);
            }
            if (heightMode === exports.MeasureMode.AT_MOST) {
                measuredHeight = Math.min(parentHeightLimit, measuredHeight);
            }
            return measuredHeight;
        }
        measureChildFillers() {
            const children = this.host.widgetChildren;
            for (let i = 0, j = children.length; i < j; i++) {
                const widget = children[i];
                const lopt = (widget.layoutOptions || LayoutOptions.DEFAULT);
                let loptWidth = (Math.abs(lopt.width) < 1) ? lopt.width * this._measuredWidth : lopt.width;
                let loptHeight = (Math.abs(lopt.height) < 1) ? lopt.height * this._measuredHeight : lopt.height;
                if (loptWidth === LayoutOptions.WRAP_CONTENT) {
                    loptWidth = widget.getMeasuredWidth();
                }
                if (loptHeight === LayoutOptions.WRAP_CONTENT) {
                    loptHeight = widget.getMeasuredHeight();
                }
                if (lopt.width === LayoutOptions.FILL_PARENT || lopt.height === LayoutOptions.FILL_PARENT) {
                    widget.measure(lopt.width === LayoutOptions.FILL_PARENT ? this._measuredWidth : loptWidth, lopt.height === LayoutOptions.FILL_PARENT ? this._measuredHeight : loptHeight, exports.MeasureMode.EXACTLY, exports.MeasureMode.EXACTLY);
                }
            }
        }
        getMeasuredWidth() {
            return this._measuredWidth;
        }
        getMeasuredHeight() {
            return this._measuredHeight;
        }
    }

    /**
     * A widget group is a layout owner that can position its children according
     * to the layout given to it.
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.Widget
     * @example
     * ```
     * const group = new PUXI.InteractiveGroup();
     *
     * group.useLayout(new PUXI.AnchorLayout());
     *
     * group.addChild(new PUXI.Button({ text: "Hey" })
     *  .setLayoutOptions(
     *      new PUXI.AnchorLayoutOptions({
     *             anchorLeft: 100,
     *             anchorTop: 300,
     *             anchorRight: .4,
     *             anchorBottom: 500,
     *             horizontalAlign: PUXI.ALIGN.CENTER
     *      })
     *  )
     * )
     * ```
     */
    class WidgetGroup extends Widget {
        /**
         * Will set the given layout-manager to be used for positioning child widgets.
         *
         * @param {PUXI.ILayoutManager} layoutMgr
         */
        useLayout(layoutMgr) {
            if (this.layoutMgr) {
                this.layoutMgr.onDetach();
            }
            this.layoutMgr = layoutMgr;
            if (layoutMgr) {
                this.layoutMgr.onAttach(this);
            }
            return this;
        }
        /**
         * Sets the widget-recommended layout manager. By default (if not overriden by widget
         * group class), this is a fast-layout.
         */
        useDefaultLayout() {
            this.useLayout(new FastLayout());
        }
        onMeasure(width, height, widthMode, heightMode) {
            super.onMeasure(width, height, widthMode, heightMode);
            if (this.widgetChildren.length === 0) {
                return;
            }
            if (!this.layoutMgr) {
                this.useDefaultLayout();
            }
            this.layoutMgr.onMeasure(width - this.paddingHorizontal, height - this.paddingVertical, widthMode, heightMode);
            this._measuredWidth = Math.max(this.measuredWidth, this.layoutMgr.getMeasuredWidth());
            this._measuredHeight = Math.max(this.measuredHeight, this.layoutMgr.getMeasuredHeight());
        }
        onLayout(l, t, r, b, dirty = true) {
            super.onLayout(l, t, r, b, dirty);
            if (this.widgetChildren.length === 0) {
                return;
            }
            if (!this.layoutMgr) {
                this.useDefaultLayout();
            }
            this.layoutMgr.onLayout(); // layoutMgr is attached to this
        }
    }

    /**
     * An interactive container.
     *
     * @class
     * @extends PUXI.WidgetGroup
     * @memberof PUXI
     */
    class InteractiveGroup extends WidgetGroup {
        constructor() {
            super();
            this.hitArea = new PIXI.Rectangle();
            this.insetContainer.hitArea = this.hitArea;
        }
        update() {
            super.update();
        }
        layout(l, t, r, b, dirty) {
            super.layout(l, t, r, b, dirty);
            this.hitArea.width = this.width;
            this.hitArea.height = this.height;
        }
    }

    /**
     * Represents a view that can gain or loose focus. It is primarily subclassed by
     * input/form widgets.
     *
     * Generally, it is a good idea not use layouts on these types of widgets.
     *
     * @class
     * @extends PUXI.Widget
     * @memberof PUXI
     */
    class FocusableWidget extends InteractiveGroup {
        /**
         * @param {PUXI.IInputBaseOptions} options
         * @param {PIXI.Container}[options.background]
         * @param {number}[options.tabIndex]
         * @param {any}[options.tabGroup]
         */
        constructor(options = {}) {
            super();
            this.bindEvents = () => {
                this.stage.on('pointerdown', this.onDocumentPointerDownImpl);
                document.addEventListener('keydown', this.onKeyDownImpl);
            };
            this.clearEvents = () => {
                this.stage.off('pointerdown', this.onDocumentPointerDownImpl);
                document.removeEventListener('keydown', this.onKeyDownImpl);
            };
            this.onKeyDownImpl = (e) => {
                const focusCtl = this.stage.focusController;
                if (e.which === 9 && focusCtl.useTab) {
                    focusCtl.onTab();
                    e.preventDefault();
                }
                else if (e.which === 38 && focusCtl.useBack) {
                    focusCtl.onBack();
                    e.preventDefault();
                }
                else if (e.which === 40 && focusCtl.useForward) {
                    focusCtl.onForward();
                    e.preventDefault();
                }
                this.emit('keydown');
            };
            this.onDocumentPointerDownImpl = () => {
                if (!this._isMousePressed) {
                    this.blur();
                }
            };
            if (options.background) {
                super.setBackground(options.background);
            }
            // Prevents double focusing/blurring.
            this._isFocused = false;
            // Used to lose focus when mouse-down outside widget.
            this._isMousePressed = false;
            this.interactive = true;
            /**
             * @member {number}
             * @readonly
             */
            this.tabIndex = options.tabIndex;
            /**
             * The name of the tab group in which this widget's focus will move on
             * pressing tab.
             * @member {PUXI.TabGroup}
             * @readonly
             */
            this.tabGroup = options.tabGroup;
            this.insetContainer.on('pointerdown', () => {
                this.focus();
                this._isMousePressed = true;
            });
            this.insetContainer.on('pointerup', () => { this._isMousePressed = false; });
            this.insetContainer.on('pointerupoutside', () => { this._isMousePressed = false; });
        }
        /**
         * Brings this widget into focus.
         */
        focus() {
            if (this.isFocused) {
                return;
            }
            this.stage.focusController.notifyFocus(this);
            this._isFocused = true;
            this.bindEvents();
            this.emit('focusChanged', true);
            this.emit('focus');
        }
        /**
         * Brings this widget out of focus.
         */
        blur() {
            if (!this._isFocused) {
                return;
            }
            this.stage.focusController.notifyBlur();
            this._isFocused = false;
            this.clearEvents();
            this.emit('focusChanged', false);
            this.emit('blur');
        }
        /**
         * Whether this widget is in focus.
         * @member {boolean}
         * @readonly
         */
        get isFocused() {
            return this._isFocused;
        }
        initialize() {
            super.initialize();
            this.stage.focusController.in(this, this.tabIndex, this.tabGroup);
        }
    }

    /**
     * A static text widget. It cannot retain children.
     *
     * @memberof PUXI
     * @public
     */
    class TextWidget extends Widget {
        /**
         * @param {string} text - text content
         * @param {PIXI.TextStyle} textStyle - styled used for text
         */
        constructor(text, textStyle) {
            super();
            this.textDisplay = new PIXI.Text(text, textStyle);
            this.contentContainer.addChild(this.textDisplay);
        }
        update() {
            super.update();
            if (this.tint !== null) {
                this.textDisplay.tint = this.tint;
            }
            if (this.blendMode !== null) {
                this.textDisplay.blendMode = this.blendMode;
            }
        }
        /**
         * @deprecated
         */
        get value() {
            return this.textDisplay.text;
        }
        set value(val) {
            this.textDisplay.text = val;
        }
        get text() {
            return this.value;
        }
        set text(val) {
            this.value = val;
        }
        /**
         * Get the text style. You can set properties directly on the style.
         */
        getTextStyle() {
            return this.textDisplay.style;
        }
        /**
         * Set the text style directly
         *
         * @param textStyle
         * @example
         * textWidget.setTextStyle({
         *     fontFamily: 'Roboto',
         *     fontSize: 14
         * })
         */
        setTextStyle(textStyle) {
            this.textDisplay.style = textStyle;
            return this;
        }
        onStyleChange(style) {
            super.onStyleChange(style);
            const styleData = style.getProperties(...TEXT_STYLE_PROPERTIES);
            const textStyle = this.textDisplay.style;
            TEXT_STYLE_PROPERTIES.forEach((propName) => {
                if (styleData[propName] !== undefined) {
                    textStyle[propName] = styleData[propName];
                }
            });
        }
    }

    /**
     * Button that can be clicked.
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.FocusableWidget
     */
    class Button extends FocusableWidget {
        /**
         * @param [options.background}] {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as background for Button
         * @param [options.text=null] {PIXI.UI.Text} optional text
         * @param [options.tabIndex=0] {Number} input tab index
         * @param [options.tabGroup=0] {Number|String} input tab group
         * @param [options.width=options.background.width] {Number|String} width
         * @param [options.height=options.background.height] {Number|String} height
         */
        constructor(options) {
            super(options);
            this.isHover = false;
            if (typeof options.text === 'string') {
                options.text = new TextWidget(options.text, new PIXI.TextStyle());
            }
            this.textWidget = options.text.setLayoutOptions(new FastLayoutOptions({
                width: LayoutOptions.WRAP_CONTENT,
                height: LayoutOptions.WRAP_CONTENT,
                x: 0.5,
                y: 0.5,
                anchor: FastLayoutOptions.CENTER_ANCHOR,
            }));
            if (this.textWidget) {
                this.addChild(this.textWidget);
            }
            this.contentContainer.buttonMode = true;
        }
        onClick(e) {
            super.onClick(e);
            this.emit('click', e);
        }
        onDoubleClick(e) {
            super.onDoubleClick(e);
            this.emit('doubleclick', e);
        }
        update() {
            super.update();
            // No update needed
        }
        initialize() {
            super.initialize();
            this.insetContainer.interactiveChildren = false;
            // lazy to make sure all children is initialized (trying to get the bedst hitArea possible)
        }
        /**
         * Label for this button.
         * @member {string}
         */
        get value() {
            if (this.textWidget) {
                return this.textWidget.text;
            }
            return '';
        }
        set value(val) {
            if (this.textWidget) {
                this.textWidget.text = val;
            }
        }
        get text() {
            return this.textWidget;
        }
        set text(val) {
            this.value = val;
        }
        onStyleChange(style) {
            // eslint-disable-next-line
            // @ts-ignore
            this.textWidget.onStyleChange(style);
        }
    }
    /*
     * Features:
     * Button, radio button (checkgroups)
     *
     * Methods:
     * blur()
     * focus()
     *
     * Properties:
     * checked: get/set Button checked
     * value: get/set Button value
     *
     * Events:
     * "hover"          param: [bool]isHover (hover/leave)
     * "press"          param: [bool]isPressed (pointerdown/pointerup)
     * "click"
     * "blur"
     * "focus"
     * "focusChanged"   param: [bool]isFocussed
     *
     */

    /**
     * @memberof PUXI
     * @extends PUXI.IFocusableOptions
     * @member {boolean} checked
     * @member {PIXI.Container}[checkmark]
     * @member {PUXI.CheckGroup}[checkGroup]
     * @member {string}[value]
     */
    /**
     * A checkbox is a button can be selected (checked). It has a on/off state that
     * can be controlled by the user.
     *
     * When used in a checkbox group, the group will control whether the checkbox can
     * be selected or not.
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.FocusableWidget
     */
    class CheckBox extends FocusableWidget {
        /**
         * @param {PUXI.ICheckBoxOptions} options
         * @param [options.checked=false] {bool} is checked
         * @param options.background {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as background for CheckBox
         * @param options.checkmark {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as checkmark for CheckBox
         * @param {PUXI.CheckGroup}[options.checkGroup=null] CheckGroup name
         * @param options.value {String} mostly used along with checkgroup
         * @param [options.tabIndex=0] {Number} input tab index
         * @param [options.tabGroup=0] {Number|String} input tab group
         */
        constructor(options) {
            super(options);
            this.change = (val) => {
                if (this.checkmark) {
                    this.checkmark.alpha = val ? 1 : 0;
                }
            };
            this.click = () => {
                this.emit('click');
                if (this.checkGroup !== null && this.checked) {
                    return;
                }
                this.checked = !this.checked;
                this.emit('changed', this.checked);
            };
            this._checked = options.checked !== undefined ? options.checked : false;
            this._value = options.value || '';
            this.checkGroup = options.checkGroup || null;
            this.checkmark = new InteractiveGroup();
            this.checkmark.contentContainer.addChild(options.checkmark);
            this.checkmark.setLayoutOptions(new FastLayoutOptions({
                width: LayoutOptions.WRAP_CONTENT,
                height: LayoutOptions.WRAP_CONTENT,
                x: 0.5,
                y: 0.5,
                anchor: FastLayoutOptions.CENTER_ANCHOR,
            }));
            this.checkmark.alpha = this._checked ? 1 : 0;
            this.addChild(this.checkmark);
            this.contentContainer.buttonMode = true;
        }
        update() {
            // No need for updating
        }
        get checked() {
            return this._checked;
        }
        set checked(val) {
            if (val !== this._checked) {
                if (this.checkGroup !== null && val) {
                    this.stage.checkBoxGroupController.notifyCheck(this);
                }
                this._checked = val;
                this.change(val);
            }
        }
        get value() {
            return this._value;
        }
        set value(val) {
            this._value = val;
            if (this.checked) {
                this.stage.checkBoxGroupController.notifyCheck(this);
            }
        }
        get selectedValue() {
            var _a;
            return (_a = this.stage) === null || _a === void 0 ? void 0 : _a.checkBoxGroupController.getSelected(this.checkGroup).value;
        }
        initialize() {
            super.initialize();
            const clickMgr = this.eventBroker.click;
            clickMgr.onHover = (_, over) => {
                this.emit('hover', over);
            };
            clickMgr.onPress = (e, isPressed) => {
                if (isPressed) {
                    this.focus();
                    e.data.originalEvent.preventDefault();
                }
                this.emit('press', isPressed);
            };
            clickMgr.onClick = () => {
                this.click();
            };
            if (this.checkGroup !== null) {
                this.stage.checkBoxGroupController.in(this, this.checkGroup);
            }
        }
    }
    /*
     * Features:
     * checkbox, radio button (checkgroups)
     *
     * Methods:
     * blur()
     * focus()
     * change(checked) //only exposed to overwrite (if you dont want to hard toggle alpha of checkmark)
     *
     * Properties:
     * checked: get/set checkbox checked
     * value: get/set checkbox value
     * selectedValue: get/set selected value for checkgroup
     *
     * Events:
     * "hover"          param: [bool]isHover (hover/leave)
     * "press"          param: [bool]isPressed (pointerdown/pointerup)
     * "click"
     * "blur"
     * "focus"
     * "focusChanged"   param: [bool]isFocussed
     * "change"         param: [bool]isChecked
     *
     */

    class EaseBase
    {
        getPosition(p)
        {
            return p;
        }
    }

    function ExponentialEase(power, easeIn, easeOut)
    {
        const pow = power;
        const t = easeIn && easeOut ? 3 : easeOut ? 1 : 2;

        this.getPosition = function (p)
        {
            let r = (t === 1) ? 1 - p : (t === 2) ? p : (p < 0.5) ? p * 2 : (1 - p) * 2;

            if (pow === 1)
            {
                r *= r;
            }
            else if (pow === 2)
            {
                r *= r * r;
            }
            else if (pow === 3)
            {
                r *= r * r * r;
            }
            else if (pow === 4)
            {
                r *= r * r * r * r;
            }

            return (t === 1) ? 1 - r : (t === 2) ? r : (p < 0.5) ? r / 2 : 1 - (r / 2);
        };
    }

    ExponentialEase.prototype = Object.create(EaseBase.prototype);
    ExponentialEase.prototype.constructor = ExponentialEase;

    const Ease = {};

    const HALF_PI = Math.PI * 0.5;

    function create(fn)
    {
        const e = Object.create(EaseBase.prototype);

        e.getPosition = fn;

        return e;
    }

    const Linear = new EaseBase();

    // Liear
    Ease.Linear = Linear;

    // Exponetial Eases
    function wrapEase(easeInFunction, easeOutFunction, easeInOutFunction)
    {
        return {
            easeIn: easeInFunction,
            easeOut: easeOutFunction,
            easeInOut: easeInOutFunction,
        };
    }

    Ease.Power0 = {
        easeNone: Linear,
    };

    Ease.Power1 = Ease.Quad = wrapEase(
        new ExponentialEase(1, 1, 0),
        new ExponentialEase(1, 0, 1),
        new ExponentialEase(1, 1, 1));

    Ease.Power2 = Ease.Cubic = wrapEase(
        new ExponentialEase(2, 1, 0),
        new ExponentialEase(2, 0, 1),
        new ExponentialEase(2, 1, 1));

    Ease.Power3 = Ease.Quart = wrapEase(
        new ExponentialEase(3, 1, 0),
        new ExponentialEase(3, 0, 1),
        new ExponentialEase(3, 1, 1));

    Ease.Power4 = Ease.Quint = wrapEase(
        new ExponentialEase(4, 1, 0),
        new ExponentialEase(4, 0, 1),
        new ExponentialEase(4, 1, 1));

    // Bounce
    Ease.Bounce = {
        BounceIn: create(function (p)
        {
            if ((p = 1 - p) < 1 / 2.75)
            {
                return 1 - (7.5625 * p * p);
            }
            else if (p < 2 / 2.75)
            {
                return 1 - (7.5625 * (p -= 1.5 / 2.75) * p + 0.75);
            }
            else if (p < 2.5 / 2.75)
            {
                return 1 - (7.5625 * (p -= 2.25 / 2.75) * p + 0.9375);
            }

            return 1 - (7.5625 * (p -= 2.625 / 2.75) * p + 0.984375);
        }),
        BounceOut: create(function (p)
        {
            if (p < 1 / 2.75)
            {
                return 7.5625 * p * p;
            }
            else if (p < 2 / 2.75)
            {
                return 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
            }
            else if (p < 2.5 / 2.75)
            {
                return 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
            }

            return 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
        }),
        BounceInOut: create(function (p)
        {
            const invert = (p < 0.5);

            if (invert)
            {
                p = 1 - (p * 2);
            }
            else
            {
                p = (p * 2) - 1;
            }
            if (p < 1 / 2.75)
            {
                p = 7.5625 * p * p;
            }
            else if (p < 2 / 2.75)
            {
                p = 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
            }
            else if (p < 2.5 / 2.75)
            {
                p = 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
            }
            else
            {
                p = 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
            }

            return invert ? (1 - p) * 0.5 : p * 0.5 + 0.5;
        }),
    };

    // Circ
    Ease.Circ = {
        CircIn: create(function (p)
        {
            return -(Math.sqrt(1 - (p * p)) - 1);
        }),
        CircOut: create(function (p)
        {
            return Math.sqrt(1 - (p = p - 1) * p);
        }),
        CircInOut: create(function (p)
        {
            return ((p *= 2) < 1) ? -0.5 * (Math.sqrt(1 - p * p) - 1) : 0.5 * (Math.sqrt(1 - (p -= 2) * p) + 1);
        }),
    };

    // Expo
    Ease.Expo = {
        ExpoIn: create(function (p)
        {
            return Math.pow(2, 10 * (p - 1)) - 0.001;
        }),
        ExpoOut: create(function (p)
        {
            return 1 - Math.pow(2, -10 * p);
        }),
        ExpoInOut: create(function (p)
        {
            return ((p *= 2) < 1) ? 0.5 * Math.pow(2, 10 * (p - 1)) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
        }),
    };

    // Sine
    Ease.Sine = {
        SineIn: create(function (p)
        {
            return -Math.cos(p * HALF_PI) + 1;
        }),
        SineOut: create(function (p)
        {
            return Math.sin(p * HALF_PI);
        }),
        SineInOut: create(function (p)
        {
            return -0.5 * (Math.cos(Math.PI * p) - 1);
        }),
    };

    const Helpers = {
        Lerp(start, stop, amt) {
            if (amt > 1)
                amt = 1;
            else if (amt < 0)
                amt = 0;
            return start + (stop - start) * amt;
        },
        Round(number, decimals) {
            const pow = Math.pow(10, decimals);
            return Math.round(number * pow) / pow;
        },
        componentToHex(c) {
            const hex = c.toString(16);
            return hex.length == 1 ? `0${hex}` : hex;
        },
        rgbToHex(r, g, b) {
            return `#${this.componentToHex(r)}${this.componentToHex(g)}${this.componentToHex(b)}`;
        },
        rgbToNumber(r, g, b) {
            return r * 65536 + g * 256 + b;
        },
        numberToRgb(c) {
            return {
                r: Math.floor(c / (256 * 256)),
                g: Math.floor(c / 256) % 256,
                b: c % 256,
            };
        },
        hexToRgb(hex) {
            if (hex === null) {
                hex = 0xffffff;
            }
            if (!isNaN(hex)) {
                return this.numberToRgb(hex);
            }
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });
            const result = (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
            } : null;
        },
    };

    /**
     * An UI sprite object
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.Widget
     */
    class Sprite extends Widget {
        constructor(texture) {
            super();
            this.spriteDisplay = new PIXI.Sprite(texture);
            this.contentContainer.addChild(this.spriteDisplay);
        }
        update() {
            if (this.tint !== null) {
                this.spriteDisplay.tint = this.tint;
            }
            if (this.blendMode !== null) {
                this.spriteDisplay.blendMode = this.blendMode;
            }
        }
        static fromImage(imageUrl) {
            return new Sprite(new PIXI.Texture(new PIXI.BaseTexture(imageUrl)));
        }
    }
    const ImageWidget = Sprite;

    var appleIphone = /iPhone/i;
    var appleIpod = /iPod/i;
    var appleTablet = /iPad/i;
    var appleUniversal = /\biOS-universal(?:.+)Mac\b/i;
    var androidPhone = /\bAndroid(?:.+)Mobile\b/i;
    var androidTablet = /Android/i;
    var amazonPhone = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i;
    var amazonTablet = /Silk/i;
    var windowsPhone = /Windows Phone/i;
    var windowsTablet = /\bWindows(?:.+)ARM\b/i;
    var otherBlackBerry = /BlackBerry/i;
    var otherBlackBerry10 = /BB10/i;
    var otherOpera = /Opera Mini/i;
    var otherChrome = /\b(CriOS|Chrome)(?:.+)Mobile/i;
    var otherFirefox = /Mobile(?:.+)Firefox\b/i;
    var isAppleTabletOnIos13 = function (navigator) {
        return (typeof navigator !== 'undefined' &&
            navigator.platform === 'MacIntel' &&
            typeof navigator.maxTouchPoints === 'number' &&
            navigator.maxTouchPoints > 1 &&
            typeof MSStream === 'undefined');
    };
    function createMatch(userAgent) {
        return function (regex) { return regex.test(userAgent); };
    }
    function isMobile(param) {
        var nav = {
            userAgent: '',
            platform: '',
            maxTouchPoints: 0
        };
        if (!param && typeof navigator !== 'undefined') {
            nav = {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                maxTouchPoints: navigator.maxTouchPoints || 0
            };
        }
        else if (typeof param === 'string') {
            nav.userAgent = param;
        }
        else if (param && param.userAgent) {
            nav = {
                userAgent: param.userAgent,
                platform: param.platform,
                maxTouchPoints: param.maxTouchPoints || 0
            };
        }
        var userAgent = nav.userAgent;
        var tmp = userAgent.split('[FBAN');
        if (typeof tmp[1] !== 'undefined') {
            userAgent = tmp[0];
        }
        tmp = userAgent.split('Twitter');
        if (typeof tmp[1] !== 'undefined') {
            userAgent = tmp[0];
        }
        var match = createMatch(userAgent);
        var result = {
            apple: {
                phone: match(appleIphone) && !match(windowsPhone),
                ipod: match(appleIpod),
                tablet: !match(appleIphone) &&
                    (match(appleTablet) || isAppleTabletOnIos13(nav)) &&
                    !match(windowsPhone),
                universal: match(appleUniversal),
                device: (match(appleIphone) ||
                    match(appleIpod) ||
                    match(appleTablet) ||
                    match(appleUniversal) ||
                    isAppleTabletOnIos13(nav)) &&
                    !match(windowsPhone)
            },
            amazon: {
                phone: match(amazonPhone),
                tablet: !match(amazonPhone) && match(amazonTablet),
                device: match(amazonPhone) || match(amazonTablet)
            },
            android: {
                phone: (!match(windowsPhone) && match(amazonPhone)) ||
                    (!match(windowsPhone) && match(androidPhone)),
                tablet: !match(windowsPhone) &&
                    !match(amazonPhone) &&
                    !match(androidPhone) &&
                    (match(amazonTablet) || match(androidTablet)),
                device: (!match(windowsPhone) &&
                    (match(amazonPhone) ||
                        match(amazonTablet) ||
                        match(androidPhone) ||
                        match(androidTablet))) ||
                    match(/\bokhttp\b/i)
            },
            windows: {
                phone: match(windowsPhone),
                tablet: match(windowsTablet),
                device: match(windowsPhone) || match(windowsTablet)
            },
            other: {
                blackberry: match(otherBlackBerry),
                blackberry10: match(otherBlackBerry10),
                opera: match(otherOpera),
                firefox: match(otherFirefox),
                chrome: match(otherChrome),
                device: match(otherBlackBerry) ||
                    match(otherBlackBerry10) ||
                    match(otherOpera) ||
                    match(otherFirefox) ||
                    match(otherChrome)
            },
            any: false,
            phone: false,
            tablet: false
        };
        result.any =
            result.apple.device ||
                result.android.device ||
                result.windows.device ||
                result.other.device;
        result.phone =
            result.apple.phone || result.android.phone || result.windows.phone;
        result.tablet =
            result.apple.tablet || result.android.tablet || result.windows.tablet;
        return result;
    }

    /*!
     * @pixi/settings - v5.3.1
     * Compiled Fri, 24 Jul 2020 20:56:48 UTC
     *
     * @pixi/settings is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    // The ESM/CJS versions of ismobilejs only
    var isMobile$1 = isMobile(window.navigator);

    /**
     * The maximum recommended texture units to use.
     * In theory the bigger the better, and for desktop we'll use as many as we can.
     * But some mobile devices slow down if there is to many branches in the shader.
     * So in practice there seems to be a sweet spot size that varies depending on the device.
     *
     * In v4, all mobile devices were limited to 4 texture units because for this.
     * In v5, we allow all texture units to be used on modern Apple or Android devices.
     *
     * @private
     * @param {number} max
     * @returns {number}
     */
    function maxRecommendedTextures(max) {
        var allowMax = true;
        if (isMobile$1.tablet || isMobile$1.phone) {
            if (isMobile$1.apple.device) {
                var match = (navigator.userAgent).match(/OS (\d+)_(\d+)?/);
                if (match) {
                    var majorVersion = parseInt(match[1], 10);
                    // Limit texture units on devices below iOS 11, which will be older hardware
                    if (majorVersion < 11) {
                        allowMax = false;
                    }
                }
            }
            if (isMobile$1.android.device) {
                var match = (navigator.userAgent).match(/Android\s([0-9.]*)/);
                if (match) {
                    var majorVersion = parseInt(match[1], 10);
                    // Limit texture units on devices below Android 7 (Nougat), which will be older hardware
                    if (majorVersion < 7) {
                        allowMax = false;
                    }
                }
            }
        }
        return allowMax ? max : 4;
    }

    /**
     * Uploading the same buffer multiple times in a single frame can cause performance issues.
     * Apparent on iOS so only check for that at the moment
     * This check may become more complex if this issue pops up elsewhere.
     *
     * @private
     * @returns {boolean}
     */
    function canUploadSameBuffer() {
        return !isMobile$1.apple.device;
    }

    /**
     * User's customizable globals for overriding the default PIXI settings, such
     * as a renderer's default resolution, framerate, float precision, etc.
     * @example
     * // Use the native window resolution as the default resolution
     * // will support high-density displays when rendering
     * PIXI.settings.RESOLUTION = window.devicePixelRatio;
     *
     * // Disable interpolation when scaling, will make texture be pixelated
     * PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
     * @namespace PIXI.settings
     */
    var settings = {
        /**
         * If set to true WebGL will attempt make textures mimpaped by default.
         * Mipmapping will only succeed if the base texture uploaded has power of two dimensions.
         *
         * @static
         * @name MIPMAP_TEXTURES
         * @memberof PIXI.settings
         * @type {PIXI.MIPMAP_MODES}
         * @default PIXI.MIPMAP_MODES.POW2
         */
        MIPMAP_TEXTURES: 1,
        /**
         * Default anisotropic filtering level of textures.
         * Usually from 0 to 16
         *
         * @static
         * @name ANISOTROPIC_LEVEL
         * @memberof PIXI.settings
         * @type {number}
         * @default 0
         */
        ANISOTROPIC_LEVEL: 0,
        /**
         * Default resolution / device pixel ratio of the renderer.
         *
         * @static
         * @name RESOLUTION
         * @memberof PIXI.settings
         * @type {number}
         * @default 1
         */
        RESOLUTION: 1,
        /**
         * Default filter resolution.
         *
         * @static
         * @name FILTER_RESOLUTION
         * @memberof PIXI.settings
         * @type {number}
         * @default 1
         */
        FILTER_RESOLUTION: 1,
        /**
         * The maximum textures that this device supports.
         *
         * @static
         * @name SPRITE_MAX_TEXTURES
         * @memberof PIXI.settings
         * @type {number}
         * @default 32
         */
        SPRITE_MAX_TEXTURES: maxRecommendedTextures(32),
        // TODO: maybe change to SPRITE.BATCH_SIZE: 2000
        // TODO: maybe add PARTICLE.BATCH_SIZE: 15000
        /**
         * The default sprite batch size.
         *
         * The default aims to balance desktop and mobile devices.
         *
         * @static
         * @name SPRITE_BATCH_SIZE
         * @memberof PIXI.settings
         * @type {number}
         * @default 4096
         */
        SPRITE_BATCH_SIZE: 4096,
        /**
         * The default render options if none are supplied to {@link PIXI.Renderer}
         * or {@link PIXI.CanvasRenderer}.
         *
         * @static
         * @name RENDER_OPTIONS
         * @memberof PIXI.settings
         * @type {object}
         * @property {HTMLCanvasElement} view=null
         * @property {number} resolution=1
         * @property {boolean} antialias=false
         * @property {boolean} autoDensity=false
         * @property {boolean} transparent=false
         * @property {number} backgroundColor=0x000000
         * @property {boolean} clearBeforeRender=true
         * @property {boolean} preserveDrawingBuffer=false
         * @property {number} width=800
         * @property {number} height=600
         * @property {boolean} legacy=false
         */
        RENDER_OPTIONS: {
            view: null,
            antialias: false,
            autoDensity: false,
            transparent: false,
            backgroundColor: 0x000000,
            clearBeforeRender: true,
            preserveDrawingBuffer: false,
            width: 800,
            height: 600,
            legacy: false,
        },
        /**
         * Default Garbage Collection mode.
         *
         * @static
         * @name GC_MODE
         * @memberof PIXI.settings
         * @type {PIXI.GC_MODES}
         * @default PIXI.GC_MODES.AUTO
         */
        GC_MODE: 0,
        /**
         * Default Garbage Collection max idle.
         *
         * @static
         * @name GC_MAX_IDLE
         * @memberof PIXI.settings
         * @type {number}
         * @default 3600
         */
        GC_MAX_IDLE: 60 * 60,
        /**
         * Default Garbage Collection maximum check count.
         *
         * @static
         * @name GC_MAX_CHECK_COUNT
         * @memberof PIXI.settings
         * @type {number}
         * @default 600
         */
        GC_MAX_CHECK_COUNT: 60 * 10,
        /**
         * Default wrap modes that are supported by pixi.
         *
         * @static
         * @name WRAP_MODE
         * @memberof PIXI.settings
         * @type {PIXI.WRAP_MODES}
         * @default PIXI.WRAP_MODES.CLAMP
         */
        WRAP_MODE: 33071,
        /**
         * Default scale mode for textures.
         *
         * @static
         * @name SCALE_MODE
         * @memberof PIXI.settings
         * @type {PIXI.SCALE_MODES}
         * @default PIXI.SCALE_MODES.LINEAR
         */
        SCALE_MODE: 1,
        /**
         * Default specify float precision in vertex shader.
         *
         * @static
         * @name PRECISION_VERTEX
         * @memberof PIXI.settings
         * @type {PIXI.PRECISION}
         * @default PIXI.PRECISION.HIGH
         */
        PRECISION_VERTEX: 'highp',
        /**
         * Default specify float precision in fragment shader.
         * iOS is best set at highp due to https://github.com/pixijs/pixi.js/issues/3742
         *
         * @static
         * @name PRECISION_FRAGMENT
         * @memberof PIXI.settings
         * @type {PIXI.PRECISION}
         * @default PIXI.PRECISION.MEDIUM
         */
        PRECISION_FRAGMENT: isMobile$1.apple.device ? 'highp' : 'mediump',
        /**
         * Can we upload the same buffer in a single frame?
         *
         * @static
         * @name CAN_UPLOAD_SAME_BUFFER
         * @memberof PIXI.settings
         * @type {boolean}
         */
        CAN_UPLOAD_SAME_BUFFER: canUploadSameBuffer(),
        /**
         * Enables bitmap creation before image load. This feature is experimental.
         *
         * @static
         * @name CREATE_IMAGE_BITMAP
         * @memberof PIXI.settings
         * @type {boolean}
         * @default false
         */
        CREATE_IMAGE_BITMAP: false,
        /**
         * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
         * Advantages can include sharper image quality (like text) and faster rendering on canvas.
         * The main disadvantage is movement of objects may appear less smooth.
         *
         * @static
         * @constant
         * @memberof PIXI.settings
         * @type {boolean}
         * @default false
         */
        ROUND_PIXELS: false,
    };

    /*!
     * @pixi/constants - v5.3.1
     * Compiled Fri, 24 Jul 2020 20:56:48 UTC
     *
     * @pixi/constants is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */
    /**
     * Different types of environments for WebGL.
     *
     * @static
     * @memberof PIXI
     * @name ENV
     * @enum {number}
     * @property {number} WEBGL_LEGACY - Used for older v1 WebGL devices. PixiJS will aim to ensure compatibility
     *  with older / less advanced devices. If you experience unexplained flickering prefer this environment.
     * @property {number} WEBGL - Version 1 of WebGL
     * @property {number} WEBGL2 - Version 2 of WebGL
     */
    var ENV;
    (function (ENV) {
        ENV[ENV["WEBGL_LEGACY"] = 0] = "WEBGL_LEGACY";
        ENV[ENV["WEBGL"] = 1] = "WEBGL";
        ENV[ENV["WEBGL2"] = 2] = "WEBGL2";
    })(ENV || (ENV = {}));
    /**
     * Constant to identify the Renderer Type.
     *
     * @static
     * @memberof PIXI
     * @name RENDERER_TYPE
     * @enum {number}
     * @property {number} UNKNOWN - Unknown render type.
     * @property {number} WEBGL - WebGL render type.
     * @property {number} CANVAS - Canvas render type.
     */
    var RENDERER_TYPE;
    (function (RENDERER_TYPE) {
        RENDERER_TYPE[RENDERER_TYPE["UNKNOWN"] = 0] = "UNKNOWN";
        RENDERER_TYPE[RENDERER_TYPE["WEBGL"] = 1] = "WEBGL";
        RENDERER_TYPE[RENDERER_TYPE["CANVAS"] = 2] = "CANVAS";
    })(RENDERER_TYPE || (RENDERER_TYPE = {}));
    /**
     * Bitwise OR of masks that indicate the buffers to be cleared.
     *
     * @static
     * @memberof PIXI
     * @name BUFFER_BITS
     * @enum {number}
     * @property {number} COLOR - Indicates the buffers currently enabled for color writing.
     * @property {number} DEPTH - Indicates the depth buffer.
     * @property {number} STENCIL - Indicates the stencil buffer.
     */
    var BUFFER_BITS;
    (function (BUFFER_BITS) {
        BUFFER_BITS[BUFFER_BITS["COLOR"] = 16384] = "COLOR";
        BUFFER_BITS[BUFFER_BITS["DEPTH"] = 256] = "DEPTH";
        BUFFER_BITS[BUFFER_BITS["STENCIL"] = 1024] = "STENCIL";
    })(BUFFER_BITS || (BUFFER_BITS = {}));
    /**
     * Various blend modes supported by PIXI.
     *
     * IMPORTANT - The WebGL renderer only supports the NORMAL, ADD, MULTIPLY and SCREEN blend modes.
     * Anything else will silently act like NORMAL.
     *
     * @memberof PIXI
     * @name BLEND_MODES
     * @enum {number}
     * @property {number} NORMAL
     * @property {number} ADD
     * @property {number} MULTIPLY
     * @property {number} SCREEN
     * @property {number} OVERLAY
     * @property {number} DARKEN
     * @property {number} LIGHTEN
     * @property {number} COLOR_DODGE
     * @property {number} COLOR_BURN
     * @property {number} HARD_LIGHT
     * @property {number} SOFT_LIGHT
     * @property {number} DIFFERENCE
     * @property {number} EXCLUSION
     * @property {number} HUE
     * @property {number} SATURATION
     * @property {number} COLOR
     * @property {number} LUMINOSITY
     * @property {number} NORMAL_NPM
     * @property {number} ADD_NPM
     * @property {number} SCREEN_NPM
     * @property {number} NONE
     * @property {number} SRC_IN
     * @property {number} SRC_OUT
     * @property {number} SRC_ATOP
     * @property {number} DST_OVER
     * @property {number} DST_IN
     * @property {number} DST_OUT
     * @property {number} DST_ATOP
     * @property {number} SUBTRACT
     * @property {number} SRC_OVER
     * @property {number} ERASE
     * @property {number} XOR
     */
    var BLEND_MODES;
    (function (BLEND_MODES) {
        BLEND_MODES[BLEND_MODES["NORMAL"] = 0] = "NORMAL";
        BLEND_MODES[BLEND_MODES["ADD"] = 1] = "ADD";
        BLEND_MODES[BLEND_MODES["MULTIPLY"] = 2] = "MULTIPLY";
        BLEND_MODES[BLEND_MODES["SCREEN"] = 3] = "SCREEN";
        BLEND_MODES[BLEND_MODES["OVERLAY"] = 4] = "OVERLAY";
        BLEND_MODES[BLEND_MODES["DARKEN"] = 5] = "DARKEN";
        BLEND_MODES[BLEND_MODES["LIGHTEN"] = 6] = "LIGHTEN";
        BLEND_MODES[BLEND_MODES["COLOR_DODGE"] = 7] = "COLOR_DODGE";
        BLEND_MODES[BLEND_MODES["COLOR_BURN"] = 8] = "COLOR_BURN";
        BLEND_MODES[BLEND_MODES["HARD_LIGHT"] = 9] = "HARD_LIGHT";
        BLEND_MODES[BLEND_MODES["SOFT_LIGHT"] = 10] = "SOFT_LIGHT";
        BLEND_MODES[BLEND_MODES["DIFFERENCE"] = 11] = "DIFFERENCE";
        BLEND_MODES[BLEND_MODES["EXCLUSION"] = 12] = "EXCLUSION";
        BLEND_MODES[BLEND_MODES["HUE"] = 13] = "HUE";
        BLEND_MODES[BLEND_MODES["SATURATION"] = 14] = "SATURATION";
        BLEND_MODES[BLEND_MODES["COLOR"] = 15] = "COLOR";
        BLEND_MODES[BLEND_MODES["LUMINOSITY"] = 16] = "LUMINOSITY";
        BLEND_MODES[BLEND_MODES["NORMAL_NPM"] = 17] = "NORMAL_NPM";
        BLEND_MODES[BLEND_MODES["ADD_NPM"] = 18] = "ADD_NPM";
        BLEND_MODES[BLEND_MODES["SCREEN_NPM"] = 19] = "SCREEN_NPM";
        BLEND_MODES[BLEND_MODES["NONE"] = 20] = "NONE";
        BLEND_MODES[BLEND_MODES["SRC_OVER"] = 0] = "SRC_OVER";
        BLEND_MODES[BLEND_MODES["SRC_IN"] = 21] = "SRC_IN";
        BLEND_MODES[BLEND_MODES["SRC_OUT"] = 22] = "SRC_OUT";
        BLEND_MODES[BLEND_MODES["SRC_ATOP"] = 23] = "SRC_ATOP";
        BLEND_MODES[BLEND_MODES["DST_OVER"] = 24] = "DST_OVER";
        BLEND_MODES[BLEND_MODES["DST_IN"] = 25] = "DST_IN";
        BLEND_MODES[BLEND_MODES["DST_OUT"] = 26] = "DST_OUT";
        BLEND_MODES[BLEND_MODES["DST_ATOP"] = 27] = "DST_ATOP";
        BLEND_MODES[BLEND_MODES["ERASE"] = 26] = "ERASE";
        BLEND_MODES[BLEND_MODES["SUBTRACT"] = 28] = "SUBTRACT";
        BLEND_MODES[BLEND_MODES["XOR"] = 29] = "XOR";
    })(BLEND_MODES || (BLEND_MODES = {}));
    /**
     * Various webgl draw modes. These can be used to specify which GL drawMode to use
     * under certain situations and renderers.
     *
     * @memberof PIXI
     * @static
     * @name DRAW_MODES
     * @enum {number}
     * @property {number} POINTS
     * @property {number} LINES
     * @property {number} LINE_LOOP
     * @property {number} LINE_STRIP
     * @property {number} TRIANGLES
     * @property {number} TRIANGLE_STRIP
     * @property {number} TRIANGLE_FAN
     */
    var DRAW_MODES;
    (function (DRAW_MODES) {
        DRAW_MODES[DRAW_MODES["POINTS"] = 0] = "POINTS";
        DRAW_MODES[DRAW_MODES["LINES"] = 1] = "LINES";
        DRAW_MODES[DRAW_MODES["LINE_LOOP"] = 2] = "LINE_LOOP";
        DRAW_MODES[DRAW_MODES["LINE_STRIP"] = 3] = "LINE_STRIP";
        DRAW_MODES[DRAW_MODES["TRIANGLES"] = 4] = "TRIANGLES";
        DRAW_MODES[DRAW_MODES["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
        DRAW_MODES[DRAW_MODES["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
    })(DRAW_MODES || (DRAW_MODES = {}));
    /**
     * Various GL texture/resources formats.
     *
     * @memberof PIXI
     * @static
     * @name FORMATS
     * @enum {number}
     * @property {number} RGBA=6408
     * @property {number} RGB=6407
     * @property {number} ALPHA=6406
     * @property {number} LUMINANCE=6409
     * @property {number} LUMINANCE_ALPHA=6410
     * @property {number} DEPTH_COMPONENT=6402
     * @property {number} DEPTH_STENCIL=34041
     */
    var FORMATS;
    (function (FORMATS) {
        FORMATS[FORMATS["RGBA"] = 6408] = "RGBA";
        FORMATS[FORMATS["RGB"] = 6407] = "RGB";
        FORMATS[FORMATS["ALPHA"] = 6406] = "ALPHA";
        FORMATS[FORMATS["LUMINANCE"] = 6409] = "LUMINANCE";
        FORMATS[FORMATS["LUMINANCE_ALPHA"] = 6410] = "LUMINANCE_ALPHA";
        FORMATS[FORMATS["DEPTH_COMPONENT"] = 6402] = "DEPTH_COMPONENT";
        FORMATS[FORMATS["DEPTH_STENCIL"] = 34041] = "DEPTH_STENCIL";
    })(FORMATS || (FORMATS = {}));
    /**
     * Various GL target types.
     *
     * @memberof PIXI
     * @static
     * @name TARGETS
     * @enum {number}
     * @property {number} TEXTURE_2D=3553
     * @property {number} TEXTURE_CUBE_MAP=34067
     * @property {number} TEXTURE_2D_ARRAY=35866
     * @property {number} TEXTURE_CUBE_MAP_POSITIVE_X=34069
     * @property {number} TEXTURE_CUBE_MAP_NEGATIVE_X=34070
     * @property {number} TEXTURE_CUBE_MAP_POSITIVE_Y=34071
     * @property {number} TEXTURE_CUBE_MAP_NEGATIVE_Y=34072
     * @property {number} TEXTURE_CUBE_MAP_POSITIVE_Z=34073
     * @property {number} TEXTURE_CUBE_MAP_NEGATIVE_Z=34074
     */
    var TARGETS;
    (function (TARGETS) {
        TARGETS[TARGETS["TEXTURE_2D"] = 3553] = "TEXTURE_2D";
        TARGETS[TARGETS["TEXTURE_CUBE_MAP"] = 34067] = "TEXTURE_CUBE_MAP";
        TARGETS[TARGETS["TEXTURE_2D_ARRAY"] = 35866] = "TEXTURE_2D_ARRAY";
        TARGETS[TARGETS["TEXTURE_CUBE_MAP_POSITIVE_X"] = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X";
        TARGETS[TARGETS["TEXTURE_CUBE_MAP_NEGATIVE_X"] = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X";
        TARGETS[TARGETS["TEXTURE_CUBE_MAP_POSITIVE_Y"] = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y";
        TARGETS[TARGETS["TEXTURE_CUBE_MAP_NEGATIVE_Y"] = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y";
        TARGETS[TARGETS["TEXTURE_CUBE_MAP_POSITIVE_Z"] = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z";
        TARGETS[TARGETS["TEXTURE_CUBE_MAP_NEGATIVE_Z"] = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z";
    })(TARGETS || (TARGETS = {}));
    /**
     * Various GL data format types.
     *
     * @memberof PIXI
     * @static
     * @name TYPES
     * @enum {number}
     * @property {number} UNSIGNED_BYTE=5121
     * @property {number} UNSIGNED_SHORT=5123
     * @property {number} UNSIGNED_SHORT_5_6_5=33635
     * @property {number} UNSIGNED_SHORT_4_4_4_4=32819
     * @property {number} UNSIGNED_SHORT_5_5_5_1=32820
     * @property {number} FLOAT=5126
     * @property {number} HALF_FLOAT=36193
     */
    var TYPES;
    (function (TYPES) {
        TYPES[TYPES["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
        TYPES[TYPES["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
        TYPES[TYPES["UNSIGNED_SHORT_5_6_5"] = 33635] = "UNSIGNED_SHORT_5_6_5";
        TYPES[TYPES["UNSIGNED_SHORT_4_4_4_4"] = 32819] = "UNSIGNED_SHORT_4_4_4_4";
        TYPES[TYPES["UNSIGNED_SHORT_5_5_5_1"] = 32820] = "UNSIGNED_SHORT_5_5_5_1";
        TYPES[TYPES["FLOAT"] = 5126] = "FLOAT";
        TYPES[TYPES["HALF_FLOAT"] = 36193] = "HALF_FLOAT";
    })(TYPES || (TYPES = {}));
    /**
     * The scale modes that are supported by pixi.
     *
     * The {@link PIXI.settings.SCALE_MODE} scale mode affects the default scaling mode of future operations.
     * It can be re-assigned to either LINEAR or NEAREST, depending upon suitability.
     *
     * @memberof PIXI
     * @static
     * @name SCALE_MODES
     * @enum {number}
     * @property {number} LINEAR Smooth scaling
     * @property {number} NEAREST Pixelating scaling
     */
    var SCALE_MODES;
    (function (SCALE_MODES) {
        SCALE_MODES[SCALE_MODES["NEAREST"] = 0] = "NEAREST";
        SCALE_MODES[SCALE_MODES["LINEAR"] = 1] = "LINEAR";
    })(SCALE_MODES || (SCALE_MODES = {}));
    /**
     * The wrap modes that are supported by pixi.
     *
     * The {@link PIXI.settings.WRAP_MODE} wrap mode affects the default wrapping mode of future operations.
     * It can be re-assigned to either CLAMP or REPEAT, depending upon suitability.
     * If the texture is non power of two then clamp will be used regardless as WebGL can
     * only use REPEAT if the texture is po2.
     *
     * This property only affects WebGL.
     *
     * @name WRAP_MODES
     * @memberof PIXI
     * @static
     * @enum {number}
     * @property {number} CLAMP - The textures uvs are clamped
     * @property {number} REPEAT - The texture uvs tile and repeat
     * @property {number} MIRRORED_REPEAT - The texture uvs tile and repeat with mirroring
     */
    var WRAP_MODES;
    (function (WRAP_MODES) {
        WRAP_MODES[WRAP_MODES["CLAMP"] = 33071] = "CLAMP";
        WRAP_MODES[WRAP_MODES["REPEAT"] = 10497] = "REPEAT";
        WRAP_MODES[WRAP_MODES["MIRRORED_REPEAT"] = 33648] = "MIRRORED_REPEAT";
    })(WRAP_MODES || (WRAP_MODES = {}));
    /**
     * Mipmap filtering modes that are supported by pixi.
     *
     * The {@link PIXI.settings.MIPMAP_TEXTURES} affects default texture filtering.
     * Mipmaps are generated for a baseTexture if its `mipmap` field is `ON`,
     * or its `POW2` and texture dimensions are powers of 2.
     * Due to platform restriction, `ON` option will work like `POW2` for webgl-1.
     *
     * This property only affects WebGL.
     *
     * @name MIPMAP_MODES
     * @memberof PIXI
     * @static
     * @enum {number}
     * @property {number} OFF - No mipmaps
     * @property {number} POW2 - Generate mipmaps if texture dimensions are pow2
     * @property {number} ON - Always generate mipmaps
     */
    var MIPMAP_MODES;
    (function (MIPMAP_MODES) {
        MIPMAP_MODES[MIPMAP_MODES["OFF"] = 0] = "OFF";
        MIPMAP_MODES[MIPMAP_MODES["POW2"] = 1] = "POW2";
        MIPMAP_MODES[MIPMAP_MODES["ON"] = 2] = "ON";
    })(MIPMAP_MODES || (MIPMAP_MODES = {}));
    /**
     * How to treat textures with premultiplied alpha
     *
     * @name ALPHA_MODES
     * @memberof PIXI
     * @static
     * @enum {number}
     * @property {number} NO_PREMULTIPLIED_ALPHA - Source is not premultiplied, leave it like that.
     *  Option for compressed and data textures that are created from typed arrays.
     * @property {number} PREMULTIPLY_ON_UPLOAD - Source is not premultiplied, premultiply on upload.
     *  Default option, used for all loaded images.
     * @property {number} PREMULTIPLIED_ALPHA - Source is already premultiplied
     *  Example: spine atlases with `_pma` suffix.
     * @property {number} NPM - Alias for NO_PREMULTIPLIED_ALPHA.
     * @property {number} UNPACK - Default option, alias for PREMULTIPLY_ON_UPLOAD.
     * @property {number} PMA - Alias for PREMULTIPLIED_ALPHA.
     */
    var ALPHA_MODES;
    (function (ALPHA_MODES) {
        ALPHA_MODES[ALPHA_MODES["NPM"] = 0] = "NPM";
        ALPHA_MODES[ALPHA_MODES["UNPACK"] = 1] = "UNPACK";
        ALPHA_MODES[ALPHA_MODES["PMA"] = 2] = "PMA";
        ALPHA_MODES[ALPHA_MODES["NO_PREMULTIPLIED_ALPHA"] = 0] = "NO_PREMULTIPLIED_ALPHA";
        ALPHA_MODES[ALPHA_MODES["PREMULTIPLY_ON_UPLOAD"] = 1] = "PREMULTIPLY_ON_UPLOAD";
        ALPHA_MODES[ALPHA_MODES["PREMULTIPLY_ALPHA"] = 2] = "PREMULTIPLY_ALPHA";
    })(ALPHA_MODES || (ALPHA_MODES = {}));
    /**
     * How to clear renderTextures in filter
     *
     * @name CLEAR_MODES
     * @memberof PIXI
     * @static
     * @enum {number}
     * @property {number} BLEND - Preserve the information in the texture, blend above
     * @property {number} CLEAR - Must use `gl.clear` operation
     * @property {number} BLIT - Clear or blit it, depends on device and level of paranoia
     * @property {number} NO - Alias for BLEND, same as `false` in earlier versions
     * @property {number} YES - Alias for CLEAR, same as `true` in earlier versions
     * @property {number} AUTO - Alias for BLIT
     */
    var CLEAR_MODES;
    (function (CLEAR_MODES) {
        CLEAR_MODES[CLEAR_MODES["NO"] = 0] = "NO";
        CLEAR_MODES[CLEAR_MODES["YES"] = 1] = "YES";
        CLEAR_MODES[CLEAR_MODES["AUTO"] = 2] = "AUTO";
        CLEAR_MODES[CLEAR_MODES["BLEND"] = 0] = "BLEND";
        CLEAR_MODES[CLEAR_MODES["CLEAR"] = 1] = "CLEAR";
        CLEAR_MODES[CLEAR_MODES["BLIT"] = 2] = "BLIT";
    })(CLEAR_MODES || (CLEAR_MODES = {}));
    /**
     * The gc modes that are supported by pixi.
     *
     * The {@link PIXI.settings.GC_MODE} Garbage Collection mode for PixiJS textures is AUTO
     * If set to GC_MODE, the renderer will occasionally check textures usage. If they are not
     * used for a specified period of time they will be removed from the GPU. They will of course
     * be uploaded again when they are required. This is a silent behind the scenes process that
     * should ensure that the GPU does not  get filled up.
     *
     * Handy for mobile devices!
     * This property only affects WebGL.
     *
     * @name GC_MODES
     * @enum {number}
     * @static
     * @memberof PIXI
     * @property {number} AUTO - Garbage collection will happen periodically automatically
     * @property {number} MANUAL - Garbage collection will need to be called manually
     */
    var GC_MODES;
    (function (GC_MODES) {
        GC_MODES[GC_MODES["AUTO"] = 0] = "AUTO";
        GC_MODES[GC_MODES["MANUAL"] = 1] = "MANUAL";
    })(GC_MODES || (GC_MODES = {}));
    /**
     * Constants that specify float precision in shaders.
     *
     * @name PRECISION
     * @memberof PIXI
     * @constant
     * @static
     * @enum {string}
     * @property {string} LOW='lowp'
     * @property {string} MEDIUM='mediump'
     * @property {string} HIGH='highp'
     */
    var PRECISION;
    (function (PRECISION) {
        PRECISION["LOW"] = "lowp";
        PRECISION["MEDIUM"] = "mediump";
        PRECISION["HIGH"] = "highp";
    })(PRECISION || (PRECISION = {}));
    /**
     * Constants for mask implementations.
     * We use `type` suffix because it leads to very different behaviours
     *
     * @name MASK_TYPES
     * @memberof PIXI
     * @static
     * @enum {number}
     * @property {number} NONE - Mask is ignored
     * @property {number} SCISSOR - Scissor mask, rectangle on screen, cheap
     * @property {number} STENCIL - Stencil mask, 1-bit, medium, works only if renderer supports stencil
     * @property {number} SPRITE - Mask that uses SpriteMaskFilter, uses temporary RenderTexture
     */
    var MASK_TYPES;
    (function (MASK_TYPES) {
        MASK_TYPES[MASK_TYPES["NONE"] = 0] = "NONE";
        MASK_TYPES[MASK_TYPES["SCISSOR"] = 1] = "SCISSOR";
        MASK_TYPES[MASK_TYPES["STENCIL"] = 2] = "STENCIL";
        MASK_TYPES[MASK_TYPES["SPRITE"] = 3] = "SPRITE";
    })(MASK_TYPES || (MASK_TYPES = {}));
    /**
     * Constants for multi-sampling antialiasing.
     *
     * @see PIXI.Framebuffer#multisample
     *
     * @name MSAA_QUALITY
     * @memberof PIXI
     * @static
     * @enum {number}
     * @property {number} NONE - No multisampling for this renderTexture
     * @property {number} LOW - Try 2 samples
     * @property {number} MEDIUM - Try 4 samples
     * @property {number} HIGH - Try 8 samples
     */
    var MSAA_QUALITY;
    (function (MSAA_QUALITY) {
        MSAA_QUALITY[MSAA_QUALITY["NONE"] = 0] = "NONE";
        MSAA_QUALITY[MSAA_QUALITY["LOW"] = 2] = "LOW";
        MSAA_QUALITY[MSAA_QUALITY["MEDIUM"] = 4] = "MEDIUM";
        MSAA_QUALITY[MSAA_QUALITY["HIGH"] = 8] = "HIGH";
    })(MSAA_QUALITY || (MSAA_QUALITY = {}));

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
    }

    function unwrapExports (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    function getCjsExportFromNamespace (n) {
    	return n && n['default'] || n;
    }

    var eventemitter3 = createCommonjsModule(function (module) {
    'use strict';

    var has = Object.prototype.hasOwnProperty
      , prefix = '~';

    /**
     * Constructor to create a storage for our `EE` objects.
     * An `Events` instance is a plain object whose properties are event names.
     *
     * @constructor
     * @private
     */
    function Events() {}

    //
    // We try to not inherit from `Object.prototype`. In some engines creating an
    // instance in this way is faster than calling `Object.create(null)` directly.
    // If `Object.create(null)` is not supported we prefix the event names with a
    // character to make sure that the built-in object properties are not
    // overridden or used as an attack vector.
    //
    if (Object.create) {
      Events.prototype = Object.create(null);

      //
      // This hack is needed because the `__proto__` property is still inherited in
      // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
      //
      if (!new Events().__proto__) prefix = false;
    }

    /**
     * Representation of a single event listener.
     *
     * @param {Function} fn The listener function.
     * @param {*} context The context to invoke the listener with.
     * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
     * @constructor
     * @private
     */
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }

    /**
     * Add a listener for a given event.
     *
     * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} context The context to invoke the listener with.
     * @param {Boolean} once Specify if the listener is a one-time listener.
     * @returns {EventEmitter}
     * @private
     */
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== 'function') {
        throw new TypeError('The listener must be a function');
      }

      var listener = new EE(fn, context || emitter, once)
        , evt = prefix ? prefix + event : event;

      if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
      else emitter._events[evt] = [emitter._events[evt], listener];

      return emitter;
    }

    /**
     * Clear event by name.
     *
     * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
     * @param {(String|Symbol)} evt The Event name.
     * @private
     */
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0) emitter._events = new Events();
      else delete emitter._events[evt];
    }

    /**
     * Minimal `EventEmitter` interface that is molded against the Node.js
     * `EventEmitter` interface.
     *
     * @constructor
     * @public
     */
    function EventEmitter() {
      this._events = new Events();
      this._eventsCount = 0;
    }

    /**
     * Return an array listing the events for which the emitter has registered
     * listeners.
     *
     * @returns {Array}
     * @public
     */
    EventEmitter.prototype.eventNames = function eventNames() {
      var names = []
        , events
        , name;

      if (this._eventsCount === 0) return names;

      for (name in (events = this._events)) {
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
      }

      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }

      return names;
    };

    /**
     * Return the listeners registered for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @returns {Array} The registered listeners.
     * @public
     */
    EventEmitter.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event
        , handlers = this._events[evt];

      if (!handlers) return [];
      if (handlers.fn) return [handlers.fn];

      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }

      return ee;
    };

    /**
     * Return the number of listeners listening to a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @returns {Number} The number of listeners.
     * @public
     */
    EventEmitter.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event
        , listeners = this._events[evt];

      if (!listeners) return 0;
      if (listeners.fn) return 1;
      return listeners.length;
    };

    /**
     * Calls each of the listeners registered for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @returns {Boolean} `true` if the event had listeners, else `false`.
     * @public
     */
    EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;

      if (!this._events[evt]) return false;

      var listeners = this._events[evt]
        , len = arguments.length
        , args
        , i;

      if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

        switch (len) {
          case 1: return listeners.fn.call(listeners.context), true;
          case 2: return listeners.fn.call(listeners.context, a1), true;
          case 3: return listeners.fn.call(listeners.context, a1, a2), true;
          case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }

        for (i = 1, args = new Array(len -1); i < len; i++) {
          args[i - 1] = arguments[i];
        }

        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length
          , j;

        for (i = 0; i < length; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

          switch (len) {
            case 1: listeners[i].fn.call(listeners[i].context); break;
            case 2: listeners[i].fn.call(listeners[i].context, a1); break;
            case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
            case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
            default:
              if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
                args[j - 1] = arguments[j];
              }

              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }

      return true;
    };

    /**
     * Add a listener for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} [context=this] The context to invoke the listener with.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };

    /**
     * Add a one-time listener for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} [context=this] The context to invoke the listener with.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };

    /**
     * Remove the listeners of a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn Only remove the listeners that match this function.
     * @param {*} context Only remove the listeners that have this context.
     * @param {Boolean} once Only remove one-time listeners.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;

      if (!this._events[evt]) return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }

      var listeners = this._events[evt];

      if (listeners.fn) {
        if (
          listeners.fn === fn &&
          (!once || listeners.once) &&
          (!context || listeners.context === context)
        ) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (
            listeners[i].fn !== fn ||
            (once && !listeners[i].once) ||
            (context && listeners[i].context !== context)
          ) {
            events.push(listeners[i]);
          }
        }

        //
        // Reset the array, or remove it completely if we have no more listeners.
        //
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt);
      }

      return this;
    };

    /**
     * Remove all listeners, or those of the specified event.
     *
     * @param {(String|Symbol)} [event] The event name.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;

      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }

      return this;
    };

    //
    // Alias methods names because people roll like that.
    //
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.addListener = EventEmitter.prototype.on;

    //
    // Expose the prefix.
    //
    EventEmitter.prefixed = prefix;

    //
    // Allow `EventEmitter` to be imported as module namespace.
    //
    EventEmitter.EventEmitter = EventEmitter;

    //
    // Expose the module.
    //
    if ('undefined' !== 'object') {
      module.exports = EventEmitter;
    }
    });

    'use strict';

    var earcut_1 = earcut;
    var default_1 = earcut;

    function earcut(data, holeIndices, dim) {

        dim = dim || 2;

        var hasHoles = holeIndices && holeIndices.length,
            outerLen = hasHoles ? holeIndices[0] * dim : data.length,
            outerNode = linkedList(data, 0, outerLen, dim, true),
            triangles = [];

        if (!outerNode || outerNode.next === outerNode.prev) return triangles;

        var minX, minY, maxX, maxY, x, y, invSize;

        if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

        // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
        if (data.length > 80 * dim) {
            minX = maxX = data[0];
            minY = maxY = data[1];

            for (var i = dim; i < outerLen; i += dim) {
                x = data[i];
                y = data[i + 1];
                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
            }

            // minX, minY and invSize are later used to transform coords into integers for z-order calculation
            invSize = Math.max(maxX - minX, maxY - minY);
            invSize = invSize !== 0 ? 1 / invSize : 0;
        }

        earcutLinked(outerNode, triangles, dim, minX, minY, invSize);

        return triangles;
    }

    // create a circular doubly linked list from polygon points in the specified winding order
    function linkedList(data, start, end, dim, clockwise) {
        var i, last;

        if (clockwise === (signedArea(data, start, end, dim) > 0)) {
            for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
        } else {
            for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
        }

        if (last && equals(last, last.next)) {
            removeNode(last);
            last = last.next;
        }

        return last;
    }

    // eliminate colinear or duplicate points
    function filterPoints(start, end) {
        if (!start) return start;
        if (!end) end = start;

        var p = start,
            again;
        do {
            again = false;

            if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
                removeNode(p);
                p = end = p.prev;
                if (p === p.next) break;
                again = true;

            } else {
                p = p.next;
            }
        } while (again || p !== end);

        return end;
    }

    // main ear slicing loop which triangulates a polygon (given as a linked list)
    function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
        if (!ear) return;

        // interlink polygon nodes in z-order
        if (!pass && invSize) indexCurve(ear, minX, minY, invSize);

        var stop = ear,
            prev, next;

        // iterate through ears, slicing them one by one
        while (ear.prev !== ear.next) {
            prev = ear.prev;
            next = ear.next;

            if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
                // cut off the triangle
                triangles.push(prev.i / dim);
                triangles.push(ear.i / dim);
                triangles.push(next.i / dim);

                removeNode(ear);

                // skipping the next vertex leads to less sliver triangles
                ear = next.next;
                stop = next.next;

                continue;
            }

            ear = next;

            // if we looped through the whole remaining polygon and can't find any more ears
            if (ear === stop) {
                // try filtering points and slicing again
                if (!pass) {
                    earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

                // if this didn't work, try curing all small self-intersections locally
                } else if (pass === 1) {
                    ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
                    earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

                // as a last resort, try splitting the remaining polygon into two
                } else if (pass === 2) {
                    splitEarcut(ear, triangles, dim, minX, minY, invSize);
                }

                break;
            }
        }
    }

    // check whether a polygon node forms a valid ear with adjacent nodes
    function isEar(ear) {
        var a = ear.prev,
            b = ear,
            c = ear.next;

        if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

        // now make sure we don't have other points inside the potential ear
        var p = ear.next.next;

        while (p !== ear.prev) {
            if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                area(p.prev, p, p.next) >= 0) return false;
            p = p.next;
        }

        return true;
    }

    function isEarHashed(ear, minX, minY, invSize) {
        var a = ear.prev,
            b = ear,
            c = ear.next;

        if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

        // triangle bbox; min & max are calculated like this for speed
        var minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x),
            minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y),
            maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x),
            maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);

        // z-order range for the current triangle bbox;
        var minZ = zOrder(minTX, minTY, minX, minY, invSize),
            maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);

        var p = ear.prevZ,
            n = ear.nextZ;

        // look for points inside the triangle in both directions
        while (p && p.z >= minZ && n && n.z <= maxZ) {
            if (p !== ear.prev && p !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                area(p.prev, p, p.next) >= 0) return false;
            p = p.prevZ;

            if (n !== ear.prev && n !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
                area(n.prev, n, n.next) >= 0) return false;
            n = n.nextZ;
        }

        // look for remaining points in decreasing z-order
        while (p && p.z >= minZ) {
            if (p !== ear.prev && p !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                area(p.prev, p, p.next) >= 0) return false;
            p = p.prevZ;
        }

        // look for remaining points in increasing z-order
        while (n && n.z <= maxZ) {
            if (n !== ear.prev && n !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
                area(n.prev, n, n.next) >= 0) return false;
            n = n.nextZ;
        }

        return true;
    }

    // go through all polygon nodes and cure small local self-intersections
    function cureLocalIntersections(start, triangles, dim) {
        var p = start;
        do {
            var a = p.prev,
                b = p.next.next;

            if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

                triangles.push(a.i / dim);
                triangles.push(p.i / dim);
                triangles.push(b.i / dim);

                // remove two nodes involved
                removeNode(p);
                removeNode(p.next);

                p = start = b;
            }
            p = p.next;
        } while (p !== start);

        return filterPoints(p);
    }

    // try splitting polygon into two and triangulate them independently
    function splitEarcut(start, triangles, dim, minX, minY, invSize) {
        // look for a valid diagonal that divides the polygon into two
        var a = start;
        do {
            var b = a.next.next;
            while (b !== a.prev) {
                if (a.i !== b.i && isValidDiagonal(a, b)) {
                    // split the polygon in two by the diagonal
                    var c = splitPolygon(a, b);

                    // filter colinear points around the cuts
                    a = filterPoints(a, a.next);
                    c = filterPoints(c, c.next);

                    // run earcut on each half
                    earcutLinked(a, triangles, dim, minX, minY, invSize);
                    earcutLinked(c, triangles, dim, minX, minY, invSize);
                    return;
                }
                b = b.next;
            }
            a = a.next;
        } while (a !== start);
    }

    // link every hole into the outer loop, producing a single-ring polygon without holes
    function eliminateHoles(data, holeIndices, outerNode, dim) {
        var queue = [],
            i, len, start, end, list;

        for (i = 0, len = holeIndices.length; i < len; i++) {
            start = holeIndices[i] * dim;
            end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
            list = linkedList(data, start, end, dim, false);
            if (list === list.next) list.steiner = true;
            queue.push(getLeftmost(list));
        }

        queue.sort(compareX);

        // process holes from left to right
        for (i = 0; i < queue.length; i++) {
            eliminateHole(queue[i], outerNode);
            outerNode = filterPoints(outerNode, outerNode.next);
        }

        return outerNode;
    }

    function compareX(a, b) {
        return a.x - b.x;
    }

    // find a bridge between vertices that connects hole with an outer ring and and link it
    function eliminateHole(hole, outerNode) {
        outerNode = findHoleBridge(hole, outerNode);
        if (outerNode) {
            var b = splitPolygon(outerNode, hole);

            // filter collinear points around the cuts
            filterPoints(outerNode, outerNode.next);
            filterPoints(b, b.next);
        }
    }

    // David Eberly's algorithm for finding a bridge between hole and outer polygon
    function findHoleBridge(hole, outerNode) {
        var p = outerNode,
            hx = hole.x,
            hy = hole.y,
            qx = -Infinity,
            m;

        // find a segment intersected by a ray from the hole's leftmost point to the left;
        // segment's endpoint with lesser x will be potential connection point
        do {
            if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
                var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
                if (x <= hx && x > qx) {
                    qx = x;
                    if (x === hx) {
                        if (hy === p.y) return p;
                        if (hy === p.next.y) return p.next;
                    }
                    m = p.x < p.next.x ? p : p.next;
                }
            }
            p = p.next;
        } while (p !== outerNode);

        if (!m) return null;

        if (hx === qx) return m; // hole touches outer segment; pick leftmost endpoint

        // look for points inside the triangle of hole point, segment intersection and endpoint;
        // if there are no points found, we have a valid connection;
        // otherwise choose the point of the minimum angle with the ray as connection point

        var stop = m,
            mx = m.x,
            my = m.y,
            tanMin = Infinity,
            tan;

        p = m;

        do {
            if (hx >= p.x && p.x >= mx && hx !== p.x &&
                    pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

                tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

                if (locallyInside(p, hole) &&
                    (tan < tanMin || (tan === tanMin && (p.x > m.x || (p.x === m.x && sectorContainsSector(m, p)))))) {
                    m = p;
                    tanMin = tan;
                }
            }

            p = p.next;
        } while (p !== stop);

        return m;
    }

    // whether sector in vertex m contains sector in vertex p in the same coordinates
    function sectorContainsSector(m, p) {
        return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
    }

    // interlink polygon nodes in z-order
    function indexCurve(start, minX, minY, invSize) {
        var p = start;
        do {
            if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, invSize);
            p.prevZ = p.prev;
            p.nextZ = p.next;
            p = p.next;
        } while (p !== start);

        p.prevZ.nextZ = null;
        p.prevZ = null;

        sortLinked(p);
    }

    // Simon Tatham's linked list merge sort algorithm
    // http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
    function sortLinked(list) {
        var i, p, q, e, tail, numMerges, pSize, qSize,
            inSize = 1;

        do {
            p = list;
            list = null;
            tail = null;
            numMerges = 0;

            while (p) {
                numMerges++;
                q = p;
                pSize = 0;
                for (i = 0; i < inSize; i++) {
                    pSize++;
                    q = q.nextZ;
                    if (!q) break;
                }
                qSize = inSize;

                while (pSize > 0 || (qSize > 0 && q)) {

                    if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                        e = p;
                        p = p.nextZ;
                        pSize--;
                    } else {
                        e = q;
                        q = q.nextZ;
                        qSize--;
                    }

                    if (tail) tail.nextZ = e;
                    else list = e;

                    e.prevZ = tail;
                    tail = e;
                }

                p = q;
            }

            tail.nextZ = null;
            inSize *= 2;

        } while (numMerges > 1);

        return list;
    }

    // z-order of a point given coords and inverse of the longer side of data bbox
    function zOrder(x, y, minX, minY, invSize) {
        // coords are transformed into non-negative 15-bit integer range
        x = 32767 * (x - minX) * invSize;
        y = 32767 * (y - minY) * invSize;

        x = (x | (x << 8)) & 0x00FF00FF;
        x = (x | (x << 4)) & 0x0F0F0F0F;
        x = (x | (x << 2)) & 0x33333333;
        x = (x | (x << 1)) & 0x55555555;

        y = (y | (y << 8)) & 0x00FF00FF;
        y = (y | (y << 4)) & 0x0F0F0F0F;
        y = (y | (y << 2)) & 0x33333333;
        y = (y | (y << 1)) & 0x55555555;

        return x | (y << 1);
    }

    // find the leftmost node of a polygon ring
    function getLeftmost(start) {
        var p = start,
            leftmost = start;
        do {
            if (p.x < leftmost.x || (p.x === leftmost.x && p.y < leftmost.y)) leftmost = p;
            p = p.next;
        } while (p !== start);

        return leftmost;
    }

    // check if a point lies within a convex triangle
    function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
        return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
               (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
               (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
    }

    // check if a diagonal between two polygon nodes is valid (lies in polygon interior)
    function isValidDiagonal(a, b) {
        return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && // dones't intersect other edges
               (locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && // locally visible
                (area(a.prev, a, b.prev) || area(a, b.prev, b)) || // does not create opposite-facing sectors
                equals(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0); // special zero-length case
    }

    // signed area of a triangle
    function area(p, q, r) {
        return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    }

    // check if two points are equal
    function equals(p1, p2) {
        return p1.x === p2.x && p1.y === p2.y;
    }

    // check if two segments intersect
    function intersects(p1, q1, p2, q2) {
        var o1 = sign(area(p1, q1, p2));
        var o2 = sign(area(p1, q1, q2));
        var o3 = sign(area(p2, q2, p1));
        var o4 = sign(area(p2, q2, q1));

        if (o1 !== o2 && o3 !== o4) return true; // general case

        if (o1 === 0 && onSegment(p1, p2, q1)) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1
        if (o2 === 0 && onSegment(p1, q2, q1)) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1
        if (o3 === 0 && onSegment(p2, p1, q2)) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2
        if (o4 === 0 && onSegment(p2, q1, q2)) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

        return false;
    }

    // for collinear points p, q, r, check if point q lies on segment pr
    function onSegment(p, q, r) {
        return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
    }

    function sign(num) {
        return num > 0 ? 1 : num < 0 ? -1 : 0;
    }

    // check if a polygon diagonal intersects any polygon segments
    function intersectsPolygon(a, b) {
        var p = a;
        do {
            if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
                    intersects(p, p.next, a, b)) return true;
            p = p.next;
        } while (p !== a);

        return false;
    }

    // check if a polygon diagonal is locally inside the polygon
    function locallyInside(a, b) {
        return area(a.prev, a, a.next) < 0 ?
            area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 :
            area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
    }

    // check if the middle point of a polygon diagonal is inside the polygon
    function middleInside(a, b) {
        var p = a,
            inside = false,
            px = (a.x + b.x) / 2,
            py = (a.y + b.y) / 2;
        do {
            if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
                    (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
                inside = !inside;
            p = p.next;
        } while (p !== a);

        return inside;
    }

    // link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
    // if one belongs to the outer ring and another to a hole, it merges it into a single ring
    function splitPolygon(a, b) {
        var a2 = new Node(a.i, a.x, a.y),
            b2 = new Node(b.i, b.x, b.y),
            an = a.next,
            bp = b.prev;

        a.next = b;
        b.prev = a;

        a2.next = an;
        an.prev = a2;

        b2.next = a2;
        a2.prev = b2;

        bp.next = b2;
        b2.prev = bp;

        return b2;
    }

    // create a node and optionally link it with previous one (in a circular doubly linked list)
    function insertNode(i, x, y, last) {
        var p = new Node(i, x, y);

        if (!last) {
            p.prev = p;
            p.next = p;

        } else {
            p.next = last.next;
            p.prev = last;
            last.next.prev = p;
            last.next = p;
        }
        return p;
    }

    function removeNode(p) {
        p.next.prev = p.prev;
        p.prev.next = p.next;

        if (p.prevZ) p.prevZ.nextZ = p.nextZ;
        if (p.nextZ) p.nextZ.prevZ = p.prevZ;
    }

    function Node(i, x, y) {
        // vertex index in coordinates array
        this.i = i;

        // vertex coordinates
        this.x = x;
        this.y = y;

        // previous and next vertex nodes in a polygon ring
        this.prev = null;
        this.next = null;

        // z-order curve value
        this.z = null;

        // previous and next nodes in z-order
        this.prevZ = null;
        this.nextZ = null;

        // indicates whether this is a steiner point
        this.steiner = false;
    }

    // return a percentage difference between the polygon area and its triangulation area;
    // used to verify correctness of triangulation
    earcut.deviation = function (data, holeIndices, dim, triangles) {
        var hasHoles = holeIndices && holeIndices.length;
        var outerLen = hasHoles ? holeIndices[0] * dim : data.length;

        var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
        if (hasHoles) {
            for (var i = 0, len = holeIndices.length; i < len; i++) {
                var start = holeIndices[i] * dim;
                var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
                polygonArea -= Math.abs(signedArea(data, start, end, dim));
            }
        }

        var trianglesArea = 0;
        for (i = 0; i < triangles.length; i += 3) {
            var a = triangles[i] * dim;
            var b = triangles[i + 1] * dim;
            var c = triangles[i + 2] * dim;
            trianglesArea += Math.abs(
                (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
                (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
        }

        return polygonArea === 0 && trianglesArea === 0 ? 0 :
            Math.abs((trianglesArea - polygonArea) / polygonArea);
    };

    function signedArea(data, start, end, dim) {
        var sum = 0;
        for (var i = start, j = end - dim; i < end; i += dim) {
            sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
            j = i;
        }
        return sum;
    }

    // turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
    earcut.flatten = function (data) {
        var dim = data[0][0].length,
            result = {vertices: [], holes: [], dimensions: dim},
            holeIndex = 0;

        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++) {
                for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
            }
            if (i > 0) {
                holeIndex += data[i - 1].length;
                result.holes.push(holeIndex);
            }
        }
        return result;
    };
    earcut_1.default = default_1;

    var punycode = createCommonjsModule(function (module, exports) {
    /*! https://mths.be/punycode v1.3.2 by @mathias */
    ;(function(root) {

    	/** Detect free variables */
    	var freeExports = 'object' == 'object' && exports &&
    		!exports.nodeType && exports;
    	var freeModule = 'object' == 'object' && module &&
    		!module.nodeType && module;
    	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal;
    	if (
    		freeGlobal.global === freeGlobal ||
    		freeGlobal.window === freeGlobal ||
    		freeGlobal.self === freeGlobal
    	) {
    		root = freeGlobal;
    	}

    	/**
    	 * The `punycode` object.
    	 * @name punycode
    	 * @type Object
    	 */
    	var punycode,

    	/** Highest positive signed 32-bit float value */
    	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

    	/** Bootstring parameters */
    	base = 36,
    	tMin = 1,
    	tMax = 26,
    	skew = 38,
    	damp = 700,
    	initialBias = 72,
    	initialN = 128, // 0x80
    	delimiter = '-', // '\x2D'

    	/** Regular expressions */
    	regexPunycode = /^xn--/,
    	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
    	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

    	/** Error messages */
    	errors = {
    		'overflow': 'Overflow: input needs wider integers to process',
    		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
    		'invalid-input': 'Invalid input'
    	},

    	/** Convenience shortcuts */
    	baseMinusTMin = base - tMin,
    	floor = Math.floor,
    	stringFromCharCode = String.fromCharCode,

    	/** Temporary variable */
    	key;

    	/*--------------------------------------------------------------------------*/

    	/**
    	 * A generic error utility function.
    	 * @private
    	 * @param {String} type The error type.
    	 * @returns {Error} Throws a `RangeError` with the applicable error message.
    	 */
    	function error(type) {
    		throw RangeError(errors[type]);
    	}

    	/**
    	 * A generic `Array#map` utility function.
    	 * @private
    	 * @param {Array} array The array to iterate over.
    	 * @param {Function} callback The function that gets called for every array
    	 * item.
    	 * @returns {Array} A new array of values returned by the callback function.
    	 */
    	function map(array, fn) {
    		var length = array.length;
    		var result = [];
    		while (length--) {
    			result[length] = fn(array[length]);
    		}
    		return result;
    	}

    	/**
    	 * A simple `Array#map`-like wrapper to work with domain name strings or email
    	 * addresses.
    	 * @private
    	 * @param {String} domain The domain name or email address.
    	 * @param {Function} callback The function that gets called for every
    	 * character.
    	 * @returns {Array} A new string of characters returned by the callback
    	 * function.
    	 */
    	function mapDomain(string, fn) {
    		var parts = string.split('@');
    		var result = '';
    		if (parts.length > 1) {
    			// In email addresses, only the domain name should be punycoded. Leave
    			// the local part (i.e. everything up to `@`) intact.
    			result = parts[0] + '@';
    			string = parts[1];
    		}
    		// Avoid `split(regex)` for IE8 compatibility. See #17.
    		string = string.replace(regexSeparators, '\x2E');
    		var labels = string.split('.');
    		var encoded = map(labels, fn).join('.');
    		return result + encoded;
    	}

    	/**
    	 * Creates an array containing the numeric code points of each Unicode
    	 * character in the string. While JavaScript uses UCS-2 internally,
    	 * this function will convert a pair of surrogate halves (each of which
    	 * UCS-2 exposes as separate characters) into a single code point,
    	 * matching UTF-16.
    	 * @see `punycode.ucs2.encode`
    	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
    	 * @memberOf punycode.ucs2
    	 * @name decode
    	 * @param {String} string The Unicode input string (UCS-2).
    	 * @returns {Array} The new array of code points.
    	 */
    	function ucs2decode(string) {
    		var output = [],
    		    counter = 0,
    		    length = string.length,
    		    value,
    		    extra;
    		while (counter < length) {
    			value = string.charCodeAt(counter++);
    			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
    				// high surrogate, and there is a next character
    				extra = string.charCodeAt(counter++);
    				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
    					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
    				} else {
    					// unmatched surrogate; only append this code unit, in case the next
    					// code unit is the high surrogate of a surrogate pair
    					output.push(value);
    					counter--;
    				}
    			} else {
    				output.push(value);
    			}
    		}
    		return output;
    	}

    	/**
    	 * Creates a string based on an array of numeric code points.
    	 * @see `punycode.ucs2.decode`
    	 * @memberOf punycode.ucs2
    	 * @name encode
    	 * @param {Array} codePoints The array of numeric code points.
    	 * @returns {String} The new Unicode string (UCS-2).
    	 */
    	function ucs2encode(array) {
    		return map(array, function(value) {
    			var output = '';
    			if (value > 0xFFFF) {
    				value -= 0x10000;
    				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
    				value = 0xDC00 | value & 0x3FF;
    			}
    			output += stringFromCharCode(value);
    			return output;
    		}).join('');
    	}

    	/**
    	 * Converts a basic code point into a digit/integer.
    	 * @see `digitToBasic()`
    	 * @private
    	 * @param {Number} codePoint The basic numeric code point value.
    	 * @returns {Number} The numeric value of a basic code point (for use in
    	 * representing integers) in the range `0` to `base - 1`, or `base` if
    	 * the code point does not represent a value.
    	 */
    	function basicToDigit(codePoint) {
    		if (codePoint - 48 < 10) {
    			return codePoint - 22;
    		}
    		if (codePoint - 65 < 26) {
    			return codePoint - 65;
    		}
    		if (codePoint - 97 < 26) {
    			return codePoint - 97;
    		}
    		return base;
    	}

    	/**
    	 * Converts a digit/integer into a basic code point.
    	 * @see `basicToDigit()`
    	 * @private
    	 * @param {Number} digit The numeric value of a basic code point.
    	 * @returns {Number} The basic code point whose value (when used for
    	 * representing integers) is `digit`, which needs to be in the range
    	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
    	 * used; else, the lowercase form is used. The behavior is undefined
    	 * if `flag` is non-zero and `digit` has no uppercase form.
    	 */
    	function digitToBasic(digit, flag) {
    		//  0..25 map to ASCII a..z or A..Z
    		// 26..35 map to ASCII 0..9
    		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
    	}

    	/**
    	 * Bias adaptation function as per section 3.4 of RFC 3492.
    	 * http://tools.ietf.org/html/rfc3492#section-3.4
    	 * @private
    	 */
    	function adapt(delta, numPoints, firstTime) {
    		var k = 0;
    		delta = firstTime ? floor(delta / damp) : delta >> 1;
    		delta += floor(delta / numPoints);
    		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
    			delta = floor(delta / baseMinusTMin);
    		}
    		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
    	}

    	/**
    	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
    	 * symbols.
    	 * @memberOf punycode
    	 * @param {String} input The Punycode string of ASCII-only symbols.
    	 * @returns {String} The resulting string of Unicode symbols.
    	 */
    	function decode(input) {
    		// Don't use UCS-2
    		var output = [],
    		    inputLength = input.length,
    		    out,
    		    i = 0,
    		    n = initialN,
    		    bias = initialBias,
    		    basic,
    		    j,
    		    index,
    		    oldi,
    		    w,
    		    k,
    		    digit,
    		    t,
    		    /** Cached calculation results */
    		    baseMinusT;

    		// Handle the basic code points: let `basic` be the number of input code
    		// points before the last delimiter, or `0` if there is none, then copy
    		// the first basic code points to the output.

    		basic = input.lastIndexOf(delimiter);
    		if (basic < 0) {
    			basic = 0;
    		}

    		for (j = 0; j < basic; ++j) {
    			// if it's not a basic code point
    			if (input.charCodeAt(j) >= 0x80) {
    				error('not-basic');
    			}
    			output.push(input.charCodeAt(j));
    		}

    		// Main decoding loop: start just after the last delimiter if any basic code
    		// points were copied; start at the beginning otherwise.

    		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

    			// `index` is the index of the next character to be consumed.
    			// Decode a generalized variable-length integer into `delta`,
    			// which gets added to `i`. The overflow checking is easier
    			// if we increase `i` as we go, then subtract off its starting
    			// value at the end to obtain `delta`.
    			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

    				if (index >= inputLength) {
    					error('invalid-input');
    				}

    				digit = basicToDigit(input.charCodeAt(index++));

    				if (digit >= base || digit > floor((maxInt - i) / w)) {
    					error('overflow');
    				}

    				i += digit * w;
    				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

    				if (digit < t) {
    					break;
    				}

    				baseMinusT = base - t;
    				if (w > floor(maxInt / baseMinusT)) {
    					error('overflow');
    				}

    				w *= baseMinusT;

    			}

    			out = output.length + 1;
    			bias = adapt(i - oldi, out, oldi == 0);

    			// `i` was supposed to wrap around from `out` to `0`,
    			// incrementing `n` each time, so we'll fix that now:
    			if (floor(i / out) > maxInt - n) {
    				error('overflow');
    			}

    			n += floor(i / out);
    			i %= out;

    			// Insert `n` at position `i` of the output
    			output.splice(i++, 0, n);

    		}

    		return ucs2encode(output);
    	}

    	/**
    	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
    	 * Punycode string of ASCII-only symbols.
    	 * @memberOf punycode
    	 * @param {String} input The string of Unicode symbols.
    	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
    	 */
    	function encode(input) {
    		var n,
    		    delta,
    		    handledCPCount,
    		    basicLength,
    		    bias,
    		    j,
    		    m,
    		    q,
    		    k,
    		    t,
    		    currentValue,
    		    output = [],
    		    /** `inputLength` will hold the number of code points in `input`. */
    		    inputLength,
    		    /** Cached calculation results */
    		    handledCPCountPlusOne,
    		    baseMinusT,
    		    qMinusT;

    		// Convert the input in UCS-2 to Unicode
    		input = ucs2decode(input);

    		// Cache the length
    		inputLength = input.length;

    		// Initialize the state
    		n = initialN;
    		delta = 0;
    		bias = initialBias;

    		// Handle the basic code points
    		for (j = 0; j < inputLength; ++j) {
    			currentValue = input[j];
    			if (currentValue < 0x80) {
    				output.push(stringFromCharCode(currentValue));
    			}
    		}

    		handledCPCount = basicLength = output.length;

    		// `handledCPCount` is the number of code points that have been handled;
    		// `basicLength` is the number of basic code points.

    		// Finish the basic string - if it is not empty - with a delimiter
    		if (basicLength) {
    			output.push(delimiter);
    		}

    		// Main encoding loop:
    		while (handledCPCount < inputLength) {

    			// All non-basic code points < n have been handled already. Find the next
    			// larger one:
    			for (m = maxInt, j = 0; j < inputLength; ++j) {
    				currentValue = input[j];
    				if (currentValue >= n && currentValue < m) {
    					m = currentValue;
    				}
    			}

    			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
    			// but guard against overflow
    			handledCPCountPlusOne = handledCPCount + 1;
    			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
    				error('overflow');
    			}

    			delta += (m - n) * handledCPCountPlusOne;
    			n = m;

    			for (j = 0; j < inputLength; ++j) {
    				currentValue = input[j];

    				if (currentValue < n && ++delta > maxInt) {
    					error('overflow');
    				}

    				if (currentValue == n) {
    					// Represent delta as a generalized variable-length integer
    					for (q = delta, k = base; /* no condition */; k += base) {
    						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
    						if (q < t) {
    							break;
    						}
    						qMinusT = q - t;
    						baseMinusT = base - t;
    						output.push(
    							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
    						);
    						q = floor(qMinusT / baseMinusT);
    					}

    					output.push(stringFromCharCode(digitToBasic(q, 0)));
    					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
    					delta = 0;
    					++handledCPCount;
    				}
    			}

    			++delta;
    			++n;

    		}
    		return output.join('');
    	}

    	/**
    	 * Converts a Punycode string representing a domain name or an email address
    	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
    	 * it doesn't matter if you call it on a string that has already been
    	 * converted to Unicode.
    	 * @memberOf punycode
    	 * @param {String} input The Punycoded domain name or email address to
    	 * convert to Unicode.
    	 * @returns {String} The Unicode representation of the given Punycode
    	 * string.
    	 */
    	function toUnicode(input) {
    		return mapDomain(input, function(string) {
    			return regexPunycode.test(string)
    				? decode(string.slice(4).toLowerCase())
    				: string;
    		});
    	}

    	/**
    	 * Converts a Unicode string representing a domain name or an email address to
    	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
    	 * i.e. it doesn't matter if you call it with a domain that's already in
    	 * ASCII.
    	 * @memberOf punycode
    	 * @param {String} input The domain name or email address to convert, as a
    	 * Unicode string.
    	 * @returns {String} The Punycode representation of the given domain name or
    	 * email address.
    	 */
    	function toASCII(input) {
    		return mapDomain(input, function(string) {
    			return regexNonASCII.test(string)
    				? 'xn--' + encode(string)
    				: string;
    		});
    	}

    	/*--------------------------------------------------------------------------*/

    	/** Define the public API */
    	punycode = {
    		/**
    		 * A string representing the current Punycode.js version number.
    		 * @memberOf punycode
    		 * @type String
    		 */
    		'version': '1.3.2',
    		/**
    		 * An object of methods to convert from JavaScript's internal character
    		 * representation (UCS-2) to Unicode code points, and back.
    		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
    		 * @memberOf punycode
    		 * @type Object
    		 */
    		'ucs2': {
    			'decode': ucs2decode,
    			'encode': ucs2encode
    		},
    		'decode': decode,
    		'encode': encode,
    		'toASCII': toASCII,
    		'toUnicode': toUnicode
    	};

    	/** Expose `punycode` */
    	// Some AMD build optimizers, like r.js, check for specific condition patterns
    	// like the following:
    	if (
    		typeof undefined == 'function' &&
    		typeof undefined.amd == 'object' &&
    		undefined.amd
    	) {
    		undefined('punycode', function() {
    			return punycode;
    		});
    	} else if (freeExports && freeModule) {
    		if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
    			freeModule.exports = punycode;
    		} else { // in Narwhal or RingoJS v0.7.0-
    			for (key in punycode) {
    				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
    			}
    		}
    	} else { // in Rhino or a web browser
    		root.punycode = punycode;
    	}

    }(commonjsGlobal));
    });

    'use strict';

    var util = {
      isString: function(arg) {
        return typeof(arg) === 'string';
      },
      isObject: function(arg) {
        return typeof(arg) === 'object' && arg !== null;
      },
      isNull: function(arg) {
        return arg === null;
      },
      isNullOrUndefined: function(arg) {
        return arg == null;
      }
    };
    var util_1 = util.isString;
    var util_2 = util.isObject;
    var util_3 = util.isNull;
    var util_4 = util.isNullOrUndefined;

    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

    'use strict';

    // If obj.hasOwnProperty has been overridden, then calling
    // obj.hasOwnProperty(prop) will break.
    // See: https://github.com/joyent/node/issues/1707
    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }

    var decode = function(qs, sep, eq, options) {
      sep = sep || '&';
      eq = eq || '=';
      var obj = {};

      if (typeof qs !== 'string' || qs.length === 0) {
        return obj;
      }

      var regexp = /\+/g;
      qs = qs.split(sep);

      var maxKeys = 1000;
      if (options && typeof options.maxKeys === 'number') {
        maxKeys = options.maxKeys;
      }

      var len = qs.length;
      // maxKeys <= 0 means that we should not limit keys count
      if (maxKeys > 0 && len > maxKeys) {
        len = maxKeys;
      }

      for (var i = 0; i < len; ++i) {
        var x = qs[i].replace(regexp, '%20'),
            idx = x.indexOf(eq),
            kstr, vstr, k, v;

        if (idx >= 0) {
          kstr = x.substr(0, idx);
          vstr = x.substr(idx + 1);
        } else {
          kstr = x;
          vstr = '';
        }

        k = decodeURIComponent(kstr);
        v = decodeURIComponent(vstr);

        if (!hasOwnProperty(obj, k)) {
          obj[k] = v;
        } else if (Array.isArray(obj[k])) {
          obj[k].push(v);
        } else {
          obj[k] = [obj[k], v];
        }
      }

      return obj;
    };

    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

    'use strict';

    var stringifyPrimitive = function(v) {
      switch (typeof v) {
        case 'string':
          return v;

        case 'boolean':
          return v ? 'true' : 'false';

        case 'number':
          return isFinite(v) ? v : '';

        default:
          return '';
      }
    };

    var encode = function(obj, sep, eq, name) {
      sep = sep || '&';
      eq = eq || '=';
      if (obj === null) {
        obj = undefined;
      }

      if (typeof obj === 'object') {
        return Object.keys(obj).map(function(k) {
          var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
          if (Array.isArray(obj[k])) {
            return obj[k].map(function(v) {
              return ks + encodeURIComponent(stringifyPrimitive(v));
            }).join(sep);
          } else {
            return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
          }
        }).join(sep);

      }

      if (!name) return '';
      return encodeURIComponent(stringifyPrimitive(name)) + eq +
             encodeURIComponent(stringifyPrimitive(obj));
    };

    var querystring = createCommonjsModule(function (module, exports) {
    'use strict';

    exports.decode = exports.parse = decode;
    exports.encode = exports.stringify = encode;
    });
    var querystring_1 = querystring.decode;
    var querystring_2 = querystring.parse;
    var querystring_3 = querystring.encode;
    var querystring_4 = querystring.stringify;

    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

    'use strict';




    var parse = urlParse;
    var resolve = urlResolve;
    var resolveObject = urlResolveObject;
    var format = urlFormat;

    var Url_1 = Url;

    function Url() {
      this.protocol = null;
      this.slashes = null;
      this.auth = null;
      this.host = null;
      this.port = null;
      this.hostname = null;
      this.hash = null;
      this.search = null;
      this.query = null;
      this.pathname = null;
      this.path = null;
      this.href = null;
    }

    // Reference: RFC 3986, RFC 1808, RFC 2396

    // define these here so at least they only have to be
    // compiled once on the first module load.
    var protocolPattern = /^([a-z0-9.+-]+:)/i,
        portPattern = /:[0-9]*$/,

        // Special case for a simple path URL
        simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

        // RFC 2396: characters reserved for delimiting URLs.
        // We actually just auto-escape these.
        delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

        // RFC 2396: characters not allowed for various reasons.
        unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

        // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
        autoEscape = ['\''].concat(unwise),
        // Characters that are never ever allowed in a hostname.
        // Note that any invalid chars are also handled, but these
        // are the ones that are *expected* to be seen, so we fast-path
        // them.
        nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
        hostEndingChars = ['/', '?', '#'],
        hostnameMaxLen = 255,
        hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
        hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
        // protocols that can allow "unsafe" and "unwise" chars.
        unsafeProtocol = {
          'javascript': true,
          'javascript:': true
        },
        // protocols that never have a hostname.
        hostlessProtocol = {
          'javascript': true,
          'javascript:': true
        },
        // protocols that always contain a // bit.
        slashedProtocol = {
          'http': true,
          'https': true,
          'ftp': true,
          'gopher': true,
          'file': true,
          'http:': true,
          'https:': true,
          'ftp:': true,
          'gopher:': true,
          'file:': true
        };

    function urlParse(url, parseQueryString, slashesDenoteHost) {
      if (url && util.isObject(url) && url instanceof Url) return url;

      var u = new Url;
      u.parse(url, parseQueryString, slashesDenoteHost);
      return u;
    }

    Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
      if (!util.isString(url)) {
        throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
      }

      // Copy chrome, IE, opera backslash-handling behavior.
      // Back slashes before the query string get converted to forward slashes
      // See: https://code.google.com/p/chromium/issues/detail?id=25916
      var queryIndex = url.indexOf('?'),
          splitter =
              (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
          uSplit = url.split(splitter),
          slashRegex = /\\/g;
      uSplit[0] = uSplit[0].replace(slashRegex, '/');
      url = uSplit.join(splitter);

      var rest = url;

      // trim before proceeding.
      // This is to support parse stuff like "  http://foo.com  \n"
      rest = rest.trim();

      if (!slashesDenoteHost && url.split('#').length === 1) {
        // Try fast path regexp
        var simplePath = simplePathPattern.exec(rest);
        if (simplePath) {
          this.path = rest;
          this.href = rest;
          this.pathname = simplePath[1];
          if (simplePath[2]) {
            this.search = simplePath[2];
            if (parseQueryString) {
              this.query = querystring.parse(this.search.substr(1));
            } else {
              this.query = this.search.substr(1);
            }
          } else if (parseQueryString) {
            this.search = '';
            this.query = {};
          }
          return this;
        }
      }

      var proto = protocolPattern.exec(rest);
      if (proto) {
        proto = proto[0];
        var lowerProto = proto.toLowerCase();
        this.protocol = lowerProto;
        rest = rest.substr(proto.length);
      }

      // figure out if it's got a host
      // user@server is *always* interpreted as a hostname, and url
      // resolution will treat //foo/bar as host=foo,path=bar because that's
      // how the browser resolves relative URLs.
      if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
        var slashes = rest.substr(0, 2) === '//';
        if (slashes && !(proto && hostlessProtocol[proto])) {
          rest = rest.substr(2);
          this.slashes = true;
        }
      }

      if (!hostlessProtocol[proto] &&
          (slashes || (proto && !slashedProtocol[proto]))) {

        // there's a hostname.
        // the first instance of /, ?, ;, or # ends the host.
        //
        // If there is an @ in the hostname, then non-host chars *are* allowed
        // to the left of the last @ sign, unless some host-ending character
        // comes *before* the @-sign.
        // URLs are obnoxious.
        //
        // ex:
        // http://a@b@c/ => user:a@b host:c
        // http://a@b?@c => user:a host:c path:/?@c

        // v0.12 TODO(isaacs): This is not quite how Chrome does things.
        // Review our test case against browsers more comprehensively.

        // find the first instance of any hostEndingChars
        var hostEnd = -1;
        for (var i = 0; i < hostEndingChars.length; i++) {
          var hec = rest.indexOf(hostEndingChars[i]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
            hostEnd = hec;
        }

        // at this point, either we have an explicit point where the
        // auth portion cannot go past, or the last @ char is the decider.
        var auth, atSign;
        if (hostEnd === -1) {
          // atSign can be anywhere.
          atSign = rest.lastIndexOf('@');
        } else {
          // atSign must be in auth portion.
          // http://a@b/c@d => host:b auth:a path:/c@d
          atSign = rest.lastIndexOf('@', hostEnd);
        }

        // Now we have a portion which is definitely the auth.
        // Pull that off.
        if (atSign !== -1) {
          auth = rest.slice(0, atSign);
          rest = rest.slice(atSign + 1);
          this.auth = decodeURIComponent(auth);
        }

        // the host is the remaining to the left of the first non-host char
        hostEnd = -1;
        for (var i = 0; i < nonHostChars.length; i++) {
          var hec = rest.indexOf(nonHostChars[i]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
            hostEnd = hec;
        }
        // if we still have not hit it, then the entire thing is a host.
        if (hostEnd === -1)
          hostEnd = rest.length;

        this.host = rest.slice(0, hostEnd);
        rest = rest.slice(hostEnd);

        // pull out port.
        this.parseHost();

        // we've indicated that there is a hostname,
        // so even if it's empty, it has to be present.
        this.hostname = this.hostname || '';

        // if hostname begins with [ and ends with ]
        // assume that it's an IPv6 address.
        var ipv6Hostname = this.hostname[0] === '[' &&
            this.hostname[this.hostname.length - 1] === ']';

        // validate a little.
        if (!ipv6Hostname) {
          var hostparts = this.hostname.split(/\./);
          for (var i = 0, l = hostparts.length; i < l; i++) {
            var part = hostparts[i];
            if (!part) continue;
            if (!part.match(hostnamePartPattern)) {
              var newpart = '';
              for (var j = 0, k = part.length; j < k; j++) {
                if (part.charCodeAt(j) > 127) {
                  // we replace non-ASCII char with a temporary placeholder
                  // we need this to make sure size of hostname is not
                  // broken by replacing non-ASCII by nothing
                  newpart += 'x';
                } else {
                  newpart += part[j];
                }
              }
              // we test again with ASCII char only
              if (!newpart.match(hostnamePartPattern)) {
                var validParts = hostparts.slice(0, i);
                var notHost = hostparts.slice(i + 1);
                var bit = part.match(hostnamePartStart);
                if (bit) {
                  validParts.push(bit[1]);
                  notHost.unshift(bit[2]);
                }
                if (notHost.length) {
                  rest = '/' + notHost.join('.') + rest;
                }
                this.hostname = validParts.join('.');
                break;
              }
            }
          }
        }

        if (this.hostname.length > hostnameMaxLen) {
          this.hostname = '';
        } else {
          // hostnames are always lower case.
          this.hostname = this.hostname.toLowerCase();
        }

        if (!ipv6Hostname) {
          // IDNA Support: Returns a punycoded representation of "domain".
          // It only converts parts of the domain name that
          // have non-ASCII characters, i.e. it doesn't matter if
          // you call it with a domain that already is ASCII-only.
          this.hostname = punycode.toASCII(this.hostname);
        }

        var p = this.port ? ':' + this.port : '';
        var h = this.hostname || '';
        this.host = h + p;
        this.href += this.host;

        // strip [ and ] from the hostname
        // the host field still retains them, though
        if (ipv6Hostname) {
          this.hostname = this.hostname.substr(1, this.hostname.length - 2);
          if (rest[0] !== '/') {
            rest = '/' + rest;
          }
        }
      }

      // now rest is set to the post-host stuff.
      // chop off any delim chars.
      if (!unsafeProtocol[lowerProto]) {

        // First, make 100% sure that any "autoEscape" chars get
        // escaped, even if encodeURIComponent doesn't think they
        // need to be.
        for (var i = 0, l = autoEscape.length; i < l; i++) {
          var ae = autoEscape[i];
          if (rest.indexOf(ae) === -1)
            continue;
          var esc = encodeURIComponent(ae);
          if (esc === ae) {
            esc = escape(ae);
          }
          rest = rest.split(ae).join(esc);
        }
      }


      // chop off from the tail first.
      var hash = rest.indexOf('#');
      if (hash !== -1) {
        // got a fragment string.
        this.hash = rest.substr(hash);
        rest = rest.slice(0, hash);
      }
      var qm = rest.indexOf('?');
      if (qm !== -1) {
        this.search = rest.substr(qm);
        this.query = rest.substr(qm + 1);
        if (parseQueryString) {
          this.query = querystring.parse(this.query);
        }
        rest = rest.slice(0, qm);
      } else if (parseQueryString) {
        // no query string, but parseQueryString still requested
        this.search = '';
        this.query = {};
      }
      if (rest) this.pathname = rest;
      if (slashedProtocol[lowerProto] &&
          this.hostname && !this.pathname) {
        this.pathname = '/';
      }

      //to support http.request
      if (this.pathname || this.search) {
        var p = this.pathname || '';
        var s = this.search || '';
        this.path = p + s;
      }

      // finally, reconstruct the href based on what has been validated.
      this.href = this.format();
      return this;
    };

    // format a parsed object into a url string
    function urlFormat(obj) {
      // ensure it's an object, and not a string url.
      // If it's an obj, this is a no-op.
      // this way, you can call url_format() on strings
      // to clean up potentially wonky urls.
      if (util.isString(obj)) obj = urlParse(obj);
      if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
      return obj.format();
    }

    Url.prototype.format = function() {
      var auth = this.auth || '';
      if (auth) {
        auth = encodeURIComponent(auth);
        auth = auth.replace(/%3A/i, ':');
        auth += '@';
      }

      var protocol = this.protocol || '',
          pathname = this.pathname || '',
          hash = this.hash || '',
          host = false,
          query = '';

      if (this.host) {
        host = auth + this.host;
      } else if (this.hostname) {
        host = auth + (this.hostname.indexOf(':') === -1 ?
            this.hostname :
            '[' + this.hostname + ']');
        if (this.port) {
          host += ':' + this.port;
        }
      }

      if (this.query &&
          util.isObject(this.query) &&
          Object.keys(this.query).length) {
        query = querystring.stringify(this.query);
      }

      var search = this.search || (query && ('?' + query)) || '';

      if (protocol && protocol.substr(-1) !== ':') protocol += ':';

      // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
      // unless they had them to begin with.
      if (this.slashes ||
          (!protocol || slashedProtocol[protocol]) && host !== false) {
        host = '//' + (host || '');
        if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
      } else if (!host) {
        host = '';
      }

      if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
      if (search && search.charAt(0) !== '?') search = '?' + search;

      pathname = pathname.replace(/[?#]/g, function(match) {
        return encodeURIComponent(match);
      });
      search = search.replace('#', '%23');

      return protocol + host + pathname + search + hash;
    };

    function urlResolve(source, relative) {
      return urlParse(source, false, true).resolve(relative);
    }

    Url.prototype.resolve = function(relative) {
      return this.resolveObject(urlParse(relative, false, true)).format();
    };

    function urlResolveObject(source, relative) {
      if (!source) return relative;
      return urlParse(source, false, true).resolveObject(relative);
    }

    Url.prototype.resolveObject = function(relative) {
      if (util.isString(relative)) {
        var rel = new Url();
        rel.parse(relative, false, true);
        relative = rel;
      }

      var result = new Url();
      var tkeys = Object.keys(this);
      for (var tk = 0; tk < tkeys.length; tk++) {
        var tkey = tkeys[tk];
        result[tkey] = this[tkey];
      }

      // hash is always overridden, no matter what.
      // even href="" will remove it.
      result.hash = relative.hash;

      // if the relative url is empty, then there's nothing left to do here.
      if (relative.href === '') {
        result.href = result.format();
        return result;
      }

      // hrefs like //foo/bar always cut to the protocol.
      if (relative.slashes && !relative.protocol) {
        // take everything except the protocol from relative
        var rkeys = Object.keys(relative);
        for (var rk = 0; rk < rkeys.length; rk++) {
          var rkey = rkeys[rk];
          if (rkey !== 'protocol')
            result[rkey] = relative[rkey];
        }

        //urlParse appends trailing / to urls like http://www.example.com
        if (slashedProtocol[result.protocol] &&
            result.hostname && !result.pathname) {
          result.path = result.pathname = '/';
        }

        result.href = result.format();
        return result;
      }

      if (relative.protocol && relative.protocol !== result.protocol) {
        // if it's a known url protocol, then changing
        // the protocol does weird things
        // first, if it's not file:, then we MUST have a host,
        // and if there was a path
        // to begin with, then we MUST have a path.
        // if it is file:, then the host is dropped,
        // because that's known to be hostless.
        // anything else is assumed to be absolute.
        if (!slashedProtocol[relative.protocol]) {
          var keys = Object.keys(relative);
          for (var v = 0; v < keys.length; v++) {
            var k = keys[v];
            result[k] = relative[k];
          }
          result.href = result.format();
          return result;
        }

        result.protocol = relative.protocol;
        if (!relative.host && !hostlessProtocol[relative.protocol]) {
          var relPath = (relative.pathname || '').split('/');
          while (relPath.length && !(relative.host = relPath.shift()));
          if (!relative.host) relative.host = '';
          if (!relative.hostname) relative.hostname = '';
          if (relPath[0] !== '') relPath.unshift('');
          if (relPath.length < 2) relPath.unshift('');
          result.pathname = relPath.join('/');
        } else {
          result.pathname = relative.pathname;
        }
        result.search = relative.search;
        result.query = relative.query;
        result.host = relative.host || '';
        result.auth = relative.auth;
        result.hostname = relative.hostname || relative.host;
        result.port = relative.port;
        // to support http.request
        if (result.pathname || result.search) {
          var p = result.pathname || '';
          var s = result.search || '';
          result.path = p + s;
        }
        result.slashes = result.slashes || relative.slashes;
        result.href = result.format();
        return result;
      }

      var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
          isRelAbs = (
              relative.host ||
              relative.pathname && relative.pathname.charAt(0) === '/'
          ),
          mustEndAbs = (isRelAbs || isSourceAbs ||
                        (result.host && relative.pathname)),
          removeAllDots = mustEndAbs,
          srcPath = result.pathname && result.pathname.split('/') || [],
          relPath = relative.pathname && relative.pathname.split('/') || [],
          psychotic = result.protocol && !slashedProtocol[result.protocol];

      // if the url is a non-slashed url, then relative
      // links like ../.. should be able
      // to crawl up to the hostname, as well.  This is strange.
      // result.protocol has already been set by now.
      // Later on, put the first path part into the host field.
      if (psychotic) {
        result.hostname = '';
        result.port = null;
        if (result.host) {
          if (srcPath[0] === '') srcPath[0] = result.host;
          else srcPath.unshift(result.host);
        }
        result.host = '';
        if (relative.protocol) {
          relative.hostname = null;
          relative.port = null;
          if (relative.host) {
            if (relPath[0] === '') relPath[0] = relative.host;
            else relPath.unshift(relative.host);
          }
          relative.host = null;
        }
        mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
      }

      if (isRelAbs) {
        // it's absolute.
        result.host = (relative.host || relative.host === '') ?
                      relative.host : result.host;
        result.hostname = (relative.hostname || relative.hostname === '') ?
                          relative.hostname : result.hostname;
        result.search = relative.search;
        result.query = relative.query;
        srcPath = relPath;
        // fall through to the dot-handling below.
      } else if (relPath.length) {
        // it's relative
        // throw away the existing file, and take the new path instead.
        if (!srcPath) srcPath = [];
        srcPath.pop();
        srcPath = srcPath.concat(relPath);
        result.search = relative.search;
        result.query = relative.query;
      } else if (!util.isNullOrUndefined(relative.search)) {
        // just pull out the search.
        // like href='?foo'.
        // Put this after the other two cases because it simplifies the booleans
        if (psychotic) {
          result.hostname = result.host = srcPath.shift();
          //occationaly the auth can get stuck only in host
          //this especially happens in cases like
          //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
          var authInHost = result.host && result.host.indexOf('@') > 0 ?
                           result.host.split('@') : false;
          if (authInHost) {
            result.auth = authInHost.shift();
            result.host = result.hostname = authInHost.shift();
          }
        }
        result.search = relative.search;
        result.query = relative.query;
        //to support http.request
        if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
          result.path = (result.pathname ? result.pathname : '') +
                        (result.search ? result.search : '');
        }
        result.href = result.format();
        return result;
      }

      if (!srcPath.length) {
        // no path at all.  easy.
        // we've already handled the other stuff above.
        result.pathname = null;
        //to support http.request
        if (result.search) {
          result.path = '/' + result.search;
        } else {
          result.path = null;
        }
        result.href = result.format();
        return result;
      }

      // if a url ENDs in . or .., then it must get a trailing slash.
      // however, if it ends in anything else non-slashy,
      // then it must NOT get a trailing slash.
      var last = srcPath.slice(-1)[0];
      var hasTrailingSlash = (
          (result.host || relative.host || srcPath.length > 1) &&
          (last === '.' || last === '..') || last === '');

      // strip single dots, resolve double dots to parent dir
      // if the path tries to go above the root, `up` ends up > 0
      var up = 0;
      for (var i = srcPath.length; i >= 0; i--) {
        last = srcPath[i];
        if (last === '.') {
          srcPath.splice(i, 1);
        } else if (last === '..') {
          srcPath.splice(i, 1);
          up++;
        } else if (up) {
          srcPath.splice(i, 1);
          up--;
        }
      }

      // if the path is allowed to go above the root, restore leading ..s
      if (!mustEndAbs && !removeAllDots) {
        for (; up--; up) {
          srcPath.unshift('..');
        }
      }

      if (mustEndAbs && srcPath[0] !== '' &&
          (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
        srcPath.unshift('');
      }

      if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
        srcPath.push('');
      }

      var isAbsolute = srcPath[0] === '' ||
          (srcPath[0] && srcPath[0].charAt(0) === '/');

      // put the host back
      if (psychotic) {
        result.hostname = result.host = isAbsolute ? '' :
                                        srcPath.length ? srcPath.shift() : '';
        //occationaly the auth can get stuck only in host
        //this especially happens in cases like
        //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
        var authInHost = result.host && result.host.indexOf('@') > 0 ?
                         result.host.split('@') : false;
        if (authInHost) {
          result.auth = authInHost.shift();
          result.host = result.hostname = authInHost.shift();
        }
      }

      mustEndAbs = mustEndAbs || (result.host && srcPath.length);

      if (mustEndAbs && !isAbsolute) {
        srcPath.unshift('');
      }

      if (!srcPath.length) {
        result.pathname = null;
        result.path = null;
      } else {
        result.pathname = srcPath.join('/');
      }

      //to support request.http
      if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
        result.path = (result.pathname ? result.pathname : '') +
                      (result.search ? result.search : '');
      }
      result.auth = relative.auth || result.auth;
      result.slashes = result.slashes || relative.slashes;
      result.href = result.format();
      return result;
    };

    Url.prototype.parseHost = function() {
      var host = this.host;
      var port = portPattern.exec(host);
      if (port) {
        port = port[0];
        if (port !== ':') {
          this.port = port.substr(1);
        }
        host = host.substr(0, host.length - port.length);
      }
      if (host) this.hostname = host;
    };

    var url = {
    	parse: parse,
    	resolve: resolve,
    	resolveObject: resolveObject,
    	format: format,
    	Url: Url_1
    };

    /*!
     * @pixi/utils - v5.3.1
     * Compiled Fri, 24 Jul 2020 20:56:48 UTC
     *
     * @pixi/utils is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    /**
     * The prefix that denotes a URL is for a retina asset.
     *
     * @static
     * @name RETINA_PREFIX
     * @memberof PIXI.settings
     * @type {RegExp}
     * @default /@([0-9\.]+)x/
     * @example `@2x`
     */
    settings.RETINA_PREFIX = /@([0-9\.]+)x/;
    /**
     * Should the `failIfMajorPerformanceCaveat` flag be enabled as a context option used in the `isWebGLSupported` function.
     * For most scenarios this should be left as true, as otherwise the user may have a poor experience.
     * However, it can be useful to disable under certain scenarios, such as headless unit tests.
     *
     * @static
     * @name FAIL_IF_MAJOR_PERFORMANCE_CAVEAT
     * @memberof PIXI.settings
     * @type {boolean}
     * @default true
     */
    settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = true;

    var saidHello = false;
    var VERSION = '5.3.1';
    /**
     * Skips the hello message of renderers that are created after this is run.
     *
     * @function skipHello
     * @memberof PIXI.utils
     */
    function skipHello() {
        saidHello = true;
    }
    /**
     * Logs out the version and renderer information for this running instance of PIXI.
     * If you don't want to see this message you can run `PIXI.utils.skipHello()` before
     * creating your renderer. Keep in mind that doing that will forever make you a jerk face.
     *
     * @static
     * @function sayHello
     * @memberof PIXI.utils
     * @param {string} type - The string renderer type to log.
     */
    function sayHello(type) {
        var _a;
        if (saidHello) {
            return;
        }
        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
            var args = [
                "\n %c %c %c PixiJS " + VERSION + " - \u2730 " + type + " \u2730  %c  %c  http://www.pixijs.com/  %c %c \u2665%c\u2665%c\u2665 \n\n",
                'background: #ff66a5; padding:5px 0;',
                'background: #ff66a5; padding:5px 0;',
                'color: #ff66a5; background: #030307; padding:5px 0;',
                'background: #ff66a5; padding:5px 0;',
                'background: #ffc3dc; padding:5px 0;',
                'background: #ff66a5; padding:5px 0;',
                'color: #ff2424; background: #fff; padding:5px 0;',
                'color: #ff2424; background: #fff; padding:5px 0;',
                'color: #ff2424; background: #fff; padding:5px 0;' ];
            (_a = window.console).log.apply(_a, args);
        }
        else if (window.console) {
            window.console.log("PixiJS " + VERSION + " - " + type + " - http://www.pixijs.com/");
        }
        saidHello = true;
    }

    var supported;
    /**
     * Helper for checking for WebGL support.
     *
     * @memberof PIXI.utils
     * @function isWebGLSupported
     * @return {boolean} Is WebGL supported.
     */
    function isWebGLSupported() {
        if (typeof supported === 'undefined') {
            supported = (function supported() {
                var contextOptions = {
                    stencil: true,
                    failIfMajorPerformanceCaveat: settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT,
                };
                try {
                    if (!window.WebGLRenderingContext) {
                        return false;
                    }
                    var canvas = document.createElement('canvas');
                    var gl = (canvas.getContext('webgl', contextOptions)
                        || canvas.getContext('experimental-webgl', contextOptions));
                    var success = !!(gl && gl.getContextAttributes().stencil);
                    if (gl) {
                        var loseContext = gl.getExtension('WEBGL_lose_context');
                        if (loseContext) {
                            loseContext.loseContext();
                        }
                    }
                    gl = null;
                    return success;
                }
                catch (e) {
                    return false;
                }
            })();
        }
        return supported;
    }

    /**
     * Converts a hexadecimal color number to an [R, G, B] array of normalized floats (numbers from 0.0 to 1.0).
     *
     * @example
     * PIXI.utils.hex2rgb(0xffffff); // returns [1, 1, 1]
     * @memberof PIXI.utils
     * @function hex2rgb
     * @param {number} hex - The hexadecimal number to convert
     * @param  {number[]} [out=[]] - If supplied, this array will be used rather than returning a new one
     * @return {number[]} An array representing the [R, G, B] of the color where all values are floats.
     */
    function hex2rgb(hex, out) {
        if (out === void 0) { out = []; }
        out[0] = ((hex >> 16) & 0xFF) / 255;
        out[1] = ((hex >> 8) & 0xFF) / 255;
        out[2] = (hex & 0xFF) / 255;
        return out;
    }
    /**
     * Converts a hexadecimal color number to a string.
     *
     * @example
     * PIXI.utils.hex2string(0xffffff); // returns "#ffffff"
     * @memberof PIXI.utils
     * @function hex2string
     * @param {number} hex - Number in hex (e.g., `0xffffff`)
     * @return {string} The string color (e.g., `"#ffffff"`).
     */
    function hex2string(hex) {
        var hexString = hex.toString(16);
        hexString = '000000'.substr(0, 6 - hexString.length) + hexString;
        return "#" + hexString;
    }
    /**
     * Converts a hexadecimal string to a hexadecimal color number.
     *
     * @example
     * PIXI.utils.string2hex("#ffffff"); // returns 0xffffff
     * @memberof PIXI.utils
     * @function string2hex
     * @param {string} string - The string color (e.g., `"#ffffff"`)
     * @return {number} Number in hexadecimal.
     */
    function string2hex(string) {
        if (typeof string === 'string' && string[0] === '#') {
            string = string.substr(1);
        }
        return parseInt(string, 16);
    }
    /**
     * Converts a color as an [R, G, B] array of normalized floats to a hexadecimal number.
     *
     * @example
     * PIXI.utils.rgb2hex([1, 1, 1]); // returns 0xffffff
     * @memberof PIXI.utils
     * @function rgb2hex
     * @param {number[]} rgb - Array of numbers where all values are normalized floats from 0.0 to 1.0.
     * @return {number} Number in hexadecimal.
     */
    function rgb2hex(rgb) {
        return (((rgb[0] * 255) << 16) + ((rgb[1] * 255) << 8) + (rgb[2] * 255 | 0));
    }

    /**
     * Corrects PixiJS blend, takes premultiplied alpha into account
     *
     * @memberof PIXI.utils
     * @function mapPremultipliedBlendModes
     * @private
     * @return {Array<number[]>} Mapped modes.
     */
    function mapPremultipliedBlendModes() {
        var pm = [];
        var npm = [];
        for (var i = 0; i < 32; i++) {
            pm[i] = i;
            npm[i] = i;
        }
        pm[BLEND_MODES.NORMAL_NPM] = BLEND_MODES.NORMAL;
        pm[BLEND_MODES.ADD_NPM] = BLEND_MODES.ADD;
        pm[BLEND_MODES.SCREEN_NPM] = BLEND_MODES.SCREEN;
        npm[BLEND_MODES.NORMAL] = BLEND_MODES.NORMAL_NPM;
        npm[BLEND_MODES.ADD] = BLEND_MODES.ADD_NPM;
        npm[BLEND_MODES.SCREEN] = BLEND_MODES.SCREEN_NPM;
        var array = [];
        array.push(npm);
        array.push(pm);
        return array;
    }
    /**
     * maps premultiply flag and blendMode to adjusted blendMode
     * @memberof PIXI.utils
     * @const premultiplyBlendMode
     * @type {Array<number[]>}
     */
    var premultiplyBlendMode = mapPremultipliedBlendModes();
    /**
     * changes blendMode according to texture format
     *
     * @memberof PIXI.utils
     * @function correctBlendMode
     * @param {number} blendMode - supposed blend mode
     * @param {boolean} premultiplied - whether source is premultiplied
     * @returns {number} true blend mode for this texture
     */
    function correctBlendMode(blendMode, premultiplied) {
        return premultiplyBlendMode[premultiplied ? 1 : 0][blendMode];
    }
    /**
     * combines rgb and alpha to out array
     *
     * @memberof PIXI.utils
     * @function premultiplyRgba
     * @param {Float32Array|number[]} rgb - input rgb
     * @param {number} alpha - alpha param
     * @param {Float32Array} [out] - output
     * @param {boolean} [premultiply=true] - do premultiply it
     * @returns {Float32Array} vec4 rgba
     */
    function premultiplyRgba(rgb, alpha, out, premultiply) {
        out = out || new Float32Array(4);
        if (premultiply || premultiply === undefined) {
            out[0] = rgb[0] * alpha;
            out[1] = rgb[1] * alpha;
            out[2] = rgb[2] * alpha;
        }
        else {
            out[0] = rgb[0];
            out[1] = rgb[1];
            out[2] = rgb[2];
        }
        out[3] = alpha;
        return out;
    }
    /**
     * premultiplies tint
     *
     * @memberof PIXI.utils
     * @function premultiplyTint
     * @param {number} tint - integer RGB
     * @param {number} alpha - floating point alpha (0.0-1.0)
     * @returns {number} tint multiplied by alpha
     */
    function premultiplyTint(tint, alpha) {
        if (alpha === 1.0) {
            return (alpha * 255 << 24) + tint;
        }
        if (alpha === 0.0) {
            return 0;
        }
        var R = ((tint >> 16) & 0xFF);
        var G = ((tint >> 8) & 0xFF);
        var B = (tint & 0xFF);
        R = ((R * alpha) + 0.5) | 0;
        G = ((G * alpha) + 0.5) | 0;
        B = ((B * alpha) + 0.5) | 0;
        return (alpha * 255 << 24) + (R << 16) + (G << 8) + B;
    }
    /**
     * converts integer tint and float alpha to vec4 form, premultiplies by default
     *
     * @memberof PIXI.utils
     * @function premultiplyTintToRgba
     * @param {number} tint - input tint
     * @param {number} alpha - alpha param
     * @param {Float32Array} [out] output
     * @param {boolean} [premultiply=true] - do premultiply it
     * @returns {Float32Array} vec4 rgba
     */
    function premultiplyTintToRgba(tint, alpha, out, premultiply) {
        out = out || new Float32Array(4);
        out[0] = ((tint >> 16) & 0xFF) / 255.0;
        out[1] = ((tint >> 8) & 0xFF) / 255.0;
        out[2] = (tint & 0xFF) / 255.0;
        if (premultiply || premultiply === undefined) {
            out[0] *= alpha;
            out[1] *= alpha;
            out[2] *= alpha;
        }
        out[3] = alpha;
        return out;
    }

    /**
     * Generic Mask Stack data structure
     *
     * @memberof PIXI.utils
     * @function createIndicesForQuads
     * @param {number} size - Number of quads
     * @param {Uint16Array|Uint32Array} [outBuffer] - Buffer for output, length has to be `6 * size`
     * @return {Uint16Array|Uint32Array} - Resulting index buffer
     */
    function createIndicesForQuads(size, outBuffer) {
        if (outBuffer === void 0) { outBuffer = null; }
        // the total number of indices in our array, there are 6 points per quad.
        var totalIndices = size * 6;
        outBuffer = outBuffer || new Uint16Array(totalIndices);
        if (outBuffer.length !== totalIndices) {
            throw new Error("Out buffer length is incorrect, got " + outBuffer.length + " and expected " + totalIndices);
        }
        // fill the indices with the quads to draw
        for (var i = 0, j = 0; i < totalIndices; i += 6, j += 4) {
            outBuffer[i + 0] = j + 0;
            outBuffer[i + 1] = j + 1;
            outBuffer[i + 2] = j + 2;
            outBuffer[i + 3] = j + 0;
            outBuffer[i + 4] = j + 2;
            outBuffer[i + 5] = j + 3;
        }
        return outBuffer;
    }

    function getBufferType(array) {
        if (array.BYTES_PER_ELEMENT === 4) {
            if (array instanceof Float32Array) {
                return 'Float32Array';
            }
            else if (array instanceof Uint32Array) {
                return 'Uint32Array';
            }
            return 'Int32Array';
        }
        else if (array.BYTES_PER_ELEMENT === 2) {
            if (array instanceof Uint16Array) {
                return 'Uint16Array';
            }
        }
        else if (array.BYTES_PER_ELEMENT === 1) {
            if (array instanceof Uint8Array) {
                return 'Uint8Array';
            }
        }
        // TODO map out the rest of the array elements!
        return null;
    }

    /* eslint-disable object-shorthand */
    var map = { Float32Array: Float32Array, Uint32Array: Uint32Array, Int32Array: Int32Array, Uint8Array: Uint8Array };
    function interleaveTypedArrays(arrays, sizes) {
        var outSize = 0;
        var stride = 0;
        var views = {};
        for (var i = 0; i < arrays.length; i++) {
            stride += sizes[i];
            outSize += arrays[i].length;
        }
        var buffer = new ArrayBuffer(outSize * 4);
        var out = null;
        var littleOffset = 0;
        for (var i = 0; i < arrays.length; i++) {
            var size = sizes[i];
            var array = arrays[i];
            /*
            @todo This is unsafe casting but consistent with how the code worked previously. Should it stay this way
                  or should and `getBufferTypeUnsafe` function be exposed that throws an Error if unsupported type is passed?
             */
            var type = getBufferType(array);
            if (!views[type]) {
                views[type] = new map[type](buffer);
            }
            out = views[type];
            for (var j = 0; j < array.length; j++) {
                var indexStart = ((j / size | 0) * stride) + littleOffset;
                var index = j % size;
                out[indexStart + index] = array[j];
            }
            littleOffset += size;
        }
        return new Float32Array(buffer);
    }

    // Taken from the bit-twiddle package
    /**
     * Rounds to next power of two.
     *
     * @function nextPow2
     * @memberof PIXI.utils
     * @param {number} v - input value
     * @return {number}
     */
    function nextPow2(v) {
        v += v === 0 ? 1 : 0;
        --v;
        v |= v >>> 1;
        v |= v >>> 2;
        v |= v >>> 4;
        v |= v >>> 8;
        v |= v >>> 16;
        return v + 1;
    }
    /**
     * Checks if a number is a power of two.
     *
     * @function isPow2
     * @memberof PIXI.utils
     * @param {number} v - input value
     * @return {boolean} `true` if value is power of two
     */
    function isPow2(v) {
        return !(v & (v - 1)) && (!!v);
    }
    /**
     * Computes ceil of log base 2
     *
     * @function log2
     * @memberof PIXI.utils
     * @param {number} v - input value
     * @return {number} logarithm base 2
     */
    function log2(v) {
        var r = (v > 0xFFFF ? 1 : 0) << 4;
        v >>>= r;
        var shift = (v > 0xFF ? 1 : 0) << 3;
        v >>>= shift;
        r |= shift;
        shift = (v > 0xF ? 1 : 0) << 2;
        v >>>= shift;
        r |= shift;
        shift = (v > 0x3 ? 1 : 0) << 1;
        v >>>= shift;
        r |= shift;
        return r | (v >> 1);
    }

    /**
     * Remove items from a javascript array without generating garbage
     *
     * @function removeItems
     * @memberof PIXI.utils
     * @param {Array<any>} arr - Array to remove elements from
     * @param {number} startIdx - starting index
     * @param {number} removeCount - how many to remove
     */
    function removeItems(arr, startIdx, removeCount) {
        var length = arr.length;
        var i;
        if (startIdx >= length || removeCount === 0) {
            return;
        }
        removeCount = (startIdx + removeCount > length ? length - startIdx : removeCount);
        var len = length - removeCount;
        for (i = startIdx; i < len; ++i) {
            arr[i] = arr[i + removeCount];
        }
        arr.length = len;
    }

    /**
     * Returns sign of number
     *
     * @memberof PIXI.utils
     * @function sign
     * @param {number} n - the number to check the sign of
     * @returns {number} 0 if `n` is 0, -1 if `n` is negative, 1 if `n` is positive
     */
    function sign$1(n) {
        if (n === 0)
            { return 0; }
        return n < 0 ? -1 : 1;
    }

    var nextUid = 0;
    /**
     * Gets the next unique identifier
     *
     * @memberof PIXI.utils
     * @function uid
     * @return {number} The next unique identifier to use.
     */
    function uid() {
        return ++nextUid;
    }

    // A map of warning messages already fired
    var warnings = {};
    /**
     * Helper for warning developers about deprecated features & settings.
     * A stack track for warnings is given; useful for tracking-down where
     * deprecated methods/properties/classes are being used within the code.
     *
     * @memberof PIXI.utils
     * @function deprecation
     * @param {string} version - The version where the feature became deprecated
     * @param {string} message - Message should include what is deprecated, where, and the new solution
     * @param {number} [ignoreDepth=3] - The number of steps to ignore at the top of the error stack
     *        this is mostly to ignore internal deprecation calls.
     */
    function deprecation(version, message, ignoreDepth) {
        if (ignoreDepth === void 0) { ignoreDepth = 3; }
        // Ignore duplicat
        if (warnings[message]) {
            return;
        }
        /* eslint-disable no-console */
        var stack = new Error().stack;
        // Handle IE < 10 and Safari < 6
        if (typeof stack === 'undefined') {
            console.warn('PixiJS Deprecation Warning: ', message + "\nDeprecated since v" + version);
        }
        else {
            // chop off the stack trace which includes PixiJS internal calls
            stack = stack.split('\n').splice(ignoreDepth).join('\n');
            if (console.groupCollapsed) {
                console.groupCollapsed('%cPixiJS Deprecation Warning: %c%s', 'color:#614108;background:#fffbe6', 'font-weight:normal;color:#614108;background:#fffbe6', message + "\nDeprecated since v" + version);
                console.warn(stack);
                console.groupEnd();
            }
            else {
                console.warn('PixiJS Deprecation Warning: ', message + "\nDeprecated since v" + version);
                console.warn(stack);
            }
        }
        /* eslint-enable no-console */
        warnings[message] = true;
    }

    /**
     * @todo Describe property usage
     *
     * @static
     * @name ProgramCache
     * @memberof PIXI.utils
     * @type {Object}
     */
    var ProgramCache = {};
    /**
     * @todo Describe property usage
     *
     * @static
     * @name TextureCache
     * @memberof PIXI.utils
     * @type {Object}
     */
    var TextureCache = Object.create(null);
    /**
     * @todo Describe property usage
     *
     * @static
     * @name BaseTextureCache
     * @memberof PIXI.utils
     * @type {Object}
     */
    var BaseTextureCache = Object.create(null);
    /**
     * Destroys all texture in the cache
     *
     * @memberof PIXI.utils
     * @function destroyTextureCache
     */
    function destroyTextureCache() {
        var key;
        for (key in TextureCache) {
            TextureCache[key].destroy();
        }
        for (key in BaseTextureCache) {
            BaseTextureCache[key].destroy();
        }
    }
    /**
     * Removes all textures from cache, but does not destroy them
     *
     * @memberof PIXI.utils
     * @function clearTextureCache
     */
    function clearTextureCache() {
        var key;
        for (key in TextureCache) {
            delete TextureCache[key];
        }
        for (key in BaseTextureCache) {
            delete BaseTextureCache[key];
        }
    }

    /**
     * Creates a Canvas element of the given size to be used as a target for rendering to.
     *
     * @class
     * @memberof PIXI.utils
     */
    var CanvasRenderTarget = /** @class */ (function () {
        /**
         * @param {number} width - the width for the newly created canvas
         * @param {number} height - the height for the newly created canvas
         * @param {number} [resolution=1] - The resolution / device pixel ratio of the canvas
         */
        function CanvasRenderTarget(width, height, resolution) {
            /**
             * The Canvas object that belongs to this CanvasRenderTarget.
             *
             * @member {HTMLCanvasElement}
             */
            this.canvas = document.createElement('canvas');
            /**
             * A CanvasRenderingContext2D object representing a two-dimensional rendering context.
             *
             * @member {CanvasRenderingContext2D}
             */
            this.context = this.canvas.getContext('2d');
            this.resolution = resolution || settings.RESOLUTION;
            this.resize(width, height);
        }
        /**
         * Clears the canvas that was created by the CanvasRenderTarget class.
         *
         * @private
         */
        CanvasRenderTarget.prototype.clear = function () {
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        };
        /**
         * Resizes the canvas to the specified width and height.
         *
         * @param {number} width - the new width of the canvas
         * @param {number} height - the new height of the canvas
         */
        CanvasRenderTarget.prototype.resize = function (width, height) {
            this.canvas.width = width * this.resolution;
            this.canvas.height = height * this.resolution;
        };
        /**
         * Destroys this canvas.
         *
         */
        CanvasRenderTarget.prototype.destroy = function () {
            this.context = null;
            this.canvas = null;
        };
        Object.defineProperty(CanvasRenderTarget.prototype, "width", {
            /**
             * The width of the canvas buffer in pixels.
             *
             * @member {number}
             */
            get: function () {
                return this.canvas.width;
            },
            set: function (val) {
                this.canvas.width = val;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CanvasRenderTarget.prototype, "height", {
            /**
             * The height of the canvas buffer in pixels.
             *
             * @member {number}
             */
            get: function () {
                return this.canvas.height;
            },
            set: function (val) {
                this.canvas.height = val;
            },
            enumerable: false,
            configurable: true
        });
        return CanvasRenderTarget;
    }());

    /**
     * Trim transparent borders from a canvas
     *
     * @memberof PIXI.utils
     * @function trimCanvas
     * @param {HTMLCanvasElement} canvas - the canvas to trim
     * @returns {object} Trim data
     */
    function trimCanvas(canvas) {
        // https://gist.github.com/remy/784508
        var width = canvas.width;
        var height = canvas.height;
        var context = canvas.getContext('2d');
        var imageData = context.getImageData(0, 0, width, height);
        var pixels = imageData.data;
        var len = pixels.length;
        var bound = {
            top: null,
            left: null,
            right: null,
            bottom: null,
        };
        var data = null;
        var i;
        var x;
        var y;
        for (i = 0; i < len; i += 4) {
            if (pixels[i + 3] !== 0) {
                x = (i / 4) % width;
                y = ~~((i / 4) / width);
                if (bound.top === null) {
                    bound.top = y;
                }
                if (bound.left === null) {
                    bound.left = x;
                }
                else if (x < bound.left) {
                    bound.left = x;
                }
                if (bound.right === null) {
                    bound.right = x + 1;
                }
                else if (bound.right < x) {
                    bound.right = x + 1;
                }
                if (bound.bottom === null) {
                    bound.bottom = y;
                }
                else if (bound.bottom < y) {
                    bound.bottom = y;
                }
            }
        }
        if (bound.top !== null) {
            width = bound.right - bound.left;
            height = bound.bottom - bound.top + 1;
            data = context.getImageData(bound.left, bound.top, width, height);
        }
        return {
            height: height,
            width: width,
            data: data,
        };
    }

    /**
     * Regexp for data URI.
     * Based on: {@link https://github.com/ragingwind/data-uri-regex}
     *
     * @static
     * @constant {RegExp|string} DATA_URI
     * @memberof PIXI
     * @example data:image/png;base64
     */
    var DATA_URI = /^\s*data:(?:([\w-]+)\/([\w+.-]+))?(?:;charset=([\w-]+))?(?:;(base64))?,(.*)/i;

    /**
     * @memberof PIXI.utils
     * @interface DecomposedDataUri
     */
    /**
     * type, eg. `image`
     * @memberof PIXI.utils.DecomposedDataUri#
     * @member {string} mediaType
     */
    /**
     * Sub type, eg. `png`
     * @memberof PIXI.utils.DecomposedDataUri#
     * @member {string} subType
     */
    /**
     * @memberof PIXI.utils.DecomposedDataUri#
     * @member {string} charset
     */
    /**
     * Data encoding, eg. `base64`
     * @memberof PIXI.utils.DecomposedDataUri#
     * @member {string} encoding
     */
    /**
     * The actual data
     * @memberof PIXI.utils.DecomposedDataUri#
     * @member {string} data
     */
    /**
     * Split a data URI into components. Returns undefined if
     * parameter `dataUri` is not a valid data URI.
     *
     * @memberof PIXI.utils
     * @function decomposeDataUri
     * @param {string} dataUri - the data URI to check
     * @return {PIXI.utils.DecomposedDataUri|undefined} The decomposed data uri or undefined
     */
    function decomposeDataUri(dataUri) {
        var dataUriMatch = DATA_URI.exec(dataUri);
        if (dataUriMatch) {
            return {
                mediaType: dataUriMatch[1] ? dataUriMatch[1].toLowerCase() : undefined,
                subType: dataUriMatch[2] ? dataUriMatch[2].toLowerCase() : undefined,
                charset: dataUriMatch[3] ? dataUriMatch[3].toLowerCase() : undefined,
                encoding: dataUriMatch[4] ? dataUriMatch[4].toLowerCase() : undefined,
                data: dataUriMatch[5],
            };
        }
        return undefined;
    }

    var tempAnchor;
    /**
     * Sets the `crossOrigin` property for this resource based on if the url
     * for this resource is cross-origin. If crossOrigin was manually set, this
     * function does nothing.
     * Nipped from the resource loader!
     *
     * @ignore
     * @param {string} url - The url to test.
     * @param {object} [loc=window.location] - The location object to test against.
     * @return {string} The crossOrigin value to use (or empty string for none).
     */
    function determineCrossOrigin(url, loc) {
        if (loc === void 0) { loc = window.location; }
        // data: and javascript: urls are considered same-origin
        if (url.indexOf('data:') === 0) {
            return '';
        }
        // default is window.location
        loc = loc || window.location;
        if (!tempAnchor) {
            tempAnchor = document.createElement('a');
        }
        // let the browser determine the full href for the url of this resource and then
        // parse with the node url lib, we can't use the properties of the anchor element
        // because they don't work in IE9 :(
        tempAnchor.href = url;
        var parsedUrl = parse(tempAnchor.href);
        var samePort = (!parsedUrl.port && loc.port === '') || (parsedUrl.port === loc.port);
        // if cross origin
        if (parsedUrl.hostname !== loc.hostname || !samePort || parsedUrl.protocol !== loc.protocol) {
            return 'anonymous';
        }
        return '';
    }

    /**
     * get the resolution / device pixel ratio of an asset by looking for the prefix
     * used by spritesheets and image urls
     *
     * @memberof PIXI.utils
     * @function getResolutionOfUrl
     * @param {string} url - the image path
     * @param {number} [defaultValue=1] - the defaultValue if no filename prefix is set.
     * @return {number} resolution / device pixel ratio of an asset
     */
    function getResolutionOfUrl(url, defaultValue) {
        var resolution = settings.RETINA_PREFIX.exec(url);
        if (resolution) {
            return parseFloat(resolution[1]);
        }
        return defaultValue !== undefined ? defaultValue : 1;
    }

    /*!
     * @pixi/runner - v5.3.1
     * Compiled Fri, 24 Jul 2020 20:56:48 UTC
     *
     * @pixi/runner is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */
    /**
     * A Runner is a highly performant and simple alternative to signals. Best used in situations
     * where events are dispatched to many objects at high frequency (say every frame!)
     *
     *
     * like a signal..
     * ```
     * import { Runner } from '@pixi/runner';
     *
     * const myObject = {
     *     loaded: new Runner('loaded')
     * }
     *
     * const listener = {
     *     loaded: function(){
     *         // thin
     *     }
     * }
     *
     * myObject.update.add(listener);
     *
     * myObject.loaded.emit();
     * ```
     *
     * Or for handling calling the same function on many items
     * ```
     * import { Runner } from '@pixi/runner';
     *
     * const myGame = {
     *     update: new Runner('update')
     * }
     *
     * const gameObject = {
     *     update: function(time){
     *         // update my gamey state
     *     }
     * }
     *
     * myGame.update.add(gameObject1);
     *
     * myGame.update.emit(time);
     * ```
     * @class
     * @memberof PIXI
     */
    var Runner = /** @class */ (function () {
        /**
         *  @param {string} name - the function name that will be executed on the listeners added to this Runner.
         */
        function Runner(name) {
            this.items = [];
            this._name = name;
            this._aliasCount = 0;
        }
        /**
         * Dispatch/Broadcast Runner to all listeners added to the queue.
         * @param {...any} params - optional parameters to pass to each listener
         * @return {PIXI.Runner}
         */
        Runner.prototype.emit = function (a0, a1, a2, a3, a4, a5, a6, a7) {
            if (arguments.length > 8) {
                throw new Error('max arguments reached');
            }
            var _a = this, name = _a.name, items = _a.items;
            this._aliasCount++;
            for (var i = 0, len = items.length; i < len; i++) {
                items[i][name](a0, a1, a2, a3, a4, a5, a6, a7);
            }
            if (items === this.items) {
                this._aliasCount--;
            }
            return this;
        };
        Runner.prototype.ensureNonAliasedItems = function () {
            if (this._aliasCount > 0 && this.items.length > 1) {
                this._aliasCount = 0;
                this.items = this.items.slice(0);
            }
        };
        /**
         * Add a listener to the Runner
         *
         * Runners do not need to have scope or functions passed to them.
         * All that is required is to pass the listening object and ensure that it has contains a function that has the same name
         * as the name provided to the Runner when it was created.
         *
         * Eg A listener passed to this Runner will require a 'complete' function.
         *
         * ```
         * import { Runner } from '@pixi/runner';
         *
         * const complete = new Runner('complete');
         * ```
         *
         * The scope used will be the object itself.
         *
         * @param {any} item - The object that will be listening.
         * @return {PIXI.Runner}
         */
        Runner.prototype.add = function (item) {
            if (item[this._name]) {
                this.ensureNonAliasedItems();
                this.remove(item);
                this.items.push(item);
            }
            return this;
        };
        /**
         * Remove a single listener from the dispatch queue.
         * @param {any} item - The listenr that you would like to remove.
         * @return {PIXI.Runner}
         */
        Runner.prototype.remove = function (item) {
            var index = this.items.indexOf(item);
            if (index !== -1) {
                this.ensureNonAliasedItems();
                this.items.splice(index, 1);
            }
            return this;
        };
        /**
         * Check to see if the listener is already in the Runner
         * @param {any} item - The listener that you would like to check.
         */
        Runner.prototype.contains = function (item) {
            return this.items.indexOf(item) !== -1;
        };
        /**
         * Remove all listeners from the Runner
         * @return {PIXI.Runner}
         */
        Runner.prototype.removeAll = function () {
            this.ensureNonAliasedItems();
            this.items.length = 0;
            return this;
        };
        /**
         * Remove all references, don't use after this.
         */
        Runner.prototype.destroy = function () {
            this.removeAll();
            this.items = null;
            this._name = null;
        };
        Object.defineProperty(Runner.prototype, "empty", {
            /**
             * `true` if there are no this Runner contains no listeners
             *
             * @member {boolean}
             * @readonly
             */
            get: function () {
                return this.items.length === 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Runner.prototype, "name", {
            /**
             * The name of the runner.
             *
             * @member {string}
             * @readonly
             */
            get: function () {
                return this._name;
            },
            enumerable: false,
            configurable: true
        });
        return Runner;
    }());
    Object.defineProperties(Runner.prototype, {
        /**
         * Alias for `emit`
         * @memberof PIXI.Runner#
         * @method dispatch
         * @see PIXI.Runner#emit
         */
        dispatch: { value: Runner.prototype.emit },
        /**
         * Alias for `emit`
         * @memberof PIXI.Runner#
         * @method run
         * @see PIXI.Runner#emit
         */
        run: { value: Runner.prototype.emit },
    });

    /*!
     * @pixi/ticker - v5.3.1
     * Compiled Fri, 24 Jul 2020 20:56:48 UTC
     *
     * @pixi/ticker is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    /**
     * Target frames per millisecond.
     *
     * @static
     * @name TARGET_FPMS
     * @memberof PIXI.settings
     * @type {number}
     * @default 0.06
     */
    settings.TARGET_FPMS = 0.06;

    /**
     * Represents the update priorities used by internal PIXI classes when registered with
     * the {@link PIXI.Ticker} object. Higher priority items are updated first and lower
     * priority items, such as render, should go later.
     *
     * @static
     * @constant
     * @name UPDATE_PRIORITY
     * @memberof PIXI
     * @enum {number}
     * @property {number} INTERACTION=50 Highest priority, used for {@link PIXI.InteractionManager}
     * @property {number} HIGH=25 High priority updating, {@link PIXI.VideoBaseTexture} and {@link PIXI.AnimatedSprite}
     * @property {number} NORMAL=0 Default priority for ticker events, see {@link PIXI.Ticker#add}.
     * @property {number} LOW=-25 Low priority used for {@link PIXI.Application} rendering.
     * @property {number} UTILITY=-50 Lowest priority used for {@link PIXI.BasePrepare} utility.
     */
    var UPDATE_PRIORITY;
    (function (UPDATE_PRIORITY) {
        UPDATE_PRIORITY[UPDATE_PRIORITY["INTERACTION"] = 50] = "INTERACTION";
        UPDATE_PRIORITY[UPDATE_PRIORITY["HIGH"] = 25] = "HIGH";
        UPDATE_PRIORITY[UPDATE_PRIORITY["NORMAL"] = 0] = "NORMAL";
        UPDATE_PRIORITY[UPDATE_PRIORITY["LOW"] = -25] = "LOW";
        UPDATE_PRIORITY[UPDATE_PRIORITY["UTILITY"] = -50] = "UTILITY";
    })(UPDATE_PRIORITY || (UPDATE_PRIORITY = {}));

    /**
     * Internal class for handling the priority sorting of ticker handlers.
     *
     * @private
     * @class
     * @memberof PIXI
     */
    var TickerListener = /** @class */ (function () {
        /**
         * Constructor
         * @private
         * @param {Function} fn - The listener function to be added for one update
         * @param {*} [context=null] - The listener context
         * @param {number} [priority=0] - The priority for emitting
         * @param {boolean} [once=false] - If the handler should fire once
         */
        function TickerListener(fn, context, priority, once) {
            if (context === void 0) { context = null; }
            if (priority === void 0) { priority = 0; }
            if (once === void 0) { once = false; }
            /**
             * The handler function to execute.
             * @private
             * @member {Function}
             */
            this.fn = fn;
            /**
             * The calling to execute.
             * @private
             * @member {*}
             */
            this.context = context;
            /**
             * The current priority.
             * @private
             * @member {number}
             */
            this.priority = priority;
            /**
             * If this should only execute once.
             * @private
             * @member {boolean}
             */
            this.once = once;
            /**
             * The next item in chain.
             * @private
             * @member {TickerListener}
             */
            this.next = null;
            /**
             * The previous item in chain.
             * @private
             * @member {TickerListener}
             */
            this.previous = null;
            /**
             * `true` if this listener has been destroyed already.
             * @member {boolean}
             * @private
             */
            this._destroyed = false;
        }
        /**
         * Simple compare function to figure out if a function and context match.
         * @private
         * @param {Function} fn - The listener function to be added for one update
         * @param {any} [context] - The listener context
         * @return {boolean} `true` if the listener match the arguments
         */
        TickerListener.prototype.match = function (fn, context) {
            if (context === void 0) { context = null; }
            return this.fn === fn && this.context === context;
        };
        /**
         * Emit by calling the current function.
         * @private
         * @param {number} deltaTime - time since the last emit.
         * @return {TickerListener} Next ticker
         */
        TickerListener.prototype.emit = function (deltaTime) {
            if (this.fn) {
                if (this.context) {
                    this.fn.call(this.context, deltaTime);
                }
                else {
                    this.fn(deltaTime);
                }
            }
            var redirect = this.next;
            if (this.once) {
                this.destroy(true);
            }
            // Soft-destroying should remove
            // the next reference
            if (this._destroyed) {
                this.next = null;
            }
            return redirect;
        };
        /**
         * Connect to the list.
         * @private
         * @param {TickerListener} previous - Input node, previous listener
         */
        TickerListener.prototype.connect = function (previous) {
            this.previous = previous;
            if (previous.next) {
                previous.next.previous = this;
            }
            this.next = previous.next;
            previous.next = this;
        };
        /**
         * Destroy and don't use after this.
         * @private
         * @param {boolean} [hard = false] `true` to remove the `next` reference, this
         *        is considered a hard destroy. Soft destroy maintains the next reference.
         * @return {TickerListener} The listener to redirect while emitting or removing.
         */
        TickerListener.prototype.destroy = function (hard) {
            if (hard === void 0) { hard = false; }
            this._destroyed = true;
            this.fn = null;
            this.context = null;
            // Disconnect, hook up next and previous
            if (this.previous) {
                this.previous.next = this.next;
            }
            if (this.next) {
                this.next.previous = this.previous;
            }
            // Redirect to the next item
            var redirect = this.next;
            // Remove references
            this.next = hard ? null : redirect;
            this.previous = null;
            return redirect;
        };
        return TickerListener;
    }());

    /**
     * A Ticker class that runs an update loop that other objects listen to.
     *
     * This class is composed around listeners meant for execution on the next requested animation frame.
     * Animation frames are requested only when necessary, e.g. When the ticker is started and the emitter has listeners.
     *
     * @class
     * @memberof PIXI
     */
    var Ticker = /** @class */ (function () {
        function Ticker() {
            var _this = this;
            /**
             * The first listener. All new listeners added are chained on this.
             * @private
             * @type {TickerListener}
             */
            this._head = new TickerListener(null, null, Infinity);
            /**
             * Internal current frame request ID
             * @type {?number}
             * @private
             */
            this._requestId = null;
            /**
             * Internal value managed by minFPS property setter and getter.
             * This is the maximum allowed milliseconds between updates.
             * @type {number}
             * @private
             */
            this._maxElapsedMS = 100;
            /**
             * Internal value managed by maxFPS property setter and getter.
             * This is the minimum allowed milliseconds between updates.
             * @type {number}
             * @private
             */
            this._minElapsedMS = 0;
            /**
             * Whether or not this ticker should invoke the method
             * {@link PIXI.Ticker#start} automatically
             * when a listener is added.
             *
             * @member {boolean}
             * @default false
             */
            this.autoStart = false;
            /**
             * Scalar time value from last frame to this frame.
             * This value is capped by setting {@link PIXI.Ticker#minFPS}
             * and is scaled with {@link PIXI.Ticker#speed}.
             * **Note:** The cap may be exceeded by scaling.
             *
             * @member {number}
             * @default 1
             */
            this.deltaTime = 1;
            /**
             * Scaler time elapsed in milliseconds from last frame to this frame.
             * This value is capped by setting {@link PIXI.Ticker#minFPS}
             * and is scaled with {@link PIXI.Ticker#speed}.
             * **Note:** The cap may be exceeded by scaling.
             * If the platform supports DOMHighResTimeStamp,
             * this value will have a precision of 1 µs.
             * Defaults to target frame time
             *
             * @member {number}
             * @default 16.66
             */
            this.deltaMS = 1 / settings.TARGET_FPMS;
            /**
             * Time elapsed in milliseconds from last frame to this frame.
             * Opposed to what the scalar {@link PIXI.Ticker#deltaTime}
             * is based, this value is neither capped nor scaled.
             * If the platform supports DOMHighResTimeStamp,
             * this value will have a precision of 1 µs.
             * Defaults to target frame time
             *
             * @member {number}
             * @default 16.66
             */
            this.elapsedMS = 1 / settings.TARGET_FPMS;
            /**
             * The last time {@link PIXI.Ticker#update} was invoked.
             * This value is also reset internally outside of invoking
             * update, but only when a new animation frame is requested.
             * If the platform supports DOMHighResTimeStamp,
             * this value will have a precision of 1 µs.
             *
             * @member {number}
             * @default -1
             */
            this.lastTime = -1;
            /**
             * Factor of current {@link PIXI.Ticker#deltaTime}.
             * @example
             * // Scales ticker.deltaTime to what would be
             * // the equivalent of approximately 120 FPS
             * ticker.speed = 2;
             *
             * @member {number}
             * @default 1
             */
            this.speed = 1;
            /**
             * Whether or not this ticker has been started.
             * `true` if {@link PIXI.Ticker#start} has been called.
             * `false` if {@link PIXI.Ticker#stop} has been called.
             * While `false`, this value may change to `true` in the
             * event of {@link PIXI.Ticker#autoStart} being `true`
             * and a listener is added.
             *
             * @member {boolean}
             * @default false
             */
            this.started = false;
            /**
             * If enabled, deleting is disabled.
             * @member {boolean}
             * @default false
             * @private
             */
            this._protected = false;
            /**
             * The last time keyframe was executed.
             * Maintains a relatively fixed interval with the previous value.
             * @member {number}
             * @default -1
             * @private
             */
            this._lastFrame = -1;
            /**
             * Internal tick method bound to ticker instance.
             * This is because in early 2015, Function.bind
             * is still 60% slower in high performance scenarios.
             * Also separating frame requests from update method
             * so listeners may be called at any time and with
             * any animation API, just invoke ticker.update(time).
             *
             * @private
             * @param {number} time - Time since last tick.
             */
            this._tick = function (time) {
                _this._requestId = null;
                if (_this.started) {
                    // Invoke listeners now
                    _this.update(time);
                    // Listener side effects may have modified ticker state.
                    if (_this.started && _this._requestId === null && _this._head.next) {
                        _this._requestId = requestAnimationFrame(_this._tick);
                    }
                }
            };
        }
        /**
         * Conditionally requests a new animation frame.
         * If a frame has not already been requested, and if the internal
         * emitter has listeners, a new frame is requested.
         *
         * @private
         */
        Ticker.prototype._requestIfNeeded = function () {
            if (this._requestId === null && this._head.next) {
                // ensure callbacks get correct delta
                this.lastTime = performance.now();
                this._lastFrame = this.lastTime;
                this._requestId = requestAnimationFrame(this._tick);
            }
        };
        /**
         * Conditionally cancels a pending animation frame.
         *
         * @private
         */
        Ticker.prototype._cancelIfNeeded = function () {
            if (this._requestId !== null) {
                cancelAnimationFrame(this._requestId);
                this._requestId = null;
            }
        };
        /**
         * Conditionally requests a new animation frame.
         * If the ticker has been started it checks if a frame has not already
         * been requested, and if the internal emitter has listeners. If these
         * conditions are met, a new frame is requested. If the ticker has not
         * been started, but autoStart is `true`, then the ticker starts now,
         * and continues with the previous conditions to request a new frame.
         *
         * @private
         */
        Ticker.prototype._startIfPossible = function () {
            if (this.started) {
                this._requestIfNeeded();
            }
            else if (this.autoStart) {
                this.start();
            }
        };
        /**
         * Register a handler for tick events. Calls continuously unless
         * it is removed or the ticker is stopped.
         *
         * @param {Function} fn - The listener function to be added for updates
         * @param {*} [context] - The listener context
         * @param {number} [priority=PIXI.UPDATE_PRIORITY.NORMAL] - The priority for emitting
         * @returns {PIXI.Ticker} This instance of a ticker
         */
        Ticker.prototype.add = function (fn, context, priority) {
            if (priority === void 0) { priority = UPDATE_PRIORITY.NORMAL; }
            return this._addListener(new TickerListener(fn, context, priority));
        };
        /**
         * Add a handler for the tick event which is only execute once.
         *
         * @param {Function} fn - The listener function to be added for one update
         * @param {*} [context] - The listener context
         * @param {number} [priority=PIXI.UPDATE_PRIORITY.NORMAL] - The priority for emitting
         * @returns {PIXI.Ticker} This instance of a ticker
         */
        Ticker.prototype.addOnce = function (fn, context, priority) {
            if (priority === void 0) { priority = UPDATE_PRIORITY.NORMAL; }
            return this._addListener(new TickerListener(fn, context, priority, true));
        };
        /**
         * Internally adds the event handler so that it can be sorted by priority.
         * Priority allows certain handler (user, AnimatedSprite, Interaction) to be run
         * before the rendering.
         *
         * @private
         * @param {TickerListener} listener - Current listener being added.
         * @returns {PIXI.Ticker} This instance of a ticker
         */
        Ticker.prototype._addListener = function (listener) {
            // For attaching to head
            var current = this._head.next;
            var previous = this._head;
            // Add the first item
            if (!current) {
                listener.connect(previous);
            }
            else {
                // Go from highest to lowest priority
                while (current) {
                    if (listener.priority > current.priority) {
                        listener.connect(previous);
                        break;
                    }
                    previous = current;
                    current = current.next;
                }
                // Not yet connected
                if (!listener.previous) {
                    listener.connect(previous);
                }
            }
            this._startIfPossible();
            return this;
        };
        /**
         * Removes any handlers matching the function and context parameters.
         * If no handlers are left after removing, then it cancels the animation frame.
         *
         * @param {Function} fn - The listener function to be removed
         * @param {*} [context] - The listener context to be removed
         * @returns {PIXI.Ticker} This instance of a ticker
         */
        Ticker.prototype.remove = function (fn, context) {
            var listener = this._head.next;
            while (listener) {
                // We found a match, lets remove it
                // no break to delete all possible matches
                // incase a listener was added 2+ times
                if (listener.match(fn, context)) {
                    listener = listener.destroy();
                }
                else {
                    listener = listener.next;
                }
            }
            if (!this._head.next) {
                this._cancelIfNeeded();
            }
            return this;
        };
        Object.defineProperty(Ticker.prototype, "count", {
            /**
             * The number of listeners on this ticker, calculated by walking through linked list
             *
             * @readonly
             * @member {number}
             */
            get: function () {
                if (!this._head) {
                    return 0;
                }
                var count = 0;
                var current = this._head;
                while ((current = current.next)) {
                    count++;
                }
                return count;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Starts the ticker. If the ticker has listeners
         * a new animation frame is requested at this point.
         */
        Ticker.prototype.start = function () {
            if (!this.started) {
                this.started = true;
                this._requestIfNeeded();
            }
        };
        /**
         * Stops the ticker. If the ticker has requested
         * an animation frame it is canceled at this point.
         */
        Ticker.prototype.stop = function () {
            if (this.started) {
                this.started = false;
                this._cancelIfNeeded();
            }
        };
        /**
         * Destroy the ticker and don't use after this. Calling
         * this method removes all references to internal events.
         */
        Ticker.prototype.destroy = function () {
            if (!this._protected) {
                this.stop();
                var listener = this._head.next;
                while (listener) {
                    listener = listener.destroy(true);
                }
                this._head.destroy();
                this._head = null;
            }
        };
        /**
         * Triggers an update. An update entails setting the
         * current {@link PIXI.Ticker#elapsedMS},
         * the current {@link PIXI.Ticker#deltaTime},
         * invoking all listeners with current deltaTime,
         * and then finally setting {@link PIXI.Ticker#lastTime}
         * with the value of currentTime that was provided.
         * This method will be called automatically by animation
         * frame callbacks if the ticker instance has been started
         * and listeners are added.
         *
         * @param {number} [currentTime=performance.now()] - the current time of execution
         */
        Ticker.prototype.update = function (currentTime) {
            if (currentTime === void 0) { currentTime = performance.now(); }
            var elapsedMS;
            // If the difference in time is zero or negative, we ignore most of the work done here.
            // If there is no valid difference, then should be no reason to let anyone know about it.
            // A zero delta, is exactly that, nothing should update.
            //
            // The difference in time can be negative, and no this does not mean time traveling.
            // This can be the result of a race condition between when an animation frame is requested
            // on the current JavaScript engine event loop, and when the ticker's start method is invoked
            // (which invokes the internal _requestIfNeeded method). If a frame is requested before
            // _requestIfNeeded is invoked, then the callback for the animation frame the ticker requests,
            // can receive a time argument that can be less than the lastTime value that was set within
            // _requestIfNeeded. This difference is in microseconds, but this is enough to cause problems.
            //
            // This check covers this browser engine timing issue, as well as if consumers pass an invalid
            // currentTime value. This may happen if consumers opt-out of the autoStart, and update themselves.
            if (currentTime > this.lastTime) {
                // Save uncapped elapsedMS for measurement
                elapsedMS = this.elapsedMS = currentTime - this.lastTime;
                // cap the milliseconds elapsed used for deltaTime
                if (elapsedMS > this._maxElapsedMS) {
                    elapsedMS = this._maxElapsedMS;
                }
                elapsedMS *= this.speed;
                // If not enough time has passed, exit the function.
                // Get ready for next frame by setting _lastFrame, but based on _minElapsedMS
                // adjustment to ensure a relatively stable interval.
                if (this._minElapsedMS) {
                    var delta = currentTime - this._lastFrame | 0;
                    if (delta < this._minElapsedMS) {
                        return;
                    }
                    this._lastFrame = currentTime - (delta % this._minElapsedMS);
                }
                this.deltaMS = elapsedMS;
                this.deltaTime = this.deltaMS * settings.TARGET_FPMS;
                // Cache a local reference, in-case ticker is destroyed
                // during the emit, we can still check for head.next
                var head = this._head;
                // Invoke listeners added to internal emitter
                var listener = head.next;
                while (listener) {
                    listener = listener.emit(this.deltaTime);
                }
                if (!head.next) {
                    this._cancelIfNeeded();
                }
            }
            else {
                this.deltaTime = this.deltaMS = this.elapsedMS = 0;
            }
            this.lastTime = currentTime;
        };
        Object.defineProperty(Ticker.prototype, "FPS", {
            /**
             * The frames per second at which this ticker is running.
             * The default is approximately 60 in most modern browsers.
             * **Note:** This does not factor in the value of
             * {@link PIXI.Ticker#speed}, which is specific
             * to scaling {@link PIXI.Ticker#deltaTime}.
             *
             * @member {number}
             * @readonly
             */
            get: function () {
                return 1000 / this.elapsedMS;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Ticker.prototype, "minFPS", {
            /**
             * Manages the maximum amount of milliseconds allowed to
             * elapse between invoking {@link PIXI.Ticker#update}.
             * This value is used to cap {@link PIXI.Ticker#deltaTime},
             * but does not effect the measured value of {@link PIXI.Ticker#FPS}.
             * When setting this property it is clamped to a value between
             * `0` and `PIXI.settings.TARGET_FPMS * 1000`.
             *
             * @member {number}
             * @default 10
             */
            get: function () {
                return 1000 / this._maxElapsedMS;
            },
            set: function (fps) {
                // Minimum must be below the maxFPS
                var minFPS = Math.min(this.maxFPS, fps);
                // Must be at least 0, but below 1 / settings.TARGET_FPMS
                var minFPMS = Math.min(Math.max(0, minFPS) / 1000, settings.TARGET_FPMS);
                this._maxElapsedMS = 1 / minFPMS;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Ticker.prototype, "maxFPS", {
            /**
             * Manages the minimum amount of milliseconds required to
             * elapse between invoking {@link PIXI.Ticker#update}.
             * This will effect the measured value of {@link PIXI.Ticker#FPS}.
             * If it is set to `0`, then there is no limit; PixiJS will render as many frames as it can.
             * Otherwise it will be at least `minFPS`
             *
             * @member {number}
             * @default 0
             */
            get: function () {
                if (this._minElapsedMS) {
                    return Math.round(1000 / this._minElapsedMS);
                }
                return 0;
            },
            set: function (fps) {
                if (fps === 0) {
                    this._minElapsedMS = 0;
                }
                else {
                    // Max must be at least the minFPS
                    var maxFPS = Math.max(this.minFPS, fps);
                    this._minElapsedMS = 1 / (maxFPS / 1000);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Ticker, "shared", {
            /**
             * The shared ticker instance used by {@link PIXI.AnimatedSprite} and by
             * {@link PIXI.VideoResource} to update animation frames / video textures.
             *
             * It may also be used by {@link PIXI.Application} if created with the `sharedTicker` option property set to true.
             *
             * The property {@link PIXI.Ticker#autoStart} is set to `true` for this instance.
             * Please follow the examples for usage, including how to opt-out of auto-starting the shared ticker.
             *
             * @example
             * let ticker = PIXI.Ticker.shared;
             * // Set this to prevent starting this ticker when listeners are added.
             * // By default this is true only for the PIXI.Ticker.shared instance.
             * ticker.autoStart = false;
             * // FYI, call this to ensure the ticker is stopped. It should be stopped
             * // if you have not attempted to render anything yet.
             * ticker.stop();
             * // Call this when you are ready for a running shared ticker.
             * ticker.start();
             *
             * @example
             * // You may use the shared ticker to render...
             * let renderer = PIXI.autoDetectRenderer();
             * let stage = new PIXI.Container();
             * document.body.appendChild(renderer.view);
             * ticker.add(function (time) {
             *     renderer.render(stage);
             * });
             *
             * @example
             * // Or you can just update it manually.
             * ticker.autoStart = false;
             * ticker.stop();
             * function animate(time) {
             *     ticker.update(time);
             *     renderer.render(stage);
             *     requestAnimationFrame(animate);
             * }
             * animate(performance.now());
             *
             * @member {PIXI.Ticker}
             * @static
             */
            get: function () {
                if (!Ticker._shared) {
                    var shared = Ticker._shared = new Ticker();
                    shared.autoStart = true;
                    shared._protected = true;
                }
                return Ticker._shared;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Ticker, "system", {
            /**
             * The system ticker instance used by {@link PIXI.InteractionManager} and by
             * {@link PIXI.BasePrepare} for core timing functionality that shouldn't usually need to be paused,
             * unlike the `shared` ticker which drives visual animations and rendering which may want to be paused.
             *
             * The property {@link PIXI.Ticker#autoStart} is set to `true` for this instance.
             *
             * @member {PIXI.Ticker}
             * @static
             */
            get: function () {
                if (!Ticker._system) {
                    var system = Ticker._system = new Ticker();
                    system.autoStart = true;
                    system._protected = true;
                }
                return Ticker._system;
            },
            enumerable: false,
            configurable: true
        });
        return Ticker;
    }());

    /**
     * Middleware for for Application Ticker.
     *
     * @example
     * import {TickerPlugin} from '@pixi/ticker';
     * import {Application} from '@pixi/app';
     * Application.registerPlugin(TickerPlugin);
     *
     * @class
     * @memberof PIXI
     */
    var TickerPlugin = /** @class */ (function () {
        function TickerPlugin() {
        }
        /**
         * Initialize the plugin with scope of application instance
         *
         * @static
         * @private
         * @param {object} [options] - See application options
         */
        TickerPlugin.init = function (options) {
            var _this = this;
            // Set default
            options = Object.assign({
                autoStart: true,
                sharedTicker: false,
            }, options);
            // Create ticker setter
            Object.defineProperty(this, 'ticker', {
                set: function (ticker) {
                    if (this._ticker) {
                        this._ticker.remove(this.render, this);
                    }
                    this._ticker = ticker;
                    if (ticker) {
                        ticker.add(this.render, this, UPDATE_PRIORITY.LOW);
                    }
                },
                get: function () {
                    return this._ticker;
                },
            });
            /**
             * Convenience method for stopping the render.
             *
             * @method PIXI.Application#stop
             */
            this.stop = function () {
                _this._ticker.stop();
            };
            /**
             * Convenience method for starting the render.
             *
             * @method PIXI.Application#start
             */
            this.start = function () {
                _this._ticker.start();
            };
            /**
             * Internal reference to the ticker.
             *
             * @type {PIXI.Ticker}
             * @name _ticker
             * @memberof PIXI.Application#
             * @private
             */
            this._ticker = null;
            /**
             * Ticker for doing render updates.
             *
             * @type {PIXI.Ticker}
             * @name ticker
             * @memberof PIXI.Application#
             * @default PIXI.Ticker.shared
             */
            this.ticker = options.sharedTicker ? Ticker.shared : new Ticker();
            // Start the rendering
            if (options.autoStart) {
                this.start();
            }
        };
        /**
         * Clean up the ticker, scoped to application.
         *
         * @static
         * @private
         */
        TickerPlugin.destroy = function () {
            if (this._ticker) {
                var oldTicker = this._ticker;
                this.ticker = null;
                oldTicker.destroy();
            }
        };
        return TickerPlugin;
    }());

    /*!
     * @pixi/math - v5.3.1
     * Compiled Fri, 24 Jul 2020 20:56:48 UTC
     *
     * @pixi/math is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */
    /**
     * Two Pi.
     *
     * @static
     * @constant {number} PI_2
     * @memberof PIXI
     */
    var PI_2 = Math.PI * 2;
    /**
     * Conversion factor for converting radians to degrees.
     *
     * @static
     * @constant {number} RAD_TO_DEG
     * @memberof PIXI
     */
    var RAD_TO_DEG = 180 / Math.PI;
    /**
     * Conversion factor for converting degrees to radians.
     *
     * @static
     * @constant {number} DEG_TO_RAD
     * @memberof PIXI
     */
    var DEG_TO_RAD = Math.PI / 180;
    var SHAPES;
    (function (SHAPES) {
        SHAPES[SHAPES["POLY"] = 0] = "POLY";
        SHAPES[SHAPES["RECT"] = 1] = "RECT";
        SHAPES[SHAPES["CIRC"] = 2] = "CIRC";
        SHAPES[SHAPES["ELIP"] = 3] = "ELIP";
        SHAPES[SHAPES["RREC"] = 4] = "RREC";
    })(SHAPES || (SHAPES = {}));
    /**
     * Constants that identify shapes, mainly to prevent `instanceof` calls.
     *
     * @static
     * @constant
     * @name SHAPES
     * @memberof PIXI
     * @type {enum}
     * @property {number} POLY Polygon
     * @property {number} RECT Rectangle
     * @property {number} CIRC Circle
     * @property {number} ELIP Ellipse
     * @property {number} RREC Rounded Rectangle
     * @enum {number}
     */

    /**
     * Size object, contains width and height
     *
     * @memberof PIXI
     * @typedef {object} ISize
     * @property {number} width - Width component
     * @property {number} height - Height component
     */
    /**
     * Rectangle object is an area defined by its position, as indicated by its top-left corner
     * point (x, y) and by its width and its height.
     *
     * @class
     * @memberof PIXI
     */
    var Rectangle = /** @class */ (function () {
        /**
         * @param {number} [x=0] - The X coordinate of the upper-left corner of the rectangle
         * @param {number} [y=0] - The Y coordinate of the upper-left corner of the rectangle
         * @param {number} [width=0] - The overall width of this rectangle
         * @param {number} [height=0] - The overall height of this rectangle
         */
        function Rectangle(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            /**
             * @member {number}
             * @default 0
             */
            this.x = Number(x);
            /**
             * @member {number}
             * @default 0
             */
            this.y = Number(y);
            /**
             * @member {number}
             * @default 0
             */
            this.width = Number(width);
            /**
             * @member {number}
             * @default 0
             */
            this.height = Number(height);
            /**
             * The type of the object, mainly used to avoid `instanceof` checks
             *
             * @member {number}
             * @readOnly
             * @default PIXI.SHAPES.RECT
             * @see PIXI.SHAPES
             */
            this.type = SHAPES.RECT;
        }
        Object.defineProperty(Rectangle.prototype, "left", {
            /**
             * returns the left edge of the rectangle
             *
             * @member {number}
             */
            get: function () {
                return this.x;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "right", {
            /**
             * returns the right edge of the rectangle
             *
             * @member {number}
             */
            get: function () {
                return this.x + this.width;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "top", {
            /**
             * returns the top edge of the rectangle
             *
             * @member {number}
             */
            get: function () {
                return this.y;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "bottom", {
            /**
             * returns the bottom edge of the rectangle
             *
             * @member {number}
             */
            get: function () {
                return this.y + this.height;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Rectangle, "EMPTY", {
            /**
             * A constant empty rectangle.
             *
             * @static
             * @constant
             * @member {PIXI.Rectangle}
             * @return {PIXI.Rectangle} An empty rectangle
             */
            get: function () {
                return new Rectangle(0, 0, 0, 0);
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Creates a clone of this Rectangle
         *
         * @return {PIXI.Rectangle} a copy of the rectangle
         */
        Rectangle.prototype.clone = function () {
            return new Rectangle(this.x, this.y, this.width, this.height);
        };
        /**
         * Copies another rectangle to this one.
         *
         * @param {PIXI.Rectangle} rectangle - The rectangle to copy from.
         * @return {PIXI.Rectangle} Returns itself.
         */
        Rectangle.prototype.copyFrom = function (rectangle) {
            this.x = rectangle.x;
            this.y = rectangle.y;
            this.width = rectangle.width;
            this.height = rectangle.height;
            return this;
        };
        /**
         * Copies this rectangle to another one.
         *
         * @param {PIXI.Rectangle} rectangle - The rectangle to copy to.
         * @return {PIXI.Rectangle} Returns given parameter.
         */
        Rectangle.prototype.copyTo = function (rectangle) {
            rectangle.x = this.x;
            rectangle.y = this.y;
            rectangle.width = this.width;
            rectangle.height = this.height;
            return rectangle;
        };
        /**
         * Checks whether the x and y coordinates given are contained within this Rectangle
         *
         * @param {number} x - The X coordinate of the point to test
         * @param {number} y - The Y coordinate of the point to test
         * @return {boolean} Whether the x/y coordinates are within this Rectangle
         */
        Rectangle.prototype.contains = function (x, y) {
            if (this.width <= 0 || this.height <= 0) {
                return false;
            }
            if (x >= this.x && x < this.x + this.width) {
                if (y >= this.y && y < this.y + this.height) {
                    return true;
                }
            }
            return false;
        };
        /**
         * Pads the rectangle making it grow in all directions.
         * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
         *
         * @param {number} [paddingX=0] - The horizontal padding amount.
         * @param {number} [paddingY=0] - The vertical padding amount.
         * @return {PIXI.Rectangle} Returns itself.
         */
        Rectangle.prototype.pad = function (paddingX, paddingY) {
            if (paddingX === void 0) { paddingX = 0; }
            if (paddingY === void 0) { paddingY = paddingX; }
            this.x -= paddingX;
            this.y -= paddingY;
            this.width += paddingX * 2;
            this.height += paddingY * 2;
            return this;
        };
        /**
         * Fits this rectangle around the passed one.
         *
         * @param {PIXI.Rectangle} rectangle - The rectangle to fit.
         * @return {PIXI.Rectangle} Returns itself.
         */
        Rectangle.prototype.fit = function (rectangle) {
            var x1 = Math.max(this.x, rectangle.x);
            var x2 = Math.min(this.x + this.width, rectangle.x + rectangle.width);
            var y1 = Math.max(this.y, rectangle.y);
            var y2 = Math.min(this.y + this.height, rectangle.y + rectangle.height);
            this.x = x1;
            this.width = Math.max(x2 - x1, 0);
            this.y = y1;
            this.height = Math.max(y2 - y1, 0);
            return this;
        };
        /**
         * Enlarges rectangle that way its corners lie on grid
         *
         * @param {number} [resolution=1] resolution
         * @param {number} [eps=0.001] precision
         * @return {PIXI.Rectangle} Returns itself.
         */
        Rectangle.prototype.ceil = function (resolution, eps) {
            if (resolution === void 0) { resolution = 1; }
            if (eps === void 0) { eps = 0.001; }
            var x2 = Math.ceil((this.x + this.width - eps) * resolution) / resolution;
            var y2 = Math.ceil((this.y + this.height - eps) * resolution) / resolution;
            this.x = Math.floor((this.x + eps) * resolution) / resolution;
            this.y = Math.floor((this.y + eps) * resolution) / resolution;
            this.width = x2 - this.x;
            this.height = y2 - this.y;
            return this;
        };
        /**
         * Enlarges this rectangle to include the passed rectangle.
         *
         * @param {PIXI.Rectangle} rectangle - The rectangle to include.
         * @return {PIXI.Rectangle} Returns itself.
         */
        Rectangle.prototype.enlarge = function (rectangle) {
            var x1 = Math.min(this.x, rectangle.x);
            var x2 = Math.max(this.x + this.width, rectangle.x + rectangle.width);
            var y1 = Math.min(this.y, rectangle.y);
            var y2 = Math.max(this.y + this.height, rectangle.y + rectangle.height);
            this.x = x1;
            this.width = x2 - x1;
            this.y = y1;
            this.height = y2 - y1;
            return this;
        };
        return Rectangle;
    }());

    /**
     * The Circle object is used to help draw graphics and can also be used to specify a hit area for displayObjects.
     *
     * @class
     * @memberof PIXI
     */
    var Circle = /** @class */ (function () {
        /**
         * @param {number} [x=0] - The X coordinate of the center of this circle
         * @param {number} [y=0] - The Y coordinate of the center of this circle
         * @param {number} [radius=0] - The radius of the circle
         */
        function Circle(x, y, radius) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (radius === void 0) { radius = 0; }
            /**
             * @member {number}
             * @default 0
             */
            this.x = x;
            /**
             * @member {number}
             * @default 0
             */
            this.y = y;
            /**
             * @member {number}
             * @default 0
             */
            this.radius = radius;
            /**
             * The type of the object, mainly used to avoid `instanceof` checks
             *
             * @member {number}
             * @readOnly
             * @default PIXI.SHAPES.CIRC
             * @see PIXI.SHAPES
             */
            this.type = SHAPES.CIRC;
        }
        /**
         * Creates a clone of this Circle instance
         *
         * @return {PIXI.Circle} a copy of the Circle
         */
        Circle.prototype.clone = function () {
            return new Circle(this.x, this.y, this.radius);
        };
        /**
         * Checks whether the x and y coordinates given are contained within this circle
         *
         * @param {number} x - The X coordinate of the point to test
         * @param {number} y - The Y coordinate of the point to test
         * @return {boolean} Whether the x/y coordinates are within this Circle
         */
        Circle.prototype.contains = function (x, y) {
            if (this.radius <= 0) {
                return false;
            }
            var r2 = this.radius * this.radius;
            var dx = (this.x - x);
            var dy = (this.y - y);
            dx *= dx;
            dy *= dy;
            return (dx + dy <= r2);
        };
        /**
        * Returns the framing rectangle of the circle as a Rectangle object
        *
        * @return {PIXI.Rectangle} the framing rectangle
        */
        Circle.prototype.getBounds = function () {
            return new Rectangle(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        };
        return Circle;
    }());

    /**
     * The Ellipse object is used to help draw graphics and can also be used to specify a hit area for displayObjects.
     *
     * @class
     * @memberof PIXI
     */
    var Ellipse = /** @class */ (function () {
        /**
         * @param {number} [x=0] - The X coordinate of the center of this ellipse
         * @param {number} [y=0] - The Y coordinate of the center of this ellipse
         * @param {number} [halfWidth=0] - The half width of this ellipse
         * @param {number} [halfHeight=0] - The half height of this ellipse
         */
        function Ellipse(x, y, halfWidth, halfHeight) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (halfWidth === void 0) { halfWidth = 0; }
            if (halfHeight === void 0) { halfHeight = 0; }
            /**
             * @member {number}
             * @default 0
             */
            this.x = x;
            /**
             * @member {number}
             * @default 0
             */
            this.y = y;
            /**
             * @member {number}
             * @default 0
             */
            this.width = halfWidth;
            /**
             * @member {number}
             * @default 0
             */
            this.height = halfHeight;
            /**
             * The type of the object, mainly used to avoid `instanceof` checks
             *
             * @member {number}
             * @readOnly
             * @default PIXI.SHAPES.ELIP
             * @see PIXI.SHAPES
             */
            this.type = SHAPES.ELIP;
        }
        /**
         * Creates a clone of this Ellipse instance
         *
         * @return {PIXI.Ellipse} a copy of the ellipse
         */
        Ellipse.prototype.clone = function () {
            return new Ellipse(this.x, this.y, this.width, this.height);
        };
        /**
         * Checks whether the x and y coordinates given are contained within this ellipse
         *
         * @param {number} x - The X coordinate of the point to test
         * @param {number} y - The Y coordinate of the point to test
         * @return {boolean} Whether the x/y coords are within this ellipse
         */
        Ellipse.prototype.contains = function (x, y) {
            if (this.width <= 0 || this.height <= 0) {
                return false;
            }
            // normalize the coords to an ellipse with center 0,0
            var normx = ((x - this.x) / this.width);
            var normy = ((y - this.y) / this.height);
            normx *= normx;
            normy *= normy;
            return (normx + normy <= 1);
        };
        /**
         * Returns the framing rectangle of the ellipse as a Rectangle object
         *
         * @return {PIXI.Rectangle} the framing rectangle
         */
        Ellipse.prototype.getBounds = function () {
            return new Rectangle(this.x - this.width, this.y - this.height, this.width, this.height);
        };
        return Ellipse;
    }());

    /**
     * A class to define a shape via user defined co-orinates.
     *
     * @class
     * @memberof PIXI
     */
    var Polygon = /** @class */ (function () {
        /**
         * @param {PIXI.IPoint[]|number[]} points - This can be an array of Points
         *  that form the polygon, a flat array of numbers that will be interpreted as [x,y, x,y, ...], or
         *  the arguments passed can be all the points of the polygon e.g.
         *  `new PIXI.Polygon(new PIXI.Point(), new PIXI.Point(), ...)`, or the arguments passed can be flat
         *  x,y values e.g. `new Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are Numbers.
         */
        function Polygon() {
            var arguments$1 = arguments;

            var points = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                points[_i] = arguments$1[_i];
            }
            var flat = Array.isArray(points[0]) ? points[0] : points;
            // if this is an array of points, convert it to a flat array of numbers
            if (typeof flat[0] !== 'number') {
                var p = [];
                for (var i = 0, il = flat.length; i < il; i++) {
                    p.push(flat[i].x, flat[i].y);
                }
                flat = p;
            }
            /**
             * An array of the points of this polygon
             *
             * @member {number[]}
             */
            this.points = flat;
            /**
             * The type of the object, mainly used to avoid `instanceof` checks
             *
             * @member {number}
             * @readOnly
             * @default PIXI.SHAPES.POLY
             * @see PIXI.SHAPES
             */
            this.type = SHAPES.POLY;
            /**
             * `false` after moveTo, `true` after `closePath`. In all other cases it is `true`.
             * @member {boolean}
             * @default true
             */
            this.closeStroke = true;
        }
        /**
         * Creates a clone of this polygon
         *
         * @return {PIXI.Polygon} a copy of the polygon
         */
        Polygon.prototype.clone = function () {
            var points = this.points.slice();
            var polygon = new Polygon(points);
            polygon.closeStroke = this.closeStroke;
            return polygon;
        };
        /**
         * Checks whether the x and y coordinates passed to this function are contained within this polygon
         *
         * @param {number} x - The X coordinate of the point to test
         * @param {number} y - The Y coordinate of the point to test
         * @return {boolean} Whether the x/y coordinates are within this polygon
         */
        Polygon.prototype.contains = function (x, y) {
            var inside = false;
            // use some raycasting to test hits
            // https://github.com/substack/point-in-polygon/blob/master/index.js
            var length = this.points.length / 2;
            for (var i = 0, j = length - 1; i < length; j = i++) {
                var xi = this.points[i * 2];
                var yi = this.points[(i * 2) + 1];
                var xj = this.points[j * 2];
                var yj = this.points[(j * 2) + 1];
                var intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * ((y - yi) / (yj - yi))) + xi);
                if (intersect) {
                    inside = !inside;
                }
            }
            return inside;
        };
        return Polygon;
    }());

    /**
     * The Rounded Rectangle object is an area that has nice rounded corners, as indicated by its
     * top-left corner point (x, y) and by its width and its height and its radius.
     *
     * @class
     * @memberof PIXI
     */
    var RoundedRectangle = /** @class */ (function () {
        /**
         * @param {number} [x=0] - The X coordinate of the upper-left corner of the rounded rectangle
         * @param {number} [y=0] - The Y coordinate of the upper-left corner of the rounded rectangle
         * @param {number} [width=0] - The overall width of this rounded rectangle
         * @param {number} [height=0] - The overall height of this rounded rectangle
         * @param {number} [radius=20] - Controls the radius of the rounded corners
         */
        function RoundedRectangle(x, y, width, height, radius) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            if (radius === void 0) { radius = 20; }
            /**
             * @member {number}
             * @default 0
             */
            this.x = x;
            /**
             * @member {number}
             * @default 0
             */
            this.y = y;
            /**
             * @member {number}
             * @default 0
             */
            this.width = width;
            /**
             * @member {number}
             * @default 0
             */
            this.height = height;
            /**
             * @member {number}
             * @default 20
             */
            this.radius = radius;
            /**
             * The type of the object, mainly used to avoid `instanceof` checks
             *
             * @member {number}
             * @readonly
             * @default PIXI.SHAPES.RREC
             * @see PIXI.SHAPES
             */
            this.type = SHAPES.RREC;
        }
        /**
         * Creates a clone of this Rounded Rectangle
         *
         * @return {PIXI.RoundedRectangle} a copy of the rounded rectangle
         */
        RoundedRectangle.prototype.clone = function () {
            return new RoundedRectangle(this.x, this.y, this.width, this.height, this.radius);
        };
        /**
         * Checks whether the x and y coordinates given are contained within this Rounded Rectangle
         *
         * @param {number} x - The X coordinate of the point to test
         * @param {number} y - The Y coordinate of the point to test
         * @return {boolean} Whether the x/y coordinates are within this Rounded Rectangle
         */
        RoundedRectangle.prototype.contains = function (x, y) {
            if (this.width <= 0 || this.height <= 0) {
                return false;
            }
            if (x >= this.x && x <= this.x + this.width) {
                if (y >= this.y && y <= this.y + this.height) {
                    if ((y >= this.y + this.radius && y <= this.y + this.height - this.radius)
                        || (x >= this.x + this.radius && x <= this.x + this.width - this.radius)) {
                        return true;
                    }
                    var dx = x - (this.x + this.radius);
                    var dy = y - (this.y + this.radius);
                    var radius2 = this.radius * this.radius;
                    if ((dx * dx) + (dy * dy) <= radius2) {
                        return true;
                    }
                    dx = x - (this.x + this.width - this.radius);
                    if ((dx * dx) + (dy * dy) <= radius2) {
                        return true;
                    }
                    dy = y - (this.y + this.height - this.radius);
                    if ((dx * dx) + (dy * dy) <= radius2) {
                        return true;
                    }
                    dx = x - (this.x + this.radius);
                    if ((dx * dx) + (dy * dy) <= radius2) {
                        return true;
                    }
                }
            }
            return false;
        };
        return RoundedRectangle;
    }());

    /**
     * Common interface for points. Both Point and ObservablePoint implement it
     * @memberof PIXI
     * @interface IPointData
     */
    /**
     * X coord
     * @memberof PIXI.IPointData#
     * @member {number} x
     */
    /**
     * Y coord
     * @memberof PIXI.IPointData#
     * @member {number} y
     */

    /**
     * Common interface for points. Both Point and ObservablePoint implement it
     * @memberof PIXI
     * @interface IPoint
     * @extends PIXI.IPointData
     */
    /**
     * Sets the point to a new x and y position.
     * If y is omitted, both x and y will be set to x.
     *
     * @method set
     * @memberof PIXI.IPoint#
     * @param {number} [x=0] - position of the point on the x axis
     * @param {number} [y=x] - position of the point on the y axis
     */
    /**
     * Copies x and y from the given point
     * @method copyFrom
     * @memberof PIXI.IPoint#
     * @param {PIXI.IPointData} p - The point to copy from
     * @returns {this} Returns itself.
     */
    /**
     * Copies x and y into the given point
     * @method copyTo
     * @memberof PIXI.IPoint#
     * @param {PIXI.IPoint} p - The point to copy.
     * @returns {PIXI.IPoint} Given point with values updated
     */
    /**
     * Returns true if the given point is equal to this point
     *
     * @method equals
     * @memberof PIXI.IPoint#
     * @param {PIXI.IPointData} p - The point to check
     * @returns {boolean} Whether the given point equal to this point
     */

    /**
     * The Point object represents a location in a two-dimensional coordinate system, where x represents
     * the horizontal axis and y represents the vertical axis.
     *
     * @class
     * @memberof PIXI
     * @implements IPoint
     */
    var Point = /** @class */ (function () {
        /**
         * @param {number} [x=0] - position of the point on the x axis
         * @param {number} [y=0] - position of the point on the y axis
         */
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            /**
             * @member {number}
             * @default 0
             */
            this.x = x;
            /**
             * @member {number}
             * @default 0
             */
            this.y = y;
        }
        /**
         * Creates a clone of this point
         *
         * @return {PIXI.Point} a copy of the point
         */
        Point.prototype.clone = function () {
            return new Point(this.x, this.y);
        };
        /**
         * Copies x and y from the given point
         *
         * @param {PIXI.IPointData} p - The point to copy from
         * @returns {this} Returns itself.
         */
        Point.prototype.copyFrom = function (p) {
            this.set(p.x, p.y);
            return this;
        };
        /**
         * Copies x and y into the given point
         *
         * @param {PIXI.IPoint} p - The point to copy.
         * @returns {PIXI.IPoint} Given point with values updated
         */
        Point.prototype.copyTo = function (p) {
            p.set(this.x, this.y);
            return p;
        };
        /**
         * Returns true if the given point is equal to this point
         *
         * @param {PIXI.IPointData} p - The point to check
         * @returns {boolean} Whether the given point equal to this point
         */
        Point.prototype.equals = function (p) {
            return (p.x === this.x) && (p.y === this.y);
        };
        /**
         * Sets the point to a new x and y position.
         * If y is omitted, both x and y will be set to x.
         *
         * @param {number} [x=0] - position of the point on the x axis
         * @param {number} [y=x] - position of the point on the y axis
         * @returns {this} Returns itself.
         */
        Point.prototype.set = function (x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = x; }
            this.x = x;
            this.y = y;
            return this;
        };
        return Point;
    }());

    /**
     * The Point object represents a location in a two-dimensional coordinate system, where x represents
     * the horizontal axis and y represents the vertical axis.
     *
     * An ObservablePoint is a point that triggers a callback when the point's position is changed.
     *
     * @class
     * @memberof PIXI
     * @implements IPoint
     */
    var ObservablePoint = /** @class */ (function () {
        /**
         * @param {Function} cb - callback when changed
         * @param {object} scope - owner of callback
         * @param {number} [x=0] - position of the point on the x axis
         * @param {number} [y=0] - position of the point on the y axis
         */
        function ObservablePoint(cb, scope, x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this._x = x;
            this._y = y;
            this.cb = cb;
            this.scope = scope;
        }
        /**
         * Creates a clone of this point.
         * The callback and scope params can be overidden otherwise they will default
         * to the clone object's values.
         *
         * @override
         * @param {Function} [cb=null] - callback when changed
         * @param {object} [scope=null] - owner of callback
         * @return {PIXI.ObservablePoint} a copy of the point
         */
        ObservablePoint.prototype.clone = function (cb, scope) {
            if (cb === void 0) { cb = this.cb; }
            if (scope === void 0) { scope = this.scope; }
            return new ObservablePoint(cb, scope, this._x, this._y);
        };
        /**
         * Sets the point to a new x and y position.
         * If y is omitted, both x and y will be set to x.
         *
         * @param {number} [x=0] - position of the point on the x axis
         * @param {number} [y=x] - position of the point on the y axis
         * @returns {this} Returns itself.
         */
        ObservablePoint.prototype.set = function (x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = x; }
            if (this._x !== x || this._y !== y) {
                this._x = x;
                this._y = y;
                this.cb.call(this.scope);
            }
            return this;
        };
        /**
         * Copies x and y from the given point
         *
         * @param {PIXI.IPointData} p - The point to copy from.
         * @returns {this} Returns itself.
         */
        ObservablePoint.prototype.copyFrom = function (p) {
            if (this._x !== p.x || this._y !== p.y) {
                this._x = p.x;
                this._y = p.y;
                this.cb.call(this.scope);
            }
            return this;
        };
        /**
         * Copies x and y into the given point
         *
         * @param {PIXI.IPoint} p - The point to copy.
         * @returns {PIXI.IPoint} Given point with values updated
         */
        ObservablePoint.prototype.copyTo = function (p) {
            p.set(this._x, this._y);
            return p;
        };
        /**
         * Returns true if the given point is equal to this point
         *
         * @param {PIXI.IPointData} p - The point to check
         * @returns {boolean} Whether the given point equal to this point
         */
        ObservablePoint.prototype.equals = function (p) {
            return (p.x === this._x) && (p.y === this._y);
        };
        Object.defineProperty(ObservablePoint.prototype, "x", {
            /**
             * The position of the displayObject on the x axis relative to the local coordinates of the parent.
             *
             * @member {number}
             */
            get: function () {
                return this._x;
            },
            set: function (value) {
                if (this._x !== value) {
                    this._x = value;
                    this.cb.call(this.scope);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ObservablePoint.prototype, "y", {
            /**
             * The position of the displayObject on the x axis relative to the local coordinates of the parent.
             *
             * @member {number}
             */
            get: function () {
                return this._y;
            },
            set: function (value) {
                if (this._y !== value) {
                    this._y = value;
                    this.cb.call(this.scope);
                }
            },
            enumerable: false,
            configurable: true
        });
        return ObservablePoint;
    }());

    /**
     * The PixiJS Matrix as a class makes it a lot faster.
     *
     * Here is a representation of it:
     * ```js
     * | a | c | tx|
     * | b | d | ty|
     * | 0 | 0 | 1 |
     * ```
     * @class
     * @memberof PIXI
     */
    var Matrix = /** @class */ (function () {
        /**
         * @param {number} [a=1] - x scale
         * @param {number} [b=0] - x skew
         * @param {number} [c=0] - y skew
         * @param {number} [d=1] - y scale
         * @param {number} [tx=0] - x translation
         * @param {number} [ty=0] - y translation
         */
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.array = null;
            /**
             * @member {number}
             * @default 1
             */
            this.a = a;
            /**
             * @member {number}
             * @default 0
             */
            this.b = b;
            /**
             * @member {number}
             * @default 0
             */
            this.c = c;
            /**
             * @member {number}
             * @default 1
             */
            this.d = d;
            /**
             * @member {number}
             * @default 0
             */
            this.tx = tx;
            /**
             * @member {number}
             * @default 0
             */
            this.ty = ty;
        }
        /**
         * Creates a Matrix object based on the given array. The Element to Matrix mapping order is as follows:
         *
         * a = array[0]
         * b = array[1]
         * c = array[3]
         * d = array[4]
         * tx = array[2]
         * ty = array[5]
         *
         * @param {number[]} array - The array that the matrix will be populated from.
         */
        Matrix.prototype.fromArray = function (array) {
            this.a = array[0];
            this.b = array[1];
            this.c = array[3];
            this.d = array[4];
            this.tx = array[2];
            this.ty = array[5];
        };
        /**
         * sets the matrix properties
         *
         * @param {number} a - Matrix component
         * @param {number} b - Matrix component
         * @param {number} c - Matrix component
         * @param {number} d - Matrix component
         * @param {number} tx - Matrix component
         * @param {number} ty - Matrix component
         *
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */
        Matrix.prototype.set = function (a, b, c, d, tx, ty) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
            return this;
        };
        /**
         * Creates an array from the current Matrix object.
         *
         * @param {boolean} transpose - Whether we need to transpose the matrix or not
         * @param {Float32Array} [out=new Float32Array(9)] - If provided the array will be assigned to out
         * @return {number[]} the newly created array which contains the matrix
         */
        Matrix.prototype.toArray = function (transpose, out) {
            if (!this.array) {
                this.array = new Float32Array(9);
            }
            var array = out || this.array;
            if (transpose) {
                array[0] = this.a;
                array[1] = this.b;
                array[2] = 0;
                array[3] = this.c;
                array[4] = this.d;
                array[5] = 0;
                array[6] = this.tx;
                array[7] = this.ty;
                array[8] = 1;
            }
            else {
                array[0] = this.a;
                array[1] = this.c;
                array[2] = this.tx;
                array[3] = this.b;
                array[4] = this.d;
                array[5] = this.ty;
                array[6] = 0;
                array[7] = 0;
                array[8] = 1;
            }
            return array;
        };
        /**
         * Get a new position with the current transformation applied.
         * Can be used to go from a child's coordinate space to the world coordinate space. (e.g. rendering)
         *
         * @param {PIXI.IPointData} pos - The origin
         * @param {PIXI.Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
         * @return {PIXI.Point} The new point, transformed through this matrix
         */
        Matrix.prototype.apply = function (pos, newPos) {
            newPos = (newPos || new Point());
            var x = pos.x;
            var y = pos.y;
            newPos.x = (this.a * x) + (this.c * y) + this.tx;
            newPos.y = (this.b * x) + (this.d * y) + this.ty;
            return newPos;
        };
        /**
         * Get a new position with the inverse of the current transformation applied.
         * Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)
         *
         * @param {PIXI.IPointData} pos - The origin
         * @param {PIXI.Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
         * @return {PIXI.Point} The new point, inverse-transformed through this matrix
         */
        Matrix.prototype.applyInverse = function (pos, newPos) {
            newPos = (newPos || new Point());
            var id = 1 / ((this.a * this.d) + (this.c * -this.b));
            var x = pos.x;
            var y = pos.y;
            newPos.x = (this.d * id * x) + (-this.c * id * y) + (((this.ty * this.c) - (this.tx * this.d)) * id);
            newPos.y = (this.a * id * y) + (-this.b * id * x) + (((-this.ty * this.a) + (this.tx * this.b)) * id);
            return newPos;
        };
        /**
         * Translates the matrix on the x and y.
         *
         * @param {number} x - How much to translate x by
         * @param {number} y - How much to translate y by
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */
        Matrix.prototype.translate = function (x, y) {
            this.tx += x;
            this.ty += y;
            return this;
        };
        /**
         * Applies a scale transformation to the matrix.
         *
         * @param {number} x - The amount to scale horizontally
         * @param {number} y - The amount to scale vertically
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */
        Matrix.prototype.scale = function (x, y) {
            this.a *= x;
            this.d *= y;
            this.c *= x;
            this.b *= y;
            this.tx *= x;
            this.ty *= y;
            return this;
        };
        /**
         * Applies a rotation transformation to the matrix.
         *
         * @param {number} angle - The angle in radians.
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */
        Matrix.prototype.rotate = function (angle) {
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);
            var a1 = this.a;
            var c1 = this.c;
            var tx1 = this.tx;
            this.a = (a1 * cos) - (this.b * sin);
            this.b = (a1 * sin) + (this.b * cos);
            this.c = (c1 * cos) - (this.d * sin);
            this.d = (c1 * sin) + (this.d * cos);
            this.tx = (tx1 * cos) - (this.ty * sin);
            this.ty = (tx1 * sin) + (this.ty * cos);
            return this;
        };
        /**
         * Appends the given Matrix to this Matrix.
         *
         * @param {PIXI.Matrix} matrix - The matrix to append.
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */
        Matrix.prototype.append = function (matrix) {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;
            this.a = (matrix.a * a1) + (matrix.b * c1);
            this.b = (matrix.a * b1) + (matrix.b * d1);
            this.c = (matrix.c * a1) + (matrix.d * c1);
            this.d = (matrix.c * b1) + (matrix.d * d1);
            this.tx = (matrix.tx * a1) + (matrix.ty * c1) + this.tx;
            this.ty = (matrix.tx * b1) + (matrix.ty * d1) + this.ty;
            return this;
        };
        /**
         * Sets the matrix based on all the available properties
         *
         * @param {number} x - Position on the x axis
         * @param {number} y - Position on the y axis
         * @param {number} pivotX - Pivot on the x axis
         * @param {number} pivotY - Pivot on the y axis
         * @param {number} scaleX - Scale on the x axis
         * @param {number} scaleY - Scale on the y axis
         * @param {number} rotation - Rotation in radians
         * @param {number} skewX - Skew on the x axis
         * @param {number} skewY - Skew on the y axis
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */
        Matrix.prototype.setTransform = function (x, y, pivotX, pivotY, scaleX, scaleY, rotation, skewX, skewY) {
            this.a = Math.cos(rotation + skewY) * scaleX;
            this.b = Math.sin(rotation + skewY) * scaleX;
            this.c = -Math.sin(rotation - skewX) * scaleY;
            this.d = Math.cos(rotation - skewX) * scaleY;
            this.tx = x - ((pivotX * this.a) + (pivotY * this.c));
            this.ty = y - ((pivotX * this.b) + (pivotY * this.d));
            return this;
        };
        /**
         * Prepends the given Matrix to this Matrix.
         *
         * @param {PIXI.Matrix} matrix - The matrix to prepend
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */
        Matrix.prototype.prepend = function (matrix) {
            var tx1 = this.tx;
            if (matrix.a !== 1 || matrix.b !== 0 || matrix.c !== 0 || matrix.d !== 1) {
                var a1 = this.a;
                var c1 = this.c;
                this.a = (a1 * matrix.a) + (this.b * matrix.c);
                this.b = (a1 * matrix.b) + (this.b * matrix.d);
                this.c = (c1 * matrix.a) + (this.d * matrix.c);
                this.d = (c1 * matrix.b) + (this.d * matrix.d);
            }
            this.tx = (tx1 * matrix.a) + (this.ty * matrix.c) + matrix.tx;
            this.ty = (tx1 * matrix.b) + (this.ty * matrix.d) + matrix.ty;
            return this;
        };
        /**
         * Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.
         *
         * @param {PIXI.Transform} transform - The transform to apply the properties to.
         * @return {PIXI.Transform} The transform with the newly applied properties
         */
        Matrix.prototype.decompose = function (transform) {
            // sort out rotation / skew..
            var a = this.a;
            var b = this.b;
            var c = this.c;
            var d = this.d;
            var skewX = -Math.atan2(-c, d);
            var skewY = Math.atan2(b, a);
            var delta = Math.abs(skewX + skewY);
            if (delta < 0.00001 || Math.abs(PI_2 - delta) < 0.00001) {
                transform.rotation = skewY;
                transform.skew.x = transform.skew.y = 0;
            }
            else {
                transform.rotation = 0;
                transform.skew.x = skewX;
                transform.skew.y = skewY;
            }
            // next set scale
            transform.scale.x = Math.sqrt((a * a) + (b * b));
            transform.scale.y = Math.sqrt((c * c) + (d * d));
            // next set position
            transform.position.x = this.tx;
            transform.position.y = this.ty;
            return transform;
        };
        /**
         * Inverts this matrix
         *
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */
        Matrix.prototype.invert = function () {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;
            var tx1 = this.tx;
            var n = (a1 * d1) - (b1 * c1);
            this.a = d1 / n;
            this.b = -b1 / n;
            this.c = -c1 / n;
            this.d = a1 / n;
            this.tx = ((c1 * this.ty) - (d1 * tx1)) / n;
            this.ty = -((a1 * this.ty) - (b1 * tx1)) / n;
            return this;
        };
        /**
         * Resets this Matrix to an identity (default) matrix.
         *
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */
        Matrix.prototype.identity = function () {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.tx = 0;
            this.ty = 0;
            return this;
        };
        /**
         * Creates a new Matrix object with the same values as this one.
         *
         * @return {PIXI.Matrix} A copy of this matrix. Good for chaining method calls.
         */
        Matrix.prototype.clone = function () {
            var matrix = new Matrix();
            matrix.a = this.a;
            matrix.b = this.b;
            matrix.c = this.c;
            matrix.d = this.d;
            matrix.tx = this.tx;
            matrix.ty = this.ty;
            return matrix;
        };
        /**
         * Changes the values of the given matrix to be the same as the ones in this matrix
         *
         * @param {PIXI.Matrix} matrix - The matrix to copy to.
         * @return {PIXI.Matrix} The matrix given in parameter with its values updated.
         */
        Matrix.prototype.copyTo = function (matrix) {
            matrix.a = this.a;
            matrix.b = this.b;
            matrix.c = this.c;
            matrix.d = this.d;
            matrix.tx = this.tx;
            matrix.ty = this.ty;
            return matrix;
        };
        /**
         * Changes the values of the matrix to be the same as the ones in given matrix
         *
         * @param {PIXI.Matrix} matrix - The matrix to copy from.
         * @return {PIXI.Matrix} this
         */
        Matrix.prototype.copyFrom = function (matrix) {
            this.a = matrix.a;
            this.b = matrix.b;
            this.c = matrix.c;
            this.d = matrix.d;
            this.tx = matrix.tx;
            this.ty = matrix.ty;
            return this;
        };
        Object.defineProperty(Matrix, "IDENTITY", {
            /**
             * A default (identity) matrix
             *
             * @static
             * @const
             * @member {PIXI.Matrix}
             */
            get: function () {
                return new Matrix();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Matrix, "TEMP_MATRIX", {
            /**
             * A temp matrix
             *
             * @static
             * @const
             * @member {PIXI.Matrix}
             */
            get: function () {
                return new Matrix();
            },
            enumerable: false,
            configurable: true
        });
        return Matrix;
    }());

    // Your friendly neighbour https://en.wikipedia.org/wiki/Dihedral_group
    /*
     * Transform matrix for operation n is:
     * | ux | vx |
     * | uy | vy |
     */
    var ux = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1];
    var uy = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1];
    var vx = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1];
    var vy = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1];
    /**
     * [Cayley Table]{@link https://en.wikipedia.org/wiki/Cayley_table}
     * for the composition of each rotation in the dihederal group D8.
     *
     * @type number[][]
     * @private
     */
    var rotationCayley = [];
    /**
     * Matrices for each `GD8Symmetry` rotation.
     *
     * @type Matrix[]
     * @private
     */
    var rotationMatrices = [];
    /*
     * Alias for {@code Math.sign}.
     */
    var signum = Math.sign;
    /*
     * Initializes `rotationCayley` and `rotationMatrices`. It is called
     * only once below.
     */
    function init() {
        for (var i = 0; i < 16; i++) {
            var row = [];
            rotationCayley.push(row);
            for (var j = 0; j < 16; j++) {
                /* Multiplies rotation matrices i and j. */
                var _ux = signum((ux[i] * ux[j]) + (vx[i] * uy[j]));
                var _uy = signum((uy[i] * ux[j]) + (vy[i] * uy[j]));
                var _vx = signum((ux[i] * vx[j]) + (vx[i] * vy[j]));
                var _vy = signum((uy[i] * vx[j]) + (vy[i] * vy[j]));
                /* Finds rotation matrix matching the product and pushes it. */
                for (var k = 0; k < 16; k++) {
                    if (ux[k] === _ux && uy[k] === _uy
                        && vx[k] === _vx && vy[k] === _vy) {
                        row.push(k);
                        break;
                    }
                }
            }
        }
        for (var i = 0; i < 16; i++) {
            var mat = new Matrix();
            mat.set(ux[i], uy[i], vx[i], vy[i], 0, 0);
            rotationMatrices.push(mat);
        }
    }
    init();
    /**
     * @memberof PIXI
     * @typedef {number} GD8Symmetry
     * @see PIXI.groupD8
     */
    /**
     * Implements the dihedral group D8, which is similar to
     * [group D4]{@link http://mathworld.wolfram.com/DihedralGroupD4.html};
     * D8 is the same but with diagonals, and it is used for texture
     * rotations.
     *
     * The directions the U- and V- axes after rotation
     * of an angle of `a: GD8Constant` are the vectors `(uX(a), uY(a))`
     * and `(vX(a), vY(a))`. These aren't necessarily unit vectors.
     *
     * **Origin:**<br>
     *  This is the small part of gameofbombs.com portal system. It works.
     *
     * @see PIXI.groupD8.E
     * @see PIXI.groupD8.SE
     * @see PIXI.groupD8.S
     * @see PIXI.groupD8.SW
     * @see PIXI.groupD8.W
     * @see PIXI.groupD8.NW
     * @see PIXI.groupD8.N
     * @see PIXI.groupD8.NE
     * @author Ivan @ivanpopelyshev
     * @namespace PIXI.groupD8
     * @memberof PIXI
     */
    var groupD8 = {
        /**
         * | Rotation | Direction |
         * |----------|-----------|
         * | 0°       | East      |
         *
         * @memberof PIXI.groupD8
         * @constant {PIXI.GD8Symmetry}
         */
        E: 0,
        /**
         * | Rotation | Direction |
         * |----------|-----------|
         * | 45°↻     | Southeast |
         *
         * @memberof PIXI.groupD8
         * @constant {PIXI.GD8Symmetry}
         */
        SE: 1,
        /**
         * | Rotation | Direction |
         * |----------|-----------|
         * | 90°↻     | South     |
         *
         * @memberof PIXI.groupD8
         * @constant {PIXI.GD8Symmetry}
         */
        S: 2,
        /**
         * | Rotation | Direction |
         * |----------|-----------|
         * | 135°↻    | Southwest |
         *
         * @memberof PIXI.groupD8
         * @constant {PIXI.GD8Symmetry}
         */
        SW: 3,
        /**
         * | Rotation | Direction |
         * |----------|-----------|
         * | 180°     | West      |
         *
         * @memberof PIXI.groupD8
         * @constant {PIXI.GD8Symmetry}
         */
        W: 4,
        /**
         * | Rotation    | Direction    |
         * |-------------|--------------|
         * | -135°/225°↻ | Northwest    |
         *
         * @memberof PIXI.groupD8
         * @constant {PIXI.GD8Symmetry}
         */
        NW: 5,
        /**
         * | Rotation    | Direction    |
         * |-------------|--------------|
         * | -90°/270°↻  | North        |
         *
         * @memberof PIXI.groupD8
         * @constant {PIXI.GD8Symmetry}
         */
        N: 6,
        /**
         * | Rotation    | Direction    |
         * |-------------|--------------|
         * | -45°/315°↻  | Northeast    |
         *
         * @memberof PIXI.groupD8
         * @constant {PIXI.GD8Symmetry}
         */
        NE: 7,
        /**
         * Reflection about Y-axis.
         *
         * @memberof PIXI.groupD8
         * @constant {PIXI.GD8Symmetry}
         */
        MIRROR_VERTICAL: 8,
        /**
         * Reflection about the main diagonal.
         *
         * @memberof PIXI.groupD8
         * @constant {PIXI.GD8Symmetry}
         */
        MAIN_DIAGONAL: 10,
        /**
         * Reflection about X-axis.
         *
         * @memberof PIXI.groupD8
         * @constant {PIXI.GD8Symmetry}
         */
        MIRROR_HORIZONTAL: 12,
        /**
         * Reflection about reverse diagonal.
         *
         * @memberof PIXI.groupD8
         * @constant {PIXI.GD8Symmetry}
         */
        REVERSE_DIAGONAL: 14,
        /**
         * @memberof PIXI.groupD8
         * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
         * @return {PIXI.GD8Symmetry} The X-component of the U-axis
         *    after rotating the axes.
         */
        uX: function (ind) { return ux[ind]; },
        /**
         * @memberof PIXI.groupD8
         * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
         * @return {PIXI.GD8Symmetry} The Y-component of the U-axis
         *    after rotating the axes.
         */
        uY: function (ind) { return uy[ind]; },
        /**
         * @memberof PIXI.groupD8
         * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
         * @return {PIXI.GD8Symmetry} The X-component of the V-axis
         *    after rotating the axes.
         */
        vX: function (ind) { return vx[ind]; },
        /**
         * @memberof PIXI.groupD8
         * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
         * @return {PIXI.GD8Symmetry} The Y-component of the V-axis
         *    after rotating the axes.
         */
        vY: function (ind) { return vy[ind]; },
        /**
         * @memberof PIXI.groupD8
         * @param {PIXI.GD8Symmetry} rotation - symmetry whose opposite
         *   is needed. Only rotations have opposite symmetries while
         *   reflections don't.
         * @return {PIXI.GD8Symmetry} The opposite symmetry of `rotation`
         */
        inv: function (rotation) {
            if (rotation & 8) // true only if between 8 & 15 (reflections)
             {
                return rotation & 15; // or rotation % 16
            }
            return (-rotation) & 7; // or (8 - rotation) % 8
        },
        /**
         * Composes the two D8 operations.
         *
         * Taking `^` as reflection:
         *
         * |       | E=0 | S=2 | W=4 | N=6 | E^=8 | S^=10 | W^=12 | N^=14 |
         * |-------|-----|-----|-----|-----|------|-------|-------|-------|
         * | E=0   | E   | S   | W   | N   | E^   | S^    | W^    | N^    |
         * | S=2   | S   | W   | N   | E   | S^   | W^    | N^    | E^    |
         * | W=4   | W   | N   | E   | S   | W^   | N^    | E^    | S^    |
         * | N=6   | N   | E   | S   | W   | N^   | E^    | S^    | W^    |
         * | E^=8  | E^  | N^  | W^  | S^  | E    | N     | W     | S     |
         * | S^=10 | S^  | E^  | N^  | W^  | S    | E     | N     | W     |
         * | W^=12 | W^  | S^  | E^  | N^  | W    | S     | E     | N     |
         * | N^=14 | N^  | W^  | S^  | E^  | N    | W     | S     | E     |
         *
         * [This is a Cayley table]{@link https://en.wikipedia.org/wiki/Cayley_table}
         * @memberof PIXI.groupD8
         * @param {PIXI.GD8Symmetry} rotationSecond - Second operation, which
         *   is the row in the above cayley table.
         * @param {PIXI.GD8Symmetry} rotationFirst - First operation, which
         *   is the column in the above cayley table.
         * @return {PIXI.GD8Symmetry} Composed operation
         */
        add: function (rotationSecond, rotationFirst) { return (rotationCayley[rotationSecond][rotationFirst]); },
        /**
         * Reverse of `add`.
         *
         * @memberof PIXI.groupD8
         * @param {PIXI.GD8Symmetry} rotationSecond - Second operation
         * @param {PIXI.GD8Symmetry} rotationFirst - First operation
         * @return {PIXI.GD8Symmetry} Result
         */
        sub: function (rotationSecond, rotationFirst) { return (rotationCayley[rotationSecond][groupD8.inv(rotationFirst)]); },
        /**
         * Adds 180 degrees to rotation, which is a commutative
         * operation.
         *
         * @memberof PIXI.groupD8
         * @param {number} rotation - The number to rotate.
         * @returns {number} Rotated number
         */
        rotate180: function (rotation) { return rotation ^ 4; },
        /**
         * Checks if the rotation angle is vertical, i.e. south
         * or north. It doesn't work for reflections.
         *
         * @memberof PIXI.groupD8
         * @param {PIXI.GD8Symmetry} rotation - The number to check.
         * @returns {boolean} Whether or not the direction is vertical
         */
        isVertical: function (rotation) { return (rotation & 3) === 2; },
        /**
         * Approximates the vector `V(dx,dy)` into one of the
         * eight directions provided by `groupD8`.
         *
         * @memberof PIXI.groupD8
         * @param {number} dx - X-component of the vector
         * @param {number} dy - Y-component of the vector
         * @return {PIXI.GD8Symmetry} Approximation of the vector into
         *  one of the eight symmetries.
         */
        byDirection: function (dx, dy) {
            if (Math.abs(dx) * 2 <= Math.abs(dy)) {
                if (dy >= 0) {
                    return groupD8.S;
                }
                return groupD8.N;
            }
            else if (Math.abs(dy) * 2 <= Math.abs(dx)) {
                if (dx > 0) {
                    return groupD8.E;
                }
                return groupD8.W;
            }
            else if (dy > 0) {
                if (dx > 0) {
                    return groupD8.SE;
                }
                return groupD8.SW;
            }
            else if (dx > 0) {
                return groupD8.NE;
            }
            return groupD8.NW;
        },
        /**
         * Helps sprite to compensate texture packer rotation.
         *
         * @memberof PIXI.groupD8
         * @param {PIXI.Matrix} matrix - sprite world matrix
         * @param {PIXI.GD8Symmetry} rotation - The rotation factor to use.
         * @param {number} tx - sprite anchoring
         * @param {number} ty - sprite anchoring
         */
        matrixAppendRotationInv: function (matrix, rotation, tx, ty) {
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            // Packer used "rotation", we use "inv(rotation)"
            var mat = rotationMatrices[groupD8.inv(rotation)];
            mat.tx = tx;
            mat.ty = ty;
            matrix.append(mat);
        },
    };

    /**
     * Transform that takes care about its versions
     *
     * @class
     * @memberof PIXI
     */
    var Transform = /** @class */ (function () {
        function Transform() {
            /**
             * The world transformation matrix.
             *
             * @member {PIXI.Matrix}
             */
            this.worldTransform = new Matrix();
            /**
             * The local transformation matrix.
             *
             * @member {PIXI.Matrix}
             */
            this.localTransform = new Matrix();
            /**
             * The coordinate of the object relative to the local coordinates of the parent.
             *
             * @member {PIXI.ObservablePoint}
             */
            this.position = new ObservablePoint(this.onChange, this, 0, 0);
            /**
             * The scale factor of the object.
             *
             * @member {PIXI.ObservablePoint}
             */
            this.scale = new ObservablePoint(this.onChange, this, 1, 1);
            /**
             * The pivot point of the displayObject that it rotates around.
             *
             * @member {PIXI.ObservablePoint}
             */
            this.pivot = new ObservablePoint(this.onChange, this, 0, 0);
            /**
             * The skew amount, on the x and y axis.
             *
             * @member {PIXI.ObservablePoint}
             */
            this.skew = new ObservablePoint(this.updateSkew, this, 0, 0);
            /**
             * The rotation amount.
             *
             * @protected
             * @member {number}
             */
            this._rotation = 0;
            /**
             * The X-coordinate value of the normalized local X axis,
             * the first column of the local transformation matrix without a scale.
             *
             * @protected
             * @member {number}
             */
            this._cx = 1;
            /**
             * The Y-coordinate value of the normalized local X axis,
             * the first column of the local transformation matrix without a scale.
             *
             * @protected
             * @member {number}
             */
            this._sx = 0;
            /**
             * The X-coordinate value of the normalized local Y axis,
             * the second column of the local transformation matrix without a scale.
             *
             * @protected
             * @member {number}
             */
            this._cy = 0;
            /**
             * The Y-coordinate value of the normalized local Y axis,
             * the second column of the local transformation matrix without a scale.
             *
             * @protected
             * @member {number}
             */
            this._sy = 1;
            /**
             * The locally unique ID of the local transform.
             *
             * @protected
             * @member {number}
             */
            this._localID = 0;
            /**
             * The locally unique ID of the local transform
             * used to calculate the current local transformation matrix.
             *
             * @protected
             * @member {number}
             */
            this._currentLocalID = 0;
            /**
             * The locally unique ID of the world transform.
             *
             * @protected
             * @member {number}
             */
            this._worldID = 0;
            /**
             * The locally unique ID of the parent's world transform
             * used to calculate the current world transformation matrix.
             *
             * @protected
             * @member {number}
             */
            this._parentID = 0;
        }
        /**
         * Called when a value changes.
         *
         * @protected
         */
        Transform.prototype.onChange = function () {
            this._localID++;
        };
        /**
         * Called when the skew or the rotation changes.
         *
         * @protected
         */
        Transform.prototype.updateSkew = function () {
            this._cx = Math.cos(this._rotation + this.skew.y);
            this._sx = Math.sin(this._rotation + this.skew.y);
            this._cy = -Math.sin(this._rotation - this.skew.x); // cos, added PI/2
            this._sy = Math.cos(this._rotation - this.skew.x); // sin, added PI/2
            this._localID++;
        };
        /**
         * Updates the local transformation matrix.
         */
        Transform.prototype.updateLocalTransform = function () {
            var lt = this.localTransform;
            if (this._localID !== this._currentLocalID) {
                // get the matrix values of the displayobject based on its transform properties..
                lt.a = this._cx * this.scale.x;
                lt.b = this._sx * this.scale.x;
                lt.c = this._cy * this.scale.y;
                lt.d = this._sy * this.scale.y;
                lt.tx = this.position.x - ((this.pivot.x * lt.a) + (this.pivot.y * lt.c));
                lt.ty = this.position.y - ((this.pivot.x * lt.b) + (this.pivot.y * lt.d));
                this._currentLocalID = this._localID;
                // force an update..
                this._parentID = -1;
            }
        };
        /**
         * Updates the local and the world transformation matrices.
         *
         * @param {PIXI.Transform} parentTransform - The parent transform
         */
        Transform.prototype.updateTransform = function (parentTransform) {
            var lt = this.localTransform;
            if (this._localID !== this._currentLocalID) {
                // get the matrix values of the displayobject based on its transform properties..
                lt.a = this._cx * this.scale.x;
                lt.b = this._sx * this.scale.x;
                lt.c = this._cy * this.scale.y;
                lt.d = this._sy * this.scale.y;
                lt.tx = this.position.x - ((this.pivot.x * lt.a) + (this.pivot.y * lt.c));
                lt.ty = this.position.y - ((this.pivot.x * lt.b) + (this.pivot.y * lt.d));
                this._currentLocalID = this._localID;
                // force an update..
                this._parentID = -1;
            }
            if (this._parentID !== parentTransform._worldID) {
                // concat the parent matrix with the objects transform.
                var pt = parentTransform.worldTransform;
                var wt = this.worldTransform;
                wt.a = (lt.a * pt.a) + (lt.b * pt.c);
                wt.b = (lt.a * pt.b) + (lt.b * pt.d);
                wt.c = (lt.c * pt.a) + (lt.d * pt.c);
                wt.d = (lt.c * pt.b) + (lt.d * pt.d);
                wt.tx = (lt.tx * pt.a) + (lt.ty * pt.c) + pt.tx;
                wt.ty = (lt.tx * pt.b) + (lt.ty * pt.d) + pt.ty;
                this._parentID = parentTransform._worldID;
                // update the id of the transform..
                this._worldID++;
            }
        };
        /**
         * Decomposes a matrix and sets the transforms properties based on it.
         *
         * @param {PIXI.Matrix} matrix - The matrix to decompose
         */
        Transform.prototype.setFromMatrix = function (matrix) {
            matrix.decompose(this);
            this._localID++;
        };
        Object.defineProperty(Transform.prototype, "rotation", {
            /**
             * The rotation of the object in radians.
             *
             * @member {number}
             */
            get: function () {
                return this._rotation;
            },
            set: function (value) {
                if (this._rotation !== value) {
                    this._rotation = value;
                    this.updateSkew();
                }
            },
            enumerable: false,
            configurable: true
        });
        /**
         * A default (identity) transform
         *
         * @static
         * @constant
         * @member {PIXI.Transform}
         */
        Transform.IDENTITY = new Transform();
        return Transform;
    }());

    /*!
     * @pixi/core - v5.3.1
     * Compiled Fri, 24 Jul 2020 20:56:48 UTC
     *
     * @pixi/core is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    /**
     * The maximum support for using WebGL. If a device does not
     * support WebGL version, for instance WebGL 2, it will still
     * attempt to fallback support to WebGL 1. If you want to
     * explicitly remove feature support to target a more stable
     * baseline, prefer a lower environment.
     *
     * Due to {@link https://bugs.chromium.org/p/chromium/issues/detail?id=934823|bug in chromium}
     * we disable webgl2 by default for all non-apple mobile devices.
     *
     * @static
     * @name PREFER_ENV
     * @memberof PIXI.settings
     * @type {number}
     * @default PIXI.ENV.WEBGL2
     */
    settings.PREFER_ENV = isMobile$1.any ? ENV.WEBGL : ENV.WEBGL2;
    /**
     * If set to `true`, *only* Textures and BaseTexture objects stored
     * in the caches ({@link PIXI.utils.TextureCache TextureCache} and
     * {@link PIXI.utils.BaseTextureCache BaseTextureCache}) can be
     * used when calling {@link PIXI.Texture.from Texture.from} or
     * {@link PIXI.BaseTexture.from BaseTexture.from}.
     * Otherwise, these `from` calls throw an exception. Using this property
     * can be useful if you want to enforce preloading all assets with
     * {@link PIXI.Loader Loader}.
     *
     * @static
     * @name STRICT_TEXTURE_CACHE
     * @memberof PIXI.settings
     * @type {boolean}
     * @default false
     */
    settings.STRICT_TEXTURE_CACHE = false;

    /**
     * Collection of installed resource types, class must extend {@link PIXI.resources.Resource}.
     * @example
     * class CustomResource extends PIXI.resources.Resource {
     *   // MUST have source, options constructor signature
     *   // for auto-detected resources to be created.
     *   constructor(source, options) {
     *     super();
     *   }
     *   upload(renderer, baseTexture, glTexture) {
     *     // upload with GL
     *     return true;
     *   }
     *   // used to auto-detect resource
     *   static test(source, extension) {
     *     return extension === 'xyz'|| source instanceof SomeClass;
     *   }
     * }
     * // Install the new resource type
     * PIXI.resources.INSTALLED.push(CustomResource);
     *
     * @name PIXI.resources.INSTALLED
     * @type {Array<*>}
     * @static
     * @readonly
     */
    var INSTALLED = [];
    /**
     * Create a resource element from a single source element. This
     * auto-detects which type of resource to create. All resources that
     * are auto-detectable must have a static `test` method and a constructor
     * with the arguments `(source, options?)`. Currently, the supported
     * resources for auto-detection include:
     *  - {@link PIXI.resources.ImageResource}
     *  - {@link PIXI.resources.CanvasResource}
     *  - {@link PIXI.resources.VideoResource}
     *  - {@link PIXI.resources.SVGResource}
     *  - {@link PIXI.resources.BufferResource}
     * @static
     * @function PIXI.resources.autoDetectResource
     * @param {string|*} source - Resource source, this can be the URL to the resource,
     *        a typed-array (for BufferResource), HTMLVideoElement, SVG data-uri
     *        or any other resource that can be auto-detected. If not resource is
     *        detected, it's assumed to be an ImageResource.
     * @param {object} [options] - Pass-through options to use for Resource
     * @param {number} [options.width] - Width of BufferResource or SVG rasterization
     * @param {number} [options.height] - Height of BufferResource or SVG rasterization
     * @param {boolean} [options.autoLoad=true] - Image, SVG and Video flag to start loading
     * @param {number} [options.scale=1] - SVG source scale. Overridden by width, height
     * @param {boolean} [options.createBitmap=PIXI.settings.CREATE_IMAGE_BITMAP] - Image option to create Bitmap object
     * @param {boolean} [options.crossorigin=true] - Image and Video option to set crossOrigin
     * @param {boolean} [options.autoPlay=true] - Video option to start playing video immediately
     * @param {number} [options.updateFPS=0] - Video option to update how many times a second the
     *        texture should be updated from the video. Leave at 0 to update at every render
     * @return {PIXI.resources.Resource} The created resource.
     */
    function autoDetectResource(source, options) {
        if (!source) {
            return null;
        }
        var extension = '';
        if (typeof source === 'string') {
            // search for file extension: period, 3-4 chars, then ?, # or EOL
            var result = (/\.(\w{3,4})(?:$|\?|#)/i).exec(source);
            if (result) {
                extension = result[1].toLowerCase();
            }
        }
        for (var i = INSTALLED.length - 1; i >= 0; --i) {
            var ResourcePlugin = INSTALLED[i];
            if (ResourcePlugin.test && ResourcePlugin.test(source, extension)) {
                return new ResourcePlugin(source, options);
            }
        }
        throw new Error('Unrecognized source type to auto-detect Resource');
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    /**
     * Base resource class for textures that manages validation and uploading, depending on its type.
     *
     * Uploading of a base texture to the GPU is required.
     *
     * @class
     * @memberof PIXI.resources
     */
    var Resource = /** @class */ (function () {
        /**
         * @param {number} [width=0] - Width of the resource
         * @param {number} [height=0] - Height of the resource
         */
        function Resource(width, height) {
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            /**
             * Internal width of the resource
             * @member {number}
             * @protected
             */
            this._width = width;
            /**
             * Internal height of the resource
             * @member {number}
             * @protected
             */
            this._height = height;
            /**
             * If resource has been destroyed
             * @member {boolean}
             * @readonly
             * @default false
             */
            this.destroyed = false;
            /**
             * `true` if resource is created by BaseTexture
             * useful for doing cleanup with BaseTexture destroy
             * and not cleaning up resources that were created
             * externally.
             * @member {boolean}
             * @protected
             */
            this.internal = false;
            /**
             * Mini-runner for handling resize events
             * accepts 2 parameters: width, height
             *
             * @member {Runner}
             * @private
             */
            this.onResize = new Runner('setRealSize');
            /**
             * Mini-runner for handling update events
             *
             * @member {Runner}
             * @private
             */
            this.onUpdate = new Runner('update');
            /**
             * Handle internal errors, such as loading errors
             * accepts 1 param: error
             *
             * @member {Runner}
             * @private
             */
            this.onError = new Runner('onError');
        }
        /**
         * Bind to a parent BaseTexture
         *
         * @param {PIXI.BaseTexture} baseTexture - Parent texture
         */
        Resource.prototype.bind = function (baseTexture) {
            this.onResize.add(baseTexture);
            this.onUpdate.add(baseTexture);
            this.onError.add(baseTexture);
            // Call a resize immediate if we already
            // have the width and height of the resource
            if (this._width || this._height) {
                this.onResize.emit(this._width, this._height);
            }
        };
        /**
         * Unbind to a parent BaseTexture
         *
         * @param {PIXI.BaseTexture} baseTexture - Parent texture
         */
        Resource.prototype.unbind = function (baseTexture) {
            this.onResize.remove(baseTexture);
            this.onUpdate.remove(baseTexture);
            this.onError.remove(baseTexture);
        };
        /**
         * Trigger a resize event
         * @param {number} width - X dimension
         * @param {number} height - Y dimension
         */
        Resource.prototype.resize = function (width, height) {
            if (width !== this._width || height !== this._height) {
                this._width = width;
                this._height = height;
                this.onResize.emit(width, height);
            }
        };
        Object.defineProperty(Resource.prototype, "valid", {
            /**
             * Has been validated
             * @readonly
             * @member {boolean}
             */
            get: function () {
                return !!this._width && !!this._height;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Has been updated trigger event
         */
        Resource.prototype.update = function () {
            if (!this.destroyed) {
                this.onUpdate.emit();
            }
        };
        /**
         * This can be overridden to start preloading a resource
         * or do any other prepare step.
         * @protected
         * @return {Promise<void>} Handle the validate event
         */
        Resource.prototype.load = function () {
            return Promise.resolve(this);
        };
        Object.defineProperty(Resource.prototype, "width", {
            /**
             * The width of the resource.
             *
             * @member {number}
             * @readonly
             */
            get: function () {
                return this._width;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Resource.prototype, "height", {
            /**
             * The height of the resource.
             *
             * @member {number}
             * @readonly
             */
            get: function () {
                return this._height;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Set the style, optional to override
         *
         * @param {PIXI.Renderer} renderer - yeah, renderer!
         * @param {PIXI.BaseTexture} baseTexture - the texture
         * @param {PIXI.GLTexture} glTexture - texture instance for this webgl context
         * @returns {boolean} `true` is success
         */
        Resource.prototype.style = function (_renderer, _baseTexture, _glTexture) {
            return false;
        };
        /**
         * Clean up anything, this happens when destroying is ready.
         *
         * @protected
         */
        Resource.prototype.dispose = function () {
            // override
        };
        /**
         * Call when destroying resource, unbind any BaseTexture object
         * before calling this method, as reference counts are maintained
         * internally.
         */
        Resource.prototype.destroy = function () {
            if (!this.destroyed) {
                this.destroyed = true;
                this.dispose();
                this.onError.removeAll();
                this.onError = null;
                this.onResize.removeAll();
                this.onResize = null;
                this.onUpdate.removeAll();
                this.onUpdate = null;
            }
        };
        /**
         * Abstract, used to auto-detect resource type
         *
         * @static
         * @param {*} source - The source object
         * @param {string} extension - The extension of source, if set
         */
        Resource.test = function (_source, _extension) {
            return false;
        };
        return Resource;
    }());

    /**
     * @interface SharedArrayBuffer
     */
    /**
     * Buffer resource with data of typed array.
     * @class
     * @extends PIXI.resources.Resource
     * @memberof PIXI.resources
     */
    var BufferResource = /** @class */ (function (_super) {
        __extends(BufferResource, _super);
        /**
         * @param {Float32Array|Uint8Array|Uint32Array} source - Source buffer
         * @param {object} options - Options
         * @param {number} options.width - Width of the texture
         * @param {number} options.height - Height of the texture
         */
        function BufferResource(source, options) {
            var _this = this;
            var _a = options || {}, width = _a.width, height = _a.height;
            if (!width || !height) {
                throw new Error('BufferResource width or height invalid');
            }
            _this = _super.call(this, width, height) || this;
            /**
             * Source array
             * Cannot be ClampedUint8Array because it cant be uploaded to WebGL
             *
             * @member {Float32Array|Uint8Array|Uint32Array}
             */
            _this.data = source;
            return _this;
        }
        /**
         * Upload the texture to the GPU.
         * @param {PIXI.Renderer} renderer - Upload to the renderer
         * @param {PIXI.BaseTexture} baseTexture - Reference to parent texture
         * @param {PIXI.GLTexture} glTexture - glTexture
         * @returns {boolean} true is success
         */
        BufferResource.prototype.upload = function (renderer, baseTexture, glTexture) {
            var gl = renderer.gl;
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, baseTexture.alphaMode === ALPHA_MODES.UNPACK);
            if (glTexture.width === baseTexture.width && glTexture.height === baseTexture.height) {
                gl.texSubImage2D(baseTexture.target, 0, 0, 0, baseTexture.width, baseTexture.height, baseTexture.format, baseTexture.type, this.data);
            }
            else {
                glTexture.width = baseTexture.width;
                glTexture.height = baseTexture.height;
                gl.texImage2D(baseTexture.target, 0, glTexture.internalFormat, baseTexture.width, baseTexture.height, 0, baseTexture.format, glTexture.type, this.data);
            }
            return true;
        };
        /**
         * Destroy and don't use after this
         * @override
         */
        BufferResource.prototype.dispose = function () {
            this.data = null;
        };
        /**
         * Used to auto-detect the type of resource.
         *
         * @static
         * @param {*} source - The source object
         * @return {boolean} `true` if <canvas>
         */
        BufferResource.test = function (source) {
            return source instanceof Float32Array
                || source instanceof Uint8Array
                || source instanceof Uint32Array;
        };
        return BufferResource;
    }(Resource));

    var defaultBufferOptions = {
        scaleMode: SCALE_MODES.NEAREST,
        format: FORMATS.RGBA,
        alphaMode: ALPHA_MODES.NPM,
    };
    /**
     * A Texture stores the information that represents an image.
     * All textures have a base texture, which contains information about the source.
     * Therefore you can have many textures all using a single BaseTexture
     *
     * @class
     * @extends PIXI.utils.EventEmitter
     * @memberof PIXI
     * @param {PIXI.resources.Resource|string|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} [resource=null]
     *        The current resource to use, for things that aren't Resource objects, will be converted
     *        into a Resource.
     * @param {Object} [options] - Collection of options
     * @param {PIXI.MIPMAP_MODES} [options.mipmap=PIXI.settings.MIPMAP_TEXTURES] - If mipmapping is enabled for texture
     * @param {number} [options.anisotropicLevel=PIXI.settings.ANISOTROPIC_LEVEL] - Anisotropic filtering level of texture
     * @param {PIXI.WRAP_MODES} [options.wrapMode=PIXI.settings.WRAP_MODE] - Wrap mode for textures
     * @param {PIXI.SCALE_MODES} [options.scaleMode=PIXI.settings.SCALE_MODE] - Default scale mode, linear, nearest
     * @param {PIXI.FORMATS} [options.format=PIXI.FORMATS.RGBA] - GL format type
     * @param {PIXI.TYPES} [options.type=PIXI.TYPES.UNSIGNED_BYTE] - GL data type
     * @param {PIXI.TARGETS} [options.target=PIXI.TARGETS.TEXTURE_2D] - GL texture target
     * @param {PIXI.ALPHA_MODES} [options.alphaMode=PIXI.ALPHA_MODES.UNPACK] - Pre multiply the image alpha
     * @param {number} [options.width=0] - Width of the texture
     * @param {number} [options.height=0] - Height of the texture
     * @param {number} [options.resolution] - Resolution of the base texture
     * @param {object} [options.resourceOptions] - Optional resource options,
     *        see {@link PIXI.resources.autoDetectResource autoDetectResource}
     */
    var BaseTexture = /** @class */ (function (_super) {
        __extends(BaseTexture, _super);
        function BaseTexture(resource, options) {
            if (resource === void 0) { resource = null; }
            if (options === void 0) { options = null; }
            var _this = _super.call(this) || this;
            options = options || {};
            var alphaMode = options.alphaMode, mipmap = options.mipmap, anisotropicLevel = options.anisotropicLevel, scaleMode = options.scaleMode, width = options.width, height = options.height, wrapMode = options.wrapMode, format = options.format, type = options.type, target = options.target, resolution = options.resolution, resourceOptions = options.resourceOptions;
            // Convert the resource to a Resource object
            if (resource && !(resource instanceof Resource)) {
                resource = autoDetectResource(resource, resourceOptions);
                resource.internal = true;
            }
            /**
             * The width of the base texture set when the image has loaded
             *
             * @readonly
             * @member {number}
             */
            _this.width = width || 0;
            /**
             * The height of the base texture set when the image has loaded
             *
             * @readonly
             * @member {number}
             */
            _this.height = height || 0;
            /**
             * The resolution / device pixel ratio of the texture
             *
             * @member {number}
             * @default PIXI.settings.RESOLUTION
             */
            _this.resolution = resolution || settings.RESOLUTION;
            /**
             * Mipmap mode of the texture, affects downscaled images
             *
             * @member {PIXI.MIPMAP_MODES}
             * @default PIXI.settings.MIPMAP_TEXTURES
             */
            _this.mipmap = mipmap !== undefined ? mipmap : settings.MIPMAP_TEXTURES;
            /**
             * Anisotropic filtering level of texture
             *
             * @member {number}
             * @default PIXI.settings.ANISOTROPIC_LEVEL
             */
            _this.anisotropicLevel = anisotropicLevel !== undefined ? anisotropicLevel : settings.ANISOTROPIC_LEVEL;
            /**
             * How the texture wraps
             * @member {number}
             */
            _this.wrapMode = wrapMode || settings.WRAP_MODE;
            /**
             * The scale mode to apply when scaling this texture
             *
             * @member {PIXI.SCALE_MODES}
             * @default PIXI.settings.SCALE_MODE
             */
            _this.scaleMode = scaleMode !== undefined ? scaleMode : settings.SCALE_MODE;
            /**
             * The pixel format of the texture
             *
             * @member {PIXI.FORMATS}
             * @default PIXI.FORMATS.RGBA
             */
            _this.format = format || FORMATS.RGBA;
            /**
             * The type of resource data
             *
             * @member {PIXI.TYPES}
             * @default PIXI.TYPES.UNSIGNED_BYTE
             */
            _this.type = type || TYPES.UNSIGNED_BYTE;
            /**
             * The target type
             *
             * @member {PIXI.TARGETS}
             * @default PIXI.TARGETS.TEXTURE_2D
             */
            _this.target = target || TARGETS.TEXTURE_2D;
            /**
             * How to treat premultiplied alpha, see {@link PIXI.ALPHA_MODES}.
             *
             * @member {PIXI.ALPHA_MODES}
             * @default PIXI.ALPHA_MODES.UNPACK
             */
            _this.alphaMode = alphaMode !== undefined ? alphaMode : ALPHA_MODES.UNPACK;
            if (options.premultiplyAlpha !== undefined) {
                // triggers deprecation
                _this.premultiplyAlpha = options.premultiplyAlpha;
            }
            /**
             * Global unique identifier for this BaseTexture
             *
             * @member {number}
             * @protected
             */
            _this.uid = uid();
            /**
             * Used by automatic texture Garbage Collection, stores last GC tick when it was bound
             *
             * @member {number}
             * @protected
             */
            _this.touched = 0;
            /**
             * Whether or not the texture is a power of two, try to use power of two textures as much
             * as you can
             *
             * @readonly
             * @member {boolean}
             * @default false
             */
            _this.isPowerOfTwo = false;
            _this._refreshPOT();
            /**
             * The map of render context textures where this is bound
             *
             * @member {Object}
             * @private
             */
            _this._glTextures = {};
            /**
             * Used by TextureSystem to only update texture to the GPU when needed.
             * Please call `update()` to increment it.
             *
             * @readonly
             * @member {number}
             */
            _this.dirtyId = 0;
            /**
             * Used by TextureSystem to only update texture style when needed.
             *
             * @protected
             * @member {number}
             */
            _this.dirtyStyleId = 0;
            /**
             * Currently default cache ID.
             *
             * @member {string}
             */
            _this.cacheId = null;
            /**
             * Generally speaking means when resource is loaded.
             * @readonly
             * @member {boolean}
             */
            _this.valid = width > 0 && height > 0;
            /**
             * The collection of alternative cache ids, since some BaseTextures
             * can have more than one ID, short name and longer full URL
             *
             * @member {Array<string>}
             * @readonly
             */
            _this.textureCacheIds = [];
            /**
             * Flag if BaseTexture has been destroyed.
             *
             * @member {boolean}
             * @readonly
             */
            _this.destroyed = false;
            /**
             * The resource used by this BaseTexture, there can only
             * be one resource per BaseTexture, but textures can share
             * resources.
             *
             * @member {PIXI.resources.Resource}
             * @readonly
             */
            _this.resource = null;
            /**
             * Number of the texture batch, used by multi-texture renderers
             *
             * @member {number}
             */
            _this._batchEnabled = 0;
            /**
             * Location inside texture batch, used by multi-texture renderers
             *
             * @member {number}
             */
            _this._batchLocation = 0;
            /**
             * Whether its a part of another texture, handled by ArrayResource or CubeResource
             *
             * @member {PIXI.BaseTexture}
             */
            _this.parentTextureArray = null;
            /**
             * Fired when a not-immediately-available source finishes loading.
             *
             * @protected
             * @event PIXI.BaseTexture#loaded
             * @param {PIXI.BaseTexture} baseTexture - Resource loaded.
             */
            /**
             * Fired when a not-immediately-available source fails to load.
             *
             * @protected
             * @event PIXI.BaseTexture#error
             * @param {PIXI.BaseTexture} baseTexture - Resource errored.
             * @param {ErrorEvent} event - Load error event.
             */
            /**
             * Fired when BaseTexture is updated.
             *
             * @protected
             * @event PIXI.BaseTexture#loaded
             * @param {PIXI.BaseTexture} baseTexture - Resource loaded.
             */
            /**
             * Fired when BaseTexture is updated.
             *
             * @protected
             * @event PIXI.BaseTexture#update
             * @param {PIXI.BaseTexture} baseTexture - Instance of texture being updated.
             */
            /**
             * Fired when BaseTexture is destroyed.
             *
             * @protected
             * @event PIXI.BaseTexture#dispose
             * @param {PIXI.BaseTexture} baseTexture - Instance of texture being destroyed.
             */
            // Set the resource
            _this.setResource(resource);
            return _this;
        }
        Object.defineProperty(BaseTexture.prototype, "realWidth", {
            /**
             * Pixel width of the source of this texture
             *
             * @readonly
             * @member {number}
             */
            get: function () {
                return Math.ceil((this.width * this.resolution) - 1e-4);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseTexture.prototype, "realHeight", {
            /**
             * Pixel height of the source of this texture
             *
             * @readonly
             * @member {number}
             */
            get: function () {
                return Math.ceil((this.height * this.resolution) - 1e-4);
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Changes style options of BaseTexture
         *
         * @param {PIXI.SCALE_MODES} [scaleMode] - Pixi scalemode
         * @param {PIXI.MIPMAP_MODES} [mipmap] - enable mipmaps
         * @returns {PIXI.BaseTexture} this
         */
        BaseTexture.prototype.setStyle = function (scaleMode, mipmap) {
            var dirty;
            if (scaleMode !== undefined && scaleMode !== this.scaleMode) {
                this.scaleMode = scaleMode;
                dirty = true;
            }
            if (mipmap !== undefined && mipmap !== this.mipmap) {
                this.mipmap = mipmap;
                dirty = true;
            }
            if (dirty) {
                this.dirtyStyleId++;
            }
            return this;
        };
        /**
         * Changes w/h/resolution. Texture becomes valid if width and height are greater than zero.
         *
         * @param {number} width - Visual width
         * @param {number} height - Visual height
         * @param {number} [resolution] - Optionally set resolution
         * @returns {PIXI.BaseTexture} this
         */
        BaseTexture.prototype.setSize = function (width, height, resolution) {
            this.resolution = resolution || this.resolution;
            this.width = width;
            this.height = height;
            this._refreshPOT();
            this.update();
            return this;
        };
        /**
         * Sets real size of baseTexture, preserves current resolution.
         *
         * @param {number} realWidth - Full rendered width
         * @param {number} realHeight - Full rendered height
         * @param {number} [resolution] - Optionally set resolution
         * @returns {PIXI.BaseTexture} this
         */
        BaseTexture.prototype.setRealSize = function (realWidth, realHeight, resolution) {
            this.resolution = resolution || this.resolution;
            this.width = realWidth / this.resolution;
            this.height = realHeight / this.resolution;
            this._refreshPOT();
            this.update();
            return this;
        };
        /**
         * Refresh check for isPowerOfTwo texture based on size
         *
         * @private
         */
        BaseTexture.prototype._refreshPOT = function () {
            this.isPowerOfTwo = isPow2(this.realWidth) && isPow2(this.realHeight);
        };
        /**
         * Changes resolution
         *
         * @param {number} resolution - res
         * @returns {PIXI.BaseTexture} this
         */
        BaseTexture.prototype.setResolution = function (resolution) {
            var oldResolution = this.resolution;
            if (oldResolution === resolution) {
                return this;
            }
            this.resolution = resolution;
            if (this.valid) {
                this.width = this.width * oldResolution / resolution;
                this.height = this.height * oldResolution / resolution;
                this.emit('update', this);
            }
            this._refreshPOT();
            return this;
        };
        /**
         * Sets the resource if it wasn't set. Throws error if resource already present
         *
         * @param {PIXI.resources.Resource} resource - that is managing this BaseTexture
         * @returns {PIXI.BaseTexture} this
         */
        BaseTexture.prototype.setResource = function (resource) {
            if (this.resource === resource) {
                return this;
            }
            if (this.resource) {
                throw new Error('Resource can be set only once');
            }
            resource.bind(this);
            this.resource = resource;
            return this;
        };
        /**
         * Invalidates the object. Texture becomes valid if width and height are greater than zero.
         */
        BaseTexture.prototype.update = function () {
            if (!this.valid) {
                if (this.width > 0 && this.height > 0) {
                    this.valid = true;
                    this.emit('loaded', this);
                    this.emit('update', this);
                }
            }
            else {
                this.dirtyId++;
                this.dirtyStyleId++;
                this.emit('update', this);
            }
        };
        /**
         * Handle errors with resources.
         * @private
         * @param {ErrorEvent} event - Error event emitted.
         */
        BaseTexture.prototype.onError = function (event) {
            this.emit('error', this, event);
        };
        /**
         * Destroys this base texture.
         * The method stops if resource doesn't want this texture to be destroyed.
         * Removes texture from all caches.
         */
        BaseTexture.prototype.destroy = function () {
            // remove and destroy the resource
            if (this.resource) {
                this.resource.unbind(this);
                // only destroy resourced created internally
                if (this.resource.internal) {
                    this.resource.destroy();
                }
                this.resource = null;
            }
            if (this.cacheId) {
                delete BaseTextureCache[this.cacheId];
                delete TextureCache[this.cacheId];
                this.cacheId = null;
            }
            // finally let the WebGL renderer know..
            this.dispose();
            BaseTexture.removeFromCache(this);
            this.textureCacheIds = null;
            this.destroyed = true;
        };
        /**
         * Frees the texture from WebGL memory without destroying this texture object.
         * This means you can still use the texture later which will upload it to GPU
         * memory again.
         *
         * @fires PIXI.BaseTexture#dispose
         */
        BaseTexture.prototype.dispose = function () {
            this.emit('dispose', this);
        };
        /**
         * Utility function for BaseTexture|Texture cast
         */
        BaseTexture.prototype.castToBaseTexture = function () {
            return this;
        };
        /**
         * Helper function that creates a base texture based on the source you provide.
         * The source can be - image url, image element, canvas element. If the
         * source is an image url or an image element and not in the base texture
         * cache, it will be created and loaded.
         *
         * @static
         * @param {string|HTMLImageElement|HTMLCanvasElement|SVGElement|HTMLVideoElement} source - The
         *        source to create base texture from.
         * @param {object} [options] See {@link PIXI.BaseTexture}'s constructor for options.
         * @param {boolean} [strict] - Enforce strict-mode, see {@link PIXI.settings.STRICT_TEXTURE_CACHE}.
         * @returns {PIXI.BaseTexture} The new base texture.
         */
        BaseTexture.from = function (source, options, strict) {
            if (strict === void 0) { strict = settings.STRICT_TEXTURE_CACHE; }
            var isFrame = typeof source === 'string';
            var cacheId = null;
            if (isFrame) {
                cacheId = source;
            }
            else {
                if (!source._pixiId) {
                    source._pixiId = "pixiid_" + uid();
                }
                cacheId = source._pixiId;
            }
            var baseTexture = BaseTextureCache[cacheId];
            // Strict-mode rejects invalid cacheIds
            if (isFrame && strict && !baseTexture) {
                throw new Error("The cacheId \"" + cacheId + "\" does not exist in BaseTextureCache.");
            }
            if (!baseTexture) {
                baseTexture = new BaseTexture(source, options);
                baseTexture.cacheId = cacheId;
                BaseTexture.addToCache(baseTexture, cacheId);
            }
            return baseTexture;
        };
        /**
         * Create a new BaseTexture with a BufferResource from a Float32Array.
         * RGBA values are floats from 0 to 1.
         * @static
         * @param {Float32Array|Uint8Array} buffer - The optional array to use, if no data
         *        is provided, a new Float32Array is created.
         * @param {number} width - Width of the resource
         * @param {number} height - Height of the resource
         * @param {object} [options] See {@link PIXI.BaseTexture}'s constructor for options.
         * @return {PIXI.BaseTexture} The resulting new BaseTexture
         */
        BaseTexture.fromBuffer = function (buffer, width, height, options) {
            buffer = buffer || new Float32Array(width * height * 4);
            var resource = new BufferResource(buffer, { width: width, height: height });
            var type = buffer instanceof Float32Array ? TYPES.FLOAT : TYPES.UNSIGNED_BYTE;
            return new BaseTexture(resource, Object.assign(defaultBufferOptions, options || { width: width, height: height, type: type }));
        };
        /**
         * Adds a BaseTexture to the global BaseTextureCache. This cache is shared across the whole PIXI object.
         *
         * @static
         * @param {PIXI.BaseTexture} baseTexture - The BaseTexture to add to the cache.
         * @param {string} id - The id that the BaseTexture will be stored against.
         */
        BaseTexture.addToCache = function (baseTexture, id) {
            if (id) {
                if (baseTexture.textureCacheIds.indexOf(id) === -1) {
                    baseTexture.textureCacheIds.push(id);
                }
                if (BaseTextureCache[id]) {
                    // eslint-disable-next-line no-console
                    console.warn("BaseTexture added to the cache with an id [" + id + "] that already had an entry");
                }
                BaseTextureCache[id] = baseTexture;
            }
        };
        /**
         * Remove a BaseTexture from the global BaseTextureCache.
         *
         * @static
         * @param {string|PIXI.BaseTexture} baseTexture - id of a BaseTexture to be removed, or a BaseTexture instance itself.
         * @return {PIXI.BaseTexture|null} The BaseTexture that was removed.
         */
        BaseTexture.removeFromCache = function (baseTexture) {
            if (typeof baseTexture === 'string') {
                var baseTextureFromCache = BaseTextureCache[baseTexture];
                if (baseTextureFromCache) {
                    var index = baseTextureFromCache.textureCacheIds.indexOf(baseTexture);
                    if (index > -1) {
                        baseTextureFromCache.textureCacheIds.splice(index, 1);
                    }
                    delete BaseTextureCache[baseTexture];
                    return baseTextureFromCache;
                }
            }
            else if (baseTexture && baseTexture.textureCacheIds) {
                for (var i = 0; i < baseTexture.textureCacheIds.length; ++i) {
                    delete BaseTextureCache[baseTexture.textureCacheIds[i]];
                }
                baseTexture.textureCacheIds.length = 0;
                return baseTexture;
            }
            return null;
        };
        /**
         * Global number of the texture batch, used by multi-texture renderers
         *
         * @static
         * @member {number}
         */
        BaseTexture._globalBatch = 0;
        return BaseTexture;
    }(eventemitter3));

    /**
     * Resource that can manage several resource (items) inside.
     * All resources need to have the same pixel size.
     * Parent class for CubeResource and ArrayResource
     *
     * @class
     * @extends PIXI.resources.Resource
     * @memberof PIXI.resources
     * @param {object} [options] Options to for Resource constructor
     * @param {number} [options.width] - Width of the resource
     * @param {number} [options.height] - Height of the resource
     */
    var AbstractMultiResource = /** @class */ (function (_super) {
        __extends(AbstractMultiResource, _super);
        function AbstractMultiResource(length, options) {
            var _this = this;
            var _a = options || {}, width = _a.width, height = _a.height;
            _this = _super.call(this, width, height) || this;
            /**
             * Collection of partial baseTextures that correspond to resources
             * @member {Array<PIXI.BaseTexture>}
             * @readonly
             */
            _this.items = [];
            /**
             * Dirty IDs for each part
             * @member {Array<number>}
             * @readonly
             */
            _this.itemDirtyIds = [];
            for (var i = 0; i < length; i++) {
                var partTexture = new BaseTexture();
                _this.items.push(partTexture);
                // -2 - first run of texture array upload
                // -1 - texture item was allocated
                // >=0 - texture item uploaded , in sync with items[i].dirtyId
                _this.itemDirtyIds.push(-2);
            }
            /**
             * Number of elements in array
             *
             * @member {number}
             * @readonly
             */
            _this.length = length;
            /**
             * Promise when loading
             * @member {Promise}
             * @private
             * @default null
             */
            _this._load = null;
            /**
             * Bound baseTexture, there can only be one
             * @member {PIXI.BaseTexture}
             */
            _this.baseTexture = null;
            return _this;
        }
        /**
         * used from ArrayResource and CubeResource constructors
         * @param {Array<*>} resources - Can be resources, image elements, canvas, etc. ,
         *  length should be same as constructor length
         * @param {object} [options] - detect options for resources
         * @protected
         */
        AbstractMultiResource.prototype.initFromArray = function (resources, options) {
            for (var i = 0; i < this.length; i++) {
                if (!resources[i]) {
                    continue;
                }
                if (resources[i].castToBaseTexture) {
                    this.addBaseTextureAt(resources[i].castToBaseTexture(), i);
                }
                else if (resources[i] instanceof Resource) {
                    this.addResourceAt(resources[i], i);
                }
                else {
                    this.addResourceAt(autoDetectResource(resources[i], options), i);
                }
            }
        };
        /**
         * Destroy this BaseImageResource
         * @override
         */
        AbstractMultiResource.prototype.dispose = function () {
            for (var i = 0, len = this.length; i < len; i++) {
                this.items[i].destroy();
            }
            this.items = null;
            this.itemDirtyIds = null;
            this._load = null;
        };
        /**
         * Set a resource by ID
         *
         * @param {PIXI.resources.Resource} resource
         * @param {number} index - Zero-based index of resource to set
         * @return {PIXI.resources.ArrayResource} Instance for chaining
         */
        AbstractMultiResource.prototype.addResourceAt = function (resource, index) {
            if (!this.items[index]) {
                throw new Error("Index " + index + " is out of bounds");
            }
            // Inherit the first resource dimensions
            if (resource.valid && !this.valid) {
                this.resize(resource.width, resource.height);
            }
            this.items[index].setResource(resource);
            return this;
        };
        /**
         * Set the parent base texture
         * @member {PIXI.BaseTexture}
         * @override
         */
        AbstractMultiResource.prototype.bind = function (baseTexture) {
            if (this.baseTexture !== null) {
                throw new Error('Only one base texture per TextureArray is allowed');
            }
            _super.prototype.bind.call(this, baseTexture);
            for (var i = 0; i < this.length; i++) {
                this.items[i].parentTextureArray = baseTexture;
                this.items[i].on('update', baseTexture.update, baseTexture);
            }
        };
        /**
         * Unset the parent base texture
         * @member {PIXI.BaseTexture}
         * @override
         */
        AbstractMultiResource.prototype.unbind = function (baseTexture) {
            _super.prototype.unbind.call(this, baseTexture);
            for (var i = 0; i < this.length; i++) {
                this.items[i].parentTextureArray = null;
                this.items[i].off('update', baseTexture.update, baseTexture);
            }
        };
        /**
         * Load all the resources simultaneously
         * @override
         * @return {Promise<void>} When load is resolved
         */
        AbstractMultiResource.prototype.load = function () {
            var _this = this;
            if (this._load) {
                return this._load;
            }
            var resources = this.items.map(function (item) { return item.resource; }).filter(function (item) { return item; });
            // TODO: also implement load part-by-part strategy
            var promises = resources.map(function (item) { return item.load(); });
            this._load = Promise.all(promises)
                .then(function () {
                var _a = _this.items[0], realWidth = _a.realWidth, realHeight = _a.realHeight;
                _this.resize(realWidth, realHeight);
                return Promise.resolve(_this);
            });
            return this._load;
        };
        return AbstractMultiResource;
    }(Resource));

    /**
     * A resource that contains a number of sources.
     *
     * @class
     * @extends PIXI.resources.Resource
     * @memberof PIXI.resources
     * @param {number|Array<*>} source - Number of items in array or the collection
     *        of image URLs to use. Can also be resources, image elements, canvas, etc.
     * @param {object} [options] - Options to apply to {@link PIXI.resources.autoDetectResource}
     * @param {number} [options.width] - Width of the resource
     * @param {number} [options.height] - Height of the resource
     */
    var ArrayResource = /** @class */ (function (_super) {
        __extends(ArrayResource, _super);
        function ArrayResource(source, options) {
            var _this = this;
            var _a = options || {}, width = _a.width, height = _a.height;
            var urls;
            var length;
            if (Array.isArray(source)) {
                urls = source;
                length = source.length;
            }
            else {
                length = source;
            }
            _this = _super.call(this, length, { width: width, height: height }) || this;
            if (urls) {
                _this.initFromArray(urls, options);
            }
            return _this;
        }
        /**
         * Set a baseTexture by ID,
         * ArrayResource just takes resource from it, nothing more
         *
         * @param {PIXI.BaseTexture} baseTexture
         * @param {number} index - Zero-based index of resource to set
         * @return {PIXI.resources.ArrayResource} Instance for chaining
         */
        ArrayResource.prototype.addBaseTextureAt = function (baseTexture, index) {
            if (baseTexture.resource) {
                this.addResourceAt(baseTexture.resource, index);
            }
            else {
                throw new Error('ArrayResource does not support RenderTexture');
            }
            return this;
        };
        /**
         * Add binding
         * @member {PIXI.BaseTexture}
         * @override
         */
        ArrayResource.prototype.bind = function (baseTexture) {
            _super.prototype.bind.call(this, baseTexture);
            baseTexture.target = TARGETS.TEXTURE_2D_ARRAY;
        };
        /**
         * Upload the resources to the GPU.
         * @param {PIXI.Renderer} renderer
         * @param {PIXI.BaseTexture} texture
         * @param {PIXI.GLTexture} glTexture
         * @returns {boolean} whether texture was uploaded
         */
        ArrayResource.prototype.upload = function (renderer, texture, glTexture) {
            var _a = this, length = _a.length, itemDirtyIds = _a.itemDirtyIds, items = _a.items;
            var gl = renderer.gl;
            if (glTexture.dirtyId < 0) {
                gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, texture.format, this._width, this._height, length, 0, texture.format, texture.type, null);
            }
            for (var i = 0; i < length; i++) {
                var item = items[i];
                if (itemDirtyIds[i] < item.dirtyId) {
                    itemDirtyIds[i] = item.dirtyId;
                    if (item.valid) {
                        gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, // xoffset
                        0, // yoffset
                        i, // zoffset
                        item.resource.width, item.resource.height, 1, texture.format, texture.type, item.resource.source);
                    }
                }
            }
            return true;
        };
        return ArrayResource;
    }(AbstractMultiResource));

    /**
     * Base for all the image/canvas resources
     * @class
     * @extends PIXI.resources.Resource
     * @memberof PIXI.resources
     */
    var BaseImageResource = /** @class */ (function (_super) {
        __extends(BaseImageResource, _super);
        /**
         * @param {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|SVGElement} source
         */
        function BaseImageResource(source) {
            var _this = this;
            var sourceAny = source;
            var width = sourceAny.naturalWidth || sourceAny.videoWidth || sourceAny.width;
            var height = sourceAny.naturalHeight || sourceAny.videoHeight || sourceAny.height;
            _this = _super.call(this, width, height) || this;
            /**
             * The source element
             * @member {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|SVGElement}
             * @readonly
             */
            _this.source = source;
            /**
             * If set to `true`, will force `texImage2D` over `texSubImage2D` for uploading.
             * Certain types of media (e.g. video) using `texImage2D` is more performant.
             * @member {boolean}
             * @default false
             * @private
             */
            _this.noSubImage = false;
            return _this;
        }
        /**
         * Set cross origin based detecting the url and the crossorigin
         * @protected
         * @param {HTMLElement} element - Element to apply crossOrigin
         * @param {string} url - URL to check
         * @param {boolean|string} [crossorigin=true] - Cross origin value to use
         */
        BaseImageResource.crossOrigin = function (element, url, crossorigin) {
            if (crossorigin === undefined && url.indexOf('data:') !== 0) {
                element.crossOrigin = determineCrossOrigin(url);
            }
            else if (crossorigin !== false) {
                element.crossOrigin = typeof crossorigin === 'string' ? crossorigin : 'anonymous';
            }
        };
        /**
         * Upload the texture to the GPU.
         * @param {PIXI.Renderer} renderer - Upload to the renderer
         * @param {PIXI.BaseTexture} baseTexture - Reference to parent texture
         * @param {PIXI.GLTexture} glTexture
         * @param {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|SVGElement} [source] (optional)
         * @returns {boolean} true is success
         */
        BaseImageResource.prototype.upload = function (renderer, baseTexture, glTexture, source) {
            var gl = renderer.gl;
            var width = baseTexture.realWidth;
            var height = baseTexture.realHeight;
            source = source || this.source;
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, baseTexture.alphaMode === ALPHA_MODES.UNPACK);
            if (!this.noSubImage
                && baseTexture.target === gl.TEXTURE_2D
                && glTexture.width === width
                && glTexture.height === height) {
                gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, baseTexture.format, baseTexture.type, source);
            }
            else {
                glTexture.width = width;
                glTexture.height = height;
                gl.texImage2D(baseTexture.target, 0, baseTexture.format, baseTexture.format, baseTexture.type, source);
            }
            return true;
        };
        /**
         * Checks if source width/height was changed, resize can cause extra baseTexture update.
         * Triggers one update in any case.
         */
        BaseImageResource.prototype.update = function () {
            if (this.destroyed) {
                return;
            }
            var source = this.source;
            var width = source.naturalWidth || source.videoWidth || source.width;
            var height = source.naturalHeight || source.videoHeight || source.height;
            this.resize(width, height);
            _super.prototype.update.call(this);
        };
        /**
         * Destroy this BaseImageResource
         * @override
         */
        BaseImageResource.prototype.dispose = function () {
            this.source = null;
        };
        return BaseImageResource;
    }(Resource));

    /**
     * @interface OffscreenCanvas
     */
    /**
     * Resource type for HTMLCanvasElement.
     * @class
     * @extends PIXI.resources.BaseImageResource
     * @memberof PIXI.resources
     * @param {HTMLCanvasElement} source - Canvas element to use
     */
    var CanvasResource = /** @class */ (function (_super) {
        __extends(CanvasResource, _super);
        function CanvasResource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Used to auto-detect the type of resource.
         *
         * @static
         * @param {HTMLCanvasElement|OffscreenCanvas} source - The source object
         * @return {boolean} `true` if source is HTMLCanvasElement or OffscreenCanvas
         */
        CanvasResource.test = function (source) {
            var OffscreenCanvas = window.OffscreenCanvas;
            // Check for browsers that don't yet support OffscreenCanvas
            if (OffscreenCanvas && source instanceof OffscreenCanvas) {
                return true;
            }
            return source instanceof HTMLCanvasElement;
        };
        return CanvasResource;
    }(BaseImageResource));

    /**
     * Resource for a CubeTexture which contains six resources.
     *
     * @class
     * @extends PIXI.resources.ArrayResource
     * @memberof PIXI.resources
     * @param {Array<string|PIXI.resources.Resource>} [source] - Collection of URLs or resources
     *        to use as the sides of the cube.
     * @param {object} [options] - ImageResource options
     * @param {number} [options.width] - Width of resource
     * @param {number} [options.height] - Height of resource
     * @param {number} [options.autoLoad=true] - Whether to auto-load resources
     * @param {number} [options.linkBaseTexture=true] - In case BaseTextures are supplied,
     *   whether to copy them or use
     */
    var CubeResource = /** @class */ (function (_super) {
        __extends(CubeResource, _super);
        function CubeResource(source, options) {
            var _this = this;
            var _a = options || {}, width = _a.width, height = _a.height, autoLoad = _a.autoLoad, linkBaseTexture = _a.linkBaseTexture;
            if (source && source.length !== CubeResource.SIDES) {
                throw new Error("Invalid length. Got " + source.length + ", expected 6");
            }
            _this = _super.call(this, 6, { width: width, height: height }) || this;
            for (var i = 0; i < CubeResource.SIDES; i++) {
                _this.items[i].target = TARGETS.TEXTURE_CUBE_MAP_POSITIVE_X + i;
            }
            /**
             * In case BaseTextures are supplied, whether to use same resource or bind baseTexture itself
             * @member {boolean}
             * @protected
             */
            _this.linkBaseTexture = linkBaseTexture !== false;
            if (source) {
                _this.initFromArray(source, options);
            }
            if (autoLoad !== false) {
                _this.load();
            }
            return _this;
        }
        /**
         * Add binding
         *
         * @override
         * @param {PIXI.BaseTexture} baseTexture - parent base texture
         */
        CubeResource.prototype.bind = function (baseTexture) {
            _super.prototype.bind.call(this, baseTexture);
            baseTexture.target = TARGETS.TEXTURE_CUBE_MAP;
        };
        CubeResource.prototype.addBaseTextureAt = function (baseTexture, index, linkBaseTexture) {
            if (linkBaseTexture === undefined) {
                linkBaseTexture = this.linkBaseTexture;
            }
            if (!this.items[index]) {
                throw new Error("Index " + index + " is out of bounds");
            }
            if (!this.linkBaseTexture
                || baseTexture.parentTextureArray
                || Object.keys(baseTexture._glTextures).length > 0) {
                // copy mode
                if (baseTexture.resource) {
                    this.addResourceAt(baseTexture.resource, index);
                }
                else {
                    throw new Error("CubeResource does not support copying of renderTexture.");
                }
            }
            else {
                // link mode, the difficult one!
                baseTexture.target = TARGETS.TEXTURE_CUBE_MAP_POSITIVE_X + index;
                baseTexture.parentTextureArray = this.baseTexture;
                this.items[index] = baseTexture;
            }
            if (baseTexture.valid && !this.valid) {
                this.resize(baseTexture.realWidth, baseTexture.realHeight);
            }
            this.items[index] = baseTexture;
            return this;
        };
        /**
         * Upload the resource
         *
         * @returns {boolean} true is success
         */
        CubeResource.prototype.upload = function (renderer, _baseTexture, glTexture) {
            var dirty = this.itemDirtyIds;
            for (var i = 0; i < CubeResource.SIDES; i++) {
                var side = this.items[i];
                if (dirty[i] < side.dirtyId) {
                    if (side.valid && side.resource) {
                        side.resource.upload(renderer, side, glTexture);
                        dirty[i] = side.dirtyId;
                    }
                    else if (dirty[i] < -1) {
                        // either item is not valid yet, either its a renderTexture
                        // allocate the memory
                        renderer.gl.texImage2D(side.target, 0, glTexture.internalFormat, _baseTexture.realWidth, _baseTexture.realHeight, 0, _baseTexture.format, glTexture.type, null);
                        dirty[i] = -1;
                    }
                }
            }
            return true;
        };
        /**
         * Used to auto-detect the type of resource.
         *
         * @static
         * @param {object} source - The source object
         * @return {boolean} `true` if source is an array of 6 elements
         */
        CubeResource.test = function (source) {
            return Array.isArray(source) && source.length === CubeResource.SIDES;
        };
        /**
         * Number of texture sides to store for CubeResources
         *
         * @name PIXI.resources.CubeResource.SIDES
         * @static
         * @member {number}
         * @default 6
         */
        CubeResource.SIDES = 6;
        return CubeResource;
    }(AbstractMultiResource));

    /**
     * Resource type for HTMLImageElement.
     * @class
     * @extends PIXI.resources.BaseImageResource
     * @memberof PIXI.resources
     */
    var ImageResource = /** @class */ (function (_super) {
        __extends(ImageResource, _super);
        /**
         * @param {HTMLImageElement|string} source - image source or URL
         * @param {object} [options]
         * @param {boolean} [options.autoLoad=true] - start loading process
         * @param {boolean} [options.createBitmap=PIXI.settings.CREATE_IMAGE_BITMAP] - whether its required to create
         *        a bitmap before upload
         * @param {boolean} [options.crossorigin=true] - Load image using cross origin
         * @param {PIXI.ALPHA_MODES} [options.alphaMode=PIXI.ALPHA_MODES.UNPACK] - Premultiply image alpha in bitmap
         */
        function ImageResource(source, options) {
            var _this = this;
            options = options || {};
            if (!(source instanceof HTMLImageElement)) {
                var imageElement = new Image();
                BaseImageResource.crossOrigin(imageElement, source, options.crossorigin);
                imageElement.src = source;
                source = imageElement;
            }
            _this = _super.call(this, source) || this;
            // FireFox 68, and possibly other versions, seems like setting the HTMLImageElement#width and #height
            // to non-zero values before its loading completes if images are in a cache.
            // Because of this, need to set the `_width` and the `_height` to zero to avoid uploading incomplete images.
            // Please refer to the issue #5968 (https://github.com/pixijs/pixi.js/issues/5968).
            if (!source.complete && !!_this._width && !!_this._height) {
                _this._width = 0;
                _this._height = 0;
            }
            /**
             * URL of the image source
             * @member {string}
             */
            _this.url = source.src;
            /**
             * When process is completed
             * @member {Promise<void>}
             * @private
             */
            _this._process = null;
            /**
             * If the image should be disposed after upload
             * @member {boolean}
             * @default false
             */
            _this.preserveBitmap = false;
            /**
             * If capable, convert the image using createImageBitmap API
             * @member {boolean}
             * @default PIXI.settings.CREATE_IMAGE_BITMAP
             */
            _this.createBitmap = (options.createBitmap !== undefined
                ? options.createBitmap : settings.CREATE_IMAGE_BITMAP) && !!window.createImageBitmap;
            /**
             * Controls texture alphaMode field
             * Copies from options
             * Default is `null`, copies option from baseTexture
             *
             * @member {PIXI.ALPHA_MODES|null}
             * @readonly
             */
            _this.alphaMode = typeof options.alphaMode === 'number' ? options.alphaMode : null;
            if (options.premultiplyAlpha !== undefined) {
                // triggers deprecation
                _this.premultiplyAlpha = options.premultiplyAlpha;
            }
            /**
             * The ImageBitmap element created for HTMLImageElement
             * @member {ImageBitmap}
             * @default null
             */
            _this.bitmap = null;
            /**
             * Promise when loading
             * @member {Promise<void>}
             * @private
             * @default null
             */
            _this._load = null;
            if (options.autoLoad !== false) {
                _this.load();
            }
            return _this;
        }
        /**
         * returns a promise when image will be loaded and processed
         *
         * @param {boolean} [createBitmap] - whether process image into bitmap
         * @returns {Promise<void>}
         */
        ImageResource.prototype.load = function (createBitmap) {
            var _this = this;
            if (this._load) {
                return this._load;
            }
            if (createBitmap !== undefined) {
                this.createBitmap = createBitmap;
            }
            this._load = new Promise(function (resolve, reject) {
                var source = _this.source;
                _this.url = source.src;
                var completed = function () {
                    if (_this.destroyed) {
                        return;
                    }
                    source.onload = null;
                    source.onerror = null;
                    _this.resize(source.width, source.height);
                    _this._load = null;
                    if (_this.createBitmap) {
                        resolve(_this.process());
                    }
                    else {
                        resolve(_this);
                    }
                };
                if (source.complete && source.src) {
                    completed();
                }
                else {
                    source.onload = completed;
                    source.onerror = function (event) {
                        // Avoids Promise freezing when resource broken
                        reject(event);
                        _this.onError.emit(event);
                    };
                }
            });
            return this._load;
        };
        /**
         * Called when we need to convert image into BitmapImage.
         * Can be called multiple times, real promise is cached inside.
         *
         * @returns {Promise<void>} cached promise to fill that bitmap
         */
        ImageResource.prototype.process = function () {
            var _this = this;
            var source = this.source;
            if (this._process !== null) {
                return this._process;
            }
            if (this.bitmap !== null || !window.createImageBitmap) {
                return Promise.resolve(this);
            }
            this._process = window.createImageBitmap(source, 0, 0, source.width, source.height, {
                premultiplyAlpha: this.alphaMode === ALPHA_MODES.UNPACK ? 'premultiply' : 'none',
            })
                .then(function (bitmap) {
                if (_this.destroyed) {
                    return Promise.reject();
                }
                _this.bitmap = bitmap;
                _this.update();
                _this._process = null;
                return Promise.resolve(_this);
            });
            return this._process;
        };
        /**
         * Upload the image resource to GPU.
         *
         * @param {PIXI.Renderer} renderer - Renderer to upload to
         * @param {PIXI.BaseTexture} baseTexture - BaseTexture for this resource
         * @param {PIXI.GLTexture} glTexture - GLTexture to use
         * @returns {boolean} true is success
         */
        ImageResource.prototype.upload = function (renderer, baseTexture, glTexture) {
            if (typeof this.alphaMode === 'number') {
                // bitmap stores unpack premultiply flag, we dont have to notify texImage2D about it
                baseTexture.alphaMode = this.alphaMode;
            }
            if (!this.createBitmap) {
                return _super.prototype.upload.call(this, renderer, baseTexture, glTexture);
            }
            if (!this.bitmap) {
                // yeah, ignore the output
                this.process();
                if (!this.bitmap) {
                    return false;
                }
            }
            _super.prototype.upload.call(this, renderer, baseTexture, glTexture, this.bitmap);
            if (!this.preserveBitmap) {
                // checks if there are other renderers that possibly need this bitmap
                var flag = true;
                var glTextures = baseTexture._glTextures;
                for (var key in glTextures) {
                    var otherTex = glTextures[key];
                    if (otherTex !== glTexture && otherTex.dirtyId !== baseTexture.dirtyId) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    if (this.bitmap.close) {
                        this.bitmap.close();
                    }
                    this.bitmap = null;
                }
            }
            return true;
        };
        /**
         * Destroys this texture
         * @override
         */
        ImageResource.prototype.dispose = function () {
            this.source.onload = null;
            this.source.onerror = null;
            _super.prototype.dispose.call(this);
            if (this.bitmap) {
                this.bitmap.close();
                this.bitmap = null;
            }
            this._process = null;
            this._load = null;
        };
        /**
         * Used to auto-detect the type of resource.
         *
         * @static
         * @param {string|HTMLImageElement} source - The source object
         * @return {boolean} `true` if source is string or HTMLImageElement
         */
        ImageResource.test = function (source) {
            return typeof source === 'string' || source instanceof HTMLImageElement;
        };
        return ImageResource;
    }(BaseImageResource));

    /**
     * Resource type for SVG elements and graphics.
     * @class
     * @extends PIXI.resources.BaseImageResource
     * @memberof PIXI.resources
     * @param {string} source - Base64 encoded SVG element or URL for SVG file.
     * @param {object} [options] - Options to use
     * @param {number} [options.scale=1] - Scale to apply to SVG. Overridden by...
     * @param {number} [options.width] - Rasterize SVG this wide. Aspect ratio preserved if height not specified.
     * @param {number} [options.height] - Rasterize SVG this high. Aspect ratio preserved if width not specified.
     * @param {boolean} [options.autoLoad=true] - Start loading right away.
     */
    var SVGResource = /** @class */ (function (_super) {
        __extends(SVGResource, _super);
        function SVGResource(sourceBase64, options) {
            var _this = this;
            options = options || {};
            _this = _super.call(this, document.createElement('canvas')) || this;
            _this._width = 0;
            _this._height = 0;
            /**
             * Base64 encoded SVG element or URL for SVG file
             * @readonly
             * @member {string}
             */
            _this.svg = sourceBase64;
            /**
             * The source scale to apply when rasterizing on load
             * @readonly
             * @member {number}
             */
            _this.scale = options.scale || 1;
            /**
             * A width override for rasterization on load
             * @readonly
             * @member {number}
             */
            _this._overrideWidth = options.width;
            /**
             * A height override for rasterization on load
             * @readonly
             * @member {number}
             */
            _this._overrideHeight = options.height;
            /**
             * Call when completely loaded
             * @private
             * @member {function}
             */
            _this._resolve = null;
            /**
             * Cross origin value to use
             * @private
             * @member {boolean|string}
             */
            _this._crossorigin = options.crossorigin;
            /**
             * Promise when loading
             * @member {Promise<void>}
             * @private
             * @default null
             */
            _this._load = null;
            if (options.autoLoad !== false) {
                _this.load();
            }
            return _this;
        }
        SVGResource.prototype.load = function () {
            var _this = this;
            if (this._load) {
                return this._load;
            }
            this._load = new Promise(function (resolve) {
                // Save this until after load is finished
                _this._resolve = function () {
                    _this.resize(_this.source.width, _this.source.height);
                    resolve(_this);
                };
                // Convert SVG inline string to data-uri
                if ((/^\<svg/).test(_this.svg.trim())) {
                    if (!btoa) {
                        throw new Error('Your browser doesn\'t support base64 conversions.');
                    }
                    _this.svg = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(_this.svg)));
                }
                _this._loadSvg();
            });
            return this._load;
        };
        /**
         * Loads an SVG image from `imageUrl` or `data URL`.
         *
         * @private
         */
        SVGResource.prototype._loadSvg = function () {
            var _this = this;
            var tempImage = new Image();
            BaseImageResource.crossOrigin(tempImage, this.svg, this._crossorigin);
            tempImage.src = this.svg;
            tempImage.onerror = function (event) {
                if (!_this._resolve) {
                    return;
                }
                tempImage.onerror = null;
                _this.onError.emit(event);
            };
            tempImage.onload = function () {
                if (!_this._resolve) {
                    return;
                }
                var svgWidth = tempImage.width;
                var svgHeight = tempImage.height;
                if (!svgWidth || !svgHeight) {
                    throw new Error('The SVG image must have width and height defined (in pixels), canvas API needs them.');
                }
                // Set render size
                var width = svgWidth * _this.scale;
                var height = svgHeight * _this.scale;
                if (_this._overrideWidth || _this._overrideHeight) {
                    width = _this._overrideWidth || _this._overrideHeight / svgHeight * svgWidth;
                    height = _this._overrideHeight || _this._overrideWidth / svgWidth * svgHeight;
                }
                width = Math.round(width);
                height = Math.round(height);
                // Create a canvas element
                var canvas = _this.source;
                canvas.width = width;
                canvas.height = height;
                canvas._pixiId = "canvas_" + uid();
                // Draw the Svg to the canvas
                canvas
                    .getContext('2d')
                    .drawImage(tempImage, 0, 0, svgWidth, svgHeight, 0, 0, width, height);
                _this._resolve();
                _this._resolve = null;
            };
        };
        /**
         * Get size from an svg string using regexp.
         *
         * @method
         * @param {string} svgString - a serialized svg element
         * @return {PIXI.ISize} image extension
         */
        SVGResource.getSize = function (svgString) {
            var sizeMatch = SVGResource.SVG_SIZE.exec(svgString);
            var size = {};
            if (sizeMatch) {
                size[sizeMatch[1]] = Math.round(parseFloat(sizeMatch[3]));
                size[sizeMatch[5]] = Math.round(parseFloat(sizeMatch[7]));
            }
            return size;
        };
        /**
         * Destroys this texture
         * @override
         */
        SVGResource.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this._resolve = null;
            this._crossorigin = null;
        };
        /**
         * Used to auto-detect the type of resource.
         *
         * @static
         * @param {*} source - The source object
         * @param {string} extension - The extension of source, if set
         */
        SVGResource.test = function (source, extension) {
            // url file extension is SVG
            return extension === 'svg'
                // source is SVG data-uri
                || (typeof source === 'string' && source.indexOf('data:image/svg+xml;base64') === 0)
                // source is SVG inline
                || (typeof source === 'string' && source.indexOf('<svg') === 0);
        };
        /**
         * RegExp for SVG size.
         *
         * @static
         * @constant {RegExp|string} SVG_SIZE
         * @memberof PIXI.resources.SVGResource
         * @example &lt;svg width="100" height="100"&gt;&lt;/svg&gt;
         */
        SVGResource.SVG_SIZE = /<svg[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*>/i; // eslint-disable-line max-len
        return SVGResource;
    }(BaseImageResource));

    /**
     * Resource type for HTMLVideoElement.
     * @class
     * @extends PIXI.resources.BaseImageResource
     * @memberof PIXI.resources
     * @param {HTMLVideoElement|object|string|Array<string|object>} source - Video element to use.
     * @param {object} [options] - Options to use
     * @param {boolean} [options.autoLoad=true] - Start loading the video immediately
     * @param {boolean} [options.autoPlay=true] - Start playing video immediately
     * @param {number} [options.updateFPS=0] - How many times a second to update the texture from the video.
     * Leave at 0 to update at every render.
     * @param {boolean} [options.crossorigin=true] - Load image using cross origin
     */
    var VideoResource = /** @class */ (function (_super) {
        __extends(VideoResource, _super);
        function VideoResource(source, options) {
            var _this = this;
            options = options || {};
            if (!(source instanceof HTMLVideoElement)) {
                var videoElement = document.createElement('video');
                // workaround for https://github.com/pixijs/pixi.js/issues/5996
                videoElement.setAttribute('preload', 'auto');
                videoElement.setAttribute('webkit-playsinline', '');
                videoElement.setAttribute('playsinline', '');
                if (typeof source === 'string') {
                    source = [source];
                }
                var firstSrc = source[0].src || source[0];
                BaseImageResource.crossOrigin(videoElement, firstSrc, options.crossorigin);
                // array of objects or strings
                for (var i = 0; i < source.length; ++i) {
                    var sourceElement = document.createElement('source');
                    var _a = source[i], src = _a.src, mime = _a.mime;
                    src = src || source[i];
                    var baseSrc = src.split('?').shift().toLowerCase();
                    var ext = baseSrc.substr(baseSrc.lastIndexOf('.') + 1);
                    mime = mime || VideoResource.MIME_TYPES[ext] || "video/" + ext;
                    sourceElement.src = src;
                    sourceElement.type = mime;
                    videoElement.appendChild(sourceElement);
                }
                // Override the source
                source = videoElement;
            }
            _this = _super.call(this, source) || this;
            _this.noSubImage = true;
            /**
             * `true` to use PIXI.Ticker.shared to auto update the base texture.
             *
             * @type {boolean}
             * @default true
             * @private
             */
            _this._autoUpdate = true;
            /**
             * `true` if the instance is currently connected to PIXI.Ticker.shared to auto update the base texture.
             *
             * @type {boolean}
             * @default false
             * @private
             */
            _this._isConnectedToTicker = false;
            _this._updateFPS = options.updateFPS || 0;
            _this._msToNextUpdate = 0;
            /**
             * When set to true will automatically play videos used by this texture once
             * they are loaded. If false, it will not modify the playing state.
             *
             * @member {boolean}
             * @default true
             */
            _this.autoPlay = options.autoPlay !== false;
            /**
             * Promise when loading
             * @member {Promise<void>}
             * @private
             * @default null
             */
            _this._load = null;
            /**
             * Callback when completed with load.
             * @member {function}
             * @private
             */
            _this._resolve = null;
            // Bind for listeners
            _this._onCanPlay = _this._onCanPlay.bind(_this);
            _this._onError = _this._onError.bind(_this);
            if (options.autoLoad !== false) {
                _this.load();
            }
            return _this;
        }
        /**
         * Trigger updating of the texture
         *
         * @param {number} [deltaTime=0] - time delta since last tick
         */
        VideoResource.prototype.update = function (_deltaTime) {
            if (_deltaTime === void 0) { _deltaTime = 0; }
            if (!this.destroyed) {
                // account for if video has had its playbackRate changed
                var elapsedMS = Ticker.shared.elapsedMS * this.source.playbackRate;
                this._msToNextUpdate = Math.floor(this._msToNextUpdate - elapsedMS);
                if (!this._updateFPS || this._msToNextUpdate <= 0) {
                    _super.prototype.update.call(this);
                    this._msToNextUpdate = this._updateFPS ? Math.floor(1000 / this._updateFPS) : 0;
                }
            }
        };
        /**
         * Start preloading the video resource.
         *
         * @protected
         * @return {Promise<void>} Handle the validate event
         */
        VideoResource.prototype.load = function () {
            var _this = this;
            if (this._load) {
                return this._load;
            }
            var source = this.source;
            if ((source.readyState === source.HAVE_ENOUGH_DATA || source.readyState === source.HAVE_FUTURE_DATA)
                && source.width && source.height) {
                source.complete = true;
            }
            source.addEventListener('play', this._onPlayStart.bind(this));
            source.addEventListener('pause', this._onPlayStop.bind(this));
            if (!this._isSourceReady()) {
                source.addEventListener('canplay', this._onCanPlay);
                source.addEventListener('canplaythrough', this._onCanPlay);
                source.addEventListener('error', this._onError, true);
            }
            else {
                this._onCanPlay();
            }
            this._load = new Promise(function (resolve) {
                if (_this.valid) {
                    resolve(_this);
                }
                else {
                    _this._resolve = resolve;
                    source.load();
                }
            });
            return this._load;
        };
        /**
         * Handle video error events.
         *
         * @private
         */
        VideoResource.prototype._onError = function (event) {
            this.source.removeEventListener('error', this._onError, true);
            this.onError.emit(event);
        };
        /**
         * Returns true if the underlying source is playing.
         *
         * @private
         * @return {boolean} True if playing.
         */
        VideoResource.prototype._isSourcePlaying = function () {
            var source = this.source;
            return (source.currentTime > 0 && source.paused === false && source.ended === false && source.readyState > 2);
        };
        /**
         * Returns true if the underlying source is ready for playing.
         *
         * @private
         * @return {boolean} True if ready.
         */
        VideoResource.prototype._isSourceReady = function () {
            var source = this.source;
            return source.readyState === 3 || source.readyState === 4;
        };
        /**
         * Runs the update loop when the video is ready to play
         *
         * @private
         */
        VideoResource.prototype._onPlayStart = function () {
            // Just in case the video has not received its can play even yet..
            if (!this.valid) {
                this._onCanPlay();
            }
            if (this.autoUpdate && !this._isConnectedToTicker) {
                Ticker.shared.add(this.update, this);
                this._isConnectedToTicker = true;
            }
        };
        /**
         * Fired when a pause event is triggered, stops the update loop
         *
         * @private
         */
        VideoResource.prototype._onPlayStop = function () {
            if (this._isConnectedToTicker) {
                Ticker.shared.remove(this.update, this);
                this._isConnectedToTicker = false;
            }
        };
        /**
         * Fired when the video is loaded and ready to play
         *
         * @private
         */
        VideoResource.prototype._onCanPlay = function () {
            var source = this.source;
            source.removeEventListener('canplay', this._onCanPlay);
            source.removeEventListener('canplaythrough', this._onCanPlay);
            var valid = this.valid;
            this.resize(source.videoWidth, source.videoHeight);
            // prevent multiple loaded dispatches..
            if (!valid && this._resolve) {
                this._resolve(this);
                this._resolve = null;
            }
            if (this._isSourcePlaying()) {
                this._onPlayStart();
            }
            else if (this.autoPlay) {
                source.play();
            }
        };
        /**
         * Destroys this texture
         * @override
         */
        VideoResource.prototype.dispose = function () {
            if (this._isConnectedToTicker) {
                Ticker.shared.remove(this.update, this);
            }
            var source = this.source;
            if (source) {
                source.removeEventListener('error', this._onError, true);
                source.pause();
                source.src = '';
                source.load();
            }
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(VideoResource.prototype, "autoUpdate", {
            /**
             * Should the base texture automatically update itself, set to true by default
             *
             * @member {boolean}
             */
            get: function () {
                return this._autoUpdate;
            },
            set: function (value) {
                if (value !== this._autoUpdate) {
                    this._autoUpdate = value;
                    if (!this._autoUpdate && this._isConnectedToTicker) {
                        Ticker.shared.remove(this.update, this);
                        this._isConnectedToTicker = false;
                    }
                    else if (this._autoUpdate && !this._isConnectedToTicker && this._isSourcePlaying()) {
                        Ticker.shared.add(this.update, this);
                        this._isConnectedToTicker = true;
                    }
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(VideoResource.prototype, "updateFPS", {
            /**
             * How many times a second to update the texture from the video. Leave at 0 to update at every render.
             * A lower fps can help performance, as updating the texture at 60fps on a 30ps video may not be efficient.
             *
             * @member {number}
             */
            get: function () {
                return this._updateFPS;
            },
            set: function (value) {
                if (value !== this._updateFPS) {
                    this._updateFPS = value;
                }
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Used to auto-detect the type of resource.
         *
         * @static
         * @param {*} source - The source object
         * @param {string} extension - The extension of source, if set
         * @return {boolean} `true` if video source
         */
        VideoResource.test = function (source, extension) {
            return (source instanceof HTMLVideoElement)
                || VideoResource.TYPES.indexOf(extension) > -1;
        };
        /**
         * List of common video file extensions supported by VideoResource.
         * @constant
         * @member {Array<string>}
         * @static
         * @readonly
         */
        VideoResource.TYPES = ['mp4', 'm4v', 'webm', 'ogg', 'ogv', 'h264', 'avi', 'mov'];
        /**
         * Map of video MIME types that can't be directly derived from file extensions.
         * @constant
         * @member {object}
         * @static
         * @readonly
         */
        VideoResource.MIME_TYPES = {
            ogv: 'video/ogg',
            mov: 'video/quicktime',
            m4v: 'video/mp4',
        };
        return VideoResource;
    }(BaseImageResource));

    /**
     * Resource type for ImageBitmap.
     * @class
     * @extends PIXI.resources.BaseImageResource
     * @memberof PIXI.resources
     * @param {ImageBitmap} source - Image element to use
     */
    var ImageBitmapResource = /** @class */ (function (_super) {
        __extends(ImageBitmapResource, _super);
        function ImageBitmapResource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Used to auto-detect the type of resource.
         *
         * @static
         * @param {ImageBitmap} source - The source object
         * @return {boolean} `true` if source is an ImageBitmap
         */
        ImageBitmapResource.test = function (source) {
            return !!window.createImageBitmap && source instanceof ImageBitmap;
        };
        return ImageBitmapResource;
    }(BaseImageResource));

    INSTALLED.push(ImageResource, ImageBitmapResource, CanvasResource, VideoResource, SVGResource, BufferResource, CubeResource, ArrayResource);

    var index = ({
        Resource: Resource,
        BaseImageResource: BaseImageResource,
        INSTALLED: INSTALLED,
        autoDetectResource: autoDetectResource,
        AbstractMultiResource: AbstractMultiResource,
        ArrayResource: ArrayResource,
        BufferResource: BufferResource,
        CanvasResource: CanvasResource,
        CubeResource: CubeResource,
        ImageResource: ImageResource,
        SVGResource: SVGResource,
        VideoResource: VideoResource,
        ImageBitmapResource: ImageBitmapResource
    });

    /**
     * System is a base class used for extending systems used by the {@link PIXI.Renderer}
     *
     * @see PIXI.Renderer#addSystem
     * @class
     * @memberof PIXI
     */
    var System = /** @class */ (function () {
        /**
         * @param {PIXI.Renderer} renderer - The renderer this manager works for.
         */
        function System(renderer) {
            /**
             * The renderer this manager works for.
             *
             * @member {PIXI.Renderer}
             */
            this.renderer = renderer;
        }
        /**
         * Generic destroy methods to be overridden by the subclass
         */
        System.prototype.destroy = function () {
            this.renderer = null;
        };
        return System;
    }());

    /**
     * Resource type for DepthTexture.
     * @class
     * @extends PIXI.resources.BufferResource
     * @memberof PIXI.resources
     */
    var DepthResource = /** @class */ (function (_super) {
        __extends(DepthResource, _super);
        function DepthResource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Upload the texture to the GPU.
         * @param {PIXI.Renderer} renderer - Upload to the renderer
         * @param {PIXI.BaseTexture} baseTexture - Reference to parent texture
         * @param {PIXI.GLTexture} glTexture - glTexture
         * @returns {boolean} true is success
         */
        DepthResource.prototype.upload = function (renderer, baseTexture, glTexture) {
            var gl = renderer.gl;
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, baseTexture.alphaMode === ALPHA_MODES.UNPACK);
            if (glTexture.width === baseTexture.width && glTexture.height === baseTexture.height) {
                gl.texSubImage2D(baseTexture.target, 0, 0, 0, baseTexture.width, baseTexture.height, baseTexture.format, baseTexture.type, this.data);
            }
            else {
                glTexture.width = baseTexture.width;
                glTexture.height = baseTexture.height;
                gl.texImage2D(baseTexture.target, 0, 
                //  gl.DEPTH_COMPONENT16 Needed for depth to render properly in webgl2.0
                renderer.context.webGLVersion === 1 ? gl.DEPTH_COMPONENT : gl.DEPTH_COMPONENT16, baseTexture.width, baseTexture.height, 0, baseTexture.format, baseTexture.type, this.data);
            }
            return true;
        };
        return DepthResource;
    }(BufferResource));

    /**
     * Frame buffer used by the BaseRenderTexture
     *
     * @class
     * @memberof PIXI
     */
    var Framebuffer = /** @class */ (function () {
        /**
         * @param {number} width - Width of the frame buffer
         * @param {number} height - Height of the frame buffer
         */
        function Framebuffer(width, height) {
            /**
             * Width of framebuffer in pixels
             * @member {number}
             */
            this.width = Math.ceil(width || 100);
            /**
             * Height of framebuffer in pixels
             * @member {number}
             */
            this.height = Math.ceil(height || 100);
            this.stencil = false;
            this.depth = false;
            this.dirtyId = 0;
            this.dirtyFormat = 0;
            this.dirtySize = 0;
            this.depthTexture = null;
            this.colorTextures = [];
            this.glFramebuffers = {};
            this.disposeRunner = new Runner('disposeFramebuffer');
            /**
             * Desired number of samples for antialiasing. 0 means AA should not be used.
             *
             * Experimental WebGL2 feature, allows to use antialiasing in individual renderTextures.
             * Antialiasing is the same as for main buffer with renderer `antialias:true` options.
             * Seriously affects GPU memory consumption and GPU performance.
             *
             *```js
             * renderTexture.framebuffer.multisample = PIXI.MSAA_QUALITY.HIGH;
             * //...
             * renderer.render(renderTexture, myContainer);
             * renderer.framebuffer.blit(); // copies data from MSAA framebuffer to texture
             *  ```
             *
             * @member {PIXI.MSAA_QUALITY}
             * @default PIXI.MSAA_QUALITY.NONE
             */
            this.multisample = MSAA_QUALITY.NONE;
        }
        Object.defineProperty(Framebuffer.prototype, "colorTexture", {
            /**
             * Reference to the colorTexture.
             *
             * @member {PIXI.BaseTexture[]}
             * @readonly
             */
            get: function () {
                return this.colorTextures[0];
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Add texture to the colorTexture array
         *
         * @param {number} [index=0] - Index of the array to add the texture to
         * @param {PIXI.BaseTexture} [texture] - Texture to add to the array
         */
        Framebuffer.prototype.addColorTexture = function (index, texture) {
            if (index === void 0) { index = 0; }
            // TODO add some validation to the texture - same width / height etc?
            this.colorTextures[index] = texture || new BaseTexture(null, {
                scaleMode: SCALE_MODES.NEAREST,
                resolution: 1,
                mipmap: MIPMAP_MODES.OFF,
                width: this.width,
                height: this.height,
            });
            this.dirtyId++;
            this.dirtyFormat++;
            return this;
        };
        /**
         * Add a depth texture to the frame buffer
         *
         * @param {PIXI.BaseTexture} [texture] - Texture to add
         */
        Framebuffer.prototype.addDepthTexture = function (texture) {
            /* eslint-disable max-len */
            this.depthTexture = texture || new BaseTexture(new DepthResource(null, { width: this.width, height: this.height }), {
                scaleMode: SCALE_MODES.NEAREST,
                resolution: 1,
                width: this.width,
                height: this.height,
                mipmap: MIPMAP_MODES.OFF,
                format: FORMATS.DEPTH_COMPONENT,
                type: TYPES.UNSIGNED_SHORT,
            });
            this.dirtyId++;
            this.dirtyFormat++;
            return this;
        };
        /**
         * Enable depth on the frame buffer
         */
        Framebuffer.prototype.enableDepth = function () {
            this.depth = true;
            this.dirtyId++;
            this.dirtyFormat++;
            return this;
        };
        /**
         * Enable stencil on the frame buffer
         */
        Framebuffer.prototype.enableStencil = function () {
            this.stencil = true;
            this.dirtyId++;
            this.dirtyFormat++;
            return this;
        };
        /**
         * Resize the frame buffer
         *
         * @param {number} width - Width of the frame buffer to resize to
         * @param {number} height - Height of the frame buffer to resize to
         */
        Framebuffer.prototype.resize = function (width, height) {
            width = Math.ceil(width);
            height = Math.ceil(height);
            if (width === this.width && height === this.height)
                { return; }
            this.width = width;
            this.height = height;
            this.dirtyId++;
            this.dirtySize++;
            for (var i = 0; i < this.colorTextures.length; i++) {
                var texture = this.colorTextures[i];
                var resolution = texture.resolution;
                // take into acount the fact the texture may have a different resolution..
                texture.setSize(width / resolution, height / resolution);
            }
            if (this.depthTexture) {
                var resolution = this.depthTexture.resolution;
                this.depthTexture.setSize(width / resolution, height / resolution);
            }
        };
        /**
         * Disposes WebGL resources that are connected to this geometry
         */
        Framebuffer.prototype.dispose = function () {
            this.disposeRunner.emit(this, false);
        };
        /**
         * Destroys and removes the depth texture added to this framebuffer.
         */
        Framebuffer.prototype.destroyDepthTexture = function () {
            if (this.depthTexture) {
                this.depthTexture.destroy();
                this.depthTexture = null;
                ++this.dirtyId;
                ++this.dirtyFormat;
            }
        };
        return Framebuffer;
    }());

    /**
     * A BaseRenderTexture is a special texture that allows any PixiJS display object to be rendered to it.
     *
     * __Hint__: All DisplayObjects (i.e. Sprites) that render to a BaseRenderTexture should be preloaded
     * otherwise black rectangles will be drawn instead.
     *
     * A BaseRenderTexture takes a snapshot of any Display Object given to its render method. The position
     * and rotation of the given Display Objects is ignored. For example:
     *
     * ```js
     * let renderer = PIXI.autoDetectRenderer();
     * let baseRenderTexture = new PIXI.BaseRenderTexture({ width: 800, height: 600 });
     * let renderTexture = new PIXI.RenderTexture(baseRenderTexture);
     * let sprite = PIXI.Sprite.from("spinObj_01.png");
     *
     * sprite.position.x = 800/2;
     * sprite.position.y = 600/2;
     * sprite.anchor.x = 0.5;
     * sprite.anchor.y = 0.5;
     *
     * renderer.render(sprite, renderTexture);
     * ```
     *
     * The Sprite in this case will be rendered using its local transform. To render this sprite at 0,0
     * you can clear the transform
     *
     * ```js
     *
     * sprite.setTransform()
     *
     * let baseRenderTexture = new PIXI.BaseRenderTexture({ width: 100, height: 100 });
     * let renderTexture = new PIXI.RenderTexture(baseRenderTexture);
     *
     * renderer.render(sprite, renderTexture);  // Renders to center of RenderTexture
     * ```
     *
     * @class
     * @extends PIXI.BaseTexture
     * @memberof PIXI
     */
    var BaseRenderTexture = /** @class */ (function (_super) {
        __extends(BaseRenderTexture, _super);
        /**
         * @param {object} [options]
         * @param {number} [options.width=100] - The width of the base render texture.
         * @param {number} [options.height=100] - The height of the base render texture.
         * @param {PIXI.SCALE_MODES} [options.scaleMode] - See {@link PIXI.SCALE_MODES} for possible values.
         * @param {number} [options.resolution=1] - The resolution / device pixel ratio of the texture being generated.
         */
        function BaseRenderTexture(options) {
            var _this = this;
            if (typeof options === 'number') {
                /* eslint-disable prefer-rest-params */
                // Backward compatibility of signature
                var width_1 = arguments[0];
                var height_1 = arguments[1];
                var scaleMode = arguments[2];
                var resolution = arguments[3];
                options = { width: width_1, height: height_1, scaleMode: scaleMode, resolution: resolution };
                /* eslint-enable prefer-rest-params */
            }
            _this = _super.call(this, null, options) || this;
            var _a = options || {}, width = _a.width, height = _a.height;
            // Set defaults
            _this.mipmap = 0;
            _this.width = Math.ceil(width) || 100;
            _this.height = Math.ceil(height) || 100;
            _this.valid = true;
            _this.clearColor = [0, 0, 0, 0];
            _this.framebuffer = new Framebuffer(_this.width * _this.resolution, _this.height * _this.resolution)
                .addColorTexture(0, _this);
            // TODO - could this be added the systems?
            /**
             * The data structure for the stencil masks.
             *
             * @member {PIXI.MaskData[]}
             */
            _this.maskStack = [];
            /**
             * The data structure for the filters.
             *
             * @member {Object[]}
             */
            _this.filterStack = [{}];
            return _this;
        }
        /**
         * Resizes the BaseRenderTexture.
         *
         * @param {number} width - The width to resize to.
         * @param {number} height - The height to resize to.
         */
        BaseRenderTexture.prototype.resize = function (width, height) {
            width = Math.ceil(width);
            height = Math.ceil(height);
            this.framebuffer.resize(width * this.resolution, height * this.resolution);
        };
        /**
         * Frees the texture and framebuffer from WebGL memory without destroying this texture object.
         * This means you can still use the texture later which will upload it to GPU
         * memory again.
         *
         * @fires PIXI.BaseTexture#dispose
         */
        BaseRenderTexture.prototype.dispose = function () {
            this.framebuffer.dispose();
            _super.prototype.dispose.call(this);
        };
        /**
         * Destroys this texture.
         */
        BaseRenderTexture.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this.framebuffer.destroyDepthTexture();
            this.framebuffer = null;
        };
        return BaseRenderTexture;
    }(BaseTexture));

    /**
     * Stores a texture's frame in UV coordinates, in
     * which everything lies in the rectangle `[(0,0), (1,0),
     * (1,1), (0,1)]`.
     *
     * | Corner       | Coordinates |
     * |--------------|-------------|
     * | Top-Left     | `(x0,y0)`   |
     * | Top-Right    | `(x1,y1)`   |
     * | Bottom-Right | `(x2,y2)`   |
     * | Bottom-Left  | `(x3,y3)`   |
     *
     * @class
     * @protected
     * @memberof PIXI
     */
    var TextureUvs = /** @class */ (function () {
        function TextureUvs() {
            /**
             * X-component of top-left corner `(x0,y0)`.
             *
             * @member {number}
             */
            this.x0 = 0;
            /**
             * Y-component of top-left corner `(x0,y0)`.
             *
             * @member {number}
             */
            this.y0 = 0;
            /**
             * X-component of top-right corner `(x1,y1)`.
             *
             * @member {number}
             */
            this.x1 = 1;
            /**
             * Y-component of top-right corner `(x1,y1)`.
             *
             * @member {number}
             */
            this.y1 = 0;
            /**
             * X-component of bottom-right corner `(x2,y2)`.
             *
             * @member {number}
             */
            this.x2 = 1;
            /**
             * Y-component of bottom-right corner `(x2,y2)`.
             *
             * @member {number}
             */
            this.y2 = 1;
            /**
             * X-component of bottom-left corner `(x3,y3)`.
             *
             * @member {number}
             */
            this.x3 = 0;
            /**
             * Y-component of bottom-right corner `(x3,y3)`.
             *
             * @member {number}
             */
            this.y3 = 1;
            this.uvsFloat32 = new Float32Array(8);
        }
        /**
         * Sets the texture Uvs based on the given frame information.
         *
         * @protected
         * @param {PIXI.Rectangle} frame - The frame of the texture
         * @param {PIXI.Rectangle} baseFrame - The base frame of the texture
         * @param {number} rotate - Rotation of frame, see {@link PIXI.groupD8}
         */
        TextureUvs.prototype.set = function (frame, baseFrame, rotate) {
            var tw = baseFrame.width;
            var th = baseFrame.height;
            if (rotate) {
                // width and height div 2 div baseFrame size
                var w2 = frame.width / 2 / tw;
                var h2 = frame.height / 2 / th;
                // coordinates of center
                var cX = (frame.x / tw) + w2;
                var cY = (frame.y / th) + h2;
                rotate = groupD8.add(rotate, groupD8.NW); // NW is top-left corner
                this.x0 = cX + (w2 * groupD8.uX(rotate));
                this.y0 = cY + (h2 * groupD8.uY(rotate));
                rotate = groupD8.add(rotate, 2); // rotate 90 degrees clockwise
                this.x1 = cX + (w2 * groupD8.uX(rotate));
                this.y1 = cY + (h2 * groupD8.uY(rotate));
                rotate = groupD8.add(rotate, 2);
                this.x2 = cX + (w2 * groupD8.uX(rotate));
                this.y2 = cY + (h2 * groupD8.uY(rotate));
                rotate = groupD8.add(rotate, 2);
                this.x3 = cX + (w2 * groupD8.uX(rotate));
                this.y3 = cY + (h2 * groupD8.uY(rotate));
            }
            else {
                this.x0 = frame.x / tw;
                this.y0 = frame.y / th;
                this.x1 = (frame.x + frame.width) / tw;
                this.y1 = frame.y / th;
                this.x2 = (frame.x + frame.width) / tw;
                this.y2 = (frame.y + frame.height) / th;
                this.x3 = frame.x / tw;
                this.y3 = (frame.y + frame.height) / th;
            }
            this.uvsFloat32[0] = this.x0;
            this.uvsFloat32[1] = this.y0;
            this.uvsFloat32[2] = this.x1;
            this.uvsFloat32[3] = this.y1;
            this.uvsFloat32[4] = this.x2;
            this.uvsFloat32[5] = this.y2;
            this.uvsFloat32[6] = this.x3;
            this.uvsFloat32[7] = this.y3;
        };
        return TextureUvs;
    }());

    var DEFAULT_UVS = new TextureUvs();
    /**
     * A texture stores the information that represents an image or part of an image.
     *
     * It cannot be added to the display list directly; instead use it as the texture for a Sprite.
     * If no frame is provided for a texture, then the whole image is used.
     *
     * You can directly create a texture from an image and then reuse it multiple times like this :
     *
     * ```js
     * let texture = PIXI.Texture.from('assets/image.png');
     * let sprite1 = new PIXI.Sprite(texture);
     * let sprite2 = new PIXI.Sprite(texture);
     * ```
     *
     * If you didnt pass the texture frame to constructor, it enables `noFrame` mode:
     * it subscribes on baseTexture events, it automatically resizes at the same time as baseTexture.
     *
     * Textures made from SVGs, loaded or not, cannot be used before the file finishes processing.
     * You can check for this by checking the sprite's _textureID property.
     * ```js
     * var texture = PIXI.Texture.from('assets/image.svg');
     * var sprite1 = new PIXI.Sprite(texture);
     * //sprite1._textureID should not be undefined if the texture has finished processing the SVG file
     * ```
     * You can use a ticker or rAF to ensure your sprites load the finished textures after processing. See issue #3068.
     *
     * @class
     * @extends PIXI.utils.EventEmitter
     * @memberof PIXI
     */
    var Texture = /** @class */ (function (_super) {
        __extends(Texture, _super);
        /**
         * @param {PIXI.BaseTexture} baseTexture - The base texture source to create the texture from
         * @param {PIXI.Rectangle} [frame] - The rectangle frame of the texture to show
         * @param {PIXI.Rectangle} [orig] - The area of original texture
         * @param {PIXI.Rectangle} [trim] - Trimmed rectangle of original texture
         * @param {number} [rotate] - indicates how the texture was rotated by texture packer. See {@link PIXI.groupD8}
         * @param {PIXI.IPointData} [anchor] - Default anchor point used for sprite placement / rotation
         */
        function Texture(baseTexture, frame, orig, trim, rotate, anchor) {
            var _this = _super.call(this) || this;
            /**
             * Does this Texture have any frame data assigned to it?
             *
             * This mode is enabled automatically if no frame was passed inside constructor.
             *
             * In this mode texture is subscribed to baseTexture events, and fires `update` on any change.
             *
             * Beware, after loading or resize of baseTexture event can fired two times!
             * If you want more control, subscribe on baseTexture itself.
             *
             * ```js
             * texture.on('update', () => {});
             * ```
             *
             * Any assignment of `frame` switches off `noFrame` mode.
             *
             * @member {boolean}
             */
            _this.noFrame = false;
            if (!frame) {
                _this.noFrame = true;
                frame = new Rectangle(0, 0, 1, 1);
            }
            if (baseTexture instanceof Texture) {
                baseTexture = baseTexture.baseTexture;
            }
            /**
             * The base texture that this texture uses.
             *
             * @member {PIXI.BaseTexture}
             */
            _this.baseTexture = baseTexture;
            /**
             * This is the area of the BaseTexture image to actually copy to the Canvas / WebGL when rendering,
             * irrespective of the actual frame size or placement (which can be influenced by trimmed texture atlases)
             *
             * @member {PIXI.Rectangle}
             */
            _this._frame = frame;
            /**
             * This is the trimmed area of original texture, before it was put in atlas
             * Please call `updateUvs()` after you change coordinates of `trim` manually.
             *
             * @member {PIXI.Rectangle}
             */
            _this.trim = trim;
            /**
             * This will let the renderer know if the texture is valid. If it's not then it cannot be rendered.
             *
             * @member {boolean}
             */
            _this.valid = false;
            /**
             * The WebGL UV data cache. Can be used as quad UV
             *
             * @member {PIXI.TextureUvs}
             * @protected
             */
            _this._uvs = DEFAULT_UVS;
            /**
             * Default TextureMatrix instance for this texture
             * By default that object is not created because its heavy
             *
             * @member {PIXI.TextureMatrix}
             */
            _this.uvMatrix = null;
            /**
             * This is the area of original texture, before it was put in atlas
             *
             * @member {PIXI.Rectangle}
             */
            _this.orig = orig || frame; // new Rectangle(0, 0, 1, 1);
            _this._rotate = Number(rotate || 0);
            if (rotate === true) {
                // this is old texturepacker legacy, some games/libraries are passing "true" for rotated textures
                _this._rotate = 2;
            }
            else if (_this._rotate % 2 !== 0) {
                throw new Error('attempt to use diamond-shaped UVs. If you are sure, set rotation manually');
            }
            /**
             * Anchor point that is used as default if sprite is created with this texture.
             * Changing the `defaultAnchor` at a later point of time will not update Sprite's anchor point.
             * @member {PIXI.Point}
             * @default {0,0}
             */
            _this.defaultAnchor = anchor ? new Point(anchor.x, anchor.y) : new Point(0, 0);
            /**
             * Update ID is observed by sprites and TextureMatrix instances.
             * Call updateUvs() to increment it.
             *
             * @member {number}
             * @protected
             */
            _this._updateID = 0;
            /**
             * The ids under which this Texture has been added to the texture cache. This is
             * automatically set as long as Texture.addToCache is used, but may not be set if a
             * Texture is added directly to the TextureCache array.
             *
             * @member {string[]}
             */
            _this.textureCacheIds = [];
            if (!baseTexture.valid) {
                baseTexture.once('loaded', _this.onBaseTextureUpdated, _this);
            }
            else if (_this.noFrame) {
                // if there is no frame we should monitor for any base texture changes..
                if (baseTexture.valid) {
                    _this.onBaseTextureUpdated(baseTexture);
                }
            }
            else {
                _this.frame = frame;
            }
            if (_this.noFrame) {
                baseTexture.on('update', _this.onBaseTextureUpdated, _this);
            }
            return _this;
        }
        /**
         * Updates this texture on the gpu.
         *
         * Calls the TextureResource update.
         *
         * If you adjusted `frame` manually, please call `updateUvs()` instead.
         *
         */
        Texture.prototype.update = function () {
            if (this.baseTexture.resource) {
                this.baseTexture.resource.update();
            }
        };
        /**
         * Called when the base texture is updated
         *
         * @protected
         * @param {PIXI.BaseTexture} baseTexture - The base texture.
         */
        Texture.prototype.onBaseTextureUpdated = function (baseTexture) {
            if (this.noFrame) {
                if (!this.baseTexture.valid) {
                    return;
                }
                this._frame.width = baseTexture.width;
                this._frame.height = baseTexture.height;
                this.valid = true;
                this.updateUvs();
            }
            else {
                // TODO this code looks confusing.. boo to abusing getters and setters!
                // if user gave us frame that has bigger size than resized texture it can be a problem
                this.frame = this._frame;
            }
            this.emit('update', this);
        };
        /**
         * Destroys this texture
         *
         * @param {boolean} [destroyBase=false] - Whether to destroy the base texture as well
         */
        Texture.prototype.destroy = function (destroyBase) {
            if (this.baseTexture) {
                if (destroyBase) {
                    var resource = this.baseTexture;
                    // delete the texture if it exists in the texture cache..
                    // this only needs to be removed if the base texture is actually destroyed too..
                    if (resource && resource.url && TextureCache[resource.url]) {
                        Texture.removeFromCache(resource.url);
                    }
                    this.baseTexture.destroy();
                }
                this.baseTexture.off('loaded', this.onBaseTextureUpdated, this);
                this.baseTexture.off('update', this.onBaseTextureUpdated, this);
                this.baseTexture = null;
            }
            this._frame = null;
            this._uvs = null;
            this.trim = null;
            this.orig = null;
            this.valid = false;
            Texture.removeFromCache(this);
            this.textureCacheIds = null;
        };
        /**
         * Creates a new texture object that acts the same as this one.
         *
         * @return {PIXI.Texture} The new texture
         */
        Texture.prototype.clone = function () {
            return new Texture(this.baseTexture, this.frame.clone(), this.orig.clone(), this.trim && this.trim.clone(), this.rotate, this.defaultAnchor);
        };
        /**
         * Updates the internal WebGL UV cache. Use it after you change `frame` or `trim` of the texture.
         * Call it after changing the frame
         */
        Texture.prototype.updateUvs = function () {
            if (this._uvs === DEFAULT_UVS) {
                this._uvs = new TextureUvs();
            }
            this._uvs.set(this._frame, this.baseTexture, this.rotate);
            this._updateID++;
        };
        /**
         * Helper function that creates a new Texture based on the source you provide.
         * The source can be - frame id, image url, video url, canvas element, video element, base texture
         *
         * @static
         * @param {string|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|PIXI.BaseTexture} source
         *        Source to create texture from
         * @param {object} [options] See {@link PIXI.BaseTexture}'s constructor for options.
         * @param {boolean} [strict] - Enforce strict-mode, see {@link PIXI.settings.STRICT_TEXTURE_CACHE}.
         * @return {PIXI.Texture} The newly created texture
         */
        Texture.from = function (source, options, strict) {
            if (options === void 0) { options = {}; }
            if (strict === void 0) { strict = settings.STRICT_TEXTURE_CACHE; }
            var isFrame = typeof source === 'string';
            var cacheId = null;
            if (isFrame) {
                cacheId = source;
            }
            else {
                if (!source._pixiId) {
                    source._pixiId = "pixiid_" + uid();
                }
                cacheId = source._pixiId;
            }
            var texture = TextureCache[cacheId];
            // Strict-mode rejects invalid cacheIds
            if (isFrame && strict && !texture) {
                throw new Error("The cacheId \"" + cacheId + "\" does not exist in TextureCache.");
            }
            if (!texture) {
                if (!options.resolution) {
                    options.resolution = getResolutionOfUrl(source);
                }
                texture = new Texture(new BaseTexture(source, options));
                texture.baseTexture.cacheId = cacheId;
                BaseTexture.addToCache(texture.baseTexture, cacheId);
                Texture.addToCache(texture, cacheId);
            }
            // lets assume its a base texture!
            return texture;
        };
        /**
         * Useful for loading textures via URLs. Use instead of `Texture.from` because
         * it does a better job of handling failed URLs more effectively. This also ignores
         * `PIXI.settings.STRICT_TEXTURE_CACHE`. Works for Videos, SVGs, Images.
         * @param {string} url The remote URL to load.
         * @param {object} [options] Optional options to include
         * @return {Promise<PIXI.Texture>} A Promise that resolves to a Texture.
         */
        Texture.fromURL = function (url, options) {
            var resourceOptions = Object.assign({ autoLoad: false }, options === null || options === void 0 ? void 0 : options.resourceOptions);
            var texture = Texture.from(url, Object.assign({ resourceOptions: resourceOptions }, options), false);
            var resource = texture.baseTexture.resource;
            // The texture was already loaded
            if (texture.baseTexture.valid) {
                return Promise.resolve(texture);
            }
            // Manually load the texture, this should allow users to handle load errors
            return resource.load().then(function () { return Promise.resolve(texture); });
        };
        /**
         * Create a new Texture with a BufferResource from a Float32Array.
         * RGBA values are floats from 0 to 1.
         * @static
         * @param {Float32Array|Uint8Array} buffer - The optional array to use, if no data
         *        is provided, a new Float32Array is created.
         * @param {number} width - Width of the resource
         * @param {number} height - Height of the resource
         * @param {object} [options] See {@link PIXI.BaseTexture}'s constructor for options.
         * @return {PIXI.Texture} The resulting new BaseTexture
         */
        Texture.fromBuffer = function (buffer, width, height, options) {
            return new Texture(BaseTexture.fromBuffer(buffer, width, height, options));
        };
        /**
         * Create a texture from a source and add to the cache.
         *
         * @static
         * @param {HTMLImageElement|HTMLCanvasElement} source - The input source.
         * @param {String} imageUrl - File name of texture, for cache and resolving resolution.
         * @param {String} [name] - Human readable name for the texture cache. If no name is
         *        specified, only `imageUrl` will be used as the cache ID.
         * @return {PIXI.Texture} Output texture
         */
        Texture.fromLoader = function (source, imageUrl, name) {
            var resource = new ImageResource(source);
            resource.url = imageUrl;
            var baseTexture = new BaseTexture(resource, {
                scaleMode: settings.SCALE_MODE,
                resolution: getResolutionOfUrl(imageUrl),
            });
            var texture = new Texture(baseTexture);
            // No name, use imageUrl instead
            if (!name) {
                name = imageUrl;
            }
            // lets also add the frame to pixi's global cache for 'fromLoader' function
            BaseTexture.addToCache(texture.baseTexture, name);
            Texture.addToCache(texture, name);
            // also add references by url if they are different.
            if (name !== imageUrl) {
                BaseTexture.addToCache(texture.baseTexture, imageUrl);
                Texture.addToCache(texture, imageUrl);
            }
            return texture;
        };
        /**
         * Adds a Texture to the global TextureCache. This cache is shared across the whole PIXI object.
         *
         * @static
         * @param {PIXI.Texture} texture - The Texture to add to the cache.
         * @param {string} id - The id that the Texture will be stored against.
         */
        Texture.addToCache = function (texture, id) {
            if (id) {
                if (texture.textureCacheIds.indexOf(id) === -1) {
                    texture.textureCacheIds.push(id);
                }
                if (TextureCache[id]) {
                    // eslint-disable-next-line no-console
                    console.warn("Texture added to the cache with an id [" + id + "] that already had an entry");
                }
                TextureCache[id] = texture;
            }
        };
        /**
         * Remove a Texture from the global TextureCache.
         *
         * @static
         * @param {string|PIXI.Texture} texture - id of a Texture to be removed, or a Texture instance itself
         * @return {PIXI.Texture|null} The Texture that was removed
         */
        Texture.removeFromCache = function (texture) {
            if (typeof texture === 'string') {
                var textureFromCache = TextureCache[texture];
                if (textureFromCache) {
                    var index = textureFromCache.textureCacheIds.indexOf(texture);
                    if (index > -1) {
                        textureFromCache.textureCacheIds.splice(index, 1);
                    }
                    delete TextureCache[texture];
                    return textureFromCache;
                }
            }
            else if (texture && texture.textureCacheIds) {
                for (var i = 0; i < texture.textureCacheIds.length; ++i) {
                    // Check that texture matches the one being passed in before deleting it from the cache.
                    if (TextureCache[texture.textureCacheIds[i]] === texture) {
                        delete TextureCache[texture.textureCacheIds[i]];
                    }
                }
                texture.textureCacheIds.length = 0;
                return texture;
            }
            return null;
        };
        Object.defineProperty(Texture.prototype, "resolution", {
            /**
             * Returns resolution of baseTexture
             *
             * @member {number}
             * @readonly
             */
            get: function () {
                return this.baseTexture.resolution;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "frame", {
            /**
             * The frame specifies the region of the base texture that this texture uses.
             * Please call `updateUvs()` after you change coordinates of `frame` manually.
             *
             * @member {PIXI.Rectangle}
             */
            get: function () {
                return this._frame;
            },
            set: function (frame) {
                this._frame = frame;
                this.noFrame = false;
                var x = frame.x, y = frame.y, width = frame.width, height = frame.height;
                var xNotFit = x + width > this.baseTexture.width;
                var yNotFit = y + height > this.baseTexture.height;
                if (xNotFit || yNotFit) {
                    var relationship = xNotFit && yNotFit ? 'and' : 'or';
                    var errorX = "X: " + x + " + " + width + " = " + (x + width) + " > " + this.baseTexture.width;
                    var errorY = "Y: " + y + " + " + height + " = " + (y + height) + " > " + this.baseTexture.height;
                    throw new Error('Texture Error: frame does not fit inside the base Texture dimensions: '
                        + (errorX + " " + relationship + " " + errorY));
                }
                this.valid = width && height && this.baseTexture.valid;
                if (!this.trim && !this.rotate) {
                    this.orig = frame;
                }
                if (this.valid) {
                    this.updateUvs();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "rotate", {
            /**
             * Indicates whether the texture is rotated inside the atlas
             * set to 2 to compensate for texture packer rotation
             * set to 6 to compensate for spine packer rotation
             * can be used to rotate or mirror sprites
             * See {@link PIXI.groupD8} for explanation
             *
             * @member {number}
             */
            get: function () {
                return this._rotate;
            },
            set: function (rotate) {
                this._rotate = rotate;
                if (this.valid) {
                    this.updateUvs();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "width", {
            /**
             * The width of the Texture in pixels.
             *
             * @member {number}
             */
            get: function () {
                return this.orig.width;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "height", {
            /**
             * The height of the Texture in pixels.
             *
             * @member {number}
             */
            get: function () {
                return this.orig.height;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Utility function for BaseTexture|Texture cast
         */
        Texture.prototype.castToBaseTexture = function () {
            return this.baseTexture;
        };
        return Texture;
    }(eventemitter3));
    function createWhiteTexture() {
        var canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        var context = canvas.getContext('2d');
        context.fillStyle = 'white';
        context.fillRect(0, 0, 16, 16);
        return new Texture(new BaseTexture(new CanvasResource(canvas)));
    }
    function removeAllHandlers(tex) {
        tex.destroy = function _emptyDestroy() { };
        tex.on = function _emptyOn() { };
        tex.once = function _emptyOnce() { };
        tex.emit = function _emptyEmit() { };
    }
    /**
     * An empty texture, used often to not have to create multiple empty textures.
     * Can not be destroyed.
     *
     * @static
     * @constant
     * @member {PIXI.Texture}
     */
    Texture.EMPTY = new Texture(new BaseTexture());
    removeAllHandlers(Texture.EMPTY);
    removeAllHandlers(Texture.EMPTY.baseTexture);
    /**
     * A white texture of 16x16 size, used for graphics and other things
     * Can not be destroyed.
     *
     * @static
     * @constant
     * @member {PIXI.Texture}
     */
    Texture.WHITE = createWhiteTexture();
    removeAllHandlers(Texture.WHITE);
    removeAllHandlers(Texture.WHITE.baseTexture);

    /**
     * A RenderTexture is a special texture that allows any PixiJS display object to be rendered to it.
     *
     * __Hint__: All DisplayObjects (i.e. Sprites) that render to a RenderTexture should be preloaded
     * otherwise black rectangles will be drawn instead.
     *
     * __Hint-2__: The actual memory allocation will happen on first render.
     * You shouldn't create renderTextures each frame just to delete them after, try to reuse them.
     *
     * A RenderTexture takes a snapshot of any Display Object given to its render method. For example:
     *
     * ```js
     * let renderer = PIXI.autoDetectRenderer();
     * let renderTexture = PIXI.RenderTexture.create({ width: 800, height: 600 });
     * let sprite = PIXI.Sprite.from("spinObj_01.png");
     *
     * sprite.position.x = 800/2;
     * sprite.position.y = 600/2;
     * sprite.anchor.x = 0.5;
     * sprite.anchor.y = 0.5;
     *
     * renderer.render(sprite, renderTexture);
     * ```
     *
     * The Sprite in this case will be rendered using its local transform. To render this sprite at 0,0
     * you can clear the transform
     *
     * ```js
     *
     * sprite.setTransform()
     *
     * let renderTexture = new PIXI.RenderTexture.create(100, 100);
     *
     * renderer.render(sprite, renderTexture);  // Renders to center of RenderTexture
     * ```
     *
     * @class
     * @extends PIXI.Texture
     * @memberof PIXI
     */
    var RenderTexture = /** @class */ (function (_super) {
        __extends(RenderTexture, _super);
        /**
         * @param {PIXI.BaseRenderTexture} baseRenderTexture - The base texture object that this texture uses
         * @param {PIXI.Rectangle} [frame] - The rectangle frame of the texture to show
         */
        function RenderTexture(baseRenderTexture, frame) {
            var _this = this;
            // support for legacy..
            var _legacyRenderer = null;
            if (!(baseRenderTexture instanceof BaseRenderTexture)) {
                /* eslint-disable prefer-rest-params, no-console */
                var width = arguments[1];
                var height = arguments[2];
                var scaleMode = arguments[3];
                var resolution = arguments[4];
                // we have an old render texture..
                console.warn("Please use RenderTexture.create(" + width + ", " + height + ") instead of the ctor directly.");
                _legacyRenderer = arguments[0];
                /* eslint-enable prefer-rest-params, no-console */
                frame = null;
                baseRenderTexture = new BaseRenderTexture({
                    width: width,
                    height: height,
                    scaleMode: scaleMode,
                    resolution: resolution,
                });
            }
            /**
             * The base texture object that this texture uses
             *
             * @member {PIXI.BaseTexture}
             */
            _this = _super.call(this, baseRenderTexture, frame) || this;
            _this.legacyRenderer = _legacyRenderer;
            /**
             * This will let the renderer know if the texture is valid. If it's not then it cannot be rendered.
             *
             * @member {boolean}
             */
            _this.valid = true;
            /**
             * Stores `sourceFrame` when this texture is inside current filter stack.
             * You can read it inside filters.
             *
             * @readonly
             * @member {PIXI.Rectangle}
             */
            _this.filterFrame = null;
            /**
             * The key for pooled texture of FilterSystem
             * @protected
             * @member {string}
             */
            _this.filterPoolKey = null;
            _this.updateUvs();
            return _this;
        }
        Object.defineProperty(RenderTexture.prototype, "framebuffer", {
            /**
             * Shortcut to `this.baseTexture.framebuffer`, saves baseTexture cast.
             * @member {PIXI.Framebuffer}
             * @readonly
             */
            get: function () {
                return this.baseTexture.framebuffer;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Resizes the RenderTexture.
         *
         * @param {number} width - The width to resize to.
         * @param {number} height - The height to resize to.
         * @param {boolean} [resizeBaseTexture=true] - Should the baseTexture.width and height values be resized as well?
         */
        RenderTexture.prototype.resize = function (width, height, resizeBaseTexture) {
            if (resizeBaseTexture === void 0) { resizeBaseTexture = true; }
            width = Math.ceil(width);
            height = Math.ceil(height);
            // TODO - could be not required..
            this.valid = (width > 0 && height > 0);
            this._frame.width = this.orig.width = width;
            this._frame.height = this.orig.height = height;
            if (resizeBaseTexture) {
                this.baseTexture.resize(width, height);
            }
            this.updateUvs();
        };
        /**
         * Changes the resolution of baseTexture, but does not change framebuffer size.
         *
         * @param {number} resolution - The new resolution to apply to RenderTexture
         */
        RenderTexture.prototype.setResolution = function (resolution) {
            var baseTexture = this.baseTexture;
            if (baseTexture.resolution === resolution) {
                return;
            }
            baseTexture.setResolution(resolution);
            this.resize(baseTexture.width, baseTexture.height, false);
        };
        /**
         * A short hand way of creating a render texture.
         *
         * @param {object} [options] - Options
         * @param {number} [options.width=100] - The width of the render texture
         * @param {number} [options.height=100] - The height of the render texture
         * @param {number} [options.scaleMode=PIXI.settings.SCALE_MODE] - See {@link PIXI.SCALE_MODES} for possible values
         * @param {number} [options.resolution=1] - The resolution / device pixel ratio of the texture being generated
         * @return {PIXI.RenderTexture} The new render texture
         */
        RenderTexture.create = function (options) {
            // fallback, old-style: create(width, height, scaleMode, resolution)
            if (typeof options === 'number') {
                /* eslint-disable prefer-rest-params */
                options = {
                    width: options,
                    height: arguments[1],
                    scaleMode: arguments[2],
                    resolution: arguments[3],
                };
                /* eslint-enable prefer-rest-params */
            }
            return new RenderTexture(new BaseRenderTexture(options));
        };
        return RenderTexture;
    }(Texture));

    /**
     * Experimental!
     *
     * Texture pool, used by FilterSystem and plugins
     * Stores collection of temporary pow2 or screen-sized renderTextures
     *
     * If you use custom RenderTexturePool for your filters, you can use methods
     * `getFilterTexture` and `returnFilterTexture` same as in
     *
     * @class
     * @memberof PIXI
     */
    var RenderTexturePool = /** @class */ (function () {
        /**
         * @param {object} [textureOptions] - options that will be passed to BaseRenderTexture constructor
         * @param {PIXI.SCALE_MODES} [textureOptions.scaleMode] - See {@link PIXI.SCALE_MODES} for possible values.
         */
        function RenderTexturePool(textureOptions) {
            this.texturePool = {};
            this.textureOptions = textureOptions || {};
            /**
             * Allow renderTextures of the same size as screen, not just pow2
             *
             * Automatically sets to true after `setScreenSize`
             *
             * @member {boolean}
             * @default false
             */
            this.enableFullScreen = false;
            this._pixelsWidth = 0;
            this._pixelsHeight = 0;
        }
        /**
         * creates of texture with params that were specified in pool constructor
         *
         * @param {number} realWidth - width of texture in pixels
         * @param {number} realHeight - height of texture in pixels
         * @returns {RenderTexture}
         */
        RenderTexturePool.prototype.createTexture = function (realWidth, realHeight) {
            var baseRenderTexture = new BaseRenderTexture(Object.assign({
                width: realWidth,
                height: realHeight,
                resolution: 1,
            }, this.textureOptions));
            return new RenderTexture(baseRenderTexture);
        };
        /**
         * Gets a Power-of-Two render texture or fullScreen texture
         *
         * @protected
         * @param {number} minWidth - The minimum width of the render texture in real pixels.
         * @param {number} minHeight - The minimum height of the render texture in real pixels.
         * @param {number} [resolution=1] - The resolution of the render texture.
         * @return {PIXI.RenderTexture} The new render texture.
         */
        RenderTexturePool.prototype.getOptimalTexture = function (minWidth, minHeight, resolution) {
            if (resolution === void 0) { resolution = 1; }
            var key = RenderTexturePool.SCREEN_KEY;
            minWidth *= resolution;
            minHeight *= resolution;
            if (!this.enableFullScreen || minWidth !== this._pixelsWidth || minHeight !== this._pixelsHeight) {
                minWidth = nextPow2(minWidth);
                minHeight = nextPow2(minHeight);
                key = ((minWidth & 0xFFFF) << 16) | (minHeight & 0xFFFF);
            }
            if (!this.texturePool[key]) {
                this.texturePool[key] = [];
            }
            var renderTexture = this.texturePool[key].pop();
            if (!renderTexture) {
                renderTexture = this.createTexture(minWidth, minHeight);
            }
            renderTexture.filterPoolKey = key;
            renderTexture.setResolution(resolution);
            return renderTexture;
        };
        /**
         * Gets extra texture of the same size as input renderTexture
         *
         * `getFilterTexture(input, 0.5)` or `getFilterTexture(0.5, input)`
         *
         * @param {PIXI.RenderTexture} input - renderTexture from which size and resolution will be copied
         * @param {number} [resolution] - override resolution of the renderTexture
         *  It overrides, it does not multiply
         * @returns {PIXI.RenderTexture}
         */
        RenderTexturePool.prototype.getFilterTexture = function (input, resolution) {
            var filterTexture = this.getOptimalTexture(input.width, input.height, resolution || input.resolution);
            filterTexture.filterFrame = input.filterFrame;
            return filterTexture;
        };
        /**
         * Place a render texture back into the pool.
         * @param {PIXI.RenderTexture} renderTexture - The renderTexture to free
         */
        RenderTexturePool.prototype.returnTexture = function (renderTexture) {
            var key = renderTexture.filterPoolKey;
            renderTexture.filterFrame = null;
            this.texturePool[key].push(renderTexture);
        };
        /**
         * Alias for returnTexture, to be compliant with FilterSystem interface
         * @param {PIXI.RenderTexture} renderTexture - The renderTexture to free
         */
        RenderTexturePool.prototype.returnFilterTexture = function (renderTexture) {
            this.returnTexture(renderTexture);
        };
        /**
         * Clears the pool
         *
         * @param {boolean} [destroyTextures=true] - destroy all stored textures
         */
        RenderTexturePool.prototype.clear = function (destroyTextures) {
            destroyTextures = destroyTextures !== false;
            if (destroyTextures) {
                for (var i in this.texturePool) {
                    var textures = this.texturePool[i];
                    if (textures) {
                        for (var j = 0; j < textures.length; j++) {
                            textures[j].destroy(true);
                        }
                    }
                }
            }
            this.texturePool = {};
        };
        /**
         * If screen size was changed, drops all screen-sized textures,
         * sets new screen size, sets `enableFullScreen` to true
         *
         * Size is measured in pixels, `renderer.view` can be passed here, not `renderer.screen`
         *
         * @param {PIXI.ISize} size - Initial size of screen
         */
        RenderTexturePool.prototype.setScreenSize = function (size) {
            if (size.width === this._pixelsWidth
                && size.height === this._pixelsHeight) {
                return;
            }
            var screenKey = RenderTexturePool.SCREEN_KEY;
            var textures = this.texturePool[screenKey];
            this.enableFullScreen = size.width > 0 && size.height > 0;
            if (textures) {
                for (var j = 0; j < textures.length; j++) {
                    textures[j].destroy(true);
                }
            }
            this.texturePool[screenKey] = [];
            this._pixelsWidth = size.width;
            this._pixelsHeight = size.height;
        };
        /**
         * Key that is used to store fullscreen renderTextures in a pool
         *
         * @static
         * @const {string}
         */
        RenderTexturePool.SCREEN_KEY = 'screen';
        return RenderTexturePool;
    }());

    /* eslint-disable max-len */
    /**
     * Holds the information for a single attribute structure required to render geometry.
     *
     * This does not contain the actual data, but instead has a buffer id that maps to a {@link PIXI.Buffer}
     * This can include anything from positions, uvs, normals, colors etc.
     *
     * @class
     * @memberof PIXI
     */
    var Attribute = /** @class */ (function () {
        /**
         * @param {string} buffer - the id of the buffer that this attribute will look for
         * @param {Number} [size=0] - the size of the attribute. If you have 2 floats per vertex (eg position x and y) this would be 2.
         * @param {Boolean} [normalized=false] - should the data be normalized.
         * @param {Number} [type=PIXI.TYPES.FLOAT] - what type of number is the attribute. Check {@link PIXI.TYPES} to see the ones available
         * @param {Number} [stride=0] - How far apart (in floats) the start of each value is. (used for interleaving data)
         * @param {Number} [start=0] - How far into the array to start reading values (used for interleaving data)
         */
        function Attribute(buffer, size, normalized, type, stride, start, instance) {
            if (size === void 0) { size = 0; }
            if (normalized === void 0) { normalized = false; }
            if (type === void 0) { type = 5126; }
            this.buffer = buffer;
            this.size = size;
            this.normalized = normalized;
            this.type = type;
            this.stride = stride;
            this.start = start;
            this.instance = instance;
        }
        /**
         * Destroys the Attribute.
         */
        Attribute.prototype.destroy = function () {
            this.buffer = null;
        };
        /**
         * Helper function that creates an Attribute based on the information provided
         *
         * @static
         * @param {string} buffer - the id of the buffer that this attribute will look for
         * @param {Number} [size=0] - the size of the attribute. If you have 2 floats per vertex (eg position x and y) this would be 2
         * @param {Boolean} [normalized=false] - should the data be normalized.
         * @param {Number} [type=PIXI.TYPES.FLOAT] - what type of number is the attribute. Check {@link PIXI.TYPES} to see the ones available
         * @param {Number} [stride=0] - How far apart (in floats) the start of each value is. (used for interleaving data)
         *
         * @returns {PIXI.Attribute} A new {@link PIXI.Attribute} based on the information provided
         */
        Attribute.from = function (buffer, size, normalized, type, stride) {
            return new Attribute(buffer, size, normalized, type, stride);
        };
        return Attribute;
    }());

    var UID = 0;
    /**
     * A wrapper for data so that it can be used and uploaded by WebGL
     *
     * @class
     * @memberof PIXI
     */
    var Buffer = /** @class */ (function () {
        /**
         * @param {ArrayBuffer| SharedArrayBuffer|ArrayBufferView} data - the data to store in the buffer.
         * @param {boolean} [_static=true] - `true` for static buffer
         * @param {boolean} [index=false] - `true` for index buffer
         */
        function Buffer(data, _static, index) {
            if (_static === void 0) { _static = true; }
            if (index === void 0) { index = false; }
            /**
             * The data in the buffer, as a typed array
             *
             * @member {ArrayBuffer| SharedArrayBuffer | ArrayBufferView}
             */
            this.data = (data || new Float32Array(1));
            /**
             * A map of renderer IDs to webgl buffer
             *
             * @private
             * @member {object<number, GLBuffer>}
             */
            this._glBuffers = {};
            this._updateID = 0;
            this.index = index;
            this.static = _static;
            this.id = UID++;
            this.disposeRunner = new Runner('disposeBuffer');
        }
        // TODO could explore flagging only a partial upload?
        /**
         * flags this buffer as requiring an upload to the GPU
         * @param {ArrayBuffer|SharedArrayBuffer|ArrayBufferView} [data] - the data to update in the buffer.
         */
        Buffer.prototype.update = function (data) {
            this.data = data || this.data;
            this._updateID++;
        };
        /**
         * disposes WebGL resources that are connected to this geometry
         */
        Buffer.prototype.dispose = function () {
            this.disposeRunner.emit(this, false);
        };
        /**
         * Destroys the buffer
         */
        Buffer.prototype.destroy = function () {
            this.dispose();
            this.data = null;
        };
        /**
         * Helper function that creates a buffer based on an array or TypedArray
         *
         * @static
         * @param {ArrayBufferView | number[]} data - the TypedArray that the buffer will store. If this is a regular Array it will be converted to a Float32Array.
         * @return {PIXI.Buffer} A new Buffer based on the data provided.
         */
        Buffer.from = function (data) {
            if (data instanceof Array) {
                data = new Float32Array(data);
            }
            return new Buffer(data);
        };
        return Buffer;
    }());

    function getBufferType$1(array) {
        if (array.BYTES_PER_ELEMENT === 4) {
            if (array instanceof Float32Array) {
                return 'Float32Array';
            }
            else if (array instanceof Uint32Array) {
                return 'Uint32Array';
            }
            return 'Int32Array';
        }
        else if (array.BYTES_PER_ELEMENT === 2) {
            if (array instanceof Uint16Array) {
                return 'Uint16Array';
            }
        }
        else if (array.BYTES_PER_ELEMENT === 1) {
            if (array instanceof Uint8Array) {
                return 'Uint8Array';
            }
        }
        // TODO map out the rest of the array elements!
        return null;
    }

    /* eslint-disable object-shorthand */
    var map$1 = {
        Float32Array: Float32Array,
        Uint32Array: Uint32Array,
        Int32Array: Int32Array,
        Uint8Array: Uint8Array,
    };
    function interleaveTypedArrays$1(arrays, sizes) {
        var outSize = 0;
        var stride = 0;
        var views = {};
        for (var i = 0; i < arrays.length; i++) {
            stride += sizes[i];
            outSize += arrays[i].length;
        }
        var buffer = new ArrayBuffer(outSize * 4);
        var out = null;
        var littleOffset = 0;
        for (var i = 0; i < arrays.length; i++) {
            var size = sizes[i];
            var array = arrays[i];
            var type = getBufferType$1(array);
            if (!views[type]) {
                views[type] = new map$1[type](buffer);
            }
            out = views[type];
            for (var j = 0; j < array.length; j++) {
                var indexStart = ((j / size | 0) * stride) + littleOffset;
                var index = j % size;
                out[indexStart + index] = array[j];
            }
            littleOffset += size;
        }
        return new Float32Array(buffer);
    }

    var byteSizeMap = { 5126: 4, 5123: 2, 5121: 1 };
    var UID$1 = 0;
    /* eslint-disable object-shorthand */
    var map$1$1 = {
        Float32Array: Float32Array,
        Uint32Array: Uint32Array,
        Int32Array: Int32Array,
        Uint8Array: Uint8Array,
        Uint16Array: Uint16Array,
    };
    /* eslint-disable max-len */
    /**
     * The Geometry represents a model. It consists of two components:
     * - GeometryStyle - The structure of the model such as the attributes layout
     * - GeometryData - the data of the model - this consists of buffers.
     * This can include anything from positions, uvs, normals, colors etc.
     *
     * Geometry can be defined without passing in a style or data if required (thats how I prefer!)
     *
     * ```js
     * let geometry = new PIXI.Geometry();
     *
     * geometry.addAttribute('positions', [0, 0, 100, 0, 100, 100, 0, 100], 2);
     * geometry.addAttribute('uvs', [0,0,1,0,1,1,0,1],2)
     * geometry.addIndex([0,1,2,1,3,2])
     *
     * ```
     * @class
     * @memberof PIXI
     */
    var Geometry = /** @class */ (function () {
        /**
         * @param {PIXI.Buffer[]} [buffers] - an array of buffers. optional.
         * @param {object} [attributes] - of the geometry, optional structure of the attributes layout
         */
        function Geometry(buffers, attributes) {
            if (buffers === void 0) { buffers = []; }
            if (attributes === void 0) { attributes = {}; }
            this.buffers = buffers;
            this.indexBuffer = null;
            this.attributes = attributes;
            /**
             * A map of renderer IDs to webgl VAOs
             *
             * @protected
             * @type {object}
             */
            this.glVertexArrayObjects = {};
            this.id = UID$1++;
            this.instanced = false;
            /**
             * Number of instances in this geometry, pass it to `GeometrySystem.draw()`
             * @member {number}
             * @default 1
             */
            this.instanceCount = 1;
            this.disposeRunner = new Runner('disposeGeometry');
            /**
             * Count of existing (not destroyed) meshes that reference this geometry
             * @member {number}
             */
            this.refCount = 0;
        }
        /**
        *
        * Adds an attribute to the geometry
        * Note: `stride` and `start` should be `undefined` if you dont know them, not 0!
        *
        * @param {String} id - the name of the attribute (matching up to a shader)
        * @param {PIXI.Buffer|number[]} [buffer] - the buffer that holds the data of the attribute . You can also provide an Array and a buffer will be created from it.
        * @param {Number} [size=0] - the size of the attribute. If you have 2 floats per vertex (eg position x and y) this would be 2
        * @param {Boolean} [normalized=false] - should the data be normalized.
        * @param {Number} [type=PIXI.TYPES.FLOAT] - what type of number is the attribute. Check {PIXI.TYPES} to see the ones available
        * @param {Number} [stride] - How far apart (in floats) the start of each value is. (used for interleaving data)
        * @param {Number} [start] - How far into the array to start reading values (used for interleaving data)
        * @param {boolean} [instance=false] - Instancing flag
        *
        * @return {PIXI.Geometry} returns self, useful for chaining.
        */
        Geometry.prototype.addAttribute = function (id, buffer, size, normalized, type, stride, start, instance) {
            if (size === void 0) { size = 0; }
            if (normalized === void 0) { normalized = false; }
            if (instance === void 0) { instance = false; }
            if (!buffer) {
                throw new Error('You must pass a buffer when creating an attribute');
            }
            // check if this is a buffer!
            if (!(buffer instanceof Buffer)) {
                // its an array!
                if (buffer instanceof Array) {
                    buffer = new Float32Array(buffer);
                }
                buffer = new Buffer(buffer);
            }
            var ids = id.split('|');
            if (ids.length > 1) {
                for (var i = 0; i < ids.length; i++) {
                    this.addAttribute(ids[i], buffer, size, normalized, type);
                }
                return this;
            }
            var bufferIndex = this.buffers.indexOf(buffer);
            if (bufferIndex === -1) {
                this.buffers.push(buffer);
                bufferIndex = this.buffers.length - 1;
            }
            this.attributes[id] = new Attribute(bufferIndex, size, normalized, type, stride, start, instance);
            // assuming that if there is instanced data then this will be drawn with instancing!
            this.instanced = this.instanced || instance;
            return this;
        };
        /**
         * returns the requested attribute
         *
         * @param {String} id - the name of the attribute required
         * @return {PIXI.Attribute} the attribute requested.
         */
        Geometry.prototype.getAttribute = function (id) {
            return this.attributes[id];
        };
        /**
         * returns the requested buffer
         *
         * @param {String} id - the name of the buffer required
         * @return {PIXI.Buffer} the buffer requested.
         */
        Geometry.prototype.getBuffer = function (id) {
            return this.buffers[this.getAttribute(id).buffer];
        };
        /**
        *
        * Adds an index buffer to the geometry
        * The index buffer contains integers, three for each triangle in the geometry, which reference the various attribute buffers (position, colour, UV coordinates, other UV coordinates, normal, …). There is only ONE index buffer.
        *
        * @param {PIXI.Buffer|number[]} [buffer] - the buffer that holds the data of the index buffer. You can also provide an Array and a buffer will be created from it.
        * @return {PIXI.Geometry} returns self, useful for chaining.
        */
        Geometry.prototype.addIndex = function (buffer) {
            if (!(buffer instanceof Buffer)) {
                // its an array!
                if (buffer instanceof Array) {
                    buffer = new Uint16Array(buffer);
                }
                buffer = new Buffer(buffer);
            }
            buffer.index = true;
            this.indexBuffer = buffer;
            if (this.buffers.indexOf(buffer) === -1) {
                this.buffers.push(buffer);
            }
            return this;
        };
        /**
         * returns the index buffer
         *
         * @return {PIXI.Buffer} the index buffer.
         */
        Geometry.prototype.getIndex = function () {
            return this.indexBuffer;
        };
        /**
         * this function modifies the structure so that all current attributes become interleaved into a single buffer
         * This can be useful if your model remains static as it offers a little performance boost
         *
         * @return {PIXI.Geometry} returns self, useful for chaining.
         */
        Geometry.prototype.interleave = function () {
            // a simple check to see if buffers are already interleaved..
            if (this.buffers.length === 1 || (this.buffers.length === 2 && this.indexBuffer))
                { return this; }
            // assume already that no buffers are interleaved
            var arrays = [];
            var sizes = [];
            var interleavedBuffer = new Buffer();
            var i;
            for (i in this.attributes) {
                var attribute = this.attributes[i];
                var buffer = this.buffers[attribute.buffer];
                arrays.push(buffer.data);
                sizes.push((attribute.size * byteSizeMap[attribute.type]) / 4);
                attribute.buffer = 0;
            }
            interleavedBuffer.data = interleaveTypedArrays$1(arrays, sizes);
            for (i = 0; i < this.buffers.length; i++) {
                if (this.buffers[i] !== this.indexBuffer) {
                    this.buffers[i].destroy();
                }
            }
            this.buffers = [interleavedBuffer];
            if (this.indexBuffer) {
                this.buffers.push(this.indexBuffer);
            }
            return this;
        };
        Geometry.prototype.getSize = function () {
            for (var i in this.attributes) {
                var attribute = this.attributes[i];
                var buffer = this.buffers[attribute.buffer];
                return buffer.data.length / ((attribute.stride / 4) || attribute.size);
            }
            return 0;
        };
        /**
         * disposes WebGL resources that are connected to this geometry
         */
        Geometry.prototype.dispose = function () {
            this.disposeRunner.emit(this, false);
        };
        /**
         * Destroys the geometry.
         */
        Geometry.prototype.destroy = function () {
            this.dispose();
            this.buffers = null;
            this.indexBuffer = null;
            this.attributes = null;
        };
        /**
         * returns a clone of the geometry
         *
         * @returns {PIXI.Geometry} a new clone of this geometry
         */
        Geometry.prototype.clone = function () {
            var geometry = new Geometry();
            for (var i = 0; i < this.buffers.length; i++) {
                geometry.buffers[i] = new Buffer(this.buffers[i].data.slice(0));
            }
            for (var i in this.attributes) {
                var attrib = this.attributes[i];
                geometry.attributes[i] = new Attribute(attrib.buffer, attrib.size, attrib.normalized, attrib.type, attrib.stride, attrib.start, attrib.instance);
            }
            if (this.indexBuffer) {
                geometry.indexBuffer = geometry.buffers[this.buffers.indexOf(this.indexBuffer)];
                geometry.indexBuffer.index = true;
            }
            return geometry;
        };
        /**
         * merges an array of geometries into a new single one
         * geometry attribute styles must match for this operation to work
         *
         * @param {PIXI.Geometry[]} geometries - array of geometries to merge
         * @returns {PIXI.Geometry} shiny new geometry!
         */
        Geometry.merge = function (geometries) {
            // todo add a geometry check!
            // also a size check.. cant be too big!]
            var geometryOut = new Geometry();
            var arrays = [];
            var sizes = [];
            var offsets = [];
            var geometry;
            // pass one.. get sizes..
            for (var i = 0; i < geometries.length; i++) {
                geometry = geometries[i];
                for (var j = 0; j < geometry.buffers.length; j++) {
                    sizes[j] = sizes[j] || 0;
                    sizes[j] += geometry.buffers[j].data.length;
                    offsets[j] = 0;
                }
            }
            // build the correct size arrays..
            for (var i = 0; i < geometry.buffers.length; i++) {
                // TODO types!
                arrays[i] = new map$1$1[getBufferType$1(geometry.buffers[i].data)](sizes[i]);
                geometryOut.buffers[i] = new Buffer(arrays[i]);
            }
            // pass to set data..
            for (var i = 0; i < geometries.length; i++) {
                geometry = geometries[i];
                for (var j = 0; j < geometry.buffers.length; j++) {
                    arrays[j].set(geometry.buffers[j].data, offsets[j]);
                    offsets[j] += geometry.buffers[j].data.length;
                }
            }
            geometryOut.attributes = geometry.attributes;
            if (geometry.indexBuffer) {
                geometryOut.indexBuffer = geometryOut.buffers[geometry.buffers.indexOf(geometry.indexBuffer)];
                geometryOut.indexBuffer.index = true;
                var offset = 0;
                var stride = 0;
                var offset2 = 0;
                var bufferIndexToCount = 0;
                // get a buffer
                for (var i = 0; i < geometry.buffers.length; i++) {
                    if (geometry.buffers[i] !== geometry.indexBuffer) {
                        bufferIndexToCount = i;
                        break;
                    }
                }
                // figure out the stride of one buffer..
                for (var i in geometry.attributes) {
                    var attribute = geometry.attributes[i];
                    if ((attribute.buffer | 0) === bufferIndexToCount) {
                        stride += ((attribute.size * byteSizeMap[attribute.type]) / 4);
                    }
                }
                // time to off set all indexes..
                for (var i = 0; i < geometries.length; i++) {
                    var indexBufferData = geometries[i].indexBuffer.data;
                    for (var j = 0; j < indexBufferData.length; j++) {
                        geometryOut.indexBuffer.data[j + offset2] += offset;
                    }
                    offset += geometry.buffers[bufferIndexToCount].data.length / (stride);
                    offset2 += indexBufferData.length;
                }
            }
            return geometryOut;
        };
        return Geometry;
    }());

    /**
     * Helper class to create a quad
     *
     * @class
     * @memberof PIXI
     */
    var Quad = /** @class */ (function (_super) {
        __extends(Quad, _super);
        function Quad() {
            var _this = _super.call(this) || this;
            _this.addAttribute('aVertexPosition', new Float32Array([
                0, 0,
                1, 0,
                1, 1,
                0, 1 ]))
                .addIndex([0, 1, 3, 2]);
            return _this;
        }
        return Quad;
    }(Geometry));

    /**
     * Helper class to create a quad with uvs like in v4
     *
     * @class
     * @memberof PIXI
     * @extends PIXI.Geometry
     */
    var QuadUv = /** @class */ (function (_super) {
        __extends(QuadUv, _super);
        function QuadUv() {
            var _this = _super.call(this) || this;
            /**
             * An array of vertices
             *
             * @member {Float32Array}
             */
            _this.vertices = new Float32Array([
                -1, -1,
                1, -1,
                1, 1,
                -1, 1 ]);
            /**
             * The Uvs of the quad
             *
             * @member {Float32Array}
             */
            _this.uvs = new Float32Array([
                0, 0,
                1, 0,
                1, 1,
                0, 1 ]);
            _this.vertexBuffer = new Buffer(_this.vertices);
            _this.uvBuffer = new Buffer(_this.uvs);
            _this.addAttribute('aVertexPosition', _this.vertexBuffer)
                .addAttribute('aTextureCoord', _this.uvBuffer)
                .addIndex([0, 1, 2, 0, 2, 3]);
            return _this;
        }
        /**
         * Maps two Rectangle to the quad.
         *
         * @param {PIXI.Rectangle} targetTextureFrame - the first rectangle
         * @param {PIXI.Rectangle} destinationFrame - the second rectangle
         * @return {PIXI.Quad} Returns itself.
         */
        QuadUv.prototype.map = function (targetTextureFrame, destinationFrame) {
            var x = 0; // destinationFrame.x / targetTextureFrame.width;
            var y = 0; // destinationFrame.y / targetTextureFrame.height;
            this.uvs[0] = x;
            this.uvs[1] = y;
            this.uvs[2] = x + (destinationFrame.width / targetTextureFrame.width);
            this.uvs[3] = y;
            this.uvs[4] = x + (destinationFrame.width / targetTextureFrame.width);
            this.uvs[5] = y + (destinationFrame.height / targetTextureFrame.height);
            this.uvs[6] = x;
            this.uvs[7] = y + (destinationFrame.height / targetTextureFrame.height);
            x = destinationFrame.x;
            y = destinationFrame.y;
            this.vertices[0] = x;
            this.vertices[1] = y;
            this.vertices[2] = x + destinationFrame.width;
            this.vertices[3] = y;
            this.vertices[4] = x + destinationFrame.width;
            this.vertices[5] = y + destinationFrame.height;
            this.vertices[6] = x;
            this.vertices[7] = y + destinationFrame.height;
            this.invalidate();
            return this;
        };
        /**
         * legacy upload method, just marks buffers dirty
         * @returns {PIXI.QuadUv} Returns itself.
         */
        QuadUv.prototype.invalidate = function () {
            this.vertexBuffer._updateID++;
            this.uvBuffer._updateID++;
            return this;
        };
        return QuadUv;
    }(Geometry));

    var UID$2 = 0;
    /**
     * Uniform group holds uniform map and some ID's for work
     *
     * @class
     * @memberof PIXI
     */
    var UniformGroup = /** @class */ (function () {
        /**
         * @param {object} [uniforms] - Custom uniforms to use to augment the built-in ones.
         * @param {boolean} [_static] - Uniforms wont be changed after creation
         */
        function UniformGroup(uniforms, _static) {
            /**
             * uniform values
             * @member {object}
             * @readonly
             */
            this.uniforms = uniforms;
            /**
             * Its a group and not a single uniforms
             * @member {boolean}
             * @readonly
             * @default true
             */
            this.group = true;
            // lets generate this when the shader ?
            this.syncUniforms = {};
            /**
             * dirty version
             * @protected
             * @member {number}
             */
            this.dirtyId = 0;
            /**
             * unique id
             * @protected
             * @member {number}
             */
            this.id = UID$2++;
            /**
             * Uniforms wont be changed after creation
             * @member {boolean}
             */
            this.static = !!_static;
        }
        UniformGroup.prototype.update = function () {
            this.dirtyId++;
        };
        UniformGroup.prototype.add = function (name, uniforms, _static) {
            this.uniforms[name] = new UniformGroup(uniforms, _static);
        };
        UniformGroup.from = function (uniforms, _static) {
            return new UniformGroup(uniforms, _static);
        };
        return UniformGroup;
    }());

    /**
     * System plugin to the renderer to manage filter states.
     *
     * @class
     * @private
     */
    var FilterState = /** @class */ (function () {
        function FilterState() {
            this.renderTexture = null;
            /**
             * Target of the filters
             * We store for case when custom filter wants to know the element it was applied on
             * @member {PIXI.DisplayObject}
             * @private
             */
            this.target = null;
            /**
             * Compatibility with PixiJS v4 filters
             * @member {boolean}
             * @default false
             * @private
             */
            this.legacy = false;
            /**
             * Resolution of filters
             * @member {number}
             * @default 1
             * @private
             */
            this.resolution = 1;
            // next three fields are created only for root
            // re-assigned for everything else
            /**
             * Source frame
             * @member {PIXI.Rectangle}
             * @private
             */
            this.sourceFrame = new Rectangle();
            /**
             * Destination frame
             * @member {PIXI.Rectangle}
             * @private
             */
            this.destinationFrame = new Rectangle();
            /**
             * Collection of filters
             * @member {PIXI.Filter[]}
             * @private
             */
            this.filters = [];
        }
        /**
         * clears the state
         * @private
         */
        FilterState.prototype.clear = function () {
            this.target = null;
            this.filters = null;
            this.renderTexture = null;
        };
        return FilterState;
    }());

    /**
     * System plugin to the renderer to manage the filters.
     *
     * @class
     * @memberof PIXI.systems
     * @extends PIXI.System
     */
    var FilterSystem = /** @class */ (function (_super) {
        __extends(FilterSystem, _super);
        /**
         * @param {PIXI.Renderer} renderer - The renderer this System works for.
         */
        function FilterSystem(renderer) {
            var _this = _super.call(this, renderer) || this;
            /**
             * List of filters for the FilterSystem
             * @member {Object[]}
             * @readonly
             */
            _this.defaultFilterStack = [{}];
            /**
             * stores a bunch of PO2 textures used for filtering
             * @member {Object}
             */
            _this.texturePool = new RenderTexturePool();
            _this.texturePool.setScreenSize(renderer.view);
            /**
             * a pool for storing filter states, save us creating new ones each tick
             * @member {Object[]}
             */
            _this.statePool = [];
            /**
             * A very simple geometry used when drawing a filter effect to the screen
             * @member {PIXI.Quad}
             */
            _this.quad = new Quad();
            /**
             * Quad UVs
             * @member {PIXI.QuadUv}
             */
            _this.quadUv = new QuadUv();
            /**
             * Temporary rect for maths
             * @type {PIXI.Rectangle}
             */
            _this.tempRect = new Rectangle();
            /**
             * Active state
             * @member {object}
             */
            _this.activeState = {};
            /**
             * This uniform group is attached to filter uniforms when used
             * @member {PIXI.UniformGroup}
             * @property {PIXI.Rectangle} outputFrame
             * @property {Float32Array} inputSize
             * @property {Float32Array} inputPixel
             * @property {Float32Array} inputClamp
             * @property {Number} resolution
             * @property {Float32Array} filterArea
             * @property {Fload32Array} filterClamp
             */
            _this.globalUniforms = new UniformGroup({
                outputFrame: _this.tempRect,
                inputSize: new Float32Array(4),
                inputPixel: new Float32Array(4),
                inputClamp: new Float32Array(4),
                resolution: 1,
                // legacy variables
                filterArea: new Float32Array(4),
                filterClamp: new Float32Array(4),
            }, true);
            /**
             * Whether to clear output renderTexture in AUTO/BLIT mode. See {@link PIXI.CLEAR_MODES}
             * @member {boolean}
             */
            _this.forceClear = false;
            /**
             * Old padding behavior is to use the max amount instead of sum padding.
             * Use this flag if you need the old behavior.
             * @member {boolean}
             * @default false
             */
            _this.useMaxPadding = false;
            return _this;
        }
        /**
         * Adds a new filter to the System.
         *
         * @param {PIXI.DisplayObject} target - The target of the filter to render.
         * @param {PIXI.Filter[]} filters - The filters to apply.
         */
        FilterSystem.prototype.push = function (target, filters) {
            var renderer = this.renderer;
            var filterStack = this.defaultFilterStack;
            var state = this.statePool.pop() || new FilterState();
            var resolution = filters[0].resolution;
            var padding = filters[0].padding;
            var autoFit = filters[0].autoFit;
            var legacy = filters[0].legacy;
            for (var i = 1; i < filters.length; i++) {
                var filter = filters[i];
                // lets use the lowest resolution..
                resolution = Math.min(resolution, filter.resolution);
                // figure out the padding required for filters
                padding = this.useMaxPadding
                    // old behavior: use largest amount of padding!
                    ? Math.max(padding, filter.padding)
                    // new behavior: sum the padding
                    : padding + filter.padding;
                // only auto fit if all filters are autofit
                autoFit = autoFit || filter.autoFit;
                legacy = legacy || filter.legacy;
            }
            if (filterStack.length === 1) {
                this.defaultFilterStack[0].renderTexture = renderer.renderTexture.current;
            }
            filterStack.push(state);
            state.resolution = resolution;
            state.legacy = legacy;
            state.target = target;
            state.sourceFrame.copyFrom(target.filterArea || target.getBounds(true));
            state.sourceFrame.pad(padding);
            if (autoFit) {
                state.sourceFrame.fit(this.renderer.renderTexture.sourceFrame);
            }
            // round to whole number based on resolution
            state.sourceFrame.ceil(resolution);
            state.renderTexture = this.getOptimalFilterTexture(state.sourceFrame.width, state.sourceFrame.height, resolution);
            state.filters = filters;
            state.destinationFrame.width = state.renderTexture.width;
            state.destinationFrame.height = state.renderTexture.height;
            var destinationFrame = this.tempRect;
            destinationFrame.width = state.sourceFrame.width;
            destinationFrame.height = state.sourceFrame.height;
            state.renderTexture.filterFrame = state.sourceFrame;
            renderer.renderTexture.bind(state.renderTexture, state.sourceFrame, destinationFrame);
            renderer.renderTexture.clear();
        };
        /**
         * Pops off the filter and applies it.
         *
         */
        FilterSystem.prototype.pop = function () {
            var filterStack = this.defaultFilterStack;
            var state = filterStack.pop();
            var filters = state.filters;
            this.activeState = state;
            var globalUniforms = this.globalUniforms.uniforms;
            globalUniforms.outputFrame = state.sourceFrame;
            globalUniforms.resolution = state.resolution;
            var inputSize = globalUniforms.inputSize;
            var inputPixel = globalUniforms.inputPixel;
            var inputClamp = globalUniforms.inputClamp;
            inputSize[0] = state.destinationFrame.width;
            inputSize[1] = state.destinationFrame.height;
            inputSize[2] = 1.0 / inputSize[0];
            inputSize[3] = 1.0 / inputSize[1];
            inputPixel[0] = inputSize[0] * state.resolution;
            inputPixel[1] = inputSize[1] * state.resolution;
            inputPixel[2] = 1.0 / inputPixel[0];
            inputPixel[3] = 1.0 / inputPixel[1];
            inputClamp[0] = 0.5 * inputPixel[2];
            inputClamp[1] = 0.5 * inputPixel[3];
            inputClamp[2] = (state.sourceFrame.width * inputSize[2]) - (0.5 * inputPixel[2]);
            inputClamp[3] = (state.sourceFrame.height * inputSize[3]) - (0.5 * inputPixel[3]);
            // only update the rect if its legacy..
            if (state.legacy) {
                var filterArea = globalUniforms.filterArea;
                filterArea[0] = state.destinationFrame.width;
                filterArea[1] = state.destinationFrame.height;
                filterArea[2] = state.sourceFrame.x;
                filterArea[3] = state.sourceFrame.y;
                globalUniforms.filterClamp = globalUniforms.inputClamp;
            }
            this.globalUniforms.update();
            var lastState = filterStack[filterStack.length - 1];
            if (state.renderTexture.framebuffer.multisample > 1) {
                this.renderer.framebuffer.blit();
            }
            if (filters.length === 1) {
                filters[0].apply(this, state.renderTexture, lastState.renderTexture, CLEAR_MODES.BLEND, state);
                this.returnFilterTexture(state.renderTexture);
            }
            else {
                var flip = state.renderTexture;
                var flop = this.getOptimalFilterTexture(flip.width, flip.height, state.resolution);
                flop.filterFrame = flip.filterFrame;
                var i = 0;
                for (i = 0; i < filters.length - 1; ++i) {
                    filters[i].apply(this, flip, flop, CLEAR_MODES.CLEAR, state);
                    var t = flip;
                    flip = flop;
                    flop = t;
                }
                filters[i].apply(this, flip, lastState.renderTexture, CLEAR_MODES.BLEND, state);
                this.returnFilterTexture(flip);
                this.returnFilterTexture(flop);
            }
            state.clear();
            this.statePool.push(state);
        };
        /**
         * Binds a renderTexture with corresponding `filterFrame`, clears it if mode corresponds.
         * @param {PIXI.RenderTexture} filterTexture - renderTexture to bind, should belong to filter pool or filter stack
         * @param {PIXI.CLEAR_MODES} [clearMode] - clearMode, by default its CLEAR/YES. See {@link PIXI.CLEAR_MODES}
         */
        FilterSystem.prototype.bindAndClear = function (filterTexture, clearMode) {
            if (clearMode === void 0) { clearMode = CLEAR_MODES.CLEAR; }
            if (filterTexture && filterTexture.filterFrame) {
                var destinationFrame = this.tempRect;
                destinationFrame.width = filterTexture.filterFrame.width;
                destinationFrame.height = filterTexture.filterFrame.height;
                this.renderer.renderTexture.bind(filterTexture, filterTexture.filterFrame, destinationFrame);
            }
            else {
                this.renderer.renderTexture.bind(filterTexture);
            }
            // TODO: remove in next major version
            if (typeof clearMode === 'boolean') {
                clearMode = clearMode ? CLEAR_MODES.CLEAR : CLEAR_MODES.BLEND;
                // get deprecation function from utils
                deprecation('5.2.1', 'Use CLEAR_MODES when using clear applyFilter option');
            }
            if (clearMode === CLEAR_MODES.CLEAR
                || (clearMode === CLEAR_MODES.BLIT && this.forceClear)) {
                this.renderer.renderTexture.clear();
            }
        };
        /**
         * Draws a filter.
         *
         * @param {PIXI.Filter} filter - The filter to draw.
         * @param {PIXI.RenderTexture} input - The input render target.
         * @param {PIXI.RenderTexture} output - The target to output to.
         * @param {PIXI.CLEAR_MODES} [clearMode] - Should the output be cleared before rendering to it
         */
        FilterSystem.prototype.applyFilter = function (filter, input, output, clearMode) {
            var renderer = this.renderer;
            this.bindAndClear(output, clearMode);
            // set the uniforms..
            filter.uniforms.uSampler = input;
            filter.uniforms.filterGlobals = this.globalUniforms;
            // TODO make it so that the order of this does not matter..
            // because it does at the moment cos of global uniforms.
            // they need to get resynced
            renderer.state.set(filter.state);
            renderer.shader.bind(filter);
            if (filter.legacy) {
                this.quadUv.map(input._frame, input.filterFrame);
                renderer.geometry.bind(this.quadUv);
                renderer.geometry.draw(DRAW_MODES.TRIANGLES);
            }
            else {
                renderer.geometry.bind(this.quad);
                renderer.geometry.draw(DRAW_MODES.TRIANGLE_STRIP);
            }
        };
        /**
         * Multiply _input normalized coordinates_ to this matrix to get _sprite texture normalized coordinates_.
         *
         * Use `outputMatrix * vTextureCoord` in the shader.
         *
         * @param {PIXI.Matrix} outputMatrix - The matrix to output to.
         * @param {PIXI.Sprite} sprite - The sprite to map to.
         * @return {PIXI.Matrix} The mapped matrix.
         */
        FilterSystem.prototype.calculateSpriteMatrix = function (outputMatrix, sprite) {
            var _a = this.activeState, sourceFrame = _a.sourceFrame, destinationFrame = _a.destinationFrame;
            var orig = sprite._texture.orig;
            var mappedMatrix = outputMatrix.set(destinationFrame.width, 0, 0, destinationFrame.height, sourceFrame.x, sourceFrame.y);
            var worldTransform = sprite.worldTransform.copyTo(Matrix.TEMP_MATRIX);
            worldTransform.invert();
            mappedMatrix.prepend(worldTransform);
            mappedMatrix.scale(1.0 / orig.width, 1.0 / orig.height);
            mappedMatrix.translate(sprite.anchor.x, sprite.anchor.y);
            return mappedMatrix;
        };
        /**
         * Destroys this Filter System.
         */
        FilterSystem.prototype.destroy = function () {
            // Those textures has to be destroyed by RenderTextureSystem or FramebufferSystem
            this.texturePool.clear(false);
        };
        /**
         * Gets a Power-of-Two render texture or fullScreen texture
         *
         * @protected
         * @param {number} minWidth - The minimum width of the render texture in real pixels.
         * @param {number} minHeight - The minimum height of the render texture in real pixels.
         * @param {number} [resolution=1] - The resolution of the render texture.
         * @return {PIXI.RenderTexture} The new render texture.
         */
        FilterSystem.prototype.getOptimalFilterTexture = function (minWidth, minHeight, resolution) {
            if (resolution === void 0) { resolution = 1; }
            return this.texturePool.getOptimalTexture(minWidth, minHeight, resolution);
        };
        /**
         * Gets extra render texture to use inside current filter
         * To be compliant with older filters, you can use params in any order
         *
         * @param {PIXI.RenderTexture} [input] - renderTexture from which size and resolution will be copied
         * @param {number} [resolution] - override resolution of the renderTexture
         * @returns {PIXI.RenderTexture}
         */
        FilterSystem.prototype.getFilterTexture = function (input, resolution) {
            if (typeof input === 'number') {
                var swap = input;
                input = resolution;
                resolution = swap;
            }
            input = input || this.activeState.renderTexture;
            var filterTexture = this.texturePool.getOptimalTexture(input.width, input.height, resolution || input.resolution);
            filterTexture.filterFrame = input.filterFrame;
            return filterTexture;
        };
        /**
         * Frees a render texture back into the pool.
         *
         * @param {PIXI.RenderTexture} renderTexture - The renderTarget to free
         */
        FilterSystem.prototype.returnFilterTexture = function (renderTexture) {
            this.texturePool.returnTexture(renderTexture);
        };
        /**
         * Empties the texture pool.
         */
        FilterSystem.prototype.emptyPool = function () {
            this.texturePool.clear(true);
        };
        /**
         * calls `texturePool.resize()`, affects fullScreen renderTextures
         */
        FilterSystem.prototype.resize = function () {
            this.texturePool.setScreenSize(this.renderer.view);
        };
        return FilterSystem;
    }(System));

    /**
     * Base for a common object renderer that can be used as a
     * system renderer plugin.
     *
     * @class
     * @extends PIXI.System
     * @memberof PIXI
     */
    var ObjectRenderer = /** @class */ (function () {
        /**
         * @param {PIXI.Renderer} renderer - The renderer this manager works for.
         */
        function ObjectRenderer(renderer) {
            /**
             * The renderer this manager works for.
             *
             * @member {PIXI.Renderer}
             */
            this.renderer = renderer;
        }
        /**
         * Stub method that should be used to empty the current
         * batch by rendering objects now.
         */
        ObjectRenderer.prototype.flush = function () {
            // flush!
        };
        /**
         * Generic destruction method that frees all resources. This
         * should be called by subclasses.
         */
        ObjectRenderer.prototype.destroy = function () {
            this.renderer = null;
        };
        /**
         * Stub method that initializes any state required before
         * rendering starts. It is different from the `prerender`
         * signal, which occurs every frame, in that it is called
         * whenever an object requests _this_ renderer specifically.
         */
        ObjectRenderer.prototype.start = function () {
            // set the shader..
        };
        /**
         * Stops the renderer. It should free up any state and
         * become dormant.
         */
        ObjectRenderer.prototype.stop = function () {
            this.flush();
        };
        /**
         * Keeps the object to render. It doesn't have to be
         * rendered immediately.
         *
         * @param {PIXI.DisplayObject} object - The object to render.
         */
        ObjectRenderer.prototype.render = function (_object) {
            // render the object
        };
        return ObjectRenderer;
    }());

    /**
     * System plugin to the renderer to manage batching.
     *
     * @class
     * @extends PIXI.System
     * @memberof PIXI.systems
     */
    var BatchSystem = /** @class */ (function (_super) {
        __extends(BatchSystem, _super);
        /**
         * @param {PIXI.Renderer} renderer - The renderer this System works for.
         */
        function BatchSystem(renderer) {
            var _this = _super.call(this, renderer) || this;
            /**
             * An empty renderer.
             *
             * @member {PIXI.ObjectRenderer}
             */
            _this.emptyRenderer = new ObjectRenderer(renderer);
            /**
             * The currently active ObjectRenderer.
             *
             * @member {PIXI.ObjectRenderer}
             */
            _this.currentRenderer = _this.emptyRenderer;
            return _this;
        }
        /**
         * Changes the current renderer to the one given in parameter
         *
         * @param {PIXI.ObjectRenderer} objectRenderer - The object renderer to use.
         */
        BatchSystem.prototype.setObjectRenderer = function (objectRenderer) {
            if (this.currentRenderer === objectRenderer) {
                return;
            }
            this.currentRenderer.stop();
            this.currentRenderer = objectRenderer;
            this.currentRenderer.start();
        };
        /**
         * This should be called if you wish to do some custom rendering
         * It will basically render anything that may be batched up such as sprites
         */
        BatchSystem.prototype.flush = function () {
            this.setObjectRenderer(this.emptyRenderer);
        };
        /**
         * Reset the system to an empty renderer
         */
        BatchSystem.prototype.reset = function () {
            this.setObjectRenderer(this.emptyRenderer);
        };
        /**
         * Handy function for batch renderers: copies bound textures in first maxTextures locations to array
         * sets actual _batchLocation for them
         *
         * @param {PIXI.BaseTexture[]} - arr copy destination
         * @param {number} maxTextures - number of copied elements
         */
        BatchSystem.prototype.copyBoundTextures = function (arr, maxTextures) {
            var boundTextures = this.renderer.texture.boundTextures;
            for (var i = maxTextures - 1; i >= 0; --i) {
                arr[i] = boundTextures[i] || null;
                if (arr[i]) {
                    arr[i]._batchLocation = i;
                }
            }
        };
        /**
         * Assigns batch locations to textures in array based on boundTextures state.
         * All textures in texArray should have `_batchEnabled = _batchId`,
         * and their count should be less than `maxTextures`.
         *
         * @param {PIXI.BatchTextureArray} texArray - textures to bound
         * @param {PIXI.BaseTexture[]} boundTextures - current state of bound textures
         * @param {number} batchId - marker for _batchEnabled param of textures in texArray
         * @param {number} maxTextures - number of texture locations to manipulate
         */
        BatchSystem.prototype.boundArray = function (texArray, boundTextures, batchId, maxTextures) {
            var elements = texArray.elements, ids = texArray.ids, count = texArray.count;
            var j = 0;
            for (var i = 0; i < count; i++) {
                var tex = elements[i];
                var loc = tex._batchLocation;
                if (loc >= 0 && loc < maxTextures
                    && boundTextures[loc] === tex) {
                    ids[i] = loc;
                    continue;
                }
                while (j < maxTextures) {
                    var bound = boundTextures[j];
                    if (bound && bound._batchEnabled === batchId
                        && bound._batchLocation === j) {
                        j++;
                        continue;
                    }
                    ids[i] = j;
                    tex._batchLocation = j;
                    boundTextures[j] = tex;
                    break;
                }
            }
        };
        return BatchSystem;
    }(System));

    var CONTEXT_UID_COUNTER = 0;
    /**
     * System plugin to the renderer to manage the context.
     *
     * @class
     * @extends PIXI.System
     * @memberof PIXI.systems
     */
    var ContextSystem = /** @class */ (function (_super) {
        __extends(ContextSystem, _super);
        /* eslint-enable camelcase */
        /**
         * @param {PIXI.Renderer} renderer - The renderer this System works for.
         */
        function ContextSystem(renderer) {
            var _this = _super.call(this, renderer) || this;
            /**
             * Either 1 or 2 to reflect the WebGL version being used
             * @member {number}
             * @readonly
             */
            _this.webGLVersion = 1;
            /**
             * Extensions being used
             * @member {object}
             * @readonly
             * @property {WEBGL_draw_buffers} drawBuffers - WebGL v1 extension
             * @property {WEBGL_depth_texture} depthTexture - WebGL v1 extension
             * @property {OES_texture_float} floatTexture - WebGL v1 extension
             * @property {WEBGL_lose_context} loseContext - WebGL v1 extension
             * @property {OES_vertex_array_object} vertexArrayObject - WebGL v1 extension
             * @property {EXT_texture_filter_anisotropic} anisotropicFiltering - WebGL v1 and v2 extension
             */
            _this.extensions = {};
            /**
             * Features supported by current context
             * @member {object}
             * @private
             * @readonly
             * @property {boolean} uint32Indices - Supports of 32-bit indices buffer
             */
            _this.supports = {
                uint32Indices: false,
            };
            // Bind functions
            _this.handleContextLost = _this.handleContextLost.bind(_this);
            _this.handleContextRestored = _this.handleContextRestored.bind(_this);
            renderer.view.addEventListener('webglcontextlost', _this.handleContextLost, false);
            renderer.view.addEventListener('webglcontextrestored', _this.handleContextRestored, false);
            return _this;
        }
        Object.defineProperty(ContextSystem.prototype, "isLost", {
            /**
             * `true` if the context is lost
             * @member {boolean}
             * @readonly
             */
            get: function () {
                return (!this.gl || this.gl.isContextLost());
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Handle the context change event
         * @param {WebGLRenderingContext} gl - new webgl context
         */
        ContextSystem.prototype.contextChange = function (gl) {
            this.gl = gl;
            this.renderer.gl = gl;
            this.renderer.CONTEXT_UID = CONTEXT_UID_COUNTER++;
            // restore a context if it was previously lost
            if (gl.isContextLost() && gl.getExtension('WEBGL_lose_context')) {
                gl.getExtension('WEBGL_lose_context').restoreContext();
            }
        };
        /**
         * Initialize the context
         *
         * @protected
         * @param {WebGLRenderingContext} gl - WebGL context
         */
        ContextSystem.prototype.initFromContext = function (gl) {
            this.gl = gl;
            this.validateContext(gl);
            this.renderer.gl = gl;
            this.renderer.CONTEXT_UID = CONTEXT_UID_COUNTER++;
            this.renderer.runners.contextChange.emit(gl);
        };
        /**
         * Initialize from context options
         *
         * @protected
         * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
         * @param {object} options - context attributes
         */
        ContextSystem.prototype.initFromOptions = function (options) {
            var gl = this.createContext(this.renderer.view, options);
            this.initFromContext(gl);
        };
        /**
         * Helper class to create a WebGL Context
         *
         * @param canvas {HTMLCanvasElement} the canvas element that we will get the context from
         * @param options {object} An options object that gets passed in to the canvas element containing the context attributes
         * @see https://developer.mozilla.org/en/docs/Web/API/HTMLCanvasElement/getContext
         * @return {WebGLRenderingContext} the WebGL context
         */
        ContextSystem.prototype.createContext = function (canvas, options) {
            var gl;
            if (settings.PREFER_ENV >= ENV.WEBGL2) {
                gl = canvas.getContext('webgl2', options);
            }
            if (gl) {
                this.webGLVersion = 2;
            }
            else {
                this.webGLVersion = 1;
                gl = canvas.getContext('webgl', options)
                    || canvas.getContext('experimental-webgl', options);
                if (!gl) {
                    // fail, not able to get a context
                    throw new Error('This browser does not support WebGL. Try using the canvas renderer');
                }
            }
            this.gl = gl;
            this.getExtensions();
            return this.gl;
        };
        /**
         * Auto-populate the extensions
         *
         * @protected
         */
        ContextSystem.prototype.getExtensions = function () {
            // time to set up default extensions that Pixi uses.
            var gl = this.gl;
            if (this.webGLVersion === 1) {
                Object.assign(this.extensions, {
                    drawBuffers: gl.getExtension('WEBGL_draw_buffers'),
                    depthTexture: gl.getExtension('WEBGL_depth_texture'),
                    loseContext: gl.getExtension('WEBGL_lose_context'),
                    vertexArrayObject: gl.getExtension('OES_vertex_array_object')
                        || gl.getExtension('MOZ_OES_vertex_array_object')
                        || gl.getExtension('WEBKIT_OES_vertex_array_object'),
                    anisotropicFiltering: gl.getExtension('EXT_texture_filter_anisotropic'),
                    uint32ElementIndex: gl.getExtension('OES_element_index_uint'),
                    // Floats and half-floats
                    floatTexture: gl.getExtension('OES_texture_float'),
                    floatTextureLinear: gl.getExtension('OES_texture_float_linear'),
                    textureHalfFloat: gl.getExtension('OES_texture_half_float'),
                    textureHalfFloatLinear: gl.getExtension('OES_texture_half_float_linear'),
                });
            }
            else if (this.webGLVersion === 2) {
                Object.assign(this.extensions, {
                    anisotropicFiltering: gl.getExtension('EXT_texture_filter_anisotropic'),
                    // Floats and half-floats
                    colorBufferFloat: gl.getExtension('EXT_color_buffer_float'),
                    floatTextureLinear: gl.getExtension('OES_texture_float_linear'),
                });
            }
        };
        /**
         * Handles a lost webgl context
         *
         * @protected
         * @param {WebGLContextEvent} event - The context lost event.
         */
        ContextSystem.prototype.handleContextLost = function (event) {
            event.preventDefault();
        };
        /**
         * Handles a restored webgl context
         *
         * @protected
         */
        ContextSystem.prototype.handleContextRestored = function () {
            this.renderer.runners.contextChange.emit(this.gl);
        };
        ContextSystem.prototype.destroy = function () {
            var view = this.renderer.view;
            // remove listeners
            view.removeEventListener('webglcontextlost', this.handleContextLost);
            view.removeEventListener('webglcontextrestored', this.handleContextRestored);
            this.gl.useProgram(null);
            if (this.extensions.loseContext) {
                this.extensions.loseContext.loseContext();
            }
        };
        /**
         * Handle the post-render runner event
         *
         * @protected
         */
        ContextSystem.prototype.postrender = function () {
            if (this.renderer.renderingToScreen) {
                this.gl.flush();
            }
        };
        /**
         * Validate context
         *
         * @protected
         * @param {WebGLRenderingContext} gl - Render context
         */
        ContextSystem.prototype.validateContext = function (gl) {
            var attributes = gl.getContextAttributes();
            // this is going to be fairly simple for now.. but at least we have room to grow!
            if (!attributes.stencil) {
                /* eslint-disable max-len, no-console */
                console.warn('Provided WebGL context does not have a stencil buffer, masks may not render correctly');
                /* eslint-enable max-len, no-console */
            }
            var hasuint32 = ('WebGL2RenderingContext' in window && gl instanceof window.WebGL2RenderingContext)
                || !!gl.getExtension('OES_element_index_uint');
            this.supports.uint32Indices = hasuint32;
            if (!hasuint32) {
                /* eslint-disable max-len, no-console */
                console.warn('Provided WebGL context does not support 32 index buffer, complex graphics may not render correctly');
                /* eslint-enable max-len, no-console */
            }
        };
        return ContextSystem;
    }(System));

    /**
     * Internal framebuffer for WebGL context
     * @class
     * @memberof PIXI
     */
    var GLFramebuffer = /** @class */ (function () {
        function GLFramebuffer(framebuffer) {
            /**
             * The WebGL framebuffer
             * @member {WebGLFramebuffer}
             */
            this.framebuffer = framebuffer;
            /**
             * stencil+depth , usually costs 32bits per pixel
             * @member {WebGLRenderbuffer}
             */
            this.stencil = null;
            /**
             * latest known version of framebuffer
             * @member {number}
             * @protected
             */
            this.dirtyId = 0;
            /**
             * latest known version of framebuffer format
             * @member {number}
             * @protected
             */
            this.dirtyFormat = 0;
            /**
             * latest known version of framebuffer size
             * @member {number}
             * @protected
             */
            this.dirtySize = 0;
            /**
             * Detected AA samples number
             * @member {PIXI.MSAA_QUALITY}
             */
            this.multisample = MSAA_QUALITY.NONE;
            /**
             * In case MSAA, we use this Renderbuffer instead of colorTextures[0] when we write info
             * @member {WebGLRenderbuffer}
             */
            this.msaaBuffer = null;
            /**
             * In case we use MSAA, this is actual framebuffer that has colorTextures[0]
             * The contents of that framebuffer are read when we use that renderTexture in sprites
             * @member {PIXI.Framebuffer}
             */
            this.blitFramebuffer = null;
        }
        return GLFramebuffer;
    }());

    var tempRectangle = new Rectangle();
    /**
     * System plugin to the renderer to manage framebuffers.
     *
     * @class
     * @extends PIXI.System
     * @memberof PIXI.systems
     */
    var FramebufferSystem = /** @class */ (function (_super) {
        __extends(FramebufferSystem, _super);
        /**
         * @param {PIXI.Renderer} renderer - The renderer this System works for.
         */
        function FramebufferSystem(renderer) {
            var _this = _super.call(this, renderer) || this;
            /**
             * A list of managed framebuffers
             * @member {PIXI.Framebuffer[]}
             * @readonly
             */
            _this.managedFramebuffers = [];
            /**
             * Framebuffer value that shows that we don't know what is bound
             * @member {Framebuffer}
             * @readonly
             */
            _this.unknownFramebuffer = new Framebuffer(10, 10);
            _this.msaaSamples = null;
            return _this;
        }
        /**
         * Sets up the renderer context and necessary buffers.
         */
        FramebufferSystem.prototype.contextChange = function () {
            var gl = this.gl = this.renderer.gl;
            this.CONTEXT_UID = this.renderer.CONTEXT_UID;
            this.current = this.unknownFramebuffer;
            this.viewport = new Rectangle();
            this.hasMRT = true;
            this.writeDepthTexture = true;
            this.disposeAll(true);
            // webgl2
            if (this.renderer.context.webGLVersion === 1) {
                // webgl 1!
                var nativeDrawBuffersExtension_1 = this.renderer.context.extensions.drawBuffers;
                var nativeDepthTextureExtension = this.renderer.context.extensions.depthTexture;
                if (settings.PREFER_ENV === ENV.WEBGL_LEGACY) {
                    nativeDrawBuffersExtension_1 = null;
                    nativeDepthTextureExtension = null;
                }
                if (nativeDrawBuffersExtension_1) {
                    gl.drawBuffers = function (activeTextures) {
                        return nativeDrawBuffersExtension_1.drawBuffersWEBGL(activeTextures);
                    };
                }
                else {
                    this.hasMRT = false;
                    gl.drawBuffers = function () {
                        // empty
                    };
                }
                if (!nativeDepthTextureExtension) {
                    this.writeDepthTexture = false;
                }
            }
            else {
                // WebGL2
                // cache possible MSAA samples
                this.msaaSamples = gl.getInternalformatParameter(gl.RENDERBUFFER, gl.RGBA8, gl.SAMPLES);
            }
        };
        /**
         * Bind a framebuffer
         *
         * @param {PIXI.Framebuffer} framebuffer
         * @param {PIXI.Rectangle} [frame] frame, default is framebuffer size
         */
        FramebufferSystem.prototype.bind = function (framebuffer, frame) {
            var gl = this.gl;
            if (framebuffer) {
                // TODO caching layer!
                var fbo = framebuffer.glFramebuffers[this.CONTEXT_UID] || this.initFramebuffer(framebuffer);
                if (this.current !== framebuffer) {
                    this.current = framebuffer;
                    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.framebuffer);
                }
                // make sure all textures are unbound..
                // now check for updates...
                if (fbo.dirtyId !== framebuffer.dirtyId) {
                    fbo.dirtyId = framebuffer.dirtyId;
                    if (fbo.dirtyFormat !== framebuffer.dirtyFormat) {
                        fbo.dirtyFormat = framebuffer.dirtyFormat;
                        this.updateFramebuffer(framebuffer);
                    }
                    else if (fbo.dirtySize !== framebuffer.dirtySize) {
                        fbo.dirtySize = framebuffer.dirtySize;
                        this.resizeFramebuffer(framebuffer);
                    }
                }
                for (var i = 0; i < framebuffer.colorTextures.length; i++) {
                    var tex = framebuffer.colorTextures[i];
                    this.renderer.texture.unbind(tex.parentTextureArray || tex);
                }
                if (framebuffer.depthTexture) {
                    this.renderer.texture.unbind(framebuffer.depthTexture);
                }
                if (frame) {
                    this.setViewport(frame.x, frame.y, frame.width, frame.height);
                }
                else {
                    this.setViewport(0, 0, framebuffer.width, framebuffer.height);
                }
            }
            else {
                if (this.current) {
                    this.current = null;
                    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                }
                if (frame) {
                    this.setViewport(frame.x, frame.y, frame.width, frame.height);
                }
                else {
                    this.setViewport(0, 0, this.renderer.width, this.renderer.height);
                }
            }
        };
        /**
         * Set the WebGLRenderingContext's viewport.
         *
         * @param {Number} x - X position of viewport
         * @param {Number} y - Y position of viewport
         * @param {Number} width - Width of viewport
         * @param {Number} height - Height of viewport
         */
        FramebufferSystem.prototype.setViewport = function (x, y, width, height) {
            var v = this.viewport;
            if (v.width !== width || v.height !== height || v.x !== x || v.y !== y) {
                v.x = x;
                v.y = y;
                v.width = width;
                v.height = height;
                this.gl.viewport(x, y, width, height);
            }
        };
        Object.defineProperty(FramebufferSystem.prototype, "size", {
            /**
             * Get the size of the current width and height. Returns object with `width` and `height` values.
             *
             * @member {object}
             * @readonly
             */
            get: function () {
                if (this.current) {
                    // TODO store temp
                    return { x: 0, y: 0, width: this.current.width, height: this.current.height };
                }
                return { x: 0, y: 0, width: this.renderer.width, height: this.renderer.height };
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Clear the color of the context
         *
         * @param {Number} r - Red value from 0 to 1
         * @param {Number} g - Green value from 0 to 1
         * @param {Number} b - Blue value from 0 to 1
         * @param {Number} a - Alpha value from 0 to 1
         * @param {PIXI.BUFFER_BITS} [mask=BUFFER_BITS.COLOR | BUFFER_BITS.DEPTH] - Bitwise OR of masks
         *  that indicate the buffers to be cleared, by default COLOR and DEPTH buffers.
         */
        FramebufferSystem.prototype.clear = function (r, g, b, a, mask) {
            if (mask === void 0) { mask = BUFFER_BITS.COLOR | BUFFER_BITS.DEPTH; }
            var gl = this.gl;
            // TODO clear color can be set only one right?
            gl.clearColor(r, g, b, a);
            gl.clear(mask);
        };
        /**
         * Initialize framebuffer for this context
         *
         * @protected
         * @param {PIXI.Framebuffer} framebuffer
         * @returns {PIXI.GLFramebuffer} created GLFramebuffer
         */
        FramebufferSystem.prototype.initFramebuffer = function (framebuffer) {
            var gl = this.gl;
            var fbo = new GLFramebuffer(gl.createFramebuffer());
            fbo.multisample = this.detectSamples(framebuffer.multisample);
            framebuffer.glFramebuffers[this.CONTEXT_UID] = fbo;
            this.managedFramebuffers.push(framebuffer);
            framebuffer.disposeRunner.add(this);
            return fbo;
        };
        /**
         * Resize the framebuffer
         *
         * @protected
         * @param {PIXI.Framebuffer} framebuffer
         */
        FramebufferSystem.prototype.resizeFramebuffer = function (framebuffer) {
            var gl = this.gl;
            var fbo = framebuffer.glFramebuffers[this.CONTEXT_UID];
            if (fbo.stencil) {
                gl.bindRenderbuffer(gl.RENDERBUFFER, fbo.stencil);
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, framebuffer.width, framebuffer.height);
            }
            var colorTextures = framebuffer.colorTextures;
            for (var i = 0; i < colorTextures.length; i++) {
                this.renderer.texture.bind(colorTextures[i], 0);
            }
            if (framebuffer.depthTexture) {
                this.renderer.texture.bind(framebuffer.depthTexture, 0);
            }
        };
        /**
         * Update the framebuffer
         *
         * @protected
         * @param {PIXI.Framebuffer} framebuffer
         */
        FramebufferSystem.prototype.updateFramebuffer = function (framebuffer) {
            var gl = this.gl;
            var fbo = framebuffer.glFramebuffers[this.CONTEXT_UID];
            // bind the color texture
            var colorTextures = framebuffer.colorTextures;
            var count = colorTextures.length;
            if (!gl.drawBuffers) {
                count = Math.min(count, 1);
            }
            if (fbo.multisample > 1) {
                fbo.msaaBuffer = gl.createRenderbuffer();
                gl.bindRenderbuffer(gl.RENDERBUFFER, fbo.msaaBuffer);
                gl.renderbufferStorageMultisample(gl.RENDERBUFFER, fbo.multisample, gl.RGBA8, framebuffer.width, framebuffer.height);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, fbo.msaaBuffer);
            }
            var activeTextures = [];
            for (var i = 0; i < count; i++) {
                if (i === 0 && fbo.multisample > 1) {
                    continue;
                }
                var texture = framebuffer.colorTextures[i];
                var parentTexture = texture.parentTextureArray || texture;
                this.renderer.texture.bind(parentTexture, 0);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, texture.target, parentTexture._glTextures[this.CONTEXT_UID].texture, 0);
                activeTextures.push(gl.COLOR_ATTACHMENT0 + i);
            }
            if (activeTextures.length > 1) {
                gl.drawBuffers(activeTextures);
            }
            if (framebuffer.depthTexture) {
                var writeDepthTexture = this.writeDepthTexture;
                if (writeDepthTexture) {
                    var depthTexture = framebuffer.depthTexture;
                    this.renderer.texture.bind(depthTexture, 0);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture._glTextures[this.CONTEXT_UID].texture, 0);
                }
            }
            if (!fbo.stencil && (framebuffer.stencil || framebuffer.depth)) {
                fbo.stencil = gl.createRenderbuffer();
                gl.bindRenderbuffer(gl.RENDERBUFFER, fbo.stencil);
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, framebuffer.width, framebuffer.height);
                // TODO.. this is depth AND stencil?
                if (!framebuffer.depthTexture) { // you can't have both, so one should take priority if enabled
                    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, fbo.stencil);
                }
            }
        };
        /**
         * Detects number of samples that is not more than a param but as close to it as possible
         *
         * @param {PIXI.MSAA_QUALITY} samples - number of samples
         * @returns {PIXI.MSAA_QUALITY} - recommended number of samples
         */
        FramebufferSystem.prototype.detectSamples = function (samples) {
            var msaaSamples = this.msaaSamples;
            var res = MSAA_QUALITY.NONE;
            if (samples <= 1 || msaaSamples === null) {
                return res;
            }
            for (var i = 0; i < msaaSamples.length; i++) {
                if (msaaSamples[i] <= samples) {
                    res = msaaSamples[i];
                    break;
                }
            }
            if (res === 1) {
                res = MSAA_QUALITY.NONE;
            }
            return res;
        };
        /**
         * Only works with WebGL2
         *
         * blits framebuffer to another of the same or bigger size
         * after that target framebuffer is bound
         *
         * Fails with WebGL warning if blits multisample framebuffer to different size
         *
         * @param {PIXI.Framebuffer} [framebuffer] - by default it blits "into itself", from renderBuffer to texture.
         * @param {PIXI.Rectangle} [sourcePixels] - source rectangle in pixels
         * @param {PIXI.Rectangle} [destPixels] - dest rectangle in pixels, assumed to be the same as sourcePixels
         */
        FramebufferSystem.prototype.blit = function (framebuffer, sourcePixels, destPixels) {
            var _a = this, current = _a.current, renderer = _a.renderer, gl = _a.gl, CONTEXT_UID = _a.CONTEXT_UID;
            if (renderer.context.webGLVersion !== 2) {
                return;
            }
            if (!current) {
                return;
            }
            var fbo = current.glFramebuffers[CONTEXT_UID];
            if (!fbo) {
                return;
            }
            if (!framebuffer) {
                if (fbo.multisample <= 1) {
                    return;
                }
                if (!fbo.blitFramebuffer) {
                    fbo.blitFramebuffer = new Framebuffer(current.width, current.height);
                    fbo.blitFramebuffer.addColorTexture(0, current.colorTextures[0]);
                }
                framebuffer = fbo.blitFramebuffer;
                framebuffer.width = current.width;
                framebuffer.height = current.height;
            }
            if (!sourcePixels) {
                sourcePixels = tempRectangle;
                sourcePixels.width = current.width;
                sourcePixels.height = current.height;
            }
            if (!destPixels) {
                destPixels = sourcePixels;
            }
            var sameSize = sourcePixels.width === destPixels.width && sourcePixels.height === destPixels.height;
            this.bind(framebuffer);
            gl.bindFramebuffer(gl.READ_FRAMEBUFFER, fbo.framebuffer);
            gl.blitFramebuffer(sourcePixels.x, sourcePixels.y, sourcePixels.width, sourcePixels.height, destPixels.x, destPixels.y, destPixels.width, destPixels.height, gl.COLOR_BUFFER_BIT, sameSize ? gl.NEAREST : gl.LINEAR);
        };
        /**
         * Disposes framebuffer
         * @param {PIXI.Framebuffer} framebuffer - framebuffer that has to be disposed of
         * @param {boolean} [contextLost=false] - If context was lost, we suppress all delete function calls
         */
        FramebufferSystem.prototype.disposeFramebuffer = function (framebuffer, contextLost) {
            var fbo = framebuffer.glFramebuffers[this.CONTEXT_UID];
            var gl = this.gl;
            if (!fbo) {
                return;
            }
            delete framebuffer.glFramebuffers[this.CONTEXT_UID];
            var index = this.managedFramebuffers.indexOf(framebuffer);
            if (index >= 0) {
                this.managedFramebuffers.splice(index, 1);
            }
            framebuffer.disposeRunner.remove(this);
            if (!contextLost) {
                gl.deleteFramebuffer(fbo.framebuffer);
                if (fbo.stencil) {
                    gl.deleteRenderbuffer(fbo.stencil);
                }
            }
        };
        /**
         * Disposes all framebuffers, but not textures bound to them
         * @param {boolean} [contextLost=false] - If context was lost, we suppress all delete function calls
         */
        FramebufferSystem.prototype.disposeAll = function (contextLost) {
            var list = this.managedFramebuffers;
            this.managedFramebuffers = [];
            for (var i = 0; i < list.length; i++) {
                this.disposeFramebuffer(list[i], contextLost);
            }
        };
        /**
         * Forcing creation of stencil buffer for current framebuffer, if it wasn't done before.
         * Used by MaskSystem, when its time to use stencil mask for Graphics element.
         *
         * Its an alternative for public lazy `framebuffer.enableStencil`, in case we need stencil without rebind.
         *
         * @private
         */
        FramebufferSystem.prototype.forceStencil = function () {
            var framebuffer = this.current;
            if (!framebuffer) {
                return;
            }
            var fbo = framebuffer.glFramebuffers[this.CONTEXT_UID];
            if (!fbo || fbo.stencil) {
                return;
            }
            framebuffer.enableStencil();
            var w = framebuffer.width;
            var h = framebuffer.height;
            var gl = this.gl;
            var stencil = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, stencil);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, w, h);
            fbo.stencil = stencil;
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, stencil);
        };
        /**
         * resets framebuffer stored state, binds screen framebuffer
         *
         * should be called before renderTexture reset()
         */
        FramebufferSystem.prototype.reset = function () {
            this.current = this.unknownFramebuffer;
            this.viewport = new Rectangle();
        };
        return FramebufferSystem;
    }(System));

    var GLBuffer = /** @class */ (function () {
        function GLBuffer(buffer) {
            this.buffer = buffer || null;
            this.updateID = -1;
            this.byteLength = -1;
            this.refCount = 0;
        }
        return GLBuffer;
    }());

    var byteSizeMap$1 = { 5126: 4, 5123: 2, 5121: 1 };
    /**
     * System plugin to the renderer to manage geometry.
     *
     * @class
     * @extends PIXI.System
     * @memberof PIXI.systems
     */
    var GeometrySystem = /** @class */ (function (_super) {
        __extends(GeometrySystem, _super);
        /**
         * @param {PIXI.Renderer} renderer - The renderer this System works for.
         */
        function GeometrySystem(renderer) {
            var _this = _super.call(this, renderer) || this;
            _this._activeGeometry = null;
            _this._activeVao = null;
            /**
             * `true` if we has `*_vertex_array_object` extension
             * @member {boolean}
             * @readonly
             */
            _this.hasVao = true;
            /**
             * `true` if has `ANGLE_instanced_arrays` extension
             * @member {boolean}
             * @readonly
             */
            _this.hasInstance = true;
            /**
             * `true` if support `gl.UNSIGNED_INT` in `gl.drawElements` or `gl.drawElementsInstanced`
             * @member {boolean}
             * @readonly
             */
            _this.canUseUInt32ElementIndex = false;
            /**
             * Cache for all geometries by id, used in case renderer gets destroyed or for profiling
             * @member {object}
             * @readonly
             */
            _this.managedGeometries = {};
            /**
             * Cache for all buffers by id, used in case renderer gets destroyed or for profiling
             * @member {object}
             * @readonly
             */
            _this.managedBuffers = {};
            return _this;
        }
        /**
         * Sets up the renderer context and necessary buffers.
         */
        GeometrySystem.prototype.contextChange = function () {
            this.disposeAll(true);
            var gl = this.gl = this.renderer.gl;
            var context = this.renderer.context;
            this.CONTEXT_UID = this.renderer.CONTEXT_UID;
            // webgl2
            if (!gl.createVertexArray) {
                // webgl 1!
                var nativeVaoExtension_1 = this.renderer.context.extensions.vertexArrayObject;
                if (settings.PREFER_ENV === ENV.WEBGL_LEGACY) {
                    nativeVaoExtension_1 = null;
                }
                if (nativeVaoExtension_1) {
                    gl.createVertexArray = function () {
                        return nativeVaoExtension_1.createVertexArrayOES();
                    };
                    gl.bindVertexArray = function (vao) {
                        return nativeVaoExtension_1.bindVertexArrayOES(vao);
                    };
                    gl.deleteVertexArray = function (vao) {
                        return nativeVaoExtension_1.deleteVertexArrayOES(vao);
                    };
                }
                else {
                    this.hasVao = false;
                    gl.createVertexArray = function () {
                        return null;
                    };
                    gl.bindVertexArray = function () {
                        return null;
                    };
                    gl.deleteVertexArray = function () {
                        return null;
                    };
                }
            }
            if (!gl.vertexAttribDivisor) {
                var instanceExt_1 = gl.getExtension('ANGLE_instanced_arrays');
                if (instanceExt_1) {
                    gl.vertexAttribDivisor = function (a, b) {
                        return instanceExt_1.vertexAttribDivisorANGLE(a, b);
                    };
                    gl.drawElementsInstanced = function (a, b, c, d, e) {
                        return instanceExt_1.drawElementsInstancedANGLE(a, b, c, d, e);
                    };
                    gl.drawArraysInstanced = function (a, b, c, d) {
                        return instanceExt_1.drawArraysInstancedANGLE(a, b, c, d);
                    };
                }
                else {
                    this.hasInstance = false;
                }
            }
            this.canUseUInt32ElementIndex = context.webGLVersion === 2 || !!context.extensions.uint32ElementIndex;
        };
        /**
         * Binds geometry so that is can be drawn. Creating a Vao if required
         *
         * @param {PIXI.Geometry} geometry - instance of geometry to bind
         * @param {PIXI.Shader} [shader] - instance of shader to use vao for
         */
        GeometrySystem.prototype.bind = function (geometry, shader) {
            shader = shader || this.renderer.shader.shader;
            var gl = this.gl;
            // not sure the best way to address this..
            // currently different shaders require different VAOs for the same geometry
            // Still mulling over the best way to solve this one..
            // will likely need to modify the shader attribute locations at run time!
            var vaos = geometry.glVertexArrayObjects[this.CONTEXT_UID];
            if (!vaos) {
                this.managedGeometries[geometry.id] = geometry;
                geometry.disposeRunner.add(this);
                geometry.glVertexArrayObjects[this.CONTEXT_UID] = vaos = {};
            }
            var vao = vaos[shader.program.id] || this.initGeometryVao(geometry, shader.program);
            this._activeGeometry = geometry;
            if (this._activeVao !== vao) {
                this._activeVao = vao;
                if (this.hasVao) {
                    gl.bindVertexArray(vao);
                }
                else {
                    this.activateVao(geometry, shader.program);
                }
            }
            // TODO - optimise later!
            // don't need to loop through if nothing changed!
            // maybe look to add an 'autoupdate' to geometry?
            this.updateBuffers();
        };
        /**
         * Reset and unbind any active VAO and geometry
         */
        GeometrySystem.prototype.reset = function () {
            this.unbind();
        };
        /**
         * Update buffers
         * @protected
         */
        GeometrySystem.prototype.updateBuffers = function () {
            var geometry = this._activeGeometry;
            var gl = this.gl;
            for (var i = 0; i < geometry.buffers.length; i++) {
                var buffer = geometry.buffers[i];
                var glBuffer = buffer._glBuffers[this.CONTEXT_UID];
                if (buffer._updateID !== glBuffer.updateID) {
                    glBuffer.updateID = buffer._updateID;
                    // TODO can cache this on buffer! maybe added a getter / setter?
                    var type = buffer.index ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
                    // TODO this could change if the VAO changes...
                    // need to come up with a better way to cache..
                    // if (this.boundBuffers[type] !== glBuffer)
                    // {
                    // this.boundBuffers[type] = glBuffer;
                    gl.bindBuffer(type, glBuffer.buffer);
                    // }
                    this._boundBuffer = glBuffer;
                    if (glBuffer.byteLength >= buffer.data.byteLength) {
                        // offset is always zero for now!
                        gl.bufferSubData(type, 0, buffer.data);
                    }
                    else {
                        var drawType = buffer.static ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW;
                        glBuffer.byteLength = buffer.data.byteLength;
                        gl.bufferData(type, buffer.data, drawType);
                    }
                }
            }
        };
        /**
         * Check compability between a geometry and a program
         * @protected
         * @param {PIXI.Geometry} geometry - Geometry instance
         * @param {PIXI.Program} program - Program instance
         */
        GeometrySystem.prototype.checkCompatibility = function (geometry, program) {
            // geometry must have at least all the attributes that the shader requires.
            var geometryAttributes = geometry.attributes;
            var shaderAttributes = program.attributeData;
            for (var j in shaderAttributes) {
                if (!geometryAttributes[j]) {
                    throw new Error("shader and geometry incompatible, geometry missing the \"" + j + "\" attribute");
                }
            }
        };
        /**
         * Takes a geometry and program and generates a unique signature for them.
         *
         * @param {PIXI.Geometry} geometry - to get signature from
         * @param {PIXI.Program} program - to test geometry against
         * @returns {String} Unique signature of the geometry and program
         * @protected
         */
        GeometrySystem.prototype.getSignature = function (geometry, program) {
            var attribs = geometry.attributes;
            var shaderAttributes = program.attributeData;
            var strings = ['g', geometry.id];
            for (var i in attribs) {
                if (shaderAttributes[i]) {
                    strings.push(i);
                }
            }
            return strings.join('-');
        };
        /**
         * Creates or gets Vao with the same structure as the geometry and stores it on the geometry.
         * If vao is created, it is bound automatically.
         *
         * @protected
         * @param {PIXI.Geometry} geometry - Instance of geometry to to generate Vao for
         * @param {PIXI.Program} program - Instance of program
         */
        GeometrySystem.prototype.initGeometryVao = function (geometry, program) {
            this.checkCompatibility(geometry, program);
            var gl = this.gl;
            var CONTEXT_UID = this.CONTEXT_UID;
            var signature = this.getSignature(geometry, program);
            var vaoObjectHash = geometry.glVertexArrayObjects[this.CONTEXT_UID];
            var vao = vaoObjectHash[signature];
            if (vao) {
                // this will give us easy access to the vao
                vaoObjectHash[program.id] = vao;
                return vao;
            }
            var buffers = geometry.buffers;
            var attributes = geometry.attributes;
            var tempStride = {};
            var tempStart = {};
            for (var j in buffers) {
                tempStride[j] = 0;
                tempStart[j] = 0;
            }
            for (var j in attributes) {
                if (!attributes[j].size && program.attributeData[j]) {
                    attributes[j].size = program.attributeData[j].size;
                }
                else if (!attributes[j].size) {
                    console.warn("PIXI Geometry attribute '" + j + "' size cannot be determined (likely the bound shader does not have the attribute)"); // eslint-disable-line
                }
                tempStride[attributes[j].buffer] += attributes[j].size * byteSizeMap$1[attributes[j].type];
            }
            for (var j in attributes) {
                var attribute = attributes[j];
                var attribSize = attribute.size;
                if (attribute.stride === undefined) {
                    if (tempStride[attribute.buffer] === attribSize * byteSizeMap$1[attribute.type]) {
                        attribute.stride = 0;
                    }
                    else {
                        attribute.stride = tempStride[attribute.buffer];
                    }
                }
                if (attribute.start === undefined) {
                    attribute.start = tempStart[attribute.buffer];
                    tempStart[attribute.buffer] += attribSize * byteSizeMap$1[attribute.type];
                }
            }
            vao = gl.createVertexArray();
            gl.bindVertexArray(vao);
            // first update - and create the buffers!
            // only create a gl buffer if it actually gets
            for (var i = 0; i < buffers.length; i++) {
                var buffer = buffers[i];
                if (!buffer._glBuffers[CONTEXT_UID]) {
                    buffer._glBuffers[CONTEXT_UID] = new GLBuffer(gl.createBuffer());
                    this.managedBuffers[buffer.id] = buffer;
                    buffer.disposeRunner.add(this);
                }
                buffer._glBuffers[CONTEXT_UID].refCount++;
            }
            // TODO - maybe make this a data object?
            // lets wait to see if we need to first!
            this.activateVao(geometry, program);
            this._activeVao = vao;
            // add it to the cache!
            vaoObjectHash[program.id] = vao;
            vaoObjectHash[signature] = vao;
            return vao;
        };
        /**
         * Disposes buffer
         * @param {PIXI.Buffer} buffer - buffer with data
         * @param {boolean} [contextLost=false] - If context was lost, we suppress deleteVertexArray
         */
        GeometrySystem.prototype.disposeBuffer = function (buffer, contextLost) {
            if (!this.managedBuffers[buffer.id]) {
                return;
            }
            delete this.managedBuffers[buffer.id];
            var glBuffer = buffer._glBuffers[this.CONTEXT_UID];
            var gl = this.gl;
            buffer.disposeRunner.remove(this);
            if (!glBuffer) {
                return;
            }
            if (!contextLost) {
                gl.deleteBuffer(glBuffer.buffer);
            }
            delete buffer._glBuffers[this.CONTEXT_UID];
        };
        /**
         * Disposes geometry
         * @param {PIXI.Geometry} geometry - Geometry with buffers. Only VAO will be disposed
         * @param {boolean} [contextLost=false] - If context was lost, we suppress deleteVertexArray
         */
        GeometrySystem.prototype.disposeGeometry = function (geometry, contextLost) {
            if (!this.managedGeometries[geometry.id]) {
                return;
            }
            delete this.managedGeometries[geometry.id];
            var vaos = geometry.glVertexArrayObjects[this.CONTEXT_UID];
            var gl = this.gl;
            var buffers = geometry.buffers;
            geometry.disposeRunner.remove(this);
            if (!vaos) {
                return;
            }
            for (var i = 0; i < buffers.length; i++) {
                var buf = buffers[i]._glBuffers[this.CONTEXT_UID];
                buf.refCount--;
                if (buf.refCount === 0 && !contextLost) {
                    this.disposeBuffer(buffers[i], contextLost);
                }
            }
            if (!contextLost) {
                for (var vaoId in vaos) {
                    // delete only signatures, everything else are copies
                    if (vaoId[0] === 'g') {
                        var vao = vaos[vaoId];
                        if (this._activeVao === vao) {
                            this.unbind();
                        }
                        gl.deleteVertexArray(vao);
                    }
                }
            }
            delete geometry.glVertexArrayObjects[this.CONTEXT_UID];
        };
        /**
         * dispose all WebGL resources of all managed geometries and buffers
         * @param {boolean} [contextLost=false] - If context was lost, we suppress `gl.delete` calls
         */
        GeometrySystem.prototype.disposeAll = function (contextLost) {
            var all = Object.keys(this.managedGeometries);
            for (var i = 0; i < all.length; i++) {
                this.disposeGeometry(this.managedGeometries[all[i]], contextLost);
            }
            all = Object.keys(this.managedBuffers);
            for (var i = 0; i < all.length; i++) {
                this.disposeBuffer(this.managedBuffers[all[i]], contextLost);
            }
        };
        /**
         * Activate vertex array object
         *
         * @protected
         * @param {PIXI.Geometry} geometry - Geometry instance
         * @param {PIXI.Program} program - Shader program instance
         */
        GeometrySystem.prototype.activateVao = function (geometry, program) {
            var gl = this.gl;
            var CONTEXT_UID = this.CONTEXT_UID;
            var buffers = geometry.buffers;
            var attributes = geometry.attributes;
            if (geometry.indexBuffer) {
                // first update the index buffer if we have one..
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.indexBuffer._glBuffers[CONTEXT_UID].buffer);
            }
            var lastBuffer = null;
            // add a new one!
            for (var j in attributes) {
                var attribute = attributes[j];
                var buffer = buffers[attribute.buffer];
                var glBuffer = buffer._glBuffers[CONTEXT_UID];
                if (program.attributeData[j]) {
                    if (lastBuffer !== glBuffer) {
                        gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer.buffer);
                        lastBuffer = glBuffer;
                    }
                    var location = program.attributeData[j].location;
                    // TODO introduce state again
                    // we can optimise this for older devices that have no VAOs
                    gl.enableVertexAttribArray(location);
                    gl.vertexAttribPointer(location, attribute.size, attribute.type || gl.FLOAT, attribute.normalized, attribute.stride, attribute.start);
                    if (attribute.instance) {
                        // TODO calculate instance count based of this...
                        if (this.hasInstance) {
                            gl.vertexAttribDivisor(location, 1);
                        }
                        else {
                            throw new Error('geometry error, GPU Instancing is not supported on this device');
                        }
                    }
                }
            }
        };
        /**
         * Draw the geometry
         *
         * @param {Number} type - the type primitive to render
         * @param {Number} [size] - the number of elements to be rendered
         * @param {Number} [start] - Starting index
         * @param {Number} [instanceCount] - the number of instances of the set of elements to execute
         */
        GeometrySystem.prototype.draw = function (type, size, start, instanceCount) {
            var gl = this.gl;
            var geometry = this._activeGeometry;
            // TODO.. this should not change so maybe cache the function?
            if (geometry.indexBuffer) {
                var byteSize = geometry.indexBuffer.data.BYTES_PER_ELEMENT;
                var glType = byteSize === 2 ? gl.UNSIGNED_SHORT : gl.UNSIGNED_INT;
                if (byteSize === 2 || (byteSize === 4 && this.canUseUInt32ElementIndex)) {
                    if (geometry.instanced) {
                        /* eslint-disable max-len */
                        gl.drawElementsInstanced(type, size || geometry.indexBuffer.data.length, glType, (start || 0) * byteSize, instanceCount || 1);
                        /* eslint-enable max-len */
                    }
                    else {
                        /* eslint-disable max-len */
                        gl.drawElements(type, size || geometry.indexBuffer.data.length, glType, (start || 0) * byteSize);
                        /* eslint-enable max-len */
                    }
                }
                else {
                    console.warn('unsupported index buffer type: uint32');
                }
            }
            else if (geometry.instanced) {
                // TODO need a better way to calculate size..
                gl.drawArraysInstanced(type, start, size || geometry.getSize(), instanceCount || 1);
            }
            else {
                gl.drawArrays(type, start, size || geometry.getSize());
            }
            return this;
        };
        /**
         * Unbind/reset everything
         * @protected
         */
        GeometrySystem.prototype.unbind = function () {
            this.gl.bindVertexArray(null);
            this._activeVao = null;
            this._activeGeometry = null;
        };
        return GeometrySystem;
    }(System));

    /**
     * Component for masked elements
     *
     * Holds mask mode and temporary data about current mask
     *
     * @class
     * @memberof PIXI
     */
    var MaskData = /** @class */ (function () {
        /**
         * Create MaskData
         *
         * @param {PIXI.DisplayObject} [maskObject=null] - object that describes the mask
         */
        function MaskData(maskObject) {
            if (maskObject === void 0) { maskObject = null; }
            /**
             * Mask type
             * @member {PIXI.MASK_TYPES}
             */
            this.type = MASK_TYPES.NONE;
            /**
             * Whether we know the mask type beforehand
             * @member {boolean}
             * @default true
             */
            this.autoDetect = true;
            /**
             * Which element we use to mask
             * @member {PIXI.DisplayObject}
             */
            this.maskObject = maskObject || null;
            /**
             * Whether it belongs to MaskSystem pool
             * @member {boolean}
             */
            this.pooled = false;
            /**
             * Indicator of the type
             * @member {boolean}
             */
            this.isMaskData = true;
            /**
             * Stencil counter above the mask in stack
             * @member {number}
             * @private
             */
            this._stencilCounter = 0;
            /**
             * Scissor counter above the mask in stack
             * @member {number}
             * @private
             */
            this._scissorCounter = 0;
            /**
             * Scissor operation above the mask in stack.
             * Null if _scissorCounter is zero, rectangle instance if positive.
             * @member {PIXI.Rectangle}
             */
            this._scissorRect = null;
            /**
             * Targeted element. Temporary variable set by MaskSystem
             * @member {PIXI.DisplayObject}
             * @private
             */
            this._target = null;
        }
        /**
         * resets the mask data after popMask()
         */
        MaskData.prototype.reset = function () {
            if (this.pooled) {
                this.maskObject = null;
                this.type = MASK_TYPES.NONE;
                this.autoDetect = true;
            }
            this._target = null;
        };
        /**
         * copies counters from maskData above, called from pushMask()
         * @param {PIXI.MaskData|null} maskAbove
         */
        MaskData.prototype.copyCountersOrReset = function (maskAbove) {
            if (maskAbove) {
                this._stencilCounter = maskAbove._stencilCounter;
                this._scissorCounter = maskAbove._scissorCounter;
                this._scissorRect = maskAbove._scissorRect;
            }
            else {
                this._stencilCounter = 0;
                this._scissorCounter = 0;
                this._scissorRect = null;
            }
        };
        return MaskData;
    }());

    /**
     * @private
     * @param gl {WebGLRenderingContext} The current WebGL context {WebGLProgram}
     * @param type {Number} the type, can be either VERTEX_SHADER or FRAGMENT_SHADER
     * @param src {string} The vertex shader source as an array of strings.
     * @return {WebGLShader} the shader
     */
    function compileShader(gl, type, src) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        return shader;
    }
    /**
     * @method compileProgram
     * @private
     * @memberof PIXI.glCore.shader
     * @param gl {WebGLRenderingContext} The current WebGL context {WebGLProgram}
     * @param vertexSrc {string|string[]} The vertex shader source as an array of strings.
     * @param fragmentSrc {string|string[]} The fragment shader source as an array of strings.
     * @param attributeLocations {Object} An attribute location map that lets you manually set the attribute locations
     * @return {WebGLProgram} the shader program
     */
    function compileProgram(gl, vertexSrc, fragmentSrc, attributeLocations) {
        var glVertShader = compileShader(gl, gl.VERTEX_SHADER, vertexSrc);
        var glFragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
        var program = gl.createProgram();
        gl.attachShader(program, glVertShader);
        gl.attachShader(program, glFragShader);
        // optionally, set the attributes manually for the program rather than letting WebGL decide..
        if (attributeLocations) {
            for (var i in attributeLocations) {
                gl.bindAttribLocation(program, attributeLocations[i], i);
            }
        }
        gl.linkProgram(program);
        // if linking fails, then log and cleanup
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            if (!gl.getShaderParameter(glVertShader, gl.COMPILE_STATUS)) {
                console.warn(vertexSrc);
                console.error(gl.getShaderInfoLog(glVertShader));
            }
            if (!gl.getShaderParameter(glFragShader, gl.COMPILE_STATUS)) {
                console.warn(fragmentSrc);
                console.error(gl.getShaderInfoLog(glFragShader));
            }
            console.error('Pixi.js Error: Could not initialize shader.');
            console.error('gl.VALIDATE_STATUS', gl.getProgramParameter(program, gl.VALIDATE_STATUS));
            console.error('gl.getError()', gl.getError());
            // if there is a program info log, log it
            if (gl.getProgramInfoLog(program) !== '') {
                console.warn('Pixi.js Warning: gl.getProgramInfoLog()', gl.getProgramInfoLog(program));
            }
            gl.deleteProgram(program);
            program = null;
        }
        // clean up some shaders
        gl.deleteShader(glVertShader);
        gl.deleteShader(glFragShader);
        return program;
    }

    function booleanArray(size) {
        var array = new Array(size);
        for (var i = 0; i < array.length; i++) {
            array[i] = false;
        }
        return array;
    }
    /**
     * @method defaultValue
     * @memberof PIXI.glCore.shader
     * @param type {String} Type of value
     * @param size {Number}
     * @private
     */
    function defaultValue(type, size) {
        switch (type) {
            case 'float':
                return 0;
            case 'vec2':
                return new Float32Array(2 * size);
            case 'vec3':
                return new Float32Array(3 * size);
            case 'vec4':
                return new Float32Array(4 * size);
            case 'int':
            case 'sampler2D':
            case 'sampler2DArray':
                return 0;
            case 'ivec2':
                return new Int32Array(2 * size);
            case 'ivec3':
                return new Int32Array(3 * size);
            case 'ivec4':
                return new Int32Array(4 * size);
            case 'bool':
                return false;
            case 'bvec2':
                return booleanArray(2 * size);
            case 'bvec3':
                return booleanArray(3 * size);
            case 'bvec4':
                return booleanArray(4 * size);
            case 'mat2':
                return new Float32Array([1, 0,
                    0, 1]);
            case 'mat3':
                return new Float32Array([1, 0, 0,
                    0, 1, 0,
                    0, 0, 1]);
            case 'mat4':
                return new Float32Array([1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1]);
        }
        return null;
    }

    var unknownContext = {};
    var context = unknownContext;
    /**
     * returns a little WebGL context to use for program inspection.
     *
     * @static
     * @private
     * @returns {WebGLRenderingContext} a gl context to test with
     */
    function getTestContext() {
        if (context === unknownContext || (context && context.isContextLost())) {
            var canvas = document.createElement('canvas');
            var gl = void 0;
            if (settings.PREFER_ENV >= ENV.WEBGL2) {
                gl = canvas.getContext('webgl2', {});
            }
            if (!gl) {
                gl = canvas.getContext('webgl', {})
                    || canvas.getContext('experimental-webgl', {});
                if (!gl) {
                    // fail, not able to get a context
                    gl = null;
                }
                else {
                    // for shader testing..
                    gl.getExtension('WEBGL_draw_buffers');
                }
            }
            context = gl;
        }
        return context;
    }

    var maxFragmentPrecision;
    function getMaxFragmentPrecision() {
        if (!maxFragmentPrecision) {
            maxFragmentPrecision = PRECISION.MEDIUM;
            var gl = getTestContext();
            if (gl) {
                if (gl.getShaderPrecisionFormat) {
                    var shaderFragment = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
                    maxFragmentPrecision = shaderFragment.precision ? PRECISION.HIGH : PRECISION.MEDIUM;
                }
            }
        }
        return maxFragmentPrecision;
    }

    /**
     * Sets the float precision on the shader, ensuring the device supports the request precision.
     * If the precision is already present, it just ensures that the device is able to handle it.
     *
     * @private
     * @param {string} src - The shader source
     * @param {string} requestedPrecision - The request float precision of the shader. Options are 'lowp', 'mediump' or 'highp'.
     * @param {string} maxSupportedPrecision - The maximum precision the shader supports.
     *
     * @return {string} modified shader source
     */
    function setPrecision(src, requestedPrecision, maxSupportedPrecision) {
        if (src.substring(0, 9) !== 'precision') {
            // no precision supplied, so PixiJS will add the requested level.
            var precision = requestedPrecision;
            // If highp is requested but not supported, downgrade precision to a level all devices support.
            if (requestedPrecision === PRECISION.HIGH && maxSupportedPrecision !== PRECISION.HIGH) {
                precision = PRECISION.MEDIUM;
            }
            return "precision " + precision + " float;\n" + src;
        }
        else if (maxSupportedPrecision !== PRECISION.HIGH && src.substring(0, 15) === 'precision highp') {
            // precision was supplied, but at a level this device does not support, so downgrading to mediump.
            return src.replace('precision highp', 'precision mediump');
        }
        return src;
    }

    var GLSL_TO_SIZE = {
        float: 1,
        vec2: 2,
        vec3: 3,
        vec4: 4,
        int: 1,
        ivec2: 2,
        ivec3: 3,
        ivec4: 4,
        bool: 1,
        bvec2: 2,
        bvec3: 3,
        bvec4: 4,
        mat2: 4,
        mat3: 9,
        mat4: 16,
        sampler2D: 1,
    };
    /**
     * @private
     * @method mapSize
     * @memberof PIXI.glCore.shader
     * @param type {String}
     * @return {Number}
     */
    function mapSize(type) {
        return GLSL_TO_SIZE[type];
    }

    var GL_TABLE = null;
    var GL_TO_GLSL_TYPES = {
        FLOAT: 'float',
        FLOAT_VEC2: 'vec2',
        FLOAT_VEC3: 'vec3',
        FLOAT_VEC4: 'vec4',
        INT: 'int',
        INT_VEC2: 'ivec2',
        INT_VEC3: 'ivec3',
        INT_VEC4: 'ivec4',
        BOOL: 'bool',
        BOOL_VEC2: 'bvec2',
        BOOL_VEC3: 'bvec3',
        BOOL_VEC4: 'bvec4',
        FLOAT_MAT2: 'mat2',
        FLOAT_MAT3: 'mat3',
        FLOAT_MAT4: 'mat4',
        SAMPLER_2D: 'sampler2D',
        INT_SAMPLER_2D: 'sampler2D',
        UNSIGNED_INT_SAMPLER_2D: 'sampler2D',
        SAMPLER_CUBE: 'samplerCube',
        INT_SAMPLER_CUBE: 'samplerCube',
        UNSIGNED_INT_SAMPLER_CUBE: 'samplerCube',
        SAMPLER_2D_ARRAY: 'sampler2DArray',
        INT_SAMPLER_2D_ARRAY: 'sampler2DArray',
        UNSIGNED_INT_SAMPLER_2D_ARRAY: 'sampler2DArray',
    };
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    function mapType(gl, type) {
        if (!GL_TABLE) {
            var typeNames = Object.keys(GL_TO_GLSL_TYPES);
            GL_TABLE = {};
            for (var i = 0; i < typeNames.length; ++i) {
                var tn = typeNames[i];
                GL_TABLE[gl[tn]] = GL_TO_GLSL_TYPES[tn];
            }
        }
        return GL_TABLE[type];
    }

    /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
    // Parsers, each one of these will take a look at the type of shader property and uniform.
    // if they pass the test function then the code function is called that returns a the shader upload code for that uniform.
    // Shader upload code is automagically generated with these parsers.
    // If no parser is valid then the default upload functions are used.
    // exposing Parsers means that custom upload logic can be added to pixi's shaders.
    // A good example would be a pixi rectangle can be directly set on a uniform.
    // If the shader sees it it knows how to upload the rectangle structure as a vec4
    // format is as follows:
    //
    // {
    //     test: (data, uniform) => {} <--- test is this code should be used for this uniform
    //     code: (name, uniform) => {} <--- returns the string of the piece of code that uploads the uniform
    // }
    var uniformParsers = [
        // a float cache layer
        {
            test: function (data) {
                return data.type === 'float' && data.size === 1;
            },
            code: function (name) {
                return "\n            if(uv[\"" + name + "\"] !== ud[\"" + name + "\"].value)\n            {\n                ud[\"" + name + "\"].value = uv[\"" + name + "\"]\n                gl.uniform1f(ud[\"" + name + "\"].location, uv[\"" + name + "\"])\n            }\n            ";
            },
        },
        // handling samplers
        {
            test: function (data) {
                // eslint-disable-next-line max-len
                return (data.type === 'sampler2D' || data.type === 'samplerCube' || data.type === 'sampler2DArray') && data.size === 1 && !data.isArray;
            },
            code: function (name) { return "t = syncData.textureCount++;\n\n            renderer.texture.bind(uv[\"" + name + "\"], t);\n\n            if(ud[\"" + name + "\"].value !== t)\n            {\n                ud[\"" + name + "\"].value = t;\n                gl.uniform1i(ud[\"" + name + "\"].location, t);\n; // eslint-disable-line max-len\n            }"; },
        },
        // uploading pixi matrix object to mat3
        {
            test: function (data, uniform) {
                return data.type === 'mat3' && data.size === 1 && uniform.a !== undefined;
            },
            code: function (name) {
                // TODO and some smart caching dirty ids here!
                return "\n            gl.uniformMatrix3fv(ud[\"" + name + "\"].location, false, uv[\"" + name + "\"].toArray(true));\n            ";
            },
        },
        // uploading a pixi point as a vec2 with caching layer
        {
            test: function (data, uniform) {
                return data.type === 'vec2' && data.size === 1 && uniform.x !== undefined;
            },
            code: function (name) {
                return "\n                cv = ud[\"" + name + "\"].value;\n                v = uv[\"" + name + "\"];\n\n                if(cv[0] !== v.x || cv[1] !== v.y)\n                {\n                    cv[0] = v.x;\n                    cv[1] = v.y;\n                    gl.uniform2f(ud[\"" + name + "\"].location, v.x, v.y);\n                }";
            },
        },
        // caching layer for a vec2
        {
            test: function (data) {
                return data.type === 'vec2' && data.size === 1;
            },
            code: function (name) {
                return "\n                cv = ud[\"" + name + "\"].value;\n                v = uv[\"" + name + "\"];\n\n                if(cv[0] !== v[0] || cv[1] !== v[1])\n                {\n                    cv[0] = v[0];\n                    cv[1] = v[1];\n                    gl.uniform2f(ud[\"" + name + "\"].location, v[0], v[1]);\n                }\n            ";
            },
        },
        // upload a pixi rectangle as a vec4 with caching layer
        {
            test: function (data, uniform) {
                return data.type === 'vec4' && data.size === 1 && uniform.width !== undefined;
            },
            code: function (name) {
                return "\n                cv = ud[\"" + name + "\"].value;\n                v = uv[\"" + name + "\"];\n\n                if(cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height)\n                {\n                    cv[0] = v.x;\n                    cv[1] = v.y;\n                    cv[2] = v.width;\n                    cv[3] = v.height;\n                    gl.uniform4f(ud[\"" + name + "\"].location, v.x, v.y, v.width, v.height)\n                }";
            },
        },
        // a caching layer for vec4 uploading
        {
            test: function (data) {
                return data.type === 'vec4' && data.size === 1;
            },
            code: function (name) {
                return "\n                cv = ud[\"" + name + "\"].value;\n                v = uv[\"" + name + "\"];\n\n                if(cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n                {\n                    cv[0] = v[0];\n                    cv[1] = v[1];\n                    cv[2] = v[2];\n                    cv[3] = v[3];\n\n                    gl.uniform4f(ud[\"" + name + "\"].location, v[0], v[1], v[2], v[3])\n                }";
            },
        } ];

    // cv = CachedValue
    // v = value
    // ud = uniformData
    // uv = uniformValue
    // l = location
    var GLSL_TO_SINGLE_SETTERS_CACHED = {
        float: "\n    if(cv !== v)\n    {\n        cv.v = v;\n        gl.uniform1f(location, v)\n    }",
        vec2: "\n    if(cv[0] !== v[0] || cv[1] !== v[1])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        gl.uniform2f(location, v[0], v[1])\n    }",
        vec3: "\n    if(cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n\n        gl.uniform3f(location, v[0], v[1], v[2])\n    }",
        vec4: 'gl.uniform4f(location, v[0], v[1], v[2], v[3])',
        int: 'gl.uniform1i(location, v)',
        ivec2: 'gl.uniform2i(location, v[0], v[1])',
        ivec3: 'gl.uniform3i(location, v[0], v[1], v[2])',
        ivec4: 'gl.uniform4i(location, v[0], v[1], v[2], v[3])',
        bool: 'gl.uniform1i(location, v)',
        bvec2: 'gl.uniform2i(location, v[0], v[1])',
        bvec3: 'gl.uniform3i(location, v[0], v[1], v[2])',
        bvec4: 'gl.uniform4i(location, v[0], v[1], v[2], v[3])',
        mat2: 'gl.uniformMatrix2fv(location, false, v)',
        mat3: 'gl.uniformMatrix3fv(location, false, v)',
        mat4: 'gl.uniformMatrix4fv(location, false, v)',
        sampler2D: 'gl.uniform1i(location, v)',
        samplerCube: 'gl.uniform1i(location, v)',
        sampler2DArray: 'gl.uniform1i(location, v)',
    };
    var GLSL_TO_ARRAY_SETTERS = {
        float: "gl.uniform1fv(location, v)",
        vec2: "gl.uniform2fv(location, v)",
        vec3: "gl.uniform3fv(location, v)",
        vec4: 'gl.uniform4fv(location, v)',
        mat4: 'gl.uniformMatrix4fv(location, false, v)',
        mat3: 'gl.uniformMatrix3fv(location, false, v)',
        mat2: 'gl.uniformMatrix2fv(location, false, v)',
        int: 'gl.uniform1iv(location, v)',
        ivec2: 'gl.uniform2iv(location, v)',
        ivec3: 'gl.uniform3iv(location, v)',
        ivec4: 'gl.uniform4iv(location, v)',
        bool: 'gl.uniform1iv(location, v)',
        bvec2: 'gl.uniform2iv(location, v)',
        bvec3: 'gl.uniform3iv(location, v)',
        bvec4: 'gl.uniform4iv(location, v)',
        sampler2D: 'gl.uniform1iv(location, v)',
        samplerCube: 'gl.uniform1iv(location, v)',
        sampler2DArray: 'gl.uniform1iv(location, v)',
    };
    function generateUniformsSync(group, uniformData) {
        var funcFragments = ["\n        var v = null;\n        var cv = null\n        var t = 0;\n        var gl = renderer.gl\n    "];
        for (var i in group.uniforms) {
            var data = uniformData[i];
            if (!data) {
                if (group.uniforms[i].group) {
                    funcFragments.push("\n                    renderer.shader.syncUniformGroup(uv[\"" + i + "\"], syncData);\n                ");
                }
                continue;
            }
            var uniform = group.uniforms[i];
            var parsed = false;
            for (var j = 0; j < uniformParsers.length; j++) {
                if (uniformParsers[j].test(data, uniform)) {
                    funcFragments.push(uniformParsers[j].code(i, uniform));
                    parsed = true;
                    break;
                }
            }
            if (!parsed) {
                var templateType = (data.size === 1) ? GLSL_TO_SINGLE_SETTERS_CACHED : GLSL_TO_ARRAY_SETTERS;
                var template = templateType[data.type].replace('location', "ud[\"" + i + "\"].location");
                funcFragments.push("\n            cv = ud[\"" + i + "\"].value;\n            v = uv[\"" + i + "\"];\n            " + template + ";");
            }
        }
        /**
         * the introduction of syncData is to solve an issue where textures in uniform groups are not set correctly
         * the texture count was always starting from 0 in each group. This needs to increment each time a texture is used
         * no matter which group is being used
         *
         */
        // eslint-disable-next-line no-new-func
        return new Function('ud', 'uv', 'renderer', 'syncData', funcFragments.join('\n'));
    }

    var fragTemplate = [
        'precision mediump float;',
        'void main(void){',
        'float test = 0.1;',
        '%forloop%',
        'gl_FragColor = vec4(0.0);',
        '}' ].join('\n');
    function generateIfTestSrc(maxIfs) {
        var src = '';
        for (var i = 0; i < maxIfs; ++i) {
            if (i > 0) {
                src += '\nelse ';
            }
            if (i < maxIfs - 1) {
                src += "if(test == " + i + ".0){}";
            }
        }
        return src;
    }
    function checkMaxIfStatementsInShader(maxIfs, gl) {
        if (maxIfs === 0) {
            throw new Error('Invalid value of `0` passed to `checkMaxIfStatementsInShader`');
        }
        var shader = gl.createShader(gl.FRAGMENT_SHADER);
        while (true) // eslint-disable-line no-constant-condition
         {
            var fragmentSrc = fragTemplate.replace(/%forloop%/gi, generateIfTestSrc(maxIfs));
            gl.shaderSource(shader, fragmentSrc);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                maxIfs = (maxIfs / 2) | 0;
            }
            else {
                // valid!
                break;
            }
        }
        return maxIfs;
    }

    // Cache the result to prevent running this over and over
    var unsafeEval;
    /**
     * Not all platforms allow to generate function code (e.g., `new Function`).
     * this provides the platform-level detection.
     *
     * @private
     * @returns {boolean}
     */
    function unsafeEvalSupported() {
        if (typeof unsafeEval === 'boolean') {
            return unsafeEval;
        }
        try {
            /* eslint-disable no-new-func */
            var func = new Function('param1', 'param2', 'param3', 'return param1[param2] === param3;');
            /* eslint-enable no-new-func */
            unsafeEval = func({ a: 'b' }, 'a', 'b') === true;
        }
        catch (e) {
            unsafeEval = false;
        }
        return unsafeEval;
    }

    var defaultFragment = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n   gl_FragColor *= texture2D(uSampler, vTextureCoord);\n}";

    var defaultVertex = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   vTextureCoord = aTextureCoord;\n}\n";

    var UID$3 = 0;
    var nameCache = {};
    /**
     * Helper class to create a shader program.
     *
     * @class
     * @memberof PIXI
     */
    var Program = /** @class */ (function () {
        /**
         * @param {string} [vertexSrc] - The source of the vertex shader.
         * @param {string} [fragmentSrc] - The source of the fragment shader.
         * @param {string} [name] - Name for shader
         */
        function Program(vertexSrc, fragmentSrc, name) {
            if (name === void 0) { name = 'pixi-shader'; }
            this.id = UID$3++;
            /**
             * The vertex shader.
             *
             * @member {string}
             */
            this.vertexSrc = vertexSrc || Program.defaultVertexSrc;
            /**
             * The fragment shader.
             *
             * @member {string}
             */
            this.fragmentSrc = fragmentSrc || Program.defaultFragmentSrc;
            this.vertexSrc = this.vertexSrc.trim();
            this.fragmentSrc = this.fragmentSrc.trim();
            if (this.vertexSrc.substring(0, 8) !== '#version') {
                name = name.replace(/\s+/g, '-');
                if (nameCache[name]) {
                    nameCache[name]++;
                    name += "-" + nameCache[name];
                }
                else {
                    nameCache[name] = 1;
                }
                this.vertexSrc = "#define SHADER_NAME " + name + "\n" + this.vertexSrc;
                this.fragmentSrc = "#define SHADER_NAME " + name + "\n" + this.fragmentSrc;
                this.vertexSrc = setPrecision(this.vertexSrc, settings.PRECISION_VERTEX, PRECISION.HIGH);
                this.fragmentSrc = setPrecision(this.fragmentSrc, settings.PRECISION_FRAGMENT, getMaxFragmentPrecision());
            }
            // currently this does not extract structs only default types
            this.extractData(this.vertexSrc, this.fragmentSrc);
            // this is where we store shader references..
            this.glPrograms = {};
            this.syncUniforms = null;
        }
        /**
         * Extracts the data for a buy creating a small test program
         * or reading the src directly.
         * @protected
         *
         * @param {string} [vertexSrc] - The source of the vertex shader.
         * @param {string} [fragmentSrc] - The source of the fragment shader.
         */
        Program.prototype.extractData = function (vertexSrc, fragmentSrc) {
            var gl = getTestContext();
            if (gl) {
                var program = compileProgram(gl, vertexSrc, fragmentSrc);
                this.attributeData = this.getAttributeData(program, gl);
                this.uniformData = this.getUniformData(program, gl);
                gl.deleteProgram(program);
            }
            else {
                this.uniformData = {};
                this.attributeData = {};
            }
        };
        /**
         * returns the attribute data from the program
         * @private
         *
         * @param {WebGLProgram} [program] - the WebGL program
         * @param {WebGLRenderingContext} [gl] - the WebGL context
         *
         * @returns {object} the attribute data for this program
         */
        Program.prototype.getAttributeData = function (program, gl) {
            var attributes = {};
            var attributesArray = [];
            var totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
            for (var i = 0; i < totalAttributes; i++) {
                var attribData = gl.getActiveAttrib(program, i);
                var type = mapType(gl, attribData.type);
                /*eslint-disable */
                var data = {
                    type: type,
                    name: attribData.name,
                    size: mapSize(type),
                    location: 0,
                };
                /* eslint-enable */
                attributes[attribData.name] = data;
                attributesArray.push(data);
            }
            attributesArray.sort(function (a, b) { return (a.name > b.name) ? 1 : -1; }); // eslint-disable-line no-confusing-arrow
            for (var i = 0; i < attributesArray.length; i++) {
                attributesArray[i].location = i;
            }
            return attributes;
        };
        /**
         * returns the uniform data from the program
         * @private
         *
         * @param {webGL-program} [program] - the webgl program
         * @param {context} [gl] - the WebGL context
         *
         * @returns {object} the uniform data for this program
         */
        Program.prototype.getUniformData = function (program, gl) {
            var uniforms = {};
            var totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
            // TODO expose this as a prop?
            // const maskRegex = new RegExp('^(projectionMatrix|uSampler|translationMatrix)$');
            // const maskRegex = new RegExp('^(projectionMatrix|uSampler|translationMatrix)$');
            for (var i = 0; i < totalUniforms; i++) {
                var uniformData = gl.getActiveUniform(program, i);
                var name = uniformData.name.replace(/\[.*?\]$/, '');
                var isArray = uniformData.name.match(/\[.*?\]$/);
                var type = mapType(gl, uniformData.type);
                /*eslint-disable */
                uniforms[name] = {
                    type: type,
                    size: uniformData.size,
                    isArray: isArray,
                    value: defaultValue(type, uniformData.size),
                };
                /* eslint-enable */
            }
            return uniforms;
        };
        Object.defineProperty(Program, "defaultVertexSrc", {
            /**
             * The default vertex shader source
             *
             * @static
             * @constant
             * @member {string}
             */
            get: function () {
                return defaultVertex;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Program, "defaultFragmentSrc", {
            /**
             * The default fragment shader source
             *
             * @static
             * @constant
             * @member {string}
             */
            get: function () {
                return defaultFragment;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * A short hand function to create a program based of a vertex and fragment shader
         * this method will also check to see if there is a cached program.
         *
         * @param {string} [vertexSrc] - The source of the vertex shader.
         * @param {string} [fragmentSrc] - The source of the fragment shader.
         * @param {string} [name=pixi-shader] - Name for shader
         *
         * @returns {PIXI.Program} an shiny new Pixi shader!
         */
        Program.from = function (vertexSrc, fragmentSrc, name) {
            var key = vertexSrc + fragmentSrc;
            var program = ProgramCache[key];
            if (!program) {
                ProgramCache[key] = program = new Program(vertexSrc, fragmentSrc, name);
            }
            return program;
        };
        return Program;
    }());

    /**
     * A helper class for shaders
     *
     * @class
     * @memberof PIXI
     */
    var Shader = /** @class */ (function () {
        /**
         * @param {PIXI.Program} [program] - The program the shader will use.
         * @param {object} [uniforms] - Custom uniforms to use to augment the built-in ones.
         */
        function Shader(program, uniforms) {
            /**
             * Program that the shader uses
             *
             * @member {PIXI.Program}
             */
            this.program = program;
            // lets see whats been passed in
            // uniforms should be converted to a uniform group
            if (uniforms) {
                if (uniforms instanceof UniformGroup) {
                    this.uniformGroup = uniforms;
                }
                else {
                    this.uniformGroup = new UniformGroup(uniforms);
                }
            }
            else {
                this.uniformGroup = new UniformGroup({});
            }
            // time to build some getters and setters!
            // I guess down the line this could sort of generate an instruction list rather than use dirty ids?
            // does the trick for now though!
            for (var i in program.uniformData) {
                if (this.uniformGroup.uniforms[i] instanceof Array) {
                    this.uniformGroup.uniforms[i] = new Float32Array(this.uniformGroup.uniforms[i]);
                }
            }
        }
        // TODO move to shader system..
        Shader.prototype.checkUniformExists = function (name, group) {
            if (group.uniforms[name]) {
                return true;
            }
            for (var i in group.uniforms) {
                var uniform = group.uniforms[i];
                if (uniform.group) {
                    if (this.checkUniformExists(name, uniform)) {
                        return true;
                    }
                }
            }
            return false;
        };
        Shader.prototype.destroy = function () {
            // usage count on programs?
            // remove if not used!
            this.uniformGroup = null;
        };
        Object.defineProperty(Shader.prototype, "uniforms", {
            /**
             * Shader uniform values, shortcut for `uniformGroup.uniforms`
             * @readonly
             * @member {object}
             */
            get: function () {
                return this.uniformGroup.uniforms;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * A short hand function to create a shader based of a vertex and fragment shader
         *
         * @param {string} [vertexSrc] - The source of the vertex shader.
         * @param {string} [fragmentSrc] - The source of the fragment shader.
         * @param {object} [uniforms] - Custom uniforms to use to augment the built-in ones.
         *
         * @returns {PIXI.Shader} an shiny new Pixi shader!
         */
        Shader.from = function (vertexSrc, fragmentSrc, uniforms) {
            var program = Program.from(vertexSrc, fragmentSrc);
            return new Shader(program, uniforms);
        };
        return Shader;
    }());

    /* eslint-disable max-len */
    var BLEND = 0;
    var OFFSET = 1;
    var CULLING = 2;
    var DEPTH_TEST = 3;
    var WINDING = 4;
    /**
     * This is a WebGL state, and is is passed The WebGL StateManager.
     *
     * Each mesh rendered may require WebGL to be in a different state.
     * For example you may want different blend mode or to enable polygon offsets
     *
     * @class
     * @memberof PIXI
     */
    var State = /** @class */ (function () {
        function State() {
            this.data = 0;
            this.blendMode = BLEND_MODES.NORMAL;
            this.polygonOffset = 0;
            this.blend = true;
            //  this.depthTest = true;
        }
        Object.defineProperty(State.prototype, "blend", {
            /**
             * Activates blending of the computed fragment color values
             *
             * @member {boolean}
             */
            get: function () {
                return !!(this.data & (1 << BLEND));
            },
            set: function (value) {
                if (!!(this.data & (1 << BLEND)) !== value) {
                    this.data ^= (1 << BLEND);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(State.prototype, "offsets", {
            /**
             * Activates adding an offset to depth values of polygon's fragments
             *
             * @member {boolean}
             * @default false
             */
            get: function () {
                return !!(this.data & (1 << OFFSET));
            },
            set: function (value) {
                if (!!(this.data & (1 << OFFSET)) !== value) {
                    this.data ^= (1 << OFFSET);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(State.prototype, "culling", {
            /**
             * Activates culling of polygons.
             *
             * @member {boolean}
             * @default false
             */
            get: function () {
                return !!(this.data & (1 << CULLING));
            },
            set: function (value) {
                if (!!(this.data & (1 << CULLING)) !== value) {
                    this.data ^= (1 << CULLING);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(State.prototype, "depthTest", {
            /**
             * Activates depth comparisons and updates to the depth buffer.
             *
             * @member {boolean}
             * @default false
             */
            get: function () {
                return !!(this.data & (1 << DEPTH_TEST));
            },
            set: function (value) {
                if (!!(this.data & (1 << DEPTH_TEST)) !== value) {
                    this.data ^= (1 << DEPTH_TEST);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(State.prototype, "clockwiseFrontFace", {
            /**
             * Specifies whether or not front or back-facing polygons can be culled.
             * @member {boolean}
             * @default false
             */
            get: function () {
                return !!(this.data & (1 << WINDING));
            },
            set: function (value) {
                if (!!(this.data & (1 << WINDING)) !== value) {
                    this.data ^= (1 << WINDING);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(State.prototype, "blendMode", {
            /**
             * The blend mode to be applied when this state is set. Apply a value of `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.
             * Setting this mode to anything other than NO_BLEND will automatically switch blending on.
             *
             * @member {number}
             * @default PIXI.BLEND_MODES.NORMAL
             * @see PIXI.BLEND_MODES
             */
            get: function () {
                return this._blendMode;
            },
            set: function (value) {
                this.blend = (value !== BLEND_MODES.NONE);
                this._blendMode = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(State.prototype, "polygonOffset", {
            /**
             * The polygon offset. Setting this property to anything other than 0 will automatically enable polygon offset fill.
             *
             * @member {number}
             * @default 0
             */
            get: function () {
                return this._polygonOffset;
            },
            set: function (value) {
                this.offsets = !!value;
                this._polygonOffset = value;
            },
            enumerable: false,
            configurable: true
        });
        State.for2d = function () {
            var state = new State();
            state.depthTest = false;
            state.blend = true;
            return state;
        };
        return State;
    }());

    var defaultVertex$1 = "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n";

    var defaultFragment$1 = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n   gl_FragColor = texture2D(uSampler, vTextureCoord);\n}\n";

    /**
     * Filter is a special type of WebGL shader that is applied to the screen.
     *
     * {@link http://pixijs.io/examples/#/filters/blur-filter.js Example} of the
     * {@link PIXI.filters.BlurFilter BlurFilter}.
     *
     * ### Usage
     * Filters can be applied to any DisplayObject or Container.
     * PixiJS' `FilterSystem` renders the container into temporary Framebuffer,
     * then filter renders it to the screen.
     * Multiple filters can be added to the `filters` array property and stacked on each other.
     *
     * ```
     * const filter = new PIXI.Filter(myShaderVert, myShaderFrag, { myUniform: 0.5 });
     * const container = new PIXI.Container();
     * container.filters = [filter];
     * ```
     *
     * ### Previous Version Differences
     *
     * In PixiJS **v3**, a filter was always applied to _whole screen_.
     *
     * In PixiJS **v4**, a filter can be applied _only part of the screen_.
     * Developers had to create a set of uniforms to deal with coordinates.
     *
     * In PixiJS **v5** combines _both approaches_.
     * Developers can use normal coordinates of v3 and then allow filter to use partial Framebuffers,
     * bringing those extra uniforms into account.
     *
     * Also be aware that we have changed default vertex shader, please consult
     * {@link https://github.com/pixijs/pixi.js/wiki/v5-Creating-filters Wiki}.
     *
     * ### Built-in Uniforms
     *
     * PixiJS viewport uses screen (CSS) coordinates, `(0, 0, renderer.screen.width, renderer.screen.height)`,
     * and `projectionMatrix` uniform maps it to the gl viewport.
     *
     * **uSampler**
     *
     * The most important uniform is the input texture that container was rendered into.
     * _Important note: as with all Framebuffers in PixiJS, both input and output are
     * premultiplied by alpha._
     *
     * By default, input normalized coordinates are passed to fragment shader with `vTextureCoord`.
     * Use it to sample the input.
     *
     * ```
     * const fragment = `
     * varying vec2 vTextureCoord;
     * uniform sampler2D uSampler;
     * void main(void)
     * {
     *    gl_FragColor = texture2D(uSampler, vTextureCoord);
     * }
     * `;
     *
     * const myFilter = new PIXI.Filter(null, fragment);
     * ```
     *
     * This filter is just one uniform less than {@link PIXI.filters.AlphaFilter AlphaFilter}.
     *
     * **outputFrame**
     *
     * The `outputFrame` holds the rectangle where filter is applied in screen (CSS) coordinates.
     * It's the same as `renderer.screen` for a fullscreen filter.
     * Only a part of  `outputFrame.zw` size of temporary Framebuffer is used,
     * `(0, 0, outputFrame.width, outputFrame.height)`,
     *
     * Filters uses this quad to normalized (0-1) space, its passed into `aVertexPosition` attribute.
     * To calculate vertex position in screen space using normalized (0-1) space:
     *
     * ```
     * vec4 filterVertexPosition( void )
     * {
     *     vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;
     *     return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
     * }
     * ```
     *
     * **inputSize**
     *
     * Temporary framebuffer is different, it can be either the size of screen, either power-of-two.
     * The `inputSize.xy` are size of temporary framebuffer that holds input.
     * The `inputSize.zw` is inverted, it's a shortcut to evade division inside the shader.
     *
     * Set `inputSize.xy = outputFrame.zw` for a fullscreen filter.
     *
     * To calculate input normalized coordinate, you have to map it to filter normalized space.
     * Multiply by `outputFrame.zw` to get input coordinate.
     * Divide by `inputSize.xy` to get input normalized coordinate.
     *
     * ```
     * vec2 filterTextureCoord( void )
     * {
     *     return aVertexPosition * (outputFrame.zw * inputSize.zw); // same as /inputSize.xy
     * }
     * ```
     * **resolution**
     *
     * The `resolution` is the ratio of screen (CSS) pixels to real pixels.
     *
     * **inputPixel**
     *
     * `inputPixel.xy` is the size of framebuffer in real pixels, same as `inputSize.xy * resolution`
     * `inputPixel.zw` is inverted `inputPixel.xy`.
     *
     * It's handy for filters that use neighbour pixels, like {@link PIXI.filters.FXAAFilter FXAAFilter}.
     *
     * **inputClamp**
     *
     * If you try to get info from outside of used part of Framebuffer - you'll get undefined behaviour.
     * For displacements, coordinates has to be clamped.
     *
     * The `inputClamp.xy` is left-top pixel center, you may ignore it, because we use left-top part of Framebuffer
     * `inputClamp.zw` is bottom-right pixel center.
     *
     * ```
     * vec4 color = texture2D(uSampler, clamp(modifigedTextureCoord, inputClamp.xy, inputClamp.zw))
     * ```
     * OR
     * ```
     * vec4 color = texture2D(uSampler, min(modifigedTextureCoord, inputClamp.zw))
     * ```
     *
     * ### Additional Information
     *
     * Complete documentation on Filter usage is located in the
     * {@link https://github.com/pixijs/pixi.js/wiki/v5-Creating-filters Wiki}.
     *
     * Since PixiJS only had a handful of built-in filters, additional filters can be downloaded
     * {@link https://github.com/pixijs/pixi-filters here} from the PixiJS Filters repository.
     *
     * @class
     * @memberof PIXI
     * @extends PIXI.Shader
     */
    var Filter = /** @class */ (function (_super) {
        __extends(Filter, _super);
        /**
         * @param {string} [vertexSrc] - The source of the vertex shader.
         * @param {string} [fragmentSrc] - The source of the fragment shader.
         * @param {object} [uniforms] - Custom uniforms to use to augment the built-in ones.
         */
        function Filter(vertexSrc, fragmentSrc, uniforms) {
            var _this = this;
            var program = Program.from(vertexSrc || Filter.defaultVertexSrc, fragmentSrc || Filter.defaultFragmentSrc);
            _this = _super.call(this, program, uniforms) || this;
            /**
             * The padding of the filter. Some filters require extra space to breath such as a blur.
             * Increasing this will add extra width and height to the bounds of the object that the
             * filter is applied to.
             *
             * @member {number}
             */
            _this.padding = 0;
            /**
             * The resolution of the filter. Setting this to be lower will lower the quality but
             * increase the performance of the filter.
             *
             * @member {number}
             */
            _this.resolution = settings.FILTER_RESOLUTION;
            /**
             * If enabled is true the filter is applied, if false it will not.
             *
             * @member {boolean}
             */
            _this.enabled = true;
            /**
             * If enabled, PixiJS will fit the filter area into boundaries for better performance.
             * Switch it off if it does not work for specific shader.
             *
             * @member {boolean}
             */
            _this.autoFit = true;
            /**
             * Legacy filters use position and uvs from attributes
             * @member {boolean}
             * @readonly
             */
            _this.legacy = !!_this.program.attributeData.aTextureCoord;
            /**
             * The WebGL state the filter requires to render
             * @member {PIXI.State}
             */
            _this.state = new State();
            return _this;
        }
        /**
         * Applies the filter
         *
         * @param {PIXI.systems.FilterSystem} filterManager - The renderer to retrieve the filter from
         * @param {PIXI.RenderTexture} input - The input render target.
         * @param {PIXI.RenderTexture} output - The target to output to.
         * @param {PIXI.CLEAR_MODES} clearMode - Should the output be cleared before rendering to it.
         * @param {object} [currentState] - It's current state of filter.
         *        There are some useful properties in the currentState :
         *        target, filters, sourceFrame, destinationFrame, renderTarget, resolution
         */
        Filter.prototype.apply = function (filterManager, input, output, clearMode, _currentState) {
            // do as you please!
            filterManager.applyFilter(this, input, output, clearMode);
            // or just do a regular render..
        };
        Object.defineProperty(Filter.prototype, "blendMode", {
            /**
             * Sets the blendmode of the filter
             *
             * @member {number}
             * @default PIXI.BLEND_MODES.NORMAL
             */
            get: function () {
                return this.state.blendMode;
            },
            set: function (value) {
                this.state.blendMode = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Filter, "defaultVertexSrc", {
            /**
             * The default vertex shader source
             *
             * @static
             * @type {string}
             * @constant
             */
            get: function () {
                return defaultVertex$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Filter, "defaultFragmentSrc", {
            /**
             * The default fragment shader source
             *
             * @static
             * @type {string}
             * @constant
             */
            get: function () {
                return defaultFragment$1;
            },
            enumerable: false,
            configurable: true
        });
        return Filter;
    }(Shader));

    var vertex = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 otherMatrix;\n\nvarying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vMaskCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n}\n";

    var fragment = "varying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform sampler2D mask;\nuniform float alpha;\nuniform float npmAlpha;\nuniform vec4 maskClamp;\n\nvoid main(void)\n{\n    float clip = step(3.5,\n        step(maskClamp.x, vMaskCoord.x) +\n        step(maskClamp.y, vMaskCoord.y) +\n        step(vMaskCoord.x, maskClamp.z) +\n        step(vMaskCoord.y, maskClamp.w));\n\n    vec4 original = texture2D(uSampler, vTextureCoord);\n    vec4 masky = texture2D(mask, vMaskCoord);\n    float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);\n\n    original *= (alphaMul * masky.r * alpha * clip);\n\n    gl_FragColor = original;\n}\n";

    var tempMat = new Matrix();
    /**
     * Class controls uv mapping from Texture normal space to BaseTexture normal space.
     *
     * Takes `trim` and `rotate` into account. May contain clamp settings for Meshes and TilingSprite.
     *
     * Can be used in Texture `uvMatrix` field, or separately, you can use different clamp settings on the same texture.
     * If you want to add support for texture region of certain feature or filter, that's what you're looking for.
     *
     * Takes track of Texture changes through `_lastTextureID` private field.
     * Use `update()` method call to track it from outside.
     *
     * @see PIXI.Texture
     * @see PIXI.Mesh
     * @see PIXI.TilingSprite
     * @class
     * @memberof PIXI
     */
    var TextureMatrix = /** @class */ (function () {
        /**
         *
         * @param {PIXI.Texture} texture - observed texture
         * @param {number} [clampMargin] - Changes frame clamping, 0.5 by default. Use -0.5 for extra border.
         * @constructor
         */
        function TextureMatrix(texture, clampMargin) {
            this._texture = texture;
            /**
             * Matrix operation that converts texture region coords to texture coords
             * @member {PIXI.Matrix}
             * @readonly
             */
            this.mapCoord = new Matrix();
            /**
             * Clamp region for normalized coords, left-top pixel center in xy , bottom-right in zw.
             * Calculated based on clampOffset.
             * @member {Float32Array}
             * @readonly
             */
            this.uClampFrame = new Float32Array(4);
            /**
             * Normalized clamp offset.
             * Calculated based on clampOffset.
             * @member {Float32Array}
             * @readonly
             */
            this.uClampOffset = new Float32Array(2);
            /**
             * Tracks Texture frame changes
             * @member {number}
             * @protected
             */
            this._textureID = -1;
            /**
             * Tracks Texture frame changes
             * @member {number}
             * @protected
             */
            this._updateID = 0;
            /**
             * Changes frame clamping
             * Works with TilingSprite and Mesh
             * Change to 1.5 if you texture has repeated right and bottom lines, that leads to smoother borders
             *
             * @default 0
             * @member {number}
             */
            this.clampOffset = 0;
            /**
             * Changes frame clamping
             * Works with TilingSprite and Mesh
             * Change to -0.5 to add a pixel to the edge, recommended for transparent trimmed textures in atlas
             *
             * @default 0.5
             * @member {number}
             */
            this.clampMargin = (typeof clampMargin === 'undefined') ? 0.5 : clampMargin;
            /**
             * If texture size is the same as baseTexture
             * @member {boolean}
             * @default false
             * @readonly
             */
            this.isSimple = false;
        }
        Object.defineProperty(TextureMatrix.prototype, "texture", {
            /**
             * texture property
             * @member {PIXI.Texture}
             */
            get: function () {
                return this._texture;
            },
            set: function (value) {
                this._texture = value;
                this._textureID = -1;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Multiplies uvs array to transform
         * @param {Float32Array} uvs - mesh uvs
         * @param {Float32Array} [out=uvs] output
         * @returns {Float32Array} output
         */
        TextureMatrix.prototype.multiplyUvs = function (uvs, out) {
            if (out === undefined) {
                out = uvs;
            }
            var mat = this.mapCoord;
            for (var i = 0; i < uvs.length; i += 2) {
                var x = uvs[i];
                var y = uvs[i + 1];
                out[i] = (x * mat.a) + (y * mat.c) + mat.tx;
                out[i + 1] = (x * mat.b) + (y * mat.d) + mat.ty;
            }
            return out;
        };
        /**
         * updates matrices if texture was changed
         * @param {boolean} [forceUpdate=false] - if true, matrices will be updated any case
         * @returns {boolean} whether or not it was updated
         */
        TextureMatrix.prototype.update = function (forceUpdate) {
            var tex = this._texture;
            if (!tex || !tex.valid) {
                return false;
            }
            if (!forceUpdate
                && this._textureID === tex._updateID) {
                return false;
            }
            this._textureID = tex._updateID;
            this._updateID++;
            var uvs = tex._uvs;
            this.mapCoord.set(uvs.x1 - uvs.x0, uvs.y1 - uvs.y0, uvs.x3 - uvs.x0, uvs.y3 - uvs.y0, uvs.x0, uvs.y0);
            var orig = tex.orig;
            var trim = tex.trim;
            if (trim) {
                tempMat.set(orig.width / trim.width, 0, 0, orig.height / trim.height, -trim.x / trim.width, -trim.y / trim.height);
                this.mapCoord.append(tempMat);
            }
            var texBase = tex.baseTexture;
            var frame = this.uClampFrame;
            var margin = this.clampMargin / texBase.resolution;
            var offset = this.clampOffset;
            frame[0] = (tex._frame.x + margin + offset) / texBase.width;
            frame[1] = (tex._frame.y + margin + offset) / texBase.height;
            frame[2] = (tex._frame.x + tex._frame.width - margin + offset) / texBase.width;
            frame[3] = (tex._frame.y + tex._frame.height - margin + offset) / texBase.height;
            this.uClampOffset[0] = offset / texBase.realWidth;
            this.uClampOffset[1] = offset / texBase.realHeight;
            this.isSimple = tex._frame.width === texBase.width
                && tex._frame.height === texBase.height
                && tex.rotate === 0;
            return true;
        };
        return TextureMatrix;
    }());

    /**
     * This handles a Sprite acting as a mask, as opposed to a Graphic.
     *
     * WebGL only.
     *
     * @class
     * @extends PIXI.Filter
     * @memberof PIXI
     */
    var SpriteMaskFilter = /** @class */ (function (_super) {
        __extends(SpriteMaskFilter, _super);
        /**
         * @param {PIXI.Sprite} sprite - the target sprite
         */
        function SpriteMaskFilter(sprite) {
            var _this = this;
            var maskMatrix = new Matrix();
            _this = _super.call(this, vertex, fragment) || this;
            sprite.renderable = false;
            /**
             * Sprite mask
             * @member {PIXI.Sprite}
             */
            _this.maskSprite = sprite;
            /**
             * Mask matrix
             * @member {PIXI.Matrix}
             */
            _this.maskMatrix = maskMatrix;
            return _this;
        }
        /**
         * Applies the filter
         *
         * @param {PIXI.systems.FilterSystem} filterManager - The renderer to retrieve the filter from
         * @param {PIXI.RenderTexture} input - The input render target.
         * @param {PIXI.RenderTexture} output - The target to output to.
         * @param {PIXI.CLEAR_MODES} clearMode - Should the output be cleared before rendering to it.
         */
        SpriteMaskFilter.prototype.apply = function (filterManager, input, output, clearMode) {
            var maskSprite = this.maskSprite;
            var tex = maskSprite._texture;
            if (!tex.valid) {
                return;
            }
            if (!tex.uvMatrix) {
                // margin = 0.0, let it bleed a bit, shader code becomes easier
                // assuming that atlas textures were made with 1-pixel padding
                tex.uvMatrix = new TextureMatrix(tex, 0.0);
            }
            tex.uvMatrix.update();
            this.uniforms.npmAlpha = tex.baseTexture.alphaMode ? 0.0 : 1.0;
            this.uniforms.mask = tex;
            // get _normalized sprite texture coords_ and convert them to _normalized atlas texture coords_ with `prepend`
            this.uniforms.otherMatrix = filterManager.calculateSpriteMatrix(this.maskMatrix, maskSprite)
                .prepend(tex.uvMatrix.mapCoord);
            this.uniforms.alpha = maskSprite.worldAlpha;
            this.uniforms.maskClamp = tex.uvMatrix.uClampFrame;
            filterManager.applyFilter(this, input, output, clearMode);
        };
        return SpriteMaskFilter;
    }(Filter));

    /**
     * System plugin to the renderer to manage masks.
     *
     * @class
     * @extends PIXI.System
     * @memberof PIXI.systems
     */
    var MaskSystem = /** @class */ (function (_super) {
        __extends(MaskSystem, _super);
        /**
         * @param {PIXI.Renderer} renderer - The renderer this System works for.
         */
        function MaskSystem(renderer) {
            var _this = _super.call(this, renderer) || this;
            /**
             * Enable scissor
             * @member {boolean}
             * @readonly
             */
            _this.enableScissor = false;
            /**
             * Pool of used sprite mask filters
             * @member {PIXI.SpriteMaskFilter[]}
             * @readonly
             */
            _this.alphaMaskPool = [];
            /**
             * Pool of mask data
             * @member {PIXI.MaskData[]}
             * @readonly
             */
            _this.maskDataPool = [];
            _this.maskStack = [];
            /**
             * Current index of alpha mask pool
             * @member {number}
             * @default 0
             * @readonly
             */
            _this.alphaMaskIndex = 0;
            return _this;
        }
        /**
         * Changes the mask stack that is used by this System.
         *
         * @param {PIXI.MaskData[]} maskStack - The mask stack
         */
        MaskSystem.prototype.setMaskStack = function (maskStack) {
            this.maskStack = maskStack;
            this.renderer.scissor.setMaskStack(maskStack);
            this.renderer.stencil.setMaskStack(maskStack);
        };
        /**
         * Applies the Mask and adds it to the current filter stack.
         * Renderer batch must be flushed beforehand.
         *
         * @param {PIXI.DisplayObject} target - Display Object to push the mask to
         * @param {PIXI.MaskData|PIXI.Sprite|PIXI.Graphics|PIXI.DisplayObject} maskData - The masking data.
         */
        MaskSystem.prototype.push = function (target, maskDataOrTarget) {
            var maskData = maskDataOrTarget;
            if (!maskData.isMaskData) {
                var d = this.maskDataPool.pop() || new MaskData();
                d.pooled = true;
                d.maskObject = maskDataOrTarget;
                maskData = d;
            }
            if (maskData.autoDetect) {
                this.detect(maskData);
            }
            maskData.copyCountersOrReset(this.maskStack[this.maskStack.length - 1]);
            maskData._target = target;
            switch (maskData.type) {
                case MASK_TYPES.SCISSOR:
                    this.maskStack.push(maskData);
                    this.renderer.scissor.push(maskData);
                    break;
                case MASK_TYPES.STENCIL:
                    this.maskStack.push(maskData);
                    this.renderer.stencil.push(maskData);
                    break;
                case MASK_TYPES.SPRITE:
                    maskData.copyCountersOrReset(null);
                    this.pushSpriteMask(maskData);
                    this.maskStack.push(maskData);
                    break;
                default:
                    break;
            }
        };
        /**
         * Removes the last mask from the mask stack and doesn't return it.
         * Renderer batch must be flushed beforehand.
         *
         * @param {PIXI.DisplayObject} target - Display Object to pop the mask from
         */
        MaskSystem.prototype.pop = function (target) {
            var maskData = this.maskStack.pop();
            if (!maskData || maskData._target !== target) {
                // TODO: add an assert when we have it
                return;
            }
            switch (maskData.type) {
                case MASK_TYPES.SCISSOR:
                    this.renderer.scissor.pop();
                    break;
                case MASK_TYPES.STENCIL:
                    this.renderer.stencil.pop(maskData.maskObject);
                    break;
                case MASK_TYPES.SPRITE:
                    this.popSpriteMask();
                    break;
                default:
                    break;
            }
            maskData.reset();
            if (maskData.pooled) {
                this.maskDataPool.push(maskData);
            }
        };
        /**
         * Sets type of MaskData based on its maskObject
         * @param {PIXI.MaskData} maskData
         */
        MaskSystem.prototype.detect = function (maskData) {
            var maskObject = maskData.maskObject;
            if (maskObject.isSprite) {
                maskData.type = MASK_TYPES.SPRITE;
                return;
            }
            maskData.type = MASK_TYPES.STENCIL;
            // detect scissor in graphics
            if (this.enableScissor
                && maskObject.isFastRect
                && maskObject.isFastRect()) {
                var matrix = maskObject.worldTransform;
                // TODO: move the check to the matrix itself
                // we are checking that its orthogonal and x rotation is 0 90 180 or 270
                var rotX = Math.atan2(matrix.b, matrix.a);
                var rotXY = Math.atan2(matrix.d, matrix.c);
                // use the nearest degree to 0.01
                rotX = Math.round(rotX * (180 / Math.PI) * 100);
                rotXY = Math.round(rotXY * (180 / Math.PI) * 100) - rotX;
                rotX = ((rotX % 9000) + 9000) % 9000;
                rotXY = ((rotXY % 18000) + 18000) % 18000;
                if (rotX === 0 && rotXY === 9000) {
                    maskData.type = MASK_TYPES.SCISSOR;
                }
            }
        };
        /**
         * Applies the Mask and adds it to the current filter stack.
         *
         * @param {PIXI.MaskData} maskData - Sprite to be used as the mask
         */
        MaskSystem.prototype.pushSpriteMask = function (maskData) {
            var maskObject = maskData.maskObject;
            var target = maskData._target;
            var alphaMaskFilter = this.alphaMaskPool[this.alphaMaskIndex];
            if (!alphaMaskFilter) {
                alphaMaskFilter = this.alphaMaskPool[this.alphaMaskIndex] = [new SpriteMaskFilter(maskObject)];
            }
            alphaMaskFilter[0].resolution = this.renderer.resolution;
            alphaMaskFilter[0].maskSprite = maskObject;
            var stashFilterArea = target.filterArea;
            target.filterArea = maskObject.getBounds(true);
            this.renderer.filter.push(target, alphaMaskFilter);
            target.filterArea = stashFilterArea;
            this.alphaMaskIndex++;
        };
        /**
         * Removes the last filter from the filter stack and doesn't return it.
         */
        MaskSystem.prototype.popSpriteMask = function () {
            this.renderer.filter.pop();
            this.alphaMaskIndex--;
        };
        return MaskSystem;
    }(System));

    /**
     * System plugin to the renderer to manage masks of certain type
     *
     * @class
     * @extends PIXI.System
     * @memberof PIXI.systems
     */
    var AbstractMaskSystem = /** @class */ (function (_super) {
        __extends(AbstractMaskSystem, _super);
        /**
         * @param {PIXI.Renderer} renderer - The renderer this System works for.
         */
        function AbstractMaskSystem(renderer) {
            var _this = _super.call(this, renderer) || this;
            /**
             * The mask stack
             * @member {PIXI.MaskData[]}
             */
            _this.maskStack = [];
            /**
             * Constant for gl.enable
             * @member {number}
             * @private
             */
            _this.glConst = 0;
            return _this;
        }
        /**
         * gets count of masks of certain type
         * @returns {number}
         */
        AbstractMaskSystem.prototype.getStackLength = function () {
            return this.maskStack.length;
        };
        /**
         * Changes the mask stack that is used by this System.
         *
         * @param {PIXI.MaskData[]} maskStack - The mask stack
         */
        AbstractMaskSystem.prototype.setMaskStack = function (maskStack) {
            var gl = this.renderer.gl;
            var curStackLen = this.getStackLength();
            this.maskStack = maskStack;
            var newStackLen = this.getStackLength();
            if (newStackLen !== curStackLen) {
                if (newStackLen === 0) {
                    gl.disable(this.glConst);
                }
                else {
                    gl.enable(this.glConst);
                    this._useCurrent();
                }
            }
        };
        /**
         * Setup renderer to use the current mask data.
         * @private
         */
        AbstractMaskSystem.prototype._useCurrent = function () {
            // OVERWRITE;
        };
        /**
         * Destroys the mask stack.
         *
         */
        AbstractMaskSystem.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this.maskStack = null;
        };
        return AbstractMaskSystem;
    }(System));

    /**
     * System plugin to the renderer to manage scissor rects (used for masks).
     *
     * @class
     * @extends PIXI.System
     * @memberof PIXI.systems
     */
    var ScissorSystem = /** @class */ (function (_super) {
        __extends(ScissorSystem, _super);
        /**
         * @param {PIXI.Renderer} renderer - The renderer this System works for.
         */
        function ScissorSystem(renderer) {
            var _this = _super.call(this, renderer) || this;
            _this.glConst = WebGLRenderingContext.SCISSOR_TEST;
            return _this;
        }
        ScissorSystem.prototype.getStackLength = function () {
            var maskData = this.maskStack[this.maskStack.length - 1];
            if (maskData) {
                return maskData._scissorCounter;
            }
            return 0;
        };
        /**
         * Applies the Mask and adds it to the current stencil stack. @alvin
         *
         * @param {PIXI.MaskData} maskData - The mask data
         */
        ScissorSystem.prototype.push = function (maskData) {
            var maskObject = maskData.maskObject;
            maskObject.renderable = true;
            var prevData = maskData._scissorRect;
            var bounds = maskObject.getBounds(true);
            var gl = this.renderer.gl;
            maskObject.renderable = false;
            if (prevData) {
                bounds.fit(prevData);
            }
            else {
                gl.enable(gl.SCISSOR_TEST);
            }
            maskData._scissorCounter++;
            maskData._scissorRect = bounds;
            this._useCurrent();
        };
        /**
         * Pops scissor mask. MaskData is already removed from stack
         */
        ScissorSystem.prototype.pop = function () {
            var gl = this.renderer.gl;
            if (this.getStackLength() > 0) {
                this._useCurrent();
            }
            else {
                gl.disable(gl.SCISSOR_TEST);
            }
        };
        /**
         * Setup renderer to use the current scissor data.
         * @private
         */
        ScissorSystem.prototype._useCurrent = function () {
            var rect = this.maskStack[this.maskStack.length - 1]._scissorRect;
            var rt = this.renderer.renderTexture.current;
            var _a = this.renderer.projection, transform = _a.transform, sourceFrame = _a.sourceFrame, destinationFrame = _a.destinationFrame;
            var resolution = rt ? rt.resolution : this.renderer.resolution;
            var x = ((rect.x - sourceFrame.x) * resolution) + destinationFrame.x;
            var y = ((rect.y - sourceFrame.y) * resolution) + destinationFrame.y;
            var width = rect.width * resolution;
            var height = rect.height * resolution;
            if (transform) {
                x += transform.tx * resolution;
                y += transform.ty * resolution;
            }
            if (!rt) {
                // flipY. In future we'll have it over renderTextures as an option
                y = this.renderer.height - height - y;
            }
            this.renderer.gl.scissor(x, y, width, height);
        };
        return ScissorSystem;
    }(AbstractMaskSystem));

    /**
     * System plugin to the renderer to manage stencils (used for masks).
     *
     * @class
     * @extends PIXI.System
     * @memberof PIXI.systems
     */
    var StencilSystem = /** @class */ (function (_super) {
        __extends(StencilSystem, _super);
        /**
         * @param {PIXI.Renderer} renderer - The renderer this System works for.
         */
        function StencilSystem(renderer) {
            var _this = _super.call(this, renderer) || this;
            _this.glConst = WebGLRenderingContext.STENCIL_TEST;
            return _this;
        }
        StencilSystem.prototype.getStackLength = function () {
            var maskData = this.maskStack[this.maskStack.length - 1];
            if (maskData) {
                return maskData._stencilCounter;
            }
            return 0;
        };
        /**
         * Applies the Mask and adds it to the current stencil stack.
         *
         * @param {PIXI.MaskData} maskData - The mask data
         */
        StencilSystem.prototype.push = function (maskData) {
            var maskObject = maskData.maskObject;
            var gl = this.renderer.gl;
            var prevMaskCount = maskData._stencilCounter;
            if (prevMaskCount === 0) {
                // force use stencil texture in current framebuffer
                this.renderer.framebuffer.forceStencil();
                gl.enable(gl.STENCIL_TEST);
            }
            maskData._stencilCounter++;
            // Increment the reference stencil value where the new mask overlaps with the old ones.
            gl.colorMask(false, false, false, false);
            gl.stencilFunc(gl.EQUAL, prevMaskCount, this._getBitwiseMask());
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
            maskObject.renderable = true;
            maskObject.render(this.renderer);
            this.renderer.batch.flush();
            maskObject.renderable = false;
            this._useCurrent();
        };
        /**
         * Pops stencil mask. MaskData is already removed from stack
         *
         * @param {PIXI.DisplayObject} maskObject - object of popped mask data
         */
        StencilSystem.prototype.pop = function (maskObject) {
            var gl = this.renderer.gl;
            if (this.getStackLength() === 0) {
                // the stack is empty!
                gl.disable(gl.STENCIL_TEST);
                gl.clear(gl.STENCIL_BUFFER_BIT);
                gl.clearStencil(0);
            }
            else {
                // Decrement the reference stencil value where the popped mask overlaps with the other ones
                gl.colorMask(false, false, false, false);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
                maskObject.renderable = true;
                maskObject.render(this.renderer);
                this.renderer.batch.flush();
                maskObject.renderable = false;
                this._useCurrent();
            }
        };
        /**
         * Setup renderer to use the current stencil data.
         * @private
         */
        StencilSystem.prototype._useCurrent = function () {
            var gl = this.renderer.gl;
            gl.colorMask(true, true, true, true);
            gl.stencilFunc(gl.EQUAL, this.getStackLength(), this._getBitwiseMask());
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        };
        /**
         * Fill 1s equal to the number of acitve stencil masks.
         * @private
         * @return {number} The bitwise mask.
         */
        StencilSystem.prototype._getBitwiseMask = function () {
            return (1 << this.getStackLength()) - 1;
        };
        return StencilSystem;
    }(AbstractMaskSystem));

    /**
     * System plugin to the renderer to manage the projection matrix.
     *
     * @class
     * @extends PIXI.System
     * @memberof PIXI.systems
     */
    var ProjectionSystem = /** @class */ (function (_super) {
        __extends(ProjectionSystem, _super);
        /**
         * @param {PIXI.Renderer} renderer - The renderer this System works for.
         */
        function ProjectionSystem(renderer) {
            var _this = _super.call(this, renderer) || this;
            /**
             * Destination frame
             * @member {PIXI.Rectangle}
             * @readonly
             */
            _this.destinationFrame = null;
            /**
             * Source frame
             * @member {PIXI.Rectangle}
             * @readonly
             */
            _this.sourceFrame = null;
            /**
             * Default destination frame
             * @member {PIXI.Rectangle}
             * @readonly
             */
            _this.defaultFrame = null;
            /**
             * Project matrix
             * @member {PIXI.Matrix}
             * @readonly
             */
            _this.projectionMatrix = new Matrix();
            /**
             * A transform that will be appended to the projection matrix
             * if null, nothing will be applied
             * @member {PIXI.Matrix}
             */
            _this.transform = null;
            return _this;
        }
        /**
         * Updates the projection matrix based on a projection frame (which is a rectangle).
         *
         * Make sure to run `renderer.framebuffer.setViewport(destinationFrame)` after calling this.
         *
         * @param {PIXI.Rectangle} destinationFrame - The destination frame.
         * @param {PIXI.Rectangle} sourceFrame - The source frame.
         * @param {Number} resolution - Resolution
         * @param {boolean} root - If is root
         */
        ProjectionSystem.prototype.update = function (destinationFrame, sourceFrame, resolution, root) {
            this.destinationFrame = destinationFrame || this.destinationFrame || this.defaultFrame;
            this.sourceFrame = sourceFrame || this.sourceFrame || destinationFrame;
            // Calculate object-space to clip-space projection
            this.calculateProjection(this.destinationFrame, this.sourceFrame, resolution, root);
            if (this.transform) {
                this.projectionMatrix.append(this.transform);
            }
            var renderer = this.renderer;
            renderer.globalUniforms.uniforms.projectionMatrix = this.projectionMatrix;
            renderer.globalUniforms.update();
            // this will work for now
            // but would be sweet to stick and even on the global uniforms..
            if (renderer.shader.shader) {
                renderer.shader.syncUniformGroup(renderer.shader.shader.uniforms.globals);
            }
        };
        /**
         * Updates the projection matrix based on a projection frame (which is a rectangle)
         *
         * @param {PIXI.Rectangle}[destinationFrame] - The destination frame.
         * @param {PIXI.Rectangle} sourceFrame - The source frame.
         * @param {Number} resolution - Resolution
         * @param {boolean} root - If is root
         */
        ProjectionSystem.prototype.calculateProjection = function (_destinationFrame, sourceFrame, _resolution, root) {
            var pm = this.projectionMatrix;
            var sign = !root ? 1 : -1;
            pm.identity();
            pm.a = (1 / sourceFrame.width * 2);
            pm.d = sign * (1 / sourceFrame.height * 2);
            pm.tx = -1 - (sourceFrame.x * pm.a);
            pm.ty = -sign - (sourceFrame.y * pm.d);
        };
        /**
         * Sets the transform of the active render target to the given matrix
         *
         * @param {PIXI.Matrix} matrix - The transformation matrix
         */
        ProjectionSystem.prototype.setTransform = function (_matrix) {
            // this._activeRenderTarget.transform = matrix;
        };
        return ProjectionSystem;
    }(System));

    // Temporary rectangle for assigned sourceFrame or destinationFrame
    var tempRect = new Rectangle();
    // Temporary rectangle for renderTexture destinationFrame
    var tempRect2 = new Rectangle();
    // Temporary rectangle for passing the framebuffer viewport
    var viewportFrame = new Rectangle();
    /**
     * System plugin to the renderer to manage render textures.
     *
     * Should be added after FramebufferSystem
     *
     * @class
     * @extends PIXI.System
     * @memberof PIXI.systems
     */
    var RenderTextureSystem = /** @class */ (function (_super) {
        __extends(RenderTextureSystem, _super);
        /**
         * @param {PIXI.Renderer} renderer - The renderer this System works for.
         */
        function RenderTextureSystem(renderer) {
            var _this = _super.call(this, renderer) || this;
            /**
             * The clear background color as rgba
             * @member {number[]}
             */
            _this.clearColor = renderer._backgroundColorRgba;
            // TODO move this property somewhere else!
            /**
             * List of masks for the StencilSystem
             * @member {PIXI.Graphics[]}
             * @readonly
             */
            _this.defaultMaskStack = [];
            // empty render texture?
            /**
             * Render texture
             * @member {PIXI.RenderTexture}
             * @readonly
             */
            _this.current = null;
            /**
             * Source frame
             * @member {PIXI.Rectangle}
             * @readonly
             */
            _this.sourceFrame = new Rectangle();
            /**
             * Destination frame
             * @member {PIXI.Rectangle}
             * @readonly
             */
            _this.destinationFrame = new Rectangle();
            return _this;
        }
        /**
         * Bind the current render texture
         *
         * @param {PIXI.RenderTexture} [renderTexture] - RenderTexture to bind, by default its `null`, the screen
         * @param {PIXI.Rectangle} [sourceFrame] - part of screen that is mapped to the renderTexture
         * @param {PIXI.Rectangle} [destinationFrame] - part of renderTexture, by default it has the same size as sourceFrame
         */
        RenderTextureSystem.prototype.bind = function (renderTexture, sourceFrame, destinationFrame) {
            if (renderTexture === void 0) { renderTexture = null; }
            var renderer = this.renderer;
            this.current = renderTexture;
            var baseTexture;
            var framebuffer;
            var resolution;
            if (renderTexture) {
                baseTexture = renderTexture.baseTexture;
                resolution = baseTexture.resolution;
                if (!sourceFrame) {
                    tempRect.width = renderTexture.frame.width;
                    tempRect.height = renderTexture.frame.height;
                    sourceFrame = tempRect;
                }
                if (!destinationFrame) {
                    tempRect2.x = renderTexture.frame.x;
                    tempRect2.y = renderTexture.frame.y;
                    tempRect2.width = sourceFrame.width;
                    tempRect2.height = sourceFrame.height;
                    destinationFrame = tempRect2;
                }
                framebuffer = baseTexture.framebuffer;
            }
            else {
                resolution = renderer.resolution;
                if (!sourceFrame) {
                    tempRect.width = renderer.screen.width;
                    tempRect.height = renderer.screen.height;
                    sourceFrame = tempRect;
                }
                if (!destinationFrame) {
                    destinationFrame = tempRect;
                    destinationFrame.width = sourceFrame.width;
                    destinationFrame.height = sourceFrame.height;
                }
            }
            viewportFrame.x = destinationFrame.x * resolution;
            viewportFrame.y = destinationFrame.y * resolution;
            viewportFrame.width = destinationFrame.width * resolution;
            viewportFrame.height = destinationFrame.height * resolution;
            this.renderer.framebuffer.bind(framebuffer, viewportFrame);
            this.renderer.projection.update(destinationFrame, sourceFrame, resolution, !framebuffer);
            if (renderTexture) {
                this.renderer.mask.setMaskStack(baseTexture.maskStack);
            }
            else {
                this.renderer.mask.setMaskStack(this.defaultMaskStack);
            }
            this.sourceFrame.copyFrom(sourceFrame);
            this.destinationFrame.copyFrom(destinationFrame);
        };
        /**
         * Erases the render texture and fills the drawing area with a colour
         *
         * @param {number[]} [clearColor] - The color as rgba, default to use the renderer backgroundColor
         * @param {PIXI.BUFFER_BITS} [mask=BUFFER_BITS.COLOR | BUFFER_BITS.DEPTH] - Bitwise OR of masks
         *  that indicate the buffers to be cleared, by default COLOR and DEPTH buffers.
         * @return {PIXI.Renderer} Returns itself.
         */
        RenderTextureSystem.prototype.clear = function (clearColor, mask) {
            if (this.current) {
                clearColor = clearColor || this.current.baseTexture.clearColor;
            }
            else {
                clearColor = clearColor || this.clearColor;
            }
            this.renderer.framebuffer.clear(clearColor[0], clearColor[1], clearColor[2], clearColor[3], mask);
        };
        RenderTextureSystem.prototype.resize = function () {
            // resize the root only!
            this.bind(null);
        };
        /**
         * Resets renderTexture state
         */
        RenderTextureSystem.prototype.reset = function () {
            this.bind(null);
        };
        return RenderTextureSystem;
    }(System));

    var IGLUniformData = /** @class */ (function () {
        function IGLUniformData() {
        }
        return IGLUniformData;
    }());
    /**
     * Helper class to create a WebGL Program
     *
     * @class
     * @memberof PIXI
     */
    var GLProgram = /** @class */ (function () {
        /**
         * Makes a new Pixi program
         *
         * @param program {WebGLProgram} webgl program
         * @param uniformData {Object} uniforms
         */
        function GLProgram(program, uniformData) {
            /**
             * The shader program
             *
             * @member {WebGLProgram}
             */
            this.program = program;
            /**
             * holds the uniform data which contains uniform locations
             * and current uniform values used for caching and preventing unneeded GPU commands
             * @member {Object}
             */
            this.uniformData = uniformData;
            /**
             * uniformGroups holds the various upload functions for the shader. Each uniform group
             * and program have a unique upload function generated.
             * @member {Object}
             */
            this.uniformGroups = {};
        }
        /**
         * Destroys this program
         */
        GLProgram.prototype.destroy = function () {
            this.uniformData = null;
            this.uniformGroups = null;
            this.program = null;
        };
        return GLProgram;
    }());

    var UID$4 = 0;
    // defualt sync data so we don't create a new one each time!
    var defaultSyncData = { textureCount: 0 };
    /**
     * System plugin to the renderer to manage shaders.
     *
     * @class
     * @memberof PIXI.systems
     * @extends PIXI.System
     */
    var ShaderSystem = /** @class */ (function (_super) {
        __extends(ShaderSystem, _super);
        /**
         * @param {PIXI.Renderer} renderer - The renderer this System works for.
         */
        function ShaderSystem(renderer) {
            var _this = _super.call(this, renderer) || this;
            _this.destroyed = false;
            // Validation check that this environment support `new Function`
            _this.systemCheck();
            /**
             * The current WebGL rendering context
             *
             * @member {WebGLRenderingContext}
             */
            _this.gl = null;
            _this.shader = null;
            _this.program = null;
            /**
             * Cache to holds the generated functions. Stored against UniformObjects unique signature
             * @type {Object}
             * @private
             */
            _this.cache = {};
            _this.id = UID$4++;
            return _this;
        }
        /**
         * Overrideable function by `@pixi/unsafe-eval` to silence
         * throwing an error if platform doesn't support unsafe-evals.
         *
         * @private
         */
        ShaderSystem.prototype.systemCheck = function () {
            if (!unsafeEvalSupported()) {
                throw new Error('Current environment does not allow unsafe-eval, '
                    + 'please use @pixi/unsafe-eval module to enable support.');
            }
        };
        ShaderSystem.prototype.contextChange = function (gl) {
            this.gl = gl;
            this.reset();
        };
        /**
         * Changes the current shader to the one given in parameter
         *
         * @param {PIXI.Shader} shader - the new shader
         * @param {boolean} [dontSync] - false if the shader should automatically sync its uniforms.
         * @returns {PIXI.GLProgram} the glProgram that belongs to the shader.
         */
        ShaderSystem.prototype.bind = function (shader, dontSync) {
            shader.uniforms.globals = this.renderer.globalUniforms;
            var program = shader.program;
            var glProgram = program.glPrograms[this.renderer.CONTEXT_UID] || this.generateShader(shader);
            this.shader = shader;
            // TODO - some current Pixi plugins bypass this.. so it not safe to use yet..
            if (this.program !== program) {
                this.program = program;
                this.gl.useProgram(glProgram.program);
            }
            if (!dontSync) {
                defaultSyncData.textureCount = 0;
                this.syncUniformGroup(shader.uniformGroup, defaultSyncData);
            }
            return glProgram;
        };
        /**
         * Uploads the uniforms values to the currently bound shader.
         *
         * @param {object} uniforms - the uniforms values that be applied to the current shader
         */
        ShaderSystem.prototype.setUniforms = function (uniforms) {
            var shader = this.shader.program;
            var glProgram = shader.glPrograms[this.renderer.CONTEXT_UID];
            shader.syncUniforms(glProgram.uniformData, uniforms, this.renderer);
        };
        /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
        /**
         *
         * syncs uniforms on the group
         * @param {*} group - the uniform group to sync
         * @param {*} [syncData] - this is data that is passed to the sync function and any nested sync functions
         */
        ShaderSystem.prototype.syncUniformGroup = function (group, syncData) {
            var glProgram = this.getglProgram();
            if (!group.static || group.dirtyId !== glProgram.uniformGroups[group.id]) {
                glProgram.uniformGroups[group.id] = group.dirtyId;
                this.syncUniforms(group, glProgram, syncData);
            }
        };
        /**
         * Overrideable by the @pixi/unsafe-eval package to use static
         * syncUnforms instead.
         *
         * @private
         */
        ShaderSystem.prototype.syncUniforms = function (group, glProgram, syncData) {
            var syncFunc = group.syncUniforms[this.shader.program.id] || this.createSyncGroups(group);
            syncFunc(glProgram.uniformData, group.uniforms, this.renderer, syncData);
        };
        /* eslint-enable @typescript-eslint/explicit-module-boundary-types */
        ShaderSystem.prototype.createSyncGroups = function (group) {
            var id = this.getSignature(group, this.shader.program.uniformData);
            if (!this.cache[id]) {
                this.cache[id] = generateUniformsSync(group, this.shader.program.uniformData);
            }
            group.syncUniforms[this.shader.program.id] = this.cache[id];
            return group.syncUniforms[this.shader.program.id];
        };
        /**
         * Takes a uniform group and data and generates a unique signature for them.
         *
         * @param {PIXI.UniformGroup} group - the uniform group to get signature of
         * @param {Object} uniformData - uniform information generated by the shader
         * @returns {String} Unique signature of the uniform group
         * @private
         */
        ShaderSystem.prototype.getSignature = function (group, uniformData) {
            var uniforms = group.uniforms;
            var strings = [];
            for (var i in uniforms) {
                strings.push(i);
                if (uniformData[i]) {
                    strings.push(uniformData[i].type);
                }
            }
            return strings.join('-');
        };
        /**
         * Returns the underlying GLShade rof the currently bound shader.
         * This can be handy for when you to have a little more control over the setting of your uniforms.
         *
         * @return {PIXI.GLProgram} the glProgram for the currently bound Shader for this context
         */
        ShaderSystem.prototype.getglProgram = function () {
            if (this.shader) {
                return this.shader.program.glPrograms[this.renderer.CONTEXT_UID];
            }
            return null;
        };
        /**
         * Generates a glProgram version of the Shader provided.
         *
         * @private
         * @param {PIXI.Shader} shader - the shader that the glProgram will be based on.
         * @return {PIXI.GLProgram} A shiny new glProgram!
         */
        ShaderSystem.prototype.generateShader = function (shader) {
            var gl = this.gl;
            var program = shader.program;
            var attribMap = {};
            for (var i in program.attributeData) {
                attribMap[i] = program.attributeData[i].location;
            }
            var shaderProgram = compileProgram(gl, program.vertexSrc, program.fragmentSrc, attribMap);
            var uniformData = {};
            for (var i in program.uniformData) {
                var data = program.uniformData[i];
                uniformData[i] = {
                    location: gl.getUniformLocation(shaderProgram, i),
                    value: defaultValue(data.type, data.size),
                };
            }
            var glProgram = new GLProgram(shaderProgram, uniformData);
            program.glPrograms[this.renderer.CONTEXT_UID] = glProgram;
            return glProgram;
        };
        /**
         * Resets ShaderSystem state, does not affect WebGL state
         */
        ShaderSystem.prototype.reset = function () {
            this.program = null;
            this.shader = null;
        };
        /**
         * Destroys this System and removes all its textures
         */
        ShaderSystem.prototype.destroy = function () {
            // TODO implement destroy method for ShaderSystem
            this.destroyed = true;
        };
        return ShaderSystem;
    }(System));

    /**
     * Maps gl blend combinations to WebGL.
     *
     * @memberof PIXI
     * @function mapWebGLBlendModesToPixi
     * @private
     * @param {WebGLRenderingContext} gl - The rendering context.
     * @param {number[][]} [array=[]] - The array to output into.
     * @return {number[][]} Mapped modes.
     */
    function mapWebGLBlendModesToPixi(gl, array) {
        if (array === void 0) { array = []; }
        // TODO - premultiply alpha would be different.
        // add a boolean for that!
        array[BLEND_MODES.NORMAL] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.ADD] = [gl.ONE, gl.ONE];
        array[BLEND_MODES.MULTIPLY] = [gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.SCREEN] = [gl.ONE, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.OVERLAY] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.DARKEN] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.LIGHTEN] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.COLOR_DODGE] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.COLOR_BURN] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.HARD_LIGHT] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.SOFT_LIGHT] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.DIFFERENCE] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.EXCLUSION] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.HUE] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.SATURATION] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.COLOR] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.LUMINOSITY] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.NONE] = [0, 0];
        // not-premultiplied blend modes
        array[BLEND_MODES.NORMAL_NPM] = [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.ADD_NPM] = [gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE];
        array[BLEND_MODES.SCREEN_NPM] = [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        // composite operations
        array[BLEND_MODES.SRC_IN] = [gl.DST_ALPHA, gl.ZERO];
        array[BLEND_MODES.SRC_OUT] = [gl.ONE_MINUS_DST_ALPHA, gl.ZERO];
        array[BLEND_MODES.SRC_ATOP] = [gl.DST_ALPHA, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.DST_OVER] = [gl.ONE_MINUS_DST_ALPHA, gl.ONE];
        array[BLEND_MODES.DST_IN] = [gl.ZERO, gl.SRC_ALPHA];
        array[BLEND_MODES.DST_OUT] = [gl.ZERO, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.DST_ATOP] = [gl.ONE_MINUS_DST_ALPHA, gl.SRC_ALPHA];
        array[BLEND_MODES.XOR] = [gl.ONE_MINUS_DST_ALPHA, gl.ONE_MINUS_SRC_ALPHA];
        // SUBTRACT from flash
        array[BLEND_MODES.SUBTRACT] = [gl.ONE, gl.ONE, gl.ONE, gl.ONE, gl.FUNC_REVERSE_SUBTRACT, gl.FUNC_ADD];
        return array;
    }

    var BLEND$1 = 0;
    var OFFSET$1 = 1;
    var CULLING$1 = 2;
    var DEPTH_TEST$1 = 3;
    var WINDING$1 = 4;
    /**
     * System plugin to the renderer to manage WebGL state machines.
     *
     * @class
     * @extends PIXI.System
     * @memberof PIXI.systems
     */
    var StateSystem = /** @class */ (function (_super) {
        __extends(StateSystem, _super);
        /**
         * @param {PIXI.Renderer} renderer - The renderer this System works for.
         */
        function StateSystem(renderer) {
            var _this = _super.call(this, renderer) || this;
            /**
             * GL context
             * @member {WebGLRenderingContext}
             * @readonly
             */
            _this.gl = null;
            /**
             * State ID
             * @member {number}
             * @readonly
             */
            _this.stateId = 0;
            /**
             * Polygon offset
             * @member {number}
             * @readonly
             */
            _this.polygonOffset = 0;
            /**
             * Blend mode
             * @member {number}
             * @default PIXI.BLEND_MODES.NONE
             * @readonly
             */
            _this.blendMode = BLEND_MODES.NONE;
            /**
             * Whether current blend equation is different
             * @member {boolean}
             * @protected
             */
            _this._blendEq = false;
            /**
             * Collection of calls
             * @member {function[]}
             * @readonly
             */
            _this.map = [];
            // map functions for when we set state..
            _this.map[BLEND$1] = _this.setBlend;
            _this.map[OFFSET$1] = _this.setOffset;
            _this.map[CULLING$1] = _this.setCullFace;
            _this.map[DEPTH_TEST$1] = _this.setDepthTest;
            _this.map[WINDING$1] = _this.setFrontFace;
            /**
             * Collection of check calls
             * @member {function[]}
             * @readonly
             */
            _this.checks = [];
            /**
             * Default WebGL State
             * @member {PIXI.State}
             * @readonly
             */
            _this.defaultState = new State();
            _this.defaultState.blend = true;
            return _this;
        }
        StateSystem.prototype.contextChange = function (gl) {
            this.gl = gl;
            this.blendModes = mapWebGLBlendModesToPixi(gl);
            this.set(this.defaultState);
            this.reset();
        };
        /**
         * Sets the current state
         *
         * @param {*} state - The state to set.
         */
        StateSystem.prototype.set = function (state) {
            state = state || this.defaultState;
            // TODO maybe to an object check? ( this.state === state )?
            if (this.stateId !== state.data) {
                var diff = this.stateId ^ state.data;
                var i = 0;
                // order from least to most common
                while (diff) {
                    if (diff & 1) {
                        // state change!
                        this.map[i].call(this, !!(state.data & (1 << i)));
                    }
                    diff = diff >> 1;
                    i++;
                }
                this.stateId = state.data;
            }
            // based on the above settings we check for specific modes..
            // for example if blend is active we check and set the blend modes
            // or of polygon offset is active we check the poly depth.
            for (var i = 0; i < this.checks.length; i++) {
                this.checks[i](this, state);
            }
        };
        /**
         * Sets the state, when previous state is unknown
         *
         * @param {*} state - The state to set
         */
        StateSystem.prototype.forceState = function (state) {
            state = state || this.defaultState;
            for (var i = 0; i < this.map.length; i++) {
                this.map[i].call(this, !!(state.data & (1 << i)));
            }
            for (var i = 0; i < this.checks.length; i++) {
                this.checks[i](this, state);
            }
            this.stateId = state.data;
        };
        /**
         * Enables or disabled blending.
         *
         * @param {boolean} value - Turn on or off webgl blending.
         */
        StateSystem.prototype.setBlend = function (value) {
            this.updateCheck(StateSystem.checkBlendMode, value);
            this.gl[value ? 'enable' : 'disable'](this.gl.BLEND);
        };
        /**
         * Enables or disable polygon offset fill
         *
         * @param {boolean} value - Turn on or off webgl polygon offset testing.
         */
        StateSystem.prototype.setOffset = function (value) {
            this.updateCheck(StateSystem.checkPolygonOffset, value);
            this.gl[value ? 'enable' : 'disable'](this.gl.POLYGON_OFFSET_FILL);
        };
        /**
         * Sets whether to enable or disable depth test.
         *
         * @param {boolean} value - Turn on or off webgl depth testing.
         */
        StateSystem.prototype.setDepthTest = function (value) {
            this.gl[value ? 'enable' : 'disable'](this.gl.DEPTH_TEST);
        };
        /**
         * Sets whether to enable or disable cull face.
         *
         * @param {boolean} value - Turn on or off webgl cull face.
         */
        StateSystem.prototype.setCullFace = function (value) {
            this.gl[value ? 'enable' : 'disable'](this.gl.CULL_FACE);
        };
        /**
         * Sets the gl front face.
         *
         * @param {boolean} value - true is clockwise and false is counter-clockwise
         */
        StateSystem.prototype.setFrontFace = function (value) {
            this.gl.frontFace(this.gl[value ? 'CW' : 'CCW']);
        };
        /**
         * Sets the blend mode.
         *
         * @param {number} value - The blend mode to set to.
         */
        StateSystem.prototype.setBlendMode = function (value) {
            if (value === this.blendMode) {
                return;
            }
            this.blendMode = value;
            var mode = this.blendModes[value];
            var gl = this.gl;
            if (mode.length === 2) {
                gl.blendFunc(mode[0], mode[1]);
            }
            else {
                gl.blendFuncSeparate(mode[0], mode[1], mode[2], mode[3]);
            }
            if (mode.length === 6) {
                this._blendEq = true;
                gl.blendEquationSeparate(mode[4], mode[5]);
            }
            else if (this._blendEq) {
                this._blendEq = false;
                gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
            }
        };
        /**
         * Sets the polygon offset.
         *
         * @param {number} value - the polygon offset
         * @param {number} scale - the polygon offset scale
         */
        StateSystem.prototype.setPolygonOffset = function (value, scale) {
            this.gl.polygonOffset(value, scale);
        };
        // used
        /**
         * Resets all the logic and disables the vaos
         */
        StateSystem.prototype.reset = function () {
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
            this.forceState(this.defaultState);
            this._blendEq = true;
            this.blendMode = -1;
            this.setBlendMode(0);
        };
        /**
         * checks to see which updates should be checked based on which settings have been activated.
         * For example, if blend is enabled then we should check the blend modes each time the state is changed
         * or if polygon fill is activated then we need to check if the polygon offset changes.
         * The idea is that we only check what we have too.
         *
         * @param {Function} func - the checking function to add or remove
         * @param {boolean} value - should the check function be added or removed.
         */
        StateSystem.prototype.updateCheck = function (func, value) {
            var index = this.checks.indexOf(func);
            if (value && index === -1) {
                this.checks.push(func);
            }
            else if (!value && index !== -1) {
                this.checks.splice(index, 1);
            }
        };
        /**
         * A private little wrapper function that we call to check the blend mode.
         *
         * @static
         * @private
         * @param {PIXI.StateSystem} System - the System to perform the state check on
         * @param {PIXI.State} state - the state that the blendMode will pulled from
         */
        StateSystem.checkBlendMode = function (system, state) {
            system.setBlendMode(state.blendMode);
        };
        /**
         * A private little wrapper function that we call to check the polygon offset.
         *
         * @static
         * @private
         * @param {PIXI.StateSystem} System - the System to perform the state check on
         * @param {PIXI.State} state - the state that the blendMode will pulled from
         */
        StateSystem.checkPolygonOffset = function (system, state) {
            system.setPolygonOffset(1, state.polygonOffset);
        };
        return StateSystem;
    }(System));

    /**
     * System plugin to the renderer to manage texture garbage collection on the GPU,
     * ensuring that it does not get clogged up with textures that are no longer being used.
     *
     * @class
     * @memberof PIXI.systems
     * @extends PIXI.System
     */
    var TextureGCSystem = /** @class */ (function (_super) {
        __extends(TextureGCSystem, _super);
        /**
         * @param {PIXI.Renderer} renderer - The renderer this System works for.
         */
        function TextureGCSystem(renderer) {
            var _this = _super.call(this, renderer) || this;
            /**
             * Count
             * @member {number}
             * @readonly
             */
            _this.count = 0;
            /**
             * Check count
             * @member {number}
             * @readonly
             */
            _this.checkCount = 0;
            /**
             * Maximum idle time, in seconds
             * @member {number}
             * @see PIXI.settings.GC_MAX_IDLE
             */
            _this.maxIdle = settings.GC_MAX_IDLE;
            /**
             * Maximum number of item to check
             * @member {number}
             * @see PIXI.settings.GC_MAX_CHECK_COUNT
             */
            _this.checkCountMax = settings.GC_MAX_CHECK_COUNT;
            /**
             * Current garabage collection mode
             * @member {PIXI.GC_MODES}
             * @see PIXI.settings.GC_MODE
             */
            _this.mode = settings.GC_MODE;
            return _this;
        }
        /**
         * Checks to see when the last time a texture was used
         * if the texture has not been used for a specified amount of time it will be removed from the GPU
         */
        TextureGCSystem.prototype.postrender = function () {
            if (!this.renderer.renderingToScreen) {
                return;
            }
            this.count++;
            if (this.mode === GC_MODES.MANUAL) {
                return;
            }
            this.checkCount++;
            if (this.checkCount > this.checkCountMax) {
                this.checkCount = 0;
                this.run();
            }
        };
        /**
         * Checks to see when the last time a texture was used
         * if the texture has not been used for a specified amount of time it will be removed from the GPU
         */
        TextureGCSystem.prototype.run = function () {
            var tm = this.renderer.texture;
            var managedTextures = tm.managedTextures;
            var wasRemoved = false;
            for (var i = 0; i < managedTextures.length; i++) {
                var texture = managedTextures[i];
                // only supports non generated textures at the moment!
                if (!texture.framebuffer && this.count - texture.touched > this.maxIdle) {
                    tm.destroyTexture(texture, true);
                    managedTextures[i] = null;
                    wasRemoved = true;
                }
            }
            if (wasRemoved) {
                var j = 0;
                for (var i = 0; i < managedTextures.length; i++) {
                    if (managedTextures[i] !== null) {
                        managedTextures[j++] = managedTextures[i];
                    }
                }
                managedTextures.length = j;
            }
        };
        /**
         * Removes all the textures within the specified displayObject and its children from the GPU
         *
         * @param {PIXI.DisplayObject} displayObject - the displayObject to remove the textures from.
         */
        TextureGCSystem.prototype.unload = function (displayObject) {
            var _a;
            var tm = this.renderer.texture;
            // only destroy non generated textures
            if ((_a = displayObject._texture) === null || _a === void 0 ? void 0 : _a.framebuffer) {
                tm.destroyTexture(displayObject._texture);
            }
            for (var i = displayObject.children.length - 1; i >= 0; i--) {
                this.unload(displayObject.children[i]);
            }
        };
        return TextureGCSystem;
    }(System));

    /**
     * Internal texture for WebGL context
     * @class
     * @memberof PIXI
     */
    var GLTexture = /** @class */ (function () {
        function GLTexture(texture) {
            /**
             * The WebGL texture
             * @member {WebGLTexture}
             */
            this.texture = texture;
            /**
             * Width of texture that was used in texImage2D
             * @member {number}
             */
            this.width = -1;
            /**
             * Height of texture that was used in texImage2D
             * @member {number}
             */
            this.height = -1;
            /**
             * Texture contents dirty flag
             * @member {number}
             */
            this.dirtyId = -1;
            /**
             * Texture style dirty flag
             * @member {number}
             */
            this.dirtyStyleId = -1;
            /**
             * Whether mip levels has to be generated
             * @member {boolean}
             */
            this.mipmap = false;
            /**
             * WrapMode copied from baseTexture
             * @member {number}
             */
            this.wrapMode = 33071;
            /**
             * Type copied from baseTexture
             * @member {number}
             */
            this.type = 6408;
            /**
             * Type copied from baseTexture
             * @member {number}
             */
            this.internalFormat = 5121;
        }
        return GLTexture;
    }());

    /**
     * System plugin to the renderer to manage textures.
     *
     * @class
     * @extends PIXI.System
     * @memberof PIXI.systems
     */
    var TextureSystem = /** @class */ (function (_super) {
        __extends(TextureSystem, _super);
        /**
         * @param {PIXI.Renderer} renderer - The renderer this System works for.
         */
        function TextureSystem(renderer) {
            var _this = _super.call(this, renderer) || this;
            // TODO set to max textures...
            /**
             * Bound textures
             * @member {PIXI.BaseTexture[]}
             * @readonly
             */
            _this.boundTextures = [];
            /**
             * Current location
             * @member {number}
             * @readonly
             */
            _this.currentLocation = -1;
            /**
             * List of managed textures
             * @member {PIXI.BaseTexture[]}
             * @readonly
             */
            _this.managedTextures = [];
            /**
             * Did someone temper with textures state? We'll overwrite them when we need to unbind something.
             * @member {boolean}
             * @private
             */
            _this._unknownBoundTextures = false;
            /**
             * BaseTexture value that shows that we don't know what is bound
             * @member {PIXI.BaseTexture}
             * @readonly
             */
            _this.unknownTexture = new BaseTexture();
            return _this;
        }
        /**
         * Sets up the renderer context and necessary buffers.
         */
        TextureSystem.prototype.contextChange = function () {
            var gl = this.gl = this.renderer.gl;
            this.CONTEXT_UID = this.renderer.CONTEXT_UID;
            this.webGLVersion = this.renderer.context.webGLVersion;
            var maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
            this.boundTextures.length = maxTextures;
            for (var i = 0; i < maxTextures; i++) {
                this.boundTextures[i] = null;
            }
            // TODO move this.. to a nice make empty textures class..
            this.emptyTextures = {};
            var emptyTexture2D = new GLTexture(gl.createTexture());
            gl.bindTexture(gl.TEXTURE_2D, emptyTexture2D.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
            this.emptyTextures[gl.TEXTURE_2D] = emptyTexture2D;
            this.emptyTextures[gl.TEXTURE_CUBE_MAP] = new GLTexture(gl.createTexture());
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.emptyTextures[gl.TEXTURE_CUBE_MAP].texture);
            for (var i = 0; i < 6; i++) {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            }
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            for (var i = 0; i < this.boundTextures.length; i++) {
                this.bind(null, i);
            }
        };
        /**
         * Bind a texture to a specific location
         *
         * If you want to unbind something, please use `unbind(texture)` instead of `bind(null, textureLocation)`
         *
         * @param {PIXI.Texture|PIXI.BaseTexture} texture_ - Texture to bind
         * @param {number} [location=0] - Location to bind at
         */
        TextureSystem.prototype.bind = function (texture, location) {
            if (location === void 0) { location = 0; }
            var gl = this.gl;
            if (texture) {
                texture = texture.castToBaseTexture();
                if (texture.parentTextureArray) {
                    // cannot bind partial texture
                    // TODO: report a warning
                    return;
                }
                if (texture.valid) {
                    texture.touched = this.renderer.textureGC.count;
                    var glTexture = texture._glTextures[this.CONTEXT_UID] || this.initTexture(texture);
                    if (this.boundTextures[location] !== texture) {
                        if (this.currentLocation !== location) {
                            this.currentLocation = location;
                            gl.activeTexture(gl.TEXTURE0 + location);
                        }
                        gl.bindTexture(texture.target, glTexture.texture);
                    }
                    if (glTexture.dirtyId !== texture.dirtyId) {
                        if (this.currentLocation !== location) {
                            this.currentLocation = location;
                            gl.activeTexture(gl.TEXTURE0 + location);
                        }
                        this.updateTexture(texture);
                    }
                    this.boundTextures[location] = texture;
                }
            }
            else {
                if (this.currentLocation !== location) {
                    this.currentLocation = location;
                    gl.activeTexture(gl.TEXTURE0 + location);
                }
                gl.bindTexture(gl.TEXTURE_2D, this.emptyTextures[gl.TEXTURE_2D].texture);
                this.boundTextures[location] = null;
            }
        };
        /**
         * Resets texture location and bound textures
         *
         * Actual `bind(null, i)` calls will be performed at next `unbind()` call
         */
        TextureSystem.prototype.reset = function () {
            this._unknownBoundTextures = true;
            this.currentLocation = -1;
            for (var i = 0; i < this.boundTextures.length; i++) {
                this.boundTextures[i] = this.unknownTexture;
            }
        };
        /**
         * Unbind a texture
         * @param {PIXI.BaseTexture} texture - Texture to bind
         */
        TextureSystem.prototype.unbind = function (texture) {
            var _a = this, gl = _a.gl, boundTextures = _a.boundTextures;
            if (this._unknownBoundTextures) {
                this._unknownBoundTextures = false;
                // someone changed webGL state,
                // we have to be sure that our texture does not appear in multi-texture renderer samplers
                for (var i = 0; i < boundTextures.length; i++) {
                    if (boundTextures[i] === this.unknownTexture) {
                        this.bind(null, i);
                    }
                }
            }
            for (var i = 0; i < boundTextures.length; i++) {
                if (boundTextures[i] === texture) {
                    if (this.currentLocation !== i) {
                        gl.activeTexture(gl.TEXTURE0 + i);
                        this.currentLocation = i;
                    }
                    gl.bindTexture(gl.TEXTURE_2D, this.emptyTextures[texture.target].texture);
                    boundTextures[i] = null;
                }
            }
        };
        /**
         * Initialize a texture
         *
         * @private
         * @param {PIXI.BaseTexture} texture - Texture to initialize
         */
        TextureSystem.prototype.initTexture = function (texture) {
            var glTexture = new GLTexture(this.gl.createTexture());
            // guarantee an update..
            glTexture.dirtyId = -1;
            texture._glTextures[this.CONTEXT_UID] = glTexture;
            this.managedTextures.push(texture);
            texture.on('dispose', this.destroyTexture, this);
            return glTexture;
        };
        TextureSystem.prototype.initTextureType = function (texture, glTexture) {
            glTexture.internalFormat = texture.format;
            glTexture.type = texture.type;
            if (this.webGLVersion !== 2) {
                return;
            }
            var gl = this.renderer.gl;
            if (texture.type === gl.FLOAT
                && texture.format === gl.RGBA) {
                glTexture.internalFormat = gl.RGBA32F;
            }
            // that's WebGL1 HALF_FLOAT_OES
            // we have to convert it to WebGL HALF_FLOAT
            if (texture.type === TYPES.HALF_FLOAT) {
                glTexture.type = gl.HALF_FLOAT;
            }
            if (glTexture.type === gl.HALF_FLOAT
                && texture.format === gl.RGBA) {
                glTexture.internalFormat = gl.RGBA16F;
            }
        };
        /**
         * Update a texture
         *
         * @private
         * @param {PIXI.BaseTexture} texture - Texture to initialize
         */
        TextureSystem.prototype.updateTexture = function (texture) {
            var glTexture = texture._glTextures[this.CONTEXT_UID];
            if (!glTexture) {
                return;
            }
            var renderer = this.renderer;
            this.initTextureType(texture, glTexture);
            if (texture.resource && texture.resource.upload(renderer, texture, glTexture)) ;
            else {
                // default, renderTexture-like logic
                var width = texture.realWidth;
                var height = texture.realHeight;
                var gl = renderer.gl;
                if (glTexture.width !== width
                    || glTexture.height !== height
                    || glTexture.dirtyId < 0) {
                    glTexture.width = width;
                    glTexture.height = height;
                    gl.texImage2D(texture.target, 0, glTexture.internalFormat, width, height, 0, texture.format, glTexture.type, null);
                }
            }
            // lets only update what changes..
            if (texture.dirtyStyleId !== glTexture.dirtyStyleId) {
                this.updateTextureStyle(texture);
            }
            glTexture.dirtyId = texture.dirtyId;
        };
        /**
         * Deletes the texture from WebGL
         *
         * @private
         * @param {PIXI.BaseTexture|PIXI.Texture} texture_ - the texture to destroy
         * @param {boolean} [skipRemove=false] - Whether to skip removing the texture from the TextureManager.
         */
        TextureSystem.prototype.destroyTexture = function (texture, skipRemove) {
            var gl = this.gl;
            texture = texture.castToBaseTexture();
            if (texture._glTextures[this.CONTEXT_UID]) {
                this.unbind(texture);
                gl.deleteTexture(texture._glTextures[this.CONTEXT_UID].texture);
                texture.off('dispose', this.destroyTexture, this);
                delete texture._glTextures[this.CONTEXT_UID];
                if (!skipRemove) {
                    var i = this.managedTextures.indexOf(texture);
                    if (i !== -1) {
                        removeItems(this.managedTextures, i, 1);
                    }
                }
            }
        };
        /**
         * Update texture style such as mipmap flag
         *
         * @private
         * @param {PIXI.BaseTexture} texture - Texture to update
         */
        TextureSystem.prototype.updateTextureStyle = function (texture) {
            var glTexture = texture._glTextures[this.CONTEXT_UID];
            if (!glTexture) {
                return;
            }
            if ((texture.mipmap === MIPMAP_MODES.POW2 || this.webGLVersion !== 2) && !texture.isPowerOfTwo) {
                glTexture.mipmap = false;
            }
            else {
                glTexture.mipmap = texture.mipmap >= 1;
            }
            if (this.webGLVersion !== 2 && !texture.isPowerOfTwo) {
                glTexture.wrapMode = WRAP_MODES.CLAMP;
            }
            else {
                glTexture.wrapMode = texture.wrapMode;
            }
            if (texture.resource && texture.resource.style(this.renderer, texture, glTexture)) ;
            else {
                this.setStyle(texture, glTexture);
            }
            glTexture.dirtyStyleId = texture.dirtyStyleId;
        };
        /**
         * Set style for texture
         *
         * @private
         * @param {PIXI.BaseTexture} texture - Texture to update
         * @param {PIXI.GLTexture} glTexture
         */
        TextureSystem.prototype.setStyle = function (texture, glTexture) {
            var gl = this.gl;
            if (glTexture.mipmap) {
                gl.generateMipmap(texture.target);
            }
            gl.texParameteri(texture.target, gl.TEXTURE_WRAP_S, glTexture.wrapMode);
            gl.texParameteri(texture.target, gl.TEXTURE_WRAP_T, glTexture.wrapMode);
            if (glTexture.mipmap) {
                /* eslint-disable max-len */
                gl.texParameteri(texture.target, gl.TEXTURE_MIN_FILTER, texture.scaleMode === SCALE_MODES.LINEAR ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST);
                /* eslint-disable max-len */
                var anisotropicExt = this.renderer.context.extensions.anisotropicFiltering;
                if (anisotropicExt && texture.anisotropicLevel > 0 && texture.scaleMode === SCALE_MODES.LINEAR) {
                    var level = Math.min(texture.anisotropicLevel, gl.getParameter(anisotropicExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT));
                    gl.texParameterf(texture.target, anisotropicExt.TEXTURE_MAX_ANISOTROPY_EXT, level);
                }
            }
            else {
                gl.texParameteri(texture.target, gl.TEXTURE_MIN_FILTER, texture.scaleMode === SCALE_MODES.LINEAR ? gl.LINEAR : gl.NEAREST);
            }
            gl.texParameteri(texture.target, gl.TEXTURE_MAG_FILTER, texture.scaleMode === SCALE_MODES.LINEAR ? gl.LINEAR : gl.NEAREST);
        };
        return TextureSystem;
    }(System));

    /**
     * Systems are individual components to the Renderer pipeline.
     * @namespace PIXI.systems
     */

    var systems = ({
        FilterSystem: FilterSystem,
        BatchSystem: BatchSystem,
        ContextSystem: ContextSystem,
        FramebufferSystem: FramebufferSystem,
        GeometrySystem: GeometrySystem,
        MaskSystem: MaskSystem,
        ScissorSystem: ScissorSystem,
        StencilSystem: StencilSystem,
        ProjectionSystem: ProjectionSystem,
        RenderTextureSystem: RenderTextureSystem,
        ShaderSystem: ShaderSystem,
        StateSystem: StateSystem,
        TextureGCSystem: TextureGCSystem,
        TextureSystem: TextureSystem
    });

    var tempMatrix = new Matrix();
    /**
     * The AbstractRenderer is the base for a PixiJS Renderer. It is extended by the {@link PIXI.CanvasRenderer}
     * and {@link PIXI.Renderer} which can be used for rendering a PixiJS scene.
     *
     * @abstract
     * @class
     * @extends PIXI.utils.EventEmitter
     * @memberof PIXI
     */
    var AbstractRenderer = /** @class */ (function (_super) {
        __extends(AbstractRenderer, _super);
        /**
         * @param {string} system - The name of the system this renderer is for.
         * @param {object} [options] - The optional renderer parameters.
         * @param {number} [options.width=800] - The width of the screen.
         * @param {number} [options.height=600] - The height of the screen.
         * @param {HTMLCanvasElement} [options.view] - The canvas to use as a view, optional.
         * @param {boolean} [options.transparent=false] - If the render view is transparent.
         * @param {boolean} [options.autoDensity=false] - Resizes renderer view in CSS pixels to allow for
         *   resolutions other than 1.
         * @param {boolean} [options.antialias=false] - Sets antialias
         * @param {number} [options.resolution=1] - The resolution / device pixel ratio of the renderer. The
         *  resolution of the renderer retina would be 2.
         * @param {boolean} [options.preserveDrawingBuffer=false] - Enables drawing buffer preservation,
         *  enable this if you need to call toDataUrl on the WebGL context.
         * @param {boolean} [options.clearBeforeRender=true] - This sets if the renderer will clear the canvas or
         *      not before the new render pass.
         * @param {number} [options.backgroundColor=0x000000] - The background color of the rendered area
         *  (shown if not transparent).
         */
        function AbstractRenderer(type, options) {
            if (type === void 0) { type = RENDERER_TYPE.UNKNOWN; }
            var _this = _super.call(this) || this;
            // Add the default render options
            options = Object.assign({}, settings.RENDER_OPTIONS, options);
            // Deprecation notice for renderer roundPixels option
            if (options.roundPixels) {
                settings.ROUND_PIXELS = options.roundPixels;
                deprecation('5.0.0', 'Renderer roundPixels option is deprecated, please use PIXI.settings.ROUND_PIXELS', 2);
            }
            /**
             * The supplied constructor options.
             *
             * @member {Object}
             * @readOnly
             */
            _this.options = options;
            /**
             * The type of the renderer.
             *
             * @member {number}
             * @default PIXI.RENDERER_TYPE.UNKNOWN
             * @see PIXI.RENDERER_TYPE
             */
            _this.type = type;
            /**
             * Measurements of the screen. (0, 0, screenWidth, screenHeight).
             *
             * Its safe to use as filterArea or hitArea for the whole stage.
             *
             * @member {PIXI.Rectangle}
             */
            _this.screen = new Rectangle(0, 0, options.width, options.height);
            /**
             * The canvas element that everything is drawn to.
             *
             * @member {HTMLCanvasElement}
             */
            _this.view = options.view || document.createElement('canvas');
            /**
             * The resolution / device pixel ratio of the renderer.
             *
             * @member {number}
             * @default 1
             */
            _this.resolution = options.resolution || settings.RESOLUTION;
            /**
             * Whether the render view is transparent.
             *
             * @member {boolean}
             */
            _this.transparent = options.transparent;
            /**
             * Whether CSS dimensions of canvas view should be resized to screen dimensions automatically.
             *
             * @member {boolean}
             */
            _this.autoDensity = options.autoDensity || options.autoResize || false;
            // autoResize is deprecated, provides fallback support
            /**
             * The value of the preserveDrawingBuffer flag affects whether or not the contents of
             * the stencil buffer is retained after rendering.
             *
             * @member {boolean}
             */
            _this.preserveDrawingBuffer = options.preserveDrawingBuffer;
            /**
             * This sets if the CanvasRenderer will clear the canvas or not before the new render pass.
             * If the scene is NOT transparent PixiJS will use a canvas sized fillRect operation every
             * frame to set the canvas background color. If the scene is transparent PixiJS will use clearRect
             * to clear the canvas every frame. Disable this by setting this to false. For example, if
             * your game has a canvas filling background image you often don't need this set.
             *
             * @member {boolean}
             * @default
             */
            _this.clearBeforeRender = options.clearBeforeRender;
            /**
             * The background color as a number.
             *
             * @member {number}
             * @protected
             */
            _this._backgroundColor = 0x000000;
            /**
             * The background color as an [R, G, B] array.
             *
             * @member {number[]}
             * @protected
             */
            _this._backgroundColorRgba = [0, 0, 0, 0];
            /**
             * The background color as a string.
             *
             * @member {string}
             * @protected
             */
            _this._backgroundColorString = '#000000';
            _this.backgroundColor = options.backgroundColor || _this._backgroundColor; // run bg color setter
            /**
             * The last root object that the renderer tried to render.
             *
             * @member {PIXI.DisplayObject}
             * @protected
             */
            _this._lastObjectRendered = null;
            /**
             * Collection of plugins.
             * @readonly
             * @member {object}
             */
            _this.plugins = {};
            return _this;
        }
        /**
         * Initialize the plugins.
         *
         * @protected
         * @param {object} staticMap - The dictionary of statically saved plugins.
         */
        AbstractRenderer.prototype.initPlugins = function (staticMap) {
            for (var o in staticMap) {
                this.plugins[o] = new (staticMap[o])(this);
            }
        };
        Object.defineProperty(AbstractRenderer.prototype, "width", {
            /**
             * Same as view.width, actual number of pixels in the canvas by horizontal.
             *
             * @member {number}
             * @readonly
             * @default 800
             */
            get: function () {
                return this.view.width;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AbstractRenderer.prototype, "height", {
            /**
             * Same as view.height, actual number of pixels in the canvas by vertical.
             *
             * @member {number}
             * @readonly
             * @default 600
             */
            get: function () {
                return this.view.height;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Resizes the screen and canvas to the specified width and height.
         * Canvas dimensions are multiplied by resolution.
         *
         * @param {number} screenWidth - The new width of the screen.
         * @param {number} screenHeight - The new height of the screen.
         */
        AbstractRenderer.prototype.resize = function (screenWidth, screenHeight) {
            this.screen.width = screenWidth;
            this.screen.height = screenHeight;
            this.view.width = screenWidth * this.resolution;
            this.view.height = screenHeight * this.resolution;
            if (this.autoDensity) {
                this.view.style.width = screenWidth + "px";
                this.view.style.height = screenHeight + "px";
            }
            /**
             * Fired after view has been resized.
             *
             * @event PIXI.Renderer#resize
             * @param {number} screenWidth - The new width of the screen.
             * @param {number} screenHeight - The new height of the screen.
             */
            this.emit('resize', screenWidth, screenHeight);
        };
        /**
         * Useful function that returns a texture of the display object that can then be used to create sprites
         * This can be quite useful if your displayObject is complicated and needs to be reused multiple times.
         *
         * @param {PIXI.DisplayObject} displayObject - The displayObject the object will be generated from.
         * @param {PIXI.SCALE_MODES} scaleMode - The scale mode of the texture.
         * @param {number} resolution - The resolution / device pixel ratio of the texture being generated.
         * @param {PIXI.Rectangle} [region] - The region of the displayObject, that shall be rendered,
         *        if no region is specified, defaults to the local bounds of the displayObject.
         * @return {PIXI.RenderTexture} A texture of the graphics object.
         */
        AbstractRenderer.prototype.generateTexture = function (displayObject, scaleMode, resolution, region) {
            region = region || displayObject.getLocalBounds(null, true);
            // minimum texture size is 1x1, 0x0 will throw an error
            if (region.width === 0)
                { region.width = 1; }
            if (region.height === 0)
                { region.height = 1; }
            var renderTexture = RenderTexture.create({
                width: region.width | 0,
                height: region.height | 0,
                scaleMode: scaleMode,
                resolution: resolution,
            });
            tempMatrix.tx = -region.x;
            tempMatrix.ty = -region.y;
            this.render(displayObject, renderTexture, false, tempMatrix, !!displayObject.parent);
            return renderTexture;
        };
        /**
         * Removes everything from the renderer and optionally removes the Canvas DOM element.
         *
         * @param {boolean} [removeView=false] - Removes the Canvas element from the DOM.
         */
        AbstractRenderer.prototype.destroy = function (removeView) {
            for (var o in this.plugins) {
                this.plugins[o].destroy();
                this.plugins[o] = null;
            }
            if (removeView && this.view.parentNode) {
                this.view.parentNode.removeChild(this.view);
            }
            var thisAny = this;
            // null-ing all objects, that's a tradition!
            thisAny.plugins = null;
            thisAny.type = RENDERER_TYPE.UNKNOWN;
            thisAny.view = null;
            thisAny.screen = null;
            thisAny._tempDisplayObjectParent = null;
            thisAny.options = null;
            this._backgroundColorRgba = null;
            this._backgroundColorString = null;
            this._lastObjectRendered = null;
        };
        Object.defineProperty(AbstractRenderer.prototype, "backgroundColor", {
            /**
             * The background color to fill if not transparent
             *
             * @member {number}
             */
            get: function () {
                return this._backgroundColor;
            },
            set: function (value) {
                this._backgroundColor = value;
                this._backgroundColorString = hex2string(value);
                hex2rgb(value, this._backgroundColorRgba);
            },
            enumerable: false,
            configurable: true
        });
        return AbstractRenderer;
    }(eventemitter3));

    /**
     * The Renderer draws the scene and all its content onto a WebGL enabled canvas.
     *
     * This renderer should be used for browsers that support WebGL.
     *
     * This renderer works by automatically managing WebGLBatchesm, so no need for Sprite Batches or Sprite Clouds.
     * Don't forget to add the view to your DOM or you will not see anything!
     *
     * @class
     * @memberof PIXI
     * @extends PIXI.AbstractRenderer
     */
    var Renderer = /** @class */ (function (_super) {
        __extends(Renderer, _super);
        /**
         * @param {object} [options] - The optional renderer parameters.
         * @param {number} [options.width=800] - The width of the screen.
         * @param {number} [options.height=600] - The height of the screen.
         * @param {HTMLCanvasElement} [options.view] - The canvas to use as a view, optional.
         * @param {boolean} [options.transparent=false] - If the render view is transparent.
         * @param {boolean} [options.autoDensity=false] - Resizes renderer view in CSS pixels to allow for
         *   resolutions other than 1.
         * @param {boolean} [options.antialias=false] - Sets antialias. If not available natively then FXAA
         *  antialiasing is used.
         * @param {number} [options.resolution=1] - The resolution / device pixel ratio of the renderer.
         *  The resolution of the renderer retina would be 2.
         * @param {boolean} [options.clearBeforeRender=true] - This sets if the renderer will clear
         *  the canvas or not before the new render pass. If you wish to set this to false, you *must* set
         *  preserveDrawingBuffer to `true`.
         * @param {boolean} [options.preserveDrawingBuffer=false] - Enables drawing buffer preservation,
         *  enable this if you need to call toDataUrl on the WebGL context.
         * @param {number} [options.backgroundColor=0x000000] - The background color of the rendered area
         *  (shown if not transparent).
         * @param {string} [options.powerPreference] - Parameter passed to WebGL context, set to "high-performance"
         *  for devices with dual graphics card.
         * @param {object} [options.context] - If WebGL context already exists, all parameters must be taken from it.
         * @public
         */
        function Renderer(options) {
            var _this = _super.call(this, RENDERER_TYPE.WEBGL, options) || this;
            // the options will have been modified here in the super constructor with pixi's default settings..
            options = _this.options;
            /**
             * WebGL context, set by the contextSystem (this.context)
             *
             * @readonly
             * @member {WebGLRenderingContext}
             */
            _this.gl = null;
            _this.CONTEXT_UID = 0;
            // TODO legacy!
            /**
             * Internal signal instances of **runner**, these
             * are assigned to each system created.
             * @see PIXI.Runner
             * @name PIXI.Renderer#runners
             * @private
             * @type {object}
             * @readonly
             * @property {PIXI.Runner} destroy - Destroy runner
             * @property {PIXI.Runner} contextChange - Context change runner
             * @property {PIXI.Runner} reset - Reset runner
             * @property {PIXI.Runner} update - Update runner
             * @property {PIXI.Runner} postrender - Post-render runner
             * @property {PIXI.Runner} prerender - Pre-render runner
             * @property {PIXI.Runner} resize - Resize runner
             */
            _this.runners = {
                destroy: new Runner('destroy'),
                contextChange: new Runner('contextChange'),
                reset: new Runner('reset'),
                update: new Runner('update'),
                postrender: new Runner('postrender'),
                prerender: new Runner('prerender'),
                resize: new Runner('resize'),
            };
            /**
             * Global uniforms
             * @member {PIXI.UniformGroup}
             */
            _this.globalUniforms = new UniformGroup({
                projectionMatrix: new Matrix(),
            }, true);
            /**
             * Mask system instance
             * @member {PIXI.systems.MaskSystem} mask
             * @memberof PIXI.Renderer#
             * @readonly
             */
            _this.addSystem(MaskSystem, 'mask')
                /**
                 * Context system instance
                 * @member {PIXI.systems.ContextSystem} context
                 * @memberof PIXI.Renderer#
                 * @readonly
                 */
                .addSystem(ContextSystem, 'context')
                /**
                 * State system instance
                 * @member {PIXI.systems.StateSystem} state
                 * @memberof PIXI.Renderer#
                 * @readonly
                 */
                .addSystem(StateSystem, 'state')
                /**
                 * Shader system instance
                 * @member {PIXI.systems.ShaderSystem} shader
                 * @memberof PIXI.Renderer#
                 * @readonly
                 */
                .addSystem(ShaderSystem, 'shader')
                /**
                 * Texture system instance
                 * @member {PIXI.systems.TextureSystem} texture
                 * @memberof PIXI.Renderer#
                 * @readonly
                 */
                .addSystem(TextureSystem, 'texture')
                /**
                 * Geometry system instance
                 * @member {PIXI.systems.GeometrySystem} geometry
                 * @memberof PIXI.Renderer#
                 * @readonly
                 */
                .addSystem(GeometrySystem, 'geometry')
                /**
                 * Framebuffer system instance
                 * @member {PIXI.systems.FramebufferSystem} framebuffer
                 * @memberof PIXI.Renderer#
                 * @readonly
                 */
                .addSystem(FramebufferSystem, 'framebuffer')
                /**
                 * Scissor system instance
                 * @member {PIXI.systems.ScissorSystem} scissor
                 * @memberof PIXI.Renderer#
                 * @readonly
                 */
                .addSystem(ScissorSystem, 'scissor')
                /**
                 * Stencil system instance
                 * @member {PIXI.systems.StencilSystem} stencil
                 * @memberof PIXI.Renderer#
                 * @readonly
                 */
                .addSystem(StencilSystem, 'stencil')
                /**
                 * Projection system instance
                 * @member {PIXI.systems.ProjectionSystem} projection
                 * @memberof PIXI.Renderer#
                 * @readonly
                 */
                .addSystem(ProjectionSystem, 'projection')
                /**
                 * Texture garbage collector system instance
                 * @member {PIXI.systems.TextureGCSystem} textureGC
                 * @memberof PIXI.Renderer#
                 * @readonly
                 */
                .addSystem(TextureGCSystem, 'textureGC')
                /**
                 * Filter system instance
                 * @member {PIXI.systems.FilterSystem} filter
                 * @memberof PIXI.Renderer#
                 * @readonly
                 */
                .addSystem(FilterSystem, 'filter')
                /**
                 * RenderTexture system instance
                 * @member {PIXI.systems.RenderTextureSystem} renderTexture
                 * @memberof PIXI.Renderer#
                 * @readonly
                 */
                .addSystem(RenderTextureSystem, 'renderTexture')
                /**
                 * Batch system instance
                 * @member {PIXI.systems.BatchSystem} batch
                 * @memberof PIXI.Renderer#
                 * @readonly
                 */
                .addSystem(BatchSystem, 'batch');
            _this.initPlugins(Renderer.__plugins);
            /**
             * The options passed in to create a new WebGL context.
             */
            if (options.context) {
                _this.context.initFromContext(options.context);
            }
            else {
                _this.context.initFromOptions({
                    alpha: !!_this.transparent,
                    antialias: options.antialias,
                    premultipliedAlpha: _this.transparent && _this.transparent !== 'notMultiplied',
                    stencil: true,
                    preserveDrawingBuffer: options.preserveDrawingBuffer,
                    powerPreference: _this.options.powerPreference,
                });
            }
            /**
             * Flag if we are rendering to the screen vs renderTexture
             * @member {boolean}
             * @readonly
             * @default true
             */
            _this.renderingToScreen = true;
            sayHello(_this.context.webGLVersion === 2 ? 'WebGL 2' : 'WebGL 1');
            _this.resize(_this.options.width, _this.options.height);
            return _this;
        }
        /**
         * Create renderer if WebGL is available. Overrideable
         * by the **@pixi/canvas-renderer** package to allow fallback.
         * throws error if WebGL is not available.
         * @static
         * @private
         */
        Renderer.create = function (options) {
            if (isWebGLSupported()) {
                return new Renderer(options);
            }
            throw new Error('WebGL unsupported in this browser, use "pixi.js-legacy" for fallback canvas2d support.');
        };
        /**
         * Add a new system to the renderer.
         * @param {Function} ClassRef - Class reference
         * @param {string} [name] - Property name for system, if not specified
         *        will use a static `name` property on the class itself. This
         *        name will be assigned as s property on the Renderer so make
         *        sure it doesn't collide with properties on Renderer.
         * @return {PIXI.Renderer} Return instance of renderer
         */
        Renderer.prototype.addSystem = function (ClassRef, name) {
            if (!name) {
                name = ClassRef.name;
            }
            var system = new ClassRef(this);
            if (this[name]) {
                throw new Error("Whoops! The name \"" + name + "\" is already in use");
            }
            this[name] = system;
            for (var i in this.runners) {
                this.runners[i].add(system);
            }
            /**
             * Fired after rendering finishes.
             *
             * @event PIXI.Renderer#postrender
             */
            /**
             * Fired before rendering starts.
             *
             * @event PIXI.Renderer#prerender
             */
            /**
             * Fired when the WebGL context is set.
             *
             * @event PIXI.Renderer#context
             * @param {WebGLRenderingContext} gl - WebGL context.
             */
            return this;
        };
        /**
         * Renders the object to its WebGL view
         *
         * @param {PIXI.DisplayObject} displayObject - The object to be rendered.
         * @param {PIXI.RenderTexture} [renderTexture] - The render texture to render to.
         * @param {boolean} [clear=true] - Should the canvas be cleared before the new render.
         * @param {PIXI.Matrix} [transform] - A transform to apply to the render texture before rendering.
         * @param {boolean} [skipUpdateTransform=false] - Should we skip the update transform pass?
         */
        Renderer.prototype.render = function (displayObject, renderTexture, clear, transform, skipUpdateTransform) {
            // can be handy to know!
            this.renderingToScreen = !renderTexture;
            this.runners.prerender.emit();
            this.emit('prerender');
            // apply a transform at a GPU level
            this.projection.transform = transform;
            // no point rendering if our context has been blown up!
            if (this.context.isLost) {
                return;
            }
            if (!renderTexture) {
                this._lastObjectRendered = displayObject;
            }
            if (!skipUpdateTransform) {
                // update the scene graph
                var cacheParent = displayObject.enableTempParent();
                displayObject.updateTransform();
                displayObject.disableTempParent(cacheParent);
                // displayObject.hitArea = //TODO add a temp hit area
            }
            this.renderTexture.bind(renderTexture);
            this.batch.currentRenderer.start();
            if (clear !== undefined ? clear : this.clearBeforeRender) {
                this.renderTexture.clear();
            }
            displayObject.render(this);
            // apply transform..
            this.batch.currentRenderer.flush();
            if (renderTexture) {
                renderTexture.baseTexture.update();
            }
            this.runners.postrender.emit();
            // reset transform after render
            this.projection.transform = null;
            this.emit('postrender');
        };
        /**
         * Resizes the WebGL view to the specified width and height.
         *
         * @param {number} screenWidth - The new width of the screen.
         * @param {number} screenHeight - The new height of the screen.
         */
        Renderer.prototype.resize = function (screenWidth, screenHeight) {
            _super.prototype.resize.call(this, screenWidth, screenHeight);
            this.runners.resize.emit(screenWidth, screenHeight);
        };
        /**
         * Resets the WebGL state so you can render things however you fancy!
         *
         * @return {PIXI.Renderer} Returns itself.
         */
        Renderer.prototype.reset = function () {
            this.runners.reset.emit();
            return this;
        };
        /**
         * Clear the frame buffer
         */
        Renderer.prototype.clear = function () {
            this.renderTexture.bind();
            this.renderTexture.clear();
        };
        /**
         * Removes everything from the renderer (event listeners, spritebatch, etc...)
         *
         * @param {boolean} [removeView=false] - Removes the Canvas element from the DOM.
         *  See: https://github.com/pixijs/pixi.js/issues/2233
         */
        Renderer.prototype.destroy = function (removeView) {
            this.runners.destroy.emit();
            for (var r in this.runners) {
                this.runners[r].destroy();
            }
            // call base destroy
            _super.prototype.destroy.call(this, removeView);
            // TODO nullify all the managers..
            this.gl = null;
        };
        /**
         * Adds a plugin to the renderer.
         *
         * @method
         * @param {string} pluginName - The name of the plugin.
         * @param {Function} ctor - The constructor function or class for the plugin.
         */
        Renderer.registerPlugin = function (pluginName, ctor) {
            Renderer.__plugins = Renderer.__plugins || {};
            Renderer.__plugins[pluginName] = ctor;
        };
        return Renderer;
    }(AbstractRenderer));

    /**
     * This helper function will automatically detect which renderer you should be using.
     * WebGL is the preferred renderer as it is a lot faster. If WebGL is not supported by
     * the browser then this function will return a canvas renderer
     *
     * @memberof PIXI
     * @function autoDetectRenderer
     * @param {object} [options] - The optional renderer parameters
     * @param {number} [options.width=800] - the width of the renderers view
     * @param {number} [options.height=600] - the height of the renderers view
     * @param {HTMLCanvasElement} [options.view] - the canvas to use as a view, optional
     * @param {boolean} [options.transparent=false] - If the render view is transparent, default false
     * @param {boolean} [options.autoDensity=false] - Resizes renderer view in CSS pixels to allow for
     *   resolutions other than 1
     * @param {boolean} [options.antialias=false] - sets antialias
     * @param {boolean} [options.preserveDrawingBuffer=false] - enables drawing buffer preservation, enable this if you
     *  need to call toDataUrl on the webgl context
     * @param {number} [options.backgroundColor=0x000000] - The background color of the rendered area
     *  (shown if not transparent).
     * @param {boolean} [options.clearBeforeRender=true] - This sets if the renderer will clear the canvas or
     *   not before the new render pass.
     * @param {number} [options.resolution=1] - The resolution / device pixel ratio of the renderer, retina would be 2
     * @param {boolean} [options.forceCanvas=false] - prevents selection of WebGL renderer, even if such is present, this
     *   option only is available when using **pixi.js-legacy** or **@pixi/canvas-renderer** modules, otherwise
     *   it is ignored.
     * @param {string} [options.powerPreference] - Parameter passed to webgl context, set to "high-performance"
     *  for devices with dual graphics card **webgl only**
     * @return {PIXI.Renderer|PIXI.CanvasRenderer} Returns WebGL renderer if available, otherwise CanvasRenderer
     */
    function autoDetectRenderer(options) {
        return Renderer.create(options);
    }

    var _default = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

    var defaultFilter = "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n";

    /**
     * Used by the batcher to draw batches.
     * Each one of these contains all information required to draw a bound geometry.
     *
     * @class
     * @memberof PIXI
     */
    var BatchDrawCall = /** @class */ (function () {
        function BatchDrawCall() {
            this.texArray = null;
            this.blend = 0;
            this.type = DRAW_MODES.TRIANGLES;
            this.start = 0;
            this.size = 0;
            /**
             * data for uniforms or custom webgl state
             * @member {object}
             */
            this.data = null;
        }
        return BatchDrawCall;
    }());

    /**
     * Used by the batcher to build texture batches.
     * Holds list of textures and their respective locations.
     *
     * @class
     * @memberof PIXI
     */
    var BatchTextureArray = /** @class */ (function () {
        function BatchTextureArray() {
            /**
             * inside textures array
             * @member {PIXI.BaseTexture[]}
             */
            this.elements = [];
            /**
             * Respective locations for textures
             * @member {number[]}
             */
            this.ids = [];
            /**
             * number of filled elements
             * @member {number}
             */
            this.count = 0;
        }
        BatchTextureArray.prototype.clear = function () {
            for (var i = 0; i < this.count; i++) {
                this.elements[i] = null;
            }
            this.count = 0;
        };
        return BatchTextureArray;
    }());

    /**
     * Flexible wrapper around `ArrayBuffer` that also provides
     * typed array views on demand.
     *
     * @class
     * @memberof PIXI
     */
    var ViewableBuffer = /** @class */ (function () {
        /**
         * @param {number} size - The size of the buffer in bytes.
         */
        function ViewableBuffer(size) {
            /**
             * Underlying `ArrayBuffer` that holds all the data
             * and is of capacity `size`.
             *
             * @member {ArrayBuffer}
             */
            this.rawBinaryData = new ArrayBuffer(size);
            /**
             * View on the raw binary data as a `Uint32Array`.
             *
             * @member {Uint32Array}
             */
            this.uint32View = new Uint32Array(this.rawBinaryData);
            /**
             * View on the raw binary data as a `Float32Array`.
             *
             * @member {Float32Array}
             */
            this.float32View = new Float32Array(this.rawBinaryData);
        }
        Object.defineProperty(ViewableBuffer.prototype, "int8View", {
            /**
             * View on the raw binary data as a `Int8Array`.
             *
             * @member {Int8Array}
             */
            get: function () {
                if (!this._int8View) {
                    this._int8View = new Int8Array(this.rawBinaryData);
                }
                return this._int8View;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ViewableBuffer.prototype, "uint8View", {
            /**
             * View on the raw binary data as a `Uint8Array`.
             *
             * @member {Uint8Array}
             */
            get: function () {
                if (!this._uint8View) {
                    this._uint8View = new Uint8Array(this.rawBinaryData);
                }
                return this._uint8View;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ViewableBuffer.prototype, "int16View", {
            /**
             * View on the raw binary data as a `Int16Array`.
             *
             * @member {Int16Array}
             */
            get: function () {
                if (!this._int16View) {
                    this._int16View = new Int16Array(this.rawBinaryData);
                }
                return this._int16View;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ViewableBuffer.prototype, "uint16View", {
            /**
             * View on the raw binary data as a `Uint16Array`.
             *
             * @member {Uint16Array}
             */
            get: function () {
                if (!this._uint16View) {
                    this._uint16View = new Uint16Array(this.rawBinaryData);
                }
                return this._uint16View;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ViewableBuffer.prototype, "int32View", {
            /**
             * View on the raw binary data as a `Int32Array`.
             *
             * @member {Int32Array}
             */
            get: function () {
                if (!this._int32View) {
                    this._int32View = new Int32Array(this.rawBinaryData);
                }
                return this._int32View;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Returns the view of the given type.
         *
         * @param {string} type - One of `int8`, `uint8`, `int16`,
         *    `uint16`, `int32`, `uint32`, and `float32`.
         * @return {object} typed array of given type
         */
        ViewableBuffer.prototype.view = function (type) {
            return this[type + "View"];
        };
        /**
         * Destroys all buffer references. Do not use after calling
         * this.
         */
        ViewableBuffer.prototype.destroy = function () {
            this.rawBinaryData = null;
            this._int8View = null;
            this._uint8View = null;
            this._int16View = null;
            this._uint16View = null;
            this._int32View = null;
            this.uint32View = null;
            this.float32View = null;
        };
        ViewableBuffer.sizeOf = function (type) {
            switch (type) {
                case 'int8':
                case 'uint8':
                    return 1;
                case 'int16':
                case 'uint16':
                    return 2;
                case 'int32':
                case 'uint32':
                case 'float32':
                    return 4;
                default:
                    throw new Error(type + " isn't a valid view type");
            }
        };
        return ViewableBuffer;
    }());

    /**
     * Renderer dedicated to drawing and batching sprites.
     *
     * This is the default batch renderer. It buffers objects
     * with texture-based geometries and renders them in
     * batches. It uploads multiple textures to the GPU to
     * reduce to the number of draw calls.
     *
     * @class
     * @protected
     * @memberof PIXI
     * @extends PIXI.ObjectRenderer
     */
    var AbstractBatchRenderer = /** @class */ (function (_super) {
        __extends(AbstractBatchRenderer, _super);
        /**
         * This will hook onto the renderer's `contextChange`
         * and `prerender` signals.
         *
         * @param {PIXI.Renderer} renderer - The renderer this works for.
         */
        function AbstractBatchRenderer(renderer) {
            var _this = _super.call(this, renderer) || this;
            /**
             * This is used to generate a shader that can
             * color each vertex based on a `aTextureId`
             * attribute that points to an texture in `uSampler`.
             *
             * This enables the objects with different textures
             * to be drawn in the same draw call.
             *
             * You can customize your shader by creating your
             * custom shader generator.
             *
             * @member {PIXI.BatchShaderGenerator}
             * @protected
             */
            _this.shaderGenerator = null;
            /**
             * The class that represents the geometry of objects
             * that are going to be batched with this.
             *
             * @member {object}
             * @default PIXI.BatchGeometry
             * @protected
             */
            _this.geometryClass = null;
            /**
             * Size of data being buffered per vertex in the
             * attribute buffers (in floats). By default, the
             * batch-renderer plugin uses 6:
             *
             * | aVertexPosition | 2 |
             * |-----------------|---|
             * | aTextureCoords  | 2 |
             * | aColor          | 1 |
             * | aTextureId      | 1 |
             *
             * @member {number}
             * @readonly
             */
            _this.vertexSize = null;
            /**
             * The WebGL state in which this renderer will work.
             *
             * @member {PIXI.State}
             * @readonly
             */
            _this.state = State.for2d();
            /**
             * The number of bufferable objects before a flush
             * occurs automatically.
             *
             * @member {number}
             * @default settings.SPRITE_BATCH_SIZE * 4
             */
            _this.size = settings.SPRITE_BATCH_SIZE * 4;
            /**
             * Total count of all vertices used by the currently
             * buffered objects.
             *
             * @member {number}
             * @private
             */
            _this._vertexCount = 0;
            /**
             * Total count of all indices used by the currently
             * buffered objects.
             *
             * @member {number}
             * @private
             */
            _this._indexCount = 0;
            /**
             * Buffer of objects that are yet to be rendered.
             *
             * @member {PIXI.DisplayObject[]}
             * @private
             */
            _this._bufferedElements = [];
            /**
             * Data for texture batch builder, helps to save a bit of CPU on a pass.
             * @type {PIXI.BaseTexture[]}
             * @private
             */
            _this._bufferedTextures = [];
            /**
             * Number of elements that are buffered and are
             * waiting to be flushed.
             *
             * @member {number}
             * @private
             */
            _this._bufferSize = 0;
            /**
             * This shader is generated by `this.shaderGenerator`.
             *
             * It is generated specifically to handle the required
             * number of textures being batched together.
             *
             * @member {PIXI.Shader}
             * @protected
             */
            _this._shader = null;
            /**
             * Pool of `this.geometryClass` geometry objects
             * that store buffers. They are used to pass data
             * to the shader on each draw call.
             *
             * These are never re-allocated again, unless a
             * context change occurs; however, the pool may
             * be expanded if required.
             *
             * @member {PIXI.Geometry[]}
             * @private
             * @see PIXI.AbstractBatchRenderer.contextChange
             */
            _this._packedGeometries = [];
            /**
             * Size of `this._packedGeometries`. It can be expanded
             * if more than `this._packedGeometryPoolSize` flushes
             * occur in a single frame.
             *
             * @member {number}
             * @private
             */
            _this._packedGeometryPoolSize = 2;
            /**
             * A flush may occur multiple times in a single
             * frame. On iOS devices or when
             * `settings.CAN_UPLOAD_SAME_BUFFER` is false, the
             * batch renderer does not upload data to the same
             * `WebGLBuffer` for performance reasons.
             *
             * This is the index into `packedGeometries` that points to
             * geometry holding the most recent buffers.
             *
             * @member {number}
             * @private
             */
            _this._flushId = 0;
            /**
             * Pool of `ViewableBuffer` objects that are sorted in
             * order of increasing size. The flush method uses
             * the buffer with the least size above the amount
             * it requires. These are used for passing attributes.
             *
             * The first buffer has a size of 8; each subsequent
             * buffer has double capacity of its previous.
             *
             * @member {PIXI.ViewableBuffer[]}
             * @private
             * @see PIXI.AbstractBatchRenderer#getAttributeBuffer
             */
            _this._aBuffers = {};
            /**
             * Pool of `Uint16Array` objects that are sorted in
             * order of increasing size. The flush method uses
             * the buffer with the least size above the amount
             * it requires. These are used for passing indices.
             *
             * The first buffer has a size of 12; each subsequent
             * buffer has double capacity of its previous.
             *
             * @member {Uint16Array[]}
             * @private
             * @see PIXI.AbstractBatchRenderer#getIndexBuffer
             */
            _this._iBuffers = {};
            /**
             * Maximum number of textures that can be uploaded to
             * the GPU under the current context. It is initialized
             * properly in `this.contextChange`.
             *
             * @member {number}
             * @see PIXI.AbstractBatchRenderer#contextChange
             * @readonly
             */
            _this.MAX_TEXTURES = 1;
            _this.renderer.on('prerender', _this.onPrerender, _this);
            renderer.runners.contextChange.add(_this);
            _this._dcIndex = 0;
            _this._aIndex = 0;
            _this._iIndex = 0;
            _this._attributeBuffer = null;
            _this._indexBuffer = null;
            _this._tempBoundTextures = [];
            return _this;
        }
        /**
         * Handles the `contextChange` signal.
         *
         * It calculates `this.MAX_TEXTURES` and allocating the
         * packed-geometry object pool.
         */
        AbstractBatchRenderer.prototype.contextChange = function () {
            var gl = this.renderer.gl;
            if (settings.PREFER_ENV === ENV.WEBGL_LEGACY) {
                this.MAX_TEXTURES = 1;
            }
            else {
                // step 1: first check max textures the GPU can handle.
                this.MAX_TEXTURES = Math.min(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS), settings.SPRITE_MAX_TEXTURES);
                // step 2: check the maximum number of if statements the shader can have too..
                this.MAX_TEXTURES = checkMaxIfStatementsInShader(this.MAX_TEXTURES, gl);
            }
            this._shader = this.shaderGenerator.generateShader(this.MAX_TEXTURES);
            // we use the second shader as the first one depending on your browser
            // may omit aTextureId as it is not used by the shader so is optimized out.
            for (var i = 0; i < this._packedGeometryPoolSize; i++) {
                /* eslint-disable max-len */
                this._packedGeometries[i] = new (this.geometryClass)();
            }
            this.initFlushBuffers();
        };
        /**
         * Makes sure that static and dynamic flush pooled objects have correct dimensions
         */
        AbstractBatchRenderer.prototype.initFlushBuffers = function () {
            var _drawCallPool = AbstractBatchRenderer._drawCallPool, _textureArrayPool = AbstractBatchRenderer._textureArrayPool;
            // max draw calls
            var MAX_SPRITES = this.size / 4;
            // max texture arrays
            var MAX_TA = Math.floor(MAX_SPRITES / this.MAX_TEXTURES) + 1;
            while (_drawCallPool.length < MAX_SPRITES) {
                _drawCallPool.push(new BatchDrawCall());
            }
            while (_textureArrayPool.length < MAX_TA) {
                _textureArrayPool.push(new BatchTextureArray());
            }
            for (var i = 0; i < this.MAX_TEXTURES; i++) {
                this._tempBoundTextures[i] = null;
            }
        };
        /**
         * Handles the `prerender` signal.
         *
         * It ensures that flushes start from the first geometry
         * object again.
         */
        AbstractBatchRenderer.prototype.onPrerender = function () {
            this._flushId = 0;
        };
        /**
         * Buffers the "batchable" object. It need not be rendered
         * immediately.
         *
         * @param {PIXI.DisplayObject} element - the element to render when
         *    using this renderer
         */
        AbstractBatchRenderer.prototype.render = function (element) {
            if (!element._texture.valid) {
                return;
            }
            if (this._vertexCount + (element.vertexData.length / 2) > this.size) {
                this.flush();
            }
            this._vertexCount += element.vertexData.length / 2;
            this._indexCount += element.indices.length;
            this._bufferedTextures[this._bufferSize] = element._texture.baseTexture;
            this._bufferedElements[this._bufferSize++] = element;
        };
        AbstractBatchRenderer.prototype.buildTexturesAndDrawCalls = function () {
            var _a = this, textures = _a._bufferedTextures, MAX_TEXTURES = _a.MAX_TEXTURES;
            var textureArrays = AbstractBatchRenderer._textureArrayPool;
            var batch = this.renderer.batch;
            var boundTextures = this._tempBoundTextures;
            var touch = this.renderer.textureGC.count;
            var TICK = ++BaseTexture._globalBatch;
            var countTexArrays = 0;
            var texArray = textureArrays[0];
            var start = 0;
            batch.copyBoundTextures(boundTextures, MAX_TEXTURES);
            for (var i = 0; i < this._bufferSize; ++i) {
                var tex = textures[i];
                textures[i] = null;
                if (tex._batchEnabled === TICK) {
                    continue;
                }
                if (texArray.count >= MAX_TEXTURES) {
                    batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
                    this.buildDrawCalls(texArray, start, i);
                    start = i;
                    texArray = textureArrays[++countTexArrays];
                    ++TICK;
                }
                tex._batchEnabled = TICK;
                tex.touched = touch;
                texArray.elements[texArray.count++] = tex;
            }
            if (texArray.count > 0) {
                batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
                this.buildDrawCalls(texArray, start, this._bufferSize);
                ++countTexArrays;
                ++TICK;
            }
            // Clean-up
            for (var i = 0; i < boundTextures.length; i++) {
                boundTextures[i] = null;
            }
            BaseTexture._globalBatch = TICK;
        };
        /**
         * Populating drawcalls for rendering
         *
         * @param {PIXI.BatchTextureArray} texArray
         * @param {number} start
         * @param {number} finish
         */
        AbstractBatchRenderer.prototype.buildDrawCalls = function (texArray, start, finish) {
            var _a = this, elements = _a._bufferedElements, _attributeBuffer = _a._attributeBuffer, _indexBuffer = _a._indexBuffer, vertexSize = _a.vertexSize;
            var drawCalls = AbstractBatchRenderer._drawCallPool;
            var dcIndex = this._dcIndex;
            var aIndex = this._aIndex;
            var iIndex = this._iIndex;
            var drawCall = drawCalls[dcIndex];
            drawCall.start = this._iIndex;
            drawCall.texArray = texArray;
            for (var i = start; i < finish; ++i) {
                var sprite = elements[i];
                var tex = sprite._texture.baseTexture;
                var spriteBlendMode = premultiplyBlendMode[tex.alphaMode ? 1 : 0][sprite.blendMode];
                elements[i] = null;
                if (start < i && drawCall.blend !== spriteBlendMode) {
                    drawCall.size = iIndex - drawCall.start;
                    start = i;
                    drawCall = drawCalls[++dcIndex];
                    drawCall.texArray = texArray;
                    drawCall.start = iIndex;
                }
                this.packInterleavedGeometry(sprite, _attributeBuffer, _indexBuffer, aIndex, iIndex);
                aIndex += sprite.vertexData.length / 2 * vertexSize;
                iIndex += sprite.indices.length;
                drawCall.blend = spriteBlendMode;
            }
            if (start < finish) {
                drawCall.size = iIndex - drawCall.start;
                ++dcIndex;
            }
            this._dcIndex = dcIndex;
            this._aIndex = aIndex;
            this._iIndex = iIndex;
        };
        /**
         * Bind textures for current rendering
         *
         * @param {PIXI.BatchTextureArray} texArray
         */
        AbstractBatchRenderer.prototype.bindAndClearTexArray = function (texArray) {
            var textureSystem = this.renderer.texture;
            for (var j = 0; j < texArray.count; j++) {
                textureSystem.bind(texArray.elements[j], texArray.ids[j]);
                texArray.elements[j] = null;
            }
            texArray.count = 0;
        };
        AbstractBatchRenderer.prototype.updateGeometry = function () {
            var _a = this, packedGeometries = _a._packedGeometries, attributeBuffer = _a._attributeBuffer, indexBuffer = _a._indexBuffer;
            if (!settings.CAN_UPLOAD_SAME_BUFFER) { /* Usually on iOS devices, where the browser doesn't
                like uploads to the same buffer in a single frame. */
                if (this._packedGeometryPoolSize <= this._flushId) {
                    this._packedGeometryPoolSize++;
                    packedGeometries[this._flushId] = new (this.geometryClass)();
                }
                packedGeometries[this._flushId]._buffer.update(attributeBuffer.rawBinaryData);
                packedGeometries[this._flushId]._indexBuffer.update(indexBuffer);
                this.renderer.geometry.bind(packedGeometries[this._flushId]);
                this.renderer.geometry.updateBuffers();
                this._flushId++;
            }
            else {
                // lets use the faster option, always use buffer number 0
                packedGeometries[this._flushId]._buffer.update(attributeBuffer.rawBinaryData);
                packedGeometries[this._flushId]._indexBuffer.update(indexBuffer);
                this.renderer.geometry.updateBuffers();
            }
        };
        AbstractBatchRenderer.prototype.drawBatches = function () {
            var dcCount = this._dcIndex;
            var _a = this.renderer, gl = _a.gl, stateSystem = _a.state;
            var drawCalls = AbstractBatchRenderer._drawCallPool;
            var curTexArray = null;
            // Upload textures and do the draw calls
            for (var i = 0; i < dcCount; i++) {
                var _b = drawCalls[i], texArray = _b.texArray, type = _b.type, size = _b.size, start = _b.start, blend = _b.blend;
                if (curTexArray !== texArray) {
                    curTexArray = texArray;
                    this.bindAndClearTexArray(texArray);
                }
                this.state.blendMode = blend;
                stateSystem.set(this.state);
                gl.drawElements(type, size, gl.UNSIGNED_SHORT, start * 2);
            }
        };
        /**
         * Renders the content _now_ and empties the current batch.
         */
        AbstractBatchRenderer.prototype.flush = function () {
            if (this._vertexCount === 0) {
                return;
            }
            this._attributeBuffer = this.getAttributeBuffer(this._vertexCount);
            this._indexBuffer = this.getIndexBuffer(this._indexCount);
            this._aIndex = 0;
            this._iIndex = 0;
            this._dcIndex = 0;
            this.buildTexturesAndDrawCalls();
            this.updateGeometry();
            this.drawBatches();
            // reset elements buffer for the next flush
            this._bufferSize = 0;
            this._vertexCount = 0;
            this._indexCount = 0;
        };
        /**
         * Starts a new sprite batch.
         */
        AbstractBatchRenderer.prototype.start = function () {
            this.renderer.state.set(this.state);
            this.renderer.shader.bind(this._shader);
            if (settings.CAN_UPLOAD_SAME_BUFFER) {
                // bind buffer #0, we don't need others
                this.renderer.geometry.bind(this._packedGeometries[this._flushId]);
            }
        };
        /**
         * Stops and flushes the current batch.
         */
        AbstractBatchRenderer.prototype.stop = function () {
            this.flush();
        };
        /**
         * Destroys this `AbstractBatchRenderer`. It cannot be used again.
         */
        AbstractBatchRenderer.prototype.destroy = function () {
            for (var i = 0; i < this._packedGeometryPoolSize; i++) {
                if (this._packedGeometries[i]) {
                    this._packedGeometries[i].destroy();
                }
            }
            this.renderer.off('prerender', this.onPrerender, this);
            this._aBuffers = null;
            this._iBuffers = null;
            this._packedGeometries = null;
            this._attributeBuffer = null;
            this._indexBuffer = null;
            if (this._shader) {
                this._shader.destroy();
                this._shader = null;
            }
            _super.prototype.destroy.call(this);
        };
        /**
         * Fetches an attribute buffer from `this._aBuffers` that
         * can hold atleast `size` floats.
         *
         * @param {number} size - minimum capacity required
         * @return {ViewableBuffer} - buffer than can hold atleast `size` floats
         * @private
         */
        AbstractBatchRenderer.prototype.getAttributeBuffer = function (size) {
            // 8 vertices is enough for 2 quads
            var roundedP2 = nextPow2(Math.ceil(size / 8));
            var roundedSizeIndex = log2(roundedP2);
            var roundedSize = roundedP2 * 8;
            if (this._aBuffers.length <= roundedSizeIndex) {
                this._iBuffers.length = roundedSizeIndex + 1;
            }
            var buffer = this._aBuffers[roundedSize];
            if (!buffer) {
                this._aBuffers[roundedSize] = buffer = new ViewableBuffer(roundedSize * this.vertexSize * 4);
            }
            return buffer;
        };
        /**
         * Fetches an index buffer from `this._iBuffers` that can
         * have at least `size` capacity.
         *
         * @param {number} size - minimum required capacity
         * @return {Uint16Array} - buffer that can fit `size`
         *    indices.
         * @private
         */
        AbstractBatchRenderer.prototype.getIndexBuffer = function (size) {
            // 12 indices is enough for 2 quads
            var roundedP2 = nextPow2(Math.ceil(size / 12));
            var roundedSizeIndex = log2(roundedP2);
            var roundedSize = roundedP2 * 12;
            if (this._iBuffers.length <= roundedSizeIndex) {
                this._iBuffers.length = roundedSizeIndex + 1;
            }
            var buffer = this._iBuffers[roundedSizeIndex];
            if (!buffer) {
                this._iBuffers[roundedSizeIndex] = buffer = new Uint16Array(roundedSize);
            }
            return buffer;
        };
        /**
         * Takes the four batching parameters of `element`, interleaves
         * and pushes them into the batching attribute/index buffers given.
         *
         * It uses these properties: `vertexData` `uvs`, `textureId` and
         * `indicies`. It also uses the "tint" of the base-texture, if
         * present.
         *
         * @param {PIXI.Sprite} element - element being rendered
         * @param {PIXI.ViewableBuffer} attributeBuffer - attribute buffer.
         * @param {Uint16Array} indexBuffer - index buffer
         * @param {number} aIndex - number of floats already in the attribute buffer
         * @param {number} iIndex - number of indices already in `indexBuffer`
         */
        AbstractBatchRenderer.prototype.packInterleavedGeometry = function (element, attributeBuffer, indexBuffer, aIndex, iIndex) {
            var uint32View = attributeBuffer.uint32View, float32View = attributeBuffer.float32View;
            var packedVertices = aIndex / this.vertexSize;
            var uvs = element.uvs;
            var indicies = element.indices;
            var vertexData = element.vertexData;
            var textureId = element._texture.baseTexture._batchLocation;
            var alpha = Math.min(element.worldAlpha, 1.0);
            var argb = (alpha < 1.0
                && element._texture.baseTexture.alphaMode)
                ? premultiplyTint(element._tintRGB, alpha)
                : element._tintRGB + (alpha * 255 << 24);
            // lets not worry about tint! for now..
            for (var i = 0; i < vertexData.length; i += 2) {
                float32View[aIndex++] = vertexData[i];
                float32View[aIndex++] = vertexData[i + 1];
                float32View[aIndex++] = uvs[i];
                float32View[aIndex++] = uvs[i + 1];
                uint32View[aIndex++] = argb;
                float32View[aIndex++] = textureId;
            }
            for (var i = 0; i < indicies.length; i++) {
                indexBuffer[iIndex++] = packedVertices + indicies[i];
            }
        };
        /**
         * Pool of `BatchDrawCall` objects that `flush` used
         * to create "batches" of the objects being rendered.
         *
         * These are never re-allocated again.
         * Shared between all batch renderers because it can be only one "flush" working at the moment.
         *
         * @static
         * @member {PIXI.BatchDrawCall[]}
         */
        AbstractBatchRenderer._drawCallPool = [];
        /**
         * Pool of `BatchDrawCall` objects that `flush` used
         * to create "batches" of the objects being rendered.
         *
         * These are never re-allocated again.
         * Shared between all batch renderers because it can be only one "flush" working at the moment.
         *
         * @static
         * @member {PIXI.BatchTextureArray[]}
         */
        AbstractBatchRenderer._textureArrayPool = [];
        return AbstractBatchRenderer;
    }(ObjectRenderer));

    /**
     * Helper that generates batching multi-texture shader. Use it with your new BatchRenderer
     *
     * @class
     * @memberof PIXI
     */
    var BatchShaderGenerator = /** @class */ (function () {
        /**
         * @param {string} vertexSrc - Vertex shader
         * @param {string} fragTemplate - Fragment shader template
         */
        function BatchShaderGenerator(vertexSrc, fragTemplate) {
            /**
             * Reference to the vertex shader source.
             *
             * @member {string}
             */
            this.vertexSrc = vertexSrc;
            /**
             * Reference to the fragement shader template. Must contain "%count%" and "%forloop%".
             *
             * @member {string}
             */
            this.fragTemplate = fragTemplate;
            this.programCache = {};
            this.defaultGroupCache = {};
            if (fragTemplate.indexOf('%count%') < 0) {
                throw new Error('Fragment template must contain "%count%".');
            }
            if (fragTemplate.indexOf('%forloop%') < 0) {
                throw new Error('Fragment template must contain "%forloop%".');
            }
        }
        BatchShaderGenerator.prototype.generateShader = function (maxTextures) {
            if (!this.programCache[maxTextures]) {
                var sampleValues = new Int32Array(maxTextures);
                for (var i = 0; i < maxTextures; i++) {
                    sampleValues[i] = i;
                }
                this.defaultGroupCache[maxTextures] = UniformGroup.from({ uSamplers: sampleValues }, true);
                var fragmentSrc = this.fragTemplate;
                fragmentSrc = fragmentSrc.replace(/%count%/gi, "" + maxTextures);
                fragmentSrc = fragmentSrc.replace(/%forloop%/gi, this.generateSampleSrc(maxTextures));
                this.programCache[maxTextures] = new Program(this.vertexSrc, fragmentSrc);
            }
            var uniforms = {
                tint: new Float32Array([1, 1, 1, 1]),
                translationMatrix: new Matrix(),
                default: this.defaultGroupCache[maxTextures],
            };
            return new Shader(this.programCache[maxTextures], uniforms);
        };
        BatchShaderGenerator.prototype.generateSampleSrc = function (maxTextures) {
            var src = '';
            src += '\n';
            src += '\n';
            for (var i = 0; i < maxTextures; i++) {
                if (i > 0) {
                    src += '\nelse ';
                }
                if (i < maxTextures - 1) {
                    src += "if(vTextureId < " + i + ".5)";
                }
                src += '\n{';
                src += "\n\tcolor = texture2D(uSamplers[" + i + "], vTextureCoord);";
                src += '\n}';
            }
            src += '\n';
            src += '\n';
            return src;
        };
        return BatchShaderGenerator;
    }());

    /**
     * Geometry used to batch standard PIXI content (e.g. Mesh, Sprite, Graphics objects).
     *
     * @class
     * @memberof PIXI
     */
    var BatchGeometry = /** @class */ (function (_super) {
        __extends(BatchGeometry, _super);
        /**
         * @param {boolean} [_static=false] - Optimization flag, where `false`
         *        is updated every frame, `true` doesn't change frame-to-frame.
         */
        function BatchGeometry(_static) {
            if (_static === void 0) { _static = false; }
            var _this = _super.call(this) || this;
            /**
             * Buffer used for position, color, texture IDs
             *
             * @member {PIXI.Buffer}
             * @protected
             */
            _this._buffer = new Buffer(null, _static, false);
            /**
             * Index buffer data
             *
             * @member {PIXI.Buffer}
             * @protected
             */
            _this._indexBuffer = new Buffer(null, _static, true);
            _this.addAttribute('aVertexPosition', _this._buffer, 2, false, TYPES.FLOAT)
                .addAttribute('aTextureCoord', _this._buffer, 2, false, TYPES.FLOAT)
                .addAttribute('aColor', _this._buffer, 4, true, TYPES.UNSIGNED_BYTE)
                .addAttribute('aTextureId', _this._buffer, 1, true, TYPES.FLOAT)
                .addIndex(_this._indexBuffer);
            return _this;
        }
        return BatchGeometry;
    }(Geometry));

    var defaultVertex$2 = "precision highp float;\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\nattribute float aTextureId;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform vec4 tint;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vTextureId = aTextureId;\n    vColor = aColor * tint;\n}\n";

    var defaultFragment$2 = "varying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\nuniform sampler2D uSamplers[%count%];\n\nvoid main(void){\n    vec4 color;\n    %forloop%\n    gl_FragColor = color * vColor;\n}\n";

    /**
     * @class
     * @memberof PIXI
     * @hideconstructor
     */
    var BatchPluginFactory = /** @class */ (function () {
        function BatchPluginFactory() {
        }
        /**
         * Create a new BatchRenderer plugin for Renderer. this convenience can provide an easy way
         * to extend BatchRenderer with all the necessary pieces.
         * @example
         * const fragment = `
         * varying vec2 vTextureCoord;
         * varying vec4 vColor;
         * varying float vTextureId;
         * uniform sampler2D uSamplers[%count%];
         *
         * void main(void){
         *     vec4 color;
         *     %forloop%
         *     gl_FragColor = vColor * vec4(color.a - color.rgb, color.a);
         * }
         * `;
         * const InvertBatchRenderer = PIXI.BatchPluginFactory.create({ fragment });
         * PIXI.Renderer.registerPlugin('invert', InvertBatchRenderer);
         * const sprite = new PIXI.Sprite();
         * sprite.pluginName = 'invert';
         *
         * @static
         * @param {object} [options]
         * @param {string} [options.vertex=PIXI.BatchPluginFactory.defaultVertexSrc] - Vertex shader source
         * @param {string} [options.fragment=PIXI.BatchPluginFactory.defaultFragmentTemplate] - Fragment shader template
         * @param {number} [options.vertexSize=6] - Vertex size
         * @param {object} [options.geometryClass=PIXI.BatchGeometry]
         * @return {*} New batch renderer plugin
         */
        BatchPluginFactory.create = function (options) {
            var _a = Object.assign({
                vertex: defaultVertex$2,
                fragment: defaultFragment$2,
                geometryClass: BatchGeometry,
                vertexSize: 6,
            }, options), vertex = _a.vertex, fragment = _a.fragment, vertexSize = _a.vertexSize, geometryClass = _a.geometryClass;
            return /** @class */ (function (_super) {
                __extends(BatchPlugin, _super);
                function BatchPlugin(renderer) {
                    var _this = _super.call(this, renderer) || this;
                    _this.shaderGenerator = new BatchShaderGenerator(vertex, fragment);
                    _this.geometryClass = geometryClass;
                    _this.vertexSize = vertexSize;
                    return _this;
                }
                return BatchPlugin;
            }(AbstractBatchRenderer));
        };
        Object.defineProperty(BatchPluginFactory, "defaultVertexSrc", {
            /**
             * The default vertex shader source
             *
             * @static
             * @type {string}
             * @constant
             */
            get: function () {
                return defaultVertex$2;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BatchPluginFactory, "defaultFragmentTemplate", {
            /**
             * The default fragment shader source
             *
             * @static
             * @type {string}
             * @constant
             */
            get: function () {
                return defaultFragment$2;
            },
            enumerable: false,
            configurable: true
        });
        return BatchPluginFactory;
    }());
    // Setup the default BatchRenderer plugin, this is what
    // we'll actually export at the root level
    var BatchRenderer = BatchPluginFactory.create();

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
    class AnchorLayout {
        onAttach(host) {
            this.host = host;
        }
        onDetach() {
            this.host = null;
        }
        onLayout() {
            const parent = this.host;
            const { widgetChildren } = parent;
            const parentWidth = parent.contentWidth;
            const parentHeight = parent.contentHeight;
            for (let i = 0; i < widgetChildren.length; i++) {
                const child = widgetChildren[i];
                const layoutOptions = (child.layoutOptions || {});
                const childWidth = child.getMeasuredWidth();
                const childHeight = child.getMeasuredHeight();
                const anchorLeft = this.calculateAnchor(layoutOptions.anchorLeft || 0, parentWidth, false);
                const anchorTop = this.calculateAnchor(layoutOptions.anchorTop || 0, parentHeight, false);
                const anchorRight = this.calculateAnchor(layoutOptions.anchorRight || 0, parentWidth, true);
                const anchorBottom = this.calculateAnchor(layoutOptions.anchorBottom || 0, parentHeight, true);
                let x = anchorLeft;
                let y = anchorTop;
                switch (layoutOptions.horizontalAlign) {
                    case exports.ALIGN.MIDDLE:
                        x = (anchorRight + anchorLeft - childWidth) / 2;
                        break;
                    case exports.ALIGN.RIGHT:
                        x = anchorRight - childWidth;
                        break;
                }
                switch (layoutOptions.verticalAlign) {
                    case exports.ALIGN.MIDDLE:
                        y = (anchorBottom + anchorTop - childHeight) / 2;
                        break;
                    case exports.ALIGN.BOTTOM:
                        y = anchorBottom - childHeight;
                        break;
                }
                child.layout(x, y, x + childWidth, y + childHeight);
            }
        }
        onMeasure(widthLimit, heightLimit, widthMode, heightMode) {
            const children = this.host.widgetChildren;
            let naturalWidth = 0;
            let naturalHeight = 0;
            const baseWidthMode = widthMode === exports.MeasureMode.EXACTLY ? exports.MeasureMode.AT_MOST : widthMode;
            const baseHeightMode = heightMode === exports.MeasureMode.EXACTLY ? exports.MeasureMode.AT_MOST : heightMode;
            let hasFillers = false;
            // First pass: measure children and find our natural width/height. If we have a upper
            // limit, then pass that on.
            for (let i = 0, j = children.length; i < j; i++) {
                const widget = children[i];
                const lopt = (widget.layoutOptions || LayoutOptions.DEFAULT);
                if (lopt.width === LayoutOptions.FILL_PARENT) {
                    throw new Error('AnchorLayout does not support width = FILL_PARENT. Use anchorLeft = 0 & anchorRight = 0');
                }
                if (lopt.height === LayoutOptions.FILL_PARENT) {
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
                const widgetWidthMode = widthConst ? exports.MeasureMode.EXACTLY : baseWidthMode;
                const widgetHeightMode = heightConst ? exports.MeasureMode.EXACTLY : baseHeightMode;
                // Fillers need to be remeasured using EXACTLY.
                hasFillers = hasFillers || lopt.width === 0 || lopt.height === 0;
                widget.measure(widgetWidthLimit, widgetHeightLimit, widgetWidthMode, widgetHeightMode);
                const horizontalReach = this.calculateReach(lopt.anchorLeft || 0, lopt.anchorRight || 0, widget.getMeasuredWidth());
                const verticalReach = this.calculateReach(lopt.anchorTop || 0, lopt.anchorBottom || 0, widget.getMeasuredHeight());
                naturalWidth = Math.max(naturalWidth, horizontalReach);
                naturalHeight = Math.max(naturalHeight, verticalReach);
            }
            this.measuredWidth = Widget.resolveMeasuredDimen(naturalWidth, widthLimit, widthMode);
            this.measuredHeight = Widget.resolveMeasuredDimen(naturalHeight, heightLimit, heightMode);
            if (!hasFillers) {
                return;
            }
            // Handle fillers.
            for (let i = 0, j = children.length; i < j; i++) {
                const widget = children[i];
                const lopt = (widget.layoutOptions || LayoutOptions.DEFAULT);
                if (lopt.width === 0 || lopt.height === 0) {
                    const anchorLeft = this.calculateAnchor(lopt.anchorLeft || 0, this.measuredWidth, false);
                    const anchorTop = this.calculateAnchor(lopt.anchorTop || 0, this.measuredHeight, false);
                    const anchorRight = this.calculateAnchor(lopt.anchorRight || 0, this.measuredWidth, true);
                    const anchorBottom = this.calculateAnchor(lopt.anchorBottom || 0, this.measuredHeight, true);
                    widget.measure(lopt.isWidthPredefined ? lopt.width : anchorRight - anchorLeft, lopt.isHeightPredefined ? lopt.height : anchorBottom - anchorTop, lopt.width === 0 || lopt.isWidthPredefined ? exports.MeasureMode.EXACTLY : exports.MeasureMode.AT_MOST, lopt.height === 0 || lopt.isHeightPredefined ? exports.MeasureMode.EXACTLY : exports.MeasureMode.AT_MOST);
                }
            }
        }
        getMeasuredWidth() {
            return this.measuredWidth;
        }
        getMeasuredHeight() {
            return this.measuredHeight;
        }
        /**
         * Calculates the actual value of the anchor, given the parent's dimension.
         *
         * @param {number} anchor - anchor as given in layout options
         * @param {number} limit - parent's dimension
         * @param {boolean} limitSubtract - true for right/bottom anchors, false for left/top
         */
        calculateAnchor(anchor, limit, limitSubtract) {
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
        calculateReach(startAnchor, endAnchor, dimen) {
            if (Math.abs(startAnchor) < 1 && Math.abs(endAnchor) < 1) {
                return dimen / (1 - endAnchor - startAnchor);
            }
            else if (Math.abs(startAnchor) < 1) {
                return (endAnchor + dimen) / (1 - startAnchor);
            }
            else if (Math.abs(endAnchor) < 1) {
                return (startAnchor + dimen) / (1 - endAnchor);
            }
            return startAnchor + dimen + endAnchor;
        }
    }

    /**
     * Represents a layout manager that can be attached to any widget group. A layout
     * manager handles the positions and dimensions of child widgets.
     *
     * @memberof PUXI
     * @interface
     */
    /**
     * Attaches the layout manager to a widget. This is automatically done by `WidgetGroup#useLayout`.
     *
     * @memberof PUXI.ILayoutManager#
     * @method onAttach
     * @param {PUXI.WidgetGroup} host
     */
    /**
     * Detaches the layout manager from a widget. This is done by `WidgetGroup#useLayout`. Do
     * not use this on your own.
     *
     * @memberof PUXI.ILayoutManager#
     * @method onDetach
     */
    /**
     * Lays out the children of the layout's host. It assumes that the layout is attached.
     *
     * Contract: Between an `onMeasure` and `onLayout` call, it is expected that the children
     * of the widget-group have _not changed_. This prevents the layout's cache (if any)
     * from becoming invalidated.
     *
     * @memberof PUXI.ILayoutManager#
     * @method onLayout
     */

    const { REGION_LEFT, REGION_TOP, REGION_RIGHT, REGION_BOTTOM, REGION_CENTER, } = BorderLayoutOptions;
    const { FILL_PARENT, } = LayoutOptions;
    const { EXACTLY, AT_MOST, } = exports.MeasureMode;
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
    class BorderLayout {
        constructor() {
            this.leftWidgets = [];
            this.topWidgets = [];
            this.rightWidgets = [];
            this.bottomWidgets = [];
            this.centerWidgets = [];
        }
        onAttach(host) {
            this.host = host;
        }
        onDetach() {
            this.host = null;
            this.clearMeasureCache();
            this.clearRegions();
        }
        onLayout() {
            this.layoutChildren(this.leftWidgets, 0, this.measuredTopHeight, this.measuredLeftWidth, this.measuredCenterHeight);
            this.layoutChildren(this.topWidgets, 0, 0, this.measuredWidth, this.measuredTopHeight);
            this.layoutChildren(this.rightWidgets, this.measuredWidth - this.measuredRightWidth, this.measuredTopHeight, this.measuredRightWidth, this.measuredCenterHeight);
            this.layoutChildren(this.bottomWidgets, 0, this.measuredTopHeight + this.measuredCenterHeight, this.measuredWidth, this.measuredBottomHeight);
            this.layoutChildren(this.centerWidgets, this.measuredLeftWidth, this.measuredTopHeight, this.measuredCenterWidth, this.measuredCenterHeight);
        }
        layoutChildren(widgets, regionX, regionY, regionWidth, regionHeight) {
            var _a, _b;
            for (let i = 0, j = widgets.length; i < j; i++) {
                const widget = widgets[i];
                let x = 0;
                let y = 0;
                switch ((_a = widget.layoutOptions) === null || _a === void 0 ? void 0 : _a.horizontalAlign) {
                    case exports.ALIGN.CENTER:
                        x = (regionWidth - widget.getMeasuredWidth()) / 2;
                        break;
                    case exports.ALIGN.RIGHT:
                        x = regionWidth - widget.getMeasuredWidth();
                        break;
                    default:
                        x = 0;
                        break;
                }
                switch ((_b = widget.layoutOptions) === null || _b === void 0 ? void 0 : _b.verticalAlign) {
                    case exports.ALIGN.CENTER:
                        y = (regionHeight - widget.getMeasuredHeight()) / 2;
                        break;
                    case exports.ALIGN.BOTTOM:
                        y = regionHeight - widget.getMeasuredHeight();
                        break;
                    default:
                        y = 0;
                        break;
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
        onMeasure(maxWidth, maxHeight, widthMode, heightMode) {
            this.indexRegions();
            this.clearMeasureCache();
            // Children can be aligned inside region if smaller
            const childWidthMode = widthMode === exports.MeasureMode.EXACTLY ? exports.MeasureMode.AT_MOST : widthMode;
            const childHeightMode = heightMode === exports.MeasureMode.EXACTLY ? exports.MeasureMode.AT_MOST : widthMode;
            // Measure top, bottom, and center. The max. of each row's width will be our "reference".
            let [tw, th, , thmin] = this.measureChildren(// eslint-disable-line prefer-const
            this.topWidgets, maxWidth, maxHeight, childWidthMode, childHeightMode);
            let [bw, bh, , bhmin] = this.measureChildren(// eslint-disable-line prefer-const
            this.bottomWidgets, maxWidth, maxHeight, childWidthMode, childHeightMode);
            let [cw, ch, cwmin, chmin] = this.measureChildren(// eslint-disable-line prefer-const
            this.centerWidgets, maxWidth, maxHeight, childWidthMode, heightMode);
            // Measure left & right regions. Their heights will equal center's height.
            let [lw, , lwmin] = this.measureChildren(// eslint-disable-line prefer-const
            this.leftWidgets, maxWidth, ch, childWidthMode, exports.MeasureMode.AT_MOST);
            let [rw, , rwmin] = this.measureChildren(// eslint-disable-line prefer-const
            this.rightWidgets, maxWidth, ch, childWidthMode, exports.MeasureMode.AT_MOST);
            // Check if total width/height is greater than our limit. If so, then downscale
            // each row's height or each column's (in middle row) width.
            const middleRowWidth = lw + rw + cw;
            const netWidth = Math.max(tw, bw, middleRowWidth);
            const netHeight = th + bh + ch;
            // Resolve our limits.
            if (widthMode === exports.MeasureMode.EXACTLY) {
                this.measuredWidth = maxWidth;
            }
            else if (widthMode === exports.MeasureMode.AT_MOST) {
                this.measuredWidth = Math.min(netWidth, maxWidth);
            }
            else {
                this.measuredWidth = netWidth;
            }
            if (heightMode === exports.MeasureMode.EXACTLY) {
                this.measuredHeight = maxHeight;
            }
            else if (heightMode === exports.MeasureMode.AT_MOST) {
                this.measuredHeight = Math.min(netHeight, maxHeight);
            }
            else {
                this.measuredHeight = netHeight;
            }
            tw = this.measuredWidth;
            bw = this.measuredWidth;
            if (netHeight > this.measuredHeight) {
                const hmin = (thmin + chmin + bhmin);
                // Redistribute heights minus min-heights.
                if (hmin < this.measuredHeight) {
                    const downscale = (this.measuredHeight - hmin) / (netHeight - hmin);
                    th = thmin + ((th - thmin) * downscale);
                    bh = bhmin + ((bh - bhmin) * downscale);
                    ch = chmin + ((ch - chmin) * downscale);
                }
                // Redistribute full heights.
                else {
                    const downscale = this.measuredHeight / netHeight;
                    th *= downscale;
                    bh *= downscale;
                    ch *= downscale;
                }
            }
            if (netWidth > this.measuredWidth) {
                const wmin = lwmin + cwmin + rwmin;
                // Redistribute widths minus min. widths
                if (wmin < this.measuredWidth) {
                    const downscale = (this.measuredWidth - wmin) / (netWidth - wmin);
                    lw = lwmin + ((lw - lwmin) * downscale);
                    cw = cwmin + ((cw - cwmin) * downscale);
                    rw = rwmin + ((rw - rwmin) * downscale);
                }
                // Redistribute full widths
                else {
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
        measureChildren(list, maxWidth, maxHeight, widthMode, heightMode) {
            let width = 0;
            let height = 0;
            let widthFixedLowerBound = 0;
            let heightFixedLowerBound = 0;
            for (let i = 0, j = list.length; i < j; i++) {
                const widget = list[i];
                const lopt = widget.layoutOptions || LayoutOptions.DEFAULT;
                let w = maxWidth;
                let h = maxHeight;
                let wmd = widthMode;
                let hmd = heightMode;
                if (lopt.width <= LayoutOptions.MAX_DIMEN) {
                    w = lopt.width;
                    wmd = EXACTLY;
                    widthFixedLowerBound = Math.max(widthFixedLowerBound, w);
                }
                if (lopt.height <= LayoutOptions.MAX_DIMEN) {
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
        fitChildren(list, measuredRegionWidth, measuredRegionHeight) {
            var _a, _b, _c, _d;
            for (let i = 0, j = list.length; i < j; i++) {
                const widget = list[i];
                if (widget.getMeasuredWidth() <= measuredRegionWidth
                    && widget.getMeasuredHeight() <= measuredRegionHeight
                    && widget.getMeasuredWidth() > 0
                    && widget.getMeasuredHeight() > 0
                    && ((_a = widget.layoutOptions) === null || _a === void 0 ? void 0 : _a.width) !== FILL_PARENT
                    && ((_b = widget.layoutOptions) === null || _b === void 0 ? void 0 : _b.height) !== FILL_PARENT) {
                    continue;
                }
                if (measuredRegionWidth > 0 && measuredRegionHeight > 0) {
                    const wm = ((_c = widget.layoutOptions) === null || _c === void 0 ? void 0 : _c.width) === FILL_PARENT ? EXACTLY : AT_MOST;
                    const hm = ((_d = widget.layoutOptions) === null || _d === void 0 ? void 0 : _d.height) === FILL_PARENT ? EXACTLY : AT_MOST;
                    widget.measure(measuredRegionWidth, measuredRegionHeight, wm, hm);
                }
            }
        }
        /**
         * Indexes the list of left, top, right, bottom, and center widget lists.
         */
        indexRegions() {
            this.clearRegions();
            const { widgetChildren: children } = this.host;
            for (let i = 0, j = children.length; i < j; i++) {
                const widget = children[i];
                const lopt = (widget.layoutOptions || LayoutOptions.DEFAULT);
                const region = lopt.region || REGION_CENTER;
                switch (region) {
                    case REGION_LEFT:
                        this.leftWidgets.push(widget);
                        break;
                    case REGION_TOP:
                        this.topWidgets.push(widget);
                        break;
                    case REGION_RIGHT:
                        this.rightWidgets.push(widget);
                        break;
                    case REGION_BOTTOM:
                        this.bottomWidgets.push(widget);
                        break;
                    default: this.centerWidgets.push(widget);
                }
            }
        }
        /**
         * Clears the left, top, right, bottom, and center widget lists.
         */
        clearRegions() {
            this.leftWidgets.length = 0;
            this.topWidgets.length = 0;
            this.rightWidgets.length = 0;
            this.bottomWidgets.length = 0;
        }
        /**
         * Zeros the measured dimensions.
         */
        clearMeasureCache() {
            this.measuredLeftWidth = 0;
            this.measuredRightWidth = 0;
            this.measuredCenterWidth = 0;
            this.measuredTopHeight = 0;
            this.measuredBottomHeight = 0;
            this.measuredCenterHeight = 0;
        }
        getMeasuredWidth() {
            return this.measuredWidth;
        }
        getMeasuredHeight() {
            return this.measuredHeight;
        }
    }

    class LinearLayout {
        constructor(orientation = 'vertical', gravity = 'center') {
            this.orientation = orientation;
            this.gravity = gravity;
        }
        onAttach(host) {
            this.host = host;
        }
        onDetach() {
            this.host = null;
        }
        onLayout() {
            let position = 0;
            const children = this.host.widgetChildren;
            const breadth = this.orientation === 'vertical'
                ? this.measuredWidth
                : this.measuredHeight;
            for (let i = 0, j = children.length; i < j; i++) {
                const widget = children[i];
                // along axis
                const u = this.orientation === 'vertical'
                    ? widget.getMeasuredWidth()
                    : widget.getMeasuredHeight();
                const v = this.orientation === 'vertical'
                    ? widget.getMeasuredHeight()
                    : widget.getMeasuredWidth();
                let p = 0;
                if (u < breadth) {
                    switch (this.gravity) {
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
                if (this.orientation === 'vertical') {
                    widget.layout(p, position, p + u, position + v);
                }
                else {
                    widget.layout(position, p, position + v, p + u);
                }
                position += v;
            }
        }
        onMeasure(widthLimit, heightLimit, widthMode, heightMode) {
            const children = this.host.widgetChildren;
            const baseWidthMode = widthMode === exports.MeasureMode.EXACTLY ? exports.MeasureMode.AT_MOST : widthMode;
            const baseHeightMode = heightMode === exports.MeasureMode.EXACTLY ? exports.MeasureMode.AT_MOST : heightMode;
            let length = 0;
            let breadth = 0;
            for (let i = 0, j = children.length; i < j; i++) {
                const widget = children[i];
                const lopt = (widget.layoutOptions || LayoutOptions.DEFAULT);
                const widgetWidthLimit = lopt.isWidthPredefined ? lopt.width : widthLimit;
                const widgetHeightLimit = lopt.isHeightPredefined ? lopt.height : heightLimit;
                const widgetWidthMode = lopt.isWidthPredefined ? exports.MeasureMode.EXACTLY : baseWidthMode;
                const widgetHeightMode = lopt.isHeightPredefined ? exports.MeasureMode.EXACTLY : baseHeightMode;
                widget.measure(widgetWidthLimit, widgetHeightLimit, widgetWidthMode, widgetHeightMode);
                if (this.orientation === 'vertical') {
                    breadth = Math.max(breadth, widget.getMeasuredWidth());
                    length += widget.getMeasuredHeight();
                }
                else {
                    breadth = Math.max(breadth, widget.getMeasuredHeight());
                    length += widget.getMeasuredWidth();
                }
            }
            if (this.orientation === 'vertical') {
                this.measuredWidth = breadth;
                this.measuredHeight = length;
            }
            else {
                this.measuredWidth = length;
                this.measuredHeight = breadth;
            }
        }
        getMeasuredWidth() {
            return this.measuredWidth;
        }
        getMeasuredHeight() {
            return this.measuredHeight;
        }
    }

    class ImageButton extends Button {
        constructor(options) {
            super(options);
            if (!(options.icon instanceof ImageWidget)) {
                const texture = options.icon instanceof Texture ? options.icon
                    : Texture.from(options.icon);
                options.icon = new ImageWidget(texture);
            }
            this.textWidget.setLayoutOptions(null); // a little redundant maybe?
            this.iconWidget = options.icon;
            this.removeChild(this.textWidget);
            this.addChild(this.iconWidget);
            this.addChild(this.textWidget);
            this.useLayout(new LinearLayout('vertical'));
        }
    }

    /**
     * @memberof PUXI
     * @interface ISliderOptions
     * @property {PIXI.Container}[track]
     * @property {PIXI.Container}[handle]
     */
    /**
     * These options are used to configure a `PUXI.Slider`.
     *
     * @memberof PUXI
     * @interface ISliderOptions
     * @property {PIXI.Container}[track]
     * @property {PIXI.Container}[fill]
     * @property {boolean}[vertical]
     * @property {number}[value]
     * @property {number}[minValue]
     * @property {number}[maxValue]
     * @property {number}[decimals]
     * @property {Function}[onValueChange]
     * @property {Function}[onValueChanging]
     */
    /**
     * A slider is a form of input to set a variable to a value in a continuous
     * range. It cannot have its own children.
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.Widget
     */
    class Slider extends Widget {
        /**
         * @param options {Object} Slider settings
         * @param options.track {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)}  Any type of UIOBject, will be used for the slider track
         * @param options.handle {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as slider handle
         * @param [options.fill=null] {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used for slider fill
         * @param [options.vertical=false] {boolean} Direction of the slider
         * @param [options.value=0] {number} value of the slider
         * @param [options.minValue=0] {number} minimum value
         * @param [options.maxValue=100] {number} max value
         * @param [options.decimals=0] {boolean} the decimal precision (use negative to round tens and hundreds)
         * @param [options.onValueChange=null] {callback} Callback when the value has changed
         * @param [options.onValueChanging=null] {callback} Callback while the value is changing
         */
        constructor(options) {
            super();
            /**
             * The value expressed as a percentage from min. to max. This will always
             * be between 0 and 1.
             *
             * The actual value is: `this.minValue + this.percentValue * (this.maxValue - this.minValue`).
             *
             * @member {number}
             */
            this.percentValue = 0;
            this._disabled = false;
            this.fill = options.fill || null;
            this.percentValue = this._minValue;
            this._minValue = options.minValue || 0;
            this._maxValue = options.maxValue || 100;
            this.decimals = options.decimals || 0;
            this.orientation = options.orientation || Slider.HORIZONTAL;
            this.onValueChange = options.onValueChange || null;
            this.onValueChanging = options.onValueChanging || null;
            this.value = options.value || 50;
            // set options
            this.track = Widget.fromContent(options.track
                || (this.orientation === Slider.HORIZONTAL
                    ? Slider.DEFAULT_HORIZONTAL_TRACK.clone()
                    : Slider.DEFAULT_VERTICAL_TRACK.clone()));
            this.handle = Widget.fromContent(options.handle || Slider.DEFAULT_HANDLE.clone());
            this.addChild(this.track, this.handle); // initialize(), update() usage
            this._localCursor = new PIXI.Point();
            this.handle.contentContainer.buttonMode = true;
        }
        initialize() {
            super.initialize();
            let startValue = 0;
            let trackSize;
            const triggerValueChange = () => {
                this.emit('change', this.value);
                if (this._lastChange != this.value) {
                    this._lastChange = this.value;
                    if (typeof this.onValueChange === 'function') {
                        this.onValueChange(this.value);
                    }
                }
            };
            const triggerValueChanging = () => {
                this.emit('changing', this.value);
                if (this._lastChanging != this.value) {
                    this._lastChanging = this.value;
                    if (typeof this.onValueChanging === 'function') {
                        this.onValueChanging(this.value);
                    }
                }
            };
            const updatePositionToMouse = (mousePosition, soft) => {
                this.percentValue = this.getValueAtPhysicalPosition(mousePosition);
                this.layoutHandle();
                triggerValueChanging();
            };
            // Handles dragging
            const handleDrag = this.handle.eventBroker.dnd;
            handleDrag.onPress = (event) => {
                event.stopPropagation();
            };
            handleDrag.onDragStart = () => {
                startValue = this.percentValue;
                trackSize = this.orientation === Slider.HORIZONTAL
                    ? this.track.width
                    : this.track.height;
            };
            handleDrag.onDragMove = (event, offset) => {
                this.percentValue = Math.max(0, Math.min(1, startValue + ((this.orientation === Slider.HORIZONTAL ? offset.x : offset.y) / trackSize)));
                triggerValueChanging();
                this.layoutHandle();
            };
            handleDrag.onDragEnd = () => {
                triggerValueChange();
                this.layoutHandle();
            };
            // Bar pressing/dragging
            const trackDrag = this.track.eventBroker.dnd;
            trackDrag.onPress = (event, isPressed) => {
                if (isPressed) {
                    updatePositionToMouse(event.data.global, true);
                }
                event.stopPropagation();
            };
            trackDrag.onDragMove = (event) => {
                updatePositionToMouse(event.data.global, false);
            };
            trackDrag.onDragEnd = () => {
                triggerValueChange();
            };
            this.layoutHandle();
        }
        get value() {
            return Helpers.Round(Helpers.Lerp(this._minValue, this._maxValue, this.percentValue), this.decimals);
        }
        set value(val) {
            if (val === this.value) {
                return;
            }
            if (isNaN(val)) {
                throw new Error('Cannot use NaN as a value');
            }
            this.percentValue = (Math.max(this._minValue, Math.min(this._maxValue, val)) - this._minValue) / (this._maxValue - this._minValue);
            if (typeof this.onValueChange === 'function') {
                this.onValueChange(this.value);
            }
            if (typeof this.onValueChanging === 'function') {
                this.onValueChanging(this.value);
            }
            if (this.handle && this.initialized) {
                this.layoutHandle();
            }
        }
        get minValue() {
            return this._minValue;
        }
        set minValue(val) {
            this._minValue = val;
            this.update();
        }
        get maxValue() {
            return this._maxValue;
        }
        set maxValue(val) {
            this._maxValue = val;
            this.update();
        }
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            if (val !== this._disabled) {
                this._disabled = val;
                this.handle.contentContainer.buttonMode = !val;
                this.handle.contentContainer.interactive = !val;
                this.track.contentContainer.interactive = !val;
            }
        }
        /**
         * @protected
         * @returns the amount of the freedom that handle has in physical units, i.e. pixels. This
         *      is the width of the track minus the handle's size.
         */
        getPhysicalRange() {
            return this.orientation === Slider.HORIZONTAL
                ? this.contentWidth - this.handle.getMeasuredWidth()
                : this.contentHeight - this.handle.getMeasuredHeight();
        }
        /**
         * @protected
         * @param {PIXI.Point} cursor
         * @returns the value of the slider if the handle's center were (globally)
         *      positioned at the given point.
         */
        getValueAtPhysicalPosition(cursor) {
            // Transform position
            const localCursor = this.contentContainer.toLocal(cursor, null, this._localCursor, true);
            let offset;
            let range;
            if (this.orientation === Slider.HORIZONTAL) {
                const handleWidth = this.handle.getMeasuredWidth();
                offset = localCursor.x - this.paddingLeft - (handleWidth / 4);
                range = this.contentWidth - handleWidth;
            }
            else {
                const handleHeight = this.handle.getMeasuredHeight();
                offset = localCursor.y - this.paddingTop - (handleHeight / 4);
                range = this.contentHeight - handleHeight;
            }
            return offset / range;
        }
        /**
         * Re-positions the handle. This should be called after `_value` has been changed.
         */
        layoutHandle() {
            const handle = this.handle;
            const handleWidth = handle.getMeasuredWidth();
            const handleHeight = handle.getMeasuredHeight();
            let width = this.width - this.paddingHorizontal;
            let height = this.height - this.paddingVertical;
            let handleX;
            let handleY;
            if (this.orientation === Slider.HORIZONTAL) {
                width -= handleWidth;
                handleY = (height - handleHeight) / 2;
                handleX = (width * this.percentValue);
            }
            else {
                height -= handleHeight;
                handleX = (width - handleWidth) / 2;
                handleY = (height * this.percentValue);
            }
            handle.layout(handleX, handleY, handleX + handleWidth, handleY + handleHeight);
        }
        /**
         * Slider measures itself using the track's natural dimensions in its non-oriented
         * direction. The oriented direction will be the equal the range's size times
         * the track's resolution.
         *
         * @param width
         * @param height
         * @param widthMode
         * @param heightMode
         */
        onMeasure(width, height, widthMode, heightMode) {
            const naturalWidth = ((this.orientation === Slider.HORIZONTAL)
                ? this._maxValue - this._minValue
                : Math.max(this.handle.contentContainer.width, this.track.contentContainer.width))
                + this.paddingHorizontal;
            const naturalHeight = ((this.orientation === Slider.VERTICAL)
                ? this._maxValue - this._minValue
                : Math.max(this.handle.contentContainer.height, this.track.contentContainer.height))
                + this.paddingVertical;
            switch (widthMode) {
                case exports.MeasureMode.EXACTLY:
                    this._measuredWidth = width;
                    break;
                case exports.MeasureMode.UNBOUNDED:
                    this._measuredWidth = naturalWidth;
                    break;
                case exports.MeasureMode.AT_MOST:
                    this._measuredWidth = Math.min(width, naturalWidth);
                    break;
            }
            switch (heightMode) {
                case exports.MeasureMode.EXACTLY:
                    this._measuredHeight = height;
                    break;
                case exports.MeasureMode.UNBOUNDED:
                    this._measuredHeight = naturalHeight;
                    break;
                case exports.MeasureMode.AT_MOST:
                    this._measuredHeight = Math.min(height, naturalHeight);
                    break;
            }
        }
        /**
         * `Slider` lays the track to fill all of its width and height. The handle is aligned
         * in the middle in the non-oriented direction.
         *
         * @param l
         * @param t
         * @param r
         * @param b
         * @param dirty
         * @override
         */
        onLayout(l, t, r, b, dirty) {
            super.onLayout(l, t, r, b, dirty);
            const { handle, track } = this;
            track.layout(0, 0, this.width - this.paddingHorizontal, this.height - this.paddingVertical);
            // Layout doesn't scale the widget
            // TODO: Create a Track widget, this won't work for custom tracks that don't wanna
            // scale (and it looks ugly.)
            track.insetContainer.width = track.width;
            track.insetContainer.height = track.height;
            handle.measure(this.width, this.height, exports.MeasureMode.AT_MOST, exports.MeasureMode.AT_MOST);
            this.layoutHandle();
        }
    }
    /**
     * The default track for horizontally oriented sliders.
     * @static
     */
    Slider.DEFAULT_HORIZONTAL_TRACK = new PIXI.Graphics()
        .beginFill(0xffffff, 1)
        .drawRect(0, 0, 16, 16) // natural width & height = 16
        .endFill()
        .lineStyle(1, 0x000000, 0.7, 1, true) // draw line in middle
        .moveTo(1, 8)
        .lineTo(15, 8);
    /**
     * The default track for vertically oriented sliders.
     * @static
     */
    Slider.DEFAULT_VERTICAL_TRACK = new PIXI.Graphics()
        .beginFill(0xffffff, 1)
        .drawRect(0, 0, 16, 16) // natural width & height = 16
        .endFill()
        .lineStyle(1, 0x000000, 0.7, 1, true) // draw line in middle
        .moveTo(8, 1)
        .lineTo(8, 15);
    /**
     * @static
     */
    Slider.DEFAULT_HANDLE = new PIXI.Graphics()
        .beginFill(0x000000)
        .drawCircle(16, 16, 8)
        .endFill()
        .beginFill(0x000000, 0.5)
        .drawCircle(16, 16, 16)
        .endFill();
    /**
     * Horizontal orientation
     * @static
     */
    Slider.HORIZONTAL = 0xff5;
    /**
     * Vertical orientation
     * @static
     */
    Slider.VERTICAL = 0xffe;

    const _tweenItemCache = [];
    const _callbackItemCache = [];
    const _tweenObjects = {};
    const _activeTweenObjects = {};
    let _currentId = 1;
    class TweenObject {
        constructor(object) {
            this.object = object;
            this.tweens = {};
            this.active = false;
            this.onUpdate = null;
        }
    }
    class CallbackItem {
        constructor() {
            this._ready = false;
            this.obj = null;
            this.parent = null;
            this.key = '';
            this.time = 0;
            this.callback = null;
            this.currentTime = 0;
        }
        remove() {
            this._ready = true;
            delete this.parent.tweens[this.key];
            if (!Object.keys(this.parent.tweens).length) {
                this.parent.active = false;
                this.parent.onUpdate = null;
                delete _activeTweenObjects[this.obj._tweenObjectId];
            }
        }
        set(obj, callback, time) {
            this.obj = obj.object;
            if (!this.obj._currentCallbackID) {
                this.obj._currentCallbackID = 1;
            }
            else {
                this.obj._currentCallbackID++;
            }
            this.time = time;
            this.parent = obj;
            this.callback = callback;
            this._ready = false;
            this.key = `cb_${this.obj._currentCallbackID}`;
            this.currentTime = 0;
            if (!this.parent.active) {
                this.parent.active = true;
                _activeTweenObjects[this.obj._tweenObjectId] = this.parent;
            }
        }
        update(delta) {
            this.currentTime += delta;
            if (this.currentTime >= this.time) {
                this.remove();
                this.callback.call(this.parent);
            }
        }
    }
    class TweenItem {
        constructor() {
            this._ready = false;
            this.parent = null;
            this.obj = null;
            this.key = '';
            this.from = 0;
            this.to = 0;
            this.time = 0;
            this.ease = 0;
            this.currentTime = 0;
            this.t = 0;
            this.isColor = false;
        }
        remove() {
            this._ready = true;
            delete this.parent.tweens[this.key];
            if (!Object.keys(this.parent.tweens).length) {
                this.parent.active = false;
                delete _activeTweenObjects[this.obj._tweenObjectId];
            }
        }
        set(obj, key, from, to, time, ease) {
            this.isColor = isNaN(from) && from[0] === '#' || isNaN(to) && to[0] === '#';
            this.parent = obj;
            this.obj = obj.object;
            this.key = key;
            this.surfix = getSurfix(to);
            if (this.isColor) {
                this.to = Helpers.hexToRgb(to);
                this.from = Helpers.hexToRgb(from);
                this.currentColor = { r: this.from.r, g: this.from.g, b: this.from.b };
            }
            else {
                this.to = getToValue(to);
                this.from = getFromValue(from, to, this.obj, key);
            }
            this.time = time;
            this.currentTime = 0;
            this.ease = ease;
            this._ready = false;
            if (!this.parent.active) {
                this.parent.active = true;
                _activeTweenObjects[this.obj._tweenObjectId] = this.parent;
            }
        }
        update(delta) {
            this.currentTime += delta;
            this.t = Math.min(this.currentTime, this.time) / this.time;
            if (this.ease) {
                this.t = this.ease.getPosition(this.t);
            }
            if (this.isColor) {
                this.currentColor.r = Math.round(Helpers.Lerp(this.from.r, this.to.r, this.t));
                this.currentColor.g = Math.round(Helpers.Lerp(this.from.g, this.to.g, this.t));
                this.currentColor.b = Math.round(Helpers.Lerp(this.from.b, this.to.b, this.t));
                this.obj[this.key] = Helpers.rgbToNumber(this.currentColor.r, this.currentColor.g, this.currentColor.b);
            }
            else {
                const val = Helpers.Lerp(this.from, this.to, this.t);
                this.obj[this.key] = this.surfix ? val + this.surfix : val;
            }
            if (this.currentTime >= this.time) {
                this.remove();
            }
        }
    }
    const widthKeys = ['width', 'minWidth', 'maxWidth', 'anchorLeft', 'anchorRight', 'left', 'right', 'x'];
    const heightKeys = ['height', 'minHeight', 'maxHeight', 'anchorTop', 'anchorBottom', 'top', 'bottom', 'y'];
    function getFromValue(from, to, obj, key) {
        // both number
        if (!isNaN(from) && !isNaN(to)) {
            return from;
        }
        // both percentage
        if (isNaN(from) && isNaN(to) && from.indexOf('%') !== -1 && to.indexOf('%') !== -1) {
            return parseFloat(from.replace('%', ''));
        }
        // convert from to px
        if (isNaN(from) && !isNaN(to) && from.indexOf('%') !== -1) {
            if (widthKeys.indexOf(key) !== -1) {
                return obj.parent._width * (parseFloat(from.replace('%', '')) * 0.01);
            }
            else if (heightKeys.indexOf(key) !== -1) {
                return obj.parent._height * (parseFloat(from.replace('%', '')) * 0.01);
            }
            return 0;
        }
        // convert from to percentage
        if (!isNaN(from) && isNaN(to) && to.indexOf('%') !== -1) {
            if (widthKeys.indexOf(key) !== -1) {
                return from / obj.parent._width * 100;
            }
            else if (heightKeys.indexOf(key) !== -1) {
                return from / obj.parent._height * 100;
            }
            return 0;
        }
        return 0;
    }
    function getSurfix(to) {
        if (isNaN(to) && to.indexOf('%') !== -1) {
            return '%';
        }
    }
    function getToValue(to) {
        if (!isNaN(to)) {
            return to;
        }
        if (isNaN(to) && to.indexOf('%') !== -1) {
            return parseFloat(to.replace('%', ''));
        }
    }
    function getObject(obj) {
        if (!obj._tweenObjectId) {
            obj._tweenObjectId = _currentId;
            _currentId++;
        }
        let object = _tweenObjects[obj._tweenObjectId];
        if (!object) {
            object = _tweenObjects[obj._tweenObjectId] = new TweenObject(obj);
        }
        return object;
    }
    function getTweenItem() {
        for (let i = 0; i < _tweenItemCache.length; i++) {
            if (_tweenItemCache[i]._ready) {
                return _tweenItemCache[i];
            }
        }
        const tween = new TweenItem();
        _tweenItemCache.push(tween);
        return tween;
    }
    function getCallbackItem() {
        for (let i = 0; i < _callbackItemCache.length; i++) {
            if (_callbackItemCache[i]._ready) {
                return _callbackItemCache[i];
            }
        }
        const cb = new CallbackItem();
        _callbackItemCache.push(cb);
        return cb;
    }
    const Tween = {
        to(obj, time, params, ease) {
            const object = getObject(obj);
            let onUpdate = null;
            for (const key in params) {
                if (key === 'onComplete') {
                    const cb = getCallbackItem();
                    cb.set(object, params[key], time);
                    object.tweens[cb.key] = cb;
                    continue;
                }
                if (key === 'onUpdate') {
                    onUpdate = params[key];
                    continue;
                }
                if (time) {
                    const match = params[key] === obj[key];
                    if (typeof obj[key] === 'undefined')
                        continue;
                    if (match) {
                        if (object.tweens[key])
                            object.tweens[key].remove();
                    }
                    else {
                        if (!object.tweens[key]) {
                            object.tweens[key] = getTweenItem();
                        }
                        object.tweens[key].set(object, key, obj[key], params[key], time, ease);
                    }
                }
            }
            if (time) {
                object.onUpdate = onUpdate;
            }
            else
                this.set(obj, params);
        },
        from(obj, time, params, ease) {
            const object = getObject(obj);
            let onUpdate = null;
            for (const key in params) {
                if (key === 'onComplete') {
                    const cb = getCallbackItem();
                    cb.set(object, params[key], time);
                    object.tweens[cb.key] = cb;
                    continue;
                }
                if (key === 'onUpdate') {
                    onUpdate = params[key];
                    continue;
                }
                if (time) {
                    const match = params[key] == obj[key];
                    if (typeof obj[key] === 'undefined')
                        continue;
                    if (match) {
                        if (object.tweens[key])
                            object.tweens[key].remove();
                    }
                    else {
                        if (!object.tweens[key]) {
                            object.tweens[key] = getTweenItem();
                        }
                        object.tweens[key].set(object, key, params[key], obj[key], time, ease);
                    }
                }
            }
            if (time) {
                object.onUpdate = onUpdate;
            }
            else
                this.set(obj, params);
        },
        fromTo(obj, time, paramsFrom, paramsTo, ease) {
            const object = getObject(obj);
            let onUpdate = null;
            for (const key in paramsTo) {
                if (key === 'onComplete') {
                    const cb = getCallbackItem();
                    cb.set(object, paramsTo[key], time);
                    object.tweens[cb.key] = cb;
                    continue;
                }
                if (key === 'onUpdate') {
                    onUpdate = paramsTo[key];
                    continue;
                }
                if (time) {
                    const match = paramsFrom[key] == paramsTo[key];
                    if (typeof obj[key] === 'undefined' || typeof paramsFrom[key] === 'undefined')
                        continue;
                    if (match) {
                        if (object.tweens[key])
                            object.tweens[key].remove();
                        obj[key] = paramsTo[key];
                    }
                    else {
                        if (!object.tweens[key]) {
                            object.tweens[key] = getTweenItem();
                        }
                        object.tweens[key].set(object, key, paramsFrom[key], paramsTo[key], time, ease);
                    }
                }
            }
            if (time) {
                object.onUpdate = onUpdate;
            }
            else
                this.set(obj, paramsTo);
        },
        set(obj, params) {
            const object = getObject(obj);
            for (const key in params) {
                if (typeof obj[key] === 'undefined')
                    continue;
                if (object.tweens[key])
                    object.tweens[key].remove();
                obj[key] = params[key];
            }
        },
        _update(delta) {
            for (const id in _activeTweenObjects) {
                const object = _activeTweenObjects[id];
                for (const key in object.tweens) {
                    object.tweens[key].update(delta);
                }
                if (object.onUpdate) {
                    object.onUpdate.call(object.object, delta);
                }
            }
        },
    };

    /**
     * @memberof PUXI
     * @interface IScrollBarOptions
     * @property {PUXI.Sprite} track
     * @property {PUXI.Sprite} handle
     */
    /**
     * An UI scrollbar to control a ScrollingContainer
     *
     * @class
     * @extends PUXI.Slider
     * @memberof PUXI
     * @param options {Object} ScrollBar settings
     * @param options.track {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)}  Any type of UIOBject, will be used for the scrollbar track
     * @param options.handle {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as scrollbar handle
     * @param options.scrollingContainer {PIXI.UI.ScrollingContainer} The container to control
     * @param [options.vertical=false] {boolean} Direction of the scrollbar
     * @param [options.autohide=false] {boolean} Hides the scrollbar when not needed
     */
    class ScrollBar extends Slider {
        constructor(options) {
            super({
                track: options.track || ScrollBar.DEFAULT_TRACK.clone(),
                handle: options.handle || ScrollBar.DEFAULT_HANDLE.clone(),
                fill: null,
                orientation: options.orientation,
                minValue: 0,
                maxValue: 1,
            });
            this.scrollingContainer = options.scrollingContainer;
            this.autohide = options.autohide;
            this._hidden = false;
        }
        initialize() {
            super.initialize();
            this.decimals = 3; // up decimals to trigger ValueChanging more often
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            this.on('changing', () => {
                this.scrollingContainer.forcePctPosition(this.orientation === Slider.HORIZONTAL ? 'x' : 'y', this.percentValue);
            });
            this.on('change', () => {
                this.scrollingContainer.setScrollPosition();
            });
        }
        toggleHidden(hidden) {
            if (this.autohide) {
                if (hidden && !this._hidden) {
                    Tween.to(this, 0.2, { alpha: 0 });
                    this._hidden = true;
                }
                else if (!hidden && this._hidden) {
                    Tween.to(this, 0.2, { alpha: 1 });
                    this._hidden = false;
                }
            }
        }
    }
    /**
     * @static
     */
    ScrollBar.DEFAULT_TRACK = new PIXI.Graphics()
        .beginFill(0xffffff)
        .drawRect(0, 0, 8, 8)
        .endFill();
    /**
     * @static
     */
    ScrollBar.DEFAULT_HANDLE = new PIXI.Graphics()
        .beginFill(0x000000)
        .drawCircle(8, 8, 4)
        .endFill()
        .beginFill(0x000000, 0.5)
        .drawCircle(8, 8, 8)
        .endFill();

    /**
     * `ScrollWidget` masks its contents to its layout bounds and translates
     * its children when scrolling. It uses the anchor layout.
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.InteractiveGroup
     */
    class ScrollWidget extends InteractiveGroup {
        /**
         * @param {PUXI.IScrollingContainerOptions} options
         * @param [options.scrollX=false] {Boolean} Enable horizontal scrolling
         * @param [options.scrollY=false] {Boolean} Enable vertical scrolling
         * @param [options.dragScrolling=true] {Boolean} Enable mousedrag scrolling
         * @param [options.softness=0.5] {Number} (0-1) softness of scrolling
         * @param [options.width=0] {Number|String} container width
         * @param [options.height=0] {Number} container height
         * @param [options.radius=0] {Number} corner radius of clipping mask
         * @param [options.expandMask=0] {Number} mask expand (px)
         * @param [options.overflowY=0] {Number} how much can be scrolled past content dimensions
         * @param [options.overflowX=0] {Number} how much can be scrolled past content dimensions
         */
        constructor(options = {}) {
            super();
            this.forcePctPosition = (direction, pct) => {
                const bounds = this.getInnerBounds();
                const container = this.innerContainer.insetContainer;
                if (this.scrollX && direction === 'x') {
                    container.position[direction] = -((bounds.width - this.width) * pct);
                }
                if (this.scrollY && direction === 'y') {
                    container.position[direction] = -((bounds.height - this.height) * pct);
                }
                this.scrollPosition[direction] = this.targetPosition[direction] = container.position[direction];
            };
            this.focusPosition = (pos) => {
                const bounds = this.getInnerBounds();
                const container = this.innerContainer.insetContainer;
                let dif;
                if (this.scrollX) {
                    const x = Math.max(0, (Math.min(bounds.width, pos.x)));
                    if (x + container.x > this.width) {
                        dif = x - this.width;
                        container.x = -dif;
                    }
                    else if (x + container.x < 0) {
                        dif = x + container.x;
                        container.x -= dif;
                    }
                }
                if (this.scrollY) {
                    const y = Math.max(0, (Math.min(bounds.height, pos.y)));
                    if (y + container.y > this.height) {
                        dif = y - this.height;
                        container.y = -dif;
                    }
                    else if (y + container.y < 0) {
                        dif = y + container.y;
                        container.y -= dif;
                    }
                }
                this.lastPosition.copyFrom(container.position);
                this.targetPosition.copyFrom(container.position);
                this.scrollPosition.copyFrom(container.position);
                this.updateScrollBars();
            };
            /**
             * @param {PIXI.Point}[velocity]
             */
            this.setScrollPosition = (velocity) => {
                if (velocity) {
                    this.scrollVelocity.copyFrom(velocity);
                }
                const container = this.innerContainer.insetContainer;
                if (!this.animating) {
                    this.animating = true;
                    this.lastPosition.copyFrom(container.position);
                    this.targetPosition.copyFrom(container.position);
                    PIXI.Ticker.shared.add(this.updateScrollPosition);
                }
            };
            /**
             * @param {number} delta
             * @protected
             */
            this.updateScrollPosition = (delta) => {
                this.stop = true;
                if (this.scrollX) {
                    this.updateDirection('x', delta);
                }
                if (this.scrollY) {
                    this.updateDirection('y', delta);
                }
                if (this.stop) {
                    PIXI.Ticker.shared.remove(this.updateScrollPosition);
                    this.animating = false;
                }
                this.updateScrollBars();
            };
            /**
             * @param {'x' | 'y'} direction
             * @param {number} delta
             * @protected
             */
            this.updateDirection = (direction, delta) => {
                const bounds = this.getInnerBounds();
                const { scrollPosition, scrollVelocity, targetPosition, lastPosition, } = this;
                const container = this.innerContainer.insetContainer;
                let min;
                if (direction === 'y') {
                    min = Math.round(Math.min(0, this.height - bounds.height));
                }
                else {
                    min = Math.round(Math.min(0, this.width - bounds.width));
                }
                if (!this.scrolling && Math.round(scrollVelocity[direction]) !== 0) {
                    targetPosition[direction] += scrollVelocity[direction];
                    scrollVelocity[direction] = Helpers.Lerp(scrollVelocity[direction], 0, (5 + 2.5 / Math.max(this.softness, 0.01)) * delta);
                    if (targetPosition[direction] > 0) {
                        targetPosition[direction] = 0;
                    }
                    else if (targetPosition[direction] < min) {
                        targetPosition[direction] = min;
                    }
                }
                if (!this.scrolling
                    && Math.round(scrollVelocity[direction]) === 0
                    && (container[direction] > 0
                        || container[direction] < min)) {
                    const target = this.scrollPosition[direction] > 0 ? 0 : min;
                    scrollPosition[direction] = Helpers.Lerp(scrollPosition[direction], target, (40 - (30 * this.softness)) * delta);
                    this.stop = false;
                }
                else if (this.scrolling || Math.round(scrollVelocity[direction]) !== 0) {
                    if (this.scrolling) {
                        scrollVelocity[direction] = this.scrollPosition[direction] - lastPosition[direction];
                        lastPosition.copyFrom(scrollPosition);
                    }
                    if (targetPosition[direction] > 0) {
                        scrollVelocity[direction] = 0;
                        scrollPosition[direction] = 100 * this.softness * (1 - Math.exp(targetPosition[direction] / -200));
                    }
                    else if (targetPosition[direction] < min) {
                        scrollVelocity[direction] = 0;
                        scrollPosition[direction] = min - (100 * this.softness * (1 - Math.exp((min - targetPosition[direction]) / -200)));
                    }
                    else {
                        scrollPosition[direction] = targetPosition[direction];
                    }
                    this.stop = false;
                }
                container.position[direction] = Math.round(scrollPosition[direction]);
            };
            this.mask = new PIXI.Graphics();
            this.innerContainer = new InteractiveGroup();
            this.innerBounds = new PIXI.Rectangle();
            super.addChild(this.innerContainer);
            this.contentContainer.addChild(this.mask);
            this.contentContainer.mask = this.mask;
            this.scrollX = options.scrollX !== undefined ? options.scrollX : false;
            this.scrollY = options.scrollY !== undefined ? options.scrollY : false;
            this.dragScrolling = options.dragScrolling !== undefined ? options.dragScrolling : true;
            this.softness = options.softness !== undefined ? Math.max(Math.min(options.softness || 0, 1), 0) : 0.5;
            this.radius = options.radius || 0;
            this.expandMask = options.expandMask || 0;
            this.overflowY = options.overflowY || 0;
            this.overflowX = options.overflowX || 0;
            this.scrollVelocity = new PIXI.Point();
            /**
             * Widget's position in a scroll.
             * @member {PIXI.Point}
             * @private
             */
            this.scrollPosition = new PIXI.Point();
            /**
             * Position that the cursor is at, i.e. our scroll "target".
             * @member {PIXI.Point}
             * @private
             */
            this.targetPosition = new PIXI.Point();
            this.lastPosition = new PIXI.Point();
            this.useLayout(new BorderLayout());
            this.animating = false;
            this.scrolling = false;
            this.scrollBars = [];
            if (options.scrollBars && this.scrollX) {
                const horizontalScrollBar = new ScrollBar({
                    orientation: ScrollBar.HORIZONTAL,
                    scrollingContainer: this,
                    minValue: 0,
                    maxValue: 1,
                })
                    .setLayoutOptions(new BorderLayoutOptions({
                    width: LayoutOptions.FILL_PARENT,
                    height: LayoutOptions.WRAP_CONTENT,
                    region: BorderLayoutOptions.REGION_BOTTOM,
                    horizontalAlign: exports.ALIGN.CENTER,
                    verticalAlign: exports.ALIGN.BOTTOM,
                }))
                    .setBackground(0xff)
                    .setBackgroundAlpha(0.8);
                super.addChild(horizontalScrollBar);
                this.scrollBars.push(horizontalScrollBar);
            }
            if (options.scrollBars && this.scrollY) {
                const verticalScrollBar = new ScrollBar({
                    orientation: ScrollBar.VERTICAL,
                    scrollingContainer: this,
                    minValue: 0,
                    maxValue: 1,
                })
                    .setLayoutOptions(new BorderLayoutOptions({
                    width: LayoutOptions.WRAP_CONTENT,
                    height: LayoutOptions.FILL_PARENT,
                    region: BorderLayoutOptions.REGION_RIGHT,
                    horizontalAlign: exports.ALIGN.RIGHT,
                    verticalAlign: exports.ALIGN.CENTER,
                }))
                    .setBackground(0xff)
                    .setBackgroundAlpha(0.8);
                super.addChild(verticalScrollBar);
                this.scrollBars.push(verticalScrollBar);
            }
            this.boundCached = 0;
        }
        /**
         * Updates the mask and scroll position before rendering.
         *
         * @override
         */
        update() {
            super.update();
            if (this.lastWidth !== this.width || this.lastHeight !== this.height) {
                const of = this.expandMask;
                this.mask.clear();
                this.mask.lineStyle(0);
                this.mask.beginFill(0xFFFFFF, 1);
                if (this.radius === 0) {
                    this.mask.drawRect(-of, -of, this.width + of, this.height + of);
                }
                else {
                    this.mask.drawRoundedRect(-of, -of, this.width + of, this.height + of, this.radius);
                }
                this.mask.endFill();
                this.lastWidth = this.width;
                this.lastHeight = this.height;
            }
        }
        /**
         * Adds this scrollbar. It is expected that the given scrollbar has been
         * given proper border-layout options.
         *
         * @todo This only works for TOP, LEFT scrollbars as BOTTOM, RIGHT are occupied.
         * @param {PUXI.ScrollBar} scrollBar
         */
        addScrollBar(scrollBar) {
            super.addChild(scrollBar);
            this.scrollBars.push(scrollBar);
            return this;
        }
        /**
         * @param {PUXI.Widget[]} newChildren
         * @returns {ScrollWidget} this widget
         */
        addChild(...newChildren) {
            for (let i = 0; i < newChildren.length; i++) {
                this.innerContainer.addChild(newChildren[i]);
            }
            this.getInnerBounds(true); // make sure bounds is updated instantly when a child is added
            return this;
        }
        /**
         * Updates the scroll bar values, and should be called when scrolled.
         */
        updateScrollBars() {
            for (let i = 0, j = this.scrollBars.length; i < j; i++) {
                const scrollBar = this.scrollBars[i];
                if (scrollBar.orientation === Slider.HORIZONTAL) {
                    const x = this.getPercentPosition('x');
                    scrollBar.value = x;
                }
                else if (scrollBar.orientation === Slider.VERTICAL) {
                    const y = this.getPercentPosition('y');
                    scrollBar.value = y;
                }
            }
        }
        getInnerBounds(force) {
            // this is a temporary fix, because we cant rely on innercontainer height if the children is positioned > 0 y.
            if (force || performance.now() - this.boundCached > 1000) {
                this.innerContainer.insetContainer.getLocalBounds(this.innerBounds);
                this.innerBounds.height = this.innerBounds.y + this.innerContainer.height || 0;
                this.innerBounds.width = this.innerBounds.x + this.innerContainer.width || 0;
                this.boundCached = performance.now();
            }
            return this.innerBounds;
        }
        /**
         * @override
         */
        initialize() {
            super.initialize();
            if (this.scrollX || this.scrollY) {
                this.initScrolling();
            }
        }
        initScrolling() {
            const container = this.innerContainer.insetContainer;
            const realPosition = new PIXI.Point();
            const { scrollPosition, targetPosition, } = this;
            // Drag scroll
            if (this.dragScrolling) {
                const drag = this.eventBroker.dnd;
                drag.onDragStart = (e) => {
                    if (!this.scrolling) {
                        realPosition.copyFrom(container.position);
                        scrollPosition.copyFrom(container.position);
                        this.scrolling = true;
                        this.setScrollPosition();
                        this.emit('scrollstart', e);
                    }
                };
                drag.onDragMove = (_, offset) => {
                    if (this.scrollX) {
                        targetPosition.x = realPosition.x + offset.x;
                    }
                    if (this.scrollY) {
                        targetPosition.y = realPosition.y + offset.y;
                    }
                    this.setScrollPosition();
                };
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                drag.onDragEnd = (e) => {
                    if (this.scrolling) {
                        this.scrolling = false;
                        this.emit('scrollend', e);
                    }
                };
            }
            // Mouse scroll
            const scrollSpeed = new PIXI.Point();
            const scroll = new ScrollManager(this, true);
            scroll.onMouseScroll = (e, delta) => {
                scrollSpeed.set(-delta.x * 0.2, -delta.y * 0.2);
                this.setScrollPosition(scrollSpeed);
            };
            this.updateScrollBars();
        }
        /**
         * @param {string} direction - `'x'` or `'y'`
         * @returns {number} a value between 0 and 1 indicating how scrolling
         *      has occured in that direction (called percent position).
         */
        getPercentPosition(direction) {
            const bounds = this.getInnerBounds();
            const container = this.innerContainer.insetContainer;
            if (direction === 'x') {
                return container.x / (this.width - bounds.width);
            }
            else if (direction === 'y') {
                return container.y / (this.height - bounds.height);
            }
            return 0;
        }
    }

    /**
     * An UI Container object
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.Widget
     * @param desc {Boolean} Sort the list descending
     * @param tweenTime {Number} if above 0 the sort will be animated
     * @param tweenEase {PIXI.UI.Ease} ease method used for animation
     */
    class SortableList extends InteractiveGroup {
        constructor(desc, tweenTime, tweenEase) {
            super(0, 0);
            this.desc = typeof desc !== 'undefined' ? desc : false;
            this.tweenTime = tweenTime || 0;
            this.tweenEase = tweenEase;
            this.items = [];
        }
        addChild(UIObject, fnValue, fnThenBy) {
            super.addChild(UIObject);
            if (this.items.indexOf(UIObject) === -1) {
                this.items.push(UIObject);
            }
            if (typeof fnValue === 'function') {
                UIObject._sortListValue = fnValue;
            }
            if (typeof fnThenBy === 'function') {
                UIObject._sortListThenByValue = fnThenBy;
            }
            if (!UIObject._sortListRnd) {
                UIObject._sortListRnd = Math.random();
            }
            this.sort();
        }
        removeChild(UIObject) {
            if (arguments.length > 1) {
                for (let i = 0; i < arguments.length; i++) {
                    this.removeChild(arguments[i]);
                }
            }
            else {
                super.removeChild(UIObject);
                const index = this.items.indexOf(UIObject);
                if (index !== -1) {
                    this.items.splice(index, 1);
                }
                this.sort();
            }
        }
        sort(instant = false) {
            clearTimeout(this._sortTimeout);
            if (instant) {
                this._sort();
                return;
            }
            this._sortTimeout = setTimeout(() => { this._sort(); }, 0);
        }
        _sort() {
            const desc = this.desc;
            let y = 0;
            let alt = true;
            this.items.sort(function (a, b) {
                let res = a._sortListValue() < b._sortListValue() ? desc ? 1 : -1
                    : a._sortListValue() > b._sortListValue() ? desc ? -1 : 1 : 0;
                if (res === 0 && a._sortListThenByValue && b._sortListThenByValue) {
                    res = a._sortListThenByValue() < b._sortListThenByValue() ? desc ? 1 : -1
                        : a._sortListThenByValue() > b._sortListThenByValue() ? desc ? -1 : 1 : 0;
                }
                if (res === 0) {
                    res = a._sortListRnd > b._sortListRnd ? 1
                        : a._sortListRnd < b._sortListRnd ? -1 : 0;
                }
                return res;
            });
            for (let i = 0; i < this.items.length; i++) {
                const item = this.items[i];
                alt = !alt;
                if (this.tweenTime > 0) {
                    Tween.fromTo(item, this.tweenTime, { x: item.x, y: item.y }, { x: 0, y }, this.tweenEase);
                }
                else {
                    item.x = 0;
                    item.y = y;
                }
                y += item.height;
                if (typeof item.altering === 'function') {
                    item.altering(alt);
                }
            }
            // force it to update parents when sort animation is done (prevent scrolling container bug)
            if (this.tweenTime > 0) {
                setTimeout(() => {
                    this.updatesettings(false, true);
                }, this.tweenTime * 1000);
            }
        }
    }

    /**
     * A sliced sprite with dynamic width and height.
     *
     * @class
     * @memberof PUXI
     * @param Texture {PIXI.Texture} the texture for this SliceSprite
     * @param BorderWidth {Number} Width of the sprite borders
     * @param horizontalSlice {Boolean} Slice the sprite horizontically
     * @param verticalSlice {Boolean} Slice the sprite vertically
     * @param [tile=false] {Boolean} tile or streach
     */
    class SliceSprite extends Widget {
        constructor(texture, borderWidth, horizontalSlice, verticalSlice, tile) {
            super(texture.width, texture.height);
            this.bw = borderWidth || 5;
            this.vs = typeof verticalSlice !== 'undefined' ? verticalSlice : true;
            this.hs = typeof horizontalSlice !== 'undefined' ? horizontalSlice : true;
            this.t = texture.baseTexture;
            this.f = texture.frame;
            this.tile = tile;
            if (this.hs) {
                this.setting.minWidth = borderWidth * 2;
            }
            if (this.vs) {
                this.setting.minHeight = borderWidth * 2;
            }
            /**
         * Updates the sliced sprites position and size
         *
         * @private
         */
            this.update = function () {
                if (!this.initialized)
                    return;
                if (vs && hs) {
                    str.x = sbr.x = sr.x = this._width - bw;
                    sbl.y = sbr.y = sb.y = this._height - bw;
                    sf.width = st.width = sb.width = this._width - bw * 2;
                    sf.height = sl.height = sr.height = this._height - bw * 2;
                }
                else if (hs) {
                    sr.x = this._width - bw;
                    sl.height = sr.height = sf.height = this._height;
                    sf.width = this._width - bw * 2;
                }
                else { // vs
                    sb.y = this._height - bw;
                    st.width = sb.width = sf.width = this._width;
                    sf.height = this._height - bw * 2;
                }
                if (this.tint !== null) {
                    sf.tint = this.tint;
                    if (vs && hs)
                        stl.tint = str.tint = sbl.tint = sbr.tint = this.tint;
                    if (hs)
                        sl.tint = sr.tint = this.tint;
                    if (vs)
                        st.tint = sb.tint = this.tint;
                }
                if (this.blendMode !== null) {
                    sf.blendMode = this.blendMode;
                    if (vs && hs)
                        stl.blendMode = str.blendMode = sbl.blendMode = sbr.blendMode = this.blendMode;
                    if (hs)
                        sl.blendMode = sr.blendMode = this.blendMode;
                    if (vs)
                        st.blendMode = sb.blendMode = this.blendMode;
                }
            };
        }
        initialize() {
            super.initialize();
            const { f, bw } = this;
            // get frames
            if (this.vs && this.hs) {
                this.ftl = new PIXI.Rectangle(f.x, f.y, bw, bw);
                this.ftr = new PIXI.Rectangle(f.x + f.width - bw, f.y, bw, bw);
                this.fbl = new PIXI.Rectangle(f.x, f.y + f.height - bw, bw, bw);
                this.fbr = new PIXI.Rectangle(f.x + f.width - bw, f.y + f.height - bw, bw, bw);
                this.ft = new PIXI.Rectangle(f.x + bw, f.y, f.width - bw * 2, bw);
                this.fb = new PIXI.Rectangle(f.x + bw, f.y + f.height - bw, f.width - bw * 2, bw);
                this.fl = new PIXI.Rectangle(f.x, f.y + bw, bw, f.height - bw * 2);
                this.fr = new PIXI.Rectangle(f.x + f.width - bw, f.y + bw, bw, f.height - bw * 2);
                this.ff = new PIXI.Rectangle(f.x + bw, f.y + bw, f.width - bw * 2, f.height - bw * 2);
            }
            else if (this.hs) {
                this.fl = new PIXI.Rectangle(this.f.x, f.y, bw, f.height);
                this.fr = new PIXI.Rectangle(f.x + f.width - bw, f.y, bw, f.height);
                this.ff = new PIXI.Rectangle(f.x + bw, f.y, f.width - bw * 2, f.height);
            }
            else { // vs
                this.ft = new PIXI.Rectangle(f.x, f.y, f.width, bw);
                this.fb = new PIXI.Rectangle(f.x, f.y + f.height - bw, f.width, bw);
                this.ff = new PIXI.Rectangle(f.x, f.y + bw, f.width, f.height - bw * 2);
            }
            // TODO: swap frames if rotation
            const { t, ff, fl, fr, ft, fb } = this;
            // make sprites
            this.sf = this.tile
                ? new PIXI.extras.TilingSprite(new PIXI.Texture(t, ff))
                : new PIXI.Sprite(new PIXI.Texture(t, ff));
            this.contentContainer.addChildAt(this.sf, 0);
            if (this.vs && this.hs) {
                this.stl = new PIXI.Sprite(new PIXI.Texture(t, this.ftl));
                this.str = new PIXI.Sprite(new PIXI.Texture(t, this.ftr));
                this.sbl = new PIXI.Sprite(new PIXI.Texture(t, this.fbl));
                this.sbr = new PIXI.Sprite(new PIXI.Texture(t, this.fbr));
                this.contentContainer.addChildAt(this.stl, 0);
                this.contentContainer.addChildAt(this.str, 0);
                this.contentContainer.addChildAt(this.sbl, 0);
                this.contentContainer.addChildAt(this.sbr, 0);
            }
            if (hs) {
                this.sl = this.tile
                    ? new PIXI.extras.TilingSprite(new PIXI.Texture(t, fl))
                    : new PIXI.Sprite(new PIXI.Texture(t, fl));
                this.sr = this.tile
                    ? new PIXI.extras.TilingSprite(new PIXI.Texture(t, fr))
                    : new PIXI.Sprite(new PIXI.Texture(t, fr));
                this.contentContainer.addChildAt(this.sl, 0);
                this.contentContainer.addChildAt(this.sr, 0);
            }
            if (this.vs) {
                this.st = this.tile
                    ? new PIXI.extras.TilingSprite(new PIXI.Texture(t, ft))
                    : new PIXI.Sprite(new PIXI.Texture(t, ft));
                this.sb = this.tile
                    ? new PIXI.extras.TilingSprite(new PIXI.Texture(t, fb))
                    : new PIXI.Sprite(new PIXI.Texture(t, fb));
                this.contentContainer.addChildAt(this.st, 0);
                this.contentContainer.addChildAt(this.sb, 0);
            }
            // set constant position and sizes
            if (this.vs && this.hs) {
                this.st.x = bw;
                this.sb.x = bw;
                this.sl.y = bw;
                this.sr.y = bw;
                this.stl.width = bw;
                this.str.width = bw;
                this.sbl.width = bw;
                this.sbr.width = bw;
                this.stl.height = bw;
                this.str.height = bw;
                this.sbl.height = bw;
                this.sbr.height = bw;
            }
            if (this.hs) {
                this.sf.x = this.sl.width = this.sr.width = bw;
            }
            if (this.vs) {
                this.sf.y = this.st.height = this.sb.height = bw;
            }
        }
        update() {
            // NO updates
        }
    }

    class Controller extends PIXI.utils.EventEmitter {
        constructor(stage) {
            super();
            this.stage = stage;
        }
    }
    /**
     * A controller handles a stage-level state that can be held by wigets. For example,
     * `PUXI.FocusController` handles which widget is focused.
     *
     * @memberof PUXI
     * @class Controller
     */
    /**
     * Enables the widget to enter the controller's state.
     *
     * @memberof PUXI.Controller#
     * @method in
     * @param {PUXI.Widget} widget
     */
    /**
     * Disables the widget from the controller's state.
     *
     * @memberof PUXI.Controller#
     * @method out
     * @param {PUXI.Widget} widget
     */

    /**
     * Check boxes use this controller to deselect other checkboxes in the group when
     * they are selected.
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.Controller
     */
    class CheckBoxGroupController extends Controller {
        constructor(stage) {
            super(stage);
            this.checkGroups = new Map();
        }
        /**
         * @param {PUXI.CheckBox} widget
         * @param {PUXI.CheckGroup} checkGroup
         * @override
         */
        in(widget, checkGroup) {
            if (!checkGroup) {
                throw new Error('Default check groups don\'t exist!');
            }
            const group = this.checkGroups.get(checkGroup) || this.initGroup(checkGroup);
            group.checks.push(widget);
            widget.checkGroup = checkGroup;
        }
        /**
         * @override
         */
        out(widget) {
            const group = this.checkGroups.get(widget.checkGroup);
            const i = group.checks.indexOf(widget);
            if (i > 0) {
                group.checks.splice(i, 1);
            }
            widget.checkGroup = null;
        }
        /**
         * Called when a checkbox is selected. Do not call from outside.
         *
         * @param {CheckBox} widget
         */
        notifyCheck(widget) {
            const group = this.checkGroups.get(widget.checkGroup);
            if (!group) {
                return;
            }
            const { checks } = group;
            for (let i = 0, j = checks.length; i < j; i++) {
                if (checks[i] !== widget) {
                    checks[i].checked = false;
                }
            }
            group.selected = widget;
        }
        /**
         * @param {PUXI.CheckGroup} group
         * @returns {CheckBox} the selected checkbox in the group
         */
        getSelected(group) {
            var _a;
            return (_a = this.checkGroups.get(group)) === null || _a === void 0 ? void 0 : _a.selected;
        }
        /**
         * Ensures that the check group exists in `this.checkGroups`.
         *
         * @param {PUXI.CheckGroup} id
         * @protected
         */
        initGroup(id) {
            const cgroup = {
                checks: [],
                selected: null,
            };
            this.checkGroups.set(id, cgroup);
            return cgroup;
        }
    }

    /**
     * Pressing tab on a focused widget will make the next widget its tab group
     * focused. If no tab group is specified for a focusable widget, then it
     * has the `'default'` tab group.
     *
     * @memberof PUXI
     * @typedef {string} TabGroup
     */
    /**
     * @memberof PUXI
     * @class
     * @extends PUXI.Controller
     */
    class FocusController extends Controller {
        constructor(stage) {
            super(stage);
            /**
             * Map of tab-group names to the widgets in those groups.
             * @member {Map<PUXI.TabGroup, PUXI.FocusableWidget[]>}
             * @protected
             */
            this.tabGroups = new Map();
            /**
             * Whether to enable tab-based focus movement.
             * @member {boolean}
             */
            this.useTab = true;
            /**
             * Whether to enable forward arrow key focus movement.
             * @member {boolean}
             */
            this.useForward = true;
            /**
             * Whether to enable back arrow key focus movement.
             * @member {boolean}
             */
            this.useBack = true;
        }
        /**
         * Adds the (focusable) widget to the tab group so that pressing tab repeatedly
         * will eventually bring it into focus.
         *
         * @param {PUXI.FocusableWidget} widget - the widget to add
         * @param {number}[tabIndex=0] - unique index for the widget in tab group used for ordering
         * @param {PUXI.TabGroup}[tabGroup='default'] - tab group name
         */
        in(widget, tabIndex = 0, tabGroup = 'default') {
            let widgets = this.tabGroups.get(tabGroup);
            if (!widgets) {
                widgets = [];
                this.tabGroups.set(tabGroup, widgets);
            }
            const i = widgets.indexOf(widget);
            // Push widget into tab group list if not present already.
            if (i === -1) {
                widget.tabIndex = tabIndex !== undefined ? tabIndex : -1;
                widget.tabGroup = tabGroup;
                widgets.push(widget);
                widgets.sort((a, b) => a.tabIndex - b.tabIndex);
            }
        }
        /**
         * @param {PUXI.FocusableWidget} widget
         * @override
         */
        out(widget) {
            const widgets = this.tabGroups.get(widget.tabGroup);
            if (!widgets) {
                return;
            }
            const i = widgets.indexOf(widget);
            if (i !== -1) {
                // Widgets should already be sorted & so deleting should not unsort it.
                widgets.splice(i, 1);
            }
        }
        /**
         * Called when a widget comes into focus. Do not call this yourself.
         *
         * @param {FocusableWidget} widget
         */
        notifyFocus(widget) {
            const lastItem = this.currentItem;
            if (lastItem) {
                lastItem.blur();
                this.emit('blur', lastItem);
            }
            this.currentItem = widget;
            this.emit('focus', widget);
            this.emit('focusChanged', widget, lastItem);
        }
        /**
         * Clears the currently focused item without blurring it. It is called
         * when a widget goes out of focus.
         */
        notifyBlur() {
            this.emit('blur', this.currentItem);
            this.emit('focusChanged', null, this.currentItem);
            this.currentItem = null;
        }
        /**
         * Brings the widget into focus.
         *
         * @param {FocusableWidget} item
         */
        focus(item) {
            const lastItem = this.currentItem;
            if (lastItem) {
                lastItem.blur();
                this.emit('blur', lastItem);
            }
            item.focus();
            this.emit('focus', item);
            this.emit('focusChanged', item, lastItem);
        }
        /**
         * Blurs the currently focused widget out of focus.
         */
        blur() {
            if (this.currentItem) {
                this.currentItem.blur();
                this.emit('blur', this.currentItem);
                this.emit('focusChanged', null, this.currentItem);
                this.currentItem = null;
            }
        }
        /**
         * Called when tab is pressed on a focusable widget.
         */
        onTab() {
            const { tabGroups, currentItem } = this;
            if (currentItem) {
                const tabGroup = tabGroups.get(currentItem.tabGroup);
                let i = tabGroup.indexOf(currentItem) + 1;
                if (i >= tabGroup.length) {
                    i = 0;
                }
                this.focus(tabGroup[i]);
            }
        }
        /**
         * Focuses the next item without wrapping, i.e. it does not go to the first
         * item if the current one is the last item. This is called when the user
         * presses the forward arrow key.
         */
        onForward() {
            if (!this.useForward) {
                return;
            }
            const { currentItem, tabGroups } = this;
            if (currentItem) {
                const tabGroup = tabGroups.get(currentItem.tabGroup);
                let i = tabGroup.indexOf(currentItem) + 1;
                if (i >= tabGroup.length) {
                    i = tabGroup.length - 1;
                }
                this.focus(tabGroup[i]);
            }
        }
        /**
         * Focuses the last item without wrapping, i.e. it does not go to the last
         * item if the current item is the first one. This is called when the user
         * presses the back arrow button.
         */
        onBack() {
            const { currentItem, tabGroups } = this;
            if (currentItem) {
                const tabGroup = tabGroups.get(currentItem.tabGroup);
                let i = tabGroup.indexOf(currentItem) - 1;
                if (i < 0)
                    i = 0;
                this.focus(tabGroup[i]);
            }
        }
    }

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
    class Stage extends PIXI.Container {
        /**
         * @param {number} width - width of the stage
         * @param {number} height - height of the stage
         */
        constructor(width, height) {
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
        measureAndLayout() {
            if (this.background) {
                this.background.width = this.width;
                this.background.height = this.height;
            }
            for (let i = 0, j = this.widgetChildren.length; i < j; i++) {
                const widget = this.widgetChildren[i];
                const lopt = (widget.layoutOptions || LayoutOptions.DEFAULT);
                const widthMeasureMode = lopt.width < LayoutOptions.MAX_DIMEN
                    ? exports.MeasureMode.EXACTLY
                    : exports.MeasureMode.AT_MOST;
                const heightMeasureMode = lopt.height < LayoutOptions.MAX_DIMEN
                    ? exports.MeasureMode.EXACTLY
                    : exports.MeasureMode.AT_MOST;
                const loptWidth = (Math.abs(lopt.width) < 1) ? lopt.width * this.width : lopt.width;
                const loptHeight = (Math.abs(lopt.height) < 1) ? lopt.height * this.height : lopt.height;
                widget.measure(widthMeasureMode === exports.MeasureMode.EXACTLY ? loptWidth : this.width, heightMeasureMode === exports.MeasureMode.EXACTLY ? loptHeight : this.height, widthMeasureMode, heightMeasureMode);
                let x = lopt.x ? lopt.x : 0;
                let y = lopt.y ? lopt.y : 0;
                if (Math.abs(x) < 1) {
                    x *= this.width;
                }
                if (Math.abs(y) < 1) {
                    y *= this.height;
                }
                const anchor = lopt.anchor || FastLayoutOptions.DEFAULT_ANCHOR;
                const l = x - (anchor.x * widget.getMeasuredWidth());
                const t = y - (anchor.y * widget.getMeasuredHeight());
                widget.layout(l, t, l + widget.getMeasuredWidth(), t + widget.getMeasuredHeight(), true);
            }
        }
        getBackground() {
            return this.background;
        }
        setBackground(bg) {
            if (this.background) {
                super.removeChild(this.background);
            }
            this.background = bg;
            if (bg) {
                super.addChildAt(bg, 0);
                this.background.width = this.width;
                this.background.height = this.height;
            }
        }
        update(widgets) {
            this.emit('preupdate', this);
            for (let i = 0, j = widgets.length; i < j; i++) {
                const widget = widgets[i];
                widget.stage = this;
                if (!widget.initialized) {
                    widget.initialize();
                }
                this.update(widget.widgetChildren);
                widget.update();
            }
            this.emit('postupdate', this);
        }
        render(renderer) {
            this.update(this.widgetChildren);
            super.render(renderer);
        }
        addChild(UIObject) {
            const argumentLenght = arguments.length;
            if (argumentLenght > 1) {
                for (let i = 0; i < argumentLenght; i++) {
                    this.addChild(arguments[i]);
                }
            }
            else {
                if (UIObject.parent) {
                    UIObject.parent.removeChild(UIObject);
                }
                UIObject.parent = this;
                this.widgetChildren.push(UIObject);
                super.addChild(UIObject.insetContainer);
                // UIObject.updatesettings(true);
            }
            this.measureAndLayout();
        }
        removeChild(UIObject) {
            const argumentLenght = arguments.length;
            if (argumentLenght > 1) {
                for (let i = 0; i < argumentLenght; i++) {
                    this.removeChild(arguments[i]);
                }
            }
            else {
                super.removeChild(UIObject.insetContainer);
                const index = this.widgetChildren.indexOf(UIObject);
                if (index !== -1) {
                    this.children.splice(index, 1);
                    UIObject.parent = null;
                }
            }
            this.measureAndLayout();
        }
        resize(width, height) {
            this.width = width;
            this.height = height;
            if (this.hitArea) {
                this.hitArea.width = this.__width;
                this.hitArea.height = this.__height;
            }
            this.measureAndLayout();
        }
        get width() {
            return this.__width;
        }
        set width(val) {
            if (!isNaN(val)) {
                this.__width = val;
                this.resize();
            }
        }
        get height() {
            return this.__height;
        }
        set height(val) {
            if (!isNaN(val)) {
                this.__height = val;
                this.resize();
            }
        }
        /**
         * The check box group controller for check boxes in this stage.
         *
         * @member {PUXI.CheckBoxGroupController}
         */
        get checkBoxGroupController() {
            return this._checkBoxGroupCtl;
        }
        /**
         * The focus controller for widgets in this stage. You can use this to bring a
         * widget into focus.
         *
         * @member {PUXI.FocusController}
         */
        get focusController() {
            return this._focusCtl;
        }
    }
    /**
     * Use this to override which class is used for the check box group controller. It
     * should extend from `PUXI.CheckBoxGroupController`.
     *
     * @static
     */
    Stage.CHECK_BOX_GROUP_CONTROLLER = CheckBoxGroupController;
    /**
     * Use this to override which class is used for the focus controller. It should
     * extend from `PUXI.FocusController`.
     *
     * @static
     */
    Stage.FOCUS_CONTROLLER = FocusController;

    /**
     * A StyleSheet provides a mechansim to style widgets in a shared fashion.
     */
    class Style extends PIXI.utils.EventEmitter {
        constructor(data = {}) {
            super();
            this.onParentSetProperty = (propertyName, value, style) => {
                const superStyles = this.extends;
                const superIndex = superStyles.indexOf(style);
                if (superIndex === -1) {
                    throw new Error('onParentSetProperty triggered when by a non-super style.');
                }
                const thisValue = this.computedData[propertyName];
                for (let i = superIndex, j = superStyles.length; i < j; i++) {
                    const superStyle = superStyles[i];
                    if (superStyle.computedData[propertyName]) {
                        this.computedData[propertyName] = superStyle.computedData[propertyName];
                    }
                }
                if (this.data[propertyName]) {
                    this.computedData[propertyName] = this.data[propertyName];
                }
                if (thisValue !== this.computedData[propertyName]) {
                    this.emit('setProperty', propertyName, this.computedData[propertyName], this);
                }
            };
            this.dirtyID = 0;
            this.data = data;
            this.extends = [];
            this.computedData = data;
            this.computedDirty = false;
        }
        /**
         * @param prop
         */
        getProperty(prop) {
            if (this.computedDirty) {
                this.compute();
            }
            return this.computedData[prop];
        }
        /**
         * @param props
         * @example
         * style.getProperties('paddingLeft', 'paddingRight')
         */
        getProperties(...props) {
            if (this.computedDirty) {
                this.compute();
            }
            const result = {};
            for (let i = 0, j = props.length; i < j; i++) {
                result[props[i]] = this.computedData[props[i]];
            }
            return result;
        }
        /**
         * @param prop
         * @param value
         */
        setProperty(prop, value) {
            // Ensure computedData is up-to-date to ensure child styles get the correct information.
            if (this.computedDirty) {
                this.compute();
            }
            this.data[prop] = value;
            this.computedData[prop] = value;
            this.emit('setProperty', prop, value, this);
            ++this.dirtyID;
        }
        /**
         * Extend the given style so that properties not set on this style are derived from it. If multiple styles
         * are extended, the ones extended later have a higher priority.
         *
         * @param style
         */
        extend(style) {
            this.extends.push(style);
            this.computedDirty = true;
            ++this.dirtyID;
            // Recompute the set-property for this style
            style.on('setProperty', this.onParentSetProperty);
        }
        /**
         * Recomputes the style data
         */
        compute() {
            const superStyles = this.extends;
            this.computedData = {};
            for (let i = 0, j = superStyles.length; i < j; i++) {
                Object.assign(this.computedData, superStyles[i].computedData);
            }
            this.computedDirty = false;
        }
        /**
         * @param data
         * @example
         * Style.create({
         *     backgroundColor: 0xabcdef,
         *     padding: 8
         * })
         */
        static create(data) {
            return new Style(data);
        }
    }

    class StyleSheet {
        static create(sheetData) {
            const sheet = new StyleSheet();
            for (const key in sheetData) {
                sheet[key] = Style.create(sheetData[key]);
            }
            return sheet;
        }
    }

    // Dummy <input> element created for mobile keyboards
    let mockDOMInput;
    function initMockDOMInput() {
        // create temp input (for mobile keyboard)
        if (typeof mockDOMInput === 'undefined') {
            mockDOMInput = document.createElement('INPUT');
            mockDOMInput.setAttribute('type', 'text');
            mockDOMInput.setAttribute('id', '_pui_tempInput');
            mockDOMInput.setAttribute('style', 'position:fixed; left:-10px; top:-10px; width:0px; height: 0px;');
            document.body.appendChild(mockDOMInput);
        }
    }
    /**
     * An UI text object
     *
     * @class
     * @extends PIXI.UI.InputBase
     * @memberof PIXI.UI
     */
    class TextInput extends FocusableWidget {
        /**
         * @param {PUXI.ITextInputOptions} options
         * @param {string} options.value Text content
         * @param {boolean} [options.multiLine=false] Multiline input
         * @param options.style {PIXI.TextStyle} Style used for the Text
         * @param options.background {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as background for input
         * @param [options.selectedColor='#ffffff'] {String|Array} Fill color of selected text
         * @param [options.selectedBackgroundColor='#318cfa'] {String} BackgroundColor of selected text
         * @param [options.width=150] {Number} width of input
         * @param [options.height=20] {Number} height of input
         * @param [options.padding=3] {Number} input padding
         * @param [options.paddingTop=0] {Number} input padding
         * @param [options.paddingBottom=0] {Number} input padding
         * @param [options.paddingLeft=0] {Number} input padding
         * @param [options.paddingRight=0] {Number} input padding
         * @param [options.tabIndex=0] {Number} input tab index
         * @param [options.tabGroup=0] {Number|String} input tab group
         * @param [options.maxLength=0] {Number} 0 = unlimited
         * @param [options.caretWidth=1] {Number} width of the caret
         * @param [options.lineHeight=0] {Number} 0 = inherit from text
         */
        constructor(options) {
            super(options);
            this.onKeyDown = (e) => {
                if (e.which === this.ctrlKey || e.which === this.cmdKey) {
                    this.ctrlDown = true;
                }
                if (e.which === this.shiftKey) {
                    this.shiftDown = true;
                }
                // FocusableWidget.onKeyDownImpl should've been called before this.
                if (e.defaultPrevented) {
                    return;
                }
                if (e.which === 13) { // enter
                    this.insertTextAtCaret('\n');
                    e.preventDefault();
                    return;
                }
                if (this.ctrlDown) {
                    // Handle Ctrl+<?> commands
                    if (e.which === 65) {
                        // Ctrl+A (Select all)
                        this.select();
                        e.preventDefault();
                        return;
                    }
                    else if (e.which === 90) {
                        // Ctrl+Z (Undo)
                        if (this.value != this._lastValue) {
                            this.valueEvent = this._lastValue;
                        }
                        this.setCaretIndex(this._lastValue.length + 1);
                        e.preventDefault();
                        return;
                    }
                }
                if (e.which === 8) {
                    // Handle backspace
                    if (!this.deleteSelection()) {
                        if (this.caret._index > 0 || (this.chars.length === 1 && this.caret._atEnd)) {
                            if (this.caret._atEnd) {
                                this.valueEvent = this.value.slice(0, this.chars.length - 1);
                                this.setCaretIndex(this.caret._index);
                            }
                            else {
                                this.valueEvent = this.value.slice(0, this.caret._index - 1) + this.value.slice(this.caret._index);
                                this.setCaretIndex(this.caret._index - 1);
                            }
                        }
                    }
                    e.preventDefault();
                    return;
                }
                if (e.which === 46) {
                    // Delete selection
                    if (!this.deleteSelection()) {
                        if (!this.caret._atEnd) {
                            this.valueEvent = this.value.slice(0, this.caret._index) + this.value.slice(this.caret._index + 1);
                            this.setCaretIndex(this.caret._index);
                        }
                    }
                    e.preventDefault();
                    return;
                }
                else if (e.which === 37 || e.which === 39) {
                    this.rdd = e.which === 37;
                    if (this.shiftDown) {
                        if (this.hasSelection) {
                            const caretAtStart = this.selectionStart === this.caret._index;
                            if (caretAtStart) {
                                if (this.selectionStart === this.selectionEnd && this.rdd === this.caret._forward) {
                                    this.setCaretIndex(this.caret._forward ? this.caret._index : this.caret._index + 1);
                                }
                                else {
                                    const startindex = this.rdd ? this.caret._index - 1 : this.caret._index + 1;
                                    this.selectRange(startindex, this.selectionEnd);
                                    this.caret._index = Math.min(this.chars.length - 1, Math.max(0, startindex));
                                }
                            }
                            else {
                                const endIndex = this.rdd ? this.caret._index - 1 : this.caret._index + 1;
                                this.selectRange(this.selectionStart, endIndex);
                                this.caret._index = Math.min(this.chars.length - 1, Math.max(0, endIndex));
                            }
                        }
                        else {
                            const _i = this.caret._atEnd ? this.caret._index + 1 : this.caret._index;
                            const selectIndex = this.rdd ? _i - 1 : _i;
                            this.selectRange(selectIndex, selectIndex);
                            this.caret._index = selectIndex;
                            this.caret._forward = !rdd;
                        }
                    }
                    else {
                        // Navigation
                        // eslint-disable-next-line no-lonely-if
                        if (this.hasSelection) {
                            this.setCaretIndex(this.rdd ? this.selectionStart : this.selectionEnd + 1);
                        }
                        else {
                            this.setCaretIndex(this.caret._index + (this.rdd ? this.caret._atEnd ? 0 : -1 : 1));
                        }
                    }
                    e.preventDefault();
                    return;
                }
                else if (this.multiLine && (e.which === 38 || e.which === 40)) {
                    this.vrdd = e.which === 38;
                    if (this.shiftDown) {
                        if (this.hasSelection) {
                            this.de.y = Math.max(0, Math.min(this.textHeightPX, this.de.y + (this.vrdd ? -this.lineHeight : this.lineHeight)));
                            this.updateClosestIndex(this.de, false);
                            // console.log(si, ei);
                            if (Math.abs(this.si - this.ei) <= 1) {
                                // console.log(si, ei);
                                this.setCaretIndex(this.sie ? this.si + 1 : this.si);
                            }
                            else {
                                this.caret._index = (this.eie ? this.ei + 1 : this.ei) + (this.caret._down ? -1 : 0);
                                this.selectRange(this.caret._down ? this.si : this.si - 1, this.caret._index);
                            }
                        }
                        else {
                            this.si = this.caret._index;
                            this.sie = false;
                            this.de.copyFrom(this.caret);
                            this.de.y = Math.max(0, Math.min(this.textHeightPX, this.de.y + (this.vrdd ? -this.lineHeight : this.lineHeight)));
                            this.updateClosestIndex(this.de, false);
                            this.caret._index = (this.eie ? this.ei + 1 : ei) - (this.vrdd ? 0 : 1);
                            this.selectRange(this.vrdd ? this.si - 1 : this.si, this.caret._index);
                            this.caret._down = !this.vrdd;
                        }
                    }
                    else if (this.hasSelection) {
                        this.setCaretIndex(this.vrdd ? this.selectionStart : this.selectionEnd + 1);
                    }
                    else {
                        this.ds.copyFrom(this.caret);
                        this.ds.y += this.vrdd ? -this.lineHeight : this.lineHeight;
                        this.ds.x += 1;
                        this.updateClosestIndex(this.ds, true);
                        this.setCaretIndex(this.sie ? this.si + 1 : this.si);
                    }
                    e.preventDefault();
                    return;
                }
            };
            this.keyUpEvent = (e) => {
                if (e.which === this.ctrlKey || e.which === this.cmdKey)
                    this.ctrlDown = false;
                if (e.which === this.shiftKey)
                    this.shiftDown = false;
                this.emit('keyup', e);
                if (e.defaultPrevented) {
                    return;
                }
            };
            this.copyEvent = (e) => {
                this.emit('copy', e);
                if (e.defaultPrevented) {
                    return;
                }
                if (this.hasSelection) {
                    const clipboardData = e.clipboardData || window.clipboardData;
                    clipboardData.setData('Text', this.value.slice(this.selectionStart, this.selectionEnd + 1));
                }
                e.preventDefault();
            };
            this.cutEvent = (e) => {
                this.emit('cut', e);
                if (e.defaultPrevented) {
                    return;
                }
                if (this.hasSelection) {
                    this.copyEvent(e);
                    this.deleteSelection();
                }
                e.preventDefault();
            };
            this.pasteEvent = (e) => {
                this.emit('paste', e);
                if (e.defaultPrevented) {
                    return;
                }
                const clipboardData = e.clipboardData || window.clipboardData;
                this.insertTextAtCaret(clipboardData.getData('Text'));
                e.preventDefault();
            };
            this.inputEvent = (e) => {
                const c = mockDOMInput.value;
                if (c.length) {
                    this.insertTextAtCaret(c);
                    mockDOMInput.value = '';
                }
                e.preventDefault();
            };
            this.inputBlurEvent = (e) => {
                this.blur();
            };
            this.focus = () => {
                if (!this._isFocused) {
                    super.focus();
                    const l = `${this.contentContainer.worldTransform.tx}px`;
                    const t = `${this.contentContainer.worldTransform.ty}px`;
                    const h = `${this.contentContainer.height}px`;
                    const w = `${this.contentContainer.width}px`;
                    mockDOMInput.setAttribute('style', `position:fixed; left:${l}; top:${t}; height:${h}; width:${w};`);
                    mockDOMInput.value = '';
                    mockDOMInput.focus();
                    mockDOMInput.setAttribute('style', 'position:fixed; left:-10px; top:-10px; width:0px; height: 0px;');
                    this.innerContainer.cacheAsBitmap = false;
                    mockDOMInput.addEventListener('blur', this.inputBlurEvent, false);
                    document.addEventListener('keydown', this.onKeyDown, false);
                    document.addEventListener('keyup', this.keyUpEvent, false);
                    document.addEventListener('paste', this.pasteEvent, false);
                    document.addEventListener('copy', this.copyEvent, false);
                    document.addEventListener('cut', this.cutEvent, false);
                    mockDOMInput.addEventListener('input', this.inputEvent, false);
                    setTimeout(() => {
                        if (!this.caret.visible && !this.selection.visible && !this.multiLine) {
                            this.setCaretIndex(this.chars.length);
                        }
                    }, 0);
                }
            };
            this.blur = () => {
                if (this._isFocused) {
                    super.blur();
                    this.ctrlDown = false;
                    this.shiftDown = false;
                    this.hideCaret();
                    this.clearSelection();
                    if (this.chars.length > 1) {
                        this.innerContainer.cacheAsBitmap = true;
                    }
                    mockDOMInput.removeEventListener('blur', this.inputBlurEvent);
                    document.removeEventListener('keydown', this.onKeyDown);
                    document.removeEventListener('keyup', this.keyUpEvent);
                    document.removeEventListener('paste', this.pasteEvent);
                    document.removeEventListener('copy', this.copyEvent);
                    document.removeEventListener('cut', this.cutEvent);
                    mockDOMInput.removeEventListener('input', this.inputEvent);
                    mockDOMInput.blur();
                }
                if (!this.multiLine) {
                    this.resetScrollPosition();
                }
            };
            this.setCaretIndex = (index) => {
                this.caret._atEnd = index >= this.chars.length;
                this.caret._index = Math.max(0, Math.min(this.chars.length - 1, index));
                if (this.chars.length && index > 0) {
                    let i = Math.max(0, Math.min(index, this.chars.length - 1));
                    let c = this.chars[i];
                    if (c && c.wrapped) {
                        this.caret.x = c.x;
                        this.caret.y = c.y;
                    }
                    else {
                        i = Math.max(0, Math.min(index - 1, this.chars.length - 1));
                        c = this.chars[i];
                        this.caret.x = this.chars[i].x + this.chars[i].width;
                        this.caret.y = (this.chars[i].lineIndex * this.lineHeight) + (this.lineHeight - this.textHeight) * 0.5;
                    }
                }
                else {
                    this.caret.x = 0;
                    this.caret.y = (this.lineHeight - this.textHeight) * 0.5;
                }
                this.scrollToPosition(this.caret);
                this.showCaret();
            };
            this.select = () => {
                this.selectRange(0, this.chars.length - 1);
            };
            this.selectWord = (wordIndex) => {
                let startIndex = this.chars.length;
                let endIndex = 0;
                for (let i = 0; i < this.chars.length; i++) {
                    if (this.chars[i].wordIndex !== wordIndex) {
                        continue;
                    }
                    if (i < startIndex) {
                        startIndex = i;
                    }
                    if (i > endIndex) {
                        endIndex = i;
                    }
                }
                this.selectRange(startIndex, endIndex);
            };
            this.selectRange = (startIndex, endIndex) => {
                if (startIndex > -1 && endIndex > -1) {
                    const start = Math.min(startIndex, endIndex, this.chars.length - 1);
                    const end = Math.min(Math.max(startIndex, endIndex), this.chars.length - 1);
                    if (start !== this.selectionStart || end !== this.selectionEnd) {
                        this.hasSelection = true;
                        this.selection.visible = true;
                        this.selectionStart = start;
                        this.selectionEnd = end;
                        this.hideCaret();
                        this.updateSelectionGraphics();
                        this.updateSelectionColors();
                    }
                    this.focus();
                }
                else {
                    this.clearSelection();
                }
            };
            this.clearSelection = () => {
                if (this.hasSelection) {
                    // Remove color
                    this.hasSelection = false;
                    this.selection.visible = false;
                    this.selectionStart = -1;
                    this.selectionEnd = -1;
                    this.updateSelectionColors();
                }
            };
            this.updateSelectionGraphics = () => {
                const c1 = this.chars[this.selectionStart];
                if (c1 !== undefined) {
                    let cx = c1.x;
                    let cy = c1.y;
                    let w = 0;
                    const h = this.textHeight;
                    let cl = c1.lineIndex;
                    this.selection.clear();
                    for (let i = this.selectionStart; i <= this.selectionEnd; i++) {
                        const c = this.chars[i];
                        if (c.lineIndex != cl) {
                            this.drawSelectionRect(cx, cy, w, h);
                            cx = c.x;
                            cy = c.y;
                            cl = c.lineIndex;
                            w = 0;
                        }
                        w += c.width;
                    }
                    this.drawSelectionRect(cx, cy, w, h);
                    this.innerContainer.addChildAt(this.selection, 0);
                }
            };
            this.drawSelectionRect = (x, y, w, h) => {
                this.selection.beginFill(`0x${this.selectedBackgroundColor.slice(1)}`, 1);
                this.selection.moveTo(x, y);
                this.selection.lineTo(x + w, y);
                this.selection.lineTo(x + w, y + h);
                this.selection.lineTo(x, y + h);
                this.selection.endFill();
            };
            initMockDOMInput();
            this.options = options;
            this._dirtyText = true;
            this.maxLength = options.maxLength || 0;
            this._value = this._lastValue = options.value || '';
            if (this.maxLength) {
                this._value = this._value.slice(0, this.maxLength);
            }
            this.chars = [];
            this.multiLine = options.multiLine !== undefined ? options.multiLine : false;
            this.color = options.style && options.style.fill ? options.style.fill : '#000000';
            this.selectedColor = options.selectedColor || '#ffffff';
            this.selectedBackgroundColor = options.selectedBackgroundColor || '#318cfa';
            this.tempText = new PIXI.Text('1', options.style);
            this.textHeight = this.tempText.height;
            this.lineHeight = options.lineHeight || this.textHeight || this._height;
            this.tempText.destroy();
            // set cursor
            // this.container.cursor = "text";
            // selection graphics
            this.selection = new PIXI.Graphics();
            this.selection.visible = false;
            this.selection._startIndex = 0;
            this.selection._endIndex = 0;
            // caret graphics
            this.caret = new PIXI.Graphics();
            this.caret.visible = false;
            this.caret._index = 0;
            this.caret.lineStyle(options.caretWidth || 1, '#ffffff', 1);
            this.caret.moveTo(0, 0);
            this.caret.lineTo(0, this.textHeight);
            // var padding
            const paddingLeft = options.paddingLeft !== undefined ? options.paddingLeft : options.padding;
            const paddingRight = options.paddingRight !== undefined ? options.paddingRight : options.padding;
            const paddingBottom = options.paddingBottom !== undefined ? options.paddingBottom : options.padding;
            const paddingTop = options.paddingTop !== undefined ? options.paddingTop : options.padding;
            // insert text container (scrolling container)
            this.textContainer = new ScrollWidget({
                scrollX: !this.multiLine,
                scrollY: this.multiLine,
                dragScrolling: this.multiLine,
                expandMask: 2,
                softness: 0.2,
                overflowX: 40,
                overflowY: 40,
            }).setPadding(paddingLeft || 3, paddingTop || 3, paddingRight || 3, paddingBottom || 3).setLayoutOptions(new LayoutOptions(LayoutOptions.FILL_PARENT, LayoutOptions.FILL_PARENT));
            this.addChild(this.textContainer);
            if (this.multiLine) {
                this._useNext = this._usePrev = false;
                this.textContainer.dragRestrictAxis = 'y';
                this.textContainer.dragThreshold = 5;
                this.dragRestrictAxis = 'x';
                this.dragThreshold = 5;
            }
            // selection Vars
            this.sp = new PIXI.Point(); // startposition
            this._sp = new PIXI.Point();
            this.ds = new PIXI.Point(); // dragStart
            this.de = new PIXI.Point(); // dragend
            this.rdd = false; // Reverse drag direction
            this.vrdd = false; // vertical Reverse drag direction
            this.selectionStart = -1;
            this.selectionEnd = -1;
            this.hasSelection = false;
            this.t = performance.now(); // timestamp
            this.cc = 0; // click counter
            this.textLengthPX = 0;
            this.textHeightPX = 0;
            this.lineIndexMax = 0;
            this.ctrlDown = false;
            this.shiftDown = false;
            this.shiftKey = 16;
            this.ctrlKey = 17;
            this.cmdKey = 91;
            this.setupDrag();
        }
        setupDrag() {
            const event = new DragManager(this);
            event.onPress = (e, mouseDown) => {
                if (mouseDown) {
                    const timeSinceLast = performance.now() - this.t;
                    this.t = performance.now();
                    if (timeSinceLast < 250) {
                        this.cc++;
                        if (this.cc > 1) {
                            this.select();
                        }
                        else {
                            this.innerContainer.toLocal(this.sp, undefined, this.ds, true);
                            this.updateClosestIndex(this.ds, true);
                            const c = this.chars[this.si];
                            if (c) {
                                if (c.wordIndex != -1) {
                                    this.selectWord(c.wordIndex);
                                }
                                else {
                                    this.selectRange(this.si, this.si);
                                }
                            }
                        }
                    }
                    else {
                        this.cc = 0;
                        this.sp.copyFrom(e.data.global);
                        this.innerContainer.toLocal(this.sp, undefined, this.ds, true);
                        if (this.chars.length) {
                            this.updateClosestIndex(this.ds, true);
                            this.setCaretIndex(this.sie ? this.si + 1 : this.si);
                        }
                    }
                }
                e.data.originalEvent.preventDefault();
            };
            event.onDragMove = (e, offset) => {
                if (!this.chars.length || !this._isFocused) {
                    return;
                }
                this.de.x = this.sp.x + offset.x;
                this.de.y = this.sp.y + offset.y;
                this.innerContainer.toLocal(this.de, undefined, this.de, true);
                this.updateClosestIndex(this.de, false);
                if (this.si < this.ei) {
                    this.selectRange(this.sie ? this.si + 1 : this.si, this.eie ? this.ei : this.ei - 1);
                    this.caret._index = this.eie ? this.ei : this.ei - 1;
                }
                else if (this.si > this.ei) {
                    this.selectRange(this.ei, this.sie ? this.si : this.si - 1);
                    this.caret._index = this.ei;
                }
                else if (this.sie === this.eie) {
                    this.setCaretIndex(this.sie ? this.si + 1 : this.si);
                }
                else {
                    this.selectRange(this.si, this.ei);
                    this.caret._index = this.ei;
                }
                this.caret._forward = this.si <= this.ei;
                this.caret._down = offset.y > 0;
                this.scrollToPosition(this.de);
            };
        }
        get innerContainer() {
            return this.textContainer.innerContainer.insetContainer;
        }
        update() {
            if (this.width !== this._lastWidth) {
                this._lastWidth = this._width;
                if (this.multiLine) {
                    this.updateText();
                    if (this.caret.visible) {
                        this.setCaretIndex(this.caret._index);
                    }
                    if (this.hasSelection) {
                        this.updateSelectionGraphics();
                    }
                }
            }
            // update text
            if (this._dirtyText) {
                this.updateText();
                this._dirtyText = false;
            }
        }
        updateText() {
            this.textLengthPX = 0;
            this.textHeightPX = 0;
            this.lineIndexMax = 0;
            let lineIndex = 0;
            const length = this._value.length;
            let x = 0;
            let y = (this.lineHeight - this.textHeight) * 0.5;
            let i = 0;
            // destroy excess chars
            if (this.chars.length > length) {
                for (i = this.chars.length - 1; i >= length; i--) {
                    this.innerContainer.removeChild(this.chars[i]);
                    this.chars[i].destroy();
                }
                this.chars.splice(length, this.chars.length - length);
            }
            // update and add chars
            let whitespace = false;
            let newline = false;
            let wordIndex = 0;
            let lastWordIndex = -1;
            let wrap = false;
            for (i = 0; i < this._value.length; i++) {
                if (whitespace || newline) {
                    lastWordIndex = i;
                    wordIndex++;
                }
                let c = this._value[i];
                whitespace = c === ' ';
                newline = c === '\n';
                if (newline) { // newline "hack". webgl render errors if \n is passed to text
                    c = '';
                }
                let charText = this.chars[i];
                if (!charText) {
                    charText = new PIXI.Text(c, this.options.style);
                    this.innerContainer.addChild(charText);
                    this.chars.push(charText);
                }
                else {
                    charText.text = c;
                }
                charText.scale.x = newline ? 0 : 1;
                charText.wrapped = wrap;
                wrap = false;
                if (newline || (this.multiLine && x + charText.width >= this._width - this.paddingLeft - this.paddingRight)) {
                    lineIndex++;
                    x = 0;
                    y += this.lineHeight;
                    if (lastWordIndex !== -1 && !newline) {
                        i = lastWordIndex - 1;
                        lastWordIndex = -1;
                        wrap = true;
                        continue;
                    }
                }
                charText.lineIndex = lineIndex;
                charText.x = x;
                charText.y = y;
                charText.wordIndex = whitespace || newline ? -1 : wordIndex;
                x += charText.width;
                if (x > this.textLengthPX) {
                    this.textLengthPX = x;
                }
                if (y > this.textHeightPX) {
                    this.textHeightPX = y;
                }
            }
            this.lineIndexMax = lineIndex;
            // put caret on top
            this.innerContainer.addChild(this.caret);
            // recache
            if (this.innerContainer.cacheAsBitmap) {
                this.innerContainer.cacheAsBitmap = false;
                this.innerContainer.cacheAsBitmap = true;
            }
            this.textContainer.update();
        }
        updateClosestIndex(point, start) {
            let currentDistX = 99999;
            let currentIndex = -1;
            let atEnd = false;
            let closestLineIndex = 0;
            if (this.lineIndexMax > 0) {
                closestLineIndex = Math.max(0, Math.min(this.lineIndexMax, Math.floor(point.y / this.lineHeight)));
            }
            for (let i = 0; i < this.chars.length; i++) {
                const char = this.chars[i];
                if (char.lineIndex !== closestLineIndex) {
                    continue;
                }
                const distX = Math.abs(point.x - (char.x + (char.width * 0.5)));
                if (distX < currentDistX) {
                    currentDistX = distX;
                    currentIndex = i;
                    atEnd = point.x > char.x + (char.width * 0.5);
                }
            }
            if (start) {
                this.si = currentIndex;
                this.sie = atEnd;
            }
            else {
                this.ei = currentIndex;
                this.eie = atEnd;
            }
        }
        deleteSelection() {
            if (this.hasSelection) {
                this.value = this.value.slice(0, this.selectionStart) + this.value.slice(this.selectionEnd + 1);
                this.setCaretIndex(this.selectionStart);
                return true;
            }
            return false;
        }
        updateSelectionColors() {
            // Color charecters
            for (let i = 0; i < this.chars.length; i++) {
                if (i >= this.selectionStart && i <= this.selectionEnd) {
                    this.chars[i].style.fill = this.selectedColor;
                }
                else {
                    this.chars[i].style.fill = this.color;
                }
            }
        }
        scrollToPosition(pos) {
            this._sp.x = pos.x;
            this._sp.y = pos.y;
            if (this.multiLine && this._sp.y >= this.lineHeight) {
                this._sp.y += this.lineHeight;
            }
            this.textContainer.focusPosition(this._sp);
        }
        resetScrollPosition() {
            this._sp.set(0, 0);
            this.textContainer.focusPosition(this._sp);
        }
        hideCaret() {
            this.caret.visible = false;
            clearInterval(this.caretInterval);
        }
        showCaret() {
            this.clearSelection();
            clearInterval(this.caretInterval);
            this.caret.alpha = 1;
            this.caret.visible = true;
            this.caretInterval = setInterval(() => {
                this.caret.alpha = this.caret.alpha === 0 ? 1 : 0;
            }, 500);
        }
        insertTextAtCaret(c) {
            if (!this.multiLine && c.indexOf('\n') !== -1) {
                c = c.replace(/\n/g, '');
            }
            if (this.hasSelection) {
                this.deleteSelection();
            }
            if (!this.maxLength || this.chars.length < this.maxLength) {
                if (this.caret._atEnd) {
                    this.valueEvent += c;
                    this.setCaretIndex(this.chars.length);
                }
                else {
                    const index = Math.min(this.chars.length - 1, this.caret._index);
                    this.valueEvent = this.value.slice(0, index) + c + this.value.slice(index);
                    this.setCaretIndex(index + c.length);
                }
            }
        }
        get valueEvent() {
            return this._value;
        }
        set valueEvent(val) {
            if (this.maxLength) {
                val = val.slice(0, this.maxLength);
            }
            if (this._value != val) {
                this.value = val;
                this.emit('change');
            }
        }
        get value() {
            return this._value;
        }
        set value(val) {
            if (this.maxLength) {
                val = val.slice(0, this.maxLength);
            }
            if (this._value != val) {
                this._lastValue = this._value;
                this._value = val;
                this._dirtyText = true;
                this.update();
            }
        }
        get text() {
            return this.value;
        }
        set text(value) {
            this.value = value;
        }
    }
    /*
     * Features:
     * multiLine, shift selection, Mouse Selection, Cut, Copy, Paste, Delete, Backspace, Arrow navigation, tabIndex
     *
     * Methods:
     * blur()
     * focus()
     * select() - selects all text
     * selectRange(startIndex, endIndex)
     * clearSelection()
     * setCaretIndex(index) moves caret to index
     *
     *
     * Events:
     * "change"
     * "blur"
     * "blur"
     * "focus"
     * "focusChanged" param: [bool]focus
     * "keyup" param: Event
     * "keydown" param: Event
     * "copy" param: Event
     * "paste" param: Event
     * "cut" param: Event
     * "keyup" param: Event
     */

    /**
     * An UI sprite object
     *
     * @class
     * @extends PIXI.UI.UIBase
     * @memberof PIXI.UI
     * @param Texture {PIXI.Texture} The texture for the sprite
     * @param [Width=Texture.width] {number} Width of tilingsprite
     * @param [Height=Texture.height] {number} Height of tiling sprite
     */
    class TilingSprite extends Widget {
        constructor(t, width, height) {
            const sprite = new PIXI.extras.TilingSprite(t);
            super(width || sprite.width, height || sprite.height);
            this.sprite = sprite;
            this.contentContainer.addChild(this.sprite);
        }
        /**
         * Updates the text
         *
         * @private
         */
        update() {
            if (this.tint !== null) {
                this.sprite.tint = this.tint;
            }
            if (this.blendMode !== null) {
                this.sprite.blendMode = this.blendMode;
            }
            this.sprite.width = this._width;
            this.sprite.height = this._height;
        }
        get tilePosition() {
            return this.sprite.tilePosition;
        }
        set tilingPosition(val) {
            this.sprite.tilePosition = val;
        }
        get tileScale() {
            return this.sprite.tileScale;
        }
        set tileScale(val) {
            this.sprite.tileScale = val;
        }
    }

    /**
     * This ticker is an event-emitter that can be used for running periodic tasks
     * in the rendering loop. It emits the `update` event every animation frame.
     *
     * @memberof PUXI
     * @class
     * @extends PIXI.utils.EventEmitter
     */
    class Ticker$1 extends PIXI.utils.EventEmitter {
        constructor(autoStart) {
            super();
            this._disabled = true;
            this._now = 0;
            this.DeltaTime = 0;
            this.Time = performance.now();
            this.Ms = 0;
            if (autoStart) {
                this.disabled = false;
            }
            Ticker$1.shared = this;
        }
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            if (!this._disabled) {
                this._disabled = true;
            }
            else {
                this._disabled = false;
                Ticker$1.shared = this;
                this.update(performance.now(), true);
            }
        }
        /**
         * Updates the text
         *
         * @private
         */
        update(time) {
            Ticker$1.shared._now = time;
            Ticker$1.shared.Ms = Ticker$1.shared._now - Ticker$1.shared.Time;
            Ticker$1.shared.Time = Ticker$1.shared._now;
            Ticker$1.shared.DeltaTime = Ticker$1.shared.Ms * 0.001;
            Ticker$1.shared.emit('update', Ticker$1.shared.DeltaTime);
            Tween._update(Ticker$1.shared.DeltaTime);
            if (!Ticker$1.shared._disabled) {
                requestAnimationFrame(Ticker$1.shared.update);
            }
        }
        static on(event, fn, context) {
            Ticker$1.shared.on(event, fn, context);
        }
        static once(event, fn, context) {
            Ticker$1.shared.once(event, fn, context);
        }
        static removeListener(event, fn) {
            Ticker$1.shared.removeListener(event, fn);
        }
    }
    Ticker$1.shared = new Ticker$1(true);

    exports.AnchorLayout = AnchorLayout;
    exports.AnchorLayoutOptions = AnchorLayoutOptions;
    exports.BorderLayout = BorderLayout;
    exports.BorderLayoutOptions = BorderLayoutOptions;
    exports.Button = Button;
    exports.CheckBox = CheckBox;
    exports.ClickManager = ClickManager;
    exports.Ease = Ease;
    exports.EventBroker = EventBroker;
    exports.EventManager = EventManager;
    exports.FastLayout = FastLayout;
    exports.FastLayoutOptions = FastLayoutOptions;
    exports.Helpers = Helpers;
    exports.ImageButton = ImageButton;
    exports.ImageWidget = ImageWidget;
    exports.Insets = Insets;
    exports.InteractiveGroup = InteractiveGroup;
    exports.LayoutOptions = LayoutOptions;
    exports.LinearLayout = LinearLayout;
    exports.ScrollBar = ScrollBar;
    exports.ScrollManager = ScrollManager;
    exports.ScrollWidget = ScrollWidget;
    exports.SliceSprite = SliceSprite;
    exports.Slider = Slider;
    exports.SortableList = SortableList;
    exports.Sprite = Sprite;
    exports.Stage = Stage;
    exports.Style = Style;
    exports.StyleSheet = StyleSheet;
    exports.TEXT_STYLE_PROPERTIES = TEXT_STYLE_PROPERTIES;
    exports.TextInput = TextInput;
    exports.TextWidget = TextWidget;
    exports.Ticker = Ticker$1;
    exports.TilingSprite = TilingSprite;
    exports.Widget = Widget;
    exports.WidgetGroup = WidgetGroup;
    exports.create = create;
    exports.wrapEase = wrapEase;

    return exports;

}({}, PIXI, __filters));
Object.assign(this.PUXI, _puxi_core)
//# sourceMappingURL=puxi-core.js.map
