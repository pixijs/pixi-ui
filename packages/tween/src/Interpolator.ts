/**
 * Interpolation modes that can be used in tweening.
 *
 * @memberof PUXI.tween
 * @enum
 * @property {number} LINEAR
 * @property {number} EASE_IN
 * @property {number} EASE_OUT
 * @property {number} EASE_BOTH
 */
export enum InterpolatorModes
{
    LINEAR = 1,
    EASE_IN = 2,
    EASE_OUT = 3,
    EASE_BOTH = 4
}

export interface Interpolator<T>
{
    linear(start: T, end: T, t: number, into?: T): T;
    easeIn(start: T, end: T, t: number, into?: T): T;
    easeOut(start: T, end: T, t: number, into?: T): T;
    easeBoth(start: T, end: T, t: number, into?: T): T;
}

export type Erp<T> = (start: T, end: T, t: number, into?: T) => T;

/**
 * An interpolator can calculated an interpolated value between a start and
 * end value.
 *
 * @memberof PUXI.tween
 * @interface Interpolator
 * @template T
 */

/**
 * Linearly interpolates the start and end value.
 *
 * @memberof PUXI.Interpolator#
 * @method linear
 * @param {T} start
 * @param {T} end
 * @param {number} t - fraction
 * @param {T}[into] - the object to store the result in
 */

/**
 * Interpolates the start & end value with an ease-in quadratic curve.
 *
 * @memberof PUXI.Interpolator#
 * @method easeIn
 * @param {T} start
 * @param {T} end
 * @param {number} t - fraction
 * @param {T}[into] - the object to store the result in
 */

/**
 * Interpolates the start & end value with an ease-out quadratic curve.
 *
 * @memberof PUXI.Interpolator#
 * @method easeOut
 * @param {T} start
 * @param {T} end
 * @param {number} t - fraction
 * @param {T}[into] - the object to store the result in
 */

/**
 * Interpolates the start & end value with a quadratic curve that is both ease-in
 * and ease-out.
 *
 * @memberof PUXI.Interpolator#
 * @method easeBoth
 * @param {T} start
 * @param {T} end
 * @param {number} t - fraction
* @param {T}[into] - the object to store the result in
 */

