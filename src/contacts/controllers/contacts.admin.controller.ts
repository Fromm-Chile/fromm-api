import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ContactsService } from '../services/contacts.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('admin/contacts')
export class ContactsAdminController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get('/messages')
  getContacts(
    @Query('contactType') contactType: string,
    @Query('countryCode') code: string,
    @Query('page') page: number,
    @Query('status') status: string,
    @Query('name') name: string,
    @Query('limit') limit: number,
    @Query('idOrder') idOrder: string,
  ) {
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

  @Get('/messages/count')
  getContactsCount(
    @Query('countryCode') code: string,
    @Query('contactType') contactType: string,
  ) {
    return this.contactsService.getContactCount(code, contactType);
  }

  @Get(':id')
  findOneContact(@Param('id') id: string) {
    return this.contactsService.findOneContact(+id);
  }
}
