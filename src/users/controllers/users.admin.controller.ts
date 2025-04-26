import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('admin/users')
export class UsersAdminController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers(@Query('countryCode') countryCode: string) {
    return this.usersService.getUsers(countryCode);
  }

  @Get('email')
  findManyByEmail(
    @Query('email') email: string,
    @Query('countryCode') countryCode: string,
  ) {
    return this.usersService.findManyByEmail({ email, countryCode });
  }
}
