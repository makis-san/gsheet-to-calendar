import { oauth2 } from '@googleapis/oauth2';
import cliSpinners from 'cli-spinners';
import ora from 'ora';
import { log } from '../../utils';
import generateCalendar from './generateCalendar';
import handleLogin from './handleLogin';
import saveEvents from './saveEvents';

export default async (
  calendarTitle: string,
  events: EventTypes[],
  _access?: string
) => {
  const spinner = ora({
    text: 'Waiting for google...',
    spinner: cliSpinners.dots
  });
  spinner.start();

  setTimeout(() => {
    spinner.text = 'Timed out';
    spinner.fail();
    process.exit(1);
  }, 60000);

  const { access_token, oAuthClient } = await handleLogin();

  if (!access_token) {
    spinner.text = 'Authentication failed';
    spinner.fail();
    return;
  }

  spinner.succeed();

  const userInfo = (
    await oauth2({ auth: oAuthClient, version: 'v2' }).userinfo.get()
  ).data;

  log.info((chalk) => `Logged in as : ${chalk.white.bold(userInfo.name)}`);

  if (access_token) {
    const calendarId = await generateCalendar(calendarTitle, oAuthClient);
    if (!calendarId) return;
    await saveEvents(calendarId, events, oAuthClient);
  }
};
