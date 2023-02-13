import { oauth2 } from '@googleapis/oauth2';
import chalk from 'chalk';
import cliSpinners from 'cli-spinners';
import Enquirer from 'enquirer';
import ora from 'ora';
import { log } from '../../utils';
import generateCalendar from './generateCalendar';
import { getOAuthClient } from './getOAuthClient';
import handleLogin from './handleLogin';
import saveEvents from './saveEvents';

const canUseOauth = () =>
  process.env.CLIENT_ID !== undefined &&
  process.env.CLIENT_SECRET !== undefined;

export default async (
  calendarTitle: string,
  events: EventTypes[],
  _access?: string
) => {
  const qa = new Enquirer<{ option: 'oAuth' | 'accessToken' }>();

  const { option } = await qa.prompt({
    type: 'select',
    message: 'Where it should be saved?',
    name: 'option',
    choices: [
      !canUseOauth() ? chalk.strikethrough('oAuth') : 'oAuth',
      'Access Token'
    ],
    validate: (value) => (!canUseOauth() && value === 'oAuth' ? false : true),
    required: true
  });

  if (option === 'oAuth') {
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

    console.log(access_token);

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
    return;
  }

  const qa2 = new Enquirer<{ accessToken: string }>();

  const { accessToken } = await qa2.prompt({
    type: 'input',
    message: 'Please provide a google access token',
    name: 'accessToken',
    required: true
  });

  const oAuthClient = getOAuthClient(accessToken);
  const userInfo = (
    await oauth2({ auth: oAuthClient, version: 'v2' }).userinfo.get()
  ).data;

  log.info((chalk) => `Logged in as : ${chalk.white.bold(userInfo.name)}`);

  const calendarId = await generateCalendar(calendarTitle, oAuthClient);
  if (!calendarId) return;
  await saveEvents(calendarId, events, oAuthClient);
};
