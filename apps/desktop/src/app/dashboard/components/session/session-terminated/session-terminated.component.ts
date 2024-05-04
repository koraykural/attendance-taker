import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SessionService } from '../../../session.service';
import { SessionDetails } from '@interfaces/session';
import { Observable } from 'rxjs';

@Component({
  selector: 'desktop-session-terminated',
  templateUrl: './session-terminated.component.html',
  styleUrls: ['./session-terminated.component.scss'],
})
export class SessionTerminatedComponent {
  @Input() session$: Observable<SessionDetails>;

  @Output() refresh = new EventEmitter<undefined>();

  constructor(private readonly sessionService: SessionService) {}

  reopen() {
    this.sessionService.reopenSession();
  }
}
