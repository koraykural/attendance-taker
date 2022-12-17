import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'attandance-checker-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'desktop';
  code: string | undefined = undefined;

  constructor(
    private readonly http: HttpClient,
    private readonly socket: Socket
  ) {}

  ngOnInit(): void {
    this.http.get<{ code: string }>('/api').subscribe((res) => {
      this.code = res.code;
    });
    this.socket.emit('code');
    this.socket.fromEvent<string>('code').subscribe((code) => {
      this.code = code;
    });
  }
}
