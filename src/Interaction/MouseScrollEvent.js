var MouseScrollEvent = function (obj, preventDefault) {
    var bound = false, delta = new PIXI.Point(), self = this;
    obj.container.interactive = true;

    var _onMouseScroll = function (event) {
        if (preventDefault)
            event.preventDefault();

        delta.set(event.deltaX, event.deltaY);
        self.onMouseScroll.call(obj, event, delta);
    };

    var _onHover = function (event) {
        if (!bound) {
            document.addEventListener("mousewheel", _onMouseScroll, false);
            document.addEventListener("DOMMouseScroll", _onMouseScroll, false);
            bound = true;
        }
    };

    var _onMouseOut = function (event) {
        if (bound) {
            document.removeEventListener("mousewheel", _onMouseScroll);
            document.removeEventListener("DOMMouseScroll", _onMouseScroll);
            bound = false;
        }
    };

    this.stopEvent = function () {
        if (bound) {
            document.removeEventListener("mousewheel", _onMouseScroll);
            document.removeEventListener("DOMMouseScroll", _onMouseScroll);
            bound = false;
        }
        obj.container.removeListener('mouseover', _onHover);
        obj.container.removeListener('mouseout', _onMouseOut);
    };

    this.startEvent = function () {
        obj.container.on('mouseover', _onHover);
        obj.container.on('mouseout', _onMouseOut);
    };

    this.startEvent();

    
};

MouseScrollEvent.prototype.constructor = MouseScrollEvent;
module.exports = MouseScrollEvent;

MouseScrollEvent.prototype.onMouseScroll = function (event, delta) { };