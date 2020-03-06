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

uxStage.addChild(mockButton);
uxStage.addChild(mockInput);
app.stage.addChild(uxStage);

window.app = app;
