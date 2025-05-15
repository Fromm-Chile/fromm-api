import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersAdminService } from '../services/usersAdmin.service';
import { CreateUserAdminDto } from './dto/create-userAdmin.dto';
import { UpdateUserAdminDto } from './dto/update-userAdmin.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('users-admin')
export class UsersAdminController {
  constructor(private readonly usersAdminService: UsersAdminService) {}

  @Post()
  create(@Body() createUserAdminDto: CreateUserAdminDto) {
    return this.usersAdminService.create(createUserAdminDto);
  }

  @Get()
  findAll(@Req() req: any) {
    const userId = req.user.sub;
    return this.usersAdminService.findAll(userId);
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
    @Param('id') id: number,
    @Body() updateUserAdminDto: UpdateUserAdminDto,
  ) {
    return this.usersAdminService.update(+id, updateUserAdminDto);
  }

  @Patch('enable/:id')
  enableOrDisable(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.usersAdminService.enableOrDisable(+id, isActive);
  }
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersAdminService.remove(+id);
  // }
}
