import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ContactsService } from '../services/contacts.service';
import { CreateContactDto } from './dto/create-dto';
import { UpdateContactDto } from './dto/update-dto';
import { Country } from 'src/assets/enums';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@UseGuards(AuthGuard)
@Controller('pe/contacts')
export class ContactsControllerPeru {
  constructor(private readonly contactsService: ContactsService) {}

  @Public()
  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create({
      ...createContactDto,
      countryId: Country.PE,
    });
  }

  // @Get('/messages')
  // getContacts() {
  //   return this.contactsService.getAllContacts();
  // }

  // @Get('/services')
  // getServices() {
  //   return this.contactsService.getAllServices();
  // }

  // @Get(':id')
  // findOneContact(@Param('id') id: string) {
  //   return this.contactsService.findOneContact(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
  //   return this.contactsService.update(+id, updateContactDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.contactsService.remove(+id);
  // }
}
