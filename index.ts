require('dotenv').config();

import _export from './export';
import cliSpinners from 'cli-spinners';
import ora from 'ora';
import fetchEvents, { defaultFetchOptions } from './actions/fetchEvents';
import Enquirer from 'enquirer';
import { type } from 'os';

const initialPrompt = [
  {
    type: 'input',
    message: 'Enter the google document id',
    name: 'docId',
    hint: '(the big text on the url)',
    required: true
  },
  {
    type: 'input',
    message: 'Enter sheet id',
    name: 'sheetId',
    hint: 'Defaults to the last created',
    initial: undefined
  }
];

const runInitialPrompt = async () => {
  const qa = new Enquirer<{ docId: string; sheetId?: string }>();
  const values = await qa.prompt(initialPrompt);
  return values;
};

const init = async () => {
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
