export class CreateInvoiceHistoryDto {
  invoiceId: number;
  adminUserId: number;
  status: string;
  comment?: string;
  createdAt?: Date;
}
