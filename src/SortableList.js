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

SortableList.prototype.addChild = function (UIObject, fnValue) {
    
    if (this.items.indexOf(UIObject) == -1) {
        this.items.push(UIObject);
    }
    UIObject._sortListValue = fnValue;
    Container.prototype.addChild.call(this, UIObject);


    this.sort();
}

SortableList.prototype.removeChild = function (UIObject) {
    if (arguments.length > 0) {
        for (var i = 0; i < arguments.length; i++) {
            this.removeChild(arguments[i]);
        }
    }
    else {
        var index = this.items.indexOf(UIObject);
        if (index != -1) {
            this.items.splice(index, 1);
        }
        Container.prototype.removeChild.call(this, UIObject);

        this.sort();
    }
}

SortableList.prototype.sort = function () {
    
    this.items.sort(function (a, b) {
        if (this.desc) {
            return a._sortListValue() > b._sortListValue() ? 1 : a._sortListValue() < b._sortListValue() ? -1 : 0;
        }
        else {
            return a._sortListValue() < b._sortListValue() ? 1 : a._sortListValue() > b._sortListValue() ? -1 : 0;
        }
    });

    var y = 0
    var alt = true;
    for (var i = 0; i < this.items.length; i++) {
        alt = !alt;
        var item = this.items[i];
        item.anchorTop = y;
        y += item.height;
        if (typeof item.altering === "function")
            item.altering(alt);
    }
}



