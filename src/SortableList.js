var Container = require('./Container');
var Tween = require('./Tween');
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
function SortableList(desc, tweenTime, tweenEase) {
    Container.call(this);
    this.desc = typeof desc !== "undefined" ? desc : false;
    this.tweenTime = tweenTime || 0;
    this.tweenEase = tweenEase;
    this.items = [];

}

SortableList.prototype = Object.create(Container.prototype);
SortableList.prototype.constructor = SortableList;
module.exports = SortableList;

SortableList.prototype.addChild = function (UIObject, fnValue, fnThenBy) {
    Container.prototype.addChild.call(this, UIObject);
    if (this.items.indexOf(UIObject) == -1) {
        this.items.push(UIObject);
    }

    if (typeof fnValue === "function")
        UIObject._sortListValue = fnValue;

    if (typeof fnThenBy === "function")
        UIObject._sortListThenByValue = fnThenBy;

    if (!UIObject._sortListRnd)
        UIObject._sortListRnd = Math.random();



    this.sort();
};

SortableList.prototype.removeChild = function (UIObject) {
    if (arguments.length > 1) {
        for (var i = 0; i < arguments.length; i++) {
            this.removeChild(arguments[i]);
        }
    }
    else {
        Container.prototype.removeChild.call(this, UIObject);
        var index = this.items.indexOf(UIObject);
        if (index != -1) {
            this.items.splice(index, 1);
        }
        this.sort();
    }
};

SortableList.prototype.sort = function (instant) {
    clearTimeout(this._sortTimeout);

    if (instant) {
        this._sort();
        return;
    }

    var _this = this;
    this._sortTimeout = setTimeout(function () { _this._sort(); }, 0);
};

SortableList.prototype._sort = function () {
    var self = this,
        desc = this.desc,
        y = 0,
        alt = true;

    this.items.sort(function (a, b) {
        var res = a._sortListValue() < b._sortListValue() ? desc ? 1 : -1 :
                  a._sortListValue() > b._sortListValue() ? desc ? -1 : 1 : 0;

        if (res === 0 && a._sortListThenByValue && b._sortListThenByValue) {
            res = a._sortListThenByValue() < b._sortListThenByValue() ? desc ? 1 : -1 :
                  a._sortListThenByValue() > b._sortListThenByValue() ? desc ? -1 : 1 : 0;
        }
        if (res === 0) {
            res = a._sortListRnd > b._sortListRnd ? 1 :
                  a._sortListRnd < b._sortListRnd ? -1 : 0;
        }
        return res;
    });

    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];

        alt = !alt;

        if (this.tweenTime > 0) {
            Tween.fromTo(item, this.tweenTime, { x: item.x, y: item.y }, { x: 0, y: y }, this.tweenEase);
        }
        else {
            item.x = 0;
            item.y = y;
        }
        y += item.height;
        if (typeof item.altering === "function")
            item.altering(alt);
    }

    //force it to update parents when sort animation is done (prevent scrolling container bug)
    if (this.tweenTime > 0) {
        setTimeout(function () {
            self.updatesettings(false, true);
        }, this.tweenTime * 1000);
    }
};


