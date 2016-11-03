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