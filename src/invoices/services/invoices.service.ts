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
import { InvoiceHistoryService } from 'src/invoiceHistory/services/invoiceHistory.service';

@Injectable()
export class InvoicesService implements IInvoicesService {
  constructor(
    private readonly invoiceRepository: InvoicesRepository,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly invoiceHistoryService: InvoiceHistoryService,
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

    await this.invoiceHistoryService.create({
      invoiceId: newInvoice.id,
      adminUserId: null,
      status: 'PENDIENTE',
      comment: 'Cotización creada por el usuario',
    });

    await this.emailService.sendInvoiceConfirmationUser(
      user,
      createInvoiceDto,
      newInvoice.id,
    );

    await this.emailService.sendInvoiceDetails(createInvoiceDto, newInvoice.id);

    return newInvoice;
  }

  async createByAdmin(
    createInvoiceDto: CreateInvoiceByCountryDto,
    adminUserId: number,
  ) {
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

    await this.invoiceHistoryService.create({
      invoiceId: newInvoice.id,
      adminUserId,
      status: 'PENDIENTE',
      comment: 'Cotización creada por el administrador',
    });

    return newInvoice;
  }

  async getInvoices(code: string): Promise<any> {
    const totalCount = await this.invoiceRepository.totalCount(code);
    const pendingInvoices = await this.invoiceRepository.statusCount(
      code,
      'PENDIENTE',
    );
    const soldInvoices = await this.invoiceRepository.statusCount(
      code,
      'VENDIDO',
    );
    return {
      totalCount,
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

  async getOneInvoice(id: number) {
    return await this.invoiceRepository.findOne(id);
  }

  async updateStatus(updateInvoiceDto: UpdateInvoiceDto, id: number) {
    return await this.invoiceRepository.updateStatus(updateInvoiceDto, id);
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
