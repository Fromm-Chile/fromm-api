import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { IContactsRepository } from './interfaces/contact.repository.interfaces';
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
        status: {
          connect: {
            id: 1,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  findAllContacts(contactType: string, code: string) {
    return this.prisma.contact.findMany({
      where: {
        contactType,
        user: {
          country: {
            code,
          },
        },
      },
      include: {
        status: true,
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
