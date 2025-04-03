import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './emails.service';
import { SendEmailDto } from './dto/emails.dto';
import { Country } from 'src/assets/enums';

@Controller('pe/email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendMail(@Body() dto: SendEmailDto) {
    await this.emailService.sendEmail(dto, Country.PE);
    return { message: 'Email sent successfully' };
  }
}
