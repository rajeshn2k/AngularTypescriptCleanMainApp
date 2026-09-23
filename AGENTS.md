# AGENTS.md - Mavin AI Coding Agent Specification

## Project Overview

**Project Name:** AngularTypescriptCleanMainApp  
**Type:** Angular 18+ TypeScript Frontend Application  
**Purpose:** Basic CRUD operations for Book and Person models with external API integration

## Architecture

### Technology Stack
- **Framework:** Angular 18.2.0
- **Language:** TypeScript 5.5.2
- **Build Tool:** Angular CLI 18.2.12
- **HTTP Client:** Angular HttpClient with interceptors
- **Reactive Programming:** RxJS 7.8.0
- **Testing:** Jasmine + Karma

### Project Structure
```
src/app/
├── common/              # Shared components and utilities
│   ├── constant/       # Application constants
│   ├── footer/         # Footer component
│   ├── header/         # Header component
│   ├── interceptor/    # HTTP interceptors
│   ├── model/          # Shared data models
│   └── navigation/     # Navigation components
├── book/               # Book feature module
│   ├── edit/          # Book edit component
│   ├── list/          # Book list component
│   └── service/       # Book API service
├── person/             # Person feature module
│   ├── edit/          # Person edit component
│   ├── list/          # Person list component
│   └── service/       # Person API service
└── environments/       # Environment configurations
```

### Module Organization
- **Feature Modules:** Lazy-loaded modules for Books and Persons
- **Shared Modules:** Header, Footer, Navigation as separate modules
- **Service Layer:** API services in respective feature folders
- **Model Layer:** Shared interfaces in `common/model/`

## Development Guidelines

### Code Style & Conventions
- **File Naming:** kebab-case for files (e.g., `book-list.component.ts`)
- **Component Naming:** PascalCase for classes (e.g., `BookListComponent`)
- **Interface Naming:** PascalCase starting with 'I' optional (e.g., `Book` or `IBook`)
- **Service Naming:** Suffix with `Service` (e.g., `BookApiService`)
- **Pipe Naming:** Suffix with `Pipe` (e.g., `DatePipe`)

### Angular Best Practices
- Use **standalone components** for new features (Angular 18+)
- Implement **OnPush** change detection strategy for performance
- Use **typed forms** for form validation
- Leverage **RxJS operators** for data transformation
- Implement **error handling** with catchError operator
- Use **dependency injection** with providedIn: 'root' for services

### HTTP Client Guidelines
- All HTTP calls must go through **HttpClient**
- Use **HttpInterceptor** for cross-cutting concerns (auth, logging, circuit breaker)
- Services should return **Observable<T>** not Promise
- Implement **proper error handling** with HttpErrorResponse
- Use **strongly-typed models** for API responses

### State Management
- Prefer **service-based state** over complex state management
- Use **BehaviorSubject** for shared state
- Implement **immutable updates** for state changes
- Consider **NgRx** for complex state (future enhancement)

### Testing Guidelines
- Write **unit tests** for all services
- Test **components** with TestBed
- Use **mock services** for component testing
- Aim for **80%+ code coverage**
- Test **error scenarios** in HTTP calls

## API Integration Patterns

### Current API Structure
Services in `src/app/book/service/book-api.service.ts` and `src/app/person/service/person-api.service.ts` make HTTP calls to external APIs.

### New API Response Format
**Success Response:**
```typescript
interface ApiResponse<T> {
  Success: boolean;
  Data: T;
  Message: string;
  Timestamp: string;
  RequestId: string;
}
```

**Error Response:**
```typescript
interface ApiErrorResponse {
  Success: boolean;
  Error: ErrorDetail;
  Timestamp: string;
  RequestId: string;
  Path: string;
}

interface ErrorDetail {
  Code: string;
  Message: string;
  StatusCode: number;
}
```

### Service Implementation Pattern
```typescript
// Standard service method pattern
public GetBooks(): Observable<Book[]> {
  return this.http.get<ApiResponse<BookDTO>>(requestUrl).pipe(
    map(response => response.Data),
    catchError(this.handleError)
  );
}
```

## Security Considerations

### Authentication & Authorization
- **Auth0** will be integrated for authentication
- Use **JWT tokens** for API authentication
- Implement **route guards** for protected routes
- Store tokens securely (prefer HttpOnly cookies or secure storage)
- Implement **token refresh** logic

### CORS & Headers
- Configure CORS in API backend
- Use **Content-Type: application/json** for API calls
- Include **Authorization header** with JWT token
- Handle **CORS errors** gracefully

## Error Handling Strategy

### HTTP Error Handling
- Use **circuit breaker** for external API failures
- Implement **retry logic** for transient failures
- Provide **user-friendly error messages**
- Log errors for debugging (console or service)
- Distinguish between **4xx** (client) and **5xx** (server) errors

### User Error Feedback
- Show **toast notifications** for user feedback
- Display **validation errors** in forms
- Provide **loading states** for async operations
- Handle **network connectivity** issues

## Performance Optimization

### Code Splitting
- Use **lazy loading** for feature modules
- Implement **preloading strategies** for improved UX
- Load **non-critical resources** asynchronously

### Bundle Optimization
- Use **production builds** for deployment
- Enable **AOT compilation**
- Configure **tree-shaking** for unused code
- Optimize **asset loading**

