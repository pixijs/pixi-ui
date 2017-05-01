var DragEvent = function (obj) {
    var bound = false,
        start = new PIXI.Point(),
        offset = new PIXI.Point(),
        mouse = new PIXI.Point(),
        movementX = 0,
        movementY = 0,
        cancel = false,
        dragging = false,
        self = this,
        id = 0;

    obj.container.interactive = true;

    var _onDragStart = function (e) {
        id = e.data.identifier;
        self.onPress.call(obj, e, true);
        if (!bound) {
            start.copy(e.data.global);
            obj.stage.on('mousemove', _onDragMove);
            obj.stage.on('touchmove', _onDragMove);
            obj.stage.on('mouseup', _onDragEnd);
            obj.stage.on('mouseupoutside', _onDragEnd);
            obj.stage.on('touchend', _onDragEnd);
            obj.stage.on('touchendoutside', _onDragEnd);
            obj.stage.on('touchcancel', _onDragEnd);
            bound = true;
        }
    };

    var _onDragMove = function (event) {
        if (event.data.identifier !== id) return;
        mouse.copy(event.data.global);
        offset.set(mouse.x - start.x, mouse.y - start.y);
        if (!dragging) {
            movementX = Math.abs(offset.x);
            movementY = Math.abs(offset.y);
            if (movementX === 0 && movementY === 0 || Math.max(movementX, movementY) < obj.dragThreshold) return; //thresshold
            if (obj.dragRestrictAxis !== null) {
                cancel = false;
                if (obj.dragRestrictAxis == "x" && movementY > movementX) cancel = true;
                else if (obj.dragRestrictAxis == "y" && movementY <= movementX) cancel = true;
                if (cancel) {
                    _onDragEnd(event);
                    return;
                }
            }
            self.onDragStart.call(obj, event);
            dragging = true;
        }
        self.onDragMove.call(obj, event, offset);
    };

    var _onDragEnd = function (event) {
        if (event.data.identifier !== id) return;
        if (bound) {
            obj.stage.removeListener('mousemove', _onDragMove);
            obj.stage.removeListener('touchmove', _onDragMove);
            obj.stage.removeListener('mouseup', _onDragEnd);
            obj.stage.removeListener('mouseupoutside', _onDragEnd);
            obj.stage.removeListener('touchend', _onDragEnd);
            obj.stage.removeListener('touchendoutside', _onDragEnd);
            obj.stage.removeListener('touchcancel', _onDragEnd);
            dragging = false;
            bound = false;
            self.onDragEnd.call(obj, event);
            self.onPress.call(obj, event, false);

        }
    };

    this.stopEvent = function () {
        if (bound) {
            obj.stage.removeListener('mousemove', _onDragMove);
            obj.stage.removeListener('touchmove', _onDragMove);
            obj.stage.removeListener('mouseup', _onDragEnd);
            obj.stage.removeListener('mouseupoutside', _onDragEnd);
            obj.stage.removeListener('touchend', _onDragEnd);
            obj.stage.removeListener('touchendoutside', _onDragEnd);
            bound = false;
        }
        obj.container.removeListener('mousedown', _onDragStart);
        obj.container.removeListener('touchstart', _onDragStart);
    };

    this.startEvent = function () {
        obj.container.on('mousedown', _onDragStart);
        obj.container.on('touchstart', _onDragStart);
    };

    this.startEvent();
};

DragEvent.prototype.constructor = DragEvent;
module.exports = DragEvent;

DragEvent.prototype.onPress = function (event, isPressed) { };
DragEvent.prototype.onDragEnd = function (event) { };
DragEvent.prototype.onDragMove = function (event, offset) { };
DragEvent.prototype.onDragStart = function (event) { };