import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CircuitBreakerService } from './circuit-breaker.service';

@Injectable()
export class CircuitBreakerInterceptor implements HttpInterceptor {
  constructor(private circuitBreaker: CircuitBreakerService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const key = this.getEndpointKey(req.url);

    if (!this.circuitBreaker.canRequest(key)) {
      return throwError(
        () =>
          new HttpErrorResponse({
            status: 503,
            statusText: 'Circuit open',
          })
      );
    }

    return next.handle(req).pipe(
      tap({
        next: () => {
          this.circuitBreaker.onSuccess(key);
        },
      }),
      catchError((err) => {
        if (this.shouldTripCircuit(err)) {
          this.circuitBreaker.onFailure(key);
        }
        return throwError(() => err);
      })
    );
  }

  private getEndpointKey(url: string): string {
    try {
      const urlObj = new URL(url);
      return `${urlObj.origin}${urlObj.pathname}`;
    } catch {
      return url;
    }
  }

  private shouldTripCircuit(err: any): boolean {
    if (err instanceof HttpErrorResponse) {
      return err.status === 0 || err.status >= 500;
    }
    return false;
  }
}
