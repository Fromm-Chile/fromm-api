import { CreateUserDto } from '../../controllers/dto/create-user.dto';
import { UpdateUserDto } from '../../controllers/dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  create(createUserDto: CreateUserDto): string;
  findAll(): UserEntity[];
  findOne(id: number): string;
  update(id: number, updateUserDto: UpdateUserDto): string;
  remove(id: number): string;
}