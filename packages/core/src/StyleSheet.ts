import { Style, StyleData } from './Style';

export class StyleSheet
{
    [id: string]: Style;

    static create(sheetData: { [id: string]: StyleData }): StyleSheet
    {
        const sheet = new StyleSheet();

        for (const key in sheetData)
        {
            sheet[key] = Style.create(sheetData[key]);
        }

        return sheet;
    }
}
