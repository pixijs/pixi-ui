/* global PIXI, PUXI */

function generateBackgroundGraphics(width = 300, height = 50, color = 0xffff)
{
    const mockBg = new PIXI.Graphics();

    mockBg.beginFill(color);
    mockBg.drawRect(0, 0, width, height);
    mockBg.endFill();

    return mockBg;
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

    // Add title
    const mockTitle = new PUXI.Text('PUXI Expo')
        .setBackground(new this.PIXI.Graphics()
            .beginFill(0xabcdef)
            .drawRect(0, 0, 20, 10)
            .endFill())
        .setPadding(8, 8, 8, 8);

    // Add rounded button in center
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
            .beginFill(0xffaabb, 0.5)
            .drawRoundedRect(0, 0, 300, 100, 16)
            .endFill());

    // Text input at bottom
    const mockInput = new PUXI.TextInput({
        multiLine: false,
        background: new PIXI.Graphics().beginFill(0xffffff).drawRect(0, 0, 20, 10).endFill(),
    }).setLayoutOptions(
        new PUXI.FastLayoutOptions(
            512,
            PUXI.LayoutOptions.WRAP_CONTENT,
            0,
            0.9,
        ),
    );

    mockInput.on('focus', () => { console.log('TextInput focused!'); }); // eslint-disable-line no-console
    mockInput.on('blur', () => { console.log('TextInput blur'); }); // eslint-disable-line no-console
    mockInput.on('keydown', () => { console.log('TextInput keydowned!'); }); // eslint-disable-line no-console

    const mockScroll = new PUXI.ScrollingContainer({
        width: 300,
        height: 60,
        scrollY: true,
    });

    const mockBg2 = generateBackgroundGraphics(300, 50, 0xfff000);
    const mockBg3 = generateBackgroundGraphics(300, 50);

    mockBg3.y = 50;
    const scrollCont = new PUXI.WidgetGroup(300, 100);

    scrollCont.contentContainer.addChild(mockBg2);
    scrollCont.contentContainer.addChild(mockBg3);
    mockScroll.addChild(scrollCont);
    mockScroll.horizontalAlign = 'center';

    const mockCheckbox = new PUXI.CheckBox({
        checked: true,
        background: generateBackgroundGraphics(30, 30),
        checkmark: generateBackgroundGraphics(10, 10, 0xff),
    }).setLayoutOptions(
        new PUXI.FastLayoutOptions(
            0.1, 30, 0.9, 0,
        ),
    );

    uxStage.addChild(mockTitle);
    uxStage.addChild(mockButton);
    uxStage.addChild(mockInput);
    uxStage.addChild(mockCheckbox);
    // uxStage.addChild(mockInput);
    // uxStage.addChild(mockScroll);
    // uxStage.addChild(mockCheckbox);

    uxStage.setBackground(new PIXI.Sprite.from('./bg.png'));

    app.stage.addChild(uxStage);

    window.app = app;
    window.stage = uxStage;

    window.mockTitle = mockTitle;
    window.mockButton = mockButton;
    window.mockTextInput = mockInput;
    window.mockCheckbox = mockCheckbox;
};
