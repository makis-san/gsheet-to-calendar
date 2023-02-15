import {
  getOAuthClient,
  generateCalendar,
  saveEvents
} from '../../../export/google';
import { log } from '../../../utils';
import { SaveToGoogleFN } from './saveToGoogle.types';

export const saveToGoogle: SaveToGoogleFN = async (props) => {
  const { accessToken, calendarTitle, events } = props;

  if (!accessToken) return;

  const OAuthClient = getOAuthClient(accessToken);

  const calendarId = await generateCalendar(calendarTitle, OAuthClient);

  if (!calendarId) {
    log.error(`Unable to create calendar id`);
    return;
  }

  return saveEvents(calendarId, events, OAuthClient);
};

export * from './saveToGoogle.types';
