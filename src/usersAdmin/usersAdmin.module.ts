import { Module } from '@nestjs/common';
import { UsersAdminService } from './services/usersAdmin.service';
import { UsersAdminController } from './controllers/usersAdmin.controller';
import { UsersAdminRepository } from './repositories/usersAdmin.repository';

@Module({
  controllers: [UsersAdminController],
  providers: [UsersAdminService, UsersAdminRepository],
  exports: [UsersAdminService],
})
export class UsersAdminModule {}
