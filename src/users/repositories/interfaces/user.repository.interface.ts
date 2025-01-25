import { users } from '@prisma/client';
import { CreateUserDto } from '../../controllers/dto/create-user.dto';
import { UpdateUserDto } from '../../controllers/dto/update-user.dto';

export interface IUserRepository {
  create(createUserDto: CreateUserDto): Promise<users>;
  findAll(): Promise<users[]>;
  findOne(id: number): string;
  update(id: number, updateUserDto: UpdateUserDto): string;
  remove(id: number): string;
}
