import _export, { exportMethods } from '../export';
import fetchEvents from './fetchEvents/fetchEvents';
import Enquirer from 'enquirer';
import googleSheet from './googleSheet';
import { CLIArguments } from '../cli';
import { LocaleKeyTypes } from './fetchEvents/fetchEvents.types';
import prompts from './prompts';
import { isSilent } from '../utils';
import { useSpinner } from '../utils/spinner/spinner';

const fetchSheetInformation = async (args?: {
  docId?: string;
  sheetId?: string;
}) => {
  const docId = args?.docId ? args.docId : (await prompts.getDocInfo()).docId;

  const spinner = useSpinner('Trying to fetch spreadsheet...');
  if (!isSilent) spinner.start();

  const document = await googleSheet.loadDocument(docId, (msg) => {
    spinner.text = msg;
    spinner.fail();
  });

  spinner.text = `Succesfully loaded ${document.title}`;
  spinner.succeed();

  const sheetId = args?.sheetId
    ? args.sheetId
    : await prompts.getSheetId(document);

  return {
    document,
    sheetId
  };
};

export default async (args: CLIArguments) => {
  args = await args;

  const { document, sheetId } = await fetchSheetInformation({
    docId: args.docId,
    sheetId: args.sheetId
  }).catch(() => process.exit(1));

  const spinner = useSpinner('Trying to fetch calendar...');

  if (!isSilent) spinner.start();

  const locale = `${args.locale.split('-')[0]}${
    args.locale.split('-')[1] ? args.locale.split('-')[1].toUpperCase() : ''
  }` as LocaleKeyTypes;

  const res = await fetchEvents({
    document,
    sheetId,
    callback: (error, type) => {
      spinner.text = error;
      if (!type) {
        spinner.fail();
        return;
      }
      spinner[type] && spinner[type](error);
    },
    options: {
      dateFormat: args?.dateFormat,
      dateStringColumn: args?.dateStringColumn,
      titleStringColumn: args?.titleStringColumn,
      locale
    }
  });

  if (!res) {
    process.exit();
  }

  spinner.stop();

  const select = await new Enquirer<{ values?: keyof typeof _export }>()
    .prompt({
      type: 'select',
      name: 'values',
      message: 'Select an export method',
      choices: exportMethods
    })
    .catch(() => ({ values: undefined }));

  const { calendarTitle, events } = res;

  if (!select.values) process.exit(1);

  _export[select.values](calendarTitle, events, locale);
};
