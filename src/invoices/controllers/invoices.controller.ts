import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoicesService } from '../services/invoices.service';
import { Country } from 'src/assets/enums';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create({
      ...createInvoiceDto,
      countryId: Country.CL,
    });
  }

  @Get()
  getInvoices() {
    return this.invoicesService.getInvoices();
  }

  @Get(':id')
  getOneInvoice(@Param('id') id: string) {
    return this.invoicesService.getOneInvoice(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoicesService.update(+id, updateInvoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoicesService.remove(+id);
  }
}
