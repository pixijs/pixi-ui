import { Menu } from './Menu';
import { WidgetGroup } from './WidgetGroup';
import { LinearLayout } from './layout-manager';
import { ImageWidget } from './Sprite';
import { TextWidget } from './TextWidget';
import { MenuItem } from './MenuItem';
import { LayoutOptions } from './layout-options';
import { Style } from './Style';

/**
 * @internal
 */
class PopupMenuItem extends WidgetGroup
{
    private icon: ImageWidget;
    private label: TextWidget;

    constructor(menu: MenuItem)
    {
        super();

        this.useLayout(new LinearLayout('horizontal'));

        this.icon = new ImageWidget(menu.icon instanceof PIXI.Texture ? menu.icon : PIXI.Texture.from(menu.icon));
        this.label = new TextWidget(menu.label);

        this.icon.setLayoutOptions(new LayoutOptions(24, 24));

        this.addChild(this.icon);
        this.addChild(this.label);
    }

    protected onStyleChange(style: Style): void
    {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        this.icon.onStyleChange(style);

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        this.label.onStyleChange(style);
    }
}

/**
 * @internal
 */
export class PopupMenu extends WidgetGroup
{
    menu: Menu;

    private menuItems: PopupMenuItem[];

    constructor(menu: Menu)
    {
        super();

        this.menu = menu;
        this.useLayout(new LinearLayout('vertical'));

        this.menuItems = menu.items.map((menuItem) =>
        {
            const widget = new PopupMenuItem(menuItem);

            this.addChild(widget);

            return widget;
        });

        this.setElevation(4);
    }
}
