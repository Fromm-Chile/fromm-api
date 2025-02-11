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

  findAll() {
    return 'This action returns all invoices';
  }

  findOne(id: number) {
    return `This action returns a #${id} invoice`;
  }

  update(id: number) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
