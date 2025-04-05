import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreateContactByCountryDto,
  IContactsRepository,
} from './interfaces/contact.repository.interfaces';
import { CreateContactDto } from '../controllers/dto/create-dto';
import { UpdateContactDto } from '../controllers/dto/update-dto';
import { Contact, Prisma } from '@prisma/client';

@Injectable()
export class ContactsRepository implements IContactsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    contact: Prisma.ContactCreateWithoutUserInput,
    userId: number,
  ): Promise<Contact> {
    return await this.prisma.contact.create({
      data: {
        ...contact,
        userId,
      },
    });
  }

  findAllContacts() {
    return this.prisma.contact.findMany({
      where: {
        contactType: {
          not: 'SERVICE',
        },
      },
    });
  }

  findAllServices() {
    return this.prisma.contact.findMany({
      where: {
        contactType: {
          not: 'CONTACT',
        },
      },
    });
  }

  findOneContact(id: number) {
    return this.prisma.contact.findUnique({
      where: { id },
    });
  }

  update(id: number, updateContactDto: UpdateContactDto) {
    return this.prisma.contact.update({
      where: { id },
      data: updateContactDto,
    });
  }

  remove(id: number) {
    return this.prisma.contact.delete({
      where: { id },
    });
  }
}
