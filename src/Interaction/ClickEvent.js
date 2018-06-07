var ClickEvent = function (obj, includeHover, rightMouseButton) {



    var bound = false,
        self = this,
        id = 0,
        ishover = false,
        mouse = new PIXI.Point(),
        offset = new PIXI.Point(),
        movementX = 0,
        movementY = 0,
        right = typeof rightMouseButton === 'undefined' ? false : rightMouseButton,
        hover = typeof includeHover === 'undefined' ? true : includeHover;

    var eventname_mousedown = right ? "rightdown" : "mousedown";
    var eventname_mouseup = right ? "rightup" : "mouseup";
    var eventname_mouseupoutside = right ? "rightupoutside" : "mouseupoutside";

    obj.container.interactive = true;

    var _onMouseDown = function (event) {
        mouse.copy(event.data.global);
        id = event.data.identifier;
        self.onPress.call(obj, event, true);
        if (!bound) {
            obj.container.on(eventname_mouseup, _onMouseUp);
            obj.container.on(eventname_mouseupoutside, _onMouseUpOutside);
            if (!right) {
                obj.container.on('touchend', _onMouseUp);
                obj.container.on('touchendoutside', _onMouseUpOutside);
            }
            bound = true;
        }
        event.data.originalEvent.preventDefault();
    };

    var _mouseUpAll = function (event) {
        if (event.data.identifier !== id) return;
        offset.set(event.data.global.x - mouse.x, event.data.global.y - mouse.y);
        if (bound) {
            obj.container.removeListener(eventname_mouseup, _onMouseUp);
            obj.container.removeListener(eventname_mouseupoutside, _onMouseUpOutside);
            if (!right) {
                obj.container.removeListener('touchend', _onMouseUp);
                obj.container.removeListener('touchendoutside', _onMouseUpOutside);
            }
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
            obj.container.on('mousemove', _onMouseMove);
            obj.container.on('touchmove', _onMouseMove);
            self.onHover.call(obj, event, true);
        }
    };

    var _onMouseOut = function (event) {
        if (ishover) {
            ishover = false;
            obj.container.removeListener('mousemove', _onMouseMove);
            obj.container.removeListener('touchmove', _onMouseMove);
            self.onHover.call(obj, event, false);
        }
    };

    var _onMouseMove = function (event) {
        self.onMove.call(obj, event);
    };

    this.stopEvent = function () {
        if (bound) {
            obj.container.removeListener(eventname_mouseup, _onMouseUp);
            obj.container.removeListener(eventname_mouseupoutside, _onMouseUpOutside);

            if (!right) {
                obj.container.removeListener('touchend', _onMouseUp);
                obj.container.removeListener('touchendoutside', _onMouseUpOutside);
            }
            bound = false;
        }
        obj.container.removeListener(eventname_mousedown, _onMouseDown);
        if (!right) obj.container.removeListener('touchstart', _onMouseDown);

        if (hover) {
            obj.container.removeListener('mouseover', _onMouseOver);
            obj.container.removeListener('mouseout', _onMouseOut);
            obj.container.removeListener('mousemove', _onMouseMove);
            obj.container.removeListener('touchmove', _onMouseMove);
        }
    };

    this.startEvent = function () {
        obj.container.on(eventname_mousedown, _onMouseDown);
        if (!right) obj.container.on('touchstart', _onMouseDown);

        if (hover) {
            obj.container.on('mouseover', _onMouseOver);
            obj.container.on('mouseout', _onMouseOut);
            
        }
    };

    this.startEvent();
};

ClickEvent.prototype.constructor = ClickEvent;
module.exports = ClickEvent;

ClickEvent.prototype.onHover = function (event, over) { };
ClickEvent.prototype.onPress = function (event, isPressed) { };
ClickEvent.prototype.onClick = function (event) { };
ClickEvent.prototype.onMove = function (event) { };