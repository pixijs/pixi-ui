const PUXI = require('../lib/puxi-core.cjs');
const PIXI = require('pixi.js');

function createMockWidget(content)
{
    const mock = new PUXI.Widget(content.width, content.height);

    mock.contentContainer.addChild(content);

    mock.update = () => {};

    return mock;
}

function createMockWidgetRectangle(width, height)
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
