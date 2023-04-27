import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../../session.service';
import { BehaviorSubject } from 'rxjs';
import { OrganizationUserRole } from '@interfaces/organization';

@Component({
  selector: 'desktop-od-top-bar',
  templateUrl: './od-top-bar.component.html',
  styleUrls: ['./od-top-bar.component.scss'],
})
export class OdTopBarComponent {
  @Input() organizationId: string;
  @Input() myRole: OrganizationUserRole;

  $isCreatingSession = new BehaviorSubject(false);

  constructor(private router: Router, private sessionService: SessionService) {}

  createSession() {
    this.$isCreatingSession.next(true);
    this.sessionService
      .createSession({ name: 'Test', organizationId: this.organizationId })
      .subscribe({
        next: ({ sessionId }) => {
          this.router.navigate(['/', 'session', sessionId]);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
