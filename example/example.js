/* global PIXI, PUXI */
/* eslint-disable no-console */

const checkBoxBackground = new PIXI.Graphics()
    .beginFill(0xff00cc, 0.8)
    .drawCircle(16, 16, 16)
    .endFill()
    .beginFill(0xffffff, 1)
    .drawCircle(16, 16, 12)
    .endFill();
const checkBoxFocusedBackground = new PIXI.Graphics()
    .beginFill(0xacdefb, 0.8)
    .drawCircle(16, 16, 16)
    .endFill()
    .beginFill(0xffffff, 1)
    .drawCircle(16, 16, 12)
    .endFill();
const checkGraphic = new PIXI.Graphics()
    .beginFill(0xff1111)
    .drawCircle(8, 8, 8)
    .endFill();

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
        resolution: 2,
        autoDensity: true,
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
        background: checkBoxBackground.clone(),
        checkmark: checkGraphic.clone(),
    }).setLayoutOptions(
        new PUXI.FastLayoutOptions(32, 32, 0.9, 0),
    );

    const mockCheckbox2 = new PUXI.CheckBox({
        checked: false,
        checkGroup: 'demogroup',
        background: checkBoxBackground.clone(),
        checkmark: checkGraphic.clone(),
    }).setLayoutOptions(
        new PUXI.FastLayoutOptions(32, 32, 0.8, 0),
    );

    const mockCheckbox3 = new PUXI.CheckBox({
        checked: false,
        checkGroup: 'demogroup',
        background: checkBoxBackground.clone(),
        checkmark: checkGraphic.clone(),
    }).setLayoutOptions(
        new PUXI.FastLayoutOptions(32, 32, 0.7, 0),
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
            if (next.checkGroup === 'demogroup')
            {
                next.setBackground(checkBoxFocusedBackground.clone());
            }
            else
            {
                next.setBackground(0xddeeff);
            }
        }

        if (prev)
        {
            if (prev.checkGroup === 'demogroup')
            {
                prev.setBackground(checkBoxBackground.clone());
            }
            else
            {
                prev.setBackground(0xfabcdf);
            }
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
    window.mockCheckbox2 = mockCheckbox2;
    window.mockCheckbox3 = mockCheckbox3;
    window.mockScroll = mockScroll;

    const tmgr = new PUXI.tween.TweenManager();

    tmgr.tween(
        new PIXI.Point(0, 0),
        new PIXI.Point(100, 100),
        500,
        PUXI.tween.PointErp,
        PUXI.tween.EaseBoth,
    ).target(
        mockButton.insetContainer,
        'position',
    );
};
