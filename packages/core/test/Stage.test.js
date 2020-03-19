const { createMockWidgetRectangle } = require('./createMockWidget');
const PUXI = require('../lib/puxi-core.cjs');
const expect = require('chai').expect;

describe('Stage', () =>
{
    it('Implements fast-layout algorithm correctly!', () =>
    {
        const mockStage = new PUXI.Stage(512, 1024);

        const mockRects = [
            createMockWidgetRectangle(128, 128)
                .setLayoutOptions(new PUXI.FastLayoutOptions(
                    PUXI.LayoutOptions.WRAP_CONTENT,
                    PUXI.LayoutOptions.WRAP_CONTENT,
                    64,
                    64,
                )),
            createMockWidgetRectangle(256, 256)
                .setLayoutOptions(new PUXI.FastLayoutOptions(
                    0.5,
                    PUXI.LayoutOptions.WRAP_CONTENT,
                    128,
                    0.5,
                )),
        ];

        mockStage.addChild(...mockRects);

        expect(mockRects[0].layoutMeasure.left).to.equal(64);
        expect(mockRects[0].layoutMeasure.top).to.equal(64);
        expect(mockRects[0].layoutMeasure.right).to.equal(192);
        expect(mockRects[0].layoutMeasure.bottom).to.equal(192);

        expect(mockRects[1].layoutMeasure.left).to.equal(128);
        expect(mockRects[1].layoutMeasure.top).to.equal(512);
        expect(mockRects[1].layoutMeasure.right).to.equal(384);
        expect(mockRects[1].layoutMeasure.bottom).to.equal(768);
    });
});
