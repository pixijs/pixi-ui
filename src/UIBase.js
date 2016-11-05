var UISettings = require('./UISettings'),
    UI = require('./UI')

/**
 * Base class of all UIObjects
 *
 * @class
 * @extends PIXI.UI.UIBase
 * @param width {Number} Width of the UIObject
 * @param height {Number} Height of the UIObject
 */
function UIBase(width, height) {
    this.container = new PIXI.Container();

    this.setting = new UISettings();
    this.children = [];
    this.parent = null;
    this.width = width || 0;
    this.height = height || 0;
    this._draggable = false;
    this.container.interactiveChildren = true;
}

UIBase.prototype.constructor = UIBase;
module.exports = UIBase;

/**
 * Renders the object using the WebGL renderer
 *
 * @private
 */
UIBase.prototype.updatesettings = function () {
    this.baseupdate();
    this.update();
    this.updateChildren();
};

/**
 * Update method (override from other UIObjects)
 *
 * @private
 */
UIBase.prototype.update = function () {
};




/**
 * Updates the UIObject with all base settings
 *
 * @private
 */
UIBase.prototype.baseupdate = function () {
    var parentWidth = this.parent !== null ? this.parent.width : 0;
    var parentHeight = this.parent !== null ? this.parent.height : 0;
    this.setting.height = this.setting._height;
    this.setting.width = this.setting._width;

    //percentage convertions
    if (this.setting.widthPct !== null)
        this.setting.width = parentWidth * this.setting.widthPct;
    if (this.setting.heightPct !== null)
        this.setting.height = parentHeight * this.setting.heightPct;
    if (this.setting.minWidthPct !== null)
        this.setting.minWidth = parentWidth * this.setting.minWidthPct;
    if (this.setting.minHeightPct !== null)
        this.setting.minHeight = parentHeight * this.setting.minHeightPct;
    if (this.setting.maxWidthPct !== null)
        this.setting.maxWidth = parentWidth * this.setting.maxWidthPct;
    if (this.setting.maxHeightPct !== null)
        this.setting.maxHeight = parentHeight * this.setting.maxHeightPct;
    if (this.setting.leftPct !== null)
        this.setting.left = parentWidth * this.setting.leftPct;
    if (this.setting.rightPct !== null)
        this.setting.right = parentWidth * this.setting.rightPct;
    if (this.setting.topPct !== null)
        this.setting.top = parentHeight * this.setting.topPct;
    if (this.setting.bottomPct !== null)
        this.setting.bottom = parentHeight * this.setting.bottomPct;
    if (this.setting.anchorLeftPct !== null)
        this.setting.anchorLeft = parentWidth * this.setting.anchorLeftPct;
    if (this.setting.anchorRightPct !== null)
        this.setting.anchorRight = parentWidth * this.setting.anchorRightPct;
    if (this.setting.anchorTopPct !== null)
        this.setting.anchorTop = parentHeight * this.setting.anchorTopPct;
    if (this.setting.anchorBottomPct !== null)
        this.setting.anchorBottom = parentHeight * this.setting.anchorBottomPct;

    if (this.horizontalAlign === null) {
        //get anchors (use left right if conflict)
        var anchorLeft = this.anchorLeft;
        var anchorRight = this.anchorRight;
        if (anchorLeft !== null && anchorRight === null && this.right !== null)
            anchorRight = this.right;
        else if (anchorLeft === null && anchorRight !== null && this.left !== null)
            anchorLeft = this.left;
        else if (anchorLeft === null && anchorRight === null && this.left !== null && this.right !== null) {
            anchorLeft = this.left;
            anchorRight = this.right;
        }

        var useHorizontalAnchor = anchorLeft !== null || anchorRight !== null;
        var useLeftRight = !useHorizontalAnchor && (this.left !== null || this.right !== null);

        if (useLeftRight) {
            if (this.left !== null)
                this.container.position.x = this.left;
            else if (this.right !== null)
                this.container.position.x = parentWidth - this.right;
        }
        else if (useHorizontalAnchor) {
            if (anchorLeft !== null && anchorRight === null)
                this.container.position.x = anchorLeft;
            else if (anchorLeft === null && anchorRight !== null)
                this.container.position.x = parentWidth - this.width - anchorRight;
            else if (anchorLeft !== null && anchorRight !== null) {
                this.container.position.x = anchorLeft;
                this.setting.width = parentWidth - anchorLeft - anchorRight;
            }
            this.container.position.x += this.pivotX * this.setting.width;
        }
        else {
            this.container.position.x = 0;
        }
    }

    if (this.verticalAlign === null) {
        //get anchors (use top bottom if conflict)
        var anchorTop = this.anchorTop;
        var anchorBottom = this.anchorBottom;
        if (anchorTop !== null && anchorBottom === null && this.bottom !== null)
            anchorBottom = this.bottom;
        if (anchorTop === null && anchorBottom !== null && this.top !== null)
            anchorTop = this.top;

        var useVerticalAnchor = anchorTop !== null || anchorBottom !== null;
        var useTopBottom = !useVerticalAnchor && (this.top !== null || this.bottom !== null);

        if (useTopBottom) {
            if (this.top !== null)
                this.container.position.y = this.top;
            else if (this.bottom !== null)
                this.container.position.y = parentHeight - this.bottom;
        }
        else if (useVerticalAnchor) {
            if (anchorTop !== null && anchorBottom === null)
                this.container.position.y = anchorTop;
            else if (anchorTop === null && anchorBottom !== null)
                this.container.position.y = parentHeight - this.height - anchorBottom;
            else if (anchorTop !== null && anchorBottom !== null) {
                this.container.position.y = anchorTop;
                this.setting.height = parentHeight - anchorTop - anchorBottom;
            }
            this.container.position.y += this.pivotY * this.setting.width;
        }
        else {
            this.container.position.y = 0;
        }
    }

    //min/max sizes
    if (this.setting.maxWidth !== null && this.setting.width > this.setting.maxWidth) this.setting.width = this.setting.maxWidth;
    if (this.setting.width < this.setting.minWidth) this.setting.width = this.setting.minWidth;

    if (this.setting.maxHeight !== null && this.setting.height > this.setting.maxHeight) this.setting.height = this.setting.maxHeight;
    if (this.setting.height < this.setting.minHeight) this.setting.height = this.setting.minHeight;


    //pure vertical/horizontal align
    if (this.horizontalAlign !== null) {
        if (this.horizontalAlign == "center")
            this.container.position.x = parentWidth * 0.5 - this.width * 0.5;
        else if (this.horizontalAlign == "right")
            this.container.position.x = parentWidth - this.width;
        else
            this.container.position.x = 0;
        this.container.position.x += this.width * this.pivotX;
    }
    if (this.verticalAlign !== null) {
        if (this.verticalAlign == "middle")
            this.container.position.y = parentHeight * 0.5 - this.height * 0.5;
        else if (this.verticalAlign == "bottom")
            this.container.position.y = parentHeight - this.height;
        else
            this.container.position.y = 0;
        this.container.position.y += this.height * this.pivotY;
    }


    //Unrestricted dragging
    if (this.dragging && !this.setting.dragRestricted) {
        this.container.position.x = this.left;
        this.container.position.y = this.top;
    }


    //scale
    if (this.setting.scaleX !== null) this.container.scale.x = this.setting.scaleX;
    if (this.setting.scaleY !== null) this.container.scale.y = this.setting.scaleY;

    //pivot
    if (this.setting.pivotX !== null) this.container.pivot.x = this.setting.width * this.setting.pivotX;
    if (this.setting.pivotY !== null) this.container.pivot.y = this.setting.height * this.setting.pivotY;

    if (this.setting.alpha !== null) this.container.alpha = this.setting.alpha;
    if (this.setting.rotation !== null) this.container.rotation = this.setting.rotation;

    this.container.position.x = Math.round(this.container.position.x);
    this.container.position.y = Math.round(this.container.position.y);
};

