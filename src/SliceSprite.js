var UIBase = require('./UIBase');

/**
 * A sliced sprite with dynamic width and height.
 *
 * @class
 * @memberof PIXI.UI
 * @param Texture {PIXI.Texture} the texture for this SliceSprite
 * @param BorderWidth {Number} Width of the sprite borders
 * @param horizontalSlice {Boolean} Slice the sprite horizontically
 * @param verticalSlice {Boolean} Slice the sprite vertically
 * @param [tile=false] {Boolean} tile or streach
 */
function SliceSprite(texture, borderWidth, horizontalSlice, verticalSlice, tile) {
    UIBase.call(this, texture.width, texture.height);

    var ftl, ftr, fbl, fbr, ft, fb, fl, fr, ff, stl, str, sbl, sbr, st, sb, sl, sr, sf,
        bw = borderWidth || 5,
        vs = typeof verticalSlice !== "undefined" ? verticalSlice : true,
        hs = typeof horizontalSlice !== "undefined" ? horizontalSlice : true,
        t = texture.baseTexture,
        f = texture.frame;


    if (hs) this.setting.minWidth = borderWidth * 2;
    if (vs) this.setting.minHeight = borderWidth * 2;

    this.initialize = function () {
        UIBase.prototype.initialize.apply(this);

        //get frames
        if (vs && hs) {
            ftl = new PIXI.Rectangle(f.x, f.y, bw, bw);
            ftr = new PIXI.Rectangle(f.x + f.width - bw, f.y, bw, bw);
            fbl = new PIXI.Rectangle(f.x, f.y + f.height - bw, bw, bw);
            fbr = new PIXI.Rectangle(f.x + f.width - bw, f.y + f.height - bw, bw, bw);
            ft = new PIXI.Rectangle(f.x + bw, f.y, f.width - bw * 2, bw);
            fb = new PIXI.Rectangle(f.x + bw, f.y + f.height - bw, f.width - bw * 2, bw);
            fl = new PIXI.Rectangle(f.x, f.y + bw, bw, f.height - bw * 2);
            fr = new PIXI.Rectangle(f.x + f.width - bw, f.y + bw, bw, f.height - bw * 2);
            ff = new PIXI.Rectangle(f.x + bw, f.y + bw, f.width - bw * 2, f.height - bw * 2);
        }
        else if (hs) {
            fl = new PIXI.Rectangle(f.x, f.y, bw, f.height);
            fr = new PIXI.Rectangle(f.x + f.width - bw, f.y, bw, f.height);
            ff = new PIXI.Rectangle(f.x + bw, f.y, f.width - bw * 2, f.height);
        }
        else { //vs
            ft = new PIXI.Rectangle(f.x, f.y, f.width, bw);
            fb = new PIXI.Rectangle(f.x, f.y + f.height - bw, f.width, bw);
            ff = new PIXI.Rectangle(f.x, f.y + bw, f.width, f.height - bw * 2);
        }

        //TODO: swap frames if rotation



        //make sprites
        sf = tile ? new PIXI.extras.TilingSprite(new PIXI.Texture(t, ff)) : new PIXI.Sprite(new PIXI.Texture(t, ff));
        this.container.addChildAt(sf, 0);
        if (vs && hs) {
            stl = new PIXI.Sprite(new PIXI.Texture(t, ftl));
            str = new PIXI.Sprite(new PIXI.Texture(t, ftr));
            sbl = new PIXI.Sprite(new PIXI.Texture(t, fbl));
            sbr = new PIXI.Sprite(new PIXI.Texture(t, fbr));
            this.container.addChildAt(stl, 0);
            this.container.addChildAt(str, 0);
            this.container.addChildAt(sbl, 0);
            this.container.addChildAt(sbr, 0);

        }
        if (hs) {
            sl = tile ? new PIXI.extras.TilingSprite(new PIXI.Texture(t, fl)) : new PIXI.Sprite(new PIXI.Texture(t, fl));
            sr = tile ? new PIXI.extras.TilingSprite(new PIXI.Texture(t, fr)) : new PIXI.Sprite(new PIXI.Texture(t, fr));
            this.container.addChildAt(sl, 0);
            this.container.addChildAt(sr, 0);
        }
        if (vs) {
            st = tile ? new PIXI.extras.TilingSprite(new PIXI.Texture(t, ft)) : new PIXI.Sprite(new PIXI.Texture(t, ft));
            sb = tile ? new PIXI.extras.TilingSprite(new PIXI.Texture(t, fb)) : new PIXI.Sprite(new PIXI.Texture(t, fb));
            this.container.addChildAt(st, 0);
            this.container.addChildAt(sb, 0);
        }

        //set constant position and sizes
        if (vs && hs) st.x = sb.x = sl.y = sr.y = stl.width = str.width = sbl.width = sbr.width = stl.height = str.height = sbl.height = sbr.height = bw;
        if (hs) sf.x = sl.width = sr.width = bw;
        if (vs) sf.y = st.height = sb.height = bw;
    };

    /**
     * Updates the sliced sprites position and size
     *
     * @private
     */
    this.update = function () {
        if (!this.initialized) return;
        if (vs && hs) {
            str.x = sbr.x = sr.x = this._width - bw;
            sbl.y = sbr.y = sb.y = this._height - bw;
            sf.width = st.width = sb.width = this._width - bw * 2;
            sf.height = sl.height = sr.height = this._height - bw * 2;
        }
        else if (hs) {
            sr.x = this._width - bw;
            sl.height = sr.height = sf.height = this._height;
            sf.width = this._width - bw * 2;
        }
        else { //vs
            sb.y = this._height - bw;
            st.width = sb.width = sf.width = this._width;
            sf.height = this._height - bw * 2;
        }

        if (this.tint !== null) {
            sf.tint = this.tint;
            if (vs && hs) stl.tint = str.tint = sbl.tint = sbr.tint = this.tint;
            if (hs) sl.tint = sr.tint = this.tint;
            if (vs) st.tint = sb.tint = this.tint;
        }

        if (this.blendMode !== null) {
            sf.blendMode = this.blendMode;
            if (vs && hs) stl.blendMode = str.blendMode = sbl.blendMode = sbr.blendMode = this.blendMode;
            if (hs) sl.blendMode = sr.blendMode = this.blendMode;
            if (vs) st.blendMode = sb.blendMode = this.blendMode;
        }
    };
}

SliceSprite.prototype = Object.create(UIBase.prototype);
SliceSprite.prototype.constructor = SliceSprite;
module.exports = SliceSprite;



