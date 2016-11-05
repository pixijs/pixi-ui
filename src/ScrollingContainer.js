var UIBase = require('./UIBase'),
    Container = require('./Container');

/**
 * An UI Container object with overflow hidden and possibility to enable scrolling
 *
 * @class
 * @extends PIXI.UI.UIBase
 * @memberof PIXI.UI
 * @param width {Number} Width of the Container
 * @param height {Number} Height of the Container
 */
function ScrollingContainer(width, height, scrollX, scrollY, cornerRadius) {
    Container.call(this, width, height);
    this.mask = new PIXI.Graphics();
    this.innerContainer = new PIXI.Container();
    this.container.addChild(this.innerContainer);
    this.container.addChild(this.mask);
    this.container.mask = this.mask;
    this.scrollX = scrollX;
    this.scrollY = scrollY;
    this.cornerRadius = cornerRadius || 0;
    
    
    
    this.update = function () {
        if (this._lastWidth != this.width || this._lastHeight != this.height) {
            this.mask.clear();
            this.mask.lineStyle(0);
            if (this.cornerRadius == 0) {
                this.mask.beginFill(0xFFFFFF, 1);
                this.mask.drawRect(0, 0, this.width, this.height);
            }
            else {
                this.mask.beginFill(0xFFFFFF, 1);
                this.mask.drawRoundedRect(0, 0, this.width, this.height, this.cornerRadius);
            }
            this._lastWidth = this.width;
            this._lastHeight = this.height;
        }
        
    }
}


ScrollingContainer.prototype = Object.create(Container.prototype);
ScrollingContainer.prototype.constructor = ScrollingContainer;
module.exports = ScrollingContainer;



Object.defineProperties(ScrollingContainer.prototype, {
    overflowHidden: {
        get: function () {
            return this._overflowHidden;
        },
        set: function (val) {
            this._overflowHidden = val;
            this.updateOverflow();
        }
    },
});

ScrollingContainer.prototype.addChild = function (UIObject) {
    var argumentsLength = arguments.length;
    if (argumentsLength > 1) {
        for (var i = 0; i < argumentsLength; i++) {
            this.addChild(arguments[i]);
        }
    }
    else {
        Container.prototype.addChild.call(this, UIObject);
        this.innerContainer.addChild(UIObject.container);
    }
    return UIObject;
};

