import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../controllers/dto/create-user.dto';
import { UpdateUserDto } from '../controllers/dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { IUserRepository } from './interfaces/user.repository.interface';

@Injectable()
export class UsersRepository implements IUserRepository {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll(): UserEntity[] {
    return [];
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}