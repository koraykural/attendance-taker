import { Component } from '@angular/core';
import { SessionService } from '../../session.service';
import { Observable, filter } from 'rxjs';
import { SessionDetails } from '@interfaces/session';

@Component({
  selector: 'desktop-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent {
  session$ = this.sessionService.session$.pipe(
    filter((session) => !!session)
  ) as Observable<SessionDetails>;

  constructor(private readonly sessionService: SessionService) {}

  refresh() {
    this.sessionService.refreshSession();
  }
}
