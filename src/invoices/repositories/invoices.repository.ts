import { Injectable } from "@nestjs/common";
import { CreateInvoiceDto } from "../controllers/dto/create-invoice.dto";
import { UpdateInvoiceDto } from "../controllers/dto/update-invoice.dto";
import { InvoiceEntity } from "./entities/invoice.entity";
import { IInvoiceRepository } from "./interfaces/invoice.repository.interface";

@Injectable()
export class InvoicesRepository implements IInvoiceRepository {
  create(createInvoiceDto: CreateInvoiceDto) {
    return 'This action adds a new invoice';
  }

  findAll(): InvoiceEntity[] {
    return 
  }

  findOne(id: number) {
    return `This action returns a #${id} invoice`;
  }

  update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}