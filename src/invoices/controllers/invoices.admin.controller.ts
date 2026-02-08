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
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateInvoiceByCountryDtoForAdmin } from '../interfaces/invoice.service.interface';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { FileSizeValidationPipe } from 'src/files/pipes/fileSizeValidationPipe';
import { FileTypeValidationPipe } from 'src/files/pipes/fileTypeValidationPipe';
import { GetInvoicesResponseDto } from '../dto/get-invoices-response.dto';
import { instanceToPlain } from 'class-transformer';
import { FILE_FORMATS } from 'src/assets/constants';
import { GetInvoicesAndCountResponseDto } from '../dto/get-invoices-and-count-response.dto';
import { Contact, Invoice } from '@prisma/client';
import { GetInvoicesAndContactsResponseDto } from '../dto/get-user-invoices-contacts.dto';

@UseGuards(AuthGuard)
@Controller('admin/invoices')
export class InvoicesAdminController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Roles('AdminChile', 'AdminPeru', 'UserChile', 'UserPeru')
  @Get()
  async getInvoices(
    @Query('countryCode') code: string,
    @Query('page') page: number,
    @Query('status') status: string,
    @Query('name') name: string,
    @Query('limit') limit: number,
    @Query('idOrder') idOrder: string,
  ): Promise<GetInvoicesAndCountResponseDto> {
    const result = await this.invoicesService.getInvoicesAdmin({
      code,
      page,
      status,
      name,
      limit,
      idOrder,
    });

    return {
      cotizaciones: instanceToPlain(
        result.cotizaciones.map((item) => new GetInvoicesResponseDto(item)),
        {
          excludeExtraneousValues: true,
        },
      ) as GetInvoicesResponseDto[],
      totalCount: result.totalPages,
    };
  }

  @Roles('AdminChile', 'AdminPeru', 'UserChile', 'UserPeru')
  @Get(':id')
  getOneInvoice(@Param('id') id: string): Promise<Invoice> {
    return this.invoicesService.getOneInvoice(+id);
  }

  @Roles('AdminChile', 'AdminPeru', 'UserChile', 'UserPeru')
  @Get('user/:id')
  getUserInvoicesAndContacts(
    @Param('id') id: string,
    @Query('countryCode') code: string,
  ): Promise<GetInvoicesAndContactsResponseDto> {
    return this.invoicesService.getInvoicesAndContactsByUserId(+id, code);
  }

  @Roles('AdminChile', 'AdminPeru', 'UserChile', 'UserPeru')
  @Get('datos/numeros')
  getData(@Query('countryCode') code: string): Promise<any> {
    return this.invoicesService.getInvoices(code);
  }

  @Roles('AdminChile', 'AdminPeru')
  @Post()
  create(
    @Body() createInvoiceDto: CreateInvoiceByCountryDtoForAdmin,
    @Req() req: any,
  ) {
    const adminUserId = req.user.sub;
    return this.invoicesService.createByAdmin(
      {
        ...createInvoiceDto,
      },
      adminUserId,
    );
  }

  @Roles('AdminChile', 'AdminPeru')
  @Post('invoice-from-contact')
  createFromInvoice(
    @Body('data') data: CreateInvoiceByCountryDtoForAdmin,
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

  @Roles('AdminChile', 'AdminPeru')
  @Put('upload')
  @UseInterceptors(FileInterceptor('file'))
  updateStatusEnviado(
    @UploadedFile(
      new FileSizeValidationPipe(),
      new FileTypeValidationPipe(FILE_FORMATS),
    )
    file: Express.Multer.File,
    @Body('id') id: number,
    @Req() req: any,
    @Body('comment') comment: string,
  ): Promise<Invoice> {
    const adminUserId = req.user.sub;
    return this.invoicesService.updateStatusEnviada(
      file,
      +id,
      adminUserId,
      comment,
    );
  }

  @Roles('AdminChile', 'AdminPeru')
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

  @Roles('AdminChile', 'AdminPeru')
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

  @Roles('AdminChile', 'AdminPeru')
  @Put('new/amount')
  updateAmount(
    @Body('id') id: number,
    @Req() req: any,
    @Body('comment') comment: string,
    @Body('totalAmount') totalAmount: number,
  ) {
    const adminUserId = req.user.sub;
    return this.invoicesService.updateAmount(
      +id,
      adminUserId,
      comment,
      totalAmount,
    );
  }

  @Roles('AdminChile', 'AdminPeru')
  @Put('derivado')
  updateStatusDerivado(
    @Body('id') id: number,
    @Req() req: any,
    @Body('comment') comment: string,
  ) {
    const adminUserId = req.user.sub;
    return this.invoicesService.updateStatusDerivado(+id, adminUserId, comment);
  }

  @Roles('AdminChile', 'AdminPeru')
  @Put('perdido')
  updateStatusPerdido(
    @Body('id') id: number,
    @Req() req: any,
    @Body('comment') comment: string,
  ) {
    const adminUserId = req.user.sub;
    return this.invoicesService.updateStatusPerdido(+id, adminUserId, comment);
  }

  @Roles('AdminChile', 'AdminPeru', 'UserChile', 'UserPeru')
  @Get('montos/fechas')
  getResults(
    @Query('countryCode') code: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return this.invoicesService.invoceGroupByDate(code, startDate, endDate);
  }

  @Roles('AdminChile', 'AdminPeru', 'UserChile', 'UserPeru')
  @Get('ventas/fechas')
  getResultsTotal(
    @Query('countryCode') code: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return this.invoicesService.totalInvoiceVendidoByDate(
      code,
      startDate,
      endDate,
    );
  }

  @Roles('AdminChile')
  @Get('excel/data')
  getExcelData() {
    return this.invoicesService.dataExcel();
  }

  @Roles('AdminChile')
  @Get('excel/data/products')
  getExcelDataProducts() {
    return this.invoicesService.dataExcelProducts();
  }
}
