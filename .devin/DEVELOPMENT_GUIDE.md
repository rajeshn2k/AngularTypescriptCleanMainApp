# Development Guide - AngularTypescriptCleanMainApp

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Setup Instructions
```bash
# Clone repository
git clone <repository-url>
cd AngularTypescriptCleanMainApp

# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run prod-build
```

## Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Production hotfixes

### Commit Message Format
```
type(scope): subject

body

footer
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Examples:**
```
feat(auth): add Auth0 authentication service
fix(book): correct authorName typo in Book model
refactor(api): standardize API response handling
test(service): add unit tests for BookApiService
```

## Code Structure

### File Organization
```
src/app/
├── common/              # Shared code
│   ├── constant/       # Application constants
│   ├── model/          # Shared interfaces
│   ├── interceptor/    # HTTP interceptors
│   └── [shared components]/
├── [feature]/          # Feature modules
│   ├── [feature].module.ts
│   ├── [feature]-routing.module.ts
│   ├── components/
│   └── service/
└── environments/       # Environment configs
```

### Naming Conventions
- **Files:** kebab-case (`book-list.component.ts`)
- **Components:** PascalCase (`BookListComponent`)
- **Services:** PascalCase + Service suffix (`BookApiService`)
- **Interfaces:** PascalCase (`Book` or `IBook`)
- **Pipes:** PascalCase + Pipe suffix (`DatePipe`)

## Angular Patterns

### Component Pattern
```typescript
@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookListComponent implements OnInit, OnDestroy {
  // Input properties
  @Input() books: Book[];
  
  // Output properties
  @Output() bookSelected = new EventEmitter<Book>();
  
  // Dependency injection
  constructor(private bookService: BookApiService) {}
  
  // Lifecycle hooks
  ngOnInit(): void {
    this.loadBooks();
  }
  
  ngOnDestroy(): void {
    // Cleanup subscriptions
  }
  
  // Public methods
  loadBooks(): void {
    // Implementation
  }
}
```

### Service Pattern
```typescript
@Injectable({
  providedIn: 'root'
})
export class BookApiService {
  constructor(private http: HttpClient) {}
  
  public GetBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    // Error handling logic
    return throwError(() => error);
  }
}
```

### HTTP Interceptor Pattern
```typescript
@Injectable()
export class CustomInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Modify request
    const modifiedReq = req.clone({
      setHeaders: { 'Custom-Header': 'value' }
    });
    
    return next.handle(modifiedReq).pipe(
      catchError(error => {
        // Handle error
        return throwError(() => error);
      })
    );
  }
}
```

## RxJS Patterns

### Common Operators
```typescript
// Transform data
map(response => response.data)
filter(item => item.isActive)

// Handle errors
catchError(error => this.handleError(error))

// Combine streams
combineLatest([stream1, stream2])
forkJoin([request1, request2])

// Async operations
switchMap(id => this.getData(id))
debounceTime(300)
distinctUntilChanged()
```

### Subscription Management
```typescript
export class Component implements OnDestroy {
  private subscriptions = new Subscription();
  
