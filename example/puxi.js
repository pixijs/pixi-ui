/*!
 * puxi.js - v0.0.0
 * Compiled Sun, 22 Mar 2020 22:04:14 UTC
 *
 * puxi.js is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
this.PUXI = this.PUXI || {};
var puxi_js = (function (exports, pixi_js, filterDropShadow) {
    'use strict';

    /*!
     * @puxi/core - v1.0.0
     * Compiled Sun, 22 Mar 2020 22:04:14 UTC
     *
     * @puxi/core is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

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
            this.mouse = new pixi_js.Point();
            this.offset = new pixi_js.Point();
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
            this.dragStart = new pixi_js.Point();
            this.dragOffset = new pixi_js.Point();
            this.lastCursor = new pixi_js.Point();
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
            this.delta = new pixi_js.Point();
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

    /**
     * A widget is a user interface control that renders content inside its prescribed
     * rectangle on the screen.
     *
     * @memberof PUXI
     * @class
     * @extends PIXI.utils.EventEmitter
     * @implements PUXI.IMeasurable
     */
    class Widget extends pixi_js.utils.EventEmitter {
        constructor() {
            super();
            /**
             * This container owns the background + content of this widget.
             * @member {PIXI.Container}
             * @readonly
             */
            this.insetContainer = new pixi_js.Container();
            /**
             * This container holds the content of this widget. Subclasses should add
             * renderable display-objects to this container.
             * @member {PIXI.Container}
             * @readonly
             */
            this.contentContainer = this.insetContainer.addChild(new pixi_js.Container());
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
            this.blendMode = pixi_js.BLEND_MODES.NORMAL;
            this.draggable = false;
            this.droppable = false;
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
                bg = pixi_js.utils.string2hex(bg);
            }
            if (typeof bg === 'number') {
                bg = new pixi_js.Graphics()
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
            const realPosition = new pixi_js.Point();
            const dragPosition = new pixi_js.Point();
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
    FastLayoutOptions.DEFAULT_ANCHOR = new pixi_js.Point(0, 0);
    FastLayoutOptions.CENTER_ANCHOR = new pixi_js.Point(0.5, 0.5); // fragile, shouldn't be modified

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
            this.hitArea = new pixi_js.Rectangle();
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
     * @class
     * @extends PUXI.Widget
     */
    class TextWidget extends Widget {
        /**
         * @param {string} text - text content
         * @param {PIXI.TextStyle} textStyle - styled used for text
         */
        constructor(text, textStyle) {
            super();
            this.textDisplay = new pixi_js.Text(text, textStyle);
            this.contentContainer.addChild(this.textDisplay);
        }
        update() {
            if (this.tint !== null) {
                this.textDisplay.tint = this.tint;
            }
            if (this.blendMode !== null) {
                this.textDisplay.blendMode = this.blendMode;
            }
        }
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
                options.text = new TextWidget(options.text, new pixi_js.TextStyle());
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
            this.setupClick();
        }
        setupClick() {
            const clickEvent = this.eventBroker.click;
            clickEvent.onHover = (e, over) => {
                this.isHover = over;
                this.emit('hover', over);
            };
            clickEvent.onPress = (e, isPressed) => {
                if (isPressed) {
                    this.focus();
                    e.data.originalEvent.preventDefault();
                }
                this.emit('press', isPressed);
            };
            clickEvent.onClick = (e) => {
                this.click();
            };
            this.click = () => {
                this.emit('click');
            };
        }
        update() {
            super.update();
            // No update needed
        }
        initialize() {
            super.initialize();
            this.setupClick();
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
            this._localCursor = new pixi_js.Point();
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
                    updatePositionToMouse(event.data.global);
                }
                event.stopPropagation();
            };
            trackDrag.onDragMove = (event) => {
                updatePositionToMouse(event.data.global);
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
    Slider.DEFAULT_HORIZONTAL_TRACK = new pixi_js.Graphics()
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
    Slider.DEFAULT_VERTICAL_TRACK = new pixi_js.Graphics()
        .beginFill(0xffffff, 1)
        .drawRect(0, 0, 16, 16) // natural width & height = 16
        .endFill()
        .lineStyle(1, 0x000000, 0.7, 1, true) // draw line in middle
        .moveTo(8, 1)
        .lineTo(8, 15);
    /**
     * @static
     */
    Slider.DEFAULT_HANDLE = new pixi_js.Graphics()
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
    ScrollBar.DEFAULT_TRACK = new pixi_js.Graphics()
        .beginFill(0xffffff)
        .drawRect(0, 0, 8, 8)
        .endFill();
    /**
     * @static
     */
    ScrollBar.DEFAULT_HANDLE = new pixi_js.Graphics()
        .beginFill(0x000000)
        .drawCircle(8, 8, 4)
        .endFill()
        .beginFill(0x000000, 0.5)
        .drawCircle(8, 8, 8)
        .endFill();

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
                    pixi_js.Ticker.shared.add(this.updateScrollPosition);
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
                    pixi_js.Ticker.shared.remove(this.updateScrollPosition);
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
            this.mask = new pixi_js.Graphics();
            this.innerContainer = new InteractiveGroup();
            this.innerBounds = new pixi_js.Rectangle();
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
            this.scrollVelocity = new pixi_js.Point();
            /**
             * Widget's position in a scroll.
             * @member {PIXI.Point}
             * @private
             */
            this.scrollPosition = new pixi_js.Point();
            /**
             * Position that the cursor is at, i.e. our scroll "target".
             * @member {PIXI.Point}
             * @private
             */
            this.targetPosition = new pixi_js.Point();
            this.lastPosition = new pixi_js.Point();
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
            const realPosition = new pixi_js.Point();
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
            const scrollSpeed = new pixi_js.Point();
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
                this.ftl = new pixi_js.Rectangle(f.x, f.y, bw, bw);
                this.ftr = new pixi_js.Rectangle(f.x + f.width - bw, f.y, bw, bw);
                this.fbl = new pixi_js.Rectangle(f.x, f.y + f.height - bw, bw, bw);
                this.fbr = new pixi_js.Rectangle(f.x + f.width - bw, f.y + f.height - bw, bw, bw);
                this.ft = new pixi_js.Rectangle(f.x + bw, f.y, f.width - bw * 2, bw);
                this.fb = new pixi_js.Rectangle(f.x + bw, f.y + f.height - bw, f.width - bw * 2, bw);
                this.fl = new pixi_js.Rectangle(f.x, f.y + bw, bw, f.height - bw * 2);
                this.fr = new pixi_js.Rectangle(f.x + f.width - bw, f.y + bw, bw, f.height - bw * 2);
                this.ff = new pixi_js.Rectangle(f.x + bw, f.y + bw, f.width - bw * 2, f.height - bw * 2);
            }
            else if (this.hs) {
                this.fl = new pixi_js.Rectangle(this.f.x, f.y, bw, f.height);
                this.fr = new pixi_js.Rectangle(f.x + f.width - bw, f.y, bw, f.height);
                this.ff = new pixi_js.Rectangle(f.x + bw, f.y, f.width - bw * 2, f.height);
            }
            else { // vs
                this.ft = new pixi_js.Rectangle(f.x, f.y, f.width, bw);
                this.fb = new pixi_js.Rectangle(f.x, f.y + f.height - bw, f.width, bw);
                this.ff = new pixi_js.Rectangle(f.x, f.y + bw, f.width, f.height - bw * 2);
            }
            // TODO: swap frames if rotation
            const { t, ff, fl, fr, ft, fb } = this;
            // make sprites
            this.sf = this.tile
                ? new pixi_js.extras.TilingSprite(new pixi_js.Texture(t, ff))
                : new pixi_js.Sprite(new pixi_js.Texture(t, ff));
            this.contentContainer.addChildAt(this.sf, 0);
            if (this.vs && this.hs) {
                this.stl = new pixi_js.Sprite(new pixi_js.Texture(t, this.ftl));
                this.str = new pixi_js.Sprite(new pixi_js.Texture(t, this.ftr));
                this.sbl = new pixi_js.Sprite(new pixi_js.Texture(t, this.fbl));
                this.sbr = new pixi_js.Sprite(new pixi_js.Texture(t, this.fbr));
                this.contentContainer.addChildAt(this.stl, 0);
                this.contentContainer.addChildAt(this.str, 0);
                this.contentContainer.addChildAt(this.sbl, 0);
                this.contentContainer.addChildAt(this.sbr, 0);
            }
            if (hs) {
                this.sl = this.tile
                    ? new pixi_js.extras.TilingSprite(new pixi_js.Texture(t, fl))
                    : new pixi_js.Sprite(new pixi_js.Texture(t, fl));
                this.sr = this.tile
                    ? new pixi_js.extras.TilingSprite(new pixi_js.Texture(t, fr))
                    : new pixi_js.Sprite(new pixi_js.Texture(t, fr));
                this.contentContainer.addChildAt(this.sl, 0);
                this.contentContainer.addChildAt(this.sr, 0);
            }
            if (this.vs) {
                this.st = this.tile
                    ? new pixi_js.extras.TilingSprite(new pixi_js.Texture(t, ft))
                    : new pixi_js.Sprite(new pixi_js.Texture(t, ft));
                this.sb = this.tile
                    ? new pixi_js.extras.TilingSprite(new pixi_js.Texture(t, fb))
                    : new pixi_js.Sprite(new pixi_js.Texture(t, fb));
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
            this.spriteDisplay = new pixi_js.Sprite(texture);
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
            return new Sprite(new pixi_js.Texture(new pixi_js.BaseTexture(imageUrl)));
        }
    }

    class Controller extends pixi_js.utils.EventEmitter {
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
    class Stage extends pixi_js.Container {
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
            this.hitArea = new pixi_js.Rectangle(0, 0, 0, 0);
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
            if (!isNaN(height))
                this.__height = height;
            if (!isNaN(width))
                this.__width = width;
            if (this.minWidth || this.minHeight) {
                let rx = 1;
                let ry = 1;
                if (width && width < this.minWidth) {
                    rx = this.minWidth / width;
                }
                if (height && height < this.minHeight) {
                    ry = this.minHeight / height;
                }
                if (rx > ry && rx > 1) {
                    this.scale.set(1 / rx);
                    this.__height *= rx;
                    this.__width *= rx;
                }
                else if (ry > 1) {
                    this.scale.set(1 / ry);
                    this.__width *= ry;
                    this.__height *= ry;
                }
                else if (this.scale.x !== 1) {
                    this.scale.set(1);
                }
            }
            if (this.hitArea) {
                this.hitArea.width = this.__width;
                this.hitArea.height = this.__height;
            }
            for (let i = 0; i < this.widgetChildren.length; i++) {
                this.widgetChildren[i].updatesettings(true, false);
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
            this.tempText = new pixi_js.Text('1', options.style);
            this.textHeight = this.tempText.height;
            this.lineHeight = options.lineHeight || this.textHeight || this._height;
            this.tempText.destroy();
            // set cursor
            // this.container.cursor = "text";
            // selection graphics
            this.selection = new pixi_js.Graphics();
            this.selection.visible = false;
            this.selection._startIndex = 0;
            this.selection._endIndex = 0;
            // caret graphics
            this.caret = new pixi_js.Graphics();
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
            this.sp = new pixi_js.Point(); // startposition
            this._sp = new pixi_js.Point();
            this.ds = new pixi_js.Point(); // dragStart
            this.de = new pixi_js.Point(); // dragend
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
                    charText = new pixi_js.Text(c, this.options.style);
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
            const sprite = new pixi_js.extras.TilingSprite(t);
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
    class Ticker extends pixi_js.utils.EventEmitter {
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
            Ticker.shared = this;
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
                Ticker.shared = this;
                this.update(performance.now(), true);
            }
        }
        /**
         * Updates the text
         *
         * @private
         */
        update(time) {
            Ticker.shared._now = time;
            Ticker.shared.Ms = Ticker.shared._now - Ticker.shared.Time;
            Ticker.shared.Time = Ticker.shared._now;
            Ticker.shared.DeltaTime = Ticker.shared.Ms * 0.001;
            Ticker.shared.emit('update', Ticker.shared.DeltaTime);
            Tween._update(Ticker.shared.DeltaTime);
            if (!Ticker.shared._disabled) {
                requestAnimationFrame(Ticker.shared.update);
            }
        }
        static on(event, fn, context) {
            Ticker.shared.on(event, fn, context);
        }
        static once(event, fn, context) {
            Ticker.shared.once(event, fn, context);
        }
        static removeListener(event, fn) {
            Ticker.shared.removeListener(event, fn);
        }
    }
    Ticker.shared = new Ticker(true);

    /*!
     * @puxi/tween - v1.0.0
     * Compiled Sun, 22 Mar 2020 22:04:14 UTC
     *
     * @puxi/tween is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    /**
     * Holds the information needed to perform a tweening operation. It is used internally
     * by `PUXI.tween.TweenManager`.
     *
     * @memberof PUXI.tween
     * @class
     * @template T
     */
    class Tween$1 extends pixi_js.utils.EventEmitter {
        constructor(// eslint-disable-line max-params
        manager, key, startValue, endValue, erp, ease, observedValue, startTime, endTime, repeat = 1, flip = true) {
            super();
            /**
             * The tween-manager whose update loop handles this tween.
             * @member {PUXI.TweenManager}
             */
            this.manager = manager;
            /**
             * Unique id for this tweening operation
             * @member {string}
             */
            this.key = key;
            /**
             * Start value of interpolation
             * @member {T}
             */
            this.startValue = startValue;
            /**
             * End value of interpolation
             * @member {T}
             */
            this.endValue = endValue;
            /**
             * Linear interpolator on tween property.
             * @member {Erp}
             */
            this.erp = erp;
            /**
             * Easing function
             * @member {Ease}
             */
            this.ease = ease;
            /**
             * Object that is observed and the interpolated value to be stored in.
             * @member {T}
             */
            this.observedValue = observedValue;
            /**
             * @member {DOMHighResTimeStamp}
             * @readonly
             */
            this.startTime = startTime;
            /**
             * @member {DOMHighResTimeStamp}
             * @readonly
             */
            this.endTime = endTime;
            this._repeat = repeat;
            this._flip = flip;
            this._next = null;
            this._target = null;
            this._observedProperty = null;
            this.autoCreated = false;
        }
        /**
         * Updates the observed value.
         *
         * @param {DOMHighResTimeStamp} t - current time
         */
        update(t = performance.now()) {
            t = (t - this.startTime) / (this.endTime - this.startTime);
            t = Math.min(Math.max(t, 0), 1);
            if (this.ease) {
                t = this.ease(t);
            }
            // Update observed value
            this.observedValue = this.erp(this.startValue, this.endValue, Math.min(Math.max(t, 0), 1), this.observedValue);
            // Emit update event
            this.emit('update', this.observedValue, this.key);
            // Update target object (if any)
            if (this._target) {
                this._target[this._observedProperty] = this.observedValue;
            }
            // If cycle completed...
            if (t >= 1) {
                --this._repeat;
                this.emit('cycle', this);
                // Repeat tween if required
                if (this._repeat > 0) {
                    if (this._flip) {
                        const { startValue: s, endValue: e } = this;
                        this.endValue = s;
                        this.startValue = e;
                    }
                    const duration = this.endTime - this.startTime;
                    this.startTime += duration;
                    this.endTime += duration;
                    return;
                }
                // Initiate chained tween
                if (this._next) {
                    this.manager.queue(this._next);
                }
                this.reset();
                // Cleanup after completion
                this.emit('complete', this);
                this.removeAllListeners();
            }
        }
        /**
         * Configures this tween to update the observed-property on a tween target object
         * each animation frame.
         * @template T
         * @param {PUXI.TweenTarget<T>} target - object on which property is being tweened
         * @param {string} observedProperty - name of property on target
         */
        target(target, observedProperty) {
            this._target = target;
            this._observedProperty = observedProperty;
            return this;
        }
        /**
         * Repeats this tween `repeat` no. of times again. If the tween is still running,
         * then this is no. of times it will again (not added to the previous repeat
         * count).
         *
         * Each time the tween is repeated, a `cycle` event is fired.
         *
         * By default, the repeat count of any tween is 1.
         *
         * @param {number} repeat - the repeat count
         * @param {boolean}[flip=true] - whether to switch start/end values each cycle
         * @returns {Tween<T>} - this tween, useful for method chaining
         */
        repeat(repeat, flip = true) {
            this._repeat = repeat;
            this._flip = flip;
            return this;
        }
        /**
         * Chains a tween that will run after this one finishes.
         *
         * @template W
         * @param {W} startValue
         * @param {W} endValue
         * @param {DOMHighResTimeStamp} duration
         * @param {PUXI.Erp<W>} erp
         * @param {PUXI.Ease}[ease]
         */
        chain(startValue, endValue, duration, erp, ease) {
            const next = (Tween$1.pool.pop() || new Tween$1());
            next.manager = this.manager;
            next.key = 0;
            next.startValue = startValue;
            next.endValue = endValue;
            next.startTime = this.endTime;
            next.endTime = next.startTime + duration;
            next.erp = erp;
            next.ease = ease;
            this._next = next;
            return next;
        }
        /**
         * Clears the tween's extra properties.
         */
        reset() {
            this.ease = null;
            this._repeat = 0;
            this._next = null;
            this._target = null;
            this._observedProperty = null;
        }
        /**
         * Called when a tween is complete and no references to it are held. This
         * will pool it (if auto-created).
         *
         * Custom tweens should override this.
         */
        destroy() {
            this.reset();
            if (this.autoCreated) {
                Tween$1.pool.push(this);
            }
        }
    }
    /**
     * Fired whenever the observed value is updated.
     * @event update
     * @param {T} observedValue
     * @param {number} key
     */
    /**
     * Fired whenever the tween has "repeated" once.
     * @event cycle
     * @param {Tween} cxt
     */
    /**
     * Fired when tween has finished. References to this tween should be removed.
     * @event complete
     * @param {Tween} cxt
     */
    /**
     * Used for pooling.
     * @member {Array<TweenContext>}
     * @static
     */
    Tween$1.pool = [];

    // TODO: Prevent update loop from starting if there are no queued tweens.
    let nextTweenKey = 0;
    /**
     * @memberof PUXI.tween
     * @class
     */
    class TweenManager {
        constructor(autoStart = true) {
            this.onUpdate = () => {
                for (const [, cxt] of this.tweenMap) {
                    cxt.update();
                }
            };
            this.onTweenComplete = (cxt) => {
                this.tweenMap.delete(cxt.key);
                cxt.destroy();
            };
            this.tweenMap = new Map();
            if (autoStart) {
                this.start();
            }
        }
        /**
         * Initiates a tween from `startValue` to `endValue` for the given duration
         * using an interpolator.
         *
         * @template {T}
         * @param {T} startValue - value of tween property at start
         * @param {T} endValue - value of tween property at finish
         * @param {DOMHighResTimeStamp | number} duration - duration of tween in milliseconds
         * @param {PUXI.Erp<T>} erp - interpolator on tween property
         * @param {PUXI.Ease}[ease] - easing function
         */
        tween(startValue, endValue, duration, erp, ease) {
            const tweenCxt = (Tween$1.pool.pop() || new Tween$1());
            tweenCxt.autoCreated = true;
            tweenCxt.reset();
            tweenCxt.manager = this;
            tweenCxt.key = nextTweenKey++;
            tweenCxt.startValue = startValue;
            tweenCxt.endValue = endValue;
            tweenCxt.erp = erp;
            tweenCxt.ease = ease;
            tweenCxt.startTime = performance.now();
            tweenCxt.endTime = tweenCxt.startTime + duration;
            this.tweenMap.set(tweenCxt.key, tweenCxt);
            tweenCxt.on('complete', this.onTweenComplete);
            return tweenCxt;
        }
        /**
         * Queues the tween context so that it is updated every frame.
         *
         * @param {PUXI.Tween} context
         * @returns {PUXI.TweenManager} this manager, useful for method chaining
         */
        queue(context) {
            context.key = nextTweenKey++;
            this.tweenMap.set(context.key, context);
            context.on('complete', this.onTweenComplete);
            return this;
        }
        /**
         * Starts the update loop.
         */
        start() {
            if (this.isRunning) {
                return;
            }
            pixi_js.Ticker.shared.add(this.onUpdate);
            this.isRunning = true;
        }
        /**
         * Stops the update loop. This will prevent tweens from getting updated.
         */
        stop() {
            if (!this.isRunning) {
                return;
            }
            pixi_js.Ticker.shared.remove(this.onUpdate);
            this.isRunning = false;
        }
    }

    /**
     * @memberof PUXI
     * @typedef {Function} Ease
     * @param {number} t - interpolation parameter (b/w 0 and 1) that increases linearly
     * @returns {numeber} - output interpolation parameter (b/w 0 and 1)
     */
    /**
     * Quadratic ease-in
     *
     * @memberof PUXI
     * @type Ease
     * @param {number} t
     * @returns {number}
     */
    const EaseIn = (t) => t * t;
    /**
     * Quadratic ease-out
     *
     * @memberof PUXI
     * @type Ease
     * @param {number} t
     * @returns {number}
     */
    const EaseOut = (t) => (1 - t) * (1 - t);
    /**
     * Quadratic ease-in & ease-out mixed!
     *
     * @memberof PUXI
     * @type Ease
     * @param {number} t
     * @returns {number}
     */
    const EaseBoth = (t) => ((t <= 0.5)
        ? 2 * t * t
        : ((2 * ((t - 0.5) * (1.5 - t))) + 0.5));

    /**
     * Defines a (linear) interpolator on a type `T`.
     *
     * @memberof PUXI
     * @typedef {Function} Erp
     * @template T
     * @param {T} startValue
     * @param {T} endValue
     * @param {number} t - interpolation parameter between 0 and 1
     * @param {T}[observedValue]
     */
    /**
     * Interpolation function for number properties like alpha, rotation, component
     * position/scale/skew, elevation, etc.
     *
     * @memberof PUXI
     * @extends PUXI.Erp<number>
     * @param {number} startValue
     * @param {number} endValue
     * @param {number} t
     */
    const NumberErp = (startValue, endValue, t) => ((1 - t) * startValue) + (t * endValue);
    /**
     * Interpolation function for 2D vector properties like position, scale, skew, etc.
     *
     * @memberof PUXI
     * @extends PUXI.Erp<PIXI.Point>
     * @param {PIXI.Point} startValue
     * @param {PIXI.Point} endValue
     * @param {number} t
     * @param {PIXI.Point} observedValue
     */
    const PointErp = (startValue, endValue, t, observedValue) => {
        if (!observedValue) {
            observedValue = new pixi_js.Point();
        }
        observedValue.x = ((1 - t) * startValue.x) + (t * endValue.x);
        observedValue.y = ((1 - t) * startValue.y) + (t * endValue.y);
        return observedValue;
    };

    var puxiTween = /*#__PURE__*/Object.freeze({
        __proto__: null,
        EaseBoth: EaseBoth,
        EaseIn: EaseIn,
        EaseOut: EaseOut,
        NumberErp: NumberErp,
        PointErp: PointErp,
        Tween: Tween$1,
        TweenManager: TweenManager,
        get nextTweenKey () { return nextTweenKey; }
    });

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
    exports.Insets = Insets;
    exports.InteractiveGroup = InteractiveGroup;
    exports.LayoutOptions = LayoutOptions;
    exports.ScrollBar = ScrollBar;
    exports.ScrollManager = ScrollManager;
    exports.ScrollWidget = ScrollWidget;
    exports.SliceSprite = SliceSprite;
    exports.Slider = Slider;
    exports.SortableList = SortableList;
    exports.Sprite = Sprite;
    exports.Stage = Stage;
    exports.TextInput = TextInput;
    exports.TextWidget = TextWidget;
    exports.Ticker = Ticker;
    exports.TilingSprite = TilingSprite;
    exports.Widget = Widget;
    exports.WidgetGroup = WidgetGroup;
    exports.create = create;
    exports.tween = puxiTween;
    exports.wrapEase = wrapEase;

    return exports;

}({}, PIXI, __filters));
Object.assign(this.PUXI, puxi_js)
//# sourceMappingURL=puxi.js.map
