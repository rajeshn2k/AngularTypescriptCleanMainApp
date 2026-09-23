export const environment = {
  production: false,
  appEnvironmentName: 'DEVELOPMENT',
  bookApiBaseUrl: 'http://localhost:6101/api/book',
  personApiBaseUrl: 'http://localhost:6101/api/person',
  auth0: {
    domain: 'YOUR_AUTH0_DOMAIN',
    clientId: 'YOUR_AUTH0_CLIENT_ID',
    redirectUri: window.location.origin,
    audience: 'YOUR_API_AUDIENCE',
    scope: 'openid profile email'
  }
};
