import { Texture } from 'pixi.js';

export class MenuItem
{
    icon: string | Texture;
    label: string;

    constructor(data: {
        icon?: string | Texture;
        label?: string;
    })
    {
        this.icon = data.icon;
        this.label = data.label;
    }
}
