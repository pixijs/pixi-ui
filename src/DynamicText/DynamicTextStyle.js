function DynamicTextStyle(parent) {
    this.respectDirty = true;
    this._parent = parent || null;
    this._scale = 1;
    this._align = 'left';
    this._fontFamily = 'Arial';
    this._fontSize = 26;
    this._fontWeight = 'normal';
    this._fontStyle = 'normal';
    this._letterSpacing = 0;
    this._lineHeight = 0;
    this._verticalAlign = 0;
    this._rotation = 0;
    this._skew = 0;
    this._tint = "#FFFFFF";
    this._fill = '#FFFFFF';
    this._shadow = '';
    this._stroke = 0;
    this._strokeFill = '';
    this._strokeShadow = '';
    this._wrap = true;
    this._breakWords = false;
    this._overflowX = 'visible'; //visible|hidden
    this._overflowY = 'visible'; //visible|hidden
    this._ellipsis = false;


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
        this.respectDirty = false;
        for (var param in style) {
            var val = style[param];
            if (typeof val === 'function' || param === 'respectDirty' || param === '_parent') continue;
            this[param] = style[param];
        }
        this.respectDirty = true;
        this._dirty = true;
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

Object.defineProperties(DynamicTextStyle.prototype, {
    _dirty: {
        set: function (val) {
            if (this.respectDirty) {
                if (this._parent !== null) {
                    this._parent.dirtyStyle = val;
                    this._parent.update();
                }
            }
        }
    },
    scale: {
        get: function () {
            return this._scale;
        },
        set: function (val) {
            if (val !== this._scale) {
                this._scale = val;
                this._dirty = true;
            }
        }
    },
    align: {
        get: function () {
            return this._align;
        },
        set: function (val) {
            if (val !== this._align) {
                this._align = val;
                this._dirty = true;
            }
        }
    },
    fontFamily: {
        get: function () {
            return this._fontFamily;
        },
        set: function (val) {
            if (val !== this._fontFamily) {
                this._fontFamily = val;
                this._dirty = true;
            }
        }
    },
    fontSize: {
        get: function () {
            return this._fontSize;
        },
        set: function (val) {
            if (val !== this._fontSize) {
                this._fontSize = val;
                this._dirty = true;
            }
        }
    },
    fontWeight: {
        get: function () {
            return this._fontWeight;
        },
        set: function (val) {
            if (val !== this._fontWeight) {
                this._fontWeight = val;
                this._dirty = true;
            }
        }
    },
    fontStyle: {
        get: function () {
            return this._fontStyle;
        },
        set: function (val) {
            if (val !== this._fontStyle) {
                this._fontStyle = val;
                this._dirty = true;
            }
        }
    },
    letterSpacing: {
        get: function () {
            return this._letterSpacing;
        },
        set: function (val) {
            if (val !== this._letterSpacing) {
                this._letterSpacing = val;
                this._dirty = true;
            }
        }
    },
    lineHeight: {
        get: function () {
            return this._lineHeight;
        },
        set: function (val) {
            if (val !== this._lineHeight) {
                this._lineHeight = val;
                this._dirty = true;
            }
        }
    },
    verticalAlign: {
        get: function () {
            return this._verticalAlign;
        },
        set: function (val) {
            if (val !== this._verticalAlign) {
                this._verticalAlign = val;
                this._dirty = true;
            }
        }
    },
    rotation: {
        get: function () {
            return this._rotation;
        },
        set: function (val) {
            if (val !== this._rotation) {
                this._rotation = val;
                this._dirty = true;
            }
        }
    },
    skew: {
        get: function () {
            return this._skew;
        },
        set: function (val) {
            if (val !== this._skew) {
                this._skew = val;
                this._dirty = true;
            }
        }
    },
    tint: {
        get: function () {
            return this._tint;
        },
        set: function (val) {
            if (val !== this._tint) {
                this._tint = val;
                this._dirty = true;
            }
        }
    },
    fill: {
        get: function () {
            return this._fill;
        },
        set: function (val) {
            if (val !== this._fill) {
                this._fill = val;
                this._dirty = true;
            }
        }
    },
    shadow: {
        get: function () {
            return this._shadow;
        },
        set: function (val) {
            if (val !== this._shadow) {
                this._shadow = val;
                this._dirty = true;
            }
        }
    },
    stroke: {
        get: function () {
            return this._stroke;
        },
        set: function (val) {
            if (val !== this._stroke) {
                this._stroke = val;
                this._dirty = true;
            }
        }
    },
    strokeFill: {
        get: function () {
            return this._strokeFill;
        },
        set: function (val) {
            if (val !== this._strokeFill) {
                this._strokeFill = val;
                this._dirty = true;
            }
        }
    },
    strokeShadow: {
        get: function () {
            return this._strokeShadow;
        },
        set: function (val) {
            if (val !== this._strokeShadow) {
                this._strokeShadow = val;
                this._dirty = true;
            }
        }
    },
    wrap: {
        get: function () {
            return this._wrap;
        },
        set: function (val) {
            if (val !== this._wrap) {
                this._wrap = val;
                this._dirty = true;
            }
        }
    },
    breakWords: {
        get: function () {
            return this._breakWords;
        },
        set: function (val) {
            if (val !== this._breakWords) {
                this._breakWords = val;
                this._dirty = true;
            }
        }
    },
    overflowX: {
        get: function () {
            return this._overflowX;
        },
        set: function (val) {
            if (val !== this._overflowX) {
                this._overflowX = val;
                this._dirty = true;
            }
        }
    },
    overflowY: {
        get: function () {
            return this._overflowY;
        },
        set: function (val) {
            if (val !== this._overflowY) {
                this._overflowY = val;
                this._dirty = true;
            }
        }
    },
    ellipsis: {
        get: function () {
            return this._ellipsis;
        },
        set: function (val) {
            if (val !== this._ellipsis) {
                this._ellipsis = val;
                this._dirty = true;
            }
        }
    }
});