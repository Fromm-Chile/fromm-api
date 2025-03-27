import { Injectable } from '@nestjs/common';
import { IInvoiceRepository } from './interfaces/invoice.repository.interface';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma, Invoice } from '@prisma/client';

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
      },
    });
  }

  async findAll(): Promise<Invoice[]> {
    return await this.prisma.invoice.findMany({
      include: {
        user: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.invoice.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        invoiceDetails: true,
      },
    });
  }

  update(id: number) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
