import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../controllers/dto/create-user.dto';
import { UpdateUserDto } from '../controllers/dto/update-user.dto';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserByCountryDto } from '../repositories/interfaces/user.repository.interface';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  create(createUserDto: CreateUserByCountryDto) {
    return this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      country: {
        connect: {
          id: createUserDto.countryId,
        },
      },
    });
  }

  async getUsers() {
    return await this.userRepository.findAll();
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
