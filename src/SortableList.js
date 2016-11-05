var Container = require('./Container');
/**
 * An UI Container object
 *
 * @class
 * @extends PIXI.UI.UIBase
 * @memberof PIXI.UI
 * @param width {Number} Width of the Container
 * @param height {Number} Height of the Container
 */
function SortableList(desc) {
    Container.call(this);
    this.desc = typeof desc !== "undefined" ? desc : true;
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
}

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
}

SortableList.prototype.sort = function () {
    var desc = this.desc;
    this.items.sort(function (a, b) {
        var res = a._sortListValue() < b._sortListValue() ? desc ? 1 : -1 :
                  a._sortListValue() > b._sortListValue() ? desc ? -1 : 1 : 0;

        if (res == 0 && a._sortListThenByValue && b._sortListThenByValue) {
            res = a._sortListThenByValue() < b._sortListThenByValue() ? desc ? 1 : -1 :
                  a._sortListThenByValue() > b._sortListThenByValue() ? desc ? -1 : 1 : 0;
        }
        if (res == 0) {
            res = a._sortListRnd > b._sortListRnd ? 1 :
                  a._sortListRnd < b._sortListRnd ? -1 : 0;
        }
        return res;
    });

    var y = 0
    var alt = true;
    for (var i = 0; i < this.items.length; i++) {
        alt = !alt;
        var item = this.items[i];
        item.y = y;
        y += item.height;
        if (typeof item.altering === "function")
            item.altering(alt);
    }
}



