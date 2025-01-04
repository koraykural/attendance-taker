import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SessionDetails } from '@interfaces/session';
import { SessionService } from '../../../session.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'desktop-session-active',
  templateUrl: './session-active.component.html',
  styleUrls: ['./session-active.component.scss'],
})
export class SessionActiveComponent {
  @Input() session$: Observable<SessionDetails>;

  @Output() refresh = new EventEmitter<undefined>();

  attendanceCode$ = this.sessionService.attendanceCode$;

  constructor(private readonly sessionService: SessionService) {}

  terminate() {
    this.sessionService.terminateSession();
  }
}
