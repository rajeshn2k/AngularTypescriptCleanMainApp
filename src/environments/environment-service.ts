import { Injectable } from '@angular/core';
import { environment } from './environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  public BookApiBaseUrl: string;
  public PersonApiBaseUrl: string;
  public AppEnvironmentName: string;

  constructor() {
    this.BookApiBaseUrl = environment.bookApiBaseUrl;
    this.PersonApiBaseUrl = environment.personApiBaseUrl;
    this.AppEnvironmentName = environment.appEnvironmentName;
  }
}
