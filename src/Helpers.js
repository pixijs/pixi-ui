var Helpers = {
    Lerp: function (start, stop, amt) {
        if (amt > 1) amt = 1;
        else if (amt < 0) amt = 0;
        return start + (stop - start) * amt;
    },
    Round: function(number, decimals) {
        var pow = Math.pow(10, decimals);
        return Math.round(number * pow) / pow;
    },
    componentToHex: function(c) {
       var hex = c.toString(16);
       return hex.length == 1 ? "0" + hex : hex;
    },
    rgbToHex: function(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    },
    rgbToNumber: function (r, g, b) {
        return r * 65536 + g * 256 + b;
    },
    numberToRgb: function (c) {
        return {
            r: Math.floor(c / (256 * 256)),
            g: Math.floor(c / 256) % 256,
            b: c % 256,
        };
    },
    hexToRgb: function (hex) {
        if (!isNaN(hex)) return this.numberToRgb(hex);

        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
};

module.exports = Helpers;