import { Controller, Req, Post, UseGuards, Body } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { AuthService } from '../service/auth.service';
import { LoginResponseDto } from '../dto/login-response.dto';
import { LoginDto } from '../dto/login.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';

@UseGuards(LocalAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Req() req: any): Promise<LoginResponseDto> {
    return this.authService.loginToken(req.user);
  }

  @Post('verify')
  async verifyToken(@Body() body: LoginDto): Promise<any> {
    const { email, password } = body;
    return this.authService.validateUser(email, password);
  }
}
