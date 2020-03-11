import { Widget } from '../Widget';
import { DynamicTextStyle } from './DynamicTextStyle';
import { DynamicChar }  from './DynamicChar';
import emojiRegex  from 'emoji-regex';
let atlas = null;

/**
* An dynamic text object with auto generated atlas
*
* @class
* @extends PIXI.UI.UIBase
* @memberof PIXI.UI
* @param text {String} Text content
* @param [width=0] {Number|String} width of textbox. 0 = autoWidth
* @param [height=0] {Number|String} height of textbox. 0 = autoHeight
* @param [allowTags=true] {boolean} Allow inline styling
* @param [options=null] {DynamicTextStyle} Additional text settings
*/
function DynamicText(text, options)
{
    options = options || {};

    Widget.call(this, options.width || 0, options.height || 0);

    // create atlas
    if (atlas === null)
    { atlas = new DynamicAtlas(1); }

    const autoWidth = !options.width;
    const autoHeight = !options.height;

    // defaultstyle for this textobject
    const defaultStyle = this._style = new DynamicTextStyle(this);

    defaultStyle.merge(options.style);

    // collection of all processed char
    const chars = this.chars = [];
    const renderChars = [];
    const spriteCache = []; // (temp)
    const charContainer = new PIXI.Container();

    this.container.addChild(charContainer);

    // the input text
    this._inputText = text;

    // list of rendered sprites (temp)
    const sprites = [];

    // states
    let lastWidth = 0;
    let lastHeight = 0;

    this.dirtyText = true;
    this.dirtyStyle = true;
    this.dirtyRender = true;

    // dictionary for line data
    const lineWidthData = [];
    const lineHeightData = [];
    const lineFontSizeData = [];
    const lineAlignmentData = [];
    let renderCount = 0;
    let charCount = 0;

    // ellipsis caches (not nessesary when no sprites)
    const lineEllipsisData = [];
    const lineHasEllipsis = [];

    // ROUGH TEMP RENDER (with sprites)
    this.render = function ()
    {
        let yOffset = 0;
        let xOffset = 0;
        let currentLine = -1;
        let i;

        if (spriteCache.length > renderCount)
        {
            for (i = renderCount; i < spriteCache.length; i++)
            {
                const removeSprite = spriteCache[i];

                if (removeSprite)
                { removeSprite.visible = false; }
            }
        }

        let char; let lineWidth = 0; let lineHeight = 0; let
            maxLineWidth = 0;

        for (i = 0; i < renderCount; i++)
        {
            char = renderChars[i];

            // get line data
            if (currentLine !== char.lineIndex)
            {
                currentLine = char.lineIndex;
                lineWidth = lineWidthData[currentLine];
                lineHeight = lineHeightData[currentLine];
                yOffset += lineHeight;

                switch (lineAlignmentData[currentLine])
                {
                    case 'right': xOffset = this._width - lineWidth; break;
                    case 'center': xOffset = (this._width - lineWidth) * 0.5; break;
                    default: xOffset = 0;
                }

                maxLineWidth = Math.max(lineWidth, maxLineWidth);
            }

            // no reason to render a blank space or 0x0 letters (no texture created)
            if (!char.data.texture || char.space || char.newline)
            {
                if (spriteCache[i])
                { spriteCache[i].visible = false; }
                continue;
            }

            // add new sprite
            const tex = char.data.texture; let
                sprite = spriteCache[i];

            if (!sprite)
            {
                sprite = spriteCache[i] = new PIXI.Sprite(tex);
                sprite.anchor.set(0.5);
            }
            else
            { sprite.texture = tex; }

            sprite.visible = true;
            sprite.x = char.x + xOffset + tex.width * 0.5;
            sprite.y = char.y + yOffset - tex.height * 0.5 - (lineHeight - lineFontSizeData[currentLine]);

            sprite.tint = char.emoji ? 0xffffff : hexToInt(char.style.tint, 0xffffff);
            sprite.rotation = float(char.style.rotation, 0);
            sprite.skew.x = float(char.style.skew, 0);

            if (!sprite.parent)
            { charContainer.addChild(sprite); }
        }

        if (autoWidth) this.width = maxLineWidth;
        if (autoHeight) this.height = yOffset;
    };

    // updates the renderChar array and position chars for render
    this.prepareForRender = function ()
    {
        const pos = new PIXI.Point();
        let wordIndex = 0;
        let lineHeight = 0;
        let lineFontSize = 0;
        let lineIndex = 0;
        let lineAlignment = defaultStyle.align;
        let lastSpaceIndex = -1;
        let lastSpaceLineWidth = 0;
        let textHeight = 0;
        let forceNewline = false;
        let style;
        let renderIndex = 0;
        let ellipsis = false;
        let lineFull = false;
        let i;

        for (i = 0; i < charCount; i++)
        {
            const char = chars[i]; const
                lastChar = chars[i - 1];

            style = char.style;

            // lineheight
            lineHeight = Math.max(lineHeight, defaultStyle.lineHeight || style.lineHeight || char.data.lineHeight);

            if (style.overflowY !== 'visible' && lineHeight + textHeight > this._height)
            {
                if (style.overflowY === 'hidden')
                { break; }
            }

            if (char.newline)
            { lineFull = false; }

            // set word index
            if (char.space || char.newline) wordIndex++;
            else char.wordIndex = wordIndex;

            // textheight
            lineFontSize = Math.max(lineFontSize, style.fontSize);

            // lineindex
            char.lineIndex = lineIndex;

            // lineAlignment
            if (style.align !== defaultStyle.align) lineAlignment = style.align;

            if (char.space)
            {
                lastSpaceIndex = i;
                lastSpaceLineWidth = pos.x;
            }

            const size = Math.round(char.data.width) + float(style.letterSpacing, 0);

            if (!autoWidth && !forceNewline && !char.newline && pos.x + size > this._width)
            {
                if (style.wrap)
                {
                    if (char.space)
                    {
                        forceNewline = true;
                    }
                    else if (lastSpaceIndex !== -1)
                    {
                        renderIndex -= i - lastSpaceIndex;
                        i = lastSpaceIndex - 1;
                        lastSpaceIndex = -1;
                        pos.x = lastSpaceLineWidth;
                        forceNewline = true;
                        continue;
                    }
                    else if (style.breakWords)
                    {
                        if (lastChar)
                        {
                            pos.x -= lastChar.style.letterSpacing;
                            pos.x -= lastChar.data.width;
                        }
                        i -= 2;
                        renderIndex--;
                        forceNewline = true;
                        continue;
                    }
                }

                if (style.overflowX == 'hidden' && !forceNewline)
                {
                    lineFull = true;
                    if (style.ellipsis && !ellipsis)
                    {
                        ellipsis = true;
                        let ellipsisData = lineEllipsisData[lineIndex];

                        if (!ellipsisData) ellipsisData = lineEllipsisData[lineIndex] = [new DynamicChar(), new DynamicChar(), new DynamicChar()];
                        for (let d = 0; d < 3; d++)
                        {
                            const dot = ellipsisData[d];

                            dot.value = '.';
                            dot.data = atlas.getCharObject(dot.value, style);
                            dot.style = style;
                            dot.x = pos.x + char.data.xOffset;
                            dot.y = parseFloat(style.verticalAlign) + dot.data.yOffset;
                            dot.lineIndex = lineIndex;
                            pos.x += Math.round(dot.data.width) + float(style.letterSpacing, 0);
                            renderChars[renderIndex] = dot;
                            renderIndex++;
                        }
                    }
                }
            }

            // Update position and add to renderchars
            if (!lineFull)
            {
                // position
                char.x = pos.x + char.data.xOffset;
                char.y = parseFloat(style.verticalAlign) + char.data.yOffset;
                pos.x += size;
                renderChars[renderIndex] = char;
                renderIndex++;
            }

            // new line
            if (forceNewline || char.newline || i === charCount - 1)
            {
                if (lastChar)
                {
                    pos.x -= lastChar.style.letterSpacing;
                }

                if (char.space)
                {
                    pos.x -= char.data.width;
                    pos.x -= float(style.letterSpacing, 0);
                }

                textHeight += lineHeight;
                lineHasEllipsis[lineIndex] = ellipsis;
                lineWidthData[lineIndex] = pos.x;
                lineHeightData[lineIndex] = lineHeight;
                lineFontSizeData[lineIndex] = lineFontSize;
                lineAlignmentData[lineIndex] = lineAlignment;

                // reset line vaules
                lineHeight = pos.x = lastSpaceLineWidth = lineFontSize = 0;
                lineAlignment = defaultStyle.align;
                lastSpaceIndex = -1;
                lineIndex++;
                forceNewline = lineFull = ellipsis = false;
            }
        }

        renderCount = renderIndex;
    };

    // phrases the input text and prepares the char array
    const closeTags = ['</i>', '</b>', '</font>', '</center>'];

    this.processInputText = function ()
    {
        const styleTree = [defaultStyle];
        let charIndex = 0;
        let inputTextIndex = 0;
        const inputArray = Array.from(this._inputText);

        for (let i = 0; i < inputArray.length; i++)
        {
            style = styleTree[styleTree.length - 1];
            let c = inputArray[i];
            const charcode = c.charCodeAt(0);
            let newline = false;
            let space = false;
            let emoji = false;

            // Extract Tags
            if ((/(?:\r\n|\r|\n)/).test(c))
            { newline = true; }
            else if ((/(\s)/).test(c))
            { space = true; }
            else if (options.allowTags && c === '<')
            {
                let tag = this._inputText.substring(inputTextIndex);

                tag = tag.slice(0, tag.indexOf('>') + 1);
                let FoundTag = true;

                if (tag.length)
                {
                    if (tag === '<i>')
                    {
                        style = style.clone();
                        style.fontStyle = 'italic';
                        styleTree.push(style);
                    }
                    else if (tag === '<b>')
                    {
                        style = style.clone();
                        style.fontWeight = 'bold';
                        styleTree.push(style);
                    }
                    else if (tag === '<center>')
                    {
                        style = style.clone();
                        style.align = 'center';
                        styleTree.push(style);
                    }
                    else if (closeTags.indexOf(tag) !== -1)
                    {
                        if (styleTree.length > 1) styleTree.splice(styleTree.length - 1, 1);
                    }
                    else if (tag.startsWith('<font '))
                    {
                        const regex = /(\w+)\s*=\s*((["'])(.*?)\3|([^>\s]*)(?=\s|\/>))(?=[^<]*>)/g;
                        let match = regex.exec(tag);

                        if (match !== null)
                        {
                            style = style.clone();
                            while (match !== null)
                            {
                                switch (match[1])
                                {
                                    case 'family': match[1] = 'fontFamily'; break;
                                    case 'size': match[1] = 'fontSize'; break;
                                    case 'weight': match[1] = 'fontWeight'; break;
                                    case 'style': match[1] = 'fontStyle'; break;
                                    case 'valign': match[1] = 'verticalAlign'; break;
                                    case 'spacing': match[1] = 'letterSpacing'; break;
                                    case 'color': match[1] = 'tint'; break;
                                }
                                style[match[1]] = match[4];
                                match = regex.exec(tag);
                            }
                            styleTree.push(style);
                        }
                    }
                    else
                    {
                        FoundTag = false;
                    }

                    if (FoundTag)
                    {
                        inputTextIndex += tag.length;
                        i += tag.length - 1;
                        continue;
                    }
                }
            }
            else
            {
                // detect emoji
                let emojiMatch = emojiRegex().exec(c);

                if (emojiMatch !== null)
                {
                    i--; c = '';
                    while (emojiMatch !== null && c !== emojiMatch[0])
                    {
                        i++;
                        c = emojiMatch[0];
                        emojiMatch = emojiRegex().exec(c + inputArray[i + 1]);
                    }
                    emoji = true;
                }
            }

            // Prepare DynamicChar object
            let char = chars[charIndex];

            if (!char)
            {
                char = new DynamicChar();
                chars[charIndex] = char;
            }
            char.style = style;

            if (emoji)
            {
                char.style = char.style.clone();
                char.style.fontFamily = DynamicText.settings.defaultEmojiFont;
            }

            char.data = atlas.getCharObject(c, char.style);
            char.value = c;
            char.space = space;
            char.newline = newline;
            char.emoji = emoji;

            charIndex++;
            inputTextIndex += c.length;
        }
        charCount = charIndex;
    };

    // PIXIUI update, lazy update (bad solution needs rewrite when converted to pixi plugin)
    this.lazyUpdate = null;
    const self = this;

    this.update = function ()
    {
        if (self.lazyUpdate !== null) return;
        self.lazyUpdate = setTimeout(function ()
        {
            // console.log("UPDATING TEXT");
            const dirtySize = !autoWidth && (self._width != lastWidth || self._height != lastHeight || self.dirtyText);

            if (self.dirtyText || self.dirtyStyle)
            {
                self.dirtyText = self.dirtyStyle = false;
                self.dirtyRender = true; // force render after textchange
                self.processInputText();
            }

            if (dirtySize || self.dirtyRender)
            {
                self.dirtyRender = false;
                lastWidth = self._width;
                lastHeight = self.height;
                self.prepareForRender();
                self.render();
            }
            self.lazyUpdate = null;
        }, 0);
    };
}

DynamicText.prototype = Object.create(Widget.prototype);
DynamicText.prototype.constructor = DynamicText;

export { DynamicText };

DynamicText.settings = {
    debugSpriteSheet: false,
    defaultEmojiFont: 'Segoe UI Emoji', // force one font family for emojis so we dont rerender them multiple times
};

Object.defineProperties(DynamicText.prototype, {
    value: {
        get()
        {
            return this._inputText;
        },
        set(val)
        {
            if (val !== this._inputText)
            {
                this._inputText = val;
                this.dirtyText = true;
                this.update();
                // console.log("Updating Text to: " + val);
            }
        },
    },
    text: {
        get()
        {
            return this.value;
        },
        set(val)
        {
            this.value = val;
        },
    },
    style: {
        get()
        {
            return this._style;
        },
        set(val)
        {
            // get a clean default style
            const style = new DynamicTextStyle(this);

            // merge it with new style
            style.merge(val);

            // merge it onto this default style
            this._style.merge(style);

            this.dirtyStyle = true;
            this.update();
        },
    },
});

// Atlas
const metricsCanvas = document.createElement('canvas');
const metricsContext = metricsCanvas.getContext('2d');

metricsCanvas.width = 100;
metricsCanvas.height = 100;

var DynamicAtlas = function (padding)
{
    const res = devicePixelRatio || 1;
    let canvas;
    let context;
    let objects;
    let newObjects = [];
    let baseTexture;
    let lazyTimeout;
    let rootNode;
    const canvasList = [];
    let atlasdim;
    const startdim = 256;
    const maxdim = 2048;

    var AtlasNode = function (w, h)
    {
        const children = this.children = [];

        this.rect = new PIXI.Rectangle(0, 0, w || 0, h || 0);
        this.data = null;

        this.insert = function (width, height, obj)
        {
            if (children.length > 0)
            {
                const newNode = children[0].insert(width, height, obj);

                if (newNode !== null) return newNode;

                return children[1].insert(width, height, obj);
            }
            if (this.data !== null) return null;
            if (width > this.rect.width || height > this.rect.height) return null;
            if (width == this.rect.width && height == this.rect.height)
            {
                this.data = obj;
                obj.frame.x = this.rect.x;
                obj.frame.y = this.rect.y;

                return this;
            }

            children.push(new AtlasNode());
            children.push(new AtlasNode());

            const dw = this.rect.width - width;
            const dh = this.rect.height - height;

            if (dw > dh)
            {
                children[0].rect = new PIXI.Rectangle(this.rect.x, this.rect.y, width, this.rect.height);
                children[1].rect = new PIXI.Rectangle(this.rect.x + width, this.rect.y, this.rect.width - width, this.rect.height);
            }
            else
            {
                children[0].rect = new PIXI.Rectangle(this.rect.x, this.rect.y, this.rect.width, height);
                children[1].rect = new PIXI.Rectangle(this.rect.x, this.rect.y + height, this.rect.width, this.rect.height - height);
            }

            return children[0].insert(width, height, obj);
        };
    };

    const addCanvas = function ()
    {
        // create new canvas
        canvas = document.createElement('canvas');
        context = canvas.getContext('2d');
        canvasList.push(canvas);

        // reset dimentions
        atlasdim = startdim;
        canvas.width = canvas.height = atlasdim;
        rootNode = new AtlasNode(atlasdim, atlasdim);

        // reset array with canvas objects and create new atlas
        objects = [];

        // set new basetexture
        baseTexture = PIXI.BaseTexture.fromCanvas(canvas);
        baseTexture.mipmap = false; // if not, pixi bug resizing POW2
        baseTexture.resolution = 1; // todo: support all resolutions
        baseTexture.update();

        // Debug Spritesheet
        if (DynamicText.settings.debugSpriteSheet)
        {
            canvas.className = 'DynamicText_SpriteSheet';
            document.body.appendChild(canvas);
        }
    };

    this.fontFamilyCache = {};

    const drawObjects = function (arr, resized)
    {
        if (resized) baseTexture.update();
        for (let i = 0; i < arr.length; i++)
        { drawObject(arr[i]); }
    };

    var drawObject = function (obj)
    {
        context.drawImage(obj._cache, obj.frame.x, obj.frame.y);
        obj.texture.frame = obj.frame;
        obj.texture.update();
    };

    this.getCharObject = function (char, style)
    {
        const font = style.ctxFont();

        // create new cache for fontFamily
        let familyCache = this.fontFamilyCache[font];

        if (!familyCache)
        {
            familyCache = {};
            this.fontFamilyCache[font] = familyCache;
        }

        // get char data
        const key = style.ctxKey(char);
        let obj = familyCache[key];

        if (!obj)
        {
            // create char object
            const metrics = generateCharData(char, style);

            // temp resize if doesnt fit (not nesseary when we dont need to generate textures)
            if (metrics.rect)
            {
                if (canvas.width < metrics.rect.width || canvas.height < metrics.rect.height)
                {
                    canvas.width = canvas.height = Math.max(metrics.rect.width, metrics.rect.height);
                    baseTexture.update();
                }
            }

            // todo: cleanup when we know whats needed
            obj = {
                metrics,
                font,
                value: char,
                frame: metrics.rect,
                baseTexture: metrics.rect ? baseTexture : null,
                xOffset: metrics.bounds ? metrics.bounds.minx : 0,
                yOffset: metrics.descent || 0,
                width: metrics.width || 0,
                lineHeight: metrics.lineHeight || 0,
                _cache: metrics.canvas,
                texture: metrics.rect ? new PIXI.Texture(baseTexture, metrics.rect) : null, // temp texture
            };

            // add to collections
            familyCache[key] = obj;

            // add to atlas if visible char
            if (metrics.rect)
            {
                newObjects.push(obj);

                if (lazyTimeout === undefined)
                {
                    lazyTimeout = setTimeout(function ()
                    {
                        addNewObjects();
                        lazyTimeout = undefined;
                    }, 0);
                }
            }
        }

        return obj;
    };

    const compareFunction = function (a, b)
    {
        if (a.frame.height < b.frame.height)
        { return 1; }

        if (a.frame.height > b.frame.height)
        { return -1; }

        if (a.frame.width < b.frame.width)
        { return 1; }

        if (a.frame.width > b.frame.width)
        { return -1; }

        return 0;
    };

    var addNewObjects = function ()
    {
        newObjects.sort(compareFunction);
        let _resized = false;
        let _newcanvas = false;

        for (let i = 0; i < newObjects.length; i++)
        {
            const obj = newObjects[i];
            const node = rootNode.insert(obj.frame.width + padding, obj.frame.height + padding, obj);

            if (node !== null)
            {
                if (_newcanvas) obj.texture.baseTexture = baseTexture; // update basetexture if new canvas was created (temp)
                objects.push(obj);
                continue;
            }

            // step one back (so it will be added after resize/new canvas)
            i--;

            if (atlasdim < maxdim)
            {
                _resized = true;
                resizeCanvas(atlasdim * 2);
                continue;
            }

            // close current spritesheet and make a new one
            drawObjects(objects, _resized);
            addCanvas();
            _newcanvas = true;
            _resized = false;
        }

        drawObjects(_resized || _newcanvas ? objects : newObjects, _resized);
        newObjects = [];
    };

    var resizeCanvas = function (dim)
    {
        canvas.width = canvas.height = atlasdim = dim;

        rootNode = new AtlasNode(dim, dim);
        objects.sort(compareFunction);

        for (let i = 0; i < objects.length; i++)
        {
            const obj = objects[i];

            rootNode.insert(obj.frame.width + padding, obj.frame.height + padding, obj);
        }
    };

    var generateCharData = function (char, style)
    {
        const fontSize = Math.max(1, int(style.fontSize, 26));
        const lineHeight = fontSize * 1.25;

        // Start our returnobject
        const data = {
            fontSize,
            lineHeight,
            width: 0,
        };

        // Return if newline
        if (!char || (/(?:\r\n|\r|\n)/).test(char))
        { return data; }

        // Ctx font string
        const font = style.ctxFont();

        metricsContext.font = font;

        // Get char width
        data.width = Math.round(metricsContext.measureText(char).width);

        // Return if char = space
        if ((/(\s)/).test(char)) return data;

        // set canvas size (with padding so we can messure)
        const paddingY = Math.round(fontSize * 0.7); const
            paddingX = Math.max(5, Math.round(fontSize * 0.7));

        metricsCanvas.width = Math.ceil(data.width) + paddingX * 2;
        metricsCanvas.height = 1.5 * fontSize;
        const w = metricsCanvas.width; const h = metricsCanvas.height; const
            baseline = (h / 2) + (paddingY * 0.5);

        // set font again after resize
        metricsContext.font = font;

        // make sure canvas is clean
        metricsContext.clearRect(0, 0, w, h);

        // save clean state with font
        metricsContext.save();

        // convert shadow string to shadow data
        const shadowData = function (str)
        {
            const data = str.trim().split(' ');

            return {
                color: string(data[0], '#000000'),
                alpha: float(data[1], 0.5),
                xOffset: float(data[2], 3),
                yOffset: float(data[3], 3),
                blur: float(data[4], 5),
            };
        };

        // convert fill string to fill data
        const fillData = function (str)
        {
            const data = str.trim().split(' ');
            const c = string(data[0], '#FFFFFF');
            const a = float(data[1], 1);

            return {
                color: c,
                alpha: a,
                position: float(data[2], -1),
                rgba: hexToRgba(c, a),
            };
        };

        // create fill style from fill string
        const getFillStyle = function (str)
        {
            const fills = str.split(',').filter(function (s) { return s !== ''; }); let
                i;

            // convert to fill data
            for (i = 0; i < fills.length; i++) fills[i] = fillData(fills[i]);

            switch (fills.length)
            {
                case 0: return 'white';
                case 1: return fills[0].rgba ? fills[0].rgba : fills[0].color || '#FFFFFF';
                default:
                    // make gradient
                    try
                    {
                        const gradEnd = baseline + lineHeight - fontSize;
                        const gradient = metricsContext.createLinearGradient(0, gradEnd - fontSize, 0, gradEnd);

                        for (i = 0; i < fills.length; i++)
                        { gradient.addColorStop(fills[i].position !== -1 ? fills[i].position : i / (fills.length - 1), fills[i].rgba || fills[i].color); }

                        return gradient;
                    }
                    catch (e)
                    {
                        return '#FFFFFF';
                    }
            }
        };

        // function to draw shadows
        const drawShadows = function (shadowString, stroke)
        {
            const shadows = shadowString.trim().split(',').filter(function (s) { return s !== ''; });

            if (shadows.length)
            {
                for (let i = 0; i < shadows.length; i++)
                {
                    const s = shadowData(shadows[i]);

                    metricsContext.globalAlpha = s.alpha;
                    metricsContext.shadowColor = s.color;
                    metricsContext.shadowOffsetX = s.xOffset + w;
                    metricsContext.shadowOffsetY = s.yOffset;
                    metricsContext.shadowBlur = s.blur;

                    if (stroke)
                    {
                        metricsContext.lineWidth = style.stroke;
                        metricsContext.strokeText(char, paddingX - w, baseline);
                    }
                    else metricsContext.fillText(char, paddingX - w, baseline);
                }
                metricsContext.restore();
            }
        };

        // draw text shadows
        if (style.shadow.length)
        { drawShadows(style.shadow, false); }

        // draw stroke shadows
        if (style.stroke && style.strokeShadow.length)
        {
            drawShadows(style.strokeShadow, true);
        }

        // draw text
        metricsContext.fillStyle = getFillStyle(string(style.fill, '#000000'));
        metricsContext.fillText(char, paddingX, baseline);
        metricsContext.restore();

        // draw stroke
        if (style.stroke)
        {
            metricsContext.strokeStyle = getFillStyle(string(style.strokeFill, '#000000'));
            metricsContext.lineWidth = style.stroke;
            metricsContext.strokeText(char, paddingX, baseline);
            metricsContext.restore();
        }

        // begin messuring
        const pixelData = metricsContext.getImageData(0, 0, w, h).data;

        let i = 3;
        const line = w * 4;
        const len = pixelData.length;

        // scanline on alpha
        while (i < len && !pixelData[i]) { i += 4; }
        const ascent = (i / line) | 0;

        if (i < len)
        {
            // rev scanline on alpha
            i = len - 1;
            while (i > 0 && !pixelData[i]) { i -= 4; }
            const descent = (i / line) | 0;

            // left to right scanline on alpha
            for (i = 3; i < len && !pixelData[i];)
            {
                i += line;
                if (i >= len) { i = (i - len) + 4; }
            }
            const minx = ((i % line) / 4) | 0;

            // right to left scanline on alpha
            let step = 1;

            for (i = len - 1; i >= 0 && !pixelData[i];)
            {
                i -= line;
                if (i < 0) { i = (len - 1) - (step++) * 4; }
            }
            const maxx = ((i % line) / 4) + 1 | 0;

            // set font metrics
            data.ascent = Math.round(baseline - ascent);
            data.descent = Math.round(descent - baseline);
            data.height = 1 + Math.round(descent - ascent);
            data.bounds = {
                minx: minx - paddingX,
                maxx: maxx - paddingX,
                miny: 0,
                maxy: descent - ascent,
            };
            data.rect = {
                x: data.bounds.minx,
                y: -data.ascent - 2,
                width: data.bounds.maxx - data.bounds.minx + 2,
                height: data.ascent + data.descent + 4,
            };

            // cache (for fast rearrange later)
            data.canvas = document.createElement('canvas');
            data.canvas.width = data.rect.width;
            data.canvas.height = data.rect.height;
            const c = data.canvas.getContext('2d');

            c.drawImage(metricsCanvas, -paddingX - data.rect.x, -baseline - data.rect.y);

            // reset rect position
            data.rect.x = data.rect.y = 0;
        }

        return data;
    };

    addCanvas();
};

// helper function for float or default
function float(val, def)
{
    if (isNaN(val)) return def;

    return parseFloat(val);
}

// helper function for int or default
function int(val, def)
{
    if (isNaN(val)) return def;

    return parseInt(val);
}

// helper function for string or default
function string(val, def)
{
    if (typeof val === 'string' && val.length) return val;

    return def;
}

// helper function to convert string hex to int or default
function hexToInt(str, def)
{
    if (typeof str === 'number')
    { return str; }

    const result = parseInt(str.replace('#', '0x'));

    if (isNaN(result)) return def;

    return result;
}

// helper function to convert hex to rgba
function hexToRgba(hex, alpha)
{
    const result = (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(hex);

    alpha = float(alpha, 1);

    return result ? `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)},${alpha})` : false;
}

