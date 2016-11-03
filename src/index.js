
var Library = {
    UI: require('./UI')
};

//dump everything into extras

Object.assign(PIXI, Library);

module.exports = Library;
