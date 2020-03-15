/* global PIXI, PUXI */

function generateBackgroundGraphics(width = 300, height = 50, color = 0xffff)
{
    const mockBg = new PIXI.Graphics();

    mockBg.beginFill(color);
    mockBg.drawRect(0, 0, width, height);
    mockBg.endFill();

    return mockBg;
}

window.onload = function onload()
{
    const width  = window.innerWidth || document.documentElement.clientWidth
    || document.body.clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight
    || document.body.clientHeight;

    const app = new PIXI.Application({
        view: document.getElementById('app-cvs'),
        backgroundColor: 0xff00ff,
        width,
        height,
    });

    const uxStage = new PUXI.Stage(width, height);

    // Add title
    const mockTitle = new PUXI.TextWidget('PUXI Expo')
        .setBackground(new this.PIXI.Graphics()
            .beginFill(0xabcdef)
            .drawRect(0, 0, 20, 10)
            .endFill())
        .setPadding(8, 8, 8, 8);

    // Add rounded button in center
    const mockButton = new PUXI.Button({
        text: 'Hello world!',
        background: 0xffaabb,
    })
        .setLayoutOptions(new PUXI.FastLayoutOptions(
            PUXI.LayoutOptions.WRAP_CONTENT,
            PUXI.LayoutOptions.WRAP_CONTENT,
            0.5,
            0.5,
            PUXI.FastLayoutOptions.CENTER_ANCHOR,
        ))
        .setElevation(2);

    // Text input at bottom
    const mockInput = new PUXI.TextInput({
        multiLine: false,
        background: 0xfabcdf,
        style: new PIXI.TextStyle({ height: 12, lineHeight: 20 }),
    }).setLayoutOptions(
        new PUXI.FastLayoutOptions(
            0.999999, // FILL_PARENT :(, 0.999999 :>
            0.05,
            0,
            0.95,
        ),
    );

    mockInput.on('focus', () => { console.log('TextInput focused!'); }); // eslint-disable-line no-console
    mockInput.on('blur', () => { console.log('TextInput blur'); }); // eslint-disable-line no-console
    mockInput.on('keydown', () => { console.log('TextInput keydowned!'); }); // eslint-disable-line no-console

    // Showcase scrolling widget
    const mockScroll = new PUXI.ScrollWidget({
        scrollY: true,
    }).setLayoutOptions(
        new PUXI.FastLayoutOptions(
            0.5,
            0.25,
            0.5,
            0.7,
            PUXI.FastLayoutOptions.CENTER_ANCHOR,
        ),
    ).setBackground(0xffaabb)
        .setBackgroundAlpha(0.5)
        .addChild(new PUXI.Button({ text: 'Button 1' }))
        .addChild(new PUXI.Button({ text: 'Button 2' }).setLayoutOptions(new PUXI.FastLayoutOptions(undefined, undefined, 0, 50)))
        .setElevation(4);

    // Add a checkbox top-right corner
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
    uxStage.addChild(mockScroll);

    const stageBackground = new PIXI.Sprite.from('./bg.png');

    stageBackground.filters = [
        new PIXI.filters.BlurFilter(11),
    ];

    uxStage.setBackground(stageBackground);

    app.stage.addChild(uxStage);

    window.app = app;
    window.stage = uxStage;

    window.mockTitle = mockTitle;
    window.mockButton = mockButton;
    window.mockTextInput = mockInput;
    window.mockCheckbox = mockCheckbox;
    window.mockScroll = mockScroll;
};
