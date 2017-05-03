var UIBase = require('./UIBase'),
    InputController = require('./Interaction/InputController'),
    ClickEvent = require('./Interaction/ClickEvent');
/**
 * base object for all Input type objects
 *
 * @class
 * @extends PIXI.UI.UIBase
 * @memberof PIXI.UI
 * @param width {number} passed to uibase
 * @param height {number} passed to uibase
 * @param tabIndex {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as background for input
 */
function InputBase(width, height, tabIndex, tabGroup) {
    UIBase.call(this, width, height);
    var self = this;
    this._focused = false;
    this._useTab = this._usePrev = this._useNext = true;
    this.container.interactive = true;
    InputController.registrer(this, tabIndex, tabGroup);


    var keyDownEvent = function (e) {
        if (e.which === 9) {
            if (self._useTab) {
                InputController.fireTab();
                e.preventDefault();
            }
        }
        else if (e.which === 38) {
            if (self._usePrev) {
                InputController.firePrev();
                e.preventDefault();
            }
        }
        else if (e.which === 40) {
            if (self._useNext) {
                InputController.fireNext();
                e.preventDefault();
            }
        }
    };

    var documentMouseDown = function (e) {
        if (!self.__down)
            self.blur();
    };

    this.container.on("pointerdown", function (e) {
        self.focus();
        self.__down = true;
    });

    this.container.on("pointerup", function (e) {
        self.__down = false;
    });

    this.container.on("pointerupoutside", function (e) {
        self.__down = false;
    });

    //var cancelFocusEvent = new ClickEvent(this.stage)

    this._bindEvents = function () {
        if (this.stage !== null) {
            this.stage.on("pointerdown", documentMouseDown);
            document.addEventListener("keydown", keyDownEvent);
        }
    };

    this._clearEvents = function () {
        if (this.stage !== null) {
            this.stage.off("pointerdown", documentMouseDown);
            document.removeEventListener("keydown", keyDownEvent);
        }
    };
}

InputBase.prototype = Object.create(UIBase.prototype);
InputBase.prototype.constructor = InputBase;
module.exports = InputBase;

InputBase.prototype.focus = function () {
    if (!this._focused) {
        this._focused = true;
        this._bindEvents();
        InputController.set(this);
        this.emit("focusChanged", true);
        this.emit("focus");

    }
};

InputBase.prototype.blur = function () {
    if (this._focused) {
        InputController.clear();
        this._focused = false;
        this._clearEvents();
        this.emit("focusChanged", false);
        this.emit("blur");

    }
};