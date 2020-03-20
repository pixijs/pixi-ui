# `puxi.js`

```
npm install puxi.js
```

## Usage

```
import { Widget, tween } from 'puxi.js';

// do something

tween.TweenManager.tween(
  new PIXI.Point(0, 0),
  new PIXI.Point(20, 31),
  500,
  PUXI.tween.NumberInterpolator,
  PUXI.tween.EaseBoth
).target(
  widget,
  'position'
)
```