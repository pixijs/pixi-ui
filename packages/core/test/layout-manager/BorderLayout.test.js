const {
    WidgetGroup,
    BorderLayout,
    BorderLayoutOptions,
    MeasureMode,
} = require('../../lib/puxi-core.cjs');
const { createMockWidget, createMockWidgetRectangle } = require('../createMockWidget');
const { cloneWidgetSubtree } = require('../cloneWidgetSubtree');
const expect = require('chai').expect;

const {
    REGION_LEFT,
    REGION_BOTTOM,
} = BorderLayoutOptions;

describe('BorderLayout', () =>
{
    const mockReferenceLayout = new WidgetGroup().useLayout(new BorderLayout());

    mockReferenceLayout.addChild(
        createMockWidget().setLayoutOptions(
            new BorderLayoutOptions({ width: 32, height: 96, region: REGION_LEFT })),
        createMockWidget().setLayoutOptions(
            new BorderLayoutOptions({ width: 96, height: 32, region: REGION_BOTTOM })),
        createMockWidgetRectangle(128, 128));

    it('Does not downscale border widgets with pre-defined dimensions', () =>
    {
        const mockParent = cloneWidgetSubtree(mockReferenceLayout);
        const [leftWidget, bottomWidget, centerWidget] = mockParent.widgetChildren;

        mockParent.measure(128 + 16, 128 + 16, MeasureMode.AT_MOST, MeasureMode.AT_MOST);

        expect(leftWidget.getMeasuredWidth()).to.equal(32);
        expect(leftWidget.getMeasuredHeight()).to.equal(96);
        expect(centerWidget.getMeasuredWidth()).to.equal(128 - 16);

        expect(bottomWidget.getMeasuredWidth()).to.equal(96);
        expect(bottomWidget.getMeasuredHeight()).to.equal(32);
        expect(centerWidget.getMeasuredHeight()).to.equal(128 - 16);

        expect(mockParent.layoutMgr.measuredLeftWidth).to.equal(32);
        expect(mockParent.layoutMgr.measuredBottomHeight).to.equal(32);
    });
});
