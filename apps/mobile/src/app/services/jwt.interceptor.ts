import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { ApiService } from '../services/api.service';
import { catchError, finalize, switchMap, filter, take } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  // Used for queued API calls while refreshing tokens
  tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private apiService: ApiService, private toastCtrl: ToastController) {}

  // Intercept every HTTP call
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if (this.isInBlockedList(request.url)) {
    //   return next.handle(request);
    // } else {
    // }
    return next.handle(this.addToken(request));
  }

  // // Filter out URLs where you don't want to add the token!
  // private isInBlockedList(url: string): Boolean {
  //   // Example: Filter out our login and logout API call
  //   if (url == `${environment.api_url}/auth` ||
  //     url == `${environment.api_url}/auth/logout`) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // Add our current access token from the service if present
  private addToken(req: HttpRequest<any>) {
    if (this.apiService.currentAccessToken) {
      return req.clone({
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.apiService.currentAccessToken}`,
        }),
      });
    } else {
      return req;
    }
  }
}
