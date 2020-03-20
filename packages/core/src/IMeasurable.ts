/**
 * These are the modes in which an entity can measures its dimension. They are
 * relevant when a layout needs to know the optimal sizes of its children.
 *
 * @memberof PUXI
 * @enum
 * @property {number} UNBOUNDED - no upper limit on bounds. This should calculate the optimal dimensions for the entity.
 * @property {number} EXACTLY - the entity should set its dimension to the one passed to it.
 * @property {number} AT_MOST - the entity should find an optimal dimension below the one passed to it.
 */
export enum MeasureMode
{
    UNBOUNDED = 0,
    EXACTLY = 1,
    AT_MOST = 2
}

export interface IMeasurable
{
    onMeasure(maxWidth: number, maxHeight: number, widthMode: MeasureMode, heightMode: MeasureMode);
    getMeasuredWidth(): number;
    getMeasuredHeight(): number;
}

/**
 * Any renderable entity that can be used in a widget hierarchy must be
 * measurable.
 *
 * @memberof PUXI
 * @interface IMeasurable
 */

/**
 * Measures its width & height based on the passed constraints.
 *
 * @memberof PUXI.IMeasurable#
 * @method onMeasure
 * @param {number} maxWidth
 * @param {number} maxHeight
 * @param {PUXI.MeasureMode} widthMode
 * @param {PUXI.MeasureMode} heightMode
 */

/**
 * @memberof PUXI.IMeasurable#
 * @method getMeasuredWidth
 * @returns {number} - the measured width of the entity after a `onMeasure` call
 */

/**
 * @memberof PUXI.IMeasurable#
 * @method getMeasuredHeight
 * @returns {number} - the measured height of the entity after a `onMeasure` call
 */
