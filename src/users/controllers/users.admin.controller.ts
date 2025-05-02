import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('admin/users')
export class UsersAdminController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers(
    @Query('countryCode') code: string,
    @Query('page') page: number,
    @Query('name') name: string,
    @Query('limit') limit: number,
    @Query('idOrder') idOrder: string,
  ) {
    return this.usersService.getUsersAdmin({
      code,
      page,
      name,
      limit,
      idOrder,
    });
  }

  @Get('email')
  findManyByEmail(
    @Query('email') email: string,
    @Query('countryCode') code: string,
  ) {
    return this.usersService.findManyByEmail({ email, code });
  }
}
