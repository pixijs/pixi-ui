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
    const mockContainer = new PUXI.UI.Container(width, height);

    mockContainer.container.addChild(generateBackgroundGraphics(width, height, color));

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

    const uxStage = new PUXI.UI.Stage(512, 512);
    const mockButton = new PUXI.UI.Button({
        text: new PUXI.UI.Text('Hello world!'),
    });

    mockButton.verticalAlign = 'middle';
    mockButton.horizontalAlign = 'center';

    const mockBgWrapper = this.generateBackgroundUI();
    const mockInput = new PUXI.UI.TextInput({
        multiLine: false,
        background: mockBgWrapper,
    });

    mockInput.verticalAlign = 'bottom';
    mockInput.horizontalAlign = 'center';

    const mockScroll = new PUXI.UI.ScrollingContainer({
        width: 300,
        height: 60,
        scrollY: true,
    });

    const mockBg2 = generateBackgroundGraphics();
    const mockBg3 = generateBackgroundGraphics();
    const scrollCont = new PUXI.UI.Container(300, 100);

    scrollCont.container.addChild(mockBg2);
    scrollCont.container.addChild(mockBg3);
    mockScroll.addChild(scrollCont);
    mockScroll.horizontalAlign = 'center';

    const mockCheckbox = new PUXI.UI.CheckBox({
        checked: true,
        background: this.generateBackgroundUI(30, 30),
        checkmark: this.generateBackgroundUI(10, 10, 0xff),
    });

    uxStage.addChild(mockButton);
    uxStage.addChild(mockInput);
    uxStage.addChild(mockScroll);
    uxStage.addChild(mockCheckbox);
    app.stage.addChild(uxStage);

    window.app = app;
};
