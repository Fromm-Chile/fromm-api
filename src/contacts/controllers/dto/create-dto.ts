export class CreateContactDto {
  readonly userId: number;
  readonly name: string;
  readonly phone?: string;
  readonly email: string;
  readonly company?: string;
  readonly equipment?: string;
  readonly contactType?: string;
  readonly message: string;
}
