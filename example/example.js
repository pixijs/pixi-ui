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

    const mockBg = new PIXI.Graphics();

    mockBg.beginFill(0xffff);
    mockBg.drawRect(0, 0, 300, 50);
    mockBg.endFill();

    const mockBgWrapper = new PUXI.UI.Container(300, 50);

    mockBgWrapper.container.addChild(mockBg);

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

    const mockBg2 = new PIXI.Graphics();

    mockBg2.beginFill(0xffff);
    mockBg2.drawRect(0, 0, 300, 50);
    mockBg2.endFill();
    // mockBg2.filters = [new PIXI.filters.NoiseFilter()];

    const mockBg3 = new PIXI.Graphics();

    mockBg3.beginFill(0xadfdad);
    mockBg3.drawRect(0, 0, 300, 50);
    mockBg3.endFill();
    mockBg3.y = 50;
    // mockBg3.filters = [new PIXI.filters.NoiseFilter()];

    const scrollCont = new PUXI.UI.Container(300, 100);

    scrollCont.container.addChild(mockBg2);
    scrollCont.container.addChild(mockBg3);
    mockScroll.addChild(scrollCont);
    mockScroll.horizontalAlign = 'center';

    uxStage.addChild(mockButton);
    uxStage.addChild(mockInput);
    uxStage.addChild(mockScroll);
    app.stage.addChild(uxStage);

    window.app = app;
};
