import { Controller } from './Controller';
import { Stage } from '../Stage';
import { FocusableWidget } from '../FocusableWidget';

export type TabGroup = string;

/**
 * Pressing tab on a focused widget will make the next widget its tab group
 * focused. If no tab group is specified for a focusable widget, then it
 * has the `'default'` tab group.
 *
 * @memberof PUXI
 * @typedef {string} TabGroup
 */

/**
 * @memberof PUXI
 * @class
 * @extends PUXI.Controller
 */
export class FocusController extends Controller<FocusableWidget>
{
    stage: Stage;

    protected tabGroups: Map<TabGroup, FocusableWidget[]>;
    protected currentItem: FocusableWidget;

    useTab: boolean;
    useForward: boolean;
    useBack: boolean;

    constructor(stage: Stage)
    {
        super(stage);

        /**
         * Map of tab-group names to the widgets in those groups.
         * @member {Map<PUXI.TabGroup, PUXI.FocusableWidget[]>}
         * @protected
         */
        this.tabGroups = new Map<TabGroup, FocusableWidget[]>();

        /**
         * Whether to enable tab-based focus movement.
         * @member {boolean}
         */
        this.useTab = true;

        /**
         * Whether to enable forward arrow key focus movement.
         * @member {boolean}
         */
        this.useForward = true;

        /**
         * Whether to enable back arrow key focus movement.
         * @member {boolean}
         */
        this.useBack = true;
    }

    /**
     * Adds the (focusable) widget to the tab group so that pressing tab repeatedly
     * will eventually bring it into focus.
     *
     * @param {PUXI.FocusableWidget} widget - the widget to add
     * @param {number}[tabIndex=0] - unique index for the widget in tab group used for ordering
     * @param {PUXI.TabGroup}[tabGroup='default'] - tab group name
     */
    in(widget: FocusableWidget, tabIndex = 0, tabGroup = 'default'): void
    {
        let widgets = this.tabGroups.get(tabGroup);

        if (!widgets)
        {
            widgets = [];
            this.tabGroups.set(tabGroup, widgets);
        }

        const i = widgets.indexOf(widget);

        // Push widget into tab group list if not present already.
        if (i === -1)
        {
            widget.tabIndex = tabIndex !== undefined ? tabIndex : -1;
            widget.tabGroup = tabGroup;

            widgets.push(widget);
            widgets.sort((a, b) => a.tabIndex - b.tabIndex);
        }
    }

    /**
     * @param {PUXI.FocusableWidget} widget
     * @override
     */
    out(widget: FocusableWidget): void
    {
        const widgets = this.tabGroups.get(widget.tabGroup);

        if (!widgets)
        {
            return;
        }

        const i = widgets.indexOf(widget);

        if (i !== -1)
        {
            // Widgets should already be sorted & so deleting should not unsort it.
            widgets.splice(i, 1);
        }
    }

    /**
     * Called when a widget comes into focus. Do not call this yourself.
     *
     * @param {FocusableWidget} widget
     */
    notifyFocus(widget: FocusableWidget): void
    {
        const lastItem = this.currentItem;

        if (lastItem)
        {
            lastItem.blur();
            this.emit('blur', lastItem);
        }

        this.currentItem = widget;

        this.emit('focus', widget);
        this.emit('focusChanged', widget, lastItem);
    }

    /**
     * Clears the currently focused item without blurring it. It is called
     * when a widget goes out of focus.
     */
    notifyBlur(): void
    {
        this.emit('blur', this.currentItem);
        this.emit('focusChanged', null, this.currentItem);

        this.currentItem = null;
    }

    /**
     * Brings the widget into focus.
     *
     * @param {FocusableWidget} item
     */
    focus(item: FocusableWidget): void
    {
        const lastItem = this.currentItem;

        if (lastItem)
        {
            lastItem.blur();
            this.emit('blur', lastItem);
        }

        item.focus();

        this.emit('focus', item);
        this.emit('focusChanged', item, lastItem);
    }

    /**
     * Blurs the currently focused widget out of focus.
     */
    blur(): void
    {
        if (this.currentItem)
        {
            this.currentItem.blur();

            this.emit('blur', this.currentItem);
            this.emit('focusChanged', null, this.currentItem);

            this.currentItem = null;
        }
    }

    /**
     * Called when tab is pressed on a focusable widget.
     */
    onTab(): void
    {
        const { tabGroups, currentItem } = this;

        if (currentItem)
        {
            const tabGroup = tabGroups.get(currentItem.tabGroup);

            let i = tabGroup.indexOf(currentItem) + 1;

            if (i >= tabGroup.length)
            {
                i = 0;
            }

            this.focus(tabGroup[i]);
        }
    }

    /**
     * Focuses the next item without wrapping, i.e. it does not go to the first
     * item if the current one is the last item. This is called when the user
     * presses the forward arrow key.
     */
    onForward(): void
    {
        if (!this.useForward)
        {
            return;
        }

        const { currentItem, tabGroups } = this;

        if (currentItem)
        {
            const tabGroup = tabGroups.get(currentItem.tabGroup);

            let i = tabGroup.indexOf(currentItem) + 1;

            if (i >= tabGroup.length)
            {
                i = tabGroup.length - 1;
            }

            this.focus(tabGroup[i]);
        }
    }

    /**
     * Focuses the last item without wrapping, i.e. it does not go to the last
     * item if the current item is the first one. This is called when the user
     * presses the back arrow button.
     */
    onBack(): void
    {
        const { currentItem, tabGroups } = this;

        if (currentItem)
        {
            const tabGroup = tabGroups.get(currentItem.tabGroup);
            let i = tabGroup.indexOf(currentItem) - 1;

            if (i < 0) i = 0;

            this.focus(tabGroup[i]);
        }
    }

    /**
     * Fired when a widget gains focus.
     * @event focus
     * @param {PUXI.FocusableWidget} widget - the widget that gained focus.
     */

    /**
     * Fired when a widget looses focus.
     * @event blur
     * @param {PUXI.FocusableWidget} widget - the widget that lost focus.
     */

    /**
     * Fired when a new widget comes into focus or one looses focus.
     * @event focusChanged
     * @param {PUXI.FocusableWidget}[newFocus] - the widget that came into focus. It may
     *      be null if only a blur occured.
     * @param {PUXI.FocusableWidget}[oldFocus] - the widget that lost focus. It may be
     *      null if a widget gained focused for the first time.
     */
}
