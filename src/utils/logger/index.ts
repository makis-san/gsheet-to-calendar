import chalk, { Chalk } from 'chalk'
import { log as Log } from 'console'

type TFunction = ((chalkInstance: Chalk) => string) | string

const renderText = (text: string | TFunction) =>
  typeof text === 'string' ? text : text(chalk)

export const isSilent =
  process.argv.find((where) => where === '--s' || where === '--silent') !==
  undefined

const silentObject = {
  error: () => null,
  info: () => null,
  text: () => null
}

export const log = isSilent
  ? silentObject
  : {
      error: (text: TFunction) =>
        Log(`${chalk.bold.red('ERROR ')}${chalk.gray(renderText(text))}`),
      info: (text: TFunction) =>
        Log(`${chalk.bold.cyan('INFO ')}${chalk.gray(renderText(text))}`),
      text: (text: TFunction) =>
        Log(`${chalk.bold.grey('LOG')}${chalk.gray(renderText(text))}`)
    }
