import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { IContactsRepository } from './interfaces/contact.repository.interfaces';
import { CreateContactDto } from '../controllers/dto/create-dto';
import { UpdateContactDto } from '../controllers/dto/update-dto';

@Injectable()
export class ContactsRepository implements IContactsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    return await this.prisma.contact.create({
      data: createContactDto,
    });
  }

  findAll() {
    return this.prisma.contact.findMany();
  }

  findOne(id: number) {
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
