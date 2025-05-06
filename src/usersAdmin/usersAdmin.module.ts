import { Module } from '@nestjs/common';
import { UsersAdminService } from './services/usersAdmin.service';
import { UsersAdminController } from './controllers/usersAdmin.controller';
import { UsersAdminRepository } from './repositories/usersAdmin.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UsersAdminController],
  providers: [UsersAdminService, UsersAdminRepository],
  exports: [UsersAdminService],
  imports: [],
})
export class UsersAdminModule {}
