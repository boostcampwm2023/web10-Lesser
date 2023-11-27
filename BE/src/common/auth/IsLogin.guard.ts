import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LesserJwtService } from '../lesser-jwt/lesser-jwt.service';

@Injectable()
export class IsLoginGuard implements CanActivate {
  constructor(private lesserJwtService: LesserJwtService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }
  private async validateRequest(request) {
    if (request.headers.authorization === undefined) throw new UnauthorizedException();
    const accessToken = request.headers.authorization.split('Bearer ')[1];
    request.member = { id: await this.lesserJwtService.getUserId(accessToken) };
    return true;
  }
}
