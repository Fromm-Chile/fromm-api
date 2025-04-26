import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserAdminDto } from '../controllers/dto/create-userAdmin.dto';
import { UpdateUserAdminDto } from '../controllers/dto/update-userAdmin.dto';
import { IUserAdminRepository } from './interfaces/userAdmin.repository.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersAdminRepository implements IUserAdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserAdminDto: CreateUserAdminDto) {
    return await this.prisma.userAdmin.create({
      data: {
        ...createUserAdminDto,
        password: await bcrypt.hash(createUserAdminDto.password, 10),
      },
    });
  }

  async findAll() {
    return await this.prisma.userAdmin.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.userAdmin.findUnique({
      where: { id },
    });
  }

  async findOneByEmail(email: string) {
    return await this.prisma.userAdmin.findUnique({
      where: { email },
    });
  }

  async update(id: number, updateUserAdminDto: UpdateUserAdminDto) {
    return await this.prisma.userAdmin.update({
      where: { id },
      data: updateUserAdminDto,
    });
  }

  // async remove(id: number) {
  //   return await this.prisma.userAdmin.delete({
  //     where: { id },
  //   });
  // }
}
