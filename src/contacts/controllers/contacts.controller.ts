import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ContactsService } from '../services/contacts.service';
import { CreateContactDto } from './dto/create-dto';
import { UpdateContactDto } from './dto/update-dto';
import { Country } from 'src/assets/enums';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create({
      ...createContactDto,
      countryId: Country.CL,
    });
  }

  @Get('/messages')
  getContacts() {
    return this.contactsService.getAllContacts();
  }

  @Get('/services')
  getServices() {
    return this.contactsService.getAllServices();
  }

  @Get(':id')
  findOneContact(@Param('id') id: string) {
    return this.contactsService.findOneContact(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactsService.update(+id, updateContactDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(+id);
  }
}
