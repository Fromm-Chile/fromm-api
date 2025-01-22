import { CreateInvoiceDto } from "src/invoices/controllers/dto/create-invoice.dto";
import { UpdateInvoiceDto } from "src/invoices/controllers/dto/update-invoice.dto";
import { InvoiceEntity } from "src/invoices/repositories/entities/invoice.entity";

export interface IInvoicesService {
  create(createInvoiceDto: CreateInvoiceDto): string;
  findAll(): InvoiceEntity[];
  findOne(id: number): string;
  update(id: number, updateInvoiceDto: UpdateInvoiceDto): string;
  remove(id: number): string;
}