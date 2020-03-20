import { Helpers } from './Helpers';
const _tweenItemCache = [];
const _callbackItemCache = [];
const _tweenObjects = {};
const _activeTweenObjects = {};
let _currentId = 1;

class TweenObject<T>
{
    public object: T;
    public tweens: Record<string, T>;
    public active: boolean;
    public onUpdate: () => void;

    constructor(object: T)
    {
        this.object = object;
        this.tweens = {};
        this.active = false;
        this.onUpdate = null;
    }
}

class CallbackItem
{
    key: string;
    obj: any;
    parent: any;
    time: number;
    callback: Function;
    currentTime: number;

    private _ready: boolean;

    constructor()
    {
        this._ready = false;
        this.obj = null;
        this.parent = null;
        this.key = '';
        this.time = 0;
        this.callback = null;
        this.currentTime = 0;
    }

    remove(): void
    {
        this._ready = true;
        delete this.parent.tweens[this.key];
        if (!Object.keys(this.parent.tweens).length)
        {
            this.parent.active = false;
            this.parent.onUpdate = null;
            delete _activeTweenObjects[this.obj._tweenObjectId];
        }
    }

    set(obj, callback, time): void
    {
        this.obj = obj.object;

        if (!this.obj._currentCallbackID)
        { this.obj._currentCallbackID = 1; }
        else
        { this.obj._currentCallbackID++; }

        this.time = time;
        this.parent = obj;
        this.callback = callback;
        this._ready = false;
        this.key = `cb_${this.obj._currentCallbackID}`;
        this.currentTime = 0;
        if (!this.parent.active)
        {
            this.parent.active = true;
            _activeTweenObjects[this.obj._tweenObjectId] = this.parent;
        }
    }

    update(delta: number): void
    {
        this.currentTime += delta;
        if (this.currentTime >= this.time)
        {
            this.remove();
            this.callback.call(this.parent);
        }
    }
}

class TweenItem
{
    key: string;
    parent: any;
    obj: any;

    from: any;
    to: any;
    time: number;
    ease: any;
    currentTime: number;
    t: number;
    isColor: boolean;
    currentColor: any;
    surfix: any;

    _ready: boolean;

    constructor()
    {
        this._ready = false;
        this.parent = null;
        this.obj = null;
        this.key = '';
        this.from = 0;
        this.to = 0;
        this.time = 0;
        this.ease = 0;
        this.currentTime = 0;
        this.t = 0;
        this.isColor = false;
    }

    remove(): void
    {
        this._ready = true;
        delete this.parent.tweens[this.key];
        if (!Object.keys(this.parent.tweens).length)
        {
            this.parent.active = false;
            delete _activeTweenObjects[this.obj._tweenObjectId];
        }
    }

    set(obj: any, key: string, from: any, to: any, time: number, ease: any): void
    {
        this.isColor = isNaN(from) && from[0] === '#' || isNaN(to) && to[0] === '#';
        this.parent = obj;
        this.obj = obj.object;
        this.key = key;
        this.surfix = getSurfix(to);

        if (this.isColor)
        {
            this.to = Helpers.hexToRgb(to);
            this.from = Helpers.hexToRgb(from);
            this.currentColor = { r: this.from.r, g: this.from.g, b: this.from.b };
        }
        else
        {
            this.to = getToValue(to);
            this.from = getFromValue(from, to, this.obj, key);
        }

        this.time = time;
        this.currentTime = 0;
        this.ease = ease;
        this._ready = false;

        if (!this.parent.active)
        {
            this.parent.active = true;
            _activeTweenObjects[this.obj._tweenObjectId] = this.parent;
        }
    }

    update(delta: number): void
    {
        this.currentTime += delta;
        this.t = Math.min(this.currentTime, this.time) / this.time;
        if (this.ease)
        { this.t = this.ease.getPosition(this.t); }

        if (this.isColor)
        {
            this.currentColor.r = Math.round(Helpers.Lerp(this.from.r, this.to.r, this.t));
            this.currentColor.g = Math.round(Helpers.Lerp(this.from.g, this.to.g, this.t));
            this.currentColor.b = Math.round(Helpers.Lerp(this.from.b, this.to.b, this.t));
            this.obj[this.key] = Helpers.rgbToNumber(this.currentColor.r, this.currentColor.g, this.currentColor.b);
        }
        else
        {
            const val = Helpers.Lerp(this.from, this.to, this.t);

            this.obj[this.key] = this.surfix ? val + this.surfix : val;
        }

        if (this.currentTime >= this.time)
        {
            this.remove();
        }
    }
}

const widthKeys = ['width', 'minWidth', 'maxWidth', 'anchorLeft', 'anchorRight', 'left', 'right', 'x'];
const heightKeys = ['height', 'minHeight', 'maxHeight', 'anchorTop', 'anchorBottom', 'top', 'bottom', 'y'];

function getFromValue(from, to, obj, key): number
{
    // both number
    if (!isNaN(from) && !isNaN(to))
    { return from; }

    // both percentage
    if (isNaN(from) && isNaN(to) && from.indexOf('%') !== -1 && to.indexOf('%') !== -1)
    { return parseFloat(from.replace('%', '')); }

    // convert from to px
    if (isNaN(from) && !isNaN(to) && from.indexOf('%') !== -1)
    {
        if (widthKeys.indexOf(key) !== -1)
        { return obj.parent._width * (parseFloat(from.replace('%', '')) * 0.01); }
        else if (heightKeys.indexOf(key) !== -1)
        { return obj.parent._height * (parseFloat(from.replace('%', '')) * 0.01); }

        return 0;
    }

    // convert from to percentage
    if (!isNaN(from) && isNaN(to) && to.indexOf('%') !== -1)
    {
        if (widthKeys.indexOf(key) !== -1)
        { return from / obj.parent._width * 100; }
        else if (heightKeys.indexOf(key) !== -1)
        { return from / obj.parent._height * 100; }

        return 0;
    }

    return 0;
}

