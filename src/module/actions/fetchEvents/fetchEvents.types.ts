import { GoogleSpreadsheet } from 'google-spreadsheet';
import { FetchEventsFNOptions } from '../../../actions/fetchEvents/fetchEvents.types';

export interface FetchEventsProps {
  document: GoogleSpreadsheet;
  props: {
    sheetId?: string;
    options?: FetchEventsFNOptions & { debug?: boolean };
  };
}
