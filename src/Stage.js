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
    PIXI.Container.call(this);
    this.__width = width;
    this.__height = height;
    this.UIChildren = [];
    this.stage = this;
    this.interactive = true;
    this.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
    this.initialized = true;
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
        UIObject.updatesettings(true);
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
        PIXI.Container.prototype.removeChild.call(this, UIObject.container);
        var index = this.UIChildren.indexOf(UIObject);
        if (index != -1) {
            this.UIChildren.splice(index, 1);
            UIObject.parent = null;
        }
        
    }
};

Stage.prototype.resize = function (width, height) {
    if (!isNaN(height)) this.__height = height;
    if (!isNaN(width)) this.__width = width;

    for (var i = 0; i < this.UIChildren.length; i++)
        this.UIChildren[i].updatesettings(true, false);
};

Object.defineProperties(Stage.prototype, {
    _width: {
        get: function () {
            return this.__width;
        },
        set: function (val) {
            if (!isNaN(val)) {
                this.__width = val;
                this.resize();
            }
        }
    },
    _height: {
        get: function () {
            return this.__height;
        },
        set: function (val) {
            if (!isNaN(val)) {
                this.__height = val;
                this.resize();
            }
        }
    }
});