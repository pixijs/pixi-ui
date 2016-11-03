# pixi-picture

Quality renderer for sprites in pixi.js v4.

Reduces border artifacts.

Allows to use blendModes that are not available in pure webgl implementation, such as PIXI.BLEND_MODES.OVERLAY.

Please, don't add children to sprite if you use those blendModes.

Use PIXI.extras.PictureSprite instead of PIXI.Sprite, or call renderer.plugins.picture from your own Sprite implementation.

[Usage example](http://pixijs.github.io/examples/#/picture/overlay.js)

## How to build

```bash
npm install
gulp
```
