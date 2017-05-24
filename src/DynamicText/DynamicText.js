var UIBase = require('../UIBase'),
    DynamicTextStyle = require('./DynamicTextStyle'),
    DynamicChar = require('./DynamicChar'),
    emojiRegex = require('emoji-regex'),
    atlas = null;


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
function DynamicText(text, width, height, allowTags, options) {
    UIBase.call(this, int(width, 0), int(height, 0));
    var autoWidth = width ? false : true;
    var autoHeight = height ? false : true;

    //create atlas
    if (atlas === null)
        atlas = window["ss"] = new DynamicAtlas(1);


    //defaultstyle for this textobject
    var defaultStyle = this.defaultStyle = new DynamicTextStyle();
    defaultStyle.merge(options);

    //collection of all processed char
    var chars = this.chars = [];
    var renderChars = [];
    var charContainer = new PIXI.Container();
    this.container.addChild(charContainer);

    //the input text
    this._inputText = text;

    //list of rendered sprites (temp)
    var sprites = [];

    //read font tags
    var allowTags = allowTags !== false;

    //states
    var lastWidth = 0, lastHeight = 0;
    this.dirtyText = true;
    this.dirtyAlignment = true;

    //dictionary for line data
    var lineWidthData = [];
    var lineHeightData = [];
    var lineFontSizeData = [];
    var lineAlignmentData = [];
    var renderCount = 0;

    //ROUGH TEMP RENDER (with sprites)
    this.render = function () {
        var yOffset = 0,
            xOffset = 0,
            currentLine = -1,
            i;

        if (renderChars.length > renderCount) {
            for (i = renderCount; i < renderChars.length; i++) {
                var removeChar = renderChars[i];
                if (removeChar.sprite && removeChar.sprite.parent)
                    charContainer.removeChild(removeChar.sprite);
            }
            renderChars.splice(renderCount, renderChars.length - renderCount);
        }

        for (i = 0; i < renderCount; i++) {
            var char = renderChars[i];

            //get line data
            if (currentLine !== char.lineIndex) {
                var count = char.lineIndex - currentLine;
                currentLine = char.lineIndex;
                yOffset += lineHeightData[currentLine] * count;



                switch (lineAlignmentData[currentLine]) {
                    case 'right': xOffset = this._width - lineWidthData[currentLine]; break;
                    case 'center': xOffset = (this._width - lineWidthData[currentLine]) * 0.5; break;
                    default: xOffset = 0;
                }
            }

            //no reason to render a blank space or 0x0 letters (no texture created)
            if (!char.data.texture || char.space || char.newline) {
                if (char.sprite && char.sprite.parent)
                    charContainer.removeChild(char.sprite);
                continue;
            }

            //add new sprite
            var tex = char.data.texture, sprite = char.sprite;


            if (sprite === null) {
                char.sprite = sprite = new PIXI.Sprite(tex);
                sprite.anchor.set(0.5);
            }
            else
                sprite.texture = tex;

            sprite.x = char.x + xOffset + tex.width * 0.5;
            sprite.y = char.y + yOffset - tex.height * 0.5 - (lineHeightData[currentLine] - lineFontSizeData[currentLine]) * 0.5;


            sprite.tint = char.emoji ? 0xffffff : hexToInt(char.style.tint, 0xffffff);
            sprite.rotation = float(char.style.rotation, 0);
            sprite.skew.x = float(char.style.skew, 0);

            if (!sprite.parent)
                charContainer.addChild(sprite);
        }
    };

    //updates the renderChar array and position chars for render
    this.prepareForRender = function () {
        var pos = new PIXI.Point(),
            wordIndex = 0,
            lineHeight = 0,
            lineFontSize = 0,
            lineIndex = 0,
            lineAlignment = defaultStyle.align,
            lastSpaceIndex = -1,
            lastSpaceLineWidth = 0,
            forceNewline = false;

        //reset width
        if (autoWidth) this._width = 0;



        for (var i = 0; i < renderCount; i++) {
            var char = chars[i];

            //set word index
            if (char.space || char.newline) wordIndex++;
            else char.wordIndex = wordIndex;

            //lineheight
            lineHeight = Math.max(lineHeight, defaultStyle.lineHeight || char.style.lineHeight || char.data.lineHeight);

            //textheight
            lineFontSize = Math.max(lineFontSize, char.style.fontSize);

            //lineindex
            char.lineIndex = lineIndex;

            //lineAlignment
            if (char.style.align !== defaultStyle.align) lineAlignment = char.style.align;

            //position
            char.x = pos.x + char.data.xOffset;
            char.y = parseFloat(char.style.verticalAlign) + char.data.yOffset;

            var addWidth = Math.round(char.data.width) + parseFloat(char.style.letterSpacing);
            pos.x += addWidth;


            if (char.space) {
                lastSpaceIndex = i;
                lastSpaceLineWidth = pos.x - addWidth;
            }

            renderChars[i] = char;
            if (!autoWidth && pos.x > this._width) {
                if (lastSpaceIndex !== -1) {
                    i = lastSpaceIndex;
                    lastSpaceIndex = -1;
                    pos.x = lastSpaceLineWidth;
                }
                else {
                    i--;
                    pos.x -= addWidth;
                }
                forceNewline = true;
            }
            else {
                
            }


            //textbox width
            if (autoWidth) this._width = Math.max(pos.x, this._width);

            //new line
            if (forceNewline || char.newline || i === renderCount - 1) {
                forceNewline = false;
                lineWidthData[lineIndex] = pos.x;
                lineHeightData[lineIndex] = Math.max(lineHeight, defaultStyle.lineHeight || char.style.lineHeight || char.data.lineHeight);
                lineFontSizeData[lineIndex] = lineFontSize;
                lineAlignmentData[lineIndex] = lineAlignment;

                var lastChar = chars[i - 1];
                if (lastChar) {
                    lineWidthData[lineIndex] -= lastChar.style.letterSpacing;
                    if (lastChar.space)
                        lineWidthData[lineIndex] -= lastChar.data.width;
                }

                wordIndex = lineHeight = pos.x = 0;
                lineAlignment = defaultStyle.align;
                lineIndex++;
            }            
        }

        this.dirtyAlignment = false;
    };

    //phrases the input text and prepares the char array
    var closeTags = ['</i>', '</b>', '</font>', '</center>'];
    this.processInputText = function () {
        var styleTree = [defaultStyle],
            charIndex = 0,
            inputTextIndex = 0,
            inputArray = Array.from(this._inputText);

        for (var i = 0; i < inputArray.length; i++) {
            var c = inputArray[i],
                charcode = c.charCodeAt(0),
                newline = false,
                space = false,
                emoji = false;

            //Extract Tags
            if (/(?:\r\n|\r|\n)/.test(c))
                newline = true;
            else if (/(\s)/.test(c))
                space = true;
            else if (allowTags && c === "<") {
                var tag = this._inputText.substring(inputTextIndex);
                tag = tag.slice(0, tag.indexOf(">") + 1);
                var FoundTag = true;
                if (tag.length) {
                    if (tag === "<i>") {
                        var style = styleTree[styleTree.length - 1].clone();
                        style.fontStyle = 'italic';
                        styleTree.push(style);
                    }
                    else if (tag === "<b>") {
                        var style = styleTree[styleTree.length - 1].clone();
                        style.fontWeight = 'bold';
                        styleTree.push(style);
                    }
                    else if (tag === "<center>") {
                        var style = styleTree[styleTree.length - 1].clone();
                        style.align = 'center';
                        styleTree.push(style);
                    }
                    else if (closeTags.indexOf(tag) !== -1) {
                        if (styleTree.length > 1) styleTree.splice(styleTree.length - 1, 1);
                    }
                    else if (tag.startsWith("<font ")) {
                        regex = /(\w+)\s*=\s*((["'])(.*?)\3|([^>\s]*)(?=\s|\/>))(?=[^<]*>)/g,
                        match = regex.exec(tag);

                        if (match !== null) {
                            var style = styleTree[styleTree.length - 1].clone();
                            while (match !== null) {
                                switch (match[1]) {
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
                    else {
                        FoundTag = false;
                    }

                    if (FoundTag) {
                        inputTextIndex += tag.length;
                        i += tag.length - 1;
                        continue;
                    }
                }
            }
            else {
                //detect emoji
                var emojiMatch = emojiRegex().exec(c);
                if (emojiMatch !== null) {
                    i--; c = '';
                    while (emojiMatch !== null && c !== emojiMatch[0]) {
                        i++;
                        c = emojiMatch[0];
                        emojiMatch = emojiRegex().exec(c + inputArray[i + 1]);
                    }
                    emoji = true;
                }
            }


            //Prepare DynamicChar object
            var char = chars[charIndex];
            if (!char) {
                char = new DynamicChar();
                chars[charIndex] = char;
            }
            char.style = styleTree[styleTree.length - 1];


            if (emoji) {
                char.style = char.style.clone();
                char.style.fontFamily = DynamicText.defaultEmojiFont;
            }

            char.data = atlas.getCharObject(c, char.style);
            char.value = c;
            char.space = space;
            char.newline = newline;
            char.emoji = emoji;

            charIndex++;
            inputTextIndex += c.length;
        }
        renderCount = charIndex;
        this.dirtyText = false;
    };

    //PIXIUI update, called every time parent emits a change
    this.update = function () {
        if (this.dirtyText || this.dirtyAlignment || lastWidth !== this._width || lastHeight !== this._height) {
            lastWidth = this._width;
            lastHeight = this._height

            if (this.dirtyText)
                this.processInputText();

            this.prepareForRender();
            this.render();
        }
    };
}

DynamicText.prototype = Object.create(UIBase.prototype);
DynamicText.prototype.constructor = DynamicText;
DynamicText.defaultEmojiFont = "Segoe UI Emoji"; //force one font family for emojis so we dont rerender them multiple times
module.exports = DynamicText;

Object.defineProperties(DynamicText.prototype, {
    value: {
        get: function () {
            return this._inputText;
        },
        set: function (val) {
            if (val !== this._inputText) {
                this._inputText = val;
                this.dirtyText = true;
                this.update();
            }
        }
    },
    text: {
        get: function () {
            return this.value;
        },
        set: function (val) {
            this.value = val;
        }
    },
    align: {
        get: function () {
            return this.defaultStyle.align;
        },
        set: function (val) {
            this.defaultStyle.align = val;

            for (var i = 0; i < this.chars.length; i++)
                this.chars[i].style.align = val;

            this.dirtyAlignment = true;
            this.update();
        }
    }
});






//Atlas
var metricsCanvas = document.createElement("canvas");
var metricsContext = metricsCanvas.getContext("2d");
metricsCanvas.width = 100;
metricsCanvas.height = 100;


var DynamicAtlas = function (padding) {
    var res = devicePixelRatio || 1,
        canvas,
        context,
        objects,
        newObjects = [],
        baseTexture,
        lazyTimeout = undefined,
        rootNode,
        canvasList = [],
        atlasdim,
        startdim = 1024,
        maxdim = 2048;
    this.debug = false;


    var AtlasNode = function (w, h) {
        var children = this.children = [];
        this.rect = new PIXI.Rectangle(0, 0, w || 0, h || 0);
        this.data = null;

        this.insert = function (width, height, obj) {
            if (children.length > 0) {
                var newNode = children[0].insert(width, height, obj);
                if (newNode != null) return newNode;

                return children[1].insert(width, height, obj);
            } else {
                if (this.data != null) return null;
                if (width > this.rect.width || height > this.rect.height) return null;
                if (width == this.rect.width && height == this.rect.height) {
                    this.data = obj;
                    obj.frame.x = this.rect.x;
                    obj.frame.y = this.rect.y;
                    return this;
                }

                children.push(new AtlasNode());
                children.push(new AtlasNode());

                var dw = this.rect.width - width;
                var dh = this.rect.height - height;

                if (dw > dh) {
                    children[0].rect = new PIXI.Rectangle(this.rect.x, this.rect.y, width, this.rect.height);
                    children[1].rect = new PIXI.Rectangle(this.rect.x + width, this.rect.y, this.rect.width - width, this.rect.height);
                } else {
                    children[0].rect = new PIXI.Rectangle(this.rect.x, this.rect.y, this.rect.width, height);
                    children[1].rect = new PIXI.Rectangle(this.rect.x, this.rect.y + height, this.rect.width, this.rect.height - height);
                }

                return children[0].insert(width, height, obj);
            }
        }
    }

    var addCanvas = function () {
        //create new canvas
        canvas = document.createElement("canvas");
        context = canvas.getContext("2d");
        canvasList.push(canvas);

        //reset dimentions
        atlasdim = startdim;
        canvas.width = canvas.height = atlasdim;
        rootNode = new AtlasNode(atlasdim, atlasdim);

        //reset array with canvas objects and create new atlas
        objects = [];

        //set new basetexture
        baseTexture = PIXI.BaseTexture.fromCanvas(canvas);
        baseTexture.mipmap = false; //if not, pixi bug resizing POW2
        baseTexture.update();


        //temp (visual spritesheet)
        setTimeout(function () {
            var r = 10;
            var s = 1;
            for (var i = 0; i < canvasList.length; i++) {
                c = canvasList[i];
                document.body.appendChild(c);
                c.className = "SpriteSheet";
                //c.setAttribute("style", " position: absolute; left: calc(50% - 450px); top: 115px; border: 1px solid #d3d3d3; background-color: #808080;")
                previewTimeout = undefined;
                r += (c.width * ((1 / devicePixelRatio) * 0.5)) + 10;
            }
        }, 100);
    }
    addCanvas();

    this.fontFamilyCache = {};

    var drawObjects = function (arr, resized) {
        if (resized) baseTexture.update();
        for (var i = 0; i < arr.length; i++) 
                drawObject(arr[i]);
    }

    var drawObject = function (obj) {
        context.drawImage(obj._cache, obj.frame.x, obj.frame.y)
        obj.texture.frame = obj.frame;
        obj.texture.update();
    }

    this.getCharObject = function (char, style) {
        var font = style.ctxFont();

        //create new cache for fontFamily
        var familyCache = this.fontFamilyCache[font];
        if (!familyCache) {
            familyCache = {};
            this.fontFamilyCache[font] = familyCache;
        }



        //get char data
        var key = style.ctxKey(char);
        var obj = familyCache[key];
        if (!obj) {
            //create char object
            var metrics = generateCharData(char, style);



            //temp resize if doesnt fit (not nesseary when we dont need to generate textures)
            if (metrics.rect) {
                if (canvas.width < metrics.rect.width || canvas.height < metrics.rect.height) {
                    canvas.width = canvas.height = Math.max(metrics.rect.width, metrics.rect.height);
                    baseTexture.update();
                }
            }


            //todo: cleanup when we know whats needed
            obj = {
                metrics: metrics,
                font: font,
                value: char,
                frame: metrics.rect,
                baseTexture: metrics.rect ? baseTexture : null,
                xOffset: metrics.bounds ? metrics.bounds.minx : 0,
                yOffset: metrics.descent || 0,
                width: metrics.width || 0,
                lineHeight: metrics.lineHeight || 0,
                _cache: metrics.canvas,
                texture: metrics.rect ? new PIXI.Texture(baseTexture, metrics.rect) : null //temp texture
            };

            //add to collections
            familyCache[key] = obj;


            //add to atlas if visible char
            if (metrics.rect) {
                newObjects.push(obj);



                if (lazyTimeout === undefined)
                    lazyTimeout = setTimeout(function () {
                        addNewObjects();
                        lazyTimeout = undefined;
                    }, 0);

            }
        }

        return obj;
    }

    var compareFunction = function (a, b) {
        if (a.frame.height < b.frame.height)
            return 1;

        if (a.frame.height > b.frame.height)
            return -1;


        if (a.frame.width < b.frame.width)
            return 1;

        if (a.frame.width > b.frame.width)
            return -1;


        return 0;
    };

    var addNewObjects = function () {
        newObjects.sort(compareFunction);
        var _resized = false;
        var _newcanvas = false;

        for (var i = 0; i < newObjects.length; i++) {
            var obj = newObjects[i];
            var node = rootNode.insert(obj.frame.width + padding, obj.frame.height + padding, obj);

            if (node !== null) {
                if (_newcanvas) obj.texture.baseTexture = baseTexture; //update basetexture if new canvas was created (temp)
                objects.push(obj);
                continue;
            }

            if (atlasdim < maxdim) {
                _resized = true;
                resizeCanvas(atlasdim * 2);
                i--;
                continue;
            }

            //close current spritesheet and make a new one
            drawObjects(objects, _resized);
            addCanvas();
            _newcanvas = true;
            _resized = false;
        }

        drawObjects(_resized || _newcanvas ? objects : newObjects, _resized);
        newObjects = [];
    }

    var resizeCanvas = function (dim) {
        canvas.width = canvas.height = atlasdim = dim;

        rootNode = new AtlasNode(dim, dim);
        objects.sort(compareFunction);

        for (var i = 0; i < objects.length; i++) {
            var obj = objects[i];
            rootNode.insert(obj.frame.width + padding, obj.frame.height + padding, obj);
        }
    }

    var generateCharData = function (char, style) {

        var fontSize = Math.max(1, int(style.fontSize,26)),
            lineHeight = fontSize * 1.3;


        //Start our returnobject
        var data = {
            fontSize: fontSize,
            lineHeight: lineHeight
        };

        //Return if newline
        if (!char || /(?:\r\n|\r|\n)/.test(char))
            return data;

        //Ctx font string
        var font = style.ctxFont();
        metricsContext.font = font;

        //Get char width
        data.width = metricsContext.measureText(char).width;

        //Return if char = space
        if (/(\s)/.test(char)) return data;

        //set canvas size (with padding so we can messure)
        var paddingY = Math.round(fontSize * 0.7), paddingX = Math.max(5, Math.round(fontSize * 0.7));
        metricsCanvas.width = Math.ceil(data.width) + paddingX * 2;
        metricsCanvas.height = 1.5 * fontSize;
        var w = metricsCanvas.width, h = metricsCanvas.height, baseline = (h / 2) + (paddingY * 0.5);

        //set font again after resize
        metricsContext.font = font;

        //make sure canvas is clean
        metricsContext.clearRect(0, 0, w, h);

        //save clean state with font
        metricsContext.save();

        //convert shadow string to shadow data
        var shadowData = function (str) {
            var data = str.trim().split(' ');
            return {
                color: string(data[0], "#000000"),
                alpha: float(data[1], 0.5),
                xOffset: float(data[2], 3),
                yOffset: float(data[3], 3),
                blur: float(data[4], 5)
            }
        }

        //convert fill string to fill data
        var fillData = function (str) {
            var data = str.trim().split(' ');
            var c = string(data[0], "#FFFFFF");
            var a = float(data[1], 1);
            return {
                color: c,
                alpha: a,
                position: float(data[2], -1),
                rgba: hexToRgba(c, a)
            }
        }

        //create fill style from fill string
        var getFillStyle = function (str) {
            var fills = str.split(',').filter(function (s) { return s !== '' });

            //convert to fill data
            for (var i = 0; i < fills.length; i++) fills[i] = fillData(fills[i]);

            switch (fills.length) {
                case 0: return "white";
                case 1: return fills[0].rgba ? fills[0].rgba : fills[0].color || "#FFFFFF";
                default:
                    //make gradient
                    try {
                        var gradEnd = baseline + ((lineHeight - fontSize) * 0.5),
                            gradient = metricsContext.createLinearGradient(0, gradEnd - fontSize, 0, gradEnd);

                        for (var i = 0; i < fills.length; i++)
                            gradient.addColorStop(fills[i].position !== -1 ? fills[i].position : i / (fills.length - 1), fills[i].rgba || fills[i].color);

                        return gradient;
                    }
                    catch (e) {
                        return "#FFFFFF";
                    }
            }
        }


        //function to draw shadows
        var drawShadows = function (shadowString, stroke) {
            var shadows = shadowString.trim().split(',').filter(function (s) { return s !== '' });
            if (shadows.length) {
                for (var i = 0; i < shadows.length; i++) {
                    var s = shadowData(shadows[i]);
                    metricsContext.globalAlpha = s.alpha;
                    metricsContext.shadowColor = s.color;
                    metricsContext.shadowOffsetX = s.xOffset + w;
                    metricsContext.shadowOffsetY = s.yOffset;
                    metricsContext.shadowBlur = s.blur;

                    if (stroke) {
                        metricsContext.lineWidth = style.stroke;
                        metricsContext.strokeText(char, paddingX - w, baseline);
                    }
                    else metricsContext.fillText(char, paddingX - w, baseline);
                }
                metricsContext.restore();
            }
        }

        //draw text shadows
        if (style.shadow.length)
            drawShadows(style.shadow, false);

        //draw stroke shadows
        if (style.stroke && style.strokeShadow.length) {
            drawShadows(style.strokeShadow, true);
        }

        //draw text
        metricsContext.fillStyle = getFillStyle(string(style.fill, "#000000"));
        metricsContext.fillText(char, paddingX, baseline);
        metricsContext.restore();

        //draw stroke
        if (style.stroke) {
            metricsContext.strokeStyle = getFillStyle(string(style.strokeFill, "#000000"));
            metricsContext.lineWidth = style.stroke;
            metricsContext.strokeText(char, paddingX, baseline);
            metricsContext.restore();
        }


        //begin messuring
        var pixelData = metricsContext.getImageData(0, 0, w, h).data;

        var i = 3,
            line = w * 4,
            len = pixelData.length;



        //scanline on alpha
        while (i < len && !pixelData[i]) { i += 4 }
        var ascent = (i / line) | 0;


        if (i < len) {
            //rev scanline on alpha
            i = len - 1;
            while (i > 0 && !pixelData[i]) { i -= 4 }
            var descent = (i / line) | 0;


            //left to right scanline on alpha
            for (i = 3; i < len && !pixelData[i];) {
                i += line;
                if (i >= len) { i = (i - len) + 4; }
            }
            var minx = ((i % line) / 4) | 0;

            //right to left scanline on alpha
            var step = 1;
            for (i = len - 1; i >= 0 && !pixelData[i];) {
                i -= line;
                if (i < 0) { i = (len - 1) - (step++) * 4; }
            }
            var maxx = ((i % line) / 4) + 1 | 0;


            // set font metrics
            data.ascent = (baseline - ascent);
            data.descent = (descent - baseline);
            data.height = 1 + (descent - ascent);
            data.bounds = {
                minx: minx - paddingX,
                maxx: maxx - paddingX,
                miny: 0,
                maxy: descent - ascent
            };
            data.rect = {
                x: data.bounds.minx,
                y: -data.ascent - 2,
                width: data.bounds.maxx - data.bounds.minx + 2,
                height: data.ascent + data.descent + 4
            }


            //cache (for fast rearrange later)
            data.canvas = document.createElement("canvas");
            data.canvas.width = data.rect.width;
            data.canvas.height = data.rect.height;
            var c = data.canvas.getContext("2d");
            c.drawImage(metricsCanvas, -paddingX - data.rect.x, -baseline - data.rect.y);

            //reset rect position
            data.rect.x = data.rect.y = 0;

        }
        return data;
    }
}



//helper function for float or default
var float = function (val, def) {
    if (isNaN(val)) return def;
    return parseFloat(val);
}

//helper function for int or default
var int = function (val, def) {
    if (isNaN(val)) return def;
    return parseInt(val);
}

//helper function for string or default
var string = function (val, def) {
    if (typeof val === 'string' && val.length) return val;
    return def;
}

//helper function to convert string hex to int or default
var hexToInt = function (str, def) {
    if (typeof str === 'number')
        return str;

    var result = parseInt(str.replace('#', '0x'));

    if (isNaN(result)) return def;
    return result;
}

//helper function to convert hex to rgba
function hexToRgba(hex, alpha) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    alpha = float(alpha, 1);
    return result ? "rgba(" + parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + "," + alpha + ")" : false;
}






