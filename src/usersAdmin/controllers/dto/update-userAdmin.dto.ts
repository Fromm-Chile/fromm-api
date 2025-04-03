import { PartialType } from '@nestjs/mapped-types';
import { CreateUserAdminDto } from './create-userAdmin.dto';

export class UpdateUserAdminDto extends PartialType(CreateUserAdminDto) {}
