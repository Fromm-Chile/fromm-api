import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Query,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.loginToken(req.user);
  }

  @Post('verify')
  async verifyToken(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    console.log(email);
    return this.authService.validateUser(email, password);
  }

  // @Post('confirm-account')
  // async confirmAccount(@Body() user: User) {
  //   return this.authService.signUp(user);
  // }

  // @Post('reset')
  // async resetToken(@Body('email') email: string) {
  //   return this.authService.resetTokenAndEmail(email);
  // }

  // @Put('new-password')
  // async createNewPassword(
  //   @Body('password') password: string,
  //   @Query('resetToken') resetToken: string,
  // ) {
  //   return await this.authService.resetPassword(password, resetToken);
  // }
}
