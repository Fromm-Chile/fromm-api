import { IsString, IsNumber, IsEmail, IsOptional } from 'class-validator';

export class CreateContactDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly phone?: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly company: string;

  @IsString()
  @IsOptional()
  readonly rucPeru?: string;

  @IsString()
  @IsOptional()
  readonly equipment?: string;

  @IsString()
  readonly contactType?: string;

  @IsString()
  readonly message: string;
}
