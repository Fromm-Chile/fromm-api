import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { IContactsRepository } from './interfaces/contact.repository.interfaces';
import { UpdateContactDto } from '../controllers/dto/update-dto';
import { Contact, Prisma } from '@prisma/client';
import { FilterContactDto } from '../controllers/dto/filter-contact-dto';

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

  async statusCount(
    code: string,
    status: string,
    contactType: string,
  ): Promise<number> {
    return await this.prisma.contact.count({
      where: {
        contactType,
        user: {
          country: {
            code,
          },
        },
        status: {
          name: status,
        },
      },
    });
  }

  async totalCount(code: string, contactType: string): Promise<number> {
    return await this.prisma.contact.count({
      where: {
        contactType,
        user: {
          country: {
            code,
          },
        },
      },
    });
  }

  async findAllContacts(filter: FilterContactDto): Promise<Contact[]> {
    return await this.prisma.contact.findMany({
      skip: filter.page * 10 || 0,
      take: Number(filter.limit) || 10,
      orderBy: {
        id: (filter.idOrder as Prisma.SortOrder) || 'desc',
      },
      where: {
        contactType: filter.contactType,
        status: {
          name: filter.status,
        },
        user: {
          country: {
            code: filter.code,
          },
          name: {
            contains: filter.name,
          },
        },
      },
      include: {
        status: true,
      },
    });
  }

  async findCountPages(filter: FilterContactDto): Promise<number> {
    const count = await this.prisma.contact.count({
      where: {
        status: {
          name: filter.status,
        },
        user: {
          country: {
            code: filter.code,
          },
          name: {
            contains: filter.name,
          },
        },
      },
    });
    return Math.ceil(count / 10);
  }

  async findOneContact(id: number) {
    return await this.prisma.contact.findUnique({
      where: { id },
      include: {
        status: true,
        user: {
          include: {
            country: true,
          },
        },
      },
    });
  }

  async findContactsByUserId(userId: number, code: string): Promise<Contact[]> {
    return await this.prisma.contact.findMany({
      where: {
        userId,
        user: {
          country: {
            code,
          },
        },
      },
      include: {
        status: true,
        user: {
          include: {
            country: true,
          },
        },
      },
    });
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    return await this.prisma.contact.update({
      where: { id },
      data: {
        ...updateContactDto,
        updatedAt: new Date(),
      },
    });
  }

  async updateStatus(id: number, statusId: number) {
    return await this.prisma.contact.update({
      where: { id },
      data: {
        status: {
          connect: {
            id: statusId,
          },
        },
        updatedAt: new Date(),
      },
    });
  }

  async updateContactType(id: number) {
    return await this.prisma.contact.update({
      where: { id },
      data: {
        contactType: 'SERVICE',
        updatedAt: new Date(),
      },
    });
  }

  async updateStatusDerivado(id: number, message: string) {
    return await this.prisma.contact.update({
      where: { id },
      data: {
        status: {
          connect: {
            id: 5,
          },
        },
        message,
        updatedAt: new Date(),
      },
    });
  }

  remove(id: number) {
    return this.prisma.contact.delete({
      where: { id },
    });
  }
}
