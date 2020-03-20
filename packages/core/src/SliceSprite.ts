import { Widget } from './Widget';
import * as PIXI from 'pixi.js';

/**
 * A sliced sprite with dynamic width and height.
 *
 * @class
 * @memberof PUXI
 * @param Texture {PIXI.Texture} the texture for this SliceSprite
 * @param BorderWidth {Number} Width of the sprite borders
 * @param horizontalSlice {Boolean} Slice the sprite horizontically
 * @param verticalSlice {Boolean} Slice the sprite vertically
 * @param [tile=false] {Boolean} tile or streach
 */
export class SliceSprite extends Widget
{
    ftl: PIXI.Rectangle;
    ftr: PIXI.Rectangle;

    fbl: PIXI.Rectangle;
    fbr: PIXI.Rectangle;

    ft: PIXI.Rectangle;
    fb: PIXI.Rectangle;
    fr: PIXI.Rectangle;
    fl: PIXI.Rectangle;
    ff: PIXI.Rectangle;

    stl: PIXI.Sprite;
    str: PIXI.Sprite;
    sbl: PIXI.Sprite;
    sbr: PIXI.Sprite;

    st: PIXI.Sprite;
    sb: PIXI.Sprite;
    sl: PIXI.Sprite;
    sr: PIXI.Sprite;

    sf: PIXI.Sprite;

    bw: number;
    vs: boolean;
    hs: boolean;
    t: PIXI.BaseTexture;
    f: PIXI.Rectangle;

    tile: any;

    constructor(texture: PIXI.Texture, borderWidth, horizontalSlice, verticalSlice, tile)
    {
        super(texture.width, texture.height);

        this.bw = borderWidth || 5;
        this.vs = typeof verticalSlice !== 'undefined' ? verticalSlice : true;
        this.hs = typeof horizontalSlice !== 'undefined' ? horizontalSlice : true;
        this.t = texture.baseTexture;
        this.f = texture.frame;
        this.tile = tile;

        if (this.hs)
        {
            this.setting.minWidth = borderWidth * 2;
        }
        if (this.vs)
        {
            this.setting.minHeight = borderWidth * 2;
        }

        /**
     * Updates the sliced sprites position and size
     *
     * @private
     */
        this.update = function ()
        {
            if (!this.initialized) return;
            if (vs && hs)
            {
                str.x = sbr.x = sr.x = this._width - bw;
                sbl.y = sbr.y = sb.y = this._height - bw;
                sf.width = st.width = sb.width = this._width - bw * 2;
                sf.height = sl.height = sr.height = this._height - bw * 2;
            }
            else if (hs)
            {
                sr.x = this._width - bw;
                sl.height = sr.height = sf.height = this._height;
                sf.width = this._width - bw * 2;
            }
            else
            { // vs
                sb.y = this._height - bw;
                st.width = sb.width = sf.width = this._width;
                sf.height = this._height - bw * 2;
            }

            if (this.tint !== null)
            {
                sf.tint = this.tint;
                if (vs && hs) stl.tint = str.tint = sbl.tint = sbr.tint = this.tint;
                if (hs) sl.tint = sr.tint = this.tint;
                if (vs) st.tint = sb.tint = this.tint;
            }

            if (this.blendMode !== null)
            {
                sf.blendMode = this.blendMode;
                if (vs && hs) stl.blendMode = str.blendMode = sbl.blendMode = sbr.blendMode = this.blendMode;
                if (hs) sl.blendMode = sr.blendMode = this.blendMode;
                if (vs) st.blendMode = sb.blendMode = this.blendMode;
            }
        };
    }

