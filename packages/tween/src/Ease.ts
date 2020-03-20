export type Ease = (t: number) => number;

/**
 * @memberof PUXI
 * @typedef {Function} Ease
 * @param {number} t - interpolation parameter (b/w 0 and 1) that increases linearly
 * @returns {numeber} - output interpolation parameter (b/w 0 and 1)
 */

/**
 * Quadratic ease-in
 *
 * @memberof PUXI
 * @type Ease
 * @param {number} t
 * @returns {number}
 */
export const EaseIn: Ease = (t: number) => t * t;

/**
 * Quadratic ease-out
 *
 * @memberof PUXI
 * @type Ease
 * @param {number} t
 * @returns {number}
 */
export const EaseOut: Ease = (t: number) => (1 - t) * (1 - t);

/**
 * Quadratic ease-in & ease-out mixed!
 *
 * @memberof PUXI
 * @type Ease
 * @param {number} t
 * @returns {number}
 */
export const EaseBoth: Ease = (t: number) => ((t <= 0.5)
    ? 2 * t * t
    : ((2 * ((t - 0.5) * (1.5 - t))) + 0.5));
