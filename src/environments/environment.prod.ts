export const environment = {
  production: true,
  appEnvironmentName: 'PRODUCTION',
  bookApiBaseUrl: 'https://api.example.com/api/book',
  personApiBaseUrl: 'https://api.example.com/api/person',
  auth0: {
    domain: 'YOUR_AUTH0_DOMAIN',
    clientId: 'YOUR_AUTH0_CLIENT_ID',
    redirectUri: window.location.origin,
    audience: 'YOUR_API_AUDIENCE',
    scope: 'openid profile email'
  }
};
