import { parse, format } from 'date-fns';
import locale from 'date-fns/locale/pt-BR';
import _export from '../../export';
import chalk from 'chalk';
import { getColumnRange } from './utils/columnRange';
import { FetchEventsFN, FetchEventsFNOptions } from './fetchEvents.types';

const calendarArray: EventTypes[] = [];

export const defaultFetchOptions: FetchEventsFNOptions = {
  dateFormat: `d 'de' MMMM`,
  startColumn: 'A',
  locale: 'ptBR'
};

export const fetchEvents: FetchEventsFN = async (props) => {
  const { callback, document, options = defaultFetchOptions, sheetId } = props;

  const sheet =
    sheetId && sheetId !== '' && document.sheetsById[sheetId]
      ? document.sheetsById[sheetId]
      : document.sheetsByIndex.at(-1);

  if (((sheetId && !document.sheetsById[sheetId]) || sheetId === '') && sheet) {
    callback(
      `Sheet id ${chalk.bold(sheetId)} not found, using ${chalk.bold(
        sheet.sheetId
      )} instead`,
      'warn'
    );
  }

  if (!sheet) {
    callback(`Unable to locate sheet`);
    return;
  }

  await sheet.loadCells(`${options.startColumn}1:Z34`);

  const columnsToFetchData = ['', ''];
  const rowRange = sheet.rowCount || 34;

  const columnRange = getColumnRange([
    options.startColumn,
    sheet.lastColumnLetter
  ]);

  // deprecated
  [...Array(rowRange)].forEach((_, row) =>
    columnRange.forEach((col, colIndex) => {
      const cellA1 = `${col}${row + 1}`;
      const nearCellA1 =
        colIndex !== columnRange.length - 1
          ? `${columnRange[colIndex + 1]}${row + 1}`
          : undefined;

      const cell = sheet.getCellByA1(cellA1);
      const nearCell = nearCellA1 ? sheet.getCellByA1(nearCellA1) : undefined;

      if (
        cell &&
        cell.value === 'Data' &&
        nearCellA1 &&
        nearCell?.value === 'Atividade'
      ) {
        columnsToFetchData.splice(0, 2, cellA1, nearCellA1);
      }
    })
  );

  const [dateA1, titleA1] = columnsToFetchData;

  const dateStart = Number(dateA1.slice(1, dateA1.length)) + 1;
  const rowsToTheEnd = rowRange - dateStart;

  const events: EventTypes[] = calendarArray;

  [...Array(rowsToTheEnd)].forEach((_, index) => {
    const { value: dateValue } = sheet.getCellByA1(
      `${dateA1.slice(0, 1)}${index + dateStart}`
    );

    if (dateValue) {
      const dates = dateValue.toString().match(/(\d+)(?:\.(\d{1,2}))?/gm);

      const title = sheet
        .getCellByA1(`${titleA1.slice(0, 1)}${index + dateStart}`)
        .value.toString();

      if (!dates) return;

      const parsedEvents = dates.map((dateString) => {
        const date = parse(
          dateValue.toString().replace(/.*[0-9]/gm, `${dateString}`),
          options.dateFormat,
          new Date(),
          {
            locale: locale
          }
        );

        date.setHours(0, 0, 0, 0);
        return {
          date,
          title: `${title} - ${format(date, 'dMY')}`
        };
      });

      parsedEvents.forEach((event) => events.push(event));
    }
  });

  return { events, calendarTitle: sheet.title };
};

export default fetchEvents;
