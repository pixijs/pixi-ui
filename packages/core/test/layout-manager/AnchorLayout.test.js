const {
    WidgetGroup,
    AnchorLayout,
    AnchorLayoutOptions,
    ALIGN,
    MeasureMode,
}  = require('../../lib/puxi-core.cjs');
const { createMockWidgetRectangle } = require('../createMockWidget');
const { cloneWidgetSubtree } = require('../cloneWidgetSubtree');
const expect = require('chai').expect;

describe('AnchorLayout', () =>
{
    const mockReferenceLayout = new WidgetGroup().useLayout(new AnchorLayout())
        .addChild(
            createMockWidgetRectangle(300, 300).setLayoutOptions(new AnchorLayoutOptions({
                anchorLeft: 200,
                anchorTop: 200,
                anchorRight: 100,
                anchorBottom: 200,
                horizontalAlign: ALIGN.CENTER,
                verticalAlign: ALIGN.TOP,
            })),
        )
        .addChild(
            createMockWidgetRectangle(150, 150).setLayoutOptions(new AnchorLayoutOptions({
                anchorLeft: 0.50,
                anchorTop: 100,
                anchorRight: 0.25,
                anchorBottom: 50,
                horizontalAlign: ALIGN.NONE,
                verticalAlign: ALIGN.CENTER,
            })),
        );

    it('Measures itself as compact as possible', () =>
    {
        const mockParent = cloneWidgetSubtree(mockReferenceLayout);

        mockParent.measure(0, 0, MeasureMode.UNBOUNDED, MeasureMode.UNBOUNDED);

        expect(mockParent.getMeasuredWidth()).to.equal(600);
        expect(mockParent.getMeasuredHeight()).to.equal(700);
    });

    it('Lays out children correctly with below-optimal width and height', () =>
    {
        const mockParent = cloneWidgetSubtree(mockReferenceLayout);

        mockParent.measure(400, 600, MeasureMode.AT_MOST, MeasureMode.AT_MOST);

        expect(mockParent.getMeasuredWidth()).to.equal(400);
        expect(mockParent.getMeasuredHeight()).to.equal(600);

        mockParent.layout(0, 0, 400, 600);

        const absoluteWidget = mockParent.widgetChildren[0];

        expect(absoluteWidget.layoutMeasure.left).to.equal(200);
        expect(absoluteWidget.layoutMeasure.right).to.equal(300);

        const weightedWidget = mockParent.widgetChildren[1];

        expect(weightedWidget.layoutMeasure.left).to.equal(200);
        expect(weightedWidget.layoutMeasure.right).to.equal(300);
    });

    it('Fills intra-anchor regions of widgets with 0px width or height', () =>
    {
        const mockParent = cloneWidgetSubtree(mockReferenceLayout);

        mockParent.addChild(
            createMockWidgetRectangle(50, 50).setLayoutOptions(new AnchorLayoutOptions({
                anchorLeft: 0.8,
                anchorTop: 400,
                anchorRight: 0.1,
                anchorBottom: 200,
                width: 0,
                height: 0,
            })),
        );

        mockParent.measure(0, 0, MeasureMode.UNBOUNDED, MeasureMode.UNBOUNDED);

        expect(mockParent.getMeasuredWidth()).to.equal(600);
        expect(mockParent.getMeasuredHeight()).to.equal(700);

        mockParent.layout(0, 0, 600, 700);

        const fillerWidget = mockParent.widgetChildren[2];

        expect(fillerWidget.layoutMeasure.left).to.equal(0.8 * 600);
        expect(fillerWidget.layoutMeasure.top).to.equal(400);
        expect(fillerWidget.layoutMeasure.right).to.equal(0.9 * 600);
        expect(fillerWidget.layoutMeasure.bottom).to.equal(500);
    });
});

