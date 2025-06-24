import { Injectable } from '@nestjs/common';
import {
  CreateInvoiceByCountryDto,
  CreateInvoiceByCountryDtoForAdmin,
  IInvoicesService,
} from './interfaces/invoice.service.interface';
import { InvoicesRepository } from '../repositories/invoices.repository';
import { UsersService } from 'src/users/services/users.service';
import { EmailService } from 'src/emails/emails.service';
import { Invoice } from '@prisma/client';
import { FilterInvoicesDto } from '../controllers/dto/filter-invoice.dto';
import { InvoiceHistoryService } from 'src/invoiceHistory/services/invoiceHistory.service';
import { FilesService } from 'src/files/services/files.service';
import { ContactsService } from 'src/contacts/services/contacts.service';

@Injectable()
export class InvoicesService implements IInvoicesService {
  constructor(
    private readonly invoiceRepository: InvoicesRepository,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly invoiceHistoryService: InvoiceHistoryService,
    private readonly filesService: FilesService,
    private readonly contactsService: ContactsService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceByCountryDto): Promise<Invoice> {
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
    createInvoiceDto: CreateInvoiceByCountryDtoForAdmin,
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

  async createInvoiceFromContact(
    createInvoiceDto: CreateInvoiceByCountryDto,
    contactId: number,
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

    const newInvoice = await this.invoiceRepository.create(
      {
        message: createInvoiceDto.message,
      },
      user.id,
    );

    await this.contactsService.updateStatus(contactId, 7);

    await this.invoiceHistoryService.create({
      invoiceId: newInvoice.id,
      adminUserId,
      status: 'PENDIENTE',
      comment: 'Cotización creada por el administrador',
    });

    return newInvoice;
  }

  async getInvoices(code: string) {
    const totalCount = await this.invoiceRepository.totalCount(code);
    const pendingInvoices = await this.invoiceRepository.statusCount(
      code,
      'PENDIENTE',
    );
    const sendInvoices = await this.invoiceRepository.statusCount(
      code,
      'ENVIADA',
    );
    return {
      totalCount,
      pendingInvoices,
      sendInvoices,
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

  async getInvoicesByUserId(id: number, code: string) {
    const invoices = await this.invoiceRepository.findAllByUser(+id, code);
    const contacts = await this.contactsService.getAllContactsByUserId(
      +id,
      code,
    );
    return { invoices, contacts };
  }

  async getOneInvoice(id: number) {
    return await this.invoiceRepository.findOne(id);
  }

  async updateStatusEnviada(
    file: Express.Multer.File,
    id: number,
    adminUserId: number,
    comment: string,
  ) {
    const invoiceUrl = await this.filesService.uploadFile(file, id);
    await this.invoiceHistoryService.create({
      invoiceId: id,
      adminUserId,
      status: 'ENVIADA',
      comment: comment || 'Cotización enviada por el administrador',
    });
    return await this.invoiceRepository.updateStatusEviada(invoiceUrl.url, id);
  }

  async updateStatusSeguimiento(
    id: number,
    adminUserId: number,
    comment: string,
  ) {
    await this.invoiceHistoryService.create({
      invoiceId: id,
      adminUserId,
      status: 'SEGUIMIENTO',
      comment: comment,
    });
    return await this.invoiceRepository.updateOtherStatus(id, 3);
  }
  async updateStatusVendido(
    id: number,
    adminUserId: number,
    comment: string,
    totalAmount: number,
  ) {
    await this.invoiceHistoryService.create({
      invoiceId: id,
      adminUserId,
      status: 'VENDIDO',
      comment: comment || 'Cotización vendida por el administrador',
    });
    return await this.invoiceRepository.updateOtherStatusVendido(
      id,
      totalAmount,
    );
  }
  async updateStatusPerdido(id: number, adminUserId: number, comment: string) {
    await this.invoiceHistoryService.create({
      invoiceId: id,
      adminUserId,
      status: 'PERDIDO',
      comment: comment,
    });
    return await this.invoiceRepository.updateOtherStatus(id, 6);
  }

  async updateStatusDerivado(id: number, adminUserId: number, comment: string) {
    await this.invoiceHistoryService.create({
      invoiceId: id,
      adminUserId,
      status: 'DERIVADO',
      comment: comment || 'Cotización derivada a la Gerencia Comercial',
    });
    return await this.invoiceRepository.updateOtherStatus(id, 5);
  }

  async invoceGruopByDate(
    code: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    const invoices = await this.invoiceRepository.invoiceGruopByDate(
      code,
      startDate,
      endDate,
    );

    const cotizacionesTotales = invoices.reduce(
      (acc: number, invoice: { totalCount: number }) =>
        acc + invoice.totalCount,
      0,
    );

    const montoTotal = invoices.reduce(
      (acc: number, invoice: { totalAmountSum: number }) =>
        acc + invoice.totalAmountSum,
      0,
    );
    return {
      invoices,
      cotizacionesTotales,
      montoTotal,
    };
  }

  async totalInvoiceVendidoByDate(
    code: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const invoices = await this.invoiceRepository.totalInvoiceVendidoByDate(
      code,
      startDate,
      endDate,
    );

    const cotizacionesVendidas = invoices.reduce(
      (acc: number, invoice: { totalCount: number }) =>
        acc + invoice.totalCount,
      0,
    );

    return cotizacionesVendidas;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
