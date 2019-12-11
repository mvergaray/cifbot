import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  private token: string;
  private httpOptions  ={
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  public getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('cb-token');
    }
    return this.token;
  }

  public saveToken(token: string): void {
    localStorage.setItem('cb-token', token || '');
    this.token = token;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  post(path, data) {
    return this.http.post<any>(environment.apiSuffix + path , data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  request(method: 'post'|'get'|'put'|'delete', type: any, data?, params?, headers?): Observable<any> {
    let base;

    let httpParams = new HttpParams({ fromObject: params });

    switch (method) {
      case 'post':
        base = this.http.post(`${environment.apiSuffix}/${type}`, data);
        break;
      case 'get':
        base = this.http.get(`${environment.apiSuffix}/${type}`, {
          params: httpParams
          /*headers: { Authorization: `Bearer ${this.getToken()}` }*/
        });
        break;
      case 'put':
        base = this.http.put(`${environment.apiSuffix}/${type}`, data);
        break;
      case 'delete':
        base = this.http.delete(`${environment.apiSuffix}/${type}`);
        break;
    }

    const request = base.pipe(
      map(data => data)
    );

    return request;
  }

  getFile(method: 'post'|'get'|'put'|'delete', type: any, data?, params?, headers?): Observable<any> {
    let base;
    let httpParams = new HttpParams({ fromObject: params });

    switch (method) {
      case 'post':
        base = this.http.post(`${environment.apiSuffix}/${type}`, data,
        {
          headers: headers,
          responseType: 'blob'
        });
        break;
      case 'get':
        base = this.http.get(`${environment.apiSuffix}/${type}`, {
          params: httpParams
          /*headers: { Authorization: `Bearer ${this.getToken()}` }*/
        });
        break;
      case 'put':
        base = this.http.put(`${environment.apiSuffix}/${type}`, data);
        break;
      case 'delete':
        base = this.http.delete(`${environment.apiSuffix}/${type}`);
        break;
    }

    return base;
  }
}
