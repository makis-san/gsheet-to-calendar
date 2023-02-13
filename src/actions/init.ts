import _export from '../export';
import cliSpinners from 'cli-spinners';
import ora from 'ora';
import fetchEvents from './fetchEvents/fetchEvents';
import Enquirer from 'enquirer';
import googleSheet from './googleSheet';
import { CLIArguments } from '../cli';
import { LocaleKeyTypes } from './fetchEvents/fetchEvents.types';

const initialPrompt = {
  type: 'input',
  message: 'Enter the google sheet document url',
  name: 'docUrl',
  hint: 'https://docs.google.com/spreadsheets/d/123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  required: true,
  validate: (string: string) =>
    string.includes('https://docs.google.com/spreadsheets')
};

const sheetIdPrompt = (choices: { value: string; name: string }[]) => ({
  type: 'select',
  message: 'Wich sheet you wanna read from?',
  name: 'sheetId',
  hint: `Default to ${choices[0].name}`,
  choices
});

const fetchSheetInformation = async () => {
  const qa = new Enquirer<{ docUrl: string }>();
  const { docUrl } = await qa.prompt(initialPrompt);

  const spinner = ora({
    text: 'Trying to fetch spreadsheet...',
    spinner: cliSpinners.dots
  });
  spinner.start();

  const document = await googleSheet.loadDocument(
    docUrl.replace('https://docs.google.com/spreadsheets/', '').split('/')[1],
    (msg) => {
      spinner.text = msg;
      spinner.fail();
    }
  );
  spinner.text = `Succesfully loaded ${document.title}`;
  spinner.succeed();

  const qa2 = new Enquirer<{ sheetId: string }>();

  const sheetList = googleSheet.getSheets(document);
  const { sheetId } = await qa2.prompt(sheetIdPrompt(sheetList));

  return {
    document,
    sheetId:
      sheetList.find((where) => where.name === sheetId)?.value ||
      sheetList[0].value
  };
};

export default async (args: CLIArguments) => {
  args = await args;
  const { document, sheetId } = await fetchSheetInformation().catch(() =>
    process.exit(1)
  );

  const spinner = ora({
    text: 'Trying to fetch calendar...',
    spinner: cliSpinners.dots
  });
  spinner.start();

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
      locale: `${args?.locale.split('-')[0]}${args?.locale
        .split('-')[1]
        .toUpperCase()}` as LocaleKeyTypes,
      dateStringColumn: args?.dateStringColumn,
      titleStringColumn: args?.titleStringColumn
    }
  });

  if (!res) {
    process.exit();
  }

  spinner.stop();

  const select = await new Enquirer<{ values?: 'google' | 'ics' }>()
    .prompt({
      type: 'select',
      name: 'values',
      message: 'Where do you wanna to export to?',
      choices: ['google', 'ics', 'terminal', 'json']
    })
    .catch(() => ({ values: undefined }));

  const { calendarTitle, events } = res;

  if (!select.values) process.exit(1);

  _export[select.values](calendarTitle, events);
};
