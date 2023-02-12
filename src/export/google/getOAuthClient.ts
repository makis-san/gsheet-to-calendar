import { auth } from '@googleapis/oauth2';

export const port = 8000;
export const redirect = `http://localhost:${port}/v1/oauth/google`;

const { CLIENT_ID: clientId, CLIENT_SECRET: clientSecret } = process.env;
export const oAuthClient = new auth.OAuth2(clientId, clientSecret, redirect);
