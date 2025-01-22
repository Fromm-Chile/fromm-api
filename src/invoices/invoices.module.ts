import { Module } from "@nestjs/common";
import { InvoicesService } from "./services/invoices.service";
import { InvoicesRepository } from "./repositories/invoices.repository";
import { InvoicesController } from "./controllers/invoices.controller";

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService, InvoicesRepository],
})
export class InvoicesModule {}