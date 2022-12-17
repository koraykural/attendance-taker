import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';

@WebSocketGateway({
  cors: true,
  transports: ['websocket'],
})
export class RealTimeGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('code')
  findAll(@MessageBody() data: any): Observable<WsResponse<string>> {
    console.log(data);
    return interval(3000).pipe(
      map((item) => ({ event: 'code', data: uuid() }))
    );
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
}
