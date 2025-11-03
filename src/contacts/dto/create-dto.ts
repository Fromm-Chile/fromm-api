import { IsString, IsNumber, IsEmail, IsOptional } from 'class-validator';

export class CreateContactDto {
  @IsNumber()
  readonly userId: number;

  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly phone?: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly company?: string;

  @IsString()
  @IsOptional()
  readonly rucPeru?: string;

  @IsString()
  readonly equipment?: string;

  @IsString()
  readonly contactType?: string;

  @IsString()
  readonly message: string;
}
