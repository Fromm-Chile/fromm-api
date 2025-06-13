import { Exclude, Expose, Transform } from 'class-transformer';

export class GetInvoicesResponseDto {
  constructor(partial: Partial<GetInvoicesResponseDto>) {
    Object.assign(this, partial);
  }
  @Expose()
  id: number;

  @Expose()
  @Transform(({ obj }) => obj.user?.name)
  name: string;

  @Expose()
  @Transform(({ obj }) => obj.user?.company)
  company: string;

  @Expose()
  @Transform(({ obj }) => obj.statusR?.name)
  status: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Transform(({ obj }) => obj.user?.email)
  email: string;
}
