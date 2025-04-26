import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from '../controllers/dto/create-invoice.dto';
import { UpdateInvoiceDto } from '../controllers/dto/update-invoice.dto';
import {
  CreateInvoiceByCountryDto,
  IInvoicesService,
} from './interfaces/invoice.service.interface';
import { InvoicesRepository } from '../repositories/invoices.repository';
import { UsersService } from 'src/users/services/users.service';
import { EmailService } from 'src/emails/emails.service';
import { ProductsService } from 'src/products/services/products.service';
import { Invoice } from '@prisma/client';
import { FilterInvoicesDto } from '../controllers/dto/filter-invoice.dto';

@Injectable()
export class InvoicesService implements IInvoicesService {
  constructor(
    private readonly invoiceRepository: InvoicesRepository,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceByCountryDto) {
    let user = await this.usersService.findOneByEmail(
      createInvoiceDto.email,
      createInvoiceDto.countryId,
    );

    if (!user) {
      user = await this.usersService.create({
        name: createInvoiceDto.name,
        email: createInvoiceDto.email,
        phone: createInvoiceDto.phone,
        company: createInvoiceDto.company,
        countryId: createInvoiceDto.countryId,
      });
    }

    const newInvoice = await this.invoiceRepository.create(
      {
        invoiceDetails: {
          create: createInvoiceDto.invoiceDetails,
        },
        message: createInvoiceDto.message,
      },
      user.id,
    );

    await this.emailService.sendInvoiceConfirmationUser(
      user,
      createInvoiceDto,
      newInvoice.id,
    );

    await this.emailService.sendInvoiceDetails(createInvoiceDto, newInvoice.id);

    return newInvoice;
  }

  async createByAdmin(createInvoiceDto: CreateInvoiceByCountryDto) {
    let user = await this.usersService.findOneByEmail(
      createInvoiceDto.email,
      createInvoiceDto.countryId,
    );

    if (!user) {
      user = await this.usersService.create({
        name: createInvoiceDto.name,
        email: createInvoiceDto.email,
        phone: createInvoiceDto.phone,
        company: createInvoiceDto.company,
        countryId: createInvoiceDto.countryId,
      });
    }

    const newInvoice = await this.invoiceRepository.createByAdmin(
      {
        message: createInvoiceDto.message,
      },
      user.id,
    );

    return newInvoice;
  }

  async getInvoices(code: string): Promise<any> {
    const invoices = await this.invoiceRepository.findAll(code);
    const totalInvoices = invoices.length;
    const pendingInvoices = invoices.filter(
      (invoice) => invoice.statusR.name === 'PENDIENTE',
    ).length;
    const soldInvoices = invoices.filter(
      (invoice) => invoice.statusR.name === 'VENDIDO',
    ).length;

    return {
      totalInvoices,
      pendingInvoices,
      soldInvoices,
    };
  }

  async getInvoicesAdmin(filter: FilterInvoicesDto): Promise<{
    cotizaciones: Invoice[];
    totalPages: number;
  }> {
    const invoices = await this.invoiceRepository.findAllAdmin(filter);

    const totalPages = await this.invoiceRepository.findCountPages(filter);

    return { cotizaciones: invoices, totalPages };
  }

  getOneInvoice(id: number) {
    return this.invoiceRepository.findOne(id);
  }

  update(id: number, updateProductDto: UpdateInvoiceDto) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
