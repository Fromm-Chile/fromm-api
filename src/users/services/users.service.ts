import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../controllers/dto/create-user.dto';
import { UpdateUserDto } from '../controllers/dto/update-user.dto';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  create(createUserDto: CreateUserDto) {
    return `This action adds a new user`;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a user with id ${id}`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a user with id ${id}`;
  }

  remove(id: number) {
    return `This action removes a user with id ${id}`;
  }
}
