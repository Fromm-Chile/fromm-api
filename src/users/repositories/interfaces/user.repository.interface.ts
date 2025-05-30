import { User } from '@prisma/client';
import { CreateUserDto } from '../../controllers/dto/create-user.dto';
import { UpdateUserDto } from '../../controllers/dto/update-user.dto';

export class CreateUserByCountryDto extends CreateUserDto {
  countryId: number;
}
export interface IUserRepository {
  create(createUserDto: CreateUserDto): Promise<User>;
  findAll(code: string): Promise<User[]>;
  update(id: number, updateUserDto: UpdateUserDto): string;
  remove(id: number): string;
}
