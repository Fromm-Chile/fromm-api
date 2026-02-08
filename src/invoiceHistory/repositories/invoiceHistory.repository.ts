import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateInvoiceHistoryDto } from '../dto/create-invoiceHistory.dto';
import { InvoiceEventHistory } from '@prisma/client';

@Injectable()
export class InvoiceHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    createInvoiceHistoryDto: CreateInvoiceHistoryDto,
  ): Promise<InvoiceEventHistory> {
    return this.prisma.invoiceEventHistory.create({
      data: createInvoiceHistoryDto,
    });
  }

  findAll(): Promise<InvoiceEventHistory[]> {
    return this.prisma.invoiceEventHistory.findMany();
  }

  findOne(id: number): Promise<InvoiceEventHistory | null> {
    return this.prisma.invoiceEventHistory.findUnique({
      where: { id },
    });
  }

  remove(id: number): Promise<InvoiceEventHistory> {
    return this.prisma.invoiceEventHistory.delete({
      where: { id },
    });
  }
}
