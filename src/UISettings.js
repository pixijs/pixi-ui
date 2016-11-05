/**
 * Settings object for all UIObjects
 *
 * @class
 * @memberof PIXI.UI
 */
function UISettings() {
    this._width = 0;
    this.width = 0;
    this.widthPct = null;
    this._height = 0;
    this.height = 0;
    this.heightPct = null;
    this.minWidth = 0;
    this.minWidthPct = null;
    this.minHeight = 0;
    this.minHeightPct = null;
    this.maxWidth = null;
    this.maxWidthPct = null;
    this.maxHeight = null;
    this.maxHeightPct = null;
    this.left = null;
    this.leftPct = null;
    this.right = null;
    this.rightPct = null;
    this.top = null;
    this.topPct = null;
    this.bottom = null;
    this.bottomPct = null;
    this.anchorLeft = null;
    this.anchorLeftPct = null;
    this.anchorRight = null;
    this.anchorRightPct = null;
    this.anchorTop = null;
    this.anchorTopPct = null;
    this.anchorBottom = null;
    this.anchorBottomPct = null;
    this.pivotX = null;
    this.pivotY = null;
    this.scaleX = null;
    this.scaleY = null;
    this.verticalAlign = null;
    this.horizontalAlign = null;
    this.rotation = null;
    this.blendMode = null;
    this.tint = null;
    this.alpha = null;
    this.draggable = null;
    this.dragRestricted = false;
    this.dragGroup = null;
    this.dragContainer = null;
    this.droppable = null;
}


module.exports = UISettings;


