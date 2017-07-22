var MathHelper = require('./MathHelper');
var Ease = require('./Ease/Ease');
var _tweenItemCache = [];
var _callbackItemCache = [];
var _tweenObjects = {};
var _activeTweenObjects = {};
var _currentId = 0;

var TweenObject = function (object) {
    this.object = object;
    this.tweens = {};
    this.active = false;
};

var CallbackItem = function () {
    this._ready = false;
    this.obj = null;
    this.parent = null;
    this.key = "";
    this.time = 0;
    this.callback = null;
    this.currentTime = 0;
};

CallbackItem.prototype.set = function (obj, callback, time) {


    this.obj = obj.object;

    if (!this.obj._currentCallbackID)
        this.obj._currentCallbackID = 1;
    else
        this.obj._currentCallbackID++;

    this.time = time;
    this.parent = obj;
    this.callback = callback;
    this._ready = false;
    this.key = "cb_" + this.obj._currentCallbackID;
    this.currentTime = 0;
    if (!this.parent.active) {
        this.parent.active = true;
        _activeTweenObjects[this.obj._tweenObjectId] = this.parent;
    }
};

CallbackItem.prototype.update = function (delta) {
    this.currentTime += delta;
    if (this.currentTime >= this.time) {
        this._ready = true;
        delete this.parent.tweens[this.key];
        if (!Object.keys(this.parent.tweens).length) {
            this.parent.active = false;
            delete _activeTweenObjects[this.obj._tweenObjectId];
        }
        this.callback();
    }
};

var TweenItem = function () {
    this._ready = false;
    this.parent = null;
    this.obj = null;
    this.key = "";
    this.from = 0;
    this.to = 0;
    this.time = 0;
    this.ease = 0;
    this.currentTime = 0;
    this.t = 0;
};


TweenItem.prototype.set = function (obj, key, from, to, time, ease) {
    this.parent = obj;
    this.obj = obj.object;
    this.key = key;
    this.surfix = getSurfix(to);
    this.to = getToValue(to);
    this.from = getFromValue(from, to, this.obj, key);
    this.time = time;
    this.currentTime = 0;
    this.ease = ease;
    this._ready = false;

    if (!this.parent.active) {
        this.parent.active = true;
        _activeTweenObjects[this.obj._tweenObjectId] = this.parent;
    }

};

TweenItem.prototype.update = function (delta) {
    this.currentTime += delta;
    this.t = Math.min(this.currentTime, this.time) / this.time;
    if (this.ease)
        this.t = this.ease.getPosition(this.t);

    var val = MathHelper.Lerp(this.from, this.to, this.t);
    this.obj[this.key] = this.surfix ? val + this.surfix : val;

    if (this.currentTime >= this.time) {
        this._ready = true;
        delete this.parent.tweens[this.key];
        if (!Object.keys(this.parent.tweens).length) {
            this.parent.active = false;
            delete _activeTweenObjects[this.obj._tweenObjectId];
        }
    }
};



var widthKeys = ["width", "minWidth", "maxWidth", "anchorLeft", "anchorRight", "left", "right", "x"];
var heightKeys = ["height", "minHeight", "maxHeight", "anchorTop", "anchorBottom", "top", "bottom", "y"];


function getFromValue(from, to, obj, key) {
    //both number
    if (!isNaN(from) && !isNaN(to))
        return from;

    //both percentage
    if (isNaN(from) && isNaN(to) && from.indexOf('%') !== -1 && to.indexOf('%') !== -1)
        return parseFloat(from.replace('%', ''));

    //convert from to px
    if (isNaN(from) && !isNaN(to) && from.indexOf('%') !== -1) {
        if (widthKeys.indexOf(key) !== -1)
            return obj.parent._width * (parseFloat(from.replace('%', '')) * 0.01);
        else if (heightKeys.indexOf(key) !== -1)
            return obj.parent._height * (parseFloat(from.replace('%', '')) * 0.01);
        else
            return 0;
    }

    //convert from to percentage
    if (!isNaN(from) && isNaN(to) && to.indexOf('%') !== -1) {
        if (widthKeys.indexOf(key) !== -1)
            return from / obj.parent._width * 100;
        else if (heightKeys.indexOf(key) !== -1)
            return from / obj.parent._height * 100;
        else
            return 0;
    }
    return 0;
}

