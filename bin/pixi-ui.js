/*!
 * pixi-ui - v1.0.0
 * Compiled Thu, 03 Nov 2016 20:15:42 UTC
 *
 * pixi-ui is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.pixiUi = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var UIBase = require('./UIBase');

/**
 * An UI Container object
 *
 * @class
 * @extends PIXI.UI.UIBase
 * @memberof PIXI.UI
 * @param width {Number} Width of the Container
 * @param height {Number} Height of the Container
 */
function Container(width, height) {
    UIBase.call(this, width, height);
}



Container.prototype = Object.create(UIBase.prototype);
Container.prototype.constructor = Container;
module.exports = Container;


},{"./UIBase":6}],2:[function(require,module,exports){
var UIBase = require('./UIBase');

/**
 * A sliced sprite with dynamic width and height.
 *
 * @class
 * @extends PIXI.UI.UIBase
 * @memberof PIXI.UI
 * @param Sprite {PIXI.Sprite} the sprite for this SliceSprite
 * @param BorderWidth {Number} Width of the sprite borders
 * @param horizontalSlice {Boolean} Slice the sprite horizontically
 * @param horizontalSlice {Boolean} Slice the sprite vertically
 */
function SliceSprite(sprite, borderWidth, horizontalSlice, verticalSlice) {
    UIBase.call(this, sprite.width, sprite.height);

    var ftl, ftr, fbl, fbr, ft, fb, fl, fr, ff, stl, str, sbl, sbr, st, sb, sl, sr, sf,
        bw = borderWidth || 5,
        vs = typeof verticalSlice !== "undefined" ? verticalSlice : true,
        hs = typeof horizontalSlice !== "undefined" ? horizontalSlice : true,
        t = sprite.texture.baseTexture,
        f = sprite.texture.frame;


    //get frames
    if (vs && hs) {
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
    else if (hs) {
        fl = new PIXI.Rectangle(f.x, f.y, bw, f.height);
        fr = new PIXI.Rectangle(f.x + f.width - bw, f.y, bw, f.height);
        ff = new PIXI.Rectangle(f.x + bw, f.y, f.width - bw * 2, f.height);
    }
    else { //vs
        ft = new PIXI.Rectangle(f.x, f.y, f.width, bw);
        fb = new PIXI.Rectangle(f.x, f.y + f.height - bw, f.width, bw);
        ff = new PIXI.Rectangle(f.x, f.y + bw, f.width, f.height - bw * 2);
    }

    //TODO: swap frames if rotation



    //make sprites
    sf = new PIXI.Sprite(new PIXI.Texture(t, ff));
    this.container.addChild(sf);
    if (vs && hs) {
        stl = new PIXI.Sprite(new PIXI.Texture(t, ftl));
        str = new PIXI.Sprite(new PIXI.Texture(t, ftr));
        sbl = new PIXI.Sprite(new PIXI.Texture(t, fbl));
        sbr = new PIXI.Sprite(new PIXI.Texture(t, fbr));
        this.container.addChild(stl, str, sbl, sbr);

    }
    if (hs) {
        this.setting.minWidth = bw * 2;
        sl = new PIXI.Sprite(new PIXI.Texture(t, fl));
        sr = new PIXI.Sprite(new PIXI.Texture(t, fr));
        this.container.addChild(sl, sr);
    }
    if (vs) {
        this.setting.minHeight = bw * 2;
        st = new PIXI.Sprite(new PIXI.Texture(t, ft));
        sb = new PIXI.Sprite(new PIXI.Texture(t, fb));
        this.container.addChild(st, sb);
    }

    //set constant position and sizes
    if (vs && hs) st.x = sb.x = sl.y = sr.y = stl.width = str.width = sbl.width = sbr.width = stl.height = str.height = sbl.height = sbr.height = bw;
    if (hs) sf.x = sl.width = sr.width = bw;
    if (vs) sf.y = st.height = sb.height = bw;


    /**
     * Updates the sliced sprites position and size
     *
     * @private
     */
    this.update = function () {
        if (vs && hs) {
            str.x = sbr.x = sr.x = this.width - bw;
            sbl.y = sbr.y = sb.y = this.height - bw;
            sf.width = st.width = sb.width = this.width - bw * 2;
            sf.height = sl.height = sr.height = this.height - bw * 2;
        }
        else if (hs) {
            sr.x = this.width - bw;
            sl.height = sr.height = sf.height = this.height;
            sf.width = this.width - bw * 2;
        }
        else { //vs
            sb.y = this.height - bw;
            st.width = sb.width = sf.width = this.width;
            sf.height = this.height - bw * 2;
        }

        if (this.tint !== null) {
            sf.tint = this.tint;
            if (vs && hs) stl.tint = str.tint = sbl.tint = sbr.tint = this.tint;
            if (hs) sl.tint = sr.tint = this.tint;
            if (vs) st.tint = sb.tint = this.tint;
        }
    };
}

SliceSprite.prototype = Object.create(UIBase.prototype);
SliceSprite.prototype.constructor = SliceSprite;
module.exports = SliceSprite;




},{"./UIBase":6}],3:[function(require,module,exports){
var UIBase = require('./UIBase');

/**
 * A Stage for UIObjects
 *
 * @class
 * @extends PIXI.UI.Container
 * @memberof PIXI.UI
 * @param width {Number} Width of the Stage
 * @param height {Number} Height of the Stage
 */
function Stage(width, height) {
    this._width = width;
    this._height = height;
    PIXI.Container.call(this);
    this.UIChildren = [];
}

Stage.prototype = Object.create(PIXI.Container.prototype);
Stage.prototype.constructor = Stage;
module.exports = Stage;

Stage.prototype.addChild = function (UIObject) {
    var argumentLenght = arguments.length;
    if (argumentLenght > 1) {
        for (var i = 0; i < argumentLenght; i++) {
            this.addChild(arguments[i]);
        }
    }
    else {
        if (UIObject.parent !== null)
            UIObject.parent.removeChild(UIObject);

        UIObject.parent = this;
        this.UIChildren.push(UIObject);
        PIXI.Container.prototype.addChild.call(this, UIObject.container);
    }
};

Stage.prototype.removeChild = function (UIObject) {
    var argumentLenght = arguments.length;
    if (argumentLenght > 1) {
        for (var i = 0; i < argumentLenght; i++) {
            this.removeChild(arguments[i]);
        }
    }
    else {
        var index = this.UIChildren.indexOf(UIObject);
        if (index != -1) {
            this.UIChildren.splice(index, 1);
            UIObject.parent = null;
        }
        PIXI.Container.prototype.addChild.call(this, UIObject.container);
    }
};

Stage.prototype.resize = function (width, height) {
    if (!isNaN(height)) this._height = height;
    if (!isNaN(width)) this._width = width;

    for (var i = 0; i < this.UIChildren.length; i++)
        this.UIChildren[i].updatesettings();
};

Object.defineProperties(Stage.prototype, {
    width: {
        get: function () {
            return this._width;
        },
        set: function (val) {
            if (!isNaN(val)) {
                this._width = val;
                this.resize();
            }
        }
    },
    height: {
        get: function () {
            return this._height;
        },
        set: function (val) {
            if (!isNaN(val)) {
                this._height = val;
                this.resize();
            }
        }
    }
});
},{"./UIBase":6}],4:[function(require,module,exports){
var UIBase = require('./UIBase');

/**
 * An UI text object
 *
 * @class
 * @extends PIXI.UI.UIBase
 * @memberof PIXI.UI
 * @param Text {String} Text content
 * @param TextStyle {PIXI.TextStyle} Style used for the Text
 */
function Text(text, PIXITextStyle) {
    this.text = new PIXI.Text(text, PIXITextStyle);
    UIBase.call(this, this.text.width, this.text.height);
    this.container.addChild(this.text);
}

Text.prototype = Object.create(UIBase.prototype);
Text.prototype.constructor = Text;
module.exports = Text;

/**
 * Updates the text
 *
 * @private
 */
Text.prototype.update = function () {
    if (this.tint !== null)
        text.tint = this.tint;
};


},{"./UIBase":6}],5:[function(require,module,exports){
var UI = {
    UISettings: require('./UISettings'),
    UIBase: require('./UIBase'),
    Stage: require('./Stage'),
    Container: require('./Container'),
    SliceSprite: require('./SliceSprite'),
    Text: require('./Text')
};

module.exports = UI;
},{"./Container":1,"./SliceSprite":2,"./Stage":3,"./Text":4,"./UIBase":6,"./UISettings":7}],6:[function(require,module,exports){
var UISettings = require('./UISettings'),
    UI = require('./UI');

/**
 * Base class of all UIObjects
 *
 * @class
 * @memberof PIXI.UI
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



    //scale
    if (this.setting.scaleX !== null) this.container.scale.x = this.setting.scaleX;
    if (this.setting.scaleY !== null) this.container.scale.y = this.setting.scaleY;

    //pivot
    if (this.setting.pivotX !== null) this.container.pivot.x = this.setting.width * this.setting.pivotX;
    if (this.setting.pivotY !== null) this.container.pivot.y = this.setting.height * this.setting.pivotY;

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
            this.container.removeChild(UIObject.container);
            this.children.splice(index, 1);
            UIObject.parent = null;
        }
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
});

},{"./UI":5,"./UISettings":7}],7:[function(require,module,exports){
/**
 * Settings object for all UIObjects
 *
 * @class
 * @memberof PIXI.UI
 */
function UISettings() {
    this._width = 0;
    this.width = 0;
    this.widthPct = null;
    this._height = 0;
    this.height = 0;
    this.heightPct = null;
    this.minWidth = 0;
    this.minWidthPct = null;
    this.minHeight = 0;
    this.minHeightPct = null;
    this.maxWidth = null;
    this.maxWidthPct = null;
    this.maxHeight = null;
    this.maxHeightPct = null;
    this.left = null;
    this.leftPct = null;
    this.right = null;
    this.rightPct = null;
    this.top = null;
    this.topPct = null;
    this.bottom = null;
    this.bottomPct = null;
    this.anchorLeft = null;
    this.anchorLeftPct = null;
    this.anchorRight = null;
    this.anchorRightPct = null;
    this.anchorTop = null;
    this.anchorTopPct = null;
    this.anchorBottom = null;
    this.anchorBottomPct = null;
    this.pivotX = null;
    this.pivotY = null;
    this.scaleX = null;
    this.scaleY = null;
    this.verticalAlign = null;
    this.horizontalAlign = null;
    this.tint = null;
}


module.exports = UISettings;



},{}],8:[function(require,module,exports){

var Library = {
    UI: require('./UI')
};

//dump everything into extras

Object.assign(PIXI, Library);

module.exports = Library;

},{"./UI":5}]},{},[8])(8)
});


//# sourceMappingURL=pixi-ui.js.map
