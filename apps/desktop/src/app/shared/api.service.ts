import { HttpClient, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  public baseUrl: string;

  public constructor(private http: HttpClient) {
    this.baseUrl = 'https://localhost/api/';
  }

  get<T>(...params: Parameters<HttpClient['get']>): Observable<T> {
    params[0] = this.baseUrl + params[0];
    return this.http.get<T>(...params) as any;
  }

  post<T>(...params: Parameters<HttpClient['post']>): Observable<T> {
    params[0] = this.baseUrl + params[0];
    return this.http.post<T>(...params);
  }

  put<T>(...params: Parameters<HttpClient['put']>): Observable<T> {
    params[0] = this.baseUrl + params[0];
    return this.http.put<T>(...params);
  }

  patch<T>(...params: Parameters<HttpClient['patch']>): Observable<T> {
    params[0] = this.baseUrl + params[0];
    return this.http.patch<T>(...params);
  }

  delete<T>(...params: Parameters<HttpClient['delete']>): Observable<T> {
    params[0] = this.baseUrl + params[0];
    return this.http.delete<T>(...params);
  }
}
