import express from 'express';
import open from 'open';
import { auth } from '@googleapis/oauth2';
import { oAuthClient, port, redirect } from './getOAuthClient';

export default async () => {
  let resolve;
  const app = express();
  const p = new Promise<string>((_resolve) => {
    resolve = _resolve;
  });

  app.get('/v1/oauth/google', (req, res) => {
    if (req.query.code) {
      resolve(req.query.code);
      return res.send('Authenticated');
    }
    return res.send('Ooops :P');
  });

  const server = app.listen(port);

  open(
    oAuthClient.generateAuthUrl({
      redirect_uri: redirect,
      scope: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/calendar.events'
      ]
    })
  );

  const code = await p;

  server.close();

  const { tokens } = await oAuthClient.getToken(code);
  oAuthClient.setCredentials({ access_token: tokens.access_token });
  return { ...tokens, oAuthClient };
};
