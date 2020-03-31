[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

# PuxiJS

This project was built to provide an user experience module that can be integrated with your
PixiJS application. It allows you to render your scene graph _with your user interface with very little overhead_.

## Usage

This project is work-in-progress and is not yet published. The following instructions are draft-only.

```js
npm install puxi.js
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
}).setLayoutOptions({
  new PUXI.FastLayoutOptions({
     width: PUXI.LayoutOptions.WRAP_CONTENT, // width
     height: 60, // height
     x: .5, y: .5, // x, y (center)
     anchor: PUXI.FastLayoutOptions.CENTER_ANCHOR // properly center
  })
}).setPadding(4, 6) // horizontal/vertical padding
    .setBackground(0xffaabb) // background color (can use a PIXI.Graphics too)
    .setBackgroundAlpha(.5) // alpha for background
    .setElevation(2) // drop-shadow on background!
);
```
