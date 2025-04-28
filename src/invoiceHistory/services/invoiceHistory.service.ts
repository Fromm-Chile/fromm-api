import { Injectable } from '@nestjs/common';
import { InvoiceHistoryRepository } from '../repositories/invoiceHistory.repository';
import { CreateInvoiceHistoryDto } from './dto/create-invoiceHistory.dto';

@Injectable()
export class InvoiceHistoryService {
  constructor(
    private readonly invoiceHistoryRepository: InvoiceHistoryRepository,
  ) {}

  create(createInvoiceHistoryDto: CreateInvoiceHistoryDto) {
    return this.invoiceHistoryRepository.create(createInvoiceHistoryDto);
  }

  findAll() {
    return this.invoiceHistoryRepository.findAll();
  }

  findOne(id: number) {
    return this.invoiceHistoryRepository.findOne(id);
  }

  remove(id: number) {
    return this.invoiceHistoryRepository.remove(id);
  }
}
