import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ContactsService } from '../services/contacts.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(AuthGuard)
@Controller('admin/contacts')
export class ContactsAdminController {
  constructor(private readonly contactsService: ContactsService) {}

  @Roles(
    'AdminChile',
    'AdminPeru',
    'ServicioChile',
    'ServicioPeru',
    'UserChile',
    'UserPeru',
  )
  @Get('/messages')
  async getContacts(
    @Query('contactType') contactType: string,
    @Query('countryCode') code: string,
    @Query('page') page: number,
    @Query('status') status: string,
    @Query('name') name: string,
    @Query('limit') limit: number,
    @Query('idOrder') idOrder: string,
  ) {
    return await this.contactsService.getAllContacts({
      contactType,
      code,
      page,
      status,
      name,
      limit,
      idOrder,
    });
  }

  @Roles('AdminChile', 'AdminPeru', 'UserChile', 'UserPeru')
  @Get('/messages/user')
  async getContactsByUserId(
    @Param('id') id: number,
    @Query('countryCode') code: string,
  ) {
    return await this.contactsService.getAllContactsByUserId(+id, code);
  }

  @Roles(
    'AdminChile',
    'AdminPeru',
    'ServicioChile',
    'ServicioPeru',
    'UserChile',
    'UserPeru',
  )
  @Get('/messages/count')
  async getContactsCount(
    @Query('countryCode') code: string,
    @Query('contactType') contactType: string,
  ) {
    return await this.contactsService.getContactCount(code, contactType);
  }

  @Roles(
    'AdminChile',
    'AdminPeru',
    'ServicioChile',
    'ServicioPeru',
    'UserChile',
    'UserPeru',
  )
  @Get(':id')
  async findOneContact(@Param('id') id: string) {
    return await this.contactsService.findOneContact(+id);
  }

  @Roles('AdminChile', 'AdminPeru')
  @Put()
  async updateContactType(@Body('id') id: number) {
    return await this.contactsService.updateContactType(+id);
  }

  @Roles('AdminChile', 'AdminPeru')
  @Put('/derivado')
  async updateStatusDerivado(
    @Body('id') id: number,
    @Body('department') department: string,
  ) {
    return await this.contactsService.updateStatusDerivado(+id, department);
  }

  @Roles('AdminChile', 'AdminPeru', 'ServicioChile')
  @Put('/finalizado')
  async updateStatusFinalizado(@Body('id') id: number) {
    return await this.contactsService.updateStatus(+id, 9);
  }
}
