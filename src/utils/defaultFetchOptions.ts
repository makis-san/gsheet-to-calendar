import { FetchEventsFNOptions } from '../actions/fetchEvents/fetchEvents.types'

export const defaultFetchOptions: FetchEventsFNOptions = {
  dateFormat: `MMMM do`,
  startColumn: 'A',
  locale: 'enUS'
}
