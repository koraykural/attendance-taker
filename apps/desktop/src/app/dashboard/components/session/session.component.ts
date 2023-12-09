import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Observable, finalize, tap } from 'rxjs';

type AttendanceCodeStreamData = {
  active: boolean;
  code?: string;
};

@Component({
  selector: 'desktop-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent implements OnInit {
  sessionId: string;
  attendanceCodeData$: Observable<AttendanceCodeStreamData>;

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly socket: Socket) {}

  ngOnInit(): void {
    this.sessionId = this.activatedRoute.snapshot.params['sessionId'];
    this.socket.emit('session', { id: this.sessionId });
    this.attendanceCodeData$ = this.socket
      .fromEvent<AttendanceCodeStreamData>('session')
      .pipe(tap(console.log));
  }
}
