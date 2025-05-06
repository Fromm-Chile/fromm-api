import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(AuthGuard)
@Controller('admin/users')
export class UsersAdminController {
  constructor(private usersService: UsersService) {}

  @Roles('AdminChile', 'AdminPeru', 'UserChile', 'UserPeru')
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

  @Roles('AdminChile', 'AdminPeru', 'UserChile', 'UserPeru')
  @Get('email')
  findManyByEmail(
    @Query('email') email: string,
    @Query('countryCode') code: string,
  ) {
    return this.usersService.findManyByEmail({ email, code });
  }
}
