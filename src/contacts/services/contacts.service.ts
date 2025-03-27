import { Injectable } from '@nestjs/common';
import { ContactsRepository } from '../repositories/contacts.repository';
import { CreateContactDto } from '../controllers/dto/create-dto';
import { UpdateContactDto } from '../controllers/dto/update-dto';
import { UsersService } from '../../users/services/users.service';
import { EmailService } from 'src/emails/emails.service';

@Injectable()
export class ContactsService {
  constructor(
    private readonly contactsRepository: ContactsRepository,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  async create(createContactDto: CreateContactDto) {
    let user = await this.usersService.findOneByEmail(createContactDto.email);

    if (!user) {
      user = await this.usersService.create({
        email: createContactDto.email,
        name: createContactDto.name,
        phone: createContactDto.phone,
        company: createContactDto.company,
      });
    }
    const newContact = await this.contactsRepository.create({
      ...createContactDto,
      userId: user.id,
    });

    await this.emailService.sendContactEmail(createContactDto, newContact.id);

    await this.emailService.sendContactConfirmationUser(user, newContact.id);

    return newContact;
  }

  getAllContacts() {
    return this.contactsRepository.findAllContacts();
  }

  getAllServices() {
    return this.contactsRepository.findAllServices();
  }

  findOneContact(id: number) {
    return this.contactsRepository.findOneContact(id);
  }

  update(id: number, updateContactDto: UpdateContactDto) {
    return this.contactsRepository.update(id, updateContactDto);
  }

  remove(id: number) {
    return this.contactsRepository.remove(id);
  }
}
