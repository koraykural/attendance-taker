import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { Storage } from '@capacitor/storage';
import { Router } from '@angular/router';
import { LoginDto, RegisterDto } from '@interfaces/auth';

const ACCESS_TOKEN_KEY = 'my-access-token';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  isAuthenticated = new BehaviorSubject<boolean | null>(null);
  currentAccessToken: string | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.loadToken();
  }

  async loadToken() {
    const token = await Storage.get({ key: ACCESS_TOKEN_KEY });
    if (token && token.value) {
      this.currentAccessToken = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  signUp(registerDto: RegisterDto): Observable<any> {
    return this.http
      .post<{ accessToken: string }>(`/api/auth/register`, registerDto)
      .pipe(switchMap(({ accessToken }) => this.setToken(accessToken)));
  }

  login(credentials: LoginDto): Observable<any> {
    return this.http
      .post<{ accessToken: string }>(`/api/auth/login`, credentials)
      .pipe(switchMap(({ accessToken }) => this.setToken(accessToken)));
  }

  setToken(accessToken: string) {
    this.currentAccessToken = accessToken;
    this.isAuthenticated.next(true);
    const storeAccess = Storage.set({ key: ACCESS_TOKEN_KEY, value: accessToken });
    return from(storeAccess);
  }

  logout() {
    this.currentAccessToken = null;
    this.isAuthenticated.next(false);
    Storage.remove({ key: ACCESS_TOKEN_KEY });
    this.router.navigateByUrl('/login');
  }
}
