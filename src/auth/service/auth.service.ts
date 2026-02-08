import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserAdmin } from '@prisma/client';
import { UsersAdminService } from 'src/usersAdmin/services/usersAdmin.service';
import { PayloadToken } from '../models/token.model';
import { LoginResponseDto } from '../dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersAdminService: UsersAdminService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersAdminService.getOneByEmail(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const { password, ...userData } = user;
        return userData;
      }
    }
    return null;
  }

  async loginToken(user: UserAdmin): Promise<LoginResponseDto> {
    const payload: PayloadToken = {
      role: user.roleId,
      sub: user.id,
    };
    const { name, email, isActive, roleId } = user;

    if (isActive === false) {
      throw new BadRequestException('Tu cuenta no esta activada');
    }
    return {
      access_token: this.jwtService.sign(payload),
      name,
      email,
      isActive,
      roleId,
    };
  }
}
