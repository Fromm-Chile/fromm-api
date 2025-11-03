import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { IContactsRepository } from '../interfaces/contact.repository.interfaces';
import { UpdateContactDto } from '../dto/update-dto';
import { Contact, Prisma } from '@prisma/client';
import { FilterContactDto } from '../dto/filter-contact-dto';

@Injectable()
export class ContactsRepository implements IContactsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    contact: Prisma.ContactCreateWithoutUserInput,
    userId: number,
  ): Promise<Contact> {
    return this.prisma.contact.create({
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

  statusCount(
    code: string,
    status: string,
    contactType: string,
  ): Promise<number> {
    return this.prisma.contact.count({
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

  totalCount(code: string, contactType: string): Promise<number> {
    return this.prisma.contact.count({
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

  findAllContacts(filter: FilterContactDto): Promise<Contact[]> {
    return this.prisma.contact.findMany({
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

  findOneContact(id: number) {
    return this.prisma.contact.findUnique({
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

  findContactsByUserId(userId: number, code: string): Promise<Contact[]> {
    return this.prisma.contact.findMany({
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

  update(id: number, updateContactDto: UpdateContactDto): Promise<Contact> {
    return this.prisma.contact.update({
      where: { id },
      data: {
        ...updateContactDto,
        updatedAt: new Date(),
      },
    });
  }

  updateStatus(id: number, statusId: number): Promise<Contact> {
    return this.prisma.contact.update({
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

  updateContactType(id: number): Promise<Contact> {
    return this.prisma.contact.update({
      where: { id },
      data: {
        contactType: 'SERVICE',
        updatedAt: new Date(),
      },
    });
  }

  updateStatusDerivado(id: number, message: string): Promise<Contact> {
    return this.prisma.contact.update({
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

  remove(id: number): Promise<Contact> {
    return this.prisma.contact.delete({
      where: { id },
    });
  }
}
