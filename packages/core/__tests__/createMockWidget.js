import * as PUXI from '../bin/pixi-ui';
import * as PIXI from 'pixi.js';

export function createMockWidget(content)
{
    const mock = new PUXI.Widget(content.width, content.height);

    mock.container.addChild(content);

    mock.update = () => {};

    return mock;
}

export function createMockWidgetRectangle(width, height)
{
    const rect = new PIXI.Graphics();

    rect.beginFill(0xffabcd);
    rect.drawRect(0, 0, width, height);
    rect.endFill();

    return createMockWidget(rect);
}
