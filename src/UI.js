var UI = {
    Stage: require('./Stage'),
    Container: require('./Container'),
    ScrollingContainer: require('./ScrollingContainer'),
    SortableList: require('./SortableList'),
    Sprite: require('./Sprite'),
    TilingSprite: require('./TilingSprite'),
    SliceSprite: require('./SliceSprite'),
    Slider: require('./Slider'),
    ScrollBar: require('./ScrollBar'),
    Text: require('./Text'),
    DynamicText: require('./DynamicText/DynamicText'),
    DynamicTextStyle: require('./DynamicText/DynamicTextStyle'),
    TextInput: require('./TextInput'),
    Button: require('./Button'),
    CheckBox: require('./CheckBox'),
    MathHelper: require('./MathHelper'),
    Tween: require('./Tween'),
    Ease: require('./Ease/Ease'),
    Interaction: require('./Interaction/Interaction'),
    Ticker: require('./Ticker').shared,
};


module.exports = UI;