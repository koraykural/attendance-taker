import { HttpClient, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  public baseUrl: string;

  public constructor(private http: HttpClient) {
    this.baseUrl = 'http://localhost:3333/api/';
  }

  get<T>(...params: Parameters<HttpClient['get']>) {
    params[0] = this.baseUrl + params[0];
    return this.http.get<T>(...params) as any;
  }

  post<T>(...params: Parameters<HttpClient['post']>) {
    params[0] = this.baseUrl + params[0];
    return this.http.post<T>(...params);
  }

  put<T>(...params: Parameters<HttpClient['put']>) {
    params[0] = this.baseUrl + params[0];
    return this.http.put<T>(...params);
  }

  patch<T>(...params: Parameters<HttpClient['patch']>) {
    params[0] = this.baseUrl + params[0];
    return this.http.patch<T>(...params);
  }

  delete<T>(...params: Parameters<HttpClient['delete']>) {
    params[0] = this.baseUrl + params[0];
    return this.http.delete<T>(...params);
  }
}
