import { Injectable } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { RegisterDto, LoginDto } from '@interfaces/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly accessToken$: BehaviorSubject<string | null>;
  private readonly accessTokenKey = 'ATTANDANCE_ACCESS_TOKEN';
  isLoggedIn$: Observable<boolean>;

  constructor(private readonly http: ApiService, private readonly router: Router) {
    this.accessToken$ = new BehaviorSubject<string | null>(this.getAccessToken());
    this.isLoggedIn$ = this.accessToken$.pipe(map((token) => !!token));
  }

  login(params: LoginDto) {
    this.http.post<{ accessToken: string }>(`auth/login`, params).subscribe({
      next: ({ accessToken }) => {
        this.setAccessToken(accessToken);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  register(params: RegisterDto) {
    this.http.post<{ accessToken: string }>(`auth/register`, params).subscribe({
      next: ({ accessToken }) => {
        this.setAccessToken(accessToken);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  logout() {
    this.accessToken$.next(null);
    localStorage.removeItem(this.accessTokenKey);
    this.router.navigateByUrl('/login');
  }

  private setAccessToken(accessToken: string) {
    this.accessToken$.next(accessToken);
    localStorage.setItem(this.accessTokenKey, accessToken);
    this.router.navigate(['/dashboard']);
  }

  public getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }
}