/**
 * Updates all UI Children
 *
 * @private
 */
UIBase.prototype.updateChildren = function () {
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].updatesettings();
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
        this.updatesettings();
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
            UIObject.container.parent.removeChild(UIObject.container);
            this.children.splice(index, 1);
            UIObject.parent = null;
        }
    }
};

UIBase.prototype.clearDraggable = function () {
    if (this.setting.draggable) {
        this.container.removeListener('mousedown', this.onDragMove);
        this.container.removeListener('touchstart', this.onDragMove);
        document.removeEventListener("mousemove", this.onDragMove);
        document.removeEventListener("touchmove", this.onDragMove);
        document.removeEventListener('mouseup', this.onDragEnd);
        document.removeEventListener('mouseupoutside', this.onDragEnd);
        document.removeEventListener('touchend', this.onDragEnd);
        document.removeEventListener('touchendoutside', this.onDragEnd);
        this.setting.draggable = false;
    }
}

UIBase.prototype.initDraggable = function () {
    if (!this.setting.draggable) {
        var container = this.container,
            uiobject = this,
            containerStart = new PIXI.Point(),
            mouseStart = new PIXI.Point(),
            stageOffset = new PIXI.Point();

        this.container.interactive = true;

        this.onDragStart = function (event) {
            if (!uiobject.dragging) {
                mouseStart.set(event.data.originalEvent.clientX, event.data.originalEvent.clientY);
                containerStart.copy(container.position);
                document.addEventListener('mousemove', uiobject.onDragMove);
                document.addEventListener('touchmove', uiobject.onDragMove);
            }
        }

        this.onDragMove = function (event) {
            if (!uiobject.dragging) {
                document.addEventListener('mouseup', uiobject.onDragEnd);
                document.addEventListener('mouseupoutside', uiobject.onDragEnd);
                document.addEventListener('touchend', uiobject.onDragEnd);
                document.addEventListener('touchendoutside', uiobject.onDragEnd);
                uiobject.dragging = true;
                container.interactive = false;
                PIXI.UI._dropTarget = null;

                if (uiobject.dragContainer) {

                    var c = uiobject.dragContainer.container ? uiobject.dragContainer.container : uiobject.dragContainer;
                    console.log("before:", uiobject.container.worldTransform);
                    if (c) {
                        stageOffset.set(c.worldTransform.tx - uiobject.parent.container.worldTransform.tx, c.worldTransform.ty - uiobject.parent.container.worldTransform.ty);
                        c.addChild(uiobject.container);
                    }
                } else {
                    stageOffset.set(0);
                }
            }

            var x = event.clientX - mouseStart.x,
                y = event.clientY - mouseStart.y;

            uiobject.x = containerStart.x + x - stageOffset.x;
            uiobject.y = containerStart.y + y - stageOffset.y;
        }

        this.onDragEnd = function (event) {
            if (uiobject.dragging) {
                uiobject.dragging = false;
                container.interactive = true;
                document.removeEventListener("mousemove", uiobject.onDragMove);
                document.removeEventListener("touchmove", uiobject.onDragMove);
                document.removeEventListener('mouseup', uiobject.onDragEnd);
                document.removeEventListener('mouseupoutside', uiobject.onDragEnd);
                document.removeEventListener('touchend', uiobject.onDragEnd);
                document.removeEventListener('touchendoutside', uiobject.onDragEnd);

                

                setTimeout(function () {
                    var x = event.clientX - mouseStart.x,
                    y = event.clientY - mouseStart.y;
                    uiobject.x = containerStart.x + x;
                    uiobject.y = containerStart.y + y;

                    if (PIXI.UI._dropTarget && PIXI.UI._dropTarget.dragGroup == uiobject.dragGroup) {
                        PIXI.UI._dropTarget.addChild(uiobject);
                    }
                    else {
                        uiobject.parent.addChild(uiobject);
                    }                    
                }, 0);

            }
        }



        container.on('mousedown', this.onDragStart);
        container.on('touchstart', this.onDragStart);
        this.setting.draggable = true;
    }
};

