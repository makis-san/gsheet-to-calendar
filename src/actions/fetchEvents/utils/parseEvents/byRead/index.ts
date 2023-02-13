import { format, parse } from 'date-fns';
import * as Locales from 'date-fns/locale';
import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { FetchEventsFNOptions } from '../../../fetchEvents.types';

export default async (
  sheet: GoogleSpreadsheetWorksheet,
  rowRange: number,
  columnRange: string[],
  options: FetchEventsFNOptions
) => {
  const events: EventTypes[] = [];

  columnRange.forEach((col, colIndex) =>
    [...Array(rowRange)].forEach((_, row) => {
      if (row === rowRange - 1) {
        return;
      }
      const cellA1 = `${col}${row + 1}`;
      const cell = sheet.getCellByA1(cellA1);

      if (!cell.value) return;

      const dates = cell.value.toString().match(/(\d+)(?:\.(\d{1,2}))?/gm);

      const nearA1 = `${columnRange[colIndex + 1]}${row + 1}`;
      const nearCell = sheet.getCellByA1(nearA1);

      if (!dates || !nearCell.value) return;

      const parsedEvents = dates.map((dateString) => {
        const date = parse(
          cell.value.toString().replace(/.*[0-9]/gm, `${dateString}`),
          options.dateFormat,
          new Date(),
          {
            locale: Locales[options.locale]
          }
        );

        date.setHours(0, 0, 0, 0);
        return {
          date,
          title: `${nearCell.value} - ${format(date, 'dMY')}`
        };
      });

      parsedEvents.forEach((event) => events.push(event));
    })
  );

  return events;
};
