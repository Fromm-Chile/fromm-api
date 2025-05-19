import { Module } from '@nestjs/common';
import { UsersAdminService } from './services/usersAdmin.service';
import { UsersAdminController } from './controllers/usersAdmin.controller';
import { UsersAdminRepository } from './repositories/usersAdmin.repository';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UsersAdminController],
  providers: [
    UsersAdminService,
    UsersAdminRepository,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [UsersAdminService],
  imports: [],
})
export class UsersAdminModule {}
