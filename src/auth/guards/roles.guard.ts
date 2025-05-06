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
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    console.log(roles);
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as PayloadToken;
    const userRole = await this.prisma.userAdmin.findUnique({
      where: { id: user.sub },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log(userRole.role.name);

    if (!userRole) {
      throw new UnauthorizedException('Role not found');
    }

    const isAuth = roles.some((role) => {
      return role.includes(userRole.role.name);
    });
    console.log(isAuth);
    if (!isAuth) {
      throw new UnauthorizedException('You are not authorized');
    }
    return isAuth;
  }
}
