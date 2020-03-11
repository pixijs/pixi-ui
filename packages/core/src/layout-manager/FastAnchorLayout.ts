import { AnchorLayout } from './AnchorLayout';
import { MeasureMode } from '../IMeasurable';

export class FastAnchorLayout extends AnchorLayout
{
    onMeasure(maxWidth: number, maxHeight: number, widthMode: MeasureMode, heightMode: MeasureMode): void
    {
        super.onMeasure(maxWidth, maxHeight, MeasureMode.EXACTLY, MeasureMode.EXACTLY);
    }
}
