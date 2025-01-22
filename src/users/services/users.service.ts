import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../controllers/dto/create-user.dto';
import { UpdateUserDto } from '../controllers/dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.users.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        phone: createUserDto.phone,
      },
    });
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
