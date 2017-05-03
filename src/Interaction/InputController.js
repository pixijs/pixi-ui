var _currentItem;
var tabGroups = {};
var checkGroups = {};
var checkGroupValues = {};

var InputController = {
    registrer: function (item, tabIndex, tabGroup) {
        var groupName = tabGroup || "default";

        var items = tabGroups[groupName];
        if (!items)
            items = tabGroups[groupName] = [];

        var i = items.indexOf(item);
        if (i === -1) {
            item._tabIndex = tabIndex !== undefined ? tabIndex : -1;
            item._tabGroup = items;
            items.push(item);
            items.sort(function (a, b) {
                if (a._tabIndex < b._tabIndex)
                    return -1;
                if (a._tabIndex > b._tabIndex)
                    return 1;
                return 0;
            });
        }
    },
    set: function (item) {
        if (_currentItem && typeof _currentItem.blur === "function")
            _currentItem.blur();
        _currentItem = item;
    },
    clear: function () {
        _currentItem = undefined;
    },
    fireTab: function () {
        if (_currentItem) {
            var i = _currentItem._tabGroup.indexOf(_currentItem) + 1;
            if (i >= _currentItem._tabGroup.length) i = 0;
            _currentItem._tabGroup[i].focus();
        }
    },
    fireNext: function () {
        if (_currentItem) {
            var i = _currentItem._tabGroup.indexOf(_currentItem) + 1;
            if (i >= _currentItem._tabGroup.length) i = _currentItem._tabGroup.length - 1;
            _currentItem._tabGroup[i].focus();
        }
    },
    firePrev: function () {
        if (_currentItem) {
            var i = _currentItem._tabGroup.indexOf(_currentItem) - 1;
            if (i < 0) i = 0;
            _currentItem._tabGroup[i].focus();
        }
    },
    registrerCheckGroup: function (cb) {
        var name = cb.checkGroup;
        var group = checkGroups[name];
        if (!group) group = checkGroups[name] = {};
        group[cb.value] = cb;

        if (cb.checked)
            checkGroupValues[name] = cb.value;
    },
    updateCheckGroupSelected: function (cb) {
        var group = checkGroups[cb.checkGroup];
        for (var val in group) {
            var b = group[val];
            if (b !== cb)
                b.checked = false;
        }
        checkGroupValues[cb.checkGroup] = cb.value;
    },
    getCheckGroupSelectedValue: function (name) {
        if (checkGroupValues[name])
            return checkGroupValues[name];
        return "";
    },
    setCheckGroupSelectedValue: function (name, val) {
        var group = checkGroups[name];
        if (group) {
            var cb = group[val];
            if (cb) {
                cb.checked = true;
            }
        }
    }
};

module.exports = InputController;