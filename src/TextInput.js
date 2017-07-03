var InputBase = require('./InputBase'),
    Container = require('./Container'),
    DragEvent = require('./Interaction/DragEvent');

/**
 * An UI text object
 *
 * @class
 * @extends PIXI.UI.InputBase
 * @memberof PIXI.UI
 * @param options.value {String} Text content
 * @param [options.multiLine=false] {Boolean} Multiline input
 * @param options.style {PIXI.TextStyle} Style used for the Text
 * @param options.background {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as background for input
 * @param [options.selectedColor='#ffffff'] {String|Array} Fill color of selected text
 * @param [options.selectedBackgroundColor='#318cfa'] {String} BackgroundColor of selected text
 * @param [options.width=150] {Number} width of input
 * @param [options.height=20] {Number} height of input
 * @param [options.padding=3] {Number} input padding
 * @param [options.paddingTop=0] {Number} input padding
 * @param [options.paddingBottom=0] {Number} input padding
 * @param [options.paddingLeft=0] {Number} input padding
 * @param [options.paddingRight=0] {Number} input padding
 * @param [options.tabIndex=0] {Number} input tab index
 * @param [options.tabGroup=0] {Number|String} input tab group
 * @param [options.maxLength=0] {Number} 0 = unlimited
 * @param [options.caretWidth=1] {Number} width of the caret
 * @param [options.lineHeight=0] {Number} 0 = inherit from text
 */
