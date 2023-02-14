import {
  getOAuthClient,
  generateCalendar,
  saveEvents
} from '../../../export/google';
import { log } from '../../../utils';

export const saveToGoogle = async (
  calendarTitle: string,
  events: EventTypes[],
  accessToken: string
) => {
  if (!accessToken) return;

  const OAuthClient = getOAuthClient(accessToken);

  const calendarId = await generateCalendar(calendarTitle, OAuthClient);

  if (!calendarId) {
    log.error(`Unable to create calendar id`);
    return;
  }

  return saveEvents(calendarId, events, OAuthClient);
};
