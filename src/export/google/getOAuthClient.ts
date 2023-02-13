import { auth } from '@googleapis/oauth2';

export const port = 8000;
export const redirect = `http://localhost:${port}/v1/oauth/google`;

export const getOAuthClient = (accessToken?: string) => {
  if (!accessToken) {
    const { CLIENT_ID: clientId, CLIENT_SECRET: clientSecret } = process.env;
    return new auth.OAuth2(clientId, clientSecret, redirect);
  }

  const oAuth = new auth.OAuth2();
  oAuth.setCredentials({ access_token: accessToken });
  return oAuth;
};
