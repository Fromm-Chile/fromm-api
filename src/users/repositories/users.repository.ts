import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../controllers/dto/update-user.dto';
import { IUserRepository } from './interfaces/user.repository.interface';
import { PrismaService } from 'prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

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

  async findAll() {
    return await this.prisma.user.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  findOneByEmail(email: string, countryId: number) {
    return this.prisma.user.findFirst({
      where: { email, countryId },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
