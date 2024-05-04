import { Injectable } from '@angular/core';
import { ApiService } from '../shared/api.service';
import {
  AttendanceCodeStreamData,
  CreateSessionDto,
  CreateSessionResponseDto,
  SessionDetails,
} from '@interfaces/session';
import { BehaviorSubject, startWith, takeWhile } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  session$ = new BehaviorSubject<SessionDetails | null>(null);
  attendenceCode$ = new BehaviorSubject<string | null>(null);

  get sessionId() {
    return this.session$.value?.id;
  }

  constructor(
    private readonly socket: Socket,
    private readonly http: ApiService,
    private readonly router: Router
  ) {
    this.router.events
      .pipe(startWith(new NavigationEnd(0, this.router.url, this.router.url)))
      .subscribe((event) => {
        if (!(event instanceof NavigationEnd)) {
          return;
        }

        if (!event.url.includes('/session/session-')) {
          return;
        }

        const sessionId = event.url.split('/').filter((part) => part.startsWith('session-'))[0];

        if (sessionId && sessionId !== this.session$.value?.id) {
          this.getSessionDetails(sessionId).subscribe((session) => {
            this.session$.next(session);
          });
        }
      });

    this.session$.subscribe((session) => {
      if (session) {
        this.listenForCodes();
      }
    });
  }

  refreshSession() {
    if (!this.session$.value) {
      return;
    }

    this.getSessionDetails(this.session$.value.id).subscribe((session) => {
      this.session$.next(session);
    });
  }

  createSession(body: CreateSessionDto) {
    return this.http.post<CreateSessionResponseDto>('session', body);
  }

  getSessionDetails(sessionId: string) {
    return this.http.get<SessionDetails>(`session/${sessionId}`);
  }

  terminateSession() {
    if (!this.sessionId) {
      return;
    }

    this.http.put<void>(`session/${this.sessionId}/terminate`, undefined).subscribe(() => {
      this.refreshSession();
    });
  }

  reopenSession() {
    if (!this.sessionId) {
      return;
    }

    this.http.put<void>(`session/${this.sessionId}/reopen`, undefined).subscribe(() => {
      this.refreshSession();
    });
  }

  listenForCodes(): void {
    const session = this.session$.value;

    if (!session || !!session.endedAt) {
      return;
    }

    console.log('listening for codes');

    this.socket
      .fromEvent<AttendanceCodeStreamData>('session')
      .pipe(takeWhile((data) => data.active, true))
      .subscribe((data) => {
        if (data.code) {
          this.attendenceCode$.next(data.code);
        } else {
          this.attendenceCode$.next(null);
          this.refreshSession();
        }
      });

    this.socket.emit('session', { id: this.sessionId });
  }
}
