import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../controllers/dto/update-user.dto';
import { IUserRepository } from './interfaces/user.repository.interface';
import { PrismaService } from 'prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { FilterUserDto } from '../controllers/dto/filter-user.dto';

@Injectable()
export class UsersRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company,
        country: user.country,
      },
    });
  }

  async findAll(code: string): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: {
        country: {
          code,
        },
      },
    });
  }

  async findOneByEmail(email: string, countryId: number) {
    return await this.prisma.user.findFirst({
      where: { email, countryId },
    });
  }

  async findManyByEmail(filter: FilterUserDto) {
    return await this.prisma.user.findMany({
      where: {
        email: {
          contains: filter.email,
        },
        country: {
          code: filter.countryCode,
        },
      },
      take: 5,
      skip: 0,
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
