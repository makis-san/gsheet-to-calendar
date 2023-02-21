import { parse } from 'date-fns'
import * as Locales from 'date-fns/locale'
import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { FetchEventsFNOptions } from '../../../actions/fetchEvents/fetchEvents.types'

export default function byRead(
  sheet: GoogleSpreadsheetWorksheet,
  rowRange: number,
  columnRange: string[],
  options: FetchEventsFNOptions
) {
  const events: EventTypes[] = []

  columnRange.forEach((col, colIndex) =>
    [...Array(rowRange)].forEach((_, row) => {
      if (row === rowRange - 1) {
        return
      }
      const cellA1 = `${col}${row + 1}`
      const cell = sheet.getCellByA1(cellA1)

      if (!cell.value) return

      const dates = cell.value.toString().match(/(\d+)(?:\.(\d{1,2}))?/gm)

      const nearA1 = `${columnRange[colIndex + 1]}${row + 1}`
      const nearCell = sheet.getCellByA1(nearA1)

      if (!dates || !nearCell.value) return

      let referenceDate: Date

      const parsedEvents = dates.map((dateString, index) => {
        const stringToBeParsed =
          index === 0
            ? cell.value
                .toString()
                .replace(/[0-9,\s][0-9\,]*[0-9,\s]*/g, ` ${dateString} `)
            : dateString

        let date: Date

        if (index === 0) {
          date = parse(stringToBeParsed, options.dateFormat, new Date(), {
            locale: Locales[options.locale]
          })
          date.setHours(0, 0, 0, 0)

          referenceDate = date
        } else {
          date = referenceDate
          date.setDate(Number(stringToBeParsed))
        }

        return {
          date,
          title: `${nearCell.value}`
        }
      })

      parsedEvents.forEach((event) => events.push(event))
    })
  )

  return events
}
