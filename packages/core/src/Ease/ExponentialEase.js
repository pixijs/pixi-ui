import { EaseBase } from './EaseBase';

function ExponentialEase(power, easeIn, easeOut)
{
    const pow = power;
    const t = easeIn && easeOut ? 3 : easeOut ? 1 : 2;

    this.getPosition = function (p)
    {
        let r = (t === 1) ? 1 - p : (t === 2) ? p : (p < 0.5) ? p * 2 : (1 - p) * 2;

        if (pow === 1)
        {
            r *= r;
        }
        else if (pow === 2)
        {
            r *= r * r;
        }
        else if (pow === 3)
        {
            r *= r * r * r;
        }
        else if (pow === 4)
        {
            r *= r * r * r * r;
        }

        return (t === 1) ? 1 - r : (t === 2) ? r : (p < 0.5) ? r / 2 : 1 - (r / 2);
    };
}

ExponentialEase.prototype = Object.create(EaseBase.prototype);
ExponentialEase.prototype.constructor = ExponentialEase;

export { ExponentialEase };

