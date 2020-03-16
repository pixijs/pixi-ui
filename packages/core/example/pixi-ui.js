(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('pixi.js')) :
    typeof define === 'function' && define.amd ? define(['exports', 'pixi.js'], factory) :
    (global = global || self, factory(global.PUXI = {}, global.PIXI));
}(this, (function (exports, PIXI$1) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

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

    /**
     * @namespace PUXI
     * @class
     */
    var Insets = /** @class */ (function () {
        function Insets() {
            this.reset();
            this.dirtyId = 0;
        }
        Insets.prototype.reset = function () {
            this.left = -1;
            this.top = -1;
            this.right = -1;
            this.bottom = -1;
        };
        return Insets;
    }());

    /**
     * @namespace PUXI
     * @enum
     */
    (function (MeasureMode) {
        MeasureMode[MeasureMode["UNBOUNDED"] = 0] = "UNBOUNDED";
        MeasureMode[MeasureMode["EXACTLY"] = 1] = "EXACTLY";
        MeasureMode[MeasureMode["AT_MOST"] = 2] = "AT_MOST";
    })(exports.MeasureMode || (exports.MeasureMode = {}));

    /*!
     * @pixi/runner - v5.2.1
     * Compiled Tue, 28 Jan 2020 23:33:11 UTC
     *
     * @pixi/runner is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */
    /**
     * A Runner is a highly performant and simple alternative to signals. Best used in situations
     * where events are dispatched to many objects at high frequency (say every frame!)
     *
     *
     * like a signal..
     * ```
     * import { Runner } from '@pixi/runner';
     *
     * const myObject = {
     *     loaded: new Runner('loaded')
     * }
     *
     * const listener = {
     *     loaded: function(){
     *         // thin
     *     }
     * }
     *
     * myObject.update.add(listener);
     *
     * myObject.loaded.emit();
     * ```
     *
     * Or for handling calling the same function on many items
     * ```
     * import { Runner } from '@pixi/runner';
     *
     * const myGame = {
     *     update: new Runner('update')
     * }
     *
     * const gameObject = {
     *     update: function(time){
     *         // update my gamey state
     *     }
     * }
     *
     * myGame.update.add(gameObject1);
     *
     * myGame.update.emit(time);
     * ```
     * @class
     * @memberof PIXI
     */
    var Runner = /** @class */ (function () {
        /**
         *  @param {string} name the function name that will be executed on the listeners added to this Runner.
         */
        function Runner(name) {
            this.items = [];
            this._name = name;
            this._aliasCount = 0;
        }
        /**
         * Dispatch/Broadcast Runner to all listeners added to the queue.
         * @param {...any} params - optional parameters to pass to each listener
         * @return {PIXI.Runner}
         */
        Runner.prototype.emit = function (a0, a1, a2, a3, a4, a5, a6, a7) {
            if (arguments.length > 8) {
                throw new Error('max arguments reached');
            }
            var _a = this, name = _a.name, items = _a.items;
            this._aliasCount++;
            for (var i = 0, len = items.length; i < len; i++) {
                items[i][name](a0, a1, a2, a3, a4, a5, a6, a7);
            }
            if (items === this.items) {
                this._aliasCount--;
            }
            return this;
        };
        Runner.prototype.ensureNonAliasedItems = function () {
            if (this._aliasCount > 0 && this.items.length > 1) {
                this._aliasCount = 0;
                this.items = this.items.slice(0);
            }
        };
        /**
         * Add a listener to the Runner
         *
         * Runners do not need to have scope or functions passed to them.
         * All that is required is to pass the listening object and ensure that it has contains a function that has the same name
         * as the name provided to the Runner when it was created.
         *
         * Eg A listener passed to this Runner will require a 'complete' function.
         *
         * ```
         * import { Runner } from '@pixi/runner';
         *
         * const complete = new Runner('complete');
         * ```
         *
         * The scope used will be the object itself.
         *
         * @param {any} item - The object that will be listening.
         * @return {PIXI.Runner}
         */
        Runner.prototype.add = function (item) {
            if (item[this._name]) {
                this.ensureNonAliasedItems();
                this.remove(item);
                this.items.push(item);
            }
            return this;
        };
        /**
         * Remove a single listener from the dispatch queue.
         * @param {any} item - The listenr that you would like to remove.
         * @return {PIXI.Runner}
         */
        Runner.prototype.remove = function (item) {
            var index = this.items.indexOf(item);
            if (index !== -1) {
                this.ensureNonAliasedItems();
                this.items.splice(index, 1);
            }
            return this;
        };
        /**
         * Check to see if the listener is already in the Runner
         * @param {any} item - The listener that you would like to check.
         */
        Runner.prototype.contains = function (item) {
            return this.items.indexOf(item) !== -1;
        };
        /**
         * Remove all listeners from the Runner
         * @return {PIXI.Runner}
         */
        Runner.prototype.removeAll = function () {
            this.ensureNonAliasedItems();
            this.items.length = 0;
            return this;
        };
        /**
         * Remove all references, don't use after this.
         */
        Runner.prototype.destroy = function () {
            this.removeAll();
            this.items = null;
            this._name = null;
        };
        Object.defineProperty(Runner.prototype, "empty", {
            /**
             * `true` if there are no this Runner contains no listeners
             *
             * @member {boolean}
             * @readonly
             */
            get: function () {
                return this.items.length === 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Runner.prototype, "name", {
            /**
             * The name of the runner.
             *
             * @member {string}
             * @readonly
             */
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        return Runner;
    }());
    Object.defineProperties(Runner.prototype, {
        /**
         * Alias for `emit`
         * @memberof PIXI.Runner#
         * @method dispatch
         * @see PIXI.Runner#emit
         */
        dispatch: { value: Runner.prototype.emit },
        /**
         * Alias for `emit`
         * @memberof PIXI.Runner#
         * @method run
         * @see PIXI.Runner#emit
         */
        run: { value: Runner.prototype.emit },
    });

    const appleIphone = /iPhone/i;
    const appleIpod = /iPod/i;
    const appleTablet = /iPad/i;
    const androidPhone = /\bAndroid(?:.+)Mobile\b/i;
    const androidTablet = /Android/i;
    const amazonPhone = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i;
    const amazonTablet = /Silk/i;
    const windowsPhone = /Windows Phone/i;
    const windowsTablet = /\bWindows(?:.+)ARM\b/i;
    const otherBlackBerry = /BlackBerry/i;
    const otherBlackBerry10 = /BB10/i;
    const otherOpera = /Opera Mini/i;
    const otherChrome = /\b(CriOS|Chrome)(?:.+)Mobile/i;
    const otherFirefox = /Mobile(?:.+)Firefox\b/i;
    function match(regex, userAgent) {
        return regex.test(userAgent);
    }
    function isMobile(userAgent) {
        userAgent =
            userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '');
        let tmp = userAgent.split('[FBAN');
        if (typeof tmp[1] !== 'undefined') {
            userAgent = tmp[0];
        }
        tmp = userAgent.split('Twitter');
        if (typeof tmp[1] !== 'undefined') {
            userAgent = tmp[0];
        }
        const result = {
            apple: {
                phone: match(appleIphone, userAgent) && !match(windowsPhone, userAgent),
                ipod: match(appleIpod, userAgent),
                tablet: !match(appleIphone, userAgent) &&
                    match(appleTablet, userAgent) &&
                    !match(windowsPhone, userAgent),
                device: (match(appleIphone, userAgent) ||
                    match(appleIpod, userAgent) ||
                    match(appleTablet, userAgent)) &&
                    !match(windowsPhone, userAgent),
            },
            amazon: {
                phone: match(amazonPhone, userAgent),
                tablet: !match(amazonPhone, userAgent) && match(amazonTablet, userAgent),
                device: match(amazonPhone, userAgent) || match(amazonTablet, userAgent),
            },
            android: {
                phone: (!match(windowsPhone, userAgent) && match(amazonPhone, userAgent)) ||
                    (!match(windowsPhone, userAgent) && match(androidPhone, userAgent)),
                tablet: !match(windowsPhone, userAgent) &&
                    !match(amazonPhone, userAgent) &&
                    !match(androidPhone, userAgent) &&
                    (match(amazonTablet, userAgent) || match(androidTablet, userAgent)),
                device: (!match(windowsPhone, userAgent) &&
                    (match(amazonPhone, userAgent) ||
                        match(amazonTablet, userAgent) ||
                        match(androidPhone, userAgent) ||
                        match(androidTablet, userAgent))) ||
                    match(/\bokhttp\b/i, userAgent),
            },
            windows: {
                phone: match(windowsPhone, userAgent),
                tablet: match(windowsTablet, userAgent),
                device: match(windowsPhone, userAgent) || match(windowsTablet, userAgent),
            },
            other: {
                blackberry: match(otherBlackBerry, userAgent),
                blackberry10: match(otherBlackBerry10, userAgent),
                opera: match(otherOpera, userAgent),
                firefox: match(otherFirefox, userAgent),
                chrome: match(otherChrome, userAgent),
                device: match(otherBlackBerry, userAgent) ||
                    match(otherBlackBerry10, userAgent) ||
                    match(otherOpera, userAgent) ||
                    match(otherFirefox, userAgent) ||
                    match(otherChrome, userAgent),
            },
            any: false,
            phone: false,
            tablet: false,
        };
        result.any =
            result.apple.device ||
                result.android.device ||
                result.windows.device ||
                result.other.device;
        result.phone =
            result.apple.phone || result.android.phone || result.windows.phone;
        result.tablet =
            result.apple.tablet || result.android.tablet || result.windows.tablet;
        return result;
    }

    /*!
     * @pixi/settings - v5.2.1
     * Compiled Tue, 28 Jan 2020 23:33:11 UTC
     *
     * @pixi/settings is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    // The ESM/CJS versions of ismobilejs only

    var isMobile$1 = isMobile();

    /**
     * The maximum recommended texture units to use.
     * In theory the bigger the better, and for desktop we'll use as many as we can.
     * But some mobile devices slow down if there is to many branches in the shader.
     * So in practice there seems to be a sweet spot size that varies depending on the device.
     *
     * In v4, all mobile devices were limited to 4 texture units because for this.
     * In v5, we allow all texture units to be used on modern Apple or Android devices.
     *
     * @private
     * @param {number} max
     * @returns {number}
     */
    function maxRecommendedTextures(max)
    {
        var allowMax = true;

        if (isMobile$1.tablet || isMobile$1.phone)
        {
            allowMax = false;

            if (isMobile$1.apple.device)
            {
                var match = (navigator.userAgent).match(/OS (\d+)_(\d+)?/);

                if (match)
                {
                    var majorVersion = parseInt(match[1], 10);

                    // All texture units can be used on devices that support ios 11 or above
                    if (majorVersion >= 11)
                    {
                        allowMax = true;
                    }
                }
            }
            if (isMobile$1.android.device)
            {
                var match$1 = (navigator.userAgent).match(/Android\s([0-9.]*)/);

                if (match$1)
                {
                    var majorVersion$1 = parseInt(match$1[1], 10);

                    // All texture units can be used on devices that support Android 7 (Nougat) or above
                    if (majorVersion$1 >= 7)
                    {
                        allowMax = true;
                    }
                }
            }
        }

        return allowMax ? max : 4;
    }

    /**
     * Uploading the same buffer multiple times in a single frame can cause performance issues.
     * Apparent on iOS so only check for that at the moment
     * This check may become more complex if this issue pops up elsewhere.
     *
     * @private
     * @returns {boolean}
     */
    function canUploadSameBuffer()
    {
        return !isMobile$1.apple.device;
    }

    /**
     * User's customizable globals for overriding the default PIXI settings, such
     * as a renderer's default resolution, framerate, float precision, etc.
     * @example
     * // Use the native window resolution as the default resolution
     * // will support high-density displays when rendering
     * PIXI.settings.RESOLUTION = window.devicePixelRatio;
     *
     * // Disable interpolation when scaling, will make texture be pixelated
     * PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
     * @namespace PIXI.settings
     */
    var settings = {

        /**
         * If set to true WebGL will attempt make textures mimpaped by default.
         * Mipmapping will only succeed if the base texture uploaded has power of two dimensions.
         *
         * @static
         * @name MIPMAP_TEXTURES
         * @memberof PIXI.settings
         * @type {PIXI.MIPMAP_MODES}
         * @default PIXI.MIPMAP_MODES.POW2
         */
        MIPMAP_TEXTURES: 1,

        /**
         * Default anisotropic filtering level of textures.
         * Usually from 0 to 16
         *
         * @static
         * @name ANISOTROPIC_LEVEL
         * @memberof PIXI.settings
         * @type {number}
         * @default 0
         */
        ANISOTROPIC_LEVEL: 0,

        /**
         * Default resolution / device pixel ratio of the renderer.
         *
         * @static
         * @name RESOLUTION
         * @memberof PIXI.settings
         * @type {number}
         * @default 1
         */
        RESOLUTION: 1,

        /**
         * Default filter resolution.
         *
         * @static
         * @name FILTER_RESOLUTION
         * @memberof PIXI.settings
         * @type {number}
         * @default 1
         */
        FILTER_RESOLUTION: 1,

        /**
         * The maximum textures that this device supports.
         *
         * @static
         * @name SPRITE_MAX_TEXTURES
         * @memberof PIXI.settings
         * @type {number}
         * @default 32
         */
        SPRITE_MAX_TEXTURES: maxRecommendedTextures(32),

        // TODO: maybe change to SPRITE.BATCH_SIZE: 2000
        // TODO: maybe add PARTICLE.BATCH_SIZE: 15000

        /**
         * The default sprite batch size.
         *
         * The default aims to balance desktop and mobile devices.
         *
         * @static
         * @name SPRITE_BATCH_SIZE
         * @memberof PIXI.settings
         * @type {number}
         * @default 4096
         */
        SPRITE_BATCH_SIZE: 4096,

        /**
         * The default render options if none are supplied to {@link PIXI.Renderer}
         * or {@link PIXI.CanvasRenderer}.
         *
         * @static
         * @name RENDER_OPTIONS
         * @memberof PIXI.settings
         * @type {object}
         * @property {HTMLCanvasElement} view=null
         * @property {number} resolution=1
         * @property {boolean} antialias=false
         * @property {boolean} forceFXAA=false
         * @property {boolean} autoDensity=false
         * @property {boolean} transparent=false
         * @property {number} backgroundColor=0x000000
         * @property {boolean} clearBeforeRender=true
         * @property {boolean} preserveDrawingBuffer=false
         * @property {number} width=800
         * @property {number} height=600
         * @property {boolean} legacy=false
         */
        RENDER_OPTIONS: {
            view: null,
            antialias: false,
            forceFXAA: false,
            autoDensity: false,
            transparent: false,
            backgroundColor: 0x000000,
            clearBeforeRender: true,
            preserveDrawingBuffer: false,
            width: 800,
            height: 600,
            legacy: false,
        },

        /**
         * Default Garbage Collection mode.
         *
         * @static
         * @name GC_MODE
         * @memberof PIXI.settings
         * @type {PIXI.GC_MODES}
         * @default PIXI.GC_MODES.AUTO
         */
        GC_MODE: 0,

        /**
         * Default Garbage Collection max idle.
         *
         * @static
         * @name GC_MAX_IDLE
         * @memberof PIXI.settings
         * @type {number}
         * @default 3600
         */
        GC_MAX_IDLE: 60 * 60,

        /**
         * Default Garbage Collection maximum check count.
         *
         * @static
         * @name GC_MAX_CHECK_COUNT
         * @memberof PIXI.settings
         * @type {number}
         * @default 600
         */
        GC_MAX_CHECK_COUNT: 60 * 10,

        /**
         * Default wrap modes that are supported by pixi.
         *
         * @static
         * @name WRAP_MODE
         * @memberof PIXI.settings
         * @type {PIXI.WRAP_MODES}
         * @default PIXI.WRAP_MODES.CLAMP
         */
        WRAP_MODE: 33071,

        /**
         * Default scale mode for textures.
         *
         * @static
         * @name SCALE_MODE
         * @memberof PIXI.settings
         * @type {PIXI.SCALE_MODES}
         * @default PIXI.SCALE_MODES.LINEAR
         */
        SCALE_MODE: 1,

        /**
         * Default specify float precision in vertex shader.
         *
         * @static
         * @name PRECISION_VERTEX
         * @memberof PIXI.settings
         * @type {PIXI.PRECISION}
         * @default PIXI.PRECISION.HIGH
         */
        PRECISION_VERTEX: 'highp',

        /**
         * Default specify float precision in fragment shader.
         * iOS is best set at highp due to https://github.com/pixijs/pixi.js/issues/3742
         *
         * @static
         * @name PRECISION_FRAGMENT
         * @memberof PIXI.settings
         * @type {PIXI.PRECISION}
         * @default PIXI.PRECISION.MEDIUM
         */
        PRECISION_FRAGMENT: isMobile$1.apple.device ? 'highp' : 'mediump',

        /**
         * Can we upload the same buffer in a single frame?
         *
         * @static
         * @name CAN_UPLOAD_SAME_BUFFER
         * @memberof PIXI.settings
         * @type {boolean}
         */
        CAN_UPLOAD_SAME_BUFFER: canUploadSameBuffer(),

        /**
         * Enables bitmap creation before image load. This feature is experimental.
         *
         * @static
         * @name CREATE_IMAGE_BITMAP
         * @memberof PIXI.settings
         * @type {boolean}
         * @default false
         */
        CREATE_IMAGE_BITMAP: false,

        /**
         * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
         * Advantages can include sharper image quality (like text) and faster rendering on canvas.
         * The main disadvantage is movement of objects may appear less smooth.
         *
         * @static
         * @constant
         * @memberof PIXI.settings
         * @type {boolean}
         * @default false
         */
        ROUND_PIXELS: false,
    };

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var eventemitter3 = createCommonjsModule(function (module) {

    var has = Object.prototype.hasOwnProperty
      , prefix = '~';

    /**
     * Constructor to create a storage for our `EE` objects.
     * An `Events` instance is a plain object whose properties are event names.
     *
     * @constructor
     * @private
     */
    function Events() {}

    //
    // We try to not inherit from `Object.prototype`. In some engines creating an
    // instance in this way is faster than calling `Object.create(null)` directly.
    // If `Object.create(null)` is not supported we prefix the event names with a
    // character to make sure that the built-in object properties are not
    // overridden or used as an attack vector.
    //
    if (Object.create) {
      Events.prototype = Object.create(null);

      //
      // This hack is needed because the `__proto__` property is still inherited in
      // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
      //
      if (!new Events().__proto__) prefix = false;
    }

    /**
     * Representation of a single event listener.
     *
     * @param {Function} fn The listener function.
     * @param {*} context The context to invoke the listener with.
     * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
     * @constructor
     * @private
     */
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }

    /**
     * Add a listener for a given event.
     *
     * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} context The context to invoke the listener with.
     * @param {Boolean} once Specify if the listener is a one-time listener.
     * @returns {EventEmitter}
     * @private
     */
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== 'function') {
        throw new TypeError('The listener must be a function');
      }

      var listener = new EE(fn, context || emitter, once)
        , evt = prefix ? prefix + event : event;

      if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
      else emitter._events[evt] = [emitter._events[evt], listener];

      return emitter;
    }

    /**
     * Clear event by name.
     *
     * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
     * @param {(String|Symbol)} evt The Event name.
     * @private
     */
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0) emitter._events = new Events();
      else delete emitter._events[evt];
    }

    /**
     * Minimal `EventEmitter` interface that is molded against the Node.js
     * `EventEmitter` interface.
     *
     * @constructor
     * @public
     */
    function EventEmitter() {
      this._events = new Events();
      this._eventsCount = 0;
    }

    /**
     * Return an array listing the events for which the emitter has registered
     * listeners.
     *
     * @returns {Array}
     * @public
     */
    EventEmitter.prototype.eventNames = function eventNames() {
      var names = []
        , events
        , name;

      if (this._eventsCount === 0) return names;

      for (name in (events = this._events)) {
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
      }

      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }

      return names;
    };

    /**
     * Return the listeners registered for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @returns {Array} The registered listeners.
     * @public
     */
    EventEmitter.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event
        , handlers = this._events[evt];

      if (!handlers) return [];
      if (handlers.fn) return [handlers.fn];

      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }

      return ee;
    };

    /**
     * Return the number of listeners listening to a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @returns {Number} The number of listeners.
     * @public
     */
    EventEmitter.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event
        , listeners = this._events[evt];

      if (!listeners) return 0;
      if (listeners.fn) return 1;
      return listeners.length;
    };

    /**
     * Calls each of the listeners registered for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @returns {Boolean} `true` if the event had listeners, else `false`.
     * @public
     */
    EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;

      if (!this._events[evt]) return false;

      var listeners = this._events[evt]
        , len = arguments.length
        , args
        , i;

      if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

        switch (len) {
          case 1: return listeners.fn.call(listeners.context), true;
          case 2: return listeners.fn.call(listeners.context, a1), true;
          case 3: return listeners.fn.call(listeners.context, a1, a2), true;
          case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }

        for (i = 1, args = new Array(len -1); i < len; i++) {
          args[i - 1] = arguments[i];
        }

        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length
          , j;

        for (i = 0; i < length; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

          switch (len) {
            case 1: listeners[i].fn.call(listeners[i].context); break;
            case 2: listeners[i].fn.call(listeners[i].context, a1); break;
            case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
            case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
            default:
              if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
                args[j - 1] = arguments[j];
              }

              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }

      return true;
    };

    /**
     * Add a listener for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} [context=this] The context to invoke the listener with.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };

    /**
     * Add a one-time listener for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} [context=this] The context to invoke the listener with.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };

    /**
     * Remove the listeners of a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn Only remove the listeners that match this function.
     * @param {*} context Only remove the listeners that have this context.
     * @param {Boolean} once Only remove one-time listeners.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;

      if (!this._events[evt]) return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }

      var listeners = this._events[evt];

      if (listeners.fn) {
        if (
          listeners.fn === fn &&
          (!once || listeners.once) &&
          (!context || listeners.context === context)
        ) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (
            listeners[i].fn !== fn ||
            (once && !listeners[i].once) ||
            (context && listeners[i].context !== context)
          ) {
            events.push(listeners[i]);
          }
        }

        //
        // Reset the array, or remove it completely if we have no more listeners.
        //
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt);
      }

      return this;
    };

    /**
     * Remove all listeners, or those of the specified event.
     *
     * @param {(String|Symbol)} [event] The event name.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;

      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }

      return this;
    };

    //
    // Alias methods names because people roll like that.
    //
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.addListener = EventEmitter.prototype.on;

    //
    // Expose the prefix.
    //
    EventEmitter.prefixed = prefix;

    //
    // Allow `EventEmitter` to be imported as module namespace.
    //
    EventEmitter.EventEmitter = EventEmitter;

    //
    // Expose the module.
    //
    {
      module.exports = EventEmitter;
    }
    });

    /*! https://mths.be/punycode v1.4.1 by @mathias */


    /** Highest positive signed 32-bit float value */
    var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1

    /** Bootstring parameters */
    var base = 36;
    var tMin = 1;
    var tMax = 26;
    var skew = 38;
    var damp = 700;
    var initialBias = 72;
    var initialN = 128; // 0x80
    var delimiter = '-'; // '\x2D'
    var regexNonASCII = /[^\x20-\x7E]/; // unprintable ASCII chars + non-ASCII chars
    var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators

    /** Error messages */
    var errors = {
      'overflow': 'Overflow: input needs wider integers to process',
      'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
      'invalid-input': 'Invalid input'
    };

    /** Convenience shortcuts */
    var baseMinusTMin = base - tMin;
    var floor = Math.floor;
    var stringFromCharCode = String.fromCharCode;

    /*--------------------------------------------------------------------------*/

    /**
     * A generic error utility function.
     * @private
     * @param {String} type The error type.
     * @returns {Error} Throws a `RangeError` with the applicable error message.
     */
    function error(type) {
      throw new RangeError(errors[type]);
    }

    /**
     * A generic `Array#map` utility function.
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} callback The function that gets called for every array
     * item.
     * @returns {Array} A new array of values returned by the callback function.
     */
    function map(array, fn) {
      var length = array.length;
      var result = [];
      while (length--) {
        result[length] = fn(array[length]);
      }
      return result;
    }

    /**
     * A simple `Array#map`-like wrapper to work with domain name strings or email
     * addresses.
     * @private
     * @param {String} domain The domain name or email address.
     * @param {Function} callback The function that gets called for every
     * character.
     * @returns {Array} A new string of characters returned by the callback
     * function.
     */
    function mapDomain(string, fn) {
      var parts = string.split('@');
      var result = '';
      if (parts.length > 1) {
        // In email addresses, only the domain name should be punycoded. Leave
        // the local part (i.e. everything up to `@`) intact.
        result = parts[0] + '@';
        string = parts[1];
      }
      // Avoid `split(regex)` for IE8 compatibility. See #17.
      string = string.replace(regexSeparators, '\x2E');
      var labels = string.split('.');
      var encoded = map(labels, fn).join('.');
      return result + encoded;
    }

    /**
     * Creates an array containing the numeric code points of each Unicode
     * character in the string. While JavaScript uses UCS-2 internally,
     * this function will convert a pair of surrogate halves (each of which
     * UCS-2 exposes as separate characters) into a single code point,
     * matching UTF-16.
     * @see `punycode.ucs2.encode`
     * @see <https://mathiasbynens.be/notes/javascript-encoding>
     * @memberOf punycode.ucs2
     * @name decode
     * @param {String} string The Unicode input string (UCS-2).
     * @returns {Array} The new array of code points.
     */
    function ucs2decode(string) {
      var output = [],
        counter = 0,
        length = string.length,
        value,
        extra;
      while (counter < length) {
        value = string.charCodeAt(counter++);
        if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
          // high surrogate, and there is a next character
          extra = string.charCodeAt(counter++);
          if ((extra & 0xFC00) == 0xDC00) { // low surrogate
            output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
          } else {
            // unmatched surrogate; only append this code unit, in case the next
            // code unit is the high surrogate of a surrogate pair
            output.push(value);
            counter--;
          }
        } else {
          output.push(value);
        }
      }
      return output;
    }

    /**
     * Converts a digit/integer into a basic code point.
     * @see `basicToDigit()`
     * @private
     * @param {Number} digit The numeric value of a basic code point.
     * @returns {Number} The basic code point whose value (when used for
     * representing integers) is `digit`, which needs to be in the range
     * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
     * used; else, the lowercase form is used. The behavior is undefined
     * if `flag` is non-zero and `digit` has no uppercase form.
     */
    function digitToBasic(digit, flag) {
      //  0..25 map to ASCII a..z or A..Z
      // 26..35 map to ASCII 0..9
      return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
    }

    /**
     * Bias adaptation function as per section 3.4 of RFC 3492.
     * https://tools.ietf.org/html/rfc3492#section-3.4
     * @private
     */
    function adapt(delta, numPoints, firstTime) {
      var k = 0;
      delta = firstTime ? floor(delta / damp) : delta >> 1;
      delta += floor(delta / numPoints);
      for ( /* no initialization */ ; delta > baseMinusTMin * tMax >> 1; k += base) {
        delta = floor(delta / baseMinusTMin);
      }
      return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
    }

    /**
     * Converts a string of Unicode symbols (e.g. a domain name label) to a
     * Punycode string of ASCII-only symbols.
     * @memberOf punycode
     * @param {String} input The string of Unicode symbols.
     * @returns {String} The resulting Punycode string of ASCII-only symbols.
     */
    function encode(input) {
      var n,
        delta,
        handledCPCount,
        basicLength,
        bias,
        j,
        m,
        q,
        k,
        t,
        currentValue,
        output = [],
        /** `inputLength` will hold the number of code points in `input`. */
        inputLength,
        /** Cached calculation results */
        handledCPCountPlusOne,
        baseMinusT,
        qMinusT;

      // Convert the input in UCS-2 to Unicode
      input = ucs2decode(input);

      // Cache the length
      inputLength = input.length;

      // Initialize the state
      n = initialN;
      delta = 0;
      bias = initialBias;

      // Handle the basic code points
      for (j = 0; j < inputLength; ++j) {
        currentValue = input[j];
        if (currentValue < 0x80) {
          output.push(stringFromCharCode(currentValue));
        }
      }

      handledCPCount = basicLength = output.length;

      // `handledCPCount` is the number of code points that have been handled;
      // `basicLength` is the number of basic code points.

      // Finish the basic string - if it is not empty - with a delimiter
      if (basicLength) {
        output.push(delimiter);
      }

      // Main encoding loop:
      while (handledCPCount < inputLength) {

        // All non-basic code points < n have been handled already. Find the next
        // larger one:
        for (m = maxInt, j = 0; j < inputLength; ++j) {
          currentValue = input[j];
          if (currentValue >= n && currentValue < m) {
            m = currentValue;
          }
        }

        // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
        // but guard against overflow
        handledCPCountPlusOne = handledCPCount + 1;
        if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
          error('overflow');
        }

        delta += (m - n) * handledCPCountPlusOne;
        n = m;

        for (j = 0; j < inputLength; ++j) {
          currentValue = input[j];

          if (currentValue < n && ++delta > maxInt) {
            error('overflow');
          }

          if (currentValue == n) {
            // Represent delta as a generalized variable-length integer
            for (q = delta, k = base; /* no condition */ ; k += base) {
              t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
              if (q < t) {
                break;
              }
              qMinusT = q - t;
              baseMinusT = base - t;
              output.push(
                stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
              );
              q = floor(qMinusT / baseMinusT);
            }

            output.push(stringFromCharCode(digitToBasic(q, 0)));
            bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
            delta = 0;
            ++handledCPCount;
          }
        }

        ++delta;
        ++n;

      }
      return output.join('');
    }

    /**
     * Converts a Unicode string representing a domain name or an email address to
     * Punycode. Only the non-ASCII parts of the domain name will be converted,
     * i.e. it doesn't matter if you call it with a domain that's already in
     * ASCII.
     * @memberOf punycode
     * @param {String} input The domain name or email address to convert, as a
     * Unicode string.
     * @returns {String} The Punycode representation of the given domain name or
     * email address.
     */
    function toASCII(input) {
      return mapDomain(input, function(string) {
        return regexNonASCII.test(string) ?
          'xn--' + encode(string) :
          string;
      });
    }

    // Copyright Joyent, Inc. and other Node contributors.

    function isNull(arg) {
      return arg === null;
    }

    function isNullOrUndefined(arg) {
      return arg == null;
    }

    function isString(arg) {
      return typeof arg === 'string';
    }

    function isObject(arg) {
      return typeof arg === 'object' && arg !== null;
    }

    // Copyright Joyent, Inc. and other Node contributors.

    // If obj.hasOwnProperty has been overridden, then calling
    // obj.hasOwnProperty(prop) will break.
    // See: https://github.com/joyent/node/issues/1707
    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }

    var decode = function(qs, sep, eq, options) {
      sep = sep || '&';
      eq = eq || '=';
      var obj = {};

      if (typeof qs !== 'string' || qs.length === 0) {
        return obj;
      }

      var regexp = /\+/g;
      qs = qs.split(sep);

      var maxKeys = 1000;
      if (options && typeof options.maxKeys === 'number') {
        maxKeys = options.maxKeys;
      }

      var len = qs.length;
      // maxKeys <= 0 means that we should not limit keys count
      if (maxKeys > 0 && len > maxKeys) {
        len = maxKeys;
      }

      for (var i = 0; i < len; ++i) {
        var x = qs[i].replace(regexp, '%20'),
            idx = x.indexOf(eq),
            kstr, vstr, k, v;

        if (idx >= 0) {
          kstr = x.substr(0, idx);
          vstr = x.substr(idx + 1);
        } else {
          kstr = x;
          vstr = '';
        }

        k = decodeURIComponent(kstr);
        v = decodeURIComponent(vstr);

        if (!hasOwnProperty(obj, k)) {
          obj[k] = v;
        } else if (Array.isArray(obj[k])) {
          obj[k].push(v);
        } else {
          obj[k] = [obj[k], v];
        }
      }

      return obj;
    };

    // Copyright Joyent, Inc. and other Node contributors.

    var stringifyPrimitive = function(v) {
      switch (typeof v) {
        case 'string':
          return v;

        case 'boolean':
          return v ? 'true' : 'false';

        case 'number':
          return isFinite(v) ? v : '';

        default:
          return '';
      }
    };

    var encode$1 = function(obj, sep, eq, name) {
      sep = sep || '&';
      eq = eq || '=';
      if (obj === null) {
        obj = undefined;
      }

      if (typeof obj === 'object') {
        return Object.keys(obj).map(function(k) {
          var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
          if (Array.isArray(obj[k])) {
            return obj[k].map(function(v) {
              return ks + encodeURIComponent(stringifyPrimitive(v));
            }).join(sep);
          } else {
            return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
          }
        }).join(sep);

      }

      if (!name) return '';
      return encodeURIComponent(stringifyPrimitive(name)) + eq +
             encodeURIComponent(stringifyPrimitive(obj));
    };

    var querystring = createCommonjsModule(function (module, exports) {

    exports.decode = exports.parse = decode;
    exports.encode = exports.stringify = encode$1;
    });
    var querystring_1 = querystring.decode;
    var querystring_2 = querystring.parse;
    var querystring_3 = querystring.encode;
    var querystring_4 = querystring.stringify;

    // Copyright Joyent, Inc. and other Node contributors.
    function Url() {
      this.protocol = null;
      this.slashes = null;
      this.auth = null;
      this.host = null;
      this.port = null;
      this.hostname = null;
      this.hash = null;
      this.search = null;
      this.query = null;
      this.pathname = null;
      this.path = null;
      this.href = null;
    }

    // Reference: RFC 3986, RFC 1808, RFC 2396

    // define these here so at least they only have to be
    // compiled once on the first module load.
    var protocolPattern = /^([a-z0-9.+-]+:)/i,
      portPattern = /:[0-9]*$/,

      // Special case for a simple path URL
      simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

      // RFC 2396: characters reserved for delimiting URLs.
      // We actually just auto-escape these.
      delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

      // RFC 2396: characters not allowed for various reasons.
      unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

      // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
      autoEscape = ['\''].concat(unwise),
      // Characters that are never ever allowed in a hostname.
      // Note that any invalid chars are also handled, but these
      // are the ones that are *expected* to be seen, so we fast-path
      // them.
      nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
      hostEndingChars = ['/', '?', '#'],
      hostnameMaxLen = 255,
      hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
      hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
      // protocols that can allow "unsafe" and "unwise" chars.
      unsafeProtocol = {
        'javascript': true,
        'javascript:': true
      },
      // protocols that never have a hostname.
      hostlessProtocol = {
        'javascript': true,
        'javascript:': true
      },
      // protocols that always contain a // bit.
      slashedProtocol = {
        'http': true,
        'https': true,
        'ftp': true,
        'gopher': true,
        'file': true,
        'http:': true,
        'https:': true,
        'ftp:': true,
        'gopher:': true,
        'file:': true
      };

    function urlParse(url, parseQueryString, slashesDenoteHost) {
      if (url && isObject(url) && url instanceof Url) return url;

      var u = new Url;
      u.parse(url, parseQueryString, slashesDenoteHost);
      return u;
    }
    Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
      return parse(this, url, parseQueryString, slashesDenoteHost);
    };

    function parse(self, url, parseQueryString, slashesDenoteHost) {
      if (!isString(url)) {
        throw new TypeError('Parameter \'url\' must be a string, not ' + typeof url);
      }

      // Copy chrome, IE, opera backslash-handling behavior.
      // Back slashes before the query string get converted to forward slashes
      // See: https://code.google.com/p/chromium/issues/detail?id=25916
      var queryIndex = url.indexOf('?'),
        splitter =
        (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
        uSplit = url.split(splitter),
        slashRegex = /\\/g;
      uSplit[0] = uSplit[0].replace(slashRegex, '/');
      url = uSplit.join(splitter);

      var rest = url;

      // trim before proceeding.
      // This is to support parse stuff like "  http://foo.com  \n"
      rest = rest.trim();

      if (!slashesDenoteHost && url.split('#').length === 1) {
        // Try fast path regexp
        var simplePath = simplePathPattern.exec(rest);
        if (simplePath) {
          self.path = rest;
          self.href = rest;
          self.pathname = simplePath[1];
          if (simplePath[2]) {
            self.search = simplePath[2];
            if (parseQueryString) {
              self.query = querystring_2(self.search.substr(1));
            } else {
              self.query = self.search.substr(1);
            }
          } else if (parseQueryString) {
            self.search = '';
            self.query = {};
          }
          return self;
        }
      }

      var proto = protocolPattern.exec(rest);
      if (proto) {
        proto = proto[0];
        var lowerProto = proto.toLowerCase();
        self.protocol = lowerProto;
        rest = rest.substr(proto.length);
      }

      // figure out if it's got a host
      // user@server is *always* interpreted as a hostname, and url
      // resolution will treat //foo/bar as host=foo,path=bar because that's
      // how the browser resolves relative URLs.
      if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
        var slashes = rest.substr(0, 2) === '//';
        if (slashes && !(proto && hostlessProtocol[proto])) {
          rest = rest.substr(2);
          self.slashes = true;
        }
      }
      var i, hec, l, p;
      if (!hostlessProtocol[proto] &&
        (slashes || (proto && !slashedProtocol[proto]))) {

        // there's a hostname.
        // the first instance of /, ?, ;, or # ends the host.
        //
        // If there is an @ in the hostname, then non-host chars *are* allowed
        // to the left of the last @ sign, unless some host-ending character
        // comes *before* the @-sign.
        // URLs are obnoxious.
        //
        // ex:
        // http://a@b@c/ => user:a@b host:c
        // http://a@b?@c => user:a host:c path:/?@c

        // v0.12 TODO(isaacs): This is not quite how Chrome does things.
        // Review our test case against browsers more comprehensively.

        // find the first instance of any hostEndingChars
        var hostEnd = -1;
        for (i = 0; i < hostEndingChars.length; i++) {
          hec = rest.indexOf(hostEndingChars[i]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
            hostEnd = hec;
        }

        // at this point, either we have an explicit point where the
        // auth portion cannot go past, or the last @ char is the decider.
        var auth, atSign;
        if (hostEnd === -1) {
          // atSign can be anywhere.
          atSign = rest.lastIndexOf('@');
        } else {
          // atSign must be in auth portion.
          // http://a@b/c@d => host:b auth:a path:/c@d
          atSign = rest.lastIndexOf('@', hostEnd);
        }

        // Now we have a portion which is definitely the auth.
        // Pull that off.
        if (atSign !== -1) {
          auth = rest.slice(0, atSign);
          rest = rest.slice(atSign + 1);
          self.auth = decodeURIComponent(auth);
        }

        // the host is the remaining to the left of the first non-host char
        hostEnd = -1;
        for (i = 0; i < nonHostChars.length; i++) {
          hec = rest.indexOf(nonHostChars[i]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
            hostEnd = hec;
        }
        // if we still have not hit it, then the entire thing is a host.
        if (hostEnd === -1)
          hostEnd = rest.length;

        self.host = rest.slice(0, hostEnd);
        rest = rest.slice(hostEnd);

        // pull out port.
        parseHost(self);

        // we've indicated that there is a hostname,
        // so even if it's empty, it has to be present.
        self.hostname = self.hostname || '';

        // if hostname begins with [ and ends with ]
        // assume that it's an IPv6 address.
        var ipv6Hostname = self.hostname[0] === '[' &&
          self.hostname[self.hostname.length - 1] === ']';

        // validate a little.
        if (!ipv6Hostname) {
          var hostparts = self.hostname.split(/\./);
          for (i = 0, l = hostparts.length; i < l; i++) {
            var part = hostparts[i];
            if (!part) continue;
            if (!part.match(hostnamePartPattern)) {
              var newpart = '';
              for (var j = 0, k = part.length; j < k; j++) {
                if (part.charCodeAt(j) > 127) {
                  // we replace non-ASCII char with a temporary placeholder
                  // we need this to make sure size of hostname is not
                  // broken by replacing non-ASCII by nothing
                  newpart += 'x';
                } else {
                  newpart += part[j];
                }
              }
              // we test again with ASCII char only
              if (!newpart.match(hostnamePartPattern)) {
                var validParts = hostparts.slice(0, i);
                var notHost = hostparts.slice(i + 1);
                var bit = part.match(hostnamePartStart);
                if (bit) {
                  validParts.push(bit[1]);
                  notHost.unshift(bit[2]);
                }
                if (notHost.length) {
                  rest = '/' + notHost.join('.') + rest;
                }
                self.hostname = validParts.join('.');
                break;
              }
            }
          }
        }

        if (self.hostname.length > hostnameMaxLen) {
          self.hostname = '';
        } else {
          // hostnames are always lower case.
          self.hostname = self.hostname.toLowerCase();
        }

        if (!ipv6Hostname) {
          // IDNA Support: Returns a punycoded representation of "domain".
          // It only converts parts of the domain name that
          // have non-ASCII characters, i.e. it doesn't matter if
          // you call it with a domain that already is ASCII-only.
          self.hostname = toASCII(self.hostname);
        }

        p = self.port ? ':' + self.port : '';
        var h = self.hostname || '';
        self.host = h + p;
        self.href += self.host;

        // strip [ and ] from the hostname
        // the host field still retains them, though
        if (ipv6Hostname) {
          self.hostname = self.hostname.substr(1, self.hostname.length - 2);
          if (rest[0] !== '/') {
            rest = '/' + rest;
          }
        }
      }

      // now rest is set to the post-host stuff.
      // chop off any delim chars.
      if (!unsafeProtocol[lowerProto]) {

        // First, make 100% sure that any "autoEscape" chars get
        // escaped, even if encodeURIComponent doesn't think they
        // need to be.
        for (i = 0, l = autoEscape.length; i < l; i++) {
          var ae = autoEscape[i];
          if (rest.indexOf(ae) === -1)
            continue;
          var esc = encodeURIComponent(ae);
          if (esc === ae) {
            esc = escape(ae);
          }
          rest = rest.split(ae).join(esc);
        }
      }


      // chop off from the tail first.
      var hash = rest.indexOf('#');
      if (hash !== -1) {
        // got a fragment string.
        self.hash = rest.substr(hash);
        rest = rest.slice(0, hash);
      }
      var qm = rest.indexOf('?');
      if (qm !== -1) {
        self.search = rest.substr(qm);
        self.query = rest.substr(qm + 1);
        if (parseQueryString) {
          self.query = querystring_2(self.query);
        }
        rest = rest.slice(0, qm);
      } else if (parseQueryString) {
        // no query string, but parseQueryString still requested
        self.search = '';
        self.query = {};
      }
      if (rest) self.pathname = rest;
      if (slashedProtocol[lowerProto] &&
        self.hostname && !self.pathname) {
        self.pathname = '/';
      }

      //to support http.request
      if (self.pathname || self.search) {
        p = self.pathname || '';
        var s = self.search || '';
        self.path = p + s;
      }

      // finally, reconstruct the href based on what has been validated.
      self.href = format(self);
      return self;
    }

    function format(self) {
      var auth = self.auth || '';
      if (auth) {
        auth = encodeURIComponent(auth);
        auth = auth.replace(/%3A/i, ':');
        auth += '@';
      }

      var protocol = self.protocol || '',
        pathname = self.pathname || '',
        hash = self.hash || '',
        host = false,
        query = '';

      if (self.host) {
        host = auth + self.host;
      } else if (self.hostname) {
        host = auth + (self.hostname.indexOf(':') === -1 ?
          self.hostname :
          '[' + this.hostname + ']');
        if (self.port) {
          host += ':' + self.port;
        }
      }

      if (self.query &&
        isObject(self.query) &&
        Object.keys(self.query).length) {
        query = querystring_4(self.query);
      }

      var search = self.search || (query && ('?' + query)) || '';

      if (protocol && protocol.substr(-1) !== ':') protocol += ':';

      // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
      // unless they had them to begin with.
      if (self.slashes ||
        (!protocol || slashedProtocol[protocol]) && host !== false) {
        host = '//' + (host || '');
        if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
      } else if (!host) {
        host = '';
      }

      if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
      if (search && search.charAt(0) !== '?') search = '?' + search;

      pathname = pathname.replace(/[?#]/g, function(match) {
        return encodeURIComponent(match);
      });
      search = search.replace('#', '%23');

      return protocol + host + pathname + search + hash;
    }

    Url.prototype.format = function() {
      return format(this);
    };

    Url.prototype.resolve = function(relative) {
      return this.resolveObject(urlParse(relative, false, true)).format();
    };

    Url.prototype.resolveObject = function(relative) {
      if (isString(relative)) {
        var rel = new Url();
        rel.parse(relative, false, true);
        relative = rel;
      }

      var result = new Url();
      var tkeys = Object.keys(this);
      for (var tk = 0; tk < tkeys.length; tk++) {
        var tkey = tkeys[tk];
        result[tkey] = this[tkey];
      }

      // hash is always overridden, no matter what.
      // even href="" will remove it.
      result.hash = relative.hash;

      // if the relative url is empty, then there's nothing left to do here.
      if (relative.href === '') {
        result.href = result.format();
        return result;
      }

      // hrefs like //foo/bar always cut to the protocol.
      if (relative.slashes && !relative.protocol) {
        // take everything except the protocol from relative
        var rkeys = Object.keys(relative);
        for (var rk = 0; rk < rkeys.length; rk++) {
          var rkey = rkeys[rk];
          if (rkey !== 'protocol')
            result[rkey] = relative[rkey];
        }

        //urlParse appends trailing / to urls like http://www.example.com
        if (slashedProtocol[result.protocol] &&
          result.hostname && !result.pathname) {
          result.path = result.pathname = '/';
        }

        result.href = result.format();
        return result;
      }
      var relPath;
      if (relative.protocol && relative.protocol !== result.protocol) {
        // if it's a known url protocol, then changing
        // the protocol does weird things
        // first, if it's not file:, then we MUST have a host,
        // and if there was a path
        // to begin with, then we MUST have a path.
        // if it is file:, then the host is dropped,
        // because that's known to be hostless.
        // anything else is assumed to be absolute.
        if (!slashedProtocol[relative.protocol]) {
          var keys = Object.keys(relative);
          for (var v = 0; v < keys.length; v++) {
            var k = keys[v];
            result[k] = relative[k];
          }
          result.href = result.format();
          return result;
        }

        result.protocol = relative.protocol;
        if (!relative.host && !hostlessProtocol[relative.protocol]) {
          relPath = (relative.pathname || '').split('/');
          while (relPath.length && !(relative.host = relPath.shift()));
          if (!relative.host) relative.host = '';
          if (!relative.hostname) relative.hostname = '';
          if (relPath[0] !== '') relPath.unshift('');
          if (relPath.length < 2) relPath.unshift('');
          result.pathname = relPath.join('/');
        } else {
          result.pathname = relative.pathname;
        }
        result.search = relative.search;
        result.query = relative.query;
        result.host = relative.host || '';
        result.auth = relative.auth;
        result.hostname = relative.hostname || relative.host;
        result.port = relative.port;
        // to support http.request
        if (result.pathname || result.search) {
          var p = result.pathname || '';
          var s = result.search || '';
          result.path = p + s;
        }
        result.slashes = result.slashes || relative.slashes;
        result.href = result.format();
        return result;
      }

      var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
        isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
        ),
        mustEndAbs = (isRelAbs || isSourceAbs ||
          (result.host && relative.pathname)),
        removeAllDots = mustEndAbs,
        srcPath = result.pathname && result.pathname.split('/') || [],
        psychotic = result.protocol && !slashedProtocol[result.protocol];
      relPath = relative.pathname && relative.pathname.split('/') || [];
      // if the url is a non-slashed url, then relative
      // links like ../.. should be able
      // to crawl up to the hostname, as well.  This is strange.
      // result.protocol has already been set by now.
      // Later on, put the first path part into the host field.
      if (psychotic) {
        result.hostname = '';
        result.port = null;
        if (result.host) {
          if (srcPath[0] === '') srcPath[0] = result.host;
          else srcPath.unshift(result.host);
        }
        result.host = '';
        if (relative.protocol) {
          relative.hostname = null;
          relative.port = null;
          if (relative.host) {
            if (relPath[0] === '') relPath[0] = relative.host;
            else relPath.unshift(relative.host);
          }
          relative.host = null;
        }
        mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
      }
      var authInHost;
      if (isRelAbs) {
        // it's absolute.
        result.host = (relative.host || relative.host === '') ?
          relative.host : result.host;
        result.hostname = (relative.hostname || relative.hostname === '') ?
          relative.hostname : result.hostname;
        result.search = relative.search;
        result.query = relative.query;
        srcPath = relPath;
        // fall through to the dot-handling below.
      } else if (relPath.length) {
        // it's relative
        // throw away the existing file, and take the new path instead.
        if (!srcPath) srcPath = [];
        srcPath.pop();
        srcPath = srcPath.concat(relPath);
        result.search = relative.search;
        result.query = relative.query;
      } else if (!isNullOrUndefined(relative.search)) {
        // just pull out the search.
        // like href='?foo'.
        // Put this after the other two cases because it simplifies the booleans
        if (psychotic) {
          result.hostname = result.host = srcPath.shift();
          //occationaly the auth can get stuck only in host
          //this especially happens in cases like
          //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
          authInHost = result.host && result.host.indexOf('@') > 0 ?
            result.host.split('@') : false;
          if (authInHost) {
            result.auth = authInHost.shift();
            result.host = result.hostname = authInHost.shift();
          }
        }
        result.search = relative.search;
        result.query = relative.query;
        //to support http.request
        if (!isNull(result.pathname) || !isNull(result.search)) {
          result.path = (result.pathname ? result.pathname : '') +
            (result.search ? result.search : '');
        }
        result.href = result.format();
        return result;
      }

      if (!srcPath.length) {
        // no path at all.  easy.
        // we've already handled the other stuff above.
        result.pathname = null;
        //to support http.request
        if (result.search) {
          result.path = '/' + result.search;
        } else {
          result.path = null;
        }
        result.href = result.format();
        return result;
      }

      // if a url ENDs in . or .., then it must get a trailing slash.
      // however, if it ends in anything else non-slashy,
      // then it must NOT get a trailing slash.
      var last = srcPath.slice(-1)[0];
      var hasTrailingSlash = (
        (result.host || relative.host || srcPath.length > 1) &&
        (last === '.' || last === '..') || last === '');

      // strip single dots, resolve double dots to parent dir
      // if the path tries to go above the root, `up` ends up > 0
      var up = 0;
      for (var i = srcPath.length; i >= 0; i--) {
        last = srcPath[i];
        if (last === '.') {
          srcPath.splice(i, 1);
        } else if (last === '..') {
          srcPath.splice(i, 1);
          up++;
        } else if (up) {
          srcPath.splice(i, 1);
          up--;
        }
      }

      // if the path is allowed to go above the root, restore leading ..s
      if (!mustEndAbs && !removeAllDots) {
        for (; up--; up) {
          srcPath.unshift('..');
        }
      }

      if (mustEndAbs && srcPath[0] !== '' &&
        (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
        srcPath.unshift('');
      }

      if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
        srcPath.push('');
      }

      var isAbsolute = srcPath[0] === '' ||
        (srcPath[0] && srcPath[0].charAt(0) === '/');

      // put the host back
      if (psychotic) {
        result.hostname = result.host = isAbsolute ? '' :
          srcPath.length ? srcPath.shift() : '';
        //occationaly the auth can get stuck only in host
        //this especially happens in cases like
        //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
        authInHost = result.host && result.host.indexOf('@') > 0 ?
          result.host.split('@') : false;
        if (authInHost) {
          result.auth = authInHost.shift();
          result.host = result.hostname = authInHost.shift();
        }
      }

      mustEndAbs = mustEndAbs || (result.host && srcPath.length);

      if (mustEndAbs && !isAbsolute) {
        srcPath.unshift('');
      }

      if (!srcPath.length) {
        result.pathname = null;
        result.path = null;
      } else {
        result.pathname = srcPath.join('/');
      }

      //to support request.http
      if (!isNull(result.pathname) || !isNull(result.search)) {
        result.path = (result.pathname ? result.pathname : '') +
          (result.search ? result.search : '');
      }
      result.auth = relative.auth || result.auth;
      result.slashes = result.slashes || relative.slashes;
      result.href = result.format();
      return result;
    };

    Url.prototype.parseHost = function() {
      return parseHost(this);
    };

    function parseHost(self) {
      var host = self.host;
      var port = portPattern.exec(host);
      if (port) {
        port = port[0];
        if (port !== ':') {
          self.port = port.substr(1);
        }
        host = host.substr(0, host.length - port.length);
      }
      if (host) self.hostname = host;
    }

    /*!
     * @pixi/constants - v5.2.1
     * Compiled Tue, 28 Jan 2020 23:33:11 UTC
     *
     * @pixi/constants is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */
    /**
     * Different types of environments for WebGL.
     *
     * @static
     * @memberof PIXI
     * @name ENV
     * @enum {number}
     * @property {number} WEBGL_LEGACY - Used for older v1 WebGL devices. PixiJS will aim to ensure compatibility
     *  with older / less advanced devices. If you experience unexplained flickering prefer this environment.
     * @property {number} WEBGL - Version 1 of WebGL
     * @property {number} WEBGL2 - Version 2 of WebGL
     */
    var ENV;
    (function (ENV) {
        ENV[ENV["WEBGL_LEGACY"] = 0] = "WEBGL_LEGACY";
        ENV[ENV["WEBGL"] = 1] = "WEBGL";
        ENV[ENV["WEBGL2"] = 2] = "WEBGL2";
    })(ENV || (ENV = {}));
    /**
     * Constant to identify the Renderer Type.
     *
     * @static
     * @memberof PIXI
     * @name RENDERER_TYPE
     * @enum {number}
     * @property {number} UNKNOWN - Unknown render type.
     * @property {number} WEBGL - WebGL render type.
     * @property {number} CANVAS - Canvas render type.
     */
    var RENDERER_TYPE;
    (function (RENDERER_TYPE) {
        RENDERER_TYPE[RENDERER_TYPE["UNKNOWN"] = 0] = "UNKNOWN";
        RENDERER_TYPE[RENDERER_TYPE["WEBGL"] = 1] = "WEBGL";
        RENDERER_TYPE[RENDERER_TYPE["CANVAS"] = 2] = "CANVAS";
    })(RENDERER_TYPE || (RENDERER_TYPE = {}));
    /**
     * Various blend modes supported by PIXI.
     *
     * IMPORTANT - The WebGL renderer only supports the NORMAL, ADD, MULTIPLY and SCREEN blend modes.
     * Anything else will silently act like NORMAL.
     *
     * @memberof PIXI
     * @name BLEND_MODES
     * @enum {number}
     * @property {number} NORMAL
     * @property {number} ADD
     * @property {number} MULTIPLY
     * @property {number} SCREEN
     * @property {number} OVERLAY
     * @property {number} DARKEN
     * @property {number} LIGHTEN
     * @property {number} COLOR_DODGE
     * @property {number} COLOR_BURN
     * @property {number} HARD_LIGHT
     * @property {number} SOFT_LIGHT
     * @property {number} DIFFERENCE
     * @property {number} EXCLUSION
     * @property {number} HUE
     * @property {number} SATURATION
     * @property {number} COLOR
     * @property {number} LUMINOSITY
     * @property {number} NORMAL_NPM
     * @property {number} ADD_NPM
     * @property {number} SCREEN_NPM
     * @property {number} NONE
     * @property {number} SRC_IN
     * @property {number} SRC_OUT
     * @property {number} SRC_ATOP
     * @property {number} DST_OVER
     * @property {number} DST_IN
     * @property {number} DST_OUT
     * @property {number} DST_ATOP
     * @property {number} SUBTRACT
     * @property {number} SRC_OVER
     * @property {number} ERASE
     * @property {number} XOR
     */
    var BLEND_MODES;
    (function (BLEND_MODES) {
        BLEND_MODES[BLEND_MODES["NORMAL"] = 0] = "NORMAL";
        BLEND_MODES[BLEND_MODES["ADD"] = 1] = "ADD";
        BLEND_MODES[BLEND_MODES["MULTIPLY"] = 2] = "MULTIPLY";
        BLEND_MODES[BLEND_MODES["SCREEN"] = 3] = "SCREEN";
        BLEND_MODES[BLEND_MODES["OVERLAY"] = 4] = "OVERLAY";
        BLEND_MODES[BLEND_MODES["DARKEN"] = 5] = "DARKEN";
        BLEND_MODES[BLEND_MODES["LIGHTEN"] = 6] = "LIGHTEN";
        BLEND_MODES[BLEND_MODES["COLOR_DODGE"] = 7] = "COLOR_DODGE";
        BLEND_MODES[BLEND_MODES["COLOR_BURN"] = 8] = "COLOR_BURN";
        BLEND_MODES[BLEND_MODES["HARD_LIGHT"] = 9] = "HARD_LIGHT";
        BLEND_MODES[BLEND_MODES["SOFT_LIGHT"] = 10] = "SOFT_LIGHT";
        BLEND_MODES[BLEND_MODES["DIFFERENCE"] = 11] = "DIFFERENCE";
        BLEND_MODES[BLEND_MODES["EXCLUSION"] = 12] = "EXCLUSION";
        BLEND_MODES[BLEND_MODES["HUE"] = 13] = "HUE";
        BLEND_MODES[BLEND_MODES["SATURATION"] = 14] = "SATURATION";
        BLEND_MODES[BLEND_MODES["COLOR"] = 15] = "COLOR";
        BLEND_MODES[BLEND_MODES["LUMINOSITY"] = 16] = "LUMINOSITY";
        BLEND_MODES[BLEND_MODES["NORMAL_NPM"] = 17] = "NORMAL_NPM";
        BLEND_MODES[BLEND_MODES["ADD_NPM"] = 18] = "ADD_NPM";
        BLEND_MODES[BLEND_MODES["SCREEN_NPM"] = 19] = "SCREEN_NPM";
        BLEND_MODES[BLEND_MODES["NONE"] = 20] = "NONE";
        BLEND_MODES[BLEND_MODES["SRC_OVER"] = 0] = "SRC_OVER";
        BLEND_MODES[BLEND_MODES["SRC_IN"] = 21] = "SRC_IN";
        BLEND_MODES[BLEND_MODES["SRC_OUT"] = 22] = "SRC_OUT";
        BLEND_MODES[BLEND_MODES["SRC_ATOP"] = 23] = "SRC_ATOP";
        BLEND_MODES[BLEND_MODES["DST_OVER"] = 24] = "DST_OVER";
        BLEND_MODES[BLEND_MODES["DST_IN"] = 25] = "DST_IN";
        BLEND_MODES[BLEND_MODES["DST_OUT"] = 26] = "DST_OUT";
        BLEND_MODES[BLEND_MODES["DST_ATOP"] = 27] = "DST_ATOP";
        BLEND_MODES[BLEND_MODES["ERASE"] = 26] = "ERASE";
        BLEND_MODES[BLEND_MODES["SUBTRACT"] = 28] = "SUBTRACT";
        BLEND_MODES[BLEND_MODES["XOR"] = 29] = "XOR";
    })(BLEND_MODES || (BLEND_MODES = {}));
    /**
     * Various webgl draw modes. These can be used to specify which GL drawMode to use
     * under certain situations and renderers.
     *
     * @memberof PIXI
     * @static
     * @name DRAW_MODES
     * @enum {number}
     * @property {number} POINTS
     * @property {number} LINES
     * @property {number} LINE_LOOP
     * @property {number} LINE_STRIP
     * @property {number} TRIANGLES
     * @property {number} TRIANGLE_STRIP
     * @property {number} TRIANGLE_FAN
     */
    var DRAW_MODES;
    (function (DRAW_MODES) {
        DRAW_MODES[DRAW_MODES["POINTS"] = 0] = "POINTS";
        DRAW_MODES[DRAW_MODES["LINES"] = 1] = "LINES";
        DRAW_MODES[DRAW_MODES["LINE_LOOP"] = 2] = "LINE_LOOP";
        DRAW_MODES[DRAW_MODES["LINE_STRIP"] = 3] = "LINE_STRIP";
        DRAW_MODES[DRAW_MODES["TRIANGLES"] = 4] = "TRIANGLES";
        DRAW_MODES[DRAW_MODES["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
        DRAW_MODES[DRAW_MODES["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
    })(DRAW_MODES || (DRAW_MODES = {}));
    /**
     * Various GL texture/resources formats.
     *
     * @memberof PIXI
     * @static
     * @name FORMATS
     * @enum {number}
     * @property {number} RGBA=6408
     * @property {number} RGB=6407
     * @property {number} ALPHA=6406
     * @property {number} LUMINANCE=6409
     * @property {number} LUMINANCE_ALPHA=6410
     * @property {number} DEPTH_COMPONENT=6402
     * @property {number} DEPTH_STENCIL=34041
     */
    var FORMATS;
    (function (FORMATS) {
        FORMATS[FORMATS["RGBA"] = 6408] = "RGBA";
        FORMATS[FORMATS["RGB"] = 6407] = "RGB";
        FORMATS[FORMATS["ALPHA"] = 6406] = "ALPHA";
        FORMATS[FORMATS["LUMINANCE"] = 6409] = "LUMINANCE";
        FORMATS[FORMATS["LUMINANCE_ALPHA"] = 6410] = "LUMINANCE_ALPHA";
        FORMATS[FORMATS["DEPTH_COMPONENT"] = 6402] = "DEPTH_COMPONENT";
        FORMATS[FORMATS["DEPTH_STENCIL"] = 34041] = "DEPTH_STENCIL";
    })(FORMATS || (FORMATS = {}));
    /**
     * Various GL target types.
     *
     * @memberof PIXI
     * @static
     * @name TARGETS
     * @enum {number}
     * @property {number} TEXTURE_2D=3553
     * @property {number} TEXTURE_CUBE_MAP=34067
     * @property {number} TEXTURE_2D_ARRAY=35866
     * @property {number} TEXTURE_CUBE_MAP_POSITIVE_X=34069
     * @property {number} TEXTURE_CUBE_MAP_NEGATIVE_X=34070
     * @property {number} TEXTURE_CUBE_MAP_POSITIVE_Y=34071
     * @property {number} TEXTURE_CUBE_MAP_NEGATIVE_Y=34072
     * @property {number} TEXTURE_CUBE_MAP_POSITIVE_Z=34073
     * @property {number} TEXTURE_CUBE_MAP_NEGATIVE_Z=34074
     */
    var TARGETS;
    (function (TARGETS) {
        TARGETS[TARGETS["TEXTURE_2D"] = 3553] = "TEXTURE_2D";
        TARGETS[TARGETS["TEXTURE_CUBE_MAP"] = 34067] = "TEXTURE_CUBE_MAP";
        TARGETS[TARGETS["TEXTURE_2D_ARRAY"] = 35866] = "TEXTURE_2D_ARRAY";
        TARGETS[TARGETS["TEXTURE_CUBE_MAP_POSITIVE_X"] = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X";
        TARGETS[TARGETS["TEXTURE_CUBE_MAP_NEGATIVE_X"] = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X";
        TARGETS[TARGETS["TEXTURE_CUBE_MAP_POSITIVE_Y"] = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y";
        TARGETS[TARGETS["TEXTURE_CUBE_MAP_NEGATIVE_Y"] = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y";
        TARGETS[TARGETS["TEXTURE_CUBE_MAP_POSITIVE_Z"] = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z";
        TARGETS[TARGETS["TEXTURE_CUBE_MAP_NEGATIVE_Z"] = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z";
    })(TARGETS || (TARGETS = {}));
    /**
     * Various GL data format types.
     *
     * @memberof PIXI
     * @static
     * @name TYPES
     * @enum {number}
     * @property {number} UNSIGNED_BYTE=5121
     * @property {number} UNSIGNED_SHORT=5123
     * @property {number} UNSIGNED_SHORT_5_6_5=33635
     * @property {number} UNSIGNED_SHORT_4_4_4_4=32819
     * @property {number} UNSIGNED_SHORT_5_5_5_1=32820
     * @property {number} FLOAT=5126
     * @property {number} HALF_FLOAT=36193
     */
    var TYPES;
    (function (TYPES) {
        TYPES[TYPES["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
        TYPES[TYPES["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
        TYPES[TYPES["UNSIGNED_SHORT_5_6_5"] = 33635] = "UNSIGNED_SHORT_5_6_5";
        TYPES[TYPES["UNSIGNED_SHORT_4_4_4_4"] = 32819] = "UNSIGNED_SHORT_4_4_4_4";
        TYPES[TYPES["UNSIGNED_SHORT_5_5_5_1"] = 32820] = "UNSIGNED_SHORT_5_5_5_1";
        TYPES[TYPES["FLOAT"] = 5126] = "FLOAT";
        TYPES[TYPES["HALF_FLOAT"] = 36193] = "HALF_FLOAT";
    })(TYPES || (TYPES = {}));
    /**
     * The scale modes that are supported by pixi.
     *
     * The {@link PIXI.settings.SCALE_MODE} scale mode affects the default scaling mode of future operations.
     * It can be re-assigned to either LINEAR or NEAREST, depending upon suitability.
     *
     * @memberof PIXI
     * @static
     * @name SCALE_MODES
     * @enum {number}
     * @property {number} LINEAR Smooth scaling
     * @property {number} NEAREST Pixelating scaling
     */
    var SCALE_MODES;
    (function (SCALE_MODES) {
        SCALE_MODES[SCALE_MODES["NEAREST"] = 0] = "NEAREST";
        SCALE_MODES[SCALE_MODES["LINEAR"] = 1] = "LINEAR";
    })(SCALE_MODES || (SCALE_MODES = {}));
    /**
     * The wrap modes that are supported by pixi.
     *
     * The {@link PIXI.settings.WRAP_MODE} wrap mode affects the default wrapping mode of future operations.
     * It can be re-assigned to either CLAMP or REPEAT, depending upon suitability.
     * If the texture is non power of two then clamp will be used regardless as WebGL can
     * only use REPEAT if the texture is po2.
     *
     * This property only affects WebGL.
     *
     * @name WRAP_MODES
     * @memberof PIXI
     * @static
     * @enum {number}
     * @property {number} CLAMP - The textures uvs are clamped
     * @property {number} REPEAT - The texture uvs tile and repeat
     * @property {number} MIRRORED_REPEAT - The texture uvs tile and repeat with mirroring
     */
    var WRAP_MODES;
    (function (WRAP_MODES) {
        WRAP_MODES[WRAP_MODES["CLAMP"] = 33071] = "CLAMP";
        WRAP_MODES[WRAP_MODES["REPEAT"] = 10497] = "REPEAT";
        WRAP_MODES[WRAP_MODES["MIRRORED_REPEAT"] = 33648] = "MIRRORED_REPEAT";
    })(WRAP_MODES || (WRAP_MODES = {}));
    /**
     * Mipmap filtering modes that are supported by pixi.
     *
     * The {@link PIXI.settings.MIPMAP_TEXTURES} affects default texture filtering.
     * Mipmaps are generated for a baseTexture if its `mipmap` field is `ON`,
     * or its `POW2` and texture dimensions are powers of 2.
     * Due to platform restriction, `ON` option will work like `POW2` for webgl-1.
     *
     * This property only affects WebGL.
     *
     * @name MIPMAP_MODES
     * @memberof PIXI
     * @static
     * @enum {number}
     * @property {number} OFF - No mipmaps
     * @property {number} POW2 - Generate mipmaps if texture dimensions are pow2
     * @property {number} ON - Always generate mipmaps
     */
    var MIPMAP_MODES;
    (function (MIPMAP_MODES) {
        MIPMAP_MODES[MIPMAP_MODES["OFF"] = 0] = "OFF";
        MIPMAP_MODES[MIPMAP_MODES["POW2"] = 1] = "POW2";
        MIPMAP_MODES[MIPMAP_MODES["ON"] = 2] = "ON";
    })(MIPMAP_MODES || (MIPMAP_MODES = {}));
    /**
     * How to treat textures with premultiplied alpha
     *
     * @name ALPHA_MODES
     * @memberof PIXI
     * @static
     * @enum {number}
     * @property {number} NO_PREMULTIPLIED_ALPHA - Source is not premultiplied, leave it like that.
     *  Option for compressed and data textures that are created from typed arrays.
     * @property {number} PREMULTIPLY_ON_UPLOAD - Source is not premultiplied, premultiply on upload.
     *  Default option, used for all loaded images.
     * @property {number} PREMULTIPLIED_ALPHA - Source is already premultiplied
     *  Example: spine atlases with `_pma` suffix.
     * @property {number} NPM - Alias for NO_PREMULTIPLIED_ALPHA.
     * @property {number} UNPACK - Default option, alias for PREMULTIPLY_ON_UPLOAD.
     * @property {number} PMA - Alias for PREMULTIPLIED_ALPHA.
     */
    var ALPHA_MODES;
    (function (ALPHA_MODES) {
        ALPHA_MODES[ALPHA_MODES["NPM"] = 0] = "NPM";
        ALPHA_MODES[ALPHA_MODES["UNPACK"] = 1] = "UNPACK";
        ALPHA_MODES[ALPHA_MODES["PMA"] = 2] = "PMA";
        ALPHA_MODES[ALPHA_MODES["NO_PREMULTIPLIED_ALPHA"] = 0] = "NO_PREMULTIPLIED_ALPHA";
        ALPHA_MODES[ALPHA_MODES["PREMULTIPLY_ON_UPLOAD"] = 1] = "PREMULTIPLY_ON_UPLOAD";
        ALPHA_MODES[ALPHA_MODES["PREMULTIPLY_ALPHA"] = 2] = "PREMULTIPLY_ALPHA";
    })(ALPHA_MODES || (ALPHA_MODES = {}));
    /**
     * The gc modes that are supported by pixi.
     *
     * The {@link PIXI.settings.GC_MODE} Garbage Collection mode for PixiJS textures is AUTO
     * If set to GC_MODE, the renderer will occasionally check textures usage. If they are not
     * used for a specified period of time they will be removed from the GPU. They will of course
     * be uploaded again when they are required. This is a silent behind the scenes process that
     * should ensure that the GPU does not  get filled up.
     *
     * Handy for mobile devices!
     * This property only affects WebGL.
     *
     * @name GC_MODES
     * @enum {number}
     * @static
     * @memberof PIXI
     * @property {number} AUTO - Garbage collection will happen periodically automatically
     * @property {number} MANUAL - Garbage collection will need to be called manually
     */
    var GC_MODES;
    (function (GC_MODES) {
        GC_MODES[GC_MODES["AUTO"] = 0] = "AUTO";
        GC_MODES[GC_MODES["MANUAL"] = 1] = "MANUAL";
    })(GC_MODES || (GC_MODES = {}));
    /**
     * Constants that specify float precision in shaders.
     *
     * @name PRECISION
     * @memberof PIXI
     * @constant
     * @static
     * @enum {string}
     * @property {string} LOW='lowp'
     * @property {string} MEDIUM='mediump'
     * @property {string} HIGH='highp'
     */
    var PRECISION;
    (function (PRECISION) {
        PRECISION["LOW"] = "lowp";
        PRECISION["MEDIUM"] = "mediump";
        PRECISION["HIGH"] = "highp";
    })(PRECISION || (PRECISION = {}));
    /**
     * Constants for mask implementations.
     * We use `type` suffix because it leads to very different behaviours
     *
     * @name MASK_TYPES
     * @memberof PIXI
     * @static
     * @enum {number}
     * @property {number} NONE - Mask is ignored
     * @property {number} SCISSOR - Scissor mask, rectangle on screen, cheap
     * @property {number} STENCIL - Stencil mask, 1-bit, medium, works only if renderer supports stencil
     * @property {number} SPRITE - Mask that uses SpriteMaskFilter, uses temporary RenderTexture
     */
    var MASK_TYPES;
    (function (MASK_TYPES) {
        MASK_TYPES[MASK_TYPES["NONE"] = 0] = "NONE";
        MASK_TYPES[MASK_TYPES["SCISSOR"] = 1] = "SCISSOR";
        MASK_TYPES[MASK_TYPES["STENCIL"] = 2] = "STENCIL";
        MASK_TYPES[MASK_TYPES["SPRITE"] = 3] = "SPRITE";
    })(MASK_TYPES || (MASK_TYPES = {}));

    /*!
     * @pixi/utils - v5.2.1
     * Compiled Tue, 28 Jan 2020 23:33:11 UTC
     *
     * @pixi/utils is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    /**
     * The prefix that denotes a URL is for a retina asset.
     *
     * @static
     * @name RETINA_PREFIX
     * @memberof PIXI.settings
     * @type {RegExp}
     * @default /@([0-9\.]+)x/
     * @example `@2x`
     */
    settings.RETINA_PREFIX = /@([0-9\.]+)x/;
    /**
     * Should the `failIfMajorPerformanceCaveat` flag be enabled as a context option used in the `isWebGLSupported` function.
     * For most scenarios this should be left as true, as otherwise the user may have a poor experience.
     * However, it can be useful to disable under certain scenarios, such as headless unit tests.
     *
     * @static
     * @name FAIL_IF_MAJOR_PERFORMANCE_CAVEAT
     * @memberof PIXI.settings
     * @type {boolean}
     * @default true
     */
    settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = true;

    /**
     * Converts a hexadecimal color number to an [R, G, B] array of normalized floats (numbers from 0.0 to 1.0).
     *
     * @example
     * PIXI.utils.hex2rgb(0xffffff); // returns [1, 1, 1]
     * @memberof PIXI.utils
     * @function hex2rgb
     * @param {number} hex - The hexadecimal number to convert
     * @param  {number[]} [out=[]] If supplied, this array will be used rather than returning a new one
     * @return {number[]} An array representing the [R, G, B] of the color where all values are floats.
     */
    function hex2rgb(hex, out) {
        out = out || [];
        out[0] = ((hex >> 16) & 0xFF) / 255;
        out[1] = ((hex >> 8) & 0xFF) / 255;
        out[2] = (hex & 0xFF) / 255;
        return out;
    }
    /**
     * Converts a color as an [R, G, B] array of normalized floats to a hexadecimal number.
     *
     * @example
     * PIXI.utils.rgb2hex([1, 1, 1]); // returns 0xffffff
     * @memberof PIXI.utils
     * @function rgb2hex
     * @param {number[]} rgb - Array of numbers where all values are normalized floats from 0.0 to 1.0.
     * @return {number} Number in hexadecimal.
     */
    function rgb2hex(rgb) {
        return (((rgb[0] * 255) << 16) + ((rgb[1] * 255) << 8) + (rgb[2] * 255 | 0));
    }

    /**
     * Corrects PixiJS blend, takes premultiplied alpha into account
     *
     * @memberof PIXI.utils
     * @function mapPremultipliedBlendModes
     * @private
     * @return {Array<number[]>} Mapped modes.
     */
    function mapPremultipliedBlendModes() {
        var pm = [];
        var npm = [];
        for (var i = 0; i < 32; i++) {
            pm[i] = i;
            npm[i] = i;
        }
        pm[BLEND_MODES.NORMAL_NPM] = BLEND_MODES.NORMAL;
        pm[BLEND_MODES.ADD_NPM] = BLEND_MODES.ADD;
        pm[BLEND_MODES.SCREEN_NPM] = BLEND_MODES.SCREEN;
        npm[BLEND_MODES.NORMAL] = BLEND_MODES.NORMAL_NPM;
        npm[BLEND_MODES.ADD] = BLEND_MODES.ADD_NPM;
        npm[BLEND_MODES.SCREEN] = BLEND_MODES.SCREEN_NPM;
        var array = [];
        array.push(npm);
        array.push(pm);
        return array;
    }
    /**
     * maps premultiply flag and blendMode to adjusted blendMode
     * @memberof PIXI.utils
     * @const premultiplyBlendMode
     * @type {Array<number[]>}
     */
    var premultiplyBlendMode = mapPremultipliedBlendModes();
    /**
     * premultiplies tint
     *
     * @memberof PIXI.utils
     * @function premultiplyTint
     * @param {number} tint integer RGB
     * @param {number} alpha floating point alpha (0.0-1.0)
     * @returns {number} tint multiplied by alpha
     */
    function premultiplyTint(tint, alpha) {
        if (alpha === 1.0) {
            return (alpha * 255 << 24) + tint;
        }
        if (alpha === 0.0) {
            return 0;
        }
        var R = ((tint >> 16) & 0xFF);
        var G = ((tint >> 8) & 0xFF);
        var B = (tint & 0xFF);
        R = ((R * alpha) + 0.5) | 0;
        G = ((G * alpha) + 0.5) | 0;
        B = ((B * alpha) + 0.5) | 0;
        return (alpha * 255 << 24) + (R << 16) + (G << 8) + B;
    }

    // Taken from the bit-twiddle package
    /**
     * Rounds to next power of two.
     *
     * @function nextPow2
     * @memberof PIXI.utils
     * @param {number} v input value
     * @return {number}
     */
    function nextPow2(v) {
        v += v === 0 ? 1 : 0;
        --v;
        v |= v >>> 1;
        v |= v >>> 2;
        v |= v >>> 4;
        v |= v >>> 8;
        v |= v >>> 16;
        return v + 1;
    }
    /**
     * Checks if a number is a power of two.
     *
     * @function isPow2
     * @memberof PIXI.utils
     * @param {number} v input value
     * @return {boolean} `true` if value is power of two
     */
    function isPow2(v) {
        return !(v & (v - 1)) && (!!v);
    }
    /**
     * Computes ceil of log base 2
     *
     * @function log2
     * @memberof PIXI.utils
     * @param {number} v input value
     * @return {number} logarithm base 2
     */
    function log2(v) {
        var r = (v > 0xFFFF ? 1 : 0) << 4;
        v >>>= r;
        var shift = (v > 0xFF ? 1 : 0) << 3;
        v >>>= shift;
        r |= shift;
        shift = (v > 0xF ? 1 : 0) << 2;
        v >>>= shift;
        r |= shift;
        shift = (v > 0x3 ? 1 : 0) << 1;
        v >>>= shift;
        r |= shift;
        return r | (v >> 1);
    }

    var nextUid = 0;
    /**
     * Gets the next unique identifier
     *
     * @memberof PIXI.utils
     * @function uid
     * @return {number} The next unique identifier to use.
     */
    function uid() {
        return ++nextUid;
    }

    /**
     * @todo Describe property usage
     *
     * @static
     * @name ProgramCache
     * @memberof PIXI.utils
     * @type {Object}
     */
    var ProgramCache = {};
    /**
     * @todo Describe property usage
     *
     * @static
     * @name TextureCache
     * @memberof PIXI.utils
     * @type {Object}
     */
    var TextureCache = Object.create(null);
    /**
     * @todo Describe property usage
     *
     * @static
     * @name BaseTextureCache
     * @memberof PIXI.utils
     * @type {Object}
     */
    var BaseTextureCache = Object.create(null);

    /**
     * Creates a Canvas element of the given size to be used as a target for rendering to.
     *
     * @class
     * @memberof PIXI.utils
     */
    var CanvasRenderTarget = /** @class */ (function () {
        /**
         * @param {number} width - the width for the newly created canvas
         * @param {number} height - the height for the newly created canvas
         * @param {number} [resolution=1] - The resolution / device pixel ratio of the canvas
         */
        function CanvasRenderTarget(width, height, resolution) {
            /**
             * The Canvas object that belongs to this CanvasRenderTarget.
             *
             * @member {HTMLCanvasElement}
             */
            this.canvas = document.createElement('canvas');
            /**
             * A CanvasRenderingContext2D object representing a two-dimensional rendering context.
             *
             * @member {CanvasRenderingContext2D}
             */
            this.context = this.canvas.getContext('2d');
            this.resolution = resolution || settings.RESOLUTION;
            this.resize(width, height);
        }
        /**
         * Clears the canvas that was created by the CanvasRenderTarget class.
         *
         * @private
         */
        CanvasRenderTarget.prototype.clear = function () {
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        };
        /**
         * Resizes the canvas to the specified width and height.
         *
         * @param {number} width - the new width of the canvas
         * @param {number} height - the new height of the canvas
         */
        CanvasRenderTarget.prototype.resize = function (width, height) {
            this.canvas.width = width * this.resolution;
            this.canvas.height = height * this.resolution;
        };
        /**
         * Destroys this canvas.
         *
         */
        CanvasRenderTarget.prototype.destroy = function () {
            this.context = null;
            this.canvas = null;
        };
        Object.defineProperty(CanvasRenderTarget.prototype, "width", {
            /**
             * The width of the canvas buffer in pixels.
             *
             * @member {number}
             */
            get: function () {
                return this.canvas.width;
            },
            set: function (val) {
                this.canvas.width = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CanvasRenderTarget.prototype, "height", {
            /**
             * The height of the canvas buffer in pixels.
             *
             * @member {number}
             */
            get: function () {
                return this.canvas.height;
            },
            set: function (val) {
                this.canvas.height = val;
            },
            enumerable: true,
            configurable: true
        });
        return CanvasRenderTarget;
    }());

    var tempAnchor;
    /**
     * Sets the `crossOrigin` property for this resource based on if the url
     * for this resource is cross-origin. If crossOrigin was manually set, this
     * function does nothing.
     * Nipped from the resource loader!
     *
     * @ignore
     * @param {string} url - The url to test.
     * @param {object} [loc=window.location] - The location object to test against.
     * @return {string} The crossOrigin value to use (or empty string for none).
     */
    function determineCrossOrigin(url, loc) {
        if (loc === void 0) { loc = window.location; }
        // data: and javascript: urls are considered same-origin
        if (url.indexOf('data:') === 0) {
            return '';
        }
        // default is window.location
        loc = loc || window.location;
        if (!tempAnchor) {
            tempAnchor = document.createElement('a');
        }
        // let the browser determine the full href for the url of this resource and then
        // parse with the node url lib, we can't use the properties of the anchor element
        // because they don't work in IE9 :(
        tempAnchor.href = url;
        var parsedUrl = urlParse(tempAnchor.href);
        var samePort = (!parsedUrl.port && loc.port === '') || (parsedUrl.port === loc.port);
        // if cross origin
        if (parsedUrl.hostname !== loc.hostname || !samePort || parsedUrl.protocol !== loc.protocol) {
            return 'anonymous';
        }
        return '';
    }

    /**
     * get the resolution / device pixel ratio of an asset by looking for the prefix
     * used by spritesheets and image urls
     *
     * @memberof PIXI.utils
     * @function getResolutionOfUrl
     * @param {string} url - the image path
     * @param {number} [defaultValue=1] - the defaultValue if no filename prefix is set.
     * @return {number} resolution / device pixel ratio of an asset
     */
    function getResolutionOfUrl(url, defaultValue) {
        var resolution = settings.RETINA_PREFIX.exec(url);
        if (resolution) {
            return parseFloat(resolution[1]);
        }
        return defaultValue !== undefined ? defaultValue : 1;
    }

    /*!
     * @pixi/ticker - v5.2.1
     * Compiled Tue, 28 Jan 2020 23:33:11 UTC
     *
     * @pixi/ticker is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    /**
     * Target frames per millisecond.
     *
     * @static
     * @name TARGET_FPMS
     * @memberof PIXI.settings
     * @type {number}
     * @default 0.06
     */
    settings.TARGET_FPMS = 0.06;

    /**
     * Represents the update priorities used by internal PIXI classes when registered with
     * the {@link PIXI.Ticker} object. Higher priority items are updated first and lower
     * priority items, such as render, should go later.
     *
     * @static
     * @constant
     * @name UPDATE_PRIORITY
     * @memberof PIXI
     * @enum {number}
     * @property {number} INTERACTION=50 Highest priority, used for {@link PIXI.interaction.InteractionManager}
     * @property {number} HIGH=25 High priority updating, {@link PIXI.VideoBaseTexture} and {@link PIXI.AnimatedSprite}
     * @property {number} NORMAL=0 Default priority for ticker events, see {@link PIXI.Ticker#add}.
     * @property {number} LOW=-25 Low priority used for {@link PIXI.Application} rendering.
     * @property {number} UTILITY=-50 Lowest priority used for {@link PIXI.prepare.BasePrepare} utility.
     */
    var UPDATE_PRIORITY;
    (function (UPDATE_PRIORITY) {
        UPDATE_PRIORITY[UPDATE_PRIORITY["INTERACTION"] = 50] = "INTERACTION";
        UPDATE_PRIORITY[UPDATE_PRIORITY["HIGH"] = 25] = "HIGH";
        UPDATE_PRIORITY[UPDATE_PRIORITY["NORMAL"] = 0] = "NORMAL";
        UPDATE_PRIORITY[UPDATE_PRIORITY["LOW"] = -25] = "LOW";
        UPDATE_PRIORITY[UPDATE_PRIORITY["UTILITY"] = -50] = "UTILITY";
    })(UPDATE_PRIORITY || (UPDATE_PRIORITY = {}));

    /**
     * Internal class for handling the priority sorting of ticker handlers.
     *
     * @private
     * @class
     * @memberof PIXI
     */
    var TickerListener = /** @class */ (function () {
        /**
         * Constructor
         * @private
         * @param {Function} fn - The listener function to be added for one update
         * @param {*} [context=null] - The listener context
         * @param {number} [priority=0] - The priority for emitting
         * @param {boolean} [once=false] - If the handler should fire once
         */
        function TickerListener(fn, context, priority, once) {
            if (context === void 0) { context = null; }
            if (priority === void 0) { priority = 0; }
            if (once === void 0) { once = false; }
            /**
             * The handler function to execute.
             * @private
             * @member {Function}
             */
            this.fn = fn;
            /**
             * The calling to execute.
             * @private
             * @member {*}
             */
            this.context = context;
            /**
             * The current priority.
             * @private
             * @member {number}
             */
            this.priority = priority;
            /**
             * If this should only execute once.
             * @private
             * @member {boolean}
             */
            this.once = once;
            /**
             * The next item in chain.
             * @private
             * @member {TickerListener}
             */
            this.next = null;
            /**
             * The previous item in chain.
             * @private
             * @member {TickerListener}
             */
            this.previous = null;
            /**
             * `true` if this listener has been destroyed already.
             * @member {boolean}
             * @private
             */
            this._destroyed = false;
        }
        /**
         * Simple compare function to figure out if a function and context match.
         * @private
         * @param {Function} fn - The listener function to be added for one update
         * @param {any} [context] - The listener context
         * @return {boolean} `true` if the listener match the arguments
         */
        TickerListener.prototype.match = function (fn, context) {
            if (context === void 0) { context = null; }
            return this.fn === fn && this.context === context;
        };
        /**
         * Emit by calling the current function.
         * @private
         * @param {number} deltaTime - time since the last emit.
         * @return {TickerListener} Next ticker
         */
        TickerListener.prototype.emit = function (deltaTime) {
            if (this.fn) {
                if (this.context) {
                    this.fn.call(this.context, deltaTime);
                }
                else {
                    this.fn(deltaTime);
                }
            }
            var redirect = this.next;
            if (this.once) {
                this.destroy(true);
            }
            // Soft-destroying should remove
            // the next reference
            if (this._destroyed) {
                this.next = null;
            }
            return redirect;
        };
        /**
         * Connect to the list.
         * @private
         * @param {TickerListener} previous - Input node, previous listener
         */
        TickerListener.prototype.connect = function (previous) {
            this.previous = previous;
            if (previous.next) {
                previous.next.previous = this;
            }
            this.next = previous.next;
            previous.next = this;
        };
        /**
         * Destroy and don't use after this.
         * @private
         * @param {boolean} [hard = false] `true` to remove the `next` reference, this
         *        is considered a hard destroy. Soft destroy maintains the next reference.
         * @return {TickerListener} The listener to redirect while emitting or removing.
         */
        TickerListener.prototype.destroy = function (hard) {
            if (hard === void 0) { hard = false; }
            this._destroyed = true;
            this.fn = null;
            this.context = null;
            // Disconnect, hook up next and previous
            if (this.previous) {
                this.previous.next = this.next;
            }
            if (this.next) {
                this.next.previous = this.previous;
            }
            // Redirect to the next item
            var redirect = this.next;
            // Remove references
            this.next = hard ? null : redirect;
            this.previous = null;
            return redirect;
        };
        return TickerListener;
    }());

    /**
     * A Ticker class that runs an update loop that other objects listen to.
     *
     * This class is composed around listeners meant for execution on the next requested animation frame.
     * Animation frames are requested only when necessary, e.g. When the ticker is started and the emitter has listeners.
     *
     * @class
     * @memberof PIXI
     */
    var Ticker = /** @class */ (function () {
        function Ticker() {
            var _this = this;
            /**
             * The first listener. All new listeners added are chained on this.
             * @private
             * @type {TickerListener}
             */
            this._head = new TickerListener(null, null, Infinity);
            /**
             * Internal current frame request ID
             * @type {?number}
             * @private
             */
            this._requestId = null;
            /**
             * Internal value managed by minFPS property setter and getter.
             * This is the maximum allowed milliseconds between updates.
             * @type {number}
             * @private
             */
            this._maxElapsedMS = 100;
            /**
             * Internal value managed by maxFPS property setter and getter.
             * This is the minimum allowed milliseconds between updates.
             * @type {number}
             * @private
             */
            this._minElapsedMS = 0;
            /**
             * Whether or not this ticker should invoke the method
             * {@link PIXI.Ticker#start} automatically
             * when a listener is added.
             *
             * @member {boolean}
             * @default false
             */
            this.autoStart = false;
            /**
             * Scalar time value from last frame to this frame.
             * This value is capped by setting {@link PIXI.Ticker#minFPS}
             * and is scaled with {@link PIXI.Ticker#speed}.
             * **Note:** The cap may be exceeded by scaling.
             *
             * @member {number}
             * @default 1
             */
            this.deltaTime = 1;
            /**
             * Scaler time elapsed in milliseconds from last frame to this frame.
             * This value is capped by setting {@link PIXI.Ticker#minFPS}
             * and is scaled with {@link PIXI.Ticker#speed}.
             * **Note:** The cap may be exceeded by scaling.
             * If the platform supports DOMHighResTimeStamp,
             * this value will have a precision of 1 µs.
             * Defaults to target frame time
             *
             * @member {number}
             * @default 16.66
             */
            this.deltaMS = 1 / settings.TARGET_FPMS;
            /**
             * Time elapsed in milliseconds from last frame to this frame.
             * Opposed to what the scalar {@link PIXI.Ticker#deltaTime}
             * is based, this value is neither capped nor scaled.
             * If the platform supports DOMHighResTimeStamp,
             * this value will have a precision of 1 µs.
             * Defaults to target frame time
             *
             * @member {number}
             * @default 16.66
             */
            this.elapsedMS = 1 / settings.TARGET_FPMS;
            /**
             * The last time {@link PIXI.Ticker#update} was invoked.
             * This value is also reset internally outside of invoking
             * update, but only when a new animation frame is requested.
             * If the platform supports DOMHighResTimeStamp,
             * this value will have a precision of 1 µs.
             *
             * @member {number}
             * @default -1
             */
            this.lastTime = -1;
            /**
             * Factor of current {@link PIXI.Ticker#deltaTime}.
             * @example
             * // Scales ticker.deltaTime to what would be
             * // the equivalent of approximately 120 FPS
             * ticker.speed = 2;
             *
             * @member {number}
             * @default 1
             */
            this.speed = 1;
            /**
             * Whether or not this ticker has been started.
             * `true` if {@link PIXI.Ticker#start} has been called.
             * `false` if {@link PIXI.Ticker#stop} has been called.
             * While `false`, this value may change to `true` in the
             * event of {@link PIXI.Ticker#autoStart} being `true`
             * and a listener is added.
             *
             * @member {boolean}
             * @default false
             */
            this.started = false;
            /**
             * If enabled, deleting is disabled.
             * @member {boolean}
             * @default false
             * @private
             */
            this._protected = false;
            /**
             * The last time keyframe was executed.
             * Maintains a relatively fixed interval with the previous value.
             * @member {number}
             * @default -1
             * @private
             */
            this._lastFrame = -1;
            /**
             * Internal tick method bound to ticker instance.
             * This is because in early 2015, Function.bind
             * is still 60% slower in high performance scenarios.
             * Also separating frame requests from update method
             * so listeners may be called at any time and with
             * any animation API, just invoke ticker.update(time).
             *
             * @private
             * @param {number} time - Time since last tick.
             */
            this._tick = function (time) {
                _this._requestId = null;
                if (_this.started) {
                    // Invoke listeners now
                    _this.update(time);
                    // Listener side effects may have modified ticker state.
                    if (_this.started && _this._requestId === null && _this._head.next) {
                        _this._requestId = requestAnimationFrame(_this._tick);
                    }
                }
            };
        }
        /**
         * Conditionally requests a new animation frame.
         * If a frame has not already been requested, and if the internal
         * emitter has listeners, a new frame is requested.
         *
         * @private
         */
        Ticker.prototype._requestIfNeeded = function () {
            if (this._requestId === null && this._head.next) {
                // ensure callbacks get correct delta
                this.lastTime = performance.now();
                this._lastFrame = this.lastTime;
                this._requestId = requestAnimationFrame(this._tick);
            }
        };
        /**
         * Conditionally cancels a pending animation frame.
         *
         * @private
         */
        Ticker.prototype._cancelIfNeeded = function () {
            if (this._requestId !== null) {
                cancelAnimationFrame(this._requestId);
                this._requestId = null;
            }
        };
        /**
         * Conditionally requests a new animation frame.
         * If the ticker has been started it checks if a frame has not already
         * been requested, and if the internal emitter has listeners. If these
         * conditions are met, a new frame is requested. If the ticker has not
         * been started, but autoStart is `true`, then the ticker starts now,
         * and continues with the previous conditions to request a new frame.
         *
         * @private
         */
        Ticker.prototype._startIfPossible = function () {
            if (this.started) {
                this._requestIfNeeded();
            }
            else if (this.autoStart) {
                this.start();
            }
        };
        /**
         * Register a handler for tick events. Calls continuously unless
         * it is removed or the ticker is stopped.
         *
         * @param {Function} fn - The listener function to be added for updates
         * @param {*} [context] - The listener context
         * @param {number} [priority=PIXI.UPDATE_PRIORITY.NORMAL] - The priority for emitting
         * @returns {PIXI.Ticker} This instance of a ticker
         */
        Ticker.prototype.add = function (fn, context, priority) {
            if (priority === void 0) { priority = UPDATE_PRIORITY.NORMAL; }
            return this._addListener(new TickerListener(fn, context, priority));
        };
        /**
         * Add a handler for the tick event which is only execute once.
         *
         * @param {Function} fn - The listener function to be added for one update
         * @param {*} [context] - The listener context
         * @param {number} [priority=PIXI.UPDATE_PRIORITY.NORMAL] - The priority for emitting
         * @returns {PIXI.Ticker} This instance of a ticker
         */
        Ticker.prototype.addOnce = function (fn, context, priority) {
            if (priority === void 0) { priority = UPDATE_PRIORITY.NORMAL; }
            return this._addListener(new TickerListener(fn, context, priority, true));
        };
        /**
         * Internally adds the event handler so that it can be sorted by priority.
         * Priority allows certain handler (user, AnimatedSprite, Interaction) to be run
         * before the rendering.
         *
         * @private
         * @param {TickerListener} listener - Current listener being added.
         * @returns {PIXI.Ticker} This instance of a ticker
         */
        Ticker.prototype._addListener = function (listener) {
            // For attaching to head
            var current = this._head.next;
            var previous = this._head;
            // Add the first item
            if (!current) {
                listener.connect(previous);
            }
            else {
                // Go from highest to lowest priority
                while (current) {
                    if (listener.priority > current.priority) {
                        listener.connect(previous);
                        break;
                    }
                    previous = current;
                    current = current.next;
                }
                // Not yet connected
                if (!listener.previous) {
                    listener.connect(previous);
                }
            }
            this._startIfPossible();
            return this;
        };
        /**
         * Removes any handlers matching the function and context parameters.
         * If no handlers are left after removing, then it cancels the animation frame.
         *
         * @param {Function} fn - The listener function to be removed
         * @param {*} [context] - The listener context to be removed
         * @returns {PIXI.Ticker} This instance of a ticker
         */
        Ticker.prototype.remove = function (fn, context) {
            var listener = this._head.next;
            while (listener) {
                // We found a match, lets remove it
                // no break to delete all possible matches
                // incase a listener was added 2+ times
                if (listener.match(fn, context)) {
                    listener = listener.destroy();
                }
                else {
                    listener = listener.next;
                }
            }
            if (!this._head.next) {
                this._cancelIfNeeded();
            }
            return this;
        };
        Object.defineProperty(Ticker.prototype, "count", {
            /**
             * Counts the number of listeners on this ticker.
             *
             * @returns {number} The number of listeners on this ticker
             */
            get: function () {
                if (!this._head) {
                    return 0;
                }
                var count = 0;
                var current = this._head;
                while ((current = current.next)) {
                    count++;
                }
                return count;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Starts the ticker. If the ticker has listeners
         * a new animation frame is requested at this point.
         */
        Ticker.prototype.start = function () {
            if (!this.started) {
                this.started = true;
                this._requestIfNeeded();
            }
        };
        /**
         * Stops the ticker. If the ticker has requested
         * an animation frame it is canceled at this point.
         */
        Ticker.prototype.stop = function () {
            if (this.started) {
                this.started = false;
                this._cancelIfNeeded();
            }
        };
        /**
         * Destroy the ticker and don't use after this. Calling
         * this method removes all references to internal events.
         */
        Ticker.prototype.destroy = function () {
            if (!this._protected) {
                this.stop();
                var listener = this._head.next;
                while (listener) {
                    listener = listener.destroy(true);
                }
                this._head.destroy();
                this._head = null;
            }
        };
        /**
         * Triggers an update. An update entails setting the
         * current {@link PIXI.Ticker#elapsedMS},
         * the current {@link PIXI.Ticker#deltaTime},
         * invoking all listeners with current deltaTime,
         * and then finally setting {@link PIXI.Ticker#lastTime}
         * with the value of currentTime that was provided.
         * This method will be called automatically by animation
         * frame callbacks if the ticker instance has been started
         * and listeners are added.
         *
         * @param {number} [currentTime=performance.now()] - the current time of execution
         */
        Ticker.prototype.update = function (currentTime) {
            if (currentTime === void 0) { currentTime = performance.now(); }
            var elapsedMS;
            // If the difference in time is zero or negative, we ignore most of the work done here.
            // If there is no valid difference, then should be no reason to let anyone know about it.
            // A zero delta, is exactly that, nothing should update.
            //
            // The difference in time can be negative, and no this does not mean time traveling.
            // This can be the result of a race condition between when an animation frame is requested
            // on the current JavaScript engine event loop, and when the ticker's start method is invoked
            // (which invokes the internal _requestIfNeeded method). If a frame is requested before
            // _requestIfNeeded is invoked, then the callback for the animation frame the ticker requests,
            // can receive a time argument that can be less than the lastTime value that was set within
            // _requestIfNeeded. This difference is in microseconds, but this is enough to cause problems.
            //
            // This check covers this browser engine timing issue, as well as if consumers pass an invalid
            // currentTime value. This may happen if consumers opt-out of the autoStart, and update themselves.
            if (currentTime > this.lastTime) {
                // Save uncapped elapsedMS for measurement
                elapsedMS = this.elapsedMS = currentTime - this.lastTime;
                // cap the milliseconds elapsed used for deltaTime
                if (elapsedMS > this._maxElapsedMS) {
                    elapsedMS = this._maxElapsedMS;
                }
                elapsedMS *= this.speed;
                // If not enough time has passed, exit the function.
                // Get ready for next frame by setting _lastFrame, but based on _minElapsedMS
                // adjustment to ensure a relatively stable interval.
                if (this._minElapsedMS) {
                    var delta = currentTime - this._lastFrame | 0;
                    if (delta < this._minElapsedMS) {
                        return;
                    }
                    this._lastFrame = currentTime - (delta % this._minElapsedMS);
                }
                this.deltaMS = elapsedMS;
                this.deltaTime = this.deltaMS * settings.TARGET_FPMS;
                // Cache a local reference, in-case ticker is destroyed
                // during the emit, we can still check for head.next
                var head = this._head;
                // Invoke listeners added to internal emitter
                var listener = head.next;
                while (listener) {
                    listener = listener.emit(this.deltaTime);
                }
                if (!head.next) {
                    this._cancelIfNeeded();
                }
            }
            else {
                this.deltaTime = this.deltaMS = this.elapsedMS = 0;
            }
            this.lastTime = currentTime;
        };
        Object.defineProperty(Ticker.prototype, "FPS", {
            /**
             * The frames per second at which this ticker is running.
             * The default is approximately 60 in most modern browsers.
             * **Note:** This does not factor in the value of
             * {@link PIXI.Ticker#speed}, which is specific
             * to scaling {@link PIXI.Ticker#deltaTime}.
             *
             * @member {number}
             * @readonly
             */
            get: function () {
                return 1000 / this.elapsedMS;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ticker.prototype, "minFPS", {
            /**
             * Manages the maximum amount of milliseconds allowed to
             * elapse between invoking {@link PIXI.Ticker#update}.
             * This value is used to cap {@link PIXI.Ticker#deltaTime},
             * but does not effect the measured value of {@link PIXI.Ticker#FPS}.
             * When setting this property it is clamped to a value between
             * `0` and `PIXI.settings.TARGET_FPMS * 1000`.
             *
             * @member {number}
             * @default 10
             */
            get: function () {
                return 1000 / this._maxElapsedMS;
            },
            set: function (fps) {
                // Minimum must be below the maxFPS
                var minFPS = Math.min(this.maxFPS, fps);
                // Must be at least 0, but below 1 / settings.TARGET_FPMS
                var minFPMS = Math.min(Math.max(0, minFPS) / 1000, settings.TARGET_FPMS);
                this._maxElapsedMS = 1 / minFPMS;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ticker.prototype, "maxFPS", {
            /**
             * Manages the minimum amount of milliseconds required to
             * elapse between invoking {@link PIXI.Ticker#update}.
             * This will effect the measured value of {@link PIXI.Ticker#FPS}.
             * If it is set to `0`, then there is no limit; PixiJS will render as many frames as it can.
             * Otherwise it will be at least `minFPS`
             *
             * @member {number}
             * @default 0
             */
            get: function () {
                if (this._minElapsedMS) {
                    return Math.round(1000 / this._minElapsedMS);
                }
                return 0;
            },
            set: function (fps) {
                if (fps === 0) {
                    this._minElapsedMS = 0;
                }
                else {
                    // Max must be at least the minFPS
                    var maxFPS = Math.max(this.minFPS, fps);
                    this._minElapsedMS = 1 / (maxFPS / 1000);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ticker, "shared", {
            /**
             * The shared ticker instance used by {@link PIXI.AnimatedSprite} and by
             * {@link PIXI.VideoResource} to update animation frames / video textures.
             *
             * It may also be used by {@link PIXI.Application} if created with the `sharedTicker` option property set to true.
             *
             * The property {@link PIXI.Ticker#autoStart} is set to `true` for this instance.
             * Please follow the examples for usage, including how to opt-out of auto-starting the shared ticker.
             *
             * @example
             * let ticker = PIXI.Ticker.shared;
             * // Set this to prevent starting this ticker when listeners are added.
             * // By default this is true only for the PIXI.Ticker.shared instance.
             * ticker.autoStart = false;
             * // FYI, call this to ensure the ticker is stopped. It should be stopped
             * // if you have not attempted to render anything yet.
             * ticker.stop();
             * // Call this when you are ready for a running shared ticker.
             * ticker.start();
             *
             * @example
             * // You may use the shared ticker to render...
             * let renderer = PIXI.autoDetectRenderer();
             * let stage = new PIXI.Container();
             * document.body.appendChild(renderer.view);
             * ticker.add(function (time) {
             *     renderer.render(stage);
             * });
             *
             * @example
             * // Or you can just update it manually.
             * ticker.autoStart = false;
             * ticker.stop();
             * function animate(time) {
             *     ticker.update(time);
             *     renderer.render(stage);
             *     requestAnimationFrame(animate);
             * }
             * animate(performance.now());
             *
             * @member {PIXI.Ticker}
             * @static
             */
            get: function () {
                if (!Ticker._shared) {
                    var shared = Ticker._shared = new Ticker();
                    shared.autoStart = true;
                    shared._protected = true;
                }
                return Ticker._shared;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ticker, "system", {
            /**
             * The system ticker instance used by {@link PIXI.interaction.InteractionManager} and by
             * {@link PIXI.BasePrepare} for core timing functionality that shouldn't usually need to be paused,
             * unlike the `shared` ticker which drives visual animations and rendering which may want to be paused.
             *
             * The property {@link PIXI.Ticker#autoStart} is set to `true` for this instance.
             *
             * @member {PIXI.Ticker}
             * @static
             */
            get: function () {
                if (!Ticker._system) {
                    var system = Ticker._system = new Ticker();
                    system.autoStart = true;
                    system._protected = true;
                }
                return Ticker._system;
            },
            enumerable: true,
            configurable: true
        });
        return Ticker;
    }());

    /*!
     * @pixi/math - v5.2.1
     * Compiled Tue, 28 Jan 2020 23:33:11 UTC
     *
     * @pixi/math is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */
    /**
     * Common interface for points. Both Point and ObservablePoint implement it
     * @memberof PIXI
     * @interface IPoint
     */
    /**
     * X coord
     * @memberof PIXI.IPoint#
     * @member {number} x
     */
    /**
     * Y coord
     * @memberof PIXI.IPoint#
     * @member {number} y
     */
    /**
     * Sets the point to a new x and y position.
     * If y is omitted, both x and y will be set to x.
     *
     * @method set
     * @memberof PIXI.IPoint#
     * @param {number} [x=0] - position of the point on the x axis
     * @param {number} [y=x] - position of the point on the y axis
     */
    /**
     * Copies x and y from the given point
     * @method copyFrom
     * @memberof PIXI.IPoint#
     * @param {PIXI.IPoint} p - The point to copy from
     * @returns {this} Returns itself.
     */
    /**
     * Copies x and y into the given point
     * @method copyTo
     * @memberof PIXI.IPoint#
     * @param {PIXI.IPoint} p - The point to copy.
     * @returns {PIXI.IPoint} Given point with values updated
     */
    /**
     * Returns true if the given point is equal to this point
     *
     * @method equals
     * @memberof PIXI.IPoint#
     * @param {PIXI.IPoint} p - The point to check
     * @returns {boolean} Whether the given point equal to this point
     */

    /**
     * The Point object represents a location in a two-dimensional coordinate system, where x represents
     * the horizontal axis and y represents the vertical axis.
     *
     * @class
     * @memberof PIXI
     * @implements IPoint
     */
    var Point = /** @class */ (function () {
        /**
         * @param {number} [x=0] - position of the point on the x axis
         * @param {number} [y=0] - position of the point on the y axis
         */
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            /**
             * @member {number}
             * @default 0
             */
            this.x = x;
            /**
             * @member {number}
             * @default 0
             */
            this.y = y;
        }
        /**
         * Creates a clone of this point
         *
         * @return {PIXI.Point} a copy of the point
         */
        Point.prototype.clone = function () {
            return new Point(this.x, this.y);
        };
        /**
         * Copies x and y from the given point
         *
         * @param {PIXI.IPoint} p - The point to copy from
         * @returns {this} Returns itself.
         */
        Point.prototype.copyFrom = function (p) {
            this.set(p.x, p.y);
            return this;
        };
        /**
         * Copies x and y into the given point
         *
         * @param {PIXI.IPoint} p - The point to copy.
         * @returns {PIXI.IPoint} Given point with values updated
         */
        Point.prototype.copyTo = function (p) {
            p.set(this.x, this.y);
            return p;
        };
        /**
         * Returns true if the given point is equal to this point
         *
         * @param {PIXI.IPoint} p - The point to check
         * @returns {boolean} Whether the given point equal to this point
         */
        Point.prototype.equals = function (p) {
            return (p.x === this.x) && (p.y === this.y);
        };
        /**
         * Sets the point to a new x and y position.
         * If y is omitted, both x and y will be set to x.
         *
         * @param {number} [x=0] - position of the point on the x axis
         * @param {number} [y=x] - position of the point on the y axis
         * @returns {this} Returns itself.
         */
        Point.prototype.set = function (x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = x; }
            this.x = x;
            this.y = y;
            return this;
        };
        return Point;
    }());

    /**
     * The Point object represents a location in a two-dimensional coordinate system, where x represents
     * the horizontal axis and y represents the vertical axis.
     *
     * An ObservablePoint is a point that triggers a callback when the point's position is changed.
     *
     * @class
     * @memberof PIXI
     * @implements IPoint
     */
    var ObservablePoint = /** @class */ (function () {
        /**
         * @param {Function} cb - callback when changed
         * @param {object} scope - owner of callback
         * @param {number} [x=0] - position of the point on the x axis
         * @param {number} [y=0] - position of the point on the y axis
         */
        function ObservablePoint(cb, scope, x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this._x = x;
            this._y = y;
            this.cb = cb;
            this.scope = scope;
        }
        /**
         * Creates a clone of this point.
         * The callback and scope params can be overidden otherwise they will default
         * to the clone object's values.
         *
         * @override
         * @param {Function} [cb=null] - callback when changed
         * @param {object} [scope=null] - owner of callback
         * @return {PIXI.ObservablePoint} a copy of the point
         */
        ObservablePoint.prototype.clone = function (cb, scope) {
            if (cb === void 0) { cb = this.cb; }
            if (scope === void 0) { scope = this.scope; }
            return new ObservablePoint(cb, scope, this._x, this._y);
        };
        /**
         * Sets the point to a new x and y position.
         * If y is omitted, both x and y will be set to x.
         *
         * @param {number} [x=0] - position of the point on the x axis
         * @param {number} [y=x] - position of the point on the y axis
         * @returns {this} Returns itself.
         */
        ObservablePoint.prototype.set = function (x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = x; }
            if (this._x !== x || this._y !== y) {
                this._x = x;
                this._y = y;
                this.cb.call(this.scope);
            }
            return this;
        };
        /**
         * Copies x and y from the given point
         *
         * @param {PIXI.IPoint} p - The point to copy from.
         * @returns {this} Returns itself.
         */
        ObservablePoint.prototype.copyFrom = function (p) {
            if (this._x !== p.x || this._y !== p.y) {
                this._x = p.x;
                this._y = p.y;
                this.cb.call(this.scope);
            }
            return this;
        };
        /**
         * Copies x and y into the given point
         *
         * @param {PIXI.IPoint} p - The point to copy.
         * @returns {PIXI.IPoint} Given point with values updated
         */
        ObservablePoint.prototype.copyTo = function (p) {
            p.set(this._x, this._y);
            return p;
        };
        /**
         * Returns true if the given point is equal to this point
         *
         * @param {PIXI.IPoint} p - The point to check
         * @returns {boolean} Whether the given point equal to this point
         */
        ObservablePoint.prototype.equals = function (p) {
            return (p.x === this._x) && (p.y === this._y);
        };
        Object.defineProperty(ObservablePoint.prototype, "x", {
            /**
             * The position of the displayObject on the x axis relative to the local coordinates of the parent.
             *
             * @member {number}
             */
            get: function () {
                return this._x;
            },
            set: function (value) {
                if (this._x !== value) {
                    this._x = value;
                    this.cb.call(this.scope);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObservablePoint.prototype, "y", {
            /**
             * The position of the displayObject on the x axis relative to the local coordinates of the parent.
             *
             * @member {number}
             */
            get: function () {
                return this._y;
            },
            set: function (value) {
                if (this._y !== value) {
                    this._y = value;
                    this.cb.call(this.scope);
                }
            },
            enumerable: true,
            configurable: true
        });
        return ObservablePoint;
    }());

    /**
     * Two Pi.
     *
     * @static
     * @constant {number} PI_2
     * @memberof PIXI
     */
    var PI_2 = Math.PI * 2;
    /**
     * Conversion factor for converting radians to degrees.
     *
     * @static
     * @constant {number} RAD_TO_DEG
     * @memberof PIXI
     */
    var RAD_TO_DEG = 180 / Math.PI;
    /**
     * Conversion factor for converting degrees to radians.
     *
     * @static
     * @constant {number} DEG_TO_RAD
     * @memberof PIXI
     */
    var DEG_TO_RAD = Math.PI / 180;
    var SHAPES;
    (function (SHAPES) {
        SHAPES[SHAPES["POLY"] = 0] = "POLY";
        SHAPES[SHAPES["RECT"] = 1] = "RECT";
        SHAPES[SHAPES["CIRC"] = 2] = "CIRC";
        SHAPES[SHAPES["ELIP"] = 3] = "ELIP";
        SHAPES[SHAPES["RREC"] = 4] = "RREC";
    })(SHAPES || (SHAPES = {}));
    /**
     * Constants that identify shapes, mainly to prevent `instanceof` calls.
     *
     * @static
     * @constant
     * @name SHAPES
     * @memberof PIXI
     * @type {enum}
     * @property {number} POLY Polygon
     * @property {number} RECT Rectangle
     * @property {number} CIRC Circle
     * @property {number} ELIP Ellipse
     * @property {number} RREC Rounded Rectangle
     * @enum {number}
     */

    /**
     * The PixiJS Matrix as a class makes it a lot faster.
     *
     * Here is a representation of it:
     * ```js
     * | a | c | tx|
     * | b | d | ty|
     * | 0 | 0 | 1 |
     * ```
     * @class
     * @memberof PIXI
     */
    var Matrix = /** @class */ (function () {
        /**
         * @param {number} [a=1] - x scale
         * @param {number} [b=0] - x skew
         * @param {number} [c=0] - y skew
         * @param {number} [d=1] - y scale
         * @param {number} [tx=0] - x translation
         * @param {number} [ty=0] - y translation
         */
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.array = null;
            /**
             * @member {number}
             * @default 1
             */
            this.a = a;
            /**
             * @member {number}
             * @default 0
             */
            this.b = b;
            /**
             * @member {number}
             * @default 0
             */
            this.c = c;
            /**
             * @member {number}
             * @default 1
             */
            this.d = d;
            /**
             * @member {number}
             * @default 0
             */
            this.tx = tx;
            /**
             * @member {number}
             * @default 0
             */
            this.ty = ty;
        }
        /**
         * Creates a Matrix object based on the given array. The Element to Matrix mapping order is as follows:
         *
         * a = array[0]
         * b = array[1]
         * c = array[3]
         * d = array[4]
         * tx = array[2]
         * ty = array[5]
         *
         * @param {number[]} array - The array that the matrix will be populated from.
         */
        Matrix.prototype.fromArray = function (array) {
            this.a = array[0];
            this.b = array[1];
            this.c = array[3];
            this.d = array[4];
            this.tx = array[2];
            this.ty = array[5];
        };
        /**
         * sets the matrix properties
         *
         * @param {number} a - Matrix component
         * @param {number} b - Matrix component
         * @param {number} c - Matrix component
         * @param {number} d - Matrix component
         * @param {number} tx - Matrix component
         * @param {number} ty - Matrix component
         *
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */
        Matrix.prototype.set = function (a, b, c, d, tx, ty) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
            return this;
        };
        /**
         * Creates an array from the current Matrix object.
         *
         * @param {boolean} transpose - Whether we need to transpose the matrix or not
         * @param {Float32Array} [out=new Float32Array(9)] - If provided the array will be assigned to out
         * @return {number[]} the newly created array which contains the matrix
         */
        Matrix.prototype.toArray = function (transpose, out) {
            if (!this.array) {
                this.array = new Float32Array(9);
            }
            var array = out || this.array;
            if (transpose) {
                array[0] = this.a;
                array[1] = this.b;
                array[2] = 0;
                array[3] = this.c;
                array[4] = this.d;
                array[5] = 0;
                array[6] = this.tx;
                array[7] = this.ty;
                array[8] = 1;
            }
            else {
                array[0] = this.a;
                array[1] = this.c;
                array[2] = this.tx;
                array[3] = this.b;
                array[4] = this.d;
                array[5] = this.ty;
                array[6] = 0;
                array[7] = 0;
                array[8] = 1;
            }
            return array;
        };
        /**
         * Get a new position with the current transformation applied.
         * Can be used to go from a child's coordinate space to the world coordinate space. (e.g. rendering)
         *
         * @param {PIXI.Point} pos - The origin
         * @param {PIXI.Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
         * @return {PIXI.Point} The new point, transformed through this matrix
         */
        Matrix.prototype.apply = function (pos, newPos) {
            newPos = newPos || new Point();
            var x = pos.x;
            var y = pos.y;
            newPos.x = (this.a * x) + (this.c * y) + this.tx;
            newPos.y = (this.b * x) + (this.d * y) + this.ty;
            return newPos;
        };
        /**
         * Get a new position with the inverse of the current transformation applied.
         * Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)
         *
         * @param {PIXI.Point} pos - The origin
         * @param {PIXI.Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
         * @return {PIXI.Point} The new point, inverse-transformed through this matrix
         */
        Matrix.prototype.applyInverse = function (pos, newPos) {
            newPos = newPos || new Point();
            var id = 1 / ((this.a * this.d) + (this.c * -this.b));
            var x = pos.x;
            var y = pos.y;
            newPos.x = (this.d * id * x) + (-this.c * id * y) + (((this.ty * this.c) - (this.tx * this.d)) * id);
            newPos.y = (this.a * id * y) + (-this.b * id * x) + (((-this.ty * this.a) + (this.tx * this.b)) * id);
            return newPos;
        };
        /**
         * Translates the matrix on the x and y.
         *
         * @param {number} x How much to translate x by
         * @param {number} y How much to translate y by
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */
        Matrix.prototype.translate = function (x, y) {
            this.tx += x;
            this.ty += y;
            return this;
        };
        /**
         * Applies a scale transformation to the matrix.
         *
         * @param {number} x The amount to scale horizontally
         * @param {number} y The amount to scale vertically
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */
        Matrix.prototype.scale = function (x, y) {
            this.a *= x;
            this.d *= y;
            this.c *= x;
            this.b *= y;
            this.tx *= x;
            this.ty *= y;
            return this;
        };
        /**
         * Applies a rotation transformation to the matrix.
         *
         * @param {number} angle - The angle in radians.
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */
        Matrix.prototype.rotate = function (angle) {
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);
            var a1 = this.a;
            var c1 = this.c;
            var tx1 = this.tx;
            this.a = (a1 * cos) - (this.b * sin);
            this.b = (a1 * sin) + (this.b * cos);
            this.c = (c1 * cos) - (this.d * sin);
            this.d = (c1 * sin) + (this.d * cos);
            this.tx = (tx1 * cos) - (this.ty * sin);
            this.ty = (tx1 * sin) + (this.ty * cos);
            return this;
        };
        /**
         * Appends the given Matrix to this Matrix.
         *
         * @param {PIXI.Matrix} matrix - The matrix to append.
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */
        Matrix.prototype.append = function (matrix) {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;
            this.a = (matrix.a * a1) + (matrix.b * c1);
            this.b = (matrix.a * b1) + (matrix.b * d1);
            this.c = (matrix.c * a1) + (matrix.d * c1);
            this.d = (matrix.c * b1) + (matrix.d * d1);
            this.tx = (matrix.tx * a1) + (matrix.ty * c1) + this.tx;
            this.ty = (matrix.tx * b1) + (matrix.ty * d1) + this.ty;
            return this;
        };
        /**
         * Sets the matrix based on all the available properties
         *
         * @param {number} x - Position on the x axis
         * @param {number} y - Position on the y axis
         * @param {number} pivotX - Pivot on the x axis
         * @param {number} pivotY - Pivot on the y axis
         * @param {number} scaleX - Scale on the x axis
         * @param {number} scaleY - Scale on the y axis
         * @param {number} rotation - Rotation in radians
         * @param {number} skewX - Skew on the x axis
         * @param {number} skewY - Skew on the y axis
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */
        Matrix.prototype.setTransform = function (x, y, pivotX, pivotY, scaleX, scaleY, rotation, skewX, skewY) {
            this.a = Math.cos(rotation + skewY) * scaleX;
            this.b = Math.sin(rotation + skewY) * scaleX;
            this.c = -Math.sin(rotation - skewX) * scaleY;
            this.d = Math.cos(rotation - skewX) * scaleY;
            this.tx = x - ((pivotX * this.a) + (pivotY * this.c));
            this.ty = y - ((pivotX * this.b) + (pivotY * this.d));
            return this;
        };
        /**
         * Prepends the given Matrix to this Matrix.
         *
         * @param {PIXI.Matrix} matrix - The matrix to prepend
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */
        Matrix.prototype.prepend = function (matrix) {
            var tx1 = this.tx;
            if (matrix.a !== 1 || matrix.b !== 0 || matrix.c !== 0 || matrix.d !== 1) {
                var a1 = this.a;
                var c1 = this.c;
                this.a = (a1 * matrix.a) + (this.b * matrix.c);
                this.b = (a1 * matrix.b) + (this.b * matrix.d);
                this.c = (c1 * matrix.a) + (this.d * matrix.c);
                this.d = (c1 * matrix.b) + (this.d * matrix.d);
            }
            this.tx = (tx1 * matrix.a) + (this.ty * matrix.c) + matrix.tx;
            this.ty = (tx1 * matrix.b) + (this.ty * matrix.d) + matrix.ty;
            return this;
        };
        /**
         * Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.
         *
         * @param {PIXI.Transform} transform - The transform to apply the properties to.
         * @return {PIXI.Transform} The transform with the newly applied properties
         */
        Matrix.prototype.decompose = function (transform) {
            // sort out rotation / skew..
            var a = this.a;
            var b = this.b;
            var c = this.c;
            var d = this.d;
            var skewX = -Math.atan2(-c, d);
            var skewY = Math.atan2(b, a);
            var delta = Math.abs(skewX + skewY);
            if (delta < 0.00001 || Math.abs(PI_2 - delta) < 0.00001) {
                transform.rotation = skewY;
                transform.skew.x = transform.skew.y = 0;
            }
            else {
                transform.rotation = 0;
                transform.skew.x = skewX;
                transform.skew.y = skewY;
            }
            // next set scale
            transform.scale.x = Math.sqrt((a * a) + (b * b));
            transform.scale.y = Math.sqrt((c * c) + (d * d));
            // next set position
            transform.position.x = this.tx;
            transform.position.y = this.ty;
            return transform;
        };
        /**
         * Inverts this matrix
         *
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */
        Matrix.prototype.invert = function () {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;
            var tx1 = this.tx;
            var n = (a1 * d1) - (b1 * c1);
            this.a = d1 / n;
            this.b = -b1 / n;
            this.c = -c1 / n;
            this.d = a1 / n;
            this.tx = ((c1 * this.ty) - (d1 * tx1)) / n;
            this.ty = -((a1 * this.ty) - (b1 * tx1)) / n;
            return this;
        };
        /**
         * Resets this Matrix to an identity (default) matrix.
         *
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */
        Matrix.prototype.identity = function () {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.tx = 0;
            this.ty = 0;
            return this;
        };
        /**
         * Creates a new Matrix object with the same values as this one.
         *
         * @return {PIXI.Matrix} A copy of this matrix. Good for chaining method calls.
         */
        Matrix.prototype.clone = function () {
            var matrix = new Matrix();
            matrix.a = this.a;
            matrix.b = this.b;
            matrix.c = this.c;
            matrix.d = this.d;
            matrix.tx = this.tx;
            matrix.ty = this.ty;
            return matrix;
        };
        /**
         * Changes the values of the given matrix to be the same as the ones in this matrix
         *
         * @param {PIXI.Matrix} matrix - The matrix to copy to.
         * @return {PIXI.Matrix} The matrix given in parameter with its values updated.
         */
        Matrix.prototype.copyTo = function (matrix) {
            matrix.a = this.a;
            matrix.b = this.b;
            matrix.c = this.c;
            matrix.d = this.d;
            matrix.tx = this.tx;
            matrix.ty = this.ty;
            return matrix;
        };
        /**
         * Changes the values of the matrix to be the same as the ones in given matrix
         *
         * @param {PIXI.Matrix} matrix - The matrix to copy from.
         * @return {PIXI.Matrix} this
         */
        Matrix.prototype.copyFrom = function (matrix) {
            this.a = matrix.a;
            this.b = matrix.b;
            this.c = matrix.c;
            this.d = matrix.d;
            this.tx = matrix.tx;
            this.ty = matrix.ty;
            return this;
        };
        Object.defineProperty(Matrix, "IDENTITY", {
            /**
             * A default (identity) matrix
             *
             * @static
             * @const
             * @member {PIXI.Matrix}
             */
            get: function () {
                return new Matrix();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix, "TEMP_MATRIX", {
            /**
             * A temp matrix
             *
             * @static
             * @const
             * @member {PIXI.Matrix}
             */
            get: function () {
                return new Matrix();
            },
            enumerable: true,
            configurable: true
        });
        return Matrix;
    }());

    // Your friendly neighbour https://en.wikipedia.org/wiki/Dihedral_group
    /*
     * Transform matrix for operation n is:
     * | ux | vx |
     * | uy | vy |
     */
    var ux = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1];
    var uy = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1];
    var vx = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1];
    var vy = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1];
    /**
     * [Cayley Table]{@link https://en.wikipedia.org/wiki/Cayley_table}
     * for the composition of each rotation in the dihederal group D8.
     *
     * @type number[][]
     * @private
     */
    var rotationCayley = [];
    /**
     * Matrices for each `GD8Symmetry` rotation.
     *
     * @type Matrix[]
     * @private
     */
    var rotationMatrices = [];
    /*
     * Alias for {@code Math.sign}.
     */
    var signum = Math.sign;
    /*
     * Initializes `rotationCayley` and `rotationMatrices`. It is called
     * only once below.
     */
    function init() {
        for (var i = 0; i < 16; i++) {
            var row = [];
            rotationCayley.push(row);
            for (var j = 0; j < 16; j++) {
                /* Multiplies rotation matrices i and j. */
                var _ux = signum((ux[i] * ux[j]) + (vx[i] * uy[j]));
                var _uy = signum((uy[i] * ux[j]) + (vy[i] * uy[j]));
                var _vx = signum((ux[i] * vx[j]) + (vx[i] * vy[j]));
                var _vy = signum((uy[i] * vx[j]) + (vy[i] * vy[j]));
                /* Finds rotation matrix matching the product and pushes it. */
                for (var k = 0; k < 16; k++) {
                    if (ux[k] === _ux && uy[k] === _uy
                        && vx[k] === _vx && vy[k] === _vy) {
                        row.push(k);
                        break;
                    }
                }
            }
        }
        for (var i = 0; i < 16; i++) {
            var mat = new Matrix();
            mat.set(ux[i], uy[i], vx[i], vy[i], 0, 0);
            rotationMatrices.push(mat);
        }
    }
    init();
    /**
     * @memberof PIXI
     * @typedef {number} GD8Symmetry
     * @see PIXI.groupD8
     */
    /**
     * Implements the dihedral group D8, which is similar to
     * [group D4]{@link http://mathworld.wolfram.com/DihedralGroupD4.html};
     * D8 is the same but with diagonals, and it is used for texture
     * rotations.
     *
     * The directions the U- and V- axes after rotation
     * of an angle of `a: GD8Constant` are the vectors `(uX(a), uY(a))`
     * and `(vX(a), vY(a))`. These aren't necessarily unit vectors.
     *
     * **Origin:**<br>
     *  This is the small part of gameofbombs.com portal system. It works.
     *
     * @see PIXI.groupD8.E
     * @see PIXI.groupD8.SE
     * @see PIXI.groupD8.S
     * @see PIXI.groupD8.SW
     * @see PIXI.groupD8.W
     * @see PIXI.groupD8.NW
     * @see PIXI.groupD8.N
     * @see PIXI.groupD8.NE
     * @author Ivan @ivanpopelyshev
     * @namespace PIXI.groupD8
     * @memberof PIXI
     */
    var groupD8 = {
        /**
         * | Rotation | Direction |
         * |----------|-----------|
         * | 0°       | East      |
         *
         * @memberof PIXI.groupD8
         * @constant {PIXI.GD8Symmetry}
         */
        E: 0,
        /**
         * | Rotation | Direction |
         * |----------|-----------|
         * | 45°↻     | Southeast |
         *
         * @memberof PIXI.groupD8
         * @constant {PIXI.GD8Symmetry}
         */
        SE: 1,
        /**
         * | Rotation | Direction |
         * |----------|-----------|
         * | 90°↻     | South     |
         *
         * @memberof PIXI.groupD8
         * @constant {PIXI.GD8Symmetry}
         */
        S: 2,
        /**
         * | Rotation | Direction |
         * |----------|-----------|
         * | 135°↻    | Southwest |
         *
         * @memberof PIXI.groupD8
         * @constant {PIXI.GD8Symmetry}
         */
        SW: 3,
        /**
         * | Rotation | Direction |
         * |----------|-----------|
         * | 180°     | West      |
         *
         * @memberof PIXI.groupD8
         * @constant {PIXI.GD8Symmetry}
         */
        W: 4,
        /**
         * | Rotation    | Direction    |
         * |-------------|--------------|
         * | -135°/225°↻ | Northwest    |
         *
         * @memberof PIXI.groupD8
         * @constant {PIXI.GD8Symmetry}
         */
        NW: 5,
        /**
         * | Rotation    | Direction    |
         * |-------------|--------------|
         * | -90°/270°↻  | North        |
         *
         * @memberof PIXI.groupD8
         * @constant {PIXI.GD8Symmetry}
         */
        N: 6,
        /**
         * | Rotation    | Direction    |
         * |-------------|--------------|
         * | -45°/315°↻  | Northeast    |
         *
         * @memberof PIXI.groupD8
         * @constant {PIXI.GD8Symmetry}
         */
        NE: 7,
        /**
         * Reflection about Y-axis.
         *
         * @memberof PIXI.groupD8
         * @constant {PIXI.GD8Symmetry}
         */
        MIRROR_VERTICAL: 8,
        /**
         * Reflection about the main diagonal.
         *
         * @memberof PIXI.groupD8
         * @constant {PIXI.GD8Symmetry}
         */
        MAIN_DIAGONAL: 10,
        /**
         * Reflection about X-axis.
         *
         * @memberof PIXI.groupD8
         * @constant {PIXI.GD8Symmetry}
         */
        MIRROR_HORIZONTAL: 12,
        /**
         * Reflection about reverse diagonal.
         *
         * @memberof PIXI.groupD8
         * @constant {PIXI.GD8Symmetry}
         */
        REVERSE_DIAGONAL: 14,
        /**
         * @memberof PIXI.groupD8
         * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
         * @return {PIXI.GD8Symmetry} The X-component of the U-axis
         *    after rotating the axes.
         */
        uX: function (ind) { return ux[ind]; },
        /**
         * @memberof PIXI.groupD8
         * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
         * @return {PIXI.GD8Symmetry} The Y-component of the U-axis
         *    after rotating the axes.
         */
        uY: function (ind) { return uy[ind]; },
        /**
         * @memberof PIXI.groupD8
         * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
         * @return {PIXI.GD8Symmetry} The X-component of the V-axis
         *    after rotating the axes.
         */
        vX: function (ind) { return vx[ind]; },
        /**
         * @memberof PIXI.groupD8
         * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
         * @return {PIXI.GD8Symmetry} The Y-component of the V-axis
         *    after rotating the axes.
         */
        vY: function (ind) { return vy[ind]; },
        /**
         * @memberof PIXI.groupD8
         * @param {PIXI.GD8Symmetry} rotation - symmetry whose opposite
         *   is needed. Only rotations have opposite symmetries while
         *   reflections don't.
         * @return {PIXI.GD8Symmetry} The opposite symmetry of `rotation`
         */
        inv: function (rotation) {
            if (rotation & 8) // true only if between 8 & 15 (reflections)
             {
                return rotation & 15; // or rotation % 16
            }
            return (-rotation) & 7; // or (8 - rotation) % 8
        },
        /**
         * Composes the two D8 operations.
         *
         * Taking `^` as reflection:
         *
         * |       | E=0 | S=2 | W=4 | N=6 | E^=8 | S^=10 | W^=12 | N^=14 |
         * |-------|-----|-----|-----|-----|------|-------|-------|-------|
         * | E=0   | E   | S   | W   | N   | E^   | S^    | W^    | N^    |
         * | S=2   | S   | W   | N   | E   | S^   | W^    | N^    | E^    |
         * | W=4   | W   | N   | E   | S   | W^   | N^    | E^    | S^    |
         * | N=6   | N   | E   | S   | W   | N^   | E^    | S^    | W^    |
         * | E^=8  | E^  | N^  | W^  | S^  | E    | N     | W     | S     |
         * | S^=10 | S^  | E^  | N^  | W^  | S    | E     | N     | W     |
         * | W^=12 | W^  | S^  | E^  | N^  | W    | S     | E     | N     |
         * | N^=14 | N^  | W^  | S^  | E^  | N    | W     | S     | E     |
         *
         * [This is a Cayley table]{@link https://en.wikipedia.org/wiki/Cayley_table}
         * @memberof PIXI.groupD8
         * @param {PIXI.GD8Symmetry} rotationSecond - Second operation, which
         *   is the row in the above cayley table.
         * @param {PIXI.GD8Symmetry} rotationFirst - First operation, which
         *   is the column in the above cayley table.
         * @return {PIXI.GD8Symmetry} Composed operation
         */
        add: function (rotationSecond, rotationFirst) { return (rotationCayley[rotationSecond][rotationFirst]); },
        /**
         * Reverse of `add`.
         *
         * @memberof PIXI.groupD8
         * @param {PIXI.GD8Symmetry} rotationSecond - Second operation
         * @param {PIXI.GD8Symmetry} rotationFirst - First operation
         * @return {PIXI.GD8Symmetry} Result
         */
        sub: function (rotationSecond, rotationFirst) { return (rotationCayley[rotationSecond][groupD8.inv(rotationFirst)]); },
        /**
         * Adds 180 degrees to rotation, which is a commutative
         * operation.
         *
         * @memberof PIXI.groupD8
         * @param {number} rotation - The number to rotate.
         * @returns {number} Rotated number
         */
        rotate180: function (rotation) { return rotation ^ 4; },
        /**
         * Checks if the rotation angle is vertical, i.e. south
         * or north. It doesn't work for reflections.
         *
         * @memberof PIXI.groupD8
         * @param {PIXI.GD8Symmetry} rotation - The number to check.
         * @returns {boolean} Whether or not the direction is vertical
         */
        isVertical: function (rotation) { return (rotation & 3) === 2; },
        /**
         * Approximates the vector `V(dx,dy)` into one of the
         * eight directions provided by `groupD8`.
         *
         * @memberof PIXI.groupD8
         * @param {number} dx - X-component of the vector
         * @param {number} dy - Y-component of the vector
         * @return {PIXI.GD8Symmetry} Approximation of the vector into
         *  one of the eight symmetries.
         */
        byDirection: function (dx, dy) {
            if (Math.abs(dx) * 2 <= Math.abs(dy)) {
                if (dy >= 0) {
                    return groupD8.S;
                }
                return groupD8.N;
            }
            else if (Math.abs(dy) * 2 <= Math.abs(dx)) {
                if (dx > 0) {
                    return groupD8.E;
                }
                return groupD8.W;
            }
            else if (dy > 0) {
                if (dx > 0) {
                    return groupD8.SE;
                }
                return groupD8.SW;
            }
            else if (dx > 0) {
                return groupD8.NE;
            }
            return groupD8.NW;
        },
        /**
         * Helps sprite to compensate texture packer rotation.
         *
         * @memberof PIXI.groupD8
         * @param {PIXI.Matrix} matrix - sprite world matrix
         * @param {PIXI.GD8Symmetry} rotation - The rotation factor to use.
         * @param {number} tx - sprite anchoring
         * @param {number} ty - sprite anchoring
         */
        matrixAppendRotationInv: function (matrix, rotation, tx, ty) {
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            // Packer used "rotation", we use "inv(rotation)"
            var mat = rotationMatrices[groupD8.inv(rotation)];
            mat.tx = tx;
            mat.ty = ty;
            matrix.append(mat);
        },
    };

    /**
     * Transform that takes care about its versions
     *
     * @class
     * @memberof PIXI
     */
    var Transform = /** @class */ (function () {
        function Transform() {
            /**
             * The world transformation matrix.
             *
             * @member {PIXI.Matrix}
             */
            this.worldTransform = new Matrix();
            /**
             * The local transformation matrix.
             *
             * @member {PIXI.Matrix}
             */
            this.localTransform = new Matrix();
            /**
             * The coordinate of the object relative to the local coordinates of the parent.
             *
             * @member {PIXI.ObservablePoint}
             */
            this.position = new ObservablePoint(this.onChange, this, 0, 0);
            /**
             * The scale factor of the object.
             *
             * @member {PIXI.ObservablePoint}
             */
            this.scale = new ObservablePoint(this.onChange, this, 1, 1);
            /**
             * The pivot point of the displayObject that it rotates around.
             *
             * @member {PIXI.ObservablePoint}
             */
            this.pivot = new ObservablePoint(this.onChange, this, 0, 0);
            /**
             * The skew amount, on the x and y axis.
             *
             * @member {PIXI.ObservablePoint}
             */
            this.skew = new ObservablePoint(this.updateSkew, this, 0, 0);
            /**
             * The rotation amount.
             *
             * @protected
             * @member {number}
             */
            this._rotation = 0;
            /**
             * The X-coordinate value of the normalized local X axis,
             * the first column of the local transformation matrix without a scale.
             *
             * @protected
             * @member {number}
             */
            this._cx = 1;
            /**
             * The Y-coordinate value of the normalized local X axis,
             * the first column of the local transformation matrix without a scale.
             *
             * @protected
             * @member {number}
             */
            this._sx = 0;
            /**
             * The X-coordinate value of the normalized local Y axis,
             * the second column of the local transformation matrix without a scale.
             *
             * @protected
             * @member {number}
             */
            this._cy = 0;
            /**
             * The Y-coordinate value of the normalized local Y axis,
             * the second column of the local transformation matrix without a scale.
             *
             * @protected
             * @member {number}
             */
            this._sy = 1;
            /**
             * The locally unique ID of the local transform.
             *
             * @protected
             * @member {number}
             */
            this._localID = 0;
            /**
             * The locally unique ID of the local transform
             * used to calculate the current local transformation matrix.
             *
             * @protected
             * @member {number}
             */
            this._currentLocalID = 0;
            /**
             * The locally unique ID of the world transform.
             *
             * @protected
             * @member {number}
             */
            this._worldID = 0;
            /**
             * The locally unique ID of the parent's world transform
             * used to calculate the current world transformation matrix.
             *
             * @protected
             * @member {number}
             */
            this._parentID = 0;
        }
        /**
         * Called when a value changes.
         *
         * @protected
         */
        Transform.prototype.onChange = function () {
            this._localID++;
        };
        /**
         * Called when the skew or the rotation changes.
         *
         * @protected
         */
        Transform.prototype.updateSkew = function () {
            this._cx = Math.cos(this._rotation + this.skew.y);
            this._sx = Math.sin(this._rotation + this.skew.y);
            this._cy = -Math.sin(this._rotation - this.skew.x); // cos, added PI/2
            this._sy = Math.cos(this._rotation - this.skew.x); // sin, added PI/2
            this._localID++;
        };
        /**
         * Updates the local transformation matrix.
         */
        Transform.prototype.updateLocalTransform = function () {
            var lt = this.localTransform;
            if (this._localID !== this._currentLocalID) {
                // get the matrix values of the displayobject based on its transform properties..
                lt.a = this._cx * this.scale.x;
                lt.b = this._sx * this.scale.x;
                lt.c = this._cy * this.scale.y;
                lt.d = this._sy * this.scale.y;
                lt.tx = this.position.x - ((this.pivot.x * lt.a) + (this.pivot.y * lt.c));
                lt.ty = this.position.y - ((this.pivot.x * lt.b) + (this.pivot.y * lt.d));
                this._currentLocalID = this._localID;
                // force an update..
                this._parentID = -1;
            }
        };
        /**
         * Updates the local and the world transformation matrices.
         *
         * @param {PIXI.Transform} parentTransform - The parent transform
         */
        Transform.prototype.updateTransform = function (parentTransform) {
            var lt = this.localTransform;
            if (this._localID !== this._currentLocalID) {
                // get the matrix values of the displayobject based on its transform properties..
                lt.a = this._cx * this.scale.x;
                lt.b = this._sx * this.scale.x;
                lt.c = this._cy * this.scale.y;
                lt.d = this._sy * this.scale.y;
                lt.tx = this.position.x - ((this.pivot.x * lt.a) + (this.pivot.y * lt.c));
                lt.ty = this.position.y - ((this.pivot.x * lt.b) + (this.pivot.y * lt.d));
                this._currentLocalID = this._localID;
                // force an update..
                this._parentID = -1;
            }
            if (this._parentID !== parentTransform._worldID) {
                // concat the parent matrix with the objects transform.
                var pt = parentTransform.worldTransform;
                var wt = this.worldTransform;
                wt.a = (lt.a * pt.a) + (lt.b * pt.c);
                wt.b = (lt.a * pt.b) + (lt.b * pt.d);
                wt.c = (lt.c * pt.a) + (lt.d * pt.c);
                wt.d = (lt.c * pt.b) + (lt.d * pt.d);
                wt.tx = (lt.tx * pt.a) + (lt.ty * pt.c) + pt.tx;
                wt.ty = (lt.tx * pt.b) + (lt.ty * pt.d) + pt.ty;
                this._parentID = parentTransform._worldID;
                // update the id of the transform..
                this._worldID++;
            }
        };
        /**
         * Decomposes a matrix and sets the transforms properties based on it.
         *
         * @param {PIXI.Matrix} matrix - The matrix to decompose
         */
        Transform.prototype.setFromMatrix = function (matrix) {
            matrix.decompose(this);
            this._localID++;
        };
        Object.defineProperty(Transform.prototype, "rotation", {
            /**
             * The rotation of the object in radians.
             *
             * @member {number}
             */
            get: function () {
                return this._rotation;
            },
            set: function (value) {
                if (this._rotation !== value) {
                    this._rotation = value;
                    this.updateSkew();
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * A default (identity) transform
         *
         * @static
         * @constant
         * @member {PIXI.Transform}
         */
        Transform.IDENTITY = new Transform();
        return Transform;
    }());

    /**
     * Size object, contains width and height
     *
     * @memberof PIXI
     * @typedef {object} ISize
     * @property {number} width - Width component
     * @property {number} height - Height component
     */
    /**
     * Rectangle object is an area defined by its position, as indicated by its top-left corner
     * point (x, y) and by its width and its height.
     *
     * @class
     * @memberof PIXI
     */
    var Rectangle = /** @class */ (function () {
        /**
         * @param {number} [x=0] - The X coordinate of the upper-left corner of the rectangle
         * @param {number} [y=0] - The Y coordinate of the upper-left corner of the rectangle
         * @param {number} [width=0] - The overall width of this rectangle
         * @param {number} [height=0] - The overall height of this rectangle
         */
        function Rectangle(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            /**
             * @member {number}
             * @default 0
             */
            this.x = Number(x);
            /**
             * @member {number}
             * @default 0
             */
            this.y = Number(y);
            /**
             * @member {number}
             * @default 0
             */
            this.width = Number(width);
            /**
             * @member {number}
             * @default 0
             */
            this.height = Number(height);
            /**
             * The type of the object, mainly used to avoid `instanceof` checks
             *
             * @member {number}
             * @readOnly
             * @default PIXI.SHAPES.RECT
             * @see PIXI.SHAPES
             */
            this.type = SHAPES.RECT;
        }
        Object.defineProperty(Rectangle.prototype, "left", {
            /**
             * returns the left edge of the rectangle
             *
             * @member {number}
             */
            get: function () {
                return this.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "right", {
            /**
             * returns the right edge of the rectangle
             *
             * @member {number}
             */
            get: function () {
                return this.x + this.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "top", {
            /**
             * returns the top edge of the rectangle
             *
             * @member {number}
             */
            get: function () {
                return this.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "bottom", {
            /**
             * returns the bottom edge of the rectangle
             *
             * @member {number}
             */
            get: function () {
                return this.y + this.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle, "EMPTY", {
            /**
             * A constant empty rectangle.
             *
             * @static
             * @constant
             * @member {PIXI.Rectangle}
             * @return {PIXI.Rectangle} An empty rectangle
             */
            get: function () {
                return new Rectangle(0, 0, 0, 0);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Creates a clone of this Rectangle
         *
         * @return {PIXI.Rectangle} a copy of the rectangle
         */
        Rectangle.prototype.clone = function () {
            return new Rectangle(this.x, this.y, this.width, this.height);
        };
        /**
         * Copies another rectangle to this one.
         *
         * @param {PIXI.Rectangle} rectangle - The rectangle to copy from.
         * @return {PIXI.Rectangle} Returns itself.
         */
        Rectangle.prototype.copyFrom = function (rectangle) {
            this.x = rectangle.x;
            this.y = rectangle.y;
            this.width = rectangle.width;
            this.height = rectangle.height;
            return this;
        };
        /**
         * Copies this rectangle to another one.
         *
         * @param {PIXI.Rectangle} rectangle - The rectangle to copy to.
         * @return {PIXI.Rectangle} Returns given parameter.
         */
        Rectangle.prototype.copyTo = function (rectangle) {
            rectangle.x = this.x;
            rectangle.y = this.y;
            rectangle.width = this.width;
            rectangle.height = this.height;
            return rectangle;
        };
        /**
         * Checks whether the x and y coordinates given are contained within this Rectangle
         *
         * @param {number} x - The X coordinate of the point to test
         * @param {number} y - The Y coordinate of the point to test
         * @return {boolean} Whether the x/y coordinates are within this Rectangle
         */
        Rectangle.prototype.contains = function (x, y) {
            if (this.width <= 0 || this.height <= 0) {
                return false;
            }
            if (x >= this.x && x < this.x + this.width) {
                if (y >= this.y && y < this.y + this.height) {
                    return true;
                }
            }
            return false;
        };
        /**
         * Pads the rectangle making it grow in all directions.
         * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
         *
         * @param {number} [paddingX=0] - The horizontal padding amount.
         * @param {number} [paddingY=0] - The vertical padding amount.
         * @return {PIXI.Rectangle} Returns itself.
         */
        Rectangle.prototype.pad = function (paddingX, paddingY) {
            if (paddingX === void 0) { paddingX = 0; }
            if (paddingY === void 0) { paddingY = paddingX; }
            this.x -= paddingX;
            this.y -= paddingY;
            this.width += paddingX * 2;
            this.height += paddingY * 2;
            return this;
        };
        /**
         * Fits this rectangle around the passed one.
         *
         * @param {PIXI.Rectangle} rectangle - The rectangle to fit.
         * @return {PIXI.Rectangle} Returns itself.
         */
        Rectangle.prototype.fit = function (rectangle) {
            var x1 = Math.max(this.x, rectangle.x);
            var x2 = Math.min(this.x + this.width, rectangle.x + rectangle.width);
            var y1 = Math.max(this.y, rectangle.y);
            var y2 = Math.min(this.y + this.height, rectangle.y + rectangle.height);
            this.x = x1;
            this.width = Math.max(x2 - x1, 0);
            this.y = y1;
            this.height = Math.max(y2 - y1, 0);
            return this;
        };
        /**
         * Enlarges rectangle that way its corners lie on grid
         *
         * @param {number} [resolution=1] resolution
         * @param {number} [eps=0.001] precision
         * @return {PIXI.Rectangle} Returns itself.
         */
        Rectangle.prototype.ceil = function (resolution, eps) {
            if (resolution === void 0) { resolution = 1; }
            if (eps === void 0) { eps = 0.001; }
            var x2 = Math.ceil((this.x + this.width - eps) * resolution) / resolution;
            var y2 = Math.ceil((this.y + this.height - eps) * resolution) / resolution;
            this.x = Math.floor((this.x + eps) * resolution) / resolution;
            this.y = Math.floor((this.y + eps) * resolution) / resolution;
            this.width = x2 - this.x;
            this.height = y2 - this.y;
            return this;
        };
        /**
         * Enlarges this rectangle to include the passed rectangle.
         *
         * @param {PIXI.Rectangle} rectangle - The rectangle to include.
         * @return {PIXI.Rectangle} Returns itself.
         */
        Rectangle.prototype.enlarge = function (rectangle) {
            var x1 = Math.min(this.x, rectangle.x);
            var x2 = Math.max(this.x + this.width, rectangle.x + rectangle.width);
            var y1 = Math.min(this.y, rectangle.y);
            var y2 = Math.max(this.y + this.height, rectangle.y + rectangle.height);
            this.x = x1;
            this.width = x2 - x1;
            this.y = y1;
            this.height = y2 - y1;
            return this;
        };
        return Rectangle;
    }());

    /*!
     * @pixi/display - v5.2.1
     * Compiled Tue, 28 Jan 2020 23:33:11 UTC
     *
     * @pixi/display is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    /**
     * Sets the default value for the container property 'sortableChildren'.
     * If set to true, the container will sort its children by zIndex value
     * when updateTransform() is called, or manually if sortChildren() is called.
     *
     * This actually changes the order of elements in the array, so should be treated
     * as a basic solution that is not performant compared to other solutions,
     * such as @link https://github.com/pixijs/pixi-display
     *
     * Also be aware of that this may not work nicely with the addChildAt() function,
     * as the zIndex sorting may cause the child to automatically sorted to another position.
     *
     * @static
     * @constant
     * @name SORTABLE_CHILDREN
     * @memberof PIXI.settings
     * @type {boolean}
     * @default false
     */
    settings.SORTABLE_CHILDREN = false;

    /**
     * 'Builder' pattern for bounds rectangles.
     *
     * This could be called an Axis-Aligned Bounding Box.
     * It is not an actual shape. It is a mutable thing; no 'EMPTY' or those kind of problems.
     *
     * @class
     * @memberof PIXI
     */
    var Bounds = function Bounds()
    {
        /**
         * @member {number}
         * @default 0
         */
        this.minX = Infinity;

        /**
         * @member {number}
         * @default 0
         */
        this.minY = Infinity;

        /**
         * @member {number}
         * @default 0
         */
        this.maxX = -Infinity;

        /**
         * @member {number}
         * @default 0
         */
        this.maxY = -Infinity;

        this.rect = null;
    };

    /**
     * Checks if bounds are empty.
     *
     * @return {boolean} True if empty.
     */
    Bounds.prototype.isEmpty = function isEmpty ()
    {
        return this.minX > this.maxX || this.minY > this.maxY;
    };

    /**
     * Clears the bounds and resets.
     *
     */
    Bounds.prototype.clear = function clear ()
    {
        this.minX = Infinity;
        this.minY = Infinity;
        this.maxX = -Infinity;
        this.maxY = -Infinity;
    };

    /**
     * Can return Rectangle.EMPTY constant, either construct new rectangle, either use your rectangle
     * It is not guaranteed that it will return tempRect
     *
     * @param {PIXI.Rectangle} rect - temporary object will be used if AABB is not empty
     * @returns {PIXI.Rectangle} A rectangle of the bounds
     */
    Bounds.prototype.getRectangle = function getRectangle (rect)
    {
        if (this.minX > this.maxX || this.minY > this.maxY)
        {
            return Rectangle.EMPTY;
        }

        rect = rect || new Rectangle(0, 0, 1, 1);

        rect.x = this.minX;
        rect.y = this.minY;
        rect.width = this.maxX - this.minX;
        rect.height = this.maxY - this.minY;

        return rect;
    };

    /**
     * This function should be inlined when its possible.
     *
     * @param {PIXI.Point} point - The point to add.
     */
    Bounds.prototype.addPoint = function addPoint (point)
    {
        this.minX = Math.min(this.minX, point.x);
        this.maxX = Math.max(this.maxX, point.x);
        this.minY = Math.min(this.minY, point.y);
        this.maxY = Math.max(this.maxY, point.y);
    };

    /**
     * Adds a quad, not transformed
     *
     * @param {Float32Array} vertices - The verts to add.
     */
    Bounds.prototype.addQuad = function addQuad (vertices)
    {
        var minX = this.minX;
        var minY = this.minY;
        var maxX = this.maxX;
        var maxY = this.maxY;

        var x = vertices[0];
        var y = vertices[1];

        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = vertices[2];
        y = vertices[3];
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = vertices[4];
        y = vertices[5];
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = vertices[6];
        y = vertices[7];
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    };

    /**
     * Adds sprite frame, transformed.
     *
     * @param {PIXI.Transform} transform - transform to apply
     * @param {number} x0 - left X of frame
     * @param {number} y0 - top Y of frame
     * @param {number} x1 - right X of frame
     * @param {number} y1 - bottom Y of frame
     */
    Bounds.prototype.addFrame = function addFrame (transform, x0, y0, x1, y1)
    {
        this.addFrameMatrix(transform.worldTransform, x0, y0, x1, y1);
    };

    /**
     * Adds sprite frame, multiplied by matrix
     *
     * @param {PIXI.Matrix} matrix - matrix to apply
     * @param {number} x0 - left X of frame
     * @param {number} y0 - top Y of frame
     * @param {number} x1 - right X of frame
     * @param {number} y1 - bottom Y of frame
     */
    Bounds.prototype.addFrameMatrix = function addFrameMatrix (matrix, x0, y0, x1, y1)
    {
        var a = matrix.a;
        var b = matrix.b;
        var c = matrix.c;
        var d = matrix.d;
        var tx = matrix.tx;
        var ty = matrix.ty;

        var minX = this.minX;
        var minY = this.minY;
        var maxX = this.maxX;
        var maxY = this.maxY;

        var x = (a * x0) + (c * y0) + tx;
        var y = (b * x0) + (d * y0) + ty;

        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = (a * x1) + (c * y0) + tx;
        y = (b * x1) + (d * y0) + ty;
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = (a * x0) + (c * y1) + tx;
        y = (b * x0) + (d * y1) + ty;
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = (a * x1) + (c * y1) + tx;
        y = (b * x1) + (d * y1) + ty;
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    };

    /**
     * Adds screen vertices from array
     *
     * @param {Float32Array} vertexData - calculated vertices
     * @param {number} beginOffset - begin offset
     * @param {number} endOffset - end offset, excluded
     */
    Bounds.prototype.addVertexData = function addVertexData (vertexData, beginOffset, endOffset)
    {
        var minX = this.minX;
        var minY = this.minY;
        var maxX = this.maxX;
        var maxY = this.maxY;

        for (var i = beginOffset; i < endOffset; i += 2)
        {
            var x = vertexData[i];
            var y = vertexData[i + 1];

            minX = x < minX ? x : minX;
            minY = y < minY ? y : minY;
            maxX = x > maxX ? x : maxX;
            maxY = y > maxY ? y : maxY;
        }

        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    };

    /**
     * Add an array of mesh vertices
     *
     * @param {PIXI.Transform} transform - mesh transform
     * @param {Float32Array} vertices - mesh coordinates in array
     * @param {number} beginOffset - begin offset
     * @param {number} endOffset - end offset, excluded
     */
    Bounds.prototype.addVertices = function addVertices (transform, vertices, beginOffset, endOffset)
    {
        this.addVerticesMatrix(transform.worldTransform, vertices, beginOffset, endOffset);
    };

    /**
     * Add an array of mesh vertices
     *
     * @param {PIXI.Matrix} matrix - mesh matrix
     * @param {Float32Array} vertices - mesh coordinates in array
     * @param {number} beginOffset - begin offset
     * @param {number} endOffset - end offset, excluded
     * @param {number} [padX] - x padding
     * @param {number} [padY] - y padding
     */
    Bounds.prototype.addVerticesMatrix = function addVerticesMatrix (matrix, vertices, beginOffset, endOffset, padX, padY)
    {
        var a = matrix.a;
        var b = matrix.b;
        var c = matrix.c;
        var d = matrix.d;
        var tx = matrix.tx;
        var ty = matrix.ty;

        padX = padX || 0;
        padY = padY || 0;

        var minX = this.minX;
        var minY = this.minY;
        var maxX = this.maxX;
        var maxY = this.maxY;

        for (var i = beginOffset; i < endOffset; i += 2)
        {
            var rawX = vertices[i];
            var rawY = vertices[i + 1];
            var x = (a * rawX) + (c * rawY) + tx;
            var y = (d * rawY) + (b * rawX) + ty;

            minX = Math.min(minX, x - padX);
            maxX = Math.max(maxX, x + padX);
            minY = Math.min(minY, y - padY);
            maxY = Math.max(maxY, y + padY);
        }

        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    };

    /**
     * Adds other Bounds
     *
     * @param {PIXI.Bounds} bounds - TODO
     */
    Bounds.prototype.addBounds = function addBounds (bounds)
    {
        var minX = this.minX;
        var minY = this.minY;
        var maxX = this.maxX;
        var maxY = this.maxY;

        this.minX = bounds.minX < minX ? bounds.minX : minX;
        this.minY = bounds.minY < minY ? bounds.minY : minY;
        this.maxX = bounds.maxX > maxX ? bounds.maxX : maxX;
        this.maxY = bounds.maxY > maxY ? bounds.maxY : maxY;
    };

    /**
     * Adds other Bounds, masked with Bounds
     *
     * @param {PIXI.Bounds} bounds - TODO
     * @param {PIXI.Bounds} mask - TODO
     */
    Bounds.prototype.addBoundsMask = function addBoundsMask (bounds, mask)
    {
        var _minX = bounds.minX > mask.minX ? bounds.minX : mask.minX;
        var _minY = bounds.minY > mask.minY ? bounds.minY : mask.minY;
        var _maxX = bounds.maxX < mask.maxX ? bounds.maxX : mask.maxX;
        var _maxY = bounds.maxY < mask.maxY ? bounds.maxY : mask.maxY;

        if (_minX <= _maxX && _minY <= _maxY)
        {
            var minX = this.minX;
            var minY = this.minY;
            var maxX = this.maxX;
            var maxY = this.maxY;

            this.minX = _minX < minX ? _minX : minX;
            this.minY = _minY < minY ? _minY : minY;
            this.maxX = _maxX > maxX ? _maxX : maxX;
            this.maxY = _maxY > maxY ? _maxY : maxY;
        }
    };

    /**
     * Adds other Bounds, multiplied by matrix. Bounds shouldn't be empty
     *
     * @param {PIXI.Bounds} bounds other bounds
     * @param {PIXI.Matrix} matrix multiplicator
     */
    Bounds.prototype.addBoundsMatrix = function addBoundsMatrix (bounds, matrix)
    {
        this.addFrameMatrix(matrix, bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
    };

    /**
     * Adds other Bounds, masked with Rectangle
     *
     * @param {PIXI.Bounds} bounds - TODO
     * @param {PIXI.Rectangle} area - TODO
     */
    Bounds.prototype.addBoundsArea = function addBoundsArea (bounds, area)
    {
        var _minX = bounds.minX > area.x ? bounds.minX : area.x;
        var _minY = bounds.minY > area.y ? bounds.minY : area.y;
        var _maxX = bounds.maxX < area.x + area.width ? bounds.maxX : (area.x + area.width);
        var _maxY = bounds.maxY < area.y + area.height ? bounds.maxY : (area.y + area.height);

        if (_minX <= _maxX && _minY <= _maxY)
        {
            var minX = this.minX;
            var minY = this.minY;
            var maxX = this.maxX;
            var maxY = this.maxY;

            this.minX = _minX < minX ? _minX : minX;
            this.minY = _minY < minY ? _minY : minY;
            this.maxX = _maxX > maxX ? _maxX : maxX;
            this.maxY = _maxY > maxY ? _maxY : maxY;
        }
    };

    /**
     * Pads bounds object, making it grow in all directions.
     * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
     *
     * @param {number} [paddingX=0] - The horizontal padding amount.
     * @param {number} [paddingY=0] - The vertical padding amount.
     */
    Bounds.prototype.pad = function pad (paddingX, paddingY)
    {
        paddingX = paddingX || 0;
        paddingY = paddingY || ((paddingY !== 0) ? paddingX : 0);

        if (!this.isEmpty())
        {
            this.minX -= paddingX;
            this.maxX += paddingX;
            this.minY -= paddingY;
            this.maxY += paddingY;
        }
    };

    /**
     * Adds padded frame. (x0, y0) should be strictly less than (x1, y1)
     *
     * @param {number} x0 - left X of frame
     * @param {number} y0 - top Y of frame
     * @param {number} x1 - right X of frame
     * @param {number} y1 - bottom Y of frame
     * @param {number} padX - padding X
     * @param {number} padY - padding Y
     */
    Bounds.prototype.addFramePad = function addFramePad (x0, y0, x1, y1, padX, padY)
    {
        x0 -= padX;
        y0 -= padY;
        x1 += padX;
        y1 += padY;

        this.minX = this.minX < x0 ? this.minX : x0;
        this.maxX = this.maxX > x1 ? this.maxX : x1;
        this.minY = this.minY < y0 ? this.minY : y0;
        this.maxY = this.maxY > y1 ? this.maxY : y1;
    };

    // _tempDisplayObjectParent = new DisplayObject();

    /**
     * The base class for all objects that are rendered on the screen.
     *
     * This is an abstract class and should not be used on its own; rather it should be extended.
     *
     * @class
     * @extends PIXI.utils.EventEmitter
     * @memberof PIXI
     */
    var DisplayObject = /*@__PURE__*/(function (EventEmitter) {
        function DisplayObject()
        {
            EventEmitter.call(this);

            this.tempDisplayObjectParent = null;

            // TODO: need to create Transform from factory
            /**
             * World transform and local transform of this object.
             * This will become read-only later, please do not assign anything there unless you know what are you doing.
             *
             * @member {PIXI.Transform}
             */
            this.transform = new Transform();

            /**
             * The opacity of the object.
             *
             * @member {number}
             */
            this.alpha = 1;

            /**
             * The visibility of the object. If false the object will not be drawn, and
             * the updateTransform function will not be called.
             *
             * Only affects recursive calls from parent. You can ask for bounds or call updateTransform manually.
             *
             * @member {boolean}
             */
            this.visible = true;

            /**
             * Can this object be rendered, if false the object will not be drawn but the updateTransform
             * methods will still be called.
             *
             * Only affects recursive calls from parent. You can ask for bounds manually.
             *
             * @member {boolean}
             */
            this.renderable = true;

            /**
             * The display object container that contains this display object.
             *
             * @member {PIXI.Container}
             * @readonly
             */
            this.parent = null;

            /**
             * The multiplied alpha of the displayObject.
             *
             * @member {number}
             * @readonly
             */
            this.worldAlpha = 1;

            /**
             * Which index in the children array the display component was before the previous zIndex sort.
             * Used by containers to help sort objects with the same zIndex, by using previous array index as the decider.
             *
             * @member {number}
             * @protected
             */
            this._lastSortedIndex = 0;

            /**
             * The zIndex of the displayObject.
             * A higher value will mean it will be rendered on top of other displayObjects within the same container.
             *
             * @member {number}
             * @protected
             */
            this._zIndex = 0;

            /**
             * The area the filter is applied to. This is used as more of an optimization
             * rather than figuring out the dimensions of the displayObject each frame you can set this rectangle.
             *
             * Also works as an interaction mask.
             *
             * @member {?PIXI.Rectangle}
             */
            this.filterArea = null;

            /**
             * Sets the filters for the displayObject.
             * * IMPORTANT: This is a WebGL only feature and will be ignored by the canvas renderer.
             * To remove filters simply set this property to `'null'`.
             *
             * @member {?PIXI.Filter[]}
             */
            this.filters = null;
            this._enabledFilters = null;

            /**
             * The bounds object, this is used to calculate and store the bounds of the displayObject.
             *
             * @member {PIXI.Bounds}
             * @protected
             */
            this._bounds = new Bounds();
            this._boundsID = 0;
            this._lastBoundsID = -1;
            this._boundsRect = null;
            this._localBoundsRect = null;

            /**
             * The original, cached mask of the object.
             *
             * @member {PIXI.Graphics|PIXI.Sprite|null}
             * @protected
             */
            this._mask = null;

            /**
             * Fired when this DisplayObject is added to a Container.
             *
             * @event PIXI.DisplayObject#added
             * @param {PIXI.Container} container - The container added to.
             */

            /**
             * Fired when this DisplayObject is removed from a Container.
             *
             * @event PIXI.DisplayObject#removed
             * @param {PIXI.Container} container - The container removed from.
             */

            /**
             * If the object has been destroyed via destroy(). If true, it should not be used.
             *
             * @member {boolean}
             * @protected
             */
            this._destroyed = false;

            /**
             * used to fast check if a sprite is.. a sprite!
             * @member {boolean}
             */
            this.isSprite = false;

            /**
             * Does any other displayObject use this object as a mask?
             * @member {boolean}
             */
            this.isMask = false;
        }

        if ( EventEmitter ) DisplayObject.__proto__ = EventEmitter;
        DisplayObject.prototype = Object.create( EventEmitter && EventEmitter.prototype );
        DisplayObject.prototype.constructor = DisplayObject;

        var prototypeAccessors = { _tempDisplayObjectParent: { configurable: true },x: { configurable: true },y: { configurable: true },worldTransform: { configurable: true },localTransform: { configurable: true },position: { configurable: true },scale: { configurable: true },pivot: { configurable: true },skew: { configurable: true },rotation: { configurable: true },angle: { configurable: true },zIndex: { configurable: true },worldVisible: { configurable: true },mask: { configurable: true } };

        /**
         * @protected
         * @member {PIXI.DisplayObject}
         */
        DisplayObject.mixin = function mixin (source)
        {
            // in ES8/ES2017, this would be really easy:
            // Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));

            // get all the enumerable property keys
            var keys = Object.keys(source);

            // loop through properties
            for (var i = 0; i < keys.length; ++i)
            {
                var propertyName = keys[i];

                // Set the property using the property descriptor - this works for accessors and normal value properties
                Object.defineProperty(
                    DisplayObject.prototype,
                    propertyName,
                    Object.getOwnPropertyDescriptor(source, propertyName)
                );
            }
        };

        prototypeAccessors._tempDisplayObjectParent.get = function ()
        {
            if (this.tempDisplayObjectParent === null)
            {
                this.tempDisplayObjectParent = new DisplayObject();
            }

            return this.tempDisplayObjectParent;
        };

        /**
         * Updates the object transform for rendering.
         *
         * TODO - Optimization pass!
         */
        DisplayObject.prototype.updateTransform = function updateTransform ()
        {
            this._boundsID++;

            this.transform.updateTransform(this.parent.transform);
            // multiply the alphas..
            this.worldAlpha = this.alpha * this.parent.worldAlpha;
        };

        /**
         * Recalculates the bounds of the display object.
         *
         * Does nothing by default and can be overwritten in a parent class.
         */
        DisplayObject.prototype.calculateBounds = function calculateBounds ()
        {
            // OVERWRITE;
        };

        /**
         * Recursively updates transform of all objects from the root to this one
         * internal function for toLocal()
         */
        DisplayObject.prototype._recursivePostUpdateTransform = function _recursivePostUpdateTransform ()
        {
            if (this.parent)
            {
                this.parent._recursivePostUpdateTransform();
                this.transform.updateTransform(this.parent.transform);
            }
            else
            {
                this.transform.updateTransform(this._tempDisplayObjectParent.transform);
            }
        };

        /**
         * Retrieves the bounds of the displayObject as a rectangle object.
         *
         * @param {boolean} [skipUpdate] - Setting to `true` will stop the transforms of the scene graph from
         *  being updated. This means the calculation returned MAY be out of date BUT will give you a
         *  nice performance boost.
         * @param {PIXI.Rectangle} [rect] - Optional rectangle to store the result of the bounds calculation.
         * @return {PIXI.Rectangle} The rectangular bounding area.
         */
        DisplayObject.prototype.getBounds = function getBounds (skipUpdate, rect)
        {
            if (!skipUpdate)
            {
                if (!this.parent)
                {
                    this.parent = this._tempDisplayObjectParent;
                    this.updateTransform();
                    this.parent = null;
                }
                else
                {
                    this._recursivePostUpdateTransform();
                    this.updateTransform();
                }
            }

            if (this._boundsID !== this._lastBoundsID)
            {
                this.calculateBounds();
                this._lastBoundsID = this._boundsID;
            }

            if (!rect)
            {
                if (!this._boundsRect)
                {
                    this._boundsRect = new Rectangle();
                }

                rect = this._boundsRect;
            }

            return this._bounds.getRectangle(rect);
        };

        /**
         * Retrieves the local bounds of the displayObject as a rectangle object.
         *
         * @param {PIXI.Rectangle} [rect] - Optional rectangle to store the result of the bounds calculation.
         * @return {PIXI.Rectangle} The rectangular bounding area.
         */
        DisplayObject.prototype.getLocalBounds = function getLocalBounds (rect)
        {
            var transformRef = this.transform;
            var parentRef = this.parent;

            this.parent = null;
            this.transform = this._tempDisplayObjectParent.transform;

            if (!rect)
            {
                if (!this._localBoundsRect)
                {
                    this._localBoundsRect = new Rectangle();
                }

                rect = this._localBoundsRect;
            }

            var bounds = this.getBounds(false, rect);

            this.parent = parentRef;
            this.transform = transformRef;

            return bounds;
        };

        /**
         * Calculates the global position of the display object.
         *
         * @param {PIXI.IPoint} position - The world origin to calculate from.
         * @param {PIXI.IPoint} [point] - A Point object in which to store the value, optional
         *  (otherwise will create a new Point).
         * @param {boolean} [skipUpdate=false] - Should we skip the update transform.
         * @return {PIXI.IPoint} A point object representing the position of this object.
         */
        DisplayObject.prototype.toGlobal = function toGlobal (position, point, skipUpdate)
        {
            if ( skipUpdate === void 0 ) skipUpdate = false;

            if (!skipUpdate)
            {
                this._recursivePostUpdateTransform();

                // this parent check is for just in case the item is a root object.
                // If it is we need to give it a temporary parent so that displayObjectUpdateTransform works correctly
                // this is mainly to avoid a parent check in the main loop. Every little helps for performance :)
                if (!this.parent)
                {
                    this.parent = this._tempDisplayObjectParent;
                    this.displayObjectUpdateTransform();
                    this.parent = null;
                }
                else
                {
                    this.displayObjectUpdateTransform();
                }
            }

            // don't need to update the lot
            return this.worldTransform.apply(position, point);
        };

        /**
         * Calculates the local position of the display object relative to another point.
         *
         * @param {PIXI.IPoint} position - The world origin to calculate from.
         * @param {PIXI.DisplayObject} [from] - The DisplayObject to calculate the global position from.
         * @param {PIXI.IPoint} [point] - A Point object in which to store the value, optional
         *  (otherwise will create a new Point).
         * @param {boolean} [skipUpdate=false] - Should we skip the update transform
         * @return {PIXI.IPoint} A point object representing the position of this object
         */
        DisplayObject.prototype.toLocal = function toLocal (position, from, point, skipUpdate)
        {
            if (from)
            {
                position = from.toGlobal(position, point, skipUpdate);
            }

            if (!skipUpdate)
            {
                this._recursivePostUpdateTransform();

                // this parent check is for just in case the item is a root object.
                // If it is we need to give it a temporary parent so that displayObjectUpdateTransform works correctly
                // this is mainly to avoid a parent check in the main loop. Every little helps for performance :)
                if (!this.parent)
                {
                    this.parent = this._tempDisplayObjectParent;
                    this.displayObjectUpdateTransform();
                    this.parent = null;
                }
                else
                {
                    this.displayObjectUpdateTransform();
                }
            }

            // simply apply the matrix..
            return this.worldTransform.applyInverse(position, point);
        };

        /**
         * Renders the object using the WebGL renderer.
         *
         * @param {PIXI.Renderer} renderer - The renderer.
         */
        DisplayObject.prototype.render = function render (renderer) // eslint-disable-line no-unused-vars
        {
            // OVERWRITE;
        };

        /**
         * Set the parent Container of this DisplayObject.
         *
         * @param {PIXI.Container} container - The Container to add this DisplayObject to.
         * @return {PIXI.Container} The Container that this DisplayObject was added to.
         */
        DisplayObject.prototype.setParent = function setParent (container)
        {
            if (!container || !container.addChild)
            {
                throw new Error('setParent: Argument must be a Container');
            }

            container.addChild(this);

            return container;
        };

        /**
         * Convenience function to set the position, scale, skew and pivot at once.
         *
         * @param {number} [x=0] - The X position
         * @param {number} [y=0] - The Y position
         * @param {number} [scaleX=1] - The X scale value
         * @param {number} [scaleY=1] - The Y scale value
         * @param {number} [rotation=0] - The rotation
         * @param {number} [skewX=0] - The X skew value
         * @param {number} [skewY=0] - The Y skew value
         * @param {number} [pivotX=0] - The X pivot value
         * @param {number} [pivotY=0] - The Y pivot value
         * @return {PIXI.DisplayObject} The DisplayObject instance
         */
        DisplayObject.prototype.setTransform = function setTransform (x, y, scaleX, scaleY, rotation, skewX, skewY, pivotX, pivotY)
        {
            if ( x === void 0 ) x = 0;
            if ( y === void 0 ) y = 0;
            if ( scaleX === void 0 ) scaleX = 1;
            if ( scaleY === void 0 ) scaleY = 1;
            if ( rotation === void 0 ) rotation = 0;
            if ( skewX === void 0 ) skewX = 0;
            if ( skewY === void 0 ) skewY = 0;
            if ( pivotX === void 0 ) pivotX = 0;
            if ( pivotY === void 0 ) pivotY = 0;

            this.position.x = x;
            this.position.y = y;
            this.scale.x = !scaleX ? 1 : scaleX;
            this.scale.y = !scaleY ? 1 : scaleY;
            this.rotation = rotation;
            this.skew.x = skewX;
            this.skew.y = skewY;
            this.pivot.x = pivotX;
            this.pivot.y = pivotY;

            return this;
        };

        /**
         * Base destroy method for generic display objects. This will automatically
         * remove the display object from its parent Container as well as remove
         * all current event listeners and internal references. Do not use a DisplayObject
         * after calling `destroy()`.
         *
         */
        DisplayObject.prototype.destroy = function destroy ()
        {
            if (this.parent)
            {
                this.parent.removeChild(this);
            }
            this.removeAllListeners();
            this.transform = null;

            this.parent = null;
            this._bounds = null;
            this._currentBounds = null;
            this._mask = null;

            this.filters = null;
            this.filterArea = null;
            this.hitArea = null;

            this.interactive = false;
            this.interactiveChildren = false;

            this._destroyed = true;
        };

        /**
         * The position of the displayObject on the x axis relative to the local coordinates of the parent.
         * An alias to position.x
         *
         * @member {number}
         */
        prototypeAccessors.x.get = function ()
        {
            return this.position.x;
        };

        prototypeAccessors.x.set = function (value) // eslint-disable-line require-jsdoc
        {
            this.transform.position.x = value;
        };

        /**
         * The position of the displayObject on the y axis relative to the local coordinates of the parent.
         * An alias to position.y
         *
         * @member {number}
         */
        prototypeAccessors.y.get = function ()
        {
            return this.position.y;
        };

        prototypeAccessors.y.set = function (value) // eslint-disable-line require-jsdoc
        {
            this.transform.position.y = value;
        };

        /**
         * Current transform of the object based on world (parent) factors.
         *
         * @member {PIXI.Matrix}
         * @readonly
         */
        prototypeAccessors.worldTransform.get = function ()
        {
            return this.transform.worldTransform;
        };

        /**
         * Current transform of the object based on local factors: position, scale, other stuff.
         *
         * @member {PIXI.Matrix}
         * @readonly
         */
        prototypeAccessors.localTransform.get = function ()
        {
            return this.transform.localTransform;
        };

        /**
         * The coordinate of the object relative to the local coordinates of the parent.
         * Assignment by value since pixi-v4.
         *
         * @member {PIXI.IPoint}
         */
        prototypeAccessors.position.get = function ()
        {
            return this.transform.position;
        };

        prototypeAccessors.position.set = function (value) // eslint-disable-line require-jsdoc
        {
            this.transform.position.copyFrom(value);
        };

        /**
         * The scale factor of the object.
         * Assignment by value since pixi-v4.
         *
         * @member {PIXI.IPoint}
         */
        prototypeAccessors.scale.get = function ()
        {
            return this.transform.scale;
        };

        prototypeAccessors.scale.set = function (value) // eslint-disable-line require-jsdoc
        {
            this.transform.scale.copyFrom(value);
        };

        /**
         * The pivot point of the displayObject that it rotates around.
         * Assignment by value since pixi-v4.
         *
         * @member {PIXI.IPoint}
         */
        prototypeAccessors.pivot.get = function ()
        {
            return this.transform.pivot;
        };

        prototypeAccessors.pivot.set = function (value) // eslint-disable-line require-jsdoc
        {
            this.transform.pivot.copyFrom(value);
        };

        /**
         * The skew factor for the object in radians.
         * Assignment by value since pixi-v4.
         *
         * @member {PIXI.ObservablePoint}
         */
        prototypeAccessors.skew.get = function ()
        {
            return this.transform.skew;
        };

        prototypeAccessors.skew.set = function (value) // eslint-disable-line require-jsdoc
        {
            this.transform.skew.copyFrom(value);
        };

        /**
         * The rotation of the object in radians.
         * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
         *
         * @member {number}
         */
        prototypeAccessors.rotation.get = function ()
        {
            return this.transform.rotation;
        };

        prototypeAccessors.rotation.set = function (value) // eslint-disable-line require-jsdoc
        {
            this.transform.rotation = value;
        };

        /**
         * The angle of the object in degrees.
         * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
         *
         * @member {number}
         */
        prototypeAccessors.angle.get = function ()
        {
            return this.transform.rotation * RAD_TO_DEG;
        };

        prototypeAccessors.angle.set = function (value) // eslint-disable-line require-jsdoc
        {
            this.transform.rotation = value * DEG_TO_RAD;
        };

        /**
         * The zIndex of the displayObject.
         * If a container has the sortableChildren property set to true, children will be automatically
         * sorted by zIndex value; a higher value will mean it will be moved towards the end of the array,
         * and thus rendered on top of other displayObjects within the same container.
         *
         * @member {number}
         */
        prototypeAccessors.zIndex.get = function ()
        {
            return this._zIndex;
        };

        prototypeAccessors.zIndex.set = function (value) // eslint-disable-line require-jsdoc
        {
            this._zIndex = value;
            if (this.parent)
            {
                this.parent.sortDirty = true;
            }
        };

        /**
         * Indicates if the object is globally visible.
         *
         * @member {boolean}
         * @readonly
         */
        prototypeAccessors.worldVisible.get = function ()
        {
            var item = this;

            do
            {
                if (!item.visible)
                {
                    return false;
                }

                item = item.parent;
            } while (item);

            return true;
        };

        /**
         * Sets a mask for the displayObject. A mask is an object that limits the visibility of an
         * object to the shape of the mask applied to it. In PixiJS a regular mask must be a
         * {@link PIXI.Graphics} or a {@link PIXI.Sprite} object. This allows for much faster masking in canvas as it
         * utilities shape clipping. To remove a mask, set this property to `null`.
         *
         * For sprite mask both alpha and red channel are used. Black mask is the same as transparent mask.
         * @example
         * const graphics = new PIXI.Graphics();
         * graphics.beginFill(0xFF3300);
         * graphics.drawRect(50, 250, 100, 100);
         * graphics.endFill();
         *
         * const sprite = new PIXI.Sprite(texture);
         * sprite.mask = graphics;
         * @todo At the moment, PIXI.CanvasRenderer doesn't support PIXI.Sprite as mask.
         *
         * @member {PIXI.Container|PIXI.MaskData}
         */
        prototypeAccessors.mask.get = function ()
        {
            return this._mask;
        };

        prototypeAccessors.mask.set = function (value) // eslint-disable-line require-jsdoc
        {
            if (this._mask)
            {
                var maskObject = this._mask.maskObject || this._mask;

                maskObject.renderable = true;
                maskObject.isMask = false;
            }

            this._mask = value;

            if (this._mask)
            {
                var maskObject$1 = this._mask.maskObject || this._mask;

                maskObject$1.renderable = false;
                maskObject$1.isMask = true;
            }
        };

        Object.defineProperties( DisplayObject.prototype, prototypeAccessors );

        return DisplayObject;
    }(eventemitter3));

    /**
     * DisplayObject default updateTransform, does not update children of container.
     * Will crash if there's no parent element.
     *
     * @memberof PIXI.DisplayObject#
     * @function displayObjectUpdateTransform
     */
    DisplayObject.prototype.displayObjectUpdateTransform = DisplayObject.prototype.updateTransform;

    /*!
     * @pixi/core - v5.2.1
     * Compiled Tue, 28 Jan 2020 23:33:11 UTC
     *
     * @pixi/core is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    /**
     * Base resource class for textures that manages validation and uploading, depending on its type.
     *
     * Uploading of a base texture to the GPU is required.
     *
     * @class
     * @memberof PIXI.resources
     */
    var Resource = function Resource(width, height)
    {
        if ( width === void 0 ) width = 0;
        if ( height === void 0 ) height = 0;

        /**
         * Internal width of the resource
         * @member {number}
         * @protected
         */
        this._width = width;

        /**
         * Internal height of the resource
         * @member {number}
         * @protected
         */
        this._height = height;

        /**
         * If resource has been destroyed
         * @member {boolean}
         * @readonly
         * @default false
         */
        this.destroyed = false;

        /**
         * `true` if resource is created by BaseTexture
         * useful for doing cleanup with BaseTexture destroy
         * and not cleaning up resources that were created
         * externally.
         * @member {boolean}
         * @protected
         */
        this.internal = false;

        /**
         * Mini-runner for handling resize events
         *
         * @member {Runner}
         * @private
         */
        this.onResize = new Runner('setRealSize', 2);

        /**
         * Mini-runner for handling update events
         *
         * @member {Runner}
         * @private
         */
        this.onUpdate = new Runner('update');

        /**
         * Handle internal errors, such as loading errors
         *
         * @member {Runner}
         * @private
         */
        this.onError = new Runner('onError', 1);
    };

    var prototypeAccessors = { valid: { configurable: true },width: { configurable: true },height: { configurable: true } };

    /**
     * Bind to a parent BaseTexture
     *
     * @param {PIXI.BaseTexture} baseTexture - Parent texture
     */
    Resource.prototype.bind = function bind (baseTexture)
    {
        this.onResize.add(baseTexture);
        this.onUpdate.add(baseTexture);
        this.onError.add(baseTexture);

        // Call a resize immediate if we already
        // have the width and height of the resource
        if (this._width || this._height)
        {
            this.onResize.run(this._width, this._height);
        }
    };

    /**
     * Unbind to a parent BaseTexture
     *
     * @param {PIXI.BaseTexture} baseTexture - Parent texture
     */
    Resource.prototype.unbind = function unbind (baseTexture)
    {
        this.onResize.remove(baseTexture);
        this.onUpdate.remove(baseTexture);
        this.onError.remove(baseTexture);
    };

    /**
     * Trigger a resize event
     * @param {number} width X dimension
     * @param {number} height Y dimension
     */
    Resource.prototype.resize = function resize (width, height)
    {
        if (width !== this._width || height !== this._height)
        {
            this._width = width;
            this._height = height;
            this.onResize.run(width, height);
        }
    };

    /**
     * Has been validated
     * @readonly
     * @member {boolean}
     */
    prototypeAccessors.valid.get = function ()
    {
        return !!this._width && !!this._height;
    };

    /**
     * Has been updated trigger event
     */
    Resource.prototype.update = function update ()
    {
        if (!this.destroyed)
        {
            this.onUpdate.run();
        }
    };

    /**
     * This can be overridden to start preloading a resource
     * or do any other prepare step.
     * @protected
     * @return {Promise<void>} Handle the validate event
     */
    Resource.prototype.load = function load ()
    {
        return Promise.resolve();
    };

    /**
     * The width of the resource.
     *
     * @member {number}
     * @readonly
     */
    prototypeAccessors.width.get = function ()
    {
        return this._width;
    };

    /**
     * The height of the resource.
     *
     * @member {number}
     * @readonly
     */
    prototypeAccessors.height.get = function ()
    {
        return this._height;
    };

    /**
     * Uploads the texture or returns false if it cant for some reason. Override this.
     *
     * @param {PIXI.Renderer} renderer - yeah, renderer!
     * @param {PIXI.BaseTexture} baseTexture - the texture
     * @param {PIXI.GLTexture} glTexture - texture instance for this webgl context
     * @returns {boolean} true is success
     */
    Resource.prototype.upload = function upload (renderer, baseTexture, glTexture) // eslint-disable-line no-unused-vars
    {
        return false;
    };

    /**
     * Set the style, optional to override
     *
     * @param {PIXI.Renderer} renderer - yeah, renderer!
     * @param {PIXI.BaseTexture} baseTexture - the texture
     * @param {PIXI.GLTexture} glTexture - texture instance for this webgl context
     * @returns {boolean} `true` is success
     */
    Resource.prototype.style = function style (renderer, baseTexture, glTexture) // eslint-disable-line no-unused-vars
    {
        return false;
    };

    /**
     * Clean up anything, this happens when destroying is ready.
     *
     * @protected
     */
    Resource.prototype.dispose = function dispose ()
    {
        // override
    };

    /**
     * Call when destroying resource, unbind any BaseTexture object
     * before calling this method, as reference counts are maintained
     * internally.
     */
    Resource.prototype.destroy = function destroy ()
    {
        if (!this.destroyed)
        {
            this.destroyed = true;
            this.dispose();
            this.onError.removeAll();
            this.onError = null;
            this.onResize.removeAll();
            this.onResize = null;
            this.onUpdate.removeAll();
            this.onUpdate = null;
        }
    };

    Object.defineProperties( Resource.prototype, prototypeAccessors );

    /**
     * Base for all the image/canvas resources
     * @class
     * @extends PIXI.resources.Resource
     * @memberof PIXI.resources
     */
    var BaseImageResource = /*@__PURE__*/(function (Resource) {
        function BaseImageResource(source)
        {
            var width = source.naturalWidth || source.videoWidth || source.width;
            var height = source.naturalHeight || source.videoHeight || source.height;

            Resource.call(this, width, height);

            /**
             * The source element
             * @member {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|SVGElement}
             * @readonly
             */
            this.source = source;

            /**
             * If set to `true`, will force `texImage2D` over `texSubImage2D` for uploading.
             * Certain types of media (e.g. video) using `texImage2D` is more performant.
             * @member {boolean}
             * @default false
             * @private
             */
            this.noSubImage = false;
        }

        if ( Resource ) BaseImageResource.__proto__ = Resource;
        BaseImageResource.prototype = Object.create( Resource && Resource.prototype );
        BaseImageResource.prototype.constructor = BaseImageResource;

        /**
         * Set cross origin based detecting the url and the crossorigin
         * @protected
         * @param {HTMLElement} element - Element to apply crossOrigin
         * @param {string} url - URL to check
         * @param {boolean|string} [crossorigin=true] - Cross origin value to use
         */
        BaseImageResource.crossOrigin = function crossOrigin (element, url, crossorigin)
        {
            if (crossorigin === undefined && url.indexOf('data:') !== 0)
            {
                element.crossOrigin = determineCrossOrigin(url);
            }
            else if (crossorigin !== false)
            {
                element.crossOrigin = typeof crossorigin === 'string' ? crossorigin : 'anonymous';
            }
        };

        /**
         * Upload the texture to the GPU.
         * @param {PIXI.Renderer} renderer Upload to the renderer
         * @param {PIXI.BaseTexture} baseTexture Reference to parent texture
         * @param {PIXI.GLTexture} glTexture
         * @param {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|SVGElement} [source] (optional)
         * @returns {boolean} true is success
         */
        BaseImageResource.prototype.upload = function upload (renderer, baseTexture, glTexture, source)
        {
            var gl = renderer.gl;
            var width = baseTexture.realWidth;
            var height = baseTexture.realHeight;

            source = source || this.source;

            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, baseTexture.alphaMode === ALPHA_MODES.UNPACK);

            if (!this.noSubImage
                && baseTexture.target === gl.TEXTURE_2D
                && glTexture.width === width
                && glTexture.height === height)
            {
                gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, baseTexture.format, baseTexture.type, source);
            }
            else
            {
                glTexture.width = width;
                glTexture.height = height;

                gl.texImage2D(baseTexture.target, 0, baseTexture.format, baseTexture.format, baseTexture.type, source);
            }

            return true;
        };

        /**
         * Checks if source width/height was changed, resize can cause extra baseTexture update.
         * Triggers one update in any case.
         */
        BaseImageResource.prototype.update = function update ()
        {
            if (this.destroyed)
            {
                return;
            }

            var width = this.source.naturalWidth || this.source.videoWidth || this.source.width;
            var height = this.source.naturalHeight || this.source.videoHeight || this.source.height;

            this.resize(width, height);

            Resource.prototype.update.call(this);
        };

        /**
         * Destroy this BaseImageResource
         * @override
         * @param {PIXI.BaseTexture} [fromTexture] Optional base texture
         * @return {boolean} Destroy was successful
         */
        BaseImageResource.prototype.dispose = function dispose ()
        {
            this.source = null;
        };

        return BaseImageResource;
    }(Resource));

    /**
     * Resource type for HTMLImageElement.
     * @class
     * @extends PIXI.resources.BaseImageResource
     * @memberof PIXI.resources
     */
    var ImageResource = /*@__PURE__*/(function (BaseImageResource) {
        function ImageResource(source, options)
        {
            options = options || {};

            if (!(source instanceof HTMLImageElement))
            {
                var imageElement = new Image();

                BaseImageResource.crossOrigin(imageElement, source, options.crossorigin);

                imageElement.src = source;
                source = imageElement;
            }

            BaseImageResource.call(this, source);

            // FireFox 68, and possibly other versions, seems like setting the HTMLImageElement#width and #height
            // to non-zero values before its loading completes if images are in a cache.
            // Because of this, need to set the `_width` and the `_height` to zero to avoid uploading incomplete images.
            // Please refer to the issue #5968 (https://github.com/pixijs/pixi.js/issues/5968).
            if (!source.complete && !!this._width && !!this._height)
            {
                this._width = 0;
                this._height = 0;
            }

            /**
             * URL of the image source
             * @member {string}
             */
            this.url = source.src;

            /**
             * When process is completed
             * @member {Promise<void>}
             * @private
             */
            this._process = null;

            /**
             * If the image should be disposed after upload
             * @member {boolean}
             * @default false
             */
            this.preserveBitmap = false;

            /**
             * If capable, convert the image using createImageBitmap API
             * @member {boolean}
             * @default PIXI.settings.CREATE_IMAGE_BITMAP
             */
            this.createBitmap = (options.createBitmap !== undefined
                ? options.createBitmap : settings.CREATE_IMAGE_BITMAP) && !!window.createImageBitmap;

            /**
             * Controls texture alphaMode field
             * Copies from options
             * Default is `null`, copies option from baseTexture
             *
             * @member {PIXI.ALPHA_MODES|null}
             * @readonly
             */
            this.alphaMode = typeof options.alphaMode === 'number' ? options.alphaMode : null;

            if (options.premultiplyAlpha !== undefined)
            {
                // triggers deprecation
                this.premultiplyAlpha = options.premultiplyAlpha;
            }

            /**
             * The ImageBitmap element created for HTMLImageElement
             * @member {ImageBitmap}
             * @default null
             */
            this.bitmap = null;

            /**
             * Promise when loading
             * @member {Promise<void>}
             * @private
             * @default null
             */
            this._load = null;

            if (options.autoLoad !== false)
            {
                this.load();
            }
        }

        if ( BaseImageResource ) ImageResource.__proto__ = BaseImageResource;
        ImageResource.prototype = Object.create( BaseImageResource && BaseImageResource.prototype );
        ImageResource.prototype.constructor = ImageResource;

        /**
         * returns a promise when image will be loaded and processed
         *
         * @param {boolean} [createBitmap=true] whether process image into bitmap
         * @returns {Promise<void>}
         */
        ImageResource.prototype.load = function load (createBitmap)
        {
            var this$1 = this;

            if (createBitmap !== undefined)
            {
                this.createBitmap = createBitmap;
            }

            if (this._load)
            {
                return this._load;
            }

            this._load = new Promise(function (resolve) {
                this$1.url = this$1.source.src;
                var ref = this$1;
                var source = ref.source;

                var completed = function () {
                    if (this$1.destroyed)
                    {
                        return;
                    }
                    source.onload = null;
                    source.onerror = null;

                    this$1.resize(source.width, source.height);
                    this$1._load = null;

                    if (this$1.createBitmap)
                    {
                        resolve(this$1.process());
                    }
                    else
                    {
                        resolve(this$1);
                    }
                };

                if (source.complete && source.src)
                {
                    completed();
                }
                else
                {
                    source.onload = completed;
                    source.onerror = function (event) { return this$1.onError.run(event); };
                }
            });

            return this._load;
        };

        /**
         * Called when we need to convert image into BitmapImage.
         * Can be called multiple times, real promise is cached inside.
         *
         * @returns {Promise<void>} cached promise to fill that bitmap
         */
        ImageResource.prototype.process = function process ()
        {
            var this$1 = this;

            if (this._process !== null)
            {
                return this._process;
            }
            if (this.bitmap !== null || !window.createImageBitmap)
            {
                return Promise.resolve(this);
            }

            this._process = window.createImageBitmap(this.source,
                0, 0, this.source.width, this.source.height,
                {
                    premultiplyAlpha: this.premultiplyAlpha === ALPHA_MODES.UNPACK ? 'premultiply' : 'none',
                })
                .then(function (bitmap) {
                    if (this$1.destroyed)
                    {
                        return Promise.reject();
                    }
                    this$1.bitmap = bitmap;
                    this$1.update();
                    this$1._process = null;

                    return Promise.resolve(this$1);
                });

            return this._process;
        };

        /**
         * Upload the image resource to GPU.
         *
         * @param {PIXI.Renderer} renderer - Renderer to upload to
         * @param {PIXI.BaseTexture} baseTexture - BaseTexture for this resource
         * @param {PIXI.GLTexture} glTexture - GLTexture to use
         * @returns {boolean} true is success
         */
        ImageResource.prototype.upload = function upload (renderer, baseTexture, glTexture)
        {
            if (typeof this.alphaMode === 'number')
            {
                // bitmap stores unpack premultiply flag, we dont have to notify texImage2D about it

                baseTexture.alphaMode = this.alphaMode;
            }

            if (!this.createBitmap)
            {
                return BaseImageResource.prototype.upload.call(this, renderer, baseTexture, glTexture);
            }
            if (!this.bitmap)
            {
                // yeah, ignore the output
                this.process();
                if (!this.bitmap)
                {
                    return false;
                }
            }

            BaseImageResource.prototype.upload.call(this, renderer, baseTexture, glTexture, this.bitmap);

            if (!this.preserveBitmap)
            {
                // checks if there are other renderers that possibly need this bitmap

                var flag = true;

                for (var key in baseTexture._glTextures)
                {
                    var otherTex = baseTexture._glTextures[key];

                    if (otherTex !== glTexture && otherTex.dirtyId !== baseTexture.dirtyId)
                    {
                        flag = false;
                        break;
                    }
                }

                if (flag)
                {
                    if (this.bitmap.close)
                    {
                        this.bitmap.close();
                    }

                    this.bitmap = null;
                }
            }

            return true;
        };

        /**
         * Destroys this texture
         * @override
         */
        ImageResource.prototype.dispose = function dispose ()
        {
            this.source.onload = null;
            this.source.onerror = null;

            BaseImageResource.prototype.dispose.call(this);

            if (this.bitmap)
            {
                this.bitmap.close();
                this.bitmap = null;
            }
            this._process = null;
            this._load = null;
        };

        return ImageResource;
    }(BaseImageResource));

    /**
     * Collection of installed resource types, class must extend {@link PIXI.resources.Resource}.
     * @example
     * class CustomResource extends PIXI.resources.Resource {
     *   // MUST have source, options constructor signature
     *   // for auto-detected resources to be created.
     *   constructor(source, options) {
     *     super();
     *   }
     *   upload(renderer, baseTexture, glTexture) {
     *     // upload with GL
     *     return true;
     *   }
     *   // used to auto-detect resource
     *   static test(source, extension) {
     *     return extension === 'xyz'|| source instanceof SomeClass;
     *   }
     * }
     * // Install the new resource type
     * PIXI.resources.INSTALLED.push(CustomResource);
     *
     * @name PIXI.resources.INSTALLED
     * @type {Array<*>}
     * @static
     * @readonly
     */
    var INSTALLED = [];

    /**
     * Create a resource element from a single source element. This
     * auto-detects which type of resource to create. All resources that
     * are auto-detectable must have a static `test` method and a constructor
     * with the arguments `(source, options?)`. Currently, the supported
     * resources for auto-detection include:
     *  - {@link PIXI.resources.ImageResource}
     *  - {@link PIXI.resources.CanvasResource}
     *  - {@link PIXI.resources.VideoResource}
     *  - {@link PIXI.resources.SVGResource}
     *  - {@link PIXI.resources.BufferResource}
     * @static
     * @function PIXI.resources.autoDetectResource
     * @param {string|*} source - Resource source, this can be the URL to the resource,
     *        a typed-array (for BufferResource), HTMLVideoElement, SVG data-uri
     *        or any other resource that can be auto-detected. If not resource is
     *        detected, it's assumed to be an ImageResource.
     * @param {object} [options] - Pass-through options to use for Resource
     * @param {number} [options.width] - Width of BufferResource or SVG rasterization
     * @param {number} [options.height] - Height of BufferResource or SVG rasterization
     * @param {boolean} [options.autoLoad=true] - Image, SVG and Video flag to start loading
     * @param {number} [options.scale=1] - SVG source scale. Overridden by width, height
     * @param {boolean} [options.createBitmap=PIXI.settings.CREATE_IMAGE_BITMAP] - Image option to create Bitmap object
     * @param {boolean} [options.crossorigin=true] - Image and Video option to set crossOrigin
     * @param {boolean} [options.autoPlay=true] - Video option to start playing video immediately
     * @param {number} [options.updateFPS=0] - Video option to update how many times a second the
     *        texture should be updated from the video. Leave at 0 to update at every render
     * @return {PIXI.resources.Resource} The created resource.
     */
    function autoDetectResource(source, options)
    {
        if (!source)
        {
            return null;
        }

        var extension = '';

        if (typeof source === 'string')
        {
            // search for file extension: period, 3-4 chars, then ?, # or EOL
            var result = (/\.(\w{3,4})(?:$|\?|#)/i).exec(source);

            if (result)
            {
                extension = result[1].toLowerCase();
            }
        }

        for (var i = INSTALLED.length - 1; i >= 0; --i)
        {
            var ResourcePlugin = INSTALLED[i];

            if (ResourcePlugin.test && ResourcePlugin.test(source, extension))
            {
                return new ResourcePlugin(source, options);
            }
        }

        // When in doubt: probably an image
        // might be appropriate to throw an error or return null
        return new ImageResource(source, options);
    }

    /**
     * @interface SharedArrayBuffer
     */

    /**
     * Buffer resource with data of typed array.
     * @class
     * @extends PIXI.resources.Resource
     * @memberof PIXI.resources
     */
    var BufferResource = /*@__PURE__*/(function (Resource) {
        function BufferResource(source, options)
        {
            var ref = options || {};
            var width = ref.width;
            var height = ref.height;

            if (!width || !height)
            {
                throw new Error('BufferResource width or height invalid');
            }

            Resource.call(this, width, height);

            /**
             * Source array
             * Cannot be ClampedUint8Array because it cant be uploaded to WebGL
             *
             * @member {Float32Array|Uint8Array|Uint32Array}
             */
            this.data = source;
        }

        if ( Resource ) BufferResource.__proto__ = Resource;
        BufferResource.prototype = Object.create( Resource && Resource.prototype );
        BufferResource.prototype.constructor = BufferResource;

        /**
         * Upload the texture to the GPU.
         * @param {PIXI.Renderer} renderer Upload to the renderer
         * @param {PIXI.BaseTexture} baseTexture Reference to parent texture
         * @param {PIXI.GLTexture} glTexture glTexture
         * @returns {boolean} true is success
         */
        BufferResource.prototype.upload = function upload (renderer, baseTexture, glTexture)
        {
            var gl = renderer.gl;

            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, baseTexture.alphaMode === ALPHA_MODES.UNPACK);

            if (glTexture.width === baseTexture.width && glTexture.height === baseTexture.height)
            {
                gl.texSubImage2D(
                    baseTexture.target,
                    0,
                    0,
                    0,
                    baseTexture.width,
                    baseTexture.height,
                    baseTexture.format,
                    baseTexture.type,
                    this.data
                );
            }
            else
            {
                glTexture.width = baseTexture.width;
                glTexture.height = baseTexture.height;

                gl.texImage2D(
                    baseTexture.target,
                    0,
                    glTexture.internalFormat,
                    baseTexture.width,
                    baseTexture.height,
                    0,
                    baseTexture.format,
                    glTexture.type,
                    this.data
                );
            }

            return true;
        };

        /**
         * Destroy and don't use after this
         * @override
         */
        BufferResource.prototype.dispose = function dispose ()
        {
            this.data = null;
        };

        /**
         * Used to auto-detect the type of resource.
         *
         * @static
         * @param {*} source - The source object
         * @return {boolean} `true` if <canvas>
         */
        BufferResource.test = function test (source)
        {
            return source instanceof Float32Array
                || source instanceof Uint8Array
                || source instanceof Uint32Array;
        };

        return BufferResource;
    }(Resource));

    var defaultBufferOptions = {
        scaleMode: SCALE_MODES.NEAREST,
        format: FORMATS.RGBA,
        alphaMode: ALPHA_MODES.NPM,
    };

    /**
     * A Texture stores the information that represents an image.
     * All textures have a base texture, which contains information about the source.
     * Therefore you can have many textures all using a single BaseTexture
     *
     * @class
     * @extends PIXI.utils.EventEmitter
     * @memberof PIXI
     * @param {PIXI.resources.Resource|string|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} [resource=null]
     *        The current resource to use, for things that aren't Resource objects, will be converted
     *        into a Resource.
     * @param {Object} [options] - Collection of options
     * @param {PIXI.MIPMAP_MODES} [options.mipmap=PIXI.settings.MIPMAP_TEXTURES] - If mipmapping is enabled for texture
     * @param {number} [options.anisotropicLevel=PIXI.settings.ANISOTROPIC_LEVEL] - Anisotropic filtering level of texture
     * @param {PIXI.WRAP_MODES} [options.wrapMode=PIXI.settings.WRAP_MODE] - Wrap mode for textures
     * @param {PIXI.SCALE_MODES} [options.scaleMode=PIXI.settings.SCALE_MODE] - Default scale mode, linear, nearest
     * @param {PIXI.FORMATS} [options.format=PIXI.FORMATS.RGBA] - GL format type
     * @param {PIXI.TYPES} [options.type=PIXI.TYPES.UNSIGNED_BYTE] - GL data type
     * @param {PIXI.TARGETS} [options.target=PIXI.TARGETS.TEXTURE_2D] - GL texture target
     * @param {PIXI.ALPHA_MODES} [options.alphaMode=PIXI.ALPHA_MODES.UNPACK] - Pre multiply the image alpha
     * @param {number} [options.width=0] - Width of the texture
     * @param {number} [options.height=0] - Height of the texture
     * @param {number} [options.resolution] - Resolution of the base texture
     * @param {object} [options.resourceOptions] - Optional resource options,
     *        see {@link PIXI.resources.autoDetectResource autoDetectResource}
     */
    var BaseTexture = /*@__PURE__*/(function (EventEmitter) {
        function BaseTexture(resource, options)
        {
            if ( resource === void 0 ) resource = null;
            if ( options === void 0 ) options = null;

            EventEmitter.call(this);

            options = options || {};

            var alphaMode = options.alphaMode;
            var mipmap = options.mipmap;
            var anisotropicLevel = options.anisotropicLevel;
            var scaleMode = options.scaleMode;
            var width = options.width;
            var height = options.height;
            var wrapMode = options.wrapMode;
            var format = options.format;
            var type = options.type;
            var target = options.target;
            var resolution = options.resolution;
            var resourceOptions = options.resourceOptions;

            // Convert the resource to a Resource object
            if (resource && !(resource instanceof Resource))
            {
                resource = autoDetectResource(resource, resourceOptions);
                resource.internal = true;
            }

            /**
             * The width of the base texture set when the image has loaded
             *
             * @readonly
             * @member {number}
             */
            this.width = width || 0;

            /**
             * The height of the base texture set when the image has loaded
             *
             * @readonly
             * @member {number}
             */
            this.height = height || 0;

            /**
             * The resolution / device pixel ratio of the texture
             *
             * @member {number}
             * @default PIXI.settings.RESOLUTION
             */
            this.resolution = resolution || settings.RESOLUTION;

            /**
             * Mipmap mode of the texture, affects downscaled images
             *
             * @member {PIXI.MIPMAP_MODES}
             * @default PIXI.settings.MIPMAP_TEXTURES
             */
            this.mipmap = mipmap !== undefined ? mipmap : settings.MIPMAP_TEXTURES;

            /**
             * Anisotropic filtering level of texture
             *
             * @member {number}
             * @default PIXI.settings.ANISOTROPIC_LEVEL
             */
            this.anisotropicLevel = anisotropicLevel !== undefined ? anisotropicLevel : settings.ANISOTROPIC_LEVEL;

            /**
             * How the texture wraps
             * @member {number}
             */
            this.wrapMode = wrapMode || settings.WRAP_MODE;

            /**
             * The scale mode to apply when scaling this texture
             *
             * @member {PIXI.SCALE_MODES}
             * @default PIXI.settings.SCALE_MODE
             */
            this.scaleMode = scaleMode !== undefined ? scaleMode : settings.SCALE_MODE;

            /**
             * The pixel format of the texture
             *
             * @member {PIXI.FORMATS}
             * @default PIXI.FORMATS.RGBA
             */
            this.format = format || FORMATS.RGBA;

            /**
             * The type of resource data
             *
             * @member {PIXI.TYPES}
             * @default PIXI.TYPES.UNSIGNED_BYTE
             */
            this.type = type || TYPES.UNSIGNED_BYTE;

            /**
             * The target type
             *
             * @member {PIXI.TARGETS}
             * @default PIXI.TARGETS.TEXTURE_2D
             */
            this.target = target || TARGETS.TEXTURE_2D;

            /**
             * How to treat premultiplied alpha, see {@link PIXI.ALPHA_MODES}.
             *
             * @member {PIXI.ALPHA_MODES}
             * @default PIXI.ALPHA_MODES.UNPACK
             */
            this.alphaMode = alphaMode !== undefined ? alphaMode : ALPHA_MODES.UNPACK;

            if (options.premultiplyAlpha !== undefined)
            {
                // triggers deprecation
                this.premultiplyAlpha = options.premultiplyAlpha;
            }

            /**
             * Global unique identifier for this BaseTexture
             *
             * @member {string}
             * @protected
             */
            this.uid = uid();

            /**
             * Used by automatic texture Garbage Collection, stores last GC tick when it was bound
             *
             * @member {number}
             * @protected
             */
            this.touched = 0;

            /**
             * Whether or not the texture is a power of two, try to use power of two textures as much
             * as you can
             *
             * @readonly
             * @member {boolean}
             * @default false
             */
            this.isPowerOfTwo = false;
            this._refreshPOT();

            /**
             * The map of render context textures where this is bound
             *
             * @member {Object}
             * @private
             */
            this._glTextures = {};

            /**
             * Used by TextureSystem to only update texture to the GPU when needed.
             * Please call `update()` to increment it.
             *
             * @readonly
             * @member {number}
             */
            this.dirtyId = 0;

            /**
             * Used by TextureSystem to only update texture style when needed.
             *
             * @protected
             * @member {number}
             */
            this.dirtyStyleId = 0;

            /**
             * Currently default cache ID.
             *
             * @member {string}
             */
            this.cacheId = null;

            /**
             * Generally speaking means when resource is loaded.
             * @readonly
             * @member {boolean}
             */
            this.valid = width > 0 && height > 0;

            /**
             * The collection of alternative cache ids, since some BaseTextures
             * can have more than one ID, short name and longer full URL
             *
             * @member {Array<string>}
             * @readonly
             */
            this.textureCacheIds = [];

            /**
             * Flag if BaseTexture has been destroyed.
             *
             * @member {boolean}
             * @readonly
             */
            this.destroyed = false;

            /**
             * The resource used by this BaseTexture, there can only
             * be one resource per BaseTexture, but textures can share
             * resources.
             *
             * @member {PIXI.resources.Resource}
             * @readonly
             */
            this.resource = null;

            /**
             * Number of the texture batch, used by multi-texture renderers
             *
             * @member {number}
             */
            this._batchEnabled = 0;

            /**
             * Location inside texture batch, used by multi-texture renderers
             *
             * @member {number}
             */
            this._batchLocation = 0;

            /**
             * Fired when a not-immediately-available source finishes loading.
             *
             * @protected
             * @event PIXI.BaseTexture#loaded
             * @param {PIXI.BaseTexture} baseTexture - Resource loaded.
             */

            /**
             * Fired when a not-immediately-available source fails to load.
             *
             * @protected
             * @event PIXI.BaseTexture#error
             * @param {PIXI.BaseTexture} baseTexture - Resource errored.
             * @param {ErrorEvent} event - Load error event.
             */

            /**
             * Fired when BaseTexture is updated.
             *
             * @protected
             * @event PIXI.BaseTexture#loaded
             * @param {PIXI.BaseTexture} baseTexture - Resource loaded.
             */

            /**
             * Fired when BaseTexture is updated.
             *
             * @protected
             * @event PIXI.BaseTexture#update
             * @param {PIXI.BaseTexture} baseTexture - Instance of texture being updated.
             */

            /**
             * Fired when BaseTexture is destroyed.
             *
             * @protected
             * @event PIXI.BaseTexture#dispose
             * @param {PIXI.BaseTexture} baseTexture - Instance of texture being destroyed.
             */

            // Set the resource
            this.setResource(resource);
        }

        if ( EventEmitter ) BaseTexture.__proto__ = EventEmitter;
        BaseTexture.prototype = Object.create( EventEmitter && EventEmitter.prototype );
        BaseTexture.prototype.constructor = BaseTexture;

        var prototypeAccessors = { realWidth: { configurable: true },realHeight: { configurable: true } };

        /**
         * Pixel width of the source of this texture
         *
         * @readonly
         * @member {number}
         */
        prototypeAccessors.realWidth.get = function ()
        {
            return Math.ceil((this.width * this.resolution) - 1e-4);
        };

        /**
         * Pixel height of the source of this texture
         *
         * @readonly
         * @member {number}
         */
        prototypeAccessors.realHeight.get = function ()
        {
            return Math.ceil((this.height * this.resolution) - 1e-4);
        };

        /**
         * Changes style options of BaseTexture
         *
         * @param {PIXI.SCALE_MODES} [scaleMode] - Pixi scalemode
         * @param {PIXI.MIPMAP_MODES} [mipmap] - enable mipmaps
         * @returns {PIXI.BaseTexture} this
         */
        BaseTexture.prototype.setStyle = function setStyle (scaleMode, mipmap)
        {
            var dirty;

            if (scaleMode !== undefined && scaleMode !== this.scaleMode)
            {
                this.scaleMode = scaleMode;
                dirty = true;
            }

            if (mipmap !== undefined && mipmap !== this.mipmap)
            {
                this.mipmap = mipmap;
                dirty = true;
            }

            if (dirty)
            {
                this.dirtyStyleId++;
            }

            return this;
        };

        /**
         * Changes w/h/resolution. Texture becomes valid if width and height are greater than zero.
         *
         * @param {number} width Visual width
         * @param {number} height Visual height
         * @param {number} [resolution] Optionally set resolution
         * @returns {PIXI.BaseTexture} this
         */
        BaseTexture.prototype.setSize = function setSize (width, height, resolution)
        {
            this.resolution = resolution || this.resolution;
            this.width = width;
            this.height = height;
            this._refreshPOT();
            this.update();

            return this;
        };

        /**
         * Sets real size of baseTexture, preserves current resolution.
         *
         * @param {number} realWidth Full rendered width
         * @param {number} realHeight Full rendered height
         * @param {number} [resolution] Optionally set resolution
         * @returns {PIXI.BaseTexture} this
         */
        BaseTexture.prototype.setRealSize = function setRealSize (realWidth, realHeight, resolution)
        {
            this.resolution = resolution || this.resolution;
            this.width = realWidth / this.resolution;
            this.height = realHeight / this.resolution;
            this._refreshPOT();
            this.update();

            return this;
        };

        /**
         * Refresh check for isPowerOfTwo texture based on size
         *
         * @private
         */
        BaseTexture.prototype._refreshPOT = function _refreshPOT ()
        {
            this.isPowerOfTwo = isPow2(this.realWidth) && isPow2(this.realHeight);
        };

        /**
         * Changes resolution
         *
         * @param {number} [resolution] res
         * @returns {PIXI.BaseTexture} this
         */
        BaseTexture.prototype.setResolution = function setResolution (resolution)
        {
            var oldResolution = this.resolution;

            if (oldResolution === resolution)
            {
                return this;
            }

            this.resolution = resolution;

            if (this.valid)
            {
                this.width = this.width * oldResolution / resolution;
                this.height = this.height * oldResolution / resolution;
                this.emit('update', this);
            }

            this._refreshPOT();

            return this;
        };

        /**
         * Sets the resource if it wasn't set. Throws error if resource already present
         *
         * @param {PIXI.resources.Resource} resource - that is managing this BaseTexture
         * @returns {PIXI.BaseTexture} this
         */
        BaseTexture.prototype.setResource = function setResource (resource)
        {
            if (this.resource === resource)
            {
                return this;
            }

            if (this.resource)
            {
                throw new Error('Resource can be set only once');
            }

            resource.bind(this);

            this.resource = resource;

            return this;
        };

        /**
         * Invalidates the object. Texture becomes valid if width and height are greater than zero.
         */
        BaseTexture.prototype.update = function update ()
        {
            if (!this.valid)
            {
                if (this.width > 0 && this.height > 0)
                {
                    this.valid = true;
                    this.emit('loaded', this);
                    this.emit('update', this);
                }
            }
            else
            {
                this.dirtyId++;
                this.dirtyStyleId++;
                this.emit('update', this);
            }
        };

        /**
         * Handle errors with resources.
         * @private
         * @param {ErrorEvent} event - Error event emitted.
         */
        BaseTexture.prototype.onError = function onError (event)
        {
            this.emit('error', this, event);
        };

        /**
         * Destroys this base texture.
         * The method stops if resource doesn't want this texture to be destroyed.
         * Removes texture from all caches.
         */
        BaseTexture.prototype.destroy = function destroy ()
        {
            // remove and destroy the resource
            if (this.resource)
            {
                this.resource.unbind(this);
                // only destroy resourced created internally
                if (this.resource.internal)
                {
                    this.resource.destroy();
                }
                this.resource = null;
            }

            if (this.cacheId)
            {
                delete BaseTextureCache[this.cacheId];
                delete TextureCache[this.cacheId];

                this.cacheId = null;
            }

            // finally let the WebGL renderer know..
            this.dispose();

            BaseTexture.removeFromCache(this);
            this.textureCacheIds = null;

            this.destroyed = true;
        };

        /**
         * Frees the texture from WebGL memory without destroying this texture object.
         * This means you can still use the texture later which will upload it to GPU
         * memory again.
         *
         * @fires PIXI.BaseTexture#dispose
         */
        BaseTexture.prototype.dispose = function dispose ()
        {
            this.emit('dispose', this);
        };

        /**
         * Helper function that creates a base texture based on the source you provide.
         * The source can be - image url, image element, canvas element. If the
         * source is an image url or an image element and not in the base texture
         * cache, it will be created and loaded.
         *
         * @static
         * @param {string|HTMLImageElement|HTMLCanvasElement|SVGElement|HTMLVideoElement} source - The
         *        source to create base texture from.
         * @param {object} [options] See {@link PIXI.BaseTexture}'s constructor for options.
         * @param {boolean} [strict] Enforce strict-mode, see {@link PIXI.settings.STRICT_TEXTURE_CACHE}.
         * @returns {PIXI.BaseTexture} The new base texture.
         */
        BaseTexture.from = function from (source, options, strict)
        {
            if ( strict === void 0 ) strict = settings.STRICT_TEXTURE_CACHE;

            var isFrame = typeof source === 'string';
            var cacheId = null;

            if (isFrame)
            {
                cacheId = source;
            }
            else
            {
                if (!source._pixiId)
                {
                    source._pixiId = "pixiid_" + (uid());
                }

                cacheId = source._pixiId;
            }

            var baseTexture = BaseTextureCache[cacheId];

            // Strict-mode rejects invalid cacheIds
            if (isFrame && strict && !baseTexture)
            {
                throw new Error(("The cacheId \"" + cacheId + "\" does not exist in BaseTextureCache."));
            }

            if (!baseTexture)
            {
                baseTexture = new BaseTexture(source, options);
                baseTexture.cacheId = cacheId;
                BaseTexture.addToCache(baseTexture, cacheId);
            }

            return baseTexture;
        };

        /**
         * Create a new BaseTexture with a BufferResource from a Float32Array.
         * RGBA values are floats from 0 to 1.
         * @static
         * @param {Float32Array|Uint8Array} buffer The optional array to use, if no data
         *        is provided, a new Float32Array is created.
         * @param {number} width - Width of the resource
         * @param {number} height - Height of the resource
         * @param {object} [options] See {@link PIXI.BaseTexture}'s constructor for options.
         * @return {PIXI.BaseTexture} The resulting new BaseTexture
         */
        BaseTexture.fromBuffer = function fromBuffer (buffer, width, height, options)
        {
            buffer = buffer || new Float32Array(width * height * 4);

            var resource = new BufferResource(buffer, { width: width, height: height });
            var type = buffer instanceof Float32Array ? TYPES.FLOAT : TYPES.UNSIGNED_BYTE;

            return new BaseTexture(resource, Object.assign(defaultBufferOptions, options || { width: width, height: height, type: type }));
        };

        /**
         * Adds a BaseTexture to the global BaseTextureCache. This cache is shared across the whole PIXI object.
         *
         * @static
         * @param {PIXI.BaseTexture} baseTexture - The BaseTexture to add to the cache.
         * @param {string} id - The id that the BaseTexture will be stored against.
         */
        BaseTexture.addToCache = function addToCache (baseTexture, id)
        {
            if (id)
            {
                if (baseTexture.textureCacheIds.indexOf(id) === -1)
                {
                    baseTexture.textureCacheIds.push(id);
                }

                if (BaseTextureCache[id])
                {
                    // eslint-disable-next-line no-console
                    console.warn(("BaseTexture added to the cache with an id [" + id + "] that already had an entry"));
                }

                BaseTextureCache[id] = baseTexture;
            }
        };

        /**
         * Remove a BaseTexture from the global BaseTextureCache.
         *
         * @static
         * @param {string|PIXI.BaseTexture} baseTexture - id of a BaseTexture to be removed, or a BaseTexture instance itself.
         * @return {PIXI.BaseTexture|null} The BaseTexture that was removed.
         */
        BaseTexture.removeFromCache = function removeFromCache (baseTexture)
        {
            if (typeof baseTexture === 'string')
            {
                var baseTextureFromCache = BaseTextureCache[baseTexture];

                if (baseTextureFromCache)
                {
                    var index = baseTextureFromCache.textureCacheIds.indexOf(baseTexture);

                    if (index > -1)
                    {
                        baseTextureFromCache.textureCacheIds.splice(index, 1);
                    }

                    delete BaseTextureCache[baseTexture];

                    return baseTextureFromCache;
                }
            }
            else if (baseTexture && baseTexture.textureCacheIds)
            {
                for (var i = 0; i < baseTexture.textureCacheIds.length; ++i)
                {
                    delete BaseTextureCache[baseTexture.textureCacheIds[i]];
                }

                baseTexture.textureCacheIds.length = 0;

                return baseTexture;
            }

            return null;
        };

        Object.defineProperties( BaseTexture.prototype, prototypeAccessors );

        return BaseTexture;
    }(eventemitter3));

    /**
     * Global number of the texture batch, used by multi-texture renderers
     *
     * @static
     * @member {number}
     */
    BaseTexture._globalBatch = 0;

    /**
     * A resource that contains a number of sources.
     *
     * @class
     * @extends PIXI.resources.Resource
     * @memberof PIXI.resources
     * @param {number|Array<*>} source - Number of items in array or the collection
     *        of image URLs to use. Can also be resources, image elements, canvas, etc.
     * @param {object} [options] Options to apply to {@link PIXI.resources.autoDetectResource}
     * @param {number} [options.width] - Width of the resource
     * @param {number} [options.height] - Height of the resource
     */
    var ArrayResource = /*@__PURE__*/(function (Resource) {
        function ArrayResource(source, options)
        {
            options = options || {};

            var urls;
            var length = source;

            if (Array.isArray(source))
            {
                urls = source;
                length = source.length;
            }

            Resource.call(this, options.width, options.height);

            /**
             * Collection of resources.
             * @member {Array<PIXI.BaseTexture>}
             * @readonly
             */
            this.items = [];

            /**
             * Dirty IDs for each part
             * @member {Array<number>}
             * @readonly
             */
            this.itemDirtyIds = [];

            for (var i = 0; i < length; i++)
            {
                var partTexture = new BaseTexture();

                this.items.push(partTexture);
                this.itemDirtyIds.push(-1);
            }

            /**
             * Number of elements in array
             *
             * @member {number}
             * @readonly
             */
            this.length = length;

            /**
             * Promise when loading
             * @member {Promise}
             * @private
             * @default null
             */
            this._load = null;

            if (urls)
            {
                for (var i$1 = 0; i$1 < length; i$1++)
                {
                    this.addResourceAt(autoDetectResource(urls[i$1], options), i$1);
                }
            }
        }

        if ( Resource ) ArrayResource.__proto__ = Resource;
        ArrayResource.prototype = Object.create( Resource && Resource.prototype );
        ArrayResource.prototype.constructor = ArrayResource;

        /**
         * Destroy this BaseImageResource
         * @override
         */
        ArrayResource.prototype.dispose = function dispose ()
        {
            for (var i = 0, len = this.length; i < len; i++)
            {
                this.items[i].destroy();
            }
            this.items = null;
            this.itemDirtyIds = null;
            this._load = null;
        };

        /**
         * Set a resource by ID
         *
         * @param {PIXI.resources.Resource} resource
         * @param {number} index - Zero-based index of resource to set
         * @return {PIXI.resources.ArrayResource} Instance for chaining
         */
        ArrayResource.prototype.addResourceAt = function addResourceAt (resource, index)
        {
            var baseTexture = this.items[index];

            if (!baseTexture)
            {
                throw new Error(("Index " + index + " is out of bounds"));
            }

            // Inherit the first resource dimensions
            if (resource.valid && !this.valid)
            {
                this.resize(resource.width, resource.height);
            }

            this.items[index].setResource(resource);

            return this;
        };

        /**
         * Set the parent base texture
         * @member {PIXI.BaseTexture}
         * @override
         */
        ArrayResource.prototype.bind = function bind (baseTexture)
        {
            Resource.prototype.bind.call(this, baseTexture);

            baseTexture.target = TARGETS.TEXTURE_2D_ARRAY;

            for (var i = 0; i < this.length; i++)
            {
                this.items[i].on('update', baseTexture.update, baseTexture);
            }
        };

        /**
         * Unset the parent base texture
         * @member {PIXI.BaseTexture}
         * @override
         */
        ArrayResource.prototype.unbind = function unbind (baseTexture)
        {
            Resource.prototype.unbind.call(this, baseTexture);

            for (var i = 0; i < this.length; i++)
            {
                this.items[i].off('update', baseTexture.update, baseTexture);
            }
        };

        /**
         * Load all the resources simultaneously
         * @override
         * @return {Promise<void>} When load is resolved
         */
        ArrayResource.prototype.load = function load ()
        {
            var this$1 = this;

            if (this._load)
            {
                return this._load;
            }

            var resources = this.items.map(function (item) { return item.resource; });

            // TODO: also implement load part-by-part strategy
            var promises = resources.map(function (item) { return item.load(); });

            this._load = Promise.all(promises)
                .then(function () {
                    var ref = resources[0];
                    var width = ref.width;
                    var height = ref.height;

                    this$1.resize(width, height);

                    return Promise.resolve(this$1);
                }
                );

            return this._load;
        };

        /**
         * Upload the resources to the GPU.
         * @param {PIXI.Renderer} renderer
         * @param {PIXI.BaseTexture} texture
         * @param {PIXI.GLTexture} glTexture
         * @returns {boolean} whether texture was uploaded
         */
        ArrayResource.prototype.upload = function upload (renderer, texture, glTexture)
        {
            var ref = this;
            var length = ref.length;
            var itemDirtyIds = ref.itemDirtyIds;
            var items = ref.items;
            var gl = renderer.gl;

            if (glTexture.dirtyId < 0)
            {
                gl.texImage3D(
                    gl.TEXTURE_2D_ARRAY,
                    0,
                    texture.format,
                    this._width,
                    this._height,
                    length,
                    0,
                    texture.format,
                    texture.type,
                    null
                );
            }

            for (var i = 0; i < length; i++)
            {
                var item = items[i];

                if (itemDirtyIds[i] < item.dirtyId)
                {
                    itemDirtyIds[i] = item.dirtyId;
                    if (item.valid)
                    {
                        gl.texSubImage3D(
                            gl.TEXTURE_2D_ARRAY,
                            0,
                            0, // xoffset
                            0, // yoffset
                            i, // zoffset
                            item.resource.width,
                            item.resource.height,
                            1,
                            texture.format,
                            texture.type,
                            item.resource.source
                        );
                    }
                }
            }

            return true;
        };

        return ArrayResource;
    }(Resource));

    /**
     * @interface OffscreenCanvas
     */

    /**
     * Resource type for HTMLCanvasElement.
     * @class
     * @extends PIXI.resources.BaseImageResource
     * @memberof PIXI.resources
     * @param {HTMLCanvasElement} source - Canvas element to use
     */
    var CanvasResource = /*@__PURE__*/(function (BaseImageResource) {
        function CanvasResource () {
            BaseImageResource.apply(this, arguments);
        }

        if ( BaseImageResource ) CanvasResource.__proto__ = BaseImageResource;
        CanvasResource.prototype = Object.create( BaseImageResource && BaseImageResource.prototype );
        CanvasResource.prototype.constructor = CanvasResource;

        CanvasResource.test = function test (source)
        {
            var OffscreenCanvas = window.OffscreenCanvas;

            // Check for browsers that don't yet support OffscreenCanvas
            if (OffscreenCanvas && source instanceof OffscreenCanvas)
            {
                return true;
            }

            return source instanceof HTMLCanvasElement;
        };

        return CanvasResource;
    }(BaseImageResource));

    /**
     * Resource for a CubeTexture which contains six resources.
     *
     * @class
     * @extends PIXI.resources.ArrayResource
     * @memberof PIXI.resources
     * @param {Array<string|PIXI.resources.Resource>} [source] Collection of URLs or resources
     *        to use as the sides of the cube.
     * @param {object} [options] - ImageResource options
     * @param {number} [options.width] - Width of resource
     * @param {number} [options.height] - Height of resource
     */
    var CubeResource = /*@__PURE__*/(function (ArrayResource) {
        function CubeResource(source, options)
        {
            options = options || {};

            ArrayResource.call(this, source, options);

            if (this.length !== CubeResource.SIDES)
            {
                throw new Error(("Invalid length. Got " + (this.length) + ", expected 6"));
            }

            for (var i = 0; i < CubeResource.SIDES; i++)
            {
                this.items[i].target = TARGETS.TEXTURE_CUBE_MAP_POSITIVE_X + i;
            }

            if (options.autoLoad !== false)
            {
                this.load();
            }
        }

        if ( ArrayResource ) CubeResource.__proto__ = ArrayResource;
        CubeResource.prototype = Object.create( ArrayResource && ArrayResource.prototype );
        CubeResource.prototype.constructor = CubeResource;

        /**
         * Add binding
         *
         * @override
         * @param {PIXI.BaseTexture} baseTexture - parent base texture
         */
        CubeResource.prototype.bind = function bind (baseTexture)
        {
            ArrayResource.prototype.bind.call(this, baseTexture);

            baseTexture.target = TARGETS.TEXTURE_CUBE_MAP;
        };

        /**
         * Upload the resource
         *
         * @returns {boolean} true is success
         */
        CubeResource.prototype.upload = function upload (renderer, baseTexture, glTexture)
        {
            var dirty = this.itemDirtyIds;

            for (var i = 0; i < CubeResource.SIDES; i++)
            {
                var side = this.items[i];

                if (dirty[i] < side.dirtyId)
                {
                    dirty[i] = side.dirtyId;
                    if (side.valid)
                    {
                        side.resource.upload(renderer, side, glTexture);
                    }
                }
            }

            return true;
        };

        return CubeResource;
    }(ArrayResource));

    /**
     * Number of texture sides to store for CubeResources
     *
     * @name PIXI.resources.CubeResource.SIDES
     * @static
     * @member {number}
     * @default 6
     */
    CubeResource.SIDES = 6;

    /**
     * Resource type for SVG elements and graphics.
     * @class
     * @extends PIXI.resources.BaseImageResource
     * @memberof PIXI.resources
     * @param {string} source - Base64 encoded SVG element or URL for SVG file.
     * @param {object} [options] - Options to use
     * @param {number} [options.scale=1] Scale to apply to SVG. Overridden by...
     * @param {number} [options.width] Rasterize SVG this wide. Aspect ratio preserved if height not specified.
     * @param {number} [options.height] Rasterize SVG this high. Aspect ratio preserved if width not specified.
     * @param {boolean} [options.autoLoad=true] Start loading right away.
     */
    var SVGResource = /*@__PURE__*/(function (BaseImageResource) {
        function SVGResource(source, options)
        {
            options = options || {};

            BaseImageResource.call(this, document.createElement('canvas'));
            this._width = 0;
            this._height = 0;

            /**
             * Base64 encoded SVG element or URL for SVG file
             * @readonly
             * @member {string}
             */
            this.svg = source;

            /**
             * The source scale to apply when rasterizing on load
             * @readonly
             * @member {number}
             */
            this.scale = options.scale || 1;

            /**
             * A width override for rasterization on load
             * @readonly
             * @member {number}
             */
            this._overrideWidth = options.width;

            /**
             * A height override for rasterization on load
             * @readonly
             * @member {number}
             */
            this._overrideHeight = options.height;

            /**
             * Call when completely loaded
             * @private
             * @member {function}
             */
            this._resolve = null;

            /**
             * Cross origin value to use
             * @private
             * @member {boolean|string}
             */
            this._crossorigin = options.crossorigin;

            /**
             * Promise when loading
             * @member {Promise<void>}
             * @private
             * @default null
             */
            this._load = null;

            if (options.autoLoad !== false)
            {
                this.load();
            }
        }

        if ( BaseImageResource ) SVGResource.__proto__ = BaseImageResource;
        SVGResource.prototype = Object.create( BaseImageResource && BaseImageResource.prototype );
        SVGResource.prototype.constructor = SVGResource;

        SVGResource.prototype.load = function load ()
        {
            var this$1 = this;

            if (this._load)
            {
                return this._load;
            }

            this._load = new Promise(function (resolve) {
                // Save this until after load is finished
                this$1._resolve = function () {
                    this$1.resize(this$1.source.width, this$1.source.height);
                    resolve(this$1);
                };

                // Convert SVG inline string to data-uri
                if ((/^\<svg/).test(this$1.svg.trim()))
                {
                    if (!btoa)
                    {
                        throw new Error('Your browser doesn\'t support base64 conversions.');
                    }
                    this$1.svg = "data:image/svg+xml;base64," + (btoa(unescape(encodeURIComponent(this$1.svg))));
                }

                this$1._loadSvg();
            });

            return this._load;
        };

        /**
         * Loads an SVG image from `imageUrl` or `data URL`.
         *
         * @private
         */
        SVGResource.prototype._loadSvg = function _loadSvg ()
        {
            var this$1 = this;

            var tempImage = new Image();

            BaseImageResource.crossOrigin(tempImage, this.svg, this._crossorigin);
            tempImage.src = this.svg;

            tempImage.onerror = function (event) {
                tempImage.onerror = null;
                this$1.onError.run(event);
            };

            tempImage.onload = function () {
                var svgWidth = tempImage.width;
                var svgHeight = tempImage.height;

                if (!svgWidth || !svgHeight)
                {
                    throw new Error('The SVG image must have width and height defined (in pixels), canvas API needs them.');
                }

                // Set render size
                var width = svgWidth * this$1.scale;
                var height = svgHeight * this$1.scale;

                if (this$1._overrideWidth || this$1._overrideHeight)
                {
                    width = this$1._overrideWidth || this$1._overrideHeight / svgHeight * svgWidth;
                    height = this$1._overrideHeight || this$1._overrideWidth / svgWidth * svgHeight;
                }
                width = Math.round(width);
                height = Math.round(height);

                // Create a canvas element
                var canvas = this$1.source;

                canvas.width = width;
                canvas.height = height;
                canvas._pixiId = "canvas_" + (uid());

                // Draw the Svg to the canvas
                canvas
                    .getContext('2d')
                    .drawImage(tempImage, 0, 0, svgWidth, svgHeight, 0, 0, width, height);

                this$1._resolve();
                this$1._resolve = null;
            };
        };

        /**
         * Get size from an svg string using regexp.
         *
         * @method
         * @param {string} svgString - a serialized svg element
         * @return {PIXI.ISize} image extension
         */
        SVGResource.getSize = function getSize (svgString)
        {
            var sizeMatch = SVGResource.SVG_SIZE.exec(svgString);
            var size = {};

            if (sizeMatch)
            {
                size[sizeMatch[1]] = Math.round(parseFloat(sizeMatch[3]));
                size[sizeMatch[5]] = Math.round(parseFloat(sizeMatch[7]));
            }

            return size;
        };

        /**
         * Destroys this texture
         * @override
         */
        SVGResource.prototype.dispose = function dispose ()
        {
            BaseImageResource.prototype.dispose.call(this);
            this._resolve = null;
            this._crossorigin = null;
        };

        /**
         * Used to auto-detect the type of resource.
         *
         * @static
         * @param {*} source - The source object
         * @param {string} extension - The extension of source, if set
         */
        SVGResource.test = function test (source, extension)
        {
            // url file extension is SVG
            return extension === 'svg'
                // source is SVG data-uri
                || (typeof source === 'string' && source.indexOf('data:image/svg+xml;base64') === 0)
                // source is SVG inline
                || (typeof source === 'string' && source.indexOf('<svg') === 0);
        };

        return SVGResource;
    }(BaseImageResource));

    /**
     * RegExp for SVG size.
     *
     * @static
     * @constant {RegExp|string} SVG_SIZE
     * @memberof PIXI.resources.SVGResource
     * @example &lt;svg width="100" height="100"&gt;&lt;/svg&gt;
     */
    SVGResource.SVG_SIZE = /<svg[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*>/i; // eslint-disable-line max-len

    /**
     * Resource type for HTMLVideoElement.
     * @class
     * @extends PIXI.resources.BaseImageResource
     * @memberof PIXI.resources
     * @param {HTMLVideoElement|object|string|Array<string|object>} source - Video element to use.
     * @param {object} [options] - Options to use
     * @param {boolean} [options.autoLoad=true] - Start loading the video immediately
     * @param {boolean} [options.autoPlay=true] - Start playing video immediately
     * @param {number} [options.updateFPS=0] - How many times a second to update the texture from the video.
     * Leave at 0 to update at every render.
     * @param {boolean} [options.crossorigin=true] - Load image using cross origin
     */
    var VideoResource = /*@__PURE__*/(function (BaseImageResource) {
        function VideoResource(source, options)
        {
            options = options || {};

            if (!(source instanceof HTMLVideoElement))
            {
                var videoElement = document.createElement('video');

                // workaround for https://github.com/pixijs/pixi.js/issues/5996
                videoElement.setAttribute('preload', 'auto');
                videoElement.setAttribute('webkit-playsinline', '');
                videoElement.setAttribute('playsinline', '');

                if (typeof source === 'string')
                {
                    source = [source];
                }

                BaseImageResource.crossOrigin(videoElement, (source[0].src || source[0]), options.crossorigin);

                // array of objects or strings
                for (var i = 0; i < source.length; ++i)
                {
                    var sourceElement = document.createElement('source');

                    var ref = source[i];
                    var src = ref.src;
                    var mime = ref.mime;

                    src = src || source[i];

                    var baseSrc = src.split('?').shift().toLowerCase();
                    var ext = baseSrc.substr(baseSrc.lastIndexOf('.') + 1);

                    mime = mime || ("video/" + ext);

                    sourceElement.src = src;
                    sourceElement.type = mime;

                    videoElement.appendChild(sourceElement);
                }

                // Override the source
                source = videoElement;
            }

            BaseImageResource.call(this, source);

            this.noSubImage = true;
            this._autoUpdate = true;
            this._isAutoUpdating = false;
            this._updateFPS = options.updateFPS || 0;
            this._msToNextUpdate = 0;

            /**
             * When set to true will automatically play videos used by this texture once
             * they are loaded. If false, it will not modify the playing state.
             *
             * @member {boolean}
             * @default true
             */
            this.autoPlay = options.autoPlay !== false;

            /**
             * Promise when loading
             * @member {Promise<void>}
             * @private
             * @default null
             */
            this._load = null;

            /**
             * Callback when completed with load.
             * @member {function}
             * @private
             */
            this._resolve = null;

            // Bind for listeners
            this._onCanPlay = this._onCanPlay.bind(this);
            this._onError = this._onError.bind(this);

            if (options.autoLoad !== false)
            {
                this.load();
            }
        }

        if ( BaseImageResource ) VideoResource.__proto__ = BaseImageResource;
        VideoResource.prototype = Object.create( BaseImageResource && BaseImageResource.prototype );
        VideoResource.prototype.constructor = VideoResource;

        var prototypeAccessors = { autoUpdate: { configurable: true },updateFPS: { configurable: true } };

        /**
         * Trigger updating of the texture
         *
         * @param {number} [deltaTime=0] - time delta since last tick
         */
        VideoResource.prototype.update = function update (deltaTime)
        {
            if ( deltaTime === void 0 ) deltaTime = 0;

            if (!this.destroyed)
            {
                // account for if video has had its playbackRate changed
                var elapsedMS = Ticker.shared.elapsedMS * this.source.playbackRate;

                this._msToNextUpdate = Math.floor(this._msToNextUpdate - elapsedMS);
                if (!this._updateFPS || this._msToNextUpdate <= 0)
                {
                    BaseImageResource.prototype.update.call(this, deltaTime);
                    this._msToNextUpdate = this._updateFPS ? Math.floor(1000 / this._updateFPS) : 0;
                }
            }
        };

        /**
         * Start preloading the video resource.
         *
         * @protected
         * @return {Promise<void>} Handle the validate event
         */
        VideoResource.prototype.load = function load ()
        {
            var this$1 = this;

            if (this._load)
            {
                return this._load;
            }

            var source = this.source;

            if ((source.readyState === source.HAVE_ENOUGH_DATA || source.readyState === source.HAVE_FUTURE_DATA)
                && source.width && source.height)
            {
                source.complete = true;
            }

            source.addEventListener('play', this._onPlayStart.bind(this));
            source.addEventListener('pause', this._onPlayStop.bind(this));

            if (!this._isSourceReady())
            {
                source.addEventListener('canplay', this._onCanPlay);
                source.addEventListener('canplaythrough', this._onCanPlay);
                source.addEventListener('error', this._onError, true);
            }
            else
            {
                this._onCanPlay();
            }

            this._load = new Promise(function (resolve) {
                if (this$1.valid)
                {
                    resolve(this$1);
                }
                else
                {
                    this$1._resolve = resolve;

                    source.load();
                }
            });

            return this._load;
        };

        /**
         * Handle video error events.
         *
         * @private
         */
        VideoResource.prototype._onError = function _onError ()
        {
            this.source.removeEventListener('error', this._onError, true);
            this.onError.run(event);
        };

        /**
         * Returns true if the underlying source is playing.
         *
         * @private
         * @return {boolean} True if playing.
         */
        VideoResource.prototype._isSourcePlaying = function _isSourcePlaying ()
        {
            var source = this.source;

            return (source.currentTime > 0 && source.paused === false && source.ended === false && source.readyState > 2);
        };

        /**
         * Returns true if the underlying source is ready for playing.
         *
         * @private
         * @return {boolean} True if ready.
         */
        VideoResource.prototype._isSourceReady = function _isSourceReady ()
        {
            return this.source.readyState === 3 || this.source.readyState === 4;
        };

        /**
         * Runs the update loop when the video is ready to play
         *
         * @private
         */
        VideoResource.prototype._onPlayStart = function _onPlayStart ()
        {
            // Just in case the video has not received its can play even yet..
            if (!this.valid)
            {
                this._onCanPlay();
            }

            if (!this._isAutoUpdating && this.autoUpdate)
            {
                Ticker.shared.add(this.update, this);
                this._isAutoUpdating = true;
            }
        };

        /**
         * Fired when a pause event is triggered, stops the update loop
         *
         * @private
         */
        VideoResource.prototype._onPlayStop = function _onPlayStop ()
        {
            if (this._isAutoUpdating)
            {
                Ticker.shared.remove(this.update, this);
                this._isAutoUpdating = false;
            }
        };

        /**
         * Fired when the video is loaded and ready to play
         *
         * @private
         */
        VideoResource.prototype._onCanPlay = function _onCanPlay ()
        {
            var ref = this;
            var source = ref.source;

            source.removeEventListener('canplay', this._onCanPlay);
            source.removeEventListener('canplaythrough', this._onCanPlay);

            var valid = this.valid;

            this.resize(source.videoWidth, source.videoHeight);

            // prevent multiple loaded dispatches..
            if (!valid && this._resolve)
            {
                this._resolve(this);
                this._resolve = null;
            }

            if (this._isSourcePlaying())
            {
                this._onPlayStart();
            }
            else if (this.autoPlay)
            {
                source.play();
            }
        };

        /**
         * Destroys this texture
         * @override
         */
        VideoResource.prototype.dispose = function dispose ()
        {
            if (this._isAutoUpdating)
            {
                Ticker.shared.remove(this.update, this);
            }

            if (this.source)
            {
                this.source.removeEventListener('error', this._onError, true);
                this.source.pause();
                this.source.src = '';
                this.source.load();
            }
            BaseImageResource.prototype.dispose.call(this);
        };

        /**
         * Should the base texture automatically update itself, set to true by default
         *
         * @member {boolean}
         */
        prototypeAccessors.autoUpdate.get = function ()
        {
            return this._autoUpdate;
        };

        prototypeAccessors.autoUpdate.set = function (value) // eslint-disable-line require-jsdoc
        {
            if (value !== this._autoUpdate)
            {
                this._autoUpdate = value;

                if (!this._autoUpdate && this._isAutoUpdating)
                {
                    Ticker.shared.remove(this.update, this);
                    this._isAutoUpdating = false;
                }
                else if (this._autoUpdate && !this._isAutoUpdating)
                {
                    Ticker.shared.add(this.update, this);
                    this._isAutoUpdating = true;
                }
            }
        };

        /**
         * How many times a second to update the texture from the video. Leave at 0 to update at every render.
         * A lower fps can help performance, as updating the texture at 60fps on a 30ps video may not be efficient.
         *
         * @member {number}
         */
        prototypeAccessors.updateFPS.get = function ()
        {
            return this._updateFPS;
        };

        prototypeAccessors.updateFPS.set = function (value) // eslint-disable-line require-jsdoc
        {
            if (value !== this._updateFPS)
            {
                this._updateFPS = value;
            }
        };

        /**
         * Used to auto-detect the type of resource.
         *
         * @static
         * @param {*} source - The source object
         * @param {string} extension - The extension of source, if set
         * @return {boolean} `true` if video source
         */
        VideoResource.test = function test (source, extension)
        {
            return (source instanceof HTMLVideoElement)
                || VideoResource.TYPES.indexOf(extension) > -1;
        };

        Object.defineProperties( VideoResource.prototype, prototypeAccessors );

        return VideoResource;
    }(BaseImageResource));

    /**
     * List of common video file extensions supported by VideoResource.
     * @constant
     * @member {Array<string>}
     * @static
     * @readonly
     */
    VideoResource.TYPES = ['mp4', 'm4v', 'webm', 'ogg', 'ogv', 'h264', 'avi', 'mov'];

    /**
     * Resource type for ImageBitmap.
     * @class
     * @extends PIXI.resources.BaseImageResource
     * @memberof PIXI.resources
     * @param {ImageBitmap} source - Image element to use
     */
    var ImageBitmapResource = /*@__PURE__*/(function (BaseImageResource) {
        function ImageBitmapResource () {
            BaseImageResource.apply(this, arguments);
        }

        if ( BaseImageResource ) ImageBitmapResource.__proto__ = BaseImageResource;
        ImageBitmapResource.prototype = Object.create( BaseImageResource && BaseImageResource.prototype );
        ImageBitmapResource.prototype.constructor = ImageBitmapResource;

        ImageBitmapResource.test = function test (source)
        {
            return !!window.createImageBitmap && source instanceof ImageBitmap;
        };

        return ImageBitmapResource;
    }(BaseImageResource));

    INSTALLED.push(
        ImageResource,
        ImageBitmapResource,
        CanvasResource,
        VideoResource,
        SVGResource,
        BufferResource,
        CubeResource,
        ArrayResource
    );

    /**
     * System is a base class used for extending systems used by the {@link PIXI.Renderer}
     *
     * @see PIXI.Renderer#addSystem
     * @class
     * @memberof PIXI
     */
    var System = function System(renderer)
    {
        /**
         * The renderer this manager works for.
         *
         * @member {PIXI.Renderer}
         */
        this.renderer = renderer;
    };

    /**
     * Generic destroy methods to be overridden by the subclass
     */
    System.prototype.destroy = function destroy ()
    {
        this.renderer = null;
    };

    /**
     * Resource type for DepthTexture.
     * @class
     * @extends PIXI.resources.BufferResource
     * @memberof PIXI.resources
     */
    var DepthResource = /*@__PURE__*/(function (BufferResource) {
        function DepthResource () {
            BufferResource.apply(this, arguments);
        }

        if ( BufferResource ) DepthResource.__proto__ = BufferResource;
        DepthResource.prototype = Object.create( BufferResource && BufferResource.prototype );
        DepthResource.prototype.constructor = DepthResource;

        DepthResource.prototype.upload = function upload (renderer, baseTexture, glTexture)
        {
            var gl = renderer.gl;

            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, baseTexture.alphaMode === ALPHA_MODES.UNPACK);

            if (glTexture.width === baseTexture.width && glTexture.height === baseTexture.height)
            {
                gl.texSubImage2D(
                    baseTexture.target,
                    0,
                    0,
                    0,
                    baseTexture.width,
                    baseTexture.height,
                    baseTexture.format,
                    baseTexture.type,
                    this.data
                );
            }
            else
            {
                glTexture.width = baseTexture.width;
                glTexture.height = baseTexture.height;

                gl.texImage2D(
                    baseTexture.target,
                    0,
                    gl.DEPTH_COMPONENT16, // Needed for depth to render properly in webgl2.0
                    baseTexture.width,
                    baseTexture.height,
                    0,
                    baseTexture.format,
                    baseTexture.type,
                    this.data
                );
            }

            return true;
        };

        return DepthResource;
    }(BufferResource));

    /**
     * Frame buffer used by the BaseRenderTexture
     *
     * @class
     * @memberof PIXI
     */
    var Framebuffer = function Framebuffer(width, height)
    {
        this.width = Math.ceil(width || 100);
        this.height = Math.ceil(height || 100);

        this.stencil = false;
        this.depth = false;

        this.dirtyId = 0;
        this.dirtyFormat = 0;
        this.dirtySize = 0;

        this.depthTexture = null;
        this.colorTextures = [];

        this.glFramebuffers = {};

        this.disposeRunner = new Runner('disposeFramebuffer', 2);
    };

    var prototypeAccessors$1 = { colorTexture: { configurable: true } };

    /**
     * Reference to the colorTexture.
     *
     * @member {PIXI.Texture[]}
     * @readonly
     */
    prototypeAccessors$1.colorTexture.get = function ()
    {
        return this.colorTextures[0];
    };

    /**
     * Add texture to the colorTexture array
     *
     * @param {number} [index=0] - Index of the array to add the texture to
     * @param {PIXI.Texture} [texture] - Texture to add to the array
     */
    Framebuffer.prototype.addColorTexture = function addColorTexture (index, texture)
    {
            if ( index === void 0 ) index = 0;

        // TODO add some validation to the texture - same width / height etc?
        this.colorTextures[index] = texture || new BaseTexture(null, { scaleMode: 0,
            resolution: 1,
            mipmap: false,
            width: this.width,
            height: this.height });

        this.dirtyId++;
        this.dirtyFormat++;

        return this;
    };

    /**
     * Add a depth texture to the frame buffer
     *
     * @param {PIXI.Texture} [texture] - Texture to add
     */
    Framebuffer.prototype.addDepthTexture = function addDepthTexture (texture)
    {
        /* eslint-disable max-len */
        this.depthTexture = texture || new BaseTexture(new DepthResource(null, { width: this.width, height: this.height }), { scaleMode: 0,
            resolution: 1,
            width: this.width,
            height: this.height,
            mipmap: false,
            format: FORMATS.DEPTH_COMPONENT,
            type: TYPES.UNSIGNED_SHORT });
        /* eslint-disable max-len */
        this.dirtyId++;
        this.dirtyFormat++;

        return this;
    };

    /**
     * Enable depth on the frame buffer
     */
    Framebuffer.prototype.enableDepth = function enableDepth ()
    {
        this.depth = true;

        this.dirtyId++;
        this.dirtyFormat++;

        return this;
    };

    /**
     * Enable stencil on the frame buffer
     */
    Framebuffer.prototype.enableStencil = function enableStencil ()
    {
        this.stencil = true;

        this.dirtyId++;
        this.dirtyFormat++;

        return this;
    };

    /**
     * Resize the frame buffer
     *
     * @param {number} width - Width of the frame buffer to resize to
     * @param {number} height - Height of the frame buffer to resize to
     */
    Framebuffer.prototype.resize = function resize (width, height)
    {
        width = Math.ceil(width);
        height = Math.ceil(height);

        if (width === this.width && height === this.height) { return; }

        this.width = width;
        this.height = height;

        this.dirtyId++;
        this.dirtySize++;

        for (var i = 0; i < this.colorTextures.length; i++)
        {
            var texture = this.colorTextures[i];
            var resolution = texture.resolution;

            // take into acount the fact the texture may have a different resolution..
            texture.setSize(width / resolution, height / resolution);
        }

        if (this.depthTexture)
        {
            var resolution$1 = this.depthTexture.resolution;

            this.depthTexture.setSize(width / resolution$1, height / resolution$1);
        }
    };

    /**
     * disposes WebGL resources that are connected to this geometry
     */
    Framebuffer.prototype.dispose = function dispose ()
    {
        this.disposeRunner.run(this, false);
    };

    Object.defineProperties( Framebuffer.prototype, prototypeAccessors$1 );

    /**
     * Stores a texture's frame in UV coordinates, in
     * which everything lies in the rectangle `[(0,0), (1,0),
     * (1,1), (0,1)]`.
     *
     * | Corner       | Coordinates |
     * |--------------|-------------|
     * | Top-Left     | `(x0,y0)`   |
     * | Top-Right    | `(x1,y1)`   |
     * | Bottom-Right | `(x2,y2)`   |
     * | Bottom-Left  | `(x3,y3)`   |
     *
     * @class
     * @protected
     * @memberof PIXI
     */
    var TextureUvs = function TextureUvs()
    {
        /**
         * X-component of top-left corner `(x0,y0)`.
         *
         * @member {number}
         */
        this.x0 = 0;

        /**
         * Y-component of top-left corner `(x0,y0)`.
         *
         * @member {number}
         */
        this.y0 = 0;

        /**
         * X-component of top-right corner `(x1,y1)`.
         *
         * @member {number}
         */
        this.x1 = 1;

        /**
         * Y-component of top-right corner `(x1,y1)`.
         *
         * @member {number}
         */
        this.y1 = 0;

        /**
         * X-component of bottom-right corner `(x2,y2)`.
         *
         * @member {number}
         */
        this.x2 = 1;

        /**
         * Y-component of bottom-right corner `(x2,y2)`.
         *
         * @member {number}
         */
        this.y2 = 1;

        /**
         * X-component of bottom-left corner `(x3,y3)`.
         *
         * @member {number}
         */
        this.x3 = 0;

        /**
         * Y-component of bottom-right corner `(x3,y3)`.
         *
         * @member {number}
         */
        this.y3 = 1;

        this.uvsFloat32 = new Float32Array(8);
    };

    /**
     * Sets the texture Uvs based on the given frame information.
     *
     * @protected
     * @param {PIXI.Rectangle} frame - The frame of the texture
     * @param {PIXI.Rectangle} baseFrame - The base frame of the texture
     * @param {number} rotate - Rotation of frame, see {@link PIXI.groupD8}
     */
    TextureUvs.prototype.set = function set (frame, baseFrame, rotate)
    {
        var tw = baseFrame.width;
        var th = baseFrame.height;

        if (rotate)
        {
            // width and height div 2 div baseFrame size
            var w2 = frame.width / 2 / tw;
            var h2 = frame.height / 2 / th;

            // coordinates of center
            var cX = (frame.x / tw) + w2;
            var cY = (frame.y / th) + h2;

            rotate = groupD8.add(rotate, groupD8.NW); // NW is top-left corner
            this.x0 = cX + (w2 * groupD8.uX(rotate));
            this.y0 = cY + (h2 * groupD8.uY(rotate));

            rotate = groupD8.add(rotate, 2); // rotate 90 degrees clockwise
            this.x1 = cX + (w2 * groupD8.uX(rotate));
            this.y1 = cY + (h2 * groupD8.uY(rotate));

            rotate = groupD8.add(rotate, 2);
            this.x2 = cX + (w2 * groupD8.uX(rotate));
            this.y2 = cY + (h2 * groupD8.uY(rotate));

            rotate = groupD8.add(rotate, 2);
            this.x3 = cX + (w2 * groupD8.uX(rotate));
            this.y3 = cY + (h2 * groupD8.uY(rotate));
        }
        else
        {
            this.x0 = frame.x / tw;
            this.y0 = frame.y / th;

            this.x1 = (frame.x + frame.width) / tw;
            this.y1 = frame.y / th;

            this.x2 = (frame.x + frame.width) / tw;
            this.y2 = (frame.y + frame.height) / th;

            this.x3 = frame.x / tw;
            this.y3 = (frame.y + frame.height) / th;
        }

        this.uvsFloat32[0] = this.x0;
        this.uvsFloat32[1] = this.y0;
        this.uvsFloat32[2] = this.x1;
        this.uvsFloat32[3] = this.y1;
        this.uvsFloat32[4] = this.x2;
        this.uvsFloat32[5] = this.y2;
        this.uvsFloat32[6] = this.x3;
        this.uvsFloat32[7] = this.y3;
    };

    var DEFAULT_UVS = new TextureUvs();

    /**
     * A texture stores the information that represents an image or part of an image.
     *
     * It cannot be added to the display list directly; instead use it as the texture for a Sprite.
     * If no frame is provided for a texture, then the whole image is used.
     *
     * You can directly create a texture from an image and then reuse it multiple times like this :
     *
     * ```js
     * let texture = PIXI.Texture.from('assets/image.png');
     * let sprite1 = new PIXI.Sprite(texture);
     * let sprite2 = new PIXI.Sprite(texture);
     * ```
     *
     * If you didnt pass the texture frame to constructor, it enables `noFrame` mode:
     * it subscribes on baseTexture events, it automatically resizes at the same time as baseTexture.
     *
     * Textures made from SVGs, loaded or not, cannot be used before the file finishes processing.
     * You can check for this by checking the sprite's _textureID property.
     * ```js
     * var texture = PIXI.Texture.from('assets/image.svg');
     * var sprite1 = new PIXI.Sprite(texture);
     * //sprite1._textureID should not be undefined if the texture has finished processing the SVG file
     * ```
     * You can use a ticker or rAF to ensure your sprites load the finished textures after processing. See issue #3068.
     *
     * @class
     * @extends PIXI.utils.EventEmitter
     * @memberof PIXI
     */
    var Texture = /*@__PURE__*/(function (EventEmitter) {
        function Texture(baseTexture, frame, orig, trim, rotate, anchor)
        {
            EventEmitter.call(this);

            /**
             * Does this Texture have any frame data assigned to it?
             *
             * This mode is enabled automatically if no frame was passed inside constructor.
             *
             * In this mode texture is subscribed to baseTexture events, and fires `update` on any change.
             *
             * Beware, after loading or resize of baseTexture event can fired two times!
             * If you want more control, subscribe on baseTexture itself.
             *
             * ```js
             * texture.on('update', () => {});
             * ```
             *
             * Any assignment of `frame` switches off `noFrame` mode.
             *
             * @member {boolean}
             */
            this.noFrame = false;

            if (!frame)
            {
                this.noFrame = true;
                frame = new Rectangle(0, 0, 1, 1);
            }

            if (baseTexture instanceof Texture)
            {
                baseTexture = baseTexture.baseTexture;
            }

            /**
             * The base texture that this texture uses.
             *
             * @member {PIXI.BaseTexture}
             */
            this.baseTexture = baseTexture;

            /**
             * This is the area of the BaseTexture image to actually copy to the Canvas / WebGL when rendering,
             * irrespective of the actual frame size or placement (which can be influenced by trimmed texture atlases)
             *
             * @member {PIXI.Rectangle}
             */
            this._frame = frame;

            /**
             * This is the trimmed area of original texture, before it was put in atlas
             * Please call `updateUvs()` after you change coordinates of `trim` manually.
             *
             * @member {PIXI.Rectangle}
             */
            this.trim = trim;

            /**
             * This will let the renderer know if the texture is valid. If it's not then it cannot be rendered.
             *
             * @member {boolean}
             */
            this.valid = false;

            /**
             * This will let a renderer know that a texture has been updated (used mainly for WebGL uv updates)
             *
             * @member {boolean}
             */
            this.requiresUpdate = false;

            /**
             * The WebGL UV data cache. Can be used as quad UV
             *
             * @member {PIXI.TextureUvs}
             * @protected
             */
            this._uvs = DEFAULT_UVS;

            /**
             * Default TextureMatrix instance for this texture
             * By default that object is not created because its heavy
             *
             * @member {PIXI.TextureMatrix}
             */
            this.uvMatrix = null;

            /**
             * This is the area of original texture, before it was put in atlas
             *
             * @member {PIXI.Rectangle}
             */
            this.orig = orig || frame;// new Rectangle(0, 0, 1, 1);

            this._rotate = Number(rotate || 0);

            if (rotate === true)
            {
                // this is old texturepacker legacy, some games/libraries are passing "true" for rotated textures
                this._rotate = 2;
            }
            else if (this._rotate % 2 !== 0)
            {
                throw new Error('attempt to use diamond-shaped UVs. If you are sure, set rotation manually');
            }

            /**
             * Anchor point that is used as default if sprite is created with this texture.
             * Changing the `defaultAnchor` at a later point of time will not update Sprite's anchor point.
             * @member {PIXI.Point}
             * @default {0,0}
             */
            this.defaultAnchor = anchor ? new Point(anchor.x, anchor.y) : new Point(0, 0);

            /**
             * Update ID is observed by sprites and TextureMatrix instances.
             * Call updateUvs() to increment it.
             *
             * @member {number}
             * @protected
             */

            this._updateID = 0;

            /**
             * The ids under which this Texture has been added to the texture cache. This is
             * automatically set as long as Texture.addToCache is used, but may not be set if a
             * Texture is added directly to the TextureCache array.
             *
             * @member {string[]}
             */
            this.textureCacheIds = [];

            if (!baseTexture.valid)
            {
                baseTexture.once('loaded', this.onBaseTextureUpdated, this);
            }
            else if (this.noFrame)
            {
                // if there is no frame we should monitor for any base texture changes..
                if (baseTexture.valid)
                {
                    this.onBaseTextureUpdated(baseTexture);
                }
            }
            else
            {
                this.frame = frame;
            }

            if (this.noFrame)
            {
                baseTexture.on('update', this.onBaseTextureUpdated, this);
            }
        }

        if ( EventEmitter ) Texture.__proto__ = EventEmitter;
        Texture.prototype = Object.create( EventEmitter && EventEmitter.prototype );
        Texture.prototype.constructor = Texture;

        var prototypeAccessors = { resolution: { configurable: true },frame: { configurable: true },rotate: { configurable: true },width: { configurable: true },height: { configurable: true } };

        /**
         * Updates this texture on the gpu.
         *
         * Calls the TextureResource update.
         *
         * If you adjusted `frame` manually, please call `updateUvs()` instead.
         *
         */
        Texture.prototype.update = function update ()
        {
            if (this.baseTexture.resource)
            {
                this.baseTexture.resource.update();
            }
        };

        /**
         * Called when the base texture is updated
         *
         * @protected
         * @param {PIXI.BaseTexture} baseTexture - The base texture.
         */
        Texture.prototype.onBaseTextureUpdated = function onBaseTextureUpdated (baseTexture)
        {
            if (this.noFrame)
            {
                if (!this.baseTexture.valid)
                {
                    return;
                }

                this._frame.width = baseTexture.width;
                this._frame.height = baseTexture.height;
                this.valid = true;
                this.updateUvs();
            }
            else
            {
                // TODO this code looks confusing.. boo to abusing getters and setters!
                // if user gave us frame that has bigger size than resized texture it can be a problem
                this.frame = this._frame;
            }

            this.emit('update', this);
        };

        /**
         * Destroys this texture
         *
         * @param {boolean} [destroyBase=false] Whether to destroy the base texture as well
         */
        Texture.prototype.destroy = function destroy (destroyBase)
        {
            if (this.baseTexture)
            {
                if (destroyBase)
                {
                    var ref = this.baseTexture;
                    var resource = ref.resource;

                    // delete the texture if it exists in the texture cache..
                    // this only needs to be removed if the base texture is actually destroyed too..
                    if (resource && TextureCache[resource.url])
                    {
                        Texture.removeFromCache(resource.url);
                    }

                    this.baseTexture.destroy();
                }

                this.baseTexture.off('update', this.onBaseTextureUpdated, this);

                this.baseTexture = null;
            }

            this._frame = null;
            this._uvs = null;
            this.trim = null;
            this.orig = null;

            this.valid = false;

            Texture.removeFromCache(this);
            this.textureCacheIds = null;
        };

        /**
         * Creates a new texture object that acts the same as this one.
         *
         * @return {PIXI.Texture} The new texture
         */
        Texture.prototype.clone = function clone ()
        {
            return new Texture(this.baseTexture, this.frame, this.orig, this.trim, this.rotate, this.defaultAnchor);
        };

        /**
         * Updates the internal WebGL UV cache. Use it after you change `frame` or `trim` of the texture.
         * Call it after changing the frame
         */
        Texture.prototype.updateUvs = function updateUvs ()
        {
            if (this._uvs === DEFAULT_UVS)
            {
                this._uvs = new TextureUvs();
            }

            this._uvs.set(this._frame, this.baseTexture, this.rotate);

            this._updateID++;
        };

        /**
         * Helper function that creates a new Texture based on the source you provide.
         * The source can be - frame id, image url, video url, canvas element, video element, base texture
         *
         * @static
         * @param {string|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|PIXI.BaseTexture} source
         *        Source to create texture from
         * @param {object} [options] See {@link PIXI.BaseTexture}'s constructor for options.
         * @param {boolean} [strict] Enforce strict-mode, see {@link PIXI.settings.STRICT_TEXTURE_CACHE}.
         * @return {PIXI.Texture} The newly created texture
         */
        Texture.from = function from (source, options, strict)
        {
            if ( options === void 0 ) options = {};
            if ( strict === void 0 ) strict = settings.STRICT_TEXTURE_CACHE;

            var isFrame = typeof source === 'string';
            var cacheId = null;

            if (isFrame)
            {
                cacheId = source;
            }
            else
            {
                if (!source._pixiId)
                {
                    source._pixiId = "pixiid_" + (uid());
                }

                cacheId = source._pixiId;
            }

            var texture = TextureCache[cacheId];

            // Strict-mode rejects invalid cacheIds
            if (isFrame && strict && !texture)
            {
                throw new Error(("The cacheId \"" + cacheId + "\" does not exist in TextureCache."));
            }

            if (!texture)
            {
                if (!options.resolution)
                {
                    options.resolution = getResolutionOfUrl(source);
                }

                texture = new Texture(new BaseTexture(source, options));
                texture.baseTexture.cacheId = cacheId;

                BaseTexture.addToCache(texture.baseTexture, cacheId);
                Texture.addToCache(texture, cacheId);
            }

            // lets assume its a base texture!
            return texture;
        };

        /**
         * Create a new Texture with a BufferResource from a Float32Array.
         * RGBA values are floats from 0 to 1.
         * @static
         * @param {Float32Array|Uint8Array} buffer The optional array to use, if no data
         *        is provided, a new Float32Array is created.
         * @param {number} width - Width of the resource
         * @param {number} height - Height of the resource
         * @param {object} [options] See {@link PIXI.BaseTexture}'s constructor for options.
         * @return {PIXI.Texture} The resulting new BaseTexture
         */
        Texture.fromBuffer = function fromBuffer (buffer, width, height, options)
        {
            return new Texture(BaseTexture.fromBuffer(buffer, width, height, options));
        };

        /**
         * Create a texture from a source and add to the cache.
         *
         * @static
         * @param {HTMLImageElement|HTMLCanvasElement} source - The input source.
         * @param {String} imageUrl - File name of texture, for cache and resolving resolution.
         * @param {String} [name] - Human readable name for the texture cache. If no name is
         *        specified, only `imageUrl` will be used as the cache ID.
         * @return {PIXI.Texture} Output texture
         */
        Texture.fromLoader = function fromLoader (source, imageUrl, name)
        {
            var resource = new ImageResource(source);

            resource.url = imageUrl;

            var baseTexture = new BaseTexture(resource, {
                scaleMode: settings.SCALE_MODE,
                resolution: getResolutionOfUrl(imageUrl),
            });

            var texture = new Texture(baseTexture);

            // No name, use imageUrl instead
            if (!name)
            {
                name = imageUrl;
            }

            // lets also add the frame to pixi's global cache for 'fromLoader' function
            BaseTexture.addToCache(texture.baseTexture, name);
            Texture.addToCache(texture, name);

            // also add references by url if they are different.
            if (name !== imageUrl)
            {
                BaseTexture.addToCache(texture.baseTexture, imageUrl);
                Texture.addToCache(texture, imageUrl);
            }

            return texture;
        };

        /**
         * Adds a Texture to the global TextureCache. This cache is shared across the whole PIXI object.
         *
         * @static
         * @param {PIXI.Texture} texture - The Texture to add to the cache.
         * @param {string} id - The id that the Texture will be stored against.
         */
        Texture.addToCache = function addToCache (texture, id)
        {
            if (id)
            {
                if (texture.textureCacheIds.indexOf(id) === -1)
                {
                    texture.textureCacheIds.push(id);
                }

                if (TextureCache[id])
                {
                    // eslint-disable-next-line no-console
                    console.warn(("Texture added to the cache with an id [" + id + "] that already had an entry"));
                }

                TextureCache[id] = texture;
            }
        };

        /**
         * Remove a Texture from the global TextureCache.
         *
         * @static
         * @param {string|PIXI.Texture} texture - id of a Texture to be removed, or a Texture instance itself
         * @return {PIXI.Texture|null} The Texture that was removed
         */
        Texture.removeFromCache = function removeFromCache (texture)
        {
            if (typeof texture === 'string')
            {
                var textureFromCache = TextureCache[texture];

                if (textureFromCache)
                {
                    var index = textureFromCache.textureCacheIds.indexOf(texture);

                    if (index > -1)
                    {
                        textureFromCache.textureCacheIds.splice(index, 1);
                    }

                    delete TextureCache[texture];

                    return textureFromCache;
                }
            }
            else if (texture && texture.textureCacheIds)
            {
                for (var i = 0; i < texture.textureCacheIds.length; ++i)
                {
                    // Check that texture matches the one being passed in before deleting it from the cache.
                    if (TextureCache[texture.textureCacheIds[i]] === texture)
                    {
                        delete TextureCache[texture.textureCacheIds[i]];
                    }
                }

                texture.textureCacheIds.length = 0;

                return texture;
            }

            return null;
        };

        /**
         * Returns resolution of baseTexture
         *
         * @member {number}
         * @readonly
         */
        prototypeAccessors.resolution.get = function ()
        {
            return this.baseTexture.resolution;
        };

        /**
         * The frame specifies the region of the base texture that this texture uses.
         * Please call `updateUvs()` after you change coordinates of `frame` manually.
         *
         * @member {PIXI.Rectangle}
         */
        prototypeAccessors.frame.get = function ()
        {
            return this._frame;
        };

        prototypeAccessors.frame.set = function (frame) // eslint-disable-line require-jsdoc
        {
            this._frame = frame;

            this.noFrame = false;

            var x = frame.x;
            var y = frame.y;
            var width = frame.width;
            var height = frame.height;
            var xNotFit = x + width > this.baseTexture.width;
            var yNotFit = y + height > this.baseTexture.height;

            if (xNotFit || yNotFit)
            {
                var relationship = xNotFit && yNotFit ? 'and' : 'or';
                var errorX = "X: " + x + " + " + width + " = " + (x + width) + " > " + (this.baseTexture.width);
                var errorY = "Y: " + y + " + " + height + " = " + (y + height) + " > " + (this.baseTexture.height);

                throw new Error('Texture Error: frame does not fit inside the base Texture dimensions: '
                    + errorX + " " + relationship + " " + errorY);
            }

            this.valid = width && height && this.baseTexture.valid;

            if (!this.trim && !this.rotate)
            {
                this.orig = frame;
            }

            if (this.valid)
            {
                this.updateUvs();
            }
        };

        /**
         * Indicates whether the texture is rotated inside the atlas
         * set to 2 to compensate for texture packer rotation
         * set to 6 to compensate for spine packer rotation
         * can be used to rotate or mirror sprites
         * See {@link PIXI.groupD8} for explanation
         *
         * @member {number}
         */
        prototypeAccessors.rotate.get = function ()
        {
            return this._rotate;
        };

        prototypeAccessors.rotate.set = function (rotate) // eslint-disable-line require-jsdoc
        {
            this._rotate = rotate;
            if (this.valid)
            {
                this.updateUvs();
            }
        };

        /**
         * The width of the Texture in pixels.
         *
         * @member {number}
         */
        prototypeAccessors.width.get = function ()
        {
            return this.orig.width;
        };

        /**
         * The height of the Texture in pixels.
         *
         * @member {number}
         */
        prototypeAccessors.height.get = function ()
        {
            return this.orig.height;
        };

        Object.defineProperties( Texture.prototype, prototypeAccessors );

        return Texture;
    }(eventemitter3));

    function createWhiteTexture()
    {
        var canvas = document.createElement('canvas');

        canvas.width = 16;
        canvas.height = 16;

        var context = canvas.getContext('2d');

        context.fillStyle = 'white';
        context.fillRect(0, 0, 16, 16);

        return new Texture(new BaseTexture(new CanvasResource(canvas)));
    }

    function removeAllHandlers(tex)
    {
        tex.destroy = function _emptyDestroy() { /* empty */ };
        tex.on = function _emptyOn() { /* empty */ };
        tex.once = function _emptyOnce() { /* empty */ };
        tex.emit = function _emptyEmit() { /* empty */ };
    }

    /**
     * An empty texture, used often to not have to create multiple empty textures.
     * Can not be destroyed.
     *
     * @static
     * @constant
     * @member {PIXI.Texture}
     */
    Texture.EMPTY = new Texture(new BaseTexture());
    removeAllHandlers(Texture.EMPTY);
    removeAllHandlers(Texture.EMPTY.baseTexture);

    /**
     * A white texture of 16x16 size, used for graphics and other things
     * Can not be destroyed.
     *
     * @static
     * @constant
     * @member {PIXI.Texture}
     */
    Texture.WHITE = createWhiteTexture();
    removeAllHandlers(Texture.WHITE);
    removeAllHandlers(Texture.WHITE.baseTexture);

    /* eslint-disable max-len */

    /**
     * Holds the information for a single attribute structure required to render geometry.
     *
     * This does not contain the actual data, but instead has a buffer id that maps to a {@link PIXI.Buffer}
     * This can include anything from positions, uvs, normals, colors etc.
     *
     * @class
     * @memberof PIXI
     */
    var Attribute = function Attribute(buffer, size, normalized, type, stride, start, instance)
    {
        if ( normalized === void 0 ) normalized = false;
        if ( type === void 0 ) type = 5126;

        this.buffer = buffer;
        this.size = size;
        this.normalized = normalized;
        this.type = type;
        this.stride = stride;
        this.start = start;
        this.instance = instance;
    };

    /**
     * Destroys the Attribute.
     */
    Attribute.prototype.destroy = function destroy ()
    {
        this.buffer = null;
    };

    /**
     * Helper function that creates an Attribute based on the information provided
     *
     * @static
     * @param {string} buffer  the id of the buffer that this attribute will look for
     * @param {Number} [size=0] the size of the attribute. If you have 2 floats per vertex (eg position x and y) this would be 2
     * @param {Boolean} [normalized=false] should the data be normalized.
     * @param {Number} [start=0] How far into the array to start reading values (used for interleaving data)
     * @param {Number} [type=PIXI.TYPES.FLOAT] what type of number is the attribute. Check {@link PIXI.TYPES} to see the ones available
     * @param {Number} [stride=0] How far apart (in floats) the start of each value is. (used for interleaving data)
     *
     * @returns {PIXI.Attribute} A new {@link PIXI.Attribute} based on the information provided
     */
    Attribute.from = function from (buffer, size, normalized, type, stride)
    {
        return new Attribute(buffer, size, normalized, type, stride);
    };

    var UID = 0;
    /* eslint-disable max-len */

    /**
     * A wrapper for data so that it can be used and uploaded by WebGL
     *
     * @class
     * @memberof PIXI
     */
    var Buffer = function Buffer(data, _static, index)
    {
        if ( _static === void 0 ) _static = true;
        if ( index === void 0 ) index = false;

        /**
         * The data in the buffer, as a typed array
         *
         * @member {ArrayBuffer| SharedArrayBuffer|ArrayBufferView}
         */
        this.data = data || new Float32Array(1);

        /**
         * A map of renderer IDs to webgl buffer
         *
         * @private
         * @member {object<number, GLBuffer>}
         */
        this._glBuffers = {};

        this._updateID = 0;

        this.index = index;

        this.static = _static;

        this.id = UID++;

        this.disposeRunner = new Runner('disposeBuffer', 2);
    };

    // TODO could explore flagging only a partial upload?
    /**
     * flags this buffer as requiring an upload to the GPU
     * @param {ArrayBuffer|SharedArrayBuffer|ArrayBufferView} [data] the data to update in the buffer.
     */
    Buffer.prototype.update = function update (data)
    {
        this.data = data || this.data;
        this._updateID++;
    };

    /**
     * disposes WebGL resources that are connected to this geometry
     */
    Buffer.prototype.dispose = function dispose ()
    {
        this.disposeRunner.run(this, false);
    };

    /**
     * Destroys the buffer
     */
    Buffer.prototype.destroy = function destroy ()
    {
        this.dispose();

        this.data = null;
    };

    /**
     * Helper function that creates a buffer based on an array or TypedArray
     *
     * @static
     * @param {ArrayBufferView | number[]} data the TypedArray that the buffer will store. If this is a regular Array it will be converted to a Float32Array.
     * @return {PIXI.Buffer} A new Buffer based on the data provided.
     */
    Buffer.from = function from (data)
    {
        if (data instanceof Array)
        {
            data = new Float32Array(data);
        }

        return new Buffer(data);
    };

    function getBufferType(array)
    {
        if (array.BYTES_PER_ELEMENT === 4)
        {
            if (array instanceof Float32Array)
            {
                return 'Float32Array';
            }
            else if (array instanceof Uint32Array)
            {
                return 'Uint32Array';
            }

            return 'Int32Array';
        }
        else if (array.BYTES_PER_ELEMENT === 2)
        {
            if (array instanceof Uint16Array)
            {
                return 'Uint16Array';
            }
        }
        else if (array.BYTES_PER_ELEMENT === 1)
        {
            if (array instanceof Uint8Array)
            {
                return 'Uint8Array';
            }
        }

        // TODO map out the rest of the array elements!
        return null;
    }

    /* eslint-disable object-shorthand */
    var map$1 = {
        Float32Array: Float32Array,
        Uint32Array: Uint32Array,
        Int32Array: Int32Array,
        Uint8Array: Uint8Array,
    };

    function interleaveTypedArrays(arrays, sizes)
    {
        var outSize = 0;
        var stride = 0;
        var views = {};

        for (var i = 0; i < arrays.length; i++)
        {
            stride += sizes[i];
            outSize += arrays[i].length;
        }

        var buffer = new ArrayBuffer(outSize * 4);

        var out = null;
        var littleOffset = 0;

        for (var i$1 = 0; i$1 < arrays.length; i$1++)
        {
            var size = sizes[i$1];
            var array = arrays[i$1];

            var type = getBufferType(array);

            if (!views[type])
            {
                views[type] = new map$1[type](buffer);
            }

            out = views[type];

            for (var j = 0; j < array.length; j++)
            {
                var indexStart = ((j / size | 0) * stride) + littleOffset;
                var index = j % size;

                out[indexStart + index] = array[j];
            }

            littleOffset += size;
        }

        return new Float32Array(buffer);
    }

    var byteSizeMap = { 5126: 4, 5123: 2, 5121: 1 };
    var UID$1 = 0;

    /* eslint-disable object-shorthand */
    var map$1$1 = {
        Float32Array: Float32Array,
        Uint32Array: Uint32Array,
        Int32Array: Int32Array,
        Uint8Array: Uint8Array,
        Uint16Array: Uint16Array,
    };

    /* eslint-disable max-len */

    /**
     * The Geometry represents a model. It consists of two components:
     * - GeometryStyle - The structure of the model such as the attributes layout
     * - GeometryData - the data of the model - this consists of buffers.
     * This can include anything from positions, uvs, normals, colors etc.
     *
     * Geometry can be defined without passing in a style or data if required (thats how I prefer!)
     *
     * ```js
     * let geometry = new PIXI.Geometry();
     *
     * geometry.addAttribute('positions', [0, 0, 100, 0, 100, 100, 0, 100], 2);
     * geometry.addAttribute('uvs', [0,0,1,0,1,1,0,1],2)
     * geometry.addIndex([0,1,2,1,3,2])
     *
     * ```
     * @class
     * @memberof PIXI
     */
    var Geometry = function Geometry(buffers, attributes)
    {
        if ( buffers === void 0 ) buffers = [];
        if ( attributes === void 0 ) attributes = {};

        this.buffers = buffers;

        this.indexBuffer = null;

        this.attributes = attributes;

        /**
         * A map of renderer IDs to webgl VAOs
         *
         * @protected
         * @type {object}
         */
        this.glVertexArrayObjects = {};

        this.id = UID$1++;

        this.instanced = false;

        /**
         * Number of instances in this geometry, pass it to `GeometrySystem.draw()`
         * @member {number}
         * @default 1
         */
        this.instanceCount = 1;

        this.disposeRunner = new Runner('disposeGeometry', 2);

        /**
         * Count of existing (not destroyed) meshes that reference this geometry
         * @member {number}
         */
        this.refCount = 0;
    };

    /**
    *
    * Adds an attribute to the geometry
    *
    * @param {String} id - the name of the attribute (matching up to a shader)
    * @param {PIXI.Buffer|number[]} [buffer] the buffer that holds the data of the attribute . You can also provide an Array and a buffer will be created from it.
    * @param {Number} [size=0] the size of the attribute. If you have 2 floats per vertex (eg position x and y) this would be 2
    * @param {Boolean} [normalized=false] should the data be normalized.
    * @param {Number} [type=PIXI.TYPES.FLOAT] what type of number is the attribute. Check {PIXI.TYPES} to see the ones available
    * @param {Number} [stride=0] How far apart (in floats) the start of each value is. (used for interleaving data)
    * @param {Number} [start=0] How far into the array to start reading values (used for interleaving data)
    *
    * @return {PIXI.Geometry} returns self, useful for chaining.
    */
    Geometry.prototype.addAttribute = function addAttribute (id, buffer, size, normalized, type, stride, start, instance)
    {
            if ( normalized === void 0 ) normalized = false;
            if ( instance === void 0 ) instance = false;

        if (!buffer)
        {
            throw new Error('You must pass a buffer when creating an attribute');
        }

        // check if this is a buffer!
        if (!buffer.data)
        {
            // its an array!
            if (buffer instanceof Array)
            {
                buffer = new Float32Array(buffer);
            }

            buffer = new Buffer(buffer);
        }

        var ids = id.split('|');

        if (ids.length > 1)
        {
            for (var i = 0; i < ids.length; i++)
            {
                this.addAttribute(ids[i], buffer, size, normalized, type);
            }

            return this;
        }

        var bufferIndex = this.buffers.indexOf(buffer);

        if (bufferIndex === -1)
        {
            this.buffers.push(buffer);
            bufferIndex = this.buffers.length - 1;
        }

        this.attributes[id] = new Attribute(bufferIndex, size, normalized, type, stride, start, instance);

        // assuming that if there is instanced data then this will be drawn with instancing!
        this.instanced = this.instanced || instance;

        return this;
    };

    /**
     * returns the requested attribute
     *
     * @param {String} id  the name of the attribute required
     * @return {PIXI.Attribute} the attribute requested.
     */
    Geometry.prototype.getAttribute = function getAttribute (id)
    {
        return this.attributes[id];
    };

    /**
     * returns the requested buffer
     *
     * @param {String} id  the name of the buffer required
     * @return {PIXI.Buffer} the buffer requested.
     */
    Geometry.prototype.getBuffer = function getBuffer (id)
    {
        return this.buffers[this.getAttribute(id).buffer];
    };

    /**
    *
    * Adds an index buffer to the geometry
    * The index buffer contains integers, three for each triangle in the geometry, which reference the various attribute buffers (position, colour, UV coordinates, other UV coordinates, normal, …). There is only ONE index buffer.
    *
    * @param {PIXI.Buffer|number[]} [buffer] the buffer that holds the data of the index buffer. You can also provide an Array and a buffer will be created from it.
    * @return {PIXI.Geometry} returns self, useful for chaining.
    */
    Geometry.prototype.addIndex = function addIndex (buffer)
    {
        if (!buffer.data)
        {
            // its an array!
            if (buffer instanceof Array)
            {
                buffer = new Uint16Array(buffer);
            }

            buffer = new Buffer(buffer);
        }

        buffer.index = true;
        this.indexBuffer = buffer;

        if (this.buffers.indexOf(buffer) === -1)
        {
            this.buffers.push(buffer);
        }

        return this;
    };

    /**
     * returns the index buffer
     *
     * @return {PIXI.Buffer} the index buffer.
     */
    Geometry.prototype.getIndex = function getIndex ()
    {
        return this.indexBuffer;
    };

    /**
     * this function modifies the structure so that all current attributes become interleaved into a single buffer
     * This can be useful if your model remains static as it offers a little performance boost
     *
     * @return {PIXI.Geometry} returns self, useful for chaining.
     */
    Geometry.prototype.interleave = function interleave ()
    {
        // a simple check to see if buffers are already interleaved..
        if (this.buffers.length === 1 || (this.buffers.length === 2 && this.indexBuffer)) { return this; }

        // assume already that no buffers are interleaved
        var arrays = [];
        var sizes = [];
        var interleavedBuffer = new Buffer();
        var i;

        for (i in this.attributes)
        {
            var attribute = this.attributes[i];

            var buffer = this.buffers[attribute.buffer];

            arrays.push(buffer.data);

            sizes.push((attribute.size * byteSizeMap[attribute.type]) / 4);

            attribute.buffer = 0;
        }

        interleavedBuffer.data = interleaveTypedArrays(arrays, sizes);

        for (i = 0; i < this.buffers.length; i++)
        {
            if (this.buffers[i] !== this.indexBuffer)
            {
                this.buffers[i].destroy();
            }
        }

        this.buffers = [interleavedBuffer];

        if (this.indexBuffer)
        {
            this.buffers.push(this.indexBuffer);
        }

        return this;
    };

    Geometry.prototype.getSize = function getSize ()
    {
        for (var i in this.attributes)
        {
            var attribute = this.attributes[i];
            var buffer = this.buffers[attribute.buffer];

            return buffer.data.length / ((attribute.stride / 4) || attribute.size);
        }

        return 0;
    };

    /**
     * disposes WebGL resources that are connected to this geometry
     */
    Geometry.prototype.dispose = function dispose ()
    {
        this.disposeRunner.run(this, false);
    };

    /**
     * Destroys the geometry.
     */
    Geometry.prototype.destroy = function destroy ()
    {
        this.dispose();

        this.buffers = null;
        this.indexBuffer = null;
        this.attributes = null;
    };

    /**
     * returns a clone of the geometry
     *
     * @returns {PIXI.Geometry} a new clone of this geometry
     */
    Geometry.prototype.clone = function clone ()
    {
        var geometry = new Geometry();

        for (var i = 0; i < this.buffers.length; i++)
        {
            geometry.buffers[i] = new Buffer(this.buffers[i].data.slice());
        }

        for (var i$1 in this.attributes)
        {
            var attrib = this.attributes[i$1];

            geometry.attributes[i$1] = new Attribute(
                attrib.buffer,
                attrib.size,
                attrib.normalized,
                attrib.type,
                attrib.stride,
                attrib.start,
                attrib.instance
            );
        }

        if (this.indexBuffer)
        {
            geometry.indexBuffer = geometry.buffers[this.buffers.indexOf(this.indexBuffer)];
            geometry.indexBuffer.index = true;
        }

        return geometry;
    };

    /**
     * merges an array of geometries into a new single one
     * geometry attribute styles must match for this operation to work
     *
     * @param {PIXI.Geometry[]} geometries array of geometries to merge
     * @returns {PIXI.Geometry} shiny new geometry!
     */
    Geometry.merge = function merge (geometries)
    {
        // todo add a geometry check!
        // also a size check.. cant be too big!]

        var geometryOut = new Geometry();

        var arrays = [];
        var sizes = [];
        var offsets = [];

        var geometry;

        // pass one.. get sizes..
        for (var i = 0; i < geometries.length; i++)
        {
            geometry = geometries[i];

            for (var j = 0; j < geometry.buffers.length; j++)
            {
                sizes[j] = sizes[j] || 0;
                sizes[j] += geometry.buffers[j].data.length;
                offsets[j] = 0;
            }
        }

        // build the correct size arrays..
        for (var i$1 = 0; i$1 < geometry.buffers.length; i$1++)
        {
            // TODO types!
            arrays[i$1] = new map$1$1[getBufferType(geometry.buffers[i$1].data)](sizes[i$1]);
            geometryOut.buffers[i$1] = new Buffer(arrays[i$1]);
        }

        // pass to set data..
        for (var i$2 = 0; i$2 < geometries.length; i$2++)
        {
            geometry = geometries[i$2];

            for (var j$1 = 0; j$1 < geometry.buffers.length; j$1++)
            {
                arrays[j$1].set(geometry.buffers[j$1].data, offsets[j$1]);
                offsets[j$1] += geometry.buffers[j$1].data.length;
            }
        }

        geometryOut.attributes = geometry.attributes;

        if (geometry.indexBuffer)
        {
            geometryOut.indexBuffer = geometryOut.buffers[geometry.buffers.indexOf(geometry.indexBuffer)];
            geometryOut.indexBuffer.index = true;

            var offset = 0;
            var stride = 0;
            var offset2 = 0;
            var bufferIndexToCount = 0;

            // get a buffer
            for (var i$3 = 0; i$3 < geometry.buffers.length; i$3++)
            {
                if (geometry.buffers[i$3] !== geometry.indexBuffer)
                {
                    bufferIndexToCount = i$3;
                    break;
                }
            }

            // figure out the stride of one buffer..
            for (var i$4 in geometry.attributes)
            {
                var attribute = geometry.attributes[i$4];

                if ((attribute.buffer | 0) === bufferIndexToCount)
                {
                    stride += ((attribute.size * byteSizeMap[attribute.type]) / 4);
                }
            }

            // time to off set all indexes..
            for (var i$5 = 0; i$5 < geometries.length; i$5++)
            {
                var indexBufferData = geometries[i$5].indexBuffer.data;

                for (var j$2 = 0; j$2 < indexBufferData.length; j$2++)
                {
                    geometryOut.indexBuffer.data[j$2 + offset2] += offset;
                }

                offset += geometry.buffers[bufferIndexToCount].data.length / (stride);
                offset2 += indexBufferData.length;
            }
        }

        return geometryOut;
    };

    var UID$2 = 0;

    /**
     * Uniform group holds uniform map and some ID's for work
     *
     * @class
     * @memberof PIXI
     */
    var UniformGroup = function UniformGroup(uniforms, _static)
    {
        /**
         * uniform values
         * @member {object}
         * @readonly
         */
        this.uniforms = uniforms;

        /**
         * Its a group and not a single uniforms
         * @member {boolean}
         * @readonly
         * @default true
         */
        this.group = true;

        // lets generate this when the shader ?
        this.syncUniforms = {};

        /**
         * dirty version
         * @protected
         * @member {number}
         */
        this.dirtyId = 0;

        /**
         * unique id
         * @protected
         * @member {number}
         */
        this.id = UID$2++;

        /**
         * Uniforms wont be changed after creation
         * @member {boolean}
         */
        this.static = !!_static;
    };

    UniformGroup.prototype.update = function update ()
    {
        this.dirtyId++;
    };

    UniformGroup.prototype.add = function add (name, uniforms, _static)
    {
        this.uniforms[name] = new UniformGroup(uniforms, _static);
    };

    UniformGroup.from = function from (uniforms, _static)
    {
        return new UniformGroup(uniforms, _static);
    };

    /**
     * Base for a common object renderer that can be used as a
     * system renderer plugin.
     *
     * @class
     * @extends PIXI.System
     * @memberof PIXI
     */
    var ObjectRenderer = function ObjectRenderer(renderer)
    {
        /**
         * The renderer this manager works for.
         *
         * @member {PIXI.Renderer}
         */
        this.renderer = renderer;
    };

    /**
     * Stub method that should be used to empty the current
     * batch by rendering objects now.
     */
    ObjectRenderer.prototype.flush = function flush ()
    {
        // flush!
    };

    /**
     * Generic destruction method that frees all resources. This
     * should be called by subclasses.
     */
    ObjectRenderer.prototype.destroy = function destroy ()
    {
        this.renderer = null;
    };

    /**
     * Stub method that initializes any state required before
     * rendering starts. It is different from the `prerender`
     * signal, which occurs every frame, in that it is called
     * whenever an object requests _this_ renderer specifically.
     */
    ObjectRenderer.prototype.start = function start ()
    {
        // set the shader..
    };

    /**
     * Stops the renderer. It should free up any state and
     * become dormant.
     */
    ObjectRenderer.prototype.stop = function stop ()
    {
        this.flush();
    };

    /**
     * Keeps the object to render. It doesn't have to be
     * rendered immediately.
     *
     * @param {PIXI.DisplayObject} object - The object to render.
     */
    ObjectRenderer.prototype.render = function render (object) // eslint-disable-line no-unused-vars
    {
        // render the object
    };

    /**
     * The maximum support for using WebGL. If a device does not
     * support WebGL version, for instance WebGL 2, it will still
     * attempt to fallback support to WebGL 1. If you want to
     * explicitly remove feature support to target a more stable
     * baseline, prefer a lower environment.
     *
     * Due to {@link https://bugs.chromium.org/p/chromium/issues/detail?id=934823|bug in chromium}
     * we disable webgl2 by default for all non-apple mobile devices.
     *
     * @static
     * @name PREFER_ENV
     * @memberof PIXI.settings
     * @type {number}
     * @default PIXI.ENV.WEBGL2
     */
    settings.PREFER_ENV = isMobile$1.any ? ENV.WEBGL : ENV.WEBGL2;

    /**
     * If set to `true`, Textures and BaseTexture objects stored
     * in the caches ({@link PIXI.utils.TextureCache TextureCache} and
     * {@link PIXI.utils.BaseTextureCache BaseTextureCache}) can *only* be
     * used when calling {@link PIXI.Texture.from Texture.from} or
     * {@link PIXI.BaseTexture.from BaseTexture.from}.
     * Otherwise, these `from` calls throw an exception. Using this property
     * can be useful if you want to enforce preloading all assets with
     * {@link PIXI.Loader Loader}.
     *
     * @static
     * @name STRICT_TEXTURE_CACHE
     * @memberof PIXI.settings
     * @type {boolean}
     * @default false
     */
    settings.STRICT_TEXTURE_CACHE = false;

    /**
     * @method compileProgram
     * @private
     * @memberof PIXI.glCore.shader
     * @param gl {WebGLRenderingContext} The current WebGL context {WebGLProgram}
     * @param vertexSrc {string|string[]} The vertex shader source as an array of strings.
     * @param fragmentSrc {string|string[]} The fragment shader source as an array of strings.
     * @param attributeLocations {Object} An attribute location map that lets you manually set the attribute locations
     * @return {WebGLProgram} the shader program
     */
    function compileProgram(gl, vertexSrc, fragmentSrc, attributeLocations)
    {
        var glVertShader = compileShader(gl, gl.VERTEX_SHADER, vertexSrc);
        var glFragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);

        var program = gl.createProgram();

        gl.attachShader(program, glVertShader);
        gl.attachShader(program, glFragShader);

        // optionally, set the attributes manually for the program rather than letting WebGL decide..
        if (attributeLocations)
        {
            for (var i in attributeLocations)
            {
                gl.bindAttribLocation(program, attributeLocations[i], i);
            }
        }

        gl.linkProgram(program);

        // if linking fails, then log and cleanup
        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        {
            if (!gl.getShaderParameter(glVertShader, gl.COMPILE_STATUS))
            {
                console.warn(vertexSrc);
                console.error(gl.getShaderInfoLog(glVertShader));
            }

            if (!gl.getShaderParameter(glFragShader, gl.COMPILE_STATUS))
            {
                console.warn(fragmentSrc);
                console.error(gl.getShaderInfoLog(glFragShader));
            }

            console.error('Pixi.js Error: Could not initialize shader.');
            console.error('gl.VALIDATE_STATUS', gl.getProgramParameter(program, gl.VALIDATE_STATUS));
            console.error('gl.getError()', gl.getError());

            // if there is a program info log, log it
            if (gl.getProgramInfoLog(program) !== '')
            {
                console.warn('Pixi.js Warning: gl.getProgramInfoLog()', gl.getProgramInfoLog(program));
            }

            gl.deleteProgram(program);
            program = null;
        }

        // clean up some shaders
        gl.deleteShader(glVertShader);
        gl.deleteShader(glFragShader);

        return program;
    }

    /**
     * @private
     * @param gl {WebGLRenderingContext} The current WebGL context {WebGLProgram}
     * @param type {Number} the type, can be either VERTEX_SHADER or FRAGMENT_SHADER
     * @param vertexSrc {string|string[]} The vertex shader source as an array of strings.
     * @return {WebGLShader} the shader
     */
    function compileShader(gl, type, src)
    {
        var shader = gl.createShader(type);

        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        return shader;
    }

    /**
     * @method defaultValue
     * @memberof PIXI.glCore.shader
     * @param type {String} Type of value
     * @param size {Number}
     * @private
     */
    function defaultValue(type, size)
    {
        switch (type)
        {
            case 'float':
                return 0;

            case 'vec2':
                return new Float32Array(2 * size);

            case 'vec3':
                return new Float32Array(3 * size);

            case 'vec4':
                return new Float32Array(4 * size);

            case 'int':
            case 'sampler2D':
            case 'sampler2DArray':
                return 0;

            case 'ivec2':
                return new Int32Array(2 * size);

            case 'ivec3':
                return new Int32Array(3 * size);

            case 'ivec4':
                return new Int32Array(4 * size);

            case 'bool':
                return false;

            case 'bvec2':

                return booleanArray(2 * size);

            case 'bvec3':
                return booleanArray(3 * size);

            case 'bvec4':
                return booleanArray(4 * size);

            case 'mat2':
                return new Float32Array([1, 0,
                    0, 1]);

            case 'mat3':
                return new Float32Array([1, 0, 0,
                    0, 1, 0,
                    0, 0, 1]);

            case 'mat4':
                return new Float32Array([1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1]);
        }

        return null;
    }

    function booleanArray(size)
    {
        var array = new Array(size);

        for (var i = 0; i < array.length; i++)
        {
            array[i] = false;
        }

        return array;
    }

    var unknownContext = {};
    var context = unknownContext;

    /**
     * returns a little WebGL context to use for program inspection.
     *
     * @static
     * @private
     * @returns {WebGLRenderingContext} a gl context to test with
     */
    function getTestContext()
    {
        if (context === unknownContext || (context && context.isContextLost()))
        {
            var canvas = document.createElement('canvas');

            var gl;

            if (settings.PREFER_ENV >= ENV.WEBGL2)
            {
                gl = canvas.getContext('webgl2', {});
            }

            if (!gl)
            {
                gl = canvas.getContext('webgl', {})
                || canvas.getContext('experimental-webgl', {});

                if (!gl)
                {
                    // fail, not able to get a context
                    gl = null;
                }
                else
                {
                    // for shader testing..
                    gl.getExtension('WEBGL_draw_buffers');
                }
            }

            context = gl;
        }

        return context;
    }

    var maxFragmentPrecision;

    function getMaxFragmentPrecision()
    {
        if (!maxFragmentPrecision)
        {
            maxFragmentPrecision = PRECISION.MEDIUM;
            var gl = getTestContext();

            if (gl)
            {
                if (gl.getShaderPrecisionFormat)
                {
                    var shaderFragment = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);

                    maxFragmentPrecision = shaderFragment.precision ? PRECISION.HIGH : PRECISION.MEDIUM;
                }
            }
        }

        return maxFragmentPrecision;
    }

    /**
     * Sets the float precision on the shader, ensuring the device supports the request precision.
     * If the precision is already present, it just ensures that the device is able to handle it.
     *
     * @private
     * @param {string} src - The shader source
     * @param {string} requestedPrecision - The request float precision of the shader. Options are 'lowp', 'mediump' or 'highp'.
     * @param {string} maxSupportedPrecision - The maximum precision the shader supports.
     *
     * @return {string} modified shader source
     */
    function setPrecision(src, requestedPrecision, maxSupportedPrecision)
    {
        if (src.substring(0, 9) !== 'precision')
        {
            // no precision supplied, so PixiJS will add the requested level.
            var precision = requestedPrecision;

            // If highp is requested but not supported, downgrade precision to a level all devices support.
            if (requestedPrecision === PRECISION.HIGH && maxSupportedPrecision !== PRECISION.HIGH)
            {
                precision = PRECISION.MEDIUM;
            }

            return ("precision " + precision + " float;\n" + src);
        }
        else if (maxSupportedPrecision !== PRECISION.HIGH && src.substring(0, 15) === 'precision highp')
        {
            // precision was supplied, but at a level this device does not support, so downgrading to mediump.
            return src.replace('precision highp', 'precision mediump');
        }

        return src;
    }

    var GLSL_TO_SIZE = {
        float:    1,
        vec2:     2,
        vec3:     3,
        vec4:     4,

        int:      1,
        ivec2:    2,
        ivec3:    3,
        ivec4:    4,

        bool:     1,
        bvec2:    2,
        bvec3:    3,
        bvec4:    4,

        mat2:     4,
        mat3:     9,
        mat4:     16,

        sampler2D:  1,
    };

    /**
     * @private
     * @method mapSize
     * @memberof PIXI.glCore.shader
     * @param type {String}
     * @return {Number}
     */
    function mapSize(type)
    {
        return GLSL_TO_SIZE[type];
    }

    var GL_TABLE = null;

    var GL_TO_GLSL_TYPES = {
        FLOAT:       'float',
        FLOAT_VEC2:  'vec2',
        FLOAT_VEC3:  'vec3',
        FLOAT_VEC4:  'vec4',

        INT:         'int',
        INT_VEC2:    'ivec2',
        INT_VEC3:    'ivec3',
        INT_VEC4:    'ivec4',

        BOOL:        'bool',
        BOOL_VEC2:   'bvec2',
        BOOL_VEC3:   'bvec3',
        BOOL_VEC4:   'bvec4',

        FLOAT_MAT2:  'mat2',
        FLOAT_MAT3:  'mat3',
        FLOAT_MAT4:  'mat4',

        SAMPLER_2D:  'sampler2D',
        SAMPLER_CUBE:  'samplerCube',
        SAMPLER_2D_ARRAY:  'sampler2DArray',
    };

    function mapType(gl, type)
    {
        if (!GL_TABLE)
        {
            var typeNames = Object.keys(GL_TO_GLSL_TYPES);

            GL_TABLE = {};

            for (var i = 0; i < typeNames.length; ++i)
            {
                var tn = typeNames[i];

                GL_TABLE[gl[tn]] = GL_TO_GLSL_TYPES[tn];
            }
        }

        return GL_TABLE[type];
    }

    var fragTemplate = [
        'precision mediump float;',
        'void main(void){',
        'float test = 0.1;',
        '%forloop%',
        'gl_FragColor = vec4(0.0);',
        '}' ].join('\n');

    function checkMaxIfStatementsInShader(maxIfs, gl)
    {
        if (maxIfs === 0)
        {
            throw new Error('Invalid value of `0` passed to `checkMaxIfStatementsInShader`');
        }

        var shader = gl.createShader(gl.FRAGMENT_SHADER);

        while (true) // eslint-disable-line no-constant-condition
        {
            var fragmentSrc = fragTemplate.replace(/%forloop%/gi, generateIfTestSrc(maxIfs));

            gl.shaderSource(shader, fragmentSrc);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            {
                maxIfs = (maxIfs / 2) | 0;
            }
            else
            {
                // valid!
                break;
            }
        }

        return maxIfs;
    }

    function generateIfTestSrc(maxIfs)
    {
        var src = '';

        for (var i = 0; i < maxIfs; ++i)
        {
            if (i > 0)
            {
                src += '\nelse ';
            }

            if (i < maxIfs - 1)
            {
                src += "if(test == " + i + ".0){}";
            }
        }

        return src;
    }

    var defaultFragment = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n   gl_FragColor *= texture2D(uSampler, vTextureCoord);\n}";

    var defaultVertex = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   vTextureCoord = aTextureCoord;\n}\n";

    // import * as from '../systems/shader/shader';

    var UID$3 = 0;

    var nameCache = {};

    /**
     * Helper class to create a shader program.
     *
     * @class
     * @memberof PIXI
     */
    var Program = function Program(vertexSrc, fragmentSrc, name)
    {
        if ( name === void 0 ) name = 'pixi-shader';

        this.id = UID$3++;

        /**
         * The vertex shader.
         *
         * @member {string}
         */
        this.vertexSrc = vertexSrc || Program.defaultVertexSrc;

        /**
         * The fragment shader.
         *
         * @member {string}
         */
        this.fragmentSrc = fragmentSrc || Program.defaultFragmentSrc;

        this.vertexSrc = this.vertexSrc.trim();
        this.fragmentSrc = this.fragmentSrc.trim();

        if (this.vertexSrc.substring(0, 8) !== '#version')
        {
            name = name.replace(/\s+/g, '-');

            if (nameCache[name])
            {
                nameCache[name]++;
                name += "-" + (nameCache[name]);
            }
            else
            {
                nameCache[name] = 1;
            }

            this.vertexSrc = "#define SHADER_NAME " + name + "\n" + (this.vertexSrc);
            this.fragmentSrc = "#define SHADER_NAME " + name + "\n" + (this.fragmentSrc);

            this.vertexSrc = setPrecision(this.vertexSrc, settings.PRECISION_VERTEX, PRECISION.HIGH);
            this.fragmentSrc = setPrecision(this.fragmentSrc, settings.PRECISION_FRAGMENT, getMaxFragmentPrecision());
        }

        // currently this does not extract structs only default types
        this.extractData(this.vertexSrc, this.fragmentSrc);

        // this is where we store shader references..
        this.glPrograms = {};

        this.syncUniforms = null;
    };

    var staticAccessors = { defaultVertexSrc: { configurable: true },defaultFragmentSrc: { configurable: true } };

    /**
     * Extracts the data for a buy creating a small test program
     * or reading the src directly.
     * @protected
     *
     * @param {string} [vertexSrc] - The source of the vertex shader.
     * @param {string} [fragmentSrc] - The source of the fragment shader.
     */
    Program.prototype.extractData = function extractData (vertexSrc, fragmentSrc)
    {
        var gl = getTestContext();

        if (gl)
        {
            var program = compileProgram(gl, vertexSrc, fragmentSrc);

            this.attributeData = this.getAttributeData(program, gl);
            this.uniformData = this.getUniformData(program, gl);

            gl.deleteProgram(program);
        }
        else
        {
            this.uniformData = {};
            this.attributeData = {};
        }
    };

    /**
     * returns the attribute data from the program
     * @private
     *
     * @param {WebGLProgram} [program] - the WebGL program
     * @param {WebGLRenderingContext} [gl] - the WebGL context
     *
     * @returns {object} the attribute data for this program
     */
    Program.prototype.getAttributeData = function getAttributeData (program, gl)
    {
        var attributes = {};
        var attributesArray = [];

        var totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

        for (var i = 0; i < totalAttributes; i++)
        {
            var attribData = gl.getActiveAttrib(program, i);
            var type = mapType(gl, attribData.type);

            /*eslint-disable */
            var data = {
                type: type,
                name: attribData.name,
                size: mapSize(type),
                location: 0,
            };
            /* eslint-enable */

            attributes[attribData.name] = data;
            attributesArray.push(data);
        }

        attributesArray.sort(function (a, b) { return (a.name > b.name) ? 1 : -1; }); // eslint-disable-line no-confusing-arrow

        for (var i$1 = 0; i$1 < attributesArray.length; i$1++)
        {
            attributesArray[i$1].location = i$1;
        }

        return attributes;
    };

    /**
     * returns the uniform data from the program
     * @private
     *
     * @param {webGL-program} [program] - the webgl program
     * @param {context} [gl] - the WebGL context
     *
     * @returns {object} the uniform data for this program
     */
    Program.prototype.getUniformData = function getUniformData (program, gl)
    {
        var uniforms = {};

        var totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

        // TODO expose this as a prop?
        // const maskRegex = new RegExp('^(projectionMatrix|uSampler|translationMatrix)$');
        // const maskRegex = new RegExp('^(projectionMatrix|uSampler|translationMatrix)$');

        for (var i = 0; i < totalUniforms; i++)
        {
            var uniformData = gl.getActiveUniform(program, i);
            var name = uniformData.name.replace(/\[.*?\]/, '');

            var isArray = uniformData.name.match(/\[.*?\]/, '');
            var type = mapType(gl, uniformData.type);

            /*eslint-disable */
            uniforms[name] = {
                type: type,
                size: uniformData.size,
                isArray:isArray,
                value: defaultValue(type, uniformData.size),
            };
            /* eslint-enable */
        }

        return uniforms;
    };

    /**
     * The default vertex shader source
     *
     * @static
     * @constant
     * @member {string}
     */
    staticAccessors.defaultVertexSrc.get = function ()
    {
        return defaultVertex;
    };

    /**
     * The default fragment shader source
     *
     * @static
     * @constant
     * @member {string}
     */
    staticAccessors.defaultFragmentSrc.get = function ()
    {
        return defaultFragment;
    };

    /**
     * A short hand function to create a program based of a vertex and fragment shader
     * this method will also check to see if there is a cached program.
     *
     * @param {string} [vertexSrc] - The source of the vertex shader.
     * @param {string} [fragmentSrc] - The source of the fragment shader.
     * @param {string} [name=pixi-shader] - Name for shader
     *
     * @returns {PIXI.Program} an shiny new Pixi shader!
     */
    Program.from = function from (vertexSrc, fragmentSrc, name)
    {
        var key = vertexSrc + fragmentSrc;

        var program = ProgramCache[key];

        if (!program)
        {
            ProgramCache[key] = program = new Program(vertexSrc, fragmentSrc, name);
        }

        return program;
    };

    Object.defineProperties( Program, staticAccessors );

    /**
     * A helper class for shaders
     *
     * @class
     * @memberof PIXI
     */
    var Shader = function Shader(program, uniforms)
    {
        /**
         * Program that the shader uses
         *
         * @member {PIXI.Program}
         */
        this.program = program;

        // lets see whats been passed in
        // uniforms should be converted to a uniform group
        if (uniforms)
        {
            if (uniforms instanceof UniformGroup)
            {
                this.uniformGroup = uniforms;
            }
            else
            {
                this.uniformGroup = new UniformGroup(uniforms);
            }
        }
        else
        {
            this.uniformGroup = new UniformGroup({});
        }

        // time to build some getters and setters!
        // I guess down the line this could sort of generate an instruction list rather than use dirty ids?
        // does the trick for now though!
        for (var i in program.uniformData)
        {
            if (this.uniformGroup.uniforms[i] instanceof Array)
            {
                this.uniformGroup.uniforms[i] = new Float32Array(this.uniformGroup.uniforms[i]);
            }
        }
    };

    var prototypeAccessors$2 = { uniforms: { configurable: true } };

    // TODO move to shader system..
    Shader.prototype.checkUniformExists = function checkUniformExists (name, group)
    {
        if (group.uniforms[name])
        {
            return true;
        }

        for (var i in group.uniforms)
        {
            var uniform = group.uniforms[i];

            if (uniform.group)
            {
                if (this.checkUniformExists(name, uniform))
                {
                    return true;
                }
            }
        }

        return false;
    };

    Shader.prototype.destroy = function destroy ()
    {
        // usage count on programs?
        // remove if not used!
        this.uniformGroup = null;
    };

    /**
     * Shader uniform values, shortcut for `uniformGroup.uniforms`
     * @readonly
     * @member {object}
     */
    prototypeAccessors$2.uniforms.get = function ()
    {
        return this.uniformGroup.uniforms;
    };

    /**
     * A short hand function to create a shader based of a vertex and fragment shader
     *
     * @param {string} [vertexSrc] - The source of the vertex shader.
     * @param {string} [fragmentSrc] - The source of the fragment shader.
     * @param {object} [uniforms] - Custom uniforms to use to augment the built-in ones.
     *
     * @returns {PIXI.Shader} an shiny new Pixi shader!
     */
    Shader.from = function from (vertexSrc, fragmentSrc, uniforms)
    {
        var program = Program.from(vertexSrc, fragmentSrc);

        return new Shader(program, uniforms);
    };

    Object.defineProperties( Shader.prototype, prototypeAccessors$2 );

    /* eslint-disable max-len */

    var BLEND = 0;
    var OFFSET = 1;
    var CULLING = 2;
    var DEPTH_TEST = 3;
    var WINDING = 4;

    /**
     * This is a WebGL state, and is is passed The WebGL StateManager.
     *
     * Each mesh rendered may require WebGL to be in a different state.
     * For example you may want different blend mode or to enable polygon offsets
     *
     * @class
     * @memberof PIXI
     */
    var State = function State()
    {
        this.data = 0;

        this.blendMode = BLEND_MODES.NORMAL;
        this.polygonOffset = 0;

        this.blend = true;
        //  this.depthTest = true;
    };

    var prototypeAccessors$3 = { blend: { configurable: true },offsets: { configurable: true },culling: { configurable: true },depthTest: { configurable: true },clockwiseFrontFace: { configurable: true },blendMode: { configurable: true },polygonOffset: { configurable: true } };

    /**
     * Activates blending of the computed fragment color values
     *
     * @member {boolean}
     */
    prototypeAccessors$3.blend.get = function ()
    {
        return !!(this.data & (1 << BLEND));
    };

    prototypeAccessors$3.blend.set = function (value) // eslint-disable-line require-jsdoc
    {
        if (!!(this.data & (1 << BLEND)) !== value)
        {
            this.data ^= (1 << BLEND);
        }
    };

    /**
     * Activates adding an offset to depth values of polygon's fragments
     *
     * @member {boolean}
     * @default false
     */
    prototypeAccessors$3.offsets.get = function ()
    {
        return !!(this.data & (1 << OFFSET));
    };

    prototypeAccessors$3.offsets.set = function (value) // eslint-disable-line require-jsdoc
    {
        if (!!(this.data & (1 << OFFSET)) !== value)
        {
            this.data ^= (1 << OFFSET);
        }
    };

    /**
     * Activates culling of polygons.
     *
     * @member {boolean}
     * @default false
     */
    prototypeAccessors$3.culling.get = function ()
    {
        return !!(this.data & (1 << CULLING));
    };

    prototypeAccessors$3.culling.set = function (value) // eslint-disable-line require-jsdoc
    {
        if (!!(this.data & (1 << CULLING)) !== value)
        {
            this.data ^= (1 << CULLING);
        }
    };

    /**
     * Activates depth comparisons and updates to the depth buffer.
     *
     * @member {boolean}
     * @default false
     */
    prototypeAccessors$3.depthTest.get = function ()
    {
        return !!(this.data & (1 << DEPTH_TEST));
    };

    prototypeAccessors$3.depthTest.set = function (value) // eslint-disable-line require-jsdoc
    {
        if (!!(this.data & (1 << DEPTH_TEST)) !== value)
        {
            this.data ^= (1 << DEPTH_TEST);
        }
    };

    /**
     * Specifies whether or not front or back-facing polygons can be culled.
     * @member {boolean}
     * @default false
     */
    prototypeAccessors$3.clockwiseFrontFace.get = function ()
    {
        return !!(this.data & (1 << WINDING));
    };

    prototypeAccessors$3.clockwiseFrontFace.set = function (value) // eslint-disable-line require-jsdoc
    {
        if (!!(this.data & (1 << WINDING)) !== value)
        {
            this.data ^= (1 << WINDING);
        }
    };

    /**
     * The blend mode to be applied when this state is set. Apply a value of `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.
     * Setting this mode to anything other than NO_BLEND will automatically switch blending on.
     *
     * @member {number}
     * @default PIXI.BLEND_MODES.NORMAL
     * @see PIXI.BLEND_MODES
     */
    prototypeAccessors$3.blendMode.get = function ()
    {
        return this._blendMode;
    };

    prototypeAccessors$3.blendMode.set = function (value) // eslint-disable-line require-jsdoc
    {
        this.blend = (value !== BLEND_MODES.NONE);
        this._blendMode = value;
    };

    /**
     * The polygon offset. Setting this property to anything other than 0 will automatically enable polygon offset fill.
     *
     * @member {number}
     * @default 0
     */
    prototypeAccessors$3.polygonOffset.get = function ()
    {
        return this._polygonOffset;
    };

    prototypeAccessors$3.polygonOffset.set = function (value) // eslint-disable-line require-jsdoc
    {
        this.offsets = !!value;
        this._polygonOffset = value;
    };

    State.for2d = function for2d ()
    {
        var state = new State();

        state.depthTest = false;
        state.blend = true;

        return state;
    };

    Object.defineProperties( State.prototype, prototypeAccessors$3 );

    var defaultVertex$1 = "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n";

    var defaultFragment$1 = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n   gl_FragColor = texture2D(uSampler, vTextureCoord);\n}\n";

    /**
     * Filter is a special type of WebGL shader that is applied to the screen.
     *
     * {@link http://pixijs.io/examples/#/filters/blur-filter.js Example} of the
     * {@link PIXI.filters.BlurFilter BlurFilter}.
     *
     * ### Usage
     * Filters can be applied to any DisplayObject or Container.
     * PixiJS' `FilterSystem` renders the container into temporary Framebuffer,
     * then filter renders it to the screen.
     * Multiple filters can be added to the `filters` array property and stacked on each other.
     *
     * ```
     * const filter = new PIXI.Filter(myShaderVert, myShaderFrag, { myUniform: 0.5 });
     * const container = new PIXI.Container();
     * container.filters = [filter];
     * ```
     *
     * ### Previous Version Differences
     *
     * In PixiJS **v3**, a filter was always applied to _whole screen_.
     *
     * In PixiJS **v4**, a filter can be applied _only part of the screen_.
     * Developers had to create a set of uniforms to deal with coordinates.
     *
     * In PixiJS **v5** combines _both approaches_.
     * Developers can use normal coordinates of v3 and then allow filter to use partial Framebuffers,
     * bringing those extra uniforms into account.
     *
     * Also be aware that we have changed default vertex shader, please consult
     * {@link https://github.com/pixijs/pixi.js/wiki/v5-Creating-filters Wiki}.
     *
     * ### Built-in Uniforms
     *
     * PixiJS viewport uses screen (CSS) coordinates, `(0, 0, renderer.screen.width, renderer.screen.height)`,
     * and `projectionMatrix` uniform maps it to the gl viewport.
     *
     * **uSampler**
     *
     * The most important uniform is the input texture that container was rendered into.
     * _Important note: as with all Framebuffers in PixiJS, both input and output are
     * premultiplied by alpha._
     *
     * By default, input normalized coordinates are passed to fragment shader with `vTextureCoord`.
     * Use it to sample the input.
     *
     * ```
     * const fragment = `
     * varying vec2 vTextureCoord;
     * uniform sampler2D uSampler;
     * void main(void)
     * {
     *    gl_FragColor = texture2D(uSampler, vTextureCoord);
     * }
     * `;
     *
     * const myFilter = new PIXI.Filter(null, fragment);
     * ```
     *
     * This filter is just one uniform less than {@link PIXI.filters.AlphaFilter AlphaFilter}.
     *
     * **outputFrame**
     *
     * The `outputFrame` holds the rectangle where filter is applied in screen (CSS) coordinates.
     * It's the same as `renderer.screen` for a fullscreen filter.
     * Only a part of  `outputFrame.zw` size of temporary Framebuffer is used,
     * `(0, 0, outputFrame.width, outputFrame.height)`,
     *
     * Filters uses this quad to normalized (0-1) space, its passed into `aVertexPosition` attribute.
     * To calculate vertex position in screen space using normalized (0-1) space:
     *
     * ```
     * vec4 filterVertexPosition( void )
     * {
     *     vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;
     *     return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
     * }
     * ```
     *
     * **inputSize**
     *
     * Temporary framebuffer is different, it can be either the size of screen, either power-of-two.
     * The `inputSize.xy` are size of temporary framebuffer that holds input.
     * The `inputSize.zw` is inverted, it's a shortcut to evade division inside the shader.
     *
     * Set `inputSize.xy = outputFrame.zw` for a fullscreen filter.
     *
     * To calculate input normalized coordinate, you have to map it to filter normalized space.
     * Multiply by `outputFrame.zw` to get input coordinate.
     * Divide by `inputSize.xy` to get input normalized coordinate.
     *
     * ```
     * vec2 filterTextureCoord( void )
     * {
     *     return aVertexPosition * (outputFrame.zw * inputSize.zw); // same as /inputSize.xy
     * }
     * ```
     * **resolution**
     *
     * The `resolution` is the ratio of screen (CSS) pixels to real pixels.
     *
     * **inputPixel**
     *
     * `inputPixel.xy` is the size of framebuffer in real pixels, same as `inputSize.xy * resolution`
     * `inputPixel.zw` is inverted `inputPixel.xy`.
     *
     * It's handy for filters that use neighbour pixels, like {@link PIXI.filters.FXAAFilter FXAAFilter}.
     *
     * **inputClamp**
     *
     * If you try to get info from outside of used part of Framebuffer - you'll get undefined behaviour.
     * For displacements, coordinates has to be clamped.
     *
     * The `inputClamp.xy` is left-top pixel center, you may ignore it, because we use left-top part of Framebuffer
     * `inputClamp.zw` is bottom-right pixel center.
     *
     * ```
     * vec4 color = texture2D(uSampler, clamp(modifigedTextureCoord, inputClamp.xy, inputClamp.zw))
     * ```
     * OR
     * ```
     * vec4 color = texture2D(uSampler, min(modifigedTextureCoord, inputClamp.zw))
     * ```
     *
     * ### Additional Information
     *
     * Complete documentation on Filter usage is located in the
     * {@link https://github.com/pixijs/pixi.js/wiki/v5-Creating-filters Wiki}.
     *
     * Since PixiJS only had a handful of built-in filters, additional filters can be downloaded
     * {@link https://github.com/pixijs/pixi-filters here} from the PixiJS Filters repository.
     *
     * @class
     * @memberof PIXI
     * @extends PIXI.Shader
     */
    var Filter = /*@__PURE__*/(function (Shader) {
        function Filter(vertexSrc, fragmentSrc, uniforms)
        {
            var program = Program.from(vertexSrc || Filter.defaultVertexSrc,
                fragmentSrc || Filter.defaultFragmentSrc);

            Shader.call(this, program, uniforms);

            /**
             * The padding of the filter. Some filters require extra space to breath such as a blur.
             * Increasing this will add extra width and height to the bounds of the object that the
             * filter is applied to.
             *
             * @member {number}
             */
            this.padding = 0;

            /**
             * The resolution of the filter. Setting this to be lower will lower the quality but
             * increase the performance of the filter.
             *
             * @member {number}
             */
            this.resolution = settings.FILTER_RESOLUTION;

            /**
             * If enabled is true the filter is applied, if false it will not.
             *
             * @member {boolean}
             */
            this.enabled = true;

            /**
             * If enabled, PixiJS will fit the filter area into boundaries for better performance.
             * Switch it off if it does not work for specific shader.
             *
             * @member {boolean}
             */
            this.autoFit = true;

            /**
             * Legacy filters use position and uvs from attributes
             * @member {boolean}
             * @readonly
             */
            this.legacy = !!this.program.attributeData.aTextureCoord;

            /**
             * The WebGL state the filter requires to render
             * @member {PIXI.State}
             */
            this.state = new State();
        }

        if ( Shader ) Filter.__proto__ = Shader;
        Filter.prototype = Object.create( Shader && Shader.prototype );
        Filter.prototype.constructor = Filter;

        var prototypeAccessors = { blendMode: { configurable: true } };
        var staticAccessors = { defaultVertexSrc: { configurable: true },defaultFragmentSrc: { configurable: true } };

        /**
         * Applies the filter
         *
         * @param {PIXI.systems.FilterSystem} filterManager - The renderer to retrieve the filter from
         * @param {PIXI.RenderTexture} input - The input render target.
         * @param {PIXI.RenderTexture} output - The target to output to.
         * @param {boolean} clear - Should the output be cleared before rendering to it
         * @param {object} [currentState] - It's current state of filter.
         *        There are some useful properties in the currentState :
         *        target, filters, sourceFrame, destinationFrame, renderTarget, resolution
         */
        Filter.prototype.apply = function apply (filterManager, input, output, clear, currentState)
        {
            // do as you please!

            filterManager.applyFilter(this, input, output, clear, currentState);

            // or just do a regular render..
        };

        /**
         * Sets the blendmode of the filter
         *
         * @member {number}
         * @default PIXI.BLEND_MODES.NORMAL
         */
        prototypeAccessors.blendMode.get = function ()
        {
            return this.state.blendMode;
        };

        prototypeAccessors.blendMode.set = function (value) // eslint-disable-line require-jsdoc
        {
            this.state.blendMode = value;
        };

        /**
         * The default vertex shader source
         *
         * @static
         * @type {string}
         * @constant
         */
        staticAccessors.defaultVertexSrc.get = function ()
        {
            return defaultVertex$1;
        };

        /**
         * The default fragment shader source
         *
         * @static
         * @type {string}
         * @constant
         */
        staticAccessors.defaultFragmentSrc.get = function ()
        {
            return defaultFragment$1;
        };

        Object.defineProperties( Filter.prototype, prototypeAccessors );
        Object.defineProperties( Filter, staticAccessors );

        return Filter;
    }(Shader));

    /**
     * Used for caching shader IDs
     *
     * @static
     * @type {object}
     * @protected
     */
    Filter.SOURCE_KEY_MAP = {};

    var tempMat = new Matrix();

    /**
     * Class controls uv mapping from Texture normal space to BaseTexture normal space.
     *
     * Takes `trim` and `rotate` into account. May contain clamp settings for Meshes and TilingSprite.
     *
     * Can be used in Texture `uvMatrix` field, or separately, you can use different clamp settings on the same texture.
     * If you want to add support for texture region of certain feature or filter, that's what you're looking for.
     *
     * Takes track of Texture changes through `_lastTextureID` private field.
     * Use `update()` method call to track it from outside.
     *
     * @see PIXI.Texture
     * @see PIXI.Mesh
     * @see PIXI.TilingSprite
     * @class
     * @memberof PIXI
     */
    var TextureMatrix = function TextureMatrix(texture, clampMargin)
    {
        this._texture = texture;

        /**
         * Matrix operation that converts texture region coords to texture coords
         * @member {PIXI.Matrix}
         * @readonly
         */
        this.mapCoord = new Matrix();

        /**
         * Clamp region for normalized coords, left-top pixel center in xy , bottom-right in zw.
         * Calculated based on clampOffset.
         * @member {Float32Array}
         * @readonly
         */
        this.uClampFrame = new Float32Array(4);

        /**
         * Normalized clamp offset.
         * Calculated based on clampOffset.
         * @member {Float32Array}
         * @readonly
         */
        this.uClampOffset = new Float32Array(2);

        /**
         * Tracks Texture frame changes
         * @member {number}
         * @protected
         */
        this._updateID = -1;

        /**
         * Changes frame clamping
         * Works with TilingSprite and Mesh
         * Change to 1.5 if you texture has repeated right and bottom lines, that leads to smoother borders
         *
         * @default 0
         * @member {number}
         */
        this.clampOffset = 0;

        /**
         * Changes frame clamping
         * Works with TilingSprite and Mesh
         * Change to -0.5 to add a pixel to the edge, recommended for transparent trimmed textures in atlas
         *
         * @default 0.5
         * @member {number}
         */
        this.clampMargin = (typeof clampMargin === 'undefined') ? 0.5 : clampMargin;

        /**
         * If texture size is the same as baseTexture
         * @member {boolean}
         * @default false
         * @readonly
         */
        this.isSimple = false;
    };

    var prototypeAccessors$4 = { texture: { configurable: true } };

    /**
     * texture property
     * @member {PIXI.Texture}
     */
    prototypeAccessors$4.texture.get = function ()
    {
        return this._texture;
    };

    prototypeAccessors$4.texture.set = function (value) // eslint-disable-line require-jsdoc
    {
        this._texture = value;
        this._updateID = -1;
    };

    /**
     * Multiplies uvs array to transform
     * @param {Float32Array} uvs mesh uvs
     * @param {Float32Array} [out=uvs] output
     * @returns {Float32Array} output
     */
    TextureMatrix.prototype.multiplyUvs = function multiplyUvs (uvs, out)
    {
        if (out === undefined)
        {
            out = uvs;
        }

        var mat = this.mapCoord;

        for (var i = 0; i < uvs.length; i += 2)
        {
            var x = uvs[i];
            var y = uvs[i + 1];

            out[i] = (x * mat.a) + (y * mat.c) + mat.tx;
            out[i + 1] = (x * mat.b) + (y * mat.d) + mat.ty;
        }

        return out;
    };

    /**
     * updates matrices if texture was changed
     * @param {boolean} [forceUpdate=false] if true, matrices will be updated any case
     * @returns {boolean} whether or not it was updated
     */
    TextureMatrix.prototype.update = function update (forceUpdate)
    {
        var tex = this._texture;

        if (!tex || !tex.valid)
        {
            return false;
        }

        if (!forceUpdate
            && this._updateID === tex._updateID)
        {
            return false;
        }

        this._updateID = tex._updateID;

        var uvs = tex._uvs;

        this.mapCoord.set(uvs.x1 - uvs.x0, uvs.y1 - uvs.y0, uvs.x3 - uvs.x0, uvs.y3 - uvs.y0, uvs.x0, uvs.y0);

        var orig = tex.orig;
        var trim = tex.trim;

        if (trim)
        {
            tempMat.set(orig.width / trim.width, 0, 0, orig.height / trim.height,
                -trim.x / trim.width, -trim.y / trim.height);
            this.mapCoord.append(tempMat);
        }

        var texBase = tex.baseTexture;
        var frame = this.uClampFrame;
        var margin = this.clampMargin / texBase.resolution;
        var offset = this.clampOffset;

        frame[0] = (tex._frame.x + margin + offset) / texBase.width;
        frame[1] = (tex._frame.y + margin + offset) / texBase.height;
        frame[2] = (tex._frame.x + tex._frame.width - margin + offset) / texBase.width;
        frame[3] = (tex._frame.y + tex._frame.height - margin + offset) / texBase.height;
        this.uClampOffset[0] = offset / texBase.realWidth;
        this.uClampOffset[1] = offset / texBase.realHeight;

        this.isSimple = tex._frame.width === texBase.width
            && tex._frame.height === texBase.height
            && tex.rotate === 0;

        return true;
    };

    Object.defineProperties( TextureMatrix.prototype, prototypeAccessors$4 );

    var tempRect = new Rectangle();

    var tempMatrix = new Matrix();

    /**
     * Used by the batcher to draw batches.
     * Each one of these contains all information required to draw a bound geometry.
     *
     * @class
     * @memberof PIXI
     */
    var BatchDrawCall = function BatchDrawCall()
    {
        this.texArray = null;
        this.blend = 0;
        this.type = DRAW_MODES.TRIANGLES;

        this.start = 0;
        this.size = 0;

        /**
         * data for uniforms or custom webgl state
         * @member {object}
         */
        this.data = null;
    };

    /**
     * Used by the batcher to build texture batches.
     * Holds list of textures and their respective locations.
     *
     * @class
     * @memberof PIXI
     */
    var BatchTextureArray = function BatchTextureArray()
    {
        /**
         * inside textures array
         * @member {PIXI.BaseTexture[]}
         */
        this.elements = [];
        /**
         * Respective locations for textures
         * @member {number[]}
         */
        this.ids = [];
        /**
         * number of filled elements
         * @member {number}
         */
        this.count = 0;
    };

    BatchTextureArray.prototype.clear = function clear ()
    {
        for (var i = 0; i < this.count; i++)
        {
            this.elements[i] = null;
        }
        this.count = 0;
    };

    /**
     * Flexible wrapper around `ArrayBuffer` that also provides
     * typed array views on demand.
     *
     * @class
     * @memberof PIXI
     */
    var ViewableBuffer = function ViewableBuffer(size)
    {
        /**
         * Underlying `ArrayBuffer` that holds all the data
         * and is of capacity `size`.
         *
         * @member {ArrayBuffer}
         */
        this.rawBinaryData = new ArrayBuffer(size);

        /**
         * View on the raw binary data as a `Uint32Array`.
         *
         * @member {Uint32Array}
         */
        this.uint32View = new Uint32Array(this.rawBinaryData);

        /**
         * View on the raw binary data as a `Float32Array`.
         *
         * @member {Float32Array}
         */
        this.float32View = new Float32Array(this.rawBinaryData);
    };

    var prototypeAccessors$5 = { int8View: { configurable: true },uint8View: { configurable: true },int16View: { configurable: true },uint16View: { configurable: true },int32View: { configurable: true } };

    /**
     * View on the raw binary data as a `Int8Array`.
     *
     * @member {Int8Array}
     */
    prototypeAccessors$5.int8View.get = function ()
    {
        if (!this._int8View)
        {
            this._int8View = new Int8Array(this.rawBinaryData);
        }

        return this._int8View;
    };

    /**
     * View on the raw binary data as a `Uint8Array`.
     *
     * @member {Uint8Array}
     */
    prototypeAccessors$5.uint8View.get = function ()
    {
        if (!this._uint8View)
        {
            this._uint8View = new Uint8Array(this.rawBinaryData);
        }

        return this._uint8View;
    };

    /**
     * View on the raw binary data as a `Int16Array`.
     *
     * @member {Int16Array}
     */
    prototypeAccessors$5.int16View.get = function ()
    {
        if (!this._int16View)
        {
            this._int16View = new Int16Array(this.rawBinaryData);
        }

        return this._int16View;
    };

    /**
     * View on the raw binary data as a `Uint16Array`.
     *
     * @member {Uint16Array}
     */
    prototypeAccessors$5.uint16View.get = function ()
    {
        if (!this._uint16View)
        {
            this._uint16View = new Uint16Array(this.rawBinaryData);
        }

        return this._uint16View;
    };

    /**
     * View on the raw binary data as a `Int32Array`.
     *
     * @member {Int32Array}
     */
    prototypeAccessors$5.int32View.get = function ()
    {
        if (!this._int32View)
        {
            this._int32View = new Int32Array(this.rawBinaryData);
        }

        return this._int32View;
    };

    /**
     * Returns the view of the given type.
     *
     * @param {string} type - One of `int8`, `uint8`, `int16`,
     *`uint16`, `int32`, `uint32`, and `float32`.
     * @return {object} typed array of given type
     */
    ViewableBuffer.prototype.view = function view (type)
    {
        return this[(type + "View")];
    };

    /**
     * Destroys all buffer references. Do not use after calling
     * this.
     */
    ViewableBuffer.prototype.destroy = function destroy ()
    {
        this.rawBinaryData = null;
        this._int8View = null;
        this._uint8View = null;
        this._int16View = null;
        this._uint16View = null;
        this._int32View = null;
        this.uint32View = null;
        this.float32View = null;
    };

    ViewableBuffer.sizeOf = function sizeOf (type)
    {
        switch (type)
        {
            case 'int8':
            case 'uint8':
                return 1;
            case 'int16':
            case 'uint16':
                return 2;
            case 'int32':
            case 'uint32':
            case 'float32':
                return 4;
            default:
                throw new Error((type + " isn't a valid view type"));
        }
    };

    Object.defineProperties( ViewableBuffer.prototype, prototypeAccessors$5 );

    /**
     * Renderer dedicated to drawing and batching sprites.
     *
     * This is the default batch renderer. It buffers objects
     * with texture-based geometries and renders them in
     * batches. It uploads multiple textures to the GPU to
     * reduce to the number of draw calls.
     *
     * @class
     * @protected
     * @memberof PIXI
     * @extends PIXI.ObjectRenderer
     */
    var AbstractBatchRenderer = /*@__PURE__*/(function (ObjectRenderer) {
        function AbstractBatchRenderer(renderer)
        {
            ObjectRenderer.call(this, renderer);

            /**
             * This is used to generate a shader that can
             * color each vertex based on a `aTextureId`
             * attribute that points to an texture in `uSampler`.
             *
             * This enables the objects with different textures
             * to be drawn in the same draw call.
             *
             * You can customize your shader by creating your
             * custom shader generator.
             *
             * @member {PIXI.BatchShaderGenerator}
             * @protected
             */
            this.shaderGenerator = null;

            /**
             * The class that represents the geometry of objects
             * that are going to be batched with this.
             *
             * @member {object}
             * @default PIXI.BatchGeometry
             * @protected
             */
            this.geometryClass = null;

            /**
             * Size of data being buffered per vertex in the
             * attribute buffers (in floats). By default, the
             * batch-renderer plugin uses 6:
             *
             * | aVertexPosition | 2 |
             * |-----------------|---|
             * | aTextureCoords  | 2 |
             * | aColor          | 1 |
             * | aTextureId      | 1 |
             *
             * @member {number}
             * @readonly
             */
            this.vertexSize = null;

            /**
             * The WebGL state in which this renderer will work.
             *
             * @member {PIXI.State}
             * @readonly
             */
            this.state = State.for2d();

            /**
             * The number of bufferable objects before a flush
             * occurs automatically.
             *
             * @member {number}
             * @default settings.SPRITE_BATCH_SIZE * 4
             */
            this.size = settings.SPRITE_BATCH_SIZE * 4;

            /**
             * Total count of all vertices used by the currently
             * buffered objects.
             *
             * @member {number}
             * @private
             */
            this._vertexCount = 0;

            /**
             * Total count of all indices used by the currently
             * buffered objects.
             *
             * @member {number}
             * @private
             */
            this._indexCount = 0;

            /**
             * Buffer of objects that are yet to be rendered.
             *
             * @member {PIXI.DisplayObject[]}
             * @private
             */
            this._bufferedElements = [];

            /**
             * Data for texture batch builder, helps to save a bit of CPU on a pass
             * @type {PIXI.BaseTexture[]}
             * @private
             */
            this._bufferedTextures = [];

            /**
             * Number of elements that are buffered and are
             * waiting to be flushed.
             *
             * @member {number}
             * @private
             */
            this._bufferSize = 0;

            /**
             * This shader is generated by `this.shaderGenerator`.
             *
             * It is generated specifically to handle the required
             * number of textures being batched together.
             *
             * @member {PIXI.Shader}
             * @protected
             */
            this._shader = null;

            /**
             * Pool of `this.geometryClass` geometry objects
             * that store buffers. They are used to pass data
             * to the shader on each draw call.
             *
             * These are never re-allocated again, unless a
             * context change occurs; however, the pool may
             * be expanded if required.
             *
             * @member {PIXI.Geometry[]}
             * @private
             * @see PIXI.AbstractBatchRenderer.contextChange
             */
            this._packedGeometries = [];

            /**
             * Size of `this._packedGeometries`. It can be expanded
             * if more than `this._packedGeometryPoolSize` flushes
             * occur in a single frame.
             *
             * @member {number}
             * @private
             */
            this._packedGeometryPoolSize = 2;

            /**
             * A flush may occur multiple times in a single
             * frame. On iOS devices or when
             * `settings.CAN_UPLOAD_SAME_BUFFER` is false, the
             * batch renderer does not upload data to the same
             * `WebGLBuffer` for performance reasons.
             *
             * This is the index into `packedGeometries` that points to
             * geometry holding the most recent buffers.
             *
             * @member {number}
             * @private
             */
            this._flushId = 0;

            /**
             * Pool of `ViewableBuffer` objects that are sorted in
             * order of increasing size. The flush method uses
             * the buffer with the least size above the amount
             * it requires. These are used for passing attributes.
             *
             * The first buffer has a size of 8; each subsequent
             * buffer has double capacity of its previous.
             *
             * @member {PIXI.ViewableBuffer[]}
             * @private
             * @see PIXI.AbstractBatchRenderer#getAttributeBuffer
             */
            this._aBuffers = {};

            /**
             * Pool of `Uint16Array` objects that are sorted in
             * order of increasing size. The flush method uses
             * the buffer with the least size above the amount
             * it requires. These are used for passing indices.
             *
             * The first buffer has a size of 12; each subsequent
             * buffer has double capacity of its previous.
             *
             * @member {Uint16Array[]}
             * @private
             * @see PIXI.AbstractBatchRenderer#getIndexBuffer
             */
            this._iBuffers = {};

            /**
             * Maximum number of textures that can be uploaded to
             * the GPU under the current context. It is initialized
             * properly in `this.contextChange`.
             *
             * @member {number}
             * @see PIXI.AbstractBatchRenderer#contextChange
             * @readonly
             */
            this.MAX_TEXTURES = 1;

            this.renderer.on('prerender', this.onPrerender, this);
            renderer.runners.contextChange.add(this);

            this._dcIndex = 0;
            this._aIndex = 0;
            this._iIndex = 0;
            this._attributeBuffer = null;
            this._indexBuffer = null;
            this._tempBoundTextures = [];
        }

        if ( ObjectRenderer ) AbstractBatchRenderer.__proto__ = ObjectRenderer;
        AbstractBatchRenderer.prototype = Object.create( ObjectRenderer && ObjectRenderer.prototype );
        AbstractBatchRenderer.prototype.constructor = AbstractBatchRenderer;

        /**
         * Handles the `contextChange` signal.
         *
         * It calculates `this.MAX_TEXTURES` and allocating the
         * packed-geometry object pool.
         */
        AbstractBatchRenderer.prototype.contextChange = function contextChange ()
        {
            var gl = this.renderer.gl;

            if (settings.PREFER_ENV === ENV.WEBGL_LEGACY)
            {
                this.MAX_TEXTURES = 1;
            }
            else
            {
                // step 1: first check max textures the GPU can handle.
                this.MAX_TEXTURES = Math.min(
                    gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
                    settings.SPRITE_MAX_TEXTURES);

                // step 2: check the maximum number of if statements the shader can have too..
                this.MAX_TEXTURES = checkMaxIfStatementsInShader(
                    this.MAX_TEXTURES, gl);
            }

            this._shader = this.shaderGenerator.generateShader(this.MAX_TEXTURES);

            // we use the second shader as the first one depending on your browser
            // may omit aTextureId as it is not used by the shader so is optimized out.
            for (var i = 0; i < this._packedGeometryPoolSize; i++)
            {
                /* eslint-disable max-len */
                this._packedGeometries[i] = new (this.geometryClass)();
            }

            this.initFlushBuffers();
        };

        /**
         * Makes sure that static and dynamic flush pooled objects have correct dimensions
         */
        AbstractBatchRenderer.prototype.initFlushBuffers = function initFlushBuffers ()
        {
            var _drawCallPool = AbstractBatchRenderer._drawCallPool;
            var _textureArrayPool = AbstractBatchRenderer._textureArrayPool;
            // max draw calls
            var MAX_SPRITES = this.size / 4;
            // max texture arrays
            var MAX_TA = Math.floor(MAX_SPRITES / this.MAX_TEXTURES) + 1;

            while (_drawCallPool.length < MAX_SPRITES)
            {
                _drawCallPool.push(new BatchDrawCall());
            }
            while (_textureArrayPool.length < MAX_TA)
            {
                _textureArrayPool.push(new BatchTextureArray());
            }
            for (var i = 0; i < this.MAX_TEXTURES; i++)
            {
                this._tempBoundTextures[i] = null;
            }
        };

        /**
         * Handles the `prerender` signal.
         *
         * It ensures that flushes start from the first geometry
         * object again.
         */
        AbstractBatchRenderer.prototype.onPrerender = function onPrerender ()
        {
            this._flushId = 0;
        };

        /**
         * Buffers the "batchable" object. It need not be rendered
         * immediately.
         *
         * @param {PIXI.DisplayObject} element - the element to render when
         *    using this renderer
         */
        AbstractBatchRenderer.prototype.render = function render (element)
        {
            if (!element._texture.valid)
            {
                return;
            }

            if (this._vertexCount + (element.vertexData.length / 2) > this.size)
            {
                this.flush();
            }

            this._vertexCount += element.vertexData.length / 2;
            this._indexCount += element.indices.length;
            this._bufferedTextures[this._bufferSize] = element._texture.baseTexture;
            this._bufferedElements[this._bufferSize++] = element;
        };

        AbstractBatchRenderer.prototype.buildTexturesAndDrawCalls = function buildTexturesAndDrawCalls ()
        {
            var ref = this;
            var textures = ref._bufferedTextures;
            var MAX_TEXTURES = ref.MAX_TEXTURES;
            var textureArrays = AbstractBatchRenderer._textureArrayPool;
            var batch = this.renderer.batch;
            var boundTextures = this._tempBoundTextures;
            var touch = this.renderer.textureGC.count;

            var TICK = ++BaseTexture._globalBatch;
            var countTexArrays = 0;
            var texArray = textureArrays[0];
            var start = 0;

            batch.copyBoundTextures(boundTextures, MAX_TEXTURES);

            for (var i = 0; i < this._bufferSize; ++i)
            {
                var tex = textures[i];

                textures[i] = null;
                if (tex._batchEnabled === TICK)
                {
                    continue;
                }

                if (texArray.count >= MAX_TEXTURES)
                {
                    batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
                    this.buildDrawCalls(texArray, start, i);
                    start = i;
                    texArray = textureArrays[++countTexArrays];
                    ++TICK;
                }

                tex._batchEnabled = TICK;
                tex.touched = touch;
                texArray.elements[texArray.count++] = tex;
            }

            if (texArray.count > 0)
            {
                batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
                this.buildDrawCalls(texArray, start, this._bufferSize);
                ++countTexArrays;
                ++TICK;
            }

            // Clean-up

            for (var i$1 = 0; i$1 < boundTextures.length; i$1++)
            {
                boundTextures[i$1] = null;
            }
            BaseTexture._globalBatch = TICK;
        };

        /**
         * Populating drawcalls for rendering
         *
         * @param {PIXI.BatchTextureArray} texArray
         * @param {number} start
         * @param {number} finish
         */
        AbstractBatchRenderer.prototype.buildDrawCalls = function buildDrawCalls (texArray, start, finish)
        {
            var ref = this;
            var elements = ref._bufferedElements;
            var _attributeBuffer = ref._attributeBuffer;
            var _indexBuffer = ref._indexBuffer;
            var vertexSize = ref.vertexSize;
            var drawCalls = AbstractBatchRenderer._drawCallPool;

            var dcIndex = this._dcIndex;
            var aIndex = this._aIndex;
            var iIndex = this._iIndex;

            var drawCall = drawCalls[dcIndex];

            drawCall.start = this._iIndex;
            drawCall.texArray = texArray;

            for (var i = start; i < finish; ++i)
            {
                var sprite = elements[i];
                var tex = sprite._texture.baseTexture;
                var spriteBlendMode = premultiplyBlendMode[
                    tex.alphaMode ? 1 : 0][sprite.blendMode];

                elements[i] = null;

                if (start < i && drawCall.blend !== spriteBlendMode)
                {
                    drawCall.size = iIndex - drawCall.start;
                    start = i;
                    drawCall = drawCalls[++dcIndex];
                    drawCall.texArray = texArray;
                    drawCall.start = iIndex;
                }

                this.packInterleavedGeometry(sprite, _attributeBuffer, _indexBuffer, aIndex, iIndex);
                aIndex += sprite.vertexData.length / 2 * vertexSize;
                iIndex += sprite.indices.length;

                drawCall.blend = spriteBlendMode;
            }

            if (start < finish)
            {
                drawCall.size = iIndex - drawCall.start;
                ++dcIndex;
            }

            this._dcIndex = dcIndex;
            this._aIndex = aIndex;
            this._iIndex = iIndex;
        };

        /**
         * Bind textures for current rendering
         *
         * @param {PIXI.BatchTextureArray} texArray
         */
        AbstractBatchRenderer.prototype.bindAndClearTexArray = function bindAndClearTexArray (texArray)
        {
            var textureSystem = this.renderer.texture;

            for (var j = 0; j < texArray.count; j++)
            {
                textureSystem.bind(texArray.elements[j], texArray.ids[j]);
                texArray.elements[j] = null;
            }
            texArray.count = 0;
        };

        AbstractBatchRenderer.prototype.updateGeometry = function updateGeometry ()
        {
            var ref = this;
            var packedGeometries = ref._packedGeometries;
            var attributeBuffer = ref._attributeBuffer;
            var indexBuffer = ref._indexBuffer;

            if (!settings.CAN_UPLOAD_SAME_BUFFER)
            { /* Usually on iOS devices, where the browser doesn't
                like uploads to the same buffer in a single frame. */
                if (this._packedGeometryPoolSize <= this._flushId)
                {
                    this._packedGeometryPoolSize++;
                    packedGeometries[this._flushId] = new (this.geometryClass)();
                }

                packedGeometries[this._flushId]._buffer.update(attributeBuffer.rawBinaryData);
                packedGeometries[this._flushId]._indexBuffer.update(indexBuffer);

                this.renderer.geometry.bind(packedGeometries[this._flushId]);
                this.renderer.geometry.updateBuffers();
                this._flushId++;
            }
            else
            {
                // lets use the faster option, always use buffer number 0
                packedGeometries[this._flushId]._buffer.update(attributeBuffer.rawBinaryData);
                packedGeometries[this._flushId]._indexBuffer.update(indexBuffer);

                this.renderer.geometry.updateBuffers();
            }
        };

        AbstractBatchRenderer.prototype.drawBatches = function drawBatches ()
        {
            var dcCount = this._dcIndex;
            var ref = this.renderer;
            var gl = ref.gl;
            var stateSystem = ref.state;
            var drawCalls = AbstractBatchRenderer._drawCallPool;

            var curTexArray = null;

            // Upload textures and do the draw calls
            for (var i = 0; i < dcCount; i++)
            {
                var ref$1 = drawCalls[i];
                var texArray = ref$1.texArray;
                var type = ref$1.type;
                var size = ref$1.size;
                var start = ref$1.start;
                var blend = ref$1.blend;

                if (curTexArray !== texArray)
                {
                    curTexArray = texArray;
                    this.bindAndClearTexArray(texArray);
                }

                this.state.blendMode = blend;
                stateSystem.set(this.state);
                gl.drawElements(type, size, gl.UNSIGNED_SHORT, start * 2);
            }
        };

        /**
         * Renders the content _now_ and empties the current batch.
         */
        AbstractBatchRenderer.prototype.flush = function flush ()
        {
            if (this._vertexCount === 0)
            {
                return;
            }

            this._attributeBuffer = this.getAttributeBuffer(this._vertexCount);
            this._indexBuffer = this.getIndexBuffer(this._indexCount);
            this._aIndex = 0;
            this._iIndex = 0;
            this._dcIndex = 0;

            this.buildTexturesAndDrawCalls();
            this.updateGeometry();
            this.drawBatches();

            // reset elements buffer for the next flush
            this._bufferSize = 0;
            this._vertexCount = 0;
            this._indexCount = 0;
        };

        /**
         * Starts a new sprite batch.
         */
        AbstractBatchRenderer.prototype.start = function start ()
        {
            this.renderer.state.set(this.state);

            this.renderer.shader.bind(this._shader);

            if (settings.CAN_UPLOAD_SAME_BUFFER)
            {
                // bind buffer #0, we don't need others
                this.renderer.geometry.bind(this._packedGeometries[this._flushId]);
            }
        };

        /**
         * Stops and flushes the current batch.
         */
        AbstractBatchRenderer.prototype.stop = function stop ()
        {
            this.flush();
        };

        /**
         * Destroys this `AbstractBatchRenderer`. It cannot be used again.
         */
        AbstractBatchRenderer.prototype.destroy = function destroy ()
        {
            for (var i = 0; i < this._packedGeometryPoolSize; i++)
            {
                if (this._packedGeometries[i])
                {
                    this._packedGeometries[i].destroy();
                }
            }

            this.renderer.off('prerender', this.onPrerender, this);

            this._aBuffers = null;
            this._iBuffers = null;
            this._packedGeometries = null;
            this._attributeBuffer = null;
            this._indexBuffer = null;

            if (this._shader)
            {
                this._shader.destroy();
                this._shader = null;
            }

            ObjectRenderer.prototype.destroy.call(this);
        };

        /**
         * Fetches an attribute buffer from `this._aBuffers` that
         * can hold atleast `size` floats.
         *
         * @param {number} size - minimum capacity required
         * @return {ViewableBuffer} - buffer than can hold atleast `size` floats
         * @private
         */
        AbstractBatchRenderer.prototype.getAttributeBuffer = function getAttributeBuffer (size)
        {
            // 8 vertices is enough for 2 quads
            var roundedP2 = nextPow2(Math.ceil(size / 8));
            var roundedSizeIndex = log2(roundedP2);
            var roundedSize = roundedP2 * 8;

            if (this._aBuffers.length <= roundedSizeIndex)
            {
                this._iBuffers.length = roundedSizeIndex + 1;
            }

            var buffer = this._aBuffers[roundedSize];

            if (!buffer)
            {
                this._aBuffers[roundedSize] = buffer = new ViewableBuffer(roundedSize * this.vertexSize * 4);
            }

            return buffer;
        };

        /**
         * Fetches an index buffer from `this._iBuffers` that can
         * has atleast `size` capacity.
         *
         * @param {number} size - minimum required capacity
         * @return {Uint16Array} - buffer that can fit `size`
         *    indices.
         * @private
         */
        AbstractBatchRenderer.prototype.getIndexBuffer = function getIndexBuffer (size)
        {
            // 12 indices is enough for 2 quads
            var roundedP2 = nextPow2(Math.ceil(size / 12));
            var roundedSizeIndex = log2(roundedP2);
            var roundedSize = roundedP2 * 12;

            if (this._iBuffers.length <= roundedSizeIndex)
            {
                this._iBuffers.length = roundedSizeIndex + 1;
            }

            var buffer = this._iBuffers[roundedSizeIndex];

            if (!buffer)
            {
                this._iBuffers[roundedSizeIndex] = buffer = new Uint16Array(roundedSize);
            }

            return buffer;
        };

        /**
         * Takes the four batching parameters of `element`, interleaves
         * and pushes them into the batching attribute/index buffers given.
         *
         * It uses these properties: `vertexData` `uvs`, `textureId` and
         * `indicies`. It also uses the "tint" of the base-texture, if
         * present.
         *
         * @param {PIXI.Sprite} element - element being rendered
         * @param {PIXI.ViewableBuffer} attributeBuffer - attribute buffer.
         * @param {Uint16Array} indexBuffer - index buffer
         * @param {number} aIndex - number of floats already in the attribute buffer
         * @param {number} iIndex - number of indices already in `indexBuffer`
         */
        AbstractBatchRenderer.prototype.packInterleavedGeometry = function packInterleavedGeometry (element, attributeBuffer, indexBuffer, aIndex, iIndex)
        {
            var uint32View = attributeBuffer.uint32View;
            var float32View = attributeBuffer.float32View;

            var packedVertices = aIndex / this.vertexSize;
            var uvs = element.uvs;
            var indicies = element.indices;
            var vertexData = element.vertexData;
            var textureId = element._texture.baseTexture._batchLocation;

            var alpha = Math.min(element.worldAlpha, 1.0);
            var argb = (alpha < 1.0
                && element._texture.baseTexture.alphaMode)
                ? premultiplyTint(element._tintRGB, alpha)
                : element._tintRGB + (alpha * 255 << 24);

            // lets not worry about tint! for now..
            for (var i = 0; i < vertexData.length; i += 2)
            {
                float32View[aIndex++] = vertexData[i];
                float32View[aIndex++] = vertexData[i + 1];
                float32View[aIndex++] = uvs[i];
                float32View[aIndex++] = uvs[i + 1];
                uint32View[aIndex++] = argb;
                float32View[aIndex++] = textureId;
            }

            for (var i$1 = 0; i$1 < indicies.length; i$1++)
            {
                indexBuffer[iIndex++] = packedVertices + indicies[i$1];
            }
        };

        return AbstractBatchRenderer;
    }(ObjectRenderer));

    /**
     * Pool of `BatchDrawCall` objects that `flush` used
     * to create "batches" of the objects being rendered.
     *
     * These are never re-allocated again.
     * Shared between all batch renderers because it can be only one "flush" working at the moment.
     *
     * @static
     * @member {PIXI.BatchDrawCall[]}
     */
    AbstractBatchRenderer._drawCallPool = [];

    /**
     * Pool of `BatchDrawCall` objects that `flush` used
     * to create "batches" of the objects being rendered.
     *
     * These are never re-allocated again.
     * Shared between all batch renderers because it can be only one "flush" working at the moment.
     *
     * @static
     * @member {PIXI.BatchTextureArray[]}
     */
    AbstractBatchRenderer._textureArrayPool = [];

    /**
     * Helper that generates batching multi-texture shader. Use it with your new BatchRenderer
     *
     * @class
     * @memberof PIXI
     */
    var BatchShaderGenerator = function BatchShaderGenerator(vertexSrc, fragTemplate)
    {
        /**
         * Reference to the vertex shader source.
         *
         * @member {string}
         */
        this.vertexSrc = vertexSrc;

        /**
         * Reference to the fragement shader template. Must contain "%count%" and "%forloop%".
         *
         * @member {string}
         */
        this.fragTemplate = fragTemplate;

        this.programCache = {};
        this.defaultGroupCache = {};

        if (fragTemplate.indexOf('%count%') < 0)
        {
            throw new Error('Fragment template must contain "%count%".');
        }

        if (fragTemplate.indexOf('%forloop%') < 0)
        {
            throw new Error('Fragment template must contain "%forloop%".');
        }
    };

    BatchShaderGenerator.prototype.generateShader = function generateShader (maxTextures)
    {
        if (!this.programCache[maxTextures])
        {
            var sampleValues = new Int32Array(maxTextures);

            for (var i = 0; i < maxTextures; i++)
            {
                sampleValues[i] = i;
            }

            this.defaultGroupCache[maxTextures] = UniformGroup.from({ uSamplers: sampleValues }, true);

            var fragmentSrc = this.fragTemplate;

            fragmentSrc = fragmentSrc.replace(/%count%/gi, ("" + maxTextures));
            fragmentSrc = fragmentSrc.replace(/%forloop%/gi, this.generateSampleSrc(maxTextures));

            this.programCache[maxTextures] = new Program(this.vertexSrc, fragmentSrc);
        }

        var uniforms = {
            tint: new Float32Array([1, 1, 1, 1]),
            translationMatrix: new Matrix(),
            default: this.defaultGroupCache[maxTextures],
        };

        return new Shader(this.programCache[maxTextures], uniforms);
    };

    BatchShaderGenerator.prototype.generateSampleSrc = function generateSampleSrc (maxTextures)
    {
        var src = '';

        src += '\n';
        src += '\n';

        for (var i = 0; i < maxTextures; i++)
        {
            if (i > 0)
            {
                src += '\nelse ';
            }

            if (i < maxTextures - 1)
            {
                src += "if(vTextureId < " + i + ".5)";
            }

            src += '\n{';
            src += "\n\tcolor = texture2D(uSamplers[" + i + "], vTextureCoord);";
            src += '\n}';
        }

        src += '\n';
        src += '\n';

        return src;
    };

    /**
     * Geometry used to batch standard PIXI content (e.g. Mesh, Sprite, Graphics objects).
     *
     * @class
     * @memberof PIXI
     */
    var BatchGeometry = /*@__PURE__*/(function (Geometry) {
        function BatchGeometry(_static)
        {
            if ( _static === void 0 ) _static = false;

            Geometry.call(this);

            /**
             * Buffer used for position, color, texture IDs
             *
             * @member {PIXI.Buffer}
             * @protected
             */
            this._buffer = new Buffer(null, _static, false);

            /**
             * Index buffer data
             *
             * @member {PIXI.Buffer}
             * @protected
             */
            this._indexBuffer = new Buffer(null, _static, true);

            this.addAttribute('aVertexPosition', this._buffer, 2, false, TYPES.FLOAT)
                .addAttribute('aTextureCoord', this._buffer, 2, false, TYPES.FLOAT)
                .addAttribute('aColor', this._buffer, 4, true, TYPES.UNSIGNED_BYTE)
                .addAttribute('aTextureId', this._buffer, 1, true, TYPES.FLOAT)
                .addIndex(this._indexBuffer);
        }

        if ( Geometry ) BatchGeometry.__proto__ = Geometry;
        BatchGeometry.prototype = Object.create( Geometry && Geometry.prototype );
        BatchGeometry.prototype.constructor = BatchGeometry;

        return BatchGeometry;
    }(Geometry));

    var defaultVertex$2 = "precision highp float;\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\nattribute float aTextureId;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform vec4 tint;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vTextureId = aTextureId;\n    vColor = aColor * tint;\n}\n";

    var defaultFragment$2 = "varying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\nuniform sampler2D uSamplers[%count%];\n\nvoid main(void){\n    vec4 color;\n    %forloop%\n    gl_FragColor = color * vColor;\n}\n";

    /**
     * @class
     * @memberof PIXI
     * @hideconstructor
     */
    var BatchPluginFactory = function BatchPluginFactory () {};

    var staticAccessors$1 = { defaultVertexSrc: { configurable: true },defaultFragmentTemplate: { configurable: true } };

    BatchPluginFactory.create = function create (options)
    {
        var ref = Object.assign({
            vertex: defaultVertex$2,
            fragment: defaultFragment$2,
            geometryClass: BatchGeometry,
            vertexSize: 6,
        }, options);
            var vertex = ref.vertex;
            var fragment = ref.fragment;
            var vertexSize = ref.vertexSize;
            var geometryClass = ref.geometryClass;

        return /*@__PURE__*/(function (AbstractBatchRenderer) {
                function BatchPlugin(renderer)
            {
                AbstractBatchRenderer.call(this, renderer);

                this.shaderGenerator = new BatchShaderGenerator(vertex, fragment);
                this.geometryClass = geometryClass;
                this.vertexSize = vertexSize;
            }

                if ( AbstractBatchRenderer ) BatchPlugin.__proto__ = AbstractBatchRenderer;
                BatchPlugin.prototype = Object.create( AbstractBatchRenderer && AbstractBatchRenderer.prototype );
                BatchPlugin.prototype.constructor = BatchPlugin;

                return BatchPlugin;
            }(AbstractBatchRenderer));
    };

    /**
     * The default vertex shader source
     *
     * @static
     * @type {string}
     * @constant
     */
    staticAccessors$1.defaultVertexSrc.get = function ()
    {
        return defaultVertex$2;
    };

    /**
     * The default fragment shader source
     *
     * @static
     * @type {string}
     * @constant
     */
    staticAccessors$1.defaultFragmentTemplate.get = function ()
    {
        return defaultFragment$2;
    };

    Object.defineProperties( BatchPluginFactory, staticAccessors$1 );

    // Setup the default BatchRenderer plugin, this is what
    // we'll actually export at the root level
    var BatchRenderer = BatchPluginFactory.create();

    /*!
     * @pixi/filter-kawase-blur - v3.1.0
     * Compiled Wed, 11 Mar 2020 20:38:18 UTC
     *
     * @pixi/filter-kawase-blur is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    var vertex = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

    var fragment = "\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec2 uOffset;\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n\n    // Sample top left pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y));\n\n    // Sample top right pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y));\n\n    // Sample bottom right pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y));\n\n    // Sample bottom left pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y));\n\n    // Average\n    color *= 0.25;\n\n    gl_FragColor = color;\n}";

    var fragmentClamp = "\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec2 uOffset;\nuniform vec4 filterClamp;\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n\n    // Sample top left pixel\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw));\n\n    // Sample top right pixel\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw));\n\n    // Sample bottom right pixel\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw));\n\n    // Sample bottom left pixel\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw));\n\n    // Average\n    color *= 0.25;\n\n    gl_FragColor = color;\n}\n";

    /**
     * A much faster blur than Gaussian blur, but more complicated to use.<br>
     * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/kawase-blur.png)
     *
     * @see https://software.intel.com/en-us/blogs/2014/07/15/an-investigation-of-fast-real-time-gpu-based-image-blur-algorithms
     * @class
     * @extends PIXI.Filter
     * @memberof PIXI.filters
     * @see {@link https://www.npmjs.com/package/@pixi/filter-kawase-blur|@pixi/filter-kawase-blur}
     * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
     * @param {number|number[]} [blur=4] - The blur of the filter. Should be greater than `0`. If
     *        value is an Array, setting kernels.
     * @param {number} [quality=3] - The quality of the filter. Should be an integer greater than `1`.
     * @param {boolean} [clamp=false] - Clamp edges, useful for removing dark edges
     *        from fullscreen filters or bleeding to the edge of filterArea.
     */
    var KawaseBlurFilter = /*@__PURE__*/(function (Filter) {
        function KawaseBlurFilter(blur, quality, clamp) {
            if ( blur === void 0 ) blur = 4;
            if ( quality === void 0 ) quality = 3;
            if ( clamp === void 0 ) clamp = false;

            Filter.call(this, vertex, clamp ? fragmentClamp : fragment);
            this.uniforms.uOffset = new Float32Array(2);

            this._pixelSize = new Point();
            this.pixelSize = 1;
            this._clamp = clamp;
            this._kernels = null;

            // if `blur` is array , as kernels
            if (Array.isArray(blur)) {
                this.kernels = blur;
            }
            else {
                this._blur = blur;
                this.quality = quality;
            }
        }

        if ( Filter ) KawaseBlurFilter.__proto__ = Filter;
        KawaseBlurFilter.prototype = Object.create( Filter && Filter.prototype );
        KawaseBlurFilter.prototype.constructor = KawaseBlurFilter;

        var prototypeAccessors = { kernels: { configurable: true },clamp: { configurable: true },pixelSize: { configurable: true },quality: { configurable: true },blur: { configurable: true } };

        /**
         * Overrides apply
         * @private
         */
        KawaseBlurFilter.prototype.apply = function apply (filterManager, input, output, clear) {
            var uvX = this.pixelSize.x / input._frame.width;
            var uvY = this.pixelSize.y / input._frame.height;
            var offset;

            if (this._quality === 1 || this._blur === 0) {
                offset = this._kernels[0] + 0.5;
                this.uniforms.uOffset[0] = offset * uvX;
                this.uniforms.uOffset[1] = offset * uvY;
                filterManager.applyFilter(this, input, output, clear);
            }
            else {
                var renderTarget = filterManager.getFilterTexture();

                var source = input;
                var target = renderTarget;
                var tmp;

                var last = this._quality - 1;

                for (var i = 0; i < last; i++) {
                    offset = this._kernels[i] + 0.5;
                    this.uniforms.uOffset[0] = offset * uvX;
                    this.uniforms.uOffset[1] = offset * uvY;
                    filterManager.applyFilter(this, source, target, 1);

                    tmp = source;
                    source = target;
                    target = tmp;
                }
                offset = this._kernels[last] + 0.5;
                this.uniforms.uOffset[0] = offset * uvX;
                this.uniforms.uOffset[1] = offset * uvY;
                filterManager.applyFilter(this, source, output, clear);

                filterManager.returnFilterTexture(renderTarget);
            }
        };

        /**
         * Auto generate kernels by blur & quality
         * @private
         */
        KawaseBlurFilter.prototype._generateKernels = function _generateKernels () {
            var blur = this._blur;
            var quality = this._quality;
            var kernels = [ blur ];

            if (blur > 0) {
                var k = blur;
                var step = blur / quality;

                for (var i = 1; i < quality; i++) {
                    k -= step;
                    kernels.push(k);
                }
            }

            this._kernels = kernels;
        };

        /**
         * The kernel size of the blur filter, for advanced usage.
         *
         * @member {number[]}
         * @default [0]
         */
        prototypeAccessors.kernels.get = function () {
            return this._kernels;
        };
        prototypeAccessors.kernels.set = function (value) {
            if (Array.isArray(value) && value.length > 0) {
                this._kernels = value;
                this._quality = value.length;
                this._blur = Math.max.apply(Math, value);
            }
            else {
                // if value is invalid , set default value
                this._kernels = [0];
                this._quality = 1;
            }
        };

        /**
         * Get the if the filter is clampped.
         *
         * @readonly
         * @member {boolean}
         * @default false
         */
        prototypeAccessors.clamp.get = function () {
            return this._clamp;
        };

        /**
         * Sets the pixel size of the filter. Large size is blurrier. For advanced usage.
         *
         * @member {PIXI.Point|number[]}
         * @default [1, 1]
         */
        prototypeAccessors.pixelSize.set = function (value) {
            if (typeof value === 'number') {
                this._pixelSize.x = value;
                this._pixelSize.y = value;
            }
            else if (Array.isArray(value)) {
                this._pixelSize.x = value[0];
                this._pixelSize.y = value[1];
            }
            else if (value instanceof Point) {
                this._pixelSize.x = value.x;
                this._pixelSize.y = value.y;
            }
            else {
                // if value is invalid , set default value
                this._pixelSize.x = 1;
                this._pixelSize.y = 1;
            }
        };
        prototypeAccessors.pixelSize.get = function () {
            return this._pixelSize;
        };

        /**
         * The quality of the filter, integer greater than `1`.
         *
         * @member {number}
         * @default 3
         */
        prototypeAccessors.quality.get = function () {
            return this._quality;
        };
        prototypeAccessors.quality.set = function (value) {
            this._quality = Math.max(1, Math.round(value));
            this._generateKernels();
        };

        /**
         * The amount of blur, value greater than `0`.
         *
         * @member {number}
         * @default 4
         */
        prototypeAccessors.blur.get = function () {
            return this._blur;
        };
        prototypeAccessors.blur.set = function (value) {
            this._blur = value;
            this._generateKernels();
        };

        Object.defineProperties( KawaseBlurFilter.prototype, prototypeAccessors );

        return KawaseBlurFilter;
    }(Filter));

    /*!
     * @pixi/filter-drop-shadow - v3.1.0
     * Compiled Wed, 11 Mar 2020 20:38:18 UTC
     *
     * @pixi/filter-drop-shadow is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    var vertex$1 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

    var fragment$1 = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float alpha;\nuniform vec3 color;\n\nuniform vec2 shift;\nuniform vec4 inputSize;\n\nvoid main(void){\n    vec4 sample = texture2D(uSampler, vTextureCoord - shift * inputSize.zw);\n\n    // Premultiply alpha\n    sample.rgb = color.rgb * sample.a;\n\n    // alpha user alpha\n    sample *= alpha;\n\n    gl_FragColor = sample;\n}";

    /**
     * Drop shadow filter.<br>
     * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/drop-shadow.png)
     * @class
     * @extends PIXI.Filter
     * @memberof PIXI.filters
     * @see {@link https://www.npmjs.com/package/@pixi/filter-drop-shadow|@pixi/filter-drop-shadow}
     * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
     * @param {object} [options] Filter options
     * @param {number} [options.rotation=45] The angle of the shadow in degrees.
     * @param {number} [options.distance=5] Distance of shadow
     * @param {number} [options.color=0x000000] Color of the shadow
     * @param {number} [options.alpha=0.5] Alpha of the shadow
     * @param {number} [options.shadowOnly=false] Whether render shadow only
     * @param {number} [options.blur=2] - Sets the strength of the Blur properties simultaneously
     * @param {number} [options.quality=3] - The quality of the Blur filter.
     * @param {number[]} [options.kernels=null] - The kernels of the Blur filter.
     * @param {number|number[]|PIXI.Point} [options.pixelSize=1] - the pixelSize of the Blur filter.
     * @param {number} [options.resolution=PIXI.settings.RESOLUTION] - The resolution of the Blur filter.
     */
    var DropShadowFilter = /*@__PURE__*/(function (Filter) {
        function DropShadowFilter(options) {

            // Fallback support for ctor: (rotation, distance, blur, color, alpha)
            if (options && options.constructor !== Object) {
                // eslint-disable-next-line no-console
                console.warn('DropShadowFilter now uses options instead of (rotation, distance, blur, color, alpha)');
                options = { rotation: options };
                if (arguments[1] !== undefined) {
                    options.distance = arguments[1];
                }
                if (arguments[2] !== undefined) {
                    options.blur = arguments[2];
                }
                if (arguments[3] !== undefined) {
                    options.color = arguments[3];
                }
                if (arguments[4] !== undefined) {
                    options.alpha = arguments[4];
                }
            }

            options = Object.assign({
                rotation: 45,
                distance: 5,
                color: 0x000000,
                alpha: 0.5,
                shadowOnly: false,
                kernels: null,
                blur: 2,
                quality: 3,
                pixelSize: 1,
                resolution: settings.RESOLUTION,
            }, options);

            Filter.call(this);

            var kernels = options.kernels;
            var blur = options.blur;
            var quality = options.quality;
            var pixelSize = options.pixelSize;
            var resolution = options.resolution;

            this._tintFilter = new Filter(vertex$1, fragment$1);
            this._tintFilter.uniforms.color = new Float32Array(4);
            this._tintFilter.uniforms.shift = new Point();
            this._tintFilter.resolution = resolution;
            this._blurFilter = kernels ?
                new KawaseBlurFilter(kernels) :
                new KawaseBlurFilter(blur, quality);

            this.pixelSize = pixelSize;
            this.resolution = resolution;

            var shadowOnly = options.shadowOnly;
            var rotation = options.rotation;
            var distance = options.distance;
            var alpha = options.alpha;
            var color = options.color;

            this.shadowOnly = shadowOnly;
            this.rotation = rotation;
            this.distance = distance;
            this.alpha = alpha;
            this.color = color;

            this._updatePadding();
        }

        if ( Filter ) DropShadowFilter.__proto__ = Filter;
        DropShadowFilter.prototype = Object.create( Filter && Filter.prototype );
        DropShadowFilter.prototype.constructor = DropShadowFilter;

        var prototypeAccessors = { resolution: { configurable: true },distance: { configurable: true },rotation: { configurable: true },alpha: { configurable: true },color: { configurable: true },kernels: { configurable: true },blur: { configurable: true },quality: { configurable: true },pixelSize: { configurable: true } };

        DropShadowFilter.prototype.apply = function apply (filterManager, input, output, clear) {
            var target = filterManager.getFilterTexture();

            this._tintFilter.apply(filterManager, input, target, 1);
            this._blurFilter.apply(filterManager, target, output, clear);

            if (this.shadowOnly !== true) {
                filterManager.applyFilter(this, input, output, 0);
            }

            filterManager.returnFilterTexture(target);
        };

        /**
         * Recalculate the proper padding amount.
         * @private
         */
        DropShadowFilter.prototype._updatePadding = function _updatePadding () {
            this.padding = this.distance + (this.blur * 2);
        };

        /**
         * Update the transform matrix of offset angle.
         * @private
         */
        DropShadowFilter.prototype._updateShift = function _updateShift () {
            this._tintFilter.uniforms.shift.set(
                this.distance * Math.cos(this.angle),
                this.distance * Math.sin(this.angle)
            );
        };

        /**
         * The resolution of the filter.
         *
         * @member {number}
         * @default PIXI.settings.RESOLUTION
         */
        prototypeAccessors.resolution.get = function () {
            return this._resolution;
        };
        prototypeAccessors.resolution.set = function (value) {
            this._resolution = value;

            if (this._tintFilter) {
                this._tintFilter.resolution = value;
            }
            if (this._blurFilter) {
                this._blurFilter.resolution = value;
            }
        };

        /**
         * Distance offset of the shadow
         * @member {number}
         * @default 5
         */
        prototypeAccessors.distance.get = function () {
            return this._distance;
        };
        prototypeAccessors.distance.set = function (value) {
            this._distance = value;
            this._updatePadding();
            this._updateShift();
        };

        /**
         * The angle of the shadow in degrees
         * @member {number}
         * @default 2
         */
        prototypeAccessors.rotation.get = function () {
            return this.angle / DEG_TO_RAD;
        };
        prototypeAccessors.rotation.set = function (value) {
            this.angle = value * DEG_TO_RAD;
            this._updateShift();
        };

        /**
         * The alpha of the shadow
         * @member {number}
         * @default 1
         */
        prototypeAccessors.alpha.get = function () {
            return this._tintFilter.uniforms.alpha;
        };
        prototypeAccessors.alpha.set = function (value) {
            this._tintFilter.uniforms.alpha = value;
        };

        /**
         * The color of the shadow.
         * @member {number}
         * @default 0x000000
         */
        prototypeAccessors.color.get = function () {
            return rgb2hex(this._tintFilter.uniforms.color);
        };
        prototypeAccessors.color.set = function (value) {
            hex2rgb(value, this._tintFilter.uniforms.color);
        };

        /**
         * Sets the kernels of the Blur Filter
         *
         * @member {number[]}
         */
        prototypeAccessors.kernels.get = function () {
            return this._blurFilter.kernels;
        };
        prototypeAccessors.kernels.set = function (value) {
            this._blurFilter.kernels = value;
        };

        /**
         * The blur of the shadow
         * @member {number}
         * @default 2
         */
        prototypeAccessors.blur.get = function () {
            return this._blurFilter.blur;
        };
        prototypeAccessors.blur.set = function (value) {
            this._blurFilter.blur = value;
            this._updatePadding();
        };

        /**
         * Sets the quality of the Blur Filter
         *
         * @member {number}
         * @default 4
         */
        prototypeAccessors.quality.get = function () {
            return this._blurFilter.quality;
        };
        prototypeAccessors.quality.set = function (value) {
            this._blurFilter.quality = value;
        };

        /**
         * Sets the pixelSize of the Kawase Blur filter
         *
         * @member {number|number[]|PIXI.Point}
         * @default 1
         */
        prototypeAccessors.pixelSize.get = function () {
            return this._blurFilter.pixelSize;
        };
        prototypeAccessors.pixelSize.set = function (value) {
            this._blurFilter.pixelSize = value;
        };

        Object.defineProperties( DropShadowFilter.prototype, prototypeAccessors );

        return DropShadowFilter;
    }(Filter));

    /**
     * An event manager handles the states related to certain events and can augment
     * widget interaction. For example, the click manager will hide clicks when
     * the object is dragging.
     *
     * Event managers are lifecycle objects - they can start/stop. Their constructor
     * will always accept one argument - the widget. Other settings can be applied before
     * `startEvent`.
     *
     * @memberof PUXI
     * @class
     * @abstract
     */
    var EventManager = /** @class */ (function () {
        /**
         * @param {Widget} target
         */
        function EventManager(target) {
            this.target = target;
            this.isEnabled = false; // use to track start/stopEvent
        }
        /**
         * @returns {Widget}
         */
        EventManager.prototype.getTarget = function () {
            return this.target;
        };
        return EventManager;
    }());

    /**
     * `ClickManager` handles hover and click events. It registers listeners
     * for `mousedown`, `mouseup`, `mousemove`, `mouseout`, `mouseover`, `touchstart`,
     * `touchend`, `touchendoutside`, `touchmove`, `rightup`, `rightdown`, `rightupoutside`
     * events.
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.EventManager
     */
    var ClickManager = /** @class */ (function (_super) {
        __extends(ClickManager, _super);
        /**
         * @param {PUXI.Widget | PUXI.Button} target
         * @param {boolean}[includeHover=false] - enable hover (`mouseover`, `mouseout`) listeners
         * @param {boolean}[rightMouseButton=false] - use right mouse clicks
         * @param {boolean}[doubleClick=false] - fire double clicks
         */
        function ClickManager(target, includeHover, rightMouseButton, doubleClick) {
            var _this = _super.call(this, target) || this;
            /**
             * @param {boolean}[includeHover]
             * @param {boolean}[rightMouseButton]
             * @param {boolean}[doubleClick]
             * @override
             */
            _this.startEvent = function (includeHover, rightMouseButton, doubleClick) {
                if (includeHover === void 0) { includeHover = _this._includeHover; }
                if (rightMouseButton === void 0) { rightMouseButton = _this._rightMouseButton; }
                if (doubleClick === void 0) { doubleClick = _this._doubleClick; }
                if (_this.isEnabled) {
                    return;
                }
                _this._includeHover = includeHover;
                _this.rightMouseButton = rightMouseButton;
                _this._doubleClick = doubleClick;
                var target = _this.target;
                target.insetContainer.on(_this.evMouseDown, _this.onMouseDownImpl);
                if (!_this._rightMouseButton) {
                    target.insetContainer.on('touchstart', _this.onMouseDownImpl);
                }
                if (_this._includeHover) {
                    target.insetContainer.on('mouseover', _this.onMouseOverImpl);
                    target.insetContainer.on('mouseout', _this.onMouseOutImpl);
                }
                _this.isEnabled = true;
            };
            /**
             * @override
             */
            _this.stopEvent = function () {
                if (!_this.isEnabled) {
                    return;
                }
                var target = _this.target;
                if (_this.bound) {
                    target.insetContainer.removeListener(_this.evMouseUp, _this.onMouseUpImpl);
                    target.insetContainer.removeListener(_this.evMouseUpOutside, _this.onMouseUpOutsideImpl);
                    if (!_this._rightMouseButton) {
                        target.insetContainer.removeListener('touchend', _this.onMouseUpImpl);
                        target.insetContainer.removeListener('touchendoutside', _this.onMouseUpOutsideImpl);
                    }
                    _this.bound = false;
                }
                target.insetContainer.removeListener(_this.evMouseDown, _this.onMouseDownImpl);
                if (!_this._rightMouseButton) {
                    target.insetContainer.removeListener('touchstart', _this.onMouseDownImpl);
                }
                if (_this._includeHover) {
                    target.insetContainer.removeListener('mouseover', _this.onMouseOverImpl);
                    target.insetContainer.removeListener('mouseout', _this.onMouseOutImpl);
                    target.insetContainer.removeListener('mousemove', _this.onMouseMoveImpl);
                    target.insetContainer.removeListener('touchmove', _this.onMouseMoveImpl);
                }
                _this.isEnabled = false;
            };
            _this.onMouseDownImpl = function (event) {
                var _a = _this, obj = _a.target, evMouseUp = _a.evMouseUp, _onMouseUp = _a.onMouseUpImpl, evMouseUpOutside = _a.evMouseUpOutside, _onMouseUpOutside = _a.onMouseUpOutsideImpl, right = _a._rightMouseButton;
                _this.mouse.copyFrom(event.data.global);
                _this.id = event.data.identifier;
                _this.onPress.call(_this.target, event, true);
                if (!_this.bound) {
                    obj.insetContainer.on(evMouseUp, _onMouseUp);
                    obj.insetContainer.on(evMouseUpOutside, _onMouseUpOutside);
                    if (!right) {
                        obj.insetContainer.on('touchend', _onMouseUp);
                        obj.insetContainer.on('touchendoutside', _onMouseUpOutside);
                    }
                    _this.bound = true;
                }
                if (_this._doubleClick) {
                    var now = performance.now();
                    if (now - _this.time < 210) {
                        _this.onClick.call(obj, event);
                    }
                    else {
                        _this.time = now;
                    }
                }
                event.data.originalEvent.preventDefault();
            };
            _this.onMouseUpCommonImpl = function (event) {
                var _a = _this, obj = _a.target, evMouseUp = _a.evMouseUp, _onMouseUp = _a.onMouseUpImpl, evMouseUpOutside = _a.evMouseUpOutside, _onMouseUpOutside = _a.onMouseUpOutsideImpl;
                if (event.data.identifier !== _this.id) {
                    return;
                }
                _this.offset.set(event.data.global.x - _this.mouse.x, event.data.global.y - _this.mouse.y);
                if (_this.bound) {
                    obj.insetContainer.removeListener(evMouseUp, _onMouseUp);
                    obj.insetContainer.removeListener(evMouseUpOutside, _onMouseUpOutside);
                    if (!_this._rightMouseButton) {
                        obj.insetContainer.removeListener('touchend', _onMouseUp);
                        obj.insetContainer.removeListener('touchendoutside', _onMouseUpOutside);
                    }
                    _this.bound = false;
                }
                _this.onPress.call(obj, event, false);
            };
            _this.onMouseUpImpl = function (event) {
                if (event.data.identifier !== _this.id) {
                    return;
                }
                _this.onMouseUpCommonImpl(event);
                // prevent clicks with scrolling/dragging objects
                if (_this.target.dragThreshold) {
                    _this.movementX = Math.abs(_this.offset.x);
                    _this.movementY = Math.abs(_this.offset.y);
                    if (Math.max(_this.movementX, _this.movementY) > _this.target.dragThreshold) {
                        return;
                    }
                }
                if (!_this._doubleClick) {
                    _this.onClick.call(_this.target, event);
                }
            };
            _this.onMouseUpOutsideImpl = function (event) {
                if (event.data.identifier !== _this.id) {
                    return;
                }
                _this.onMouseUpCommonImpl(event);
            };
            _this.onMouseOverImpl = function (event) {
                if (!_this.ishover) {
                    _this.ishover = true;
                    _this.target.insetContainer.on('mousemove', _this.onMouseMoveImpl);
                    _this.target.insetContainer.on('touchmove', _this.onMouseMoveImpl);
                    _this.onHover.call(_this.target, event, true);
                }
            };
            _this.onMouseOutImpl = function (event) {
                if (_this.ishover) {
                    _this.ishover = false;
                    _this.target.insetContainer.removeListener('mousemove', _this.onMouseMoveImpl);
                    _this.target.insetContainer.removeListener('touchmove', _this.onMouseMoveImpl);
                    _this.onHover.call(_this.target, event, false);
                }
            };
            _this.onMouseMoveImpl = function (event) {
                _this.onMove.call(_this.target, event);
            };
            _this.bound = false;
            _this.id = 0;
            _this.ishover = false;
            _this.mouse = new PIXI$1.Point();
            _this.offset = new PIXI$1.Point();
            _this.movementX = 0;
            _this.movementY = 0;
            _this._includeHover = typeof includeHover === 'undefined' ? true : includeHover;
            _this.rightMouseButton = typeof rightMouseButton === 'undefined' ? false : rightMouseButton;
            _this._doubleClick = typeof doubleClick === 'undefined' ? false : doubleClick;
            target.interactive = true;
            _this.time = 0;
            _this.startEvent();
            _this.onHover = function () { return null; };
            _this.onPress = function () { return null; };
            _this.onClick = function () { return null; };
            _this.onMove = function () { return null; };
            return _this;
        }
        Object.defineProperty(ClickManager.prototype, "rightMouseButton", {
            /**
             * Whether right mice are used for clicks rather than left mice.
             * @member boolean
             */
            get: function () {
                return this._rightMouseButton;
            },
            set: function (val) {
                this._rightMouseButton = val;
                this.evMouseDown = this._rightMouseButton ? 'rightdown' : 'mousedown';
                this.evMouseUp = this._rightMouseButton ? 'rightup' : 'mouseup';
                this.evMouseUpOutside = this._rightMouseButton ? 'rightupoutside' : 'mouseupoutside';
            },
            enumerable: true,
            configurable: true
        });
        return ClickManager;
    }(EventManager));

    /**
     * `DragManager` handles drag & drop events. It registers listeners for `mousedown`,
     * `touchstart` on the target and `mousemove`, `touchmove`, `mouseup`, `mouseupoutside`,
     * `touchend`, `touchendoutside` on the stage.
     *
     * By default, `draggable` widgets will internally handle drag-n-drop and reassigning
     * the callbacks on their `DragManager` will break their behaviour. You can prevent
     * this by using `eventBroker.dnd` directly without setting `widget.draggable` to
     * `true` (or using `widget.makeDraggable()`).
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.EventManager
     */
    var DragManager = /** @class */ (function (_super) {
        __extends(DragManager, _super);
        function DragManager(target) {
            var _this = _super.call(this, target) || this;
            _this.onDragStartImpl = function (e) {
                var target = _this.target;
                _this.id = e.data.identifier;
                _this.onPress(e, true);
                if (!_this.isBound) {
                    _this.dragStart.copyFrom(e.data.global);
                    target.stage.on('mousemove', _this.onDragMoveImpl);
                    target.stage.on('touchmove', _this.onDragMoveImpl);
                    target.stage.on('mouseup', _this.onDragEndImpl);
                    target.stage.on('mouseupoutside', _this.onDragEndImpl);
                    target.stage.on('touchend', _this.onDragEndImpl);
                    target.stage.on('touchendoutside', _this.onDragEndImpl);
                    target.stage.on('touchcancel', _this.onDragEndImpl);
                    _this.isBound = true;
                }
                e.data.originalEvent.preventDefault();
            };
            _this.onDragMoveImpl = function (e) {
                if (e.data.identifier !== _this.id) {
                    return;
                }
                var _a = _this, lastCursor = _a.lastCursor, dragOffset = _a.dragOffset, dragStart = _a.dragStart, target = _a.target;
                _this.lastCursor.copyFrom(e.data.global);
                _this.dragOffset.set(lastCursor.x - dragStart.x, lastCursor.y - dragStart.y);
                if (!_this.isDragging) {
                    _this.movementX = Math.abs(dragOffset.x);
                    _this.movementY = Math.abs(dragOffset.y);
                    if ((_this.movementX === 0 && _this.movementY === 0)
                        || Math.max(_this.movementX, _this.movementY) < target.dragThreshold) {
                        return; // threshold
                    }
                    if (target.dragRestrictAxis !== null) {
                        _this.cancel = false;
                        if (target.dragRestrictAxis === 'x' && _this.movementY > _this.movementX) {
                            _this.cancel = true;
                        }
                        else if (target.dragRestrictAxis === 'y' && _this.movementY <= _this.movementX) {
                            _this.cancel = true;
                        }
                        if (_this.cancel) {
                            _this.onDragEndImpl(e);
                            return;
                        }
                    }
                    _this.onDragStart(e);
                    _this.isDragging = true;
                }
                _this.onDragMove(e, dragOffset);
            };
            _this.onDragEndImpl = function (e) {
                if (e.data.identifier !== _this.id) {
                    return;
                }
                var target = _this.target;
                if (_this.isBound) {
                    target.stage.removeListener('mousemove', _this.onDragMoveImpl);
                    target.stage.removeListener('touchmove', _this.onDragMoveImpl);
                    target.stage.removeListener('mouseup', _this.onDragEndImpl);
                    target.stage.removeListener('mouseupoutside', _this.onDragEndImpl);
                    target.stage.removeListener('touchend', _this.onDragEndImpl);
                    target.stage.removeListener('touchendoutside', _this.onDragEndImpl);
                    target.stage.removeListener('touchcancel', _this.onDragEndImpl);
                    _this.isDragging = false;
                    _this.isBound = false;
                    _this.onDragEnd(e);
                    _this.onPress(e, false);
                }
            };
            _this.isBound = false;
            _this.isDragging = false;
            _this.id = 0;
            _this.dragStart = new PIXI$1.Point();
            _this.dragOffset = new PIXI$1.Point();
            _this.lastCursor = new PIXI$1.Point();
            _this.movementX = 0;
            _this.movementY = 0;
            _this.cancel = false;
            _this.target.interactive = true;
            _this.onPress = function () { return null; };
            _this.onDragStart = function () { return null; };
            _this.onDragMove = function () { return null; };
            _this.onDragEnd = function () { return null; };
            _this.startEvent();
            return _this;
        }
        DragManager.prototype.startEvent = function () {
            if (this.isEnabled) {
                return;
            }
            var target = this.target;
            target.insetContainer.on('mousedown', this.onDragStartImpl);
            target.insetContainer.on('touchstart', this.onDragStartImpl);
            this.isEnabled = true;
        };
        DragManager.prototype.stopEvent = function () {
            if (!this.isEnabled) {
                return;
            }
            var target = this.target;
            if (this.isBound) {
                target.stage.removeListener('mousemove', this.onDragMoveImpl);
                target.stage.removeListener('touchmove', this.onDragMoveImpl);
                target.stage.removeListener('mouseup', this.onDragEndImpl);
                target.stage.removeListener('mouseupoutside', this.onDragEndImpl);
                target.stage.removeListener('touchend', this.onDragEndImpl);
                target.stage.removeListener('touchendoutside', this.onDragEndImpl);
                this.isBound = false;
            }
            target.insetContainer.removeListener('mousedown', this.onDragStartImpl);
            target.insetContainer.removeListener('touchstart', this.onDragStartImpl);
            this.isEnabled = false;
        };
        return DragManager;
    }(EventManager));

    /**
     * The event brokers allows you to access event managers without manually assigning
     * them to a widget. By default, the click (`PUXI.ClickManager`), dnd (`PUXI.DragManager`)
     * are defined. You can add event managers for all (new) widgets by adding an entry to
     * `EventBroker.MANAGER_MAP`.
     *
     * @memberof PUXI
     * @class
     */
    var EventBroker = /** @class */ (function () {
        function EventBroker(target) {
            this.target = target;
            var _loop_1 = function (mgr) {
                Object.defineProperty(this_1, mgr, {
                    get: function () {
                        if (!this["_" + mgr]) {
                            this["_" + mgr] = new EventBroker.MANAGER_MAP[mgr](this.target);
                        }
                        return this["_" + mgr];
                    },
                });
            };
            var this_1 = this;
            for (var _i = 0, _a = Object.keys(EventBroker.MANAGER_MAP); _i < _a.length; _i++) {
                var mgr = _a[_i];
                _loop_1(mgr);
            }
        }
        EventBroker.MANAGER_MAP = {
            click: ClickManager,
            dnd: DragManager,
        };
        return EventBroker;
    }());

    /**
     * A widget is a user interface control that renders content inside its prescribed
     * rectangle on the screen.
     *
     * @namespace PUXI
     * @class
     * @extends PIXI.utils.EventEmitter
     * @implements PUXI.IMeasurable
     */
    var Widget = /** @class */ (function (_super) {
        __extends(Widget, _super);
        function Widget() {
            var _this = _super.call(this) || this;
            _this.insetContainer = new PIXI$1.Container();
            _this.contentContainer = _this.insetContainer.addChild(new PIXI$1.Container());
            _this.widgetChildren = [];
            _this.stage = null;
            _this.layoutMeasure = new Insets();
            _this.initialized = false;
            _this.dragInitialized = false;
            _this.dropInitialized = false;
            _this.dirty = true;
            _this._oldWidth = -1;
            _this._oldHeight = -1;
            _this.pixelPerfect = true;
            _this._paddingLeft = 0;
            _this._paddingTop = 0;
            _this._paddingRight = 0;
            _this._paddingBottom = 0;
            _this._elevation = 0;
            _this.tint = 0;
            _this.blendMode = PIXI$1.BLEND_MODES.NORMAL;
            _this.draggable = false;
            _this.droppable = false;
            return _this;
        }
        Object.defineProperty(Widget.prototype, "measuredWidth", {
            get: function () {
                return this._measuredWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Widget.prototype, "measuredHeight", {
            get: function () {
                return this._measuredHeight;
            },
            enumerable: true,
            configurable: true
        });
        Widget.prototype.getMeasuredWidth = function () {
            return this._measuredWidth;
        };
        Widget.prototype.getMeasuredHeight = function () {
            return this._measuredHeight;
        };
        Widget.prototype.onMeasure = function (width, height, widthMode, heightMode) {
            var naturalWidth = this.contentContainer.width + this.paddingHorizontal;
            var naturalHeight = this.contentContainer.height + this.paddingVertical;
            switch (widthMode) {
                case exports.MeasureMode.EXACTLY:
                    this._measuredWidth = width;
                    break;
                case exports.MeasureMode.UNBOUNDED:
                    this._measuredWidth = naturalWidth;
                    break;
                case exports.MeasureMode.AT_MOST:
                    this._measuredWidth = Math.min(width, naturalWidth);
                    break;
            }
            switch (heightMode) {
                case exports.MeasureMode.EXACTLY:
                    this._measuredHeight = height;
                    break;
                case exports.MeasureMode.UNBOUNDED:
                    this._measuredHeight = naturalHeight;
                    break;
                case exports.MeasureMode.AT_MOST:
                    this._measuredHeight = Math.min(height, naturalHeight);
                    break;
            }
        };
        Widget.prototype.measure = function (width, height, widthMode, heightMode) {
            this.onMeasure(width, height, widthMode, heightMode);
        };
        /**
         * This method should set the frame in which rendering will occur and lay out
         * child widgets in that frame.
         *
         * @param l
         * @param t
         * @param r
         * @param b
         * @param dirty
         * @protected
         */
        Widget.prototype.layout = function (l, t, r, b, dirty) {
            if (t === void 0) { t = l; }
            if (r === void 0) { r = l; }
            if (b === void 0) { b = t; }
            this.layoutMeasure.left = l;
            this.layoutMeasure.top = t;
            this.layoutMeasure.right = r;
            this.layoutMeasure.bottom = b;
            this._width = r - l;
            this._height = b - t;
            if (this.background) {
                this.background.x = 0;
                this.background.y = 0;
                this.background.width = r - l;
                this.background.height = b - t;
            }
            // Update parallel PIXI node too!
            this.insetContainer.x = l;
            this.insetContainer.y = t;
            this.contentContainer.x = this._paddingLeft;
            this.contentContainer.y = this._paddingTop;
            // this.container.width = r - l;
            // this.container.height = b - t;
        };
        Widget.prototype.setLayoutOptions = function (lopt) {
            this.layoutOptions = lopt;
            return this;
        };
        Object.defineProperty(Widget.prototype, "eventBroker", {
            /**
             * The event broker for this widget that holds all the event managers. This can
             * be used to start/stop clicks, drags, scrolls and configure how those events
             * are handled/interpreted.
             * @member PUXI.EventBroker
             */
            get: function () {
                if (!this._eventBroker) {
                    this._eventBroker = new EventBroker(this);
                }
                return this._eventBroker;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Widget.prototype, "paddingLeft", {
            get: function () {
                return this._paddingLeft;
            },
            set: function (val) {
                this._paddingLeft = val;
                this.dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Widget.prototype, "paddingTop", {
            get: function () {
                return this._paddingTop;
            },
            set: function (val) {
                this._paddingTop = val;
                this.dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Widget.prototype, "paddingRight", {
            get: function () {
                return this._paddingRight;
            },
            set: function (val) {
                this._paddingRight = val;
                this.dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Widget.prototype, "paddingBottom", {
            get: function () {
                return this._paddingBottom;
            },
            set: function (val) {
                this._paddingBottom = val;
                this.dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Widget.prototype, "paddingHorizontal", {
            /**
             * Sum of left & right padding.
             * @member {number}
             */
            get: function () {
                return this._paddingLeft + this._paddingRight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Widget.prototype, "paddingVertical", {
            /**
             * Sum of top & bottom padding.
             * @member {number}
             */
            get: function () {
                return this._paddingTop + this._paddingBottom;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Widget.prototype, "interactive", {
            /**
             * Whether this widget is interactive in the PixiJS scene graph.
             * @member {boolean}
             */
            get: function () {
                return this.insetContainer.interactive;
            },
            set: function (val) {
                this.insetContainer.interactive = true;
                this.contentContainer.interactive = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Widget.prototype, "width", {
            /**
             * Layout width of this widget.
             * @member {number}
             */
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Widget.prototype, "height", {
            /**
             * Layout height of this widget.
             * @member {number}
             */
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Widget.prototype, "alpha", {
            /**
             * Alpha of this widget & its contents.
             * @member {number}
             */
            get: function () {
                return this.insetContainer.alpha;
            },
            set: function (val) {
                this.insetContainer.alpha = val;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Sets the padding values.
         *
         * To set all paddings to one value:
         * ```
         * widget.setPadding(8);
         * ```
         *
         * To set horizontal & vertical padding separately:
         * ```
         * widget.setPadding(4, 12);
         * ```
         *
         * @param {number}[l=0] - left padding
         * @param {number}[t=l] - top padding (default is equal to left padding)
         * @param {number}[r=l] - right padding (default is equal to right padding)
         * @param {number}[b=t] - bottom padding (default is equal to top padding)
         */
        Widget.prototype.setPadding = function (l, t, r, b) {
            if (t === void 0) { t = l; }
            if (r === void 0) { r = l; }
            if (b === void 0) { b = t; }
            this._paddingLeft = l;
            this._paddingTop = t;
            this._paddingRight = r;
            this._paddingBottom = b;
            this.dirty = true;
            return this;
        };
        /**
         * @returns {PIXI.Container} - the background display-object
         */
        Widget.prototype.getBackground = function () {
            return this.background;
        };
        /**
         * The background of a widget is a `PIXI.DisplayObject` that is rendered before
         * all of its children.
         *
         * @param {PIXI.Container | number | string} bg - the background display-object or
         *     a color that will be used to generate a `PIXI.Graphics` as the background.
         */
        Widget.prototype.setBackground = function (bg) {
            if (!this.background) {
                this.insetContainer.removeChild(this.background);
            }
            if (typeof bg === 'string') {
                bg = PIXI$1.utils.string2hex(bg);
            }
            if (typeof bg === 'number') {
                bg = new PIXI$1.Graphics()
                    .beginFill(bg)
                    .drawRect(0, 0, 1, 1)
                    .endFill();
            }
            this.background = bg;
            if (bg) {
                this.insetContainer.addChildAt(bg, 0);
            }
            return this;
        };
        /**
         * @returns {number} the alpha on the background display-object.
         */
        Widget.prototype.getBackgroundAlpha = function () {
            return this.background ? this.background.alpha : 1;
        };
        /**
         * This can be used to set the alpha on the _background_ of this widget. This
         * does not affect the widget's contents nor individual components of the
         * background display-object.
         *
         * @param {number} val - background alpha
         */
        Widget.prototype.setBackgroundAlpha = function (val) {
            if (!this.background) {
                this.setBackground(0xffffff);
            }
            this.background.alpha = val;
            return this;
        };
        /**
         * @return {number} the elevation set on this widget
         */
        Widget.prototype.getElevation = function () {
            return this._elevation;
        };
        /**
         * This can be used add a drop-shadow that will appear to raise this widget by
         * the given elevation against its parent.
         *
         * @param {number} val - elevation to use. 2px is good for most widgets.
         */
        Widget.prototype.setElevation = function (val) {
            this._elevation = val;
            if (val === 0 && this._dropShadow) {
                var i = this.insetContainer.filters.indexOf(this._dropShadow);
                if (i > 0) {
                    this.insetContainer.filters.splice(i, 1);
                }
            }
            else if (val > 0) {
                if (!this._dropShadow) {
                    if (!this.insetContainer.filters) {
                        this.insetContainer.filters = [];
                    }
                    this._dropShadow = new DropShadowFilter({ distance: val });
                    this.insetContainer.filters.push(this._dropShadow);
                }
                this._dropShadow.distance = val;
            }
            return this;
        };
        Widget.prototype.addChild = function (UIObject) {
            var argumentsLength = arguments.length;
            if (argumentsLength > 1) {
                for (var i = 0; i < argumentsLength; i++) {
                    this.addChild(arguments[i]);
                }
            }
            else {
                if (UIObject.parent) {
                    UIObject.parent.removeChild(UIObject);
                }
                UIObject.parent = this;
                this.contentContainer.addChild(UIObject.insetContainer);
                this.widgetChildren.push(UIObject);
            }
            return this;
        };
        Widget.prototype.removeChild = function (UIObject) {
            var argumentLenght = arguments.length;
            if (argumentLenght > 1) {
                for (var i = 0; i < argumentLenght; i++) {
                    this.removeChild(arguments[i]);
                }
            }
            else {
                var index = this.widgetChildren.indexOf(UIObject);
                if (index !== -1) {
                    var oldUIParent = UIObject.parent;
                    var oldParent = UIObject.container.parent;
                    UIObject.insetContainer.parent.removeChild(UIObject.insetContainer);
                    this.widgetChildren.splice(index, 1);
                    UIObject.parent = null;
                    // oldParent._recursivePostUpdateTransform();
                }
            }
        };
        /**
         * Makes this widget `draggable`.
         */
        Widget.prototype.makeDraggable = function () {
            this.draggable = true;
            if (this.initialized) {
                this.initDraggable();
            }
            return this;
        };
        /**
         * Makes this widget not `draggable`.
         */
        Widget.prototype.clearDraggable = function () {
            if (this.dragInitialized) {
                this.dragInitialized = false;
                this.eventBroker.dnd.stopEvent();
            }
        };
        /**
         * Widget initialization related to the stage. This method should always call
         * `super.initialize()`.
         *
         * This method expects `stage` to be set before calling it. This is handled
         * by the `Stage` itself.
         *
         * This will set `initialized` to true. If it was already set to true, it _should
         * do nothing_.
         *
         * @protected
         */
        Widget.prototype.initialize = function () {
            if (this.initialized) {
                return;
            }
            if (this.draggable) {
                this.initDraggable();
            }
            if (this.droppable) {
                this.initDroppable();
            }
            this.initialized = true;
        };
        Widget.prototype.initDraggable = function () {
            var _this = this;
            if (this.dragInitialized) {
                return;
            }
            this.dragInitialized = true;
            var realPosition = new PIXI$1.Point();
            var dragPosition = new PIXI$1.Point();
            var dnd = this.eventBroker.dnd;
            var insetContainer = this.insetContainer;
            dnd.onDragStart = function (e) {
                var added = DragDropController.add(_this, e);
                if (!_this.isDragging && added) {
                    _this.isDragging = true;
                    insetContainer.interactive = false;
                    realPosition.copyFrom(insetContainer.position);
                    _this.emit('draggablestart', e);
                }
            };
            dnd.onDragMove = function (e, offset) {
                if (_this.isDragging) {
                    dragPosition.set(realPosition.x + offset.x, realPosition.y + offset.y);
                    insetContainer.x = dragPosition.x;
                    insetContainer.y = dragPosition.y;
                    _this.emit('draggablemove', e);
                }
            };
            dnd.onDragEnd = function (e) {
                if (_this.isDragging) {
                    _this.isDragging = false;
                    DragDropController.getItem(_this);
                    // Return to container after 0ms if not picked up by a droppable
                    setTimeout(function () {
                        _this.insetContainer.interactive = true;
                        _this.insetContainer.position.copyFrom(realPosition);
                        _this.emit('draggableend', e);
                    }, 0);
                }
            };
        };
        /**
         * Makes this widget `droppable`.
         */
        Widget.prototype.makeDroppable = function () {
            this.droppable = true;
            if (this.initialized) {
                this.initDroppable();
            }
            return this;
        };
        /**
         * Makes this widget not `droppable`.
         */
        Widget.prototype.clearDroppable = function () {
            if (this.dropInitialized) {
                this.dropInitialized = false;
                this.contentContainer.removeListener('mouseup', this.onDrop);
                this.contentContainer.removeListener('touchend', this.onDrop);
            }
        };
        Widget.prototype.initDroppable = function () {
            var _this = this;
            if (!this.dropInitialized) {
                this.dropInitialized = true;
                var container = this.contentContainer;
                this.contentContainer.interactive = true;
                this.onDrop = function (event) {
                    var item = DragDropController.getEventItem(event, _this.dropGroup);
                    if (item && item.isDragging) {
                        item.isDragging = false;
                        item.insetContainer.interactive = true;
                        var parent = _this.droppableReparent !== null ? _this.droppableReparent : self;
                        parent.container.toLocal(item.container.position, item.container.parent, item);
                        if (parent.container != item.container.parent) {
                            parent.addChild(item);
                        }
                    }
                };
                container.on('mouseup', this.onDrop);
                container.on('touchend', this.onDrop);
            }
        };
        return Widget;
    }(PIXI$1.utils.EventEmitter));

    var _currentItem;
    var tabGroups = {};
    var checkGroups = {};
    var checkGroupValues = {};
    /**
     * Handles focus-management in the scene graph.
     */
    var InputController = {
        registrer: function (item, tabIndex, tabGroup) {
            var groupName = tabGroup || 'default';
            var items = tabGroups[groupName];
            if (!items) {
                items = tabGroups[groupName] = [];
            }
            var i = items.indexOf(item);
            if (i === -1) {
                item._tabIndex = tabIndex !== undefined ? tabIndex : -1;
                item._tabGroup = items;
                items.push(item);
                items.sort(function sorter(a, b) {
                    if (a._tabIndex < b._tabIndex) {
                        return -1;
                    }
                    if (a._tabIndex > b._tabIndex) {
                        return 1;
                    }
                    return 0;
                });
            }
        },
        set: function (item) {
            this.blur();
            _currentItem = item;
        },
        clear: function () {
            _currentItem = undefined;
        },
        blur: function () {
            if (_currentItem && typeof _currentItem.blur === 'function') {
                _currentItem.blur();
            }
        },
        fireTab: function () {
            if (_currentItem) {
                var i = _currentItem._tabGroup.indexOf(_currentItem) + 1;
                if (i >= _currentItem._tabGroup.length)
                    i = 0;
                _currentItem._tabGroup[i].focus();
            }
        },
        fireNext: function () {
            if (_currentItem) {
                var i = _currentItem._tabGroup.indexOf(_currentItem) + 1;
                if (i >= _currentItem._tabGroup.length)
                    i = _currentItem._tabGroup.length - 1;
                _currentItem._tabGroup[i].focus();
            }
        },
        firePrev: function () {
            if (_currentItem) {
                var i = _currentItem._tabGroup.indexOf(_currentItem) - 1;
                if (i < 0)
                    i = 0;
                _currentItem._tabGroup[i].focus();
            }
        },
        registrerCheckGroup: function (cb) {
            var name = cb.checkGroup;
            var group = checkGroups[name];
            if (!group)
                group = checkGroups[name] = {};
            group[cb.value] = cb;
            if (cb.checked) {
                checkGroupValues[name] = cb.value;
            }
        },
        updateCheckGroupSelected: function (cb) {
            var group = checkGroups[cb.checkGroup];
            for (var val in group) {
                var b = group[val];
                if (b !== cb) {
                    b.checked = false;
                }
            }
            checkGroupValues[cb.checkGroup] = cb.value;
        },
        getCheckGroupSelectedValue: function (name) {
            if (checkGroupValues[name]) {
                return checkGroupValues[name];
            }
            return '';
        },
        setCheckGroupSelectedValue: function (name, val) {
            var group = checkGroups[name];
            if (group) {
                var cb = group[val];
                if (cb) {
                    cb.checked = true;
                }
            }
        },
    };

    /**
     * Alignments supported by layout managers in PuxiJS core.
     *
     * @namespace PUXI
     * @enum
     */
    (function (ALIGN) {
        ALIGN[ALIGN["LEFT"] = 0] = "LEFT";
        ALIGN[ALIGN["TOP"] = 0] = "TOP";
        ALIGN[ALIGN["MIDDLE"] = 4081] = "MIDDLE";
        ALIGN[ALIGN["CENTER"] = 4081] = "CENTER";
        ALIGN[ALIGN["RIGHT"] = 1048561] = "RIGHT";
        ALIGN[ALIGN["BOTTOM"] = 1048561] = "BOTTOM";
        ALIGN[ALIGN["NONE"] = 4294967295] = "NONE";
    })(exports.ALIGN || (exports.ALIGN = {}));

    /**
     * This are the base constraints that you can apply on a `PUXI.Widget` under any
     * layout manager. It specifies the dimensions of a widget, while the position
     * of the widget is left to the parent to decide. If a dimension (width or height)
     * is set to a value between -1 and 1, then it is interpreted as a percentage
     * of the parent's dimension.
     *
     * The following example will render a widget at 50% of the parent's width and 10px height:
     *
     * ```js
     * const widget = new PUXI.Widget();
     * const parent = new PUXI.Widget();
     *
     * widget.layoutOptions = new PUXI.LayoutOptions(
     *      .5,
     *      10
     * );
     * parent.addChild(widget);
     * ```
     *
     * @namespace PUXI
     * @class
     */
    var LayoutOptions = /** @class */ (function () {
        /**
         * @param {number}[width = LayoutOptions.WRAP_CONTENT]
         * @param {number}[height = LayoutOptions.WRAP_CONTENT]
         */
        function LayoutOptions(width, height) {
            if (width === void 0) { width = LayoutOptions.WRAP_CONTENT; }
            if (height === void 0) { height = LayoutOptions.WRAP_CONTENT; }
            /**
             * Preferred width of the widget in pixels. If its value is between -1 and 1, it
             * is interpreted as a percentage of the parent's width.
             * @member {number}
             * @default {PUXI.LayoutOptions.WRAP_CONTENT}
             */
            this.width = width;
            /**
             * Preferred height of the widget in pixels. If its value is between -1 and 1, it
             * is interpreted as a percentage of the parent's height.
             * @member {number}
             * @default {PUXI.LayoutOptions.WRAP_CONTENT}
             */
            this.height = height;
            this.markers = {};
        }
        Object.defineProperty(LayoutOptions.prototype, "marginLeft", {
            /**
             * The left margin in pixels of the widget.
             * @member {number}
             * @default 0
             */
            get: function () {
                return this._marginLeft || 0;
            },
            set: function (val) {
                this._marginLeft = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LayoutOptions.prototype, "marginTop", {
            /**
             * This top margin in pixels of the widget.
             * @member {number}
             * @default 0
             */
            get: function () {
                return this._marginTop || 0;
            },
            set: function (val) {
                this._marginTop = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LayoutOptions.prototype, "marginRight", {
            /**
             * The right margin in pixels of the widget.
             * @member {number}
             * @default 0
             */
            get: function () {
                return this._marginRight || 0;
            },
            set: function (val) {
                this._marginRight = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LayoutOptions.prototype, "marginBottom", {
            /**
             * The bottom margin in pixels of the widget.
             * @member {number}
             * @default 0
             */
            get: function () {
                return this._marginBottom || 0;
            },
            set: function (val) {
                this._marginBottom = val;
            },
            enumerable: true,
            configurable: true
        });
        LayoutOptions.prototype.setMargin = function (left, top, right, bottom) {
            this._marginLeft = left;
            this._marginTop = top;
            this._marginRight = right;
            this._marginBottom = bottom;
        };
        LayoutOptions.FILL_PARENT = 0xfffffff1;
        LayoutOptions.WRAP_CONTENT = 0xfffffff2;
        LayoutOptions.MAX_DIMEN = 0xfffffff0;
        LayoutOptions.DEFAULT = new LayoutOptions();
        return LayoutOptions;
    }());

    /**
     * Anchored layout-options specify the left, top, right, and bottom offsets of a
     * widget in pixels. If an offset is between -1px and 1px, then it is interpreted
     * as a percentage of the parent's dimensions.
     *
     * The following example will render a widget at 80% of the parent's width and
     * 60px height.
     * ```js
     * const widget: PUXI.Widget = new Widget();
     * const anchorPane: PUXI.Widget = new Widget();
     *
     * widget.layoutOptions = new PUXI.AnchoredLayoutOptions(
     *      .10,
     *      .90,
     *      20,
     *      80
     * );
     *
     * // Prevent child from requesting natural bounds.
     * widget.layoutOptions.width = 0;
     * widget.layoutOptions.height = 0;
     * ```
     *
     * ### Intra-anchor region constraints
     *
     * If the offsets given provide a region larger than the widget's dimensions, then
     * the widget will be aligned accordingly. However, if the width or height of the
     * child is set to 0, then that child will be scaled to fit in the entire region
     * in that dimension.
     *
     * @extends PUXI.LayoutOptions
     * @class
     */
    var AnchorLayoutOptions = /** @class */ (function (_super) {
        __extends(AnchorLayoutOptions, _super);
        function AnchorLayoutOptions(anchorLeft, anchorTop, anchorRight, anchorBottom, horizontalAlign, verticalAlign) {
            if (horizontalAlign === void 0) { horizontalAlign = exports.ALIGN.NONE; }
            if (verticalAlign === void 0) { verticalAlign = exports.ALIGN.NONE; }
            var _this = _super.call(this, LayoutOptions.WRAP_CONTENT, LayoutOptions.WRAP_CONTENT) || this;
            _this.anchorLeft = anchorLeft;
            _this.anchorTop = anchorTop;
            _this.anchorBottom = anchorBottom;
            _this.anchorRight = anchorRight;
            _this.horizontalAlign = horizontalAlign;
            _this.verticalAlign = verticalAlign;
            return _this;
        }
        return AnchorLayoutOptions;
    }(LayoutOptions));

    /**
     * `PUXI.FastLayoutOptions` is an extension to `PUXI.LayoutOptions` that also
     * defines the x & y coordinates. It is accepted by the stage and `PUXI.FastLayout`.
     *
     * If x or y is between -1 and 1, then that dimension will be interpreted as a
     * percentage of the parent's width or height.
     *
     * @namespace PUXI
     * @extends PUXI.LayoutOptions
     * @class
     */
    var FastLayoutOptions = /** @class */ (function (_super) {
        __extends(FastLayoutOptions, _super);
        function FastLayoutOptions(width, height, x, y, anchor) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            var _this = _super.call(this, width, height) || this;
            /**
             * X-coordinate of the widget in its parent's reference frame. If it is
             * absolutely less than 1, then it will be interpreted as a percent of
             * the parent's width.
             * @member {number}
             */
            _this.x = x;
            /**
             * Y-coordinate of the widget in its parent's reference frame. If it is
             * absolutely less than 1, then it will be interpreted as a percent of
             * the parent's height.
             * @member {number}
             */
            _this.y = y;
            /**
             * The anchor is a normalized point telling where the (x,y) position of the
             * widget lies inside of it. By default, it is (0, 0), which means that the
             * top-left corner of the widget will be at (x,y); however, setting it to
             * (.5,.5) will make the _center of the widget_ be at (x,y) in the parent's
             * reference frame.
             * @member {PIXI.Point}
             * @default PUXI.FastLayoutOptions.DEFAULT_ANCHOR
             */
            _this.anchor = anchor || FastLayoutOptions.DEFAULT_ANCHOR.clone();
            return _this;
        }
        FastLayoutOptions.DEFAULT_ANCHOR = new PIXI$1.Point(0, 0);
        FastLayoutOptions.CENTER_ANCHOR = new PIXI$1.Point(0.5, 0.5); // fragile, shouldn't be modified
        return FastLayoutOptions;
    }(LayoutOptions));

    /**
     * `PUXI.FastLayout` is used in conjunction with `PUXI.FastLayoutOptions`. It is the
     * default layout for most widget groups.
     *
     * @namespace PUXI
     * @extends PUXI.ILayoutManager
     * @class
     * @example
     * ```
     * parent.useLayout(new PUXI.FastLayout())
     * ```
     */
    var FastLayout = /** @class */ (function () {
        function FastLayout() {
        }
        FastLayout.prototype.onAttach = function (host) {
            this.host = host;
        };
        FastLayout.prototype.onDetach = function () {
            this.host = null;
        };
        FastLayout.prototype.onMeasure = function (maxWidth, maxHeight, widthMode, heightMode) {
            // TODO: Passthrough optimization pass, if there is only one child with FILL_PARENT width or height
            // then don't measure twice.
            this._measuredWidth = maxWidth;
            this._measuredHeight = maxHeight;
            var children = this.host.widgetChildren;
            // Measure children
            for (var i = 0, j = children.length; i < j; i++) {
                var widget = children[i];
                var lopt = (widget.layoutOptions || LayoutOptions.DEFAULT);
                var widthMeasureMode = this.getChildMeasureMode(lopt.width, widthMode);
                var heightMeasureMode = this.getChildMeasureMode(lopt.height, heightMode);
                var loptWidth = (Math.abs(lopt.width) < 1) ? lopt.width * maxWidth : lopt.width;
                var loptHeight = (Math.abs(lopt.height) < 1) ? lopt.height * maxHeight : lopt.height;
                widget.measure(widthMeasureMode === exports.MeasureMode.EXACTLY ? loptWidth : maxWidth, heightMeasureMode === exports.MeasureMode.EXACTLY ? loptHeight : maxHeight, widthMeasureMode, heightMeasureMode);
            }
            this._measuredWidth = this.measureWidthReach(maxWidth, widthMode);
            this._measuredHeight = this.measureHeightReach(maxHeight, heightMode);
            this.measureChildFillers();
        };
        FastLayout.prototype.getChildMeasureMode = function (dimen, parentMeasureMode) {
            if (parentMeasureMode === exports.MeasureMode.UNBOUNDED) {
                return exports.MeasureMode.UNBOUNDED;
            }
            if (dimen === LayoutOptions.FILL_PARENT || dimen === LayoutOptions.WRAP_CONTENT) {
                return exports.MeasureMode.AT_MOST;
            }
            return exports.MeasureMode.EXACTLY;
        };
        FastLayout.prototype.measureWidthReach = function (parentWidthLimit, widthMode) {
            if (widthMode === exports.MeasureMode.EXACTLY) {
                return parentWidthLimit;
            }
            var children = this.host.widgetChildren;
            var measuredWidth = 0;
            for (var i = 0, j = children.length; i < j; i++) {
                var widget = children[i];
                var childWidth = widget.getMeasuredWidth();
                var lopt = (widget.layoutOptions || LayoutOptions.DEFAULT);
                var x = lopt.x ? lopt.x : 0;
                var anchor = lopt.anchor ? lopt.anchor : FastLayoutOptions.DEFAULT_ANCHOR;
                // If lopt.x is %, then (1 - lopt.x)% of parent width should be as large
                // as (1 - anchor.x)% child's width.
                var minr = (Math.abs(x) < 1 ? (1 - anchor.x) * childWidth / (1 - x) : x);
                measuredWidth = Math.max(measuredWidth, minr);
            }
            if (widthMode === exports.MeasureMode.AT_MOST) {
                measuredWidth = Math.min(parentWidthLimit, measuredWidth);
            }
            return measuredWidth;
        };
        FastLayout.prototype.measureHeightReach = function (parentHeightLimit, heightMode) {
            if (heightMode === exports.MeasureMode.EXACTLY) {
                return parentHeightLimit;
            }
            var children = this.host.widgetChildren;
            var measuredHeight = 0;
            for (var i = 0, j = children.length; i < j; i++) {
                var widget = children[i];
                var childHeight = widget.getMeasuredHeight();
                var lopt = (widget.layoutOptions || LayoutOptions.DEFAULT);
                var y = lopt.y ? lopt.y : 0;
                var anchor = lopt.anchor ? lopt.anchor : FastLayoutOptions.DEFAULT_ANCHOR;
                var minb = (Math.abs(y) < 1 ? (1 - anchor.y) * childHeight / (1 - y) : y);
                measuredHeight = Math.max(measuredHeight, minb);
            }
            if (heightMode === exports.MeasureMode.AT_MOST) {
                measuredHeight = Math.min(parentHeightLimit, measuredHeight);
            }
            return measuredHeight;
        };
        FastLayout.prototype.measureChildFillers = function () {
            var children = this.host.widgetChildren;
            for (var i = 0, j = children.length; i < j; i++) {
                var widget = children[i];
                var lopt = (widget.layoutOptions || LayoutOptions.DEFAULT);
                if (lopt.width === LayoutOptions.FILL_PARENT || lopt.height === LayoutOptions.FILL_PARENT) {
                    var widthMode = lopt.width === LayoutOptions.FILL_PARENT ? exports.MeasureMode.EXACTLY : exports.MeasureMode.AT_MOST;
                    var heightMode = lopt.height === LayoutOptions.FILL_PARENT ? exports.MeasureMode.EXACTLY : exports.MeasureMode.AT_MOST;
                    widget.measure(this._measuredWidth, this._measuredHeight, widthMode, heightMode);
                }
            }
        };
        FastLayout.prototype.onLayout = function () {
            var parent = this.host;
            var width = parent.width, height = parent.height, children = parent.widgetChildren;
            for (var i = 0, j = children.length; i < j; i++) {
                var widget = children[i];
                var lopt = (widget.layoutOptions || LayoutOptions.DEFAULT);
                var x = lopt.x ? lopt.x : 0;
                var y = lopt.y ? lopt.y : 0;
                if (Math.abs(x) < 1) {
                    x *= width;
                }
                if (Math.abs(y) < 1) {
                    y *= height;
                }
                var anchor = lopt.anchor || FastLayoutOptions.DEFAULT_ANCHOR;
                var l = x - (anchor.x * widget.getMeasuredWidth());
                var t = y - (anchor.y * widget.getMeasuredHeight());
                widget.layout(l, t, l + widget.getMeasuredWidth(), t + widget.getMeasuredHeight());
            }
        };
        FastLayout.prototype.getMeasuredWidth = function () {
            return this._measuredWidth;
        };
        FastLayout.prototype.getMeasuredHeight = function () {
            return this._measuredHeight;
        };
        return FastLayout;
    }());

    /**
     * A widget group is a layout owner that can position its children according
     * to the layout given to it.
     *
     * @namespace PUXI
     * @class
     * @extends PUXI.Widget
     */
    var WidgetGroup = /** @class */ (function (_super) {
        __extends(WidgetGroup, _super);
        function WidgetGroup() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Will set the given layout-manager to be used for positioning child widgets.
         *
         * @param {ILayoutManager} layoutMgr
         */
        WidgetGroup.prototype.useLayout = function (layoutMgr) {
            if (this.layoutMgr) {
                this.layoutMgr.onDetach();
            }
            this.layoutMgr = layoutMgr;
            if (layoutMgr) {
                this.layoutMgr.onAttach(this);
            }
        };
        /**
         * Sets the widget-recommended layout manager. By default (if not overriden by widget
         * group class), this is a fast-layout.
         */
        WidgetGroup.prototype.useDefaultLayout = function () {
            this.useLayout(new FastLayout());
        };
        WidgetGroup.prototype.measure = function (width, height, widthMode, heightMode) {
            _super.prototype.measure.call(this, width, height, widthMode, heightMode);
            if (this.widgetChildren.length === 0) {
                return;
            }
            if (!this.layoutMgr) {
                this.useDefaultLayout();
            }
            this.layoutMgr.onMeasure(width, height, widthMode, heightMode);
            this._measuredWidth = Math.max(this.measuredWidth, this.layoutMgr.getMeasuredWidth());
            this._measuredHeight = Math.max(this.measuredHeight, this.layoutMgr.getMeasuredHeight());
        };
        WidgetGroup.prototype.layout = function (l, t, r, b, dirty) {
            if (dirty === void 0) { dirty = true; }
            _super.prototype.layout.call(this, l, t, r, b, dirty);
            if (this.widgetChildren.length === 0) {
                return;
            }
            if (!this.layoutMgr) {
                this.useDefaultLayout();
            }
            this.layoutMgr.onLayout(); // layoutMgr is attached to this
        };
        return WidgetGroup;
    }(Widget));

    /**
     * Represents a view that can gain or loose focus. It is primarily subclassed by
     * input/form widgets.
     *
     * Generally, it is a good idea not use layouts on these types of widgets.
     *
     * @class
     * @extends PUXI.Widget
     * @memberof PUXI
     */
    var FocusableWidget = /** @class */ (function (_super) {
        __extends(FocusableWidget, _super);
        /**
         * @param {PUXI.IInputBaseOptions} options
         * @param {PIXI.Container}[options.background]
         * @param {number}[tabIndex]
         * @param {any}[tabGroup]
         */
        function FocusableWidget(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this) || this;
            _this.keyDownEvent = function (e) {
                if (e.which === 9) {
                    if (_this._useTab) {
                        InputController.fireTab();
                        e.preventDefault();
                    }
                }
                else if (e.which === 38) {
                    if (_this._usePrev) {
                        InputController.firePrev();
                        e.preventDefault();
                    }
                }
                else if (e.which === 40) {
                    if (_this._useNext) {
                        InputController.fireNext();
                        e.preventDefault();
                    }
                }
                _this.emit('keydown');
            };
            _this.documentMouseDown = function () {
                if (!_this.__down) {
                    _this.blur();
                }
            };
            _this.bindEvents = function () {
                if (_this.stage !== null) {
                    _this.stage.on('pointerdown', _this.documentMouseDown);
                }
                document.addEventListener('keydown', _this.keyDownEvent);
            };
            _this.clearEvents = function () {
                if (_this.stage !== null) {
                    _this.stage.off('pointerdown', _this.documentMouseDown);
                }
                document.removeEventListener('keydown', _this.keyDownEvent);
            };
            if (options.background) {
                _super.prototype.setBackground.call(_this, options.background);
            }
            var tabIndex = options.tabIndex, tabGroup = options.tabGroup;
            _this._focused = false;
            _this._useTab = _this._usePrev = _this._useNext = true;
            _this.interactive = true;
            InputController.registrer(_this, tabIndex || 0, tabGroup || 0);
            _this.insetContainer.on('pointerdown', function () {
                _this.focus();
                _this.__down = true;
            });
            _this.insetContainer.on('pointerup', function () { _this.__down = false; });
            _this.insetContainer.on('pointerupoutside', function () { _this.__down = false; });
            return _this;
        }
        FocusableWidget.prototype.blur = function () {
            if (this._focused) {
                InputController.clear();
                this._focused = false;
                this.clearEvents();
                this.emit('focusChanged', false);
                this.emit('blur');
            }
        };
        FocusableWidget.prototype.focus = function () {
            if (!this._focused) {
                this._focused = true;
                this.bindEvents();
                InputController.set(this);
                this.emit('focusChanged', true);
                this.emit('focus');
            }
        };
        return FocusableWidget;
    }(WidgetGroup));

    /**
     * A static text widget. It cannot retain children.
     *
     * @class
     * @extends PUXI.Widget
     * @memberof PUXI
     */
    var TextWidget = /** @class */ (function (_super) {
        __extends(TextWidget, _super);
        /**
         * @param {string} text - text content
         * @param {PIXI.TextStyle} textStyle - styled used for text
         */
        function TextWidget(text, textStyle) {
            var _this = _super.call(this) || this;
            _this.textDisplay = new PIXI$1.Text(text, textStyle);
            _this.contentContainer.addChild(_this.textDisplay);
            return _this;
        }
        TextWidget.prototype.update = function () {
            if (this.tint !== null) {
                this.textDisplay.tint = this.tint;
            }
            if (this.blendMode !== null) {
                this.textDisplay.blendMode = this.blendMode;
            }
        };
        Object.defineProperty(TextWidget.prototype, "value", {
            get: function () {
                return this.textDisplay.text;
            },
            set: function (val) {
                this.textDisplay.text = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextWidget.prototype, "text", {
            get: function () {
                return this.value;
            },
            set: function (val) {
                this.value = val;
            },
            enumerable: true,
            configurable: true
        });
        return TextWidget;
    }(Widget));

    /**
     * Button that can be clicked.
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.FocusableWidget
     */
    var Button = /** @class */ (function (_super) {
        __extends(Button, _super);
        /**
         * @param [options.background}] {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as background for Button
         * @param [options.text=null] {PIXI.UI.Text} optional text
         * @param [options.tabIndex=0] {Number} input tab index
         * @param [options.tabGroup=0] {Number|String} input tab group
         * @param [options.width=options.background.width] {Number|String} width
         * @param [options.height=options.background.height] {Number|String} height
         */
        function Button(options) {
            var _this = _super.call(this, options) || this;
            _this.isHover = false;
            if (typeof options.text === 'string') {
                options.text = new TextWidget(options.text, new PIXI$1.TextStyle());
            }
            _this.textWidget = options.text.setLayoutOptions(new FastLayoutOptions(LayoutOptions.WRAP_CONTENT, LayoutOptions.WRAP_CONTENT, 0.5, 0.5, FastLayoutOptions.CENTER_ANCHOR));
            if (_this.textWidget) {
                _this.addChild(_this.textWidget);
            }
            _this.contentContainer.buttonMode = true;
            _this.setupClick();
            return _this;
        }
        Button.prototype.setupClick = function () {
            var _this = this;
            var clickEvent = new ClickManager(this);
            clickEvent.onHover = function (e, over) {
                _this.isHover = over;
                _this.emit('hover', over);
            };
            clickEvent.onPress = function (e, isPressed) {
                if (isPressed) {
                    _this.focus();
                    e.data.originalEvent.preventDefault();
                }
                _this.emit('press', isPressed);
            };
            clickEvent.onClick = function (e) {
                _this.click();
            };
            this.click = function () {
                _this.emit('click');
            };
            this.focus = function () {
                if (!_this._focused) {
                    FocusableWidget.prototype.focus.call(_this);
                    // document.addEventListener("keydown", keyDownEvent, false);
                }
            };
            this.blur = function () {
                if (_this._focused) {
                    FocusableWidget.prototype.blur.call(_this);
                    // document.removeEventListener("keydown", keyDownEvent);
                }
            };
            this.initialize = function () {
                _super.prototype.initialize.call(_this);
                _this.contentContainer.interactiveChildren = false;
                // lazy to make sure all children is initialized (trying to get the bedst hitArea possible)
                setTimeout(function () {
                    var bounds = _this.contentContainer.getLocalBounds();
                    _this.contentContainer.hitArea = new PIXI$1.Rectangle(bounds.x < 0 ? bounds.x : 0, bounds.y < 0 ? bounds.y : 0, Math.max(bounds.x + bounds.width + (bounds.x < 0 ? -bounds.x : 0), _this._width), Math.max(bounds.y + bounds.height + (bounds.y < 0 ? -bounds.y : 0), _this._height));
                }, 20);
            };
        };
        Button.prototype.update = function () {
            // No update needed
        };
        Object.defineProperty(Button.prototype, "value", {
            get: function () {
                if (this.textWidget) {
                    return this.textWidget.text;
                }
                return '';
            },
            set: function (val) {
                if (this.textWidget) {
                    this.textWidget.text = val;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "text", {
            get: function () {
                return this.textWidget;
            },
            set: function (val) {
                this.value = val;
            },
            enumerable: true,
            configurable: true
        });
        return Button;
    }(FocusableWidget));
    /*
     * Features:
     * Button, radio button (checkgroups)
     *
     * Methods:
     * blur()
     * focus()
     *
     * Properties:
     * checked: get/set Button checked
     * value: get/set Button value
     *
     * Events:
     * "hover"          param: [bool]isHover (hover/leave)
     * "press"          param: [bool]isPressed (pointerdown/pointerup)
     * "click"
     * "blur"
     * "focus"
     * "focusChanged"   param: [bool]isFocussed
     *
     */

    /**
     * An interactive container.
     *
     * @class
     * @extends PIXI.UI.UIBase
     * @memberof PIXI.UI
     */
    var InteractiveGroup = /** @class */ (function (_super) {
        __extends(InteractiveGroup, _super);
        function InteractiveGroup() {
            var _this = _super.call(this) || this;
            _this.hitArea = new PIXI$1.Rectangle();
            _this.insetContainer.hitArea = _this.hitArea;
            return _this;
        }
        InteractiveGroup.prototype.update = function () {
            // TODO:
        };
        InteractiveGroup.prototype.layout = function (l, t, r, b, dirty) {
            _super.prototype.layout.call(this, l, t, r, b, dirty);
            this.hitArea.width = this.width;
            this.hitArea.height = this.height;
        };
        return InteractiveGroup;
    }(WidgetGroup));

    /**
     * A checkbox is a button can be selected (checked). It has a on/off state that
     * can be controlled by the user.
     *
     * When used in a checkbox group, the group will control whether the checkbox can
     * be selected or not.
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.FocusableWidget
     */
    var CheckBox = /** @class */ (function (_super) {
        __extends(CheckBox, _super);
        /**
         * @param {PUXI.ICheckBoxOptions} options
         * @param [options.checked=false] {bool} is checked
         * @param options.background {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as background for CheckBox
         * @param options.checkmark {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as checkmark for CheckBox
         * @param [options.checkgroup=null] {String} CheckGroup name
         * @param options.value {String} mostly used along with checkgroup
         * @param [options.tabIndex=0] {Number} input tab index
         * @param [options.tabGroup=0] {Number|String} input tab group
         */
        function CheckBox(options) {
            var _this = _super.call(this, options) || this;
            _this.change = function (val) {
                if (_this.checkmark) {
                    _this.checkmark.alpha = val ? 1 : 0;
                }
            };
            _this.click = function () {
                _this.emit('click');
                if (_this.checkGroup !== null && _this.checked) {
                    return;
                }
                _this.checked = !_this.checked;
                _this.emit('changed', _this.checked);
            };
            _this.focus = function () {
                if (!_this._focused) {
                    _super.prototype.focus.call(_this);
                    // document.addEventListener("keydown", keyDownEvent, false);
                }
            };
            _this.blur = function () {
                if (_this._focused) {
                    _super.prototype.blur.call(_this);
                    // document.removeEventListener("keydown", keyDownEvent);
                }
            };
            _this._checked = options.checked !== undefined ? options.checked : false;
            _this._value = options.value || '';
            _this.checkGroup = options.checkgroup || null;
            _this.checkmark = new InteractiveGroup();
            _this.checkmark.contentContainer.addChild(options.checkmark);
            _this.checkmark.setLayoutOptions(new FastLayoutOptions(LayoutOptions.WRAP_CONTENT, LayoutOptions.WRAP_CONTENT, 0.5, 0.5, FastLayoutOptions.CENTER_ANCHOR));
            _this.checkmark.alpha = _this._checked ? 1 : 0;
            _this.addChild(_this.checkmark);
            _this.contentContainer.buttonMode = true;
            if (_this.checkGroup !== null) {
                InputController.registrerCheckGroup(_this);
            }
            return _this;
        }
        CheckBox.prototype.update = function () {
            // No need for updating
        };
        Object.defineProperty(CheckBox.prototype, "checked", {
            get: function () {
                return this._checked;
            },
            set: function (val) {
                if (val !== this._checked) {
                    if (this.checkGroup !== null && val) {
                        InputController.updateCheckGroupSelected(this);
                    }
                    this._checked = val;
                    this.change(val);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CheckBox.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (val) {
                this._value = val;
                if (this.checked) {
                    InputController.updateCheckGroupSelected(this);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CheckBox.prototype, "selectedValue", {
            get: function () {
                return InputController.getCheckGroupSelectedValue(this.checkGroup);
            },
            set: function (val) {
                InputController.setCheckGroupSelectedValue(this.checkGroup, val);
            },
            enumerable: true,
            configurable: true
        });
        CheckBox.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);
            var clickMgr = this.eventBroker.click;
            clickMgr.onHover = function (_, over) {
                _this.emit('hover', over);
            };
            clickMgr.onPress = function (e, isPressed) {
                if (isPressed) {
                    _this.focus();
                    e.data.originalEvent.preventDefault();
                }
                _this.emit('press', isPressed);
            };
            clickMgr.onClick = function () {
                _this.click();
            };
        };
        return CheckBox;
    }(FocusableWidget));
    /*
     * Features:
     * checkbox, radio button (checkgroups)
     *
     * Methods:
     * blur()
     * focus()
     * change(checked) //only exposed to overwrite (if you dont want to hard toggle alpha of checkmark)
     *
     * Properties:
     * checked: get/set checkbox checked
     * value: get/set checkbox value
     * selectedValue: get/set selected value for checkgroup
     *
     * Events:
     * "hover"          param: [bool]isHover (hover/leave)
     * "press"          param: [bool]isPressed (pointerdown/pointerup)
     * "click"
     * "blur"
     * "focus"
     * "focusChanged"   param: [bool]isFocussed
     * "change"         param: [bool]isChecked
     *
     */

    function DynamicTextStyle(parent)
    {
        this.respectDirty = true;
        this._parent = parent || null;
        this._scale = 1;
        this._align = 'left';
        this._fontFamily = 'Arial';
        this._fontSize = 26;
        this._fontWeight = 'normal';
        this._fontStyle = 'normal';
        this._letterSpacing = 0;
        this._lineHeight = 0;
        this._verticalAlign = 0;
        this._rotation = 0;
        this._skew = 0;
        this._tint = '#FFFFFF';
        this._fill = '#FFFFFF';
        this._shadow = '';
        this._stroke = 0;
        this._strokeFill = '';
        this._strokeShadow = '';
        this._wrap = true;
        this._breakWords = false;
        this._overflowX = 'visible'; // visible|hidden
        this._overflowY = 'visible'; // visible|hidden
        this._ellipsis = false;

        let _cachedEllipsisSize = null;

        this.ellipsisSize = function (atlas)
        {
            if (!this.ellipsis) return 0;
            if (_cachedEllipsisSize === null)
            { _cachedEllipsisSize = (atlas.getCharObject('.', this).width + this.letterSpacing) * 3; }

            return _cachedEllipsisSize;
        };
    }

    DynamicTextStyle.prototype.clone = function ()
    {
        const style = new DynamicTextStyle();

        style.merge(this);

        return style;
    };

    DynamicTextStyle.prototype.merge = function (style)
    {
        if (typeof style === 'object')
        {
            this.respectDirty = false;
            for (const param in style)
            {
                const val = style[param];

                if (typeof val === 'function' || param === 'respectDirty' || param === '_parent') continue;
                this[param] = style[param];
            }
            this.respectDirty = true;
            this._dirty = true;
        }
    };

    DynamicTextStyle.prototype.ctxKey = function (char)
    {
        return [char, this.fill, this.shadow, this.stroke, this.strokeFill, this.strokeShadow].join('|');
    };

    DynamicTextStyle.prototype.ctxFont = function ()
    {
        const fontSize = `${Math.min(200, Math.max(1, this.fontSize || 26))}px `;
        const fontWeight = this.fontWeight === 'bold' ? `${this.fontWeight} ` : '';
        const fontStyle = this.fontStyle === 'italic' || this.fontStyle === 'oblique' ? `${this.fontStyle} ` : '';

        return fontWeight + fontStyle + fontSize + this.fontFamily;
    };

    DynamicTextStyle.prototype.constructor = DynamicTextStyle;

    Object.defineProperties(DynamicTextStyle.prototype, {
        _dirty: {
            set(val)
            {
                if (this.respectDirty)
                {
                    if (this._parent !== null)
                    {
                        this._parent.dirtyStyle = val;
                        this._parent.update();
                    }
                }
            },
        },
        scale: {
            get()
            {
                return this._scale;
            },
            set(val)
            {
                if (val !== this._scale)
                {
                    this._scale = val;
                    this._dirty = true;
                }
            },
        },
        align: {
            get()
            {
                return this._align;
            },
            set(val)
            {
                if (val !== this._align)
                {
                    this._align = val;
                    this._dirty = true;
                }
            },
        },
        fontFamily: {
            get()
            {
                return this._fontFamily;
            },
            set(val)
            {
                if (val !== this._fontFamily)
                {
                    this._fontFamily = val;
                    this._dirty = true;
                }
            },
        },
        fontSize: {
            get()
            {
                return this._fontSize;
            },
            set(val)
            {
                if (val !== this._fontSize)
                {
                    this._fontSize = val;
                    this._dirty = true;
                }
            },
        },
        fontWeight: {
            get()
            {
                return this._fontWeight;
            },
            set(val)
            {
                if (val !== this._fontWeight)
                {
                    this._fontWeight = val;
                    this._dirty = true;
                }
            },
        },
        fontStyle: {
            get()
            {
                return this._fontStyle;
            },
            set(val)
            {
                if (val !== this._fontStyle)
                {
                    this._fontStyle = val;
                    this._dirty = true;
                }
            },
        },
        letterSpacing: {
            get()
            {
                return this._letterSpacing;
            },
            set(val)
            {
                if (val !== this._letterSpacing)
                {
                    this._letterSpacing = val;
                    this._dirty = true;
                }
            },
        },
        lineHeight: {
            get()
            {
                return this._lineHeight;
            },
            set(val)
            {
                if (val !== this._lineHeight)
                {
                    this._lineHeight = val;
                    this._dirty = true;
                }
            },
        },
        verticalAlign: {
            get()
            {
                return this._verticalAlign;
            },
            set(val)
            {
                if (val !== this._verticalAlign)
                {
                    this._verticalAlign = val;
                    this._dirty = true;
                }
            },
        },
        rotation: {
            get()
            {
                return this._rotation;
            },
            set(val)
            {
                if (val !== this._rotation)
                {
                    this._rotation = val;
                    this._dirty = true;
                }
            },
        },
        skew: {
            get()
            {
                return this._skew;
            },
            set(val)
            {
                if (val !== this._skew)
                {
                    this._skew = val;
                    this._dirty = true;
                }
            },
        },
        tint: {
            get()
            {
                return this._tint;
            },
            set(val)
            {
                if (val !== this._tint)
                {
                    this._tint = val;
                    this._dirty = true;
                }
            },
        },
        fill: {
            get()
            {
                return this._fill;
            },
            set(val)
            {
                if (val !== this._fill)
                {
                    this._fill = val;
                    this._dirty = true;
                }
            },
        },
        shadow: {
            get()
            {
                return this._shadow;
            },
            set(val)
            {
                if (val !== this._shadow)
                {
                    this._shadow = val;
                    this._dirty = true;
                }
            },
        },
        stroke: {
            get()
            {
                return this._stroke;
            },
            set(val)
            {
                if (val !== this._stroke)
                {
                    this._stroke = val;
                    this._dirty = true;
                }
            },
        },
        strokeFill: {
            get()
            {
                return this._strokeFill;
            },
            set(val)
            {
                if (val !== this._strokeFill)
                {
                    this._strokeFill = val;
                    this._dirty = true;
                }
            },
        },
        strokeShadow: {
            get()
            {
                return this._strokeShadow;
            },
            set(val)
            {
                if (val !== this._strokeShadow)
                {
                    this._strokeShadow = val;
                    this._dirty = true;
                }
            },
        },
        wrap: {
            get()
            {
                return this._wrap;
            },
            set(val)
            {
                if (val !== this._wrap)
                {
                    this._wrap = val;
                    this._dirty = true;
                }
            },
        },
        breakWords: {
            get()
            {
                return this._breakWords;
            },
            set(val)
            {
                if (val !== this._breakWords)
                {
                    this._breakWords = val;
                    this._dirty = true;
                }
            },
        },
        overflowX: {
            get()
            {
                return this._overflowX;
            },
            set(val)
            {
                if (val !== this._overflowX)
                {
                    this._overflowX = val;
                    this._dirty = true;
                }
            },
        },
        overflowY: {
            get()
            {
                return this._overflowY;
            },
            set(val)
            {
                if (val !== this._overflowY)
                {
                    this._overflowY = val;
                    this._dirty = true;
                }
            },
        },
        ellipsis: {
            get()
            {
                return this._ellipsis;
            },
            set(val)
            {
                if (val !== this._ellipsis)
                {
                    this._ellipsis = val;
                    this._dirty = true;
                }
            },
        },
    });

    function DynamicChar()
    {
        // styledata (texture, orig width, orig height)
        this.style = null;

        // char data
        this.data = null;

        // is this char space?
        this.space = false;

        // is this char newline?
        this.newline = false;

        this.emoji = false;

        // charcode
        this.charcode = 0;

        // char string value
        this.value = '';

        // word index
        this.wordIndex = -1;

        // line index of char
        this.lineIndex = -1;
    }

    DynamicChar.prototype.constructor = DynamicChar;

    var emojiRegex = function () {
      // https://mths.be/emoji
      return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
    };

    let atlas = null;

    /**
    * An dynamic text object with auto generated atlas
    *
    * @class
    * @extends PIXI.UI.UIBase
    * @memberof PIXI.UI
    * @param text {String} Text content
    * @param [width=0] {Number|String} width of textbox. 0 = autoWidth
    * @param [height=0] {Number|String} height of textbox. 0 = autoHeight
    * @param [allowTags=true] {boolean} Allow inline styling
    * @param [options=null] {DynamicTextStyle} Additional text settings
    */
    function DynamicText(text, options)
    {
        options = options || {};

        Widget.call(this, options.width || 0, options.height || 0);

        // create atlas
        if (atlas === null)
        { atlas = new DynamicAtlas(1); }

        const autoWidth = !options.width;
        const autoHeight = !options.height;

        // defaultstyle for this textobject
        const defaultStyle = this._style = new DynamicTextStyle(this);

        defaultStyle.merge(options.style);

        // collection of all processed char
        const chars = this.chars = [];
        const renderChars = [];
        const spriteCache = []; // (temp)
        const charContainer = new PIXI.Container();

        this.container.addChild(charContainer);

        // the input text
        this._inputText = text;

        // states
        let lastWidth = 0;
        let lastHeight = 0;

        this.dirtyText = true;
        this.dirtyStyle = true;
        this.dirtyRender = true;

        // dictionary for line data
        const lineWidthData = [];
        const lineHeightData = [];
        const lineFontSizeData = [];
        const lineAlignmentData = [];
        let renderCount = 0;
        let charCount = 0;

        // ellipsis caches (not nessesary when no sprites)
        const lineEllipsisData = [];
        const lineHasEllipsis = [];

        // ROUGH TEMP RENDER (with sprites)
        this.render = function ()
        {
            let yOffset = 0;
            let xOffset = 0;
            let currentLine = -1;
            let i;

            if (spriteCache.length > renderCount)
            {
                for (i = renderCount; i < spriteCache.length; i++)
                {
                    const removeSprite = spriteCache[i];

                    if (removeSprite)
                    { removeSprite.visible = false; }
                }
            }

            let char; let lineWidth = 0; let lineHeight = 0; let
                maxLineWidth = 0;

            for (i = 0; i < renderCount; i++)
            {
                char = renderChars[i];

                // get line data
                if (currentLine !== char.lineIndex)
                {
                    currentLine = char.lineIndex;
                    lineWidth = lineWidthData[currentLine];
                    lineHeight = lineHeightData[currentLine];
                    yOffset += lineHeight;

                    switch (lineAlignmentData[currentLine])
                    {
                        case 'right': xOffset = this._width - lineWidth; break;
                        case 'center': xOffset = (this._width - lineWidth) * 0.5; break;
                        default: xOffset = 0;
                    }

                    maxLineWidth = Math.max(lineWidth, maxLineWidth);
                }

                // no reason to render a blank space or 0x0 letters (no texture created)
                if (!char.data.texture || char.space || char.newline)
                {
                    if (spriteCache[i])
                    { spriteCache[i].visible = false; }
                    continue;
                }

                // add new sprite
                const tex = char.data.texture; let
                    sprite = spriteCache[i];

                if (!sprite)
                {
                    sprite = spriteCache[i] = new PIXI.Sprite(tex);
                    sprite.anchor.set(0.5);
                }
                else
                { sprite.texture = tex; }

                sprite.visible = true;
                sprite.x = char.x + xOffset + tex.width * 0.5;
                sprite.y = char.y + yOffset - tex.height * 0.5 - (lineHeight - lineFontSizeData[currentLine]);

                sprite.tint = char.emoji ? 0xffffff : hexToInt(char.style.tint, 0xffffff);
                sprite.rotation = float(char.style.rotation, 0);
                sprite.skew.x = float(char.style.skew, 0);

                if (!sprite.parent)
                { charContainer.addChild(sprite); }
            }

            if (autoWidth) this.width = maxLineWidth;
            if (autoHeight) this.height = yOffset;
        };

        // updates the renderChar array and position chars for render
        this.prepareForRender = function ()
        {
            const pos = new PIXI.Point();
            let wordIndex = 0;
            let lineHeight = 0;
            let lineFontSize = 0;
            let lineIndex = 0;
            let lineAlignment = defaultStyle.align;
            let lastSpaceIndex = -1;
            let lastSpaceLineWidth = 0;
            let textHeight = 0;
            let forceNewline = false;
            let style;
            let renderIndex = 0;
            let ellipsis = false;
            let lineFull = false;
            let i;

            for (i = 0; i < charCount; i++)
            {
                const char = chars[i]; const
                    lastChar = chars[i - 1];

                style = char.style;

                // lineheight
                lineHeight = Math.max(lineHeight, defaultStyle.lineHeight || style.lineHeight || char.data.lineHeight);

                if (style.overflowY !== 'visible' && lineHeight + textHeight > this._height)
                {
                    if (style.overflowY === 'hidden')
                    { break; }
                }

                if (char.newline)
                { lineFull = false; }

                // set word index
                if (char.space || char.newline) wordIndex++;
                else char.wordIndex = wordIndex;

                // textheight
                lineFontSize = Math.max(lineFontSize, style.fontSize);

                // lineindex
                char.lineIndex = lineIndex;

                // lineAlignment
                if (style.align !== defaultStyle.align) lineAlignment = style.align;

                if (char.space)
                {
                    lastSpaceIndex = i;
                    lastSpaceLineWidth = pos.x;
                }

                const size = Math.round(char.data.width) + float(style.letterSpacing, 0);

                if (!autoWidth && !forceNewline && !char.newline && pos.x + size > this._width)
                {
                    if (style.wrap)
                    {
                        if (char.space)
                        {
                            forceNewline = true;
                        }
                        else if (lastSpaceIndex !== -1)
                        {
                            renderIndex -= i - lastSpaceIndex;
                            i = lastSpaceIndex - 1;
                            lastSpaceIndex = -1;
                            pos.x = lastSpaceLineWidth;
                            forceNewline = true;
                            continue;
                        }
                        else if (style.breakWords)
                        {
                            if (lastChar)
                            {
                                pos.x -= lastChar.style.letterSpacing;
                                pos.x -= lastChar.data.width;
                            }
                            i -= 2;
                            renderIndex--;
                            forceNewline = true;
                            continue;
                        }
                    }

                    if (style.overflowX == 'hidden' && !forceNewline)
                    {
                        lineFull = true;
                        if (style.ellipsis && !ellipsis)
                        {
                            ellipsis = true;
                            let ellipsisData = lineEllipsisData[lineIndex];

                            if (!ellipsisData) ellipsisData = lineEllipsisData[lineIndex] = [new DynamicChar(), new DynamicChar(), new DynamicChar()];
                            for (let d = 0; d < 3; d++)
                            {
                                const dot = ellipsisData[d];

                                dot.value = '.';
                                dot.data = atlas.getCharObject(dot.value, style);
                                dot.style = style;
                                dot.x = pos.x + char.data.xOffset;
                                dot.y = parseFloat(style.verticalAlign) + dot.data.yOffset;
                                dot.lineIndex = lineIndex;
                                pos.x += Math.round(dot.data.width) + float(style.letterSpacing, 0);
                                renderChars[renderIndex] = dot;
                                renderIndex++;
                            }
                        }
                    }
                }

                // Update position and add to renderchars
                if (!lineFull)
                {
                    // position
                    char.x = pos.x + char.data.xOffset;
                    char.y = parseFloat(style.verticalAlign) + char.data.yOffset;
                    pos.x += size;
                    renderChars[renderIndex] = char;
                    renderIndex++;
                }

                // new line
                if (forceNewline || char.newline || i === charCount - 1)
                {
                    if (lastChar)
                    {
                        pos.x -= lastChar.style.letterSpacing;
                    }

                    if (char.space)
                    {
                        pos.x -= char.data.width;
                        pos.x -= float(style.letterSpacing, 0);
                    }

                    textHeight += lineHeight;
                    lineHasEllipsis[lineIndex] = ellipsis;
                    lineWidthData[lineIndex] = pos.x;
                    lineHeightData[lineIndex] = lineHeight;
                    lineFontSizeData[lineIndex] = lineFontSize;
                    lineAlignmentData[lineIndex] = lineAlignment;

                    // reset line vaules
                    lineHeight = pos.x = lastSpaceLineWidth = lineFontSize = 0;
                    lineAlignment = defaultStyle.align;
                    lastSpaceIndex = -1;
                    lineIndex++;
                    forceNewline = lineFull = ellipsis = false;
                }
            }

            renderCount = renderIndex;
        };

        // phrases the input text and prepares the char array
        const closeTags = ['</i>', '</b>', '</font>', '</center>'];

        this.processInputText = function ()
        {
            const styleTree = [defaultStyle];
            let charIndex = 0;
            let inputTextIndex = 0;
            const inputArray = Array.from(this._inputText);

            for (let i = 0; i < inputArray.length; i++)
            {
                style = styleTree[styleTree.length - 1];
                let c = inputArray[i];
                const charcode = c.charCodeAt(0);
                let newline = false;
                let space = false;
                let emoji = false;

                // Extract Tags
                if ((/(?:\r\n|\r|\n)/).test(c))
                { newline = true; }
                else if ((/(\s)/).test(c))
                { space = true; }
                else if (options.allowTags && c === '<')
                {
                    let tag = this._inputText.substring(inputTextIndex);

                    tag = tag.slice(0, tag.indexOf('>') + 1);
                    let FoundTag = true;

                    if (tag.length)
                    {
                        if (tag === '<i>')
                        {
                            style = style.clone();
                            style.fontStyle = 'italic';
                            styleTree.push(style);
                        }
                        else if (tag === '<b>')
                        {
                            style = style.clone();
                            style.fontWeight = 'bold';
                            styleTree.push(style);
                        }
                        else if (tag === '<center>')
                        {
                            style = style.clone();
                            style.align = 'center';
                            styleTree.push(style);
                        }
                        else if (closeTags.indexOf(tag) !== -1)
                        {
                            if (styleTree.length > 1) styleTree.splice(styleTree.length - 1, 1);
                        }
                        else if (tag.startsWith('<font '))
                        {
                            const regex = /(\w+)\s*=\s*((["'])(.*?)\3|([^>\s]*)(?=\s|\/>))(?=[^<]*>)/g;
                            let match = regex.exec(tag);

                            if (match !== null)
                            {
                                style = style.clone();
                                while (match !== null)
                                {
                                    switch (match[1])
                                    {
                                        case 'family': match[1] = 'fontFamily'; break;
                                        case 'size': match[1] = 'fontSize'; break;
                                        case 'weight': match[1] = 'fontWeight'; break;
                                        case 'style': match[1] = 'fontStyle'; break;
                                        case 'valign': match[1] = 'verticalAlign'; break;
                                        case 'spacing': match[1] = 'letterSpacing'; break;
                                        case 'color': match[1] = 'tint'; break;
                                    }
                                    style[match[1]] = match[4];
                                    match = regex.exec(tag);
                                }
                                styleTree.push(style);
                            }
                        }
                        else
                        {
                            FoundTag = false;
                        }

                        if (FoundTag)
                        {
                            inputTextIndex += tag.length;
                            i += tag.length - 1;
                            continue;
                        }
                    }
                }
                else
                {
                    // detect emoji
                    let emojiMatch = emojiRegex().exec(c);

                    if (emojiMatch !== null)
                    {
                        i--; c = '';
                        while (emojiMatch !== null && c !== emojiMatch[0])
                        {
                            i++;
                            c = emojiMatch[0];
                            emojiMatch = emojiRegex().exec(c + inputArray[i + 1]);
                        }
                        emoji = true;
                    }
                }

                // Prepare DynamicChar object
                let char = chars[charIndex];

                if (!char)
                {
                    char = new DynamicChar();
                    chars[charIndex] = char;
                }
                char.style = style;

                if (emoji)
                {
                    char.style = char.style.clone();
                    char.style.fontFamily = DynamicText.settings.defaultEmojiFont;
                }

                char.data = atlas.getCharObject(c, char.style);
                char.value = c;
                char.space = space;
                char.newline = newline;
                char.emoji = emoji;

                charIndex++;
                inputTextIndex += c.length;
            }
            charCount = charIndex;
        };

        // PIXIUI update, lazy update (bad solution needs rewrite when converted to pixi plugin)
        this.lazyUpdate = null;
        const self = this;

        this.update = function ()
        {
            if (self.lazyUpdate !== null) return;
            self.lazyUpdate = setTimeout(function ()
            {
                // console.log("UPDATING TEXT");
                const dirtySize = !autoWidth && (self._width != lastWidth || self._height != lastHeight || self.dirtyText);

                if (self.dirtyText || self.dirtyStyle)
                {
                    self.dirtyText = self.dirtyStyle = false;
                    self.dirtyRender = true; // force render after textchange
                    self.processInputText();
                }

                if (dirtySize || self.dirtyRender)
                {
                    self.dirtyRender = false;
                    lastWidth = self._width;
                    lastHeight = self.height;
                    self.prepareForRender();
                    self.render();
                }
                self.lazyUpdate = null;
            }, 0);
        };
    }

    DynamicText.prototype = Object.create(Widget.prototype);
    DynamicText.prototype.constructor = DynamicText;

    DynamicText.settings = {
        debugSpriteSheet: false,
        defaultEmojiFont: 'Segoe UI Emoji', // force one font family for emojis so we dont rerender them multiple times
    };

    Object.defineProperties(DynamicText.prototype, {
        value: {
            get()
            {
                return this._inputText;
            },
            set(val)
            {
                if (val !== this._inputText)
                {
                    this._inputText = val;
                    this.dirtyText = true;
                    this.update();
                    // console.log("Updating Text to: " + val);
                }
            },
        },
        text: {
            get()
            {
                return this.value;
            },
            set(val)
            {
                this.value = val;
            },
        },
        style: {
            get()
            {
                return this._style;
            },
            set(val)
            {
                // get a clean default style
                const style = new DynamicTextStyle(this);

                // merge it with new style
                style.merge(val);

                // merge it onto this default style
                this._style.merge(style);

                this.dirtyStyle = true;
                this.update();
            },
        },
    });

    // Atlas
    const metricsCanvas = document.createElement('canvas');
    const metricsContext = metricsCanvas.getContext('2d');

    metricsCanvas.width = 100;
    metricsCanvas.height = 100;

    var DynamicAtlas = function (padding)
    {
        let canvas;
        let context;
        let objects;
        let newObjects = [];
        let baseTexture;
        let lazyTimeout;
        let rootNode;
        let atlasdim;
        const startdim = 256;
        const maxdim = 2048;

        var AtlasNode = function (w, h)
        {
            const children = this.children = [];

            this.rect = new PIXI.Rectangle(0, 0, w || 0, h || 0);
            this.data = null;

            this.insert = function (width, height, obj)
            {
                if (children.length > 0)
                {
                    const newNode = children[0].insert(width, height, obj);

                    if (newNode !== null) return newNode;

                    return children[1].insert(width, height, obj);
                }
                if (this.data !== null) return null;
                if (width > this.rect.width || height > this.rect.height) return null;
                if (width == this.rect.width && height == this.rect.height)
                {
                    this.data = obj;
                    obj.frame.x = this.rect.x;
                    obj.frame.y = this.rect.y;

                    return this;
                }

                children.push(new AtlasNode());
                children.push(new AtlasNode());

                const dw = this.rect.width - width;
                const dh = this.rect.height - height;

                if (dw > dh)
                {
                    children[0].rect = new PIXI.Rectangle(this.rect.x, this.rect.y, width, this.rect.height);
                    children[1].rect = new PIXI.Rectangle(this.rect.x + width, this.rect.y, this.rect.width - width, this.rect.height);
                }
                else
                {
                    children[0].rect = new PIXI.Rectangle(this.rect.x, this.rect.y, this.rect.width, height);
                    children[1].rect = new PIXI.Rectangle(this.rect.x, this.rect.y + height, this.rect.width, this.rect.height - height);
                }

                return children[0].insert(width, height, obj);
            };
        };

        const addCanvas = function ()
        {
            // create new canvas
            canvas = document.createElement('canvas');
            context = canvas.getContext('2d');

            // reset dimentions
            atlasdim = startdim;
            canvas.width = canvas.height = atlasdim;
            rootNode = new AtlasNode(atlasdim, atlasdim);

            // reset array with canvas objects and create new atlas
            objects = [];

            // set new basetexture
            baseTexture = PIXI.BaseTexture.fromCanvas(canvas);
            baseTexture.mipmap = false; // if not, pixi bug resizing POW2
            baseTexture.resolution = 1; // todo: support all resolutions
            baseTexture.update();

            // Debug Spritesheet
            if (DynamicText.settings.debugSpriteSheet)
            {
                canvas.className = 'DynamicText_SpriteSheet';
                document.body.appendChild(canvas);
            }
        };

        this.fontFamilyCache = {};

        const drawObjects = function (arr, resized)
        {
            if (resized) baseTexture.update();
            for (let i = 0; i < arr.length; i++)
            { drawObject(arr[i]); }
        };

        var drawObject = function (obj)
        {
            context.drawImage(obj._cache, obj.frame.x, obj.frame.y);
            obj.texture.frame = obj.frame;
            obj.texture.update();
        };

        this.getCharObject = function (char, style)
        {
            const font = style.ctxFont();

            // create new cache for fontFamily
            let familyCache = this.fontFamilyCache[font];

            if (!familyCache)
            {
                familyCache = {};
                this.fontFamilyCache[font] = familyCache;
            }

            // get char data
            const key = style.ctxKey(char);
            let obj = familyCache[key];

            if (!obj)
            {
                // create char object
                const metrics = generateCharData(char, style);

                // temp resize if doesnt fit (not nesseary when we dont need to generate textures)
                if (metrics.rect)
                {
                    if (canvas.width < metrics.rect.width || canvas.height < metrics.rect.height)
                    {
                        canvas.width = canvas.height = Math.max(metrics.rect.width, metrics.rect.height);
                        baseTexture.update();
                    }
                }

                // todo: cleanup when we know whats needed
                obj = {
                    metrics,
                    font,
                    value: char,
                    frame: metrics.rect,
                    baseTexture: metrics.rect ? baseTexture : null,
                    xOffset: metrics.bounds ? metrics.bounds.minx : 0,
                    yOffset: metrics.descent || 0,
                    width: metrics.width || 0,
                    lineHeight: metrics.lineHeight || 0,
                    _cache: metrics.canvas,
                    texture: metrics.rect ? new PIXI.Texture(baseTexture, metrics.rect) : null, // temp texture
                };

                // add to collections
                familyCache[key] = obj;

                // add to atlas if visible char
                if (metrics.rect)
                {
                    newObjects.push(obj);

                    if (lazyTimeout === undefined)
                    {
                        lazyTimeout = setTimeout(function ()
                        {
                            addNewObjects();
                            lazyTimeout = undefined;
                        }, 0);
                    }
                }
            }

            return obj;
        };

        const compareFunction = function (a, b)
        {
            if (a.frame.height < b.frame.height)
            { return 1; }

            if (a.frame.height > b.frame.height)
            { return -1; }

            if (a.frame.width < b.frame.width)
            { return 1; }

            if (a.frame.width > b.frame.width)
            { return -1; }

            return 0;
        };

        var addNewObjects = function ()
        {
            newObjects.sort(compareFunction);
            let _resized = false;
            let _newcanvas = false;

            for (let i = 0; i < newObjects.length; i++)
            {
                const obj = newObjects[i];
                const node = rootNode.insert(obj.frame.width + padding, obj.frame.height + padding, obj);

                if (node !== null)
                {
                    if (_newcanvas) obj.texture.baseTexture = baseTexture; // update basetexture if new canvas was created (temp)
                    objects.push(obj);
                    continue;
                }

                // step one back (so it will be added after resize/new canvas)
                i--;

                if (atlasdim < maxdim)
                {
                    _resized = true;
                    resizeCanvas(atlasdim * 2);
                    continue;
                }

                // close current spritesheet and make a new one
                drawObjects(objects, _resized);
                addCanvas();
                _newcanvas = true;
                _resized = false;
            }

            drawObjects(_resized || _newcanvas ? objects : newObjects, _resized);
            newObjects = [];
        };

        var resizeCanvas = function (dim)
        {
            canvas.width = canvas.height = atlasdim = dim;

            rootNode = new AtlasNode(dim, dim);
            objects.sort(compareFunction);

            for (let i = 0; i < objects.length; i++)
            {
                const obj = objects[i];

                rootNode.insert(obj.frame.width + padding, obj.frame.height + padding, obj);
            }
        };

        var generateCharData = function (char, style)
        {
            const fontSize = Math.max(1, int(style.fontSize, 26));
            const lineHeight = fontSize * 1.25;

            // Start our returnobject
            const data = {
                fontSize,
                lineHeight,
                width: 0,
            };

            // Return if newline
            if (!char || (/(?:\r\n|\r|\n)/).test(char))
            { return data; }

            // Ctx font string
            const font = style.ctxFont();

            metricsContext.font = font;

            // Get char width
            data.width = Math.round(metricsContext.measureText(char).width);

            // Return if char = space
            if ((/(\s)/).test(char)) return data;

            // set canvas size (with padding so we can messure)
            const paddingY = Math.round(fontSize * 0.7); const
                paddingX = Math.max(5, Math.round(fontSize * 0.7));

            metricsCanvas.width = Math.ceil(data.width) + paddingX * 2;
            metricsCanvas.height = 1.5 * fontSize;
            const w = metricsCanvas.width; const h = metricsCanvas.height; const
                baseline = (h / 2) + (paddingY * 0.5);

            // set font again after resize
            metricsContext.font = font;

            // make sure canvas is clean
            metricsContext.clearRect(0, 0, w, h);

            // save clean state with font
            metricsContext.save();

            // convert shadow string to shadow data
            const shadowData = function (str)
            {
                const data = str.trim().split(' ');

                return {
                    color: string(data[0], '#000000'),
                    alpha: float(data[1], 0.5),
                    xOffset: float(data[2], 3),
                    yOffset: float(data[3], 3),
                    blur: float(data[4], 5),
                };
            };

            // convert fill string to fill data
            const fillData = function (str)
            {
                const data = str.trim().split(' ');
                const c = string(data[0], '#FFFFFF');
                const a = float(data[1], 1);

                return {
                    color: c,
                    alpha: a,
                    position: float(data[2], -1),
                    rgba: hexToRgba(c, a),
                };
            };

            // create fill style from fill string
            const getFillStyle = function (str)
            {
                const fills = str.split(',').filter(function (s) { return s !== ''; }); let
                    i;

                // convert to fill data
                for (i = 0; i < fills.length; i++) fills[i] = fillData(fills[i]);

                switch (fills.length)
                {
                    case 0: return 'white';
                    case 1: return fills[0].rgba ? fills[0].rgba : fills[0].color || '#FFFFFF';
                    default:
                        // make gradient
                        try
                        {
                            const gradEnd = baseline + lineHeight - fontSize;
                            const gradient = metricsContext.createLinearGradient(0, gradEnd - fontSize, 0, gradEnd);

                            for (i = 0; i < fills.length; i++)
                            { gradient.addColorStop(fills[i].position !== -1 ? fills[i].position : i / (fills.length - 1), fills[i].rgba || fills[i].color); }

                            return gradient;
                        }
                        catch (e)
                        {
                            return '#FFFFFF';
                        }
                }
            };

            // function to draw shadows
            const drawShadows = function (shadowString, stroke)
            {
                const shadows = shadowString.trim().split(',').filter(function (s) { return s !== ''; });

                if (shadows.length)
                {
                    for (let i = 0; i < shadows.length; i++)
                    {
                        const s = shadowData(shadows[i]);

                        metricsContext.globalAlpha = s.alpha;
                        metricsContext.shadowColor = s.color;
                        metricsContext.shadowOffsetX = s.xOffset + w;
                        metricsContext.shadowOffsetY = s.yOffset;
                        metricsContext.shadowBlur = s.blur;

                        if (stroke)
                        {
                            metricsContext.lineWidth = style.stroke;
                            metricsContext.strokeText(char, paddingX - w, baseline);
                        }
                        else metricsContext.fillText(char, paddingX - w, baseline);
                    }
                    metricsContext.restore();
                }
            };

            // draw text shadows
            if (style.shadow.length)
            { drawShadows(style.shadow, false); }

            // draw stroke shadows
            if (style.stroke && style.strokeShadow.length)
            {
                drawShadows(style.strokeShadow, true);
            }

            // draw text
            metricsContext.fillStyle = getFillStyle(string(style.fill, '#000000'));
            metricsContext.fillText(char, paddingX, baseline);
            metricsContext.restore();

            // draw stroke
            if (style.stroke)
            {
                metricsContext.strokeStyle = getFillStyle(string(style.strokeFill, '#000000'));
                metricsContext.lineWidth = style.stroke;
                metricsContext.strokeText(char, paddingX, baseline);
                metricsContext.restore();
            }

            // begin messuring
            const pixelData = metricsContext.getImageData(0, 0, w, h).data;

            let i = 3;
            const line = w * 4;
            const len = pixelData.length;

            // scanline on alpha
            while (i < len && !pixelData[i]) { i += 4; }
            const ascent = (i / line) | 0;

            if (i < len)
            {
                // rev scanline on alpha
                i = len - 1;
                while (i > 0 && !pixelData[i]) { i -= 4; }
                const descent = (i / line) | 0;

                // left to right scanline on alpha
                for (i = 3; i < len && !pixelData[i];)
                {
                    i += line;
                    if (i >= len) { i = (i - len) + 4; }
                }
                const minx = ((i % line) / 4) | 0;

                // right to left scanline on alpha
                let step = 1;

                for (i = len - 1; i >= 0 && !pixelData[i];)
                {
                    i -= line;
                    if (i < 0) { i = (len - 1) - (step++) * 4; }
                }
                const maxx = ((i % line) / 4) + 1 | 0;

                // set font metrics
                data.ascent = Math.round(baseline - ascent);
                data.descent = Math.round(descent - baseline);
                data.height = 1 + Math.round(descent - ascent);
                data.bounds = {
                    minx: minx - paddingX,
                    maxx: maxx - paddingX,
                    miny: 0,
                    maxy: descent - ascent,
                };
                data.rect = {
                    x: data.bounds.minx,
                    y: -data.ascent - 2,
                    width: data.bounds.maxx - data.bounds.minx + 2,
                    height: data.ascent + data.descent + 4,
                };

                // cache (for fast rearrange later)
                data.canvas = document.createElement('canvas');
                data.canvas.width = data.rect.width;
                data.canvas.height = data.rect.height;
                const c = data.canvas.getContext('2d');

                c.drawImage(metricsCanvas, -paddingX - data.rect.x, -baseline - data.rect.y);

                // reset rect position
                data.rect.x = data.rect.y = 0;
            }

            return data;
        };

        addCanvas();
    };

    // helper function for float or default
    function float(val, def)
    {
        if (isNaN(val)) return def;

        return parseFloat(val);
    }

    // helper function for int or default
    function int(val, def)
    {
        if (isNaN(val)) return def;

        return parseInt(val);
    }

    // helper function for string or default
    function string(val, def)
    {
        if (typeof val === 'string' && val.length) return val;

        return def;
    }

    // helper function to convert string hex to int or default
    function hexToInt(str, def)
    {
        if (typeof str === 'number')
        { return str; }

        const result = parseInt(str.replace('#', '0x'));

        if (isNaN(result)) return def;

        return result;
    }

    // helper function to convert hex to rgba
    function hexToRgba(hex, alpha)
    {
        const result = (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(hex);

        alpha = float(alpha, 1);

        return result ? `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)},${alpha})` : false;
    }

    function EaseBase()
    {
        this.getPosition = function (p)
        {
            return p;
        };
    }

    EaseBase.prototype.constructor = EaseBase;

    function ExponentialEase(power, easeIn, easeOut)
    {
        const pow = power;
        const t = easeIn && easeOut ? 3 : easeOut ? 1 : 2;

        this.getPosition = function (p)
        {
            let r = (t === 1) ? 1 - p : (t === 2) ? p : (p < 0.5) ? p * 2 : (1 - p) * 2;

            if (pow === 1)
            {
                r *= r;
            }
            else if (pow === 2)
            {
                r *= r * r;
            }
            else if (pow === 3)
            {
                r *= r * r * r;
            }
            else if (pow === 4)
            {
                r *= r * r * r * r;
            }

            return (t === 1) ? 1 - r : (t === 2) ? r : (p < 0.5) ? r / 2 : 1 - (r / 2);
        };
    }

    ExponentialEase.prototype = Object.create(EaseBase.prototype);
    ExponentialEase.prototype.constructor = ExponentialEase;

    const Ease = {};

    const HALF_PI = Math.PI * 0.5;

    function create(fn)
    {
        const e = Object.create(EaseBase.prototype);

        e.getPosition = fn;

        return e;
    }

    // Liear
    Ease.Linear = new EaseBase();

    // Exponetial Eases
    function wrapEase(easeInFunction, easeOutFunction, easeInOutFunction)
    {
        return {
            easeIn: easeInFunction,
            easeOut: easeOutFunction,
            easeInOut: easeInOutFunction,
        };
    }

    Ease.Power0 = {
        easeNone: Ease.Linear,
    };

    Ease.Power1 = Ease.Quad = wrapEase(
        new ExponentialEase(1, 1, 0),
        new ExponentialEase(1, 0, 1),
        new ExponentialEase(1, 1, 1));

    Ease.Power2 = Ease.Cubic = wrapEase(
        new ExponentialEase(2, 1, 0),
        new ExponentialEase(2, 0, 1),
        new ExponentialEase(2, 1, 1));

    Ease.Power3 = Ease.Quart = wrapEase(
        new ExponentialEase(3, 1, 0),
        new ExponentialEase(3, 0, 1),
        new ExponentialEase(3, 1, 1));

    Ease.Power4 = Ease.Quint = wrapEase(
        new ExponentialEase(4, 1, 0),
        new ExponentialEase(4, 0, 1),
        new ExponentialEase(4, 1, 1));

    // Bounce
    Ease.Bounce = {
        BounceIn: create(function (p)
        {
            if ((p = 1 - p) < 1 / 2.75)
            {
                return 1 - (7.5625 * p * p);
            }
            else if (p < 2 / 2.75)
            {
                return 1 - (7.5625 * (p -= 1.5 / 2.75) * p + 0.75);
            }
            else if (p < 2.5 / 2.75)
            {
                return 1 - (7.5625 * (p -= 2.25 / 2.75) * p + 0.9375);
            }

            return 1 - (7.5625 * (p -= 2.625 / 2.75) * p + 0.984375);
        }),
        BounceOut: create(function (p)
        {
            if (p < 1 / 2.75)
            {
                return 7.5625 * p * p;
            }
            else if (p < 2 / 2.75)
            {
                return 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
            }
            else if (p < 2.5 / 2.75)
            {
                return 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
            }

            return 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
        }),
        BounceInOut: create(function (p)
        {
            const invert = (p < 0.5);

            if (invert)
            {
                p = 1 - (p * 2);
            }
            else
            {
                p = (p * 2) - 1;
            }
            if (p < 1 / 2.75)
            {
                p = 7.5625 * p * p;
            }
            else if (p < 2 / 2.75)
            {
                p = 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
            }
            else if (p < 2.5 / 2.75)
            {
                p = 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
            }
            else
            {
                p = 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
            }

            return invert ? (1 - p) * 0.5 : p * 0.5 + 0.5;
        }),
    };

    // Circ
    Ease.Circ = {
        CircIn: create(function (p)
        {
            return -(Math.sqrt(1 - (p * p)) - 1);
        }),
        CircOut: create(function (p)
        {
            return Math.sqrt(1 - (p = p - 1) * p);
        }),
        CircInOut: create(function (p)
        {
            return ((p *= 2) < 1) ? -0.5 * (Math.sqrt(1 - p * p) - 1) : 0.5 * (Math.sqrt(1 - (p -= 2) * p) + 1);
        }),
    };

    // Expo
    Ease.Expo = {
        ExpoIn: create(function (p)
        {
            return Math.pow(2, 10 * (p - 1)) - 0.001;
        }),
        ExpoOut: create(function (p)
        {
            return 1 - Math.pow(2, -10 * p);
        }),
        ExpoInOut: create(function (p)
        {
            return ((p *= 2) < 1) ? 0.5 * Math.pow(2, 10 * (p - 1)) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
        }),
    };

    // Sine
    Ease.Sine = {
        SineIn: create(function (p)
        {
            return -Math.cos(p * HALF_PI) + 1;
        }),
        SineOut: create(function (p)
        {
            return Math.sin(p * HALF_PI);
        }),
        SineInOut: create(function (p)
        {
            return -0.5 * (Math.cos(Math.PI * p) - 1);
        }),
    };

    var MouseScrollEvent = /** @class */ (function () {
        function MouseScrollEvent(obj, preventDefault) {
            var _this = this;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            this.onMouseScrollImpl = function (e) {
                var _a = _this, obj = _a.obj, preventDefault = _a.preventDefault, delta = _a.delta;
                if (preventDefault) {
                    event.preventDefault();
                }
                if (typeof e.deltaX !== 'undefined') {
                    delta.set(e.deltaX, e.deltaY);
                }
                else // Firefox
                 {
                    delta.set(e.axis === 1 ? e.detail * 60 : 0, e.axis === 2 ? e.detail * 60 : 0);
                }
                _this.onMouseScroll.call(obj, event, delta);
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            this.onHoverImpl = function (e) {
                var onMouseScrollImpl = _this.onMouseScrollImpl;
                if (!_this.bound) {
                    document.addEventListener('mousewheel', onMouseScrollImpl, false);
                    document.addEventListener('DOMMouseScroll', onMouseScrollImpl, false);
                    _this.bound = true;
                }
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            this.onMouseOutImpl = function (e) {
                var onMouseScrollImpl = _this.onMouseScrollImpl;
                if (_this.bound) {
                    document.removeEventListener('mousewheel', onMouseScrollImpl);
                    document.removeEventListener('DOMMouseScroll', onMouseScrollImpl);
                    _this.bound = false;
                }
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            this.onMouseScroll = function onMouseScroll(event, delta) {
                // Default onMouseScroll.
            };
            this.bound = false;
            this.delta = new PIXI$1.Point();
            this.obj = obj;
            this.preventDefault = preventDefault;
            this.startEvent();
        }
        MouseScrollEvent.prototype.stopEvent = function () {
            var _a = this, obj = _a.obj, onMouseScrollImpl = _a.onMouseScrollImpl, onHoverImpl = _a.onHoverImpl, onMouseOutImpl = _a.onMouseOutImpl;
            if (this.bound) {
                document.removeEventListener('mousewheel', onMouseScrollImpl);
                document.removeEventListener('DOMMouseScroll', onMouseScrollImpl);
                this.bound = false;
            }
            obj.contentContainer.removeListener('mouseover', onHoverImpl);
            obj.contentContainer.removeListener('mouseout', onMouseOutImpl);
        };
        MouseScrollEvent.prototype.startEvent = function () {
            var _a = this, obj = _a.obj, onHoverImpl = _a.onHoverImpl, onMouseOutImpl = _a.onMouseOutImpl;
            obj.contentContainer.on('mouseover', onHoverImpl);
            obj.contentContainer.on('mouseout', onMouseOutImpl);
        };
        return MouseScrollEvent;
    }());

    const Interaction = {
        ClickManager,
        DragManager,
        InputController,
        MouseScrollEvent,
    };

    var Helpers = {
        Lerp: function (start, stop, amt) {
            if (amt > 1)
                amt = 1;
            else if (amt < 0)
                amt = 0;
            return start + (stop - start) * amt;
        },
        Round: function (number, decimals) {
            var pow = Math.pow(10, decimals);
            return Math.round(number * pow) / pow;
        },
        componentToHex: function (c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        },
        rgbToHex: function (r, g, b) {
            return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
        },
        rgbToNumber: function (r, g, b) {
            return r * 65536 + g * 256 + b;
        },
        numberToRgb: function (c) {
            return {
                r: Math.floor(c / (256 * 256)),
                g: Math.floor(c / 256) % 256,
                b: c % 256,
            };
        },
        hexToRgb: function (hex) {
            if (hex === null) {
                hex = 0xffffff;
            }
            if (!isNaN(hex)) {
                return this.numberToRgb(hex);
            }
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });
            var result = (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
            } : null;
        },
    };

    var _tweenItemCache = [];
    var _callbackItemCache = [];
    var _tweenObjects = {};
    var _activeTweenObjects = {};
    var _currentId = 1;
    var TweenObject = /** @class */ (function () {
        function TweenObject(object) {
            this.object = object;
            this.tweens = {};
            this.active = false;
            this.onUpdate = null;
        }
        return TweenObject;
    }());
    var CallbackItem = /** @class */ (function () {
        function CallbackItem() {
            this._ready = false;
            this.obj = null;
            this.parent = null;
            this.key = '';
            this.time = 0;
            this.callback = null;
            this.currentTime = 0;
        }
        CallbackItem.prototype.remove = function () {
            this._ready = true;
            delete this.parent.tweens[this.key];
            if (!Object.keys(this.parent.tweens).length) {
                this.parent.active = false;
                this.parent.onUpdate = null;
                delete _activeTweenObjects[this.obj._tweenObjectId];
            }
        };
        CallbackItem.prototype.set = function (obj, callback, time) {
            this.obj = obj.object;
            if (!this.obj._currentCallbackID) {
                this.obj._currentCallbackID = 1;
            }
            else {
                this.obj._currentCallbackID++;
            }
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
                this.remove();
                this.callback.call(this.parent);
            }
        };
        return CallbackItem;
    }());
    var TweenItem = /** @class */ (function () {
        function TweenItem() {
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
        TweenItem.prototype.remove = function () {
            this._ready = true;
            delete this.parent.tweens[this.key];
            if (!Object.keys(this.parent.tweens).length) {
                this.parent.active = false;
                delete _activeTweenObjects[this.obj._tweenObjectId];
            }
        };
        TweenItem.prototype.set = function (obj, key, from, to, time, ease) {
            this.isColor = isNaN(from) && from[0] === '#' || isNaN(to) && to[0] === '#';
            this.parent = obj;
            this.obj = obj.object;
            this.key = key;
            this.surfix = getSurfix(to);
            if (this.isColor) {
                this.to = Helpers.hexToRgb(to);
                this.from = Helpers.hexToRgb(from);
                this.currentColor = { r: this.from.r, g: this.from.g, b: this.from.b };
            }
            else {
                this.to = getToValue(to);
                this.from = getFromValue(from, to, this.obj, key);
            }
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
            if (this.ease) {
                this.t = this.ease.getPosition(this.t);
            }
            if (this.isColor) {
                this.currentColor.r = Math.round(Helpers.Lerp(this.from.r, this.to.r, this.t));
                this.currentColor.g = Math.round(Helpers.Lerp(this.from.g, this.to.g, this.t));
                this.currentColor.b = Math.round(Helpers.Lerp(this.from.b, this.to.b, this.t));
                this.obj[this.key] = Helpers.rgbToNumber(this.currentColor.r, this.currentColor.g, this.currentColor.b);
            }
            else {
                var val = Helpers.Lerp(this.from, this.to, this.t);
                this.obj[this.key] = this.surfix ? val + this.surfix : val;
            }
            if (this.currentTime >= this.time) {
                this.remove();
            }
        };
        return TweenItem;
    }());
    var widthKeys = ['width', 'minWidth', 'maxWidth', 'anchorLeft', 'anchorRight', 'left', 'right', 'x'];
    var heightKeys = ['height', 'minHeight', 'maxHeight', 'anchorTop', 'anchorBottom', 'top', 'bottom', 'y'];
    function getFromValue(from, to, obj, key) {
        // both number
        if (!isNaN(from) && !isNaN(to)) {
            return from;
        }
        // both percentage
        if (isNaN(from) && isNaN(to) && from.indexOf('%') !== -1 && to.indexOf('%') !== -1) {
            return parseFloat(from.replace('%', ''));
        }
        // convert from to px
        if (isNaN(from) && !isNaN(to) && from.indexOf('%') !== -1) {
            if (widthKeys.indexOf(key) !== -1) {
                return obj.parent._width * (parseFloat(from.replace('%', '')) * 0.01);
            }
            else if (heightKeys.indexOf(key) !== -1) {
                return obj.parent._height * (parseFloat(from.replace('%', '')) * 0.01);
            }
            return 0;
        }
        // convert from to percentage
        if (!isNaN(from) && isNaN(to) && to.indexOf('%') !== -1) {
            if (widthKeys.indexOf(key) !== -1) {
                return from / obj.parent._width * 100;
            }
            else if (heightKeys.indexOf(key) !== -1) {
                return from / obj.parent._height * 100;
            }
            return 0;
        }
        return 0;
    }
    function getSurfix(to) {
        if (isNaN(to) && to.indexOf('%') !== -1) {
            return '%';
        }
    }
    function getToValue(to) {
        if (!isNaN(to)) {
            return to;
        }
        if (isNaN(to) && to.indexOf('%') !== -1) {
            return parseFloat(to.replace('%', ''));
        }
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
            if (_tweenItemCache[i]._ready) {
                return _tweenItemCache[i];
            }
        }
        var tween = new TweenItem();
        _tweenItemCache.push(tween);
        return tween;
    }
    function getCallbackItem() {
        for (var i = 0; i < _callbackItemCache.length; i++) {
            if (_callbackItemCache[i]._ready) {
                return _callbackItemCache[i];
            }
        }
        var cb = new CallbackItem();
        _callbackItemCache.push(cb);
        return cb;
    }
    var Tween = {
        to: function (obj, time, params, ease) {
            var object = getObject(obj);
            var onUpdate = null;
            for (var key in params) {
                if (key === 'onComplete') {
                    var cb = getCallbackItem();
                    cb.set(object, params[key], time);
                    object.tweens[cb.key] = cb;
                    continue;
                }
                if (key === 'onUpdate') {
                    onUpdate = params[key];
                    continue;
                }
                if (time) {
                    var match = params[key] === obj[key];
                    if (typeof obj[key] === 'undefined')
                        continue;
                    if (match) {
                        if (object.tweens[key])
                            object.tweens[key].remove();
                    }
                    else {
                        if (!object.tweens[key]) {
                            object.tweens[key] = getTweenItem();
                        }
                        object.tweens[key].set(object, key, obj[key], params[key], time, ease);
                    }
                }
            }
            if (time) {
                object.onUpdate = onUpdate;
            }
            else
                this.set(obj, params);
        },
        from: function (obj, time, params, ease) {
            var object = getObject(obj);
            var onUpdate = null;
            for (var key in params) {
                if (key === 'onComplete') {
                    var cb = getCallbackItem();
                    cb.set(object, params[key], time);
                    object.tweens[cb.key] = cb;
                    continue;
                }
                if (key === 'onUpdate') {
                    onUpdate = params[key];
                    continue;
                }
                if (time) {
                    var match = params[key] == obj[key];
                    if (typeof obj[key] === 'undefined')
                        continue;
                    if (match) {
                        if (object.tweens[key])
                            object.tweens[key].remove();
                    }
                    else {
                        if (!object.tweens[key]) {
                            object.tweens[key] = getTweenItem();
                        }
                        object.tweens[key].set(object, key, params[key], obj[key], time, ease);
                    }
                }
            }
            if (time) {
                object.onUpdate = onUpdate;
            }
            else
                this.set(obj, params);
        },
        fromTo: function (obj, time, paramsFrom, paramsTo, ease) {
            var object = getObject(obj);
            var onUpdate = null;
            for (var key in paramsTo) {
                if (key === 'onComplete') {
                    var cb = getCallbackItem();
                    cb.set(object, paramsTo[key], time);
                    object.tweens[cb.key] = cb;
                    continue;
                }
                if (key === 'onUpdate') {
                    onUpdate = paramsTo[key];
                    continue;
                }
                if (time) {
                    var match = paramsFrom[key] == paramsTo[key];
                    if (typeof obj[key] === 'undefined' || typeof paramsFrom[key] === 'undefined')
                        continue;
                    if (match) {
                        if (object.tweens[key])
                            object.tweens[key].remove();
                        obj[key] = paramsTo[key];
                    }
                    else {
                        if (!object.tweens[key]) {
                            object.tweens[key] = getTweenItem();
                        }
                        object.tweens[key].set(object, key, paramsFrom[key], paramsTo[key], time, ease);
                    }
                }
            }
            if (time) {
                object.onUpdate = onUpdate;
            }
            else
                this.set(obj, paramsTo);
        },
        set: function (obj, params) {
            var object = getObject(obj);
            for (var key in params) {
                if (typeof obj[key] === 'undefined')
                    continue;
                if (object.tweens[key])
                    object.tweens[key].remove();
                obj[key] = params[key];
            }
        },
        _update: function (delta) {
            for (var id in _activeTweenObjects) {
                var object = _activeTweenObjects[id];
                for (var key in object.tweens) {
                    object.tweens[key].update(delta);
                }
                if (object.onUpdate) {
                    object.onUpdate.call(object.object, delta);
                }
            }
        },
    };

    /**
    * An UI Slider, the default width/height is 90%
    *
    * @class
    * @extends Widget
    * @memberof PIXI.UI
    * @param options {Object} Slider settings
    * @param options.track {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)}  Any type of UIOBject, will be used for the slider track
    * @param options.handle {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as slider handle
    * @param [options.fill=null] {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used for slider fill
    * @param [options.vertical=false] {boolean} Direction of the slider
    * @param [options.value=0] {number} value of the slider
    * @param [options.minValue=0] {number} minimum value
    * @param [options.maxValue=100] {number} max value
    * @param [options.decimals=0] {boolean} the decimal precision (use negative to round tens and hundreds)
    * @param [options.onValueChange=null] {callback} Callback when the value has changed
    * @param [options.onValueChanging=null] {callback} Callback while the value is changing
    */
    var Slider = /** @class */ (function (_super) {
        __extends(Slider, _super);
        function Slider(options) {
            var _this = _super.call(this, 0, 0) || this;
            _this._amt = 0;
            _this._disabled = false;
            // set options
            _this.track = options.track;
            _this.handle = options.handle;
            _this.fill = options.fill || null;
            _this._minValue = options.minValue || 0;
            _this._maxValue = options.maxValue || 100;
            _this.decimals = options.decimals || 0;
            _this.vertical = options.vertical || false;
            _this.onValueChange = options.onValueChange || null;
            _this.onValueChanging = options.onValueChanging || null;
            _this.value = options.value || 50;
            _this.handle.pivot = 0.5;
            _this.addChild(_this.track);
            if (_this.fill) {
                _this.track.addChild(_this.fill);
            }
            _this.addChild(_this.handle);
            _this.handle.contentContainer.buttonMode = true;
            if (_this.vertical) {
                _this.height = '100%';
                _this.width = _this.track.width;
                _this.track.height = '100%';
                _this.handle.horizontalAlign = 'center';
                if (_this.fill) {
                    _this.fill.horizontalAlign = 'center';
                }
            }
            else {
                _this.width = '100%';
                _this.height = _this.track.height;
                _this.track.width = '100%';
                _this.handle.verticalAlign = 'middle';
                if (_this.fill) {
                    _this.fill.verticalAlign = 'middle';
                }
            }
            return _this;
        }
        Slider.prototype.update = function (soft) {
            if (soft === void 0) { soft = 0; }
            var handleSize;
            var val;
            if (this.vertical) {
                handleSize = this.handle._height || this.handle.contentContainer.height;
                val = ((this._height - handleSize) * this._amt) + (handleSize * 0.5);
                if (soft) {
                    Tween.to(this.handle, 0.3, { top: val }, Ease.Power2.easeOut);
                    if (this.fill)
                        Tween.to(this.fill, 0.3, { height: val }, Ease.Power2.easeOut);
                }
                else {
                    Tween.set(this.handle, { top: val });
                    if (this.fill)
                        Tween.set(this.fill, { height: val });
                }
            }
            else {
                handleSize = this.handle._width || this.handle.contentContainer.width;
                val = ((this._width - handleSize) * this._amt) + (handleSize * 0.5);
                if (soft) {
                    Tween.to(this.handle, 0.3, { left: val }, Ease.Power2.easeOut);
                    if (this.fill)
                        Tween.to(this.fill, 0.3, { width: val }, Ease.Power2.easeOut);
                }
                else {
                    Tween.set(this.handle, { left: val });
                    if (this.fill)
                        Tween.set(this.fill, { width: val });
                }
            }
        };
        Slider.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);
            var localMousePosition = new PIXI$1.Point();
            var startValue = 0;
            var maxPosition;
            var triggerValueChange = function () {
                _this.emit('change', _this.value);
                if (_this._lastChange != _this.value) {
                    _this._lastChange = _this.value;
                    if (typeof _this.onValueChange === 'function') {
                        _this.onValueChange(_this.value);
                    }
                }
            };
            var triggerValueChanging = function () {
                _this.emit('changing', _this.value);
                if (_this._lastChanging != _this.value) {
                    _this._lastChanging = _this.value;
                    if (typeof _this.onValueChanging === 'function') {
                        _this.onValueChanging(_this.value);
                    }
                }
            };
            var updatePositionToMouse = function (mousePosition, soft) {
                _this.track.contentContainer.toLocal(mousePosition, null, localMousePosition, true);
                var newPos = _this.vertical ? localMousePosition.y - _this.handle._height * 0.5 : localMousePosition.x - _this.handle._width * 0.5;
                var maxPos = _this.vertical ? _this._height - _this.handle._height : _this._width - _this.handle._width;
                _this._amt = !maxPos ? 0 : Math.max(0, Math.min(1, newPos / maxPos));
                _this.update(soft);
                triggerValueChanging();
            };
            // //Handle dragging
            var handleDrag = new DragManager(this.handle);
            handleDrag.onPress = function (event, isPressed) {
                event.stopPropagation();
            };
            handleDrag.onDragStart = function (event) {
                startValue = _this._amt;
                maxPosition = _this.vertical ? _this._height - _this.handle._height : _this._width - _this.handle._width;
            };
            handleDrag.onDragMove = function (event, offset) {
                _this._amt = !maxPosition ? 0 : Math.max(0, Math.min(1, startValue + ((_this.vertical ? offset.y : offset.x) / maxPosition)));
                triggerValueChanging();
                _this.update();
            };
            handleDrag.onDragEnd = function () {
                triggerValueChange();
                this.update();
            };
            // Bar pressing/dragging
            var trackDrag = new DragManager(this.track);
            trackDrag.onPress = function (event, isPressed) {
                if (isPressed) {
                    updatePositionToMouse(event.data.global, true);
                }
                event.stopPropagation();
            };
            trackDrag.onDragMove = function (event) {
                updatePositionToMouse(event.data.global, false);
            };
            trackDrag.onDragEnd = function () {
                triggerValueChange();
            };
        };
        Object.defineProperty(Slider.prototype, "value", {
            get: function () {
                return Helpers.Round(Helpers.Lerp(this._minValue, this._maxValue, this._amt), this.decimals);
            },
            set: function (val) {
                this._amt = (Math.max(this._minValue, Math.min(this._maxValue, val)) - this._minValue) / (this._maxValue - this._minValue);
                if (typeof this.onValueChange === 'function') {
                    this.onValueChange(this.value);
                }
                if (typeof this.onValueChanging === 'function') {
                    this.onValueChanging(this.value);
                }
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "minValue", {
            get: function () {
                return this._minValue;
            },
            set: function (val) {
                this._minValue = val;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "maxValue", {
            get: function () {
                return this._maxValue;
            },
            set: function (val) {
                this._maxValue = val;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "disabled", {
            get: function () {
                return this._disabled;
            },
            set: function (val) {
                if (val !== this._disabled) {
                    this._disabled = val;
                    this.handle.contentContainer.buttonMode = !val;
                    this.handle.contentContainer.interactive = !val;
                    this.track.contentContainer.interactive = !val;
                }
            },
            enumerable: true,
            configurable: true
        });
        return Slider;
    }(Widget));

    /**
     * An UI scrollbar to control a ScrollingContainer
     *
     * @class
     * @extends PIXI.UI.Slider
     * @memberof PIXI.UI
     * @param options {Object} ScrollBar settings
     * @param options.track {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)}  Any type of UIOBject, will be used for the scrollbar track
     * @param options.handle {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as scrollbar handle
     * @param options.scrollingContainer {PIXI.UI.ScrollingContainer} The container to control
     * @param [options.vertical=false] {boolean} Direction of the scrollbar
     * @param [options.autohide=false] {boolean} Hides the scrollbar when not needed
     */
    var ScrollBar = /** @class */ (function (_super) {
        __extends(ScrollBar, _super);
        function ScrollBar(options) {
            var _this = _super.call(this, {
                track: options.track,
                handle: options.handle,
                fill: null,
                vertical: options.vertical,
            }) || this;
            _this.scrollingContainer = options.scrollingContainer;
            _this.autohide = options.autohide;
            _this._hidden = false;
            return _this;
        }
        ScrollBar.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);
            this.decimals = 3; // up decimals to trigger ValueChanging more often
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            this.onValueChanging = function (val) {
                var sizeAmt = _this.scrollingContainer._height / _this.scrollingContainer.innerContainer.height || 0.001;
                if (sizeAmt < 1) {
                    _this.scrollingContainer.forcePctPosition(_this.vertical ? 'y' : 'x', _this._amt);
                }
            };
            this.scrollingContainer._scrollBars.push(this);
        };
        ScrollBar.prototype.alignToContainer = function () {
            var newPos;
            var size;
            var xY = this.vertical ? 'y' : 'x';
            var widthHeight = this.vertical ? 'height' : 'width';
            var topLeft = this.vertical ? 'top' : 'left';
            var _posAmt = !this.scrollingContainer.innerContainer[widthHeight]
                ? 0
                : -(this.scrollingContainer.innerContainer[xY] / this.scrollingContainer.innerContainer[widthHeight]);
            var sizeAmt = !this.scrollingContainer.innerContainer[widthHeight]
                ? 1
                : this.scrollingContainer["_" + widthHeight] / this.scrollingContainer.innerContainer[widthHeight];
            // update amt
            var diff = this.scrollingContainer.innerContainer[widthHeight] - this.scrollingContainer["_" + widthHeight];
            this._amt = !this.scrollingContainer["_" + widthHeight] || !diff
                ? 0
                : -(this.scrollingContainer.innerContainer[xY] / diff);
            if (sizeAmt >= 1) {
                size = this["_" + widthHeight];
                this.handle[topLeft] = size * 0.5;
                this.toggleHidden(true);
            }
            else {
                size = this["_" + widthHeight] * sizeAmt;
                if (this._amt > 1) {
                    size -= (this["_" + widthHeight] - size) * (this._amt - 1);
                }
                else if (this._amt < 0) {
                    size -= (this["_" + widthHeight] - size) * -this._amt;
                }
                if (this._amt < 0) {
                    newPos = size * 0.5;
                }
                else if (this._amt > 1) {
                    newPos = this["_" + widthHeight] - (size * 0.5);
                }
                else {
                    newPos = (_posAmt * this.scrollingContainer["_" + widthHeight]) + (size * 0.5);
                }
                this.handle[topLeft] = newPos;
                this.toggleHidden(false);
            }
            this.handle[widthHeight] = size;
        };
        ScrollBar.prototype.toggleHidden = function (hidden) {
            if (this.autohide) {
                if (hidden && !this._hidden) {
                    Tween.to(this, 0.2, { alpha: 0 });
                    this._hidden = true;
                }
                else if (!hidden && this._hidden) {
                    Tween.to(this, 0.2, { alpha: 1 });
                    this._hidden = false;
                }
            }
        };
        return ScrollBar;
    }(Slider));

    var Ticker$1 = /** @class */ (function (_super) {
        __extends(Ticker, _super);
        function Ticker(autoStart) {
            var _this = _super.call(this) || this;
            _this._disabled = true;
            _this._now = 0;
            _this.DeltaTime = 0;
            _this.Time = performance.now();
            _this.Ms = 0;
            if (autoStart) {
                _this.disabled = false;
            }
            Ticker.shared = _this;
            return _this;
        }
        Object.defineProperty(Ticker.prototype, "disabled", {
            get: function () {
                return this._disabled;
            },
            set: function (val) {
                if (!this._disabled) {
                    this._disabled = true;
                }
                else {
                    this._disabled = false;
                    Ticker.shared = this;
                    this.update(performance.now(), true);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Updates the text
         *
         * @private
         */
        Ticker.prototype.update = function (time) {
            Ticker.shared._now = time;
            Ticker.shared.Ms = Ticker.shared._now - Ticker.shared.Time;
            Ticker.shared.Time = Ticker.shared._now;
            Ticker.shared.DeltaTime = Ticker.shared.Ms * 0.001;
            Ticker.shared.emit('update', Ticker.shared.DeltaTime);
            Tween._update(Ticker.shared.DeltaTime);
            if (!Ticker.shared._disabled) {
                requestAnimationFrame(Ticker.shared.update);
            }
        };
        Ticker.on = function (event, fn, context) {
            Ticker.shared.on(event, fn, context);
        };
        Ticker.once = function (event, fn, context) {
            Ticker.shared.once(event, fn, context);
        };
        Ticker.removeListener = function (event, fn) {
            Ticker.shared.removeListener(event, fn);
        };
        return Ticker;
    }(PIXI$1.utils.EventEmitter));
    Ticker$1.shared = new Ticker$1(true);

    /**
     * `ScrollWidget` masks its contents to its layout bounds and translates
     * its children when scrolling.
     *
     * @namespace PUXI
     * @class
     * @extends PUXI.InteractiveGroup
     */
    var ScrollWidget = /** @class */ (function (_super) {
        __extends(ScrollWidget, _super);
        /**
         * @param {PUXI.IScrollingContainerOptions} options
         * @param [options.scrollX=false] {Boolean} Enable horizontal scrolling
         * @param [options.scrollY=false] {Boolean} Enable vertical scrolling
         * @param [options.dragScrolling=true] {Boolean} Enable mousedrag scrolling
         * @param [options.softness=0.5] {Number} (0-1) softness of scrolling
         * @param [options.width=0] {Number|String} container width
         * @param [options.height=0] {Number} container height
         * @param [options.radius=0] {Number} corner radius of clipping mask
         * @param [options.expandMask=0] {Number} mask expand (px)
         * @param [options.overflowY=0] {Number} how much can be scrolled past content dimensions
         * @param [options.overflowX=0] {Number} how much can be scrolled past content dimensions
         */
        function ScrollWidget(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this) || this;
            _this.forcePctPosition = function (direction, pct) {
                var bounds = _this.getInnerBounds();
                var container = _this.innerContainer.insetContainer;
                if (_this.scrollX && direction === 'x') {
                    container.position[direction] = -((bounds.width - _this.width) * pct);
                }
                if (_this.scrollY && direction === 'y') {
                    container.position[direction] = -((bounds.height - _this.height) * pct);
                }
                _this.scrollPosition[direction] = _this.targetPosition[direction] = container.position[direction];
            };
            _this.focusPosition = function (pos) {
                var bounds = _this.getInnerBounds();
                var container = _this.innerContainer.insetContainer;
                var dif;
                if (_this.scrollX) {
                    var x = Math.max(0, (Math.min(bounds.width, pos.x)));
                    if (x + container.x > _this.width) {
                        dif = x - _this.width;
                        container.x = -dif;
                    }
                    else if (x + container.x < 0) {
                        dif = x + container.x;
                        container.x -= dif;
                    }
                }
                if (_this.scrollY) {
                    var y = Math.max(0, (Math.min(bounds.height, pos.y)));
                    if (y + container.y > _this.height) {
                        dif = y - _this.height;
                        container.y = -dif;
                    }
                    else if (y + container.y < 0) {
                        dif = y + container.y;
                        container.y -= dif;
                    }
                }
                _this.lastPosition.copyFrom(container.position);
                _this.targetPosition.copyFrom(container.position);
                _this.scrollPosition.copyFrom(container.position);
                _this.updateScrollBars();
            };
            _this.setScrollPosition = function (velocity) {
                if (velocity) {
                    _this.scrollVelocity.copyFrom(velocity);
                }
                var container = _this.innerContainer.insetContainer;
                if (!_this.animating) {
                    _this.animating = true;
                    _this.lastPosition.copyFrom(container.position);
                    _this.targetPosition.copyFrom(container.position);
                    Ticker$1.on('update', _this.updateScrollPosition, _this);
                }
            };
            _this.updateScrollPosition = function (delta) {
                _this.stop = true;
                if (_this.scrollX) {
                    _this.updateDirection('x', delta);
                }
                if (_this.scrollY) {
                    _this.updateDirection('y', delta);
                }
                if (stop) {
                    Ticker$1.removeListener('update', _this.updateScrollPosition);
                    _this.animating = false;
                }
            };
            _this.updateDirection = function (direction, delta) {
                var bounds = _this.getInnerBounds();
                var _a = _this, scrollPosition = _a.scrollPosition, scrollVelocity = _a.scrollVelocity, targetPosition = _a.targetPosition, lastPosition = _a.lastPosition;
                var container = _this.innerContainer.insetContainer;
                var min;
                if (direction === 'y') {
                    min = Math.round(Math.min(0, _this.height - bounds.height));
                }
                else {
                    min = Math.round(Math.min(0, _this.width - bounds.width));
                }
                if (!_this.scrolling && Math.round(scrollVelocity[direction]) !== 0) {
                    targetPosition[direction] += scrollVelocity[direction];
                    scrollVelocity[direction] = Helpers.Lerp(scrollVelocity[direction], 0, (5 + 2.5 / Math.max(_this.softness, 0.01)) * delta);
                    if (targetPosition[direction] > 0) {
                        targetPosition[direction] = 0;
                    }
                    else if (targetPosition[direction] < min) {
                        targetPosition[direction] = min;
                    }
                }
                if (!_this.scrolling
                    && Math.round(scrollVelocity[direction]) === 0
                    && (container[direction] > 0
                        || container[direction] < min)) {
                    var target = _this.scrollPosition[direction] > 0 ? 0 : min;
                    scrollPosition[direction] = Helpers.Lerp(scrollPosition[direction], target, (40 - (30 * _this.softness)) * delta);
                    _this.stop = false;
                }
                else if (_this.scrolling || Math.round(scrollVelocity[direction]) !== 0) {
                    if (_this.scrolling) {
                        scrollVelocity[direction] = _this.scrollPosition[direction] - lastPosition[direction];
                        lastPosition.copyFrom(scrollPosition);
                    }
                    if (targetPosition[direction] > 0) {
                        scrollVelocity[direction] = 0;
                        scrollPosition[direction] = 100 * _this.softness * (1 - Math.exp(targetPosition[direction] / -200));
                    }
                    else if (targetPosition[direction] < min) {
                        scrollVelocity[direction] = 0;
                        scrollPosition[direction] = min - (100 * _this.softness * (1 - Math.exp((min - targetPosition[direction]) / -200)));
                    }
                    else {
                        scrollPosition[direction] = targetPosition[direction];
                    }
                    _this.stop = false;
                }
                container.position[direction] = Math.round(scrollPosition[direction]);
                _this.updateScrollBars();
            };
            _this.mask = new PIXI$1.Graphics();
            _this.innerContainer = new InteractiveGroup();
            _this.innerBounds = new PIXI$1.Rectangle();
            _super.prototype.addChild.call(_this, _this.innerContainer);
            _this.contentContainer.addChild(_this.mask);
            _this.contentContainer.mask = _this.mask;
            _this.scrollX = options.scrollX !== undefined ? options.scrollX : false;
            _this.scrollY = options.scrollY !== undefined ? options.scrollY : false;
            _this.dragScrolling = options.dragScrolling !== undefined ? options.dragScrolling : true;
            _this.softness = options.softness !== undefined ? Math.max(Math.min(options.softness || 0, 1), 0) : 0.5;
            _this.radius = options.radius || 0;
            _this.expandMask = options.expandMask || 0;
            _this.overflowY = options.overflowY || 0;
            _this.overflowX = options.overflowX || 0;
            _this.scrollPosition = new PIXI$1.Point();
            _this.scrollVelocity = new PIXI$1.Point();
            _this.targetPosition = new PIXI$1.Point();
            _this.lastPosition = new PIXI$1.Point();
            _this.animating = false;
            _this.scrolling = false;
            _this._scrollBars = [];
            _this.boundCached = performance.now() - 1000;
            _this.initScrolling();
            return _this;
        }
        ScrollWidget.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            if (this.scrollX || this.scrollY) {
                this.initScrolling();
            }
        };
        ScrollWidget.prototype.update = function () {
            _super.prototype.update.call(this);
            if (this.lastWidth !== this.width || this.lastHeight !== this.height) {
                var of = this.expandMask;
                this.mask.clear();
                this.mask.lineStyle(0);
                this.mask.beginFill(0xFFFFFF, 1);
                if (this.radius === 0) {
                    this.mask.drawRect(-of, -of, this.width + of, this.height + of);
                }
                else {
                    this.mask.drawRoundedRect(-of, -of, this.width + of, this.height + of, this.radius);
                }
                this.mask.endFill();
                this.lastWidth = this.width;
                this.lastHeight = this.height;
            }
            this.setScrollPosition();
        };
        ScrollWidget.prototype.addChild = function () {
            var newChildren = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                newChildren[_i] = arguments[_i];
            }
            for (var i = 0; i < newChildren.length; i++) {
                this.innerContainer.addChild(newChildren[i]);
            }
            this.getInnerBounds(true); // make sure bounds is updated instantly when a child is added
            return this;
        };
        ScrollWidget.prototype.updateScrollBars = function () {
            for (var i = 0; i < this._scrollBars.length; i++) {
                this._scrollBars[i].alignToContainer();
            }
        };
        ScrollWidget.prototype.getInnerBounds = function (force) {
            // this is a temporary fix, because we cant rely on innercontainer height if the children is positioned > 0 y.
            if (force || performance.now() - this.boundCached > 1000) {
                this.innerContainer.insetContainer.getLocalBounds(this.innerBounds);
                this.innerContainer.insetContainer.getLocalBounds(this.innerBounds);
                this.innerBounds.height = this.innerBounds.y + this.innerContainer.height;
                this.innerBounds.width = this.innerBounds.x + this.innerContainer.width;
                this.boundCached = performance.now();
            }
            return this.innerBounds;
        };
        ScrollWidget.prototype.initScrolling = function () {
            var _this = this;
            var container = this.innerContainer.insetContainer;
            var containerStart = new PIXI$1.Point();
            var _a = this, scrollPosition = _a.scrollPosition, targetPosition = _a.targetPosition;
            // Drag scroll
            if (this.dragScrolling) {
                var drag = new DragManager(this);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                drag.onDragStart = function (e) {
                    if (!_this.scrolling) {
                        containerStart.copyFrom(container.position);
                        scrollPosition.copyFrom(container.position);
                        _this.scrolling = true;
                        _this.setScrollPosition();
                        _this.emit('dragStart', e);
                    }
                };
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                drag.onDragMove = function (e, offset) {
                    if (_this.scrollX) {
                        targetPosition.x = containerStart.x + offset.x;
                    }
                    if (_this.scrollY) {
                        targetPosition.y = containerStart.y + offset.y;
                    }
                };
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                drag.onDragEnd = function (e) {
                    if (_this.scrolling) {
                        _this.scrolling = false;
                        _this.emit('dragEnd', e);
                    }
                };
            }
            // Mouse scroll
            var scrollSpeed = new PIXI$1.Point();
            var scroll = new MouseScrollEvent(this, true);
            scroll.onMouseScroll = function (e, delta) {
                scrollSpeed.set(-delta.x * 0.2, -delta.y * 0.2);
                _this.setScrollPosition(scrollSpeed);
            };
            this.updateScrollBars();
        };
        return ScrollWidget;
    }(InteractiveGroup));

    /**
     * An UI Container object
     *
     * @class
     * @extends PIXI.UI.UIBase
     * @memberof PIXI.UI
     * @param desc {Boolean} Sort the list descending
     * @param tweenTime {Number} if above 0 the sort will be animated
     * @param tweenEase {PIXI.UI.Ease} ease method used for animation
     */
    var SortableList = /** @class */ (function (_super) {
        __extends(SortableList, _super);
        function SortableList(desc, tweenTime, tweenEase) {
            var _this = _super.call(this, 0, 0) || this;
            _this.desc = typeof desc !== 'undefined' ? desc : false;
            _this.tweenTime = tweenTime || 0;
            _this.tweenEase = tweenEase;
            _this.items = [];
            return _this;
        }
        SortableList.prototype.addChild = function (UIObject, fnValue, fnThenBy) {
            _super.prototype.addChild.call(this, UIObject);
            if (this.items.indexOf(UIObject) === -1) {
                this.items.push(UIObject);
            }
            if (typeof fnValue === 'function') {
                UIObject._sortListValue = fnValue;
            }
            if (typeof fnThenBy === 'function') {
                UIObject._sortListThenByValue = fnThenBy;
            }
            if (!UIObject._sortListRnd) {
                UIObject._sortListRnd = Math.random();
            }
            this.sort();
        };
        SortableList.prototype.removeChild = function (UIObject) {
            if (arguments.length > 1) {
                for (var i = 0; i < arguments.length; i++) {
                    this.removeChild(arguments[i]);
                }
            }
            else {
                _super.prototype.removeChild.call(this, UIObject);
                var index = this.items.indexOf(UIObject);
                if (index !== -1) {
                    this.items.splice(index, 1);
                }
                this.sort();
            }
        };
        SortableList.prototype.sort = function (instant) {
            var _this = this;
            if (instant === void 0) { instant = false; }
            clearTimeout(this._sortTimeout);
            if (instant) {
                this._sort();
                return;
            }
            this._sortTimeout = setTimeout(function () { _this._sort(); }, 0);
        };
        SortableList.prototype._sort = function () {
            var _this = this;
            var desc = this.desc;
            var y = 0;
            var alt = true;
            this.items.sort(function (a, b) {
                var res = a._sortListValue() < b._sortListValue() ? desc ? 1 : -1
                    : a._sortListValue() > b._sortListValue() ? desc ? -1 : 1 : 0;
                if (res === 0 && a._sortListThenByValue && b._sortListThenByValue) {
                    res = a._sortListThenByValue() < b._sortListThenByValue() ? desc ? 1 : -1
                        : a._sortListThenByValue() > b._sortListThenByValue() ? desc ? -1 : 1 : 0;
                }
                if (res === 0) {
                    res = a._sortListRnd > b._sortListRnd ? 1
                        : a._sortListRnd < b._sortListRnd ? -1 : 0;
                }
                return res;
            });
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                alt = !alt;
                if (this.tweenTime > 0) {
                    Tween.fromTo(item, this.tweenTime, { x: item.x, y: item.y }, { x: 0, y: y }, this.tweenEase);
                }
                else {
                    item.x = 0;
                    item.y = y;
                }
                y += item.height;
                if (typeof item.altering === 'function') {
                    item.altering(alt);
                }
            }
            // force it to update parents when sort animation is done (prevent scrolling container bug)
            if (this.tweenTime > 0) {
                setTimeout(function () {
                    _this.updatesettings(false, true);
                }, this.tweenTime * 1000);
            }
        };
        return SortableList;
    }(InteractiveGroup));

    /**
     * A sliced sprite with dynamic width and height.
     *
     * @class
     * @memberof PIXI.UI
     * @param Texture {PIXI.Texture} the texture for this SliceSprite
     * @param BorderWidth {Number} Width of the sprite borders
     * @param horizontalSlice {Boolean} Slice the sprite horizontically
     * @param verticalSlice {Boolean} Slice the sprite vertically
     * @param [tile=false] {Boolean} tile or streach
     */
    var SliceSprite = /** @class */ (function (_super) {
        __extends(SliceSprite, _super);
        function SliceSprite(texture, borderWidth, horizontalSlice, verticalSlice, tile) {
            var _this = _super.call(this, texture.width, texture.height) || this;
            _this.bw = borderWidth || 5;
            _this.vs = typeof verticalSlice !== 'undefined' ? verticalSlice : true;
            _this.hs = typeof horizontalSlice !== 'undefined' ? horizontalSlice : true;
            _this.t = texture.baseTexture;
            _this.f = texture.frame;
            _this.tile = tile;
            if (_this.hs) {
                _this.setting.minWidth = borderWidth * 2;
            }
            if (_this.vs) {
                _this.setting.minHeight = borderWidth * 2;
            }
            /**
         * Updates the sliced sprites position and size
         *
         * @private
         */
            _this.update = function () {
                if (!this.initialized)
                    return;
                if (vs && hs) {
                    str.x = sbr.x = sr.x = this._width - bw;
                    sbl.y = sbr.y = sb.y = this._height - bw;
                    sf.width = st.width = sb.width = this._width - bw * 2;
                    sf.height = sl.height = sr.height = this._height - bw * 2;
                }
                else if (hs) {
                    sr.x = this._width - bw;
                    sl.height = sr.height = sf.height = this._height;
                    sf.width = this._width - bw * 2;
                }
                else { // vs
                    sb.y = this._height - bw;
                    st.width = sb.width = sf.width = this._width;
                    sf.height = this._height - bw * 2;
                }
                if (this.tint !== null) {
                    sf.tint = this.tint;
                    if (vs && hs)
                        stl.tint = str.tint = sbl.tint = sbr.tint = this.tint;
                    if (hs)
                        sl.tint = sr.tint = this.tint;
                    if (vs)
                        st.tint = sb.tint = this.tint;
                }
                if (this.blendMode !== null) {
                    sf.blendMode = this.blendMode;
                    if (vs && hs)
                        stl.blendMode = str.blendMode = sbl.blendMode = sbr.blendMode = this.blendMode;
                    if (hs)
                        sl.blendMode = sr.blendMode = this.blendMode;
                    if (vs)
                        st.blendMode = sb.blendMode = this.blendMode;
                }
            };
            return _this;
        }
        SliceSprite.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            var _a = this, f = _a.f, bw = _a.bw;
            // get frames
            if (this.vs && this.hs) {
                this.ftl = new PIXI$1.Rectangle(f.x, f.y, bw, bw);
                this.ftr = new PIXI$1.Rectangle(f.x + f.width - bw, f.y, bw, bw);
                this.fbl = new PIXI$1.Rectangle(f.x, f.y + f.height - bw, bw, bw);
                this.fbr = new PIXI$1.Rectangle(f.x + f.width - bw, f.y + f.height - bw, bw, bw);
                this.ft = new PIXI$1.Rectangle(f.x + bw, f.y, f.width - bw * 2, bw);
                this.fb = new PIXI$1.Rectangle(f.x + bw, f.y + f.height - bw, f.width - bw * 2, bw);
                this.fl = new PIXI$1.Rectangle(f.x, f.y + bw, bw, f.height - bw * 2);
                this.fr = new PIXI$1.Rectangle(f.x + f.width - bw, f.y + bw, bw, f.height - bw * 2);
                this.ff = new PIXI$1.Rectangle(f.x + bw, f.y + bw, f.width - bw * 2, f.height - bw * 2);
            }
            else if (this.hs) {
                this.fl = new PIXI$1.Rectangle(this.f.x, f.y, bw, f.height);
                this.fr = new PIXI$1.Rectangle(f.x + f.width - bw, f.y, bw, f.height);
                this.ff = new PIXI$1.Rectangle(f.x + bw, f.y, f.width - bw * 2, f.height);
            }
            else { // vs
                this.ft = new PIXI$1.Rectangle(f.x, f.y, f.width, bw);
                this.fb = new PIXI$1.Rectangle(f.x, f.y + f.height - bw, f.width, bw);
                this.ff = new PIXI$1.Rectangle(f.x, f.y + bw, f.width, f.height - bw * 2);
            }
            // TODO: swap frames if rotation
            var _b = this, t = _b.t, ff = _b.ff, fl = _b.fl, fr = _b.fr, ft = _b.ft, fb = _b.fb;
            // make sprites
            this.sf = this.tile
                ? new PIXI$1.extras.TilingSprite(new PIXI$1.Texture(t, ff))
                : new PIXI$1.Sprite(new PIXI$1.Texture(t, ff));
            this.contentContainer.addChildAt(this.sf, 0);
            if (this.vs && this.hs) {
                this.stl = new PIXI$1.Sprite(new PIXI$1.Texture(t, this.ftl));
                this.str = new PIXI$1.Sprite(new PIXI$1.Texture(t, this.ftr));
                this.sbl = new PIXI$1.Sprite(new PIXI$1.Texture(t, this.fbl));
                this.sbr = new PIXI$1.Sprite(new PIXI$1.Texture(t, this.fbr));
                this.contentContainer.addChildAt(this.stl, 0);
                this.contentContainer.addChildAt(this.str, 0);
                this.contentContainer.addChildAt(this.sbl, 0);
                this.contentContainer.addChildAt(this.sbr, 0);
            }
            if (hs) {
                this.sl = this.tile
                    ? new PIXI$1.extras.TilingSprite(new PIXI$1.Texture(t, fl))
                    : new PIXI$1.Sprite(new PIXI$1.Texture(t, fl));
                this.sr = this.tile
                    ? new PIXI$1.extras.TilingSprite(new PIXI$1.Texture(t, fr))
                    : new PIXI$1.Sprite(new PIXI$1.Texture(t, fr));
                this.contentContainer.addChildAt(this.sl, 0);
                this.contentContainer.addChildAt(this.sr, 0);
            }
            if (this.vs) {
                this.st = this.tile
                    ? new PIXI$1.extras.TilingSprite(new PIXI$1.Texture(t, ft))
                    : new PIXI$1.Sprite(new PIXI$1.Texture(t, ft));
                this.sb = this.tile
                    ? new PIXI$1.extras.TilingSprite(new PIXI$1.Texture(t, fb))
                    : new PIXI$1.Sprite(new PIXI$1.Texture(t, fb));
                this.contentContainer.addChildAt(this.st, 0);
                this.contentContainer.addChildAt(this.sb, 0);
            }
            // set constant position and sizes
            if (this.vs && this.hs) {
                this.st.x = bw;
                this.sb.x = bw;
                this.sl.y = bw;
                this.sr.y = bw;
                this.stl.width = bw;
                this.str.width = bw;
                this.sbl.width = bw;
                this.sbr.width = bw;
                this.stl.height = bw;
                this.str.height = bw;
                this.sbl.height = bw;
                this.sbr.height = bw;
            }
            if (this.hs) {
                this.sf.x = this.sl.width = this.sr.width = bw;
            }
            if (this.vs) {
                this.sf.y = this.st.height = this.sb.height = bw;
            }
        };
        SliceSprite.prototype.update = function () {
            // NO updates
        };
        return SliceSprite;
    }(Widget));

    /**
     * An UI sprite object
     *
     * @class
     * @extends PIXI.UI.UIBase
     * @memberof PIXI.UI
     * @param Texture {PIXI.Texture} The texture for the sprite
     */
    var Sprite = /** @class */ (function (_super) {
        __extends(Sprite, _super);
        function Sprite(texture) {
            var _this = _super.call(this) || this;
            _this.spriteDisplay = new PIXI$1.Sprite(texture);
            _this.contentContainer.addChild(_this.spriteDisplay);
            return _this;
        }
        Sprite.prototype.update = function () {
            if (this.tint !== null) {
                this.spriteDisplay.tint = this.tint;
            }
            if (this.blendMode !== null) {
                this.spriteDisplay.blendMode = this.blendMode;
            }
        };
        Sprite.fromImage = function (imageUrl) {
            return new Sprite(new PIXI$1.Texture(new PIXI$1.BaseTexture(imageUrl)));
        };
        return Sprite;
    }(Widget));

    /**
     * The stage is the root node in the PUXI scene graph. It does not provide a
     * sophisticated layout model; however, it will accept constraints defined by
     * `PUXI.FastLayoutOptions` or `PUXI.LayoutOptions` in its children.
     *
     * The stage is not a `PUXI.Widget` and its dimensions are always fixed.
     *
     * @class
     * @memberof PUXI
     */
    var Stage = /** @class */ (function (_super) {
        __extends(Stage, _super);
        /**
         * @param {number} width - width of the stage
         * @param {number} height - height of the stage
         */
        function Stage(width, height) {
            var _this = _super.call(this) || this;
            _this.__width = width;
            _this.__height = height;
            _this.minWidth = 0;
            _this.minHeight = 0;
            _this.widgetChildren = [];
            _this.interactive = true;
            _this.stage = _this;
            _this.hitArea = new PIXI$1.Rectangle(0, 0, 0, 0);
            _this.initialized = true;
            _this.resize(width, height);
            return _this;
        }
        Stage.prototype.measureAndLayout = function () {
            if (this.background) {
                this.background.width = this.width;
                this.background.height = this.height;
            }
            for (var i = 0, j = this.widgetChildren.length; i < j; i++) {
                var widget = this.widgetChildren[i];
                var lopt = (widget.layoutOptions || LayoutOptions.DEFAULT);
                var widthMeasureMode = lopt.width < LayoutOptions.MAX_DIMEN
                    ? exports.MeasureMode.EXACTLY
                    : exports.MeasureMode.AT_MOST;
                var heightMeasureMode = lopt.height < LayoutOptions.MAX_DIMEN
                    ? exports.MeasureMode.EXACTLY
                    : exports.MeasureMode.AT_MOST;
                var loptWidth = (Math.abs(lopt.width) < 1) ? lopt.width * this.width : lopt.width;
                var loptHeight = (Math.abs(lopt.height) < 1) ? lopt.height * this.height : lopt.height;
                widget.measure(widthMeasureMode === exports.MeasureMode.EXACTLY ? loptWidth : this.width, heightMeasureMode === exports.MeasureMode.EXACTLY ? loptHeight : this.height, widthMeasureMode, heightMeasureMode);
                var x = lopt.x ? lopt.x : 0;
                var y = lopt.y ? lopt.y : 0;
                if (Math.abs(x) < 1) {
                    x *= this.width;
                }
                if (Math.abs(y) < 1) {
                    y *= this.height;
                }
                var anchor = lopt.anchor || FastLayoutOptions.DEFAULT_ANCHOR;
                var l = x - (anchor.x * widget.getMeasuredWidth());
                var t = y - (anchor.y * widget.getMeasuredHeight());
                widget.layout(l, t, l + widget.getMeasuredWidth(), t + widget.getMeasuredHeight(), true);
            }
        };
        Stage.prototype.getBackground = function () {
            return this.background;
        };
        Stage.prototype.setBackground = function (bg) {
            if (this.background) {
                _super.prototype.removeChild.call(this, this.background);
            }
            this.background = bg;
            if (bg) {
                _super.prototype.addChildAt.call(this, bg, 0);
                this.background.width = this.width;
                this.background.height = this.height;
            }
        };
        Stage.prototype.update = function (widgets) {
            for (var i = 0, j = widgets.length; i < j; i++) {
                var widget = widgets[i];
                if (!widget.initialized) {
                    widget.initialize();
                }
                this.update(widget.widgetChildren);
                widget.stage = this;
                widget.update();
            }
        };
        Stage.prototype.render = function (renderer) {
            this.update(this.widgetChildren);
            _super.prototype.render.call(this, renderer);
        };
        Stage.prototype.addChild = function (UIObject) {
            var argumentLenght = arguments.length;
            if (argumentLenght > 1) {
                for (var i = 0; i < argumentLenght; i++) {
                    this.addChild(arguments[i]);
                }
            }
            else {
                if (UIObject.parent) {
                    UIObject.parent.removeChild(UIObject);
                }
                UIObject.parent = this;
                this.widgetChildren.push(UIObject);
                _super.prototype.addChild.call(this, UIObject.insetContainer);
                // UIObject.updatesettings(true);
            }
            this.measureAndLayout();
        };
        Stage.prototype.removeChild = function (UIObject) {
            var argumentLenght = arguments.length;
            if (argumentLenght > 1) {
                for (var i = 0; i < argumentLenght; i++) {
                    this.removeChild(arguments[i]);
                }
            }
            else {
                _super.prototype.removeChild.call(this, UIObject.insetContainer);
                var index = this.widgetChildren.indexOf(UIObject);
                if (index !== -1) {
                    this.children.splice(index, 1);
                    UIObject.parent = null;
                }
            }
            this.measureAndLayout();
        };
        Stage.prototype.resize = function (width, height) {
            if (!isNaN(height))
                this.__height = height;
            if (!isNaN(width))
                this.__width = width;
            if (this.minWidth || this.minHeight) {
                var rx = 1;
                var ry = 1;
                if (width && width < this.minWidth) {
                    rx = this.minWidth / width;
                }
                if (height && height < this.minHeight) {
                    ry = this.minHeight / height;
                }
                if (rx > ry && rx > 1) {
                    this.scale.set(1 / rx);
                    this.__height *= rx;
                    this.__width *= rx;
                }
                else if (ry > 1) {
                    this.scale.set(1 / ry);
                    this.__width *= ry;
                    this.__height *= ry;
                }
                else if (this.scale.x !== 1) {
                    this.scale.set(1);
                }
            }
            if (this.hitArea) {
                this.hitArea.width = this.__width;
                this.hitArea.height = this.__height;
            }
            for (var i = 0; i < this.widgetChildren.length; i++) {
                this.widgetChildren[i].updatesettings(true, false);
            }
            this.measureAndLayout();
        };
        Object.defineProperty(Stage.prototype, "width", {
            get: function () {
                return this.__width;
            },
            set: function (val) {
                if (!isNaN(val)) {
                    this.__width = val;
                    this.resize();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "height", {
            get: function () {
                return this.__height;
            },
            set: function (val) {
                if (!isNaN(val)) {
                    this.__height = val;
                    this.resize();
                }
            },
            enumerable: true,
            configurable: true
        });
        return Stage;
    }(PIXI$1.Container));

    // Dummy <input> element created for mobile keyboards
    var mockDOMInput;
    function initMockDOMInput() {
        // create temp input (for mobile keyboard)
        if (typeof mockDOMInput === 'undefined') {
            mockDOMInput = document.createElement('INPUT');
            mockDOMInput.setAttribute('type', 'text');
            mockDOMInput.setAttribute('id', '_pui_tempInput');
            mockDOMInput.setAttribute('style', 'position:fixed; left:-10px; top:-10px; width:0px; height: 0px;');
            document.body.appendChild(mockDOMInput);
        }
    }
    /**
     * An UI text object
     *
     * @class
     * @extends PIXI.UI.InputBase
     * @memberof PIXI.UI
     */
    var TextInput = /** @class */ (function (_super) {
        __extends(TextInput, _super);
        /**
         * @param {PUXI.ITextInputOptions} options
         * @param {string} options.value Text content
         * @param {boolean} [options.multiLine=false] Multiline input
         * @param options.style {PIXI.TextStyle} Style used for the Text
         * @param options.background {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as background for input
         * @param [options.selectedColor='#ffffff'] {String|Array} Fill color of selected text
         * @param [options.selectedBackgroundColor='#318cfa'] {String} BackgroundColor of selected text
         * @param [options.width=150] {Number} width of input
         * @param [options.height=20] {Number} height of input
         * @param [options.padding=3] {Number} input padding
         * @param [options.paddingTop=0] {Number} input padding
         * @param [options.paddingBottom=0] {Number} input padding
         * @param [options.paddingLeft=0] {Number} input padding
         * @param [options.paddingRight=0] {Number} input padding
         * @param [options.tabIndex=0] {Number} input tab index
         * @param [options.tabGroup=0] {Number|String} input tab group
         * @param [options.maxLength=0] {Number} 0 = unlimited
         * @param [options.caretWidth=1] {Number} width of the caret
         * @param [options.lineHeight=0] {Number} 0 = inherit from text
         */
        function TextInput(options) {
            var _this = _super.call(this, options) || this;
            _this.keyDownEvent = function (e) {
                if (e.which === _this.ctrlKey || e.which === _this.cmdKey) {
                    _this.ctrlDown = true;
                }
                if (e.which === _this.shiftKey) {
                    _this.shiftDown = true;
                }
                _this.emit('keydown', e);
                if (e.defaultPrevented) {
                    return;
                }
                if (e.which === 13) { // enter
                    _this.insertTextAtCaret('\n');
                    e.preventDefault();
                    return;
                }
                if (_this.ctrlDown) {
                    // Handle Ctrl+<?> commands
                    if (e.which === 65) {
                        // Ctrl+A (Select all)
                        _this.select();
                        e.preventDefault();
                        return;
                    }
                    else if (e.which === 90) {
                        // Ctrl+Z (Undo)
                        if (_this.value != _this._lastValue) {
                            _this.valueEvent = _this._lastValue;
                        }
                        _this.setCaretIndex(_this._lastValue.length + 1);
                        e.preventDefault();
                        return;
                    }
                }
                if (e.which === 8) {
                    // Handle backspace
                    if (!_this.deleteSelection()) {
                        if (_this.caret._index > 0 || (_this.chars.length === 1 && _this.caret._atEnd)) {
                            if (_this.caret._atEnd) {
                                _this.valueEvent = _this.value.slice(0, _this.chars.length - 1);
                                _this.setCaretIndex(_this.caret._index);
                            }
                            else {
                                _this.valueEvent = _this.value.slice(0, _this.caret._index - 1) + _this.value.slice(_this.caret._index);
                                _this.setCaretIndex(_this.caret._index - 1);
                            }
                        }
                    }
                    e.preventDefault();
                    return;
                }
                if (e.which === 46) {
                    // Delete selection
                    if (!_this.deleteSelection()) {
                        if (!_this.caret._atEnd) {
                            _this.valueEvent = _this.value.slice(0, _this.caret._index) + _this.value.slice(_this.caret._index + 1);
                            _this.setCaretIndex(_this.caret._index);
                        }
                    }
                    e.preventDefault();
                    return;
                }
                else if (e.which === 37 || e.which === 39) {
                    _this.rdd = e.which === 37;
                    if (_this.shiftDown) {
                        if (_this.hasSelection) {
                            var caretAtStart = _this.selectionStart === _this.caret._index;
                            if (caretAtStart) {
                                if (_this.selectionStart === _this.selectionEnd && _this.rdd === _this.caret._forward) {
                                    _this.setCaretIndex(_this.caret._forward ? _this.caret._index : _this.caret._index + 1);
                                }
                                else {
                                    var startindex = _this.rdd ? _this.caret._index - 1 : _this.caret._index + 1;
                                    _this.selectRange(startindex, _this.selectionEnd);
                                    _this.caret._index = Math.min(_this.chars.length - 1, Math.max(0, startindex));
                                }
                            }
                            else {
                                var endIndex = _this.rdd ? _this.caret._index - 1 : _this.caret._index + 1;
                                _this.selectRange(_this.selectionStart, endIndex);
                                _this.caret._index = Math.min(_this.chars.length - 1, Math.max(0, endIndex));
                            }
                        }
                        else {
                            var _i = _this.caret._atEnd ? _this.caret._index + 1 : _this.caret._index;
                            var selectIndex = _this.rdd ? _i - 1 : _i;
                            _this.selectRange(selectIndex, selectIndex);
                            _this.caret._index = selectIndex;
                            _this.caret._forward = !rdd;
                        }
                    }
                    else {
                        // Navigation
                        // eslint-disable-next-line no-lonely-if
                        if (_this.hasSelection) {
                            _this.setCaretIndex(_this.rdd ? _this.selectionStart : _this.selectionEnd + 1);
                        }
                        else {
                            _this.setCaretIndex(_this.caret._index + (_this.rdd ? _this.caret._atEnd ? 0 : -1 : 1));
                        }
                    }
                    e.preventDefault();
                    return;
                }
                else if (_this.multiLine && (e.which === 38 || e.which === 40)) {
                    _this.vrdd = e.which === 38;
                    if (_this.shiftDown) {
                        if (_this.hasSelection) {
                            _this.de.y = Math.max(0, Math.min(_this.textHeightPX, _this.de.y + (_this.vrdd ? -_this.lineHeight : _this.lineHeight)));
                            _this.updateClosestIndex(_this.de, false);
                            // console.log(si, ei);
                            if (Math.abs(_this.si - _this.ei) <= 1) {
                                // console.log(si, ei);
                                _this.setCaretIndex(_this.sie ? _this.si + 1 : _this.si);
                            }
                            else {
                                _this.caret._index = (_this.eie ? _this.ei + 1 : _this.ei) + (_this.caret._down ? -1 : 0);
                                _this.selectRange(_this.caret._down ? _this.si : _this.si - 1, _this.caret._index);
                            }
                        }
                        else {
                            _this.si = _this.caret._index;
                            _this.sie = false;
                            _this.de.copyFrom(_this.caret);
                            _this.de.y = Math.max(0, Math.min(_this.textHeightPX, _this.de.y + (_this.vrdd ? -_this.lineHeight : _this.lineHeight)));
                            _this.updateClosestIndex(_this.de, false);
                            _this.caret._index = (_this.eie ? _this.ei + 1 : ei) - (_this.vrdd ? 0 : 1);
                            _this.selectRange(_this.vrdd ? _this.si - 1 : _this.si, _this.caret._index);
                            _this.caret._down = !_this.vrdd;
                        }
                    }
                    else if (_this.hasSelection) {
                        _this.setCaretIndex(_this.vrdd ? _this.selectionStart : _this.selectionEnd + 1);
                    }
                    else {
                        _this.ds.copyFrom(_this.caret);
                        _this.ds.y += _this.vrdd ? -_this.lineHeight : _this.lineHeight;
                        _this.ds.x += 1;
                        _this.updateClosestIndex(_this.ds, true);
                        _this.setCaretIndex(_this.sie ? _this.si + 1 : _this.si);
                    }
                    e.preventDefault();
                    return;
                }
            };
            _this.keyUpEvent = function (e) {
                if (e.which === _this.ctrlKey || e.which === _this.cmdKey)
                    _this.ctrlDown = false;
                if (e.which === _this.shiftKey)
                    _this.shiftDown = false;
                _this.emit('keyup', e);
                if (e.defaultPrevented) {
                    return;
                }
            };
            _this.copyEvent = function (e) {
                _this.emit('copy', e);
                if (e.defaultPrevented) {
                    return;
                }
                if (_this.hasSelection) {
                    var clipboardData = e.clipboardData || window.clipboardData;
                    clipboardData.setData('Text', _this.value.slice(_this.selectionStart, _this.selectionEnd + 1));
                }
                e.preventDefault();
            };
            _this.cutEvent = function (e) {
                _this.emit('cut', e);
                if (e.defaultPrevented) {
                    return;
                }
                if (_this.hasSelection) {
                    _this.copyEvent(e);
                    _this.deleteSelection();
                }
                e.preventDefault();
            };
            _this.pasteEvent = function (e) {
                _this.emit('paste', e);
                if (e.defaultPrevented) {
                    return;
                }
                var clipboardData = e.clipboardData || window.clipboardData;
                _this.insertTextAtCaret(clipboardData.getData('Text'));
                e.preventDefault();
            };
            _this.inputEvent = function (e) {
                var c = mockDOMInput.value;
                if (c.length) {
                    _this.insertTextAtCaret(c);
                    mockDOMInput.value = '';
                }
                e.preventDefault();
            };
            _this.inputBlurEvent = function (e) {
                _this.blur();
            };
            _this.focus = function () {
                if (!_this._focused) {
                    _super.prototype.focus.call(_this);
                    var l = _this.contentContainer.worldTransform.tx + "px";
                    var t = _this.contentContainer.worldTransform.ty + "px";
                    var h = _this.contentContainer.height + "px";
                    var w = _this.contentContainer.width + "px";
                    mockDOMInput.setAttribute('style', "position:fixed; left:" + l + "; top:" + t + "; height:" + h + "; width:" + w + ";");
                    mockDOMInput.value = '';
                    mockDOMInput.focus();
                    mockDOMInput.setAttribute('style', 'position:fixed; left:-10px; top:-10px; width:0px; height: 0px;');
                    _this.innerContainer.cacheAsBitmap = false;
                    mockDOMInput.addEventListener('blur', _this.inputBlurEvent, false);
                    document.addEventListener('keydown', _this.keyDownEvent, false);
                    document.addEventListener('keyup', _this.keyUpEvent, false);
                    document.addEventListener('paste', _this.pasteEvent, false);
                    document.addEventListener('copy', _this.copyEvent, false);
                    document.addEventListener('cut', _this.cutEvent, false);
                    mockDOMInput.addEventListener('input', _this.inputEvent, false);
                    setTimeout(function () {
                        if (!_this.caret.visible && !_this.selection.visible && !_this.multiLine) {
                            _this.setCaretIndex(_this.chars.length);
                        }
                    }, 0);
                }
            };
            _this.blur = function () {
                if (_this._focused) {
                    _super.prototype.blur.call(_this);
                    _this.ctrlDown = false;
                    _this.shiftDown = false;
                    _this.hideCaret();
                    _this.clearSelection();
                    if (_this.chars.length > 1) {
                        _this.innerContainer.cacheAsBitmap = true;
                    }
                    mockDOMInput.removeEventListener('blur', _this.inputBlurEvent);
                    document.removeEventListener('keydown', _this.keyDownEvent);
                    document.removeEventListener('keyup', _this.keyUpEvent);
                    document.removeEventListener('paste', _this.pasteEvent);
                    document.removeEventListener('copy', _this.copyEvent);
                    document.removeEventListener('cut', _this.cutEvent);
                    mockDOMInput.removeEventListener('input', _this.inputEvent);
                    mockDOMInput.blur();
                }
                if (!_this.multiLine) {
                    _this.resetScrollPosition();
                }
            };
            _this.setCaretIndex = function (index) {
                _this.caret._atEnd = index >= _this.chars.length;
                _this.caret._index = Math.max(0, Math.min(_this.chars.length - 1, index));
                if (_this.chars.length && index > 0) {
                    var i = Math.max(0, Math.min(index, _this.chars.length - 1));
                    var c = _this.chars[i];
                    if (c && c.wrapped) {
                        _this.caret.x = c.x;
                        _this.caret.y = c.y;
                    }
                    else {
                        i = Math.max(0, Math.min(index - 1, _this.chars.length - 1));
                        c = _this.chars[i];
                        _this.caret.x = _this.chars[i].x + _this.chars[i].width;
                        _this.caret.y = (_this.chars[i].lineIndex * _this.lineHeight) + (_this.lineHeight - _this.textHeight) * 0.5;
                    }
                }
                else {
                    _this.caret.x = 0;
                    _this.caret.y = (_this.lineHeight - _this.textHeight) * 0.5;
                }
                _this.scrollToPosition(_this.caret);
                _this.showCaret();
            };
            _this.select = function () {
                _this.selectRange(0, _this.chars.length - 1);
            };
            _this.selectWord = function (wordIndex) {
                var startIndex = _this.chars.length;
                var endIndex = 0;
                for (var i = 0; i < _this.chars.length; i++) {
                    if (_this.chars[i].wordIndex !== wordIndex) {
                        continue;
                    }
                    if (i < startIndex) {
                        startIndex = i;
                    }
                    if (i > endIndex) {
                        endIndex = i;
                    }
                }
                _this.selectRange(startIndex, endIndex);
            };
            _this.selectRange = function (startIndex, endIndex) {
                if (startIndex > -1 && endIndex > -1) {
                    var start = Math.min(startIndex, endIndex, _this.chars.length - 1);
                    var end = Math.min(Math.max(startIndex, endIndex), _this.chars.length - 1);
                    if (start !== _this.selectionStart || end !== _this.selectionEnd) {
                        _this.hasSelection = true;
                        _this.selection.visible = true;
                        _this.selectionStart = start;
                        _this.selectionEnd = end;
                        _this.hideCaret();
                        _this.updateSelectionGraphics();
                        _this.updateSelectionColors();
                    }
                    _this.focus();
                }
                else {
                    _this.clearSelection();
                }
            };
            _this.clearSelection = function () {
                if (_this.hasSelection) {
                    // Remove color
                    _this.hasSelection = false;
                    _this.selection.visible = false;
                    _this.selectionStart = -1;
                    _this.selectionEnd = -1;
                    _this.updateSelectionColors();
                }
            };
            _this.updateSelectionGraphics = function () {
                var c1 = _this.chars[_this.selectionStart];
                if (c1 !== undefined) {
                    var cx = c1.x;
                    var cy = c1.y;
                    var w = 0;
                    var h = _this.textHeight;
                    var cl = c1.lineIndex;
                    _this.selection.clear();
                    for (var i = _this.selectionStart; i <= _this.selectionEnd; i++) {
                        var c = _this.chars[i];
                        if (c.lineIndex != cl) {
                            _this.drawSelectionRect(cx, cy, w, h);
                            cx = c.x;
                            cy = c.y;
                            cl = c.lineIndex;
                            w = 0;
                        }
                        w += c.width;
                    }
                    _this.drawSelectionRect(cx, cy, w, h);
                    _this.innerContainer.addChildAt(_this.selection, 0);
                }
            };
            _this.drawSelectionRect = function (x, y, w, h) {
                _this.selection.beginFill("0x" + _this.selectedBackgroundColor.slice(1), 1);
                _this.selection.moveTo(x, y);
                _this.selection.lineTo(x + w, y);
                _this.selection.lineTo(x + w, y + h);
                _this.selection.lineTo(x, y + h);
                _this.selection.endFill();
            };
            initMockDOMInput();
            _this.options = options;
            _this._dirtyText = true;
            _this.maxLength = options.maxLength || 0;
            _this._value = _this._lastValue = options.value || '';
            if (_this.maxLength) {
                _this._value = _this._value.slice(0, _this.maxLength);
            }
            _this.chars = [];
            _this.multiLine = options.multiLine !== undefined ? options.multiLine : false;
            _this.color = options.style && options.style.fill ? options.style.fill : '#000000';
            _this.selectedColor = options.selectedColor || '#ffffff';
            _this.selectedBackgroundColor = options.selectedBackgroundColor || '#318cfa';
            _this.tempText = new PIXI$1.Text('1', options.style);
            _this.textHeight = _this.tempText.height;
            _this.lineHeight = options.lineHeight || _this.textHeight || _this._height;
            _this.tempText.destroy();
            // set cursor
            // this.container.cursor = "text";
            // selection graphics
            _this.selection = new PIXI$1.Graphics();
            _this.selection.visible = false;
            _this.selection._startIndex = 0;
            _this.selection._endIndex = 0;
            // caret graphics
            _this.caret = new PIXI$1.Graphics();
            _this.caret.visible = false;
            _this.caret._index = 0;
            _this.caret.lineStyle(options.caretWidth || 1, '#ffffff', 1);
            _this.caret.moveTo(0, 0);
            _this.caret.lineTo(0, _this.textHeight);
            // var padding
            var paddingLeft = options.paddingLeft !== undefined ? options.paddingLeft : options.padding;
            var paddingRight = options.paddingRight !== undefined ? options.paddingRight : options.padding;
            var paddingBottom = options.paddingBottom !== undefined ? options.paddingBottom : options.padding;
            var paddingTop = options.paddingTop !== undefined ? options.paddingTop : options.padding;
            // insert text container (scrolling container)
            _this.textContainer = new ScrollWidget({
                scrollX: !_this.multiLine,
                scrollY: _this.multiLine,
                dragScrolling: _this.multiLine,
                expandMask: 2,
                softness: 0.2,
                overflowX: 40,
                overflowY: 40,
            }).setPadding(paddingLeft || 3, paddingTop || 3, paddingRight || 3, paddingBottom || 3).setLayoutOptions(new LayoutOptions(LayoutOptions.FILL_PARENT, LayoutOptions.FILL_PARENT));
            _this.addChild(_this.textContainer);
            if (_this.multiLine) {
                _this._useNext = _this._usePrev = false;
                _this.textContainer.dragRestrictAxis = 'y';
                _this.textContainer.dragThreshold = 5;
                _this.dragRestrictAxis = 'x';
                _this.dragThreshold = 5;
            }
            // selection Vars
            _this.sp = new PIXI$1.Point(); // startposition
            _this._sp = new PIXI$1.Point();
            _this.ds = new PIXI$1.Point(); // dragStart
            _this.de = new PIXI$1.Point(); // dragend
            _this.rdd = false; // Reverse drag direction
            _this.vrdd = false; // vertical Reverse drag direction
            _this.selectionStart = -1;
            _this.selectionEnd = -1;
            _this.hasSelection = false;
            _this.t = performance.now(); // timestamp
            _this.cc = 0; // click counter
            _this.textLengthPX = 0;
            _this.textHeightPX = 0;
            _this.lineIndexMax = 0;
            _this.ctrlDown = false;
            _this.shiftDown = false;
            _this.shiftKey = 16;
            _this.ctrlKey = 17;
            _this.cmdKey = 91;
            _this.setupDrag();
            return _this;
        }
        TextInput.prototype.setupDrag = function () {
            var _this = this;
            var event = new DragManager(this);
            event.onPress = function (e, mouseDown) {
                if (mouseDown) {
                    var timeSinceLast = performance.now() - _this.t;
                    _this.t = performance.now();
                    if (timeSinceLast < 250) {
                        _this.cc++;
                        if (_this.cc > 1) {
                            _this.select();
                        }
                        else {
                            _this.innerContainer.toLocal(_this.sp, undefined, _this.ds, true);
                            _this.updateClosestIndex(_this.ds, true);
                            var c = _this.chars[_this.si];
                            if (c) {
                                if (c.wordIndex != -1) {
                                    _this.selectWord(c.wordIndex);
                                }
                                else {
                                    _this.selectRange(_this.si, _this.si);
                                }
                            }
                        }
                    }
                    else {
                        _this.cc = 0;
                        _this.sp.copyFrom(e.data.global);
                        _this.innerContainer.toLocal(_this.sp, undefined, _this.ds, true);
                        if (_this.chars.length) {
                            _this.updateClosestIndex(_this.ds, true);
                            _this.setCaretIndex(_this.sie ? _this.si + 1 : _this.si);
                        }
                    }
                }
                e.data.originalEvent.preventDefault();
            };
            event.onDragMove = function (e, offset) {
                if (!_this.chars.length || !_this._focused) {
                    return;
                }
                _this.de.x = _this.sp.x + offset.x;
                _this.de.y = _this.sp.y + offset.y;
                _this.innerContainer.toLocal(_this.de, undefined, _this.de, true);
                _this.updateClosestIndex(_this.de, false);
                if (_this.si < _this.ei) {
                    _this.selectRange(_this.sie ? _this.si + 1 : _this.si, _this.eie ? _this.ei : _this.ei - 1);
                    _this.caret._index = _this.eie ? _this.ei : _this.ei - 1;
                }
                else if (_this.si > _this.ei) {
                    _this.selectRange(_this.ei, _this.sie ? _this.si : _this.si - 1);
                    _this.caret._index = _this.ei;
                }
                else if (_this.sie === _this.eie) {
                    _this.setCaretIndex(_this.sie ? _this.si + 1 : _this.si);
                }
                else {
                    _this.selectRange(_this.si, _this.ei);
                    _this.caret._index = _this.ei;
                }
                _this.caret._forward = _this.si <= _this.ei;
                _this.caret._down = offset.y > 0;
                _this.scrollToPosition(_this.de);
            };
        };
        Object.defineProperty(TextInput.prototype, "innerContainer", {
            get: function () {
                return this.textContainer.innerContainer.insetContainer;
            },
            enumerable: true,
            configurable: true
        });
        TextInput.prototype.update = function () {
            if (this.width !== this._lastWidth) {
                this._lastWidth = this._width;
                if (this.multiLine) {
                    this.updateText();
                    if (this.caret.visible) {
                        this.setCaretIndex(this.caret._index);
                    }
                    if (this.hasSelection) {
                        this.updateSelectionGraphics();
                    }
                }
            }
            // update text
            if (this._dirtyText) {
                this.updateText();
                this._dirtyText = false;
            }
        };
        TextInput.prototype.updateText = function () {
            this.textLengthPX = 0;
            this.textHeightPX = 0;
            this.lineIndexMax = 0;
            var lineIndex = 0;
            var length = this._value.length;
            var x = 0;
            var y = (this.lineHeight - this.textHeight) * 0.5;
            var i = 0;
            // destroy excess chars
            if (this.chars.length > length) {
                for (i = this.chars.length - 1; i >= length; i--) {
                    this.innerContainer.removeChild(this.chars[i]);
                    this.chars[i].destroy();
                }
                this.chars.splice(length, this.chars.length - length);
            }
            // update and add chars
            var whitespace = false;
            var newline = false;
            var wordIndex = 0;
            var lastWordIndex = -1;
            var wrap = false;
            for (i = 0; i < this._value.length; i++) {
                if (whitespace || newline) {
                    lastWordIndex = i;
                    wordIndex++;
                }
                var c = this._value[i];
                whitespace = c === ' ';
                newline = c === '\n';
                if (newline) { // newline "hack". webgl render errors if \n is passed to text
                    c = '';
                }
                var charText = this.chars[i];
                if (!charText) {
                    charText = new PIXI$1.Text(c, this.options.style);
                    this.innerContainer.addChild(charText);
                    this.chars.push(charText);
                }
                else {
                    charText.text = c;
                }
                charText.scale.x = newline ? 0 : 1;
                charText.wrapped = wrap;
                wrap = false;
                if (newline || (this.multiLine && x + charText.width >= this._width - this.paddingLeft - this.paddingRight)) {
                    lineIndex++;
                    x = 0;
                    y += this.lineHeight;
                    if (lastWordIndex !== -1 && !newline) {
                        i = lastWordIndex - 1;
                        lastWordIndex = -1;
                        wrap = true;
                        continue;
                    }
                }
                charText.lineIndex = lineIndex;
                charText.x = x;
                charText.y = y;
                charText.wordIndex = whitespace || newline ? -1 : wordIndex;
                x += charText.width;
                if (x > this.textLengthPX) {
                    this.textLengthPX = x;
                }
                if (y > this.textHeightPX) {
                    this.textHeightPX = y;
                }
            }
            this.lineIndexMax = lineIndex;
            // put caret on top
            this.innerContainer.addChild(this.caret);
            // recache
            if (this.innerContainer.cacheAsBitmap) {
                this.innerContainer.cacheAsBitmap = false;
                this.innerContainer.cacheAsBitmap = true;
            }
            this.textContainer.update();
        };
        TextInput.prototype.updateClosestIndex = function (point, start) {
            var currentDistX = 99999;
            var currentIndex = -1;
            var atEnd = false;
            var closestLineIndex = 0;
            if (this.lineIndexMax > 0) {
                closestLineIndex = Math.max(0, Math.min(this.lineIndexMax, Math.floor(point.y / this.lineHeight)));
            }
            for (var i = 0; i < this.chars.length; i++) {
                var char = this.chars[i];
                if (char.lineIndex !== closestLineIndex) {
                    continue;
                }
                var distX = Math.abs(point.x - (char.x + (char.width * 0.5)));
                if (distX < currentDistX) {
                    currentDistX = distX;
                    currentIndex = i;
                    atEnd = point.x > char.x + (char.width * 0.5);
                }
            }
            if (start) {
                this.si = currentIndex;
                this.sie = atEnd;
            }
            else {
                this.ei = currentIndex;
                this.eie = atEnd;
            }
        };
        TextInput.prototype.deleteSelection = function () {
            if (this.hasSelection) {
                this.value = this.value.slice(0, this.selectionStart) + this.value.slice(this.selectionEnd + 1);
                this.setCaretIndex(this.selectionStart);
                return true;
            }
            return false;
        };
        TextInput.prototype.updateSelectionColors = function () {
            // Color charecters
            for (var i = 0; i < this.chars.length; i++) {
                if (i >= this.selectionStart && i <= this.selectionEnd) {
                    this.chars[i].style.fill = this.selectedColor;
                }
                else {
                    this.chars[i].style.fill = this.color;
                }
            }
        };
        TextInput.prototype.scrollToPosition = function (pos) {
            this._sp.x = pos.x;
            this._sp.y = pos.y;
            if (this.multiLine && this._sp.y >= this.lineHeight) {
                this._sp.y += this.lineHeight;
            }
            this.textContainer.focusPosition(this._sp);
        };
        TextInput.prototype.resetScrollPosition = function () {
            this._sp.set(0, 0);
            this.textContainer.focusPosition(this._sp);
        };
        TextInput.prototype.hideCaret = function () {
            this.caret.visible = false;
            clearInterval(this.caretInterval);
        };
        TextInput.prototype.showCaret = function () {
            var _this = this;
            this.clearSelection();
            clearInterval(this.caretInterval);
            this.caret.alpha = 1;
            this.caret.visible = true;
            this.caretInterval = setInterval(function () {
                _this.caret.alpha = _this.caret.alpha === 0 ? 1 : 0;
            }, 500);
        };
        TextInput.prototype.insertTextAtCaret = function (c) {
            if (!this.multiLine && c.indexOf('\n') !== -1) {
                c = c.replace(/\n/g, '');
            }
            if (this.hasSelection) {
                this.deleteSelection();
            }
            if (!this.maxLength || this.chars.length < this.maxLength) {
                if (this.caret._atEnd) {
                    this.valueEvent += c;
                    this.setCaretIndex(this.chars.length);
                }
                else {
                    var index = Math.min(this.chars.length - 1, this.caret._index);
                    this.valueEvent = this.value.slice(0, index) + c + this.value.slice(index);
                    this.setCaretIndex(index + c.length);
                }
            }
        };
        Object.defineProperty(TextInput.prototype, "valueEvent", {
            get: function () {
                return this._value;
            },
            set: function (val) {
                if (this.maxLength) {
                    val = val.slice(0, this.maxLength);
                }
                if (this._value != val) {
                    this.value = val;
                    this.emit('change');
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (val) {
                if (this.maxLength) {
                    val = val.slice(0, this.maxLength);
                }
                if (this._value != val) {
                    this._lastValue = this._value;
                    this._value = val;
                    this._dirtyText = true;
                    this.update();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "text", {
            get: function () {
                return this.value;
            },
            set: function (value) {
                this.value = value;
            },
            enumerable: true,
            configurable: true
        });
        return TextInput;
    }(FocusableWidget));
    /*
     * Features:
     * multiLine, shift selection, Mouse Selection, Cut, Copy, Paste, Delete, Backspace, Arrow navigation, tabIndex
     *
     * Methods:
     * blur()
     * focus()
     * select() - selects all text
     * selectRange(startIndex, endIndex)
     * clearSelection()
     * setCaretIndex(index) moves caret to index
     *
     *
     * Events:
     * "change"
     * "blur"
     * "blur"
     * "focus"
     * "focusChanged" param: [bool]focus
     * "keyup" param: Event
     * "keydown" param: Event
     * "copy" param: Event
     * "paste" param: Event
     * "cut" param: Event
     * "keyup" param: Event
     */

    /**
     * An UI sprite object
     *
     * @class
     * @extends PIXI.UI.UIBase
     * @memberof PIXI.UI
     * @param Texture {PIXI.Texture} The texture for the sprite
     * @param [Width=Texture.width] {number} Width of tilingsprite
     * @param [Height=Texture.height] {number} Height of tiling sprite
     */
    var TilingSprite = /** @class */ (function (_super) {
        __extends(TilingSprite, _super);
        function TilingSprite(t, width, height) {
            var _this = this;
            var sprite = new PIXI$1.extras.TilingSprite(t);
            _this = _super.call(this, width || sprite.width, height || sprite.height) || this;
            _this.sprite = sprite;
            _this.contentContainer.addChild(_this.sprite);
            return _this;
        }
        /**
         * Updates the text
         *
         * @private
         */
        TilingSprite.prototype.update = function () {
            if (this.tint !== null) {
                this.sprite.tint = this.tint;
            }
            if (this.blendMode !== null) {
                this.sprite.blendMode = this.blendMode;
            }
            this.sprite.width = this._width;
            this.sprite.height = this._height;
        };
        Object.defineProperty(TilingSprite.prototype, "tilePosition", {
            get: function () {
                return this.sprite.tilePosition;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TilingSprite.prototype, "tilingPosition", {
            set: function (val) {
                this.sprite.tilePosition = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TilingSprite.prototype, "tileScale", {
            get: function () {
                return this.sprite.tileScale;
            },
            set: function (val) {
                this.sprite.tileScale = val;
            },
            enumerable: true,
            configurable: true
        });
        return TilingSprite;
    }(Widget));

    /**
     * `AnchorLayout` is used in conjunction with `AnchorLayoutOptions`.
     *
     * @namespace PUXI
     * @class
     * @example
     * ```
     * parent.useLayout(new PUXI.AnchorLayout());
     * ```
     */
    var AnchorLayout = /** @class */ (function () {
        function AnchorLayout() {
            this.noPercents = false;
        }
        AnchorLayout.prototype.onAttach = function (host) {
            this.host = host;
        };
        AnchorLayout.prototype.onDetach = function () {
            this.host = null;
        };
        AnchorLayout.prototype.measureChild = function (child, maxParentWidth, maxParentHeight, widthMode, heightMode) {
            var lopt = (child.layoutOptions || LayoutOptions.DEFAULT);
            var anchorLeft = lopt.anchorLeft || 0;
            var anchorTop = lopt.anchorTop || 0;
            var anchorRight = lopt.anchorRight || 0;
            var anchorBottom = lopt.anchorBottom || 0;
            var maxWidgetWidth = 0;
            var maxWidgetHeight = 0;
            var widgetWidthMode;
            var widgetHeightMode;
            // Widget width measurement
            if (this.noPercents || (Math.abs(anchorLeft) > 1 && Math.abs(anchorRight) > 1)) {
                maxWidgetWidth = Math.ceil(anchorRight) - Math.floor(anchorLeft);
                widgetWidthMode = exports.MeasureMode.AT_MOST;
            }
            else if (Math.abs(anchorLeft) < 1 && Math.abs(anchorRight) < 1) {
                maxWidgetWidth = maxParentWidth * (anchorRight - anchorLeft);
                widgetWidthMode = (widthMode === exports.MeasureMode.UNBOUNDED)
                    ? exports.MeasureMode.UNBOUNDED
                    : exports.MeasureMode.AT_MOST;
            }
            else if (Math.abs(anchorLeft) < 1) {
                maxWidgetWidth = anchorRight;
                widgetWidthMode = exports.MeasureMode.AT_MOST;
            }
            else {
                maxWidgetWidth = (maxParentWidth * anchorRight) - anchorLeft;
                widgetWidthMode = (widthMode === exports.MeasureMode.UNBOUNDED)
                    ? exports.MeasureMode.UNBOUNDED
                    : exports.MeasureMode.AT_MOST;
            }
            // Widget height measurement
            if (this.noPercents || (Math.abs(anchorTop) > 1 && Math.abs(anchorBottom) > 1)) {
                maxWidgetHeight = Math.ceil(anchorBottom) - Math.floor(anchorTop);
                widgetHeightMode = exports.MeasureMode.AT_MOST;
            }
            else if (Math.abs(anchorTop) < 1 && Math.abs(anchorBottom) < 1) {
                maxWidgetHeight = maxParentHeight * (anchorBottom - anchorTop);
                widgetHeightMode = (heightMode === exports.MeasureMode.UNBOUNDED)
                    ? exports.MeasureMode.UNBOUNDED
                    : exports.MeasureMode.AT_MOST;
            }
            else if (Math.abs(anchorTop) < 1) {
                maxWidgetHeight = anchorBottom;
                widgetHeightMode = exports.MeasureMode.AT_MOST;
            }
            else {
                maxWidgetHeight = (maxParentHeight * anchorBottom) - anchorTop;
                widgetHeightMode = (heightMode === exports.MeasureMode.UNBOUNDED)
                    ? exports.MeasureMode.UNBOUNDED
                    : exports.MeasureMode.AT_MOST;
            }
            child.measure(maxWidgetWidth, maxWidgetHeight, widgetWidthMode, widgetHeightMode);
        };
        AnchorLayout.prototype.measureStretch = function (lowerAnchor, upperAnchor, childDimen) {
            if (this.noPercents || (Math.abs(upperAnchor) > 1 && Math.abs(lowerAnchor) > 1)) {
                return Math.max(lowerAnchor, upperAnchor);
            }
            else if (Math.abs(lowerAnchor) < 1 && Math.abs(upperAnchor) < 1) {
                return childDimen / (upperAnchor - lowerAnchor);
            }
            else if (Math.abs(lowerAnchor) < 1) {
                return upperAnchor;
            }
            return (childDimen + lowerAnchor) / upperAnchor;
        };
        AnchorLayout.prototype.measureChildren = function (maxParentWidth, maxParentHeight, widthMode, heightMode) {
            var children = this.host.widgetChildren;
            for (var i = 0, j = children.length; i < j; i++) {
                this.measureChild(children[i], maxParentWidth, maxParentHeight, widthMode, heightMode);
            }
        };
        AnchorLayout.prototype.onMeasure = function (maxWidth, maxHeight, widthMode, heightMode) {
            if (widthMode === exports.MeasureMode.EXACTLY && heightMode === exports.MeasureMode.EXACTLY) {
                this.measuredWidth = maxWidth;
                this.measuredHeight = maxHeight;
                this.measureChildren(this.measuredWidth, this.measuredHeight, exports.MeasureMode.EXACTLY, exports.MeasureMode.EXACTLY);
            }
            var maxX = 0;
            var maxY = 0;
            var children = this.host.widgetChildren;
            this.measureChildren(maxWidth, maxHeight, widthMode, heightMode);
            for (var i = 0, j = children.length; i < j; i++) {
                var child = children[i];
                var lopt = (child.layoutOptions || LayoutOptions.DEFAULT);
                var anchorLeft = lopt.anchorLeft || 0;
                var anchorTop = lopt.anchorTop || 0;
                var anchorRight = lopt.anchorRight || 0;
                var anchorBottom = lopt.anchorBottom || 0;
                maxX = Math.max(maxX, this.measureStretch(anchorLeft, anchorRight, child.getMeasuredWidth()));
                maxY = Math.max(maxY, this.measureStretch(anchorTop, anchorBottom, child.getMeasuredHeight()));
            }
            if (widthMode === exports.MeasureMode.EXACTLY) {
                this.measuredWidth = maxWidth;
            }
            else if (widthMode === exports.MeasureMode.AT_MOST) {
                this.measuredWidth = Math.min(maxX, maxWidth);
            }
            else {
                this.measuredWidth = maxX;
            }
            if (heightMode === exports.MeasureMode.EXACTLY) {
                this.measuredHeight = maxHeight;
            }
            else if (heightMode === exports.MeasureMode.AT_MOST) {
                this.measuredHeight = Math.min(maxY, maxHeight);
            }
            else {
                this.measuredHeight = maxY;
            }
            this.measureChildren(this.measuredWidth, this.measuredHeight, exports.MeasureMode.EXACTLY, exports.MeasureMode.EXACTLY);
        };
        AnchorLayout.prototype.getMeasuredWidth = function () {
            return this.measuredWidth;
        };
        AnchorLayout.prototype.getMeasuredHeight = function () {
            return this.measuredHeight;
        };
        AnchorLayout.prototype.onLayout = function () {
            var parent = this.host;
            var widgetChildren = parent.widgetChildren;
            for (var i = 0; i < widgetChildren.length; i++) {
                var child = widgetChildren[i];
                var layoutOptions = (child.layoutOptions || {});
                var childWidth = child.measuredWidth;
                var childHeight = child.measuredHeight;
                var anchorLeft = layoutOptions.anchorLeft || 0;
                var anchorTop = layoutOptions.anchorTop || 0;
                var anchorRight = layoutOptions.anchorRight || 0;
                var anchorBottom = layoutOptions.anchorBottom || 0;
                if (anchorLeft > -1 && anchorLeft <= 1) {
                    anchorLeft *= parent.width;
                }
                if (anchorTop > -1 && anchorTop <= 1) {
                    anchorTop *= parent.height;
                }
                if (anchorRight > -1 && anchorRight <= 1) {
                    anchorRight *= parent.width;
                }
                if (anchorBottom > -1 && anchorBottom <= 1) {
                    anchorBottom *= parent.height;
                }
                var x = 0;
                var y = 0;
                if (childWidth !== 0) {
                    switch (layoutOptions.horizontalAlign || exports.ALIGN.NONE) {
                        case exports.ALIGN.LEFT:
                            x = anchorLeft;
                            break;
                        case exports.ALIGN.MIDDLE:
                            x = (anchorRight - anchorLeft - childWidth) / 2;
                            break;
                        case exports.ALIGN.RIGHT:
                            x = anchorRight - childWidth;
                            break;
                    }
                }
                else {
                    x = anchorLeft;
                    childWidth = anchorRight - anchorLeft;
                }
                if (childHeight !== 0) {
                    switch (layoutOptions.verticalAlign || exports.ALIGN.NONE) {
                        case exports.ALIGN.TOP:
                            y = anchorTop;
                            break;
                        case exports.ALIGN.MIDDLE:
                            y = (anchorBottom - anchorTop - childHeight) / 2;
                            break;
                        case exports.ALIGN.RIGHT:
                            y = anchorBottom - childWidth;
                            break;
                    }
                }
                else {
                    y = anchorRight;
                    childHeight = anchorBottom - anchorTop;
                }
                child.layout(x, y, x + childWidth, y + childHeight);
            }
        };
        return AnchorLayout;
    }());

    exports.AnchorLayout = AnchorLayout;
    exports.AnchorLayoutOptions = AnchorLayoutOptions;
    exports.Button = Button;
    exports.CheckBox = CheckBox;
    exports.DynamicText = DynamicText;
    exports.DynamicTextStyle = DynamicTextStyle;
    exports.Ease = Ease;
    exports.FastLayoutOptions = FastLayoutOptions;
    exports.Helpers = Helpers;
    exports.Insets = Insets;
    exports.Interaction = Interaction;
    exports.InteractiveGroup = InteractiveGroup;
    exports.LayoutOptions = LayoutOptions;
    exports.ScrollBar = ScrollBar;
    exports.ScrollWidget = ScrollWidget;
    exports.SliceSprite = SliceSprite;
    exports.Slider = Slider;
    exports.SortableList = SortableList;
    exports.Sprite = Sprite;
    exports.Stage = Stage;
    exports.TextInput = TextInput;
    exports.TextWidget = TextWidget;
    exports.Ticker = Ticker$1;
    exports.TilingSprite = TilingSprite;
    exports.Tween = Tween;
    exports.Widget = Widget;
    exports.WidgetGroup = WidgetGroup;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=pixi-ui.js.map
