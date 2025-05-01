import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Roles } from '@prisma/client';
import { Request } from 'express';
import { PayloadToken } from '../models/token.model';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<Roles[]>(ROLES_KEY, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as PayloadToken;
    const userRole = await this.prisma.user.findUnique({
      where: { id: user.sub },
      select: { name: true },
    });

    if (!userRole) {
      throw new UnauthorizedException('Role not found');
    }

    const isAuth = roles.map((role) => role.name).includes(userRole.name);
    if (!isAuth) {
      throw new UnauthorizedException('You are not authorized');
    }
    return isAuth;
  }
}
