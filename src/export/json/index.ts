import chalk from 'chalk';
import cliSpinners from 'cli-spinners';
import fs from 'fs';
import ora from 'ora';
import path from 'path';
import Enquirer from 'enquirer';

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
  )}/${calendarTitle}.json`;

  const spinner = ora({
    text: `Writing file to ${writePath}`,
    spinner: cliSpinners.dots
  });

  spinner.start();

  fs.writeFile(writePath, JSON.stringify(events, null, 4), () => {
    spinner.text = `Succesfully written file to ${chalk.underline.white(
      writePath
    )}`;
    spinner.succeed();
  });
};
