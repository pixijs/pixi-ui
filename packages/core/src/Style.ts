import * as PIXI from 'pixi.js';

export type StyleData = {
    [id: string]: any;
    backgroundColor?: string | number;
    background?: PIXI.Container;
    fontFamily?: string;
    fontSize?: number;
    paddingLeft?: number;
    paddingTop?: number;
    paddingRight?: number;
    paddingBottom?: number;
    padding?: number;

//    [':hover']?: StyleData;
//    [':focus']?: StyleData;
};

/**
 * A StyleSheet provides a mechansim to style widgets in a shared fashion.
 */
export class Style extends PIXI.utils.EventEmitter
{
    public dirtyID: number;

    private data: StyleData;
    private extends: Style[];

    private computedData: StyleData;
    private computedDirty: boolean;

    constructor(data: StyleData = {})
    {
        super();

        this.dirtyID = 0;

        this.data = data;
        this.extends = [];

        this.computedData = data;
        this.computedDirty = false;
    }

    /**
     * @param prop
     */
    getProperty(prop: string): any
    {
        if (this.computedDirty)
        {
            this.compute();
        }

        return this.computedData[prop];
    }

    /**
     * @param props
     * @example
     * style.getProperties('paddingLeft', 'paddingRight')
     */
    getProperties(...props: string[]): Record<string, any>
    {
        if (this.computedDirty)
        {
            this.compute();
        }

        const result = { };

        for (let i = 0, j = props.length; i < j; i++)
        {
            result[props[i]] = this.computedData[props[i]];
        }

        return result;
    }

    /**
     * @param prop
     * @param value
     */
    setProperty(prop: string, value: any): void
    {
        // Ensure computedData is up-to-date to ensure child styles get the correct information.
        if (this.computedDirty)
        {
            this.compute();
        }

        this.data[prop] = value;
        this.computedData[prop] = value;
        this.emit('setProperty', prop, value, this);

        ++this.dirtyID;
    }

    /**
     * Extend the given style so that properties not set on this style are derived from it. If multiple styles
     * are extended, the ones extended later have a higher priority.
     *
     * @param style
     */
    extend(style: Style): void
    {
        this.extends.push(style);
        this.computedDirty = true;

        ++this.dirtyID;

        // Recompute the set-property for this style
        style.on('setProperty', this.onParentSetProperty);
    }

    /**
     * Recomputes the style data
     */
    private compute(): void
    {
        const superStyles = this.extends;

        this.computedData = {};

        for (let i = 0, j = superStyles.length; i < j; i++)
        {
            Object.assign(this.computedData, superStyles[i].computedData);
        }

        this.computedDirty = false;
    }

    private onParentSetProperty = (propertyName: string, value: any, style: Style): void =>
    {
        const superStyles = this.extends;
        const superIndex = superStyles.indexOf(style);

        if (superIndex === -1)
        {
            throw new Error('onParentSetProperty triggered when by a non-super style.');
        }

        const thisValue = this.computedData[propertyName];

        for (let i = superIndex, j = superStyles.length; i < j; i++)
        {
            const superStyle = superStyles[i];

            if (superStyle.computedData[propertyName])
            {
                this.computedData[propertyName] = superStyle.computedData[propertyName];
            }
        }

        if (this.data[propertyName])
        {
            this.computedData[propertyName] = this.data[propertyName];
        }

        if (thisValue !== this.computedData[propertyName])
        {
            this.emit('setProperty', propertyName, this.computedData[propertyName], this);
        }
    };

    /**
     * @param data
     * @example
     * Style.create({
     *     backgroundColor: 0xabcdef,
     *     padding: 8
     * })
     */
    static create(data: StyleData): Style
    {
        return new Style(data);
    }
}
