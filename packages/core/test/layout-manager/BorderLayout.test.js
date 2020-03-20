const PUXI = require('../../lib/puxi-core.cjs');
const { createMockWidget, createMockWidgetRectangle } = require('../createMockWidget');
const expect = require('chai').expect;

const {
    REGION_LEFT,
    REGION_BOTTOM,
} = PUXI.BorderLayoutOptions;

describe('BorderLayout', () =>
{
    it('Does not downscale border widgets with pre-defined dimensions', () =>
    {
        const mockLayout = new PUXI.BorderLayout();
        const mockParent = new PUXI.WidgetGroup().useLayout(mockLayout);

        const leftWidget = createMockWidget().setLayoutOptions(
            new PUXI.BorderLayoutOptions(32, 96, REGION_LEFT));
        const bottomWidget = createMockWidget().setLayoutOptions(
            new PUXI.BorderLayoutOptions(96, 32, REGION_BOTTOM));
        const centerWidget = createMockWidgetRectangle(128, 128);

        mockParent.addChild(leftWidget, bottomWidget, centerWidget);

        mockParent.measure(128 + 16, 128 + 16, PUXI.MeasureMode.AT_MOST, PUXI.MeasureMode.AT_MOST);

        expect(leftWidget.getMeasuredWidth()).to.equal(32);
        expect(leftWidget.getMeasuredHeight()).to.equal(96);
        expect(centerWidget.getMeasuredWidth()).to.equal(128 - 16);

        expect(bottomWidget.getMeasuredWidth()).to.equal(96);
        expect(bottomWidget.getMeasuredHeight()).to.equal(32);
        expect(centerWidget.getMeasuredHeight()).to.equal(128 - 16);

        expect(mockLayout.measuredLeftWidth).to.equal(32);
        expect(mockLayout.measuredBottomHeight).to.equal(32);
    });
});
