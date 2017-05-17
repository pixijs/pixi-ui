var UIBase = require('./UIBase');
var Styles = {
    "default": {
        chars: {},
        style: { fill: '#FFFFFF', fontSize: 20 },
        ignoreColor: false
    }
};


/**
 * An UI text object
 *
 * @class
 * @extends PIXI.UI.UIBase
 * @memberof PIXI.UI
 * @param Text {String} Text content
 * @param DefaultStyleName {String} Defualt style (use DynamicText.RegisterStyle() to add styles)
 */
function DynamicText(text, defaultStyleName, defaultColor) {
    UIBase.call(this, 0, 0);
    this._inputText = text;

    //dirty checks
    this.dirtyText = true;
    var lastWidth = 0;
    var lastHeight = 0;
    var chars = [];
    var lineHeight = 0;

    //temp
    var innerContainer = new PIXI.Container();

    this.update = function () {
        if (this.dirtyText || this._width !== lastWidth || this._height !== lastHeight) {
            this.dirtyText = false;
            lastWidth = this._width;
            lastHeight = this._height;



            var style, color, valign, size, rotation, fonts = [{}], currentFont;

            var UpdateFontStyles = function () {
                currentFont = fonts[fonts.length - 1];
                style = Styles[currentFont.style] || Styles[defaultStyleName] || Styles["default"];
                color = currentFont.color || defaultColor || "#ffffff";
                valign = parseInt(currentFont.valign || 0);
                size = parseInt(currentFont.size || style.style.fontSize);
                rotation = parseFloat(currentFont.rotation || 0);
            }
            UpdateFontStyles();



            var cx = 0, cy = 0;
            var textIndex = 0;
            for (var i = 0; i < this._inputText.length; i++) {
                var c = this._inputText[i];


                //detect font tags
                if (c === "<") {
                    var _name = this._inputText.slice(i + 1, i + 6);
                    if (_name === "font " || _name === "/font") {
                        var tag = this._inputText.substring(i);
                        tag = tag.slice(0, tag.indexOf(">") + 1);

                        if (tag.length) {
                            var matchFound = false;
                            if (tag === "</font>") {
                                matchFound = true;
                                if (fonts.length > 1) {
                                    fonts.splice(fonts.length - 1, 1);
                                    UpdateFontStyles();
                                }
                            }
                            else {
                                var font = JSON.parse(JSON.stringify(currentFont)),
                                    regex = /(\w+)\s*=\s*((["'])(.*?)\3|([^>\s]*)(?=\s|\/>))(?=[^<]*>)/g,
                                    match = regex.exec(tag);

                                while (match !== null) {
                                    font[match[1]] = match[4];
                                    match = regex.exec(tag);
                                    matchFound = true;
                                }
                                if (matchFound) {
                                    fonts.push(font);
                                    UpdateFontStyles();
                                }
                            }

                            if (matchFound) {
                                i += tag.length - 1;
                                continue;
                            }
                        }
                    }
                }


                //Get chardata (or create if doesn't exsist)
                var charStyleData = style.chars[c];
                if (!charStyleData) {
                    var text = new PIXI.Text(c, style.style);
                    var texture;
                    var isSpace = c === " ";
                    if (!isSpace)
                        texture = ss.AddObject(text);
                    charStyleData = style.chars[c] = {
                        style: style,
                        texture: texture,
                        width: text.width,
                        height: text.height,
                        isSpace: isSpace
                    }
                }

                if (!lineHeight) {
                    lineHeight = charStyleData.height;
                }


                var char = chars[textIndex];
                if (!char) {
                    char = {}
                    chars.push(char);
                }





                char.styleData = charStyleData;

                char._orgIndex = i;
                char.tint = color;
                char.width = char.styleData.width * (size / style.style.fontSize);
                char.height = char.styleData.height * (size / style.style.fontSize);



                var offsetY = (lineHeight - char.height) + valign;

                char.x = cx;
                char.y = cy + offsetY;
                char.rotation = rotation;
                cx += char.width;
                textIndex++;
            }

            this.width = cx;

            if (chars.length >= textIndex) {
                chars.splice(textIndex, chars.length - textIndex);
            }


            //ROUGH TEMP RENDER (with sprites)
            if (innerContainer.children.length > 0) innerContainer.removeChildren(0, innerContainer.children.length);
            for (var i = 0; i < chars.length; i++) {
                var char = chars[i];

                //no reason to render a blank space (no texture created)
                if (char.styleData.isSpace) continue;


                var sprite = new PIXI.Sprite(char.styleData.texture);

                sprite.width = char.width;
                sprite.height = char.height;
                sprite.anchor.set(0.5);
                sprite.x = char.x + (sprite.width * 0.5);
                sprite.y = char.y + (sprite.height * 0.5);
                sprite.tint = char.tint.replace("#", "0x");
                sprite.rotation = char.rotation;
                innerContainer.addChild(sprite);
            }

            window.output = innerContainer;
            this.container.addChild(innerContainer);
        }
    };
}

DynamicText.prototype = Object.create(UIBase.prototype);
DynamicText.prototype.constructor = DynamicText;
module.exports = DynamicText;


Object.defineProperties(DynamicText.prototype, {
    value: {
        get: function () {
            return this._inputText;
        },
        set: function (val) {
            this._inputText = val;
            this.dirtyText = true;
            this.update();
        }
    },
});


DynamicText.RegisterStyle = function (name, PixiTextStyle) {
    if (typeof name === "string" && name.length) {
        var s = JSON.parse(JSON.stringify(Styles["default"]));

        for (var param in PixiTextStyle) {
            s[param] = PixiTextStyle[param];
        }

        Styles[name] = {
            chars: {},
            style: s
        }
    }
}





var SpriteSheet = function (maxWidth, maxHeight, padding) {
    var res = devicePixelRatio || 1, canvas, container, baseTexture, cx, cy, cw, ch, renderTimeout;
    var canvasList = [];
    this.createNewCanvas = function () {
        canvas = new PIXI.CanvasRenderer({ width: 100, height: 100, transparent: true, resolution: res });
        canvas.objects = [];
        baseTexture = PIXI.BaseTexture.fromCanvas(canvas.view);
        container = new PIXI.Container();
        cx = cy = cw = ch = 0;
        canvasList.push(canvas);
        renderTimeout = undefined;


        setTimeout(function () {
            document.body.appendChild(canvas.view);
            canvas.view.className = "ss";
            canvas.view.style.right = ((canvasList.length - 1) * maxWidth + 10) + "px";
            canvas.view.style.transform = "scale(" + (1 / devicePixelRatio) + ")";
            canvas.view.style.transformOrigin = "100% 100%";
        }, 100);

    }

    this.createNewCanvas();


    this.render = function () {
        //resize the canvas if texture doesnt fit
        var resize = false;

        if (cw > canvas.width / res || ch > canvas.height / res) {
            this.reArrange()
            canvas.resize(Math.max(cw, canvas.width / res), Math.max(ch, canvas.height / res));
            baseTexture.update();
            resize = true;
        }

        canvas.render(container);

        //update texture frames (after resize and render)
        for (var i = 0; i < canvas.objects.length; i++) {
            var obj = canvas.objects[i];
            if (obj.dirty || resize) {
                obj.texture.frame = new PIXI.Rectangle(obj.sprite.x * res, obj.sprite.y * res, obj.sprite.width * res, obj.sprite.height * res);
                obj.texture.update();

                obj.dirty = false;
            }
        }
    }

    this.AddObject = function (obj, positionOnly) {
        

        
        

        

        //change line
        if (cx + obj.width > maxWidth) {
            cy = ch + padding;
            cx = 0;

            //arrange or new canvas
            if (!positionOnly && cy + obj.height > maxHeight) 
                this.createNewCanvas();
        }

        

        obj.x = cx;
        obj.y = cy;


        if (cy + obj.height > ch)
            ch = cy + obj.height;
        if (cx + obj.width > cw)
            cw = cx + obj.width;
        cx += obj.width + padding;


        var outputTexture = new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, 0, obj.width, obj.height));

        if (!positionOnly) {
            canvas.objects.push({
                dirty: true,
                sprite: obj,
                baseTexture: baseTexture,
                texture: outputTexture
            }); 
            container.addChild(obj);
        }


        //Update the canvas 
        var self = this;
        if (renderTimeout === undefined) {
            renderTimeout = setTimeout(function () {
                self.render();
                console.log("RENDER");
                renderTimeout = undefined;
            }, 0);
        }

        return outputTexture;
    }

    this.reArrange = function () {
        canvas.objects.sort(function (a, b) {
            return b.sprite.height - a.sprite.height;
        });

        cx = cy = ch = cw = 0
        for (var i = 0; i < canvas.objects.length; i++) {
            this.AddObject(canvas.objects[i].sprite, true);
        }
    }
}
var ss = DynamicText.ss = new SpriteSheet(256, 100, 1);
