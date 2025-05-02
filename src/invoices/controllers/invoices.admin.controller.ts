import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InvoicesService } from '../services/invoices.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Country } from 'src/assets/enums';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateInvoiceByCountryDto } from '../services/interfaces/invoice.service.interface';

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

  @Get('user/:id')
  getUserInvoices(@Param('id') id: string, @Query('countryCode') code: string) {
    return this.invoicesService.getInvoicesByUserId(+id, code);
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

  @Post('invoice-from-contact')
  createFromInvoice(
    @Body('data') data: CreateInvoiceByCountryDto,
    @Body('contactId') contactId: number,
    @Req() req: any,
  ) {
    const adminUserId = req.user.sub;
    return this.invoicesService.createInvoiceFromContact(
      data,
      contactId,
      adminUserId,
    );
  }

  @Put('upload')
  @UseInterceptors(FileInterceptor('file'))
  updateStatusEnviado(
    @UploadedFile() file: Express.Multer.File,
    @Body('id') id: number,
    @Req() req: any,
    @Body('comment') comment: string,
  ) {
    const adminUserId = req.user.sub;
    return this.invoicesService.updateStatusEnviada(
      file,
      +id,
      adminUserId,
      comment,
    );
  }

  @Put('seguimiento')
  updateStatusSeguimiento(
    @Body('id') id: number,
    @Req() req: any,
    @Body('comment') comment: string,
  ) {
    const adminUserId = req.user.sub;
    return this.invoicesService.updateStatusSeguimiento(
      +id,
      adminUserId,
      comment,
    );
  }

  @Put('vendido')
  updateStatusVendido(
    @Body('id') id: number,
    @Req() req: any,
    @Body('comment') comment: string,
    @Body('totalAmount') totalAmount: number,
  ) {
    const adminUserId = req.user.sub;
    return this.invoicesService.updateStatusVendido(
      +id,
      adminUserId,
      comment,
      totalAmount,
    );
  }

  @Put('derivado')
  updateStatusDerivado(
    @Body('id') id: number,
    @Req() req: any,
    @Body('comment') comment: string,
  ) {
    const adminUserId = req.user.sub;
    return this.invoicesService.updateStatusDerivado(+id, adminUserId, comment);
  }

  @Put('perdido')
  updateStatusPerdido(
    @Body('id') id: number,
    @Req() req: any,
    @Body('comment') comment: string,
  ) {
    const adminUserId = req.user.sub;
    return this.invoicesService.updateStatusPerdido(+id, adminUserId, comment);
  }
}
