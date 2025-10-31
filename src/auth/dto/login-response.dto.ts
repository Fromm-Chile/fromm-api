import { IsEmail, IsNumber, IsString } from 'class-validator';

export class LoginResponseDto {
  @IsString()
  access_token: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  isActive: boolean;

  @IsNumber()
  roleId: number;
}
