# PuxiJS

This project was built to provide an user experience module that can be integrated with your
PixiJS application. It allows you to render your scene graph _with your user interface with very little overhead_.

## Usage

This project is work-in-progress and is not yet published. The following instructions are draft-only.

```js
npm install @puxi/core
```

```js
const app = new PIXI.Application({ <options> });

const uxStage = new PUXI.Stage({
  width: 512,
  height: 512;
});

app.stage.addChild(uxStage);

uxStage.addChild(new PUXI.Button({
  text: "Hello world!"
}));

uxStage.addChild(new PUXI.Text({
  value: "Click me!"
}));
```