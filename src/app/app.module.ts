import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderModule } from './common/header/header.module';
import { FooterModule } from './common/footer/footer.module';
import { NavigationModule } from './common/navigation/navigation.module';
import { CircuitBreakerInterceptor } from './common/interceptor/circuit-breaker.interceptor';

/*
1. provideHttpClient is for HttpClientModule
2. withInterceptors is for injector modul
3. authHttpInterceptorFn - HTTP interceptor from the Auth0 Angular SDK 
*/

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //HomeModule,
    HeaderModule,
    FooterModule,
    NavigationModule,
    //ReactiveFormsModule, - This goes into inside component module implemenation level
    //SearchModule, - This goes into inside component module implemenation level
  ],
  providers: [
    /*  Order of Interceptor matters
        multi: true means, there can be more than on HTTP_INTERCEPTORS otherwise last will only be called
    */
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CircuitBreakerInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
