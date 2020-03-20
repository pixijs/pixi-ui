import { Stage } from '../Stage';
import { Widget } from '../Widget';
import * as PIXI from 'pixi.js';

export abstract class Controller<T> extends PIXI.utils.EventEmitter
{
    stage: Stage;

    constructor(stage: Stage)
    {
        super();
        this.stage = stage;
    }

    abstract in(widget: T): any;

    abstract out(widget: T): any;
}

/**
 * A controller handles a stage-level state that can be held by wigets. For example,
 * `PUXI.FocusController` handles which widget is focused.
 *
 * @memberof PUXI
 * @class Controller
 */

/**
 * Enables the widget to enter the controller's state.
 *
 * @memberof PUXI.Controller#
 * @method in
 * @param {PUXI.Widget} widget
 */

/**
 * Disables the widget from the controller's state.
 *
 * @memberof PUXI.Controller#
 * @method out
 * @param {PUXI.Widget} widget
 */
