import { FocusableWidget, IInputBaseOptions } from './FocusableWidget';
import { ClickManager } from './event/ClickManager';
import { InputController } from './event/InputController';
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
 * A checkbox is a button can be selected (checked). It has a on/off state that
 * can be controlled by the user.
 *
 * When used in a checkbox group, the group will control whether the checkbox can
 * be selected or not.
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.FocusableWidget
 */
export class CheckBox extends FocusableWidget
{
    private _checked: boolean;
    private _value: string;
    private checkGroup: any;

    private checkmark: InteractiveGroup;

    /**
     * @param {PUXI.ICheckBoxOptions} options
     * @param [options.checked=false] {bool} is checked
     * @param options.background {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as background for CheckBox
     * @param options.checkmark {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as checkmark for CheckBox
     * @param [options.checkgroup=null] {String} CheckGroup name
     * @param options.value {String} mostly used along with checkgroup
     * @param [options.tabIndex=0] {Number} input tab index
     * @param [options.tabGroup=0] {Number|String} input tab group
     */
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
        this.addChild(this.checkmark);

        this.contentContainer.buttonMode = true;

        if (this.checkGroup !== null)
        {
            InputController.registrerCheckGroup(this);
        }
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

    initialize(): void
    {
        super.initialize();

        const clickMgr = (this.eventBroker.click as ClickManager);

        clickMgr.onHover = (_, over): void =>
        {
            this.emit('hover', over);
        };

        clickMgr.onPress = (e, isPressed): void =>
        {
            if (isPressed)
            {
                this.focus();
                e.data.originalEvent.preventDefault();
            }

            this.emit('press', isPressed);
        };

        clickMgr.onClick = (): void =>
        {
            this.click();
        };
    }

    protected change = (val: boolean): void =>
    {
        if (this.checkmark)
        {
            this.checkmark.alpha = val ? 1 : 0;
        }
    };

    protected click = (): void =>
    {
        this.emit('click');

        if (this.checkGroup !== null && this.checked)
        {
            return;
        }

        this.checked = !this.checked;
        this.emit('changed', this.checked);
    };

    focus = (): void =>
    {
        if (!this._focused)
        {
            super.focus();
            // document.addEventListener("keydown", keyDownEvent, false);
        }
    };

    blur = (): void =>
    {
        if (this._focused)
        {
            super.blur();
            // document.removeEventListener("keydown", keyDownEvent);
        }
    };

    /**
     * This event is fired when the user's cursor hovers over this checkbox.
     * @event hover
     */

    /**
     * This event is fired when the user clicks on the checkbox, regardless of whether
     * the checkbox was selected or deselected.
     * @event click
     */

    /**
     * This event is fired when the user selects/deselects the checkbox, i.e. the "value"
     * of the checkbox changes. This is also fired when setting the `checked` property
     * directly.
     * @event changed
     * @param {boolean} checked - whether the checkbox is checked
     */
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
