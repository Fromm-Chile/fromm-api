import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailController } from './controllers/emails.controller';
import { EmailService } from './services/emails.service';
import { EmailControllerPeru } from './controllers/emails.pe.controller';

@Module({
  imports: [ConfigModule],
  controllers: [EmailController, EmailControllerPeru],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
