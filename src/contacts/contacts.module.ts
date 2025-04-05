import { Module } from '@nestjs/common';
import { ContactsService } from './services/contacts.service';
import { ContactsController } from './controllers/contacts.controller';
import { ContactsRepository } from './repositories/contacts.repository';
import { UsersModule } from 'src/users/users.module';
import { EmailModule } from 'src/emails/emails.module';
import { ContactsControllerPeru } from './controllers/contacts.pe.controller';

@Module({
  controllers: [ContactsController, ContactsControllerPeru],
  providers: [ContactsService, ContactsRepository],
  imports: [UsersModule, EmailModule],
})
export class ContactsModule {}