UIBase.prototype.clearDroppable = function () {
    if (this.setting.droppable) {
        this.container.removeListener('mouseup', this.onDrop);
        this.container.removeListener('touchend', this.onDrop);
        this.setting.droppable = false;
    }
}

UIBase.prototype.initDroppable = function () {
    if (!this.setting.droppable) {
        var container = this.container,
            uiobject = this;

        this.container.interactive = true;
        this.onDrop = function (event) {
            if (uiobject.droppableParent != null)
                PIXI.UI._dropTarget = uiobject.droppableParent;
            else
                PIXI.UI._dropTarget = uiobject;
        }

        container.on('mouseup', this.onDrop);
        container.on('touchend', this.onDrop);
        this.setting.droppable = true;
    }
};

Object.defineProperties(UIBase.prototype, {
    width: {
        get: function () {
            return this.setting.width;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1) {
                val = val.replace('%', '');
                this.setting.widthPct = parseFloat(val) * 0.01;
            }
            else {
                this.setting.widthPct = null;
                this.setting._width = val;
            }
            this.updatesettings();
        }
    },
    height: {
        get: function () {
            return this.setting.height;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1) {
                val = val.replace('%', '');
                this.setting.heightPct = parseFloat(val) * 0.01;
            }
            else {
                this.setting.heightPct = null;
                this.setting._height = val;
            }
            this.updatesettings();
        }
    },
    minWidth: {
        get: function () {
            return this.setting.minWidth;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1) {
                val = val.replace('%', '');
                this.setting.percentageMinWidth = parseFloat(val) * 0.01;
            }
            else {
                this.setting.percentageMinWidth = null;
                this.setting.minWidth = val;
            }
            this.updatesettings();
        }
    },
    minHeight: {
        get: function () {
            return this.setting.minHeight;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1) {
                val = val.replace('%', '');
                this.setting.percentageMinHeight = parseFloat(val) * 0.01;
            }
            else {
                this.setting.percentageMinHeight = null;
                this.setting.minHeight = val;
            }
            this.updatesettings();
        }
    },
    maxWidth: {
        get: function () {
            return this.setting.maxWidth;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1) {
                val = val.replace('%', '');
                this.setting.maxWidthPct = parseFloat(val) * 0.01;
            }
            else {
                this.setting.maxWidthPct = null;
                this.setting.maxWidth = val;
            }
            this.updatesettings();
        }
    },
    maxHeight: {
        get: function () {
            return this.setting.maxHeight;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1) {
                val = val.replace('%', '');
                this.setting.maxHeightPct = parseFloat(val) * 0.01;
            }
            else {
                this.setting.maxHeightPct = null;
                this.setting.maxHeight = val;
            }
            this.updatesettings();
        }
    },
    anchorLeft: {
        get: function () {
            return this.setting.anchorLeft;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1) {
                val = val.replace('%', '');
                this.setting.anchorLeftPct = parseFloat(val) * 0.01;
            }
            else {
                this.setting.anchorLeftPct = null;
                this.setting.anchorLeft = val;
            }
            this.updatesettings();
        }
    },
    anchorRight: {
        get: function () {
            return this.setting.anchorRight;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1) {
                val = val.replace('%', '');
                this.setting.anchorRightPct = parseFloat(val) * 0.01;
            }
            else {
                this.setting.anchorRightPct = null;
                this.setting.anchorRight = val;
            }
            this.updatesettings();
        }
    },
    anchorTop: {
        get: function () {
            return this.setting.anchorTop;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1) {
                val = val.replace('%', '');
                this.setting.anchorTopPct = parseFloat(val) * 0.01;
            }
            else {
                this.setting.anchorTopPct = null;
                this.setting.anchorTop = val;
            }
            this.updatesettings();
        }
    },
    anchorBottom: {
        get: function () {
            return this.setting.anchorBottom;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1) {
                val = val.replace('%', '');
                this.setting.anchorBottomPct = parseFloat(val) * 0.01;
            }
            else {
                this.setting.anchorBottomPct = null;
                this.setting.anchorBottom = val;
            }
            this.updatesettings();
        }
    },
    verticalAlign: {
        get: function () {
            return this.setting.verticalAlign;
        },
        set: function (val) {
            this.setting.verticalAlign = val;
            this.updatesettings();
        }
    },
    horizontalAlign: {
        get: function () {
            return this.setting.horizontalAlign;
        },
        set: function (val) {
            this.setting.horizontalAlign = val;
            this.updatesettings();
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
            this.updatesettings();
        }
    },
    pivotX: {
        get: function () {
            return this.setting.pivotX;
        },
        set: function (val) {
            this.setting.pivotX = val;
            this.updatesettings();
        }
    },
    pivotY: {
        get: function () {
            return this.setting.pivotY;
        },
        set: function (val) {
            this.setting.pivotY = val;
            this.updatesettings();
        }
    },
    pivot: {
        set: function (val) {
            this.setting.pivotX = val;
            this.setting.pivotY = val;
            this.updatesettings();
        }
    },
    scaleX: {
        get: function () {
            return this.setting.scaleX;
        },
        set: function (val) {
            this.setting.scaleX = val;
            this.updatesettings();
        }
    },
    scaleY: {
        get: function () {
            return this.setting.scaleY;
        },
        set: function (val) {
            this.setting.scaleY = val;
            this.updatesettings();
        }
    },
    scale: {
        set: function (val) {
            this.setting.scaleX = val;
            this.setting.scaleY = val;
            this.updatesettings();
        }
    },
    left: {
        get: function () {
            return this.setting.left;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1) {
                val = val.replace('%', '');
                this.setting.leftPct = parseFloat(val) * 0.01;
            }
            else {
                this.setting.leftPct = null;
                this.setting.left = val;
            }
            this.updatesettings();
        }
    },
    right: {
        get: function () {
            return this.setting.right;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1) {
                val = val.replace('%', '');
                this.setting.rightPct = parseFloat(val) * 0.01;
            }
            else {
                this.setting.rightPct = null;
                this.setting.right = val;
            }
            this.updatesettings();
        }
    },
    top: {
        get: function () {
            return this.setting.top;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1) {
                val = val.replace('%', '');
                this.setting.topPct = parseFloat(val) * 0.01;
            }
            else {
                this.setting.topPct = null;
                this.setting.top = val;
            }
            this.updatesettings();
        }
    },
    bottom: {
        get: function () {
            return this.setting.bottom;
        },
        set: function (val) {
            if (isNaN(val) && val.indexOf('%') !== -1) {
                val = val.replace('%', '');
                this.setting.bottomPct = parseFloat(val) * 0.01;
            }
            else {
                this.setting.bottomPct = null;
                this.setting.bottom = val;
            }
            this.updatesettings();
        }
    },
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
            return this.setting.right;
        },
        set: function (val) {
            this.top = val;
        }
    },
    draggable: {
        get: function () {
            return this.setting.draggable;
        },
        set: function (val) {
            if (val)
                this.initDraggable();
            else
                this.clearDraggable();
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
            if (val)
                this.initDroppable();
            else
                this.clearDroppable();
        }
    },
});


