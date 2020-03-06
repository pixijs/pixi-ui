export const Helpers = {
    Lerp(start: number, stop: number, amt: number): number
    {
        if (amt > 1) amt = 1;
        else if (amt < 0) amt = 0;

        return start + (stop - start) * amt;
    },
    Round(number: number, decimals: number): number
    {
        const pow = Math.pow(10, decimals);

        return Math.round(number * pow) / pow;
    },
    componentToHex(c: any): string
    {
        const hex = c.toString(16);

        return hex.length == 1 ? `0${hex}` : hex;
    },
    rgbToHex(r: number, g: number, b: number): string
    {
        return `#${this.componentToHex(r)}${this.componentToHex(g)}${this.componentToHex(b)}`;
    },
    rgbToNumber(r: number, g: number, b: number): number
    {
        return r * 65536 + g * 256 + b;
    },
    numberToRgb(c: number): any
    {
        return {
            r: Math.floor(c / (256 * 256)),
            g: Math.floor(c / 256) % 256,
            b: c % 256,
        };
    },
    hexToRgb(hex: any): any
    {
        if (hex === null)
        {
            hex = 0xffffff;
        }
        if (!isNaN(hex))
        {
            return this.numberToRgb(hex);
        }

        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

        hex = hex.replace(shorthandRegex, function (m, r, g, b)
        {
            return r + r + g + g + b + b;
        });

        const result = (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(hex);

        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        } : null;
    },
};
