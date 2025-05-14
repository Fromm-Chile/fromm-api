import { Injectable } from '@nestjs/common';
import { CreateUserAdminDto } from '../controllers/dto/create-userAdmin.dto';
import { UpdateUserAdminDto } from '../controllers/dto/update-userAdmin.dto';
import { UsersAdminRepository } from '../repositories/usersAdmin.repository';

@Injectable()
export class UsersAdminService {
  constructor(private usersAdminRepository: UsersAdminRepository) {}

  create(createUserAdminDto: CreateUserAdminDto) {
    return this.usersAdminRepository.create(createUserAdminDto);
  }

  async findAll(userId: number) {
    const adminUsers = await this.usersAdminRepository.findAll();
    const filterUsers = adminUsers.filter((user) => user.id !== userId);
    return filterUsers;
  }

  async findOne(id: number) {
    return await this.usersAdminRepository.findOne(id);
  }

  async getOneByEmail(email: string) {
    return await this.usersAdminRepository.findOneByEmail(email);
  }

  async update(id: number, updateUserAdminDto: UpdateUserAdminDto) {
    return await this.usersAdminRepository.update(id, updateUserAdminDto);
  }

  async enableOrDisable(id: number, isActive: boolean) {
    return await this.usersAdminRepository.enableUser(id, isActive);
  }

  // remove(id: number) {
  //   return this.usersAdminRepository.remove(id);
  // }
}
