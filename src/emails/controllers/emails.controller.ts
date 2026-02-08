import { Body, Controller, Post } from '@nestjs/common';
import { Country } from 'src/assets/enums';
import { EmailService } from '../services/emails.service';
import { SendEmailDto } from '../dto/send-emails.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendMail(@Body() dto: SendEmailDto) {
    await this.emailService.sendEmail({ ...dto, countryId: Country.CL });
    return { message: 'Email sent successfully' };
  }
}
