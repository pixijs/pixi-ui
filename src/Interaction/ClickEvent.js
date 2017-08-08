var ClickEvent = function (obj) {
    var bound = false,
        self = this,
        id = 0,
        ishover = false,
        mouse = new PIXI.Point(),
        offset = new PIXI.Point(),
        movementX = 0,
        movementY = 0;


    obj.container.interactive = true;

    var _onMouseDown = function (event) {
        mouse.copy(event.data.global);
        id = event.data.identifier;
        self.onPress.call(obj, event, true);
        if (!bound) {
            obj.container.on('mouseup', _onMouseUp);
            obj.container.on('mouseupoutside', _onMouseUpOutside);
            obj.container.on('touchend', _onMouseUp);
            obj.container.on('touchendoutside', _onMouseUpOutside);
            bound = true;
        }
    };

    var _mouseUpAll = function (event) {
        if (event.data.identifier !== id) return;
        offset.set(event.data.global.x - mouse.x, event.data.global.y - mouse.y);
        if (bound) {
            obj.container.removeListener('mouseup', _onMouseUp);
            obj.container.removeListener('mouseupoutside', _onMouseUpOutside);
            obj.container.removeListener('touchend', _onMouseUp);
            obj.container.removeListener('touchendoutside', _onMouseUpOutside);
            bound = false;
        }
        self.onPress.call(obj, event, false);
    };

    var _onMouseUp = function (event) {
        if (event.data.identifier !== id) return;
        _mouseUpAll(event);

        //prevent clicks with scrolling/dragging objects
        if (obj.dragThreshold) {
            movementX = Math.abs(offset.x);
            movementY = Math.abs(offset.y);
            if (Math.max(movementX, movementY) > obj.dragThreshold) return;
        }


        self.onClick.call(obj, event);
    };

    var _onMouseUpOutside = function (event) {
        if (event.data.identifier !== id) return;
        _mouseUpAll(event);
    };

    var _onMouseOver = function (event) {
        if (!ishover) {
            ishover = true;
            self.onHover.call(obj, event);
        }
    };

    var _onMouseOut = function (event) {
        if (ishover) {
            ishover = false;
            self.onLeave.call(obj, event);
        }
    };

    this.stopEvent = function () {
        if (bound) {
            obj.container.removeListener('mouseup', _onMouseUp);
            obj.container.removeListener('mouseupoutside', _onMouseUpOutside);
            obj.container.removeListener('touchend', _onMouseUp);
            obj.container.removeListener('touchendoutside', _onMouseUpOutside);
            bound = false;
        }
        obj.container.removeListener('mousedown', _onMouseDown);
        obj.container.removeListener('touchstart', _onMouseDown);
        obj.container.removeListener('mouseover', _onMouseOver);
        obj.container.removeListener('mouseout', _onMouseOut);
    };

    this.startEvent = function () {
        obj.container.on('mousedown', _onMouseDown);
        obj.container.on('touchstart', _onMouseDown);
        obj.container.on('mouseover', _onMouseOver);
        obj.container.on('mouseout', _onMouseOut);
    };

    this.startEvent();
};

ClickEvent.prototype.constructor = ClickEvent;
module.exports = ClickEvent;

ClickEvent.prototype.onHover = function (event) { };
ClickEvent.prototype.onLeave = function (event) { };
ClickEvent.prototype.onPress = function (event, isPressed) { };
ClickEvent.prototype.onClick = function (event) { };