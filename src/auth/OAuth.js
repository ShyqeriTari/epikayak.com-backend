import * as queryString from 'query-string';

const stringifiedParams = queryString.stringify({
  client_id: process.env.APP_ID,
  redirect_uri: `${process.env.API_URL}/user/FBredirect`,
  scope: ['email'], 
  response_type: 'code',
  auth_type: 'rerequest',
  display: 'popup',
});

export const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`