import chalk, { Chalk } from 'chalk';
import { log as Log } from 'console';

type TFunction = ((chalk: Chalk) => string) | string;

const renderText = (text: string | TFunction) =>
  typeof text === 'string' ? text : text(chalk);

export const log = {
  error: (text: TFunction) =>
    Log(
      `${chalk.bold.bgRed(`| ERROR |`)}${chalk.gray(` ${renderText(text)}`)}`
    ),
  info: (text: TFunction) =>
    Log(
      `${chalk.bold.bgCyan(`| INFO |`)}${chalk.gray(` ${renderText(text)}`)}`
    ),
  text: (text: TFunction) =>
    Log(`${chalk.bold.bgCyan(`| INFO |`)}${chalk.gray(` ${renderText(text)}`)}`)
};
