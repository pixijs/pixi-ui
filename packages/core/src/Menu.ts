import { MenuItem } from './MenuItem';
import * as PIXI from 'pixi.js';

export class Menu extends PIXI.Runner
{
    items: MenuItem[];

    constructor(items: MenuItem[])
    {
        super('Menu');

        this.items = items || [];
    }
}
