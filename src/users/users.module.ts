import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersRepository } from './repositories/users.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UsersAdminController } from './controllers/users.admin.controller';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [UsersAdminController],
  providers: [
    UsersService,
    UsersRepository,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [UsersService],
  imports: [AuthModule],
})
export class UsersModule {}
