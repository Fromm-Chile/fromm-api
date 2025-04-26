import { Injectable, UseGuards } from '@nestjs/common';
import { CreateUserAdminDto } from '../controllers/dto/create-userAdmin.dto';
import { UpdateUserAdminDto } from '../controllers/dto/update-userAdmin.dto';
import { UsersAdminRepository } from '../repositories/usersAdmin.repository';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

@UseGuards(LocalAuthGuard)
@Injectable()
export class UsersAdminService {
  constructor(private usersAdminRepository: UsersAdminRepository) {}

  create(createUserAdminDto: CreateUserAdminDto) {
    return this.usersAdminRepository.create(createUserAdminDto);
  }

  findAll() {
    return this.usersAdminRepository.findAll();
  }

  findOne(id: number) {
    return this.usersAdminRepository.findOne(id);
  }

  getOneByEmail(email: string) {
    return this.usersAdminRepository.findOneByEmail(email);
  }

  update(id: number, updateUserAdminDto: UpdateUserAdminDto) {
    return this.usersAdminRepository.update(id, updateUserAdminDto);
  }

  // remove(id: number) {
  //   return this.usersAdminRepository.remove(id);
  // }
}
