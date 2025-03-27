import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from '../controllers/dto/create-invoice.dto';
import { UpdateInvoiceDto } from '../controllers/dto/update-invoice.dto';
import { IInvoicesService } from './interfaces/invoice.service.interface';
import { InvoicesRepository } from '../repositories/invoices.repository';
import { UsersService } from 'src/users/services/users.service';
import { EmailService } from 'src/emails/emails.service';
import { ProductsService } from 'src/products/services/products.service';
import { Invoice } from '@prisma/client';

@Injectable()
export class InvoicesService implements IInvoicesService {
  constructor(
    private readonly invoiceRepository: InvoicesRepository,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly productsService: ProductsService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    let user = await this.usersService.findOneByEmail(createInvoiceDto.email);

    if (!user) {
      user = await this.usersService.create({
        name: createInvoiceDto.name,
        email: createInvoiceDto.email,
      });
    }

    const newInvoice = await this.invoiceRepository.create(
      {
        invoiceDetails: {
          create: createInvoiceDto.invoiceDetails,
        },
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

  async getInvoices(): Promise<Invoice[]> {
    return await this.invoiceRepository.findAll();
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
