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
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateInvoiceByCountryDto,
  CreateInvoiceByCountryDtoForAdmin,
} from '../services/interfaces/invoice.service.interface';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { FileSizeValidationPipe } from 'src/files/pipes/fileSizeValidationPipe';
import { FileTypeValidationPipe } from 'src/files/pipes/fileTypeValidationPipe';
import { GetInvoicesResponseDto } from './dto/response.dto';
import { instanceToPlain } from 'class-transformer';

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
  ): Promise<{ cotizaciones: GetInvoicesResponseDto[]; totalCount: number }> {
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
  getOneInvoice(@Param('id') id: string) {
    return this.invoicesService.getOneInvoice(+id);
  }

  @Roles('AdminChile', 'AdminPeru', 'UserChile', 'UserPeru')
  @Get('user/:id')
  getUserInvoices(@Param('id') id: string, @Query('countryCode') code: string) {
    return this.invoicesService.getInvoicesByUserId(+id, code);
  }

  @Roles('AdminChile', 'AdminPeru', 'UserChile', 'UserPeru')
  @Get('datos/numeros')
  getData(@Query('countryCode') code: string) {
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
        countryId: Country.CL,
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
      new FileTypeValidationPipe([
        // Documents
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        // Images
        'image/png',
        'image/jpeg',
        'image/gif',
        'image/bmp',
        'image/webp',
        // Accept all images
        'image/*',
      ]),
    )
    file: Express.Multer.File,
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
    return this.invoicesService.invoceGruopByDate(code, startDate, endDate);
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
}
