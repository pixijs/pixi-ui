var UIBase = require('./UIBase');
var emojiRegex = require('emoji-regex');
var atlas = null;

//helper function for floats
var float = function (val, def) {
    if (isNaN(val)) return def;
    return parseFloat(val);
}

//helper function for ints
var int = function (val, def) {
    if (isNaN(val)) return def;
    return parseInt(val);
}

//helper function for strings
var string = function (val, def) {
    if (typeof val === 'string' && val.length) return val;
    return def;
}

//helper function to convert hex to rgba
function hexToRgba(hex, alpha) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    alpha = float(alpha, 1);
    return result ? "rgba(" + parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + "," + alpha + ")" : false;
}



function DynamicTextStyle() {
    this.scale = 1;

    this.align = 'left';
    this.fontFamily = 'Arial';
    this.fontSize = 26;
    this.fontWeight = 'normal';
    this.fontStyle = 'normal',
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
}


DynamicTextStyle.prototype.clone = function () {
    var style = new DynamicTextStyle();
    style.merge(this);
    return style;
}

DynamicTextStyle.prototype.merge = function (style) {
    if (typeof style === 'object') {
        for (var param in style) {
            var val = style[param];
            if (typeof val !== 'function')
                this[param] = val;
        }
    }
}

DynamicTextStyle.prototype.ctxKey = function (char) {
    return [char, this.fill, this.shadow, this.stroke, this.strokeFill, this.strokeShadow].join('|');
}

DynamicTextStyle.prototype.ctxFont = function () {
    var fontSize = Math.min(200, Math.max(1, int(this.fontSize, 26))) + "px ";
    var fontWeight = this.fontWeight === "bold" ? this.fontWeight + " " : "";
    var fontStyle = this.fontStyle === "italic" || this.fontStyle === "oblique" ? this.fontStyle + " " : "";
    return fontWeight + fontStyle + fontSize + this.fontFamily;
}




function DynamicChar(style) {
    //styledata (texture, orig width, orig height)
    this.style = style;

    //char data
    this.data = null;

    //is this char space?
    this.space = false;

    //is this char newline?
    this.newline = false;

    //charcode
    this.charcode = 0;

    //char string value
    this.value = "";

    //word index
    this.wordIndex = -1;

    //line index of char
    this.lineIndex = -1;

    //cache for sprite
    this.sprite = null;
}


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
    UIBase.call(this, width || 0, height || 0);
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
        //console.log("render");
        var yOffset = 0,
            xOffset = 0,
            currentLine = -1,
            i;



        //console.log(renderChars.length, renderCount);
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


            sprite.tint = char.emoji ? 0xffffff : char.style.tint.replace("#", "0x");
            sprite.rotation = isNaN(char.style.rotation) ? 0 : parseFloat(char.style.rotation);
            sprite.skew.x = isNaN(char.style.skew) ? 0 : parseFloat(char.style.skew);

            if (!sprite.parent)
                charContainer.addChild(sprite);
        }





    };

    //updates the renderChar array and position chars for render
    this.prepareForRender = function () {
        //clear output array


        var pos = new PIXI.Point(),
            wordIndex = 0,
            lineHeight = 0,
            lineFontSize = 0,
            lineIndex = 0,
            lineAlignment = defaultStyle.align;

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

            pos.x += Math.round(char.data.width) + parseFloat(char.style.letterSpacing);


            //textbox width
            if (autoWidth) this._width = Math.max(pos.x, this._width);

            //new line
            if (char.newline || i === renderCount - 1) {
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

            renderChars[i] = char;
        }


        this.dirtyAlignment = false;
    };

    //phrases the input text and prepares the char array
    this.processInputText = function () {
        var styleTree = [defaultStyle],
            charIndex = 0,
            inputTextIndex = 0,
            inputArray = Array.from(this._inputText);


        var closeTags = ['</i>', '</b>', '</font>', '</center>'];


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
                char = new DynamicChar(styleTree[styleTree.length - 1].clone());
                chars[charIndex] = char;
            }
            else {
                char.style.merge(styleTree[styleTree.length - 1]);
            }

            if (emoji) {
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












var _canvas = document.createElement("canvas");
var _ctx = _canvas.getContext("2d");
_canvas.width = 100;
_canvas.height = 100;

//setTimeout(function () {
//    _canvas.className = "messureAtlas";
//    document.body.appendChild(_canvas);
//}, 100);

var AtlasNode = function (w, h, parent) {
    var children = this.children = [];
    this.rect = new PIXI.Rectangle(0, 0, w || 0, h || 0);
    this.data = null;
    this.parent = parent || null;
    this.vertical = false;

    //this.resize = function (width, height) {
    //    if (this.data === null) {
    //        var wDif = width - this.rect.width;
    //        var hDif = height - this.rect.height;

    //        this.rect.width = width;
    //        this.rect.height = height;


    //        for (var i = 0; i < this.children.length; i++) {
    //            var child = this.children[i];
    //            if (child.vertical)
    //                child.resize(this.rect.width, child.rect.height + hDif);
    //            else
    //                child.resize(child.rect.width + wDif, this.rect.height);                    
    //        }
    //    }
    //}


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
                obj._dirtyNode = true;
                return this;
            }

            children.push(new AtlasNode(0, 0, this));
            children.push(new AtlasNode(0, 0, this));

            var dw = this.rect.width - width;
            var dh = this.rect.height - height;

            if (dw > dh) {
                children[0].rect = new PIXI.Rectangle(this.rect.x, this.rect.y, width, this.rect.height);
                children[1].rect = new PIXI.Rectangle(this.rect.x + width, this.rect.y, this.rect.width - width, this.rect.height);
                //children[0].vertical = true;
                //children[1].vertical = false;
            } else {
                children[0].rect = new PIXI.Rectangle(this.rect.x, this.rect.y, this.rect.width, height);
                children[1].rect = new PIXI.Rectangle(this.rect.x, this.rect.y + height, this.rect.width, this.rect.height - height);
                //children[0].vertical = false;
                //children[1].vertical = true;
            }

            return children[0].insert(width, height, obj);
        }
    }
}

