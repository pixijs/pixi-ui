const PUXI = require('../../lib/puxi-core.cjs');
const { createMockWidgetRectangle } = require('../createMockWidget');
const expect = require('chai').expect;

describe('AnchorLayout', () =>
{
    it('Lays out weighted anchors correctly', () =>
    {
        const mockLayout = new PUXI.AnchorLayout();
        const mockParent = new PUXI.WidgetGroup();

        mockParent.useLayout(mockLayout);

        mockParent.addChild(
            createMockWidgetRectangle(300, 300).setLayoutOptions(new PUXI.AnchorLayoutOptions({
                anchorLeft: 200,
                anchorTop: 200,
                anchorRight: 500,
                anchorBottom: 700,
                horizontalAlign: PUXI.ALIGN.CENTER,
                verticalAlign: PUXI.ALIGN.TOP,
            })));
        mockParent.addChild(
            createMockWidgetRectangle(150, 150).setLayoutOptions(new PUXI.AnchorLayoutOptions({
                anchorLeft: 0.50,
                anchorTop: 100,
                anchorRight: 0.75,
                anchorBottom: 300,
                horizontalAlign: PUXI.ALIGN.NONE,
                verticalAlign: PUXI.ALIGN.CENTER,
            })));

        mockParent.measure(0, 0, PUXI.MeasureMode.UNBOUNDED, PUXI.MeasureMode.UNBOUNDED);

        expect(mockParent.getMeasuredWidth()).to.equal(600);
        expect(mockParent.getMeasuredHeight()).to.equal(700);

        mockParent.layout(0, 0, mockParent.getMeasuredWidth(), mockParent.getMeasuredWidth(), true);
    });
});

