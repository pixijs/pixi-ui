const PUXI = require('../lib/puxi-core.cjs');
const PIXI = require('pixi.js');

function createMockWidget(content)
{
    const mock = new PUXI.Widget();

    if (content)
    { mock.contentContainer.addChild(content); }

    return mock;
}

function createMockWidgetRectangle(width = 0, height = 0)
{
    const rect = new PIXI.Graphics();

    rect.beginFill(0xffabcd);
    rect.drawRect(0, 0, width, height);
    rect.endFill();

    return createMockWidget(rect);
}

module.exports = {
    createMockWidget,
    createMockWidgetRectangle,
};
