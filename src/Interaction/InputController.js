var _currentItem;
var tabGroups = {};
var InputController = {
    registrer: function (item, tabIndex, tabGroup) {
        var groupName = tabGroup || "default";

        var items = tabGroups[groupName];
        if (!items)
            items = tabGroups[groupName] = [];

        var i = items.indexOf(item);
        if (i === -1){
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
    }
};

module.exports = InputController;