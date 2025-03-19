import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../controllers/dto/create-user.dto';
import { UpdateUserDto } from '../controllers/dto/update-user.dto';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a user with id ${id}`;
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneByEmail(email);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a user with id ${id}`;
  }

  remove(id: number) {
    return `This action removes a user with id ${id}`;
  }
}
