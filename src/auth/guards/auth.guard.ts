import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigType } from '@nestjs/config';
import config from 'config/config';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'prisma/prisma.service';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly jwtSecret: string;
  constructor(
    @Inject(config.KEY) configService: ConfigType<typeof config>,
    private jwtService: JwtService,
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {
    this.jwtSecret = configService.jwtSecret;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      });

      const user = payload;
      request.user = user;
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

      if (!userRole) {
        throw new UnauthorizedException('Role not found');
      }

      if (userRole.role.name === 'SuperAdmin') {
        return true;
      }

      const isAuth = roles?.some((role) => {
        return role === userRole.role.name;
      });
      if (!isAuth) {
        throw new UnauthorizedException('You are not authorized');
      }
      return isAuth;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
