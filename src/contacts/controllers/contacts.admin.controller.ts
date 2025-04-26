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
    @Query('countryCode') countryCode: string,
  ) {
    return this.contactsService.getAllContacts(contactType, countryCode);
  }

  @Get(':id')
  findOneContact(@Param('id') id: string) {
    return this.contactsService.findOneContact(+id);
  }
}