  ngOnInit(): void {
    const sub = this.service.getData().subscribe(data => {
      // Handle data
    });
    this.subscriptions.add(sub);
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
```

## Testing Patterns

### Service Testing
```typescript
describe('BookApiService', () => {
  let service: BookApiService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookApiService]
    });
    service = TestBed.inject(BookApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  it('should get books', () => {
    service.GetBooks().subscribe(books => {
      expect(books).toBeTruthy();
    });
    
    const req = httpMock.expectOne('/api/books');
    expect(req.request.method).toBe('GET');
    req.flush([]);
    httpMock.verify();
  });
});
```

### Component Testing
```typescript
describe('BookListComponent', () => {
  let component: BookListComponent;
  let fixture: ComponentFixture<BookListComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookListComponent],
      imports: [HttpClientTestingModule]
    }).compileComponents();
    
    fixture = TestBed.createComponent(BookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Error Handling

### HTTP Error Handling
```typescript
private handleError(error: HttpErrorResponse): Observable<never> {
  if (error.status === 0) {
    // Network error
    console.error('Network error:', error.error);
  } else {
    // Server error
    console.error(`Server error: ${error.status}`, error.error);
  }
  
  return throwError(() => 
    new Error('Something bad happened; please try again later.')
  );
}
```

### User Error Feedback
```typescript
showError(message: string): void {
  // Show toast notification
  this.snackBar.open(message, 'Close', {
    duration: 5000,
    panelClass: ['error-snackbar']
  });
}
```

## Performance Optimization

### Change Detection
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptimizedComponent {
  // Use OnPush for better performance
}
```

### TrackBy in ngFor
```typescript
trackByBookId(index: number, book: Book): number {
  return book.id;
}

// In template
<tr *ngFor="let book of books; trackBy: trackByBookId">
```

### Lazy Loading
```typescript
const routes: Routes = [
  {
    path: 'book',
    loadChildren: () => import('./book/book.module')
      .then(m => m.BookModule)
  }
];
```

## Debugging

### Angular DevTools
- Install Angular DevTools browser extension
- Inspect component tree
- Debug change detection
- Profile performance

### Console Debugging
```typescript
console.log('Debug info:', data);
console.warn('Warning:', message);
console.error('Error:', error);
console.table(arrayData);
```

### Breakpoint Debugging
- Use browser DevTools
- Set breakpoints in TypeScript files
- Debug with source maps enabled

## Environment Configuration

### Development
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  bookApiBaseUrl: 'http://localhost:5000/api/books',
  personApiBaseUrl: 'http://localhost:5000/api/persons',
  auth0: {
    domain: 'your-dev-domain.auth0.com',
    clientId: 'your-dev-client-id'
  }
};
```

### Production
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  bookApiBaseUrl: 'https://api.example.com/books',
  personApiBaseUrl: 'https://api.example.com/persons',
  auth0: {
    domain: 'your-prod-domain.auth0.com',
    clientId: 'your-prod-client-id'
  }
};
```

## Build Optimization

### Production Build
```bash
npm run prod-build
```

### Bundle Analysis
```bash
npm install -g webpack-bundle-analyzer
ng build --stats-json
webpack-bundle-analyzer dist/stats.json
```

### Tree Shaking
- Use ES6 imports
- Avoid importing entire libraries
- Use specific imports: `import { map } from 'rxjs/operators'`

## Security Best Practices

### Input Validation
```typescript
validateInput(input: string): boolean {
  // Validate user input
  return input.length > 0 && input.length <= 100;
}
```

### XSS Prevention
```typescript
// Angular automatically sanitizes HTML
// Use DomSanitizer for trusted HTML
constructor(private sanitizer: DomSanitizer) {}

getSafeHtml(html: string): SafeHtml {
  return this.sanitizer.bypassSecurityTrustHtml(html);
}
```

### CSRF Protection
- Angular HttpClient handles CSRF tokens automatically
- Ensure server sets CSRF cookie
- Configure CSRF token name if needed

## Common Issues & Solutions

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Angular cache
ng cache clean
```

### Port Already in Use
```bash
# Use different port
ng serve --port 4201
```

### TypeScript Errors
- Check tsconfig.json configuration
- Ensure all dependencies are installed
- Verify import paths are correct

## Code Review Checklist

### Functionality
- [ ] Feature works as expected
- [ ] Edge cases handled
- [ ] Error handling implemented
- [ ] User feedback provided

### Code Quality
- [ ] Follows project conventions
- [ ] Code is readable and maintainable
- [ ] No duplicate code
- [ ] Proper error handling

### Testing
- [ ] Unit tests written
- [ ] Tests pass
- [ ] Good test coverage
- [ ] Edge cases tested

### Documentation
- [ ] Code documented where needed
- [ ] README updated if needed
- [ ] API documentation updated
- [ ] Comments are accurate

## Continuous Integration

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "ng lint && ng test"
    }
  }
}
```

### CI Pipeline
- Run linting
- Run tests
- Build project
- Check bundle size
- Deploy to staging

## Deployment

### Build for Production
```bash
npm run prod-build
```

### Deploy to Hosting
- Copy `dist/` folder to server
- Configure server for SPA routing
- Set up environment variables
- Configure CDN for static assets

### Environment Variables
- Set API base URLs
- Configure Auth0 settings
- Set environment name
- Configure feature flags

## Resources

### Official Documentation
- [Angular Documentation](https://angular.io/docs)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### Learning Resources
- [Angular Tutorial](https://angular.io/tutorial)
- [Angular Best Practices](https://angular.io/guide/styleguide)
- [RxJS Marbles](https://rxmarbles.com/)

### Tools
- [Angular DevTools](https://angular.io/guide/devtools)
- [Augury](https://augury.rangle.io/)
- [Bit](https://bit.dev/)

## Troubleshooting

### Common Build Issues
- **Module not found:** Check imports and dependencies
- **TypeScript errors:** Verify types and interfaces
- **Build fails:** Check for syntax errors
- **Styles not loading:** Verify styleUrls path

### Common Runtime Issues
- **HTTP errors:** Check API configuration
- **Routing issues:** Verify route configuration
- **Component not rendering:** Check selector and module imports
- **Performance issues:** Use OnPush and trackBy

## Getting Help

### Internal Resources
- Check AGENTS.md for architectural guidelines
- Check constitution.md for behavior constraints
- Check PROJECT_SPEC.md for project details

### External Resources
- Stack Overflow
- Angular GitHub Issues
- Angular Discord
- Angular Reddit

## Notes

- Always follow existing patterns in the codebase
- Ask questions when requirements are unclear
- Test thoroughly before committing
- Keep code simple and maintainable
- Document complex logic
- Update documentation with changes