function getSurfix(to: number | string): any
{
    if (isNaN(to) && to.indexOf('%') !== -1)
    { return '%'; }
}

function getToValue(to: number | string): any
{
    if (!isNaN(to))
    { return to; }
    if (isNaN(to) && to.indexOf('%') !== -1)
    { return parseFloat(to.replace('%', '')); }
}

function getObject(obj: any): any
{
    if (!obj._tweenObjectId)
    {
        obj._tweenObjectId = _currentId;
        _currentId++;
    }
    let object = _tweenObjects[obj._tweenObjectId];

    if (!object)
    {
        object = _tweenObjects[obj._tweenObjectId] = new TweenObject(obj);
    }

    return object;
}

function getTweenItem(): TweenItem
{
    for (let i = 0; i < _tweenItemCache.length; i++)
    {
        if (_tweenItemCache[i]._ready)
        { return _tweenItemCache[i]; }
    }

    const tween = new TweenItem();

    _tweenItemCache.push(tween);

    return tween;
}

function getCallbackItem(): CallbackItem
{
    for (let i = 0; i < _callbackItemCache.length; i++)
    {
        if (_callbackItemCache[i]._ready)
        { return _callbackItemCache[i]; }
    }

    const cb = new CallbackItem();

    _callbackItemCache.push(cb);

    return cb;
}

export const Tween = {
    to(obj, time, params, ease?)
    {
        const object = getObject(obj);
        let onUpdate = null;

        for (const key in params)
        {
            if (key === 'onComplete')
            {
                const cb = getCallbackItem();

                cb.set(object, params[key], time);
                object.tweens[cb.key] = cb;
                continue;
            }

            if (key === 'onUpdate')
            {
                onUpdate = params[key];
                continue;
            }

            if (time)
            {
                const match = params[key] === obj[key];

                if (typeof obj[key] === 'undefined') continue;

                if (match)
                {
                    if (object.tweens[key]) object.tweens[key].remove();
                }
                else
                {
                    if (!object.tweens[key])
                    { object.tweens[key] = getTweenItem(); }
                    object.tweens[key].set(object, key, obj[key], params[key], time, ease);
                }
            }
        }

        if (time)
        { object.onUpdate = onUpdate; }
        else this.set(obj, params);
    },
    from(obj, time, params, ease)
    {
        const object = getObject(obj);
        let onUpdate = null;

        for (const key in params)
        {
            if (key === 'onComplete')
            {
                const cb = getCallbackItem();

                cb.set(object, params[key], time);
                object.tweens[cb.key] = cb;
                continue;
            }

            if (key === 'onUpdate')
            {
                onUpdate = params[key];
                continue;
            }

            if (time)
            {
                const match = params[key] == obj[key];

                if (typeof obj[key] === 'undefined') continue;

                if (match)
                {
                    if (object.tweens[key]) object.tweens[key].remove();
                }
                else
                {
                    if (!object.tweens[key])
                    { object.tweens[key] = getTweenItem(); }
                    object.tweens[key].set(object, key, params[key], obj[key], time, ease);
                }
            }
        }

        if (time)
        { object.onUpdate = onUpdate; }
        else this.set(obj, params);
    },
    fromTo(obj, time, paramsFrom, paramsTo, ease)
    {
        const object = getObject(obj);
        let onUpdate = null;

        for (const key in paramsTo)
        {
            if (key === 'onComplete')
            {
                const cb = getCallbackItem();

                cb.set(object, paramsTo[key], time);
                object.tweens[cb.key] = cb;
                continue;
            }

            if (key === 'onUpdate')
            {
                onUpdate = paramsTo[key];
                continue;
            }

            if (time)
            {
                const match = paramsFrom[key] == paramsTo[key];

                if (typeof obj[key] === 'undefined' || typeof paramsFrom[key] === 'undefined') continue;

                if (match)
                {
                    if (object.tweens[key]) object.tweens[key].remove();
                    obj[key] = paramsTo[key];
                }
                else
                {
                    if (!object.tweens[key])
                    {
                        object.tweens[key] = getTweenItem();
                    }
                    object.tweens[key].set(object, key, paramsFrom[key], paramsTo[key], time, ease);
                }
            }
        }

        if (time)
        { object.onUpdate = onUpdate; }
        else this.set(obj, paramsTo);
    },
    set(obj, params)
    {
        const object = getObject(obj);

        for (const key in params)
        {
            if (typeof obj[key] === 'undefined') continue;
            if (object.tweens[key]) object.tweens[key].remove();
            obj[key] = params[key];
        }
    },
    _update(delta)
    {
        for (const id in _activeTweenObjects)
        {
            const object = _activeTweenObjects[id];

            for (const key in object.tweens)
            {
                object.tweens[key].update(delta);
            }
            if (object.onUpdate)
            {
                object.onUpdate.call(object.object, delta);
            }
        }
    },
};
