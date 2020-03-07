const _items = [];
const DragDropController = {
    add(item, event)
    {
        item._dragDropEventId = event.data.identifier;
        if (_items.indexOf(item) === -1)
        {
            _items.push(item);

            return true;
        }

        return false;
    },
    getItem(object)
    {
        let item = null; let
            index;

        for (let i = 0; i < _items.length; i++)
        {
            if (_items[i] === object)
            {
                item = _items[i];
                index = i;
                break;
            }
        }

        if (item !== null)
        {
            _items.splice(index, 1);

            return item;
        }

        return false;
    },
    getEventItem(event, group)
    {
        let item = null; let index; const
            id = event.data.identifier;

        for (let i = 0; i < _items.length; i++)
        {
            if (_items[i]._dragDropEventId === id)
            {
                if (group !== _items[i].dragGroup)
                {
                    return false;
                }
                item = _items[i];
                index = i;
                break;
            }
        }

        if (item !== null)
        {
            _items.splice(index, 1);

            return item;
        }

        return false;
    },
};

export { DragDropController };
export default DragDropController;
