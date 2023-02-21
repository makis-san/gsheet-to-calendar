import { format, parse } from 'date-fns'
import * as Locales from 'date-fns/locale'
import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { FetchEventsFNOptions } from '../../../actions/fetchEvents/fetchEvents.types'

export default function byDefinedColumns(
  sheet: GoogleSpreadsheetWorksheet,
  rowRange: number,
  options: FetchEventsFNOptions
) {
  const { dateStringColumn: dateA1, titleStringColumn: titleA1 } = options

  if (!dateA1 || !titleA1) return []

  const events: EventTypes[] = []

  ;[...Array(rowRange)].forEach((_, index) => {
    const dateStart = Number(dateA1.slice(1, dateA1.length)) + 1

    const { value: dateValue } = sheet.getCellByA1(
      `${dateA1.slice(0, 1)}${index + dateStart}`
    )

    if (dateValue) {
      const dates = dateValue.toString().match(/(\d+)(?:\.(\d{1,2}))?/gm)

      const title = sheet.getCellByA1(
        `${titleA1.slice(0, 1)}${index + dateStart}`
      )

      if (!dates || !title.value) return

      let referenceDate: Date

      const parsedEvents = dates.map((dateString) => {
        const stringToBeParsed =
          index === 0
            ? dateValue
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
          title: `${title.value}`
        }
      })

      parsedEvents.forEach((event) => events.push(event))
    }
  })

  return events
}
