function EaseBase()
{
    this.getPosition = function (p)
    {
        return p;
    };
}

EaseBase.prototype.constructor = EaseBase;

export { EaseBase };
