import { auth } from '@googleapis/oauth2';
require('dotenv').config();
const { CLIENT_ID: clientId, CLIENT_SECRET: clientSecret } = process.env;
export const port = 8000;
export const redirect = `http://localhost:${port}/v1/oauth/google`;

export const oAuthClient = new auth.OAuth2(clientId, clientSecret, redirect);
