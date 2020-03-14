import { InputBase, IInputBaseOptions } from './InputBase';
import { ClickEvent } from './Interaction/ClickEvent';
import { InputController } from './Interaction/InputController';
import { InteractiveGroup } from './InteractiveGroup';
import { LayoutOptions, FastLayoutOptions } from './layout-options';

interface ICheckBoxOptions extends IInputBaseOptions
{
    checked?: boolean;
    background: PIXI.Container;
    checkmark?: PIXI.Container;
    checkgroup?: any;
    value?: string;
    tabIndex?: number;
    tabGroup?: number;
}

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
export class CheckBox extends InputBase
{
    private _checked: boolean;
    private _value: string;
    private checkGroup: any;

    private checkmark: InteractiveGroup;

    change: (val: boolean) => void;
    click: () => void;

    constructor(options: ICheckBoxOptions)
    {
        super(options);

        this._checked = options.checked !== undefined ? options.checked : false;
        this._value = options.value || '';
        this.checkGroup = options.checkgroup || null;

        this.checkmark = new InteractiveGroup();
        this.checkmark.contentContainer.addChild(options.checkmark);
        this.checkmark.setLayoutOptions(
            new FastLayoutOptions(
                LayoutOptions.WRAP_CONTENT,
                LayoutOptions.WRAP_CONTENT,
                0.5,
                0.5,
                FastLayoutOptions.CENTER_ANCHOR),
        );
        this.checkmark.alpha = this._checked ? 1 : 0;

        this.contentContainer.buttonMode = true;

        if (this.checkGroup !== null)
        {
            InputController.registrerCheckGroup(this);
        }

        // var keyDownEvent = function (e) {
        //    if (e.which === 32) { //space
        //        self.click();
        //    }
        // };

        const clickEvent = new ClickEvent(this);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        clickEvent.onHover = (e, over): void =>
        {
            this.emit('hover', over);
        };

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        clickEvent.onPress = (e, isPressed): void =>
        {
            if (isPressed)
            {
                this.focus();
                e.data.originalEvent.preventDefault();
            }

            this.emit('press', isPressed);
        };

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        clickEvent.onClick = (e): void =>
        {
            this.click();
        };

        this.change = (val): void =>
        {
            if (this.checkmark)
            {
                this.checkmark.alpha = val ? 1 : 0;
            }
        };

        this.click = (): void =>
        {
            this.emit('click');

            if (this.checkGroup !== null && this.checked)
            {
                return;
            }

            this.checked = !this.checked;
            this.emit('change', this.checked);
        };

        this.focus = (): void =>
        {
            if (!this._focused)
            {
                super.focus();
                // document.addEventListener("keydown", keyDownEvent, false);
            }
        };

        this.blur = (): void =>
        {
            if (this._focused)
            {
                super.blur();
                // document.removeEventListener("keydown", keyDownEvent);
            }
        };
    }

    update(): void
    {
        // No need for updating
    }

    get checked(): boolean
    {
        return this._checked;
    }
    set checked(val: boolean)
    {
        if (val !== this._checked)
        {
            if (this.checkGroup !== null && val)
            {
                InputController.updateCheckGroupSelected(this);
            }

            this._checked = val;
            this.change(val);
        }
    }

    get value(): string
    {
        return this._value;
    }
    set value(val: string)
    {
        this._value = val;

        if (this.checked)
        {
            InputController.updateCheckGroupSelected(this);
        }
    }

    get selectedValue(): string
    {
        return InputController.getCheckGroupSelectedValue(this.checkGroup);
    }
    set selectedValue(val: string)
    {
        InputController.setCheckGroupSelectedValue(this.checkGroup, val);
    }
}

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
