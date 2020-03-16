import { InteractiveGroup } from './InteractiveGroup';
import { Tween } from './Tween';
import { EaseBase } from './Ease/EaseBase';
import { Widget } from './Widget';

/**
 * An UI Container object
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.Widget
 * @param desc {Boolean} Sort the list descending
 * @param tweenTime {Number} if above 0 the sort will be animated
 * @param tweenEase {PIXI.UI.Ease} ease method used for animation
 */
export class SortableList extends InteractiveGroup
{
    desc: boolean;
    tweenTime: number;
    tweenEase: EaseBase;
    items: any[];

    _sortTimeout: NodeJS.Timeout;

    constructor(desc, tweenTime, tweenEase)
    {
        super(0, 0);

        this.desc = typeof desc !== 'undefined' ? desc : false;
        this.tweenTime = tweenTime || 0;
        this.tweenEase = tweenEase;
        this.items = [];
    }

    addChild(UIObject: any, fnValue?, fnThenBy?): void
    {
        super.addChild(UIObject);

        if (this.items.indexOf(UIObject) === -1)
        {
            this.items.push(UIObject);
        }

        if (typeof fnValue === 'function')
        {
            UIObject._sortListValue = fnValue;
        }

        if (typeof fnThenBy === 'function')
        {
            UIObject._sortListThenByValue = fnThenBy;
        }

        if (!UIObject._sortListRnd)
        {
            UIObject._sortListRnd = Math.random();
        }

        this.sort();
    }

    removeChild(UIObject): void
    {
        if (arguments.length > 1)
        {
            for (let i = 0; i < arguments.length; i++)
            {
                this.removeChild(arguments[i]);
            }
        }
        else
        {
            super.removeChild(UIObject);
            const index = this.items.indexOf(UIObject);

            if (index !== -1)
            {
                this.items.splice(index, 1);
            }

            this.sort();
        }
    }

    sort(instant = false): void
    {
        clearTimeout(this._sortTimeout);

        if (instant)
        {
            this._sort();

            return;
        }

        this._sortTimeout = setTimeout(() => { this._sort(); }, 0);
    }

    _sort()
    {
        const desc = this.desc;
        let y = 0;
        let alt = true;

        this.items.sort(function (a, b)
        {
            let res = a._sortListValue() < b._sortListValue() ? desc ? 1 : -1
                : a._sortListValue() > b._sortListValue() ? desc ? -1 : 1 : 0;

            if (res === 0 && a._sortListThenByValue && b._sortListThenByValue)
            {
                res = a._sortListThenByValue() < b._sortListThenByValue() ? desc ? 1 : -1
                    : a._sortListThenByValue() > b._sortListThenByValue() ? desc ? -1 : 1 : 0;
            }
            if (res === 0)
            {
                res = a._sortListRnd > b._sortListRnd ? 1
                    : a._sortListRnd < b._sortListRnd ? -1 : 0;
            }

            return res;
        });

        for (let i = 0; i < this.items.length; i++)
        {
            const item = this.items[i];

            alt = !alt;

            if (this.tweenTime > 0)
            {
                Tween.fromTo(item, this.tweenTime, { x: item.x, y: item.y }, { x: 0, y }, this.tweenEase);
            }
            else
            {
                item.x = 0;
                item.y = y;
            }
            y += item.height;
            if (typeof item.altering === 'function')
            { item.altering(alt); }
        }

        // force it to update parents when sort animation is done (prevent scrolling container bug)
        if (this.tweenTime > 0)
        {
            setTimeout(() =>
            {
                this.updatesettings(false, true);
            }, this.tweenTime * 1000);
        }
    }
}

