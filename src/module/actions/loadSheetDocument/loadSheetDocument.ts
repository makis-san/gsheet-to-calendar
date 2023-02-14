import googleSheet from '../../../actions/googleSheet';
import { log } from '../../../utils';
import { fetchEvents } from '../fetchEvents/fetchEvents';

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
    fetchEvents: fetchEvents.bind(undefined, document, undefined)
  };
};
