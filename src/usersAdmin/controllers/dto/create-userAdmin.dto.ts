export class CreateUserAdminDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly roleId: number;
}
