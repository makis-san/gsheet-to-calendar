import googleSheet from '../../../actions/googleSheet';
import { log } from '../../../utils';
import { fetchEvents } from '../fetchEvents/fetchEvents';
import { LoadSheetDocumentFN } from './loadSheetDocument.types';

export const loadSheetDocument: LoadSheetDocumentFN = async (props) => {
  const { url } = props;

  const docId = url
    .replace('https://docs.google.com/spreadsheets/', '')
    .split('/')[1];

  const document = await googleSheet.loadDocument(docId, (msg) =>
    log.error(msg)
  );

  if (!document) return;

  return {
    document,
    sheetList: googleSheet.getSheets(document),
    fetchEvents: fetchEvents.bind(undefined, { document })
  };
};

export * from './loadSheetDocument.types';
