import { Style, StyleData } from './Style';

export class StyleSheet
{
    [id: string]: Style;

    static create(sheetData: { [id: string]: StyleData }): StyleSheet
    {
        const sheet = new StyleSheet();

        for (const key in sheet)
        {
            sheet[key] = Style.create(sheetData[key]);
        }

        return sheet;
    }
}
