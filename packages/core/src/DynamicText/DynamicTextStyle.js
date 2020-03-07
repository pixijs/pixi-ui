function DynamicTextStyle(parent)
{
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
    this._tint = '#FFFFFF';
    this._fill = '#FFFFFF';
    this._shadow = '';
    this._stroke = 0;
    this._strokeFill = '';
    this._strokeShadow = '';
    this._wrap = true;
    this._breakWords = false;
    this._overflowX = 'visible'; // visible|hidden
    this._overflowY = 'visible'; // visible|hidden
    this._ellipsis = false;

    let _cachedEllipsisSize = null;

    this.ellipsisSize = function (atlas)
    {
        if (!this.ellipsis) return 0;
        if (_cachedEllipsisSize === null)
        { _cachedEllipsisSize = (atlas.getCharObject('.', this).width + this.letterSpacing) * 3; }

        return _cachedEllipsisSize;
    };
}

DynamicTextStyle.prototype.clone = function ()
{
    const style = new DynamicTextStyle();

    style.merge(this);

    return style;
};

DynamicTextStyle.prototype.merge = function (style)
{
    if (typeof style === 'object')
    {
        this.respectDirty = false;
        for (const param in style)
        {
            const val = style[param];

            if (typeof val === 'function' || param === 'respectDirty' || param === '_parent') continue;
            this[param] = style[param];
        }
        this.respectDirty = true;
        this._dirty = true;
    }
};

DynamicTextStyle.prototype.ctxKey = function (char)
{
    return [char, this.fill, this.shadow, this.stroke, this.strokeFill, this.strokeShadow].join('|');
};

DynamicTextStyle.prototype.ctxFont = function ()
{
    const fontSize = `${Math.min(200, Math.max(1, this.fontSize || 26))}px `;
    const fontWeight = this.fontWeight === 'bold' ? `${this.fontWeight} ` : '';
    const fontStyle = this.fontStyle === 'italic' || this.fontStyle === 'oblique' ? `${this.fontStyle} ` : '';

    return fontWeight + fontStyle + fontSize + this.fontFamily;
};

DynamicTextStyle.prototype.constructor = DynamicTextStyle;

export { DynamicTextStyle };

Object.defineProperties(DynamicTextStyle.prototype, {
    _dirty: {
        set(val)
        {
            if (this.respectDirty)
            {
                if (this._parent !== null)
                {
                    this._parent.dirtyStyle = val;
                    this._parent.update();
                }
            }
        },
    },
    scale: {
        get()
        {
            return this._scale;
        },
        set(val)
        {
            if (val !== this._scale)
            {
                this._scale = val;
                this._dirty = true;
            }
        },
    },
    align: {
        get()
        {
            return this._align;
        },
        set(val)
        {
            if (val !== this._align)
            {
                this._align = val;
                this._dirty = true;
            }
        },
    },
    fontFamily: {
        get()
        {
            return this._fontFamily;
        },
        set(val)
        {
            if (val !== this._fontFamily)
            {
                this._fontFamily = val;
                this._dirty = true;
            }
        },
    },
    fontSize: {
        get()
        {
            return this._fontSize;
        },
        set(val)
        {
            if (val !== this._fontSize)
            {
                this._fontSize = val;
                this._dirty = true;
            }
        },
    },
    fontWeight: {
        get()
        {
            return this._fontWeight;
        },
        set(val)
        {
            if (val !== this._fontWeight)
            {
                this._fontWeight = val;
                this._dirty = true;
            }
        },
    },
    fontStyle: {
        get()
        {
            return this._fontStyle;
        },
        set(val)
        {
            if (val !== this._fontStyle)
            {
                this._fontStyle = val;
                this._dirty = true;
            }
        },
    },
    letterSpacing: {
        get()
        {
            return this._letterSpacing;
        },
        set(val)
        {
            if (val !== this._letterSpacing)
            {
                this._letterSpacing = val;
                this._dirty = true;
            }
        },
    },
    lineHeight: {
        get()
        {
            return this._lineHeight;
        },
        set(val)
        {
            if (val !== this._lineHeight)
            {
                this._lineHeight = val;
                this._dirty = true;
            }
        },
    },
    verticalAlign: {
        get()
        {
            return this._verticalAlign;
        },
        set(val)
        {
            if (val !== this._verticalAlign)
            {
                this._verticalAlign = val;
                this._dirty = true;
            }
        },
    },
    rotation: {
        get()
        {
            return this._rotation;
        },
        set(val)
        {
            if (val !== this._rotation)
            {
                this._rotation = val;
                this._dirty = true;
            }
        },
    },
    skew: {
        get()
        {
            return this._skew;
        },
        set(val)
        {
            if (val !== this._skew)
            {
                this._skew = val;
                this._dirty = true;
            }
        },
    },
    tint: {
        get()
        {
            return this._tint;
        },
        set(val)
        {
            if (val !== this._tint)
            {
                this._tint = val;
                this._dirty = true;
            }
        },
    },
    fill: {
        get()
        {
            return this._fill;
        },
        set(val)
        {
            if (val !== this._fill)
            {
                this._fill = val;
                this._dirty = true;
            }
        },
    },
    shadow: {
        get()
        {
            return this._shadow;
        },
        set(val)
        {
            if (val !== this._shadow)
            {
                this._shadow = val;
                this._dirty = true;
            }
        },
    },
    stroke: {
        get()
        {
            return this._stroke;
        },
        set(val)
        {
            if (val !== this._stroke)
            {
                this._stroke = val;
                this._dirty = true;
            }
        },
    },
    strokeFill: {
        get()
        {
            return this._strokeFill;
        },
        set(val)
        {
            if (val !== this._strokeFill)
            {
                this._strokeFill = val;
                this._dirty = true;
            }
        },
    },
    strokeShadow: {
        get()
        {
            return this._strokeShadow;
        },
        set(val)
        {
            if (val !== this._strokeShadow)
            {
                this._strokeShadow = val;
                this._dirty = true;
            }
        },
    },
    wrap: {
        get()
        {
            return this._wrap;
        },
        set(val)
        {
            if (val !== this._wrap)
            {
                this._wrap = val;
                this._dirty = true;
            }
        },
    },
    breakWords: {
        get()
        {
            return this._breakWords;
        },
        set(val)
        {
            if (val !== this._breakWords)
            {
                this._breakWords = val;
                this._dirty = true;
            }
        },
    },
    overflowX: {
        get()
        {
            return this._overflowX;
        },
        set(val)
        {
            if (val !== this._overflowX)
            {
                this._overflowX = val;
                this._dirty = true;
            }
        },
    },
    overflowY: {
        get()
        {
            return this._overflowY;
        },
        set(val)
        {
            if (val !== this._overflowY)
            {
                this._overflowY = val;
                this._dirty = true;
            }
        },
    },
    ellipsis: {
        get()
        {
            return this._ellipsis;
        },
        set(val)
        {
            if (val !== this._ellipsis)
            {
                this._ellipsis = val;
                this._dirty = true;
            }
        },
    },
});
