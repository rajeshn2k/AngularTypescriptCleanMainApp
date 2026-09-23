import { Injectable } from '@angular/core';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { from, of, Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth0Client!: Auth0Client;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<any>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public user$ = this.userSubject.asObservable();

  constructor() {
    this.initAuth0();
  }

  private async initAuth0(): Promise<void> {
    this.auth0Client = new Auth0Client({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      authorizationParams: {
        redirect_uri: environment.auth0.redirectUri,
        audience: environment.auth0.audience,
        scope: environment.auth0.scope,
      },
      cacheLocation: 'localstorage',
    });

    // Check if user is already authenticated
    const isAuthenticated = await this.auth0Client.isAuthenticated();
    this.isAuthenticatedSubject.next(isAuthenticated);

    if (isAuthenticated) {
      const user = await this.auth0Client.getUser();
      this.userSubject.next(user);
    }
  }

  public login(): Observable<void> {
    return from(this.auth0Client.loginWithRedirect()).pipe(
      catchError((error) => {
        console.error('Login error:', error);
        return of(void 0);
      })
    );
  }

  public handleRedirectCallback(): Observable<any> {
    return from(this.auth0Client.handleRedirectCallback()).pipe(
      tap(() => {
        this.isAuthenticatedSubject.next(true);
        this.getUser().subscribe();
      }),
      catchError((error) => {
        console.error('Redirect callback error:', error);
        return of(null);
      })
    );
  }

  public logout(): Observable<void> {
    return from(
      this.auth0Client.logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      })
    ).pipe(
      tap(() => {
        this.isAuthenticatedSubject.next(false);
        this.userSubject.next(null);
      }),
      catchError((error) => {
        console.error('Logout error:', error);
        return of(void 0);
      })
    );
  }

  public getToken(): Observable<string | null> {
    return from(this.auth0Client.getTokenSilently()).pipe(
      map((token) => token ?? null),
      catchError((error) => {
        console.error('Get token error:', error);
        return of(null);
      })
    );
  }

  public getUser(): Observable<any> {
    return from(this.auth0Client.getUser()).pipe(
      tap((user) => {
        this.userSubject.next(user);
      }),
      catchError((error) => {
        console.error('Get user error:', error);
        return of(null);
      })
    );
  }

  public isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  public get currentUser(): any {
    return this.userSubject.value;
  }
}
