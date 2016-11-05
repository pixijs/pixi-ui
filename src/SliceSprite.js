var UIBase = require('./UIBase');

/**
 * A sliced sprite with dynamic width and height.
 *
 * @class
 * @extends PIXI.UI.UIBase
 * @memberof PIXI.UI
 * @param Texture {PIXI.Texture} the texture for this SliceSprite
 * @param BorderWidth {Number} Width of the sprite borders
 * @param horizontalSlice {Boolean} Slice the sprite horizontically
 * @param horizontalSlice {Boolean} Slice the sprite vertically
 */
function SliceSprite(texture, borderWidth, horizontalSlice, verticalSlice) {
    UIBase.call(this, texture.width, texture.height);

    var ftl, ftr, fbl, fbr, ft, fb, fl, fr, ff, stl, str, sbl, sbr, st, sb, sl, sr, sf,
        bw = borderWidth || 5,
        vs = typeof verticalSlice !== "undefined" ? verticalSlice : true,
        hs = typeof horizontalSlice !== "undefined" ? horizontalSlice : true,
        t = texture.baseTexture,
        f = texture.frame;


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
    sf = new PIXI.Sprite(new PIXI.Texture(t, ff));
    this.container.addChild(sf);
    if (vs && hs) {
        stl = new PIXI.Sprite(new PIXI.Texture(t, ftl));
        str = new PIXI.Sprite(new PIXI.Texture(t, ftr));
        sbl = new PIXI.Sprite(new PIXI.Texture(t, fbl));
        sbr = new PIXI.Sprite(new PIXI.Texture(t, fbr));
        this.container.addChild(stl, str, sbl, sbr);

    }
    if (hs) {
        this.setting.minWidth = bw * 2;
        sl = new PIXI.Sprite(new PIXI.Texture(t, fl));
        sr = new PIXI.Sprite(new PIXI.Texture(t, fr));
        this.container.addChild(sl, sr);
    }
    if (vs) {
        this.setting.minHeight = bw * 2;
        st = new PIXI.Sprite(new PIXI.Texture(t, ft));
        sb = new PIXI.Sprite(new PIXI.Texture(t, fb));
        this.container.addChild(st, sb);
    }

    //set constant position and sizes
    if (vs && hs) st.x = sb.x = sl.y = sr.y = stl.width = str.width = sbl.width = sbr.width = stl.height = str.height = sbl.height = sbr.height = bw;
    if (hs) sf.x = sl.width = sr.width = bw;
    if (vs) sf.y = st.height = sb.height = bw;


    /**
     * Updates the sliced sprites position and size
     *
     * @private
     */
    this.update = function () {
        if (vs && hs) {
            str.x = sbr.x = sr.x = this.width - bw;
            sbl.y = sbr.y = sb.y = this.height - bw;
            sf.width = st.width = sb.width = this.width - bw * 2;
            sf.height = sl.height = sr.height = this.height - bw * 2;
        }
        else if (hs) {
            sr.x = this.width - bw;
            sl.height = sr.height = sf.height = this.height;
            sf.width = this.width - bw * 2;
        }
        else { //vs
            sb.y = this.height - bw;
            st.width = sb.width = sf.width = this.width;
            sf.height = this.height - bw * 2;
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



