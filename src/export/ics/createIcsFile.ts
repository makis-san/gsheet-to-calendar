import chalk from 'chalk';
import { addDays, format } from 'date-fns';
import fs from 'fs';
import * as ics from 'ics';
import path from 'path';
import { isSilent, log } from '../../utils';
import Enquirer from 'enquirer';
import { useSpinner } from '../../utils/spinner/spinner';

export default async (calendarTitle: string, events: EventTypes[]) => {
  const qa = new Enquirer<{ saveUrl: string }>();
  const { saveUrl } = await qa.prompt({
    type: 'input',
    message: 'Where it should be saved?',
    initial: `${path.resolve(process.cwd())}`,
    name: 'saveUrl'
  });

  const writePath = `${path.resolve(
    process.cwd(),
    saveUrl || ''
  )}/${calendarTitle}.ics`;

  const spinner = useSpinner(`Writing file to ${writePath}`);

  if (!isSilent) spinner.start();

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
