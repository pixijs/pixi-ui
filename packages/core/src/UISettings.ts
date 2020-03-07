/**
 * Layout and rendering configuration for a `PIXI.UI.UIBase`.
 *
 * @class
 * @memberof PIXI.UI
 */
export class UISettings
{
    public width: number;
    public height: number;
    public minWidth: number;
    public minHeight: number;
    public maxWidth: number;
    public maxHeight: number;

    public left: number;
    public top: number;
    public right: number;
    public bottom: number;

    public anchorLeft: number;
    public anchorTop: number;
    public anchorRight: number;
    public anchorBottom: number;

    public widthPct: number;
    public heightPct: number;
    public minWidthPct: number;
    public minHeightPct: number;
    public maxWidthPct: number;
    public maxHeightPct: number;

    public leftPct: number;
    public topPct: number;
    public rightPct: number;
    public bottomPct: number;

    public anchorLeftPct: number;
    public anchorTopPct: number;
    public anchorBottomPct: number;
    public anchorRightPct: number;

    public pivotX: number;
    public pivotY: number;
    public scaleX: number;
    public scaleY: number;

    public horizontalAlign: boolean;
    public verticalAlign: boolean;

    public rotation: number;
    public blendMode: number;
    public tint: number;
    public alpha: number;

    public draggable: boolean;
    public dragRestricted: boolean;
    public dragRestrictAxis: PIXI.Point;
    public dragGroup: any;
    public dragThreshold: number;
    public dragContainer: PIXI.Container;
    public droppable: boolean;
    public droppableParent: boolean;
    public droppableReparent: boolean;
    public dropGroup: any;

    constructor()
    {
        this.width = 0;
        this.height = 0;
        this.minWidth = 0;
        this.minHeight = 0;
        this.maxWidth = null;
        this.maxHeight = null;

        this.left = null;
        this.right = null;
        this.top = null;
        this.bottom = null;

        this.anchorLeft = null;
        this.anchorRight = null;
        this.anchorTop = null;
        this.anchorBottom = null;

        this.widthPct = null;
        this.heightPct = null;
        this.minWidthPct = null;
        this.minHeightPct = null;
        this.maxWidthPct = null;
        this.maxHeightPct = null;
        this.leftPct = null;
        this.rightPct = null;
        this.topPct = null;
        this.bottomPct = null;
        this.anchorLeftPct = null;
        this.anchorRightPct = null;
        this.anchorTopPct = null;
        this.anchorBottomPct = null;

        this.pivotX = 0;
        this.pivotY = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.verticalAlign = null;
        this.horizontalAlign = null;
        this.rotation = null;
        this.blendMode = null;
        this.tint = null;
        this.alpha = 1;

        this.draggable = null;
        this.dragRestricted = false;
        this.dragRestrictAxis = null; // x, y
        this.dragThreshold = 0;
        this.dragGroup = null;
        this.dragContainer = null;
        this.droppable = null;
        this.droppableReparent = null;
        this.dropGroup = null;
    }
}

export default UISettings;
