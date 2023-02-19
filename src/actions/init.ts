import _export, { exportMethods } from '../export'
import fetchEvents from './fetchEvents/fetchEvents'
import googleSheet from './googleSheet'
import { CLIArguments } from '../cli'
import { LocaleKeyTypes } from './fetchEvents/fetchEvents.types'
import prompts from './prompts'
import { isSilent } from '../utils'
import { useSpinner } from '../utils/spinner/spinner'
import { exportPrompt } from './prompts/export'

const fetchSheetInformation = async (args?: {
  docId?: string
  sheetId?: string
}) => {
  const docId = args?.docId ? args.docId : (await prompts.getDocInfo()).docId

  const spinner = useSpinner('Trying to fetch spreadsheet...')
  if (!isSilent) spinner.start()

  const document = await googleSheet.loadDocument(
    docId,
    (msg) => {
      spinner.text = msg
      spinner.fail()
    },
    true
  )

  if (!document) return

  spinner.text = `Succesfully loaded ${document.title}`
  spinner.succeed()

  const sheetId = args?.sheetId
    ? args.sheetId
    : await prompts.getSheetId(document)

  return {
    document,
    sheetId
  }
}

export default async (args: CLIArguments) => {
  args = await args

  const documentResponse = await fetchSheetInformation({
    docId: args.docId,
    sheetId: args.sheetId
  }).catch(() => process.exit(1))

  if (!documentResponse) return

  const { document, sheetId } = documentResponse

  const spinner = useSpinner('Trying to fetch calendar...')

  if (!isSilent) spinner.start()

  const locale = `${args.locale.split('-')[0]}${
    args.locale.split('-')[1] ? args.locale.split('-')[1].toUpperCase() : ''
  }` as LocaleKeyTypes

  const res = await fetchEvents({
    document,
    sheetId,
    callback: (error, type) => {
      spinner.text = error
      if (!type) {
        spinner.fail()
        return
      }
      spinner[type] && spinner[type](error)
    },
    options: {
      dateFormat: args?.dateFormat,
      dateStringColumn: args?.dateStringColumn,
      titleStringColumn: args?.titleStringColumn,
      locale
    }
  })

  if (!res) {
    process.exit()
  }

  spinner.stop()

  const exportMethod =
    (args.exportAs as keyof typeof _export) || (await exportPrompt()).export

  const { calendarTitle, events } = res

  if (!Object.keys(_export).includes(exportMethod)) process.exit(1)

  _export[exportMethod](calendarTitle, events, locale)
}
