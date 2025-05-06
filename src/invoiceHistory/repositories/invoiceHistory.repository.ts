import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateInvoiceHistoryDto } from '../services/dto/create-invoiceHistory.dto';

@Injectable()
export class InvoiceHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInvoiceHistoryDto: CreateInvoiceHistoryDto) {
    return this.prisma.invoiceEventHistory.create({
      data: createInvoiceHistoryDto,
    });
  }

  async findAll() {
    return this.prisma.invoiceEventHistory.findMany();
  }

  async findOne(id: number) {
    return this.prisma.invoiceEventHistory.findUnique({
      where: { id },
    });
  }

  async remove(id: number) {
    return this.prisma.invoiceEventHistory.delete({
      where: { id },
    });
  }
}
