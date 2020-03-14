import { IMeasurable } from '../IMeasurable';
import { WidgetGroup } from '../WidgetGroup';

/**
 * Represents a layout manager that can be attached to any widget group. A layout
 * manager handles the positions and dimensions of child widgets.
 *
 * @namespace PUXI
 * @interface
 */
export interface ILayoutManager extends IMeasurable
{
    onAttach(host: WidgetGroup);

    onDetach();

    /**
     * Lays out the children of the parent.
     * @param parent
     */
    onLayout();
}
