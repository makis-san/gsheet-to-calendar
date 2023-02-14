import { GoogleSpreadsheet } from 'google-spreadsheet';
import { defaultFetchOptions } from './actions/fetchEvents/fetchEvents';
import { FetchEventsFNOptions } from './actions/fetchEvents/fetchEvents.types';
import { getColumnRange } from './actions/fetchEvents/utils/columnRange';
import parseEvents from './actions/fetchEvents/utils/parseEvents/parseEvents';
import googleSheet from './actions/googleSheet';
import generateCalendar from './export/google/generateCalendar';
import { getOAuthClient } from './export/google/getOAuthClient';
import saveEvents from './export/google/saveEvents';
import { log } from './utils';

export interface SaveToGoogleProps {
  calendarTitle: string;
  accessToken: string;
  events: EventTypes[];
}

type BindedSaveToGoogleFN = (
  props: Omit<SaveToGoogleProps, 'calendarTitle' | 'events'>
) => Promise<void>;

export const saveToGoogle = async (props: {
  calendarTitle: string;
  accessToken: string;
  events: EventTypes[];
}) => {
  const { accessToken, calendarTitle, events } = props;
  const OAuthClient = getOAuthClient(accessToken);

  const calendarId = await generateCalendar(calendarTitle, OAuthClient);

  if (!calendarId) {
    log.error(`Unable to create calendar id`);
    return;
  }

  saveEvents(calendarId, events, OAuthClient);
};

interface FetchEventsProps {
  document: GoogleSpreadsheet;
  sheetId?: string;
  options?: FetchEventsFNOptions & { debug?: boolean };
}

export type FetchEventsReturnTypes = Promise<
  | {
      events: EventTypes[];
      calendarTitle: string;
      saveToGoogle: BindedSaveToGoogleFN;
    }
  | undefined
>;

export const fetchEvents = async (props: {
  document: GoogleSpreadsheet;
  sheetId?: string;
  options?: FetchEventsFNOptions & { debug?: boolean };
}) => {
  const {
    document,
    options = { ...defaultFetchOptions, debug: false },
    sheetId
  } = props;

  const sheet =
    sheetId && sheetId !== '' && document.sheetsById[sheetId]
      ? document.sheetsById[sheetId]
      : document.sheetsByIndex.at(-1);

  if (((sheetId && !document.sheetsById[sheetId]) || sheetId === '') && sheet) {
    return undefined;
  }

  if (!sheet) {
    log.error(`Unable to locate sheet`);
    return;
  }

  const rowRange = sheet.rowCount || 34;

  await sheet.loadCells(`${options?.startColumn || 'A'}1:${rowRange}`);

  const columnsToFetchData = [
    options?.dateStringColumn,
    options?.titleStringColumn
  ];

  const columnRange = getColumnRange([
    options?.startColumn || 'A',
    sheet.lastColumnLetter
  ]);

  let events: EventTypes[] = [];

  if (!columnsToFetchData[0] && !columnsToFetchData[1]) {
    events = await parseEvents.byRead(sheet, rowRange, columnRange, options);
  } else {
    events = parseEvents.byDefinedColumns(sheet, rowRange, options);
  }

  if (events.length <= 0) {
    log.error('Unable to find any events in this document.');
    process.exit(1);
  }

  if (options.debug) {
    log.info((chalk) => `Loaded ${chalk.bold(events.length)} events!`);
  }

  return {
    events,
    saveToGoogle: saveToGoogle.bind({
      calendarTitle: document.title,
      events
    }) as (
      props: Omit<SaveToGoogleProps, 'calendarTitle' | 'events'>
    ) => Promise<void>,
    calendarTitle: sheet.title
  };
};

export const loadSheetDocument = async (props: { url: string }) => {
  const { url } = props;

  const docId = url
    .replace('https://docs.google.com/spreadsheets/', '')
    .split('/')[1];

  const document = await googleSheet.loadDocument(docId, (msg) =>
    log.error(msg)
  );

  return {
    document,
    sheetList: googleSheet.getSheets(document),
    fetchEvents: fetchEvents.bind({ document }) as (
      props: Omit<FetchEventsProps, 'document'>
    ) => FetchEventsReturnTypes
  };
};

export { googleSheet };
