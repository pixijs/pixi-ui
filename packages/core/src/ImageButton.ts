import { IButtonOptions, Button } from './Button';
import { ImageWidget } from './Sprite';
import { Texture } from '@pixi/core';
import { LinearLayout } from './layout-manager';

export interface IImageButtonOptions extends IButtonOptions
{
    icon: string | Texture | ImageWidget;
}

export class ImageButton extends Button
{
    iconWidget: ImageWidget;

    constructor(options: IImageButtonOptions)
    {
        super(options);

        if (!(options.icon instanceof ImageWidget))
        {
            const texture = options.icon instanceof Texture ? options.icon
                : Texture.from(options.icon);

            options.icon = new ImageWidget(texture);
        }

        this.textWidget.setLayoutOptions(null);// a little redundant maybe?
        this.iconWidget = options.icon;

        this.removeChild(this.textWidget);
        this.addChild(this.iconWidget);
        this.addChild(this.textWidget);

        this.useLayout(new LinearLayout('vertical'));
    }
}
