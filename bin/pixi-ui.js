(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('pixi.js')) :
    typeof define === 'function' && define.amd ? define(['exports', 'pixi.js'], factory) :
    (global = global || self, factory(global['pixi-ui'] = {}, global.PIXI));
}(this, (function (exports, PIXI$1) { 'use strict';

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
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    /**
     * Layout and rendering configuration for a `PIXI.UI.UIBase`.
     *
     * @class
     * @memberof PIXI.UI
     */
    var UISettings = /** @class */ (function () {
        function UISettings() {
            this.width = 0;
            this.height = 0;
            this.minWidth = 0;
            this.minHeight = 0;
            this.maxWidth = null;
            this.maxHeight = null;
            this.left = null;
            this.right = null;
            this.top = null;
            this.bottom = null;
            this.anchorLeft = null;
            this.anchorRight = null;
            this.anchorTop = null;
            this.anchorBottom = null;
            this.widthPct = null;
            this.heightPct = null;
            this.minWidthPct = null;
            this.minHeightPct = null;
            this.maxWidthPct = null;
            this.maxHeightPct = null;
            this.leftPct = null;
            this.rightPct = null;
            this.topPct = null;
            this.bottomPct = null;
            this.anchorLeftPct = null;
            this.anchorRightPct = null;
            this.anchorTopPct = null;
            this.anchorBottomPct = null;
            this.pivotX = 0;
            this.pivotY = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.verticalAlign = null;
            this.horizontalAlign = null;
            this.rotation = null;
            this.blendMode = null;
            this.tint = null;
            this.alpha = 1;
            this.draggable = null;
            this.dragRestricted = false;
            this.dragRestrictAxis = null; // x, y
            this.dragThreshold = 0;
            this.dragGroup = null;
            this.dragContainer = null;
            this.droppable = null;
            this.droppableReparent = null;
            this.dropGroup = null;
        }
        return UISettings;
    }());

    var DragEvent = /** @class */ (function () {
        function DragEvent(obj) {
            var _this = this;
            this._onDragStart = function (e) {
                var _a = _this, obj = _a.obj, start = _a.start, _onDragMove = _a._onDragMove, _onDragEnd = _a._onDragEnd;
                _this.id = e.data.identifier;
                _this.onPress.call(obj, e, true);
                if (!_this.bound) {
                    start.copyFrom(e.data.global);
                    obj.stage.on('mousemove', _onDragMove);
                    obj.stage.on('touchmove', _onDragMove);
                    obj.stage.on('mouseup', _onDragEnd);
                    obj.stage.on('mouseupoutside', _onDragEnd);
                    obj.stage.on('touchend', _onDragEnd);
                    obj.stage.on('touchendoutside', _onDragEnd);
                    obj.stage.on('touchcancel', _onDragEnd);
                    _this.bound = true;
                }
                e.data.originalEvent.preventDefault();
            };
            this._onDragMove = function (e) {
                if (e.data.identifier !== _this.id) {
                    return;
                }
                var _a = _this, mouse = _a.mouse, offset = _a.offset, start = _a.start, obj = _a.obj;
                mouse.copyFrom(e.data.global);
                offset.set(mouse.x - start.x, mouse.y - start.y);
                if (!_this.dragging) {
                    _this.movementX = Math.abs(offset.x);
                    _this.movementY = Math.abs(offset.y);
                    if ((_this.movementX === 0 && _this.movementY === 0)
                        || Math.max(_this.movementX, _this.movementY) < obj.dragThreshold) {
                        return; // thresshold
                    }
                    if (obj.dragRestrictAxis !== null) {
                        _this.cancel = false;
                        if (obj.dragRestrictAxis === 'x' && _this.movementY > _this.movementX) {
                            _this.cancel = true;
                        }
                        else if (obj.dragRestrictAxis === 'y' && _this.movementY <= _this.movementX) {
                            _this.cancel = true;
                        }
                        if (_this.cancel) {
                            _this._onDragEnd(e);
                            return;
                        }
                    }
                    _this.onDragStart.call(obj, e);
                    _this.dragging = true;
                }
                _this.onDragMove.call(obj, e, offset);
            };
            this._onDragEnd = function (e) {
                if (e.data.identifier !== _this.id) {
                    return;
                }
                var _a = _this, obj = _a.obj, _onDragMove = _a._onDragMove, _onDragEnd = _a._onDragEnd;
                if (_this.bound) {
                    obj.stage.removeListener('mousemove', _onDragMove);
                    obj.stage.removeListener('touchmove', _onDragMove);
                    obj.stage.removeListener('mouseup', _onDragEnd);
                    obj.stage.removeListener('mouseupoutside', _onDragEnd);
                    obj.stage.removeListener('touchend', _onDragEnd);
                    obj.stage.removeListener('touchendoutside', _onDragEnd);
                    obj.stage.removeListener('touchcancel', _onDragEnd);
                    _this.dragging = false;
                    _this.bound = false;
                    _this.onDragEnd.call(obj, e);
                    _this.onPress.call(obj, e, false);
                }
            };
            this.bound = false;
            this.start = new PIXI$1.Point();
            this.offset = new PIXI$1.Point();
            this.mouse = new PIXI$1.Point();
            this.movementX = 0;
            this.movementY = 0;
            this.cancel = false;
            this.dragging = false;
            this.id = 0;
            this.obj = obj;
            this.obj.container.interactive = true;
            this.startEvent();
        }
        DragEvent.prototype.stopEvent = function () {
            var _a = this, obj = _a.obj, _onDragStart = _a._onDragStart, _onDragMove = _a._onDragMove, _onDragEnd = _a._onDragEnd;
            if (this.bound) {
                obj.stage.removeListener('mousemove', _onDragMove);
                obj.stage.removeListener('touchmove', _onDragMove);
                obj.stage.removeListener('mouseup', _onDragEnd);
                obj.stage.removeListener('mouseupoutside', _onDragEnd);
                obj.stage.removeListener('touchend', _onDragEnd);
                obj.stage.removeListener('touchendoutside', _onDragEnd);
                this.bound = false;
            }
            obj.container.removeListener('mousedown', _onDragStart);
            obj.container.removeListener('touchstart', _onDragStart);
        };
        DragEvent.prototype.startEvent = function () {
            var _a = this, obj = _a.obj, _onDragStart = _a._onDragStart;
            obj.container.on('mousedown', _onDragStart);
            obj.container.on('touchstart', _onDragStart);
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        DragEvent.prototype.onPress = function (e, isPressed) {
            // Default onPress
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        DragEvent.prototype.onDragStart = function (e) {
            // Default onDragStart
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        DragEvent.prototype.onDragMove = function (e, offset) {
            // Default onDragMove
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        DragEvent.prototype.onDragEnd = function (e) {
            // Default onDragEnd
        };
        return DragEvent;
    }());

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
     * Base class of all UIObjects
     *
     * @class
     * @extends PIXI.UI.UIBase
     * @param width {Number} Width of the UIObject
     * @param height {Number} Height of the UIObject
     */
    var UIBase = /** @class */ (function (_super) {
        __extends(UIBase, _super);
        function UIBase(width, height) {
            var _this = _super.call(this) || this;
            _this.container = new PIXI$1.Container();
            _this.setting = new UISettings();
            _this.children = [];
            _this.stage = null;
            _this.initialized = false;
            _this.dragInitialized = false;
            _this.dropInitialized = false;
            _this.dirty = true;
            _this._oldWidth = -1;
            _this._oldHeight = -1;
            _this.pixelPerfect = true;
            if (width && isNaN(width) && width.indexOf('%') != -1) {
                _this.setting.widthPct = parseFloat(width.replace('%', '')) * 0.01;
            }
            else {
                _this.setting.widthPct = null;
            }
            if (height && isNaN(height) && height.indexOf('%') != -1) {
                _this.setting.heightPct = parseFloat(height.replace('%', '')) * 0.01;
            }
            else {
                _this.setting.heightPct = null;
            }
            _this.setting.width = width || 0;
            _this.setting.height = height || 0;
            // actual values
            _this._width = 0;
            _this._height = 0;
            _this._minWidth = null;
            _this._minHeight = null;
            _this._maxWidth = null;
            _this._maxHeight = null;
            _this._anchorLeft = null;
            _this._anchorRight = null;
            _this._anchorTop = null;
            _this._anchorBottom = null;
            _this._left = null;
            _this._right = null;
            _this._top = null;
            _this._bottom = null;
            _this._dragPosition = null; // used for overriding positions if tweens is playing
            return _this;
        }
        /**
         * Renders the object using the WebGL renderer
         *
         * @private
         */
        UIBase.prototype.updatesettings = function (updateChildren, updateParent) {
            if (!this.initialized) {
                if (this.parent !== null && this.parent.stage !== null && this.parent.initialized) {
                    this.initialize();
                }
                else {
                    return;
                }
            }
            if (updateParent) {
                this.updateParent();
            }
            this.baseupdate();
            this.update();
            if (updateChildren) {
                this.updateChildren();
            }
        };
        /**
         * Updates the parent
         *
         * @private
         */
        UIBase.prototype.updateParent = function () {
            if (this.parent !== null) {
                if (this.parent.updatesettings) {
                    this.parent.updatesettings(false, true);
                }
            }
        };
        /**
         * Updates the UIObject with all base settings
         *
         * @private
         */
        UIBase.prototype.baseupdate = function () {
            // return if parent size didnt change
            if (this.parent !== null) {
                var parentHeight = void 0;
                var parentWidth = void 0;
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
                var pivotXOffset = this.pivotX * this._width;
                var pivotYOffset = this.pivotY * this._height;
                if (this.pixelPerfect) {
                    pivotXOffset = Math.round(pivotXOffset);
                    pivotYOffset = Math.round(pivotYOffset);
                }
                if (this.horizontalAlign === null) {
                    // get anchors (use left right if conflict)
                    if (this._anchorLeft !== null && this._anchorRight === null && this._right !== null) {
                        this._anchorRight = this._right;
                    }
                    else if (this._anchorLeft === null && this._anchorRight !== null && this._left !== null) {
                        this._anchorLeft = this._left;
                    }
                    else if (this._anchorLeft === null && this._anchorRight === null && this._left !== null && this._right !== null) {
                        this._anchorLeft = this._left;
                        this._anchorRight = this._right;
                    }
                    var useHorizontalAnchor = this._anchorLeft !== null || this._anchorRight !== null;
                    var useLeftRight = !useHorizontalAnchor && (this._left !== null || this._right !== null);
                    if (useLeftRight) {
                        if (this._left !== null) {
                            this.container.position.x = this._left;
                        }
                        else if (this._right !== null) {
                            this.container.position.x = parentWidth - this._right;
                        }
                    }
                    else if (useHorizontalAnchor) {
                        if (this._anchorLeft !== null && this._anchorRight === null) {
                            this.container.position.x = this._anchorLeft;
                        }
                        else if (this._anchorLeft === null && this._anchorRight !== null) {
                            this.container.position.x = parentWidth - this._width - this._anchorRight;
                        }
                        else if (this._anchorLeft !== null && this._anchorRight !== null) {
                            this.container.position.x = this._anchorLeft;
                            this._width = parentWidth - this._anchorLeft - this._anchorRight;
                        }
                        this.container.position.x += pivotXOffset;
                    }
                    else {
                        this.container.position.x = 0;
                    }
                }
                if (this.verticalAlign === null) {
                    // get anchors (use top bottom if conflict)
                    if (this._anchorTop !== null && this._anchorBottom === null && this._bottom !== null) {
                        this._anchorBottom = this._bottom;
                    }
                    if (this._anchorTop === null && this._anchorBottom !== null && this._top !== null) {
                        this._anchorTop = this._top;
                    }
                    var useVerticalAnchor = this._anchorTop !== null || this._anchorBottom !== null;
                    var useTopBottom = !useVerticalAnchor && (this._top !== null || this._bottom !== null);
                    if (useTopBottom) {
                        if (this._top !== null) {
                            this.container.position.y = this._top;
                        }
                        else if (this._bottom !== null) {
                            this.container.position.y = parentHeight - this._bottom;
                        }
                    }
                    else if (useVerticalAnchor) {
                        if (this._anchorTop !== null && this._anchorBottom === null) {
                            this.container.position.y = this._anchorTop;
                        }
                        else if (this._anchorTop === null && this._anchorBottom !== null) {
                            this.container.position.y = parentHeight - this._height - this._anchorBottom;
                        }
                        else if (this._anchorTop !== null && this._anchorBottom !== null) {
                            this.container.position.y = this._anchorTop;
                            this._height = parentHeight - this._anchorTop - this._anchorBottom;
                        }
                        this.container.position.y += pivotYOffset;
                    }
                    else {
                        this.container.position.y = 0;
                    }
                }
                // min/max sizes
                if (this._maxWidth !== null && this._width > this._maxWidth)
                    this._width = this._maxWidth;
                if (this._width < this._minWidth)
                    this._width = this._minWidth;
                if (this._maxHeight !== null && this._height > this._maxHeight)
                    this._height = this._maxHeight;
                if (this._height < this._minHeight)
                    this._height = this._minHeight;
                // pure vertical/horizontal align
                if (this.horizontalAlign !== null) {
                    if (this.horizontalAlign == 'center') {
                        this.container.position.x = parentWidth * 0.5 - this._width * 0.5;
                    }
                    else if (this.horizontalAlign == 'right') {
                        this.container.position.x = parentWidth - this._width;
                    }
                    else {
                        this.container.position.x = 0;
                    }
                    this.container.position.x += pivotXOffset;
                }
                if (this.verticalAlign !== null) {
                    if (this.verticalAlign == 'middle') {
                        this.container.position.y = parentHeight * 0.5 - this._height * 0.5;
                    }
                    else if (this.verticalAlign == 'bottom') {
                        this.container.position.y = parentHeight - this._height;
                    }
                    else {
                        this.container.position.y = 0;
                    }
                    this.container.position.y += pivotYOffset;
                }
                // Unrestricted dragging
                if (this.dragging && !this.setting.dragRestricted) {
                    this.container.position.x = this._dragPosition.x;
                    this.container.position.y = this._dragPosition.y;
                }
                // scale
                if (this.setting.scaleX !== null)
                    this.container.scale.x = this.setting.scaleX;
                if (this.setting.scaleY !== null)
                    this.container.scale.y = this.setting.scaleY;
                // pivot
                if (this.setting.pivotX !== null)
                    this.container.pivot.x = pivotXOffset;
                if (this.setting.pivotY !== null)
                    this.container.pivot.y = pivotYOffset;
                if (this.setting.alpha !== null)
                    this.container.alpha = this.setting.alpha;
                if (this.setting.rotation !== null)
                    this.container.rotation = this.setting.rotation;
                // make pixel perfect
                if (this.pixelPerfect) {
                    this._width = Math.round(this._width);
                    this._height = Math.round(this._height);
                    this.container.position.x = Math.round(this.container.position.x);
                    this.container.position.y = Math.round(this.container.position.y);
                }
            }
        };
        /**
         * Updates all UI Children
         *
         * @private
         */
        UIBase.prototype.updateChildren = function () {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].updatesettings(true);
            }
        };
        UIBase.prototype.addChild = function (UIObject) {
            var argumentsLength = arguments.length;
            if (argumentsLength > 1) {
                for (var i = 0; i < argumentsLength; i++) {
                    this.addChild(arguments[i]);
                }
            }
            else {
                if (UIObject.parent) {
                    UIObject.parent.removeChild(UIObject);
                }
                UIObject.parent = this;
                this.container.addChild(UIObject.container);
                this.children.push(UIObject);
                this.updatesettings(true, true);
            }
            return UIObject;
        };
        UIBase.prototype.removeChild = function (UIObject) {
            var argumentLenght = arguments.length;
            if (argumentLenght > 1) {
                for (var i = 0; i < argumentLenght; i++) {
                    this.removeChild(arguments[i]);
                }
            }
            else {
                var index = this.children.indexOf(UIObject);
                if (index !== -1) {
                    var oldUIParent_1 = UIObject.parent;
                    var oldParent = UIObject.container.parent;
                    UIObject.container.parent.removeChild(UIObject.container);
                    this.children.splice(index, 1);
                    UIObject.parent = null;
                    // oldParent._recursivePostUpdateTransform();
                    setTimeout(function () {
                        if (oldUIParent_1.updatesettings) {
                            oldUIParent_1.updatesettings(true, true);
                        }
                    }, 0);
                }
            }
        };
        /**
         * Initializes the object when its added to an UIStage
         *
         * @private
         */
        UIBase.prototype.initialize = function () {
            this.initialized = true;
            this.stage = this.parent.stage;
            if (this.draggable) {
                this.initDraggable();
            }
            if (this.droppable) {
                this.initDroppable();
            }
        };
        UIBase.prototype.clearDraggable = function () {
            if (this.dragInitialized) {
                this.dragInitialized = false;
                this.drag.stopEvent();
            }
        };
        UIBase.prototype.initDraggable = function () {
            if (!this.dragInitialized) {
                this.dragInitialized = true;
                var containerStart_1 = new PIXI$1.Point();
                var stageOffset_1 = new PIXI$1.Point();
                var self_1 = this;
                this._dragPosition = new PIXI$1.Point();
                this.drag = new DragEvent(this);
                this.drag.onDragStart = function (e) {
                    var added = DragDropController.add(this, e);
                    if (!this.dragging && added) {
                        this.dragging = true;
                        this.container.interactive = false;
                        containerStart_1.copy(this.container.position);
                        if (this.dragContainer) {
                            var c = this.dragContainer.container ? this.dragContainer.container : this.dragContainer;
                            if (c) {
                                // _this.container._recursivePostUpdateTransform();
                                stageOffset_1.set(c.worldTransform.tx - this.parent.container.worldTransform.tx, c.worldTransform.ty - this.parent.container.worldTransform.ty);
                                c.addChild(this.container);
                            }
                        }
                        else {
                            stageOffset_1.set(0);
                        }
                        this.emit('draggablestart', e);
                    }
                };
                this.drag.onDragMove = function (e, offset) {
                    if (this.dragging) {
                        this._dragPosition.set(containerStart_1.x + offset.x - stageOffset_1.x, containerStart_1.y + offset.y - stageOffset_1.y);
                        this.x = this._dragPosition.x;
                        this.y = this._dragPosition.y;
                        this.emit('draggablemove', e);
                    }
                };
                this.drag.onDragEnd = function (e) {
                    if (this.dragging) {
                        this.dragging = false;
                        // Return to container after 0ms if not picked up by a droppable
                        setTimeout(function () {
                            self_1.container.interactive = true;
                            var item = DragDropController.getItem(self_1);
                            if (item) {
                                var container = self_1.parent === self_1.stage ? self_1.stage : self_1.parent.container;
                                container.toLocal(self_1.container.position, self_1.container.parent, self_1);
                                if (container != self_1.container) {
                                    self_1.parent.addChild(self_1);
                                }
                            }
                            self_1.emit('draggableend', e);
                        }, 0);
                    }
                };
            }
        };
        UIBase.prototype.clearDroppable = function () {
            if (this.dropInitialized) {
                this.dropInitialized = false;
                this.container.removeListener('mouseup', this.onDrop);
                this.container.removeListener('touchend', this.onDrop);
            }
        };
        UIBase.prototype.initDroppable = function () {
            if (!this.dropInitialized) {
                this.dropInitialized = true;
                var container = this.container;
                var self_2 = this;
                this.container.interactive = true;
                this.onDrop = function (event) {
                    var item = DragDropController.getEventItem(event, self_2.dropGroup);
                    if (item && item.dragging) {
                        item.dragging = false;
                        item.container.interactive = true;
                        var parent = self_2.droppableReparent !== null ? self_2.droppableReparent : self_2;
                        parent.container.toLocal(item.container.position, item.container.parent, item);
                        if (parent.container != item.container.parent) {
                            parent.addChild(item);
                        }
                    }
                };
                container.on('mouseup', this.onDrop);
                container.on('touchend', this.onDrop);
            }
        };
        Object.defineProperty(UIBase.prototype, "x", {
            get: function () {
                return this.setting.left;
            },
            set: function (val) {
                this.left = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "y", {
            get: function () {
                return this.setting.top;
            },
            set: function (val) {
                this.top = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "width", {
            get: function () {
                return this.setting.width;
            },
            set: function (val) {
                if (isNaN(val) && val.indexOf('%') !== -1) {
                    this.setting.widthPct = parseFloat(val.replace('%', '')) * 0.01;
                }
                else {
                    this.setting.widthPct = null;
                }
                this.setting.width = val;
                this.updatesettings(true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "actual_width", {
            get: function () {
                if (this.dirty) {
                    if (this.setting.widthPct !== null) {
                        this._width = this.parent._width * this.setting.widthPct;
                    }
                    else {
                        this._width = this.setting.width;
                    }
                }
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "height", {
            get: function () {
                return this.setting.height;
            },
            set: function (val) {
                if (isNaN(val) && val.indexOf('%') !== -1) {
                    this.setting.heightPct = parseFloat(val.replace('%', '')) * 0.01;
                }
                else {
                    this.setting.heightPct = null;
                }
                this.setting.height = val;
                this.updatesettings(true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "actual_height", {
            get: function () {
                if (this.dirty) {
                    if (this.setting.heightPct !== null) {
                        this._height = this.parent._height * this.setting.heightPct;
                    }
                    else {
                        this._height = this.setting.height;
                    }
                }
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "minWidth", {
            get: function () {
                return this.setting.minWidth;
            },
            set: function (val) {
                if (isNaN(val) && val.indexOf('%') !== -1) {
                    this.setting.minWidthPct = parseFloat(val.replace('%', '')) * 0.01;
                }
                else {
                    this.setting.minWidthPct = null;
                }
                this.setting.minWidth = val;
                this.updatesettings(true);
            },
            enumerable: true,
            configurable: true
        });
        UIBase.prototype.actual_minWidth = function () {
            if (this.dirty) {
                if (this.setting.minWidthPct !== null) {
                    this._minWidth = this.parent._width * this.setting.minWidthPct;
                }
                else {
                    this._minWidth = this.setting.minWidth;
                }
            }
            return this._minWidth;
        };
        Object.defineProperty(UIBase.prototype, "minHeight", {
            get: function () {
                return this.setting.minHeight;
            },
            set: function (val) {
                if (isNaN(val) && val.indexOf('%') !== -1) {
                    this.setting.minHeightPct = parseFloat(val.replace('%', '')) * 0.01;
                }
                else {
                    this.setting.minHeightPct = null;
                }
                this.setting.minHeight = val;
                this.updatesettings(true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "actual_minHeight", {
            get: function () {
                if (this.dirty) {
                    if (this.setting.minHeightPct !== null) {
                        this._minHeight = this.parent._height * this.setting.minHeightPct;
                    }
                    else {
                        this._minHeight = this.setting.minHeight;
                    }
                }
                return this._minHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "maxWidth", {
            get: function () {
                return this.setting.maxWidth;
            },
            set: function (val) {
                if (isNaN(val) && val.indexOf('%') !== -1) {
                    this.setting.maxWidthPct = parseFloat(val.replace('%', '')) * 0.01;
                }
                else {
                    this.setting.maxWidthPct = null;
                }
                this.setting.maxWidth = val;
                this.updatesettings(true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "actual_maxWidth", {
            get: function () {
                if (this.dirty) {
                    if (this.setting.maxWidthPct !== null) {
                        this._maxWidth = this.parent._width * this.setting.maxWidthPct;
                    }
                    else {
                        this._maxWidth = this.setting.maxWidth;
                    }
                }
                return this._maxWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "maxHeight", {
            get: function () {
                return this.setting.maxHeight;
            },
            set: function (val) {
                if (isNaN(val) && val.indexOf('%') !== -1) {
                    this.setting.maxHeightPct = parseFloat(val.replace('%', '')) * 0.01;
                }
                else {
                    this.setting.maxHeightPct = null;
                }
                this.setting.maxHeight = val;
                this.updatesettings(true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "actual_maxHeight", {
            get: function () {
                if (this.dirty) {
                    if (this.setting.maxHeightPct !== null) {
                        this._maxHeight = this.parent._height * this.setting.maxHeightPct;
                    }
                    else {
                        this._maxHeight = this.setting.maxHeight;
                    }
                }
                return this._maxHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "anchorLeft", {
            get: function () {
                return this.setting.anchorLeft;
            },
            set: function (val) {
                if (isNaN(val) && val.indexOf('%') !== -1) {
                    this.setting.anchorLeftPct = parseFloat(val.replace('%', '')) * 0.01;
                }
                else {
                    this.setting.anchorLeftPct = null;
                }
                this.setting.anchorLeft = val;
                this.updatesettings(true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "actual_anchorLeft", {
            get: function () {
                if (this.dirty) {
                    if (this.setting.anchorLeftPct !== null) {
                        this._anchorLeft = this.parent._width * this.setting.anchorLeftPct;
                    }
                    else {
                        this._anchorLeft = this.setting.anchorLeft;
                    }
                }
                return this._anchorLeft;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "anchorRight", {
            get: function () {
                return this.setting.anchorRight;
            },
            set: function (val) {
                if (isNaN(val) && val.indexOf('%') !== -1) {
                    this.setting.anchorRightPct = parseFloat(val.replace('%', '')) * 0.01;
                }
                else {
                    this.setting.anchorRightPct = null;
                }
                this.setting.anchorRight = val;
                this.updatesettings(true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "actual_anchorRight", {
            get: function () {
                if (this.dirty) {
                    if (this.setting.anchorRightPct !== null) {
                        this._anchorRight = this.parent._width * this.setting.anchorRightPct;
                    }
                    else {
                        this._anchorRight = this.setting.anchorRight;
                    }
                }
                return this._anchorRight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "anchorTop", {
            get: function () {
                return this.setting.anchorTop;
            },
            set: function (val) {
                if (isNaN(val) && val.indexOf('%') !== -1) {
                    this.setting.anchorTopPct = parseFloat(val.replace('%', '')) * 0.01;
                }
                else {
                    this.setting.anchorTopPct = null;
                }
                this.setting.anchorTop = val;
                this.updatesettings(true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "actual_anchorTop", {
            get: function () {
                if (this.dirty) {
                    if (this.setting.anchorTopPct !== null) {
                        this._anchorTop = this.parent._height * this.setting.anchorTopPct;
                    }
                    else {
                        this._anchorTop = this.setting.anchorTop;
                    }
                }
                return this._anchorTop;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "anchorBottom", {
            get: function () {
                return this.setting.anchorBottom;
            },
            set: function (val) {
                if (isNaN(val) && val.indexOf('%') !== -1) {
                    this.setting.anchorBottomPct = parseFloat(val.replace('%', '')) * 0.01;
                }
                else {
                    this.setting.anchorBottomPct = null;
                }
                this.setting.anchorBottom = val;
                this.updatesettings(true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "actual_anchorBottom", {
            get: function () {
                if (this.dirty) {
                    if (this.setting.anchorBottomPct !== null) {
                        this._anchorBottom = this.parent._height * this.setting.anchorBottomPct;
                    }
                    else {
                        this._anchorBottom = this.setting.anchorBottom;
                    }
                }
                return this._anchorBottom;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "left", {
            get: function () {
                return this.setting.left;
            },
            set: function (val) {
                if (isNaN(val) && val.indexOf('%') !== -1) {
                    this.setting.leftPct = parseFloat(val.replace('%', '')) * 0.01;
                }
                else {
                    this.setting.leftPct = null;
                }
                this.setting.left = val;
                this.updatesettings(true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "actual_left", {
            get: function () {
                if (this.dirty) {
                    if (this.setting.leftPct !== null) {
                        this._left = this.parent._width * this.setting.leftPct;
                    }
                    else {
                        this._left = this.setting.left;
                    }
                }
                return this._left;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "right", {
            get: function () {
                return this.setting.right;
            },
            set: function (val) {
                if (isNaN(val) && val.indexOf('%') !== -1) {
                    this.setting.rightPct = parseFloat(val.replace('%', '')) * 0.01;
                }
                else {
                    this.setting.rightPct = null;
                }
                this.setting.right = val;
                this.updatesettings(true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "actual_right", {
            get: function () {
                if (this.dirty) {
                    if (this.setting.rightPct !== null) {
                        this._right = this.parent._width * this.setting.rightPct;
                    }
                    else {
                        this._right = this.setting.right;
                    }
                }
                return this._right;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "top", {
            get: function () {
                return this.setting.top;
            },
            set: function (val) {
                if (isNaN(val) && val.indexOf('%') !== -1) {
                    this.setting.topPct = parseFloat(val.replace('%', '')) * 0.01;
                }
                else {
                    this.setting.topPct = null;
                }
                this.setting.top = val;
                this.updatesettings(true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "actual_top", {
            get: function () {
                if (this.dirty) {
                    if (this.setting.topPct !== null) {
                        this._top = this.parent._height * this.setting.topPct;
                    }
                    else {
                        this._top = this.setting.top;
                    }
                }
                return this._top;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "bottom", {
            get: function () {
                return this.setting.bottom;
            },
            set: function (val) {
                if (isNaN(val) && val.indexOf('%') !== -1) {
                    this.setting.bottomPct = parseFloat(val.replace('%', '')) * 0.01;
                }
                else {
                    this.setting.bottomPct = null;
                }
                this.setting.bottom = val;
                this.updatesettings(true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "actual_bottom", {
            get: function () {
                if (this.dirty) {
                    if (this.setting.bottomPct !== null) {
                        this._bottom = this.parent._height * this.setting.bottomPct;
                    }
                    else {
                        this._bottom = this.setting.bottom;
                    }
                }
                return this._bottom;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "verticalAlign", {
            get: function () {
                return this.setting.verticalAlign;
            },
            set: function (val) {
                this.setting.verticalAlign = val;
                this.baseupdate();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "valign", {
            get: function () {
                return this.setting.verticalAlign;
            },
            set: function (val) {
                this.setting.verticalAlign = val;
                this.baseupdate();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "horizontalAlign", {
            get: function () {
                return this.setting.horizontalAlign;
            },
            set: function (val) {
                this.setting.horizontalAlign = val;
                this.baseupdate();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "align", {
            get: function () {
                return this.setting.horizontalAlign;
            },
            set: function (val) {
                this.setting.horizontalAlign = val;
                this.baseupdate();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "tint", {
            get: function () {
                return this.setting.tint;
            },
            set: function (val) {
                this.setting.tint = val;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "alpha", {
            get: function () {
                return this.setting.alpha;
            },
            set: function (val) {
                this.setting.alpha = val;
                this.container.alpha = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "rotation", {
            get: function () {
                return this.setting.rotation;
            },
            set: function (val) {
                this.setting.rotation = val;
                this.container.rotation = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "blendMode", {
            get: function () {
                return this.setting.blendMode;
            },
            set: function (val) {
                this.setting.blendMode = val;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "pivotX", {
            get: function () {
                return this.setting.pivotX;
            },
            set: function (val) {
                this.setting.pivotX = val;
                this.baseupdate();
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "pivotY", {
            get: function () {
                return this.setting.pivotY;
            },
            set: function (val) {
                this.setting.pivotY = val;
                this.baseupdate();
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "pivot", {
            set: function (val) {
                this.setting.pivotX = val;
                this.setting.pivotY = val;
                this.baseupdate();
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "scaleX", {
            get: function () {
                return this.setting.scaleX;
            },
            set: function (val) {
                this.setting.scaleX = val;
                this.container.scale.x = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "scaleY", {
            get: function () {
                return this.setting.scaleY;
            },
            set: function (val) {
                this.setting.scaleY = val;
                this.container.scale.y = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "scale", {
            get: function () {
                return this.setting.scaleX;
            },
            set: function (val) {
                this.setting.scaleX = val;
                this.setting.scaleY = val;
                this.container.scale.x = val;
                this.container.scale.y = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "draggable", {
            get: function () {
                return this.setting.draggable;
            },
            set: function (val) {
                this.setting.draggable = val;
                if (this.initialized) {
                    if (val) {
                        this.initDraggable();
                    }
                    else {
                        this.clearDraggable();
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "dragRestricted", {
            get: function () {
                return this.setting.dragRestricted;
            },
            set: function (val) {
                this.setting.dragRestricted = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "dragRestrictAxis", {
            get: function () {
                return this.setting.dragRestrictAxis;
            },
            set: function (val) {
                this.setting.dragRestrictAxis = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "dragThreshold", {
            get: function () {
                return this.setting.dragThreshold;
            },
            set: function (val) {
                this.setting.dragThreshold = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "dragGroup", {
            get: function () {
                return this.setting.dragGroup;
            },
            set: function (val) {
                this.setting.dragGroup = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "dragContainer", {
            get: function () {
                return this.setting.dragContainer;
            },
            set: function (val) {
                this.setting.dragContainer = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "droppable", {
            get: function () {
                return this.setting.droppable;
            },
            set: function (val) {
                this.setting.droppable = true;
                if (this.initialized) {
                    if (val) {
                        this.initDroppable();
                    }
                    else {
                        this.clearDroppable();
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "droppableReparent", {
            get: function () {
                return this.setting.droppableReparent;
            },
            set: function (val) {
                this.setting.droppableReparent = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "dropGroup", {
            get: function () {
                return this.setting.dropGroup;
            },
            set: function (val) {
                this.setting.dropGroup = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "renderable", {
            get: function () {
                return this.container.renderable;
            },
            set: function (val) {
                this.container.renderable = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "visible", {
            get: function () {
                return this.container.visible;
            },
            set: function (val) {
                this.container.visible = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "cacheAsBitmap", {
            get: function () {
                return this.container.cacheAsBitmap;
            },
            set: function (val) {
                this.container.cacheAsBitmap = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "onClick", {
            get: function () {
                return this.container.click;
            },
            set: function (val) {
                this.container.click = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "interactive", {
            get: function () {
                return this.container.interactive;
            },
            set: function (val) {
                this.container.interactive = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "interactiveChildren", {
            get: function () {
                return this.container.interactiveChildren;
            },
            set: function (val) {
                this.container.interactiveChildren = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBase.prototype, "parentLayer", {
            get: function () {
                return this.container.parentLayer;
            },
            set: function (val) {
                this.container.parentLayer = val;
            },
            enumerable: true,
            configurable: true
        });
        return UIBase;
    }(PIXI$1.utils.EventEmitter));

    var ClickEvent = /** @class */ (function () {
        function ClickEvent(obj, includeHover, rightMouseButton, doubleClick) {
            var _this = this;
            this._onMouseDown = function (event) {
                var _a = _this, obj = _a.obj, eventname_mouseup = _a.eventname_mouseup, _onMouseUp = _a._onMouseUp, eventname_mouseupoutside = _a.eventname_mouseupoutside, _onMouseUpOutside = _a._onMouseUpOutside, right = _a.right;
                _this.mouse.copyFrom(event.data.global);
                _this.id = event.data.identifier;
                _this.onPress.call(_this.obj, event, true);
                if (!_this.bound) {
                    obj.container.on(eventname_mouseup, _onMouseUp);
                    obj.container.on(eventname_mouseupoutside, _onMouseUpOutside);
                    if (!right) {
                        obj.container.on('touchend', _onMouseUp);
                        obj.container.on('touchendoutside', _onMouseUpOutside);
                    }
                    _this.bound = true;
                }
                if (_this.double) {
                    var now = performance.now();
                    if (now - _this.time < 210) {
                        _this.onClick.call(obj, event);
                    }
                    else {
                        _this.time = now;
                    }
                }
                event.data.originalEvent.preventDefault();
            };
            this._mouseUpAll = function (event) {
                var _a = _this, obj = _a.obj, eventname_mouseup = _a.eventname_mouseup, _onMouseUp = _a._onMouseUp, eventname_mouseupoutside = _a.eventname_mouseupoutside, _onMouseUpOutside = _a._onMouseUpOutside;
                if (event.data.identifier !== _this.id) {
                    return;
                }
                _this.offset.set(event.data.global.x - _this.mouse.x, event.data.global.y - _this.mouse.y);
                if (_this.bound) {
                    obj.container.removeListener(eventname_mouseup, _onMouseUp);
                    obj.container.removeListener(eventname_mouseupoutside, _onMouseUpOutside);
                    if (!_this.right) {
                        obj.container.removeListener('touchend', _onMouseUp);
                        obj.container.removeListener('touchendoutside', _onMouseUpOutside);
                    }
                    _this.bound = false;
                }
                _this.onPress.call(obj, event, false);
            };
            this._onMouseUp = function (event) {
                if (event.data.identifier !== _this.id) {
                    return;
                }
                _this._mouseUpAll(event);
                // prevent clicks with scrolling/dragging objects
                if (_this.obj.dragThreshold) {
                    _this.movementX = Math.abs(_this.offset.x);
                    _this.movementY = Math.abs(_this.offset.y);
                    if (Math.max(_this.movementX, _this.movementY) > _this.obj.dragThreshold) {
                        return;
                    }
                }
                if (!_this.double) {
                    _this.onClick.call(_this.obj, event);
                }
            };
            this._onMouseUpOutside = function (event) {
                if (event.data.identifier !== _this.id) {
                    return;
                }
                _this._mouseUpAll(event);
            };
            this._onMouseOver = function (event) {
                if (!_this.ishover) {
                    _this.ishover = true;
                    _this.obj.container.on('mousemove', _this._onMouseMove);
                    _this.obj.container.on('touchmove', _this._onMouseMove);
                    _this.onHover.call(_this.obj, event, true);
                }
            };
            this._onMouseOut = function (event) {
                if (_this.ishover) {
                    _this.ishover = false;
                    _this.obj.container.removeListener('mousemove', _this._onMouseMove);
                    _this.obj.container.removeListener('touchmove', _this._onMouseMove);
                    _this.onHover.call(_this.obj, event, false);
                }
            };
            this._onMouseMove = function (event) {
                _this.onMove.call(_this.obj, event);
            };
            this.stopEvent = function () {
                var _a = _this, obj = _a.obj, eventname_mouseup = _a.eventname_mouseup, _onMouseUp = _a._onMouseUp, eventname_mouseupoutside = _a.eventname_mouseupoutside, _onMouseUpOutside = _a._onMouseUpOutside, _onMouseDown = _a._onMouseDown, _onMouseOver = _a._onMouseOver, _onMouseOut = _a._onMouseOut, _onMouseMove = _a._onMouseMove;
                if (_this.bound) {
                    obj.container.removeListener(eventname_mouseup, _onMouseUp);
                    obj.container.removeListener(eventname_mouseupoutside, _onMouseUpOutside);
                    if (!_this.right) {
                        obj.container.removeListener('touchend', _onMouseUp);
                        obj.container.removeListener('touchendoutside', _onMouseUpOutside);
                    }
                    _this.bound = false;
                }
                obj.container.removeListener(eventname_mousedown, _onMouseDown);
                if (!_this.right) {
                    obj.container.removeListener('touchstart', _onMouseDown);
                }
                if (_this.hover) {
                    obj.container.removeListener('mouseover', _onMouseOver);
                    obj.container.removeListener('mouseout', _onMouseOut);
                    obj.container.removeListener('mousemove', _onMouseMove);
                    obj.container.removeListener('touchmove', _onMouseMove);
                }
            };
            this.startEvent = function () {
                var _a = _this, obj = _a.obj, eventname_mousedown = _a.eventname_mousedown, _onMouseDown = _a._onMouseDown, _onMouseOver = _a._onMouseOver, _onMouseOut = _a._onMouseOut;
                obj.container.on(eventname_mousedown, _onMouseDown);
                if (!_this.right) {
                    obj.container.on('touchstart', _onMouseDown);
                }
                if (_this.hover) {
                    obj.container.on('mouseover', _onMouseOver);
                    obj.container.on('mouseout', _onMouseOut);
                }
            };
            this.bound = false;
            this.id = 0;
            this.ishover = false;
            this.mouse = new PIXI$1.Point();
            this.offset = new PIXI$1.Point();
            this.movementX = 0;
            this.movementY = 0;
            this.right = typeof rightMouseButton === 'undefined' ? false : rightMouseButton;
            this.hover = typeof includeHover === 'undefined' ? true : includeHover;
            this.double = typeof doubleClick === 'undefined' ? false : doubleClick;
            this.eventname_mousedown = this.right ? 'rightdown' : 'mousedown';
            this.eventname_mouseup = this.right ? 'rightup' : 'mouseup';
            this.eventname_mouseupoutside = this.right ? 'rightupoutside' : 'mouseupoutside';
            obj.container.interactive = true;
            this.time = 0;
            this.startEvent();
        }
        ClickEvent.prototype.onHover = function (event, over) {
        };
        ClickEvent.prototype.onPress = function (event, isPressed) {
        };
        ClickEvent.prototype.onClick = function (event) {
        };
        ClickEvent.prototype.onMove = function (event) {
        };
        return ClickEvent;
    }());

    var _currentItem;
    var tabGroups = {};
    var checkGroups = {};
    var checkGroupValues = {};
    /**
     * Handles focus-management in the scene graph.
     */
    var InputController = {
        registrer: function (item, tabIndex, tabGroup) {
            var groupName = tabGroup || 'default';
            var items = tabGroups[groupName];
            if (!items) {
                items = tabGroups[groupName] = [];
            }
            var i = items.indexOf(item);
            if (i === -1) {
                item._tabIndex = tabIndex !== undefined ? tabIndex : -1;
                item._tabGroup = items;
                items.push(item);
                items.sort(function sorter(a, b) {
                    if (a._tabIndex < b._tabIndex) {
                        return -1;
                    }
                    if (a._tabIndex > b._tabIndex) {
                        return 1;
                    }
                    return 0;
                });
            }
        },
        set: function (item) {
            this.blur();
            _currentItem = item;
        },
        clear: function () {
            _currentItem = undefined;
        },
        blur: function () {
            if (_currentItem && typeof _currentItem.blur === 'function') {
                _currentItem.blur();
            }
        },
        fireTab: function () {
            if (_currentItem) {
                var i = _currentItem._tabGroup.indexOf(_currentItem) + 1;
                if (i >= _currentItem._tabGroup.length)
                    i = 0;
                _currentItem._tabGroup[i].focus();
            }
        },
        fireNext: function () {
            if (_currentItem) {
                var i = _currentItem._tabGroup.indexOf(_currentItem) + 1;
                if (i >= _currentItem._tabGroup.length)
                    i = _currentItem._tabGroup.length - 1;
                _currentItem._tabGroup[i].focus();
            }
        },
        firePrev: function () {
            if (_currentItem) {
                var i = _currentItem._tabGroup.indexOf(_currentItem) - 1;
                if (i < 0)
                    i = 0;
                _currentItem._tabGroup[i].focus();
            }
        },
        registrerCheckGroup: function (cb) {
            var name = cb.checkGroup;
            var group = checkGroups[name];
            if (!group)
                group = checkGroups[name] = {};
            group[cb.value] = cb;
            if (cb.checked) {
                checkGroupValues[name] = cb.value;
            }
        },
        updateCheckGroupSelected: function (cb) {
            var group = checkGroups[cb.checkGroup];
            for (var val in group) {
                var b = group[val];
                if (b !== cb) {
                    b.checked = false;
                }
            }
            checkGroupValues[cb.checkGroup] = cb.value;
        },
        getCheckGroupSelectedValue: function (name) {
            if (checkGroupValues[name]) {
                return checkGroupValues[name];
            }
            return '';
        },
        setCheckGroupSelectedValue: function (name, val) {
            var group = checkGroups[name];
            if (group) {
                var cb = group[val];
                if (cb) {
                    cb.checked = true;
                }
            }
        },
    };

    /**
     * Represents a view that can accept any form of input. It can gain and loose focus.
     *
     * @class
     * @extends PIXI.UI.UIBase
     * @memberof PIXI.UI
     * @param width {number} passed to uibase
     * @param height {number} passed to uibase
     * @param tabIndex {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as background for input
     */
    var InputBase = /** @class */ (function (_super) {
        __extends(InputBase, _super);
        function InputBase(width, height, tabIndex, tabGroup) {
            var _this = _super.call(this, width, height) || this;
            _this.keyDownEvent = function (e) {
                if (e.which === 9) {
                    if (_this._useTab) {
                        InputController.fireTab();
                        e.preventDefault();
                    }
                }
                else if (e.which === 38) {
                    if (_this._usePrev) {
                        InputController.firePrev();
                        e.preventDefault();
                    }
                }
                else if (e.which === 40) {
                    if (_this._useNext) {
                        InputController.fireNext();
                        e.preventDefault();
                    }
                }
            };
            _this.documentMouseDown = function () {
                if (!_this.__down) {
                    _this.blur();
                }
            };
            _this._bindEvents = function () {
                if (_this.stage !== null) {
                    _this.stage.on('pointerdown', _this.documentMouseDown);
                    document.addEventListener('keydown', _this.keyDownEvent);
                }
            };
            _this._clearEvents = function () {
                if (_this.stage !== null) {
                    _this.stage.off('pointerdown', _this.documentMouseDown);
                    document.removeEventListener('keydown', _this.keyDownEvent);
                }
            };
            _this._focused = false;
            _this._useTab = _this._usePrev = _this._useNext = true;
            _this.container.interactive = true;
            InputController.registrer(_this, tabIndex, tabGroup);
            _this.container.on('pointerdown', function (e) {
                _this.focus();
                _this.__down = true;
            });
            _this.container.on('pointerup', function (e) {
                _this.__down = false;
            });
            _this.container.on('pointerupoutside', function (e) {
                _this.__down = false;
            });
            return _this;
        }
        InputBase.prototype.blur = function () {
            if (this._focused) {
                InputController.clear();
                this._focused = false;
                this._clearEvents();
                this.emit('focusChanged', false);
                this.emit('blur');
            }
        };
        InputBase.prototype.focus = function () {
            if (!this._focused) {
                this._focused = true;
                this._bindEvents();
                InputController.set(this);
                this.emit('focusChanged', true);
                this.emit('focus');
            }
        };
        return InputBase;
    }(UIBase));

    /**
     * An UI button object
     *
     * @class
     * @extends PIXI.UI.InputBase
     * @memberof PIXI.UI
     * @param [options.background}] {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as background for Button
     * @param [options.text=null] {PIXI.UI.Text} optional text
     * @param [options.tabIndex=0] {Number} input tab index
     * @param [options.tabGroup=0] {Number|String} input tab group
     * @param [options.width=options.background.width] {Number|String} width
     * @param [options.height=options.background.height] {Number|String} height
     */
    var Button = /** @class */ (function (_super) {
        __extends(Button, _super);
        function Button(options) {
            var _this = _super.call(this, options.width || (options.background ? options.background.width : 100), options.height || (options.background ? options.background.height : 100), options.tabIndex || 0, options.tabGroup || 0) || this;
            _this.background = options.background;
            if (_this.background) {
                _this.background.width = '100%';
                _this.background.height = '100%';
                _this.background.pivot = 0.5;
                _this.background.verticalAlign = 'middle';
                _this.background.horizontalAlign = 'center';
                _this.addChild(_this.background);
            }
            _this.isHover = false;
            _this.uiText = options.text;
            if (_this.uiText) {
                _this.uiText.verticalAlign = 'middle';
                _this.uiText.horizontalAlign = 'center';
                _this.addChild(_this.uiText);
            }
            _this.container.buttonMode = true;
            return _this;
        }
        Button.prototype.setupClick = function () {
            var _this = this;
            var clickEvent = new ClickEvent(this);
            clickEvent.onHover = function (e, over) {
                _this.isHover = over;
                _this.emit('hover', over);
            };
            clickEvent.onPress = function (e, isPressed) {
                if (isPressed) {
                    _this.focus();
                    e.data.originalEvent.preventDefault();
                }
                _this.emit('press', isPressed);
            };
            clickEvent.onClick = function (e) {
                _this.click();
            };
            this.click = function () {
                _this.emit('click');
            };
            this.focus = function () {
                if (!_this._focused) {
                    InputBase.prototype.focus.call(_this);
                    // document.addEventListener("keydown", keyDownEvent, false);
                }
            };
            this.blur = function () {
                if (_this._focused) {
                    InputBase.prototype.blur.call(_this);
                    // document.removeEventListener("keydown", keyDownEvent);
                }
            };
            this.initialize = function () {
                _super.prototype.initialize.call(_this);
                _this.container.interactiveChildren = false;
                // lazy to make sure all children is initialized (trying to get the bedst hitArea possible)
                setTimeout(function () {
                    var bounds = _this.container.getLocalBounds();
                    _this.container.hitArea = new PIXI$1.Rectangle(bounds.x < 0 ? bounds.x : 0, bounds.y < 0 ? bounds.y : 0, Math.max(bounds.x + bounds.width + (bounds.x < 0 ? -bounds.x : 0), _this._width), Math.max(bounds.y + bounds.height + (bounds.y < 0 ? -bounds.y : 0), _this._height));
                }, 20);
            };
        };
        Object.defineProperty(Button.prototype, "value", {
            get: function () {
                if (this.uiText) {
                    return this.uiText.text;
                }
                return '';
            },
            set: function (val) {
                if (this.uiText) {
                    this.uiText.text = val;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "text", {
            get: function () {
                return this.uiText;
            },
            set: function (val) {
                this.value = val;
            },
            enumerable: true,
            configurable: true
        });
        return Button;
    }(InputBase));
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
     * An UI button object
     *
     * @class
     * @extends PIXI.UI.InputBase
     * @memberof PIXI.UI
     * @param [options.checked=false] {bool} is checked
     * @param options.background {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as background for CheckBox
     * @param options.checkmark {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as checkmark for CheckBox
     * @param [options.checkgroup=null] {String} CheckGroup name
     * @param options.value {String} mostly used along with checkgroup
     * @param [options.tabIndex=0] {Number} input tab index
     * @param [options.tabGroup=0] {Number|String} input tab group
     */
    var CheckBox = /** @class */ (function (_super) {
        __extends(CheckBox, _super);
        function CheckBox(options) {
            var _this = _super.call(this, options.background.width, options.background.height, options.tabIndex || 0, options.tabGroup || 0) || this;
            _this._checked = options.checked !== undefined ? options.checked : false;
            _this._value = options.value || '';
            _this.checkGroup = options.checkgroup || null;
            _this.background = options.background;
            _this.background.width = '100%';
            _this.background.height = '100%';
            _this.addChild(_this.background);
            _this.checkmark = options.checkmark;
            if (_this.checkmark) {
                _this.checkmark.verticalAlign = 'middle';
                _this.checkmark.horizontalAlign = 'center';
                if (!_this._checked) {
                    _this.checkmark.alpha = 0;
                }
                _this.addChild(_this.checkmark);
            }
            _this.container.buttonMode = true;
            if (_this.checkGroup !== null) {
                InputController.registrerCheckGroup(_this);
            }
            // var keyDownEvent = function (e) {
            //    if (e.which === 32) { //space
            //        self.click();
            //    }
            // };
            var clickEvent = new ClickEvent(_this);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            clickEvent.onHover = function (e, over) {
                _this.emit('hover', over);
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            clickEvent.onPress = function (e, isPressed) {
                if (isPressed) {
                    _this.focus();
                    e.data.originalEvent.preventDefault();
                }
                _this.emit('press', isPressed);
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            clickEvent.onClick = function (e) {
                _this.click();
            };
            _this.change = function (val) {
                if (_this.checkmark) {
                    _this.checkmark.alpha = val ? 1 : 0;
                }
            };
            _this.click = function () {
                _this.emit('click');
                if (_this.checkGroup !== null && _this.checked) {
                    return;
                }
                _this.checked = !_this.checked;
                _this.emit('change', _this.checked);
            };
            _this.focus = function () {
                if (!_this._focused) {
                    _super.prototype.focus.call(_this);
                    // document.addEventListener("keydown", keyDownEvent, false);
                }
            };
            _this.blur = function () {
                if (_this._focused) {
                    _super.prototype.blur.call(_this);
                    // document.removeEventListener("keydown", keyDownEvent);
                }
            };
            return _this;
        }
        CheckBox.prototype.update = function () {
            // No need for updating
        };
        Object.defineProperty(CheckBox.prototype, "checked", {
            get: function () {
                return this._checked;
            },
            set: function (val) {
                if (val !== this._checked) {
                    if (this.checkGroup !== null && val) {
                        InputController.updateCheckGroupSelected(this);
                    }
                    this._checked = val;
                    this.change(val);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CheckBox.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (val) {
                this._value = val;
                if (this.checked) {
                    InputController.updateCheckGroupSelected(this);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CheckBox.prototype, "selectedValue", {
            get: function () {
                return InputController.getCheckGroupSelectedValue(this.checkGroup);
            },
            set: function (val) {
                InputController.setCheckGroupSelectedValue(this.checkGroup, val);
            },
            enumerable: true,
            configurable: true
        });
        return CheckBox;
    }(InputBase));
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

    /**
     * An UI Container object
     *
     * @class
     * @extends PIXI.UI.UIBase
     * @memberof PIXI.UI
     * @param width {Number} Width of the Container
     * @param height {Number} Height of the Container
     */
    var Container = /** @class */ (function (_super) {
        __extends(Container, _super);
        function Container(width, height) {
            var _this = _super.call(this, width, height) || this;
            _this.container.hitArea = new PIXI$1.Rectangle(0, 0, 0, 0);
            return _this;
        }
        Container.prototype.update = function () {
            // if (this.container.interactive) {
            this.container.hitArea.width = this._width;
            this.container.hitArea.height = this._height;
            // }
        };
        return Container;
    }(UIBase));

    var Container$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Container: Container
    });

    function DynamicTextStyle(parent)
    {
        this.respectDirty = true;
        this._parent = parent || null;
        this._scale = 1;
        this._align = 'left';
        this._fontFamily = 'Arial';
        this._fontSize = 26;
        this._fontWeight = 'normal';
        this._fontStyle = 'normal';
        this._letterSpacing = 0;
        this._lineHeight = 0;
        this._verticalAlign = 0;
        this._rotation = 0;
        this._skew = 0;
        this._tint = '#FFFFFF';
        this._fill = '#FFFFFF';
        this._shadow = '';
        this._stroke = 0;
        this._strokeFill = '';
        this._strokeShadow = '';
        this._wrap = true;
        this._breakWords = false;
        this._overflowX = 'visible'; // visible|hidden
        this._overflowY = 'visible'; // visible|hidden
        this._ellipsis = false;

        let _cachedEllipsisSize = null;

        this.ellipsisSize = function (atlas)
        {
            if (!this.ellipsis) return 0;
            if (_cachedEllipsisSize === null)
            { _cachedEllipsisSize = (atlas.getCharObject('.', this).width + this.letterSpacing) * 3; }

            return _cachedEllipsisSize;
        };
    }

    DynamicTextStyle.prototype.clone = function ()
    {
        const style = new DynamicTextStyle();

        style.merge(this);

        return style;
    };

    DynamicTextStyle.prototype.merge = function (style)
    {
        if (typeof style === 'object')
        {
            this.respectDirty = false;
            for (const param in style)
            {
                const val = style[param];

                if (typeof val === 'function' || param === 'respectDirty' || param === '_parent') continue;
                this[param] = style[param];
            }
            this.respectDirty = true;
            this._dirty = true;
        }
    };

    DynamicTextStyle.prototype.ctxKey = function (char)
    {
        return [char, this.fill, this.shadow, this.stroke, this.strokeFill, this.strokeShadow].join('|');
    };

    DynamicTextStyle.prototype.ctxFont = function ()
    {
        const fontSize = `${Math.min(200, Math.max(1, this.fontSize || 26))}px `;
        const fontWeight = this.fontWeight === 'bold' ? `${this.fontWeight} ` : '';
        const fontStyle = this.fontStyle === 'italic' || this.fontStyle === 'oblique' ? `${this.fontStyle} ` : '';

        return fontWeight + fontStyle + fontSize + this.fontFamily;
    };

    DynamicTextStyle.prototype.constructor = DynamicTextStyle;

    Object.defineProperties(DynamicTextStyle.prototype, {
        _dirty: {
            set(val)
            {
                if (this.respectDirty)
                {
                    if (this._parent !== null)
                    {
                        this._parent.dirtyStyle = val;
                        this._parent.update();
                    }
                }
            },
        },
        scale: {
            get()
            {
                return this._scale;
            },
            set(val)
            {
                if (val !== this._scale)
                {
                    this._scale = val;
                    this._dirty = true;
                }
            },
        },
        align: {
            get()
            {
                return this._align;
            },
            set(val)
            {
                if (val !== this._align)
                {
                    this._align = val;
                    this._dirty = true;
                }
            },
        },
        fontFamily: {
            get()
            {
                return this._fontFamily;
            },
            set(val)
            {
                if (val !== this._fontFamily)
                {
                    this._fontFamily = val;
                    this._dirty = true;
                }
            },
        },
        fontSize: {
            get()
            {
                return this._fontSize;
            },
            set(val)
            {
                if (val !== this._fontSize)
                {
                    this._fontSize = val;
                    this._dirty = true;
                }
            },
        },
        fontWeight: {
            get()
            {
                return this._fontWeight;
            },
            set(val)
            {
                if (val !== this._fontWeight)
                {
                    this._fontWeight = val;
                    this._dirty = true;
                }
            },
        },
        fontStyle: {
            get()
            {
                return this._fontStyle;
            },
            set(val)
            {
                if (val !== this._fontStyle)
                {
                    this._fontStyle = val;
                    this._dirty = true;
                }
            },
        },
        letterSpacing: {
            get()
            {
                return this._letterSpacing;
            },
            set(val)
            {
                if (val !== this._letterSpacing)
                {
                    this._letterSpacing = val;
                    this._dirty = true;
                }
            },
        },
        lineHeight: {
            get()
            {
                return this._lineHeight;
            },
            set(val)
            {
                if (val !== this._lineHeight)
                {
                    this._lineHeight = val;
                    this._dirty = true;
                }
            },
        },
        verticalAlign: {
            get()
            {
                return this._verticalAlign;
            },
            set(val)
            {
                if (val !== this._verticalAlign)
                {
                    this._verticalAlign = val;
                    this._dirty = true;
                }
            },
        },
        rotation: {
            get()
            {
                return this._rotation;
            },
            set(val)
            {
                if (val !== this._rotation)
                {
                    this._rotation = val;
                    this._dirty = true;
                }
            },
        },
        skew: {
            get()
            {
                return this._skew;
            },
            set(val)
            {
                if (val !== this._skew)
                {
                    this._skew = val;
                    this._dirty = true;
                }
            },
        },
        tint: {
            get()
            {
                return this._tint;
            },
            set(val)
            {
                if (val !== this._tint)
                {
                    this._tint = val;
                    this._dirty = true;
                }
            },
        },
        fill: {
            get()
            {
                return this._fill;
            },
            set(val)
            {
                if (val !== this._fill)
                {
                    this._fill = val;
                    this._dirty = true;
                }
            },
        },
        shadow: {
            get()
            {
                return this._shadow;
            },
            set(val)
            {
                if (val !== this._shadow)
                {
                    this._shadow = val;
                    this._dirty = true;
                }
            },
        },
        stroke: {
            get()
            {
                return this._stroke;
            },
            set(val)
            {
                if (val !== this._stroke)
                {
                    this._stroke = val;
                    this._dirty = true;
                }
            },
        },
        strokeFill: {
            get()
            {
                return this._strokeFill;
            },
            set(val)
            {
                if (val !== this._strokeFill)
                {
                    this._strokeFill = val;
                    this._dirty = true;
                }
            },
        },
        strokeShadow: {
            get()
            {
                return this._strokeShadow;
            },
            set(val)
            {
                if (val !== this._strokeShadow)
                {
                    this._strokeShadow = val;
                    this._dirty = true;
                }
            },
        },
        wrap: {
            get()
            {
                return this._wrap;
            },
            set(val)
            {
                if (val !== this._wrap)
                {
                    this._wrap = val;
                    this._dirty = true;
                }
            },
        },
        breakWords: {
            get()
            {
                return this._breakWords;
            },
            set(val)
            {
                if (val !== this._breakWords)
                {
                    this._breakWords = val;
                    this._dirty = true;
                }
            },
        },
        overflowX: {
            get()
            {
                return this._overflowX;
            },
            set(val)
            {
                if (val !== this._overflowX)
                {
                    this._overflowX = val;
                    this._dirty = true;
                }
            },
        },
        overflowY: {
            get()
            {
                return this._overflowY;
            },
            set(val)
            {
                if (val !== this._overflowY)
                {
                    this._overflowY = val;
                    this._dirty = true;
                }
            },
        },
        ellipsis: {
            get()
            {
                return this._ellipsis;
            },
            set(val)
            {
                if (val !== this._ellipsis)
                {
                    this._ellipsis = val;
                    this._dirty = true;
                }
            },
        },
    });

    function DynamicChar()
    {
        // styledata (texture, orig width, orig height)
        this.style = null;

        // char data
        this.data = null;

        // is this char space?
        this.space = false;

        // is this char newline?
        this.newline = false;

        this.emoji = false;

        // charcode
        this.charcode = 0;

        // char string value
        this.value = '';

        // word index
        this.wordIndex = -1;

        // line index of char
        this.lineIndex = -1;
    }

    DynamicChar.prototype.constructor = DynamicChar;

    var emojiRegex = function () {
    	// https://mathiasbynens.be/notes/es-unicode-property-escapes#emoji
    	return (/\uD83D\uDC69(?:\u200D(?:(?:\uD83D\uDC69\u200D)?\uD83D\uDC67|(?:\uD83D\uDC69\u200D)?\uD83D\uDC66)|\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69\u200D(?:\uD83D\uDC69\u200D)?\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D(?:\uD83D\uDC69\u200D)?\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]\uFE0F|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC6F\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3C-\uDD3E\uDDD6-\uDDDF])\u200D[\u2640\u2642]\uFE0F|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F\u200D[\u2640\u2642]|(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642])\uFE0F|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC69\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708]))\uFE0F|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83D\uDC69\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69]))|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC66\u200D\uD83D\uDC66|(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]))|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\u200D(?:(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC67|(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC66)|\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDD1-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])?|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])\uFE0F/g
    	);
    };

    let atlas = null;

    /**
    * An dynamic text object with auto generated atlas
    *
    * @class
    * @extends PIXI.UI.UIBase
    * @memberof PIXI.UI
    * @param text {String} Text content
    * @param [width=0] {Number|String} width of textbox. 0 = autoWidth
    * @param [height=0] {Number|String} height of textbox. 0 = autoHeight
    * @param [allowTags=true] {boolean} Allow inline styling
    * @param [options=null] {DynamicTextStyle} Additional text settings
    */
    function DynamicText(text, options)
    {
        options = options || {};

        UIBase.call(this, options.width || 0, options.height || 0);

        // create atlas
        if (atlas === null)
        { atlas = new DynamicAtlas(1); }

        const autoWidth = !options.width;
        const autoHeight = !options.height;

        // defaultstyle for this textobject
        const defaultStyle = this._style = new DynamicTextStyle(this);

        defaultStyle.merge(options.style);

        // collection of all processed char
        const chars = this.chars = [];
        const renderChars = [];
        const spriteCache = []; // (temp)
        const charContainer = new PIXI.Container();

        this.container.addChild(charContainer);

        // the input text
        this._inputText = text;

        // states
        let lastWidth = 0;
        let lastHeight = 0;

        this.dirtyText = true;
        this.dirtyStyle = true;
        this.dirtyRender = true;

        // dictionary for line data
        const lineWidthData = [];
        const lineHeightData = [];
        const lineFontSizeData = [];
        const lineAlignmentData = [];
        let renderCount = 0;
        let charCount = 0;

        // ellipsis caches (not nessesary when no sprites)
        const lineEllipsisData = [];
        const lineHasEllipsis = [];

        // ROUGH TEMP RENDER (with sprites)
        this.render = function ()
        {
            let yOffset = 0;
            let xOffset = 0;
            let currentLine = -1;
            let i;

            if (spriteCache.length > renderCount)
            {
                for (i = renderCount; i < spriteCache.length; i++)
                {
                    const removeSprite = spriteCache[i];

                    if (removeSprite)
                    { removeSprite.visible = false; }
                }
            }

            let char; let lineWidth = 0; let lineHeight = 0; let
                maxLineWidth = 0;

            for (i = 0; i < renderCount; i++)
            {
                char = renderChars[i];

                // get line data
                if (currentLine !== char.lineIndex)
                {
                    currentLine = char.lineIndex;
                    lineWidth = lineWidthData[currentLine];
                    lineHeight = lineHeightData[currentLine];
                    yOffset += lineHeight;

                    switch (lineAlignmentData[currentLine])
                    {
                        case 'right': xOffset = this._width - lineWidth; break;
                        case 'center': xOffset = (this._width - lineWidth) * 0.5; break;
                        default: xOffset = 0;
                    }

                    maxLineWidth = Math.max(lineWidth, maxLineWidth);
                }

                // no reason to render a blank space or 0x0 letters (no texture created)
                if (!char.data.texture || char.space || char.newline)
                {
                    if (spriteCache[i])
                    { spriteCache[i].visible = false; }
                    continue;
                }

                // add new sprite
                const tex = char.data.texture; let
                    sprite = spriteCache[i];

                if (!sprite)
                {
                    sprite = spriteCache[i] = new PIXI.Sprite(tex);
                    sprite.anchor.set(0.5);
                }
                else
                { sprite.texture = tex; }

                sprite.visible = true;
                sprite.x = char.x + xOffset + tex.width * 0.5;
                sprite.y = char.y + yOffset - tex.height * 0.5 - (lineHeight - lineFontSizeData[currentLine]);

                sprite.tint = char.emoji ? 0xffffff : hexToInt(char.style.tint, 0xffffff);
                sprite.rotation = float(char.style.rotation, 0);
                sprite.skew.x = float(char.style.skew, 0);

                if (!sprite.parent)
                { charContainer.addChild(sprite); }
            }

            if (autoWidth) this.width = maxLineWidth;
            if (autoHeight) this.height = yOffset;
        };

        // updates the renderChar array and position chars for render
        this.prepareForRender = function ()
        {
            const pos = new PIXI.Point();
            let wordIndex = 0;
            let lineHeight = 0;
            let lineFontSize = 0;
            let lineIndex = 0;
            let lineAlignment = defaultStyle.align;
            let lastSpaceIndex = -1;
            let lastSpaceLineWidth = 0;
            let textHeight = 0;
            let forceNewline = false;
            let style;
            let renderIndex = 0;
            let ellipsis = false;
            let lineFull = false;
            let i;

            for (i = 0; i < charCount; i++)
            {
                const char = chars[i]; const
                    lastChar = chars[i - 1];

                style = char.style;

                // lineheight
                lineHeight = Math.max(lineHeight, defaultStyle.lineHeight || style.lineHeight || char.data.lineHeight);

                if (style.overflowY !== 'visible' && lineHeight + textHeight > this._height)
                {
                    if (style.overflowY === 'hidden')
                    { break; }
                }

                if (char.newline)
                { lineFull = false; }

                // set word index
                if (char.space || char.newline) wordIndex++;
                else char.wordIndex = wordIndex;

                // textheight
                lineFontSize = Math.max(lineFontSize, style.fontSize);

                // lineindex
                char.lineIndex = lineIndex;

                // lineAlignment
                if (style.align !== defaultStyle.align) lineAlignment = style.align;

                if (char.space)
                {
                    lastSpaceIndex = i;
                    lastSpaceLineWidth = pos.x;
                }

                const size = Math.round(char.data.width) + float(style.letterSpacing, 0);

                if (!autoWidth && !forceNewline && !char.newline && pos.x + size > this._width)
                {
                    if (style.wrap)
                    {
                        if (char.space)
                        {
                            forceNewline = true;
                        }
                        else if (lastSpaceIndex !== -1)
                        {
                            renderIndex -= i - lastSpaceIndex;
                            i = lastSpaceIndex - 1;
                            lastSpaceIndex = -1;
                            pos.x = lastSpaceLineWidth;
                            forceNewline = true;
                            continue;
                        }
                        else if (style.breakWords)
                        {
                            if (lastChar)
                            {
                                pos.x -= lastChar.style.letterSpacing;
                                pos.x -= lastChar.data.width;
                            }
                            i -= 2;
                            renderIndex--;
                            forceNewline = true;
                            continue;
                        }
                    }

                    if (style.overflowX == 'hidden' && !forceNewline)
                    {
                        lineFull = true;
                        if (style.ellipsis && !ellipsis)
                        {
                            ellipsis = true;
                            let ellipsisData = lineEllipsisData[lineIndex];

                            if (!ellipsisData) ellipsisData = lineEllipsisData[lineIndex] = [new DynamicChar(), new DynamicChar(), new DynamicChar()];
                            for (let d = 0; d < 3; d++)
                            {
                                const dot = ellipsisData[d];

                                dot.value = '.';
                                dot.data = atlas.getCharObject(dot.value, style);
                                dot.style = style;
                                dot.x = pos.x + char.data.xOffset;
                                dot.y = parseFloat(style.verticalAlign) + dot.data.yOffset;
                                dot.lineIndex = lineIndex;
                                pos.x += Math.round(dot.data.width) + float(style.letterSpacing, 0);
                                renderChars[renderIndex] = dot;
                                renderIndex++;
                            }
                        }
                    }
                }

                // Update position and add to renderchars
                if (!lineFull)
                {
                    // position
                    char.x = pos.x + char.data.xOffset;
                    char.y = parseFloat(style.verticalAlign) + char.data.yOffset;
                    pos.x += size;
                    renderChars[renderIndex] = char;
                    renderIndex++;
                }

                // new line
                if (forceNewline || char.newline || i === charCount - 1)
                {
                    if (lastChar)
                    {
                        pos.x -= lastChar.style.letterSpacing;
                    }

                    if (char.space)
                    {
                        pos.x -= char.data.width;
                        pos.x -= float(style.letterSpacing, 0);
                    }

                    textHeight += lineHeight;
                    lineHasEllipsis[lineIndex] = ellipsis;
                    lineWidthData[lineIndex] = pos.x;
                    lineHeightData[lineIndex] = lineHeight;
                    lineFontSizeData[lineIndex] = lineFontSize;
                    lineAlignmentData[lineIndex] = lineAlignment;

                    // reset line vaules
                    lineHeight = pos.x = lastSpaceLineWidth = lineFontSize = 0;
                    lineAlignment = defaultStyle.align;
                    lastSpaceIndex = -1;
                    lineIndex++;
                    forceNewline = lineFull = ellipsis = false;
                }
            }

            renderCount = renderIndex;
        };

        // phrases the input text and prepares the char array
        const closeTags = ['</i>', '</b>', '</font>', '</center>'];

        this.processInputText = function ()
        {
            const styleTree = [defaultStyle];
            let charIndex = 0;
            let inputTextIndex = 0;
            const inputArray = Array.from(this._inputText);

            for (let i = 0; i < inputArray.length; i++)
            {
                style = styleTree[styleTree.length - 1];
                let c = inputArray[i];
                const charcode = c.charCodeAt(0);
                let newline = false;
                let space = false;
                let emoji = false;

                // Extract Tags
                if ((/(?:\r\n|\r|\n)/).test(c))
                { newline = true; }
                else if ((/(\s)/).test(c))
                { space = true; }
                else if (options.allowTags && c === '<')
                {
                    let tag = this._inputText.substring(inputTextIndex);

                    tag = tag.slice(0, tag.indexOf('>') + 1);
                    let FoundTag = true;

                    if (tag.length)
                    {
                        if (tag === '<i>')
                        {
                            style = style.clone();
                            style.fontStyle = 'italic';
                            styleTree.push(style);
                        }
                        else if (tag === '<b>')
                        {
                            style = style.clone();
                            style.fontWeight = 'bold';
                            styleTree.push(style);
                        }
                        else if (tag === '<center>')
                        {
                            style = style.clone();
                            style.align = 'center';
                            styleTree.push(style);
                        }
                        else if (closeTags.indexOf(tag) !== -1)
                        {
                            if (styleTree.length > 1) styleTree.splice(styleTree.length - 1, 1);
                        }
                        else if (tag.startsWith('<font '))
                        {
                            const regex = /(\w+)\s*=\s*((["'])(.*?)\3|([^>\s]*)(?=\s|\/>))(?=[^<]*>)/g;
                            let match = regex.exec(tag);

                            if (match !== null)
                            {
                                style = style.clone();
                                while (match !== null)
                                {
                                    switch (match[1])
                                    {
                                        case 'family': match[1] = 'fontFamily'; break;
                                        case 'size': match[1] = 'fontSize'; break;
                                        case 'weight': match[1] = 'fontWeight'; break;
                                        case 'style': match[1] = 'fontStyle'; break;
                                        case 'valign': match[1] = 'verticalAlign'; break;
                                        case 'spacing': match[1] = 'letterSpacing'; break;
                                        case 'color': match[1] = 'tint'; break;
                                    }
                                    style[match[1]] = match[4];
                                    match = regex.exec(tag);
                                }
                                styleTree.push(style);
                            }
                        }
                        else
                        {
                            FoundTag = false;
                        }

                        if (FoundTag)
                        {
                            inputTextIndex += tag.length;
                            i += tag.length - 1;
                            continue;
                        }
                    }
                }
                else
                {
                    // detect emoji
                    let emojiMatch = emojiRegex().exec(c);

                    if (emojiMatch !== null)
                    {
                        i--; c = '';
                        while (emojiMatch !== null && c !== emojiMatch[0])
                        {
                            i++;
                            c = emojiMatch[0];
                            emojiMatch = emojiRegex().exec(c + inputArray[i + 1]);
                        }
                        emoji = true;
                    }
                }

                // Prepare DynamicChar object
                let char = chars[charIndex];

                if (!char)
                {
                    char = new DynamicChar();
                    chars[charIndex] = char;
                }
                char.style = style;

                if (emoji)
                {
                    char.style = char.style.clone();
                    char.style.fontFamily = DynamicText.settings.defaultEmojiFont;
                }

                char.data = atlas.getCharObject(c, char.style);
                char.value = c;
                char.space = space;
                char.newline = newline;
                char.emoji = emoji;

                charIndex++;
                inputTextIndex += c.length;
            }
            charCount = charIndex;
        };

        // PIXIUI update, lazy update (bad solution needs rewrite when converted to pixi plugin)
        this.lazyUpdate = null;
        const self = this;

        this.update = function ()
        {
            if (self.lazyUpdate !== null) return;
            self.lazyUpdate = setTimeout(function ()
            {
                // console.log("UPDATING TEXT");
                const dirtySize = !autoWidth && (self._width != lastWidth || self._height != lastHeight || self.dirtyText);

                if (self.dirtyText || self.dirtyStyle)
                {
                    self.dirtyText = self.dirtyStyle = false;
                    self.dirtyRender = true; // force render after textchange
                    self.processInputText();
                }

                if (dirtySize || self.dirtyRender)
                {
                    self.dirtyRender = false;
                    lastWidth = self._width;
                    lastHeight = self.height;
                    self.prepareForRender();
                    self.render();
                }
                self.lazyUpdate = null;
            }, 0);
        };
    }

    DynamicText.prototype = Object.create(UIBase.prototype);
    DynamicText.prototype.constructor = DynamicText;

    DynamicText.settings = {
        debugSpriteSheet: false,
        defaultEmojiFont: 'Segoe UI Emoji', // force one font family for emojis so we dont rerender them multiple times
    };

    Object.defineProperties(DynamicText.prototype, {
        value: {
            get()
            {
                return this._inputText;
            },
            set(val)
            {
                if (val !== this._inputText)
                {
                    this._inputText = val;
                    this.dirtyText = true;
                    this.update();
                    // console.log("Updating Text to: " + val);
                }
            },
        },
        text: {
            get()
            {
                return this.value;
            },
            set(val)
            {
                this.value = val;
            },
        },
        style: {
            get()
            {
                return this._style;
            },
            set(val)
            {
                // get a clean default style
                const style = new DynamicTextStyle(this);

                // merge it with new style
                style.merge(val);

                // merge it onto this default style
                this._style.merge(style);

                this.dirtyStyle = true;
                this.update();
            },
        },
    });

    // Atlas
    const metricsCanvas = document.createElement('canvas');
    const metricsContext = metricsCanvas.getContext('2d');

    metricsCanvas.width = 100;
    metricsCanvas.height = 100;

    var DynamicAtlas = function (padding)
    {
        let canvas;
        let context;
        let objects;
        let newObjects = [];
        let baseTexture;
        let lazyTimeout;
        let rootNode;
        let atlasdim;
        const startdim = 256;
        const maxdim = 2048;

        var AtlasNode = function (w, h)
        {
            const children = this.children = [];

            this.rect = new PIXI.Rectangle(0, 0, w || 0, h || 0);
            this.data = null;

            this.insert = function (width, height, obj)
            {
                if (children.length > 0)
                {
                    const newNode = children[0].insert(width, height, obj);

                    if (newNode !== null) return newNode;

                    return children[1].insert(width, height, obj);
                }
                if (this.data !== null) return null;
                if (width > this.rect.width || height > this.rect.height) return null;
                if (width == this.rect.width && height == this.rect.height)
                {
                    this.data = obj;
                    obj.frame.x = this.rect.x;
                    obj.frame.y = this.rect.y;

                    return this;
                }

                children.push(new AtlasNode());
                children.push(new AtlasNode());

                const dw = this.rect.width - width;
                const dh = this.rect.height - height;

                if (dw > dh)
                {
                    children[0].rect = new PIXI.Rectangle(this.rect.x, this.rect.y, width, this.rect.height);
                    children[1].rect = new PIXI.Rectangle(this.rect.x + width, this.rect.y, this.rect.width - width, this.rect.height);
                }
                else
                {
                    children[0].rect = new PIXI.Rectangle(this.rect.x, this.rect.y, this.rect.width, height);
                    children[1].rect = new PIXI.Rectangle(this.rect.x, this.rect.y + height, this.rect.width, this.rect.height - height);
                }

                return children[0].insert(width, height, obj);
            };
        };

        const addCanvas = function ()
        {
            // create new canvas
            canvas = document.createElement('canvas');
            context = canvas.getContext('2d');

            // reset dimentions
            atlasdim = startdim;
            canvas.width = canvas.height = atlasdim;
            rootNode = new AtlasNode(atlasdim, atlasdim);

            // reset array with canvas objects and create new atlas
            objects = [];

            // set new basetexture
            baseTexture = PIXI.BaseTexture.fromCanvas(canvas);
            baseTexture.mipmap = false; // if not, pixi bug resizing POW2
            baseTexture.resolution = 1; // todo: support all resolutions
            baseTexture.update();

            // Debug Spritesheet
            if (DynamicText.settings.debugSpriteSheet)
            {
                canvas.className = 'DynamicText_SpriteSheet';
                document.body.appendChild(canvas);
            }
        };

        this.fontFamilyCache = {};

        const drawObjects = function (arr, resized)
        {
            if (resized) baseTexture.update();
            for (let i = 0; i < arr.length; i++)
            { drawObject(arr[i]); }
        };

        var drawObject = function (obj)
        {
            context.drawImage(obj._cache, obj.frame.x, obj.frame.y);
            obj.texture.frame = obj.frame;
            obj.texture.update();
        };

        this.getCharObject = function (char, style)
        {
            const font = style.ctxFont();

            // create new cache for fontFamily
            let familyCache = this.fontFamilyCache[font];

            if (!familyCache)
            {
                familyCache = {};
                this.fontFamilyCache[font] = familyCache;
            }

            // get char data
            const key = style.ctxKey(char);
            let obj = familyCache[key];

            if (!obj)
            {
                // create char object
                const metrics = generateCharData(char, style);

                // temp resize if doesnt fit (not nesseary when we dont need to generate textures)
                if (metrics.rect)
                {
                    if (canvas.width < metrics.rect.width || canvas.height < metrics.rect.height)
                    {
                        canvas.width = canvas.height = Math.max(metrics.rect.width, metrics.rect.height);
                        baseTexture.update();
                    }
                }

                // todo: cleanup when we know whats needed
                obj = {
                    metrics,
                    font,
                    value: char,
                    frame: metrics.rect,
                    baseTexture: metrics.rect ? baseTexture : null,
                    xOffset: metrics.bounds ? metrics.bounds.minx : 0,
                    yOffset: metrics.descent || 0,
                    width: metrics.width || 0,
                    lineHeight: metrics.lineHeight || 0,
                    _cache: metrics.canvas,
                    texture: metrics.rect ? new PIXI.Texture(baseTexture, metrics.rect) : null, // temp texture
                };

                // add to collections
                familyCache[key] = obj;

                // add to atlas if visible char
                if (metrics.rect)
                {
                    newObjects.push(obj);

                    if (lazyTimeout === undefined)
                    {
                        lazyTimeout = setTimeout(function ()
                        {
                            addNewObjects();
                            lazyTimeout = undefined;
                        }, 0);
                    }
                }
            }

            return obj;
        };

        const compareFunction = function (a, b)
        {
            if (a.frame.height < b.frame.height)
            { return 1; }

            if (a.frame.height > b.frame.height)
            { return -1; }

            if (a.frame.width < b.frame.width)
            { return 1; }

            if (a.frame.width > b.frame.width)
            { return -1; }

            return 0;
        };

        var addNewObjects = function ()
        {
            newObjects.sort(compareFunction);
            let _resized = false;
            let _newcanvas = false;

            for (let i = 0; i < newObjects.length; i++)
            {
                const obj = newObjects[i];
                const node = rootNode.insert(obj.frame.width + padding, obj.frame.height + padding, obj);

                if (node !== null)
                {
                    if (_newcanvas) obj.texture.baseTexture = baseTexture; // update basetexture if new canvas was created (temp)
                    objects.push(obj);
                    continue;
                }

                // step one back (so it will be added after resize/new canvas)
                i--;

                if (atlasdim < maxdim)
                {
                    _resized = true;
                    resizeCanvas(atlasdim * 2);
                    continue;
                }

                // close current spritesheet and make a new one
                drawObjects(objects, _resized);
                addCanvas();
                _newcanvas = true;
                _resized = false;
            }

            drawObjects(_resized || _newcanvas ? objects : newObjects, _resized);
            newObjects = [];
        };

        var resizeCanvas = function (dim)
        {
            canvas.width = canvas.height = atlasdim = dim;

            rootNode = new AtlasNode(dim, dim);
            objects.sort(compareFunction);

            for (let i = 0; i < objects.length; i++)
            {
                const obj = objects[i];

                rootNode.insert(obj.frame.width + padding, obj.frame.height + padding, obj);
            }
        };

        var generateCharData = function (char, style)
        {
            const fontSize = Math.max(1, int(style.fontSize, 26));
            const lineHeight = fontSize * 1.25;

            // Start our returnobject
            const data = {
                fontSize,
                lineHeight,
                width: 0,
            };

            // Return if newline
            if (!char || (/(?:\r\n|\r|\n)/).test(char))
            { return data; }

            // Ctx font string
            const font = style.ctxFont();

            metricsContext.font = font;

            // Get char width
            data.width = Math.round(metricsContext.measureText(char).width);

            // Return if char = space
            if ((/(\s)/).test(char)) return data;

            // set canvas size (with padding so we can messure)
            const paddingY = Math.round(fontSize * 0.7); const
                paddingX = Math.max(5, Math.round(fontSize * 0.7));

            metricsCanvas.width = Math.ceil(data.width) + paddingX * 2;
            metricsCanvas.height = 1.5 * fontSize;
            const w = metricsCanvas.width; const h = metricsCanvas.height; const
                baseline = (h / 2) + (paddingY * 0.5);

            // set font again after resize
            metricsContext.font = font;

            // make sure canvas is clean
            metricsContext.clearRect(0, 0, w, h);

            // save clean state with font
            metricsContext.save();

            // convert shadow string to shadow data
            const shadowData = function (str)
            {
                const data = str.trim().split(' ');

                return {
                    color: string(data[0], '#000000'),
                    alpha: float(data[1], 0.5),
                    xOffset: float(data[2], 3),
                    yOffset: float(data[3], 3),
                    blur: float(data[4], 5),
                };
            };

            // convert fill string to fill data
            const fillData = function (str)
            {
                const data = str.trim().split(' ');
                const c = string(data[0], '#FFFFFF');
                const a = float(data[1], 1);

                return {
                    color: c,
                    alpha: a,
                    position: float(data[2], -1),
                    rgba: hexToRgba(c, a),
                };
            };

            // create fill style from fill string
            const getFillStyle = function (str)
            {
                const fills = str.split(',').filter(function (s) { return s !== ''; }); let
                    i;

                // convert to fill data
                for (i = 0; i < fills.length; i++) fills[i] = fillData(fills[i]);

                switch (fills.length)
                {
                    case 0: return 'white';
                    case 1: return fills[0].rgba ? fills[0].rgba : fills[0].color || '#FFFFFF';
                    default:
                        // make gradient
                        try
                        {
                            const gradEnd = baseline + lineHeight - fontSize;
                            const gradient = metricsContext.createLinearGradient(0, gradEnd - fontSize, 0, gradEnd);

                            for (i = 0; i < fills.length; i++)
                            { gradient.addColorStop(fills[i].position !== -1 ? fills[i].position : i / (fills.length - 1), fills[i].rgba || fills[i].color); }

                            return gradient;
                        }
                        catch (e)
                        {
                            return '#FFFFFF';
                        }
                }
            };

            // function to draw shadows
            const drawShadows = function (shadowString, stroke)
            {
                const shadows = shadowString.trim().split(',').filter(function (s) { return s !== ''; });

                if (shadows.length)
                {
                    for (let i = 0; i < shadows.length; i++)
                    {
                        const s = shadowData(shadows[i]);

                        metricsContext.globalAlpha = s.alpha;
                        metricsContext.shadowColor = s.color;
                        metricsContext.shadowOffsetX = s.xOffset + w;
                        metricsContext.shadowOffsetY = s.yOffset;
                        metricsContext.shadowBlur = s.blur;

                        if (stroke)
                        {
                            metricsContext.lineWidth = style.stroke;
                            metricsContext.strokeText(char, paddingX - w, baseline);
                        }
                        else metricsContext.fillText(char, paddingX - w, baseline);
                    }
                    metricsContext.restore();
                }
            };

            // draw text shadows
            if (style.shadow.length)
            { drawShadows(style.shadow, false); }

            // draw stroke shadows
            if (style.stroke && style.strokeShadow.length)
            {
                drawShadows(style.strokeShadow, true);
            }

            // draw text
            metricsContext.fillStyle = getFillStyle(string(style.fill, '#000000'));
            metricsContext.fillText(char, paddingX, baseline);
            metricsContext.restore();

            // draw stroke
            if (style.stroke)
            {
                metricsContext.strokeStyle = getFillStyle(string(style.strokeFill, '#000000'));
                metricsContext.lineWidth = style.stroke;
                metricsContext.strokeText(char, paddingX, baseline);
                metricsContext.restore();
            }

            // begin messuring
            const pixelData = metricsContext.getImageData(0, 0, w, h).data;

            let i = 3;
            const line = w * 4;
            const len = pixelData.length;

            // scanline on alpha
            while (i < len && !pixelData[i]) { i += 4; }
            const ascent = (i / line) | 0;

            if (i < len)
            {
                // rev scanline on alpha
                i = len - 1;
                while (i > 0 && !pixelData[i]) { i -= 4; }
                const descent = (i / line) | 0;

                // left to right scanline on alpha
                for (i = 3; i < len && !pixelData[i];)
                {
                    i += line;
                    if (i >= len) { i = (i - len) + 4; }
                }
                const minx = ((i % line) / 4) | 0;

                // right to left scanline on alpha
                let step = 1;

                for (i = len - 1; i >= 0 && !pixelData[i];)
                {
                    i -= line;
                    if (i < 0) { i = (len - 1) - (step++) * 4; }
                }
                const maxx = ((i % line) / 4) + 1 | 0;

                // set font metrics
                data.ascent = Math.round(baseline - ascent);
                data.descent = Math.round(descent - baseline);
                data.height = 1 + Math.round(descent - ascent);
                data.bounds = {
                    minx: minx - paddingX,
                    maxx: maxx - paddingX,
                    miny: 0,
                    maxy: descent - ascent,
                };
                data.rect = {
                    x: data.bounds.minx,
                    y: -data.ascent - 2,
                    width: data.bounds.maxx - data.bounds.minx + 2,
                    height: data.ascent + data.descent + 4,
                };

                // cache (for fast rearrange later)
                data.canvas = document.createElement('canvas');
                data.canvas.width = data.rect.width;
                data.canvas.height = data.rect.height;
                const c = data.canvas.getContext('2d');

                c.drawImage(metricsCanvas, -paddingX - data.rect.x, -baseline - data.rect.y);

                // reset rect position
                data.rect.x = data.rect.y = 0;
            }

            return data;
        };

        addCanvas();
    };

    // helper function for float or default
    function float(val, def)
    {
        if (isNaN(val)) return def;

        return parseFloat(val);
    }

    // helper function for int or default
    function int(val, def)
    {
        if (isNaN(val)) return def;

        return parseInt(val);
    }

    // helper function for string or default
    function string(val, def)
    {
        if (typeof val === 'string' && val.length) return val;

        return def;
    }

    // helper function to convert string hex to int or default
    function hexToInt(str, def)
    {
        if (typeof str === 'number')
        { return str; }

        const result = parseInt(str.replace('#', '0x'));

        if (isNaN(result)) return def;

        return result;
    }

    // helper function to convert hex to rgba
    function hexToRgba(hex, alpha)
    {
        const result = (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(hex);

        alpha = float(alpha, 1);

        return result ? `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)},${alpha})` : false;
    }

    const Ease = {};
    const EaseBase = require('./EaseBase');
    const ExponentialEase = require('./ExponentialEase');
    const HALF_PI = Math.PI * 0.5;

    function create(fn)
    {
        const e = Object.create(EaseBase.prototype);

        e.getPosition = fn;

        return e;
    }

    // Liear
    Ease.Linear = new EaseBase();

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
        easeNone: Ease.Linear,
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

    var MouseScrollEvent = /** @class */ (function () {
        function MouseScrollEvent(obj, preventDefault) {
            var _this = this;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            this.onHoverImpl = function (e) {
                var onMouseScrollImpl = _this.onMouseScrollImpl;
                if (!_this.bound) {
                    document.addEventListener('mousewheel', onMouseScrollImpl, false);
                    document.addEventListener('DOMMouseScroll', onMouseScrollImpl, false);
                    _this.bound = true;
                }
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            this.onMouseOutImpl = function (e) {
                var onMouseScrollImpl = _this.onMouseScrollImpl;
                if (_this.bound) {
                    document.removeEventListener('mousewheel', onMouseScrollImpl);
                    document.removeEventListener('DOMMouseScroll', onMouseScrollImpl);
                    _this.bound = false;
                }
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            this.onMouseScroll = function onMouseScroll(event, delta) {
                // Default onMouseScroll.
            };
            this.bound = false;
            this.delta = new PIXI$1.Point();
            this.obj = obj;
            this.preventDefault = preventDefault;
            this.startEvent();
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        MouseScrollEvent.prototype.onMouseScrollImpl = function (e) {
            var _a = this, obj = _a.obj, preventDefault = _a.preventDefault, delta = _a.delta;
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
            this.onMouseScroll.call(obj, event, delta);
        };
        MouseScrollEvent.prototype.stopEvent = function () {
            var _a = this, obj = _a.obj, onMouseScrollImpl = _a.onMouseScrollImpl, onHoverImpl = _a.onHoverImpl, onMouseOutImpl = _a.onMouseOutImpl;
            if (this.bound) {
                document.removeEventListener('mousewheel', onMouseScrollImpl);
                document.removeEventListener('DOMMouseScroll', onMouseScrollImpl);
                this.bound = false;
            }
            obj.container.removeListener('mouseover', onHoverImpl);
            obj.container.removeListener('mouseout', onMouseOutImpl);
        };
        MouseScrollEvent.prototype.startEvent = function () {
            var _a = this, obj = _a.obj, onHoverImpl = _a.onHoverImpl, onMouseOutImpl = _a.onMouseOutImpl;
            obj.container.on('mouseover', onHoverImpl);
            obj.container.on('mouseout', onMouseOutImpl);
        };
        return MouseScrollEvent;
    }());

    const Interaction = {
        ClickEvent,
        DragEvent,
        InputController,
        MouseScrollEvent,
    };

    var Helpers = {
        Lerp: function (start, stop, amt) {
            if (amt > 1)
                amt = 1;
            else if (amt < 0)
                amt = 0;
            return start + (stop - start) * amt;
        },
        Round: function (number, decimals) {
            var pow = Math.pow(10, decimals);
            return Math.round(number * pow) / pow;
        },
        componentToHex: function (c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        },
        rgbToHex: function (r, g, b) {
            return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
        },
        rgbToNumber: function (r, g, b) {
            return r * 65536 + g * 256 + b;
        },
        numberToRgb: function (c) {
            return {
                r: Math.floor(c / (256 * 256)),
                g: Math.floor(c / 256) % 256,
                b: c % 256,
            };
        },
        hexToRgb: function (hex) {
            if (hex === null) {
                hex = 0xffffff;
            }
            if (!isNaN(hex)) {
                return this.numberToRgb(hex);
            }
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });
            var result = (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
            } : null;
        },
    };

    var Helpers$1 = require('./Helpers');
    var _tweenItemCache = [];
    var _callbackItemCache = [];
    var _tweenObjects = {};
    var _activeTweenObjects = {};
    var _currentId = 1;
    var TweenObject = /** @class */ (function () {
        function TweenObject(object) {
            this.object = object;
            this.tweens = {};
            this.active = false;
            this.onUpdate = null;
        }
        return TweenObject;
    }());
    var CallbackItem = /** @class */ (function () {
        function CallbackItem() {
            this._ready = false;
            this.obj = null;
            this.parent = null;
            this.key = '';
            this.time = 0;
            this.callback = null;
            this.currentTime = 0;
        }
        CallbackItem.prototype.remove = function () {
            this._ready = true;
            delete this.parent.tweens[this.key];
            if (!Object.keys(this.parent.tweens).length) {
                this.parent.active = false;
                this.parent.onUpdate = null;
                delete _activeTweenObjects[this.obj._tweenObjectId];
            }
        };
        CallbackItem.prototype.set = function (obj, callback, time) {
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
            this.key = "cb_" + this.obj._currentCallbackID;
            this.currentTime = 0;
            if (!this.parent.active) {
                this.parent.active = true;
                _activeTweenObjects[this.obj._tweenObjectId] = this.parent;
            }
        };
        CallbackItem.prototype.update = function (delta) {
            this.currentTime += delta;
            if (this.currentTime >= this.time) {
                this.remove();
                this.callback.call(this.parent);
            }
        };
        return CallbackItem;
    }());
    var TweenItem = /** @class */ (function () {
        function TweenItem() {
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
        TweenItem.prototype.remove = function () {
            this._ready = true;
            delete this.parent.tweens[this.key];
            if (!Object.keys(this.parent.tweens).length) {
                this.parent.active = false;
                delete _activeTweenObjects[this.obj._tweenObjectId];
            }
        };
        TweenItem.prototype.set = function (obj, key, from, to, time, ease) {
            this.isColor = isNaN(from) && from[0] === '#' || isNaN(to) && to[0] === '#';
            this.parent = obj;
            this.obj = obj.object;
            this.key = key;
            this.surfix = getSurfix(to);
            if (this.isColor) {
                this.to = Helpers$1.hexToRgb(to);
                this.from = Helpers$1.hexToRgb(from);
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
        };
        TweenItem.prototype.update = function (delta) {
            this.currentTime += delta;
            this.t = Math.min(this.currentTime, this.time) / this.time;
            if (this.ease) {
                this.t = this.ease.getPosition(this.t);
            }
            if (this.isColor) {
                this.currentColor.r = Math.round(Helpers$1.Lerp(this.from.r, this.to.r, this.t));
                this.currentColor.g = Math.round(Helpers$1.Lerp(this.from.g, this.to.g, this.t));
                this.currentColor.b = Math.round(Helpers$1.Lerp(this.from.b, this.to.b, this.t));
                this.obj[this.key] = Helpers$1.rgbToNumber(this.currentColor.r, this.currentColor.g, this.currentColor.b);
            }
            else {
                var val = Helpers$1.Lerp(this.from, this.to, this.t);
                this.obj[this.key] = this.surfix ? val + this.surfix : val;
            }
            if (this.currentTime >= this.time) {
                this.remove();
            }
        };
        return TweenItem;
    }());
    var widthKeys = ['width', 'minWidth', 'maxWidth', 'anchorLeft', 'anchorRight', 'left', 'right', 'x'];
    var heightKeys = ['height', 'minHeight', 'maxHeight', 'anchorTop', 'anchorBottom', 'top', 'bottom', 'y'];
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
        var object = _tweenObjects[obj._tweenObjectId];
        if (!object) {
            object = _tweenObjects[obj._tweenObjectId] = new TweenObject(obj);
        }
        return object;
    }
    function getTweenItem() {
        for (var i = 0; i < _tweenItemCache.length; i++) {
            if (_tweenItemCache[i]._ready) {
                return _tweenItemCache[i];
            }
        }
        var tween = new TweenItem();
        _tweenItemCache.push(tween);
        return tween;
    }
    function getCallbackItem() {
        for (var i = 0; i < _callbackItemCache.length; i++) {
            if (_callbackItemCache[i]._ready) {
                return _callbackItemCache[i];
            }
        }
        var cb = new CallbackItem();
        _callbackItemCache.push(cb);
        return cb;
    }
    var Tween = {
        to: function (obj, time, params, ease) {
            var object = getObject(obj);
            var onUpdate = null;
            for (var key in params) {
                if (key === 'onComplete') {
                    var cb = getCallbackItem();
                    cb.set(object, params[key], time);
                    object.tweens[cb.key] = cb;
                    continue;
                }
                if (key === 'onUpdate') {
                    onUpdate = params[key];
                    continue;
                }
                if (time) {
                    var match = params[key] === obj[key];
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
        from: function (obj, time, params, ease) {
            var object = getObject(obj);
            var onUpdate = null;
            for (var key in params) {
                if (key === 'onComplete') {
                    var cb = getCallbackItem();
                    cb.set(object, params[key], time);
                    object.tweens[cb.key] = cb;
                    continue;
                }
                if (key === 'onUpdate') {
                    onUpdate = params[key];
                    continue;
                }
                if (time) {
                    var match = params[key] == obj[key];
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
        fromTo: function (obj, time, paramsFrom, paramsTo, ease) {
            var object = getObject(obj);
            var onUpdate = null;
            for (var key in paramsTo) {
                if (key === 'onComplete') {
                    var cb = getCallbackItem();
                    cb.set(object, paramsTo[key], time);
                    object.tweens[cb.key] = cb;
                    continue;
                }
                if (key === 'onUpdate') {
                    onUpdate = paramsTo[key];
                    continue;
                }
                if (time) {
                    var match = paramsFrom[key] == paramsTo[key];
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
        set: function (obj, params) {
            var object = getObject(obj);
            for (var key in params) {
                if (typeof obj[key] === 'undefined')
                    continue;
                if (object.tweens[key])
                    object.tweens[key].remove();
                obj[key] = params[key];
            }
        },
        _update: function (delta) {
            for (var id in _activeTweenObjects) {
                var object = _activeTweenObjects[id];
                for (var key in object.tweens) {
                    object.tweens[key].update(delta);
                }
                if (object.onUpdate) {
                    object.onUpdate.call(object.object, delta);
                }
            }
        },
    };

    var Tween$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Tween: Tween
    });

    /**
    * An UI Slider, the default width/height is 90%
    *
    * @class
    * @extends UIBase
    * @memberof PIXI.UI
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
    var Slider = /** @class */ (function (_super) {
        __extends(Slider, _super);
        function Slider(options) {
            var _this = _super.call(this, 0, 0) || this;
            _this._amt = 0;
            _this._disabled = false;
            // set options
            _this.track = options.track;
            _this.handle = options.handle;
            _this.fill = options.fill || null;
            _this._minValue = options.minValue || 0;
            _this._maxValue = options.maxValue || 100;
            _this.decimals = options.decimals || 0;
            _this.vertical = options.vertical || false;
            _this.onValueChange = options.onValueChange || null;
            _this.onValueChanging = options.onValueChanging || null;
            _this.value = options.value || 50;
            _this.handle.pivot = 0.5;
            _this.addChild(_this.track);
            if (_this.fill) {
                _this.track.addChild(_this.fill);
            }
            _this.addChild(_this.handle);
            _this.handle.container.buttonMode = true;
            if (_this.vertical) {
                _this.height = '100%';
                _this.width = _this.track.width;
                _this.track.height = '100%';
                _this.handle.horizontalAlign = 'center';
                if (_this.fill) {
                    _this.fill.horizontalAlign = 'center';
                }
            }
            else {
                _this.width = '100%';
                _this.height = _this.track.height;
                _this.track.width = '100%';
                _this.handle.verticalAlign = 'middle';
                if (_this.fill) {
                    _this.fill.verticalAlign = 'middle';
                }
            }
            return _this;
        }
        Slider.prototype.update = function (soft) {
            if (soft === void 0) { soft = 0; }
            var handleSize;
            var val;
            if (this.vertical) {
                handleSize = this.handle._height || this.handle.container.height;
                val = ((this._height - handleSize) * this._amt) + (handleSize * 0.5);
                if (soft) {
                    Tween.to(this.handle, 0.3, { top: val }, Ease.Power2.easeOut);
                    if (this.fill)
                        Tween.to(this.fill, 0.3, { height: val }, Ease.Power2.easeOut);
                }
                else {
                    Tween.set(this.handle, { top: val });
                    if (this.fill)
                        Tween.set(this.fill, { height: val });
                }
            }
            else {
                handleSize = this.handle._width || this.handle.container.width;
                val = ((this._width - handleSize) * this._amt) + (handleSize * 0.5);
                if (soft) {
                    Tween.to(this.handle, 0.3, { left: val }, Ease.Power2.easeOut);
                    if (this.fill)
                        Tween.to(this.fill, 0.3, { width: val }, Ease.Power2.easeOut);
                }
                else {
                    Tween.set(this.handle, { left: val });
                    if (this.fill)
                        Tween.set(this.fill, { width: val });
                }
            }
        };
        Slider.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);
            var localMousePosition = new PIXI$1.Point();
            var startValue = 0;
            var maxPosition;
            var triggerValueChange = function () {
                _this.emit('change', _this.value);
                if (_this._lastChange != _this.value) {
                    _this._lastChange = _this.value;
                    if (typeof _this.onValueChange === 'function') {
                        _this.onValueChange(_this.value);
                    }
                }
            };
            var triggerValueChanging = function () {
                _this.emit('changing', _this.value);
                if (_this._lastChanging != _this.value) {
                    _this._lastChanging = _this.value;
                    if (typeof _this.onValueChanging === 'function') {
                        _this.onValueChanging(_this.value);
                    }
                }
            };
            var updatePositionToMouse = function (mousePosition, soft) {
                _this.track.container.toLocal(mousePosition, null, localMousePosition, true);
                var newPos = _this.vertical ? localMousePosition.y - _this.handle._height * 0.5 : localMousePosition.x - _this.handle._width * 0.5;
                var maxPos = _this.vertical ? _this._height - _this.handle._height : _this._width - _this.handle._width;
                _this._amt = !maxPos ? 0 : Math.max(0, Math.min(1, newPos / maxPos));
                _this.update(soft);
                triggerValueChanging();
            };
            // //Handle dragging
            var handleDrag = new DragEvent(this.handle);
            handleDrag.onPress = function (event, isPressed) {
                event.stopPropagation();
            };
            handleDrag.onDragStart = function (event) {
                startValue = _this._amt;
                maxPosition = _this.vertical ? _this._height - _this.handle._height : _this._width - _this.handle._width;
            };
            handleDrag.onDragMove = function (event, offset) {
                _this._amt = !maxPosition ? 0 : Math.max(0, Math.min(1, startValue + ((_this.vertical ? offset.y : offset.x) / maxPosition)));
                triggerValueChanging();
                _this.update();
            };
            handleDrag.onDragEnd = function () {
                triggerValueChange();
                this.update();
            };
            // Bar pressing/dragging
            var trackDrag = new DragEvent(this.track);
            trackDrag.onPress = function (event, isPressed) {
                if (isPressed) {
                    updatePositionToMouse(event.data.global, true);
                }
                event.stopPropagation();
            };
            trackDrag.onDragMove = function (event) {
                updatePositionToMouse(event.data.global, false);
            };
            trackDrag.onDragEnd = function () {
                triggerValueChange();
            };
        };
        Object.defineProperty(Slider.prototype, "value", {
            get: function () {
                return Helpers.Round(Helpers.Lerp(this._minValue, this._maxValue, this._amt), this.decimals);
            },
            set: function (val) {
                this._amt = (Math.max(this._minValue, Math.min(this._maxValue, val)) - this._minValue) / (this._maxValue - this._minValue);
                if (typeof this.onValueChange === 'function') {
                    this.onValueChange(this.value);
                }
                if (typeof this.onValueChanging === 'function') {
                    this.onValueChanging(this.value);
                }
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "minValue", {
            get: function () {
                return this._minValue;
            },
            set: function (val) {
                this._minValue = val;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "maxValue", {
            get: function () {
                return this._maxValue;
            },
            set: function (val) {
                this._maxValue = val;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "disabled", {
            get: function () {
                return this._disabled;
            },
            set: function (val) {
                if (val !== this._disabled) {
                    this._disabled = val;
                    this.handle.container.buttonMode = !val;
                    this.handle.container.interactive = !val;
                    this.track.container.interactive = !val;
                }
            },
            enumerable: true,
            configurable: true
        });
        return Slider;
    }(UIBase));

    /**
     * An UI scrollbar to control a ScrollingContainer
     *
     * @class
     * @extends PIXI.UI.Slider
     * @memberof PIXI.UI
     * @param options {Object} ScrollBar settings
     * @param options.track {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)}  Any type of UIOBject, will be used for the scrollbar track
     * @param options.handle {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as scrollbar handle
     * @param options.scrollingContainer {PIXI.UI.ScrollingContainer} The container to control
     * @param [options.vertical=false] {boolean} Direction of the scrollbar
     * @param [options.autohide=false] {boolean} Hides the scrollbar when not needed
     */
    var ScrollBar = /** @class */ (function (_super) {
        __extends(ScrollBar, _super);
        function ScrollBar(options) {
            var _this = _super.call(this, {
                track: options.track,
                handle: options.handle,
                fill: null,
                vertical: options.vertical,
            }) || this;
            _this.scrollingContainer = options.scrollingContainer;
            _this.autohide = options.autohide;
            _this._hidden = false;
            return _this;
        }
        ScrollBar.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);
            this.decimals = 3; // up decimals to trigger ValueChanging more often
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            this.onValueChanging = function (val) {
                var sizeAmt = _this.scrollingContainer._height / _this.scrollingContainer.innerContainer.height || 0.001;
                if (sizeAmt < 1) {
                    _this.scrollingContainer.forcePctPosition(_this.vertical ? 'y' : 'x', _this._amt);
                }
            };
            this.scrollingContainer._scrollBars.push(this);
        };
        ScrollBar.prototype.alignToContainer = function () {
            var newPos;
            var size;
            var xY = this.vertical ? 'y' : 'x';
            var widthHeight = this.vertical ? 'height' : 'width';
            var topLeft = this.vertical ? 'top' : 'left';
            var _posAmt = !this.scrollingContainer.innerContainer[widthHeight]
                ? 0
                : -(this.scrollingContainer.innerContainer[xY] / this.scrollingContainer.innerContainer[widthHeight]);
            var sizeAmt = !this.scrollingContainer.innerContainer[widthHeight]
                ? 1
                : this.scrollingContainer["_" + widthHeight] / this.scrollingContainer.innerContainer[widthHeight];
            // update amt
            var diff = this.scrollingContainer.innerContainer[widthHeight] - this.scrollingContainer["_" + widthHeight];
            this._amt = !this.scrollingContainer["_" + widthHeight] || !diff
                ? 0
                : -(this.scrollingContainer.innerContainer[xY] / diff);
            if (sizeAmt >= 1) {
                size = this["_" + widthHeight];
                this.handle[topLeft] = size * 0.5;
                this.toggleHidden(true);
            }
            else {
                size = this["_" + widthHeight] * sizeAmt;
                if (this._amt > 1) {
                    size -= (this["_" + widthHeight] - size) * (this._amt - 1);
                }
                else if (this._amt < 0) {
                    size -= (this["_" + widthHeight] - size) * -this._amt;
                }
                if (this._amt < 0) {
                    newPos = size * 0.5;
                }
                else if (this._amt > 1) {
                    newPos = this["_" + widthHeight] - (size * 0.5);
                }
                else {
                    newPos = (_posAmt * this.scrollingContainer["_" + widthHeight]) + (size * 0.5);
                }
                this.handle[topLeft] = newPos;
                this.toggleHidden(false);
            }
            this.handle[widthHeight] = size;
        };
        ScrollBar.prototype.toggleHidden = function (hidden) {
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
        };
        return ScrollBar;
    }(Slider));

    var Ticker = /** @class */ (function (_super) {
        __extends(Ticker, _super);
        function Ticker(autoStart) {
            var _this = _super.call(this) || this;
            _this._disabled = true;
            _this._now = 0;
            _this.DeltaTime = 0;
            _this.Time = performance.now();
            _this.Ms = 0;
            if (autoStart) {
                _this.disabled = false;
            }
            Ticker.shared = _this;
            return _this;
        }
        Object.defineProperty(Ticker.prototype, "disabled", {
            get: function () {
                return this._disabled;
            },
            set: function (val) {
                if (!this._disabled) {
                    this._disabled = true;
                }
                else {
                    this._disabled = false;
                    Ticker.shared = this;
                    this.update(performance.now(), true);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Updates the text
         *
         * @private
         */
        Ticker.prototype.update = function (time) {
            Ticker.shared._now = time;
            Ticker.shared.Ms = Ticker.shared._now - Ticker.shared.Time;
            Ticker.shared.Time = Ticker.shared._now;
            Ticker.shared.DeltaTime = Ticker.shared.Ms * 0.001;
            Ticker.shared.emit('update', Ticker.shared.DeltaTime);
            Tween._update(Ticker.shared.DeltaTime);
            if (!Ticker.shared._disabled) {
                requestAnimationFrame(Ticker.shared.update);
            }
        };
        Ticker.on = function (event, fn, context) {
            Ticker.shared.on(event, fn, context);
        };
        Ticker.once = function (event, fn, context) {
            Ticker.shared.once(event, fn, context);
        };
        Ticker.removeListener = function (event, fn) {
            Ticker.shared.removeListener(event, fn);
        };
        return Ticker;
    }(PIXI$1.utils.EventEmitter));
    Ticker.shared = new Ticker(true);

    /**
     * An UI Container object with expandMask hidden and possibility to enable scrolling
     *
     * @class
     * @extends PIXI.UI.UIBase
     * @memberof PIXI.UI
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
    var ScrollingContainer = /** @class */ (function (_super) {
        __extends(ScrollingContainer, _super);
        function ScrollingContainer(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, options.width, options.height) || this;
            _this.mask = new PIXI$1.Graphics();
            _this.innerContainer = new PIXI$1.Container();
            _this.innerBounds = new PIXI$1.Rectangle();
            _this.container.addChild(_this.mask);
            _this.container.addChild(_this.innerContainer);
            _this.container.mask = _this.mask;
            _this.scrollX = options.scrollX !== undefined ? options.scrollX : false;
            _this.scrollY = options.scrollY !== undefined ? options.scrollY : false;
            _this.dragScrolling = options.dragScrolling !== undefined ? options.dragScrolling : true;
            _this.softness = options.softness !== undefined ? Math.max(Math.min(options.softness || 0, 1), 0) : 0.5;
            _this.radius = options.radius || 0;
            _this.expandMask = options.expandMask || 0;
            _this.overflowY = options.overflowY || 0;
            _this.overflowX = options.overflowX || 0;
            _this.animating = false;
            _this.scrolling = false;
            _this._scrollBars = [];
            _this.boundCached = performance.now() - 1000;
            return _this;
        }
        ScrollingContainer.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            if (this.scrollX || this.scrollY) {
                this.initScrolling();
            }
        };
        ScrollingContainer.prototype.update = function () {
            _super.prototype.update.call(this);
            if (this._lastWidth !== this._width || this._lastHeight !== this._height) {
                var of = this.expandMask;
                this.mask.clear();
                this.mask.lineStyle(0);
                this.mask.beginFill(0xFFFFFF, 1);
                if (this.radius === 0) {
                    // this.mask.drawRect(0, 0, this._width, this._height);
                    // this.mask.drawRect(-of, -of, this._width + of, this.height + of);
                    // this.mask.moveTo(-of, -of);
                    // this.mask.lineTo(this._width + of, -of);
                    // this.mask.lineTo(this._width + of, this._height + of);
                    // this.mask.lineTo(-of, this._height + of);
                    this.mask.drawRect(-of, -of, this._width + of, this._height + of);
                }
                else {
                    this.mask.drawRoundedRect(-of, -of, this._width + of, this.height + of, this.radius);
                }
                this.mask.endFill();
                this._lastWidth = this._width;
                this._lastHeight = this._height;
            }
            if (this.setScrollPosition) {
                this.setScrollPosition();
            }
        };
        ScrollingContainer.prototype.addChild = function () {
            var newChildren = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                newChildren[_i] = arguments[_i];
            }
            var argumentsLength = newChildren.length;
            if (argumentsLength > 1) {
                for (var i = 0; i < argumentsLength; i++) {
                    this.addChild(newChildren[i]);
                }
            }
            else {
                _super.prototype.addChild.call(this, newChildren[0]);
                this.innerContainer.addChild(newChildren[0].container);
                this.getInnerBounds(true); // make sure bounds is updated instantly when a child is added
            }
            return newChildren[0];
        };
        ScrollingContainer.prototype.updateScrollBars = function () {
            for (var i = 0; i < this._scrollBars.length; i++) {
                this._scrollBars[i].alignToContainer();
            }
        };
        ScrollingContainer.prototype.getInnerBounds = function (force) {
            // this is a temporary fix, because we cant rely on innercontainer height if the children is positioned > 0 y.
            if (force || performance.now() - this.boundCached > 1000) {
                this.innerContainer.getLocalBounds(this.innerBounds);
                this.innerContainer.getLocalBounds(this.innerBounds);
                this.innerBounds.height = this.innerBounds.y + this.innerContainer.height;
                this.innerBounds.width = this.innerBounds.x + this.innerContainer.width;
                this.boundCached = performance.now();
            }
            return this.innerBounds;
        };
        ScrollingContainer.prototype.initScrolling = function () {
            var _this = this;
            var container = this.innerContainer;
            var containerStart = new PIXI$1.Point();
            var targetPosition = new PIXI$1.Point();
            var lastPosition = new PIXI$1.Point();
            var Position = new PIXI$1.Point();
            var Speed = new PIXI$1.Point();
            var stop;
            this.forcePctPosition = function (direction, pct) {
                var bounds = _this.getInnerBounds();
                if (_this.scrollX && direction === 'x') {
                    container.position[direction] = -((bounds.width - _this._width) * pct);
                }
                if (_this.scrollY && direction === 'y') {
                    container.position[direction] = -((bounds.height - _this._height) * pct);
                }
                Position[direction] = targetPosition[direction] = container.position[direction];
            };
            this.focusPosition = function (pos) {
                var bounds = _this.getInnerBounds();
                var dif;
                if (_this.scrollX) {
                    var x = Math.max(0, (Math.min(bounds.width, pos.x)));
                    if (x + container.x > _this._width) {
                        dif = x - _this._width;
                        container.x = -dif;
                    }
                    else if (x + container.x < 0) {
                        dif = x + container.x;
                        container.x -= dif;
                    }
                }
                if (_this.scrollY) {
                    var y = Math.max(0, (Math.min(bounds.height, pos.y)));
                    if (y + container.y > _this._height) {
                        dif = y - _this._height;
                        container.y = -dif;
                    }
                    else if (y + container.y < 0) {
                        dif = y + container.y;
                        container.y -= dif;
                    }
                }
                lastPosition.copyFrom(container.position);
                targetPosition.copyFrom(container.position);
                Position.copyFrom(container.position);
                _this.updateScrollBars();
            };
            this.setScrollPosition = function (speed) {
                if (speed) {
                    Speed = speed;
                }
                if (!_this.animating) {
                    _this.animating = true;
                    lastPosition.copyFrom(container.position);
                    targetPosition.copyFrom(container.position);
                    Ticker.on('update', _this.updateScrollPosition, _this);
                }
            };
            this.updateScrollPosition = function (delta) {
                stop = true;
                if (_this.scrollX)
                    _this.updateDirection('x', delta);
                if (_this.scrollY)
                    _this.updateDirection('y', delta);
                if (stop) {
                    Ticker.removeListener('update', _this.updateScrollPosition);
                    _this.animating = false;
                }
            };
            this.updateDirection = function (direction, delta) {
                var bounds = _this.getInnerBounds();
                var min;
                if (direction === 'y') {
                    min = Math.round(Math.min(0, _this._height - bounds.height));
                }
                else {
                    min = Math.round(Math.min(0, _this._width - bounds.width));
                }
                if (!_this.scrolling && Math.round(Speed[direction]) !== 0) {
                    targetPosition[direction] += Speed[direction];
                    Speed[direction] = Helpers.Lerp(Speed[direction], 0, (5 + 2.5 / Math.max(_this.softness, 0.01)) * delta);
                    if (targetPosition[direction] > 0) {
                        targetPosition[direction] = 0;
                    }
                    else if (targetPosition[direction] < min) {
                        targetPosition[direction] = min;
                    }
                }
                if (!_this.scrolling && Math.round(Speed[direction]) === 0
                    && (container[direction] > 0 || container[direction] < min)) {
                    var target = Position[direction] > 0 ? 0 : min;
                    Position[direction] = Helpers.Lerp(Position[direction], target, (40 - (30 * _this.softness)) * delta);
                    stop = false;
                }
                else if (_this.scrolling || Math.round(Speed[direction]) !== 0) {
                    if (_this.scrolling) {
                        Speed[direction] = Position[direction] - lastPosition[direction];
                        lastPosition.copyFrom(Position);
                    }
                    if (targetPosition[direction] > 0) {
                        Speed[direction] = 0;
                        Position[direction] = 100 * _this.softness * (1 - Math.exp(targetPosition[direction] / -200));
                    }
                    else if (targetPosition[direction] < min) {
                        Speed[direction] = 0;
                        Position[direction] = min - (100 * _this.softness * (1 - Math.exp((min - targetPosition[direction]) / -200)));
                    }
                    else {
                        Position[direction] = targetPosition[direction];
                    }
                    stop = false;
                }
                container.position[direction] = Math.round(Position[direction]);
                _this.updateScrollBars();
            };
            // Drag scroll
            if (this.dragScrolling) {
                var drag = new DragEvent(this);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                drag.onDragStart = function (e) {
                    if (!_this.scrolling) {
                        containerStart.copyFrom(container.position);
                        Position.copyFrom(container.position);
                        _this.scrolling = true;
                        _this.setScrollPosition();
                        _this.emit('dragStart', e);
                    }
                };
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                drag.onDragMove = function (e, offset) {
                    if (_this.scrollX) {
                        targetPosition.x = containerStart.x + offset.x;
                    }
                    if (_this.scrollY) {
                        targetPosition.y = containerStart.y + offset.y;
                    }
                };
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                drag.onDragEnd = function (e) {
                    if (_this.scrolling) {
                        _this.scrolling = false;
                        _this.emit('dragEnd', e);
                    }
                };
            }
            // Mouse scroll
            var scrollSpeed = new PIXI$1.Point();
            var scroll = new MouseScrollEvent(this, true);
            scroll.onMouseScroll = function (e, delta) {
                scrollSpeed.set(-delta.x * 0.2, -delta.y * 0.2);
                _this.setScrollPosition(scrollSpeed);
            };
            this.updateScrollBars();
        };
        return ScrollingContainer;
    }(Container));

    function getCjsExportFromNamespace (n) {
    	return n && n['default'] || n;
    }

    var Container$2 = getCjsExportFromNamespace(Container$1);

    var Tween$2 = getCjsExportFromNamespace(Tween$1);

    /**
     * An UI Container object
     *
     * @class
     * @extends PIXI.UI.UIBase
     * @memberof PIXI.UI
     * @param desc {Boolean} Sort the list descending
     * @param tweenTime {Number} if above 0 the sort will be animated
     * @param tweenEase {PIXI.UI.Ease} ease method used for animation
     */

    function SortableList(desc, tweenTime, tweenEase)
    {
        Container$2.call(this);
        this.desc = typeof desc !== 'undefined' ? desc : false;
        this.tweenTime = tweenTime || 0;
        this.tweenEase = tweenEase;
        this.items = [];
    }

    SortableList.prototype = Object.create(Container$2.prototype);
    SortableList.prototype.constructor = SortableList;
    var SortableList_1 = SortableList;

    SortableList.prototype.addChild = function (UIObject, fnValue, fnThenBy)
    {
        Container$2.prototype.addChild.call(this, UIObject);
        if (this.items.indexOf(UIObject) == -1)
        {
            this.items.push(UIObject);
        }

        if (typeof fnValue === 'function')
        { UIObject._sortListValue = fnValue; }

        if (typeof fnThenBy === 'function')
        { UIObject._sortListThenByValue = fnThenBy; }

        if (!UIObject._sortListRnd)
        { UIObject._sortListRnd = Math.random(); }

        this.sort();
    };

    SortableList.prototype.removeChild = function (UIObject)
    {
        if (arguments.length > 1)
        {
            for (let i = 0; i < arguments.length; i++)
            {
                this.removeChild(arguments[i]);
            }
        }
        else
        {
            Container$2.prototype.removeChild.call(this, UIObject);
            const index = this.items.indexOf(UIObject);

            if (index != -1)
            {
                this.items.splice(index, 1);
            }
            this.sort();
        }
    };

    SortableList.prototype.sort = function (instant)
    {
        clearTimeout(this._sortTimeout);

        if (instant)
        {
            this._sort();

            return;
        }

        const _this = this;

        this._sortTimeout = setTimeout(function () { _this._sort(); }, 0);
    };

    SortableList.prototype._sort = function ()
    {
        const self = this;
        const desc = this.desc;
        let y = 0;
        let alt = true;

        this.items.sort(function (a, b)
        {
            let res = a._sortListValue() < b._sortListValue() ? desc ? 1 : -1
                : a._sortListValue() > b._sortListValue() ? desc ? -1 : 1 : 0;

            if (res === 0 && a._sortListThenByValue && b._sortListThenByValue)
            {
                res = a._sortListThenByValue() < b._sortListThenByValue() ? desc ? 1 : -1
                    : a._sortListThenByValue() > b._sortListThenByValue() ? desc ? -1 : 1 : 0;
            }
            if (res === 0)
            {
                res = a._sortListRnd > b._sortListRnd ? 1
                    : a._sortListRnd < b._sortListRnd ? -1 : 0;
            }

            return res;
        });

        for (let i = 0; i < this.items.length; i++)
        {
            const item = this.items[i];

            alt = !alt;

            if (this.tweenTime > 0)
            {
                Tween$2.fromTo(item, this.tweenTime, { x: item.x, y: item.y }, { x: 0, y }, this.tweenEase);
            }
            else
            {
                item.x = 0;
                item.y = y;
            }
            y += item.height;
            if (typeof item.altering === 'function')
            { item.altering(alt); }
        }

        // force it to update parents when sort animation is done (prevent scrolling container bug)
        if (this.tweenTime > 0)
        {
            setTimeout(function ()
            {
                self.updatesettings(false, true);
            }, this.tweenTime * 1000);
        }
    };

    /**
     * A sliced sprite with dynamic width and height.
     *
     * @class
     * @memberof PIXI.UI
     * @param Texture {PIXI.Texture} the texture for this SliceSprite
     * @param BorderWidth {Number} Width of the sprite borders
     * @param horizontalSlice {Boolean} Slice the sprite horizontically
     * @param verticalSlice {Boolean} Slice the sprite vertically
     * @param [tile=false] {Boolean} tile or streach
     */
    function SliceSprite(texture, borderWidth, horizontalSlice, verticalSlice, tile)
    {
        UIBase.call(this, texture.width, texture.height);

        let ftl; let ftr; let fbl; let fbr; let ft; let fb; let fl; let fr; let ff; let stl; let str; let sbl; let sbr; let st; let sb; let sl; let sr; let sf;
        const bw = borderWidth || 5;
        const vs = typeof verticalSlice !== 'undefined' ? verticalSlice : true;
        const hs = typeof horizontalSlice !== 'undefined' ? horizontalSlice : true;
        const t = texture.baseTexture;
        const f = texture.frame;

        if (hs) this.setting.minWidth = borderWidth * 2;
        if (vs) this.setting.minHeight = borderWidth * 2;

        this.initialize = function ()
        {
            UIBase.prototype.initialize.apply(this);

            // get frames
            if (vs && hs)
            {
                ftl = new PIXI.Rectangle(f.x, f.y, bw, bw);
                ftr = new PIXI.Rectangle(f.x + f.width - bw, f.y, bw, bw);
                fbl = new PIXI.Rectangle(f.x, f.y + f.height - bw, bw, bw);
                fbr = new PIXI.Rectangle(f.x + f.width - bw, f.y + f.height - bw, bw, bw);
                ft = new PIXI.Rectangle(f.x + bw, f.y, f.width - bw * 2, bw);
                fb = new PIXI.Rectangle(f.x + bw, f.y + f.height - bw, f.width - bw * 2, bw);
                fl = new PIXI.Rectangle(f.x, f.y + bw, bw, f.height - bw * 2);
                fr = new PIXI.Rectangle(f.x + f.width - bw, f.y + bw, bw, f.height - bw * 2);
                ff = new PIXI.Rectangle(f.x + bw, f.y + bw, f.width - bw * 2, f.height - bw * 2);
            }
            else if (hs)
            {
                fl = new PIXI.Rectangle(f.x, f.y, bw, f.height);
                fr = new PIXI.Rectangle(f.x + f.width - bw, f.y, bw, f.height);
                ff = new PIXI.Rectangle(f.x + bw, f.y, f.width - bw * 2, f.height);
            }
            else
            { // vs
                ft = new PIXI.Rectangle(f.x, f.y, f.width, bw);
                fb = new PIXI.Rectangle(f.x, f.y + f.height - bw, f.width, bw);
                ff = new PIXI.Rectangle(f.x, f.y + bw, f.width, f.height - bw * 2);
            }

            // TODO: swap frames if rotation

            // make sprites
            sf = tile ? new PIXI.extras.TilingSprite(new PIXI.Texture(t, ff)) : new PIXI.Sprite(new PIXI.Texture(t, ff));
            this.container.addChildAt(sf, 0);
            if (vs && hs)
            {
                stl = new PIXI.Sprite(new PIXI.Texture(t, ftl));
                str = new PIXI.Sprite(new PIXI.Texture(t, ftr));
                sbl = new PIXI.Sprite(new PIXI.Texture(t, fbl));
                sbr = new PIXI.Sprite(new PIXI.Texture(t, fbr));
                this.container.addChildAt(stl, 0);
                this.container.addChildAt(str, 0);
                this.container.addChildAt(sbl, 0);
                this.container.addChildAt(sbr, 0);
            }
            if (hs)
            {
                sl = tile ? new PIXI.extras.TilingSprite(new PIXI.Texture(t, fl)) : new PIXI.Sprite(new PIXI.Texture(t, fl));
                sr = tile ? new PIXI.extras.TilingSprite(new PIXI.Texture(t, fr)) : new PIXI.Sprite(new PIXI.Texture(t, fr));
                this.container.addChildAt(sl, 0);
                this.container.addChildAt(sr, 0);
            }
            if (vs)
            {
                st = tile ? new PIXI.extras.TilingSprite(new PIXI.Texture(t, ft)) : new PIXI.Sprite(new PIXI.Texture(t, ft));
                sb = tile ? new PIXI.extras.TilingSprite(new PIXI.Texture(t, fb)) : new PIXI.Sprite(new PIXI.Texture(t, fb));
                this.container.addChildAt(st, 0);
                this.container.addChildAt(sb, 0);
            }

            // set constant position and sizes
            if (vs && hs) st.x = sb.x = sl.y = sr.y = stl.width = str.width = sbl.width = sbr.width = stl.height = str.height = sbl.height = sbr.height = bw;
            if (hs) sf.x = sl.width = sr.width = bw;
            if (vs) sf.y = st.height = sb.height = bw;
        };

        /**
         * Updates the sliced sprites position and size
         *
         * @private
         */
        this.update = function ()
        {
            if (!this.initialized) return;
            if (vs && hs)
            {
                str.x = sbr.x = sr.x = this._width - bw;
                sbl.y = sbr.y = sb.y = this._height - bw;
                sf.width = st.width = sb.width = this._width - bw * 2;
                sf.height = sl.height = sr.height = this._height - bw * 2;
            }
            else if (hs)
            {
                sr.x = this._width - bw;
                sl.height = sr.height = sf.height = this._height;
                sf.width = this._width - bw * 2;
            }
            else
            { // vs
                sb.y = this._height - bw;
                st.width = sb.width = sf.width = this._width;
                sf.height = this._height - bw * 2;
            }

            if (this.tint !== null)
            {
                sf.tint = this.tint;
                if (vs && hs) stl.tint = str.tint = sbl.tint = sbr.tint = this.tint;
                if (hs) sl.tint = sr.tint = this.tint;
                if (vs) st.tint = sb.tint = this.tint;
            }

            if (this.blendMode !== null)
            {
                sf.blendMode = this.blendMode;
                if (vs && hs) stl.blendMode = str.blendMode = sbl.blendMode = sbr.blendMode = this.blendMode;
                if (hs) sl.blendMode = sr.blendMode = this.blendMode;
                if (vs) st.blendMode = sb.blendMode = this.blendMode;
            }
        };
    }

    SliceSprite.prototype = Object.create(UIBase.prototype);
    SliceSprite.prototype.constructor = SliceSprite;

    /**
     * An UI sprite object
     *
     * @class
     * @extends PIXI.UI.UIBase
     * @memberof PIXI.UI
     * @param Texture {PIXI.Texture} The texture for the sprite
     */
    var Sprite = /** @class */ (function (_super) {
        __extends(Sprite, _super);
        function Sprite(texture) {
            var _this = this;
            var sprite = new PIXI$1.Sprite(texture);
            _this = _super.call(this, sprite.width, sprite.height) || this;
            _this.sprite = sprite;
            _this.container.addChild(_this.sprite);
            return _this;
        }
        Sprite.prototype.update = function () {
            if (this.tint !== null) {
                this.sprite.tint = this.tint;
            }
            if (this.blendMode !== null) {
                this.sprite.blendMode = this.blendMode;
            }
            this.sprite.width = this._width;
            this.sprite.height = this._height;
        };
        Sprite.fromImage = function (imageUrl) {
            return new Sprite(new PIXI$1.Texture(new PIXI$1.BaseTexture(imageUrl)));
        };
        return Sprite;
    }(UIBase));

    /**
     * A Stage for UIObjects
     *
     * @class
     * @extends PIXI.UI.Container
     * @memberof PIXI.UI
     * @param width {Number} Width of the Stage
     * @param height {Number} Height of the Stage
     */
    function Stage(width, height)
    {
        PIXI.Container.call(this);
        this.__width = width;
        this.__height = height;
        this.minWidth = 0;
        this.minHeight = 0;

        this.UIChildren = [];
        this.stage = this;
        this.interactive = true;
        this.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
        this.initialized = true;
        this.resize(width, height);
    }

    Stage.prototype = Object.create(PIXI.Container.prototype);
    Stage.prototype.constructor = Stage;

    Stage.prototype.addChild = function (UIObject)
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
            if (UIObject.parent !== null)
            { UIObject.parent.removeChild(UIObject); }

            UIObject.parent = this;
            this.UIChildren.push(UIObject);
            PIXI.Container.prototype.addChild.call(this, UIObject.container);
            UIObject.updatesettings(true);
        }
    };

    Stage.prototype.removeChild = function (UIObject)
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
            PIXI.Container.prototype.removeChild.call(this, UIObject.container);
            const index = this.UIChildren.indexOf(UIObject);

            if (index != -1)
            {
                this.UIChildren.splice(index, 1);
                UIObject.parent = null;
            }
        }
    };

    Stage.prototype.resize = function (width, height)
    {
        if (!isNaN(height)) this.__height = height;
        if (!isNaN(width)) this.__width = width;

        if (this.minWidth || this.minHeight)
        {
            let rx = 1;
            let ry = 1;

            if (width && width < this.minWidth)
            {
                rx = this.minWidth / width;
            }

            if (height && height < this.minHeight)
            {
                ry = this.minHeight / height;
            }

            if (rx > ry && rx > 1)
            {
                this.scale.set(1 / rx);
                this.__height *= rx;
                this.__width *= rx;
            }
            else if (ry > 1)
            {
                this.scale.set(1 / ry);
                this.__width *= ry;
                this.__height *= ry;
            }
            else if (this.scale.x !== 1)
            {
                this.scale.set(1);
            }
        }

        this.hitArea.width = this.__width;
        this.hitArea.height = this.__height;

        for (let i = 0; i < this.UIChildren.length; i++)
        { this.UIChildren[i].updatesettings(true, false); }
    };

    Object.defineProperties(Stage.prototype, {
        _width: {
            get()
            {
                return this.__width;
            },
            set(val)
            {
                if (!isNaN(val))
                {
                    this.__width = val;
                    this.resize();
                }
            },
        },
        _height: {
            get()
            {
                return this.__height;
            },
            set(val)
            {
                if (!isNaN(val))
                {
                    this.__height = val;
                    this.resize();
                }
            },
        },
    });

    /**
     * An UI text object
     *
     * @class
     * @extends PIXI.UI.UIBase
     * @memberof PIXI.UI
     * @param Text {String} Text content
     * @param TextStyle {PIXI.TextStyle} Style used for the Text
     */
    function Text(text, PIXITextStyle)
    {
        this._text = new PIXI.Text(text, PIXITextStyle);
        UIBase.call(this, this._text.width, this._text.height);
        this.container.addChild(this._text);

        this.baseupdate = function ()
        {
            // force original text width unless using anchors
            if (this._anchorLeft === null || this._anchorRight === null)
            {
                this.setting.width = this._text.width;
                this.setting.widthPct = null;
            }
            else
            {
                this._text.width = this._width;
            }

            // force original text height unless using anchors
            if (this._anchorTop === null || this._anchorBottom === null)
            {
                this.setting.height = this._text.height;
                this.setting.heightPct = null;
            }
            else
            {
                this._text.width = this._width;
            }

            UIBase.prototype.baseupdate.call(this);
        };

        this.update = function ()
        {
            // set tint
            if (this.tint !== null)
            { this._text.tint = this.tint; }

            // set blendmode
            if (this.blendMode !== null)
            { this._text.blendMode = this.blendMode; }
        };
    }

    Text.prototype = Object.create(UIBase.prototype);
    Text.prototype.constructor = Text;
    module.exports = Text;

    Object.defineProperties(Text.prototype, {
        value: {
            get()
            {
                return this._text.text;
            },
            set(val)
            {
                this._text.text = val;
                this.updatesettings(true);
            },
        },
        text: {
            get()
            {
                return this.value;
            },
            set(val)
            {
                this.value = val;
            },
        },
    });

    /**
     * An UI text object
     *
     * @class
     * @extends PIXI.UI.InputBase
     * @memberof PIXI.UI
     * @param options.value {String} Text content
     * @param [options.multiLine=false] {Boolean} Multiline input
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
    function TextInput(options)
    {
        // create temp input (for mobile keyboard)
        if (typeof _pui_tempInput === 'undefined')
        {
            _pui_tempInput = document.createElement('INPUT');
            _pui_tempInput.setAttribute('type', 'text');
            _pui_tempInput.setAttribute('id', '_pui_tempInput');
            _pui_tempInput.setAttribute('style', 'position:fixed; left:-10px; top:-10px; width:0px; height: 0px;');
            document.body.appendChild(_pui_tempInput);
        }
        const width = typeof options.width !== 'undefined' ? options.width : options.background ? options.background.width : 150;
        const height = typeof options.height !== 'undefined' ? options.height : options.background ? options.background.height : 150;

        InputBase.call(this, width, height, options.tabIndex || 0, options.tabGroup || 0);

        this._dirtyText = true;
        this.maxLength = options.maxLength || 0;
        this._value = this._lastValue = options.value || '';

        if (this.maxLength) this._value = this._value.slice(0, this.maxLength);

        const self = this;
        const chars = [];
        const multiLine = options.multiLine !== undefined ? options.multiLine : false;
        const color = options.style && options.style.fill ? options.style.fill : '#000000';
        const selectedColor = options.selectedColor || '#ffffff';
        const selectedBackgroundColor = options.selectedBackgroundColor || '#318cfa';
        const tempText = new PIXI.Text('1', options.style);
        const textHeight = tempText.height;
        const lineHeight = options.lineHeight || textHeight || self._height;

        tempText.destroy();

        // set cursor
        // this.container.cursor = "text";

        // selection graphics
        const selection = self.selection = new PIXI.Graphics();

        selection.visible = false;
        selection._startIndex = 0;
        selection._endIndex = 0;

        // caret graphics
        const caret = self.caret = new PIXI.Graphics();

        caret.visible = false;
        caret._index = 0;
        caret.lineStyle(options.caretWidth || 1, '#ffffff', 1);
        caret.moveTo(0, 0);
        caret.lineTo(0, textHeight);

        // insert bg
        if (options.background)
        {
            this.background = options.background;
            this.background.width = '100%';
            this.background.height = '100%';
            this.addChild(this.background);
        }

        // var padding
        const paddingLeft = options.paddingLeft !== undefined ? options.paddingLeft : options.padding !== undefined ? options.padding : 3;
        const paddingRight = options.paddingRight !== undefined ? options.paddingRight : options.padding !== undefined ? options.padding : 3;
        const paddingBottom = options.paddingBottom !== undefined ? options.paddingBottom : options.padding !== undefined ? options.padding : 3;
        const paddingTop = options.paddingTop !== undefined ? options.paddingTop : options.padding !== undefined ? options.padding : 3;

        // insert text container (scrolling container)
        const textContainer = this.textContainer = new PIXI.UI.ScrollingContainer({
            scrollX: !multiLine,
            scrollY: multiLine,
            dragScrolling: multiLine,
            expandMask: 2,
            softness: 0.2,
            overflowX: 40,
            overflowY: 40,
        });

        textContainer.anchorTop = paddingTop;
        textContainer.anchorBottom = paddingBottom;
        textContainer.anchorLeft = paddingLeft;
        textContainer.anchorRight = paddingRight;
        this.addChild(textContainer);

        if (multiLine)
        {
            this._useNext = this._usePrev = false;
            textContainer.dragRestrictAxis = 'y';
            textContainer.dragThreshold = 5;
            this.dragRestrictAxis = 'x';
            this.dragThreshold = 5;
        }

        const innerContainer = textContainer.innerContainer;

        this.update = function ()
        {
            if (this._width != this._lastWidth)
            {
                this._lastWidth = this._width;
                if (multiLine)
                {
                    updateText();
                    if (caret.visible) self.setCaretIndex(caret._index);
                    if (hasSelection) updateSelectionGraphics();
                }
            }

            // update text
            if (this._dirtyText)
            {
                updateText();
                this._dirtyText = false;
            }
        };

        // selection Vars
        let caretInterval; // interval for flash
        let si; // startIndex
        let sie; // startIndexEnd
        let ei; // endIndex
        let eie; // endIndexEnd
        const sp = new PIXI.Point(); // startposition
        const ds = new PIXI.Point(); // dragStart
        const de = new PIXI.Point(); // dragend
        let rdd = false; // Reverse drag direction
        let vrdd = false; // vertical Reverse drag direction
        let selectionStart = -1;
        let selectionEnd = -1;
        var hasSelection = false;
        let t = performance.now(); // timestamp
        let cc = 0; // click counter
        let textHeightPX = 0;
        let lineIndexMax = 0;
        let ctrlDown = false;
        let shiftDown = false;
        const shiftKey = 16;
        const ctrlKey = 17;
        const cmdKey = 91;

        var updateText = function ()
        {
            textHeightPX = 0;
            lineIndexMax = 0;

            let lineIndex = 0;
            const length = self._value.length;
            let x = 0;
            let y = (lineHeight - textHeight) * 0.5;
            let i = 0;

            // destroy excess chars
            if (chars.length > length)
            {
                for (i = chars.length - 1; i >= length; i--)
                {
                    innerContainer.removeChild(chars[i]);
                    chars[i].destroy();
                }
                chars.splice(length, chars.length - length);
            }

            // update and add chars
            let whitespace = false;
            let newline = false;
            let wordIndex = 0;
            let lastWordIndex = -1;
            let wrap = false;

            for (i = 0; i < self._value.length; i++)
            {
                if (whitespace || newline)
                {
                    lastWordIndex = i;
                    wordIndex++;
                }

                let c = self._value[i];

                whitespace = c === ' ';
                newline = c === '\n';

                if (newline)
                { // newline "hack". webgl render errors if \n is passed to text
                    c = '';
                }

                let charText = chars[i];

                if (!charText)
                {
                    charText = new PIXI.Text(c, options.style);
                    innerContainer.addChild(charText);
                    chars.push(charText);
                }
                else
                {
                    charText.text = c;
                }

                charText.scale.x = newline ? 0 : 1;
                charText.wrapped = wrap;
                wrap = false;

                if (newline || (multiLine && x + charText.width >= self._width - paddingLeft - paddingRight))
                {
                    lineIndex++;
                    x = 0;
                    y += lineHeight;

                    if (lastWordIndex != -1 && !newline)
                    {
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
                if (y > textHeightPX)
                { textHeightPX = y; }
            }

            lineIndexMax = lineIndex;

            // put caret on top
            innerContainer.addChild(caret);

            // recache
            if (innerContainer.cacheAsBitmap)
            {
                innerContainer.cacheAsBitmap = false;
                innerContainer.cacheAsBitmap = true;
            }

            textContainer.update();
        };

        const updateClosestIndex = function (point, start)
        {
            let currentDistX = 99999;
            let currentIndex = -1;
            let atEnd = false;

            let closestLineIndex = 0;

            if (lineIndexMax > 0)
            { closestLineIndex = Math.max(0, Math.min(lineIndexMax, Math.floor(point.y / lineHeight))); }

            for (let i = 0; i < chars.length; i++)
            {
                const char = chars[i];

                if (char.lineIndex != closestLineIndex) continue;

                const distX = Math.abs(point.x - (char.x + (char.width * 0.5)));

                if (distX < currentDistX)
                {
                    currentDistX = distX;
                    currentIndex = i;
                    atEnd = point.x > char.x + (char.width * 0.5);
                }
            }

            if (start)
            {
                si = currentIndex;
                sie = atEnd;
            }
            else
            {
                ei = currentIndex;
                eie = atEnd;
            }
        };

        const deleteSelection = function ()
        {
            if (hasSelection)
            {
                self.value = self.value.slice(0, selectionStart) + self.value.slice(selectionEnd + 1);
                self.setCaretIndex(selectionStart);

                return true;
            }

            return false;
        };

        const updateSelectionColors = function ()
        {
            // Color charecters
            for (let i = 0; i < chars.length; i++)
            {
                if (i >= selectionStart && i <= selectionEnd)
                { chars[i].style.fill = selectedColor; }
                else
                { chars[i].style.fill = color; }
            }
        };

        const _sp = new PIXI.Point();
        const scrollToPosition = function (pos)
        {
            _sp.copy(pos);
            if (multiLine && _sp.y >= lineHeight)
            { _sp.y += lineHeight; }
            textContainer.focusPosition(_sp);
        };

        const resetScrollPosition = function ()
        {
            _sp.set(0, 0);
            textContainer.focusPosition(_sp);
        };

        // caret
        const hideCaret = function ()
        {
            caret.visible = false;
            clearInterval(caretInterval);
        };

        const showCaret = function ()
        {
            self.clearSelection();
            clearInterval(caretInterval);
            caret.alpha = 1;
            caret.visible = true;
            caretInterval = setInterval(function ()
            {
                caret.alpha = caret.alpha === 0 ? 1 : 0;
            }, 500);
        };

        const insertTextAtCaret = function (c)
        {
            if (!multiLine && c.indexOf('\n') != -1)
            {
                c = c.replace(/\n/g, '');
            }

            if (hasSelection)
            { deleteSelection(); }
            if (!self.maxLength || chars.length < self.maxLength)
            {
                if (caret._atEnd)
                {
                    self.valueEvent += c;
                    self.setCaretIndex(chars.length);
                }
                else
                {
                    const index = Math.min(chars.length - 1, caret._index);

                    self.valueEvent = self.value.slice(0, index) + c + self.value.slice(index);
                    self.setCaretIndex(index + c.length);
                }
            }
        };

        // events
        const keyDownEvent = function (e)
        {
            if (e.which === ctrlKey || e.which === cmdKey) ctrlDown = true;
            if (e.which === shiftKey) shiftDown = true;

            self.emit('keydown', e);

            if (e.defaultPrevented)
            { return; }

            if (e.which === 13)
            { // enter
                insertTextAtCaret('\n');
                e.preventDefault();

                return;
            }

            if (ctrlDown)
            {
                // ctrl + ?
                if (e.which === 65)
                { // ctrl + a
                    self.select();
                    e.preventDefault();

                    return;
                }
                else if (e.which === 90)
                { // ctrl + z (undo)
                    if (self.value != self._lastValue)
                    { self.valueEvent = self._lastValue; }
                    self.setCaretIndex(self._lastValue.length + 1);
                    e.preventDefault();

                    return;
                }
            }
            if (e.which === 8)
            {
                // backspace
                if (!deleteSelection())
                {
                    if (caret._index > 0 || (chars.length === 1 && caret._atEnd))
                    {
                        if (caret._atEnd)
                        {
                            self.valueEvent = self.value.slice(0, chars.length - 1);
                            self.setCaretIndex(caret._index);
                        }
                        else
                        {
                            self.valueEvent = self.value.slice(0, caret._index - 1) + self.value.slice(caret._index);
                            self.setCaretIndex(caret._index - 1);
                        }
                    }
                }
                e.preventDefault();

                return;
            }

            if (e.which === 46)
            {
                // delete
                if (!deleteSelection())
                {
                    if (!caret._atEnd)
                    {
                        self.valueEvent = self.value.slice(0, caret._index) + self.value.slice(caret._index + 1);
                        self.setCaretIndex(caret._index);
                    }
                }
                e.preventDefault();

                return;
            }
            else if (e.which === 37 || e.which === 39)
            {
                rdd = e.which === 37;
                if (shiftDown)
                {
                    if (hasSelection)
                    {
                        const caretAtStart = selectionStart === caret._index;

                        if (caretAtStart)
                        {
                            if (selectionStart === selectionEnd && rdd === caret._forward)
                            {
                                self.setCaretIndex(caret._forward ? caret._index : caret._index + 1);
                            }
                            else
                            {
                                const startindex = rdd ? caret._index - 1 : caret._index + 1;

                                self.selectRange(startindex, selectionEnd);
                                caret._index = Math.min(chars.length - 1, Math.max(0, startindex));
                            }
                        }
                        else
                        {
                            const endIndex = rdd ? caret._index - 1 : caret._index + 1;

                            self.selectRange(selectionStart, endIndex);
                            caret._index = Math.min(chars.length - 1, Math.max(0, endIndex));
                        }
                    }
                    else
                    {
                        const _i = caret._atEnd ? caret._index + 1 : caret._index;
                        const selectIndex = rdd ? _i - 1 : _i;

                        self.selectRange(selectIndex, selectIndex);
                        caret._index = selectIndex;
                        caret._forward = !rdd;
                    }
                }
                else
                {
                    // Navigation
                    if (hasSelection)
                    { self.setCaretIndex(rdd ? selectionStart : selectionEnd + 1); }
                    else
                    { self.setCaretIndex(caret._index + (rdd ? caret._atEnd ? 0 : -1 : 1)); }
                }
                e.preventDefault();

                return;
            }
            else if (multiLine && (e.which === 38 || e.which === 40))
            {
                vrdd = e.which === 38;
                if (shiftDown)
                {
                    if (hasSelection)
                    {
                        de.y = Math.max(0, Math.min(textHeightPX, de.y + (vrdd ? -lineHeight : lineHeight)));
                        updateClosestIndex(de, false);
                        // console.log(si, ei);
                        if (Math.abs(si - ei) <= 1)
                        {
                            // console.log(si, ei);
                            self.setCaretIndex(sie ? si + 1 : si);
                        }
                        else
                        {
                            caret._index = (eie ? ei + 1 : ei) + (caret._down ? -1 : 0);
                            self.selectRange(caret._down ? si : si - 1, caret._index);
                        }
                    }
                    else
                    {
                        si = caret._index;
                        sie = false;
                        de.copy(caret);
                        de.y = Math.max(0, Math.min(textHeightPX, de.y + (vrdd ? -lineHeight : lineHeight)));
                        updateClosestIndex(de, false);
                        caret._index = (eie ? ei + 1 : ei) - (vrdd ? 0 : 1);
                        self.selectRange(vrdd ? si - 1 : si, caret._index);
                        caret._down = !vrdd;
                    }
                }
                else
                if (hasSelection)
                {
                    self.setCaretIndex(vrdd ? selectionStart : selectionEnd + 1);
                }
                else
                {
                    ds.copy(caret);
                    ds.y += vrdd ? -lineHeight : lineHeight;
                    ds.x += 1;
                    updateClosestIndex(ds, true);
                    self.setCaretIndex(sie ? si + 1 : si);
                }
                e.preventDefault();

                return;
            }
        };

        const keyUpEvent = function (e)
        {
            if (e.which == ctrlKey || e.which == cmdKey) ctrlDown = false;
            if (e.which === shiftKey) shiftDown = false;

            self.emit('keyup', e);

            if (e.defaultPrevented)
            { return; }
        };

        const copyEvent = function (e)
        {
            self.emit('copy', e);

            if (e.defaultPrevented)
            { return; }

            if (hasSelection)
            {
                const clipboardData = e.clipboardData || window.clipboardData;

                clipboardData.setData('Text', self.value.slice(selectionStart, selectionEnd + 1));
            }
            e.preventDefault();
        };

        const cutEvent = function (e)
        {
            self.emit('cut', e);

            if (e.defaultPrevented)
            { return; }

            if (hasSelection)
            {
                copyEvent(e);
                deleteSelection();
            }
            e.preventDefault();
        };

        const pasteEvent = function (e)
        {
            self.emit('paste', e);

            if (e.defaultPrevented)
            { return; }

            const clipboardData = e.clipboardData || window.clipboardData;

            insertTextAtCaret(clipboardData.getData('Text'));
            e.preventDefault();
        };

        const inputEvent = function (e)
        {
            const c = _pui_tempInput.value;

            if (c.length)
            {
                insertTextAtCaret(c);
                _pui_tempInput.value = '';
            }
            e.preventDefault();
        };

        const inputBlurEvent = function (e)
        {
            self.blur();
        };

        const event = new DragEvent(this);

        event.onPress = function (e, mouseDown)
        {
            if (mouseDown)
            {
                const timeSinceLast = performance.now() - t;

                t = performance.now();
                if (timeSinceLast < 250)
                {
                    cc++;
                    if (cc > 1)
                    { this.select(); }
                    else
                    {
                        innerContainer.toLocal(sp, undefined, ds, true);
                        updateClosestIndex(ds, true);
                        const c = chars[si];

                        if (c)
                        {
                            if (c.wordIndex != -1)
                            { this.selectWord(c.wordIndex); }
                            else
                            { this.selectRange(si, si); }
                        }
                    }
                }
                else
                {
                    cc = 0;
                    sp.copy(e.data.global);
                    innerContainer.toLocal(sp, undefined, ds, true);
                    if (chars.length)
                    {
                        updateClosestIndex(ds, true);
                        self.setCaretIndex(sie ? si + 1 : si);
                    }
                }
            }
            e.data.originalEvent.preventDefault();
        };

        event.onDragMove = function (e, offset)
        {
            if (!chars.length || !this._focused) return;

            de.x = sp.x + offset.x;
            de.y = sp.y + offset.y;
            innerContainer.toLocal(de, undefined, de, true);
            updateClosestIndex(de, false);

            if (si < ei)
            {
                self.selectRange(sie ? si + 1 : si, eie ? ei : ei - 1);
                caret._index = eie ? ei : ei - 1;
            }
            else if (si > ei)
            {
                self.selectRange(ei, sie ? si : si - 1);
                caret._index = ei;
            }
            else
            if (sie === eie)
            {
                self.setCaretIndex(sie ? si + 1 : si);
            }
            else
            {
                self.selectRange(si, ei);
                caret._index = ei;
            }

            caret._forward = si <= ei;
            caret._down = offset.y > 0;

            scrollToPosition(de);
        };

        // public methods
        this.focus = function ()
        {
            if (!this._focused)
            {
                InputBase.prototype.focus.call(this);

                const l = `${this.container.worldTransform.tx}px`;
                const t = `${this.container.worldTransform.ty}px`;
                const h = `${this.container.height}px`;
                const w = `${this.container.width}px`;

                _pui_tempInput.setAttribute('style', `position:fixed; left:${l}; top:${t}; height:${h}; width:${w};`);
                _pui_tempInput.value = '';
                _pui_tempInput.focus();
                _pui_tempInput.setAttribute('style', 'position:fixed; left:-10px; top:-10px; width:0px; height: 0px;');

                innerContainer.cacheAsBitmap = false;
                _pui_tempInput.addEventListener('blur', inputBlurEvent, false);
                document.addEventListener('keydown', keyDownEvent, false);
                document.addEventListener('keyup', keyUpEvent, false);
                document.addEventListener('paste', pasteEvent, false);
                document.addEventListener('copy', copyEvent, false);
                document.addEventListener('cut', cutEvent, false);
                _pui_tempInput.addEventListener('input', inputEvent, false);

                setTimeout(function ()
                {
                    if (!caret.visible && !self.selection.visible && !multiLine)
                    { self.setCaretIndex(chars.length); }
                }, 0);
            }
        };

        this.blur = function ()
        {
            if (this._focused)
            {
                InputBase.prototype.blur.call(this);
                ctrlDown = false;
                shiftDown = false;
                hideCaret();
                this.clearSelection();
                if (chars.length > 1) innerContainer.cacheAsBitmap = true;
                _pui_tempInput.removeEventListener('blur', inputBlurEvent);
                document.removeEventListener('keydown', keyDownEvent);
                document.removeEventListener('keyup', keyUpEvent);
                document.removeEventListener('paste', pasteEvent);
                document.removeEventListener('copy', copyEvent);
                document.removeEventListener('cut', cutEvent);
                _pui_tempInput.removeEventListener('input', inputEvent);
                _pui_tempInput.blur();
            }

            if (!multiLine)
            { resetScrollPosition(); }
        };

        this.setCaretIndex = function (index)
        {
            caret._atEnd = index >= chars.length;
            caret._index = Math.max(0, Math.min(chars.length - 1, index));

            if (chars.length && index > 0)
            {
                let i = Math.max(0, Math.min(index, chars.length - 1));
                let c = chars[i];

                if (c && c.wrapped)
                {
                    caret.x = c.x;
                    caret.y = c.y;
                }
                else
                {
                    i = Math.max(0, Math.min(index - 1, chars.length - 1));
                    c = chars[i];
                    caret.x = chars[i].x + chars[i].width;
                    caret.y = (chars[i].lineIndex * lineHeight) + (lineHeight - textHeight) * 0.5;
                }
            }
            else
            {
                caret.x = 0;
                caret.y = (lineHeight - textHeight) * 0.5;
            }

            scrollToPosition(caret);
            showCaret();
        };

        this.select = function ()
        {
            this.selectRange(0, chars.length - 1);
        };

        this.selectWord = function (wordIndex)
        {
            let startIndex = chars.length;
            let endIndex = 0;

            for (let i = 0; i < chars.length; i++)
            {
                if (chars[i].wordIndex !== wordIndex) continue;
                if (i < startIndex)
                { startIndex = i; }
                if (i > endIndex)
                { endIndex = i; }
            }

            this.selectRange(startIndex, endIndex);
        };

        const drawSelectionRect = function (x, y, w, h)
        {
            self.selection.beginFill(`0x${selectedBackgroundColor.slice(1)}`, 1);
            self.selection.moveTo(x, y);
            self.selection.lineTo(x + w, y);
            self.selection.lineTo(x + w, y + h);
            self.selection.lineTo(x, y + h);
            self.selection.endFill();
        };

        var updateSelectionGraphics = function ()
        {
            const c1 = chars[selectionStart];

            if (c1 !== undefined)
            {
                let cx = c1.x;
                let cy = c1.y;
                let w = 0;
                const h = textHeight;
                let cl = c1.lineIndex;

                self.selection.clear();
                for (let i = selectionStart; i <= selectionEnd; i++)
                {
                    const c = chars[i];

                    if (c.lineIndex != cl)
                    {
                        drawSelectionRect(cx, cy, w, h);
                        cx = c.x;
                        cy = c.y;
                        cl = c.lineIndex;
                        w = 0;
                    }
                    w += c.width;
                }
                drawSelectionRect(cx, cy, w, h);
                innerContainer.addChildAt(self.selection, 0);
            }
        };

        this.selectRange = function (startIndex, endIndex)
        {
            if (startIndex > -1 && endIndex > -1)
            {
                const start = Math.min(startIndex, endIndex, chars.length - 1);
                const end = Math.min(Math.max(startIndex, endIndex), chars.length - 1);

                if (start != selectionStart || end != selectionEnd)
                {
                    hasSelection = true;
                    this.selection.visible = true;
                    selectionStart = start;
                    selectionEnd = end;
                    hideCaret();
                    updateSelectionGraphics();
                    updateSelectionColors();
                }
                this.focus();
            }
            else
            {
                self.clearSelection();
            }
        };

        this.clearSelection = function ()
        {
            if (hasSelection)
            {
                // remove color
                hasSelection = false;
                this.selection.visible = false;
                selectionStart = -1;
                selectionEnd = -1;
                updateSelectionColors();
            }
        };
    }

    TextInput.prototype = Object.create(InputBase.prototype);
    TextInput.prototype.constructor = TextInput;

    Object.defineProperties(TextInput.prototype, {
        valueEvent: {
            get()
            {
                return this._value;
            },
            set(val)
            {
                if (this.maxLength)
                { val = val.slice(0, this.maxLength); }

                if (this._value != val)
                {
                    this.value = val;
                    this.emit('change');
                }
            },
        },
        value: {
            get()
            {
                return this._value;
            },
            set(val)
            {
                if (this.maxLength)
                { val = val.slice(0, this.maxLength); }

                if (this._value != val)
                {
                    this._lastValue = this._value;
                    this._value = val;
                    this._dirtyText = true;
                    this.update();
                }
            },
        },
        text: {
            get()
            {
                return this.value;
            },
            set(val)
            {
                this.value = val;
            },
        },
    });

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
    var TilingSprite = /** @class */ (function (_super) {
        __extends(TilingSprite, _super);
        function TilingSprite(t, width, height) {
            var _this = this;
            var sprite = new PIXI$1.extras.TilingSprite(t);
            _this = _super.call(this, width || sprite.width, height || sprite.height) || this;
            _this.sprite = sprite;
            _this.container.addChild(_this.sprite);
            return _this;
        }
        /**
         * Updates the text
         *
         * @private
         */
        TilingSprite.prototype.update = function () {
            if (this.tint !== null) {
                this.sprite.tint = this.tint;
            }
            if (this.blendMode !== null) {
                this.sprite.blendMode = this.blendMode;
            }
            this.sprite.width = this._width;
            this.sprite.height = this._height;
        };
        Object.defineProperty(TilingSprite.prototype, "tilePosition", {
            get: function () {
                return this.sprite.tilePosition;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TilingSprite.prototype, "tilingPosition", {
            set: function (val) {
                this.sprite.tilePosition = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TilingSprite.prototype, "tileScale", {
            get: function () {
                return this.sprite.tileScale;
            },
            set: function (val) {
                this.sprite.tileScale = val;
            },
            enumerable: true,
            configurable: true
        });
        return TilingSprite;
    }(UIBase));



    var _UI = /*#__PURE__*/Object.freeze({
        __proto__: null,
        UIBase: UIBase,
        Button: Button,
        CheckBox: CheckBox,
        Container: Container,
        DynamicText: DynamicText,
        DynamicTextStyle: DynamicTextStyle,
        Ease: Ease,
        Interaction: Interaction,
        Helpers: Helpers,
        ScrollBar: ScrollBar,
        ScrollingContainer: ScrollingContainer,
        __moduleExports: SortableList_1,
        Slider: Slider,
        SliceSprite: SliceSprite,
        Sprite: Sprite,
        Stage: Stage,
        TextInput: TextInput,
        TilingSprite: TilingSprite,
        Tween: Tween,
        Ticker: Ticker
    });

    var UI = _UI;

    exports.UI = UI;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=pixi-ui.js.map
