import { GoogleSpreadsheet } from 'google-spreadsheet';
import {
  FetchEventsProps,
  FetchEventsReturn
} from '../fetchEvents/fetchEvents.types';

export interface LoadSheetDocumentProps {
  url: string;
}

export type LoadSheetDocumentReturn = Promise<
  | {
      document: GoogleSpreadsheet;
      sheetList: {
        name: string;
        value: string;
      }[];
      fetchEvents: (
        props: Pick<FetchEventsProps, 'document'>
      ) => FetchEventsReturn;
    }
  | undefined
>;

export type LoadSheetDocumentFN = (
  props: LoadSheetDocumentProps
) => LoadSheetDocumentReturn;
