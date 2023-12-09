import { Session } from '@api/app/session/session.entity';
import { SessionService } from '@api/app/session/session.service';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

/** Should be used after SessionGuard. Validates user is the creator of the session */
export class SessionOwnerGuard implements CanActivate {
  @Inject()
  private readonly sessionService: SessionService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const user = req.user;
    if (!user) throw new UnauthorizedException();

    const session = req.session as Session;
    if (!session)
      throw new InternalServerErrorException('Should use SessionOwnerGuard with SessionGuard');

    return session.createdById === user.id;
  }
}
