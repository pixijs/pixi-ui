import { EaseBase } from './EaseBase';
import { ExponentialEase } from './ExponentialEase';

const Ease = {};

const HALF_PI = Math.PI * 0.5;

export function create(fn)
{
    const e = Object.create(EaseBase.prototype);

    e.getPosition = fn;

    return e;
}

const Linear = new EaseBase();

// Liear
Ease.Linear = Linear;

// Exponetial Eases
export function wrapEase(easeInFunction, easeOutFunction, easeInOutFunction)
{
    return {
        easeIn: easeInFunction,
        easeOut: easeOutFunction,
        easeInOut: easeInOutFunction,
    };
}

Ease.Power0 = {
    easeNone: Linear,
};

Ease.Power1 = Ease.Quad = wrapEase(
    new ExponentialEase(1, 1, 0),
    new ExponentialEase(1, 0, 1),
    new ExponentialEase(1, 1, 1));

Ease.Power2 = Ease.Cubic = wrapEase(
    new ExponentialEase(2, 1, 0),
    new ExponentialEase(2, 0, 1),
    new ExponentialEase(2, 1, 1));

Ease.Power3 = Ease.Quart = wrapEase(
    new ExponentialEase(3, 1, 0),
    new ExponentialEase(3, 0, 1),
    new ExponentialEase(3, 1, 1));

Ease.Power4 = Ease.Quint = wrapEase(
    new ExponentialEase(4, 1, 0),
    new ExponentialEase(4, 0, 1),
    new ExponentialEase(4, 1, 1));

// Bounce
Ease.Bounce = {
    BounceIn: create(function (p)
    {
        if ((p = 1 - p) < 1 / 2.75)
        {
            return 1 - (7.5625 * p * p);
        }
        else if (p < 2 / 2.75)
        {
            return 1 - (7.5625 * (p -= 1.5 / 2.75) * p + 0.75);
        }
        else if (p < 2.5 / 2.75)
        {
            return 1 - (7.5625 * (p -= 2.25 / 2.75) * p + 0.9375);
        }

        return 1 - (7.5625 * (p -= 2.625 / 2.75) * p + 0.984375);
    }),
    BounceOut: create(function (p)
    {
        if (p < 1 / 2.75)
        {
            return 7.5625 * p * p;
        }
        else if (p < 2 / 2.75)
        {
            return 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
        }
        else if (p < 2.5 / 2.75)
        {
            return 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
        }

        return 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
    }),
    BounceInOut: create(function (p)
    {
        const invert = (p < 0.5);

        if (invert)
        {
            p = 1 - (p * 2);
        }
        else
        {
            p = (p * 2) - 1;
        }
        if (p < 1 / 2.75)
        {
            p = 7.5625 * p * p;
        }
        else if (p < 2 / 2.75)
        {
            p = 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
        }
        else if (p < 2.5 / 2.75)
        {
            p = 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
        }
        else
        {
            p = 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
        }

        return invert ? (1 - p) * 0.5 : p * 0.5 + 0.5;
    }),
};

// Circ
Ease.Circ = {
    CircIn: create(function (p)
    {
        return -(Math.sqrt(1 - (p * p)) - 1);
    }),
    CircOut: create(function (p)
    {
        return Math.sqrt(1 - (p = p - 1) * p);
    }),
    CircInOut: create(function (p)
    {
        return ((p *= 2) < 1) ? -0.5 * (Math.sqrt(1 - p * p) - 1) : 0.5 * (Math.sqrt(1 - (p -= 2) * p) + 1);
    }),
};

// Expo
Ease.Expo = {
    ExpoIn: create(function (p)
    {
        return Math.pow(2, 10 * (p - 1)) - 0.001;
    }),
    ExpoOut: create(function (p)
    {
        return 1 - Math.pow(2, -10 * p);
    }),
    ExpoInOut: create(function (p)
    {
        return ((p *= 2) < 1) ? 0.5 * Math.pow(2, 10 * (p - 1)) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
    }),
};

// Sine
Ease.Sine = {
    SineIn: create(function (p)
    {
        return -Math.cos(p * HALF_PI) + 1;
    }),
    SineOut: create(function (p)
    {
        return Math.sin(p * HALF_PI);
    }),
    SineInOut: create(function (p)
    {
        return -0.5 * (Math.cos(Math.PI * p) - 1);
    }),
};

export { Ease };