function getSurfix(to) {
    if (isNaN(to) && to.indexOf('%') !== -1)
        return "%";
}

function getToValue(to) {
    if (!isNaN(to))
        return to;
    if (isNaN(to) && to.indexOf('%') !== -1)
        return parseFloat(to.replace('%', ''));
}


function getObject(obj) {
    if (!obj._tweenObjectId) {
        obj._tweenObjectId = _currentId;
        _currentId++;
    }
    var object = _tweenObjects[obj._tweenObjectId];
    if (!object) {
        object = _tweenObjects[obj._tweenObjectId] = new TweenObject(obj);
    }
    return object;
}

function getTweenItem() {
    for (var i = 0; i < _tweenItemCache.length; i++) {
        if (_tweenItemCache[i]._ready)
            return _tweenItemCache[i];
    }

    var tween = new TweenItem();
    _tweenItemCache.push(tween);
    return tween;
}

function getCallbackItem() {
    for (var i = 0; i < _callbackItemCache.length; i++) {
        if (_callbackItemCache[i]._ready)
            return _callbackItemCache[i];
    }

    var cb = new CallbackItem();
    _callbackItemCache.push(cb);
    return cb;
}

var Tween = {
    to: function (obj, time, params, ease) {
        var object = getObject(obj);
        for (var key in params) {
            if (key === "onComplete") {
                var cb = getCallbackItem();
                cb.set(object, params[key], time);
                object.tweens[cb.key] = cb;
                continue;
            }

            if (time) {
                if (params[key] == obj[key] || typeof obj[key] === "undefined") continue;
                if (!object.tweens[key])
                    object.tweens[key] = getTweenItem();
                object.tweens[key].set(object, key, obj[key], params[key], time, ease);
            }
        }
        if (!time) this.set(obj, params);
    },
    from: function (obj, time, params, ease) {
        var object = getObject(obj);
        for (var key in params) {
            if (key === "onComplete") {
                var cb = getCallbackItem();
                cb.set(object, params[key], time);
                object.tweens[cb.key] = cb;
                continue;
            }

            if (time) {
                if (params[key] == obj[key] || typeof obj[key] === "undefined") continue;
                if (!object.tweens[key])
                    object.tweens[key] = getTweenItem();
                object.tweens[key].set(object, key, params[key], obj[key], time, ease);
            }
        }
        if (!time) this.set(obj, params);
    },
    fromTo: function (obj, time, paramsFrom, paramsTo, ease) {
        var object = getObject(obj);
        for (var key in paramsTo) {
            if (key === "onComplete") {
                var cb = getCallbackItem();
                cb.set(object, paramsTo[key], time);
                object.tweens[cb.key] = cb;
                continue;
            }
            if (time) {
                if (paramsFrom[key] == paramsTo[key] || typeof obj[key] === "undefined" || typeof paramsFrom[key] === "undefined") continue;
                if (!object.tweens[key]) {
                    object.tweens[key] = getTweenItem();
                }
                object.tweens[key].set(object, key, paramsFrom[key], paramsTo[key], time, ease);
            }
        }
        if (!time) this.set(obj, paramsTo);
    },
    set: function (obj, params) {
        var object = getObject(obj);
        for (var key in params) {
            if (params[key] == obj[key] || typeof obj[key] === "undefined") continue;
            if (object.tweens[key]) delete object.tweens[key];
            obj[key] = params[key];
        }
    },
    _update: function (delta) {
        for (var id in _activeTweenObjects) {
            var object = _activeTweenObjects[id];
            for (var key in object.tweens) {
                object.tweens[key].update(delta);
            }
        }
    }
};


module.exports = Tween;