var UIBase = require('./UIBase'),
    Container = require('./Container'),
    MathHelper = require('./MathHelper'),
    Ticker = require('./Ticker'),
    DragEvent = require('./Interaction/DragEvent'),
    MouseScrollEvent = require('./Interaction/MouseScrollEvent');


/**
 * An UI Container object with overflow hidden and possibility to enable scrolling
 *
 * @class
 * @extends PIXI.UI.UIBase
 * @memberof PIXI.UI
 * @param width {Number} Width of the Container
 * @param height {Number} Height of the Container
 */
function ScrollingContainer(scrollY, scrollX, smoothness, cornerRadius, width, height) {
    Container.call(this, width, height);
    this.mask = new PIXI.Graphics();
    this.innerContainer = new PIXI.Container();
    this.container.addChild(this.mask);
    this.container.addChild(this.innerContainer);
    this.container.mask = this.mask;
    this.scrollX = scrollX;
    this.scrollY = scrollY;
    this.smoothness = Math.max(Math.min(smoothness || 0, 1), 0);
    this.cornerRadius = cornerRadius || 0;
    this.animating = false;
    this.scrolling = false;
    this._scrollBars = [];
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
        this.mask.clear();
        this.mask.lineStyle(0);
        this.mask.beginFill(0xFFFFFF, 1);
        if (this.cornerRadius === 0) {

            //this.mask.drawRect(0, 0, this._width, this._height);
            this.mask.moveTo(0, 0);
            this.mask.lineTo(this._width, 0);
            this.mask.lineTo(this._width, this._height);
            this.mask.lineTo(0, this._height);
            this.mask.lineTo(0, 0);

        }
        else {
            this.mask.drawRoundedRect(0, 0, this._width, this.height, this.cornerRadius);
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
    }
    return UIObject;
};


ScrollingContainer.prototype.updateScrollBars = function () {
    for (var i = 0; i < this._scrollBars.length; i++) {
        this._scrollBars[i].alignToContainer();
    }
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
        if (this.scrollX && direction == "x") {
            this.innerContainer.position[direction] = -((this.innerContainer.width - this._width) * pct);
        }
        if (this.scrollY && direction == "y") {
            this.innerContainer.position[direction] = -((this.innerContainer.height - this._height) * pct);
        }
        Position[direction] = targetPosition[direction] = this.innerContainer.position[direction];
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
        var min;
        if (direction == "y")
            min = Math.round(Math.min(0, this._height - container.height));
        else
            min = Math.round(Math.min(0, this._width - container.width));

        if (!this.scrolling && Math.round(Speed[direction]) !== 0) {
            targetPosition[direction] += Speed[direction];
            Speed[direction] = MathHelper.Lerp(Speed[direction], 0, (5 + 2.5 / Math.max(this.smoothness, 0.01)) * delta);

            if (targetPosition[direction] > 0) {
                targetPosition[direction] = 0;

            }
            else if (targetPosition[direction] < min) {
                targetPosition[direction] = min;

            }
        }

        if (!this.scrolling && Math.round(Speed[direction]) === 0 && (container[direction] > 0 || container[direction] < min)) {
            var target = Position[direction] > 0 ? 0 : min;
            Position[direction] = MathHelper.Lerp(Position[direction], target, (40 - (30 * this.smoothness)) * delta);
            stop = false;
        }
        else if (this.scrolling || Math.round(Speed[direction]) !== 0) {

            if (this.scrolling) {
                Speed[direction] = Position[direction] - lastPosition[direction];
                lastPosition.copy(Position);
            }

            if (targetPosition[direction] > 0) {
                Speed[direction] = 0;
                Position[direction] = 100 * this.smoothness * (1 - Math.exp(targetPosition[direction] / -200));
            }
            else if (targetPosition[direction] < min) {
                Speed[direction] = 0;
                Position[direction] = min - (100 * this.smoothness * (1 - Math.exp((min - targetPosition[direction]) / -200)));
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
    var drag = new DragEvent(this);
    drag.onDragStart = function (e) {
        if (!this.scrolling) {
            containerStart.copy(container.position);
            Position.copy(container.position);
            this.scrolling = true;
            this.setScrollPosition();
        }
    };

    drag.onDragMove = function (e, offset) {
        if (this.scrollX)
            targetPosition.x = containerStart.x + offset.x;
        if (this.scrollY)
            targetPosition.y = containerStart.y + offset.y;
    };

    drag.onDragEnd = function (e) {
        this.scrolling = false;
    };


    //Mouse scroll
    var scrollSpeed = new PIXI.Point();
    var scroll = new MouseScrollEvent(this, true);
    scroll.onMouseScroll = function (e, delta) {
        scrollSpeed.set(-delta.x * 0.2, -delta.y * 0.2);
        this.setScrollPosition(scrollSpeed);
    };


    self.updateScrollBars();


};




