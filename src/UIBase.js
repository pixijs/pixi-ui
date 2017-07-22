var UISettings = require('./UISettings'),
    UI = require('./UI'),
    DragEvent = require('./Interaction/DragEvent'),
    DragDropController = require('./Interaction/DragDropController');

/**
 * Base class of all UIObjects
 *
 * @class
 * @extends PIXI.UI.UIBase
 * @param width {Number} Width of the UIObject
 * @param height {Number} Height of the UIObject
 */
function UIBase(width, height) {
    PIXI.utils.EventEmitter.call(this);
    this.container = new PIXI.Container();
    this.setting = new UISettings();
    this.children = [];
    this.parent = null;
    this.stage = null;
    this.initialized = false;
    this.dragInitialized = false;
    this.dropInitialized = false;
    this.dirty = true;
    this._oldWidth = -1;
    this._oldHeight = -1;
    this.pixelPerfect = true;


    if (width && isNaN(width) && width.indexOf('%') != -1) {
        this.setting.widthPct = parseFloat(width.replace('%', '')) * 0.01;
    }
    else {
        this.setting.widthPct = null;
    }

    if (height && isNaN(height) && height.indexOf('%') != -1)
        this.setting.heightPct = parseFloat(height.replace('%', '')) * 0.01;
    else {
        this.setting.heightPct = null;
    }

    this.setting.width = width || 0;
    this.setting.height = height || 0;

    //actual values
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

    this._dragPosition = null; //used for overriding positions if tweens is playing
}

UIBase.prototype = Object.create(PIXI.utils.EventEmitter.prototype);
UIBase.prototype.constructor = UIBase;
module.exports = UIBase;

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

    if (updateParent) this.updateParent();
    this.baseupdate();
    this.update();
    if (updateChildren) this.updateChildren();
};

/**
 * Update method (override from other UIObjects)
 *
 * @private
 */
