import { GoogleSpreadsheet } from 'google-spreadsheet'
import { FetchEventsFNOptions } from '../../../actions/fetchEvents/fetchEvents.types'
import { SaveIcsReturn } from '../saveIcs/saveIcs.types'
import { SaveToGoogleProps } from '../saveToGoogle/saveToGoogle.types'

export interface FetchEventsProps {
  document: GoogleSpreadsheet
  sheetId?: string
  options?: FetchEventsFNOptions & { debug?: boolean }
}

export type FetchEventsReturn = Promise<
  | {
      events: EventTypes[]
      saveToGoogle: (
        props: Pick<SaveToGoogleProps, 'accessToken'>
      ) => Promise<void>
      saveICS: () => SaveIcsReturn
      calendarTitle: string
    }
  | undefined
>

export type FetchEventsFN = (props: FetchEventsProps) => FetchEventsReturn
