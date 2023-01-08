import { Injectable } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { RegisterDto, LoginDto } from '@interfaces/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly accessTokenKey = 'ATTANDANCE_ACCESS_TOKEN';

  constructor(private readonly http: ApiService, private readonly router: Router) {}

  get isLoggedIn(): boolean {
    return this.getAccessToken() !== null;
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
    localStorage.removeItem(this.accessTokenKey);
    this.router.navigateByUrl('/login');
  }

  private setAccessToken(accessToken: string) {
    localStorage.setItem(this.accessTokenKey, accessToken);
    this.router.navigate(['/dashboard']);
  }

  public getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }
}
