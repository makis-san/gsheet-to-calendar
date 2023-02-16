import { auth } from '@googleapis/oauth2'

export const port = 8000
export const redirect = `http://localhost:${port}/v1/oauth/google`

export const getOAuthClient = (accessToken?: string) => {
  if (!accessToken) {
    return new auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirect
    )
  }

  const oAuth = new auth.OAuth2()
  oAuth.setCredentials({ access_token: accessToken })
  return oAuth
}
