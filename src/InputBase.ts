import { UIBase } from './UIBase';
import { InputController } from './Interaction/InputController';

/**
 * Represents a view that can accept any form of input. It can gain and loose focus.
 *
 * @class
 * @extends PIXI.UI.UIBase
 * @memberof PIXI.UI
 * @param width {number} passed to uibase
 * @param height {number} passed to uibase
 * @param tabIndex {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as background for input
 */
export abstract class InputBase extends UIBase
{
    _focused: boolean;
    _useTab: boolean;
    _usePrev: boolean;
    _useNext: boolean;

    __down: boolean;

    constructor(width: number, height: number, tabIndex: number, tabGroup: any)
    {
        super(width, height);

        this._focused = false;
        this._useTab = this._usePrev = this._useNext = true;
        this.container.interactive = true;
        InputController.registrer(this, tabIndex, tabGroup);

        this.container.on('pointerdown', (e) =>
        {
            this.focus();
            this.__down = true;
        });

        this.container.on('pointerup', (e) =>
        {
            this.__down = false;
        });

        this.container.on('pointerupoutside', (e) =>
        {
            this.__down = false;
        });
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
            document.addEventListener('keydown', this.keyDownEvent);
        }
    };

    private _clearEvents = (): void =>
    {
        if (this.stage !== null)
        {
            this.stage.off('pointerdown', this.documentMouseDown);
            document.removeEventListener('keydown', this.keyDownEvent);
        }
    };
}
