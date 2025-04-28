import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InvoicesService } from '../services/invoices.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Country } from 'src/assets/enums';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

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
    @Query('idOrder') idOrder: string,
  ) {
    return this.invoicesService.getInvoicesAdmin({
      code,
      page,
      status,
      name,
      limit,
      idOrder,
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
  create(@Body() createInvoiceDto: CreateInvoiceDto, @Req() req: any) {
    const adminUserId = req.user.sub;
    return this.invoicesService.createByAdmin(
      {
        ...createInvoiceDto,
        countryId: Country.CL,
      },
      adminUserId,
    );
  }

  @Put()
  updateStatusEnviado(
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @Param('id') id: number,
  ) {
    return this.invoicesService.updateStatus(
      {
        invoiceUrl: updateInvoiceDto.invoiceUrl,
        totalAmount: null,
        statusId: 2,
      },
      id,
    );
  }
}
