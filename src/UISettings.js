/**
 * Settings object for all UIObjects
 *
 * @class
 * @memberof PIXI.UI
 */
function UISettings() {
    this.width = 0;
    this.height = 0;
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
    this.minWidth = 0;
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
    this.dragRestrictAxis = null; //x, y
    this.dragThreshold = 0;
    this.dragGroup = null;
    this.dragContainer = null;
    this.droppable = null;
    this.droppableReparent = null;
    this.dropGroup = null;
}


module.exports = UISettings;


