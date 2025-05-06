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
import { UsersAdminService } from '../services/usersAdmin.service';
import { CreateUserAdminDto } from './dto/create-userAdmin.dto';
import { UpdateUserAdminDto } from './dto/update-userAdmin.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('users-admin')
export class UsersAdminController {
  constructor(private readonly usersAdminService: UsersAdminService) {}

  @Public()
  @Post()
  create(@Body() createUserAdminDto: CreateUserAdminDto) {
    return this.usersAdminService.create(createUserAdminDto);
  }

  @Get()
  findAll() {
    return this.usersAdminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersAdminService.findOne(+id);
  }

  @Get('user/email')
  findOneByEmail(@Body('email') email: string) {
    return this.usersAdminService.getOneByEmail(email);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserAdminDto: UpdateUserAdminDto,
  ) {
    return this.usersAdminService.update(+id, updateUserAdminDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersAdminService.remove(+id);
  // }
}
