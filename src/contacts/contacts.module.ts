import { Module } from '@nestjs/common';
import { ContactsService } from './services/contacts.service';
import { ContactsController } from './controllers/contacts.controller';
import { ContactsRepository } from './repositories/contacts.repository';
import { UsersModule } from 'src/users/users.module';
import { EmailModule } from 'src/emails/emails.module';
import { ContactsControllerPeru } from './controllers/contacts.pe.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AuthModule } from 'src/auth/auth.module';
import { ContactsAdminController } from './controllers/contacts.admin.controller';

@Module({
  controllers: [
    ContactsController,
    ContactsControllerPeru,
    ContactsAdminController,
  ],
  providers: [
    ContactsService,
    ContactsRepository,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  imports: [UsersModule, EmailModule, AuthModule],
})
export class ContactsModule {}
