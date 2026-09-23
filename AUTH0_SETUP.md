# Auth0 Authentication Setup Guide

This document provides instructions for setting up Auth0 authentication in the AngularTypescriptCleanMainApp.

## Prerequisites

1. An Auth0 account (sign up at https://auth0.com/)
2. Auth0 tenant created
3. Angular application configured

## Auth0 Configuration Steps

### 1. Create Auth0 Application

1. Log in to your Auth0 dashboard
2. Navigate to **Applications** → **Applications**
3. Click **Create Application**
4. Choose **Single Page Web Applications**
5. Name your application (e.g., "AngularTypescriptCleanMainApp")
6. Click **Create**

### 2. Configure Application Settings

In your Auth0 application settings:

**Allowed Callback URLs:**
```
http://localhost:4200/callback
https://your-domain.com/callback
```

**Allowed Logout URLs:**
```
http://localhost:4200
https://your-domain.com
```

**Allowed Web Origins:**
```
http://localhost:4200
https://your-domain.com
```

**Allowed Origins (CORS):**
```
http://localhost:4200
https://your-domain.com
```

### 3. Configure API (Optional - for API Access)

If you need to access protected APIs:

1. Navigate to **Applications** → **APIs**
2. Click **Create API**
3. Name your API (e.g., "BookPersonAPI")
4. Set identifier (e.g., "https://api.example.com")
5. Click **Create**

### 4. Update Environment Configuration

Update the Auth0 configuration in your environment files:

**Development (`src/environments/environment.development.ts`):**
```typescript
auth0: {
  domain: 'your-dev-domain.auth0.com',
  clientId: 'your-dev-client-id',
  redirectUri: window.location.origin,
  audience: 'https://your-api-identifier', // Optional, for API access
  scope: 'openid profile email'
}
```

**Production (`src/environments/environment.prod.ts`):**
```typescript
auth0: {
  domain: 'your-prod-domain.auth0.com',
  clientId: 'your-prod-client-id',
  redirectUri: window.location.origin,
  audience: 'https://your-api-identifier', // Optional, for API access
  scope: 'openid profile email'
}
```

### 5. Enable Authentication Features

The following features have been implemented:

- **Login Flow:** Users are redirected to Auth0 login page
- **Callback Handling:** Processes Auth0 authentication response
- **Token Management:** JWT tokens are stored and refreshed automatically
- **Route Protection:** AuthGuard protects Book and Person routes
- **HTTP Interceptor:** Automatically adds JWT tokens to API requests
- **User Profile:** Displays user information from Auth0
- **Logout:** Properly clears tokens and redirects to login

## Usage

### Protected Routes

The following routes are now protected by Auth0 authentication:
- `/book` - Book management (requires authentication)
- `/person` - Person management (requires authentication)
- `/profile` - User profile page (requires authentication)

### Public Routes

The following routes remain public:
- `/home` - Home page
- `/login` - Login page
- `/callback` - Auth0 callback handler

### Header Integration

The header component now includes:
- Login button (when not authenticated)
- User welcome message (when authenticated)
- Profile button (when authenticated)
- Logout button (when authenticated)

## How It Works

### Authentication Flow

1. User clicks "Login" button
2. User is redirected to Auth0 login page
3. User authenticates with Auth0
4. Auth0 redirects to `/callback` with authorization code
5. Application exchanges code for JWT token
6. Token is stored in local storage
7. User is redirected to the original requested page

### Token Management

- Tokens are stored in local storage
- Tokens are automatically refreshed when expired
- Tokens are added to HTTP requests via AuthInterceptor
- Tokens are cleared on logout

### Route Protection

- AuthGuard checks authentication status before route access
- Unauthenticated users are redirected to login
- Return URL is stored for post-login redirect

## Testing

### Local Development

1. Update environment configuration with your Auth0 credentials
2. Run `npm start`
3. Navigate to `http://localhost:4200`
4. Try to access `/book` or `/person` - should redirect to login
5. Login with Auth0
6. Verify you can access protected routes
7. Test logout functionality

### Common Issues

**"Callback URL mismatch" error:**
- Verify Allowed Callback URLs in Auth0 application settings
- Ensure they match your application URL exactly

**"CORS error":**
- Verify Allowed Web Origins in Auth0 application settings
- Ensure they match your application URL exactly

**"Unauthorized" API calls:**
- Verify API audience is configured correctly
- Check that API access is enabled in Auth0
- Verify token is being sent in Authorization header

## Security Considerations

### Token Storage
- Tokens are stored in local storage for this implementation
- For production, consider using HttpOnly cookies for enhanced security
- Implement token rotation for better security

### Logout
- Current implementation clears local storage tokens
- Consider implementing Auth0 logout with `federated` parameter
- This ensures logout from Auth0 session as well

### HTTPS
- Always use HTTPS in production
- Auth0 requires HTTPS for callback URLs in production
- Configure SSL certificates for your domain

## Role-Based Access Control (RBAC)

### Current Implementation
- Basic authentication is implemented
- All authenticated users have access to all features
- No role-based restrictions currently

### Future Enhancement
To implement RBAC:

1. Configure roles in Auth0
2. Add role claims to JWT tokens
3. Update AuthGuard to check roles
4. Implement role-based UI visibility
5. Add role-based API authorization

Example role check:
```typescript
canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
  return this.authService.user$.pipe(
    map(user => {
      const requiredRoles = route.data['roles'];
      return requiredRoles.some(role => user.roles.includes(role));
    })
  );
}
```

## Additional Resources

- [Auth0 Angular SDK Documentation](https://auth0.com/docs/quickstart/spa/angular)
- [Auth0 Dashboard](https://manage.auth0.com/)
- [Auth0 Documentation](https://auth0.com/docs/)
- [Angular Security Best Practices](https://angular.io/guide/security)

## Troubleshooting

### Application won't load after Auth0 setup
- Check browser console for errors
- Verify Auth0 configuration in environment files
- Ensure all Auth0 URLs are correctly configured

### Login redirects endlessly
- Check callback URL configuration
- Verify redirect URI in environment matches Auth0 settings
- Check for errors in browser console

### API calls fail with 401
- Verify token is being stored correctly
- Check AuthInterceptor is adding Authorization header
- Verify API audience is configured correctly
- Check token expiration and refresh logic

## Support

For issues specific to Auth0:
- Check Auth0 community forums
- Review Auth0 documentation
- Contact Auth0 support

For application-specific issues:
- Check application logs
- Review console errors
- Verify environment configuration
