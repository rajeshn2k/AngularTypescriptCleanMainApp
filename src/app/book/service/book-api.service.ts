import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Book } from '../../common/model/book';
import { EnvironmentService } from '../../../environments/environment-service';
import { ApiResponse, ApiErrorResponse } from '../../common/model/api-response';

@Injectable({
  providedIn: 'root',
})
export class BookApiService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  //private logger: Logger,
  constructor(private http: HttpClient, private endpoints: EnvironmentService) {}

  public GetBooks(): Observable<Book[]> {
    const requestUrl = this.endpoints.BookApiBaseUrl;

    return this.http.get<ApiResponse<Book[]>>(requestUrl).pipe(
      map((response) => response.Data),
      catchError(this.handleError<Book[]>('GetBooks', []))
    );
  }

  public GetBookByBookId(bookId: number): Observable<Book> {
    const requestUrl = this.endpoints.BookApiBaseUrl + '/' + bookId;

    return this.http.get<ApiResponse<Book>>(requestUrl).pipe(
      map((response) => response.Data),
      catchError(this.handleError<Book>('GetBookByBookId', null as any))
    );
  }

  public EditBook(book: Book, bookId: number): Observable<Book> {
    const requestUrl = this.endpoints.BookApiBaseUrl + '/' + bookId;

    return this.http.put<ApiResponse<Book>>(requestUrl, book, this.httpOptions).pipe(
      map((response) => response.Data),
      tap((_) => {}),
      catchError(this.handleError<Book>('EditBook', null as any))
    );
  }

  public AddBook(book: Book): Observable<Book> {
    const requestUrl = this.endpoints.BookApiBaseUrl;

    return this.http.post<ApiResponse<Book>>(requestUrl, book, this.httpOptions).pipe(
      map((response) => response.Data),
      tap((_) => {}),
      catchError(this.handleError<Book>('AddBook', null as any))
    );
  }

  public DeleteBook(bookId: number): Observable<void> {
    const requestUrl = this.endpoints.BookApiBaseUrl + '/' + bookId;

    return this.http.delete<ApiResponse<void>>(requestUrl, this.httpOptions).pipe(
      map((response) => response.Data),
      tap((_) => {}),
      catchError(this.handleError<void>('DeleteBook'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed:`, error);

      // Handle structured error response
      if (error.error && typeof error.error === 'object' && 'Error' in error.error) {
        const apiError = error.error as ApiErrorResponse;
        console.error('API Error:', apiError.Error.Message);
        return throwError(() => new Error(apiError.Error.Message));
      }

      // Handle generic HTTP errors
      let errorMessage = 'An error occurred';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Client error: ${error.error.message}`;
      } else {
        errorMessage = `Server error: ${error.status} - ${error.statusText}`;
      }

      return throwError(() => new Error(errorMessage));
    };
  }
}
