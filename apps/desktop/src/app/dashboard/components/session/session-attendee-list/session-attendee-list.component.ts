import { Component, Input } from '@angular/core';
import { SessionAttendee } from '@interfaces/session';

@Component({
  selector: 'desktop-session-attendee-list',
  templateUrl: './session-attendee-list.component.html',
  styleUrls: ['./session-attendee-list.component.scss'],
})
export class SessionAttendeeListComponent {
  @Input() attendees: SessionAttendee[] = [];
  displayedColumns: string[] = ['email', 'fullName', 'attendedAt'];
}
