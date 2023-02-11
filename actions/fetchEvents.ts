import { GoogleSpreadsheet } from 'google-spreadsheet';
import { parse, format } from 'date-fns';
import ptBrLocale from 'date-fns/locale/pt-BR';
import _export from '../export';
import chalk from 'chalk';
import { log } from '../utils';

require('dotenv').config();

const colRange = ['A', 'B', 'C', 'D', 'E'];
const rowRange = 34;
const calendarArray = [];

export const fetchEvents: FetchEventsFN = async (callback, docId, sheetId) => {
  const doc = new GoogleSpreadsheet(docId);

  doc.useApiKey(process.env.DOC_API_KEY || '');

  await doc.loadInfo().catch((error) => {
    if (error) {
      callback(`Unable to locate document ${chalk.bold(docId)}`);
      process.exit(1);
    }
  });

  console.log(
    sheetId && sheetId !== '' && doc.sheetsById[sheetId]
      ? 'badongas'
      : 'badingas'
  );
  const sheet =
    sheetId && sheetId !== '' && doc.sheetsById[sheetId]
      ? doc.sheetsById[sheetId]
      : doc.sheetsByIndex.at(-1);

  if (((sheetId && !doc.sheetsById[sheetId]) || sheetId === '') && sheet) {
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

  await sheet.loadCells('A1:E34');

  const columnsToFetchData = ['', ''];

  [...Array(rowRange)].forEach((_, row) =>
    colRange.forEach((col, colIndex) => {
      const cellA1 = `${col}${row + 1}`;
      const nearCellA1 =
        colIndex !== colRange.length - 1
          ? `${colRange[colIndex + 1]}${row + 1}`
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
          "d 'de' MMMM",
          new Date(),
          {
            locale: ptBrLocale
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
