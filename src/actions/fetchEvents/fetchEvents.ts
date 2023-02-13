import _export from '../../export';
import chalk from 'chalk';
import { getColumnRange } from './utils/columnRange';
import { FetchEventsFN, FetchEventsFNOptions } from './fetchEvents.types';
import parseEvents from './utils/parseEvents/parseEvents';

export const defaultFetchOptions: FetchEventsFNOptions = {
  dateFormat: `d 'de' MMMM`,
  startColumn: 'A',
  locale: 'ptBR'
};

export const fetchEvents: FetchEventsFN = async (props) => {
  const { callback, document, options: fnOptions, sheetId } = props;

  const options = {
    ...fnOptions,
    dateFormat: fnOptions?.dateFormat || defaultFetchOptions.dateFormat,
    startColumn: fnOptions?.startColumn || defaultFetchOptions.startColumn,
    locale: fnOptions?.locale || defaultFetchOptions.locale
  };

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

  const rowRange = sheet.rowCount || 34;

  await sheet.loadCells(`${options.startColumn}1:${rowRange}`);

  const columnsToFetchData = [
    options.dateStringColumn,
    options.titleStringColumn
  ];

  const columnRange = getColumnRange([
    options.startColumn,
    sheet.lastColumnLetter
  ]);

  let events: EventTypes[] = [];

  if (!columnsToFetchData[0] && !columnsToFetchData[1]) {
    events = await parseEvents.byRead(sheet, rowRange, columnRange, options);
  } else {
    events = parseEvents.byDefinedColumns(sheet, rowRange, options);
  }

  if (events.length <= 0) {
    callback('Unable to find any events in this document.');
    process.exit(1);
  }

  callback(`Loaded ${chalk.bold(events.length)} events!`, 'info');

  return { events, calendarTitle: sheet.title };
};

export default fetchEvents;
