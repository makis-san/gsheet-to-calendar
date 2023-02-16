import { GoogleSpreadsheet } from 'google-spreadsheet'
import * as Locales from 'date-fns/locale'

export type LocaleKeyTypes = keyof typeof Locales
export interface FetchEventsFNOptions {
  dateFormat: string
  startColumn: string
  locale: keyof typeof Locales
  dateStringColumn?: string
  titleStringColumn?: string
}

export type FetchEventsFN = (props: {
  document: GoogleSpreadsheet
  callback: (error: string, type?: 'info' | 'warn') => void
  sheetId?: string
  options?: Partial<FetchEventsFNOptions>
}) => Promise<{ events: EventTypes[]; calendarTitle: string } | undefined>
