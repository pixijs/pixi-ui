const {
    WidgetGroup,
    FastLayout,
    FastLayoutOptions,
    LayoutOptions,
    MeasureMode,
} = require('../../lib/puxi-core.cjs');
const { createMockWidgetRectangle } = require('../createMockWidget');
const { cloneWidgetSubtree } = require('../cloneWidgetSubtree');
const expect = require('chai').expect;

describe('FastLayout', () =>
{
    const mockReferenceLayout = new WidgetGroup().useLayout(new FastLayout())
        .addChild(
            createMockWidgetRectangle(100, 120).setLayoutOptions(
                new FastLayoutOptions({
                    width: LayoutOptions.FILL_PARENT,
                    height: 0.33,
                    x: 0,
                    y: 0.67,
                }),
            ),
        )
        .addChild(
            createMockWidgetRectangle(60, 90).setLayoutOptions(
                new FastLayoutOptions({
                    x: 80,
                    y: 0.80,
                }),
            ),
        );

    it('Measures itself as compact as possible and correctly lays out children when unbounded', () =>
    {
        const mockParent = cloneWidgetSubtree(mockReferenceLayout);

        mockParent.measure(0, 0, MeasureMode.UNBOUNDED, MeasureMode.UNBOUNDED);

        expect(mockParent.getMeasuredWidth()).to.closeTo(140, 0.0001);
        expect(mockParent.getMeasuredHeight()).to.closeTo(450, 0.0001);

        mockParent.layout(0, 0, 140, 450);

        const [fillerWidget, otherWidget] = mockParent.widgetChildren;

        expect(fillerWidget.layoutMeasure.left).to.equal(0);
        expect(fillerWidget.layoutMeasure.top).to.equal(0.67 * 450);
        expect(fillerWidget.layoutMeasure.right).to.equal(140);
        expect(fillerWidget.layoutMeasure.bottom).to.closeTo(450, 0.0001);

        expect(otherWidget.layoutMeasure.left).to.equal(80);
        expect(otherWidget.layoutMeasure.top).to.equal(0.8 * 450);
        expect(otherWidget.layoutMeasure.right).to.closeTo(140, 0.0001);
        expect(otherWidget.layoutMeasure.bottom).to.closeTo(450, 0.0001);
    });
});
