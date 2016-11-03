var UI = {
    UISettings: require('./UISettings'),
    UIBase: require('./UIBase'),
    Container: require('./Container'),
    SliceSprite: require('./SliceSprite'),
    Text: require('./Text')
};

//dump everything into extras

Object.assign(PIXI, UI);

module.exports = UI;
