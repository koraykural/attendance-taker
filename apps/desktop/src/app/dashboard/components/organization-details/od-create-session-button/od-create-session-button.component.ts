import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../../session.service';
import { BehaviorSubject } from 'rxjs';
import { OrganizationDetailsService } from '../organization-details.service';
import { MatDialog } from '@angular/material/dialog';
import { OdSessionNameDialogComponent } from './od-session-name-dialog/od-session-name-dialog.component';

@Component({
  selector: 'desktop-od-create-session-button',
  templateUrl: './od-create-session-button.component.html',
  styleUrls: ['./od-create-session-button.component.scss'],
})
export class OdCreateSessionButtonComponent {
  $isCreatingSession = new BehaviorSubject(false);

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private organziationDetailsService: OrganizationDetailsService,
    public dialog: MatDialog
  ) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(OdSessionNameDialogComponent, {
      data: { name: '' },
      autoFocus: 'input',
    });

    dialogRef.afterClosed().subscribe((name) => {
      if (!name) {
        return;
      }

      this.createSession(name);
    });
  }

  createSession(name: string) {
    if (!this.organziationDetailsService.organizationId) {
      return;
    }

    this.$isCreatingSession.next(true);
    this.sessionService
      .createSession({
        name,
        organizationId: this.organziationDetailsService.organizationId,
      })
      .subscribe({
        next: ({ sessionId }) => {
          this.router.navigate(['/', 'session', sessionId]);
        },
        error: (error) => {
          this.$isCreatingSession.next(false);
          console.log(error);
        },
      });
  }
}
