import * as PUXI from '../../bin/pixi-ui';
import { createMockWidgetRectangle } from '../createMockWidget';

describe('AnchorLayout', () =>
{
    test('Lays out weighted anchors correctly', () =>
    {
        const mockLayout = new PUXI.AnchorLayout();
        const mockParent = new PUXI.WidgetGroup();

        mockParent.useLayout(mockLayout);

        mockParent.addChild(
            createMockWidgetRectangle(300, 300)
                .setLayoutOptions(new PUXI.AnchorLayoutOptions(
                    200,
                    200,
                    500,
                    700,
                    PUXI.ALIGN.CENTER,
                    PUXI.ALIGN.TOP,
                )));

        mockParent.addChild(
            createMockWidgetRectangle(150, 150)
                .setLayoutOptions(new PUXI.AnchorLayoutOptions(
                    0.50,
                    100,
                    0.75,
                    300,
                    PUXI.ALIGN.NONE,
                    PUXI.ALIGN.CENTER,
                )));

        mockParent.measure(0, 0, PUXI.MeasureMode.UNBOUNDED, PUXI.MeasureMode.UNBOUNDED);

        expect(mockParent.getMeasuredWidth()).toBe(600);
        expect(mockParent.getMeasuredHeight()).toBe(700);

        mockParent.layout(0, 0, mockParent.getMeasuredWidth(), mockParent.getMeasuredWidth(), true);
    });
});

