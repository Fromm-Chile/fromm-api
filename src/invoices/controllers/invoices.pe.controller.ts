import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoicesService } from '../services/invoices.service';
import { Country } from 'src/assets/enums';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@UseGuards(AuthGuard)
@Controller('pe/invoices')
export class InvoicesControllerPeru {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Public()
  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create({
      ...createInvoiceDto,
      countryId: Country.PE,
    });
  }
}
