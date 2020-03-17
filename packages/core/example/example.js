/* global PIXI, PUXI */
/* eslint-disable no-console */

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
        text: 'Drag me!',
        background: 0xffaabb,
    })
        .setLayoutOptions(new PUXI.FastLayoutOptions(
            PUXI.LayoutOptions.WRAP_CONTENT,
            PUXI.LayoutOptions.WRAP_CONTENT,
            0.5,
            0.5,
            PUXI.FastLayoutOptions.CENTER_ANCHOR,
        ))
        .setElevation(2)
        .makeDraggable();

    mockButton.on('draggablestart', () => { console.log('Button drag started'); });
    mockButton.on('draggablemove', () => { console.log('Button drag moved.'); });
    mockButton.on('draggableend', () => { console.log('Button drag ended'); });

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

    mockInput.addChild(
        new PUXI.TextWidget('Type something!').setLayoutOptions(
            new PUXI.FastLayoutOptions(
                0.1,
                1,
                0.5,
                0,
            ),
        ),
    );

    mockInput.on('focus', () => { console.log('TextInput focused!'); });
    mockInput.on('blur', () => { console.log('TextInput blur'); });
    mockInput.on('keydown', () => { console.log('TextInput keydowned!'); });

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
        .addChild(new PUXI.Button({ text: 'Button 1' }).setBackground(0xff))
        .addChild(new PUXI.Button({ text: 'Button 2' })
            .setLayoutOptions(new PUXI.FastLayoutOptions(undefined, undefined, 0, 50))
            .setBackground(0xff))
        .setElevation(4);

    // Add a checkbox top-right corner
    const mockCheckbox = new PUXI.CheckBox({
        checked: true,
        checkGroup: 'demogroup',
        background: generateBackgroundGraphics(30, 30),
        checkmark: generateBackgroundGraphics(10, 10, 0xff),
    }).setLayoutOptions(
        new PUXI.FastLayoutOptions(
            0.1, 0.1, 0.9, 0,
        ),
    );

    const mockCheckbox2 = new PUXI.CheckBox({
        checked: false,
        checkGroup: 'demogroup',
        background: generateBackgroundGraphics(30, 30),
        checkmark: generateBackgroundGraphics(10, 10, 0xff),
    }).setLayoutOptions(
        new PUXI.FastLayoutOptions(
            0.1, 0.1, 0.8, 0,
        ),
    );

    const mockCheckbox3 = new PUXI.CheckBox({
        checked: false,
        checkGroup: 'demogroup',
        background: generateBackgroundGraphics(30, 30),
        checkmark: generateBackgroundGraphics(10, 10, 0xff),
    }).setLayoutOptions(
        new PUXI.FastLayoutOptions(
            0.1, 0.1, 0.7, 0,
        ),
    );

    mockCheckbox.on('hover', () => { console.log('Checkbox hovered!'); });
    mockCheckbox.on('click', () => { console.log('Checkbox clicked'); });
    mockCheckbox.on('changed', (checked) => { console.log(`Checkbox checked?: ${checked}`); });

    uxStage.addChild(mockTitle);
    uxStage.addChild(mockButton);
    uxStage.addChild(mockInput);
    uxStage.addChild(mockCheckbox);
    uxStage.addChild(mockCheckbox2);
    uxStage.addChild(mockCheckbox3);
    uxStage.addChild(mockScroll);

    uxStage.focusController.on('focusChanged', (next, prev) =>
    {
        if (next)
        {
            next.setBackground(0xddeeff);
        }

        if (prev)
        {
            prev.setBackground(0xfabcdf);
        }
    });

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
