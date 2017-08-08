var UIBase = require('./UIBase'),
    Container = require('./Container'),
    MathHelper = require('./MathHelper'),
    Ticker = require('./Ticker'),
    DragEvent = require('./Interaction/DragEvent'),
    MouseScrollEvent = require('./Interaction/MouseScrollEvent');


/**
 * An UI Container object with expandMask hidden and possibility to enable scrolling
 *
 * @class
 * @extends PIXI.UI.UIBase
 * @memberof PIXI.UI
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
function ScrollingContainer(options) {
    options = options || {};
    Container.call(this, options.width, options.height);
    this.mask = new PIXI.Graphics();
    this.innerContainer = new PIXI.Container();
    this.innerBounds = new PIXI.Rectangle();
    this.container.addChild(this.mask);
    this.container.addChild(this.innerContainer);
    this.container.mask = this.mask;
    this.scrollX = options.scrollX !== undefined ? options.scrollX : false;
    this.scrollY = options.scrollY !== undefined ? options.scrollY : true;
    this.dragScrolling = options.dragScrolling !== undefined ? options.dragScrolling : true;
    this.softness = options.softness !== undefined ? Math.max(Math.min(options.softness || 0, 1), 0) : 0.5;
    this.radius = options.radius || 0;
    this.expandMask = options.expandMask || 0;
    this.overflowY = options.overflowY || 0;
    this.overflowX = options.overflowX || 0;

    this.animating = false;
    this.scrolling = false;
    this._scrollBars = [];

    this.boundCached = performance.now() - 1000;
}


ScrollingContainer.prototype = Object.create(Container.prototype);
ScrollingContainer.prototype.constructor = ScrollingContainer;
module.exports = ScrollingContainer;


ScrollingContainer.prototype.initialize = function () {
    Container.prototype.initialize.apply(this);
    if (this.scrollX || this.scrollY) {
        this.initScrolling();
    }
};

ScrollingContainer.prototype.update = function () {
    Container.prototype.update.apply(this);
    if (this._lastWidth != this._width || this._lastHeight != this._height) {
        var of = this.expandMask;
        this.mask.clear();
        this.mask.lineStyle(0);
        this.mask.beginFill(0xFFFFFF, 1);
        if (this.radius === 0) {

            //this.mask.drawRect(0, 0, this._width, this._height);
            //this.mask.drawRect(-of, -of, this._width + of, this.height + of);
            //this.mask.moveTo(-of, -of);
            //this.mask.lineTo(this._width + of, -of);
            //this.mask.lineTo(this._width + of, this._height + of);
            //this.mask.lineTo(-of, this._height + of);
            this.mask.drawRect(-of, -of, this._width + of, this._height + of);
        }
        else {
            this.mask.drawRoundedRect(-of, -of, this._width + of, this.height + of, this.radius);
        }
        this.mask.endFill();
        this._lastWidth = this._width;
        this._lastHeight = this._height;
    }


    if (this.setScrollPosition) {
        this.setScrollPosition();
    }
};

ScrollingContainer.prototype.addChild = function (UIObject) {
    var argumentsLength = arguments.length;
    if (argumentsLength > 1) {
        for (var i = 0; i < argumentsLength; i++) {
            this.addChild(arguments[i]);
        }
    }
    else {
        Container.prototype.addChild.call(this, UIObject);
        this.innerContainer.addChild(UIObject.container);
        this.getInnerBounds(true); //make sure bounds is updated instantly when a child is added
    }
    return UIObject;
};


ScrollingContainer.prototype.updateScrollBars = function () {
    for (var i = 0; i < this._scrollBars.length; i++) {
        this._scrollBars[i].alignToContainer();
    }
};


ScrollingContainer.prototype.getInnerBounds = function (force) {
    //this is a temporary fix, because we cant rely on innercontainer height if the children is positioned > 0 y.
    if (force || performance.now() - this.boundCached > 1000) {
        this.innerContainer.getLocalBounds(this.innerBounds);
        this.innerContainer.getLocalBounds(this.innerBounds);
        this.innerBounds.height = this.innerBounds.y + this.innerContainer.height;
        this.innerBounds.width = this.innerBounds.x + this.innerContainer.width;
        this.boundCached = performance.now();
    }

    return this.innerBounds;
};

ScrollingContainer.prototype.initScrolling = function () {
    var container = this.innerContainer,
        containerStart = new PIXI.Point(),
        targetPosition = new PIXI.Point(),
        lastPosition = new PIXI.Point(),
        Position = new PIXI.Point(),
        Speed = new PIXI.Point(),
        stop,
        self = this;

    this.forcePctPosition = function (direction, pct) {
        var bounds = this.getInnerBounds();

        if (this.scrollX && direction == "x") {
            container.position[direction] = -((bounds.width - this._width) * pct);
        }
        if (this.scrollY && direction == "y") {
            container.position[direction] = -((bounds.height - this._height) * pct);
        }
        Position[direction] = targetPosition[direction] = container.position[direction];
    };

    this.focusPosition = function (pos) {
        var bounds = this.getInnerBounds();

        var dif;
        if (this.scrollX) {
            var x = Math.max(0, (Math.min(bounds.width, pos.x)));
            if (x + container.x > this._width) {
                dif = x - this._width;
                container.x = -dif;
            }
            else if (x + container.x < 0) {
                dif = x + container.x;
                container.x -= dif;
            }
        }

        if (this.scrollY) {
            var y = Math.max(0, (Math.min(bounds.height, pos.y)));

            if (y + container.y > this._height) {
                dif = y - this._height;
                container.y = -dif;
            }
            else if (y + container.y < 0) {
                dif = y + container.y;
                container.y -= dif;
            }
        }

        lastPosition.copy(container.position);
        targetPosition.copy(container.position);
        Position.copy(container.position);
        this.updateScrollBars();

    };

    this.setScrollPosition = function (speed) {
        if (speed) {
            Speed = speed;
        }

        if (!this.animating) {
            this.animating = true;
            lastPosition.copy(container.position);
            targetPosition.copy(container.position);
            Ticker.on("update", this.updateScrollPosition, this);
        }
    };

    this.updateScrollPosition = function (delta) {
        stop = true;
        if (this.scrollX) this.updateDirection("x", delta);
        if (this.scrollY) this.updateDirection("y", delta);
        if (stop) {
            Ticker.removeListener("update", this.updateScrollPosition);
            this.animating = false;
        }
    };



    this.updateDirection = function (direction, delta) {
        var bounds = this.getInnerBounds();

        var min;
        if (direction == "y")
            min = Math.round(Math.min(0, this._height - bounds.height));
        else
            min = Math.round(Math.min(0, this._width - bounds.width));

        if (!this.scrolling && Math.round(Speed[direction]) !== 0) {
            targetPosition[direction] += Speed[direction];
            Speed[direction] = MathHelper.Lerp(Speed[direction], 0, (5 + 2.5 / Math.max(this.softness, 0.01)) * delta);

            if (targetPosition[direction] > 0) {
                targetPosition[direction] = 0;

            }
            else if (targetPosition[direction] < min) {
                targetPosition[direction] = min;

            }
        }

        if (!this.scrolling && Math.round(Speed[direction]) === 0 && (container[direction] > 0 || container[direction] < min)) {
            var target = Position[direction] > 0 ? 0 : min;
            Position[direction] = MathHelper.Lerp(Position[direction], target, (40 - (30 * this.softness)) * delta);
            stop = false;
        }
        else if (this.scrolling || Math.round(Speed[direction]) !== 0) {

            if (this.scrolling) {
                Speed[direction] = Position[direction] - lastPosition[direction];
                lastPosition.copy(Position);
            }
            if (targetPosition[direction] > 0) {
                Speed[direction] = 0;
                Position[direction] = 100 * this.softness * (1 - Math.exp(targetPosition[direction] / -200));
            }
            else if (targetPosition[direction] < min) {
                Speed[direction] = 0;
                Position[direction] = min - (100 * this.softness * (1 - Math.exp((min - targetPosition[direction]) / -200)));
            }
            else {
                Position[direction] = targetPosition[direction];
            }
            stop = false;
        }

        container.position[direction] = Math.round(Position[direction]);

        self.updateScrollBars();

    };


    //Drag scroll
    if (this.dragScrolling) {
        var drag = new DragEvent(this);
        drag.onDragStart = function (e) {
            if (!this.scrolling) {
                containerStart.copy(container.position);
                Position.copy(container.position);
                this.scrolling = true;
                this.setScrollPosition();
                self.emit("dragStart", e);
            }
        };

        drag.onDragMove = function (e, offset) {
            if (this.scrollX)
                targetPosition.x = containerStart.x + offset.x;
            if (this.scrollY)
                targetPosition.y = containerStart.y + offset.y;
        };

        drag.onDragEnd = function (e) {
            if (this.scrolling) {
                this.scrolling = false;
                self.emit("dragEnd", e);
            }
        };
    }

    //Mouse scroll
    var scrollSpeed = new PIXI.Point();
    var scroll = new MouseScrollEvent(this, true);
    scroll.onMouseScroll = function (e, delta) {
        scrollSpeed.set(-delta.x * 0.2, -delta.y * 0.2);
        this.setScrollPosition(scrollSpeed);
    };


    self.updateScrollBars();


};




