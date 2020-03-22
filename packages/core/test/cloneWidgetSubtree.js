const { Widget, WidgetGroup } = require('../lib/puxi-core.cjs');
const { Graphics } = require('pixi.js');

function cloneWidget(widget)
{
    let clone;

    // Create instance.
    if (widget instanceof WidgetGroup)
    {
        clone = new WidgetGroup();
    }
    else
    {
        clone = new Widget();
    }

    // Copy layout-manager.
    if (widget.layoutMgr)
    {
        clone.useLayout(new widget.layoutMgr.constructor());
    }

    // Copy content
    const naturalContentWidth = widget.contentContainer.width;
    const naturalContentHeight = widget.contentContainer.height;

    clone.contentContainer.addChild(
        new Graphics()
            .beginFill(0xffffff)
            .drawRect(0, 0, naturalContentWidth, naturalContentHeight)
            .endFill(),
    );

    // Copy layout-options.
    if (widget.layoutOptions)
    {
        clone.setLayoutOptions(new widget.layoutOptions.constructor({}));

        Object.assign(clone.layoutOptions, widget.layoutOptions);

        clone.layoutOptions.cache = {};// clear layout markers/cache
    }

    if (widget.background instanceof Graphics)
    {
        clone.setBackground(widget.background.clone());
    }

    clone.setPadding(widget.paddingLeft, widget.paddingTop, widget.paddingRight, widget.paddingBottom);
    clone.setElevation(widget.getElevation());

    return clone;
}

/**
 * Creates a clone of the widget and its subtree. It only copies layout
 * properties - layout-options and layout-managers.
 *
 * @param {PUXI.Widget} root - widget to copy
 * @returns {PUXI.Widget}
 */
function cloneWidgetSubtree(root)
{
    const cloneRoot = cloneWidget(root);

    for (let i = 0, j = root.widgetChildren.length; i < j; i++)
    {
        cloneRoot.addChild(cloneWidgetSubtree(root.widgetChildren[i]));
    }

    return cloneRoot;
}

module.exports = {
    cloneWidgetSubtree,
};
