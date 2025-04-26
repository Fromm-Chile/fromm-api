import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InvoicesService } from '../services/invoices.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Country } from 'src/assets/enums';

@UseGuards(AuthGuard)
@Controller('admin/invoices')
export class InvoicesAdminController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  getInvoices(
    @Query('countryCode') code: string,
    @Query('page') page: number,
    @Query('status') status: string,
    @Query('name') name: string,
    @Query('limit') limit: number,
  ) {
    return this.invoicesService.getInvoicesAdmin({
      code,
      page,
      status,
      name,
      limit,
    });
  }

  @Get(':id')
  getOneInvoice(@Param('id') id: string) {
    return this.invoicesService.getOneInvoice(+id);
  }

  @Get('datos/numeros')
  getData(@Query('countryCode') code: string) {
    return this.invoicesService.getInvoices(code);
  }

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.createByAdmin({
      ...createInvoiceDto,
      countryId: Country.CL,
    });
  }
}
