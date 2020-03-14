import * as PUXI from '../bin/pixi-ui';
import { createMockWidgetRectangle } from './createMockWidget';

describe('Stage', () =>
{
    test('Implements fast-layout algorithm correctly!', () =>
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

        expect(mockRects[0].layoutMeasure.left).toBe(64);
        expect(mockRects[0].layoutMeasure.top).toBe(64);
        expect(mockRects[0].layoutMeasure.right).toBe(192);
        expect(mockRects[0].layoutMeasure.bottom).toBe(192);

        expect(mockRects[1].layoutMeasure.left).toBe(128);
        expect(mockRects[1].layoutMeasure.top).toBe(512);
        expect(mockRects[1].layoutMeasure.right).toBe(384);
        expect(mockRects[1].layoutMeasure.bottom).toBe(768);
    });
});
