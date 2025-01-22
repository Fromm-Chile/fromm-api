import { Injectable } from "@nestjs/common";
import { CreateInvoiceDto } from "../controllers/dto/create-invoice.dto";
import { UpdateInvoiceDto } from "../controllers/dto/update-invoice.dto";
import { IInvoicesService } from "./interfaces/invoice.service.interface";
import { InvoicesRepository } from "../repositories/invoices.repository";

@Injectable()
export class InvoicesService implements IInvoicesService {
  constructor(private readonly invoiceRepository: InvoicesRepository) {}
  create(createInvoiceDto: CreateInvoiceDto) {
    return 'This action adds a new invoice';
  }

  findAll() {
    return this.invoiceRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} invoice`;
  }

  update(id: number, updateProductDto: UpdateInvoiceDto) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}