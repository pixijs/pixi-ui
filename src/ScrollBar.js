var Slider = require('./Slider'),
    Tween = require('./Tween'),
    Ease = require('./Ease/Ease');

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
*
*/
function ScrollBar(options) {
    Slider.call(this, { track: options.track, handle: options.handle, fill: null, vertical: options.vertical });
    this.scrollingContainer = options.scrollingContainer;
    this.autohide = options.autohide;
    this._hidden = false;

}

ScrollBar.prototype = Object.create(Slider.prototype);
ScrollBar.prototype.constructor = ScrollBar;
module.exports = ScrollBar;


ScrollBar.prototype.initialize = function () {
    Slider.prototype.initialize.call(this);
    this.decimals = 3; //up decimals to trigger ValueChanging more often

    this._onValueChanging = function (val) {
        var sizeAmt = this.scrollingContainer._height / this.scrollingContainer.innerContainer.height || 0.001;
        if (sizeAmt < 1)
            this.scrollingContainer.forcePctPosition(this.vertical ? "y" : "x", this._amt);
    };

    this.scrollingContainer._scrollBars.push(this);

};

ScrollBar.prototype.alignToContainer = function () {
    var newPos,
        size,
        x_y = this.vertical ? "y" : "x",
        width_height = this.vertical ? "height" : "width",
        top_left = this.vertical ? "top" : "left",
        _posAmt = !this.scrollingContainer.innerContainer[width_height] ? 0 : -(this.scrollingContainer.innerContainer[x_y] / this.scrollingContainer.innerContainer[width_height]),
        sizeAmt = !this.scrollingContainer.innerContainer[width_height] ? 1 : this.scrollingContainer["_" + width_height] / this.scrollingContainer.innerContainer[width_height];

    //update amt
    this._amt = !this.scrollingContainer["_" + width_height] ? 0 : -(this.scrollingContainer.innerContainer[x_y] / (this.scrollingContainer.innerContainer[width_height] - this.scrollingContainer["_" + width_height]));

    if (sizeAmt >= 1) {
        size = this["_" + width_height];
        this.handle[top_left] = size * 0.5;
        this.toggleHidden(true);
    }
    else {
        size = this["_" + width_height] * sizeAmt;
        if (this._amt > 1) size -= (this["_" + width_height] - size) * (this._amt - 1);
        else if (this._amt < 0) size -= (this["_" + width_height] - size) * -this._amt;
        if (this._amt < 0) newPos = size * 0.5;
        else if (this._amt > 1) newPos = this["_" + width_height] - size * 0.5;
        else newPos = (_posAmt * this.scrollingContainer["_" + width_height]) + (size * 0.5);
        this.handle[top_left] = newPos;
        this.toggleHidden(false);
    }
    this.handle[width_height] = size;
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




