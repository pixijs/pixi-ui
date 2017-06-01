var UIBase = require('./UIBase'),
    DragEvent = require('./Interaction/DragEvent'),
    ClickEvent = require('./Interaction/ClickEvent'),
    Tween = require('./Tween'),
    Ease = require('./Ease/Ease'),
    MathHelper = require('./MathHelper');

/**
* An UI Slider, the default width/height is 90%
* 
* @class
* @extends UIBase
* @memberof PIXI.UI
* @param options {Object} Slider settings
* @param options.track {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)}  Any type of UIOBject, will be used for the slider track
* @param options.handle {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as slider handle
* @param [options.fill=null] {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used for slider fill
* @param [options.vertical=false] {boolean} Direction of the slider
* @param [options.value=0] {number} value of the slider
* @param [options.minValue=0] {number} minimum value
* @param [options.maxValue=100] {number} max value
* @param [options.decimals=0] {boolean} the decimal precision (use negative to round tens and hundreds)
* @param [options.onValueChange=null] {callback} Callback when the value has changed
* @param [options.onValueChanging=null] {callback} Callback while the value is changing
* 
* 
*/
function Slider(options) {
    UIBase.call(this);
    this._amt = 0;
    this._disabled = false;

    //set options
    this.track = options.track;
    this.handle = options.handle;
    this.fill = options.fill || null;
    this._minValue = options.minValue || 0;
    this._maxValue = options.maxValue || 100;
    this.decimals = options.decimals || 0;
    this.vertical = options.vertical || false;
    this._onValueChange = options.onValueChange || null;
    this._onValueChanging = options.onValueChanging || null;
    this.value = options.value || 50;
    this.handle.pivot = 0.5;



    this.addChild(this.track);
    if (this.fill) this.track.addChild(this.fill);
    this.addChild(this.handle);
    this.handle.container.buttonMode = true;

    if (this.vertical) {
        this.height = "100%";
        this.width = this.track.width;
        this.track.height = "100%";
        this.handle.horizontalAlign = "center";
        if (this.fill) this.fill.horizontalAlign = "center";
    }
    else {
        this.width = "100%";
        this.height = this.track.height;
        this.track.width = "100%";
        this.handle.verticalAlign = "middle";
        if (this.fill) this.fill.verticalAlign = "middle";
    }

}

Slider.prototype = Object.create(UIBase.prototype);
Slider.prototype.constructor = Slider;
module.exports = Slider;

Slider.prototype.update = function (soft) {
    var handleSize, val;

    if (this.vertical) {
        handleSize = this.handle._height || this.handle.container.height;
        val = ((this._height - handleSize) * this._amt) + (handleSize * 0.5);
        if (soft) {
            Tween.to(this.handle, 0.3, { top: val }, Ease.Power2.easeOut);
            if (this.fill) Tween.to(this.fill, 0.3, { height: val }, Ease.Power2.easeOut);
        }
        else {
            Tween.set(this.handle, { top: val });
            if (this.fill) Tween.set(this.fill, { height: val });
        }
    }
    else {
        handleSize = this.handle._width || this.handle.container.width;
        val = ((this._width - handleSize) * this._amt) + (handleSize * 0.5);
        if (soft) {
            Tween.to(this.handle, 0.3, { left: val }, Ease.Power2.easeOut);
            if (this.fill) Tween.to(this.fill, 0.3, { width: val }, Ease.Power2.easeOut);
        }
        else {
            Tween.set(this.handle, { left: val });
            if (this.fill) Tween.set(this.fill, { width: val });
        }
    }
};

Slider.prototype.initialize = function () {
    UIBase.prototype.initialize.call(this);



    var self = this;
    var startValue = 0;



    ////Handle dragging
    var handleDrag = new DragEvent(this.handle);
    handleDrag.onPress = function (event, isPressed) {
        event.stopPropagation();
    };

    handleDrag.onDragStart = function (event) {
        startValue = self._amt;
        maxPosition = self.vertical ? self._height - self.handle._height : self._width - self.handle._width;
    };

    handleDrag.onDragMove = function (event, offset) {

        self._amt = !maxPosition ? 0 : Math.max(0, Math.min(1, startValue + ((self.vertical ? offset.y : offset.x) / maxPosition)));

        triggerValueChanging();
        self.update();
    };

    handleDrag.onDragEnd = function () {
        triggerValueChange();
        self.update();
    };

    //Bar pressing/dragging
    var localMousePosition = new PIXI.Point();
    var trackDrag = new DragEvent(this.track);

    trackDrag.onPress = function (event, isPressed) {
        if (isPressed)
            updatePositionToMouse(event.data.global, true);
        event.stopPropagation();
    };

    trackDrag.onDragMove = function (event) {
        updatePositionToMouse(event.data.global, false);
    };

    trackDrag.onDragEnd = function () {
        triggerValueChange();
    };

    var updatePositionToMouse = function (mousePosition, soft) {
        self.track.container.toLocal(mousePosition, null, localMousePosition, true);

        var newPos = self.vertical ? localMousePosition.y - self.handle._height * 0.5 : localMousePosition.x - self.handle._width * 0.5;
        var maxPos = self.vertical ? self._height - self.handle._height : self._width - self.handle._width;
        self._amt = !maxPos ? 0 : Math.max(0, Math.min(1, newPos / maxPos));
        self.update(soft);
        triggerValueChanging();
    };

    var triggerValueChange = function () {
        self.emit("change", self.value);
        if (self._lastChange != self.value) {
            self._lastChange = self.value;
            if (typeof self.onValueChange === "function")
                self.onValueChange(self.value);
        }
    };

    var triggerValueChanging = function () {
        self.emit("changeing", self.value);
        if (self._lastChanging != self.value) {
            self._lastChanging = self.value;
            if (typeof self._onValueChanging === "function")
                self._onValueChanging(self.value);
        }
    };
};


Object.defineProperties(Slider.prototype, {
    value: {
        get: function () {
            return MathHelper.Round(MathHelper.Lerp(this._minValue, this._maxValue, this._amt), this.decimals);
        },
        set: function (val) {
            this._amt = (Math.max(this._minValue, Math.min(this._maxValue, val)) - this._minValue) / (this._maxValue - this._minValue);
            if (typeof this.onValueChange === "function")
                self.onValueChange(this.value);
            if (typeof this._onValueChanging === "function")
                this._onValueChanging(this.value);
            this.update();
        }
    },

    onValueChange: {
        get: function () {
            return this._onValueChange;
        },
        set: function (val) {
            this._onValueChange = val;
        }
    },
    onValueChanging: {
        get: function () {
            return this._onValueChanging;
        },
        set: function (val) {
            this._onValueChanging = val;
        }
    },
    minValue: {
        get: function () {
            return this._minValue;
        },
        set: function (val) {
            this._minValue = val;
            this.update();
        }
    },
    maxValue: {
        get: function () {
            return this._maxValue;
        },
        set: function (val) {
            this._maxValue = val;
            this.update();
        }
    },
    disabled: {
        get: function () {
            return this._disabled;
        },
        set: function (val) {
            if (val !== this._disabled) {
                this._disabled = val;
                this.handle.container.buttonMode = !val;
                this.handle.container.interactive = !val;
                this.track.container.interactive = !val;
            }
        }
    }
});