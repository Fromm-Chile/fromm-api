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
        role: {
          connect: {
            name: createUserAdminDto.role,
          },
        },
      },
    });
  }

  async findAll() {
    return await this.prisma.userAdmin.findMany({
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.userAdmin.findUnique({
      where: { id },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
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
      data: {
        ...updateUserAdminDto,
        password: await bcrypt.hash(updateUserAdminDto.password, 10),
        role: {
          connect: {
            name: updateUserAdminDto.role,
          },
        },
        updatedAt: new Date(),
      },
    });
  }

  async enableUser(id: number, isActive: boolean) {
    return await this.prisma.userAdmin.update({
      where: { id },
      data: {
        isActive,
        updatedAt: new Date(),
      },
    });
  }
  // async remove(id: number) {
  //   return await this.prisma.userAdmin.delete({
  //     where: { id },
  //   });
  // }
}
