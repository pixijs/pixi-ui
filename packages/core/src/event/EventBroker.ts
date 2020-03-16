import { ClickManager } from './ClickManager';
import { DragManager } from './DragManager';
import { EventManager } from './EventManager';
import { Widget } from '../Widget';

/**
 * The event brokers allows you to access event managers without manually assigning
 * them to a widget. By default, the click (`PUXI.ClickManager`), dnd (`PUXI.DragManager`)
 * are defined. You can add event managers for all (new) widgets by adding an entry to
 * `EventBroker.MANAGER_MAP`.
 *
 * @memberof PUXI
 * @class
 */
export class EventBroker
{
    [key: string]: EventManager | Widget;

    constructor(target: Widget)
    {
        this.target = target;

        for (const mgr of Object.keys(EventBroker.MANAGER_MAP))
        {
            Object.defineProperty(
                this,
                mgr,
                {
                    get(): EventManager
                    {
                        if (!this[`_${mgr}`])
                        {
                            this[`_${mgr}`] = new EventBroker.MANAGER_MAP[mgr](this.target);
                        }

                        return this[`_${mgr}`];
                    },
                },
            );
        }
    }

  static MANAGER_MAP = {
      click: ClickManager,
      dnd: DragManager,
  };
}
