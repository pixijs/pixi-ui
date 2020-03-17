import { FocusableWidget, IFocusableOptions } from './FocusableWidget';
import { ScrollWidget } from './ScrollWidget';
import * as PIXI from 'pixi.js';
import { LayoutOptions } from './layout-options';
import { DragManager } from './event/DragManager';

/**
 * @memberof PUXI
 * @interface
 */
interface ITextInputOptions extends IFocusableOptions
{
    multiLine?: boolean;
    style?: PIXI.TextStyle;
    background?: PIXI.Container;
    selectedColor?: string | number[];
    selectedBackgroundColor?: string;
    width?: number;
    height?: number;
    padding?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    tabIndex?: number;
    tabGroup?: number;
    maxLength?: number;
    caretWidth?: number;
    lineHeight?: number;
    value?: string;
}

// Dummy <input> element created for mobile keyboards
let mockDOMInput: any;

function initMockDOMInput(): void
{
    // create temp input (for mobile keyboard)
    if (typeof mockDOMInput === 'undefined')
    {
        mockDOMInput = document.createElement('INPUT');
        mockDOMInput.setAttribute('type', 'text');
        mockDOMInput.setAttribute('id', '_pui_tempInput');
        mockDOMInput.setAttribute('style', 'position:fixed; left:-10px; top:-10px; width:0px; height: 0px;');
        document.body.appendChild(mockDOMInput);
    }
}

/**
 * An UI text object
 *
 * @class
 * @extends PIXI.UI.InputBase
 * @memberof PIXI.UI
 */
export class TextInput extends FocusableWidget
{
    private options: ITextInputOptions;

    private _dirtyText: boolean;
    private _value: string;
    private _lastValue: string;

    private _lastWidth: number;
    private _lastHeight: number;

    private selection: PIXI.Graphics;
    private textContainer: ScrollWidget;

    public maxLength: number;

    private chars: any[];
    private multiLine: boolean;
    private color: string;
    private selectedColor: string;
    private selectedBackgroundColor: string;
    private tempText: PIXI.Text;
    private textHeight: number;
    private lineHeight: number;

    private caret: PIXI.Graphics;
    private caretInterval: NodeJS.Timeout;
    private si: number; // startIndex
    private sie: boolean; // startIndexEnd
    private ei: number; // endIndex
    private eie: boolean; // endIndexEnd
    private sp: PIXI.Point; // startposition
    private ds: PIXI.Point; // dragStart
    private de: PIXI.Point; // dragend
    private rdd: boolean; // Reverse drag direction
    private vrdd: boolean; // vertical Reverse drag direction

    private selectionStart: number;
    private selectionEnd: number;
    private hasSelection: boolean;
    private t: number; // timestamp
    private cc: number; // click counter
    private textLengthPX: number;
    private textHeightPX: number;
    private lineIndexMax: number;

    private ctrlDown: boolean;
    private shiftDown: boolean;
    private shiftKey: number;
    private ctrlKey: number;
    private cmdKey: number;

    private _sp: PIXI.Point;

