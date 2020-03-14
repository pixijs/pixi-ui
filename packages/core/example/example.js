/* global PIXI, PUXI */

function generateBackgroundGraphics(width = 300, height = 50, color = 0xffff)
{
    const mockBg = new PIXI.Graphics();

    mockBg.beginFill(color);
    mockBg.drawRect(0, 0, width, height);
    mockBg.endFill();

    return mockBg;
}

function generateBackgroundUI(width = 300, height = 50, color)
{
    const mockContainer = new PUXI.Container(width, height);

    mockContainer.contentContainer.addChild(generateBackgroundGraphics(width, height, color));

    return mockContainer;
}

window.onload = function ()
{
    const app = new PIXI.Application({
        view: document.getElementById('app-cvs'),
        backgroundColor: 0xff00ff,
        width: 512,
        height: 512,
    });

    const uxStage = new PUXI.Stage(512, 512);

    const mockTitle = new PUXI.Text('PUXI Expo')
        .setBackground(new this.PIXI.Graphics()
            .beginFill(0xabcdef)
            .drawRect(0, 0, 20, 10)
            .endFill())
        .setPadding(8, 8, 8, 8);

    const mockButton = new PUXI.Button({
        text: new PUXI.Text('Hello world!'),
    })
        .setLayoutOptions(new PUXI.FastLayoutOptions(
            PUXI.LayoutOptions.WRAP_CONTENT,
            PUXI.LayoutOptions.WRAP_CONTENT,
            0.5,
            0.5,
            PUXI.FastLayoutOptions.CENTER_ANCHOR,
        ))
        .setBackground(new PIXI.Graphics()
            .beginFill(0xffaabb)
            .drawRoundedRect(0, 0, 300, 100, 16)
            .endFill());

    mockButton.verticalAlign = 'middle';
    mockButton.horizontalAlign = 'center';

    const mockBgWrapper = this.generateBackgroundUI();
    const mockInput = new PUXI.TextInput({
        multiLine: false,
        background: mockBgWrapper,
    });

    mockInput.verticalAlign = 'bottom';
    mockInput.horizontalAlign = 'center';

    const mockScroll = new PUXI.ScrollingContainer({
        width: 300,
        height: 60,
        scrollY: true,
    });

    const mockBg2 = generateBackgroundGraphics(300, 50, 0xfff000);
    const mockBg3 = generateBackgroundGraphics(300, 50);

    mockBg3.y = 50;
    const scrollCont = new PUXI.Container(300, 100);

    scrollCont.contentContainer.addChild(mockBg2);
    scrollCont.contentContainer.addChild(mockBg3);
    mockScroll.addChild(scrollCont);
    mockScroll.horizontalAlign = 'center';

    const mockCheckbox = new PUXI.CheckBox({
        checked: true,
        background: this.generateBackgroundUI(30, 30),
        checkmark: this.generateBackgroundUI(10, 10, 0xff),
    });

    uxStage.addChild(mockTitle);
    uxStage.addChild(mockButton);
    // uxStage.addChild(mockInput);
    // uxStage.addChild(mockScroll);
    // uxStage.addChild(mockCheckbox);
    app.stage.addChild(uxStage);

    window.app = app;
    window.stage = uxStage;
};
