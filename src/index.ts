import * as dotenv from 'dotenv';
import _export from './export';
import cliSpinners from 'cli-spinners';
import ora from 'ora';
import fetchEvents from './actions/fetchEvents';
import Enquirer from 'enquirer';
import cli from './cli';

cli.parse();
const initialPrompt = [
  {
    type: 'input',
    message: 'Enter the google sheet document url',
    name: 'docUrl',
    hint: 'https://docs.google.com/spreadsheets/d/123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    required: true,
    validate: (string: string) =>
      string.includes('https://docs.google.com/spreadsheets')
  }
];

const runInitialPrompt = async () => {
  const qa = new Enquirer<{ docUrl: string }>();
  const values = await qa.prompt(initialPrompt);

  const sheetId = values.docUrl.match(/gid=([^;]*)/gm);

  return {
    docId: values.docUrl
      .replace('https://docs.google.com/spreadsheets/', '')
      .split('/')[1],
    sheetId: sheetId && sheetId[0].replace('gid=', '')
  };
};

const init = async () => {
  dotenv.config();

  const values = await runInitialPrompt().catch(() => process.exit(1));

  const spinner = ora({
    text: 'Trying to fetch calendar...',
    spinner: cliSpinners.dots
  });
  spinner.start();

  const res = await fetchEvents(
    (error, type) => {
      spinner.text = error;
      if (!type) {
        spinner.fail();
        return;
      }
      spinner[type] && spinner[type](error);
    },
    values.docId as string,
    values.sheetId as string
  );

  if (!res) {
    process.exit();
  }

  spinner.stop();
  const select = await new Enquirer<{ values?: 'google' | 'ics' }>()
    .prompt({
      type: 'select',
      name: 'values',
      message: 'Where do you wanna to export to?',
      choices: ['google', 'ics']
    })
    .catch(() => ({ values: undefined }));

  const { calendarTitle, events } = res;

  if (!select.values) process.exit(1);

  _export[select.values](calendarTitle, events);
};

init();
