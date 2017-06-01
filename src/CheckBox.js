var InputBase = require('./InputBase'),
    ClickEvent = require('./Interaction/ClickEvent.js'),
    InputController = require('./Interaction/InputController');

/**
 * An UI button object
 *
 * @class
 * @extends PIXI.UI.InputBase
 * @memberof PIXI.UI
 * @param [options.checked=false] {bool} is checked
 * @param options.background {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as background for CheckBox
 * @param options.checkmark {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as checkmark for CheckBox
 * @param [options.checkgroup=null] {String} CheckGroup name
 * @param options.value {String} mostly used along with checkgroup
 * @param [options.tabIndex=0] {Number} input tab index
 * @param [options.tabGroup=0] {Number|String} input tab group
 */

function CheckBox(options) {
    InputBase.call(this, options.background.width, options.background.height, options.tabIndex || 0, options.tabGroup || 0);
    this._checked = options.checked !== undefined ? options.checked : false;
    this._value = options.value || "";
    this.checkGroup = options.checkgroup || null;

    this.background = options.background;
    this.background.width = "100%";
    this.background.height = "100%";
    this.addChild(this.background);

    this.checkmark = options.checkmark;
    if (this.checkmark) {
        this.checkmark.verticalAlign = "middle";
        this.checkmark.horizontalAlign = "center";
        if (!this._checked) {
            this.checkmark.alpha = 0;
        }
        this.addChild(this.checkmark);
    }




    this.container.buttonMode = true;

    if (this.checkGroup !== null)
        InputController.registrerCheckGroup(this);

    var self = this;
    var keyDownEvent = function (e) {
        if (e.which === 32) { //space
            self.click();
        }
    };

    var clickEvent = new ClickEvent(this);
    clickEvent.onHover = function (e) {
        self.emit("hover", true);
    };

    clickEvent.onLeave = function (e) {

        self.emit("hover", false);
    };

    clickEvent.onPress = function (e, isPressed) {
        if (isPressed) {
            self.focus();
            e.data.originalEvent.preventDefault();
        }
        self.emit("press", isPressed);
    };

    clickEvent.onClick = function (e) {
        self.click();
    };

    this.change = function (val) {
        if (this.checkmark)
            this.checkmark.alpha = val ? 1 : 0;
    };

    this.click = function () {
        self.emit("click");
        if (self.checkGroup !== null && self.checked)
            return;

        self.checked = !self.checked;
    };


    this.focus = function () {

        if (!this._focused) {
            InputBase.prototype.focus.call(this);
            document.addEventListener("keydown", keyDownEvent, false);
        }

    };

    this.blur = function () {

        if (this._focused) {
            InputBase.prototype.blur.call(this);
            document.removeEventListener("keydown", keyDownEvent);
        }
    };
}

CheckBox.prototype = Object.create(InputBase.prototype);
CheckBox.prototype.constructor = CheckBox;
module.exports = CheckBox;

Object.defineProperties(CheckBox.prototype, {
    checked: {
        get: function () {
            return this._checked;
        },
        set: function (val) {


            if (val !== this._checked) {

                if (this.checkGroup !== null && val)
                    InputController.updateCheckGroupSelected(this);


                
                this.emit("change", val);
                this._checked = val;
                this.change(val);

            }
        }
    },
    value: {
        get: function () {
            return this._value;
        },
        set: function (val) {
            this._value = val;
            if (this.checked)
                InputController.updateCheckGroupSelected(this);
        }
    },
    selectedValue: {
        get: function () {
            return InputController.getCheckGroupSelectedValue(this.checkGroup);
        },
        set: function (val) {
            InputController.setCheckGroupSelectedValue(this.checkGroup, val);
        }
    }
});



/*
 * Features:
 * checkbox, radio button (checkgroups)
 * 
 * Methods:
 * blur()
 * focus()
 * change(checked) //only exposed to overwrite (if you dont want to hard toggle alpha of checkmark) 
 * 
 * Properties:
 * checked: get/set checkbox checked
 * value: get/set checkbox value
 * selectedValue: get/set selected value for checkgroup
 * 
 * Events:
 * "hover"          param: [bool]isHover (hover/leave)
 * "press"          param: [bool]isPressed (pointerdown/pointerup)
 * "click"
 * "blur"
 * "focus"
 * "focusChanged"   param: [bool]isFocussed
 * "change"         param: [bool]isChecked
 *  
 */