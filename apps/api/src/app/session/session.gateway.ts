import { SessionService } from '@api/app/session/session.service';
import { CODE_ACTIVE_TIME_MS } from '@consts/session';
import { Inject } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Observable, concat, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: true,
  transports: ['websocket'],
})
export class SessionGateway {
  @WebSocketServer()
  server: Server;

  @Inject()
  private readonly sessionService: SessionService;

  @SubscribeMessage('session')
  serveAttendanceCodes(
    @MessageBody('id') sessionId: string
  ): Observable<WsResponse<{ active: boolean; code?: string }>> {
    return concat(
      this.sessionService
        .serveSessionAttendanceCodes(sessionId)
        .pipe(map((code) => ({ event: 'session', data: { active: true, code } }))),
      of({ event: 'session', data: { active: false } }).pipe(delay(CODE_ACTIVE_TIME_MS))
    );
  }
}
