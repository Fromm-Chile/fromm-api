import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
// import { EmailService } from 'src/emails/emails.service';
import { UserAdmin } from '@prisma/client';
import { UsersAdminService } from 'src/usersAdmin/services/usersAdmin.service';

@Injectable()
export class AuthService {
  constructor(
    private usersAdminService: UsersAdminService,
    private jwtService: JwtService,
    // private emailsService: EmailService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersAdminService.getOneByEmail(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return user;
      }
    }
    return null;
  }

  async loginToken(user: UserAdmin) {
    const payload: { role: number; sub: number } = {
      role: user.roleId,
      sub: user.id,
    };
    const { name, email, isActive } = user;

    if (isActive === false) {
      throw new BadRequestException('Tu cuenta no esta activada');
    }
    return {
      access_token: this.jwtService.sign(payload),
      name,
      email,
    };
  }

  // async signUp(user: CreateUserDto) {
  //   const existingUser = await this.usersService.getUserByEmail(user.email);

  //   if (existingUser) {
  //     throw new BadRequestException('El correo ya existe');
  //   }

  //   const { email, name } = await this.usersService.createUser(user);

  //   const payload = { email, name };
  //   const token = this.jwtService.sign(payload);

  //   await this.emailsService.sendConfirmationEmail(
  //     {
  //       email,
  //       name,
  //     },
  //     token,
  //   );
  // }

  // async resetTokenAndEmail(email: string): Promise<string> {
  //   const payload = { email };
  //   const resetToken = this.jwtService.sign(payload);

  //   await this.emailsService.sendRestorePasswordEmail(email, resetToken);

  //   return resetToken;
  // }

  // async resetPassword(password: string, resetToken: string) {
  //   const { email } = await this.jwtService.verifyAsync(resetToken);

  //   const hashPassword = await bcrypt.hash(password, 10);

  //   const user = await this.usersService.getUserByEmail(email);

  //   user.password = hashPassword;

  //   return user.save();
  // }
}
