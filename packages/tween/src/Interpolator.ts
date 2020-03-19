import * as PIXI from 'pixi.js';

export type Erp<T> = (startValue: T, endValue: T, t: number, observedValue?: T) => T;

/**
 * Defines a (linear) interpolator on a type `T`.
 *
 * @memberof PUXI
 * @typedef {Function} Erp
 * @template T
 * @param {T} startValue
 * @param {T} endValue
 * @param {number} t - interpolation parameter between 0 and 1
 * @param {T}[observedValue]
 */

/**
 * Interpolation function for number properties like alpha, rotation, component
 * position/scale/skew, elevation, etc.
 *
 * @memberof PUXI
 * @extends PUXI.Erp<number>
 * @param {number} startValue
 * @param {number} endValue
 * @param {number} t
 */
export const NumberErp: Erp<number> = (startValue: number, endValue: number, t: number) =>
    ((1 - t) * startValue) + (t * endValue);

/**
 * Interpolation function for 2D vector properties like position, scale, skew, etc.
 *
 * @memberof PUXI
 * @extends PUXI.Erp<PIXI.Point>
 * @param {PIXI.Point} startValue
 * @param {PIXI.Point} endValue
 * @param {number} t
 * @param {PIXI.Point} observedValue
 */
export const PointErp: Erp<PIXI.Point> = (
    startValue: PIXI.Point,
    endValue: PIXI.Point,
    t: number,
    observedValue: PIXI.Point,
): PIXI.Point =>
{
    if (!observedValue)
    {
        observedValue = new PIXI.Point();
    }

    observedValue.x = ((1 - t) * startValue.x) + (t * endValue.x);
    observedValue.y = ((1 - t) * startValue.y) + (t * endValue.y);

    return observedValue;
};

