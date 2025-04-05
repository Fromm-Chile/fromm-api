import { UserAdmin } from '@prisma/client';
import { CreateUserAdminDto } from 'src/usersAdmin/controllers/dto/create-userAdmin.dto';
import { UpdateUserAdminDto } from 'src/usersAdmin/controllers/dto/update-userAdmin.dto';

export interface IUserAdminRepository {
  create(createUserDto: CreateUserAdminDto): Promise<UserAdmin>;
  findAll(): Promise<UserAdmin[]>;
  findOne(id: number): Promise<UserAdmin>;
  update(id: number, updateUserDto: UpdateUserAdminDto): Promise<UserAdmin>;
  findOneByEmail(email: string): Promise<UserAdmin>;
  // remove(id: number): string;
}
