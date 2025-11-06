import { Injectable } from '@nestjs/common';
import { InvoiceHistoryRepository } from '../repositories/invoiceHistory.repository';
import { CreateInvoiceHistoryDto } from '../dto/create-invoiceHistory.dto';
import { InvoiceEventHistory } from '@prisma/client';

@Injectable()
export class InvoiceHistoryService {
  constructor(
    private readonly invoiceHistoryRepository: InvoiceHistoryRepository,
  ) {}

  create(
    createInvoiceHistoryDto: CreateInvoiceHistoryDto,
  ): Promise<InvoiceEventHistory> {
    return this.invoiceHistoryRepository.create(createInvoiceHistoryDto);
  }

  findAll(): Promise<InvoiceEventHistory[]> {
    return this.invoiceHistoryRepository.findAll();
  }

  findOne(id: number): Promise<InvoiceEventHistory | null> {
    return this.invoiceHistoryRepository.findOne(id);
  }

  remove(id: number): Promise<InvoiceEventHistory> {
    return this.invoiceHistoryRepository.remove(id);
  }
}
