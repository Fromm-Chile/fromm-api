import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ContactsService } from '../services/contacts.service';
import { CreateContactDto } from './dto/create-dto';
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
}
