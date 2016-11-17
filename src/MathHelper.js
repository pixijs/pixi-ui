var MathHelper = {
    Lerp: function (start, stop, amt) {
        if (amt > 1) amt = 1;
        else if (amt < 0) amt = 0;
        return start + (stop - start) * amt;
    },
    Round: function(number, decimals) {
        var pow = Math.pow(10, decimals);
        return Math.round(number * pow) / pow;
    }
};

module.exports = MathHelper;