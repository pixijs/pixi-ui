import { Widget } from '../Widget';

/**
 * An event manager handles the states related to certain events and can augment
 * widget interaction. For example, the click manager will hide clicks when
 * the object is dragging.
 *
 * Event managers are lifecycle objects - they can start/stop. Their constructor
 * will always accept one argument - the widget. Other settings can be applied before
 * `startEvent`.
 *
 * Ideally, you should access event managers _after_ your widget has initialized. This is
 * because it may depend on the widget's stage being assigned.
 *
 * @memberof PUXI
 * @class
 * @abstract
 */
export abstract class EventManager
{
    protected target: Widget;
    protected isEnabled: boolean;

    /**
     * @param {Widget} target
     */
    constructor(target: Widget)
    {
        this.target = target;
        this.isEnabled = false;// use to track start/stopEvent
    }

    /**
     * @returns {Widget}
     */
    getTarget(): Widget
    {
        return this.target;
    }

    /**
     * Registers the interaction event listeners that will emit corresponding events
     * on the target widget.
     */
    abstract startEvent(): any;

    /**
     * Unregisters any event listeners and releases any resources held. This should
     * revert all changes made by `startEvent`.
     */
    abstract stopEvent(): any;
}
