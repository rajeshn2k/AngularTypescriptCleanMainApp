import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Person } from 'githubnodejstypescriptprinciplelibrary/lib/model/person';
import { Logger } from 'githubnodejstypescriptprinciplelibrary/lib/log/logger';
import { EnvironmentService } from '../../../environments/environment-service';

@Injectable({
  providedIn: 'root',
})
export class PersonApiService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  //private logger: Logger,
  constructor(private http: HttpClient, private endpoints: EnvironmentService) {}

  public GetPersons(): Observable<Person[]> {
    const requestUrl = this.endpoints.PersonApiBaseUrl;

    return this.http.get<Person[]>(requestUrl).pipe(
      map((persons) => persons)
      //catchError()
    );
  }

  public GetPersonByPersonId(personId: number): Observable<Person> {
    const requestUrl = this.endpoints.PersonApiBaseUrl + '/' + personId;

    return this.http.get<Person>(requestUrl).pipe(
      map((person) => person)
      //catchError(this.logger.HandleError<Person>('GetPersonByPersonId', null))
    );
  }

  public EditPerson(person: Person, personId: number): Observable<any> {
    const requestUrl = this.endpoints.PersonApiBaseUrl + '/' + personId;

    return this.http.put<Person>(requestUrl, person, this.httpOptions).pipe(
      tap((_) => {})
      //catchError(this.logger.HandleError<Person>('EditPerson'))
    );
  }

  public AddPerson(person: Person): Observable<any> {
    const requestUrl = this.endpoints.PersonApiBaseUrl;

    return this.http.post<Person>(requestUrl, person, this.httpOptions).pipe(
      tap((_) => {})
      //catchError(this.logger.HandleError<Person>('EditPerson'))
    );
  }

  public DeletePerson(personId: number): Observable<any> {
    const requestUrl = this.endpoints.PersonApiBaseUrl + '/' + personId;

    return this.http.delete<Person>(requestUrl, this.httpOptions).pipe(
      tap((_) => {})
      //catchError(this.logger.HandleError<Person>('EditPerson'))
    );
  }
}
