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
    this.container.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
}


Container.prototype = Object.create(UIBase.prototype);
Container.prototype.constructor = Container;
module.exports = Container;


Container.prototype.update = function () {
    //if (this.container.interactive) {
        this.container.hitArea.width = this._width;
        this.container.hitArea.height = this._height;
    //}
};