function TextInput(options) {
    //create temp input (for mobile keyboard)
    if (typeof _pui_tempInput === "undefined") {
        _pui_tempInput = document.createElement("INPUT");
        _pui_tempInput.setAttribute("type", "text");
        _pui_tempInput.setAttribute("id", "_pui_tempInput");
        _pui_tempInput.setAttribute("style", "position:fixed; left:-10px; top:-10px; width:0px; height: 0px;");
        document.body.appendChild(_pui_tempInput);
    }


    InputBase.call(this, options.width || options.background ? options.background.width : 150, options.height || options.background ? options.background.height : 20, options.tabIndex || 0, options.tabGroup || 0);
    this._dirtyText = true;
    this.maxLength = options.maxLength || 0;
    this._value = this._lastValue = options.value || "";

    if (this.maxLength) this._value = this._value.slice(0, this.maxLength);

    var self = this;
    var chars = [];
    var multiLine = options.multiLine !== undefined ? options.multiLine : false;
    var color = options.style && options.style.fill ? options.style.fill : "#000000";
    var selectedColor = options.selectedColor || "#ffffff";
    var selectedBackgroundColor = options.selectedBackgroundColor || "#318cfa";
    var tempText = new PIXI.Text("1", options.style);
    var textHeight = tempText.height;
    var lineHeight = options.lineHeight || textHeight || self._height;
    tempText.destroy();


    //set cursor
    //this.container.cursor = "text";

    //selection graphics
    var selection = self.selection = new PIXI.Graphics();
    selection.visible = false;
    selection._startIndex = 0;
    selection._endIndex = 0;

    //caret graphics
    var caret = self.caret = new PIXI.Graphics();
    caret.visible = false;
    caret._index = 0;
    caret.lineStyle(options.caretWidth || 1, "#ffffff", 1);
    caret.moveTo(0, 0);
    caret.lineTo(0, textHeight);


    //insert bg
    if (options.background) {
        this.background = options.background;
        this.background.width = "100%";
        this.background.height = "100%";
        this.addChild(this.background);
    }

    //var padding
    var paddingLeft = options.paddingLeft !== undefined ? options.paddingLeft : options.padding !== undefined ? options.padding : 3;
    var paddingRight = options.paddingRight !== undefined ? options.paddingRight : options.padding !== undefined ? options.padding : 3;
    var paddingBottom = options.paddingBottom !== undefined ? options.paddingBottom : options.padding !== undefined ? options.padding : 3;
    var paddingTop = options.paddingTop !== undefined ? options.paddingTop : options.padding !== undefined ? options.padding : 3;

    //insert text container (scrolling container)
    var textContainer = this.textContainer = new PIXI.UI.ScrollingContainer({
        scrollX: !multiLine,
        scrollY: multiLine,
        dragScrolling: multiLine,
        expandMask: 2,
        softness: 0.2,
        overflowX: 40,
        overflowY: 40
    });
    textContainer.anchorTop = paddingTop;
    textContainer.anchorBottom = paddingBottom;
    textContainer.anchorLeft = paddingLeft;
    textContainer.anchorRight = paddingRight;
    this.addChild(textContainer);

    if (multiLine) {
        this._useNext = this._usePrev = false;
        textContainer.dragRestrictAxis = "y";
        textContainer.dragThreshold = 5;
        this.dragRestrictAxis = "x";
        this.dragThreshold = 5;

    }


    var innerContainer = textContainer.innerContainer;
    innerContainer.cacheAsBitmap = true;
    //textContainer.container.addChild(innerContainer);


    this.update = function () {
        if (this._width != this._lastWidth) {
            this._lastWidth = this._width;
            if (multiLine) {
                updateText();
                if (caret.visible) self.setCaretIndex(caret._index);
                if (hasSelection) updateSelectionGraphics();
            }

        }

        //update text        
        if (this._dirtyText) {
            updateText();
            this._dirtyText = false;
        }
    };

    //selection Vars
    var caretInterval, //interval for flash
        si, //startIndex
        sie, //startIndexEnd
        ei, //endIndex
        eie, //endIndexEnd
        sp = new PIXI.Point(), //startposition
        ds = new PIXI.Point(), //dragStart
        de = new PIXI.Point(), //dragend
        rdd = false, //Reverse drag direction
        vrdd = false, //vertical Reverse drag direction
        selectionStart = -1,
        selectionEnd = -1,
        hasSelection = false,
        t = performance.now(), //timestamp
        cc = 0,  //click counter
        textLengthPX = 0,
        textHeightPX = 0,
        lineIndexMax = 0,
        ctrlDown = false,
        shiftDown = false,
        shiftKey = 16,
        ctrlKey = 17,
        cmdKey = 91;



    var updateText = function () {
        textLengthPX = 0;
        textHeightPX = 0;
        lineIndexMax = 0;

        var lineIndex = 0,
            length = self._value.length,
            x = 0,
            y = (lineHeight - textHeight) * 0.5,
            i = 0;

        //destroy excess chars
        if (chars.length > length) {
            for (i = chars.length - 1; i >= length; i--) {
                innerContainer.removeChild(chars[i]);
                chars[i].destroy();
            }
            chars.splice(length, chars.length - length);
        }

        //update and add chars
        var whitespace = false;
        var newline = false;
        var wordIndex = 0;
        var lastWordIndex = -1;
        var wrap = false;
        for (i = 0; i < self._value.length; i++) {
            if (whitespace || newline) {
                lastWordIndex = i;
                wordIndex++;
            }

            var c = self._value[i];
            whitespace = c === " ";
            newline = c === "\n";


            if (newline) { //newline "hack". webgl render errors if \n is passed to text
                c = "";
            }



            var charText = chars[i];
            if (!charText) {
                charText = new PIXI.Text(c, options.style);
                innerContainer.addChild(charText);
                chars.push(charText);
            }
            else {
                charText.text = c;
            }

            charText.scale.x = newline ? 0 : 1;
            charText.wrapped = wrap;
            wrap = false;

            if (newline || (multiLine && x + charText.width >= self._width - paddingLeft - paddingRight)) {
                lineIndex++;
                x = 0;
                y += lineHeight;

                if (lastWordIndex != -1 && !newline) {
                    i = lastWordIndex - 1;
                    lastWordIndex = -1;
                    wrap = true;
                    continue;
                }
            }


            charText.lineIndex = lineIndex;
            charText.x = x;
            charText.y = y;
            charText.wordIndex = whitespace || newline ? -1 : wordIndex;
            x += charText.width;


            if (x > textLengthPX)
                textLengthPX = x;
            if (y > textHeightPX)
                textHeightPX = y;
        }

        lineIndexMax = lineIndex;

        //put caret on top
        innerContainer.addChild(caret);

        //recache
        if (innerContainer.cacheAsBitmap) {
            innerContainer.cacheAsBitmap = false;
            innerContainer.cacheAsBitmap = true;
        }

        textContainer.update();

    };

    var updateClosestIndex = function (point, start) {
        var currentDistX = 99999;
        var currentClosest;
        var currentIndex = -1;
        var atEnd = false;

        var closestLineIndex = 0;
        if (lineIndexMax > 0)
            closestLineIndex = Math.max(0, Math.min(lineIndexMax, Math.floor(point.y / lineHeight)));





        for (var i = 0; i < chars.length; i++) {
            var char = chars[i];
            if (char.lineIndex != closestLineIndex) continue;

            var distX = Math.abs(point.x - (char.x + (char.width * 0.5)));
            if (distX < currentDistX) {
                currentDistX = distX;
                currentClosest = char;
                currentIndex = i;
                atEnd = point.x > char.x + (char.width * 0.5);
            }
        }


        if (start) {
            si = currentIndex;
            sie = atEnd;
        }
        else {
            ei = currentIndex;
            eie = atEnd;
        }
    };

    var deleteSelection = function () {
        if (hasSelection) {
            self.value = self.value.slice(0, selectionStart) + self.value.slice(selectionEnd + 1);
            self.setCaretIndex(selectionStart);
            return true;
        }
        return false;
    };

    var updateSelectionColors = function () {
        //Color charecters
        for (var i = 0; i < chars.length; i++) {
            if (i >= selectionStart && i <= selectionEnd)
                chars[i].style.fill = selectedColor;
            else
                chars[i].style.fill = color;
        }
    };

    var _sp = new PIXI.Point();
    var scrollToPosition = function (pos) {
        _sp.copy(pos);
        if (multiLine && _sp.y >= lineHeight)
            _sp.y += lineHeight;
        textContainer.focusPosition(_sp);
    };

    var resetScrollPosition = function () {
        _sp.set(0, 0);
        textContainer.focusPosition(_sp);
    };

    //caret
    var hideCaret = function () {
        caret.visible = false;
        clearInterval(caretInterval);
    };

    var showCaret = function () {
        self.clearSelection();
        clearInterval(caretInterval);
        caret.alpha = 1;
        caret.visible = true;
        caretInterval = setInterval(function () {
            caret.alpha = caret.alpha === 0 ? 1 : 0;
        }, 500);

    };

    var insertTextAtCaret = function (c) {
        if (hasSelection)
            deleteSelection();
        if (!self.maxLength || chars.length < self.maxLength) {

            if (caret._atEnd) {
                self.value += c;
                self.setCaretIndex(chars.length);
            }
            else {
                var index = Math.min(chars.length - 1, caret._index);
                self.value = self.value.slice(0, index) + c + self.value.slice(index);
                self.setCaretIndex(index + c.length);
            }
        }
    };

    //events
    var keyDownEvent = function (e) {
        if (e.which === ctrlKey || e.which === cmdKey) ctrlDown = true;
        if (e.which === shiftKey) shiftDown = true;

        if (e.which === 13) { //enter
            insertTextAtCaret('\n');
            e.preventDefault();
            return;
        }

        if (ctrlDown) {

            //ctrl + ?
            if (e.which === 65) { //ctrl + a
                self.select();
                e.preventDefault();
                return;
            }
            else if (e.which === 90) { //ctrl + z (undo)
                if (self.value != self._lastValue)
                    self.value = self._lastValue;
                self.setCaretIndex(self._lastValue.length + 1);
                e.preventDefault();
                return;
            }

        }
        if (e.which === 8) {
            //backspace
            if (!deleteSelection()) {
                if (caret._index > 0 || (chars.length === 1 && caret._atEnd)) {
                    if (caret._atEnd) {
                        self.value = self.value.slice(0, chars.length - 1);
                        self.setCaretIndex(caret._index);
                    }
                    else {
                        self.value = self.value.slice(0, caret._index - 1) + self.value.slice(caret._index);
                        self.setCaretIndex(caret._index - 1);
                    }
                }
            }
            e.preventDefault();
            return;
        }

        if (e.which === 46) {
            //delete
            if (!deleteSelection()) {
                if (!caret._atEnd) {
                    self.value = self.value.slice(0, caret._index) + self.value.slice(caret._index + 1);
                    self.setCaretIndex(caret._index);
                }
            }
            e.preventDefault();
            return;
        }
        else if (e.which === 37 || e.which === 39) {
            rdd = e.which === 37;
            if (shiftDown) {
                if (hasSelection) {
                    var caretAtStart = selectionStart === caret._index;
                    if (caretAtStart) {
                        if (selectionStart === selectionEnd && rdd === caret._forward) {
                            self.setCaretIndex(caret._forward ? caret._index : caret._index + 1);
                        }
                        else {
                            var startindex = rdd ? caret._index - 1 : caret._index + 1;
                            self.selectRange(startindex, selectionEnd);
                            caret._index = Math.min(chars.length - 1, Math.max(0, startindex));
                        }
                    }
                    else {
                        var endIndex = rdd ? caret._index - 1 : caret._index + 1;
                        self.selectRange(selectionStart, endIndex);
                        caret._index = Math.min(chars.length - 1, Math.max(0, endIndex));
                    }
                }
                else {
                    var _i = caret._atEnd ? caret._index + 1 : caret._index;
                    var selectIndex = rdd ? _i - 1 : _i;
                    self.selectRange(selectIndex, selectIndex);
                    caret._index = selectIndex;
                    caret._forward = !rdd;
                }
            }
            else {
                //Navigation
                if (hasSelection)
                    self.setCaretIndex(rdd ? selectionStart : selectionEnd + 1);
                else
                    self.setCaretIndex(caret._index + (rdd ? caret._atEnd ? 0 : -1 : 1));
            }
            e.preventDefault();
            return;

        }
        else if (multiLine && (e.which === 38 || e.which === 40)) {
            vrdd = e.which === 38;
            if (shiftDown) {
                if (hasSelection) {
                    de.y = Math.max(0, Math.min(textHeightPX, de.y + (vrdd ? -lineHeight : lineHeight)));
                    updateClosestIndex(de, false);
                    console.log(si, ei);
                    if (Math.abs(si - ei) <= 1) {
                        console.log(si, ei);
                        self.setCaretIndex(sie ? si + 1 : si);
                    } else {
                        caret._index = (eie ? ei + 1 : ei) + (caret._down ? -1 : 0);
                        self.selectRange(caret._down ? si : si - 1, caret._index);
                    }

                }
                else {
                    si = caret._index;
                    sie = false;
                    de.copy(caret);
                    de.y = Math.max(0, Math.min(textHeightPX, de.y + (vrdd ? -lineHeight : lineHeight)));
                    updateClosestIndex(de, false);
                    caret._index = (eie ? ei + 1 : ei) - (vrdd ? 0 : 1);
                    self.selectRange(vrdd ? si - 1 : si, caret._index);
                    caret._down = !vrdd;
                }
            }
            else {
                if (hasSelection) {
                    self.setCaretIndex(vrdd ? selectionStart : selectionEnd + 1);
                }
                else {
                    ds.copy(caret);
                    ds.y += vrdd ? -lineHeight : lineHeight;
                    ds.x += 1;
                    updateClosestIndex(ds, true);
                    self.setCaretIndex(sie ? si + 1 : si);
                }
            }
            e.preventDefault();
            return;
        }
    };

    var keyUpEvent = function (e) {
        if (e.which == ctrlKey || e.which == cmdKey) ctrlDown = false;
        if (e.which === shiftKey) shiftDown = false;
    };

    var copyEvent = function (e) {
        if (hasSelection) {
            var clipboardData = e.clipboardData || window.clipboardData;
            clipboardData.setData('Text', self.value.slice(selectionStart, selectionEnd + 1));
        }
        e.preventDefault();
    };

    var cutEvent = function (e) {
        if (hasSelection) {
            copyEvent(e);
            deleteSelection();
        }
        e.preventDefault();
    };

    var pasteEvent = function (e) {
        var clipboardData = e.clipboardData || window.clipboardData;
        insertTextAtCaret(clipboardData.getData('Text'));
        e.preventDefault();
    };

    var inputEvent = function (e) {
        insertTextAtCaret(e.data);
        e.preventDefault();
    };

    var inputBlurEvent = function (e) {
        self.blur();
    };

    var event = new DragEvent(this);

    event.onPress = function (e, mouseDown) {

        if (mouseDown) {
            var timeSinceLast = performance.now() - t;
            t = performance.now();
            if (timeSinceLast < 250) {
                cc++;
                if (cc > 1)
                    this.select();
                else {
                    innerContainer.toLocal(sp, undefined, ds, true);
                    updateClosestIndex(ds, true);
                    var c = chars[si];
                    if (c) {
                        if (c.wordIndex != -1)
                            this.selectWord(c.wordIndex);
                        else
                            this.selectRange(si, si);
                    }
                }
            }
            else {
                cc = 0;
                sp.copy(e.data.global);
                innerContainer.toLocal(sp, undefined, ds, true);
                if (chars.length) {
                    updateClosestIndex(ds, true);
                    self.setCaretIndex(sie ? si + 1 : si);
                }
            }
        }
        e.data.originalEvent.preventDefault();
    };

    event.onDragMove = function (e, offset) {
        if (!chars.length || !this._focused) return;

        de.x = sp.x + offset.x;
        de.y = sp.y + offset.y;
        innerContainer.toLocal(de, undefined, de, true);
        updateClosestIndex(de, false);

        if (si < ei) {
            self.selectRange(sie ? si + 1 : si, eie ? ei : ei - 1);
            caret._index = eie ? ei : ei - 1;
        }
        else if (si > ei) {
            self.selectRange(ei, sie ? si : si - 1);
            caret._index = ei;
        }
        else {
            if (sie === eie) {
                self.setCaretIndex(sie ? si + 1 : si);
            }
            else {
                self.selectRange(si, ei);
                caret._index = ei;
            }
        }

        caret._forward = si <= ei;
        caret._down = offset.y > 0;

        scrollToPosition(de);
    };




    //public methods
    this.focus = function () {
        if (!this._focused) {
            InputBase.prototype.focus.call(this);

            var l = this.container.worldTransform.tx + "px";
            var t = this.container.worldTransform.ty + "px";
            var h = this.container.height + "px";
            var w = this.container.width + "px";

            _pui_tempInput.setAttribute("style", "position:fixed; left:" + l + "; top:" + t + "; height:" + h + "; width:" + w + ";");
            _pui_tempInput.value = "";
            _pui_tempInput.focus();
            _pui_tempInput.setAttribute("style", "position:fixed; left:-10px; top:-10px; width:0px; height: 0px;");

            innerContainer.cacheAsBitmap = false;
            _pui_tempInput.addEventListener("blur", inputBlurEvent, false);
            document.addEventListener("keydown", keyDownEvent, false);
            document.addEventListener("keyup", keyUpEvent, false);
            document.addEventListener('paste', pasteEvent, false);
            document.addEventListener('copy', copyEvent, false);
            document.addEventListener('cut', cutEvent, false);
            _pui_tempInput.addEventListener('textInput', inputEvent, false);

            setTimeout(function () {
                if (!caret.visible && !self.selection.visible && !multiLine)
                    self.setCaretIndex(chars.length);
            }, 0);

        }

    };

    this.blur = function () {
        if (this._focused) {
            InputBase.prototype.blur.call(this);
            ctrlDown = false;
            shiftDown = false;
            hideCaret();
            this.clearSelection();
            if (chars.length > 1) innerContainer.cacheAsBitmap = true;
            _pui_tempInput.removeEventListener("blur", inputBlurEvent);
            document.removeEventListener("keydown", keyDownEvent);
            document.removeEventListener("keyup", keyUpEvent);
            document.removeEventListener('paste', pasteEvent);
            document.removeEventListener('copy', copyEvent);
            document.removeEventListener('cut', cutEvent);
            _pui_tempInput.removeEventListener('textInput', inputEvent);
            _pui_tempInput.blur();

        }

        if (!multiLine)
            resetScrollPosition();
    };

    this.setCaretIndex = function (index) {
        caret._atEnd = index >= chars.length;
        caret._index = Math.max(0, Math.min(chars.length - 1, index));

        if (chars.length && index > 0) {

            var i = Math.max(0, Math.min(index, chars.length - 1));
            var c = chars[i];

            if (c && c.wrapped) {
                caret.x = c.x;
                caret.y = c.y;
            }
            else {
                i = Math.max(0, Math.min(index - 1, chars.length - 1));
                c = chars[i];
                caret.x = chars[i].x + chars[i].width;
                caret.y = (chars[i].lineIndex * lineHeight) + (lineHeight - textHeight) * 0.5;
            }
        }
        else {
            caret.x = 0;
            caret.y = (lineHeight - textHeight) * 0.5;
        }

        scrollToPosition(caret);
        showCaret();

    };

    this.select = function () {
        this.selectRange(0, chars.length - 1);
    };

    this.selectWord = function (wordIndex) {
        var startIndex = chars.length;
        var endIndex = 0;
        for (var i = 0; i < chars.length; i++) {
            if (chars[i].wordIndex !== wordIndex) continue;
            if (i < startIndex)
                startIndex = i;
            if (i > endIndex)
                endIndex = i;
        }

        this.selectRange(startIndex, endIndex);
    };

    var drawSelectionRect = function (x, y, w, h) {
        self.selection.beginFill("0x" + selectedBackgroundColor.slice(1), 1);
        self.selection.moveTo(x, y);
        self.selection.lineTo(x + w, y);
        self.selection.lineTo(x + w, y + h);
        self.selection.lineTo(x, y + h);
        self.selection.endFill();
    };

    var updateSelectionGraphics = function () {
        var c1 = chars[selectionStart];
        if (c1 !== undefined) {
            var cx = c1.x,
                cy = c1.y,
                w = 0,
                h = textHeight,
                cl = c1.lineIndex;

            self.selection.clear();
            for (var i = selectionStart; i <= selectionEnd; i++) {
                var c = chars[i];
                if (c.lineIndex != cl) {
                    drawSelectionRect(cx, cy, w, h);
                    cx = c.x;
                    cy = c.y;
                    cl = c.lineIndex;
                    w = 0;
                }
                w += c.width;
            }
            drawSelectionRect(cx, cy, w, h);
            innerContainer.addChildAt(self.selection, 0);
        }
    };

    this.selectRange = function (startIndex, endIndex) {
        if (startIndex > -1 && endIndex > -1) {
            var start = Math.min(startIndex, endIndex, chars.length - 1);
            var end = Math.min(Math.max(startIndex, endIndex), chars.length - 1);
            if (start != selectionStart || end != selectionEnd) {
                hasSelection = true;
                this.selection.visible = true;
                selectionStart = start;
                selectionEnd = end;
                hideCaret();
                updateSelectionGraphics();
                updateSelectionColors();
            }
            this.focus();
        }
        else {
            self.clearSelection();
        }
    };

    this.clearSelection = function () {
        if (hasSelection) {
            //remove color
            hasSelection = false;
            this.selection.visible = false;
            selectionStart = -1;
            selectionEnd = -1;
            updateSelectionColors();
        }
    };
}

TextInput.prototype = Object.create(InputBase.prototype);
TextInput.prototype.constructor = TextInput;
module.exports = TextInput;

Object.defineProperties(TextInput.prototype, {
    value: {
        get: function () {
            return this._value;
        },
        set: function (val) {
            if (this.maxLength)
                val = val.slice(0, this.maxLength);

            if (this._value != val) {
                this._lastValue = this._value;
                this._value = val;
                this._dirtyText = true;
                this.update();
                this.emit("change");

            }
        }
    },
    text: {
        get: function () {
            return this.value;
        },
        set: function (val) {
            this.value = val;
        }
    }
});


/*
 * Features:
 * multiLine, shift selection, Mouse Selection, Cut, Copy, Paste, Delete, Backspace, Arrow navigation, tabIndex
 * 
 * Methods:
 * blur()
 * focus()
 * select() - selects all text
 * selectRange(startIndex, endIndex)
 * clearSelection() 
 * setCaretIndex(index) moves caret to index
 * 
 * 
 * Events:
 * "change"
 * "blur"
 * "blur"
 * "focus"
 * "focusChanged" param: [bool]focus
 *  
 * 
 */