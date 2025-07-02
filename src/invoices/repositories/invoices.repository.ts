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

  async findAllByUser(userId: number, code: string): Promise<Invoice[]> {
    return await this.prisma.invoice.findMany({
      where: {
        userId,
        user: {
          country: {
            code,
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
        invoiceEvents: {
          orderBy: {
            id: 'desc',
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

  async updateStatusEviada(invoiceURL: string, id: number): Promise<Invoice> {
    return await this.prisma.invoice.update({
      where: {
        id,
      },
      data: {
        invoiceURL,
        statusId: 2,
        updatedAt: new Date(),
      },
    });
  }

  async updateOtherStatus(id: number, statusId: number): Promise<Invoice> {
    return await this.prisma.invoice.update({
      where: {
        id,
      },
      data: {
        statusId,
        updatedAt: new Date(),
        totalAmount: statusId === 6 ? 0 : undefined,
      },
    });
  }

  async updateOtherStatusVendido(
    id: number,
    totalAmount: number,
  ): Promise<Invoice> {
    return await this.prisma.invoice.update({
      where: {
        id,
      },
      data: {
        statusId: 4,
        totalAmount,
        updatedAt: new Date(),
      },
    });
  }

  async invoiceGruopByDate(
    code: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    return await this.prisma.$queryRaw`
  SELECT 
    CAST(createdAt AS DATE) AS createdAt, 
    SUM(totalAmount) AS totalAmountSum,
    COUNT(*) AS totalCount
  FROM Invoice
  WHERE 
    createdAt BETWEEN ${startDate} AND ${endDate}
    AND userId IN (
      SELECT id FROM [User] WHERE countryId = (SELECT id FROM Country WHERE code = ${code})
    )
  GROUP BY CAST(createdAt AS DATE) 
  ORDER BY CAST(createdAt AS DATE) ASC;
`;
  }

  async totalInvoiceVendidoByDate(
    code: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    return await this.prisma.$queryRaw`
    SELECT 
      CAST(createdAt AS DATE) AS createdAt, -- Extract only the date part
      COUNT(*) AS totalCount -- Count the number of invoices
    FROM Invoice
    WHERE 
      createdAt BETWEEN ${startDate} AND ${endDate}
      AND statusId = (SELECT id FROM Status WHERE name = 'VENDIDO') -- Filter by VENDIDO status
      AND userId IN (
        SELECT id FROM [User] WHERE countryId = (SELECT id FROM Country WHERE code = ${code})
      )
    GROUP BY CAST(createdAt AS DATE) -- Group by the date part only
    ORDER BY CAST(createdAt AS DATE) ASC; -- Order by date
  `;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
