import chalk from 'chalk';
import cliSpinners from 'cli-spinners';
import { addDays, format } from 'date-fns';
import fs from 'fs';
import * as ics from 'ics';
import ora from 'ora';
import path from 'path';
import { log } from '../../utils';
import Enquirer from 'enquirer';

export default async (calendarTitle: string, events: EventTypes[]) => {
  const qa = new Enquirer();
  const { saveUrl } = (await qa.prompt({
    type: 'input',
    message: 'Where it should be saved?',
    initial: `${path.resolve(__dirname)}`,
    name: 'saveUrl'
  })) as { saveUrl: string };

  const writePath = `${path.resolve(
    __dirname,
    saveUrl || ''
  )}/${calendarTitle}.ics`;

  const spinner = ora({
    text: `Writing file to ${writePath}`,
    spinner: cliSpinners.dots
  });
  spinner.start();
  const parsedEvents = events.map(
    (event) =>
      ({
        title: event.title,
        start: format(event.date, 'yyyy-M-d')
          .split('-')
          .reduce(
            (acc, cur) => [...acc, Number(cur)],
            [] as number[]
          ) as ics.DateArray,
        end: format(addDays(event.date, 1), 'yyyy-M-d')
          .split('-')
          .reduce(
            (acc, cur) => [...acc, Number(cur)],
            [] as number[]
          ) as ics.DateArray
      } as ics.EventAttributes)
  );

  const { error, value } = ics.createEvents(parsedEvents);
  if (error) {
    log.error(error.name);
    console.log(error);
    return;
  }

  if (!value) return;

  fs.writeFile(writePath, value, () => {
    spinner.text = `Succesfully written file to ${chalk.underline.white(
      writePath
    )}`;
    spinner.succeed();
  });
};
