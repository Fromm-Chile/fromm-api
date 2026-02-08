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
import { Contact } from '@prisma/client';
import { ContactsCountResponseDto } from '../dto/contactsCount-response.dto';
import { Status } from 'src/assets/enums';
import { GetContactsResponseDto } from '../dto/getContacts-response.dto';

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
  getContacts(
    @Query('contactType') contactType: string,
    @Query('countryCode') code: string,
    @Query('page') page: number,
    @Query('status') status: string,
    @Query('name') name: string,
    @Query('limit') limit: number,
    @Query('idOrder') idOrder: string,
  ): Promise<GetContactsResponseDto> {
    return this.contactsService.getAllContacts({
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
  ): Promise<Contact[]> {
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
  getContactsCount(
    @Query('countryCode') code: string,
    @Query('contactType') contactType: string,
  ): Promise<ContactsCountResponseDto> {
    return this.contactsService.getContactCount(code, contactType);
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
  findOneContact(@Param('id') id: string): Promise<Contact> {
    return this.contactsService.findOneContact(+id);
  }

  @Roles('AdminChile', 'AdminPeru')
  @Put()
  updateContactType(@Body('id') id: number): Promise<Contact> {
    return this.contactsService.updateContactType(+id);
  }

  @Roles('AdminChile', 'AdminPeru')
  @Put('/derivado')
  updateStatusDerivado(
    @Body('id') id: number,
    @Body('department') department: string,
  ): Promise<Contact> {
    return this.contactsService.updateStatusDerivado(+id, department);
  }

  @Roles('AdminChile', 'AdminPeru', 'ServicioChile')
  @Put('/finalizado')
  updateStatusFinalizado(@Body('id') id: number): Promise<Contact> {
    return this.contactsService.updateStatus(+id, Status.FINALIZADO);
  }
}
