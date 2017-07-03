
/// <reference path="pixi.js" />
/// <reference path="../bin/pixi-ui.js" />

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
PIXI.settings.RESOLUTION = devicePixelRatio || 1;
PIXI.UI.DynamicText.settings.debugSpriteSheet = true;


app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight, resolution: devicePixelRatio || 1, transparent: true });
app.view.className = "canvas";
document.body.appendChild(app.view);

var uiStage = new PIXI.UI.Stage(window.innerWidth, window.innerHeight);
app.stage.addChild(uiStage);

//window resize
window.addEventListener("resize", function () {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    uiStage.resize(window.innerWidth, window.innerHeight);
});


var loadfn;
PIXI.loader.add('UISprites.json').load(loadfn = function () {
    var text = "<font align='center'>\n";
    text += "<i>italic</i> <b>bold</b> <font style='oblique'>oblique</font>  <font  skew='0.2'>Skew</font>\n";
    text += "<font size='100' weight='bold' shadow='#000000 0.5 5 5 5'>BIG</font> and <font rotation='-0.3' size='80' stroke='3' fill='transparent' tint='#ffffff' strokeShadow='purple 0.5 0 -2 8, yellow 0.6 0 5 2, cyan 0.6 5 0 2, red 0.6 -5 0 2' strokeFill='#0000ff, #FF0000, #0000ff'>TWISTED</font>\n";
    text += "<font family='Segoe UI' size='75' color='#65ba37' spacing='30' style='italic' weight='bold'>multiple things</font>\n";
    text += "<font size='100' tint='#ffffff' family='tangerine' weight='bold' fill='purple, black' shadow='#000000' >from a different Family</font>\n";
    text += "<font size='60' shadow='purple 0.5 0 -2 2, yellow 0.5 0 5 2, cyan 0.5 5 0 2, red 0.5 -5 0 2'>\n<font rotation='0.5'>😋😜😝😛👱🏻👴🏻👵🏻👲🏻\n<font rotation='1'>👶🏼👦🏼👧🏼👨🏼👶🏽👦🏽👧🏽👨🏽\n<font rotation='-0.5'>👦🏾👧🏾👨🏾👩🏾👦🏿👧🏿👨🏿👩🏿";



    if (!webfontReady) {
        return setTimeout(loadfn, 5);
    }


    var box = new PIXI.UI.SliceSprite(PIXI.Texture.fromFrame("UI/cb-1-bg.png"), 10);
    box.anchorBottom = box.anchorRight = box.anchorTop = 10;
    box.anchorLeft = "40%";
    box.alpha = 1;
    uiStage.addChild(box);


    container = new PIXI.UI.ScrollingContainer();
    container.anchorBottom = container.anchorRight = container.anchorTop = 18;
    container.anchorLeft = "40%";
    uiStage.addChild(container);


    

    var input = document.createElement("input");
    input.type = "text";


    var input = document.createElement("textarea");
    input.className = "input";
    document.body.appendChild(input);
    input.value = text;
    input.addEventListener("input", function () {
        dynamicText.value = input.value;
    });






    dynamicText = new PIXI.UI.DynamicText(text, {
        allowTags: true,
        width: '100%',
        height: '100%'
    });
    container.addChild(dynamicText);

    dynamicText.style.fontSize = 16;
    dynamicText.style.fontFamily = 'Calibri';
    dynamicText.style.fontWeight = 'bold';
    dynamicText.style.tint = '#000000';
    dynamicText.anchorLeft = dynamicText.anchorRight = 20;
    dynamicText.anchorTop = dynamicText.anchorBottom = 10;
    
    
});