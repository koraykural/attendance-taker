import { Injectable } from '@angular/core';
import { ApiService } from '../shared/api.service';
import {
  AttendanceCodeStreamData,
  CreateSessionDto,
  CreateSessionResponseDto,
  SessionDetails,
} from '@interfaces/session';
import {
  BehaviorSubject,
  Subscription,
  combineLatest,
  map,
  pairwise,
  skipWhile,
  startWith,
  takeWhile,
} from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  session$ = new BehaviorSubject<SessionDetails | null>(null);
  loadingSession$ = new BehaviorSubject<boolean>(false);
  attendenceCode$ = new BehaviorSubject<string | null>(null);
  attendenceCodeSub: Subscription | null = null;

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
        const sessionId = this.getSessionIdFromNavigationEvent(event);

        if (sessionId && sessionId !== this.session$.value?.id) {
          this.setSession(sessionId);
        }
      });

    this.listenToSessionChanges();
  }

  listenToSessionChanges() {
    this.session$.pipe(pairwise()).subscribe(([previous, current]) => {
      const shouldListenForCodes =
        !!current &&
        !current.endedAt &&
        (!previous || previous.id !== current.id || !!previous.endedAt);

      if (shouldListenForCodes) {
        this.listenForCodes();
      } else if (!current || !!current.endedAt) {
        this.stopListeningForCodes();
      }
    });
  }

  getSessionIdFromNavigationEvent(event: unknown): string | undefined {
    if (!(event instanceof NavigationEnd)) {
      return;
    }

    if (!event.url.includes('/session/session-')) {
      return;
    }

    const sessionId = event.url.split('/').filter((part) => part.startsWith('session-'))[0];

    return sessionId;
  }

  refreshSession() {
    if (!this.session$.value || this.loadingSession$.value) {
      return;
    }

    this.setSession(this.session$.value.id);
  }

  setSession(sessionId: string) {
    this.loadingSession$.next(true);
    this.getSessionDetails(sessionId).subscribe((session) => {
      this.session$.next(session);
      this.loadingSession$.next(false);
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

    if (this.attendenceCodeSub) {
      this.stopListeningForCodes();
    }

    this.attendenceCodeSub = combineLatest([
      this.socket.fromEvent<AttendanceCodeStreamData>('session'),
      this.session$,
      this.loadingSession$,
    ])
      .pipe(
        skipWhile(([_data, _session, loading]) => loading),
        takeWhile(([data, session]) => {
          return data.active && !!session && !session.endedAt;
        }, true),
        map(([data]) => data.code)
      )
      .subscribe((code) => {
        if (code) {
          this.attendenceCode$.next(code);
        } else {
          this.attendenceCode$.next(null);
          this.refreshSession();
        }
      });

    this.socket.connect();
    this.socket.emit('session', { id: session.id });
  }

  stopListeningForCodes() {
    if (this.attendenceCodeSub) {
      this.attendenceCodeSub.unsubscribe();
      this.socket.disconnect();
      this.attendenceCode$.next(null);
    }
  }
}
