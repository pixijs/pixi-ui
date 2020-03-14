/**
 * @namespace PUXI
 * @enum
 */
export enum MeasureMode
{
    UNBOUNDED = 0,
    EXACTLY = 1,
    AT_MOST = 2
}

/**
 * Any renderable entity that can be used in a widget hierarchy must be
 * measurable.
 */
export interface IMeasurable
{
    /**
     * Measures its width & height based on the passed constraints.
     *
     * @param maxWidth
     * @param maxHeight
     * @param widthMode
     * @param heightMode
     */
    onMeasure(maxWidth: number, maxHeight: number, widthMode: MeasureMode, heightMode: MeasureMode);

    getMeasuredWidth(): number;

    getMeasuredHeight(): number;
}
