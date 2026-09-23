import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Skip token for Auth0 requests
    if (this.isAuth0Request(req.url)) {
      return next.handle(req);
    }

    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        if (token) {
          const authReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          return next.handle(authReq);
        }
        return next.handle(req);
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle 401 unauthorized errors
        if (error.status === 401) {
          // Token might be expired, trigger logout
          this.authService.logout().subscribe();
        }
        return throwError(() => error);
      })
    );
  }

  private isAuth0Request(url: string): boolean {
    return url.includes('auth0.com') || url.includes('YOUR_AUTH0_DOMAIN');
  }
}
