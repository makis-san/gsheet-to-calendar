import { calendar, auth } from '@googleapis/calendar';
import { format } from 'date-fns';
import { OAuth2Client } from 'googleapis-common';
import { log } from '../../utils';

require('dotenv').config();

export default async (
  calendarId: string,
  events: EventTypes[],
  oAuthClient: OAuth2Client
) => {
  const api = calendar({
    auth: oAuthClient,
    version: 'v3'
  });

  await Promise.all(
    events.map(async (event) => {
      const eventWithSameTitle = await api.events.list({
        calendarId,
        fields: 'summary',
        q: `summary=${event.title}`
      });

      if (eventWithSameTitle.data.items) return;

      await api.events
        .insert({
          calendarId,
          prettyPrint: true,
          requestBody: {
            summary: event.title,
            description: 'Automatically generated by github.com/makis-san',
            start: {
              dateTime: event.date.toISOString(),
              timeZone: process.env.TIME_ZONE
            },
            end: {
              dateTime: event.date.toISOString(),
              timeZone: process.env.TIME_ZONE
            },
            creator: {
              displayName: '@github.com/makis-san'
            },
            endTimeUnspecified: true
          }
        })
        .catch((e) => log.error(`Unable to create event code ${e.code}`));
    })
  );
};