### Runtime Performance
- Use **OnPush** change detection
- Implement **trackBy** in ngFor loops
- Debounce **user inputs** in search/filter
- Use **virtual scrolling** for large lists

## Build & Deployment

### Build Commands
```bash
npm install              # Install dependencies
npm run build           # Development build
npm run prod-build      # Production build
npm start               # Start dev server
npm test                # Run tests
```

### Environment Configuration
- Use `environment.ts` for development
- Use `environment.prod.ts` for production
- Configure API base URLs per environment
- Store sensitive data in environment variables

## Development Workflow

### Feature Development
1. Create feature branch from main
2. Implement following architectural patterns
3. Write unit tests
4. Test locally
5. Commit with descriptive messages
6. Create pull request
7. Code review and merge

### Code Review Checklist
- Follows project architecture
- Implements proper error handling
- Includes unit tests
- No security vulnerabilities
- Performance considerations addressed
- Documentation updated if needed

## Current Technical Debt & Known Issues

- No authentication/authorization implemented
- API response format needs standardization
- Error handling could be improved
- No comprehensive error logging
- No monitoring/analytics integration

## Future Enhancements

### Planned Features
1. **Auth0 Authentication & Authorization** (Current priority)
2. **API Response Standardization** (Current priority)
3. **Client-side caching** with RxJS or local storage
4. **Real-time updates** with WebSockets
5. **Advanced state management** with NgRx
6. **Internationalization** (i18n)
7. **Accessibility improvements** (a11y)
8. **Performance monitoring** integration

### Technical Improvements
- Migrate to **standalone components** (Angular 18+)
- Implement **Server-Side Rendering** (SSR) with Angular Universal
- Add **PWA capabilities** for offline support
- Improve **testing coverage** to 90%+
- Add **E2E testing** with Cypress or Playwright

## Dependencies & Third-Party Libraries

### Current Dependencies
- `@angular/*` 18.2.0 - Angular framework
- `rxjs` 7.8.0 - Reactive programming
- `date-fns` 4.1.0 - Date utilities

### Future Dependencies (as needed)
- `@auth0/angular-js-sdk` - Auth0 integration
- `@ngrx/store` - State management
- `@angular/material` - UI components
- `socket.io-client` - WebSocket support

## Code Quality Standards

### TypeScript Configuration
- **Strict mode** enabled
- **No implicit any** allowed
- **Strict null checks** enabled
- **Module resolution** set to node

### Linting & Formatting
- Use **ESLint** for code quality
- **Prettier** for code formatting
- **Husky** for git hooks
- **Commitlint** for commit message validation

## Documentation Standards

### Code Documentation
- Add **JSDoc comments** for public APIs
- Document **complex logic** with inline comments
- Keep comments **concise and accurate**
- Update documentation with code changes

### API Documentation
- Document **service methods** with parameters and return types
- Include **example usage** in comments
- Document **error scenarios** and expected behavior

## Git Workflow

### Branch Naming
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Production hotfixes
- `refactor/` - Code refactoring

### Commit Message Format
```
type(scope): subject

body

footer
```

Types: feat, fix, docs, style, refactor, test, chore

## Testing Strategy

### Unit Testing
- Test **services** independently
- Mock **HTTP calls** with HttpClientTestingModule
- Test **components** with TestBed
- Verify **error handling** paths

### Integration Testing
- Test **module integration**
- Verify **routing** configuration
- Test **interceptor** behavior
- Validate **API integration**

### E2E Testing (Future)
- Test **user workflows**
- Verify **authentication flow**
- Test **CRUD operations**
- Validate **error scenarios**

## Monitoring & Logging

### Client-Side Logging
- Log **errors** to console in development
- Implement **error tracking** (Sentry, LogRocket)
- Track **user actions** for analytics
- Monitor **performance metrics**

### Debugging
- Use **Angular DevTools** for debugging
- Enable **source maps** in development
- Implement **logging interceptors**
- Track **API response times**

## Accessibility (a11y)

### WCAG Compliance
- Use **semantic HTML**
- Provide **ARIA labels** for interactive elements
- Ensure **keyboard navigation** works
- Support **screen readers**
- Provide **color contrast** meeting WCAG AA

## Browser Support

### Target Browsers
- **Chrome** (latest)
- **Firefox** (latest)
- **Safari** (latest)
- **Edge** (latest)
- **Mobile browsers** (iOS Safari, Chrome Mobile)

## Notes for AI Agents

### Critical Constraints
- **NEVER** break existing functionality without tests
- **ALWAYS** follow existing code patterns
- **MAINTAIN** consistency with existing architecture
- **ASK** before introducing major architectural changes
- **PRESERVE** existing circuit breaker implementation
- **RESPECT** existing interceptor chain

### Decision Points Requiring Human Input
- Changing **module structure** or file organization
- Introducing **new major dependencies**
- Modifying **authentication flow** significantly
- Changing **API integration patterns**
- Performance optimizations affecting UX
- Security-related changes

### Automatic Decisions
- Following existing **code style**
- Implementing **standard Angular patterns**
- Adding **unit tests** for new code
- Updating **imports** and references
- Minor **refactoring** for consistency
