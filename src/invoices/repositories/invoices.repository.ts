import { Injectable } from '@nestjs/common';
import { IInvoiceRepository } from './interfaces/invoice.repository.interface';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma, Invoice } from '@prisma/client';
import { FilterInvoicesDto } from '../controllers/dto/filter-invoice.dto';
import { UpdateInvoiceDto } from '../controllers/dto/update-invoice.dto';

@Injectable()
export class InvoicesRepository implements IInvoiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    invoice: Prisma.InvoiceCreateWithoutUserInput,
    userId: number,
  ): Promise<Invoice> {
    return await this.prisma.invoice.create({
      data: {
        userId,
        invoiceDetails: invoice.invoiceDetails,
        message: invoice.message,
        statusId: 1,
      },
    });
  }

  async createByAdmin(
    invoice: Prisma.InvoiceCreateWithoutUserInput,
    userId: number,
  ): Promise<Invoice> {
    return await this.prisma.invoice.create({
      data: {
        userId,
        message: invoice.message,
        statusId: 1,
      },
    });
  }

  async totalCount(code: string): Promise<number> {
    return await this.prisma.invoice.count({
      where: {
        user: {
          country: {
            code,
          },
        },
      },
    });
  }

  async statusCount(code: string, status: string): Promise<number> {
    return await this.prisma.invoice.count({
      where: {
        user: {
          country: {
            code,
          },
        },
        statusR: {
          name: status,
        },
      },
    });
  }

  async findAllAdmin(filter: FilterInvoicesDto): Promise<Invoice[]> {
    return await this.prisma.invoice.findMany({
      skip: filter.page * 10 || 0,
      take: Number(filter.limit) || 10,
      orderBy: {
        id: (filter.idOrder as Prisma.SortOrder) || 'desc',
      },
      where: {
        statusR: {
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
        user: true,
        statusR: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findCountPages(filter: FilterInvoicesDto): Promise<number> {
    const count = await this.prisma.invoice.count({
      where: {
        statusR: {
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

  async findOne(id: number) {
    return await this.prisma.invoice.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          include: {
            country: true,
          },
        },
        invoiceDetails: true,
        statusR: {
          select: {
            name: true,
          },
        },
        invoiceEvents: {
          include: {
            adminUser: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async updateStatus(dto: UpdateInvoiceDto, id: number): Promise<Invoice> {
    return await this.prisma.invoice.update({
      where: {
        id,
      },
      data: {
        invoiceURL: dto.invoiceUrl,
        totalAmount: dto.totalAmount,
        statusId: dto.statusId,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
