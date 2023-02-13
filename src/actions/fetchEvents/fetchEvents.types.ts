import { GoogleSpreadsheet } from 'google-spreadsheet';

export interface FetchEventsFNOptions {
  dateFormat: string;
  startColumn: string;
  locale: string;
}

export type FetchEventsFN = (props: {
  document: GoogleSpreadsheet;
  callback: (error: string, type?: 'info' | 'warn') => void;
  sheetId?: string;
  options?: FetchEventsFNOptions;
}) => Promise<{ events: EventTypes[]; calendarTitle: string } | undefined>;
