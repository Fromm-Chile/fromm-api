export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly phone?: string;
  readonly company?: string;
  readonly rucPeru?: string;
  readonly address?: string;
}
