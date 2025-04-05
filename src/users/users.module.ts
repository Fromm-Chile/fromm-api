import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { UsersRepository } from './repositories/users.repository';
import { UsersControllerPeru } from './controllers/users.pe.controller';

@Module({
  controllers: [UsersController, UsersControllerPeru],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
