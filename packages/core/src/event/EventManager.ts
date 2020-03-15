import { Widget } from '../Widget';

/**
 * An event manager handles the states related to certain events and can augment
 * widget interaction. For example, the click manager will hide clicks when
 * the object is dragging.
 *
 * @memberof PUXI
 * @class
 * @abstract
 */
export abstract class EventManager
{
    protected target: Widget;

    /**
     * @param {Widget} target
     */
    constructor(target: Widget)
    {
        this.target = target;
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
