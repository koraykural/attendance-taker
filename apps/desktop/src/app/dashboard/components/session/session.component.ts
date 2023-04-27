import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Component({
  selector: 'desktop-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent implements OnInit {
  sessionId: string;
  sessionIdAlias$: Observable<string>;

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly socket: Socket) {}

  ngOnInit(): void {
    this.sessionId = this.activatedRoute.snapshot.params['sessionId'];
    this.socket.emit('code');
    this.sessionIdAlias$ = this.socket.fromEvent<string>('code');
  }
}
