import { Controller } from './Controller';
import { CheckBox } from '../CheckBox';
import { Stage } from '../Stage';

export type CheckGroup = string;

/**
 * @memberof PUXI
 * @typedef {string} CheckGroup
 */

interface CBGroup
{
    checks: Array<CheckBox>;
    selected: CheckBox;
}

/**
 * Check boxes use this controller to deselect other checkboxes in the group when
 * they are selected.
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.Controller
 */
export class CheckBoxGroupController extends Controller<CheckBox>
{
    protected checkGroups: Map<CheckGroup, CBGroup>;

    constructor(stage: Stage)
    {
        super(stage);
        this.checkGroups = new Map<CheckGroup, CBGroup>();
    }

    /**
     * @param {PUXI.CheckBox} widget
     * @param {PUXI.CheckGroup} checkGroup
     * @override
     */
    in(widget: CheckBox, checkGroup?: CheckGroup): void
    {
        if (!checkGroup)
        {
            throw new Error('Default check groups don\'t exist!');
        }

        const group = this.checkGroups.get(checkGroup) || this.initGroup(checkGroup);

        group.checks.push(widget);
        widget.checkGroup = checkGroup;
    }

    /**
     * @override
     */
    out(widget: CheckBox): void
    {
        const group = this.checkGroups.get(widget.checkGroup);
        const i = group.checks.indexOf(widget);

        if (i > 0)
        {
            group.checks.splice(i, 1);
        }

        widget.checkGroup = null;
    }

    /**
     * Called when a checkbox is selected. Do not call from outside.
     *
     * @param {CheckBox} widget
     */
    notifyCheck(widget: CheckBox): void
    {
        const group = this.checkGroups.get(widget.checkGroup);

        if (!group)
        {
            return;
        }

        const { checks } = group;

        for (let i = 0, j = checks.length; i < j; i++)
        {
            if (checks[i] !== widget)
            {
                checks[i].checked = false;
            }
        }

        group.selected = widget;
    }

    /**
     * @param {PUXI.CheckGroup} group
     * @returns {CheckBox} the selected checkbox in the group
     */
    getSelected(group: CheckGroup): CheckBox
    {
        return this.checkGroups.get(group)?.selected;
    }

    /**
     * Ensures that the check group exists in `this.checkGroups`.
     *
     * @param {PUXI.CheckGroup} id
     * @protected
     */
    protected initGroup(id: CheckGroup): CBGroup
    {
        const cgroup: CBGroup = {
            checks: [],
            selected: null,
        };

        this.checkGroups.set(id, cgroup);

        return cgroup;
    }
}
