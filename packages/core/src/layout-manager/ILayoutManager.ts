import { IMeasurable } from '../IMeasurable';
import { WidgetGroup } from '../WidgetGroup';

export interface ILayoutManager extends IMeasurable
{
    onAttach(host: WidgetGroup): void;
    onDetach(): void;
    onLayout(): void;
}

/**
 * Represents a layout manager that can be attached to any widget group. A layout
 * manager handles the positions and dimensions of child widgets.
 *
 * @memberof PUXI
 * @interface
 */

/**
 * Attaches the layout manager to a widget. This is automatically done by `WidgetGroup#useLayout`.
 *
 * @memberof PUXI.ILayoutManager#
 * @method onAttach
 * @param {PUXI.WidgetGroup} host
 */

/**
 * Detaches the layout manager from a widget. This is done by `WidgetGroup#useLayout`. Do
 * not use this on your own.
 *
 * @memberof PUXI.ILayoutManager#
 * @method onDetach
 */

/**
 * Lays out the children of the layout's host. It assumes that the layout is attached.
 *
 * Contract: Between an `onMeasure` and `onLayout` call, it is expected that the children
 * of the widget-group have _not changed_. This prevents the layout's cache (if any)
 * from becoming invalidated.
 *
 * @memberof PUXI.ILayoutManager#
 * @method onLayout
 */
