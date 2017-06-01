function DynamicTextStyle() {
    this.scale = 1;
    this.align = 'left';
    this.fontFamily = 'Arial';
    this.fontSize = 26;
    this.fontWeight = 'normal';
    this.fontStyle = 'normal';
    this.letterSpacing = 0;
    this.lineHeight = 0;
    this.verticalAlign = 0;
    this.rotation = 0;
    this.skew = 0;
    this.tint = "#FFFFFF";
    this.fill = '#FFFFFF'; 
    this.shadow = '';
    this.stroke = 0;
    this.strokeFill = '';
    this.strokeShadow = '';
    this.wrap = true;
    this.breakWords = false;
    this.overflowX = 'visible'; //visible|hidden
    this.overflowY = 'visible'; //visible|hidden
    this.ellipsis = false;


    var _cachedEllipsisSize = null;
    this.ellipsisSize = function (atlas) {
        if (!this.ellipsis) return 0;
        if (_cachedEllipsisSize === null)
            _cachedEllipsisSize = (atlas.getCharObject(".", this).width + this.letterSpacing) * 3;
        return _cachedEllipsisSize;
    };
}


DynamicTextStyle.prototype.clone = function () {
    var style = new DynamicTextStyle();
    style.merge(this);
    return style;
};

DynamicTextStyle.prototype.merge = function (style) {
    if (typeof style === 'object') {
        for (var param in style) {
            var val = style[param];
            if (typeof val !== 'function')
                this[param] = val;
        }
    }
};

DynamicTextStyle.prototype.ctxKey = function (char) {
    return [char, this.fill, this.shadow, this.stroke, this.strokeFill, this.strokeShadow].join('|');
};

DynamicTextStyle.prototype.ctxFont = function () {
    var fontSize = Math.min(200, Math.max(1, this.fontSize || 26)) + "px ";
    var fontWeight = this.fontWeight === "bold" ? this.fontWeight + " " : "";
    var fontStyle = this.fontStyle === "italic" || this.fontStyle === "oblique" ? this.fontStyle + " " : "";
    return fontWeight + fontStyle + fontSize + this.fontFamily;
};

DynamicTextStyle.prototype.constructor = DynamicTextStyle;
module.exports = DynamicTextStyle;