var DynamicAtlas = function (padding) {
    var renderNode = function (node, childIndex) {

        //atlasCtx.strokeStyle = rootNode.data !== null ? "#FF0000" : "#00FF00";

        if (node.rect) {
            atlasCtx.lineWidth = childIndex == 0 ? 10 : 2;
            //atlasCtx.beginPath();
            atlasCtx.fillStyle = childIndex == 0 ? "green" : "blue";
            atlasCtx.strokeStyle = childIndex == 0 ? "green" : "blue";
            //atlasCtx.fillRect(node.rect.x, node.rect.y, node.rect.width, node.rect.height);
            atlasCtx.strokeRect(node.rect.x, node.rect.y, node.rect.width, node.rect.height);
            atlasCtx.stroke();

        }
        //atlasCtx.closePath();
        for (var i = 0; i < node.children.length; i++)
            renderNode(node.children[i], i)
    }




    var res = devicePixelRatio || 1,
        atlasCanvas,
        atlasCtx,
        resize,
        objects,
        rearrange,
        baseTexture,
        renderTimeout,
        rootNode,
        canvasList = [],
        atlasdim,
        startdim = 256,
        maxdim = 2048;
    this.debug = false;

    var addCanvas = function () {
        //make sure previous canvas is updated
        renderTimeout = undefined;
        if (atlasCanvas !== undefined) drawAllObjects(true);

        //create new canvas
        atlasCanvas = document.createElement("canvas");
        atlasCtx = atlasCanvas.getContext("2d");
        //atlasCtx.scale(PIXI.settings.RESOLUTION, PIXI.settings.RESOLUTION);
        canvasList.push(atlasCanvas);

        //reset dimentions
        atlasdim = startdim;
        atlasCanvas.width = atlasCanvas.height = atlasdim;
        rootNode = new AtlasNode(atlasdim, atlasdim);

        //reset array with canvas objects and create new atlas
        objects = [];


        //set new basetexture
        baseTexture = PIXI.BaseTexture.fromCanvas(atlasCanvas);
        //baseTexture.resolution = PIXI.settings.RESOLUTION;
        baseTexture.mipmap = false;
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


    var drawAllObjects = function (force) {
        if (resize) {
            atlasCanvas.width = atlasCanvas.height = atlasdim;
            baseTexture.update();
            resize = false;
        }
        else if (rearrange) {
            atlasCtx.clearRect(0, 0, atlasCanvas.width, atlasCanvas.height);
            rearrange = false;
        }
        else if (!force) return;

        for (var i = 0; i < objects.length; i++) {
            drawObject(objects[i]);
        }
    }

    var drawObject = function (obj) {
        atlasCtx.drawImage(obj._cache, obj.frame.x, obj.frame.y)

        if (!obj.texture) {
            obj.texture = new PIXI.Texture(baseTexture, obj.frame);
        }
        else {
            obj.texture.frame = obj.frame;
        }

        obj.texture.update();
        obj._dirtyNode = false;





        if (ss.debug) {
            console.log("OKOOKKOK");
            for (var i = 0; i < rootNode.children.length; i++) {
                renderNode(rootNode.children[i], i)
            }
        }
    }

    var insertObject = function (obj) {
        var w = obj.frame.width,
            h = obj.frame.height;
        if (w > maxdim || h > maxdim) {
            console.warn("Texture is bigger than spritesheet");
            return;
        }

        var node = rootNode.insert(w + padding, h + padding, obj);



        //resize atlas
        if (node == null) {
            //Create new canvasl
            //if (atlasdim * 2 > maxdim) {
            //rearrange = true;
            //rearrangeCanvas(atlasdim);

            console.log("resizing");

            atlasdim *= 2;
            rootNode.resize(atlasdim, atlasdim);
            resize = true;
            atlasCanvas.width = atlasCanvas.height = atlasdim;
            baseTexture.update();

            node = rootNode.insert(w + padding, h + padding, obj);

            drawObject(obj);
            drawAllObjects();
            return;

            //if (node == null) {
            //    addCanvas();
            //    return insertObject(obj);
            //}
            //}

            //if (!rearrange) {
            //    resize = true;
            //    atlasdim *= 2;
            //    rearrangeCanvas(atlasdim);
            //    node = rootNode.insert(w + padding, h + padding, obj);
            //}

        }

        //if (node == null) return;
        //add to current canvas and collection
        drawObject(obj);
        objects.push(obj);
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

            //todo: cleanup when we know whats needed
            obj = {
                metrics: metrics,
                font: font,
                value: char,
                frame: metrics.rect,
                texture: undefined,
                xOffset: metrics.bounds ? metrics.bounds.minx : 0,
                yOffset: metrics.descent || 0,
                width: metrics.width || 0,
                lineHeight: metrics.lineHeight || 0,
                _cache: metrics.canvas,
                _dirtyNode: true
            };

            //add to collections
            familyCache[key] = obj;


            //add to atlas if visible char
            if (metrics.rect)
                insertObject(obj);
        }

        return obj;
    }


    var rearrangeCanvas = this.rearrangeCanvas = function (dim) {

        if (!dim)
            dim = atlasdim;
        atlasdim = dim;
        rootNode = new AtlasNode(dim, dim);

        objects.sort(function (a, b) {
            if (a.frame.height < b.frame.height)
                return 1;

            if (a.frame.height > b.frame.height)
                return -1;


            if (a.frame.width < b.frame.width)
                return 1;

            if (a.frame.width > b.frame.width)
                return -1;


            return 0;
        });


        for (var i = 0; i < objects.length; i++) {
            var obj = objects[i];
            rootNode.insert(obj.frame.width + padding, obj.frame.height + padding, obj);
        }









        drawAllObjects();
    }


    var generateCharData = function (char, style) {

        var fontSize = style.fontSize,
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
        _ctx.font = font;

        //Get char width
        data.width = _ctx.measureText(char).width;

        //Return if char = space
        if (/(\s)/.test(char)) return data;

        //set canvas size (with padding so we can messure)
        var paddingY = Math.round(fontSize * 0.7), paddingX = Math.max(5, Math.round(fontSize * 0.7));
        _canvas.width = Math.ceil(data.width) + paddingX * 2;
        _canvas.height = 1.5 * fontSize;
        var w = _canvas.width, h = _canvas.height, baseline = (h / 2) + (paddingY * 0.5);

        //set font again after resize
        _ctx.font = font;

        //make sure canvas is clean
        _ctx.clearRect(0, 0, w, h);

        //save clean state with font
        _ctx.save();

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
                            gradient = _ctx.createLinearGradient(0, gradEnd - fontSize, 0, gradEnd);

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
                    _ctx.globalAlpha = s.alpha;
                    _ctx.shadowColor = s.color;
                    _ctx.shadowOffsetX = s.xOffset + w;
                    _ctx.shadowOffsetY = s.yOffset;
                    _ctx.shadowBlur = s.blur;

                    if (stroke) {
                        _ctx.lineWidth = style.stroke;
                        _ctx.strokeText(char, paddingX - w, baseline);
                    }
                    else _ctx.fillText(char, paddingX - w, baseline);
                }
                _ctx.restore();
            }
        }

        if (style.shadow.length)
            drawShadows(style.shadow, false);

        if (style.stroke && style.strokeShadow.length) {
            drawShadows(style.strokeShadow, true);
            console.log("drawing stroke shadow");
        }



        //fill text
        _ctx.fillStyle = getFillStyle(style.fill);
        _ctx.fillText(char, paddingX, baseline);
        _ctx.restore();

        //stroke
        if (style.stroke) {

            _ctx.strokeStyle = getFillStyle(style.strokeFill.length ? style.strokeFill : "#000000");
            _ctx.lineWidth = style.stroke;
            _ctx.strokeText(char, paddingX, baseline);
            _ctx.restore();
        }






        var pixelData = _ctx.getImageData(0, 0, w, h).data;


        var i = 3,
            w4 = w * 4,
            len = pixelData.length;



        //scanline on alpha
        while (i < len && pixelData[i] === 0) { i += 4 }
        var ascent = (i / w4) | 0;


        if (i < len) {
            //rev scanline on alpha
            i = len - 1;
            while (i > 0 && pixelData[i] === 0) { i -= 4 }
            var descent = (i / w4) | 0;


            //left to right scanline on alpha
            for (i = 3; i < len && pixelData[i] === 0;) {
                i += w4;
                if (i >= len) { i = (i - len) + 4; }
            }
            var minx = ((i % w4) / 4) | 0;

            //right to left scanline on alpha
            var step = 1;
            for (i = len - 1; i >= 0 && pixelData[i] === 0;) {
                i -= w4;
                if (i < 0) { i = (len - 1) - (step++) * 4; }
            }
            var maxx = ((i % w4) / 4) + 1 | 0;




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
            c.drawImage(_canvas, -paddingX - data.rect.x, -baseline - data.rect.y);

            //reset rect position
            data.rect.x = data.rect.y = 0;

        }
        return data;
    }
}








