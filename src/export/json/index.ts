import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import Enquirer from 'enquirer'
import { LocaleKeyTypes } from '../../actions/fetchEvents/fetchEvents.types'
import { isSilent } from '../../utils'
import { useSpinner } from '../../utils/spinner/spinner'

export default async (
  calendarTitle: string,
  events: EventTypes[],
  _locale: LocaleKeyTypes,
  _access?: string
) => {
  const qa = new Enquirer<{ saveUrl: string }>()
  const { saveUrl } = await qa.prompt({
    type: 'input',
    message: 'Where it should be saved?',
    initial: `${path.resolve(process.cwd())}`,
    name: 'saveUrl'
  })

  const writePath = `${path.resolve(
    process.cwd(),
    saveUrl || ''
  )}/${calendarTitle}.json`

  const spinner = useSpinner(`Writing file to ${writePath}`)

  if (!isSilent) spinner.start()

  fs.writeFile(writePath, JSON.stringify(events, null, 4), () => {
    spinner.text = `Succesfully written file to ${chalk.underline.white(
      writePath
    )}`
    spinner.succeed()
  })
}
