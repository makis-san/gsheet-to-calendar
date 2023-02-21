import Table from 'cli-table'
import { format, isValid } from 'date-fns'
import * as Locales from 'date-fns/locale'
import { LocaleKeyTypes } from '../../actions/fetchEvents/fetchEvents.types'

export default (
  calendarTitle: string,
  events: EventTypes[],
  locale: LocaleKeyTypes
) => {
  const data = events.reduce((acc, cur) => {
    const month = format(new Date(cur.date), 'MMMM', {
      locale: Locales[locale]
    })

    if (!acc[month]) acc[month] = []

    acc[month].push(cur.title)

    return acc
  }, {} as Record<string, string[]>)

  const table = new Table({ head: Object.keys(data) })

  table.push(
    Object.keys(data).map((month) => `${data[month].length} event(s) loaded`)
  )

  console.log(table.toString())
}
