import { SessionService } from '@api/app/session/session.service';
import { User } from '@api/app/user/user.entity';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';

/** Validates session exists. Validates user can see the session. Attaches session to the request */
export class SessionGuard implements CanActivate {
  @Inject()
  private readonly sessionService: SessionService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const user = req.user as User;

    if (!user) throw new UnauthorizedException();

    const sessionId =
      req.params.sessionId ||
      req.body.sessionId ||
      req.query.sessionId ||
      req.params.id ||
      req.body.id ||
      req.query.id;

    if (!sessionId) throw new NotFoundException();

    const session = await this.sessionService.getSessionForUser(user, sessionId);

    req.session = session;

    return true;
  }
}

export const CurrentSession = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (!request.session)
    throw new InternalServerErrorException('Should use CurrentSession with SessionGuard');
  return request.session;
});
