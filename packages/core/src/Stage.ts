import { Widget } from './Widget';
import * as PIXI from 'pixi.js';

/**
 * A Stage for UIObjects
 *
 * @class
 * @extends PIXI.UI.Container
 * @memberof PIXI.UI
 * @param width {Number} Width of the Stage
 * @param height {Number} Height of the Stage
 */
export class Stage extends PIXI.Container
{
    __width: number;
    __height: number;
    minWidth: number;
    minHeight: number;
    initialized: boolean;
    UIChildren: Widget[];

    stage: any;

    constructor(width: number, height: number)
    {
        super();

        this.__width = width;
        this.__height = height;
        this.minWidth = 0;
        this.minHeight = 0;

        this.UIChildren = [];
        this.interactive = true;
        this.stage = this;
        this.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
        this.initialized = true;
        this.resize(width, height);
    }

    addChild(UIObject: Widget): void
    {
        const argumentLenght = arguments.length;

        if (argumentLenght > 1)
        {
            for (let i = 0; i < argumentLenght; i++)
            {
                this.addChild(arguments[i]);
            }
        }
        else
        {
            if (UIObject.parent)
            {
                UIObject.parent.removeChild(UIObject);
            }

            UIObject.parent = this;
            this.UIChildren.push(UIObject);
            super.addChild(UIObject.container);
            UIObject.updatesettings(true);
        }
    }

    removeChild(UIObject: Widget): void
    {
        const argumentLenght = arguments.length;

        if (argumentLenght > 1)
        {
            for (let i = 0; i < argumentLenght; i++)
            {
                this.removeChild(arguments[i]);
            }
        }
        else
        {
            super.removeChild(UIObject.container);

            const index = this.UIChildren.indexOf(UIObject);

            if (index !== -1)
            {
                this.children.splice(index, 1);
                UIObject.parent = null;
            }
        }
    }

    resize(width?: number, height?: number): void
    {
        if (!isNaN(height)) this.__height = height;
        if (!isNaN(width)) this.__width = width;

        if (this.minWidth || this.minHeight)
        {
            let rx = 1;
            let ry = 1;

            if (width && width < this.minWidth)
            {
                rx = this.minWidth / width;
            }

            if (height && height < this.minHeight)
            {
                ry = this.minHeight / height;
            }

            if (rx > ry && rx > 1)
            {
                this.scale.set(1 / rx);
                this.__height *= rx;
                this.__width *= rx;
            }
            else if (ry > 1)
            {
                this.scale.set(1 / ry);
                this.__width *= ry;
                this.__height *= ry;
            }
            else if (this.scale.x !== 1)
            {
                this.scale.set(1);
            }
        }

        if (this.hitArea)
        {
            this.hitArea.width = this.__width;
            this.hitArea.height = this.__height;
        }

        for (let i = 0; i < this.UIChildren.length; i++)
        {
            this.UIChildren[i].updatesettings(true, false);
        }
    }

    get _width(): number
    {
        return this.__width;
    }
    set _width(val: number)
    {
        if (!isNaN(val))
        {
            this.__width = val;
            this.resize();
        }
    }

    get _height(): number
    {
        return this.__height;
    }
    set _height(val: number)
    {
        if (!isNaN(val))
        {
            this.__height = val;
            this.resize();
        }
    }
}