    initialize()
    {
        super.initialize();
        const { f, bw } = this;

        // get frames
        if (this.vs && this.hs)
        {
            this.ftl = new PIXI.Rectangle(f.x, f.y, bw, bw);
            this.ftr = new PIXI.Rectangle(f.x + f.width - bw, f.y, bw, bw);
            this.fbl = new PIXI.Rectangle(f.x, f.y + f.height - bw, bw, bw);
            this.fbr = new PIXI.Rectangle(f.x + f.width - bw, f.y + f.height - bw, bw, bw);
            this.ft = new PIXI.Rectangle(f.x + bw, f.y, f.width - bw * 2, bw);
            this.fb = new PIXI.Rectangle(f.x + bw, f.y + f.height - bw, f.width - bw * 2, bw);
            this.fl = new PIXI.Rectangle(f.x, f.y + bw, bw, f.height - bw * 2);
            this.fr = new PIXI.Rectangle(f.x + f.width - bw, f.y + bw, bw, f.height - bw * 2);
            this.ff = new PIXI.Rectangle(f.x + bw, f.y + bw, f.width - bw * 2, f.height - bw * 2);
        }
        else if (this.hs)
        {
            this.fl = new PIXI.Rectangle(this.f.x, f.y, bw, f.height);
            this.fr = new PIXI.Rectangle(f.x + f.width - bw, f.y, bw, f.height);
            this.ff = new PIXI.Rectangle(f.x + bw, f.y, f.width - bw * 2, f.height);
        }
        else
        { // vs
            this.ft = new PIXI.Rectangle(f.x, f.y, f.width, bw);
            this.fb = new PIXI.Rectangle(f.x, f.y + f.height - bw, f.width, bw);
            this.ff = new PIXI.Rectangle(f.x, f.y + bw, f.width, f.height - bw * 2);
        }

        // TODO: swap frames if rotation

        const { t, ff, fl, fr, ft, fb } = this;

        // make sprites
        this.sf = this.tile
            ? new PIXI.extras.TilingSprite(new PIXI.Texture(t, ff))
            : new PIXI.Sprite(new PIXI.Texture(t, ff));
        this.contentContainer.addChildAt(this.sf, 0);

        if (this.vs && this.hs)
        {
            this.stl = new PIXI.Sprite(new PIXI.Texture(t, this.ftl));
            this.str = new PIXI.Sprite(new PIXI.Texture(t, this.ftr));
            this.sbl = new PIXI.Sprite(new PIXI.Texture(t, this.fbl));
            this.sbr = new PIXI.Sprite(new PIXI.Texture(t, this.fbr));
            this.contentContainer.addChildAt(this.stl, 0);
            this.contentContainer.addChildAt(this.str, 0);
            this.contentContainer.addChildAt(this.sbl, 0);
            this.contentContainer.addChildAt(this.sbr, 0);
        }
        if (hs)
        {
            this.sl = this.tile
                ? new PIXI.extras.TilingSprite(new PIXI.Texture(t, fl))
                : new PIXI.Sprite(new PIXI.Texture(t, fl));
            this.sr = this.tile
                ? new PIXI.extras.TilingSprite(new PIXI.Texture(t, fr))
                : new PIXI.Sprite(new PIXI.Texture(t, fr));

            this.contentContainer.addChildAt(this.sl, 0);
            this.contentContainer.addChildAt(this.sr, 0);
        }
        if (this.vs)
        {
            this.st = this.tile
                ? new PIXI.extras.TilingSprite(new PIXI.Texture(t, ft))
                : new PIXI.Sprite(new PIXI.Texture(t, ft));
            this.sb = this.tile
                ? new PIXI.extras.TilingSprite(new PIXI.Texture(t, fb))
                : new PIXI.Sprite(new PIXI.Texture(t, fb));
            this.contentContainer.addChildAt(this.st, 0);
            this.contentContainer.addChildAt(this.sb, 0);
        }

        // set constant position and sizes
        if (this.vs && this.hs)
        {
            this.st.x = bw;
            this.sb.x = bw;
            this.sl.y = bw;
            this.sr.y = bw;
            this.stl.width = bw;
            this.str.width = bw;
            this.sbl.width = bw;
            this.sbr.width = bw;
            this.stl.height = bw;
            this.str.height = bw;
            this.sbl.height = bw;
            this.sbr.height = bw;
        }

        if (this.hs)
        {
            this.sf.x = this.sl.width = this.sr.width = bw;
        }
        if (this.vs)
        {
            this.sf.y = this.st.height = this.sb.height = bw;
        }
    }

    update(): void
    {
        // NO updates
    }
}