    /**
     * @param {PUXI.ITextInputOptions} options
     * @param {string} options.value Text content
     * @param {boolean} [options.multiLine=false] Multiline input
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
    constructor(options: ITextInputOptions)
    {
        super(options);
        initMockDOMInput();

        this.options = options;

        this._dirtyText = true;
        this.maxLength = options.maxLength || 0;
        this._value = this._lastValue = options.value || '';

        if (this.maxLength)
        {
            this._value = this._value.slice(0, this.maxLength);
        }

        this.chars = [];
        this.multiLine = options.multiLine !== undefined ? options.multiLine : false;
        this.color = options.style && options.style.fill ? options.style.fill : '#000000';
        this.selectedColor = options.selectedColor || '#ffffff';
        this.selectedBackgroundColor = options.selectedBackgroundColor || '#318cfa';
        this.tempText = new PIXI.Text('1', options.style);
        this.textHeight = this.tempText.height;
        this.lineHeight = options.lineHeight || this.textHeight || this._height;

        this.tempText.destroy();

        // set cursor
        // this.container.cursor = "text";

        // selection graphics
        this.selection = new PIXI.Graphics();
        this.selection.visible = false;
        this.selection._startIndex = 0;
        this.selection._endIndex = 0;

        // caret graphics
        this.caret = new PIXI.Graphics();
        this.caret.visible = false;
        this.caret._index = 0;
        this.caret.lineStyle(options.caretWidth || 1, '#ffffff', 1);
        this.caret.moveTo(0, 0);
        this.caret.lineTo(0, this.textHeight);

        // var padding
        const paddingLeft = options.paddingLeft !== undefined ? options.paddingLeft : options.padding;
        const paddingRight = options.paddingRight !== undefined ? options.paddingRight : options.padding;
        const paddingBottom = options.paddingBottom !== undefined ? options.paddingBottom : options.padding;
        const paddingTop = options.paddingTop !== undefined ? options.paddingTop : options.padding;

        // insert text container (scrolling container)
        this.textContainer = new ScrollWidget({
            scrollX: !this.multiLine,
            scrollY: this.multiLine,
            dragScrolling: this.multiLine,
            expandMask: 2,
            softness: 0.2,
            overflowX: 40,
            overflowY: 40,
        }).setPadding(
            paddingLeft || 3,
            paddingTop || 3,
            paddingRight || 3,
            paddingBottom || 3,
        ).setLayoutOptions(
            new LayoutOptions(
                LayoutOptions.FILL_PARENT,
                LayoutOptions.FILL_PARENT,
            ),
        ) as ScrollWidget;

        this.addChild(this.textContainer);

        if (this.multiLine)
        {
            this._useNext = this._usePrev = false;
            this.textContainer.dragRestrictAxis = 'y';
            this.textContainer.dragThreshold = 5;
            this.dragRestrictAxis = 'x';
            this.dragThreshold = 5;
        }

        // selection Vars
        this.sp = new PIXI.Point(); // startposition
        this._sp = new PIXI.Point();
        this.ds = new PIXI.Point(); // dragStart
        this.de = new PIXI.Point(); // dragend
        this.rdd = false; // Reverse drag direction
        this.vrdd = false; // vertical Reverse drag direction
        this.selectionStart = -1;
        this.selectionEnd = -1;
        this.hasSelection = false;
        this.t = performance.now(); // timestamp
        this.cc = 0; // click counter
        this.textLengthPX = 0;
        this.textHeightPX = 0;
        this.lineIndexMax = 0;
        this.ctrlDown = false;
        this.shiftDown = false;
        this.shiftKey = 16;
        this.ctrlKey = 17;
        this.cmdKey = 91;

        this.setupDrag();
    }

    setupDrag(): void
    {
        const event = new DragManager(this);

        event.onPress = (e, mouseDown): void =>
        {
            if (mouseDown)
            {
                const timeSinceLast = performance.now() - this.t;

                this.t = performance.now();
                if (timeSinceLast < 250)
                {
                    this.cc++;
                    if (this.cc > 1)
                    {
                        this.select();
                    }
                    else
                    {
                        this.innerContainer.toLocal(this.sp, undefined, this.ds, true);
                        this.updateClosestIndex(this.ds, true);
                        const c = this.chars[this.si];

                        if (c)
                        {
                            if (c.wordIndex != -1)
                            {
                                this.selectWord(c.wordIndex);
                            }
                            else
                            {
                                this.selectRange(this.si, this.si);
                            }
                        }
                    }
                }
                else
                {
                    this.cc = 0;
                    this.sp.copyFrom(e.data.global);
                    this.innerContainer.toLocal(this.sp, undefined, this.ds, true);

                    if (this.chars.length)
                    {
                        this.updateClosestIndex(this.ds, true);
                        this.setCaretIndex(this.sie ? this.si + 1 : this.si);
                    }
                }
            }
            e.data.originalEvent.preventDefault();
        };

        event.onDragMove = (e, offset: PIXI.Point): void =>
        {
            if (!this.chars.length || !this._isFocused)
            {
                return;
            }

            this.de.x = this.sp.x + offset.x;
            this.de.y = this.sp.y + offset.y;
            this.innerContainer.toLocal(this.de, undefined, this.de, true);
            this.updateClosestIndex(this.de, false);

            if (this.si < this.ei)
            {
                this.selectRange(this.sie ? this.si + 1 : this.si, this.eie ? this.ei : this.ei - 1);
                this.caret._index = this.eie ? this.ei : this.ei - 1;
            }
            else if (this.si > this.ei)
            {
                this.selectRange(this.ei, this.sie ? this.si : this.si - 1);
                this.caret._index = this.ei;
            }
            else if (this.sie === this.eie)
            {
                this.setCaretIndex(this.sie ? this.si + 1 : this.si);
            }
            else
            {
                this.selectRange(this.si, this.ei);
                this.caret._index = this.ei;
            }

            this.caret._forward = this.si <= this.ei;
            this.caret._down = offset.y > 0;

            this.scrollToPosition(this.de);
        };
    }

    private get innerContainer(): PIXI.Container
    {
        return this.textContainer.innerContainer.insetContainer;
    }

    update(): void
    {
        if (this.width !== this._lastWidth)
        {
            this._lastWidth = this._width;

            if (this.multiLine)
            {
                this.updateText();

                if (this.caret.visible)
                {
                    this.setCaretIndex(this.caret._index);
                }
                if (this.hasSelection)
                {
                    this.updateSelectionGraphics();
                }
            }
        }

        // update text
        if (this._dirtyText)
        {
            this.updateText();
            this._dirtyText = false;
        }
    }

    updateText(): void
    {
        this.textLengthPX = 0;
        this.textHeightPX = 0;
        this.lineIndexMax = 0;

        let lineIndex = 0;
        const length = this._value.length;
        let x = 0;
        let y = (this.lineHeight - this.textHeight) * 0.5;
        let i = 0;

        // destroy excess chars
        if (this.chars.length > length)
        {
            for (i = this.chars.length - 1; i >= length; i--)
            {
                this.innerContainer.removeChild(this.chars[i]);
                this.chars[i].destroy();
            }

            this.chars.splice(length, this.chars.length - length);
        }

        // update and add chars
        let whitespace = false;
        let newline = false;
        let wordIndex = 0;
        let lastWordIndex = -1;
        let wrap = false;

        for (i = 0; i < this._value.length; i++)
        {
            if (whitespace || newline)
            {
                lastWordIndex = i;
                wordIndex++;
            }

            let c = this._value[i];

            whitespace = c === ' ';
            newline = c === '\n';

            if (newline)
            { // newline "hack". webgl render errors if \n is passed to text
                c = '';
            }

            let charText = this.chars[i];

            if (!charText)
            {
                charText = new PIXI.Text(c, this.options.style);
                this.innerContainer.addChild(charText);
                this.chars.push(charText);
            }
            else
            {
                charText.text = c;
            }

            charText.scale.x = newline ? 0 : 1;
            charText.wrapped = wrap;
            wrap = false;

            if (newline || (this.multiLine && x + charText.width >= this._width - this.paddingLeft - this.paddingRight))
            {
                lineIndex++;
                x = 0;
                y += this.lineHeight;

                if (lastWordIndex !== -1 && !newline)
                {
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

            if (x > this.textLengthPX)
            {
                this.textLengthPX = x;
            }
            if (y > this.textHeightPX)
            {
                this.textHeightPX = y;
            }
        }

        this.lineIndexMax = lineIndex;

        // put caret on top
        this.innerContainer.addChild(this.caret);

        // recache
        if (this.innerContainer.cacheAsBitmap)
        {
            this.innerContainer.cacheAsBitmap = false;
            this.innerContainer.cacheAsBitmap = true;
        }

        this.textContainer.update();
    }

    updateClosestIndex(point: PIXI.Point, start: boolean): void
    {
        let currentDistX = 99999;
        let currentIndex = -1;
        let atEnd = false;

        let closestLineIndex = 0;

        if (this.lineIndexMax > 0)
        {
            closestLineIndex = Math.max(0, Math.min(
                this.lineIndexMax,
                Math.floor(point.y / this.lineHeight)));
        }

        for (let i = 0; i < this.chars.length; i++)
        {
            const char = this.chars[i];

            if (char.lineIndex !== closestLineIndex)
            {
                continue;
            }

            const distX = Math.abs(point.x - (char.x + (char.width * 0.5)));

            if (distX < currentDistX)
            {
                currentDistX = distX;
                currentIndex = i;
                atEnd = point.x > char.x + (char.width * 0.5);
            }
        }

        if (start)
        {
            this.si = currentIndex;
            this.sie = atEnd;
        }
        else
        {
            this.ei = currentIndex;
            this.eie = atEnd;
        }
    }

    deleteSelection(): boolean
    {
        if (this.hasSelection)
        {
            this.value = this.value.slice(0, this.selectionStart) + this.value.slice(this.selectionEnd + 1);
            this.setCaretIndex(this.selectionStart);

            return true;
        }

        return false;
    }

    updateSelectionColors(): void
    {
        // Color charecters
        for (let i = 0; i < this.chars.length; i++)
        {
            if (i >= this.selectionStart && i <= this.selectionEnd)
            {
                this.chars[i].style.fill = this.selectedColor;
            }
            else
            {
                this.chars[i].style.fill = this.color;
            }
        }
    }

    scrollToPosition(pos: PIXI.Point): void
    {
        this._sp.x = pos.x;
        this._sp.y = pos.y;

        if (this.multiLine && this._sp.y >= this.lineHeight)
        {
            this._sp.y += this.lineHeight;
        }

        this.textContainer.focusPosition(this._sp);
    }

    resetScrollPosition(): void
    {
        this._sp.set(0, 0);
        this.textContainer.focusPosition(this._sp);
    }

    hideCaret(): void
    {
        this.caret.visible = false;
        clearInterval(this.caretInterval);
    }

    showCaret(): void
    {
        this.clearSelection();
        clearInterval(this.caretInterval);

        this.caret.alpha = 1;
        this.caret.visible = true;

        this.caretInterval = setInterval(() =>
        {
            this.caret.alpha = this.caret.alpha === 0 ? 1 : 0;
        }, 500);
    }

    insertTextAtCaret(c: string): void
    {
        if (!this.multiLine && c.indexOf('\n') !== -1)
        {
            c = c.replace(/\n/g, '');
        }

        if (this.hasSelection)
        {
            this.deleteSelection();
        }

        if (!this.maxLength || this.chars.length < this.maxLength)
        {
            if (this.caret._atEnd)
            {
                this.valueEvent += c;
                this.setCaretIndex(this.chars.length);
            }
            else
            {
                const index = Math.min(this.chars.length - 1, this.caret._index);

                this.valueEvent = this.value.slice(0, index) + c + this.value.slice(index);
                this.setCaretIndex(index + c.length);
            }
        }
    }

    onKeyDown = (e): void =>
    {
        if (e.which === this.ctrlKey || e.which === this.cmdKey)
        {
            this.ctrlDown = true;
        }
        if (e.which === this.shiftKey)
        {
            this.shiftDown = true;
        }

        // FocusableWidget.onKeyDownImpl should've been called before this.

        if (e.defaultPrevented)
        {
            return;
        }

        if (e.which === 13)
        { // enter
            this.insertTextAtCaret('\n');
            e.preventDefault();

            return;
        }

        if (this.ctrlDown)
        {
            // Handle Ctrl+<?> commands

            if (e.which === 65)
            {
                // Ctrl+A (Select all)
                this.select();
                e.preventDefault();

                return;
            }
            else if (e.which === 90)
            {
                // Ctrl+Z (Undo)
                if (this.value != this._lastValue)
                {
                    this.valueEvent = this._lastValue;
                }

                this.setCaretIndex(this._lastValue.length + 1);
                e.preventDefault();

                return;
            }
        }
        if (e.which === 8)
        {
            // Handle backspace
            if (!this.deleteSelection())
            {
                if (this.caret._index > 0 || (this.chars.length === 1 && this.caret._atEnd))
                {
                    if (this.caret._atEnd)
                    {
                        this.valueEvent = this.value.slice(0, this.chars.length - 1);
                        this.setCaretIndex(this.caret._index);
                    }
                    else
                    {
                        this.valueEvent = this.value.slice(0, this.caret._index - 1) + this.value.slice(this.caret._index);
                        this.setCaretIndex(this.caret._index - 1);
                    }
                }
            }

            e.preventDefault();

            return;
        }

        if (e.which === 46)
        {
            // Delete selection
            if (!this.deleteSelection())
            {
                if (!this.caret._atEnd)
                {
                    this.valueEvent = this.value.slice(0, this.caret._index) + this.value.slice(this.caret._index + 1);
                    this.setCaretIndex(this.caret._index);
                }
            }

            e.preventDefault();

            return;
        }
        else if (e.which === 37 || e.which === 39)
        {
            this.rdd = e.which === 37;

            if (this.shiftDown)
            {
                if (this.hasSelection)
                {
                    const caretAtStart = this.selectionStart === this.caret._index;

                    if (caretAtStart)
                    {
                        if (this.selectionStart === this.selectionEnd && this.rdd === this.caret._forward)
                        {
                            this.setCaretIndex(this.caret._forward ? this.caret._index : this.caret._index + 1);
                        }
                        else
                        {
                            const startindex = this.rdd ? this.caret._index - 1 : this.caret._index + 1;

                            this.selectRange(startindex, this.selectionEnd);
                            this.caret._index = Math.min(this.chars.length - 1, Math.max(0, startindex));
                        }
                    }
                    else
                    {
                        const endIndex = this.rdd ? this.caret._index - 1 : this.caret._index + 1;

                        this.selectRange(this.selectionStart, endIndex);
                        this.caret._index = Math.min(this.chars.length - 1, Math.max(0, endIndex));
                    }
                }
                else
                {
                    const _i = this.caret._atEnd ? this.caret._index + 1 : this.caret._index;
                    const selectIndex = this.rdd ? _i - 1 : _i;

                    this.selectRange(selectIndex, selectIndex);
                    this.caret._index = selectIndex;
                    this.caret._forward = !rdd;
                }
            }
            else
            {
                // Navigation
                // eslint-disable-next-line no-lonely-if
                if (this.hasSelection)
                {
                    this.setCaretIndex(this.rdd ? this.selectionStart : this.selectionEnd + 1);
                }
                else
                {
                    this.setCaretIndex(this.caret._index + (this.rdd ? this.caret._atEnd ? 0 : -1 : 1));
                }
            }

            e.preventDefault();

            return;
        }
        else if (this.multiLine && (e.which === 38 || e.which === 40))
        {
            this.vrdd = e.which === 38;

            if (this.shiftDown)
            {
                if (this.hasSelection)
                {
                    this.de.y = Math.max(0, Math.min(
                        this.textHeightPX,
                        this.de.y + (this.vrdd ? -this.lineHeight : this.lineHeight)));
                    this.updateClosestIndex(this.de, false);

                    // console.log(si, ei);
                    if (Math.abs(this.si - this.ei) <= 1)
                    {
                    // console.log(si, ei);
                        this.setCaretIndex(this.sie ? this.si + 1 : this.si);
                    }
                    else
                    {
                        this.caret._index = (this.eie ? this.ei + 1 : this.ei) + (this.caret._down ? -1 : 0);
                        this.selectRange(this.caret._down ? this.si : this.si - 1, this.caret._index);
                    }
                }
                else
                {
                    this.si = this.caret._index;
                    this.sie = false;
                    this.de.copyFrom(this.caret);
                    this.de.y = Math.max(0, Math.min(
                        this.textHeightPX,
                        this.de.y + (this.vrdd ? -this.lineHeight : this.lineHeight)));
                    this.updateClosestIndex(this.de, false);

                    this.caret._index = (this.eie ? this.ei + 1 : ei) - (this.vrdd ? 0 : 1);
                    this.selectRange(this.vrdd ? this.si - 1 : this.si, this.caret._index);
                    this.caret._down = !this.vrdd;
                }
            }
            else if (this.hasSelection)
            {
                this.setCaretIndex(this.vrdd ? this.selectionStart : this.selectionEnd + 1);
            }
            else
            {
                this.ds.copyFrom(this.caret);
                this.ds.y += this.vrdd ? -this.lineHeight : this.lineHeight;
                this.ds.x += 1;
                this.updateClosestIndex(this.ds, true);
                this.setCaretIndex(this.sie ? this.si + 1 : this.si);
            }
            e.preventDefault();

            return;
        }
    };

    keyUpEvent = (e): void =>
    {
        if (e.which === this.ctrlKey || e.which === this.cmdKey) this.ctrlDown = false;
        if (e.which === this.shiftKey) this.shiftDown = false;

        this.emit('keyup', e);

        if (e.defaultPrevented)
        { return; }
    };

    copyEvent = (e): void =>
    {
        this.emit('copy', e);

        if (e.defaultPrevented)
        { return; }

        if (this.hasSelection)
        {
            const clipboardData = e.clipboardData || window.clipboardData;

            clipboardData.setData('Text', this.value.slice(this.selectionStart, this.selectionEnd + 1));
        }

        e.preventDefault();
    };

    cutEvent = (e): void =>
    {
        this.emit('cut', e);

        if (e.defaultPrevented)
        { return; }

        if (this.hasSelection)
        {
            this.copyEvent(e);
            this.deleteSelection();
        }

        e.preventDefault();
    };

     pasteEvent = (e): void =>
     {
         this.emit('paste', e);

         if (e.defaultPrevented)
         { return; }

         const clipboardData = e.clipboardData || window.clipboardData;

         this.insertTextAtCaret(clipboardData.getData('Text'));
         e.preventDefault();
     };

    inputEvent = (e): void =>
    {
        const c = mockDOMInput.value;

        if (c.length)
        {
            this.insertTextAtCaret(c);
            mockDOMInput.value = '';
        }

        e.preventDefault();
    };

    inputBlurEvent = (e): void =>
    {
        this.blur();
    };

    public focus = (): void =>
    {
        if (!this._isFocused)
        {
            super.focus();

            const l = `${this.contentContainer.worldTransform.tx}px`;
            const t = `${this.contentContainer.worldTransform.ty}px`;
            const h = `${this.contentContainer.height}px`;
            const w = `${this.contentContainer.width}px`;

            mockDOMInput.setAttribute('style', `position:fixed; left:${l}; top:${t}; height:${h}; width:${w};`);
            mockDOMInput.value = '';
            mockDOMInput.focus();
            mockDOMInput.setAttribute('style', 'position:fixed; left:-10px; top:-10px; width:0px; height: 0px;');

            this.innerContainer.cacheAsBitmap = false;
            mockDOMInput.addEventListener('blur', this.inputBlurEvent, false);
            document.addEventListener('keydown', this.onKeyDown, false);
            document.addEventListener('keyup', this.keyUpEvent, false);
            document.addEventListener('paste', this.pasteEvent, false);
            document.addEventListener('copy', this.copyEvent, false);
            document.addEventListener('cut', this.cutEvent, false);
            mockDOMInput.addEventListener('input', this.inputEvent, false);

            setTimeout(() =>
            {
                if (!this.caret.visible && !this.selection.visible && !this.multiLine)
                {
                    this.setCaretIndex(this.chars.length);
                }
            }, 0);
        }
    };

    public blur = (): void =>
    {
        if (this._isFocused)
        {
            super.blur();
            this.ctrlDown = false;
            this.shiftDown = false;

            this.hideCaret();
            this.clearSelection();

            if (this.chars.length > 1)
            {
                this.innerContainer.cacheAsBitmap = true;
            }

            mockDOMInput.removeEventListener('blur', this.inputBlurEvent);
            document.removeEventListener('keydown', this.onKeyDown);
            document.removeEventListener('keyup', this.keyUpEvent);
            document.removeEventListener('paste', this.pasteEvent);
            document.removeEventListener('copy', this.copyEvent);
            document.removeEventListener('cut', this.cutEvent);
            mockDOMInput.removeEventListener('input', this.inputEvent);
            mockDOMInput.blur();
        }

        if (!this.multiLine)
        {
            this.resetScrollPosition();
        }
    };

    setCaretIndex = (index: number): void =>
    {
        this.caret._atEnd = index >= this.chars.length;
        this.caret._index = Math.max(0, Math.min(this.chars.length - 1, index));

        if (this.chars.length && index > 0)
        {
            let i = Math.max(0, Math.min(index, this.chars.length - 1));
            let c = this.chars[i];

            if (c && c.wrapped)
            {
                this.caret.x = c.x;
                this.caret.y = c.y;
            }
            else
            {
                i = Math.max(0, Math.min(index - 1, this.chars.length - 1));
                c = this.chars[i];
                this.caret.x = this.chars[i].x + this.chars[i].width;
                this.caret.y = (this.chars[i].lineIndex * this.lineHeight) + (this.lineHeight - this.textHeight) * 0.5;
            }
        }
        else
        {
            this.caret.x = 0;
            this.caret.y = (this.lineHeight - this.textHeight) * 0.5;
        }

        this.scrollToPosition(this.caret);
        this.showCaret();
    };

    select = (): void =>
    {
        this.selectRange(0, this.chars.length - 1);
    };

    selectWord = (wordIndex: number): void =>
    {
        let startIndex = this.chars.length;
        let endIndex = 0;

        for (let i = 0; i < this.chars.length; i++)
        {
            if (this.chars[i].wordIndex !== wordIndex)
            {
                continue;
            }

            if (i < startIndex)
            {
                startIndex = i;
            }
            if (i > endIndex)
            {
                endIndex = i;
            }
        }

        this.selectRange(startIndex, endIndex);
    };

    selectRange = (startIndex: number, endIndex: number): void =>
    {
        if (startIndex > -1 && endIndex > -1)
        {
            const start = Math.min(startIndex, endIndex, this.chars.length - 1);
            const end = Math.min(Math.max(startIndex, endIndex), this.chars.length - 1);

            if (start !== this.selectionStart || end !== this.selectionEnd)
            {
                this.hasSelection = true;
                this.selection.visible = true;
                this.selectionStart = start;
                this.selectionEnd = end;

                this.hideCaret();
                this.updateSelectionGraphics();
                this.updateSelectionColors();
            }

            this.focus();
        }
        else
        {
            this.clearSelection();
        }
    };

    clearSelection = (): void =>
    {
        if (this.hasSelection)
        {
            // Remove color
            this.hasSelection = false;
            this.selection.visible = false;
            this.selectionStart = -1;
            this.selectionEnd = -1;
            this.updateSelectionColors();
        }
    };

    updateSelectionGraphics = () =>
    {
        const c1 = this.chars[this.selectionStart];

        if (c1 !== undefined)
        {
            let cx = c1.x;
            let cy = c1.y;
            let w = 0;
            const h = this.textHeight;
            let cl = c1.lineIndex;

            this.selection.clear();
            for (let i = this.selectionStart; i <= this.selectionEnd; i++)
            {
                const c = this.chars[i];

                if (c.lineIndex != cl)
                {
                    this.drawSelectionRect(cx, cy, w, h);
                    cx = c.x;
                    cy = c.y;
                    cl = c.lineIndex;
                    w = 0;
                }

                w += c.width;
            }

            this.drawSelectionRect(cx, cy, w, h);
            this.innerContainer.addChildAt(this.selection, 0);
        }
    };

    drawSelectionRect = (x: number, y: number, w: number, h: number): void =>
    {
        this.selection.beginFill(`0x${this.selectedBackgroundColor.slice(1)}`, 1);
        this.selection.moveTo(x, y);
        this.selection.lineTo(x + w, y);
        this.selection.lineTo(x + w, y + h);
        this.selection.lineTo(x, y + h);
        this.selection.endFill();
    };

    get valueEvent(): string
    {
        return this._value;
    }
    set valueEvent(val: string)
    {
        if (this.maxLength)
        {
            val = val.slice(0, this.maxLength);
        }

        if (this._value != val)
        {
            this.value = val;
            this.emit('change');
        }
    }

    get value(): string
    {
        return this._value;
    }
    set value(val: string)
    {
        if (this.maxLength)
        {
            val = val.slice(0, this.maxLength);
        }

        if (this._value != val)
        {
            this._lastValue = this._value;
            this._value = val;
            this._dirtyText = true;
            this.update();
        }
    }

    get text(): string
    {
        return this.value;
    }
    set text(value: string)
    {
        this.value = value;
    }
}

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
 * "keyup" param: Event
 * "keydown" param: Event
 * "copy" param: Event
 * "paste" param: Event
 * "cut" param: Event
 * "keyup" param: Event
 */
