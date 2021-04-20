import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { envConst } from 'src/constants/env.const';

const { ARB_AUTH_TOKEN } = envConst;

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authToken = request.headers?.authorization;
    if (ARB_AUTH_TOKEN && authToken !== `Bearer ${ARB_AUTH_TOKEN}`) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
