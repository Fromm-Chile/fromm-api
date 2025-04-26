import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../controllers/dto/update-user.dto';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserByCountryDto } from '../repositories/interfaces/user.repository.interface';
import { FilterUserDto } from '../controllers/dto/filter-user.dto';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  create(createUserDto: CreateUserByCountryDto) {
    return this.userRepository.create({
      ...createUserDto,
      country: {
        connect: {
          id: createUserDto.countryId,
        },
      },
    });
  }

  async getUsers(countryCode: string) {
    return await this.userRepository.findAll(countryCode);
  }

  findOne(id: number) {
    return `This action returns a user with id ${id}`;
  }

  async findOneByEmail(email: string, countryId: number) {
    return await this.userRepository.findOneByEmail(email, countryId);
  }

  async findManyByEmail(filter: FilterUserDto) {
    return await this.userRepository.findManyByEmail(filter);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a user with id ${id}`;
  }

  remove(id: number) {
    return `This action removes a user with id ${id}`;
  }
}
