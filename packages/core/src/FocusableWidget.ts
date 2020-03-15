import { InputController } from './event/InputController';
import { WidgetGroup } from './WidgetGroup';

/**
 * @namespace PUXI
 * @interface
 */
export interface IInputBaseOptions
{
    background?: PIXI.Container;
    tabIndex?: number;
    tabGroup?: any;
}

/**
 * Represents a view that can gain or loose focus. It is primarily subclassed by
 * input/form widgets.
 *
 * Generally, it is a good idea not use layouts on these types of widgets.
 *
 * @class
 * @extends PUXI.Widget
 * @memberof PUXI
 */
export abstract class FocusableWidget extends WidgetGroup
{
    _focused: boolean;
    _useTab: boolean;
    _usePrev: boolean;
    _useNext: boolean;

    __down: boolean;

    /**
     * @param {PUXI.IInputBaseOptions} options
     * @param {PIXI.Container}[options.background]
     * @param {number}[tabIndex]
     * @param {any}[tabGroup]
     */
    constructor(options: IInputBaseOptions = {})
    {
        super();

        if (options.background)
        {
            super.setBackground(options.background);
        }

        const { tabIndex, tabGroup } = options;

        this._focused = false;
        this._useTab = this._usePrev = this._useNext = true;
        this.interactive = true;
        InputController.registrer(this, tabIndex || 0, tabGroup || 0);

        this.insetContainer.on('pointerdown', () =>
        {
            this.focus();
            this.__down = true;
        });
        this.insetContainer.on('pointerup', () => { this.__down = false; });
        this.insetContainer.on('pointerupoutside', () => { this.__down = false; });
    }

    blur(): void
    {
        if (this._focused)
        {
            InputController.clear();
            this._focused = false;
            this._clearEvents();
            this.emit('focusChanged', false);
            this.emit('blur');
        }
    }

    focus(): void
    {
        if (!this._focused)
        {
            this._focused = true;
            this._bindEvents();
            InputController.set(this);
            this.emit('focusChanged', true);
            this.emit('focus');
        }
    }

    protected keyDownEvent = (e: any): void =>
    {
        if (e.which === 9)
        {
            if (this._useTab)
            {
                InputController.fireTab();
                e.preventDefault();
            }
        }
        else if (e.which === 38)
        {
            if (this._usePrev)
            {
                InputController.firePrev();
                e.preventDefault();
            }
        }
        else if (e.which === 40)
        {
            if (this._useNext)
            {
                InputController.fireNext();
                e.preventDefault();
            }
        }

        this.emit('keydown');
    };

    private documentMouseDown = (): void =>
    {
        if (!this.__down)
        {
            this.blur();
        }
    };

    private _bindEvents = (): void =>
    {
        if (this.stage !== null)
        {
            this.stage.on('pointerdown', this.documentMouseDown);
        }

        document.addEventListener('keydown', this.keyDownEvent);
    };

    private _clearEvents = (): void =>
    {
        if (this.stage !== null)
        {
            this.stage.off('pointerdown', this.documentMouseDown);
        }

        document.removeEventListener('keydown', this.keyDownEvent);
    };
}
