import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';
import { BehaviorSubject, EMPTY, from, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { LoginDto, RegisterDto } from '@interfaces/auth';
import { AttendedSessionListResponseItem } from '@interfaces/session';
import { environment } from '@mobile/environments/environment';

const ACCESS_TOKEN_KEY = 'my-access-token';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = environment.apiUrl;
  isAuthenticated = new BehaviorSubject<boolean | null>(null);
  currentAccessToken: string | null = null;
  attendedCodes = new BehaviorSubject<string[]>([]);

  constructor(private http: HttpClient, private router: Router) {
    this.loadToken();
  }

  async loadToken() {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      this.currentAccessToken = token;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  signUp(registerDto: RegisterDto): Observable<any> {
    return this.http
      .post<{ accessToken: string }>(`${this.baseUrl}/auth/register`, registerDto)
      .pipe(switchMap(({ accessToken }) => this.setToken(accessToken)));
  }

  login(credentials: LoginDto): Observable<any> {
    return this.http
      .post<{ accessToken: string }>(`${this.baseUrl}/auth/login`, credentials)
      .pipe(switchMap(({ accessToken }) => this.setToken(accessToken)));
  }

  setToken(accessToken: string) {
    this.currentAccessToken = accessToken;
    this.isAuthenticated.next(true);
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    return EMPTY;
  }

  logout() {
    this.currentAccessToken = null;
    this.isAuthenticated.next(false);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    this.router.navigateByUrl('/login');
  }

  attendToSession(code: string): Observable<{ sessionName?: string; didNotAttempt: boolean }> {
    if (this.attendedCodes.value.includes(code)) {
      return of({ didNotAttempt: true });
    }

    this.attendedCodes.next([...this.attendedCodes.value, code]);

    return this.http
      .post<{ sessionName: string }>(`${this.baseUrl}/session/attend/${code}`, undefined)
      .pipe(map(({ sessionName }) => ({ sessionName, didNotAttempt: false })));
  }

  getAttendedSessions() {
    return this.http.get<AttendedSessionListResponseItem[]>(`${this.baseUrl}/session/attended`);
  }
}