UIBase.prototype.update = function () {
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
    //return if parent size didnt change
    if (this.parent !== null) {
        var parentHeight, parentWidth;



        //transform convertion (% etc)
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
            //get anchors (use left right if conflict)
            if (this._anchorLeft !== null && this._anchorRight === null && this._right !== null)
                this._anchorRight = this._right;
            else if (this._anchorLeft === null && this._anchorRight !== null && this._left !== null)
                this._anchorLeft = this._left;
            else if (this._anchorLeft === null && this._anchorRight === null && this._left !== null && this._right !== null) {
                this._anchorLeft = this._left;
                this._anchorRight = this._right;
            }


            var useHorizontalAnchor = this._anchorLeft !== null || this._anchorRight !== null;
            var useLeftRight = !useHorizontalAnchor && (this._left !== null || this._right !== null);

            if (useLeftRight) {
                if (this._left !== null)
                    this.container.position.x = this._left;
                else if (this._right !== null)
                    this.container.position.x = parentWidth - this._right;
            }
            else if (useHorizontalAnchor) {

                if (this._anchorLeft !== null && this._anchorRight === null)
                    this.container.position.x = this._anchorLeft;
                else if (this._anchorLeft === null && this._anchorRight !== null)
                    this.container.position.x = parentWidth - this._width - this._anchorRight;
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
            //get anchors (use top bottom if conflict)
            if (this._anchorTop !== null && this._anchorBottom === null && this._bottom !== null)
                this._anchorBottom = this._bottom;
            if (this._anchorTop === null && this._anchorBottom !== null && this._top !== null)
                this._anchorTop = this._top;

            var useVerticalAnchor = this._anchorTop !== null || this._anchorBottom !== null;
            var useTopBottom = !useVerticalAnchor && (this._top !== null || this._bottom !== null);

            if (useTopBottom) {
                if (this._top !== null)
                    this.container.position.y = this._top;
                else if (this._bottom !== null)
                    this.container.position.y = parentHeight - this._bottom;
            }
            else if (useVerticalAnchor) {
                if (this._anchorTop !== null && this._anchorBottom === null)
                    this.container.position.y = this._anchorTop;
                else if (this._anchorTop === null && this._anchorBottom !== null)
                    this.container.position.y = parentHeight - this._height - this._anchorBottom;
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

        //min/max sizes
        if (this._maxWidth !== null && this._width > this._maxWidth) this._width = this._maxWidth;
        if (this._width < this._minWidth) this._width = this._minWidth;

        if (this._maxHeight !== null && this._height > this._maxHeight) this._height = this._maxHeight;
        if (this._height < this._minHeight) this._height = this._minHeight;


        //pure vertical/horizontal align
        if (this.horizontalAlign !== null) {
            if (this.horizontalAlign == "center")
                this.container.position.x = parentWidth * 0.5 - this._width * 0.5;
            else if (this.horizontalAlign == "right")
                this.container.position.x = parentWidth - this._width;
            else
                this.container.position.x = 0;
            this.container.position.x += pivotXOffset;
        }
        if (this.verticalAlign !== null) {
            if (this.verticalAlign == "middle")
                this.container.position.y = parentHeight * 0.5 - this._height * 0.5;
            else if (this.verticalAlign == "bottom")
                this.container.position.y = parentHeight - this._height;
            else
                this.container.position.y = 0;
            this.container.position.y += pivotYOffset;
        }


        //Unrestricted dragging
        if (this.dragging && !this.setting.dragRestricted) {
            this.container.position.x = this._dragPosition.x;
            this.container.position.y = this._dragPosition.y;
        }


        //scale
        if (this.setting.scaleX !== null) this.container.scale.x = this.setting.scaleX;
        if (this.setting.scaleY !== null) this.container.scale.y = this.setting.scaleY;

        //pivot
        if (this.setting.pivotX !== null) this.container.pivot.x = pivotXOffset;
        if (this.setting.pivotY !== null) this.container.pivot.y = pivotYOffset;

        if (this.setting.alpha !== null) this.container.alpha = this.setting.alpha;
        if (this.setting.rotation !== null) this.container.rotation = this.setting.rotation;

        //make pixel perfect
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
            var oldUIParent = UIObject.parent;
            var oldParent = UIObject.container.parent;
            UIObject.container.parent.removeChild(UIObject.container);
            this.children.splice(index, 1);
            UIObject.parent = null;

            //oldParent._recursivePostUpdateTransform();
            setTimeout(function () { //hack but cant get the transforms to update propertly otherwice?
                if (oldUIParent.updatesettings)
                    oldUIParent.updatesettings(true, true);
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
        var containerStart = new PIXI.Point(),
            stageOffset = new PIXI.Point(),
            self = this;

        this._dragPosition = new PIXI.Point();
        this.drag = new DragEvent(this);
        this.drag.onDragStart = function (e) {
            var added = DragDropController.add(this, e);
            if (!this.dragging && added) {
                this.dragging = true;
                this.container.interactive = false;
                containerStart.copy(this.container.position);
                if (this.dragContainer) {
                    var c = this.dragContainer.container ? this.dragContainer.container : this.dragContainer;
                    if (c) {
                        //_this.container._recursivePostUpdateTransform();
                        stageOffset.set(c.worldTransform.tx - this.parent.container.worldTransform.tx, c.worldTransform.ty - this.parent.container.worldTransform.ty);
                        c.addChild(this.container);
                    }
                } else {
                    stageOffset.set(0);
                }

            }
        };


        this.drag.onDragMove = function (e, offset) {
            if (this.dragging) {
                this._dragPosition.set(containerStart.x + offset.x - stageOffset.x, containerStart.y + offset.y - stageOffset.y);
                this.x = this._dragPosition.x;
                this.y = this._dragPosition.y;
            }
        };

        this.drag.onDragEnd = function (e) {
            if (this.dragging) {
                this.dragging = false;
                //Return to container after 1ms if not picked up by a droppable
                setTimeout(function () {
                    self.container.interactive = true;
                    var item = DragDropController.getItem(self);
                    if (item) {
                        var container = self.parent === self.stage ? self.stage : self.parent.container;
                        container.toLocal(self.container.position, self.container.parent, self);
                        if (container != self.container) {
                            self.parent.addChild(self);
                        }
                    }
                }, 1);
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
        var container = this.container,
            self = this;

        this.container.interactive = true;
        this.onDrop = function (event) {
            var item = DragDropController.getEventItem(event, self.dropGroup);
            if (item && item.dragging) {
                item.dragging = false;
                item.container.interactive = true;
                var parent = self.droppableReparent !== null ? self.droppableReparent : self;
                parent.container.toLocal(item.container.position, item.container.parent, item);
                if (parent.container != item.container.parent)
                    parent.addChild(item);
            }
        };

        container.on('mouseup', this.onDrop);
        container.on('touchend', this.onDrop);
    }
};

Object.defineProperties(UIBase.prototype, {
    x: {
        get: function () {
            return this.setting.left;
        },
        set: function (val) {
            this.left = val;
        }
    },
    y: {
        get: function () {
            return this.setting.top;
        },
        set: function (val) {
            this.top = val;
        }
    },
    width: {
        get: function () {
            return this.setting.width;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1)
                this.setting.widthPct = parseFloat(val.replace('%', '')) * 0.01;
            else
                this.setting.widthPct = null;
            
            this.setting.width = val;
            this.updatesettings(true);
        }
    },
    actual_width: {
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
        }
    },
    height: {
        get: function () {
            return this.setting.height;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1)
                this.setting.heightPct = parseFloat(val.replace('%', '')) * 0.01;
            else
                this.setting.heightPct = null;
            
            this.setting.height = val;
            this.updatesettings(true);
        }
    },
    actual_height: {
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
        }
    },
    minWidth: {
        get: function () {
            return this.setting.minWidth;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1)
                this.setting.minWidthPct = parseFloat(val.replace('%', '')) * 0.01;
            else
                this.setting.minWidthPct = null;
            
            this.setting.minWidth = val;
            this.updatesettings(true);
        }
    },
    actual_minWidth: {
        get: function () {
            if (this.dirty) {
                if (this.setting.minWidthPct !== null) {
                    this._minWidth = this.parent._width * this.setting.minWidthPct;
                }
                else {
                    this._minWidth = this.setting.minWidth;
                }
            }
            return this._minWidth;
        }
    },
    minHeight: {
        get: function () {
            return this.setting.minHeight;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1)
                this.setting.minHeightPct = parseFloat(val.replace('%', '')) * 0.01;
            else
                this.setting.minHeightPct = null;
            
            this.setting.minHeight = val;
            this.updatesettings(true);
        }
    },
    actual_minHeight: {
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
        }
    },
    maxWidth: {
        get: function () {
            return this.setting.maxWidth;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1)
                this.setting.maxWidthPct = parseFloat(val.replace('%', '')) * 0.01;
            else
                this.setting.maxWidthPct = null;
            

            this.setting.maxWidth = val;
            this.updatesettings(true);
        }
    },
    actual_maxWidth: {
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
        }
    },
    maxHeight: {
        get: function () {
            return this.setting.maxHeight;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1)
                this.setting.maxHeightPct = parseFloat(val.replace('%', '')) * 0.01;
            else
                this.setting.maxHeightPct = null;
            
            this.setting.maxHeight = val;
            this.updatesettings(true);
        }
    },
    actual_maxHeight: {
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
        }
    },
    anchorLeft: {
        get: function () {
            return this.setting.anchorLeft;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1) 
                this.setting.anchorLeftPct = parseFloat(val.replace('%', '')) * 0.01;
            else 
                this.setting.anchorLeftPct = null;
            
            this.setting.anchorLeft = val;
            this.updatesettings(true);
        }
    },
    actual_anchorLeft: {
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
        }
    },
    anchorRight: {
        get: function () {
            return this.setting.anchorRight;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1)
                this.setting.anchorRightPct = parseFloat(val.replace('%', '')) * 0.01;
            else
                this.setting.anchorRightPct = null;
            
            this.setting.anchorRight = val;
            this.updatesettings(true);
        }
    },
    actual_anchorRight: {
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
        }
    },
    anchorTop: {
        get: function () {
            return this.setting.anchorTop;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1)
                this.setting.anchorTopPct = parseFloat(val.replace('%', '')) * 0.01;
            else
                this.setting.anchorTopPct = null;
            
            this.setting.anchorTop = val;
            this.updatesettings(true);
        }
    },
    actual_anchorTop: {
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
        }
    },
    anchorBottom: {
        get: function () {
            return this.setting.anchorBottom;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1)
                this.setting.anchorBottomPct = parseFloat(val.replace('%', '')) * 0.01;
            else 
                this.setting.anchorBottomPct = null;
            
            this.setting.anchorBottom = val;
            this.updatesettings(true);
        }
    },
    actual_anchorBottom: {
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
        }
    },
    left: {
        get: function () {
            return this.setting.left;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1)
                this.setting.leftPct = parseFloat(val.replace('%', '')) * 0.01;
            else
                this.setting.leftPct = null;
            
            this.setting.left = val;
            this.updatesettings(true);
        }
    },
    actual_left: {
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
        }
    },
    right: {
        get: function () {
            return this.setting.right;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1)
                this.setting.rightPct = parseFloat(val.replace('%', '')) * 0.01;
            else
                this.setting.rightPct = null;

            this.setting.right = val;
            this.updatesettings(true);
        }
    },
    actual_right: {
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
        }
    },
    top: {
        get: function () {
            return this.setting.top;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1)
                this.setting.topPct = parseFloat(val.replace('%', '')) * 0.01;
            else
                this.setting.topPct = null;

            this.setting.top = val;
            this.updatesettings(true);
        }
    },
    actual_top: {
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
        }
    },
    bottom: {
        get: function () {
            return this.setting.bottom;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1)
                this.setting.bottomPct = parseFloat(val.replace('%', '')) * 0.01;
            else
                this.setting.bottomPct = null;

            this.setting.bottom = val;
            this.updatesettings(true);
        }
    },
    actual_bottom: {
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
        }
    },
    verticalAlign: {
        get: function () {
            return this.setting.verticalAlign;
        },
        set: function (val) {
            this.setting.verticalAlign = val;
            this.baseupdate();
        }
    },
    horizontalAlign: {
        get: function () {
            return this.setting.horizontalAlign;
        },
        set: function (val) {
            this.setting.horizontalAlign = val;
            this.baseupdate();
        }
    },
    tint: {
        get: function () {
            return this.setting.tint;
        },
        set: function (val) {
            this.setting.tint = val;
            this.update();
        }
    },
    alpha: {
        get: function () {
            return this.setting.alpha;
        },
        set: function (val) {
            this.setting.alpha = val;
            this.container.alpha = val;
        }
    },
    rotation: {
        get: function () {
            return this.setting.rotation;
        },
        set: function (val) {
            this.setting.rotation = val;
            this.container.rotation = val;
        }
    },
    blendMode: {
        get: function () {
            return this.setting.blendMode;
        },
        set: function (val) {
            this.setting.blendMode = val;
            this.update();
        }
    },
    pivotX: {
        get: function () {
            return this.setting.pivotX;
        },
        set: function (val) {
            this.setting.pivotX = val;
            this.baseupdate();
            this.update();
        }
    },
    pivotY: {
        get: function () {
            return this.setting.pivotY;
        },
        set: function (val) {
            this.setting.pivotY = val;
            this.baseupdate();
            this.update();
        }
    },
    pivot: {
        set: function (val) {
            this.setting.pivotX = val;
            this.setting.pivotY = val;
            this.baseupdate();
            this.update();
        }
    },
    scaleX: {
        get: function () {
            return this.setting.scaleX;
        },
        set: function (val) {
            this.setting.scaleX = val;
            this.container.scale.x = val;
        }
    },
    scaleY: {
        get: function () {
            return this.setting.scaleY;
        },
        set: function (val) {
            this.setting.scaleY = val;
            this.container.scale.y = val;
        }
    },
    scale: {
        get: function () {
            return this.setting.scaleX;
        },
        set: function (val) {
            this.setting.scaleX = val;
            this.setting.scaleY = val;
            this.container.scale.x = val;
            this.container.scale.y = val;
        }
    },

    draggable: {
        get: function () {
            return this.setting.draggable;
        },
        set: function (val) {
            this.setting.draggable = val;
            if (this.initialized) {
                if (val)
                    this.initDraggable();
                else
                    this.clearDraggable();
            }
        }
    },
    dragRestricted: {
        get: function () {
            return this.setting.dragRestricted;
        },
        set: function (val) {
            this.setting.dragRestricted = val;
        }
    },
    dragRestrictAxis: {
        get: function () {
            return this.setting.dragRestrictAxis;
        },
        set: function (val) {
            this.setting.dragRestrictAxis = val;
        }
    },
    dragThreshold: {
        get: function () {
            return this.setting.dragThreshold;
        },
        set: function (val) {
            this.setting.dragThreshold = val;
        }
    },
    dragGroup: {
        get: function () {
            return this.setting.dragGroup;
        },
        set: function (val) {
            this.setting.dragGroup = val;
        }
    },
    dragContainer: {
        get: function () {
            return this.setting.dragContainer;
        },
        set: function (val) {
            this.setting.dragContainer = val;
        }
    },
    droppable: {
        get: function () {
            return this.setting.droppable;
        },
        set: function (val) {
            this.setting.droppable = true;
            if (this.initialized) {
                if (val)
                    this.initDroppable();
                else
                    this.clearDroppable();
            }
        }
    },
    droppableReparent: {
        get: function () {
            return this.setting.droppableReparent;
        },
        set: function (val) {
            this.setting.droppableReparent = val;
        }
    },
    dropGroup: {
        get: function () {
            return this.setting.dropGroup;
        },
        set: function (val) {
            this.setting.dropGroup = val;
        }
    },
    renderable: {
        get: function () {
            return this.container.renderable;
        },
        set: function (val) {
            this.container.renderable = val;
        }
    },
    visible: {
        get: function () {
            return this.container.visible;
        },
        set: function (val) {
            this.container.visible = val;
        }
    },
    cacheAsBitmap: {
        get: function () {
            return this.container.cacheAsBitmap;
        },
        set: function (val) {
            this.container.cacheAsBitmap = val;
        }
    },
    onClick: {
        get: function () {
            return this.container.click;
        },
        set: function (val) {
            this.container.click = val;
        }
    },
    interactive: {
        get: function () {
            return this.container.interactive;
        },
        set: function (val) {
            this.container.interactive = val;
        }
    },
    interactiveChildren: {
        get: function () {
            return this.container.interactiveChildren;
        },
        set: function (val) {
            this.container.interactiveChildren = val;
        }
    }
});