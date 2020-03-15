let _currentItem;
const tabGroups = {};
const checkGroups = {};
const checkGroupValues = {};

/**
 * Handles focus-management in the scene graph.
 */
export const InputController = {
    registrer(item, tabIndex, tabGroup): void
    {
        const groupName = tabGroup || 'default';

        let items = tabGroups[groupName];

        if (!items)
        { items = tabGroups[groupName] = []; }

        const i = items.indexOf(item);

        if (i === -1)
        {
            item._tabIndex = tabIndex !== undefined ? tabIndex : -1;
            item._tabGroup = items;
            items.push(item);
            items.sort(function sorter(a, b)
            {
                if (a._tabIndex < b._tabIndex)
                { return -1; }
                if (a._tabIndex > b._tabIndex)
                { return 1; }

                return 0;
            });
        }
    },
    set(item): void
    {
        this.blur();
        _currentItem = item;
    },
    clear(): void
    {
        _currentItem = undefined;
    },
    blur(): void
    {
        if (_currentItem && typeof _currentItem.blur === 'function')
        {
            _currentItem.blur();
        }
    },
    fireTab(): void
    {
        if (_currentItem)
        {
            let i = _currentItem._tabGroup.indexOf(_currentItem) + 1;

            if (i >= _currentItem._tabGroup.length) i = 0;
            _currentItem._tabGroup[i].focus();
        }
    },
    fireNext(): void
    {
        if (_currentItem)
        {
            let i = _currentItem._tabGroup.indexOf(_currentItem) + 1;

            if (i >= _currentItem._tabGroup.length) i = _currentItem._tabGroup.length - 1;
            _currentItem._tabGroup[i].focus();
        }
    },
    firePrev(): void
    {
        if (_currentItem)
        {
            let i = _currentItem._tabGroup.indexOf(_currentItem) - 1;

            if (i < 0) i = 0;
            _currentItem._tabGroup[i].focus();
        }
    },
    registrerCheckGroup(cb): void
    {
        const name = cb.checkGroup;
        let group = checkGroups[name];

        if (!group) group = checkGroups[name] = {};
        group[cb.value] = cb;

        if (cb.checked)
        { checkGroupValues[name] = cb.value; }
    },
    updateCheckGroupSelected(cb): void
    {
        const group = checkGroups[cb.checkGroup];

        for (const val in group)
        {
            const b = group[val];

            if (b !== cb)
            { b.checked = false; }
        }
        checkGroupValues[cb.checkGroup] = cb.value;
    },
    getCheckGroupSelectedValue(name): string
    {
        if (checkGroupValues[name])
        { return checkGroupValues[name]; }

        return '';
    },
    setCheckGroupSelectedValue(name, val): void
    {
        const group = checkGroups[name];

        if (group)
        {
            const cb = group[val];

            if (cb)
            {
                cb.checked = true;
            }
        }
    },
};

