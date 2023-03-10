import { calendar } from '@googleapis/calendar'
import { OAuth2Client } from 'googleapis-common'

export const generateCalendar = async (
  calendarTitle: string,
  oAuthClient: OAuth2Client
) => {
  const api = calendar({
    auth: oAuthClient,
    version: 'v3'
  })

  const calendars = await api.calendarList.list().then((res) => res.data.items)

  const calendarSearch = calendars?.find(
    (where) => where.summary === calendarTitle
  )

  if (!calendarSearch) {
    const calendarId = await api.calendars
      .insert({
        requestBody: {
          summary: calendarTitle,
          timeZone: process.env.TIME_ZONE
        }
      })
      .then((data) => data?.data.id as string)
    return calendarId
  }

  return calendarSearch.id
}
