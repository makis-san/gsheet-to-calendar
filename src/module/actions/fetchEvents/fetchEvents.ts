import { log } from '../../../utils'
import { getColumnRange } from '../../../utils/columnRange'
import { defaultFetchOptions } from '../../../utils/defaultFetchOptions'
import parseEvents from '../../../utils/parseEvents/parseEvents'
import { saveToGoogle } from '../saveToGoogle/saveToGoogle'
import { FetchEventsFN } from './fetchEvents.types'

export const fetchEvents: FetchEventsFN = async (props) => {
  const {
    document,
    options = { ...defaultFetchOptions, debug: false },
    sheetId
  } = props

  const sheet =
    sheetId && sheetId !== '' && document.sheetsById[sheetId]
      ? document.sheetsById[sheetId]
      : document.sheetsByIndex.at(-1)

  if (((sheetId && !document.sheetsById[sheetId]) || sheetId === '') && sheet) {
    return
  }

  if (!sheet) {
    log.error(`Unable to locate sheet`)
    return
  }

  const rowRange = sheet.rowCount || 34

  await sheet.loadCells(`${options?.startColumn || 'A'}1:${rowRange}`)

  const columnsToFetchData = [
    options?.dateStringColumn,
    options?.titleStringColumn
  ]

  const columnRange = getColumnRange([
    options?.startColumn || 'A',
    sheet.lastColumnLetter
  ])

  let events: EventTypes[] = []

  if (!columnsToFetchData[0] && !columnsToFetchData[1]) {
    events = await parseEvents.byRead(sheet, rowRange, columnRange, options)
  } else {
    events = parseEvents.byDefinedColumns(sheet, rowRange, options)
  }

  if (events.length <= 0) {
    log.error('Unable to find any events in this document.')
    return
  }

  if (options.debug) {
    log.info((chalk) => `Loaded ${chalk.bold(events.length)} events!`)
  }

  return {
    events,
    saveToGoogle: saveToGoogle.bind(undefined, {
      calendarTitle: document.title,
      events,
      accessToken: ''
    }),
    calendarTitle: sheet.title
  }
}

export * from './fetchEvents.types'
